import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, Clock, Star, Check, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import QuickLeadForm from "@/components/QuickLeadForm";

export default function ServiceDetail() {
  const [, params] = useRoute("/xizmatlar/:slug");
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: serviceData, isLoading } = useQuery<{ success: boolean; data: any }>({
    queryKey: [`/api/services/${params?.slug}`],
    enabled: !!params?.slug,
  });

  // Sahifa boshidan boshlab ko'rsatish
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params?.slug]);

  const service = serviceData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Xizmat topilmadi</h2>
            <p className="text-muted-foreground mb-4">
              Kechirasiz, bu xizmat mavjud emas
            </p>
            <Button onClick={() => setLocation("/xizmatlar")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Orqaga
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return "$" + price.toLocaleString('en-US') + "+";
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white relative overflow-hidden">
      {/* Background Ambient Glows for the whole page */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <div className="relative pt-24 pb-12 overflow-hidden border-b border-white/5">
        {/* Ambient Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="default"
              size="sm"
              onClick={() => setLocation("/xizmatlar")}
              className="mb-8 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full px-6 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Orqaga
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-start justify-between"
          >
            <div>
              <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-1.5 font-bold uppercase tracking-wider text-xs rounded-full">
                {service.category}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60">
                {service.name}
              </h1>
              <p className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed font-medium">
                {service.shortDescription}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-white">{service.rating}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white">{service.duration}</span>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md px-6 py-2.5 rounded-2xl flex items-center">
              <span className="font-black text-cyan-400 text-xl tracking-wide">
                {formatPrice(service.basePrice)}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="p-8 bg-white/[0.02] border border-white/10 rounded-3xl shadow-2xl backdrop-blur-md">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <span className="text-cyan-400 font-black">01.</span> Tavsif
                </h2>
                <div className="text-white/60 leading-relaxed space-y-4 font-medium" dangerouslySetInnerHTML={{ __html: service.fullDescription.replace(/\n/g, '<br/>') }} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="p-8 bg-white/[0.02] border border-white/10 rounded-3xl shadow-2xl backdrop-blur-md">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <span className="text-cyan-400 font-black">02.</span> Xizmat imkoniyatlari
                </h2>
                <ul className="space-y-4">
                  {(() => {
                    let featuresList: string[] = [];
                    try {
                      featuresList = typeof service.features === 'string' ? JSON.parse(service.features) : service.features;
                      if (!Array.isArray(featuresList)) featuresList = [];
                    } catch (e) {
                      featuresList = [];
                    }
                    return featuresList.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 p-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                          <Check className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="text-white/70 font-medium leading-relaxed">{feature}</span>
                      </li>
                    ));
                  })()}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:mt-0 mt-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="sticky top-24"
            >
              <div className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">Xizmatga buyurtma berish tafsiloti</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-1">Narx</p>
                    <p className="text-4xl font-black text-cyan-400 tracking-tight">
                      {formatPrice(service.basePrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-1">Bajarilish muddati</p>
                    <p className="text-lg font-bold text-white/90">{service.duration}</p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 p-5 rounded-2xl space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-cyan-100 mb-1">
                          O'rtacha bajarilish muddati
                        </p>
                        <p className="text-xs text-cyan-300/70 leading-relaxed font-medium">
                          Boshlang'ich va o'rtacha loyihalar: <strong className="text-cyan-400">7-12 kun</strong>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-green-300/70 leading-relaxed font-medium">
                          Aniq muddat loyihaning murakkabligiga qarab <strong className="text-green-400 text-[10px] uppercase tracking-wider mx-1 px-1.5 py-0.5 rounded border border-green-500/30 bg-green-500/10">texnik topshiriq (TZ)</strong> dan keyin belgilanadi!
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full premium-crystal crystal-shine h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_10px_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-white/20 transition-all hover:scale-[1.02] active:scale-95 text-white"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Buyurtma berish
                  </Button>
                  <p className="text-[10px] uppercase tracking-widest text-center font-bold text-red-400/80 pt-2">
                    Bepul maslahat va loyiha tahlili
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Order Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-transparent border-none shadow-none">
          <QuickLeadForm defaultService={service.name} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
