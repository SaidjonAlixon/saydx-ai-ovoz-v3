import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import BottomNavigation from "./BottomNavigation";
import ThemeToggle from "./ThemeToggle";
import QuickLeadForm from "./QuickLeadForm";
import logoImage from "@assets/logo_ai.png";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [showLeadForm, setShowLeadForm] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <img 
              src={logoImage} 
              alt="SAYD.X Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-lg">SAYD.X</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLeadForm(true)}
              data-testid="button-header-lead"
            >
              Ariza
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Lead Form Modal Overlay */}
      {showLeadForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 z-10"
                onClick={() => setShowLeadForm(false)}
                data-testid="button-close-lead-form"
              >
                <X className="w-5 h-5" />
              </Button>
              <QuickLeadForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}