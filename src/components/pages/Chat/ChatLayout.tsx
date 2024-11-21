"use client";

import { useGetChat } from "@/hooks/useGetChat";
import { usePageWidth } from "@/hooks/usePageWidth";
import DesktopView from "./DesktopView";

export const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  const pageWidth = usePageWidth();

  const { loading, chat } = useGetChat();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (pageWidth > 700) {
    return <DesktopView chat={chat}>{children}</DesktopView>;
  }
  return children;
};
