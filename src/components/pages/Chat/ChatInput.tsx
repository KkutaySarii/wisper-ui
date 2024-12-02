import React, { useState } from "react";

import { useTheme } from "next-themes";

import { UpIcon } from "@/assets/svg/UpIcon";
import { useAppDispatch, useAppSelector } from "@/types/state";
import { setNewMessage } from "@/redux/slices/chat/slice";
import {
  sendMessageSocket,
  userStopTyping,
  userTyping,
} from "@/redux/slices/socket/slice";
import { JsonProof, PrivateKey, PublicKey } from "o1js";

export const ChatInput = ({
  chatWith,
  chat_id,
  signingPrivateKey58,
  receiverPubKey58,
  lengthOfMessage,
  previousProof,
  messages,
}: {
  chatWith: string | null;
  chat_id: string;
  signingPrivateKey58: string;
  receiverPubKey58: string;
  lengthOfMessage: number;
  previousProof: JsonProof | null;
  messages: string[];
}) => {
  const [message, setMessage] = useState<string>("");

  const [isGeneratingProof, setIsGeneratingProof] = useState<boolean>(false);

  const typerPk = useAppSelector((state) => state.session.publicKeyBase58);

  const zkProgramClient = useAppSelector((state) => state.zkApp.zkProgram);

  const dispatch = useAppDispatch();

  const { theme } = useTheme();

  if (!chatWith) {
    return null;
  }

  const sendMessage = async () => {
    if (!message || !zkProgramClient) {
      return;
    }
    setIsGeneratingProof(true);
    if (!signingPrivateKey58 || !receiverPubKey58) {
      setIsGeneratingProof(false);
      return;
    }
    console.log("generating proof");

    const signingPrivateKey = PrivateKey.fromBase58(signingPrivateKey58);
    const receiverPublicKey = PublicKey.fromBase58(receiverPubKey58);
    let respProof;
    if (lengthOfMessage === 0) {
      respProof = await zkProgramClient.generateProof({
        signingPrivateKey,
        pureMessage: message,
        receiverPublicKey,
      });
    } else if (previousProof) {
      respProof = await zkProgramClient.generateProofWithPreviousProof({
        signingPrivateKey,
        pureMessage: message,
        receiverPublicKey,
        messageIndex: lengthOfMessage,
        previousProof: previousProof,
        messages,
      });
    }

    //TODO: add loading state
    console.log("respProof", respProof);
    setIsGeneratingProof(false);

    if (!respProof) {
      return; // TODO: Handle error with toast
    }

    const messagePack = {
      proof: respProof?.proof,
      encryptedMessage: respProof?.encryptedMessage,
      pureMessage: message,
    };

    dispatch(setNewMessage({ chatWith, newMessagePack: messagePack }));
    dispatch(
      sendMessageSocket({
        senderPk: typerPk ?? "",
        chatId: chat_id,
        message: respProof,
        receiver58: chatWith,
      })
    );
    setMessage("");
    dispatch(
      userStopTyping({
        chat_id: chat_id,
        stopperPk: typerPk ?? "",
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="absolute left-3 right-3 mobile:bottom-[18px] bottom-[48px] flex items-center gap-x-2">
      <label htmlFor="chat-input" className="w-full">
        <input
          id="chat-input"
          type="text"
          className="w-full border border-light-input-border bg-transparent dark:bg-[#151515] rounded-[44px] h-12 px-4 text-sm outline-none"
          placeholder="Type a message"
          value={message}
          disabled={isGeneratingProof}
          onChange={(e) => {
            setMessage(e.target.value);
            if (!!e.target.value) {
              dispatch(
                userTyping({ typerPk: typerPk ?? "", chat_id: chat_id })
              );
            } else {
              dispatch(
                userStopTyping({
                  chat_id: chat_id,
                  stopperPk: typerPk ?? "",
                })
              );
            }
          }}
          onKeyDown={handleKeyDown}
        />
      </label>
      <button
        disabled={isGeneratingProof}
        onClick={sendMessage}
        className={`min-w-10 min-h-10 transition-all flex items-center justify-center rounded-full ${
          !!message
            ? "bg-secondary cursor-pointer"
            : "bg-primary cursor-default"
        }`}
      >
        {isGeneratingProof ? (
          <div className="w-4 h-4 border-b border-t border-r dark:border-black border-white rounded-full animate-spin"></div>
        ) : (
          <UpIcon theme={theme} />
        )}
      </button>
    </div>
  );
};
