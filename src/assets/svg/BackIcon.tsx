import * as React from "react";
import { CustomProp } from "./type";

export const BackIcon: React.FC<CustomProp> = ({
  theme = "light",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={29}
    height={37}
    fill="none"
    {...props}
  >
    <path
      stroke={theme === "light" ? "#000" : "#fff"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M18.125 26.25 10 18.125 18.125 10"
    />
  </svg>
);
