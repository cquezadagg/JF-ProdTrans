import { EpSuccessFilled } from "@/components/icons/EpSuccesFilled";
import { MaterialSymbolsSmsFailedOutlineSharp } from "@/components/icons/FaileIcon";
import { useEffect, useState } from "react";

interface AlertProps {
  mensajeAlertSuc: string | undefined;
  isGood?: boolean;
  bgColor: string;
  txtColor: string;
}

export function PopupState({
  mensajeAlertSuc,
  isGood,
  bgColor,
  txtColor,
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className={`rounded-lg ${bgColor} p-6 text-center shadow-lg`}>
        <div
          className={`flex ${txtColor} items-center flex-col justify-center mb-4`}
        >
          {isGood ? (
            <EpSuccessFilled />
          ) : (
            <MaterialSymbolsSmsFailedOutlineSharp />
          )}
          <p className="sm:inline-block">{mensajeAlertSuc}</p>
        </div>
      </div>
    </div>
  );
}
