import { FC } from "react";

import { MainLogo } from "@/components/common/MainLogo";
import { ChatResponse } from "@/types/messages";
import { Chats } from "./Chats";
import { Profile } from "@/components/common/Profile";

interface DesktopViewProps {
  chat: ChatResponse;
  children: React.ReactNode;
}

const DesktopView: FC<DesktopViewProps> = ({ chat, children }) => {
  return (
    <div className="w-full h-screen overflow-hidden pt-[50px]">
      <div className="flex items-center justify-between px-[50px]">
        <MainLogo />
        <Profile />
      </div>
      <div className="grid grid-cols-16 px-8 gap-x-8 pt-[16px] pb-[60px] h-full">
        <Chats chats={chat?.chats} />
        {children}
      </div>
    </div>
  );
};

export default DesktopView;
