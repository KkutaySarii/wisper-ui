"use client";
import { MainLogo } from "@/components/common/MainLogo";
import { Profile } from "@/components/common/Profile";
import { Settings } from "./Settings";

const ProfileSettingsPage = () => {
  return (
    <div className="w-full h-screen overflow-hidden pt-[50px]">
      <div className="flex items-center justify-between px-[50px]">
        <MainLogo />
        <Profile />
      </div>
      <Settings />
    </div>
  );
};

export default ProfileSettingsPage;
