import * as z from "zod"


export const createJobSchema = z.object({
    companyName : z.string(),
    role : z.string(),
    referral : z.boolean(),
    remote : z.boolean(),
    openingType : z.string()
})

