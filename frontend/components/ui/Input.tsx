// import { cn } from "@/lib/utils";
// import { InputHTMLAttributes, forwardRef } from "react";

// interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   error?: string;
// }

// export const Input = forwardRef<HTMLInputElement, InputProps>(
//   ({ className, label, error, id, ...props }, ref) => (
//     <div className="w-full">
//       {label && (
//         <label
//           htmlFor={id}
//           className="block text-sm font-medium text-neutral-900 mb-2"
//         >
//           {label}
//         </label>
//       )}
//       <input
//         ref={ref}
//         id={id}
//         className={cn(
//           "w-full h-12 px-4 bg-neutral-100 border border-transparent",
//           "text-neutral-900 placeholder:text-neutral-500 rounded-lg",
//           "transition-all focus:outline-none focus:bg-white",
//           "focus:border-black focus:ring-4 focus:ring-black/5",
//           error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
//           className
//         )}
//         {...props}
//       />
//       {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
//     </div>
//   )
// );
// Input.displayName = "Input";
// components/ui/Input.tsx
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-neutral-900 mb-2"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={
          `w-full h-12 px-4 bg-neutral-100 border rounded-lg
           text-neutral-900 placeholder:text-neutral-500
           transition-all focus:outline-none focus:bg-white
           focus:ring-4 ${
             error
               ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
               : "border-transparent focus:border-black focus:ring-black/5"
           } ${className}`
        }
        {...props}
      />

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}