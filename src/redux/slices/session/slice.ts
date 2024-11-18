import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { deletePublicKeyCookie, setPublicKeyCookie } from "./thunk";
import { SessionState } from "@/types/session";
import { ImageType } from "@/types/messages";

const initialState: SessionState = {
  publicKeyBase58: null,
  image: "default",
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setPublicKey: (state, action: PayloadAction<string>) => {
      state.publicKeyBase58 = action.payload;
    },
    setImage: (state, action: PayloadAction<ImageType>) => {
      state.image = action.payload;
      localStorage.setItem("user_image", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setPublicKeyCookie.fulfilled, (state, action) => {
        state.publicKeyBase58 = action.payload
          ? action.payload.publicKeyBase58
          : null;
      })
      .addCase(deletePublicKeyCookie.fulfilled, (state) => {
        state.publicKeyBase58 = null;
      });
  },
});

export const { setPublicKey, setImage } = sessionSlice.actions;

export default sessionSlice.reducer;
