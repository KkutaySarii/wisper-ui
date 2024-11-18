import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import HomePage from "@/components/pages/Home";

const Home = () => {
  const publicKey = cookies().get("publicKey");

  if (publicKey) {
    redirect("/chat");
  }
  return <HomePage />;
};

export default Home;
