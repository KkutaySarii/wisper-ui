import { FC, useState } from "react";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { DownIcon } from "@/assets/svg/DownIcon";
import { useAppDispatch, useAppSelector } from "@/types/state";
import { useOutsideClick } from "@/hooks/useOutsideClick";

import SignOutIcon from "@/assets/svg/signout.svg";
import { SettingsIcon } from "@/assets/svg/SettingsIcon";
import { DarkIcon } from "@/assets/svg/DarkIcon";
import { LightIcon } from "@/assets/svg/LightIcon";
import { closeOverlay, openOverlay } from "@/redux/slices/overlaySlice";
import { deletePublicKeyCookie } from "@/redux/slices/session/thunk";
import { ShareIcon } from "@/assets/svg/ShareIcon";

interface ProfileDropdownProps {
  page?: "entry" | "chat";
}

export const Profile: FC<ProfileDropdownProps> = ({ page = "chat" }) => {
  const { image } = useAppSelector((state) => state.session);

  const { publicKeyBase58 } = useAppSelector((state) => state.session);

  const { theme } = useTheme();

  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeDropdown = () => {
    dispatch(closeOverlay());
    setIsOpen(false);
  };

  const ref = useOutsideClick(closeDropdown, isOpen);

  const handleDropdown = () => {
    setIsOpen((prev) => {
      if (prev) {
        dispatch(closeOverlay());
      } else {
        dispatch(openOverlay());
      }
      return !prev;
    });
  };

  if (!publicKeyBase58) return null;

  return (
    <div
      ref={ref}
      className="relative z-50 py-1 px-2 rounded-full dark:bg-[#151515] bg-[#f3f3f3]"
    >
      <button onClick={handleDropdown} className="flex items-center gap-x-2">
        <Image
          alt="user"
          src={`/users/${image}.svg`}
          width={page === "chat" ? 36 : 24}
          height={page === "chat" ? 36 : 24}
        />
        <DownIcon theme={theme} />
      </button>
      {isOpen && <ProfileDropdown page={page} closeDropdown={closeDropdown} />}
    </div>
  );
};

const ProfileDropdown = ({
  closeDropdown,
  page,
}: {
  closeDropdown: () => void;
  page: "entry" | "chat";
}) => {
  const { publicKeyBase58 } = useAppSelector((state) => state.session);

  const { theme, setTheme } = useTheme();

  const dispatch = useAppDispatch();

  const router = useRouter();

  const toggleTheme = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const signout = () => {
    dispatch(deletePublicKeyCookie());
    router.push("/home");
    closeDropdown();
  };

  const handleShare = () => {
    if (!publicKeyBase58) return;
    window.navigator.clipboard.writeText(publicKeyBase58);

    toast.success("Copied to clipboard!", {
      position: "top-right",
    });

    closeDropdown();
  };

  const handleProfileSettings = () => {
    router.push("/profile-settings");
    closeDropdown();
  };

  const darkMode = {
    icon: <DarkIcon />,
    text: "DARK",
    bgColor: "bg-[#303539]",
    translate: "translate-x-1",
  };

  const lightMode = {
    icon: <LightIcon />,
    text: "LIGHT",
    bgColor: "bg-purple",
    translate: "translate-x-6",
  };

  const mode = theme === "dark" ? darkMode : lightMode;

  return (
    <div className="absolute right-0 pb-5 font-roboto top-[52px] rounded-[20px] bg-white dark:bg-dark-bg flex flex-col w-[240px] z-50">
      <div className="p-5 flex flex-col gap-x-2.5 border-b border-light-grey">
        <p className="text-xs font-bold">
          {publicKeyBase58?.slice(0, 16) + "..." + publicKeyBase58?.slice(-6)}
        </p>
        <button onClick={signout} className="flex items-center gap-x-1">
          <span className="text-dark-grey font-bold text-xs">Sign Out</span>
          <Image src={SignOutIcon} alt="sign out" width={12} height={12} />
        </button>
      </div>
      <div
        onClick={handleShare}
        className="px-5 py-3 flex items-center cursor-pointer gap-x-1 border-b border-light-grey"
      >
        <ShareIcon theme={theme} size={20} />
        <span className="font-semibold text-sm">Share Your Public Key</span>
      </div>
      <div
        onClick={handleProfileSettings}
        className="px-5 py-3 flex items-center cursor-pointer gap-x-1 border-b border-light-grey"
      >
        <SettingsIcon theme={theme} size={20} />
        <span className="font-semibold text-sm">Profile Settings</span>
      </div>

      <div
        className={`px-5 py-3 items-center justify-between ${
          page === "chat" ? "flex" : "entire-profile-dropdown"
        }`}
      >
        <div className="flex items-center gap-x-2">
          {mode.icon}
          <span className="font-semibold text-sm">{mode.text}</span>
        </div>
        <div
          onClick={toggleTheme}
          className={`relative inline-flex cursor-pointer h-6 w-11 items-center rounded-full transition-colors duration-300 ${mode.bgColor}`}
        >
          <span
            className={`${mode.translate} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
          />
        </div>
      </div>
    </div>
  );
};
