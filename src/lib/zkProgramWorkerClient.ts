/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchAccount, JsonProof, PrivateKey, PublicKey } from "o1js";

import type {
  ZkProgramWorkerRequest,
  ZkProgramWorkerReponse,
  WorkerFunctions,
  EncryptedData,
} from "./zkProgramWorker";

export default class ZkProgramWorkerClient {
  // ---------------------------------------------------------------------------------------

  setActiveInstanceToDevnet() {
    return this._call("setActiveInstanceToDevnet", {});
  }
  loadProgram() {
    return this._call("loadProgram", {});
  }

  compileProgram() {
    return this._call("compileProgram", {});
  }

  loadContract() {
    return this._call("loadContract", {});
  }

  compileContract() {
    return this._call("compileContract", {});
  }
  waitTransaction() {
    return this._call("waitTransaction", {});
  }

  deployContract(privateKey: PrivateKey, feePayer: PublicKey) {
    return this._call("deployContract", {
      privateKey58: privateKey.toBase58(),
      feePayerAddress58: feePayer.toBase58(),
    });
  }

  async getTransactionJSON() {
    const result = await this._call("getTransactionJSON", {});
    return result;
  }

  fetchAccount({
    publicKey,
  }: {
    publicKey: PublicKey;
  }): ReturnType<typeof fetchAccount> {
    const result = this._call("fetchAccount", {
      publicKey58: publicKey.toBase58(),
    });
    return result as ReturnType<typeof fetchAccount>;
  }

  generateProof({
    signingPrivateKey,
    pureMessage,
    receiverPublicKey,
  }: {
    signingPrivateKey: PrivateKey;
    pureMessage: string;
    receiverPublicKey: PublicKey;
  }): Promise<{ encryptedMessage: any; proof: any }> {
    return this._call("generateProof", {
      signingPrivateKey58: signingPrivateKey.toBase58(),
      pureMessage,
      receiverPublicKey58: receiverPublicKey.toBase58(),
    });
  }

  generateProofWithPreviousProof({
    signingPrivateKey,
    pureMessage,
    receiverPublicKey,
    messageIndex,
    previousProof,
  }: {
    signingPrivateKey: PrivateKey;
    pureMessage: string;
    receiverPublicKey: PublicKey;
    messageIndex: number;
    previousProof: JsonProof;
  }): Promise<{ encryptedMessage: any; proof: any }> {
    return this._call("generateProofWithPreviousProof", {
      signingPrivateKey58: signingPrivateKey.toBase58(),
      pureMessage,
      receiverPublicKey58: receiverPublicKey.toBase58(),
      messageIndex,
      previousProof,
    });
  }

  decryptMessage({
    signingPrivateKey,
    receiverPublicKey,
    encryptedMessage,
  }: {
    signingPrivateKey: PrivateKey;
    receiverPublicKey: PublicKey;
    encryptedMessage: EncryptedData;
  }): Promise<string> {
    return this._call("decryptMessage", {
      signingPrivateKey58: signingPrivateKey.toBase58(),
      receiverPublicKey58: receiverPublicKey.toBase58(),
      encryptedMessage,
    });
  }
  // ---------------------------------------------------------------------------------------

  worker: Worker;

  promises: {
    [id: number]: { resolve: (res: any) => void; reject: (err: any) => void };
  };

  nextId: number;

  constructor() {
    //import.meta.url - Provides the URL of the currently executing module
    this.worker = new Worker(new URL("./zkProgramWorker.ts", import.meta.url));
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkProgramWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message: ZkProgramWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };
      this.worker.postMessage(message);
      this.nextId++;
    });
  }
}
