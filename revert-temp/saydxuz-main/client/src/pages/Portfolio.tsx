import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, TrendingUp, Users } from "lucide-react";
import { useLocation } from "wouter";
import PortfolioCard from "@/components/PortfolioCard";
import QuickLeadForm from "@/components/QuickLeadForm";
import mobileApp from "@assets/generated_images/Mobile_app_interface_mockup_5376ed7a.png";
import uzumNazoratImage from "@assets/uzum_nazorat_bot.png";
import modernTech from "@assets/Panteleymon.png";

const portfolioData = [
  {
    title: "Uzum Nazorat",
    description: "Uzum Nazorat Bot — do'koningizdagi buyurtmalar, mahsulotlar va moliyaviy hisobotlarni Telegram orqali boshqarish imkonini beruvchi qulay vosita. Bot yordamida barcha jarayonlarni real vaqt rejimida kuzatish va nazorat qilish mumkin. FBS buyurtmalar, statistika, moliyaviy hisobot, mahsulotlar boshqaruvi va ko'p til qo'llab-quvvatlash imkoniyatlari bilan.",
    category: "Telegram Bot",
    technologies: ["Node.js", "Telegram API", "PostgreSQL", "Uzum API", "FBS Integration", "Click/Payme", "Multi-language"],
    results: [
      {
        metric: "Savdo hajmi",
        value: "+250%",
        icon: <TrendingUp className="w-4 h-4 text-green-500" />
      },
      {
        metric: "Do'konlar", 
        value: "5+",
        icon: <Users className="w-4 h-4 text-blue-500" />
      }
    ],
    image: uzumNazoratImage,
    duration: "10 kun",
    price: "$300+",
    features: [
      "FBS Buyurtmalar — buyurtmalarni ko'rish va boshqarish",
      "FBS Statistika — savdo va foyda tahlili", 
      "Moliyaviy hisobot — daromad va xarajatlarni kuzatish",
      "Mahsulotlar — do'kondagi mahsulotlarni boshqarish",
      "Do'konlarim — mavjud do'konlaringiz haqida ma'lumot",
      "Promo-kod tizimi va sodiqlik dasturi",
      "Ko'p til qo'llab-quvvatlash",
      "Real-time bildirishnomalar"
    ],
    advantages: [
      "Tezkor ishlab chiqish - 10 kun ichida ishga tushirildi",
      "Lokal integratsiyalar - Click/Payme, O'zbekiston bozoriga mos",
      "Qulay interfeys - Zamonaviy UI/UX dizayn va mobil moslashuv",
      "Xavfsizlik - HTTPS, zaxira nusxa, rollar bo'yicha himoya"
    ]
  },
  {
    title: "Panteleymon sayti",
    description: "Panteleymon — Cherkov uchun xorijdan xayriya va donatlarni qulay qabul qilishga mo'ljallangan zamonaviy onlayn platforma. Sayt barcha mashhur xalqaro to'lov tizimlarini qo'llab-quvvatlaydi, xavfsiz va tezkor ishlaydi.",
    category: "Veb-sayt",
    technologies: ["React", "Node.js", "MongoDB", "PayPal", "Stripe", "Visa", "Mastercard"],
    results: [
      {
        metric: "Xayriya miqdori",
        value: "+200%",
        icon: <TrendingUp className="w-4 h-4 text-green-500" />
      },
      {
        metric: "Donorlar",
        value: "500+",
        icon: <Users className="w-4 h-4 text-blue-500" />
      }
    ],
    image: modernTech,
    duration: "14 kun",
    price: "$450",
    features: [
      "Chet eldan PayPal, Visa, Mastercard va boshqa to'lov tizimlari orqali xayriya qabul qilish",
      "Xavfsiz tranzaksiyalar va ma'lumotlarni himoya qilish tizimi",
      "Donorlar uchun oddiy va tushunarli interfeys",
      "Xayriya miqdorini tanlash yoki o'zi kiritish imkoniyati",
      "Admin panel orqali barcha to'lovlarni va donor ma'lumotlarini kuzatish",
      "Loyihaning maqsadi, fotosuratlar va yangiliklarni joylash imkoniyati"
    ],
    advantages: [
      "Xalqaro to'lov tizimlari - PayPal, Visa, Mastercard qo'llab-quvvatlash",
      "Xavfsizlik - Ma'lumotlarni himoya qilish va xavfsiz tranzaksiyalar",
      "Qulay interfeys - Donorlar uchun oddiy va tushunarli dizayn",
      "Admin boshqaruvi - To'liq admin panel va donor ma'lumotlari kuzatuvi"
    ]
  },
  {
    title: "CRM tizimi",
    description: "Mijozlar bilan ishlash va savdoni boshqarish uchun maxsus CRM dasturi.",
    category: "Avtomatlashtirish",
    technologies: ["Vue.js", "Laravel", "MySQL", "Redis"],
    results: [
      {
        metric: "Samaradorlik",
        value: "+300%",
        icon: <TrendingUp className="w-4 h-4 text-green-500" />
      },
      {
        metric: "Xodimlar",
        value: "50+",
        icon: <Users className="w-4 h-4 text-blue-500" />
      }
    ],
    image: mobileApp,
    duration: "21 kun"
  }
];

export default function Portfolio() {
  const [, setLocation] = useLocation();
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Orqaga
            </Button>
          </motion.div>

          <motion.h1 
            className="text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Bajarilgan ishlar
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Mijozlarimiz uchun yaratgan muvaffaqiyatli loyihalar va ularning real natijalari. 
            Har bir loyiha biznesning o'sishiga hissa qo'shgan professional yechim.
          </motion.p>
        </div>
      </div>

      {/* Portfolio Grid */}
      <section className="py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {portfolioData.map((item, index) => (
              <PortfolioCard key={index} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Keling loyhangiz haqida gaplashamiz!
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Loyihangiz haqida batafsil gaplashib, eng mos yechimlarni taklif qilamiz, muhokama bepul!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              size="lg"
              onClick={() => setIsLeadFormOpen(true)}
              className="hover:scale-105 transition-transform w-full sm:w-auto"
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
