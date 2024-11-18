import { decryptChatID } from "@/utils/chatIdHandler";

export async function POST(req: Request) {
  const { chat_id, myPublicKey } = await req.json();

  let res;
  try {
    const { isJoinable, senderPublicKey, receiverPublicKey } = decryptChatID(
      chat_id,
      myPublicKey
    );
    res = {
      data: {
        receiverPublicKey:
          myPublicKey === senderPublicKey ? receiverPublicKey : senderPublicKey,
        isJoinable,
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
