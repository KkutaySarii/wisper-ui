import { configureStore } from "@reduxjs/toolkit";

import chatReducer from "./slices/chat/slice";
import overlayReducer from "./slices/overlaySlice";
import sessionReducer from "./slices/session/slice";
import modalReducer from "./slices/modal/slice";
import socketReducer from "./slices/socket/slice";
import zkAppReducer from "./slices/zkApp/slice";

// Store'u yapılandır
export const store = configureStore({
  reducer: {
    session: sessionReducer,
    chat: chatReducer,
    overlay: overlayReducer,
    modal: modalReducer,
    socket: socketReducer,
    zkApp: zkAppReducer,
  },
});

// RootState ve AppDispatch türlerini tanımla
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
