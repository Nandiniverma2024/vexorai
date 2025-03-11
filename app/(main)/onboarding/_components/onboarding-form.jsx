"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib/schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const OnboardingForm = ({ industries }) => {
    const[selectedIndustry, setSelectedIndustry]=useState(null);
    
    const router = useRouter();// This help us to navigate some other page

    const {
        loading: updateLoading,
        fn: updateUserFn, //call updateUser function inside of our onSubmit function
        data: updateResult,
    } = useFetch(updateUser);

    const{
        register,
        handleSubmit,
        formState:{ errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(onboardingSchema),
    });

    const onSubmit = async(values) => {
        try {
            const formattedIndustry = `${values.industry}-${values.subIndustry 
                //Convert subIndustry into lowercse, nd replace space with -
                .toLowerCase()
                .replace(/ /g, "-")}`;

            await updateUserFn({
                ...values,
                industry: formattedIndustry,
            });
        } catch (error) {
            console.error("Onboarding error:", error);
        }
    }; 

    // After submitted form , run a use effect hook

    // useEffect hook will run when component is loaded(but here it will run 
    // when someting in depandancy array is changing),it will only 
    // run when [updateResult, updateLoading] changes  
    useEffect(() => {
        if(updateResult?.success && !updateLoading){ // i.e result is fetched and we no longeer loading
            toast.success("Profile completed successfully!");//toast will add a dialog box , if successed
            router.push("/dashboard");
            router.refresh();
        }
    }, [updateResult, updateLoading]);

    const watchIndustry = watch("industry");

    return (
        <div className="flex items-center justify-center bg-background">
            <Card className="w-full max-w-lg mt-10 mx-2">
                <CardHeader>
                    <CardTitle className="gradient-title text-4xl">Complete your Profile</CardTitle>
                    <CardDescription>
                        Select your industry to get personalized career insights and recommendations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Display Industry */}
                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Select
                                onValueChange={(value)=>{
                                    setValue("industry", value);
                                    setSelectedIndustry(
                                        industries.find((ind) => ind.id === value)
                                    );
                                    setValue("subIndustry", "");
                                }}
                            >
                                <SelectTrigger id="industry">
                                    <SelectValue placeholder="Select an industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industries.map((ind)=>{
                                        return (
                                            <SelectItem value={ind.id} key={ind.id}>
                                                {ind.name}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                            {/* If user not select the industry we will return an error */}
                            {errors.industry &&(
                                <p className="text-sm text-red-500">
                                    {errors.industry.message}
                                </p>
                            )}
                        </div>

                        {/* Display subIndustry */}
                        { watchIndustry && (
                            <div className="space-y-2">
                            <Label htmlFor="subIndustry">Specialization</Label>
                            <Select
                                onValueChange={(value)=>{
                                    setValue("subIndustry", value);
                                }}
                            >
                                <SelectTrigger id="subIndustry">
                                    <SelectValue placeholder="Select an industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedIndustry?.subIndustries.map((ind)=>{
                                        return (
                                            <SelectItem value={ind} key={ind}>
                                                {ind}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                            {/* If user not select the subIndustry we will return an error */}
                            {errors.subIndustry &&(
                                <p className="text-sm text-red-500">
                                    {errors.subIndustry.message}
                                </p>
                            )}
                        </div>)}

                        {/* How many years of experience user have */}
                        <div className="space-y-2">
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input
                                id="experience"
                                type="number"
                                min="0"
                                max="50"
                                placeholder="Enter years of experience"
                                {...register("experience")}
                            />
                            {/* If user not select years of experience, we will return an error */}
                            {errors.experience &&(
                                <p className="text-sm text-red-500">
                                    {errors.experience.message}
                                </p>
                            )}
                        </div>

                        {/* Skills that user need to enter */}
                        <div className="space-y-2">
                            <Label htmlFor="skills">Skills</Label>
                            <Input
                                id="skills"
                                placeholder="e.g., Python, Javascript, Project Management"
                                {...register("skills")}
                            />
                            <p className="text-sm text-muted-foreground">
                                Separate multiple skills with commas
                            </p>
                            {errors.skills &&(
                                <p className="text-sm text-red-500">
                                    {errors.skills.message}
                                </p>
                            )}
                        </div>

                        {/* Add Professional Bio */}
                        <div className="space-y-2">
                            <Label htmlFor="bio">Professional Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us about your professional background..."
                                className="h-32"
                                {...register("bio")}
                            />
                            {errors.bio &&(
                                <p className="text-sm text-red-500">
                                    {errors.bio.message}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={updateLoading}>
                            {updateLoading ? ( //If UpdateLoading is true show this loader2
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                                </>
                            ) : ( //else i say complete profile
                                "Complete Profile"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default OnboardingForm;
