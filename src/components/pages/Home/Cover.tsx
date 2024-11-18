"use client";
import Image from "next/image";

import CoverImageDesktop from "@/assets/png/main-desktop.png";
import CoverImageMobile from "@/assets/png/main-mobile.png";
import { usePageWidth } from "@/hooks/usePageWidth";

export const Cover = () => {
  const screenWidth = usePageWidth();

  return (
    <div className="absolute mobile:top-0 top-[96px] right-0">
      <Image
        src={screenWidth <= 700 ? CoverImageMobile : CoverImageDesktop}
        alt="cover"
      />
    </div>
  );
};
