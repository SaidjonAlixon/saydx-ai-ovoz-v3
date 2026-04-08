import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroVideo from "@assets/asosiy_sahifa1.mp4";

export default function HeroSection() {
  const [displayText, setDisplayText] = useState("");
  const [, setLocation] = useLocation();
  
  const texts = [
    "Uddalab bo'lmas topshiriqlar bajaruvchisi",
    "Murakkablikni osonlashtiramiz, oddiylikni mukammallashtiramiz",
    "Sun'iy intellekt – sizning biznesingiz uchun yangi imkoniyat",
    "Ishlaringizni avtomatlashtirib, vaqtngizni tejaymiz"
  ];
  
  useEffect(() => {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typeText = () => {
      const currentText = texts[textIndex];
      
      if (!isDeleting) {
        // Matn yozilmoqda
        if (charIndex <= currentText.length) {
          setDisplayText(currentText.slice(0, charIndex));
          charIndex++;
          setTimeout(typeText, 100);
        } else {
          // Matn to'liq yozildi, 2 soniya kutamiz
          setTimeout(() => {
            isDeleting = true;
            typeText();
          }, 2000);
        }
      } else {
        // Matn o'chirilmoqda
        if (charIndex > 0) {
          setDisplayText(currentText.slice(0, charIndex - 1));
          charIndex--;
          setTimeout(typeText, 50);
        } else {
          // Matn to'liq o'chirildi, keyingi matnga o'tamiz
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(typeText, 100);
        }
      }
    };
    
    typeText();
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
          Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
        </video>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Logo Text */}
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-2xl tracking-wider">
            SAYD.X
          </h2>
        </motion.div>
        
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-2xl">
            <span className="inline-block">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>
        </motion.div>
        
        <motion.p 
          className="text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          Telegram botlar, zamonaviy web-saytlar, mini-app va mobil ilovalar, Google Sheets integratsiyasi asosidagi avtomatlashtirilgan hisobot va balans tizimlari, shuningdek UI/UX dizayn kabi turli AyTi yechimlarni mobil qurilmalarda tez, qulay va yuqori sifatda taqdim etamiz.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
        >
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 font-semibold shadow-xl"
            data-testid="button-quick-request"
            onClick={() => setLocation("/ariza")}
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Buyurtma berish
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white/30 text-white backdrop-blur-sm bg-white/10 hover:bg-white/20 shadow-xl"
            data-testid="button-view-services"
            onClick={() => setLocation("/xizmatlar")}
          >
            <Play className="w-5 h-5 mr-2" />
            Xizmatlarni ko'rish
          </Button>
        </motion.div>
      </div>
    </section>
  );
}