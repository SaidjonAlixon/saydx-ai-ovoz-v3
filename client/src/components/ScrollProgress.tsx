import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 z-[100] origin-left shadow-[0_0_15px_rgba(34,211,238,0.8)]"
      style={{ scaleX }}
    >
      <div className="absolute right-0 top-0 w-4 h-full bg-white shadow-[0_0_20px_#fff] blur-[2px] animate-pulse rounded-full" />
    </motion.div>
  );
}
