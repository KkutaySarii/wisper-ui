import { Cover } from "../pages/Home/Cover";
import { Navigation } from "../pages/Home/Navigation";
import { TextContainer } from "../pages/Home/TextContainer";
import { ToggleTheme } from "../pages/Home/ToggleTheme";
import { MainLogo } from "./MainLogo";

export const EntireScreen = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full relative overflow-hidden">
      <div className="absolute z-20 left-[50px] top-[54px]">
        <MainLogo />
      </div>
      <div className="absolute z-30 right-[50px] flex items-center gap-x-3 top-[54px] ">
        <ToggleTheme />
        <Navigation />
      </div>
      <Cover />
      <div className="absolute left-[32px] top-[40%] z-40">
        <TextContainer />
        {children}
      </div>
    </div>
  );
};
