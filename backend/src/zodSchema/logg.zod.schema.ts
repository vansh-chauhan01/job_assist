import * as z from "zod"


export const dayLoggSchema = z.object({
    rating : z.number(),
    description : z.string(),
})