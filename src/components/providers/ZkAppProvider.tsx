import { useEffect, useState } from "react";

import ZkProgramWorkerClient from "@/lib/zkProgramWorkerClient";
import { setZkProgram } from "@/redux/slices/zkApp/slice";
import { useAppDispatch } from "@/types/state";
import { timeout } from "@/utils/timeout";
import { ZkAppProvider as ZkAppProviderContract } from "@/states/ZkApp";

export const ZkAppProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [loadingCLient, setLoadingClient] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      setLoadingClient(true);
      console.log("Starting processing...");

      const zkProgramClient = new ZkProgramWorkerClient();

      await timeout(5);
      console.log("Setting active instance to devnet...");

      await zkProgramClient.setActiveInstanceToDevnet();
      console.log("Loading program...");
      await zkProgramClient.loadProgram();

      console.log("Compiling program...");
      await zkProgramClient.compileProgram();

      console.log("Program loaded and compiled.");
      dispatch(
        setZkProgram({
          zkProgram: zkProgramClient,
        })
      );
      setLoadingClient(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loadingCLient && (
        <div className="fixed z-[60] pointer-events-none bg-black bg-opacity-60 inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-t-[4px] border-b-[4px] border-r-[4px] border-white animate-spin"></div>
        </div>
      )}
      <ZkAppProviderContract>{children}</ZkAppProviderContract>
    </>
  );
};
