/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Mina,
  fetchAccount,
  PublicKey,
  PrivateKey,
  Field,
  Poseidon,
  Signature,
  MerkleTree,
  JsonProof,
  ZkProgram,
  AccountUpdate,
} from "o1js";
import * as crypto from "crypto";

import {
  MessageVerificationProgram,
  CryptoUtils,
  generateProof,
  generateProofWithPreviousProof,
  Wisper,
} from "wisper-mina-contracts";

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

class MessageVerificationProgramProof extends ZkProgram.Proof(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  MessageVerificationProgram
) {}

const MERKLE_TREE_HEIGHT = 10; // Adjust based on your needs

const state = {
  MessageVerificationProgram: null as null | typeof MessageVerificationProgram,
  WisperContract: null as null | typeof Wisper,
  WisperInstance: null as null | Wisper,
  transaction: null as null | Transaction,
};

export interface EncryptedData {
  iv: string;
  encryptedData: string;
  authTag: string;
}

export function encrypt(key: Buffer, message: string): EncryptedData {
  const iv: Buffer = crypto.randomBytes(12); // 96 bits IV
  const cipher: crypto.CipherGCM = crypto.createCipheriv(
    "aes-256-gcm",
    key,
    iv
  );

  let encrypted: string = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag: string = cipher.getAuthTag().toString("hex");

  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
    authTag: authTag,
  };
}

