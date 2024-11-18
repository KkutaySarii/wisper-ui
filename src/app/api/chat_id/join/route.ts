import { decryptChatID } from "@/utils/chatIdHandler";

export async function POST(req: Request) {
  const { chat_id, publicKey } = await req.json();

  let res;

  try {
    const { receiverPublicKey, senderPublicKey } = decryptChatID(
      chat_id,
      publicKey
    );
    res = {
      data: {
        chat_id,
        receiverPublicKey,
        senderPublicKey,
      },
      status: 200,
    };
  } catch (error) {
    res = {
      data: {
        error: error,
      },
      status: 500,
    };
  }

  return Response.json(res);
}
