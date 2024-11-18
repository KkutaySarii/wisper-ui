import * as React from "react";
import { CustomProp } from "./type";

export const EditIcon: React.FC<CustomProp> = ({
  theme = "light",
  size = 32,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={33}
    style={{
      scale: size / 32,
    }}
    fill="none"
    {...props}
  >
    <path
      stroke={theme === "light" ? "#000" : "#fff"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 20.25h-4v-4l12-12 4 4-12 12ZM21 7.25l4 4"
    />
    <path
      stroke={theme === "light" ? "#000" : "#fff"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M27 15.25v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-20a1 1 0 0 1 1-1h11"
    />
  </svg>
);
