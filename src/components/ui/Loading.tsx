import type { SVGProps } from "react";

interface LineMdLoadingTwotoneLoopProps extends SVGProps<SVGSVGElement> {
  msg: string;
}

export function LineMdLoadingTwotoneLoop({
  msg,
  ...props
}: LineMdLoadingTwotoneLoopProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="rounded-lg bg-zinc-500 p-6 text-center shadow-lg">
        <div className="flex text-white font-bold items-center flex-col justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={50}
            height={50}
            viewBox="0 0 24 24"
            {...props}
          >
            <g
              fill="none"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3.05}
            >
              <path
                strokeDasharray={16}
                strokeDashoffset={16}
                d="M12 3c4.97 0 9 4.03 9 9"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.21s"
                  values="16;0"
                ></animate>
                <animateTransform
                  attributeName="transform"
                  dur="1.05s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                ></animateTransform>
              </path>
              <path
                strokeDasharray={64}
                strokeDashoffset={64}
                strokeOpacity={0.2}
                d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.84s"
                  values="64;0"
                ></animate>
              </path>
            </g>
          </svg>
          <p className="text-sm">{msg}</p>
        </div>
      </div>
    </div>
  );
}
