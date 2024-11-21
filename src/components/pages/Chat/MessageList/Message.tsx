import { MessageType } from "@/types/messages";

export const Message = ({ message }: { message: MessageType }) => {
  if (message?.isMine) {
    return <SenderMessage message={message} />;
  }
  return <ReceiverMessage message={message} />;
};

export const SenderMessage = ({ message }: { message: MessageType }) => {
  return (
    <div className="flex w-full justify-end items-center">
      <div className="bg-light-sender-bg px-4 max-w-[80%] rounded-[44px] font-light py-2.5 text-light-text-secondary flex items-center gap-x-8">
        <p className="text-base">{message?.content?.pureMessage}</p>
        <p className="text-opacity-60 text-[8px] whitespace-nowrap">
          {message?.time}
        </p>
      </div>
    </div>
  );
};

export const ReceiverMessage = ({ message }: { message: MessageType }) => {
  return (
    <div className="flex w-full justify-start items-center">
      <div className="bg-light-receiver-bg max-w-[80%] px-4 text-white font-light rounded-[44px] py-2.5 flex items-center gap-x-8">
        <p className="text-base">{message?.content?.pureMessage}</p>
        <p className="text-opacity-60 text-[8px] whitespace-nowrap">
          {message?.time}
        </p>
      </div>
    </div>
  );
};
