import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default getRequestConfig(async ({requestLocale}: any) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    messages: (await import(`@assets/locales/${locale}.json`)).default
  };
});