import { defineRouting } from 'next-intl/routing';
import { getValuesLocales } from './locales';
import { getDefLocale } from '../[locale]/helpers/defLocale';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: getValuesLocales(),
  // Used when no locale matches
  defaultLocale: getDefLocale(),
  localePrefix: {
    mode: 'as-needed'
  }
});