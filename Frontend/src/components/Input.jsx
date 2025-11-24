import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Input({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-slate-500 font-medium">{label}</label>}
      <input
        className={twMerge(
          "bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors placeholder:text-slate-400",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
