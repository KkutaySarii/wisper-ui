"use client";

import { deletePublicKeyCookie } from "@/redux/slices/session/thunk";
import { useAppDispatch } from "@/types/state";

export default function Unauthorized() {
  const dispatch = useAppDispatch();

  const gohome = () => {
    dispatch(deletePublicKeyCookie());
    window.location.href = "/";
  };
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h2 className="font-sora text-[100px]">Unauthorized</h2>
      <p className="mt-8 text-[72px]">401</p>
      <button
        onClick={gohome}
        className="bg-secondary py-2 px-4 rounded-lg shadow-lg text-black text-2xl"
      >
        Go back to home
      </button>
    </div>
  );
}
