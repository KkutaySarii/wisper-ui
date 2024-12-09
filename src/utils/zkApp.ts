import { TRANSACTION_FEE } from "@/lib/constants";
import { PrivateKey } from "o1js";

const sendTxAuro = async (txJson: any): Promise<string> => {
  const { hash } = await window.mina.sendTransaction({
    transaction: txJson,
    feePayer: {
      fee: TRANSACTION_FEE,
      memo: "",
    },
  });
  console.log(
    "tx in minascan " + `https://minascan.io/devnet/tx/${hash}?type=zk-tx`
  );
  return hash;
};

const generateZkAppKeyPair = () => {
  const zkappPrivateKey: PrivateKey = PrivateKey.random();
  const zkappPublicKey = zkappPrivateKey.toPublicKey();
  const zkappPublicKey58 = zkappPublicKey.toBase58();

  console.log("ZkApp public key:", zkappPublicKey58);

  return { zkappPrivateKey, zkappPublicKey58, zkappPublicKey };
};

export { sendTxAuro, generateZkAppKeyPair };
