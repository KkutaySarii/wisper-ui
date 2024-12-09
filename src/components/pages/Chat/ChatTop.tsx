import { FC, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { BackIcon } from "@/assets/svg/BackIcon";
import { SettingsIcon } from "@/assets/svg/SettingsIcon";
import { useAppDispatch } from "@/types/state";
import { ChatSettings } from "@/components/modals/ChatSettings";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { closeOverlay, openOverlay } from "@/redux/slices/overlaySlice";
import { JsonProof } from "o1js";
import { ChatState, TerminatedState } from "@/types/messages";

interface ChatTopProps {
  id: string;
  chatWith: string | null;
  username: string | null;
  image: string;
  setIsSettingsOpen: (value: boolean) => void;
  isOnline: boolean;
  isTyping: boolean;
  previousProof: JsonProof | null;
  messages: string[];
  chatType: ChatState;
  chatTerminateStatus: TerminatedState | null;
}

export const ChatTop: FC<ChatTopProps> = ({
  id,
  chatWith,
  username,
  image,
  setIsSettingsOpen,
  isOnline,
  isTyping,
  previousProof,
  messages,
  chatType,
  chatTerminateStatus,
}) => {
  const { theme } = useTheme();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const router = useRouter();

  const dispatch = useAppDispatch();

  const handleSettings = () => {
    setIsDropdownOpen((prev) => {
      dispatch(openOverlay());
      return !prev;
    });
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
    dispatch(closeOverlay());
  };

  const ref = useOutsideClick(closeDropdown, isDropdownOpen);

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <button
          onClick={() => router.push("/chat")}
          className="pr-4 min-[701px]:hidden"
        >
          <BackIcon theme={theme} />
        </button>
        <div className="flex items-stretch gap-x-3">
          <Image
            alt="user"
            src={`/users/${image}.svg`}
            width={64}
            height={64}
          />
          <div
            className={`h-12 flex-1 py-1 gap-y-1 flex flex-col ${
              username ? "justify-between " : "justify-center"
            }`}
          >
            {username && (
              <p className="font-semibold text-light-text-secondary dark:text-white text-base">
                {username}
              </p>
            )}
            <p
              className={` font-semibold  text-light-chats-text dark:text-white text-xs ${
                username ? "text-opacity-60" : ""
              }`}
            >
              {chatWith?.slice(0, 24) + "..." + chatWith?.slice(-12)}
            </p>
            <div className="flex items-center gap-x-1">
              {!isTyping && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
              )}
              {isTyping ? (
                <p className={`text-xs font-thin`}>Typing...</p>
              ) : (
                <p
                  className={`text-xs font-thin ${
                    isOnline ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div ref={ref}>
        <button onClick={handleSettings} className="p-2">
          <SettingsIcon theme={theme} />
        </button>
        {isDropdownOpen && (
          <ChatSettings
            chat_id={id}
            previousProof={previousProof}
            messages={messages}
            chatWith={chatWith}
            setIsSettingsOpen={setIsSettingsOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            chatType={chatType}
            chatTerminateStatus={chatTerminateStatus}
          />
        )}
      </div>
    </div>
  );
};
