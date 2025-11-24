import { twMerge } from 'tailwind-merge';

export function Card({ children, className, ...props }) {
  return (
    <div 
      className={twMerge(
        "bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
