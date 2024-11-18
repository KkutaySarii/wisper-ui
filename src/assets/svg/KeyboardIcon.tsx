import * as React from "react";
import { CustomProp } from "./type";

export const KeyboardIcon: React.FC<CustomProp> = ({
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
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.462 4.375H2.538a.663.663 0 0 0-.663.663v9.924c0 .366.297.663.663.663h14.924a.663.663 0 0 0 .663-.663V5.038a.663.663 0 0 0-.663-.663ZM4.375 10h11.25M4.375 7.5h11.25M4.375 12.5H5M7.5 12.5h5M15 12.5h.625"
    />
  </svg>
);
