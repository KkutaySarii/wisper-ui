import { useTheme } from "next-themes";

import { PlusSvg } from "@/assets/svg/PlusSvg";
import { useAppDispatch } from "@/types/state";
import { useState } from "react";
import { closeOverlay, openOverlay } from "@/redux/slices/overlaySlice";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { StartChatModal } from "@/components/modals/StartChatModal";

export const ChatsTop = () => {
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
    <div className="flex font-sora justify-between items-center gap-2 px-3 flex-wrap">
      <h3 className="font-semibold text-2xl">Messages</h3>
      <div ref={ref} className="relative">
        <button
          onClick={toggle}
          className="bg-secondary flex items-center px-4 py-3 rounded-2xl shadow-lg hover:bg-primary transition-all"
        >
          <PlusSvg theme={theme} />
          <p className="text-sm font-medium">Start</p>
        </button>
        {isOpen && <StartChatModal close={close} />}
      </div>
    </div>
  );
};
