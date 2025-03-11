import { z } from "zod";

export const onboardingSchema = z.object({
    // Industry will be a String , 
    // if it is not a String we will provide error to user
    industry: z.string({
        required_error: "Please select an industry",
    }),
    subIndustry: z.string({
        required_error: "Please select a specialization",
    }),
    bio: z.string().max(500).optional(),
    // Inputting user experience
    experience: z
    .string()
    .transform((val)=> parseInt(val, 10)) // transforming experience value into Integer value 
    // before storing it inside our database
    .pipe(
        z
        .number()
        .min(0, "Experience must be atleast 0 years")
        .max(50, "Experience cannot exceed 50 years")
    ),
    skills: z.string().transform((val) => //Transform skills into array (since , user enter values seprated with ,)
        val
            ? val
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)//Filter out if there is any spaces over there
            : undefined
    ),
});


export const contactSchema = z.object({
    email: z.string().email("Invalid email address"),
    mobile: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
}) 

export const entrySchema = z.object({
    title: z.string().min(1, "Title is required"), //Minimum 1 character
    Organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false),
}).refine((data) => { // refine helps us to add some checks,(if it's working properly or not)
    if(!data.current && !data.endDate){
        return false;
    }
    return true;
    },
    {
        message: "End date is required unless this is your current position",
        path: ["endDate"],
    }
);

export const resumeSchema = z.object({
    contactInfo: contactSchema,
    summary: z.string().min(1, "Professional summary is required"),
    skills: z.string().min(1, "Skills are required"),
    experience: z.array(entrySchema),
    education: z.array(entrySchema),
    projects: z.array(entrySchema),
});

export const coverLetterSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    jobDescription: z.string().min(1, "Job description is required"),
});
