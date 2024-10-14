import { ClarityAlertSolid } from "../icons/CarityAlertSolid";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string | undefined;
  classState?: string;
  txtColor?: string;
}

export function Alert({ message, classState, txtColor, ...props }: AlertProps) {
  return (
    <div
      {...props}
      className={`${classState} relative mb-2 mt-3 text-center flex flex-row justify-center gap-2  ${txtColor}`}
    >
      <ClarityAlertSolid />
      <p className="sm:inline-block">{message}</p>
    </div>
  );
}
