import { v4 as uuidv4 } from "uuid";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  ChatResponse,
  ChatType,
  ImageType,
  MessagePackType,
} from "@/types/messages";
import { getCurrentTime } from "@/utils/dateConverter";
import { createNewChat, joinChat } from "./thunk";
import { SignedResponse } from "@/types/auro";
import { JsonProof } from "o1js";
import { EncryptedData } from "@/lib/zkProgramWorker";

const initialState: ChatResponse = {
  chats: [],
  pubKey58: "",
};

const saveToLocalStorage = (pubKey58: string, chats: ChatType[]) => {
  const chatsToSave = chats.map((chat) => {
    return {
      ...chat,
      receiperOnline: false,
      receiperTyping: false,
    };
  });

  const saveData = {
    pubKey58,
    chats: chatsToSave,
  };
  localStorage.setItem(`chat-${pubKey58}`, JSON.stringify(saveData));
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUserPubKey: (state, action: PayloadAction<string>) => {
      state.pubKey58 = action.payload;
    },
    setChat: (state, action: PayloadAction<ChatResponse>) => {
      state.chats = action.payload.chats;
    },
    setUsername: (
      state,
      action: PayloadAction<{
        chatWith: string;
        username: string;
      }>
    ) => {
      const { chatWith, username } = action.payload;
      const chat = state.chats.find((chat) => chat.chatWith === chatWith);
      if (chat) {
        chat.username = username;
        saveToLocalStorage(state.pubKey58, state.chats);
      }
    },
    setImage: (
      state,
      action: PayloadAction<{
        chatWith: string;
        image: ImageType;
      }>
    ) => {
      const { chatWith, image } = action.payload;
      const chat = state.chats.find((chat) => chat.chatWith === chatWith);
      if (chat) {
        chat.image = image;
        saveToLocalStorage(state.pubKey58, state.chats);
      }
    },
    setNewMessage: (
      state,
      action: PayloadAction<{
        chatWith: string;
        newMessagePack: MessagePackType;
      }>
    ) => {
      const { chatWith, newMessagePack } = action.payload;
      const chat = state.chats.find((chat) => chat.chatWith === chatWith);
      if (chat) {
        const { timeStr, timestamp } = getCurrentTime();
        const message = {
          content: newMessagePack,
          isMine: true,
          time: timeStr,
          timestamp,
          id: uuidv4(),
        };
        chat?.messages.push(message);
        chat.lastMessage = message;
        saveToLocalStorage(state.pubKey58, state.chats);
      }
    },
    getNewMessage: (
      state,
      action: PayloadAction<{
        chatWith: string;
        newMessagePack: {
          proof: JsonProof;
          encryptedMessage: EncryptedData;
        };
        pureMessage: string;
        unRead: boolean;
      }>
    ) => {
      const { chatWith, newMessagePack, pureMessage } = action.payload;
      const chat = state.chats.find((chat) => chat.chatWith === chatWith);
      if (chat) {
        const { timeStr, timestamp } = getCurrentTime();
        const message = {
          content: {
            proof: newMessagePack.proof,
            encryptedMessage: newMessagePack.encryptedMessage,
            pureMessage: pureMessage,
          },
          isMine: false,
          time: timeStr,
          timestamp,
          id: uuidv4(),
        };
        chat?.messages.push(message);
        chat.lastMessage = message;
        if (action.payload.unRead) {
          chat.unReadMessages += 1;
        }
        saveToLocalStorage(state.pubKey58, state.chats);
      }
    },
    clearUnReadMessages: (
      state,
      action: PayloadAction<{
        chatWith: string;
      }>
    ) => {
      const { chatWith } = action.payload;
      const chat = state.chats.find((chat) => chat.chatWith === chatWith);
      if (chat) {
        chat.unReadMessages = 0;
        saveToLocalStorage(state.pubKey58, state.chats);
      }
    },
    setReceiverOnline: (
      state,
      action: PayloadAction<{
        chatWith: string;
        isOnline: boolean;
      }>
    ) => {
      const { chatWith, isOnline } = action.payload;
      const chat = state.chats.find((chat) => chat.chatWith === chatWith);
      if (chat) {
        chat.receiperOnline = isOnline;
      }
    },
    setReceiverTyping: (
      state,
      action: PayloadAction<{
        chatWith: string;
        isTyping: boolean;
      }>
    ) => {
      const { chatWith, isTyping } = action.payload;
      const chat = state.chats.find((chat) => chat.chatWith === chatWith);
      if (chat) {
        chat.receiperTyping = isTyping;
      }
    },
    departeChats: (
      state,
      action: PayloadAction<{
        offlineChats: string[];
      }>
    ) => {
      const { offlineChats } = action.payload;
      state.chats = state.chats.map((chat) => {
        if (offlineChats.includes(chat.id)) {
          return {
            ...chat,
            type: "departed",
          };
        }
        return chat;
      });

      saveToLocalStorage(state.pubKey58, state.chats);
    },
    setSignResult: (
      state,
      action: PayloadAction<{
        chat_id: string;
        keypairPrivateKey58: string;
        signResult: SignedResponse;
      }>
    ) => {
      const { chat_id, keypairPrivateKey58, signResult } = action.payload;
      const chat = state.chats.find((chat) => chat.id === chat_id);
      if (chat) {
        chat.signResult = signResult;
        chat.senderPrivateKey = keypairPrivateKey58;
        saveToLocalStorage(state.pubKey58, state.chats);
      }
    },
    setReceiverSignResult: (
      state,
      action: PayloadAction<{
        chat_id: string;
        keypairPublicKey: string;
      }>
    ) => {
      const { chat_id, keypairPublicKey } = action.payload;
      const chat = state.chats.find((chat) => chat.id === chat_id);
      if (chat) {
        chat.receiverPublicKey = keypairPublicKey;
        saveToLocalStorage(state.pubKey58, state.chats);
      }
    },
    deleteChat: (
      state,
      action: PayloadAction<{
        chat_id: string;
      }>
    ) => {
      const { chat_id } = action.payload;
      state.chats = state.chats.filter((chat) => chat.id !== chat_id);
      saveToLocalStorage(state.pubKey58, state.chats);
      window.location.href = "/home";
    },
    terminateChat: (
      state,
      action: PayloadAction<{
        chat_id: string;
      }>
    ) => {
      const { chat_id } = action.payload;
      state.chats = state.chats.map((chat) => {
        if (chat?.id === chat_id) {
          chat.type = "terminated";
          chat.terminatedState = {
            contractPublicKey58: null,
            deployTxHash: null,
            settleTxHash: null,
            settleProof: chat.lastMessage?.content?.proof,
            status: "NONE",
          };
        }
        return chat;
      });
      saveToLocalStorage(state.pubKey58, state.chats);
    },
    settlementStart: (
      state,
      action: PayloadAction<{
        chat_id: string;
      }>
    ) => {
      const { chat_id } = action.payload;
      state.chats = state.chats.map((chat) => {
        if (chat?.id === chat_id) {
          chat.terminatedState = {
            contractPublicKey58: null,
            deployTxHash: null,
            settleTxHash: null,
            settleProof: chat.lastMessage?.content?.proof,
            status: "DEPLOYING",
          };
          chat.type = "terminated";
        }
        return chat;
      });
      saveToLocalStorage(state.pubKey58, state.chats);
    },
    settlementDeployed: (
      state,
      action: PayloadAction<{
        chat_id: string;
        contractPublicKey58: string;
        deployTxHash: string;
      }>
    ) => {
      const { chat_id, contractPublicKey58, deployTxHash } = action.payload;
      state.chats = state.chats.map((chat) => {
        if (chat?.id === chat_id) {
          chat.terminatedState = {
            contractPublicKey58,
            deployTxHash,
            settleTxHash: null,
            settleProof: chat.lastMessage?.content?.proof,
            status: "DEPLOYED",
          };
        }
        return chat;
      });
      saveToLocalStorage(state.pubKey58, state.chats);
    },
    settlementContractStart: (
      state,
      action: PayloadAction<{
        chat_id: string;
      }>
    ) => {
      const { chat_id } = action.payload;
      state.chats = state.chats.map((chat) => {
        if (chat?.id === chat_id) {
          chat.terminatedState = {
            ...chat.terminatedState,
            status: "SETTLEING",
          };
        }
        return chat;
      });
      saveToLocalStorage(state.pubKey58, state.chats);
    },
    settlementSuccess: (
      state,
      action: PayloadAction<{
        chat_id: string;
        settleTxHash: string;
      }>
    ) => {
      const { chat_id, settleTxHash } = action.payload;
      state.chats = state.chats.map((chat) => {
        if (chat?.id === chat_id) {
          chat.terminatedState = {
            ...chat.terminatedState,
            settleTxHash: settleTxHash,
            status: "SETTLED",
          };
        }
        return chat;
      });
      saveToLocalStorage(state.pubKey58, state.chats);
    },
    settlementFailed: (
      state,
      action: PayloadAction<{
        chat_id: string;
      }>
    ) => {
      const { chat_id } = action.payload;
      state.chats = state.chats.map((chat) => {
        if (chat?.id === chat_id) {
          chat.terminatedState = {
            ...chat.terminatedState,
            status: "FAILED",
          };
        }
        return chat;
      });
      saveToLocalStorage(state.pubKey58, state.chats);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createNewChat.fulfilled, (state, action) => {
        const newChat: ChatType = {
          id: action.payload.chat_id,
          chatWith: action.payload.receiverPublicKey,
          username: null,
          image: "default",
          type: "active",
          unReadMessages: 0,
          lastMessage: null,
          messages: [],
          receiperOnline: false,
          receiperTyping: false,
          senderPrivateKey: action.payload.signingPrivateKey,
          receiverPublicKey: "",
          signResult: action.payload.signResult,
          terminatedState: null,
        };
        state.chats.push(newChat);
        saveToLocalStorage(action.payload.senderPublicKey, state.chats);
      })
      .addCase(joinChat.fulfilled, (state, action) => {
        const isChatExist = state.chats.find(
          (chat) => chat.id === action.payload.chat_id
        );
        if (isChatExist) return;
        const newChat: ChatType = {
          id: action.payload.chat_id,
          chatWith: action.payload.chatWith,
          username: null,
          image: "default",
          type: "active",
          unReadMessages: 0,
          lastMessage: null,
          messages: [],
          receiperOnline: false,
          receiperTyping: false,
          senderPrivateKey: "",
          receiverPublicKey: "",
          signResult: null,
          terminatedState: null,
        };
        state.chats.push(newChat);
        saveToLocalStorage(state.pubKey58, state.chats);
      });
  },
});

export const {
  setChat,
  setUsername,
  setImage,
  setNewMessage,
  clearUnReadMessages,
  setReceiverOnline,
  setReceiverTyping,
  getNewMessage,
  setUserPubKey,
  departeChats,
  setSignResult,
  setReceiverSignResult,
  deleteChat,
  settlementStart,
  settlementDeployed,
  settlementContractStart,
  settlementSuccess,
  settlementFailed,
  terminateChat,
} = chatSlice.actions;

export default chatSlice.reducer;
