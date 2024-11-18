import { ChatList } from "./ChatList";
import { StartChat } from "./StartChat";
import { Top } from "./Top";

const Chats = () => {
  return (
    <div className="flex h-screen font-sora w-full flex-col relative">
      <Top />
      <ChatList />
      <StartChat />
    </div>
  );
};

export default Chats;
