import { motion } from "framer-motion";
import { ShieldCheck, Zap, Globe } from "lucide-react";

export const AuthLayout = ({ children, title, subtitle }) => {
  const features = [
    {
      icon: Zap,
      title: "Instant Transfers",
      desc: "Send money globally in seconds, not days.",
    },
    {
      icon: ShieldCheck,
      title: "Bank-Grade Security",
      desc: "Your data is protected by 256-bit encryption.",
    },
    {
      icon: Globe,
      title: "Global Access",
      desc: "Manage your finances from anywhere in the world.",
    },
  ];

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/auth-hero.png"
            alt="Futuristic Fintech Background"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/60 to-slate-900/90" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/favicon.png"
              alt="PaySwift"
              className="w-10 h-10 rounded-xl shadow-lg shadow-green-500/20"
            />
            <span className="text-2xl font-bold tracking-tight">PaySwift</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold leading-tight mb-6">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                Digital Payments
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
              Experience the next generation of financial freedom with our
              secure, fast, and intuitive digital wallet platform.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="relative z-10 grid grid-cols-1 gap-6 mt-12">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                <feature.icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 relative">
        {/* Mobile Background (Subtle) */}
        <div className="absolute inset-0 lg:hidden z-0 opacity-5">
          <img src="/auth-hero.png" className="w-full h-full object-cover" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
            <p className="text-slate-500">{subtitle}</p>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
};
