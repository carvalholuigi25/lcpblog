import type { Metadata } from "next";
import { Orbitron, Poppins, Roboto } from "next/font/google";
import { ThemeProvider } from "./components/context/themecontext";
import Frameworks from "@/app/frameworks/frameworks";
import "@/app/globals.scss";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-bs-theme="system">
      <body className={`${poppins.variable} ${roboto.variable} ${orbitron.variable} mybkgpage`}>
        <div id="modal-root"></div>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Frameworks />
      </body>
    </html>
  );
}
