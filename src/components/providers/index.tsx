"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";

import { useMounted } from "@/hooks/useMounted";
import { store } from "@/redux/store";
import { SessionProvider } from "./SessionProvider";
import { Overlay } from "./Overlay";
import { ModalLayout } from "../modals/ModalLayout";
import { Toaster } from "react-hot-toast";
import { ZkAppProvider } from "./ZkAppProvider";
import { ScreenProtect } from "../common/ScreenProtect";

const MainProvider = ({
  children,
  publicKey,
}: {
  children: React.ReactNode;
  publicKey?: string;
}) => {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <Provider store={store}>
        <ScreenProtect>
          <Toaster />
          <ZkAppProvider>
            <SessionProvider publicKey={publicKey}>
              <ModalLayout />
              <Overlay />
              {children}
            </SessionProvider>
          </ZkAppProvider>
        </ScreenProtect>
      </Provider>
    </NextThemesProvider>
  );
};

export default MainProvider;
