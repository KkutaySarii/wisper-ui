"use client";

import { useAppDispatch, useAppSelector } from "@/types/state";
import ChatDesktop from "./DesktopView/ChatDesktop";
import { usePageWidth } from "@/hooks/usePageWidth";
import ChatMobile from "./MobileView/ChatMobile";
import { useEffect, useRef } from "react";
import { joinChat } from "@/redux/slices/chat/thunk";
import { createNewKP } from "@/utils/createNewKP";
import { setSignResult } from "@/redux/slices/chat/slice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const ChatScreen = ({ chat_id }: { chat_id: string }) => {
  const hasInitializedKeyPair = useRef(false);

  const chat = useAppSelector((state) =>
    state.chat?.chats.find((c) => c.id === chat_id)
  );

  const publicKey = useAppSelector((state) => state.session.publicKeyBase58);

  const socket = useAppSelector((state) => state.socket.socket);

  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    if (!chat && publicKey) {
      const localeChat = localStorage.getItem(`chat-${publicKey}`);
      const storedChat = localeChat
        ? JSON.parse(localeChat)
        : {
            chats: [],
          };

      const isExistChat = storedChat?.chats?.find((c: any) => c.id === chat_id);
      if (!isExistChat) {
        dispatch(
          joinChat({
            chat_id,
            publicKey,
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, publicKey]);

  useEffect(() => {
    if (!chat || hasInitializedKeyPair.current) {
      return;
    }

    if (!chat.signResult || !chat.senderPrivateKey) {
      hasInitializedKeyPair.current = true;
      console.log("Creating new key pair...");
      createNewKP().then((res) => {
        if (!res) {
          hasInitializedKeyPair.current = false; // Reset if the result fails
          return;
        }
        const { signingPrivateKey58, signResult } = res;
        dispatch(
          setSignResult({
            chat_id,
            signResult,
            keypairPrivateKey58: signingPrivateKey58,
          })
        );
      });
    }
  }, [chat, chat_id]);

  useEffect(() => {
    if (!socket || !publicKey || !chat_id) {
      return;
    }
    socket.emit("join chat", publicKey, chat_id);
  }, [publicKey, chat_id, socket]);

  const pageWidth = usePageWidth();

  if (!chat) {
    return null;
  }

  if (pageWidth <= 700) {
    return <ChatMobile chat={chat} />;
  }

  return <ChatDesktop chat={chat} />;
};
