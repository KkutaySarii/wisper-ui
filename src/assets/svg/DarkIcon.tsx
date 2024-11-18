import * as React from "react";
import { CustomProp } from "./type";

export const DarkIcon: React.FC<CustomProp> = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M9.785.49a.972.972 0 0 1-.084 1.09 6.917 6.917 0 0 0-1.53 4.338c0 3.892 3.256 7.095 7.33 7.095a7.5 7.5 0 0 0 3.123-.674.972.972 0 0 1 1.307 1.244C18.433 17.35 14.682 20 10.313 20 4.643 20 0 15.527 0 9.951 0 4.88 3.844.72 8.804.01a.972.972 0 0 1 .981.48ZM6.891 2.553C3.965 3.823 1.944 6.67 1.944 9.95c0 4.45 3.72 8.105 8.369 8.105 2.731 0 5.148-1.266 6.673-3.214-.484.076-.98.116-1.484.116-5.096 0-9.275-4.022-9.275-9.04 0-1.19.236-2.326.664-3.365Z"
      clipRule="evenodd"
    />
  </svg>
);
