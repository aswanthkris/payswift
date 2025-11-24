import { Loader2 } from "lucide-react";

export function LoadingOverlay({ message = "Processing..." }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-600 rounded-full" />
          </div>
        </div>
        <p className="text-slate-700 font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
}
