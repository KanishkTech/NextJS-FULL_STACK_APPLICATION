import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(3,"Username should be at least 3 characters")
    .max(20,"Username should be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"username must not contain special characters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(8,{message:"Password should be at least 8 characters"}),

})
