"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Download, Loader2, Monitor, Save } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/app/lib/schema";
import useFetch from "@/hooks/use-fetch";
import { saveResume } from "@/actions/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./entry-form";
import { Edit } from "lucide-react";
import { entriesToMarkdown } from "@/app/lib/helper";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useUser } from "@clerk/nextjs";
import html2pdf from "html2pdf.js/dist/html2pdf.bundle.min.js";
import { toast } from "sonner";


const ResumeBuilder = ({ initialContent }) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [resumeMode, setResumeMode] = useState("preview");
  const [previewcontent, setPreviewContent] = useState(initialContent); 
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    control, //helps us to take control of the whole form
    register,
    handleSubmit, // To submit the form
    watch, //watch a particular field inside our form 
    formState: { errors }, //Take out the errors to display the errors
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
        contactInfo: {},
        summary: "",
        skills: "",
        experience: [],
        education: [],
        projects: [],
    },
  });

    // Let's take the Api
    const {
        loading: isSaving,
        fn: saveResumefn,
        data: saveResult,
        error: saveError,
    } = useFetch(saveResume); // This will enable us to save the resume when we submit the form

    const formValues = watch();

    useEffect(() => { //if initialContent is already exist
        if (initialContent) setActiveTab("preview");// i.e we will directly go to the markdown Tab rather than the form
    }, [initialContent]); //put initialContent in dependancy array,if it's changes then setActiveTab is also changing
    


    useEffect(() => {
      if(activeTab === "edit"){//if active tab = edit
        const newContent = getCombinedContent();//then take newContent from getCombinedContent
        setPreviewContent(newContent ? newContent : initialContent);
        //setPreviewcontent => if we have anything inside newConent then 
        // we set it otherwise take whatever the initialContent
      }
    }, [formValues, activeTab]); //if formValues or activeTab changes then we will update
    //  the markdown content with whatever we have inside the form



    const getContactMarkdown = () => {
      const { contactInfo } = formValues; //Take contactInfo from the form-Values &
      // this has 4 parts  (email,mobile,likedIn,twitter)
      const parts = []; //Take empty array to combine all 4 parts
      if (contactInfo.email) parts.push(`${contactInfo.email}`);
      if (contactInfo.mobile) parts.push(`${contactInfo.mobile}`);
      if (contactInfo.linkedin) parts.push(`[LinkedIn](${contactInfo.linkedin})`);
      if (contactInfo.twitter) parts.push(`[Twitter](${contactInfo.twitter})`);

      // Let's combine all 4 parts
      return parts.length > 0
      ? `## <div align="center">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>` //Contact Info
      : "";
    };

    const getCombinedContent = () => {
      const { summary, skills, education, experience, projects } = formValues;

      return [
        getContactMarkdown(), //render ContactMardown here
        summary && `## Professional Summary\n\n${summary}`,
        skills && `## Skills\n\n${skills}`,
        entriesToMarkdown(experience, "Work Experience"),
        entriesToMarkdown(education, "Education"),
        entriesToMarkdown(projects, "Projects"),
      ]
        .filter(Boolean) //filter -> we don't have any of these(summary,skills,experience,education,projects)
        .join("\n\n"); // after that we join them
    };


    useEffect(() => {
      if (saveResult && !isSaving){
        toast.success("Resume saved successfully!");
      }
      if (saveError){
        toast.error(saveError.message || "Failed to save resume");
      }
    }, [saveResult, saveError, isSaving]);
    

    const onSubmit = async () => {
      try {
        await saveResumefn(previewcontent);
      } catch (error) {
        console.log("Save error:", error);
      }
    };

    const generatePDF = async () => {
      setIsGenerating(true);
      try {
        // get that element from which we will be generating our pdf
        const element = document.getElementById("resume-pdf");

        const options = {
          margin: [15,15],
          filename: "resume.pdf",
          image: {type: "jpeg", quality: 0.98},
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };
        await html2pdf().set(options).from(element).save();
      } catch (error) {
        console.error("PDF generation error:", error);
      } finally{
        setIsGenerating(false);
      }
    };
    
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
            Resume Builder
        </h1>
        
        <div className="space-x-2">
            <Button 
              variant="destructive"
              onClick={onSubmit}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save
                </>
              )}
            </Button>
            <Button onClick={generatePDF} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="size-4" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="size-4" />
                  Download PDF
                </>
              )}
            </Button>
        </div>
      </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
                <TabsTrigger value="edit">Form</TabsTrigger>
                <TabsTrigger value="preview">Markdown</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <form className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        {...register("contactInfo.email")}
                        type="email"
                        placeholder="your@email.com"
                        error={errors.contactInfo?.email}
                      />

                      {errors.contactInfo?.email && (
                        <p className="text-sm text-red-500">
                          {errors.contactInfo.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mobile Number</label>
                      <Input
                        {...register("contactInfo.mobile")}
                        type="tel"
                        placeholder="+1 234 567 8900"
                      />

                      {errors.contactInfo?.mobile && (
                        <p className="text-sm text-red-500">
                          {errors.contactInfo.mobile.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">LinkedIn URL</label>
                      <Input
                        {...register("contactInfo.linkedin")}
                        type="url"
                        placeholder="https://www.linkedin.com/in/your-profile"
                      />

                      {errors.contactInfo?.linkedin && (
                        <p className="text-sm text-red-500">
                          {errors.contactInfo.li?.linkedin.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Twitter/X Profile</label>
                      <Input
                        {...register("contactInfo.twitter")}
                        type="url"
                        placeholder="https://twitter.com/your-handle"
                        error={errors.contactInfo?.email}
                      />

                      {errors.contactInfo?.twitter && (
                        <p className="text-sm text-red-500">
                          {errors.contactInfo.twitter.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Professional Summary</h3>
                  <Controller 
                    name="summary"
                    control={control} //This will help it to get the control of the form
                    render={({ field }) => ( // we render component in textarea
                      <Textarea
                        {...field}
                        className="h-32"
                        placeholder="Write acompelling professional summary..."
                        error={errors.message}
                      />
                    )}
                  />
                  {errors.summary && (
                    <p className="text-sm text-red-500">{errors.summary.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Skills</h3>
                  <Controller 
                    name="skills"
                    control={control} //This will help it to get the control of the form
                    render={({ field }) => ( // we render component in textarea
                      <Textarea
                        {...field}
                        className="h-32"
                        placeholder="List your key skills..."
                        error={errors.message}
                      />
                    )}
                  />
                  {errors.skills && (
                    <p className="text-sm text-red-500">{errors.skills.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">work Experience</h3>
                  <Controller 
                    name="experience"
                    control={control} //This will help it to get the control of the form
                    render={({ field }) => ( 
                      <EntryForm 
                        type="Experience"
                        entries={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.experience && (
                    <p className="text-sm text-red-500">{errors.experience.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Education</h3>
                  <Controller 
                    name="education"
                    control={control} //This will help it to get the control of the form
                    render={({ field }) => ( 
                      <EntryForm 
                        type="Education"
                        entries={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.education && (
                    <p className="text-sm text-red-500">{errors.education.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Projects</h3>
                  <Controller 
                    name="projects"
                    control={control} //This will help it to get the control of the form
                    render={({ field }) => ( 
                      <EntryForm 
                        type="Project"
                        entries={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.projects && (
                    <p className="text-sm text-red-500">{errors.projects.message}</p>
                  )}
                </div>

              </form>
            </TabsContent>
            <TabsContent value="preview">
              <Button 
                variant="link" 
                type="button" 
                className="mb-2"
                onClick={() =>
                  setResumeMode(resumeMode === "preview" ? "edit" : "preview")
                }
              >
                {/* If we are on preview => show edit Resume , else show preview*/}
                {resumeMode === "preview" ? (
                  <>
                    <Edit className="size-4"/>
                    Edit Resume
                  </>
                ) : (
                  <>
                    <Monitor className="size-4"/>
                    Show Preview
                  </>
                )}
              </Button>

              {/* If we are on the edit mode, show alert*/}
              {resumeMode !== "preview" && (
                <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
                  <AlertTriangle className="size-5" />
                  <span>
                    You will lose edition markdown if you update the form data.
                  </span>
                </div>
              )}

              <div className="border rounded-lg">
                <MarkdownEditor 
                  value={previewcontent} 
                  onChange={setPreviewContent}
                  height={800}
                  preview={resumeMode}
                />
              </div>
              <div className="hidden">
                <div id="resume-pdf">
                  <MarkdownEditor.Markdown 
                    source={previewcontent} 
                    style={{
                      background: "white",
                      color: "black",
                    }}
                  />
                </div>
              </div>
            </TabsContent>
        </Tabs>

    </div>
  )
}


export default ResumeBuilder
