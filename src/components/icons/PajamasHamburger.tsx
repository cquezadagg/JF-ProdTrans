import type { SVGProps } from "react";

export function PajamasHamburger(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        fill="none"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 8h22M5 16h22M5 24h22"
      ></path>
    </svg>
  );
}