// Function to decrypt a message
export function decrypt(
  key: Buffer,
  iv: string,
  encryptedData: string,
  authTag: string
): string {
  const decipher: crypto.DecipherGCM = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted: string = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

const convertStringToField = (str: string) => {
  const hexString = Buffer.from(str, "utf-8").toString("hex");

  const BigIntId = BigInt("0x" + hexString);

  return Field(BigIntId);
};

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToDevnet: async () => {
    const Network = Mina.Network(
      "https://api.minascan.io/node/devnet/v1/graphql"
    );
    Mina.setActiveInstance(Network);
  },
  loadProgram: async () => {
    const { MessageVerificationProgram } = await import(
      "wisper-mina-contracts"
    );
    state.MessageVerificationProgram = MessageVerificationProgram;
  },
  compileProgram: async () => {
    await state.MessageVerificationProgram!.compile({
      forceRecompile: true,
    });
  },
  loadContract: async () => {
    const { Wisper } = await import("wisper-mina-contracts");
    state.WisperContract = Wisper;
  },
  compileContract: async () => {
    const { MessageVerificationProgram } = await import(
      "wisper-mina-contracts"
    );
    await MessageVerificationProgram!.compile({
      forceRecompile: true,
    });
    await state.WisperContract!.compile({ forceRecompile: true });
  },
  deployContract: async (args: {
    privateKey58: string;
    feePayerAddress58: string;
  }) => {
    const feePayer: PublicKey = PublicKey.fromBase58(args.feePayerAddress58);
    const zkAppPrivateKey: PrivateKey = PrivateKey.fromBase58(
      args.privateKey58
    );

    state.WisperInstance = new state.WisperContract!(
      zkAppPrivateKey.toPublicKey()
    );
    const transaction = await Mina.transaction(
      {
        sender: feePayer,
        fee: 1e9,
      },
      async () => {
        AccountUpdate.fundNewAccount(feePayer);
        await state.WisperInstance!.deploy();
      }
    );

    await transaction.prove();
    transaction.sign([zkAppPrivateKey]);

    return transaction!.toJSON();
  },
  settleContract: async (args: {
    hostUser58: string;
    guestUser58: string;
    chatId: string;
    settleProof: JsonProof;
    messages: string[];
    contractPk58: string;
  }) => {
    const hostUser: PublicKey = PublicKey.fromBase58(args.hostUser58);
    const guestUser: PublicKey = PublicKey.fromBase58(args.guestUser58);

    const contractPK = PublicKey.fromBase58(args.contractPk58);

    const chatIdField = convertStringToField(args.chatId);

    const timestamp = Field(Date.now());

    const settleProof = (await MessageVerificationProgramProof.fromJSON(
      args.settleProof
    )) as MessageVerificationProgramProof;

    const merkleTree = new MerkleTree(MERKLE_TREE_HEIGHT);

    args.messages.forEach((msg, index) => {
      const messageFields = msg
        .split("")
        .map((char) => Field(char.charCodeAt(0)));
      merkleTree.setLeaf(BigInt(index), Poseidon.hash(messageFields));
    });

    const wisperInstance = new state.WisperContract!(contractPK);

    const transaction = await Mina.transaction(
      {
        sender: hostUser,
        fee: 1e9,
      },
      async () => {
        await state.WisperInstance!.settleChat(
          hostUser,
          guestUser,
          chatIdField,
          merkleTree.getRoot(),
          timestamp,
          settleProof
        );
      }
    );
    await transaction.prove();
    state.WisperInstance = wisperInstance;
    return transaction!.toJSON();
  },

  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  decryptMessage: async (args: {
    signingPrivateKey58: string;
    receiverPublicKey58: string;
    encryptedMessage: EncryptedData;
  }): Promise<string> => {
    const signingPrivateKey = PrivateKey.fromBase58(args.signingPrivateKey58);
    const receiverPublicKey = PublicKey.fromBase58(args.receiverPublicKey58);

    // This is the key we will use for encryption
    const sharedSecret = CryptoUtils.computeSharedSecret(
      signingPrivateKey,
      receiverPublicKey
    );

    const sharedKey = CryptoUtils.fieldToBuffer(sharedSecret);

    const decryptedMessage = decrypt(
      sharedKey,
      args.encryptedMessage.iv,
      args.encryptedMessage.encryptedData,
      args.encryptedMessage.authTag
    );
    return decryptedMessage;
  },
  generateProof: async (args: {
    signingPrivateKey58: string;
    pureMessage: string;
    receiverPublicKey58: string;
  }): Promise<{ encryptedMessage: EncryptedData; proof: any }> => {
    const merkleTree = new MerkleTree(MERKLE_TREE_HEIGHT);

    const signingPrivateKey = PrivateKey.fromBase58(args.signingPrivateKey58);
    const signingPublicKey = signingPrivateKey.toPublicKey();
    const receiverPublicKey = PublicKey.fromBase58(args.receiverPublicKey58);

    // This is the key we will use for encryption
    const sharedSecret = CryptoUtils.computeSharedSecret(
      signingPrivateKey,
      receiverPublicKey
    );

    const sharedKey = CryptoUtils.fieldToBuffer(sharedSecret);

    //This is the cipher text that we will send from one client to other
    const encryptedMessage: EncryptedData = encrypt(
      sharedKey,
      args.pureMessage
    );

    const message = args.pureMessage
      .split("")
      .map((char) => Field(char.charCodeAt(0)));
    const messageHash = Poseidon.hash(message);
    const messageSignature = Signature.create(
      signingPrivateKey,
      messageHash.toFields()
    );
    merkleTree.setLeaf(0n, messageHash);

    let proof;
    try {
      proof = await generateProof(
        signingPublicKey,
        messageHash,
        messageSignature,
        merkleTree,
        0
      );
    } catch (error) {
      console.error("Error generating proof: ", error);
    }

    return { encryptedMessage: encryptedMessage, proof: proof.toJSON() };
  },
  generateProofWithPreviousProof: async (args: {
    signingPrivateKey58: string;
    pureMessage: string;
    receiverPublicKey58: string;
    messageIndex: number;
    previousProof: JsonProof;
    messages: string[];
  }): Promise<{ encryptedMessage: EncryptedData; proof: any }> => {
    const previousProof = (await MessageVerificationProgramProof.fromJSON(
      args.previousProof
    )) as MessageVerificationProgramProof;
    const merkleTree = new MerkleTree(MERKLE_TREE_HEIGHT);

    const signingPrivateKey = PrivateKey.fromBase58(args.signingPrivateKey58);
    const signingPublicKey = signingPrivateKey.toPublicKey();
    const receiverPublicKey = PublicKey.fromBase58(args.receiverPublicKey58);

    // This is the key we will use for encryption
    const sharedSecret = CryptoUtils.computeSharedSecret(
      signingPrivateKey,
      receiverPublicKey
    );

    const sharedKey = CryptoUtils.fieldToBuffer(sharedSecret);

    //This is the cipher text that we will send from one client to other
    const encryptedMessage: EncryptedData = encrypt(
      sharedKey,
      args.pureMessage
    );

    const message = args.pureMessage
      .split("")
      .map((char) => Field(char.charCodeAt(0)));
    const messageHash = Poseidon.hash(message);
    const messageSignature = Signature.create(
      signingPrivateKey,
      messageHash.toFields()
    );

    args.messages.forEach((msg, index) => {
      const messageFields = msg
        .split("")
        .map((char) => Field(char.charCodeAt(0)));
      const messageHash = Poseidon.hash(messageFields);
      const leaf = BigInt(index);
      merkleTree.setLeaf(leaf, messageHash);
    });

    merkleTree.setLeaf(BigInt(args.messageIndex), messageHash);

    const proof = await generateProofWithPreviousProof(
      signingPublicKey,
      messageHash,
      messageSignature,
      merkleTree,
      args.messageIndex,
      previousProof
    );

    return { encryptedMessage: encryptedMessage, proof: proof.toJSON() };
  },
};

if (!self.crossOriginIsolated) {
  console.error("Cross-Origin Isolation is not enabled. Worker might fail.");
}

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkProgramWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkProgramWorkerReponse = {
  id: number;
  data: any;
};

addEventListener(
  "message",
  async (event: MessageEvent<ZkProgramWorkerRequest>) => {
    const returnData = await functions[event.data.fn](event.data.args);

    const message: ZkProgramWorkerReponse = {
      id: event.data.id,
      data: returnData,
    };
    postMessage(message);
  }
);

console.log("Worker Initialized Successfully.");
