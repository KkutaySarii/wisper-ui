import * as React from "react";
import { CustomProp } from "./type";

export const ShareIcon: React.FC<CustomProp> = ({
  theme = "light",
  size = 24,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    style={{
      scale: size / 24,
    }}
    fill="none"
    {...props}
  >
    <path
      fill={theme === "light" ? "#000" : "#fff"}
      d="M17.719 15.189c-.856 0-1.678.335-2.29.933l-5.96-3.351a3.266 3.266 0 0 0 0-1.539l5.959-3.351a3.27 3.27 0 1 0-.95-1.833l-6.1 3.432a3.281 3.281 0 1 0 0 5.041l6.1 3.433a3.28 3.28 0 1 0 3.24-2.765Z"
    />
  </svg>
);
