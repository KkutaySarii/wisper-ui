import { useAppSelector } from "@/types/state";
import React from "react";

export const Overlay = () => {
  const overlay = useAppSelector((state) => state.overlay);
  if (!overlay.isOpen) return null;
  return (
    <div className="fixed z-40 inset-0 bg-black bg-opacity-20 dark:bg-opacity-60 h-full w-full"></div>
  );
};
