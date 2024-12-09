import { useEffect, useState } from "react";

import { ChatType } from "@/types/messages";
import MessageList from "../../MessageList";
import { ChatTop } from "../../ChatTop";
import { ChatInput } from "../../ChatInput";
import { SettingScreen } from "../../SettingScreen";
import { useAppDispatch } from "@/types/state";
import { clearUnReadMessages } from "@/redux/slices/chat/slice";

const ChatMobile = ({ chat }: { chat: ChatType }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!!chat?.chatWith) {
      dispatch(clearUnReadMessages({ chatWith: chat.chatWith }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?.chatWith]);

  if (isSettingsOpen) {
    return (
      <SettingScreen
        setIsSettingsOpen={setIsSettingsOpen}
        image={chat.image}
        username={chat.username}
        chatWith={chat.chatWith}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-full relative">
      <div className="mx-4 my-4">
        <ChatTop
          id={chat.id}
          chatWith={chat.chatWith}
          username={chat.username}
          image={chat.image}
          previousProof={
            chat?.messages?.length > 0
              ? chat?.messages[chat?.messages?.length - 1]?.content?.proof
              : null
          }
          messages={chat?.messages?.map((msg) => msg?.content?.pureMessage)}
          setIsSettingsOpen={setIsSettingsOpen}
          isOnline={chat.receiperOnline}
          isTyping={chat.receiperTyping}
          chatType={chat.type}
          chatTerminateStatus={chat.terminatedState}
        />
      </div>
      <MessageList messages={chat?.messages} />
      <ChatInput
        chatType={chat.type}
        chatWith={chat?.chatWith}
        chat_id={chat?.id}
        signingPrivateKey58={chat?.senderPrivateKey}
        receiverPubKey58={chat?.receiverPublicKey}
        lengthOfMessage={chat?.messages?.length}
        previousProof={
          chat?.messages?.length > 0
            ? chat?.messages[chat?.messages?.length - 1]?.content?.proof
            : null
        }
        messages={chat?.messages?.map((msg) => msg?.content?.pureMessage) || []}
      />
    </div>
  );
};

export default ChatMobile;
