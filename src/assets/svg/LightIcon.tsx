import * as React from "react";
import { CustomProp } from "./type";

export const LightIcon: React.FC<CustomProp> = ({ size = 22, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeWidth={1.25}
      d="M11 1.69V1m0 20v-.69M20.31 11H21M1 11h.69m15.894-6.584.488-.487M3.928 18.07l.488-.488m13.168 0 .488.488M3.928 3.93l.488.487m12.088 6.546a5.517 5.517 0 1 1-11.035 0 5.517 5.517 0 0 1 11.035 0Z"
    />
  </svg>
);
