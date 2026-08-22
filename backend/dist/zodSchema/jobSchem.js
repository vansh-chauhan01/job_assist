import * as z from "zod";
export const creareJobSchema = z.object({
    title: z.string(),
    referral: z.boolean(),
    remote: z.boolean(),
});
//# sourceMappingURL=jobSchem.js.map