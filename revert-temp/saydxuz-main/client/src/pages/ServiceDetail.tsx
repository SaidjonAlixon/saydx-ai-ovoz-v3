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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/xizmatlar")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Orqaga
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-start justify-between"
          >
            <div>
              <Badge variant="secondary" className="mb-3">
                {service.category}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {service.name}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {service.shortDescription}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-4 mt-6"
          >
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{service.rating}</span>
            </div>
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-semibold">{service.duration}</span>
            </div>
            <div className="bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="font-bold text-primary text-xl">
                {formatPrice(service.basePrice)}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Tavsif</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.fullDescription}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Xizmat imkoniyatlari</h2>
                  <ul className="space-y-3">
                    {service.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 p-1 bg-primary/10 rounded-full">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="sticky top-4">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Xizmatga buyurtma berish tafsiloti</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Narx</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(service.basePrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bajarilish muddati</p>
                      <p className="font-semibold">{service.duration}</p>
                    </div>
                    
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-start gap-2">
                          <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                              O'rtacha bajarilish muddati
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                              Boshlang'ich va o'rtacha loyihalar: <strong>7-12 kun</strong>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                              Aniq muddat loyihaning murakkabligiga qarab <strong>texnik topshiriq (TZ)</strong> dan keyin belgilanadi!
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      Buyurtma berish
                    </Button>
                    <p className="text-xs text-center font-bold text-red-600">
                      Bepul maslahat va loyiha tahlili
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Order Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <QuickLeadForm defaultService={service.name} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
