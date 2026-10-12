import { createContext, useContext, useState, type ReactNode } from "react";

export type Profile = {
  name: string;
  headline: string;
  about: string;
  skills: string;
  projects: string;
  experience: string;
};

export const sampleProfile: Profile = {
  name: "Alex Sample",
  headline: "Computer Science Student (Sample Profile)",
  about: "This is a sample profile for demonstration purposes. Replace it with your own details.",
  skills: "Python, HTML, CSS, JavaScript",
  projects: "Personal portfolio website; Python script that automates file organization",
  experience: "Volunteer tutor for introductory programming (6 months)",
};

type Ctx = {
  profile: Profile;
  isSample: boolean;
  save: (p: Profile) => void;
};

const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  return (
    <ProfileContext.Provider
      value={{
        profile: userProfile ?? sampleProfile,
        isSample: userProfile === null,
        save: setUserProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
