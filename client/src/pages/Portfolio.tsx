import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, TrendingUp, Users, Code2, Award, Boxes } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import PortfolioCard from "@/components/PortfolioCard";
import QuickLeadForm from "@/components/QuickLeadForm";
import mobileApp from "@assets/generated_images/Mobile_app_interface_mockup_5376ed7a.png";
import uzumNazoratImage from "@assets/uzum_nazorat_bot.png";
import modernTech from "@assets/Panteleymon.png";

const imageMap: Record<string, string> = {
  "uzum_nazorat_bot.png": uzumNazoratImage,
  "Panteleymon.png": modernTech,
  "Mobile_app_interface_mockup_5376ed7a.png": mobileApp,
};

const iconMap: Record<string, React.ReactNode> = {
  "TrendingUp": <TrendingUp className="w-4 h-4 text-green-500" />,
  "Users": <Users className="w-4 h-4 text-blue-500" />,
};

const getImageSource = (img: string | null | undefined): string => {
  if (!img) return "";
  if (imageMap[img]) return imageMap[img];

  if (img.startsWith('http') || img.startsWith('data:')) {
    return img;
  }

  if (!img.startsWith('/')) {
    return `/${img}`;
  }

  return img;
};

export default function Portfolio() {
  const [, setLocation] = useLocation();
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'certificates' | 'tech-stack'>('projects');
  
  // AI Voice Control Listener
  useEffect(() => {
    const handleAITab = (e: any) => {
      const tab = e.detail.toLowerCase();
      if (tab.includes("project") || tab.includes("loyiha")) {
        setActiveTab("projects");
      } else if (tab.includes("cert") || tab.includes("sert") || tab.includes("yutuq")) {
        setActiveTab("certificates");
      } else if (tab.includes("tech") || tab.includes("stack") || tab.includes("texno")) {
        setActiveTab("tech-stack");
      }
      console.log("AI triggered portfolio tab:", tab);
    };

    window.addEventListener("ai-portfolio-tab", handleAITab);
    return () => window.removeEventListener("ai-portfolio-tab", handleAITab);
  }, []);

  const techStack = [
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "ReactJS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Bootstrap", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
    { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
    { name: "Material-UI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" },
    { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" },
    { name: "SweetAlert2", icon: "https://sweetalert2.github.io/images/SweetAlert2.png" },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  ];

  const { data: portfolioResponse } = useQuery<{ success: boolean; data: any[] }>({
    queryFn: async () => {
      try {
        const res = await fetch("/data.json");
        const clone = res.clone();
        try {
          const rawData = await clone.json();
          // Convert from backend internal DB storage format
          if (rawData.portfolios && Array.isArray(rawData.portfolios)) {
            return {
              success: true,
              data: rawData.portfolios.map((p: any) => p[1])
            };
          }
          return rawData;
        } catch {
          const apiRes = await fetch("/api/portfolio");
          return await apiRes.json();
        }
      } catch {
        const apiRes = await fetch("/api/portfolio");
        return await apiRes.json();
      }
    },
    queryKey: ['/data.json'],
    staleTime: 1000 * 60 * 5,
  });

  const portfolios = portfolioResponse?.data || [];

  const portfolioData = portfolios.map((p: any) => {
    let tech = [];
    let res = [];
    let imgs = [];
    try { tech = JSON.parse(p.technologies || "[]"); } catch (e) { }
    try { res = JSON.parse(p.results || "[]"); } catch (e) { }
    try { imgs = JSON.parse(p.images || "[]"); } catch (e) { }

    if (!Array.isArray(tech)) tech = tech ? [tech] : [];
    if (!Array.isArray(res)) res = [];
    if (!Array.isArray(imgs)) imgs = imgs ? [imgs] : [];

    return {
      title: p.title,
      description: p.description,
      category: p.category,
      technologies: tech,
      results: res.map((r: any) => ({
        ...r,
        icon: iconMap[r.iconType] || <TrendingUp className="w-4 h-4 text-green-500" />
      })),
      image: getImageSource(imgs[0]),
      duration: p.duration,
      price: p.price,
      link: p.link,
      features: p.features ? JSON.parse(p.features) : undefined,
      advantages: p.advantages ? JSON.parse(p.advantages) : undefined,
    };
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative pt-10 pb-6 rounded-b-[3rem] bg-cyan-500/5 border-b border-cyan-500/20 overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex justify-start mb-4"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/")}
              className="rounded-full border-cyan-500/20 bg-background/50 backdrop-blur-md text-cyan-400 hover:bg-cyan-500/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Asosiy sahifaga qaytish
            </Button>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-black tracking-tighter text-white text-center mb-6 uppercase"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Bajarilgan <span className="text-cyan-400">ishlar</span>
          </motion.h1>
          <motion.p
            className="text-lg text-white/40 max-w-2xl mx-auto text-center font-medium leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Mijozlarimiz uchun yaratgan muvaffaqiyatli loyihalar va ularning real natijalari.
            Har bir loyiha biznesning o'sishiga hissa qo'shgan professional yechim.
          </motion.p>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="max-w-4xl mx-auto px-4 mb-10 mt-6">
        <div className="flex p-2 bg-[#0a0f1c] border border-white/5 rounded-2xl md:rounded-full justify-between gap-2 overflow-x-auto custom-scrollbar shadow-lg">
          
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 min-w-[140px] flex flex-col items-center justify-center gap-2 py-4 px-6 outline-none transition-all duration-300 rounded-xl md:rounded-full ${
              activeTab === 'projects' 
                ? 'bg-gradient-to-r from-blue-700/80 to-blue-900/80 text-white shadow-md' 
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <Code2 className={`w-5 h-5 ${activeTab === 'projects' ? 'text-white' : 'text-white/50'}`} />
            <span className="text-sm font-bold tracking-wide">Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex-1 min-w-[140px] flex flex-col items-center justify-center gap-2 py-4 px-6 outline-none transition-all duration-300 rounded-xl md:rounded-full ${
              activeTab === 'certificates' 
                ? 'bg-gradient-to-r from-blue-700/80 to-blue-900/80 text-white shadow-md' 
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <Award className={`w-5 h-5 ${activeTab === 'certificates' ? 'text-white' : 'text-white/50'}`} />
            <span className="text-sm font-bold tracking-wide">Certificates</span>
          </button>

          <button
            onClick={() => setActiveTab('tech-stack')}
            className={`flex-1 min-w-[140px] flex flex-col items-center justify-center gap-2 py-4 px-6 outline-none transition-all duration-300 rounded-xl md:rounded-full ${
              activeTab === 'tech-stack' 
                ? 'bg-gradient-to-r from-blue-700/80 to-blue-900/80 text-white shadow-md' 
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <Boxes className={`w-5 h-5 ${activeTab === 'tech-stack' ? 'text-white' : 'text-white/50'}`} />
            <span className="text-sm font-bold tracking-wide">Tech Stack</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <section className="py-4 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          
          {activeTab === 'projects' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {portfolioData.map((item, index) => (
                <PortfolioCard key={index} {...item} />
              ))}
            </motion.div>
          )}

          {activeTab === 'certificates' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-[300px] flex flex-col items-center justify-center text-center p-12 border border-white/5 bg-white/[0.02] rounded-3xl"
            >
              <Award className="w-16 h-16 text-cyan-500/30 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Sertifikatlar</h3>
              <p className="text-white/50 max-w-md">Tez orada bizning malaka va yutuqlarimizni isbotlovchi sertifikatlar ushbu bo'limga qo'shiladi.</p>
            </motion.div>
          )}

          {activeTab === 'tech-stack' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex flex-col items-center justify-center gap-4 p-6 bg-[#0e1222] border border-white/5 rounded-2xl hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all group"
                >
                  <div className="w-12 h-12 flex items-center justify-center relative">
                    {/* Glowing effect inside icon container */}
                    <div className="absolute inset-0 bg-white/5 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-colors" />
                    <img 
                      src={tech.icon} 
                      alt={tech.name} 
                      className={`w-10 h-10 object-contain relative z-10 transition-transform group-hover:scale-110 ${tech.name === 'Vercel' ? 'invert opacity-90' : ''}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerHTML += '<div class="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-xs font-bold ring-1 ring-white/20">SVG</div>';
                      }}
                    />
                  </div>
                  <span className="text-[13px] font-bold text-white/70 group-hover:text-white transition-colors text-center">{tech.name}</span>
                </motion.div>
              ))}
            </motion.div>
          )}

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-background relative border-t border-border/30 overflow-hidden mt-12">
        <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-foreground"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Loyihangizni boshlaymizmi?
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Sizning biznesingizga to'liq mos keladigan, eng zamonaviy yechimlarni taklif qilamiz. Hoziroq murojaat qiling va bepul maslahat oling!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              size="lg"
              onClick={() => setIsLeadFormOpen(true)}
              className="rounded-full h-14 px-10 text-lg font-medium shadow-[0_0_30px_-5px_hsl(var(--primary))] hover:shadow-[0_0_40px_-5px_hsl(var(--primary))] transition-shadow duration-300 w-full sm:w-auto"
            >
              Loyiha boshlash
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Lead Form Dialog */}
      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <QuickLeadForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
