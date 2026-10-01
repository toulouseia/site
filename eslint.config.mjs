import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Les types de la plateforme Cloudflare : quinze mille lignes engendrées
    // par `npm run types`, qu'on ne relit pas et qu'on ne corrige pas.
    "worker-configuration.d.ts",
    // Le dossier de travail de `wrangler dev` : il contient le programme
    // assemblé, bibliothèques comprises, qu'on ne relit pas et qui n'est pas
    // versionné.
    ".wrangler/**",
  ]),
]);

export default eslintConfig;
