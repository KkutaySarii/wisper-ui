import { createChatID } from "@/utils/chatIdHandler";

export async function POST(req: Request) {
  const { senderPublicKey, receiverPublicKey } = await req.json();

  let res;

  try {
    const chat_id = createChatID(senderPublicKey, receiverPublicKey);
    res = {
      data: {
        chat_id,
        receiverPublicKey,
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
