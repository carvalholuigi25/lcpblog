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
import { withMyHeaders } from '@/middlewares/withMyHeaders';

export default chain([withI18nMiddleware, withMyHeaders]);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/',
    '/((?!api|trpc|_next|_vercel|favicon.ico|images|.*\\..*).*)',
    '/(en|pt|fr|en-UK|pt-PT|fr-FR)/:path*',
  ],
};