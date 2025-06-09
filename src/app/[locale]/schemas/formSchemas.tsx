import { z } from "zod";
import { useTranslations } from "next-intl";

export const useMySchemaRegStep1 = () => {
    const t = useTranslations("ui.forms.auth.register.step1.validation.errors");

    const fregstep1Schema = z.object({
        email: z.coerce.string().email({ message: t("lblinvemail") ?? "Invalid email" }),
        username: z.coerce.string().min(1, { message: t("lblrequsername") ?? "Username is required" }),
        displayname: z.coerce.string().min(1, { message: t("lblreqdisplayname") ?? "Display name (full name) is required" })
    });

    return fregstep1Schema;
}

export const useMySchemaRegStep2 = () => {
    const t = useTranslations("ui.forms.auth.register.step2.validation.errors");

    const fregstep2Schema = z.object({
        password: z.coerce.string().min(1, { message: t("lblreqpass") ?? "The password is required" }),
        passwordConfirm: z.coerce.string().min(1, { message: t("lblreqpassconf") ?? "The password confirmation is required" }),
        dateBirthday: z.coerce.date().min(new Date("1900-01-01"), { message: t("lbldbdayold") ?? "Too old!" }).max(new Date(), { message: t("lbldbdayoung") ?? "Too young!" })
    })
    .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
      message: t("lbldiffpass") ?? "Password doesn't match",
      path: ["passwordConfirm"]
    });

    return fregstep2Schema;
}

export const useMySchemaRegStep3 = () => {
    const t = useTranslations("ui.forms.auth.register.step3.validation.errors");

    const fregstep3Schema = z.object({
        termsandcond: z.boolean({ message: t("lblreqterms") ?? "You must to accept all terms and conditions." })
    });

    return fregstep3Schema;
}

export const useMySchemaLogin = () => {
    const t = useTranslations("ui.forms.auth.login.validation.errors");
    
    const floginSchema = z.object({
        email: z.coerce.string().email({ message: t("lblinvemail") ?? "Invalid email" }),
        password: z.coerce.string().min(1, { message: t("lblreqpassword") ?? "The password is required" }),
        type: z.coerce.string().optional(),
        modeTimer: z.coerce.string().optional(),
        valueTimer: z.coerce.date().optional()
    });

    return floginSchema;
}

export const useMySchemaSearch = () => {
    const t = useTranslations("ui.forms.search.validation.errors");

    const fsearchSchema = z.object({
        search: z.coerce.string().min(1, { message: t("lblreqsearch") ?? "Write something in the search bar!" })
    });
    
    return fsearchSchema;
}

export const useMySchemaNews = () => {
    const t = useTranslations("ui.forms.news.validation.errors");

    const fnewsSchema = z.object({
        title: z.coerce.string().min(1, { message: t("lblreqtitle") ?? "The title is required to be filled" }),
        content: z.coerce.string().min(1, { message: t("lblreqcontent") ?? "The content is required to be filled" }),
        image: z.coerce.string().optional(),
        slug: z.coerce.string().optional(),
        status: z.coerce.string().optional(),
        categoryId: z.coerce.number().optional(),
        userId: z.coerce.number().optional(),
        tags: z.array(z.coerce.string()).optional()
    });
    
    return fnewsSchema;
}

export const useMySchemaTags = () => {
    const t = useTranslations("ui.forms.tags.validation.errors");

    const ftagsSchema = z.object({
        name: z.coerce.string().min(1, { message: t("lblreqname") ?? "The name of tag is required to be filled" }),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
        status: z.coerce.string().optional()
    });
    
    return ftagsSchema;
}

export const useMySchemaCategories = () => {
    const t = useTranslations("ui.forms.categories.validation.errors");

    const fcategoriesSchema = z.object({
        name: z.coerce.string().min(1, { message: t("lblreqname") ?? "The name is required to be filled" }),
        slug: z.coerce.string().optional(),
        status: z.coerce.string().optional()
    });

    return fcategoriesSchema;
}

export const useMySchemaUsers = () => {
    const t = useTranslations("ui.forms.users.validation.errors");

    const fusersSchema = z.object({
        userId: z.coerce.number().optional(),
        username: z.coerce.string().min(1, { message: t("lblrequsername") ?? "The username is required to be filled" }),
        password: z.coerce.string().min(1, { message: t("lblreqpassword") ?? "The password is required to be filled" }),
        email: z.coerce.string().email({ message: t("lblreqemail") ?? "The email is required to be filled" }),
        displayName: z.coerce.string().min(1, { message: t("lblreqdisplayname") ?? "The display name (full name) is required to be filled" }),
        avatar: z.coerce.string().optional(),
        cover: z.coerce.string().optional(),
        about: z.coerce.string().optional(),
        role: z.coerce.string().optional(),
        privacy: z.coerce.string().optional(),
        userInfoId: z.coerce.number().optional()
    });

    return fusersSchema;
}

export const useMySchemaCommits = () => {
    const t = useTranslations("ui.forms.commits.validation.errors");

    const fcommitsSchema = z.object({
        owner: z.coerce.string().min(1, { message: t("lblreqowner") ?? "The owner name is required to be filled" }),
        repository: z.coerce.string().min(1, { message: t("lblreqrepo") ?? "The repository name is required to be filled" }),
        branchname: z.coerce.string().optional()
    });

    return fcommitsSchema;
}

export const useMySchemaComments = () => {
    const t = useTranslations("ui.forms.comments.validation.errors");

    const fcommentsSchema = z.object({
        content: z.coerce.string().min(1, { message: t("lblphcontent") ?? "Write here your comment" }),
        status: z.coerce.string().optional(),
        userId: z.coerce.number().optional(),
        postId: z.coerce.number().optional(),
        categoryId: z.coerce.number().optional()
    });

    return fcommentsSchema;
}

export const useMySchemaSettings = () => {
    const t = useTranslations("ui.forms.settings.validation.errors");

    const fconfigSchema = z.object({
        theme: z.coerce.string().min(1, { message: t("lblsettingtheme") ?? "Please write here the theme name (e.g: glassmorphism)"}),
        language: z.coerce.string().optional(),
        isBordered: z.coerce.boolean().optional(),
        is3DEffectsEnabled: z.coerce.boolean().optional(),
        isAutoSaveEnabled: z.coerce.boolean().optional()
    });

    return fconfigSchema;
}

export type TFormRegDataStep1 = z.infer<ReturnType<typeof useMySchemaRegStep1>>;
export type TFormRegDataStep2 = z.infer<ReturnType<typeof useMySchemaRegStep2>>;
export type TFormRegDataStep3 = z.infer<ReturnType<typeof useMySchemaRegStep3>>;
export type TFormLogData = z.infer<ReturnType<typeof useMySchemaLogin>>;
export type TFormSearchData = z.infer<ReturnType<typeof useMySchemaSearch>>;
export type TFormNews = z.infer<ReturnType<typeof useMySchemaNews>>;
export type TFormTags = z.infer<ReturnType<typeof useMySchemaTags>>;
export type TFormCategories = z.infer<ReturnType<typeof useMySchemaCategories>>;
export type TFormUsers = z.infer<ReturnType<typeof useMySchemaUsers>>;
export type TFormCommits = z.infer<ReturnType<typeof useMySchemaCommits>>;
export type TFormComments = z.infer<ReturnType<typeof useMySchemaComments>>;
export type TFormSettings = z.infer<ReturnType<typeof useMySchemaSettings>>;