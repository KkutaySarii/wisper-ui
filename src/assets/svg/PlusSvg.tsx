import * as React from "react";
import { CustomProp } from "./type";

export const PlusSvg: React.FC<CustomProp> = ({
  theme = "light",
  size = 16,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    style={{
      scale: size / 16,
    }}
    fill="none"
    {...props}
  >
    <path
      fill={theme === "light" ? "#000" : "#fff"}
      fillRule="evenodd"
      d="M8 2.4a.8.8 0 0 1 .8.8v4h4a.8.8 0 0 1 0 1.6h-4v4a.8.8 0 0 1-1.6 0v-4h-4a.8.8 0 1 1 0-1.6h4v-4a.8.8 0 0 1 .8-.8Z"
      clipRule="evenodd"
    />
  </svg>
);
