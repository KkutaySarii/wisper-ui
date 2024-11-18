import { SignedResponse } from "@/types/auro";

export const checkSignature = async (
  signResult: SignedResponse
): Promise<boolean | null> => {
  const mina = window.mina;

  if (mina == null) {
    return null;
  }

  try {
    const res = await window.mina
      ?.verifyMessage(signResult)
      .then((result: boolean) => {
        return result;
      })
      .catch((err: any) => {
        console.log(err);
        return null;
      });
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};
