import type { Metadata } from "next";
import { Poppins, Roboto, Orbitron } from "next/font/google";
import Frameworks from "./[locale]/frameworks/frameworks";
import "@applocale/globals.scss";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
  weight: ['100', '300', '400', '500', '700', '900']
});

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
  weight: ['400', '500', '700']
});

export const metadata: Metadata = {
  title: "LCP Blog",
  description: "Created by Luis Carvalho @2025 - LCP",
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={"en"} dir={"ltr"} data-bs-theme="system" suppressHydrationWarning={true}>
      <body className={`${poppins.variable} ${roboto.variable} ${orbitron.variable} mybkgpage`}>
        <div id="modal-root"></div>
        {children}
        <Frameworks />
      </body>
    </html>
  );
}
