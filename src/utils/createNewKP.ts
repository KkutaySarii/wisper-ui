import { PrivateKey } from "o1js";

import { SignedResponse, SignMessageArgs } from "@/types/auro";

export const createNewKP = async () => {
  const mina = window.mina;

  if (mina == null) {
    return;
  }

  const signingPrivateKey = PrivateKey.random(); // Generate a random private key
  const signingPublicKey = signingPrivateKey.toPublicKey().toBase58(); // Get the public key from the private key

  const signContent: SignMessageArgs = {
    message: signingPublicKey,
  };

  const signResult: SignedResponse = await window.mina
    ?.signMessage(signContent)
    .catch((err: any) => {
      console.log(err);
      return null;
    });

  return {
    signingPrivateKey58: signingPrivateKey.toBase58(),
    signResult,
  };
};
