import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { getPathsLocales } from './i18n/locales';
 
export default createMiddleware(routing);
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/('+getPathsLocales()+')/:path*']
};