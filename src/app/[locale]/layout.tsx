import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@applocale/components/context/themecontext";
import { LanguageProvider } from "@applocale/components/context/languagecontext";
import { routing } from "@/app/i18n/routing";
import "@applocale/globals.scss";

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
  
  const messages = await getMessages({ locale: locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
