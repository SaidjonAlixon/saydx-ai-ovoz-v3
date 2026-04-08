import { motion } from "framer-motion";
import BottomNavigation from "./BottomNavigation";
import ScrollProgress from "./ScrollProgress";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ScrollProgress />

      {/* Logo - chap ustki burchak, animatsiya */}
      <motion.div
        className="fixed top-3 sm:top-4 left-10 sm:left-12 md:left-16 z-50"
        animate={{ opacity: [1, 0, 1] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <img
          src="/logo.png"
          alt="SAYD.X Logo"
          className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]"
        />
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}