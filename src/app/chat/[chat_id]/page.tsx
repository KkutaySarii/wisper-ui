import { chatIdVerifier } from "@/actions/chatID-verifier";
import { ChatScreen } from "@/components/pages/Chat/ChatScreen";
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

  const res = await chatIdVerifier(params?.chat_id, publicKey.value);

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
