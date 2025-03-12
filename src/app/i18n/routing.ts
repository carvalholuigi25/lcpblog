import {defineRouting} from 'next-intl/routing';
import { getValuesLocales } from './locales';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: getValuesLocales(),
  // Used when no locale matches
  defaultLocale: 'en-UK',
  localePrefix: {
    mode: 'as-needed'
  },
});