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