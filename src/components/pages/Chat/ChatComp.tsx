import Image from "next/image";

import { ChatType } from "@/types/messages";
import { useRouter } from "next/navigation";

interface ChatCompProps {
  chat: {
    isSelected?: boolean;
    isLastChat?: boolean;
  } & Omit<ChatType, "messages">;
}

export const ChatComp = ({ chat }: ChatCompProps) => {
  const router = useRouter();

  const handleChatClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    router.push(`/chat/${chat.id}`);
  };

  return (
    <div
      onClick={handleChatClick}
      className={`p-4 cursor-pointer border-secondary hover:bg-primary dark:bg-opacity-60 transition-all flex font-sora items-center gap-x-3 ${
        chat?.isSelected ? "bg-primary" : ""
      } ${chat?.isLastChat ? "border-b-0" : "border-b"}`}
    >
      <Image
        alt="user"
        src={`/users/${chat.image}.svg`}
        width={48}
        height={48}
      />
      <div className="h-12 flex-1 py-1 flex flex-col justify-between">
        <p className="font-semibold text-light-chats-text dark:text-white text-base">
          {chat.username
            ? chat.username
            : chat?.chatWith?.slice(0, 12) + "..." + chat?.chatWith?.slice(-6)}
        </p>
        <p className="truncate font-semibold max-w-[250px] text-opacity-60 text-light-chats-text dark:text-white text-xs">
          {chat.lastMessage?.content?.pureMessage}
        </p>
      </div>
      <div className="h-12 py-1 flex flex-col items-end justify-between">
        <p className="font-medium text-opacity-60 text-light-chats-text dark:text-light-grey text-[10px]">
          {chat.lastMessage?.time}
        </p>
        {chat?.unReadMessages > 0 && (
          <div className="min-w-4 min-h-4 w-4 h-4 flex items-center justify-center rounded-full bg-light-chats-unread dark:bg-secondary">
            <span className="text-white dark:text-black text-[10px] font-medium">
              {chat.unReadMessages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
