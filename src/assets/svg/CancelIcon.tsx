import * as React from "react";
import { CustomProp } from "./type";

export const CancelIcon: React.FC<CustomProp> = ({
  theme = "light",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={33}
    height={35}
    fill="none"
    {...props}
  >
    <path
      stroke={theme === "light" ? "#000" : "#fff"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.002}
      d="m12.228 12.446 9.546 9.546m0-9.546-9.546 9.546"
    />
  </svg>
);
