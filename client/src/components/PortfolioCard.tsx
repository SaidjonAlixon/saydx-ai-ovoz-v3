import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, TrendingUp, Users, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import QuickLeadForm from "./QuickLeadForm";

interface PortfolioCardProps {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  results: {
    metric: string;
    value: string;
    icon: React.ReactNode;
  }[];
  image: string;
  duration: string;
  link?: string;
  price?: string;
  features?: string[];
  advantages?: string[];
}

export default function PortfolioCard({
  title,
  description,
  category,
  technologies,
  results,
  image,
  duration,
  link,
  price,
  features,
  advantages
}: PortfolioCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -12, scale: 1.02 }}
        className="group h-full"
      >
        <Card className="relative bg-[#0f172a]/80 backdrop-blur-xl border-white/5 rounded-[32px] overflow-hidden transition-all duration-500 group-hover:border-cyan-500/30 group-hover:shadow-[0_20px_50px_rgba(6,182,212,0.2)] h-full flex flex-col border">
          {/* Animated Glow Backlight */}
          <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] bg-cyan-600/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute -bottom-[20%] -left-[20%] w-[60%] h-[60%] bg-purple-600/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div
            className="aspect-video relative overflow-hidden flex items-center justify-center cursor-pointer group/img"
            onClick={() => setIsImageModalOpen(true)}
          >
             <div className="absolute inset-0 bg-black/40 group-hover/img:bg-black/20 transition-colors z-10" />
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-20" />
          </div>

          <CardHeader className="pb-4 relative z-30 -mt-12 px-6">
            <div className="flex items-start justify-between mb-2">
              <Badge className="bg-cyan-500/10 text-cyan-400 text-[10px] uppercase font-black px-3 py-1 border-cyan-500/20 backdrop-blur-md">
                {category}
              </Badge>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5 text-cyan-500/50" />
                <span>{duration}</span>
              </div>
            </div>
            <CardTitle className="text-xl font-black text-white tracking-tight uppercase leading-none mb-2">{title}</CardTitle>
            <CardDescription className="text-sm leading-relaxed text-white/40 font-medium line-clamp-2">
              {description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 relative z-30 px-6 pb-8 flex-1 flex flex-col">
            {/* Technologies */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 pl-1">Texnologiyalar:</p>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-[10px] uppercase font-black border-white/5 bg-white/5 text-white/50 px-2 py-0.5 group-hover:border-cyan-500/30 group-hover:text-cyan-400/80 transition-colors">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex-1" />

            <Button
              className="w-full premium-crystal crystal-shine h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group/btn border-white/20"
              onClick={() => setIsDialogOpen(true)}
            >
              <span className="flex items-center gap-2 relative z-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                Batafsil ko'rish
                <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-cyan-400" />
              </span>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Portfolio Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[98vw] sm:max-w-[95vw] md:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto p-0 bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 text-white sm:rounded-[2rem] shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-x-hidden custom-scrollbar">
          
          {/* Ambient Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 p-4 sm:p-6 md:p-8 space-y-8 lg:space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <DialogTitle className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 mb-4">{title}</DialogTitle>
                <div className="flex flex-wrap gap-3 items-center">
                  <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-1.5 font-bold uppercase tracking-wider text-xs">{category}</Badge>
                  <div className="flex items-center gap-2 text-white/50 text-sm font-medium bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                    <Clock className="w-4 h-4 text-cyan-400/70" />
                    <span>Muddat: <strong className="text-white/80">{duration}</strong></span>
                  </div>
                  {link && (
                    <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/90 text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-1.5 rounded-full border border-cyan-400/30 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                      <ExternalLink className="w-4 h-4" />
                      Loyihani ko'rish
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Image Hero */}
            <div
              className="w-full rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer group relative border border-white/10 bg-[#0a0f1c] shadow-2xl"
              onClick={() => setIsImageModalOpen(true)}
            >
              <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay z-10" />
              <img src={image} alt={title} className="w-full max-h-[35vh] md:max-h-[50vh] object-cover sm:object-contain relative z-0 group-hover:scale-105 transition-transform duration-700" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Left Column (Main Content) */}
              <div className="lg:col-span-2 space-y-8">
                {/* 1. Loyiha haqida qisqacha */}
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-white"><span className="text-cyan-400 font-black">01.</span> Loyiha matni</h3>
                  <div className="p-5 md:p-6 bg-white/[0.03] border border-white/10 rounded-2xl space-y-4 shadow-inner">
                    <p className="text-sm md:text-base text-white/70 leading-relaxed font-medium"><strong>Maqsadi:</strong> {description}</p>
                    <p className="text-sm md:text-base text-white/70 leading-relaxed font-medium"><strong>Kimlar uchun:</strong> Kichik va o'rta biznes egalalari, xizmat ko'rsatish sohalari</p>
                    <p className="text-sm md:text-base text-white/70 leading-relaxed font-medium"><strong>Qiymat taklifi:</strong> Raqamli makonda o'z o'rnini mustahkamlash va mijozlar oqimini oshirish yechimi.</p>
                  </div>
                </div>

                {/* 2. Asosiy funksiyalar */}
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-white"><span className="text-cyan-400 font-black">02.</span> Asosiy funksiyalar</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-2xl hover:border-cyan-500/30 transition-colors">
                      <h4 className="text-sm md:text-base font-bold mb-4 text-cyan-400 tracking-wide uppercase">Mijoz tomoni</h4>
                      <ul className="space-y-3">
                        {['Qulay interfeys (Mobile First)', 'Tezkor ishlash', 'Oson navigatsiya', 'Zamonaviy animatsiyalar'].map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-cyan-400 flex-shrink-0" />
                            <span className="text-sm text-white/70">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-2xl hover:border-purple-500/30 transition-colors">
                      <h4 className="text-sm md:text-base font-bold mb-4 text-purple-400 tracking-wide uppercase">Tizim tomoni</h4>
                      <ul className="space-y-3">
                        {['Xavfsiz ulanish', 'Avtomatlashtirilgan oqim', 'Statistika yig\'ish', 'Lokal integratsiyalar'].map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                            <span className="text-sm text-white/70">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 3. Erishilgan natijalar */}
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-white"><span className="text-cyan-400 font-black">03.</span> Kutilayotgan natijalar</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {results.map((result, index) => (
                      <div key={index} className="text-center p-4 bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-2xl flex flex-col items-center justify-center hover:scale-[1.03] transition-transform">
                        <div className="mb-2 p-2 bg-cyan-500/20 rounded-full text-cyan-400">
                          {result.icon}
                        </div>
                        <div className="text-2xl lg:text-3xl font-black text-white mb-1 drop-shadow-md">{result.value}</div>
                        <div className="text-[10px] md:text-xs text-cyan-400/80 uppercase font-bold tracking-wider">{result.metric}</div>
                      </div>
                    ))}
                    <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl flex flex-col items-center justify-center hover:scale-[1.03] transition-transform">
                      <div className="mb-2 p-2 bg-green-500/20 rounded-full text-green-400">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="text-2xl lg:text-3xl font-black text-white mb-1 drop-shadow-md">X2</div>
                      <div className="text-[10px] md:text-xs text-green-400/80 uppercase font-bold tracking-wider">Mijoz Oqimi</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl flex flex-col items-center justify-center hover:scale-[1.03] transition-transform">
                      <div className="mb-2 p-2 bg-purple-500/20 rounded-full text-purple-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="text-2xl lg:text-3xl font-black text-white mb-1 drop-shadow-md">24/7</div>
                      <div className="text-[10px] md:text-xs text-purple-400/80 uppercase font-bold tracking-wider">Ishlash</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Sidebar) */}
              <div className="space-y-6">
                
                {/* Texnologiyalar */}
                <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl space-y-4">
                  <h4 className="font-bold text-white uppercase tracking-widest text-xs border-b border-white/10 pb-2">Ishlatilgan Tizimlar</h4>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {technologies.map((tech, index) => (
                      <Badge key={index} className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 px-3 py-1 font-medium transition-colors">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Integratsiyalar */}
                <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl space-y-4">
                  <h4 className="font-bold text-white uppercase tracking-widest text-xs border-b border-white/10 pb-2">Integratsiyalar</h4>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['Telegram API', 'SEO Analytics', 'Xavfsiz Hosting', 'SSL Sertifikat'].map((tech, index) => (
                      <Badge key={index} variant="outline" className="border-white/20 text-white/60 px-3 py-1 font-medium bg-black/20 transition-colors">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Ustunliklar */}
                <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl space-y-4">
                  <h4 className="font-bold text-white uppercase tracking-widest text-xs border-b border-white/10 pb-2">Loyiha Ustunliklari</h4>
                  <ul className="space-y-4 pt-2">
                    {advantages?.map((adv, idx) => (
                      <li key={idx} className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-white mb-0.5">{adv.split(' - ')[0]}</p>
                          <p className="text-xs text-white/50 leading-relaxed">{adv.split(' - ')[1] || adv}</p>
                        </div>
                      </li>
                    )) || (
                      <>
                        <li className="flex gap-3">
                          <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-white mb-0.5">Tezkor bozorga chiqish</p>
                            <p className="text-xs text-white/50 leading-relaxed">{duration} ichida tayyor holda topshiriladi.</p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-white mb-0.5">Xavfsiz va Ishonchli</p>
                            <p className="text-xs text-white/50 leading-relaxed">Zamonaviy himoya, ma'lumotlar xavfsizligi.</p>
                          </div>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* CTA Box */}
                <div className="relative p-8 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-2xl text-center overflow-hidden shadow-2xl mt-8">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                  <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(6,182,212,0.1)_0deg,transparent_60deg,transparent_300deg,rgba(6,182,212,0.1)_360deg)] animate-spin-slow opacity-50" />
                  
                  <h4 className="font-black text-2xl text-white mb-3 relative z-10 drop-shadow-md">Loyihangiz bormi?</h4>
                  <p className="text-sm text-cyan-100/70 mb-8 relative z-10 leading-relaxed font-medium">
                    Sizning biznesingiz uchun eng to'g'ri yechim. Hoziroq bepul maslahat oling.
                  </p>
                  
                  <Button 
                    className="w-full premium-crystal crystal-shine h-14 rounded-xl font-black uppercase tracking-widest text-xs shadow-[0_10px_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all hover:scale-105 active:scale-95 relative z-10 border border-white/20"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setIsLeadFormOpen(true);
                    }}
                  >
                    Boshlash
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lead Form Dialog */}
      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <QuickLeadForm />
        </DialogContent>
      </Dialog>

      {/* Image Modal Dialog */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-[98vw] sm:max-w-4xl lg:max-w-6xl max-h-[90vh] p-0">
          <div className="relative">
            <img
              src={image}
              alt={title}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsImageModalOpen(false)}
                className="bg-black/50 text-white hover:bg-black/70 text-xs sm:text-sm"
              >
                ✕
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}