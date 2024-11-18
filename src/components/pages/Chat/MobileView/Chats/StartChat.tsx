import { useTheme } from "next-themes";

import { PlusSvg } from "@/assets/svg/PlusSvg";
import { useAppDispatch } from "@/types/state";
import { useState } from "react";
import { closeOverlay, openOverlay } from "@/redux/slices/overlaySlice";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { StartChatModal } from "@/components/modals/StartChatModal";

export const StartChat = () => {
  const { theme } = useTheme();

  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const close = () => {
    setIsOpen(false);
    dispatch(closeOverlay());
  };

  const toggle = () => {
    setIsOpen((prev) => {
      dispatch(openOverlay());
      return !prev;
    });
  };

  const ref = useOutsideClick(close, isOpen);

  return (
    <div ref={ref} className="mb-9 flex w-full pr-4 justify-end">
      <button
        onClick={toggle}
        className="bg-secondary hover:bg-primary transition-all p-4 flex items-center gap-x-1 rounded-2xl shadow-lg"
      >
        <PlusSvg theme={theme} />
        <p className="text-sm ">Start</p>
      </button>
      {isOpen && <StartChatModal close={close} />}
    </div>
  );
};
