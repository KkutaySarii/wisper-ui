import * as React from "react";
import { CustomProp } from "./type";

export const RightArrowIcon: React.FC<CustomProp> = ({
  theme = "light",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={26}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        stroke={theme === "light" ? "#fff" : "#000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M9.75 4.875 17.875 13 9.75 21.125"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill={theme === "light" ? "#fff" : "#000"} d="M0 0h26v26H0z" />
      </clipPath>
    </defs>
  </svg>
);
