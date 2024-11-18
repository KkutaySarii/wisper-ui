import { useTheme } from "next-themes";
import Image from "next/image";

import { FileIcon } from "@/assets/svg/FileIcon";
import { SettingsIcon } from "@/assets/svg/SettingsIcon";
import { ShareIcon } from "@/assets/svg/ShareIcon";
import TrashIcon from "@/assets/svg/trash.svg";
import { APP_URL } from "@/lib/constants";
import { useAppDispatch } from "@/types/state";
import { closeOverlay } from "@/redux/slices/overlaySlice";
import toast from "react-hot-toast";
import { deleteChat } from "@/redux/slices/chat/slice";
import { useRouter } from "next/navigation";

interface ChatSettingsProps {
  icon: React.ReactNode;
  text: string;
  isLast?: boolean;
  type?: "danger" | "primary";
  callback: () => void;
}

export const ChatSettings = ({
  chat_id,
  setIsSettingsOpen,
  setIsDropdownOpen,
}: {
  chat_id: string;
  setIsSettingsOpen: (value: boolean) => void;
  setIsDropdownOpen: (value: boolean) => void;
}) => {
  const { theme } = useTheme();

  const chat_link_url = `${APP_URL}/chat/${chat_id}`;

  const dispatch = useAppDispatch();

  const router = useRouter();

  const items: ChatSettingsProps[] = [
    {
      icon: <ShareIcon theme={theme} size={20} />,
      text: "Share Link",
      callback: () => {
        window.navigator.clipboard.writeText(chat_link_url);
        toast.success("Copied to clipboard!", {
          position: "top-right",
        });
      },
    },
    {
      text: "Recipient Settings",
      icon: <SettingsIcon theme={theme} />,
      callback: () => {
        setIsSettingsOpen(true);
      },
    },
    {
      text: "Chat Settlement",
      icon: <FileIcon theme={theme} />,
      callback: () => {
        //TODO: Implement chat settlement
      },
    },
    {
      text: "Delete Chat",
      icon: <Image src={TrashIcon} alt="trash" width={20} height={20} />,
      type: "danger",
      callback: () => {
        dispatch(deleteChat({ chat_id }));
        router.push("/home");
      },
    },
  ];
  return (
    <div className="bg-white dark:bg-dark-bg rounded-[20px] flex flex-col absolute top-[72px] right-4 z-50">
      {items.map((item, index) => (
        <ChatSettingsItem
          key={index}
          isLast={items.length - 1 === index}
          callback={() => {
            item.callback();
            setIsDropdownOpen(false);
            dispatch(closeOverlay());
          }}
          icon={item.icon}
          text={item.text}
          type={item.type}
        />
      ))}
    </div>
  );
};

const ChatSettingsItem = ({
  icon,
  text,
  isLast,
  type,
  callback,
}: ChatSettingsProps) => {
  return (
    <button
      onClick={callback}
      className={`px-5 py-3 flex items-center gap-x-2 ${
        !isLast ? "border-b" : "border-0"
      } border-light-grey`}
    >
      {icon}
      <p
        className={`text-sm font-semibold ${
          type === "danger" ? "text-[#EA4343]" : "text-black dark:text-white"
        }`}
      >
        {text}
      </p>
    </button>
  );
};
