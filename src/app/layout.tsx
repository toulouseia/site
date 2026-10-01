import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Archivo, la fonte de l'identité de l'association. Variable : toutes les graisses de
// 100 à 900 et toutes les largeurs de 62 à 125 sont dans ce seul fichier.
// Les deux plages sont déclarées explicitement dans la règle @font-face —
// sans elles le navigateur traite la fonte comme une graisse unique et
// fabrique de faux gras, et l'axe de largeur reste inaccessible. Cette
// application s'en sert partout : c'est l'axe wdth qui donne aux étiquettes
// leur resserrement et aux cotes leur étroitesse.
const archivo = localFont({
  src: "../fonts/Archivo.ttf",
  variable: "--font-archivo",
  display: "swap",
  weight: "100 900",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const metadata: Metadata = {
  title: "Toulouse IA",
  description:
    "Les projets de la communauté d'intelligence artificielle de Toulouse : ce qui se fabrique, et où il reste de la place.",
  applicationName: "Toulouse IA",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${archivo.variable} h-full antialiased`}>
      <body className="font-archivo min-h-full">{children}</body>
    </html>
  );
}
