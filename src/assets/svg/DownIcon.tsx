import * as React from "react";
import { CustomProp } from "./type";

export const DownIcon: React.FC<CustomProp> = ({
  theme = "light",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      stroke={theme === "light" ? "#000" : "#fff"}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.333 6 8 11.333 2.666 6"
    />
  </svg>
);
