"use client";

import { useGetChat } from "@/hooks/useGetChat";
import { usePageWidth } from "@/hooks/usePageWidth";
import DesktopView from "./DesktopView";
// import { EntireScreen } from "@/components/common/EntireScreen";
// import { StartChat } from "./StartChat";

export const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  const pageWidth = usePageWidth();

  const { loading, chat } = useGetChat();

  if (loading) {
    return <div>Loading...</div>;
  }

  //TODO: move the page to the chat page
  // if (!chat || chat?.chats.length === 0) {
  //   return (
  //     <EntireScreen>
  //       <StartChat />
  //     </EntireScreen>
  //   );
  // }

  if (pageWidth > 700) {
    return <DesktopView chat={chat}>{children}</DesktopView>;
  }
  return children;
};
