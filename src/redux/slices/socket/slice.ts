import { EncryptedData } from "@/lib/zkProgramWorker";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JsonProof } from "o1js";
import { io } from "socket.io-client";

interface SocketState {
  socket: any;
}

const initialState: SocketState = {
  socket: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initSocket: (state) => {
      const socket = io(process.env.NEXT_PUBLIC_SERVER_URL as string);
      state.socket = socket;
    },
    createChat: (
      state,
      action: PayloadAction<{
        createrPk: string;
        chat_id: string;
      }>
    ) => {
      state.socket.emit(
        "create chat",
        action.payload.createrPk,
        action.payload.chat_id
      );
    },
    userTyping: (
      state,
      action: PayloadAction<{
        typerPk: string;
        chat_id: string;
      }>
    ) => {
      state.socket.emit(
        "typing",
        action.payload.chat_id,
        action.payload.typerPk
      );
    },
    userStopTyping: (
      state,
      action: PayloadAction<{
        chat_id: string;
        stopperPk: string;
      }>
    ) => {
      state.socket.emit(
        "stop typing",
        action.payload.chat_id,
        action.payload.stopperPk
      );
    },
    sendMessageSocket: (
      state,
      action: PayloadAction<{
        senderPk: string;
        chatId: string;
        message: {
          proof: JsonProof;
          encryptedMessage: EncryptedData;
        };
        receiver58: string;
      }>
    ) => {
      state.socket.emit("send message", {
        senderPk: action.payload.senderPk,
        chatId: action.payload.chatId,
        message: action.payload.message,
        receiverPk: action.payload.receiver58,
      });
    },
  },
});

export const {
  initSocket,
  createChat,
  userStopTyping,
  userTyping,
  sendMessageSocket,
} = socketSlice.actions;

export default socketSlice.reducer;
