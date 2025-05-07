import { useTranslations } from "next-intl";
import { addSlash } from "@applocale/functions/functions";

export const useMySuffix = (key: string = "news") => {
    const tsuffixes = useTranslations("others.suffixes");
    const tsuffixesval = addSlash(tsuffixes(key));
    return tsuffixesval ?? `/pages/${key}`; 
};
