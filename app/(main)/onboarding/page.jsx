// It is a server component

import { getUserOnboardingStatus, getUserProfile} from "@/actions/user"
import { industries } from "@/data/industries"
// import { redirect } from "next/navigation";
import OnboardingForm from "./_components/onboarding-form";

const OnboardingPage = async () => {
    // Check if user is already onboarded, we will route them to dashboard page
    const { isOnboarded } = await getUserOnboardingStatus();

    // Agar already onboarded hai, to existing data fetch karo taaki form pre-filled dikhe
    const userProfile = isOnboarded ? await getUserProfile() : null;

  return (
    <main>
        <OnboardingForm industries={industries} initialData={userProfile} />
    </main>
  )
}

export default OnboardingPage
