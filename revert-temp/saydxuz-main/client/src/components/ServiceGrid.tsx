import { Bot, Globe, FileSpreadsheet, Palette, Smartphone, Target, Cpu, Wrench } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { useQuery } from "@tanstack/react-query";

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
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
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
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
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