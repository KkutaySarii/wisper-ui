import * as React from "react";
import { CustomProp } from "./type";
export const CloseIcon: React.FC<CustomProp> = ({
  theme = "light",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={34}
    height={34}
    fill="none"
    {...props}
  >
    <path
      stroke={theme === "light" ? "#000" : "#fff"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.002}
      d="m12.198 12.197 9.546 9.546m0-9.546-9.546 9.546"
    />
  </svg>
);
