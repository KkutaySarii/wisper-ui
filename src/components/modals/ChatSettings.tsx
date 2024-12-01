import { useTheme } from "next-themes";
import Image from "next/image";

import { FileIcon } from "@/assets/svg/FileIcon";
import { SettingsIcon } from "@/assets/svg/SettingsIcon";
import { ShareIcon } from "@/assets/svg/ShareIcon";
import TrashIcon from "@/assets/svg/trash.svg";
import { APP_URL, TRANSACTION_FEE } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/types/state";
import { closeOverlay } from "@/redux/slices/overlaySlice";
import toast from "react-hot-toast";
import { deleteChat } from "@/redux/slices/chat/slice";
import { useRouter } from "next/navigation";
import { timeout } from "@/utils/timeout";
import { PrivateKey, PublicKey } from "o1js";
import ZkAppWorkerClient from "@/lib/zkProgramWorkerClient";

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

  const publicKey58 = useAppSelector((state) => state.session.publicKeyBase58);

  const settleContract = async () => {
    const zkappWorkerClient = new ZkAppWorkerClient();

    await timeout(5);

    await zkappWorkerClient.setActiveInstanceToDevnet();

    const mina = window.mina;

    if (mina == null) {
      return;
    }

    const deployerPublicKey = PublicKey.fromBase58(publicKey58);
    console.log("Using public key:", publicKey58);

    const resFetchAccount = await zkappWorkerClient.fetchAccount({
      publicKey: deployerPublicKey!,
    });
    const accountExists = resFetchAccount.error == null;

    console.log("Account exists:", accountExists);

    console.log("Loading contract...");
    await zkappWorkerClient.loadContract();

    console.log("compiling contract...");
    await zkappWorkerClient.compileContract();

    console.log("zkApp compiled");

    console.log("Deploying contract...");

    const privateKey: PrivateKey = PrivateKey.random();

    console.log("Generated private key:", privateKey.toBase58());

    const zkappPublicKey = privateKey.toPublicKey();
    const contractPK = zkappPublicKey.toBase58();

    console.log("Contract public key:", contractPK);

    console.log("creating deploy transaction...");

    await zkappWorkerClient!.deployContract(privateKey, deployerPublicKey);

    console.log("getting transaction JSON...");

    const transactionJSON = await zkappWorkerClient!.getTransactionJSON();

    console.log("checking AURO connection...");

    const network = await window.mina.requestNetwork();

    console.log(`Network: ${network}`);

    console.log("sending transaction...");

    const { hash } = await window.mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: TRANSACTION_FEE,
        memo: "",
      },
    });
    console.log("Transaction hash:", hash);

    await zkappWorkerClient!.waitTransaction();

    console.log(
      "tx in minascan " + `https://minascan.io/devnet/tx/${hash}?type=zk-tx`
    );
  };

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
        settleContract();
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
