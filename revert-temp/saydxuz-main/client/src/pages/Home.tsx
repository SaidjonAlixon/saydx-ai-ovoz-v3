import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import ServiceGrid from "@/components/ServiceGrid";
import NewsCard from "@/components/NewsCard";
import PortfolioCard from "@/components/PortfolioCard";
import heroImage from "@assets/generated_images/Modern_tech_workspace_hero_c9c8682e.png";
import mobileApp from "@assets/generated_images/Mobile_app_interface_mockup_5376ed7a.png";

// CountUp komponenti
const CountUp = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isVisible, end, duration]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsVisible(true)}
    >
      {count}{suffix}
    </motion.div>
  );
};

//todo: remove mock functionality  
const newsData = [
  {
    title: "2025-yilda biznes uchun eng muhim tehnologiya trendlari",
    excerpt: "Yangi yilda biznes jarayonlarini avtomatlashtirish va raqamlashtirish bo'yicha eng so'nggi tendentsiyalar.",
    category: "Tehnologiya",
    date: "2 dekabr",
    readTime: "5",
    views: 142,
    image: heroImage
  },
  {
    title: "Telegram bot orqali biznesni qanday kengaytirish mumkin",
    excerpt: "Real misollar va strategiyalar asosida telegram botlarning biznes uchun afzalliklari.",
    category: "Marketing",
    date: "28 noyabr", 
    readTime: "7",
    views: 89,
    image: mobileApp
  },
  {
    title: "Veb-sayt yaratishda eng ko'p uchraydigan xatolar",
    excerpt: "Professional veb-sayt yaratishda oldini olish kerak bo'lgan asosiy muammolar va yechimlar.",
    category: "Veb-dasturlash",
    date: "25 noyabr",
    readTime: "4", 
    views: 234,
    image: heroImage
  }
];

const portfolioData = [
  {
    title: "Yetkazib berish boti",
    description: "Restoran uchun telegram bot orqali buyurtma qabul qilish va yetkazib berish tizimi.",
    category: "Telegram Bot",
    technologies: ["Node.js", "Telegram API", "PostgreSQL", "Payment API"],
    results: [
      {
        metric: "Buyurtmalar",
        value: "+250%",
        icon: <TrendingUp className="w-4 h-4 text-green-500" />
      },
      {
        metric: "Mijozlar", 
        value: "1,200+",
        icon: <Users className="w-4 h-4 text-blue-500" />
      }
    ],
    image: mobileApp,
    duration: "7 kun"
  }
];

export default function Home() {
  const [, setLocation] = useLocation();
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-lg md:text-xl font-medium text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              Biz ishga tushurib topshirgan loyihalar va ayni vaqtda bajarilayotgan loyihalarni ko'rishingiz mumkin.
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 100 }}
            >
              <Card className="text-center p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="pt-2">
                  <div className="text-2xl font-bold text-primary">
                    <CountUp end={50} suffix="+" />
                  </div>
                  <div className="text-sm text-muted-foreground">Yakunlangan</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <Card className="text-center p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="pt-2">
                  <div className="text-2xl font-bold text-primary">
                    <CountUp end={10} suffix="+" />
                  </div>
                  <div className="text-sm text-muted-foreground">Bajarilmoqda</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
            >
              <Card className="text-center p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="pt-2">
                  <div className="text-2xl font-bold text-primary">
                    <CountUp end={4.9} duration={1500} />
                  </div>
                  <div className="text-sm text-muted-foreground">Reyting</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <Card className="text-center p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="pt-2">
                  <div className="text-2xl font-bold text-primary">
                    24/7
                  </div>
                  <div className="text-sm text-muted-foreground">Yordam</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServiceGrid />

      {/* Portfolio Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Bajarilgan ishlar
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Mijozlarimiz uchun yaratgan eng muvaffaqiyatli loyihalar va ularning natijalari
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {portfolioData.map((item, index) => (
              <PortfolioCard key={index} {...item} />
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              data-testid="button-view-all-portfolio"
              onClick={() => setLocation("/portfolio")}
            >
              Barcha ishlarni ko'rish
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              So'nggi yangiliklar
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              AyTi sohasidagi eng so'nggi yangiliklar va foydali maslahatlar
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {newsData.map((news, index) => (
              <NewsCard key={index} {...news} />
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              data-testid="button-view-all-news"
              onClick={() => console.log("View all news triggered")}
            >
              Barcha yangiliklarni ko'rish
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Loyihangizni bugun boshlaylik!
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Biznes ehtiyojlaringizni professional AyTi yechimlar bilan hal qilish uchun biz bilan bog'laning
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button 
              size="lg"
              data-testid="button-cta-request"
              onClick={() => console.log("CTA request triggered")}
              className="hover:scale-105 transition-transform"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Bepul maslahat olish
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              data-testid="button-cta-call"
              onClick={() => console.log("CTA call triggered")}
              className="hover:scale-105 transition-transform"
            >
              Qo'ng'iroq qilish
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}