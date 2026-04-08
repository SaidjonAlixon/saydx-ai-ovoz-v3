import { Bot, Globe, FileSpreadsheet, Palette, Smartphone, Target, Cpu, Wrench } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
const iconMap: Record<string, React.ReactNode> = {
  "Telegram Bot": <Bot className="w-5 h-5" />,
  "Veb-sayt": <Globe className="w-5 h-5" />,
  "Sheets Avtomatlashtirish": <FileSpreadsheet className="w-5 h-5" />,
  "UI/UX Dizayn": <Palette className="w-5 h-5" />,
  "Mini-ilova": <Smartphone className="w-5 h-5" />,
  "Telegram Target": <Target className="w-5 h-5" />,
  "Mobil ilovalar": <Smartphone className="w-5 h-5" />,
  "Avtomatlashtirilgan AyTi xizmatlar": <Cpu className="w-5 h-5" />,
  "Mijoz talabi asosida": <Wrench className="w-5 h-5" />
};

const formatPrice = (price: number) => {
  return "$" + price.toLocaleString('en-US') + "+";
};

export default function ServiceGrid() {
  const { data: servicesData, isLoading } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ['/api/services'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const services = servicesData?.data || [];

  if (isLoading) {
    return (
      <section className="py-12 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/v1714558602/grid_pattern_1_aqzqx2.svg')] bg-[length:30px_30px] opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1], y: [0, -20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen absolute top-0 left-[10%]"
          />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bizning Xizmatlar</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Biznesingizni rivojlantirish uchun zamonaviy AyTi yechimlar va professional xizmatlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[#020617]" />
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/v1714558602/grid_pattern_1_aqzqx2.svg')] bg-[length:30px_30px] opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="w-[40%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen absolute top-[10%] left-[10%]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.15, 0.05], x: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="w-[30%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen absolute bottom-[10%] right-[10%]"
        />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bizning Xizmatlar</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Biznesingizni rivojlantirish uchun zamonaviy AyTi yechimlar va professional xizmatlar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any) => (
            <ServiceCard
              key={service.id}
              title={service.name}
              description={service.shortDescription}
              price={formatPrice(service.basePrice)}
              duration={service.duration}
              rating={parseFloat(service.rating)}
              category={service.category}
              icon={iconMap[service.name] || <Bot className="w-5 h-5" />}
              features={service.features}
              slug={service.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}