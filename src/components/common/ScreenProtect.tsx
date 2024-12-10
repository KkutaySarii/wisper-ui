import React, { useEffect, useState } from "react";

import Lottie from "lottie-react";

import desktopScreen from "@/assets/lottie/desktop.json";

export const ScreenProtect = ({ children }: { children: React.ReactNode }) => {
  const [pageWidth, setPageWidth] = useState<number | undefined>(undefined);

  const [device, setDevice] = useState<string>("");

  useEffect(() => {
    setPageWidth(window.innerWidth);
    const handleResize = () => {
      setPageWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleDeviceDetection = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile =
        /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
      const isTablet =
        /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/g.test(userAgent);

      setDevice(isMobile ? "mobile" : isTablet ? "tablet" : "desktop");
    };

    handleDeviceDetection();
    window.addEventListener("resize", handleDeviceDetection);

    return () => {
      window.removeEventListener("resize", handleDeviceDetection);
    };
  }, []);

  if (typeof pageWidth === "undefined") return <></>;

  if (device === "desktop") {
    return <>{children}</>;
  }

  return (
    <div className="bg-black h-screen w-full flex items-center justify-center">
      <div className="w-[300px] lg:w-[400px]">
        <Lottie animationData={desktopScreen} loop={true} />
        <h1 className="text-white text-center text-base font-normal leading-5 mt-8">
          This website is not optimized for screens smaller than{" "}
          <strong>700</strong> pixels. Please resize your browser window to view
          the content or visit on a desktop device.
        </h1>
      </div>
    </div>
  );
};
