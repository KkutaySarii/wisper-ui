import { useState } from "react";

import { useTheme } from "next-themes";

import { PlusSvg } from "@/assets/svg/PlusSvg";
import { KeyboardIcon } from "@/assets/svg/KeyboardIcon";
import { useAppDispatch } from "@/types/state";
import { openModal } from "@/redux/slices/modal/slice";
import { CreateChat } from "./CreateChat";
import { isValidChatLink } from "@/utils/isValidUrl";
import { useRouter } from "next/navigation";
import { APP_URL } from "@/lib/constants";
import { usePageWidth } from "@/hooks/usePageWidth";

export const StartChatModal = ({ close }: { close: () => void }) => {
  const { theme } = useTheme();

  const dispatch = useAppDispatch();

  const router = useRouter();

  const pageWidth = usePageWidth();

  const [link, setLink] = useState<string>("");

  const createChat = () => {
    close();
    dispatch(openModal({ modal: <CreateChat /> }));
  };

  const joinChat = () => {
    close();
    const isValid = isValidChatLink(link);
    if (isValid) {
      router.push(link);
    } else {
      const url = `${APP_URL}/chat/${link}`;
      router.push(url);
    }
  };

  return (
    <div
      className={`fixed ${
        pageWidth <= 700
          ? "left-4 bottom-9"
          : "left-1/2 -translate-x-1/2 w-fit top-1/2 -translate-y-1/2"
      } font-roboto right-4 z-[60] bg-white dark:bg-dark-bg flex flex-col rounded-[20px]`}
    >
      <button
        onClick={createChat}
        className="p-5 flex items-center gap-x-2 border-b border-light-grey"
      >
        <PlusSvg theme={theme} size={24} />
        <span className="font-semibold text-sm">Create a Chat</span>
      </button>
      <div className="p-5 flex items-center gap-x-2 relative">
        <KeyboardIcon theme={theme} />
        <label htmlFor="" className="flex-1 pr-10">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            type="text"
            className="bg-transparent flex-1 w-full outline-none"
            placeholder="enter code or link"
          />
        </label>
        {link && (
          <button
            onClick={joinChat}
            className="text-[#793EEE] dark:text-secondary text-sm font-semibold absolute right-5 top-1/2 -translate-y-1/2"
          >
            Join
          </button>
        )}
      </div>
    </div>
  );
};
