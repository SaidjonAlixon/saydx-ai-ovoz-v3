import { Home, Settings, Briefcase, FileText, HelpCircle } from "lucide-react";
import { useLocation } from "wouter";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/", label: "Asosiy", icon: Home },
  { href: "/xizmatlar", label: "Xizmatlar", icon: Settings },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/ariza", label: "Ariza", icon: FileText },
  { href: "/yordam", label: "Yordam", icon: HelpCircle },
];

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <button
              key={item.href}
              onClick={() => setLocation(item.href)}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] p-1 rounded-lg transition-colors ${
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover-elevate"
              }`}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}