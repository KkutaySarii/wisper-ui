"use client";
import { useTheme } from "next-themes";

import { RightArrowIcon } from "@/assets/svg/RightArrowIcon";
import { WalletIcon } from "@/assets/svg/WalletIcon";
import { useConnectWallet } from "@/hooks/useConnectWallet";

export const ConnectWallet = () => {
  const { theme } = useTheme();

  const { handleConnectWallet } = useConnectWallet();

  const handleConnect = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleConnectWallet();
  };

  return (
    <div
      onClick={handleConnect}
      className="py-3 cursor-pointer hover:bg-primary transition-all font-sora rounded-full bg-secondary px-5 flex items-center justify-between w-[335px] mobile:w-fit"
    >
      <div className="flex items-center gap-x-3">
        <WalletIcon />
        <p className="text-base dark:text-black text-white">Connect Wallet</p>
      </div>
      <div className="min-w-[46px] min-h-[46px] rounded-full mobile:hidden flex items-center justify-center dark:bg-white bg-black">
        <RightArrowIcon theme={theme} />
      </div>
    </div>
  );
};
