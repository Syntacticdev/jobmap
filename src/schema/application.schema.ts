import * as z from "zod";

export const ApplicationSchema = z.object({
    cv: z.string("Not a valid string").nonempty("CV is Required"),
    coverLetter: z.string("Not a valid cover letter").nonempty("Cover Letter is required")
})
