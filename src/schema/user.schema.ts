import * as z from "zod";

export const userSchema = z.object({
    name: z.string().optional(),
    email: z.email({ message: "Not a valid email" }),
});
// export const userSchema = z.object({
//     id: z.string({ message: "Not a valid id" }),
//     name: z.string().optional(),
//     email: z.email({ message: "Not a valid email" }),
//     // role: z.string().default("FREELANCER"), // Use z.nativeEnum(ROLE) if you import the enum
//     jobs: z.array(z.any()).optional(),
//     applications: z.array(z.any()).optional(),
//     profiles: z.array(z.any()).optional(),
//     socials: z.array(z.any()).optional(),
//     createdAt: z.date().optional(),
//     updatedAt: z.date().optional(),
// });

