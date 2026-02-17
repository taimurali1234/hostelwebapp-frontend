import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, ...props }, ref) => {
    return (
      <div>
        <div className="flex items-center gap-3 border rounded-xl px-4 py-3 focus-within:border-green-600">
          <span className="text-gray-400">{icon}</span>
          <input
            ref={ref}
            type="text"
            className="w-full outline-none text-sm"
            {...props}
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs text-left mt-1">{error}</p>
        )}
      </div>
    );
  }
);

export default React.memo(Input);
