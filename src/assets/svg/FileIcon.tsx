import * as React from "react";
import { CustomProp } from "./type";

export const FileIcon: React.FC<CustomProp> = ({
  theme = "light",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      stroke={theme === "light" ? "#000" : "#fff"}
      strokeLinejoin="round"
      strokeWidth={1.002}
      d="M1.875 13.124v3.75A1.88 1.88 0 0 0 3.75 18.75h12.5a1.88 1.88 0 0 0 1.875-1.875v-3.75"
    />
    <path
      stroke={theme === "light" ? "#000" : "#fff"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.002}
      d="M1.875 13.124H7.5M12.5 13.124h5.627M7.5 13.124a2.5 2.5 0 1 0 5 0"
    />
    <path
      stroke={theme === "light" ? "#000" : "#fff"}
      strokeLinejoin="round"
      strokeWidth={1.002}
      d="M15 1.25H5c-1.016 0-1.68.546-1.875 1.562l-1.25 4.687v3.75a1.88 1.88 0 0 0 1.875 1.875h12.5a1.881 1.881 0 0 0 1.875-1.875V7.5l-1.25-4.687c-.196-1.055-.899-1.563-1.875-1.563Z"
    />
    <path
      stroke={theme === "light" ? "#000" : "#fff"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.002}
      d="M1.875 7.5H7.5M12.5 7.5h5.627M7.5 7.5a2.5 2.5 0 1 0 5 0"
    />
  </svg>
);
