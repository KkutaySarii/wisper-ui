import { useCallback, useEffect, useState } from "react";

import { setChat } from "@/redux/slices/chat/slice";
import { useAppDispatch, useAppSelector } from "@/types/state";

export const useGetChat = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const pubKey58 = useAppSelector((state) => state.session.publicKeyBase58);

  const chat = useAppSelector((state) => state.chat);

  const getChatFromLocalStorage = useCallback(() => {
    if (!pubKey58) return [];
    const user_chat = localStorage.getItem(`chat-${pubKey58}`);
    const storedChat = user_chat
      ? JSON.parse(user_chat)
      : {
          chats: [],
        };

    return storedChat?.chats;
  }, [pubKey58]);

  const saveChatToRedux = useCallback(() => {
    if (!pubKey58) return;
    setLoading(true);
    try {
      const storedChat = getChatFromLocalStorage();

      // Merge the two chats
      const mergedChat = [...storedChat];

      // Save the merged chat to the redux store
      dispatch(setChat({ chats: mergedChat, pubKey58: pubKey58 }));
      // dispatch(setChat(dummyChat));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubKey58]);

  useEffect(() => {
    saveChatToRedux();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubKey58]);

  return {
    chat,
    loading,
  };
};
