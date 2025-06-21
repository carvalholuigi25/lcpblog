import { defineRouting } from 'next-intl/routing';
import { getValuesLocales } from './locales';
import { getDefLocale } from '../[locale]/helpers/defLocale';

export const routing = defineRouting({
  locales: getValuesLocales(),
  defaultLocale: getDefLocale(),
  localePrefix: {
    mode: 'as-needed'
  }
});