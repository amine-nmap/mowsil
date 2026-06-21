import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async (ctx) => {
  const locale = ctx.locale ?? (await ctx.requestLocale) ?? routing.defaultLocale;
  if (!hasLocale(routing.locales, locale)) {
    return { locale: routing.defaultLocale, messages: {} };
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
