"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ //create model
    model: "gemini-1.5-flash",
});

export async function saveResume(content) {
    // Check if user is loggedin or not
        const { userId } = await auth();//Get the userid
        if(!userId) throw new Error("Unauthorized") // if user not loggedIn , throw unauthorized error
        // Check if our user exist in our database or not(check it using clerk userId)
        const user = await db.user.findUnique({
            where: { //kha userId find karni h , clerkUser m
                clerkUserId: userId,
            },
        });
        // If user is not present in our database then throw error 
        if(!user) throw new Error("User not found");

        try {
            const resume = await db.resume.upsert({
                where:{
                    userId: user.id,
                },
                update:{
                    content,
                },
                create:{
                    userId: user.id,
                    content,
                },
            });

            revalidatePath("/resume");
            return resume;
        } catch (error) {
            console.error("Error saving resume:", error.message);
            throw new Error("Failed to save resume");
        }
}

// Get Resume Function to get the resume
export async function getResume(){
    // Check if user is loggedin or not
    const { userId } = await auth();
    if(!userId) throw new Error("Unauthorized")
    const user = await db.user.findUnique({
        where: { 
            clerkUserId: userId,
        },
    }); 
    if(!user) throw new Error("User not found");

    return await db.resume.findUnique({
        where:{
            userId: user.id,
        },
    });
}


export async function improveWithAI({ current, type }){
    // Check if user is loggedin or not
    const { userId } = await auth();
    if(!userId) throw new Error("Unauthorized")
    const user = await db.user.findUnique({
        where: { 
            clerkUserId: userId,
        },
    }); 
    if(!user) throw new Error("User not found");

    const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    
    return improvedContent;
  } catch (error) {
    console.error("Error improve resume:", error);
    throw new Error("Failed to improve resume");
  }
}