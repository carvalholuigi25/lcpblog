import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// export default createMiddleware(routing);

export default async function middleware(request: NextRequest) {
    const defaultLocale = request.headers.get('x-locale') || 'en-UK';
    const handleI18nRouting = createMiddleware({...routing, defaultLocale});
    const response = handleI18nRouting(request);
    response.headers.set('x-locale', defaultLocale);
   
    return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/',
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    '/(en|pt|en-UK|pt-PT)/:path*',
  ]
};