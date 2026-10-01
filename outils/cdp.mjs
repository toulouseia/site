// Pilote Chrome minimal via le Chrome DevTools Protocol.
// Zéro dépendance npm : Node 22 fournit WebSocket en global.
// Ne pas modifier.

import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME_CANDIDATES = [
  process.env.CHROME_BIN,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/snap/bin/chromium',
].filter(Boolean);

import { existsSync } from 'node:fs';

export function resolveChrome() {
  for (const bin of CHROME_CANDIDATES) if (existsSync(bin)) return bin;
  throw new Error('Aucun binaire Chrome trouvé. Renseigne CHROME_BIN.');
}

export async function launch({ width = 1280, height = 800, scale = 1 } = {}) {
  const profile = await mkdtemp(join(tmpdir(), 'n7-cdp-'));
  const bin = resolveChrome();
  const child = spawn(bin, [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--disable-background-networking',
    '--hide-scrollbars',
    '--force-color-profile=srgb',
    '--font-render-hinting=none',
    '--allow-file-access-from-files',
    `--window-size=${width},${height}`,
    'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  const wsUrl = await new Promise((resolve, reject) => {
    let buf = '';
    const timer = setTimeout(() => reject(new Error('Chrome n\'a pas démarré (timeout 20 s)')), 20000);
    child.stderr.on('data', (d) => {
      buf += d.toString();
      const m = buf.match(/ws:\/\/[^\s]+/);
      if (m) { clearTimeout(timer); resolve(m[0]); }
    });
    child.on('exit', (code) => { clearTimeout(timer); reject(new Error(`Chrome a quitté (code ${code})\n${buf}`)); });
  });

  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = (e) => rej(new Error('WebSocket CDP: ' + e.message)); });

  let nextId = 1;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(`${msg.error.message} (${JSON.stringify(msg.error.data ?? '')})`));
      else resolve(msg.result);
    }
  };

  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

  const page = {
    send: (method, params) => send(method, params, sessionId),

    async goto(url) {
      await page.send('Page.enable');
      const loaded = new Promise((resolve) => {
        const h = (ev) => {
          const msg = JSON.parse(ev.data);
          if (msg.sessionId === sessionId && msg.method === 'Page.loadEventFired') {
            ws.removeEventListener('message', h);
            resolve();
          }
        };
        ws.addEventListener('message', h);
      });
      await page.send('Page.navigate', { url });
      await loaded;
    },

    async viewport(w, h, s = 1) {
      await page.send('Emulation.setDeviceMetricsOverride', {
        width: w, height: h, deviceScaleFactor: s, mobile: false,
      });
    },

    async eval(expression, { awaitPromise = true } = {}) {
      const r = await page.send('Runtime.evaluate', {
        expression, awaitPromise, returnByValue: true,
      });
      if (r.exceptionDetails) {
        throw new Error('JS: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
      }
      return r.result.value;
    },

    async shot({ clip, beyondViewport = true } = {}) {
      const r = await page.send('Page.captureScreenshot', {
        format: 'png',
        ...(clip ? { clip: { ...clip, scale: clip.scale ?? 1 } } : {}),
        captureBeyondViewport: beyondViewport,
        optimizeForSpeed: false,
      });
      return Buffer.from(r.data, 'base64');
    },
  };

  await page.send('Runtime.enable');

  return {
    page,
    async close() {
      try { ws.close(); } catch { /* ignore */ }
      child.kill('SIGKILL');
      await rm(profile, { recursive: true, force: true }).catch(() => {});
    },
  };
}
