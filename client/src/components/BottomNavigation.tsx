import { motion } from "framer-motion";
import { Home, Settings, Briefcase, FileText, HelpCircle, Users } from "lucide-react";
import { useLocation } from "wouter";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/", label: "Asosiy", icon: Home },
  { href: "/xizmatlar", label: "Xizmatlar", icon: Settings },
  { href: "/jamoa", label: "Jamoa", icon: Users },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/ariza", label: "Ariza", icon: FileText },
  { href: "/yordam", label: "Yordam", icon: HelpCircle },
];

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md z-50">
      <div className="premium-crystal rounded-[2rem] p-2 px-3 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          const Icon = item.icon;

          return (
            <button
              key={item.href}
              onClick={() => setLocation(item.href)}
              className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all active:scale-95 group overflow-hidden ${
                isActive ? "premium-crystal-active scale-105" : "hover:bg-white/5"
              }`}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <div className={`relative z-10 transition-all duration-300 ${
                isActive 
                ? "text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                : "text-white/40 group-hover:text-white/80"
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} />
              </div>
              
              <span className={`text-[9px] mt-1.5 font-bold uppercase tracking-wider transition-all duration-300 ${
                isActive ? "text-cyan-400 opacity-100" : "text-white/30 opacity-60 group-hover:opacity-100"
              }`}>
                {item.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute inset-0 bg-cyan-400/20 blur-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>

  );
}