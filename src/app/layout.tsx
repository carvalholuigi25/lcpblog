import type { Metadata } from "next";
import { Poppins, Roboto, Orbitron } from "next/font/google";
import Frameworks from "./[locale]/frameworks/frameworks";
import "@applocale/globals.scss";
import { NextIntlClientProvider } from "next-intl";
import { getDefLocale } from "./[locale]/helpers/defLocale";
import { getMessages } from "next-intl/server";

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
  const messages = await getMessages({ locale: getDefLocale() });

  return (
    <html lang={"en"} dir={"ltr"} data-bs-theme="system" suppressHydrationWarning={true}>
      <body className={`${poppins.variable} ${roboto.variable} ${orbitron.variable} mybkgpage`}>
        <NextIntlClientProvider locale={getDefLocale()} messages={messages}>
          <div id="modal-root"></div>
          {children}
          <Frameworks />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
