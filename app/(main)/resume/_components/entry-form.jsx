"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entrySchema } from "@/app/lib/schema";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Sparkles, X } from "lucide-react";
import { Card, CardHeader, CardFooter, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import { parse, format } from "date-fns";


const formatDisplayDate = (dateString) => {
    if(!dateString) return "";
    const date = parse(dateString, "yyyy-MM", new Date());
    return format(date, "MMM yyyy");
};

const EntryForm = ({ type, entries, onChange }) => {

    // we need a state as well, which tell us if a new experience, education or project is added currently
    const [isAdding, setIsAdding] = useState(false); 

    const {
        register,
        handleSubmit: handleValidation, // To submit the form
        formState: { errors },
        reset,
        watch, //watch a particular field inside our form 
        setValue,
      } = useForm({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            title: "",
            Organization: "",
            startDate: "",
            endDate: "",
            description: "",
            current: false,
        },
    });

    const current = watch("current"); //current is watching this current checkbox

    const {
        loading: isImproving,
        fn: improveWithAIFn,
        data: improvedContent,
        error: improveError,
    } = useFetch(improveWithAI);

    // To add education/project
    const handleAdd = handleValidation((data) => {//we will submit this, so wrap it into handleValidation

        const formattedEntry = {
            ...data,
            startDate: formatDisplayDate(data.startDate),
            endDate: data.current ? "" : formatDisplayDate(data.endDate),
        };

        onChange([...entries, formattedEntry]);

        reset();
        setIsAdding(false);
    });

    // Enable us to delete experiences
    const handleDelete = (index) => {
        const newEntries = entries.filter((_, i) => i !== index);
        onChange(newEntries); 
    };

    useEffect(() => {
        if(improvedContent && !isImproving){
            setValue("description", improvedContent);
            toast.success("Description improved successfully!");
        }
        // if there is any error,we show toast.error
        if(improveError){
            toast.error(improveError.message || "Failed to improve description");
        }
    }, [improvedContent, improveError, isImproving]);

    // Function to improveDescription with AI
    const handleImproveDescription = async () => {
        const description = watch("description");//Take description(i.e watch description)
        if(!description){ //if description doesn't exist
            toast.error("Please enter a description first");
            return;
        }

        await improveWithAIFn({
            current: description,
            type: type.toLowerCase(), // "experience", "education", "project"
        })
    };

    return (
        <div className="space-y-4">
            {/* After handling the addition, we need to render all of the fields */}
            <div className="space-y-4">{/* map through all of the entries */}
                {entries.map((item, index)  => {
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {item.title} @ {item.Organization}
                                </CardTitle>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    type="button"
                                    onClick={() => handleDelete(index)}
                                >
                                    <X className="size-4"/>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {item.current
                                       ? `${item.startDate} - Present`
                                       : `${item.startDate} - ${item.endDate}`
                                    }
                                </p>
                                <p className="mt-2 text-sm whitespace-pre-wrap">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        
            {/* If IsAdding true, we will display the form */}
            {isAdding && (
                <Card>
                    <CardHeader>
                    <CardTitle>Add {type}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input 
                                    placeholder="Title/Position"
                                    {...register("title")}
                                    error={errors.title}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">{errors.title.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Input 
                                    placeholder="Organization/Company"
                                    {...register("Organization")}
                                    error={errors.Organization}
                                />
                                {errors.Organization && (
                                    <p className="text-sm text-red-500">{errors.Organization.message}</p>
                                )}
                            </div>
                        </div>


                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input 
                                    type="month"
                                    {...register("startDate")}
                                    error={errors.startDate}
                                />
                                {errors.startDate && (
                                    <p className="text-sm text-red-500">{errors.startDate.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Input 
                                    type="month"
                                    {...register("endDate")}
                                    disabled={current} //if this is checked(current) ,we will disabled it
                                    error={errors.endDate}
                                />
                                {errors.endDate && (
                                    <p className="text-sm text-red-500">{errors.endDate.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input 
                                type="checkbox"
                                id="current"
                                {...register("current")}
                                onChange={(e) => {
                                    setValue("current", e.target.checked);
                                    if(e.target.checked){
                                        setValue("endDate", "");
                                    }
                                }}
                            />
                            <label htmlFor="current">Current {type}</label>
                        </div>

                        <div className="space-y-2">
                            <Textarea 
                                placeholder={`Description of your ${type.toLowerCase()}`}
                                className="h-32"
                                {...register("description")}
                                error={errors.description}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleImproveDescription}
                            disabled={isImproving || !watch("description")}
                        >
                            {isImproving ? (
                                <>
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                    Improving...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="size-4 mr-2" />
                                    Improve with AI
                                </>
                            )}
                        </Button>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                        <Button //when we cancel, it will reset the form
                            type="button"//jiise submit krne pr pura form submit na ho
                            variant="outline"
                            onClick={() => {
                                reset();
                                setIsAdding(false);
                            }}
                        > 
                            Cancel 
                        </Button>
                        <Button type="button" onClick={handleAdd}>
                            <PlusCircle className="size-4 mr-2"/>
                            Add Entry
                        </Button>
                    </CardFooter>
                </Card>
              
            )}
            {!isAdding && (
                <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setIsAdding(true)}
                >
                    <PlusCircle className="size-4 mr-2" />
                    Add {type}
                </Button>
            )}
        </div>
    );
}

export default EntryForm
