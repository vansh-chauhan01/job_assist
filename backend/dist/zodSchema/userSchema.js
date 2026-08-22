import * as z from "zod";
export const signUpSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.email(),
    token: z.string()
});
export const signInSchema = z.object({
    username: z.string(),
    password: z.string()
});
//# sourceMappingURL=userSchema.js.map