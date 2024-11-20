import { useTheme } from "next-themes";

import { RightArrowIcon } from "@/assets/svg/RightArrowIcon";
import { useAppDispatch, useAppSelector } from "@/types/state";
import { closeModal, openModal } from "@/redux/slices/modal/slice";
import { StartChatModal } from "@/components/modals/StartChatModal";

export const StartChat = () => {
  const { theme } = useTheme();

  const dispatch = useAppDispatch();

  const { modal } = useAppSelector((state) => state.modal);

  const handleStartChat = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      openModal({
        modal: (
          <StartChatModal
            close={() => {
              dispatch(closeModal());
            }}
          />
        ),
      })
    );
  };

  return (
    <div
      onClick={handleStartChat}
      className={`py-3 cursor-pointer transition-all font-sora rounded-full bg-secondary px-5 flex gap-x-4 items-center justify-between max-[410px]:w-full w-[335px] ${
        !modal ? "hover:bg-primary " : "opacity-50 pointer-events-none"
      } `}
    >
      <div className="flex items-center gap-x-3">
        <p className="text-xl dark:text-black text-white">Start Chatting</p>
      </div>
      <div className="min-w-[46px] min-h-[46px] rounded-full flex items-center justify-center dark:bg-white bg-black">
        <RightArrowIcon theme={theme} />
      </div>
    </div>
  );
};
