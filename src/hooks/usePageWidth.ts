import { useEffect, useState } from "react";

export const usePageWidth = () => {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenWidth;
};
