import { ChatType } from "@/types/messages";
import { ChatsTop } from "./ChatsTop";
import { ChatComp } from "../ChatComp";
import { useParams } from "next/navigation";

interface ChatsProps {
  chats: ChatType[];
}

export const Chats = ({ chats }: ChatsProps) => {
  const params = useParams();

  const chat_id = params?.chat_id;

  return (
    <div className="col-span-5 py-5 bg-light-chats-bg dark:bg-dark-chats-bg rounded-[28px] overflow-hidden">
      <ChatsTop />
      <div className="flex flex-col overflow-auto mt-8 max-h-full">
        {chats.map((chat, index) => (
          <ChatComp
            key={chat.id}
            chat={{
              isSelected: chat_id === chat.id,
              isLastChat: index === chats.length - 1,
              ...chat,
            }}
          />
        ))}
      </div>
    </div>
  );
};
