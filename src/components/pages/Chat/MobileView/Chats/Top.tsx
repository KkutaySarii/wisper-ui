import { Profile } from "@/components/common/Profile";
import React from "react";

export const Top = () => {
  return (
    <div className="mt-5 mx-[18px] flex items-center justify-between bg-light-bg dark:bg-dark-bg">
      <h2 className="font-semibold text-2xl">Messages</h2>
      <Profile />
    </div>
  );
};
