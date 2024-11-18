import { ChatScreen } from "@/components/pages/Chat/ChatScreen";
import { APP_URL } from "@/lib/constants";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

const ChatPage = async ({
  params,
}: {
  params: {
    chat_id: string;
  };
}) => {
  const publicKey = cookies().get("publicKey");

  if (!publicKey) {
    return redirect("/home");
  }

  const res = await fetch(`${APP_URL}/api/chat_id/verify`, {
    method: "POST",
    body: JSON.stringify({
      chat_id: params?.chat_id,
      myPublicKey: publicKey?.value,
    }),
  }).then((r) => r.json());

  if (res?.status === 200) {
    if (res?.data?.isJoinable) {
      return <ChatScreen chat_id={params?.chat_id} />;
    } else {
      return redirect("/unauthorized");
    }
  }
  return notFound();
};

export default ChatPage;
