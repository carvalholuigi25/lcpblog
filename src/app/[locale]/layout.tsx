import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { routing } from "@/app/i18n/routing";
import { ThemeProvider } from "@applocale/components/ui/context/themecontext";
import { LanguageProvider } from "@applocale/components/ui/context/languagecontext";
import { getDefLocale } from "@applocale/helpers/defLocale";

export const metadata: Metadata = {
  title: "LCP Blog",
  description: "Created by Luis Carvalho @2025 - LCP",
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  
  const alocale = locale ?? getDefLocale();
  const messages = await getMessages({ locale: alocale });

  return (
    <NextIntlClientProvider locale={alocale} messages={messages}>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}