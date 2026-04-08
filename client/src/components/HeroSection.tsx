import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Server, Bot, Database, Terminal } from "lucide-react";

export default function HeroSection() {
  const [, setLocation] = useLocation();

  const brands = [
    { name: "Slack", icon: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg" },
    { name: "Shopify", icon: "https://cdn.worldvectorlogo.com/logos/shopify.svg" },
    { name: "Adobe", icon: "https://cdn.worldvectorlogo.com/logos/adobe-2.svg" },
    { name: "Airbnb", icon: "https://cdn.worldvectorlogo.com/logos/airbnb-2-1.svg" },
    { name: "Microsoft", icon: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "Notion", icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" }
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020617] pt-24 sm:pt-20">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/v1714558602/grid_pattern_1_aqzqx2.svg')] bg-[length:40px_40px] opacity-[0.03] pointer-events-none" />
      
      {/* Animated Deep Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/20 blur-[120px] rounded-full mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -100, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-700/20 blur-[150px] rounded-full mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-purple-600/20 blur-[100px] rounded-full mix-blend-screen" 
        />
        
        {/* Subtle noise effect for texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
        
        {/* Dark vignette to focus center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)] opacity-80" />
      </div>

      <div className="relative z-10 container max-w-6xl mx-auto px-6 text-center">
        {/* Floating Badges */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden">
          <motion.div 
            animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[18%] left-[4%] xl:left-[8%] px-4 py-2 bg-cyan-500/10 backdrop-blur-md border border-cyan-500/20 rounded-full flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest text-nowrap">React & Next.js</span>
            <Code2 className="w-3.5 h-3.5 text-cyan-400 ml-1" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[20%] right-[4%] xl:right-[10%] px-4 py-2 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-full flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest text-nowrap">Node.js & Python</span>
            <Server className="w-3.5 h-3.5 text-green-400 ml-1" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-[35%] left-[2%] xl:left-[8%] px-4 py-2 bg-blue-500/10 backdrop-blur-md border border-blue-500/20 rounded-full flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest text-nowrap">Telegram Bot API</span>
            <Bot className="w-3.5 h-3.5 text-blue-400 ml-1" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0], x: [0, 8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-[30%] right-[2%] xl:right-[12%] px-4 py-2 bg-purple-500/10 backdrop-blur-md border border-purple-500/20 rounded-full flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest text-nowrap">PostgreSQL & Redis</span>
            <Database className="w-3.5 h-3.5 text-purple-400 ml-1" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, -8, 0], x: [0, -5, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[8%] left-[30%] xl:left-[35%] px-4 py-2 bg-orange-500/10 backdrop-blur-md border border-orange-500/20 rounded-full flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest text-nowrap">AWS & Docker</span>
            <Terminal className="w-3.5 h-3.5 text-orange-400 ml-1" />
          </motion.div>
        </div>

        {/* Hero Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-10 group"
        >
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
          <span className="text-[11px] font-bold text-white/70 uppercase tracking-[0.15em]">
            Kreativ yechimlarimiz orqali rivojlanayotgan 200+ kompaniyalar safiga qo'shiling.
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-8xl font-black text-white tracking-tighter mb-10 leading-[0.9]"
        >
          Biz Raqamli O'sishni <span className="italic font-light text-white/50">Ta'minlovchi</span> <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-300% animate-gradient-x">Yechimlar Yaratamiz.</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-base sm:text-lg md:text-xl text-white/40 max-w-3xl mx-auto leading-relaxed mb-12 font-medium px-1"
        >
          Biz tashrif buyuruvchilarni sodiq mijozlarga aylantiruvchi yuqori samarali veb-saytlar <br className="hidden md:block" />
          va raqamli mahsulotlar yaratish uchun maqsadlari ulkan brendlar bilan ishlaymiz.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-24 sm:mb-32 px-2"
        >
          <Button
            size="lg"
            className="h-16 px-10 bg-cyan-600/90 text-white hover:bg-cyan-500 font-black uppercase tracking-widest text-xs rounded-2xl shadow-[0_15px_35px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95 group relative overflow-hidden border border-white/20"
            onClick={() => setLocation("/ariza")}
          >
            <span className="relative z-10 flex items-center gap-2 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              Loyihani boshlash
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-white" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="h-16 px-10 border border-white/20 text-white bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 hover:border-cyan-500/50"
            onClick={() => setLocation("/portfolio")}
          >
            <span className="relative z-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
              Portfolioni ko'rish
            </span>
          </Button>
        </motion.div>
      </div>

      {/* Trusted By Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full relative z-10 bg-cyan-500/5 border-y border-cyan-500/10 backdrop-blur-sm py-16"
      >
        <p className="text-[10px] sm:text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-12 text-center">200 dan ortiq kompaniyalar ishonchini qozongan</p>
        
        <div className="flex flex-col items-start gap-12 w-full relative overflow-hidden group">
          {/* Ambient cyan glow inside the bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-500/5 opacity-50 transition-opacity duration-1000 pointer-events-none" />
            
            <div 
              className="relative z-10 w-full overflow-hidden"
              style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 25px, black calc(100% - 25px), transparent)", maskImage: "linear-gradient(to right, transparent, black 25px, black calc(100% - 25px), transparent)" }}
            >
              {/* Row 1 - Moving Left */}
              <motion.div 
                className="flex flex-nowrap shrink-0 w-max items-center justify-start gap-x-16 pr-16 pb-3 opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              >
                {Array(15).fill(brands).flat().map((brand, i) => (
                  <img 
                    key={`r1-${brand.name}-${i}`}
                    src={brand.icon} 
                    alt={brand.name} 
                    className="h-6 md:h-8 w-auto object-contain filter grayscale invert brightness-[1.8] hover:scale-110 transition-transform duration-300 pointer-events-auto"
                  />
                ))}
              </motion.div>

              {/* Row 2 - Moving Right */}
              <motion.div 
                className="flex flex-nowrap shrink-0 w-max items-center justify-start gap-x-16 pr-16 pt-3 opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                animate={{ x: ["-50%", "0%"] }}
                transition={{ duration: 130, repeat: Infinity, ease: "linear" }}
              >
                {Array(15).fill(brands).flat().reverse().map((brand, i) => (
                  <img 
                    key={`r2-${brand.name}-${i}`}
                    src={brand.icon} 
                    alt={brand.name} 
                    className="h-6 md:h-8 w-auto object-contain filter grayscale invert brightness-[1.8] hover:scale-110 transition-transform duration-300 pointer-events-auto"
                  />
                ))}
              </motion.div>
            </div>
          </div>
      </motion.div>
    </section>
  );
}