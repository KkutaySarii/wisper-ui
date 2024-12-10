import { useTheme } from "next-themes";
import Image from "next/image";

import { FileIcon } from "@/assets/svg/FileIcon";
import { SettingsIcon } from "@/assets/svg/SettingsIcon";
import { ShareIcon } from "@/assets/svg/ShareIcon";
import TrashIcon from "@/assets/svg/trash.svg";
import { APP_URL } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/types/state";
import { closeOverlay } from "@/redux/slices/overlaySlice";
import toast from "react-hot-toast";
import { deleteChat, settlementStart } from "@/redux/slices/chat/slice";
import { useRouter } from "next/navigation";
import { JsonProof } from "o1js";
import { useZkApp } from "@/states/ZkApp";
import { ChatState, TerminatedState } from "@/types/messages";
import { useEffect, useState } from "react";
import { chatClosed } from "@/redux/slices/socket/slice";

interface ChatSettingsProps {
  icon: React.ReactNode;
  text: string;
  isLast?: boolean;
  type?: "danger" | "primary";
  callback: () => void;
}

export const ChatSettings = ({
  chat_id,
  chatWith,
  setIsSettingsOpen,
  setIsDropdownOpen,
  previousProof,
  messages,
  chatType,
  chatTerminateStatus,
}: {
  chat_id: string;
  chatWith: string;
  setIsSettingsOpen: (value: boolean) => void;
  setIsDropdownOpen: (value: boolean) => void;
  previousProof: JsonProof | null;
  messages: string[];
  chatType: ChatState;
  chatTerminateStatus: TerminatedState | null;
}) => {
  const { theme } = useTheme();

  const { settleContract } = useZkApp();

  const chat_link_url = `${APP_URL}/chat/${chat_id}`;

  const dispatch = useAppDispatch();

  const [items, setItems] = useState<ChatSettingsProps[]>([]);

  const router = useRouter();

  const publicKey58 = useAppSelector((state) => state.session.publicKeyBase58);

  const settleContractFunc = async () => {
    const userConfirmed = confirm("Are you sure you want to settle this chat?");
    if (!userConfirmed) return;
    dispatch(settlementStart({ chat_id }));
    dispatch(
      chatClosed({
        chat_id,
        chatType: "terminated",
      })
    );
    await settleContract({
      params: {
        publicKey58,
        guestPublicKey58: chatWith,
        chat_id,
        settleProof: previousProof!,
        messages,
      },
    });
  };

  useEffect(() => {
    const updatedItems: ChatSettingsProps[] = [
      {
        icon: <ShareIcon theme={theme} size={20} />,
        text: "Share Link",
        callback: () => {
          if (chatType === "terminated") {
            toast.error("Chat is already terminated", {
              position: "top-right",
            });
            return;
          } else if (chatType === "departed") {
            toast.error("Chat is already departed", {
              position: "top-right",
            });
            return;
          }
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
        text:
          chatType === "terminated" &&
          (chatTerminateStatus?.status === "DEPLOYING" ||
            chatTerminateStatus?.status === "SETTLEING")
            ? "Settling Chat"
            : chatTerminateStatus?.status === "SETTLED"
            ? `Chat Settled`
            : "Settle Chat",
        icon:
          chatType === "terminated" &&
          (chatTerminateStatus?.status === "DEPLOYING" ||
            chatTerminateStatus?.status === "SETTLEING") ? (
            <div className="w-4 h-4 border-b border-t border-r dark:border-white border-black rounded-full animate-spin"></div>
          ) : (
            <FileIcon theme={theme} />
          ),
        callback: () => {
          // if (chatType !== "terminated") {
          //   settleContractFunc();
          // } else if (
          //   chatType === "terminated" &&
          //   chatTerminateStatus?.status === "SETTLED"
          // ) {
          //   router.push(
          //     `https://minascan.io/devnet/tx/${chatTerminateStatus?.settleTxHash}?type=zk-tx`
          //   );
          // }
          settleContractFunc();
        },
      },
      ...(chatType === "terminated" || chatType === "departed"
        ? [
            {
              text: "Delete Chat",
              icon: (
                <Image src={TrashIcon} alt="trash" width={20} height={20} />
              ),
              type: "danger" as any,
              callback: () => {
                dispatch(deleteChat({ chat_id }));
                router.push("/home");
              },
            },
          ]
        : []),
    ];

    setItems(updatedItems);
  }, [chatType, chatTerminateStatus, theme, chat_id, chatWith]);

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
