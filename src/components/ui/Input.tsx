import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelProps, ...props }, ref) => {
    const randomId = Math.random().toString(36).substring(2, 15); // Generar un id único
    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={`input-${randomId}`}
          className="text-sm font-normal text-zinc-700"
          {...labelProps}
        >
          {label}
        </label>
        <input
          id={`input-${randomId}`}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          {...props}
          ref={ref}
        />
      </div>
    );
  },
);
