"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { generateAIInsights } from "./dashboard";

// Server action for UpdateUser

export async function updateUser(data){
    // Check if user is loggedIn or not

    const { userId } = await auth();//Get the userid
    if(!userId) throw new Error("Unauthorized") // if user not loggedIn , throw unauthorized error

    // Check if our user exist in our database 
    // or not(check it using clerk userId)
    const user = await db.user.findUnique({
        where: { //kha userId find karni h , clerkUser m
            clerkUserId: userId,
        },
    });

    // If user is not present in our database then throw error 
    if(!user) throw new Error("User not found");

    // Make connection with our database
    try {
        const result = await db.$transaction(
            async (tx) => {//To perform the transaction we will take tx over here                
                // find if industry exist
                let industryInsight = await tx.industryInsight.findUnique({// try to find ,if that industry already exist
                    where:{ 
                        industry: data.industry,
                    },
                });
               
                // If industry doesn't exist, create it with default values- will replace it with ai later
                if(!industryInsight){
                    const insights = await generateAIInsights(data.industry);
                  
                    industryInsight = await db.industryInsight.create({
                      data: {
                          industry: data.industry,
                          ...insights,
                          nextUpdate: new Date (Date.now() + 7 * 24 * 60 * 60 * 1000 ),
                      },
                    });
                }
                
                // update the user
                const updatedUser = await tx.user.update({
                    where:{ //Find the user
                        id: user.id,
                    },
                    data:{ //Then providing values that we are getting
                        industry: data.industry,
                        experience: data.experience,
                        bio: data.bio,
                        skills: data.skills,
                    },
                });

                return { updateUser, industryInsight };
            },
            {
                timeOut: 10000, //dafault 5000
            }
        );

        return { success: true, ...result };
    } catch (error) {
        console.error("Error updating user and industry:", error.message);
        throw new Error("Failed to update profile" + error.message);
    }
}


// Creating another server action for fetching the onboarded status

export async function getUserOnboardingStatus(){
    // Check if user is loggedIn or not
    const { userId } = await auth();//Get the userid
    if(!userId) throw new Error("Unauthorized") // if user not loggedIn , throw unauthorized error

    const user = await db.user.findUnique({ // Check if our user exist in our database or not
        where: { //kha userId find karni h , clerkUser m
            clerkUserId: userId,
        },
    });

    if(!user) throw new Error("User not found");// If user is not present in our database then throw error 

    try {
        const user = await db.user.findUnique({// Fetch the user
            where:{
                clerkUserId: userId,
            },//when we select the user object, industry object might not be 
            select:{ // populated(then we only get the id , so we need to populate industry as well)
                industry: true,
            },
        });  
        // return isonboarded flag and check is user-industry exist?
        // if exist, it will be true else false
        return { 
            isOnboarded: !!user?.industry,
        };
    } catch (error) {
        console.error("Error checking onboarding status:", error.message);
        throw new Error("Failed to check onboarding status");
    }
}
