import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import { cookies } from 'next/headers';
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default getRequestConfig(async ({requestLocale}: any) => {
  // // This typically corresponds to the `[locale]` segment
  // let locale = await requestLocale;
  let locale = (await cookies()).get("NEXT_LOCALE")?.value ?? await requestLocale;

  // Ensure that a valid locale is used
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const common = (await import(`@assets/locales/${locale}/common.json`)).default;
  const ui = (await import(`@assets/locales/${locale}/ui.json`)).default;
  const policies = (await import(`@assets/locales/${locale}/policies.json`)).default;

  return {
    locale,
    messages: {
      ...common,
      ...ui,
      ...policies
    }
  };
});