// import createMiddleware from 'next-intl/middleware';
// import { NextRequest, NextResponse } from 'next/server';
// import { getDefLocale } from '@applocale/helpers/defLocale';
// import { routing } from './app/i18n/routing';
// export default createMiddleware(routing);

// export default async function middleware(request: NextRequest) {
//     const defaultLocale = request.nextUrl.pathname.split('/')[1] ?? getDefLocale() ?? 'en-UK';
//     const handleI18nRouting = createMiddleware({...routing, defaultLocale});
//     const response = handleI18nRouting(request);
//     response.headers.set('x-locale', defaultLocale);

//     return NextResponse.next({
//       request: {
//         headers: response.headers,
//       },
//     });
// }

import { chain } from '@/middlewares/chain';
import { withI18nMiddleware } from '@/middlewares/withI18nMiddleware';
import { NextRequest, NextResponse } from 'next/server';
import { getDefLocale } from './app/[locale]/helpers/defLocale';

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);
  headers.set("x-current-href", request.nextUrl.href);
  headers.set("x-current-lang", getDefLocale());
  return NextResponse.next({
    request: {
      headers: headers,
    },
  });
}

export default chain([withI18nMiddleware]);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/',
    '/((?!api|trpc|_next|_vercel|favicon.ico|images|.*\\..*).*)',
    '/(en|pt|en-UK|pt-PT)/:path*',
  ],
};