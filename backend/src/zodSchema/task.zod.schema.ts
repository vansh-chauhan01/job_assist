import * as z from "zod";


export const createTaskSchema = z.object({
    title : z.string(),
    completed : z.boolean(),
})