import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OenoClass - Plateforme pédagogique en oenologie",
  description:
    "Découvrez l'univers du vin avec Énoclass, la plateforme interactive pour l'enseignement de l'oenologie dans les lycées agricoles.",
  keywords: [
    "oenologie",
    "vin",
    "éducation",
    "lycée agricole",
    "dégustation",
    "viticulture",
  ],
  authors: [{ name: "Enoclass" }],
  icons: {
    icon: "/images/logo/favicon_enoclass.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${cormorant.variable} ${poppins.variable} font-poppins antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-[var(--bordeaux)] focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
