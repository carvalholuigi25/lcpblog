import { z } from "zod";

/* start of form reg */
export const fregstep1Schema = z.object({
    email: z.coerce.string().email({ message: "Invalid email" }),
    username: z.coerce.string().min(1, { message: "Username is required" }),
    displayname: z.coerce.string().min(1, { message: "Display name (full name) is required" })
});

export const fregstep2Schema = z.object({
    password: z.coerce.string().min(1, { message: "The password is required" }),
    passwordConfirm: z.coerce.string().min(1, { message: "The password confirmation is required" }),
    dateBirthday: z.coerce.date().min(new Date("1900-01-01"), { message: "Too old!" }).max(new Date(), { message: "Too young!" })
})
.refine(({ password, passwordConfirm }) => password === passwordConfirm, {
  message: "Password doesn't match",
  path: ["passwordConfirm"]
});

export const fregstep3Schema = z.object({
    termsandcond: z.boolean({ message: "The terms and conditions needs to be accepted!" })
});

export type TFormRegDataStep1 = z.infer<typeof fregstep1Schema>;
export type TFormRegDataStep2 = z.infer<typeof fregstep2Schema>;
export type TFormRegDataStep3 = z.infer<typeof fregstep3Schema>;
/* end of form reg */

/* start of form log */
export const floginSchema = z.object({
    email: z.coerce.string().email({ message: "Invalid email" }),
    password: z.coerce.string().min(1, { message: "The password is required" })
});

export type TFormLogData = z.infer<typeof floginSchema>;
/* end of form log*/


/* start of form search */
export const fsearchSchema = z.object({
    search: z.coerce.string().min(1, { message: "Write something in the search input!" })
});

export type TFormSearchData = z.infer<typeof fsearchSchema>;
/* end of form search */

/* start of form news */

export const fnewsSchema = z.object({
    title: z.coerce.string().min(1, { message: "The title is required to be filled" }),
    content: z.coerce.string().min(1, { message: "The content is required to be filled" }),
    image: z.coerce.string().optional(),
    slug: z.coerce.string().optional(),
    status: z.coerce.string().optional(),
    categoryId: z.coerce.number().optional(),
    userId: z.coerce.number().optional()
});

export type TFormNews = z.infer<typeof fnewsSchema>;

/* end of form news */

/* start of form categories */

export const fcategoriesSchema = z.object({
    name: z.coerce.string().min(1, { message: "The name is required to be filled" }),
    slug: z.coerce.string().optional(),
    status: z.coerce.string().optional()
});

export type TFormCategories = z.infer<typeof fcategoriesSchema>;

/* end of form categories */

/* start of form users */

export const fusersSchema = z.object({
    userId: z.coerce.number().optional(),
    username: z.coerce.string().min(1, { message: "The username is required to be filled" }),
    password: z.coerce.string().min(1, { message: "The password is required to be filled" }),
    email: z.coerce.string().email({ message: "The email is required to be filled" }),
    displayName: z.coerce.string().min(1, { message: "The display name (full name) is required to be filled" }),
    avatar: z.coerce.string().optional(),
    cover: z.coerce.string().optional(),
    about: z.coerce.string().optional(),
    role: z.coerce.string().optional(),
    privacy: z.coerce.string().optional(),
    userInfoId: z.coerce.number().optional()
});

export type TFormUsers = z.infer<typeof fusersSchema>;

/* end of form users */

/* start of form commits of my gh repo */

export const fcommitsSchema = z.object({
    owner: z.coerce.string().min(1, { message: "The owner name is required to be filled" }),
    repository: z.coerce.string().min(1, { message: "The repository name is required to be filled" }),
    branchname: z.coerce.string().optional()
});

export type TFormCommits = z.infer<typeof fcommitsSchema>;

/* end of form commits of my gh repo */