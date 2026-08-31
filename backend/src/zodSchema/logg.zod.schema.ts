import * as z from "zod"


export const dayLoggSchema = z.object({
    date: z.string(),
    rating : z.number(),
    description : z.string(),
})