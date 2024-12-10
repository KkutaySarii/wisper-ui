/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/types/state";
import { setImage, setPublicKey } from "@/redux/slices/session/slice";
import {
  deletePublicKeyCookie,
  setPublicKeyCookie,
} from "@/redux/slices/session/thunk";
import { ChatState, ImageType } from "@/types/messages";
import { initSocket } from "@/redux/slices/socket/slice";
import {
  departeChats,
  getNewMessage,
  setReceiverOnline,
  setReceiverTyping,
  setUserPubKey,
  setReceiverSignResult,
  terminateChat,
} from "@/redux/slices/chat/slice";
import { SignedResponse } from "@/types/auro";
import { checkSignature } from "@/utils/checkSignature";
import { PrivateKey, PublicKey } from "o1js";

export const SessionProvider = ({
  children,
  publicKey,
}: Readonly<{ children: React.ReactNode; publicKey?: string }>) => {
  const dispatch = useAppDispatch();

  const { chats } = useAppSelector((state) => state.chat);

  const router = useRouter();

  const publicKey58 = useAppSelector((state) => state.session.publicKeyBase58);

  const socket = useAppSelector((state) => state.socket.socket);

  const params = useParams<{ chat_id: string }>();

  const zkProgram = useAppSelector((state) => state.zkApp.zkProgram);

  const departeOfflineChat = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const offlineChats = chats
      .filter((chat) => !chat.receiperOnline)
      .map((chat) => chat.id);

    dispatch(
      departeChats({
        offlineChats,
      })
    );
    // TODO: terminate offline chat
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats]);

  // init socket
  useEffect(() => {
    if (!publicKey58) {
      return;
    }
    dispatch(initSocket());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey58]);

  // join app
  useEffect(() => {
    if (!socket || !publicKey58) {
      return;
    }
    const chatIds = chats.map((chat) => chat.id);
    socket.emit("join app", publicKey58, chatIds);
  }, [chats, publicKey58, socket]);

  const sendSignResult = useCallback(() => {
    if (!chats || !publicKey58) {
      return;
    }
    chats.forEach((chat) => {
      if (chat.senderPrivateKey && chat.signResult) {
        socket?.emit("sign result", chat.id, publicKey58, chat.signResult);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats, publicKey58]);

  // online users
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket?.on("online users", (users: string[]) => {
      if (!users || users.length === 0) {
        return;
      }

      if (users.length === 2) {
        sendSignResult();
      }
      users.forEach((user: string) => {
        dispatch(setReceiverOnline({ chatWith: user, isOnline: true }));
      });
    });

    socket?.on("user online", (onlinePk: string) => {
      dispatch(setReceiverOnline({ chatWith: onlinePk, isOnline: true }));
    });

    socket?.on("user offline", (offlinePk: string) => {
      dispatch(setReceiverOnline({ chatWith: offlinePk, isOnline: false }));
    });
    return () => {
      socket.off("online users");
      socket.off("user online");
      socket.off("user offline");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, chats]);

  // before unload
  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      departeOfflineChat();
      const message = "Sayfadan ayrılmak üzeresiniz!";
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats]);

  // user closes chat
  useEffect(() => {
    if (!socket || !chats) {
      return;
    }
    socket?.on(
      "user close chat",
      (data: { chatId: string; chatType: ChatState }) => {
        if (!data?.chatId || !data?.chatType) return;
        const chat = chats.find((chat) => chat.id === data?.chatId);
        if (!chat) {
          return;
        }
        if (data?.chatType === "terminated") {
          dispatch(terminateChat({ chat_id: data?.chatId }));
        } else if (data?.chatType === "departed") {
          dispatch(
            departeChats({
              offlineChats: [data.chatId],
            })
          );
        }
      }
    );
    return () => {
      socket.off("user close chat");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, chats]);

  // receive sign result
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket?.on(
      "receive sign result",
      async (data: {
        chatId: string;
        senderPk: string;
        signResult: SignedResponse;
      }) => {
        const res = await checkSignature(data.signResult);

        if (res && data?.signResult?.data) {
          dispatch(
            setReceiverSignResult({
              chat_id: data.chatId,
              keypairPublicKey: data.signResult?.data as string,
            })
          );
        } else {
          // TODO: handle invalid signature
          console.log("Signature is not valid");
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // user typing
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket?.on("user typing", (receiver58: string) => {
      dispatch(
        setReceiverTyping({
          chatWith: receiver58,
          isTyping: true,
        })
      );
    });
    socket?.on("user stopped typing", (receiver58: string) => {
      dispatch(
        setReceiverTyping({
          chatWith: receiver58,
          isTyping: false,
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // on account change mina wallet
  useEffect(() => {
    const mina = (window as any).mina;

    if (mina == null) {
      return;
    }
    mina?.on("accountsChanged", (accounts: string[]) => {
      if (accounts?.length === 0) {
        dispatch(deletePublicKeyCookie());
        router.push("/home");
      } else {
        const publicKey = accounts[0];
        dispatch(
          setPublicKeyCookie({
            publicKeyBase58: publicKey,
          })
        ).then((res: any) => {
          if (!res?.error) {
            router.push("/chat");
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket || !zkProgram) {
      return;
    }
    const handleMessage = async (data: any) => {
      let unRead = false;
      if (!params || !params.chat_id || params.chat_id !== data?.chatId) {
        unRead = true;
      }

      if (data?.receiverPk === publicKey58) {
        const messagingChat = chats.find((chat) => chat.id === data?.chatId);
        if (!messagingChat) {
          return;
        }
        const receiverPublicKey = PublicKey.fromBase58(
          messagingChat?.receiverPublicKey
        );
        const signingPrivateKey = PrivateKey.fromBase58(
          messagingChat?.senderPrivateKey
        );
        const pureMessage = await zkProgram.decryptMessage({
          encryptedMessage: data?.message?.encryptedMessage,
          receiverPublicKey,
          signingPrivateKey,
        });
        console.log("pureMessage", pureMessage);
        dispatch(
          getNewMessage({
            chatWith: data?.senderPk,
            newMessagePack: data.message,
            pureMessage,
            unRead,
          })
        );
      }
    };

    socket.on("receive message", handleMessage);

    return () => {
      socket.off("receive message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, publicKey58, zkProgram, chats]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    const handleChat = async (data: any) => {
      const messagingChat = chats.find((chat) => chat.id === data?.chatId);
      if (!messagingChat) {
        return;
      }
      data?.messages?.forEach(async (element: any) => {
        let unRead = false;
        if (!params || !params.chat_id || params.chat_id !== data?.chatId) {
          unRead = true;
        }

        const receiverPublicKey = PublicKey.fromBase58(
          messagingChat?.receiverPublicKey
        );
        const signingPrivateKey = PrivateKey.fromBase58(
          messagingChat?.senderPrivateKey
        );
        const pureMessage = await zkProgram.decryptMessage({
          encryptedMessage: element?.message?.encryptedMessage,
          receiverPublicKey,
          signingPrivateKey,
        });
        console.log("pureMessage", pureMessage);
        dispatch(
          getNewMessage({
            chatWith: data?.senderPk,
            newMessagePack: element?.message,
            pureMessage,
            unRead,
          })
        );
      });
    };
    socket?.on("receive chat", handleChat);

    return () => {
      socket.off("receive chat", handleChat);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, chats, params, zkProgram]);

  // set public key
  useEffect(() => {
    if (publicKey) {
      dispatch(setPublicKey(publicKey));
      dispatch(setUserPubKey(publicKey));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  // set image
  useEffect(() => {
    const user_image = localStorage.getItem("user_image");
    if (user_image) {
      dispatch(setImage(user_image as ImageType));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};
