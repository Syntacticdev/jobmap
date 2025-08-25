// import { z } from "zod/v4";


// export const LoginSchema = z.strictObject({
//     email: z.email("Provide a valid email").min(10, "Email must be atleast 10 characters").max(100, "Email is too long"),
//     password: z.string("Provide a valid password").trim()
// })

// export const SignupSchema = z.object({
//     email: z.email(),
//     password: z.string().min(8, "Minimum of 8 character is required")
// })

import * as z from "zod";

export const loginSchema = z.object({
    email: z.email("Not a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters long")
})

export const signupSchema = z.object({
    email: z.email("Not a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters long")
})
