import * as z from "zod";

export const jobSchema = z.object({
    title: z.string("Not a valid title"),
    description: z.string().min(100, "Mininum of 100 character is required").max(1000, "Description can only accept maximum of 1000 character"),
    clientId: z.string("Not a valid id"),
})

