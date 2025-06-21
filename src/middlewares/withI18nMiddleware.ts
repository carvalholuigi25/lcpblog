// middlewares/withI18nMiddleware.ts
import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { routing } from '../app/i18n/routing';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import { CustomMiddleware } from './chain';
import Negotiator from 'negotiator';
import { getDefLocale } from '@/app/[locale]/helpers/defLocale';

function getLocale(request: NextRequest): string | undefined {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const locales: string[] = routing.locales;
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

    const locale = matchLocale(languages, locales, routing.defaultLocale);
    return locale;
}


export function withI18nMiddleware(middleware: CustomMiddleware) {
    return async (
        request: NextRequest,
        event: NextFetchEvent,
        response: NextResponse
    ) => {
        const pathname = request.nextUrl.pathname;
        const pathnameIsMissingLocale = routing.locales.every(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (locale: any) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
        );

        if (pathnameIsMissingLocale) {
            const locale = getLocale(request) ?? getDefLocale();
            const redirectURL = request.nextUrl;

            if (locale) {
                redirectURL.pathname = `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
            }

            redirectURL.search = request.nextUrl.search;

            return NextResponse.redirect(redirectURL);
        }

        return middleware(request, event, response);
    };
}