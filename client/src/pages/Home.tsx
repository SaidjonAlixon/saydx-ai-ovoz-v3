import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import ServiceGrid from "@/components/ServiceGrid";
import AboutSection from "@/components/AboutSection";
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
    title: "AI Ovozli Idrok Platformasi ($5000)",
    description: "Kelajak texnologiyalariga asoslangan sun'iy intellekt (AI) ovozli idrok veb-sayti. Sayt foydalanuvchilar bilan jonli ravishda nutq orqali muloqot qiladi va istalgan savolga ovozli, aqlli javob qaytaradi.",
    category: "Maxsus xizmatlar",
    technologies: ["AI Voice Recognition", "NLP", "React", "Node.js"],
    results: [
      { metric: "Aniqlik", value: "99%", icon: <Star className="w-4 h-4 text-yellow-500" /> },
      { metric: "Javob Tezl.", value: "0.2s", icon: <TrendingUp className="w-4 h-4 text-green-500" /> }
    ],
    image: "/ai_voice.jpg",
    duration: "1.5 oy",
    link: "https://voice-ai-demo.com"
  },
  {
    title: "Dotsent AI ($5000)",
    description: "Talabalar, o'qituvchilar va ilmiy izlanuvchilar uchun mo'ljallangan AI asosidagi kuchli Telegram bot. Kurs ishi, referat va maqolalarni avtomatik tarzda to'liq tayyorlab, PDF formatida yuklaydi.",
    category: "Telegram Bot",
    technologies: ["Python", "OpenAI", "Telegram API"],
    results: [
      { metric: "Foydalanuvchi", value: "10K+", icon: <Users className="w-4 h-4 text-blue-500" /> },
      { metric: "Vaqt Tejalishi", value: "90%", icon: <TrendingUp className="w-4 h-4 text-green-500" /> }
    ],
    image: "/dotsent.jpg",
    duration: "1 oy",
    link: "https://t.me/Dotsent_ai_bot"
  },
  {
    title: "Google Sheets ERP & Data Sync ($1800)",
    description: "Katta hajmdagi ma'lumotlar bilan ishlovchi logistika va savdo kompaniyalari uchun o'ta murakkab Google Sheets arxitekturasi va tizimiy avtomatlashtirish ishlari.",
    category: "Avtomatlashtirish",
    technologies: ["Google Sheets API", "Apps Script", "Data Opt."],
    results: [
      { metric: "Hajm", value: "100K+", icon: <Users className="w-4 h-4 text-blue-500" /> },
      { metric: "Tezlashuv", value: "X3", icon: <TrendingUp className="w-4 h-4 text-green-500" /> }
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg",
    duration: "25 kun",
    link: "https://docs.google.com/"
  }
];

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section id="stats-section" className="py-12 px-4 relative overflow-hidden">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-1/4 w-[40%] h-[100%] bg-cyan-500/10 blur-[100px] rounded-full mix-blend-screen"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 left-1/4 w-[30%] h-[80%] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen"
          />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
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
              whileHover={{ y: -8, scale: 1.05 }}
            >
              <Card className="text-center p-8 bg-white/[0.03] backdrop-blur-2xl border-white/5 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] rounded-[32px] group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="pt-2 relative z-10">
                  <div className="text-4xl font-black text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    <CountUp end={50} suffix="+" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-cyan-400 transition-colors">Yakunlangan</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.05 }}
            >
              <Card className="text-center p-8 bg-white/[0.03] backdrop-blur-2xl border-white/5 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] rounded-[32px] group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="pt-2 relative z-10">
                  <div className="text-4xl font-black text-[#00d4ff] mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                    <CountUp end={10} suffix="+" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-cyan-400 transition-colors">Bajarilmoqda</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.05 }}
            >
              <Card className="text-center p-8 bg-white/[0.03] backdrop-blur-2xl border-white/5 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] rounded-[32px] group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="pt-2 relative z-10">
                  <div className="text-4xl font-black text-white mb-2 flex justify-center items-center gap-1">
                    <CountUp end={4.9} duration={1500} />
                    <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-yellow-500 transition-colors">Reyting</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.05 }}
            >
              <Card className="text-center p-8 bg-white/[0.03] backdrop-blur-2xl border-white/5 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] rounded-[32px] group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="pt-2 relative z-10">
                  <div className="text-4xl font-black text-cyan-400 mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    24/7
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-cyan-400 transition-colors">Yordam</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div id="services-section">
        <ServiceGrid />
      </div>

      {/* About Us Section */}
      <div id="about-section">
        <AboutSection />
      </div>

      {/* Portfolio Section */}
      <section id="portfolio-section" className="py-24 px-4 relative overflow-hidden">
        {/* Deep Cyber Background Grid & Glows */}
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/v1714558602/grid_pattern_1_aqzqx2.svg')] bg-[length:30px_30px] opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [0, -40, 0], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen"
          />
          <motion.div
            animate={{ y: [0, 50, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 3 }}
            className="absolute bottom-[0%] right-[-5%] w-[40%] h-[60%] bg-cyan-600/10 blur-[150px] rounded-full mix-blend-screen"
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Bizning Portfoliomiz</span>
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Bajarilgan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">Ishlar</span>
            </motion.h2>
            <motion.p
              className="text-lg text-white/50 max-w-2xl mx-auto font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Mijozlarimiz uchun yaratgan eng muvaffaqiyatli loyihalar va ularning real natijalari.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {portfolioData.map((item, index) => (
              <PortfolioCard key={index} {...item} />
            ))}
          </div>

          <div className="text-center">
            <Button
              className="premium-crystal crystal-shine h-14 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-white border-white/20 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all group"
              onClick={() => setLocation("/portfolio")}
            >
              <span className="relative z-10 flex items-center gap-3 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                Barcha ishlarni ko'rish
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-400" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news-section" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle Aurora Effect */}
          <motion.div 
            animate={{ x: [-50, 50, -50], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-[120px] rounded-[100%] mix-blend-screen"
          />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Blog & Yangiliklar</span>
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              So'nggi <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">Yangiliklar</span>
            </motion.h2>
            <motion.p
              className="text-lg text-white/50 max-w-2xl mx-auto font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              AyTi sohasidagi eng so'nggi yangiliklar va foydali maslahatlar.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {newsData.map((news, index) => (
              <NewsCard key={index} {...news} />
            ))}
          </div>

          <div className="text-center">
            <Button
              className="premium-crystal crystal-shine h-14 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-white border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all group"
              onClick={() => console.log("View all news triggered")}
            >
              <span className="relative z-10 flex items-center gap-3 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                Barcha yangiliklarni ko'rish
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-400" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="py-24 px-4 relative overflow-hidden">
        {/* Radar/Pulse effect in the background of whole section */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,theme(colors.cyan.500/0.1)_0%,transparent_70%)] rounded-full animate-pulse blur-3xl delay-1000" />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            className="premium-crystal crystal-shine p-12 md:p-20 rounded-[48px] border-white/5 text-center relative overflow-hidden group"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-cyan-600/20 transition-colors duration-700" />
            
            <div className="relative z-10">
              <motion.h2
                className="text-4xl md:text-6xl font-black mb-8 text-white tracking-tighter"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                Loyihangizni <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">Bugun Boshlaylik!</span>
              </motion.h2>
              <motion.p
                className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto font-medium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Biznes ehtiyojlaringizni professional AyTi yechimlar bilan hal qilish uchun biz bilan bog'laning. 
                Birinchi maslahat mutlaqo bepul!
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  className="h-16 px-10 rounded-2xl bg-cyan-500/90 text-white font-black uppercase tracking-widest text-xs hover:bg-cyan-400 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(6,182,212,0.3)] group border border-white/20"
                  onClick={() => setLocation("/ariza")}
                >
                  <span className="relative z-10 flex items-center gap-3 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                    Bepul Maslahat Olish
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 px-10 rounded-2xl border-white/20 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-white font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all bg-white/5 backdrop-blur-sm"
                  onClick={() => window.location.href = "tel:+998900000000"}
                >
                  <span className="relative z-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                    Qo'ng'iroq Qilish
                  </span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}