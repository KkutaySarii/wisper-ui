import { SVGProps } from "react";

export interface CustomProp extends SVGProps<SVGSVGElement> {
  theme?: string;
  size?: number;
}
