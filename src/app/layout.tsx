import "@applocale/globals.scss";
import type { Metadata } from "next";
import { Poppins, Roboto, Orbitron } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { headers } from "next/headers";
import { getLangDir } from "rtl-detect";
import { getDefLocale } from "@applocale/helpers/defLocale";
import Dependencies from "@applocale/dependencies/dependencies";
import * as config from "@applocale/utils/config";

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

const getPadPagCl = (pathname: string) => {
  return pathname && pathname.includes("auth") ? "authp" : 
  pathname.includes("admin") ? "fixedadm" : 
  pathname.includes("pages") || pathname.includes("paginas") ? "pagesp" : "pt-1";
}

export const metadata: Metadata = {
  title: "LCP Blog",
  description: "Created by Luis Carvalho @2025 - LCP",
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const langdef = (await config.getConfig()).language;
  const themeCl = (await config.getConfig()).theme;
  const effects3DCl = (await config.getConfig()).is3DEffectsEnabled ? "effects3D" : "";
  const locale = await getLocale() ?? getDefLocale() ?? langdef;
  const messages = await getMessages({ locale: locale });
  const qheaders = await headers();
  const pathname = qheaders.get("x-current-path") || "";
  const dir = getLangDir(locale) ?? "ltr";
  const padpagCl = getPadPagCl(pathname);
  const fontsCl = `${poppins.variable} ${roboto.variable} ${orbitron.variable}`;
  const layoutCl = `${themeCl} ${effects3DCl} ${padpagCl}`;
  const bodyCl = `${fontsCl} ${layoutCl} mybkgpage`;

  return (
    <html lang={locale} dir={dir} data-bs-theme={themeCl ?? "system"} suppressHydrationWarning={true}>
      <body className={bodyCl}>
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
