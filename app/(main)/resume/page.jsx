import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";

const ResumePage = async () => {
    // If any resume pre existing
    const resume = await getResume();
    return (
        <div className="container mx-auto py-6">
            {/* if resume doesn't exist */}
            <ResumeBuilder initialContent={resume?.content}/> 
        </div>
    );
}

export default ResumePage;
