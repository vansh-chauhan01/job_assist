import * as z from "zod";
export declare const signUpSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    email: z.ZodEmail;
    token: z.ZodString;
}, z.core.$strip>;
export declare const signInSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=userSchema.d.ts.map