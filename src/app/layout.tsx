import type { Metadata } from "next";
import { Poppins, Roboto, Orbitron } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { getDefLocale } from "@applocale/helpers/defLocale";
import Dependencies from "@applocale/dependencies/dependencies";
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
  const locale = await getLocale() ?? getDefLocale() ?? 'en-UK';
  const messages = await getMessages({ locale: locale });

  return (
    <html lang={locale} dir={"ltr"} data-bs-theme="system" suppressHydrationWarning={true}>
      <body className={`${poppins.variable} ${roboto.variable} ${orbitron.variable} mybkgpage`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div id="modal-root"></div>
          <div id="toast-root"></div>
          {children}
          <Dependencies />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
