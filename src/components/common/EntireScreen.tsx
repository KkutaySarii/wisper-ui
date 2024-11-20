import { Cover } from "../pages/Home/Cover";
import { Navigation } from "../pages/Home/Navigation";
import { TextContainer } from "../pages/Home/TextContainer";
import { ToggleTheme } from "../pages/Home/ToggleTheme";
import { MainLogo } from "./MainLogo";
import { Profile } from "./Profile";

export const EntireScreen = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full relative overflow-hidden">
      <div className="absolute z-10 left-[50px] top-[54px]">
        <MainLogo />
      </div>
      <div className="absolute right-[50px] flex items-center gap-x-3 top-[54px] ">
        <Profile page="entry" />
        <div className="hidden items-center gap-x-3 min-[500px]:flex z-20">
          <ToggleTheme />
          <Navigation />
        </div>
      </div>
      <Cover />
      <div className="absolute left-[32px] max-[410px]:right-8 top-[40%] z-30">
        <TextContainer />
        {children}
      </div>
    </div>
  );
};
