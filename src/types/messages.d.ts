import { EncryptedData } from "@/lib/zkProgramWorker";
import { SignedResponse } from "./auro";
import { JsonProof } from "o1js";

export interface ChatResponse {
  chats: ChatType[];
  pubKey58: string;
}

export interface ChatType {
  id: string; // Chat id
  type: "active" | "terminated" | "deleted"; // Chat type
  chatWith: string | null; // Public key base 58 of the chat partner
  username: string | null; // Username of the chat partner
  image: ImageType; // Image of the chat partner
  unReadMessages: number; // Number of unread messages
  lastMessage: MessageType | null; // Last message in the chat
  messages: MessageType[];
  receiperOnline: boolean;
  receiperTyping: boolean;
  senderPrivateKey: string; // Private key of the sender so mine (new key pair)
  receiverPublicKey: string; // Public key of the receiver new key pair
  signResult: SignedResponse;
}

export interface MessageType {
  id: string;
  content: MessagePackType;
  time: string;
  timestamp: number;
  isMine: boolean;
}

export interface MessagePackType {
  proof: JsonProof;
  encryptedMessage: EncryptedData;
  pureMessage: string;
}

export type ImageType =
  | "user1"
  | "user2"
  | "user3"
  | "user4"
  | "user5"
  | "user6"
  | "default";
