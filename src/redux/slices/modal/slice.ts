import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  modal: null | React.ReactNode;
} = {
  modal: null,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        modal: React.ReactNode;
      }>
    ) => {
      state.modal = action.payload.modal;
    },
    closeModal: (state) => {
      state.modal = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
