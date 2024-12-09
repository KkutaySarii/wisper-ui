import Image from "next/image";
import { StartChat } from "../pages/Chat/MobileView/Chats/StartChat";

export const EmptyChat = () => {
  return (
    <div className="col-span-11 mobile:h-full h-screen relative flex flex-col gap-y-10 items-center justify-center">
      <Image
        src="/images/empty.png"
        alt="Empty Chat"
        width={500}
        height={500}
        className="mt-10"
      />
      <p className="font-light text-light-text-secondary dark:text-dark-grey">
        Start a conversation to begin messaging.
      </p>
      <div className="mobile:hidden block absolute top-10 right-10">
        <StartChat />
      </div>
    </div>
  );
};
