"use client";
import { usePageWidth } from "@/hooks/usePageWidth";
import { useAppSelector } from "@/types/state";
import { redirect } from "next/navigation";
import Chats from "./MobileView/Chats";
import { EmptyChat } from "@/components/common/EmptyChat";

export const AllchatPage = () => {
  const { chats } = useAppSelector((state) => state.chat);

  const pageWidth = usePageWidth();

  if (chats.length === 0) {
    return <EmptyChat />;
  }

  if (pageWidth > 700) {
    return redirect(`/chat/${chats[0].id}`);
  } else {
    return <Chats />;
  }
};
