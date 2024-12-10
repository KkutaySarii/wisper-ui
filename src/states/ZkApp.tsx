import { createContext, useContext, useEffect, useState } from "react";

import { JsonProof, PublicKey } from "o1js";

import ZkAppWorkerClient from "@/lib/zkProgramWorkerClient";
import { timeout } from "@/utils/timeout";
import { generateZkAppKeyPair, sendTxAuro } from "@/utils/zkApp";
import { waitForAccountActivation } from "@/utils/waitTx";
import { useAppDispatch } from "@/types/state";
import {
  settlementContractStart,
  settlementDeployed,
  settlementFailed,
  settlementSuccess,
} from "@/redux/slices/chat/slice";
import toast from "react-hot-toast";

export type InitParamsType = {
  params: {
    publicKey58: string;
  };
};

export type DeployParamsType = {
  params: {
    publicKey58: string;
    chat_id: string;
  };
};

export type SettleParamsType = {
  params: {
    publicKey58: string;
    contractPublicKey58?: string;
    guestPublicKey58: string;
    chat_id: string;
    settleProof: JsonProof;
    messages: string[];
  };
};

export type ZkAppContextType = {
  deployContract: ({ params }: DeployParamsType) => Promise<{
    zkappPublicKey58: string;
    hash: string;
    deployerPublicKey: PublicKey | null;
    zkappWorkerClient: ZkAppWorkerClient | null;
  }>;
  settleContract: ({ params }: SettleParamsType) => Promise<void>;
};

const ZkAppContext = createContext<ZkAppContextType>({
  deployContract: async () => {
    return {
      zkappPublicKey58: "",
      hash: "",
      deployerPublicKey: null,
      zkappWorkerClient: null,
    };
  },
  settleContract: async () => {},
} as ZkAppContextType);

export const ZkAppProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      toast(toastMessage, {
        position: "top-right",
        duration: 4000,
      });
      console.log(toastMessage);
    }
  }, [toastMessage]);

  const initMethod = async ({ params }: InitParamsType) => {
    const zkappWorkerClient = new ZkAppWorkerClient();

    await timeout(5);

    await zkappWorkerClient.setActiveInstanceToDevnet();

    const mina = window.mina;

    if (mina == null) {
      return;
    }

    const deployerPublicKey = PublicKey.fromBase58(params.publicKey58);
    console.log("Using public key:", params.publicKey58);

    const resFetchAccount = await zkappWorkerClient.fetchAccount({
      publicKey: deployerPublicKey!,
    });
    const accountExists = resFetchAccount.error == null;

    console.log("Account exists:", accountExists);

    setToastMessage("Loading contract...");
    await zkappWorkerClient.loadContract();

    setToastMessage("compiling contract...");
    await zkappWorkerClient.compileContract();

    setToastMessage("zkApp compiled");

    return { zkappWorkerClient, deployerPublicKey };
  };

  const deployContract = async ({ params }: DeployParamsType) => {
    const { zkappWorkerClient, deployerPublicKey } = await initMethod({
      params: {
        publicKey58: params.publicKey58,
      },
    });
    setToastMessage("Deploying contract...");

    const { zkappPrivateKey, zkappPublicKey58 } = generateZkAppKeyPair();

    setToastMessage("creating deploy transaction...");

    const deployTxJson = await zkappWorkerClient!.deployContract(
      zkappPrivateKey,
      deployerPublicKey
    );

    setToastMessage("checking AURO connection...");

    const network = await window.mina.requestNetwork();

    console.log(`Network: ${network}`);

    setToastMessage("sending transaction...");

    const hash = await sendTxAuro(deployTxJson);

    dispatch(
      settlementDeployed({
        chat_id: params.chat_id,
        contractPublicKey58: zkappPublicKey58,
        deployTxHash: hash,
      })
    );

    return {
      zkappPublicKey58,
      hash,
      deployerPublicKey,
      zkappWorkerClient,
    };
  };

  const settleContract = async ({ params }: SettleParamsType) => {
    if (params.contractPublicKey58) {
      dispatch(settlementContractStart({ chat_id: params.chat_id }));
      const { zkappWorkerClient, deployerPublicKey } = await initMethod({
        params: {
          publicKey58: params.publicKey58,
        },
      });

      const guestUser = PublicKey.fromBase58(params.guestPublicKey58);

      const contractPk = PublicKey.fromBase58(params.contractPublicKey58);

      const settleContractTxJson = await zkappWorkerClient!.settleContract({
        hostUser: deployerPublicKey,
        guestUser,
        chatId: params.chat_id,
        settleProof: params.settleProof,
        messages: params.messages,
        contractPk,
      });

      setToastMessage("checking AURO connection...");

      const network = await window.mina.requestNetwork();

      console.log(`Network: ${network}`);

      setToastMessage("sending transaction...");

      await sendTxAuro(settleContractTxJson);
    } else {
      const { hash, zkappPublicKey58, deployerPublicKey, zkappWorkerClient } =
        await deployContract({
          params: { publicKey58: params.publicKey58, chat_id: params.chat_id },
        });

      try {
        const res = await waitForAccountActivation(hash);
        if (res.status === "failed") {
          throw new Error("zkApp account activation failed");
        }
        setToastMessage("zkApp account is now active!");
      } catch (error) {
        console.error(error.message);
        dispatch(settlementFailed({ chat_id: params.chat_id }));
        return;
      }
      dispatch(settlementContractStart({ chat_id: params.chat_id }));

      const guestUser = PublicKey.fromBase58(params.guestPublicKey58);

      const contractPk = PublicKey.fromBase58(zkappPublicKey58);

      const settleContractTxJson = await zkappWorkerClient!.settleContract({
        hostUser: deployerPublicKey,
        guestUser,
        chatId: params.chat_id,
        settleProof: params.settleProof,
        messages: params.messages,
        contractPk,
      });

      setToastMessage("checking AURO connection...");

      const network = await window.mina.requestNetwork();

      console.log(`Network: ${network}`);

      setToastMessage("sending transaction...");

      const SettleHash = await sendTxAuro(settleContractTxJson);
      setToastMessage("Settlement transaction sent!");

      dispatch(
        settlementSuccess({ chat_id: params.chat_id, settleTxHash: SettleHash })
      );
    }
  };

  return (
    <ZkAppContext.Provider value={{ deployContract, settleContract }}>
      {children}
    </ZkAppContext.Provider>
  );
};

export const useZkApp = () => useContext(ZkAppContext);
