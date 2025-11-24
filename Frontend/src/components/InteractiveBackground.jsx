import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const InteractiveBackground = ({ children }) => {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth "antigravity" feel
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const { left, top } = container.getBoundingClientRect();
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden"
    >
      {/* Dynamic Gradient Blob with Spring Physics */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(74, 222, 128, 0.5) 0%, rgba(251, 146, 60, 0.3) 50%, transparent 70%)",
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "multiply", // Blends better with light theme
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
};
