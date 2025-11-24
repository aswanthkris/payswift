import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ children, variant = 'primary', className, ...props }) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20",
    secondary: "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-50",
    ghost: "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], className)} 
      {...props}
    >
      {children}
    </button>
  );
}
