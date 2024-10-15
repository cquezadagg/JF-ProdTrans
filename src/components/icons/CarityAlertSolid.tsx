import type { SVGProps } from "react";

export function ClarityAlertSolid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 36 36"
      {...props}
    >
      <path
        fill="red"
        d="M18 2.5c-8.82 0-16 6.28-16 14s7.18 14 16 14a18 18 0 0 0 4.88-.68l5.53 3.52a1 1 0 0 0 1.54-.84v-6.73a13 13 0 0 0 4-9.27C34 8.78 26.82 2.5 18 2.5m-1.07 6.63a1.41 1.41 0 1 1 2.81 0v9.77a1.41 1.41 0 1 1-2.81 0Zm1.41 17.35a1.87 1.87 0 1 1 1.87-1.87a1.87 1.87 0 0 1-1.87 1.86Z"
        className="clr-i-solid clr-i-solid-path-1"
      ></path>
      <path fill="none" d="M0 0h36v36H0z"></path>
    </svg>
  );
}