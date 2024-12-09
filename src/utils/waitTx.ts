export const waitForAccountActivation = async (
  txHash: string,
  timeoutMs: number = 660000,
  intervalMs: number = 60000
) => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const res = await fetch(
      `https://api.blockberry.one/mina-devnet/v1/zkapps/txs/${txHash}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_WISPER_SCAN_KEY,
        },
      }
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
      });

    if (res?.txStatus === "applied" || res?.txStatus === "failed") {
      return {
        status: res?.txStatus,
      };
    }

    console.log("zkApp account not active yet, retrying...");
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("Timeout: zkApp account did not become active in time");
};
