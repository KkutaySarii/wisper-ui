export interface ZkAppState {
  zkappWorkerClient: ZkappWorkerClient | null;
  hasWallet: boolean | null;
  accountExists: boolean;
}
