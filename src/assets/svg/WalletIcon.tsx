import * as React from "react";
import { CustomProp } from "./type";

export const WalletIcon: React.FC<CustomProp> = ({
  theme = "light",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill={theme === "light" ? "#fff" : "#000"}
      d="M4.477 4.876h15c.175 0 .35.011.524.034a3.094 3.094 0 0 0-3.634-2.605L4.031 4.411h-.014a3.094 3.094 0 0 0-1.925 1.225 4.105 4.105 0 0 1 2.385-.76ZM19.476 6h-15a3.003 3.003 0 0 0-3 3v9a3.003 3.003 0 0 0 3 3h15a3.003 3.003 0 0 0 3-3V9a3.003 3.003 0 0 0-3-3Zm-2.226 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
    />
    <path
      fill={theme === "light" ? "#fff" : "#000"}
      d="M1.5 12.166V7.501c0-1.016.562-2.719 2.515-3.088 1.657-.31 3.298-.31 3.298-.31s1.078.75.188.75C6.61 4.852 6.633 6 7.5 6c.867 0 0 1.102 0 1.102l-3.493 3.961L1.5 12.166Z"
    />
  </svg>
);
