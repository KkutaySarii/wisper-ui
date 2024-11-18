/* eslint-disable @typescript-eslint/no-explicit-any */
import { PublicKey } from "o1js";

import { useAppDispatch, useAppSelector } from "@/types/state";
import { setPublicKeyCookie } from "@/redux/slices/session/thunk";
import { useRouter } from "next/navigation";

export const useConnectWallet = () => {
  const publicKeyBase58 = useAppSelector(
    (state) => state.session.publicKeyBase58
  );

  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleConnectWallet = () => {
    (async () => {
      const mina = (window as any).mina;

      if (mina == null) {
        return;
      }

      const valuePublicKeyBase58: string = (await mina.requestAccounts())[0];
      const publicKey = PublicKey.fromBase58(valuePublicKeyBase58);

      console.log(`Using key:${publicKey.toBase58()}`);

      dispatch(
        setPublicKeyCookie({
          publicKeyBase58: valuePublicKeyBase58,
        })
      ).then((res: any) => {
        if (!res?.error) {
          router.push("/chat");
        }
      });
    })();
  };

  return { publicKeyBase58, handleConnectWallet };
};
