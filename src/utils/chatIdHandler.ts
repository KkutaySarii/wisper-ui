import jwt from "jsonwebtoken";

import { JWT_SECRET } from "@/lib/constants";

/**
 * Create a chat ID.
 * @param senderPublicKey
 * @param receiverPublicKey
 * @returns Şifrelenmiş chat ID
 */
export function createChatID(
  senderPublicKey: string,
  receiverPublicKey: string
): string {
  const timestamp = Date.now().toString();

  const payload = {
    spk: senderPublicKey,
    rpk: receiverPublicKey,
    tms: timestamp,
  };

  if (JWT_SECRET === undefined) {
    throw new Error("JWT_SECRET is not defined");
  }
  const chatID = jwt.sign(payload, JWT_SECRET);
  return chatID;
}

interface DecodedChatID {
  spk: string;
  rpk: string;
  tms: string;
}

/**
 * Decrypt a chat ID.
 * @param chatID
 * @param myPublicKey
 * @returns senderPublicKey,  isJoinable, receiverPublicKey
 */
export function decryptChatID(
  chatID: string,
  myPublicKey: string
): {
  senderPublicKey: string;
  isJoinable: boolean;
  receiverPublicKey: string;
} {
  try {
    if (JWT_SECRET === undefined) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(chatID, JWT_SECRET) as DecodedChatID;

    const canJoin = decoded.rpk === myPublicKey || decoded.spk === myPublicKey;

    return {
      senderPublicKey: decoded.spk,
      isJoinable: canJoin,
      receiverPublicKey: decoded.rpk,
    };
  } catch (error) {
    throw new Error("Invalid chat ID  " + error);
  }
}
