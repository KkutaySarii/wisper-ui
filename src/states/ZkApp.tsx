import { createContext, useContext } from "react";

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

    console.log("Loading contract...");
    await zkappWorkerClient.loadContract();

    console.log("compiling contract...");
    await zkappWorkerClient.compileContract();

    console.log("zkApp compiled");

    return { zkappWorkerClient, deployerPublicKey };
  };

  const deployContract = async ({ params }: DeployParamsType) => {
    const { zkappWorkerClient, deployerPublicKey } = await initMethod({
      params: {
        publicKey58: params.publicKey58,
      },
    });
    console.log("Deploying contract...");

    const { zkappPrivateKey, zkappPublicKey58 } = generateZkAppKeyPair();

    console.log("creating deploy transaction...");

    const deployTxJson = await zkappWorkerClient!.deployContract(
      zkappPrivateKey,
      deployerPublicKey
    );

    console.log("checking AURO connection...");

    const network = await window.mina.requestNetwork();

    console.log(`Network: ${network}`);

    console.log("sending transaction...");

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

      console.log("checking AURO connection...");

      const network = await window.mina.requestNetwork();

      console.log(`Network: ${network}`);

      console.log("sending transaction...");

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
        console.log("zkApp account is now active!");
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

      console.log("checking AURO connection...");

      const network = await window.mina.requestNetwork();

      console.log(`Network: ${network}`);

      console.log("sending transaction...");

      const SettleHash = await sendTxAuro(settleContractTxJson);

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
