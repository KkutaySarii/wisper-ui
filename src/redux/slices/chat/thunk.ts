import { SignedResponse } from "@/types/auro";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createNewChat = createAsyncThunk(
  "chat/createNewChat",
  async (
    data: {
      senderPublicKey: string;
      receipientPublicKey: string;
      signingPrivateKey: string;
      signResult: SignedResponse;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/chat_id/create", {
        method: "POST",
        body: JSON.stringify({
          senderPublicKey: data.senderPublicKey,
          receiverPublicKey: data.receipientPublicKey,
        }),
      }).then((r) => r.json());
      if (res.status === 200) {
        return {
          ...res?.data,
          senderPublicKey: data.senderPublicKey,
          signingPrivateKey: data.signingPrivateKey,
          signResult: data.signResult,
        };
      }
      return rejectWithValue("Failed to create chat");
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const joinChat = createAsyncThunk(
  "chat/joinChat",
  async (
    data: {
      chat_id: string;
      publicKey: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/chat_id/join", {
        method: "POST",
        body: JSON.stringify({
          chat_id: data.chat_id,
          publicKey: data.publicKey,
        }),
      }).then((r) => r.json());
      if (res.status === 200) {
        const chatWith =
          data?.publicKey === res.data.senderPublicKey
            ? res.data.receiverPublicKey
            : res.data.senderPublicKey;
        return {
          chat_id: res.data.chat_id,
          chatWith,
        };
      }
      return rejectWithValue("Failed to join chat");
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
