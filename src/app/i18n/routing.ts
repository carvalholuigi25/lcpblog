import { defineRouting } from 'next-intl/routing';
import { getValuesLocales } from './locales';
import * as config from "@applocale/utils/config";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: getValuesLocales(),
  // Used when no locale matches
  defaultLocale: config.getConfigSync().language ?? "pt-PT",
  localePrefix: {
    mode: 'as-needed'
  },
});