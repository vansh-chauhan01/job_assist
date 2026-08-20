import * as z from "zod";



export const signUpSchema = z.object({
    username : z.string(),
    password : z.string(),
    email : z.email(),
})


export const signInSchema = z.object({
    username : z.string(),
    password : z.string()
})