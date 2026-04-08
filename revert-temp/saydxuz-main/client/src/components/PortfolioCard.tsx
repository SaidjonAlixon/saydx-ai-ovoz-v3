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
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
      <Card className="overflow-hidden hover-elevate transition-all duration-300 hover:shadow-xl">
      <div 
        className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setIsImageModalOpen(true)}
      >
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Technologies */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Texnologiyalar:</p>
          <div className="flex flex-wrap gap-1">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Results */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Natijalar:</p>
          <div className="grid grid-cols-2 gap-3">
            {results.map((result, index) => (
              <div key={index} className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="flex justify-center mb-1">
                  {result.icon}
                </div>
                <div className="text-lg font-bold text-primary">{result.value}</div>
                <div className="text-xs text-muted-foreground">{result.metric}</div>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          data-testid={`button-view-case-${title.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={() => setIsDialogOpen(true)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Batafsil ko'rish
        </Button>
      </CardContent>
    </Card>
    </motion.div>

    {/* Portfolio Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[98vw] sm:max-w-[95vw] md:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto p-2 sm:p-4 md:p-6">
        <DialogHeader className="px-2 sm:px-4">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold break-words">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 px-1 sm:px-2 md:px-0">
          {/* Image */}
            <div
              className="w-full rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex justify-center items-center mx-auto"
              onClick={() => setIsImageModalOpen(true)}
            >
              <img src={image} alt={title} className="w-full max-w-full max-h-[30vh] sm:max-h-[35vh] md:max-h-[40vh] object-contain" />
            </div>

          {/* 1. Loyiha haqida qisqacha */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold border-b pb-2 break-words">1. Loyiha haqida qisqacha</h3>
            <div className="flex gap-3 mb-4">
              <Badge variant="secondary" className="text-sm">{category}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
            </div>
            <div className="bg-muted/30 p-2 sm:p-3 md:p-4 rounded-lg space-y-2">
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words px-1 overflow-wrap-anywhere"><strong>Maqsadi:</strong> {description}</p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words px-1 overflow-wrap-anywhere"><strong>Kimlar uchun:</strong> Kichik va o'rta biznes egalalari, savdo kompaniyalari</p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words px-1 overflow-wrap-anywhere"><strong>Qiymat taklifi:</strong> Biznes jarayonlarini avtomatlashtirish va mijozlar bilan samarali muloqotni ta'minlash</p>
            </div>
          </div>

          {/* 2. Loyiha tafsilotlari */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold border-b pb-2 break-words">2. Loyiha tafsilotlari</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Card className="p-2 sm:p-3 md:p-4">
                <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-2 break-words">Ishlab chiqish muddati</h4>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">{duration}</p>
              </Card>
              <Card className="p-2 sm:p-3 md:p-4">
                <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-2 break-words">Holat</h4>
                <Badge variant="default" className="bg-green-500 text-xs">Ishga tushirilgan</Badge>
              </Card>
            </div>
            
            <div>
              <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-2 sm:mb-3 break-words">Texnologiyalar:</h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {technologies.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-1 sm:px-2 py-1 break-words">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
                    <span className="break-words">{tech}</span>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-2 sm:mb-3 break-words">Integratsiyalar:</h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <Badge variant="outline" className="text-xs px-1 sm:px-2 py-1 break-words">Telegram Bot API</Badge>
                <Badge variant="outline" className="text-xs px-1 sm:px-2 py-1 break-words">Uzum API</Badge>
                <Badge variant="outline" className="text-xs px-1 sm:px-2 py-1 break-words">FBS Integration</Badge>
                <Badge variant="outline" className="text-xs px-1 sm:px-2 py-1 break-words">Click/Payme</Badge>
                <Badge variant="outline" className="text-xs px-1 sm:px-2 py-1 break-words">Multi-language</Badge>
              </div>
            </div>
          </div>

          {/* 3. Asosiy funksiyalar */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold border-b pb-2 break-words">3. Asosiy funksiyalar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Card className="p-2 sm:p-3 md:p-4">
                <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-2 sm:mb-3 text-primary break-words">Mijoz tomoni</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span className="break-words">Buyurtma berish va to'lov</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span className="break-words">Buyurtma holati kuzatuvi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span className="break-words">Bildirishnomalar (push, SMS)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span className="break-words">Shaxsiy kabinet va balans</span>
                  </li>
                </ul>
              </Card>
              
              <Card className="p-2 sm:p-3 md:p-4">
                <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-2 sm:mb-3 text-primary break-words">Admin/Menejer tomoni</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span className="break-words">Buyurtmalar va mahsulotlar boshqaruvi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span className="break-words">Hisobotlar va statistika</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span className="break-words">Foydalanuvchilar va rollar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span className="break-words">Sozlamalar va konfiguratsiya</span>
                  </li>
                </ul>
              </Card>
            </div>

            <Card className="p-2 sm:p-3 md:p-4 bg-accent/5">
              <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-2 sm:mb-3 break-words">Qo'shimcha imkoniyatlar</h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {features?.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-1 sm:px-2 py-1 break-words">{feature}</Badge>
                )) || (
                  <>
                    <Badge variant="secondary" className="text-xs px-1 sm:px-2 py-1 break-words">Promo-kod tizimi</Badge>
                    <Badge variant="secondary" className="text-xs px-1 sm:px-2 py-1 break-words">Sodiqlik dasturi</Badge>
                    <Badge variant="secondary" className="text-xs px-1 sm:px-2 py-1 break-words">Ko'p til</Badge>
                    <Badge variant="secondary" className="text-xs px-1 sm:px-2 py-1 break-words">Filiallar boshqaruvi</Badge>
                    <Badge variant="secondary" className="text-xs px-1 sm:px-2 py-1 break-words">Export/Import</Badge>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* 4. Natijalar */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold border-b pb-2 break-words">4. Erishilgan natijalar</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {results.map((result, index) => (
                <Card key={index} className="text-center p-2 sm:p-3 md:p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                  <div className="flex justify-center mb-1 sm:mb-2">
                    {result.icon}
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1 break-words">{result.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground break-words">{result.metric}</div>
                </Card>
              ))}
            </div>
            <Card className="p-2 sm:p-3 md:p-4 bg-green-50 dark:bg-green-950/20">
              <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-2 text-green-700 dark:text-green-400 break-words">Biznesga ta'sir</h4>
              <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                <li className="break-words">✅ Savdo hajmi 2.5 barobar oshdi</li>
                <li className="break-words">✅ Qo'lda ishlash vaqti 70% qisqardi</li>
                <li className="break-words">✅ Mijozlar bazasi faol rivojlanmoqda</li>
              </ul>
            </Card>
          </div>

          {/* 5. Ustunliklar */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold border-b pb-2 break-words">5. Loyiha ustunliklari</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {advantages?.map((advantage, index) => (
                <Card key={index} className="p-2 sm:p-3 md:p-4">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mb-2 flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-2 break-words">{advantage.split(' - ')[0]}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">{advantage.split(' - ')[1]}</p>
                </Card>
              )) || (
                <>
                  <Card className="p-2 sm:p-3 md:p-4">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mb-2 flex-shrink-0" />
                    <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-2 break-words">Tezkor ishlab chiqish</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">{duration} ichida ishga tushirildi</p>
                  </Card>
                  <Card className="p-2 sm:p-3 md:p-4">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mb-2 flex-shrink-0" />
                    <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-2 break-words">Lokal integratsiyalar</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">Click/Payme, O'zbekiston bozoriga mos</p>
                  </Card>
                  <Card className="p-2 sm:p-3 md:p-4">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mb-2 flex-shrink-0" />
                    <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-2 break-words">Qulay interfeys</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">Zamonaviy UI/UX dizayn va mobil moslashuv</p>
                  </Card>
                  <Card className="p-2 sm:p-3 md:p-4">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mb-2 flex-shrink-0" />
                    <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-2 break-words">Xavfsizlik</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">HTTPS, zaxira nusxa, rollar bo'yicha himoya</p>
                  </Card>
                </>
              )}
            </div>
          </div>

          {/* 6. Ish jarayoni */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold border-b pb-2 break-words">6. Ish jarayoni</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-bold text-primary text-sm sm:text-base">1</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm md:text-base font-semibold break-words">Brif va TZ yig'ish</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">Mijoz ehtiyojlarini tahlil qilish</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-bold text-primary text-sm sm:text-base">2</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm md:text-base font-semibold break-words">Dizayn va flow ishlab chiqish</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">UI/UX dizayn va foydalanuvchi oqimi</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-bold text-primary text-sm sm:text-base">3</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm md:text-base font-semibold break-words">Kodlash va integratsiya</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">Backend, frontend va API integratsiyalar</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-bold text-primary text-sm sm:text-base">4</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm md:text-base font-semibold break-words">Test va demo</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">Xatolarni topish va demo versiya taqdimoti</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 font-bold text-green-500 text-sm sm:text-base">5</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm md:text-base font-semibold break-words">Ishga tushirish va qo'llab-quvvatlash</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">Serverga joylashtirish va texnik yordam</p>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Natijalar statistika */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold border-b pb-2 break-words">7. Natijalar va statistika</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {results.map((result, index) => (
                <Card key={index} className="text-center p-2 sm:p-3 md:p-4 bg-gradient-to-br from-primary/10 to-accent/10">
                  <div className="flex justify-center mb-1 sm:mb-2">
                    {result.icon}
                  </div>
                  <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-primary mb-1 break-words">{result.value}</div>
                  <div className="text-xs text-muted-foreground break-words">{result.metric}</div>
                </Card>
              ))}
              <Card className="text-center p-2 sm:p-3 md:p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-green-500 mx-auto mb-1 sm:mb-2" />
                <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-green-600 mb-1 break-words">100%</div>
                <div className="text-xs text-muted-foreground break-words">Mamnuniyat</div>
              </Card>
              <Card className="text-center p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500 mx-auto mb-1 sm:mb-2" />
                <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-blue-600 mb-1 break-words">24/7</div>
                <div className="text-xs text-muted-foreground break-words">Qo'llab-quvvatlash</div>
              </Card>
            </div>
          </div>

          {/* Narx va paket ma'lumoti */}
          <Card className="p-2 sm:p-4 md:p-6 bg-gradient-to-br from-primary/5 to-accent/5">
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-3 sm:mb-4 break-words">Shunga o'xshash loyiha narxi</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">Boshlang'ich narx</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary break-words">{price || "$400+"}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs sm:text-sm text-muted-foreground break-words">Bajarilish muddati</p>
                <p className="text-base sm:text-lg md:text-xl font-semibold break-words">{duration}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3 sm:mb-4 break-words">* Aniq narx loyiha murakkabligiga qarab belgilanadi</p>
          </Card>

          {/* CTA */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-3 sm:p-4 md:p-6 rounded-lg text-center">
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-2 break-words">Keling loyhangiz haqida gaplashamiz!</h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4 md:mb-6 break-words">Loyihangiz haqida batafsil gaplashib, eng mos yechimlarni taklif qilamiz, muhokama bepul!</p>
            <Button size="lg" onClick={() => {
              setIsDialogOpen(false);
              setIsLeadFormOpen(true);
            }} className="hover:scale-105 transition-transform w-full sm:w-auto text-xs sm:text-sm">
              Loyiha boshlash
            </Button>
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