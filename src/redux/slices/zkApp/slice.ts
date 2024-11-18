import ZkProgramWorkerClient from "@/lib/zkProgramWorkerClient";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  zkProgram: null | ZkProgramWorkerClient;
} = {
  zkProgram: null,
};

export const zkAppSlice = createSlice({
  name: "zkApp",
  initialState,
  reducers: {
    setZkProgram: (
      state,
      action: PayloadAction<{
        zkProgram: ZkProgramWorkerClient;
      }>
    ) => {
      state.zkProgram = action.payload.zkProgram;
    },
  },
});

export const { setZkProgram } = zkAppSlice.actions;

export default zkAppSlice.reducer;
