import { useEffect, useState } from "react";

import { ChatType } from "@/types/messages";
import { ChatTop } from "../../ChatTop";
import MessageList from "../../MessageList";
import { ChatInput } from "../../ChatInput";
import { SettingScreen } from "../../SettingScreen";
import { useAppDispatch } from "@/types/state";
import { clearUnReadMessages } from "@/redux/slices/chat/slice";

const ChatDesktop = ({ chat }: { chat: ChatType }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!!chat?.chatWith) {
      dispatch(clearUnReadMessages({ chatWith: chat.chatWith }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="col-span-11 bg-light-chats-bg dark:bg-dark-chats-bg overflow-hidden h-full rounded-[28px] relative">
      {!isSettingsOpen && (
        <>
          <div className="bg-[#F0E8FF] dark:bg-[#151515] py-5 px-9">
            <ChatTop
              id={chat.id}
              chatWith={chat.chatWith}
              isOnline={chat.receiperOnline}
              username={chat.username}
              image={chat.image}
              previousProof={
                chat?.messages?.length > 0
                  ? chat?.messages[chat?.messages?.length - 1]?.content?.proof
                  : null
              }
              messages={chat?.messages?.map((msg) => msg?.content?.pureMessage)}
              setIsSettingsOpen={setIsSettingsOpen}
              isTyping={chat.receiperTyping}
            />
          </div>
          <MessageList messages={chat?.messages} />
          <ChatInput
            chatWith={chat?.chatWith}
            chat_id={chat.id}
            signingPrivateKey58={chat?.senderPrivateKey}
            receiverPubKey58={chat?.receiverPublicKey}
            lengthOfMessage={chat?.messages?.length}
            previousProof={
              chat?.messages?.length > 0
                ? chat?.messages[chat?.messages?.length - 1]?.content?.proof
                : null
            }
            messages={
              chat?.messages?.map((msg) => msg?.content?.pureMessage) || []
            }
          />
        </>
      )}
      {isSettingsOpen && (
        <SettingScreen
          setIsSettingsOpen={setIsSettingsOpen}
          image={chat?.image}
          username={chat?.username}
          chatWith={chat?.chatWith}
        />
      )}
    </div>
  );
};

export default ChatDesktop;
