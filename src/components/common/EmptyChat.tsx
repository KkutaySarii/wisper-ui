import Image from "next/image";

export const EmptyChat = () => {
  return (
    <div className="col-span-11 flex flex-col gap-y-10 items-center justify-center">
      <Image
        src="/images/empty.png"
        alt="Empty Chat"
        width={500}
        height={500}
      />
      <p className="font-light text-light-text-secondary dark:text-dark-grey">
        Start a conversation to begin messaging.
      </p>
    </div>
  );
};
