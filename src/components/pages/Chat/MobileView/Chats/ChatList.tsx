import { useAppSelector } from "@/types/state";
import { ChatComp } from "../../ChatComp";

export const ChatList = () => {
  const { chats } = useAppSelector((state) => state.chat);
  return (
    <div className="flex flex-col overflow-auto mt-8 flex-1 max-h-full pb-[100px]">
      {chats.map((chat, index) => (
        <ChatComp
          key={chat.id}
          chat={{
            isSelected: false,
            isLastChat: index === chats.length - 1,
            ...chat,
          }}
        />
      ))}
    </div>
  );
};
