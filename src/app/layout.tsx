import type { Metadata } from "next";
import { Poppins, Roboto, Orbitron } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { getLangDir } from "rtl-detect";
import { getDefLocale } from "@applocale/helpers/defLocale";
import Dependencies from "@applocale/dependencies/dependencies";
import * as config from "@applocale/utils/config";
import "@applocale/globals.scss";
import { headers } from "next/headers";

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
  const themeCl = (await config.getConfig()).theme;
  const effects3DCl = (await config.getConfig()).is3DEffectsEnabled ? "effects3D" : "";
  const headerList = headers();
  const pathname = (await headerList).get("x-current-path");

  const stuffconfig = `${themeCl} ${effects3DCl}`;
  const fonts = `${poppins.variable} ${roboto.variable} ${orbitron.variable}`;
  const dir = getLangDir(locale) ?? "ltr";
  const fixedCl = !["auth/login", "auth/register", "auth/forgot-password"].includes(pathname!) ? "fixed" : "";

  return (
    <html lang={locale} dir={dir} data-bs-theme="system" suppressHydrationWarning={true}>
      <body className={`${fonts} ${stuffconfig} ${fixedCl} mybkgpage`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="modal-root" id="modal-root"></div>
          <div id="toast-root"></div>
          {children}
          <Dependencies />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
