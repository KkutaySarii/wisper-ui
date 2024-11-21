"use server";

import { APP_URL } from "@/lib/constants";

export async function chatIdVerifier(chat_id: string, publicKey: string) {
  try {
    const res = await fetch(`${APP_URL}/api/chat_id/verify`, {
      method: "POST",
      body: JSON.stringify({
        chat_id,
        myPublicKey: publicKey,
      }),
    });
    return res.json();
  } catch (error) {
    throw new Error("Chat ID verification failed", error);
  }
}
