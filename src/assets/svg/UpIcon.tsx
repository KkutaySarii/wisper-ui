import * as React from "react";
import { CustomProp } from "./type";

export const UpIcon: React.FC<CustomProp> = ({ theme = "light", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      stroke={theme === "light" ? "#fff" : "#000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="m3 13 7-6 7 6"
    />
  </svg>
);
