import { useEffect, useState } from "react";

import { MessageType } from "@/types/messages";
import { Message } from "./Message";

const MessageList = ({ messages }: { messages: MessageType[] }) => {
  const [showMessages, setShowMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    setShowMessages([...messages].reverse());
  }, [messages]);

  return (
    <div className="mobile:max-h-[calc(100%_-_180px)] mobile:h-[calc(100%_-_180px)] max-h-[calc(100%_-_200px)] h-[calc(100%_-_190px)] gap-y-1 px-6 overflow-auto flex flex-col-reverse font-sora">
      {showMessages?.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessageList;
