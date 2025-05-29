"use client";
// import { useTheme } from "next-themes";

// import { MainLogoSvg } from "@/assets/svg/MainLogoSvg";
import { useRouter } from "next/navigation";

export const MainLogo = () => {
  // const { theme } = useTheme();

  const router = useRouter();

  const goToHome = () => {
    router.push("/");
  };

  return (
    <button onClick={goToHome}>
      {/* <MainLogoSvg theme={theme} /> */}
      <h4 className="text-3xl font-bold">Mina-Chat</h4>
    </button>
  );
};
