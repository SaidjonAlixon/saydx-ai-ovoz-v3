import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, MessageCircle, Phone, Mail } from "lucide-react";
import { useLocation } from "wouter";

const faqs = [
  {
    question: "Loyiha uchun shartnoma tuziladimi?",
    answer: "Ha, albatta! Har bir loyiha uchun rasmiy shartnoma tuziladi. Shartnomada loyiha hajmi, muddati, to'lov shartlari va javobgarlik masalalari aniq belgilab qo'yiladi. Bu esa har ikki tomon uchun ham ishonch va xavfsizlikni ta'minlaydi."
  },
  {
    question: "To'lov qanday amalga oshiriladi?",
    answer: "Loyiha boshlashdan oldin 50% oldindan to'lov qilinadi. Qolgan 50% loyiha to'liq yakunlangandan va mijoz tomonidan qabul qilingandan keyin to'lanadi. To'lov Click, Payme, bank o'tkazmasi yoki naqd shaklida amalga oshirilishi mumkin."
  },
  {
    question: "Loyiha qancha vaqtda tayyorlanadi?",
    answer: "Boshlang'ich va o'rtacha murakkablikdagi loyihalar odatda 7–12 ish kuni ichida tayyorlanadi. Murakkabroq va keng funksionallikka ega loyihalar esa 3–4 hafta yoki undan ko'proq vaqt talab qilishi mumkin. Aniq muddat texnik topshiriq (TZ) ishlab chiqilib, loyiha hajmi va talablar to'liq belgilab olingandan so'ng belgilanadi.\n\nShuningdek, bizda tezlashtirilgan ishlab chiqish rejimi ham mavjud — zarurat bo'lsa, loyiha qisqa muddatda yakunlanishi mumkin qo'shimcha haq evaziga."
  },
  {
    question: "Texnik qo'llab-quvvatlash bo'ladimi?",
    answer: "Ha, loyiha topshirilgandan so'ng 1 oy davomida bepul texnik qo'llab-quvvatlash taqdim etiladi. Bu davrda xatolarni tuzatish, kichik o'zgarishlar kiritish va maslahatlar berish bepul amalga oshiriladi. Keyinchalik, istasangiz, oylik texnik qo'llab-quvvatlash xizmatini davom ettirishingiz mumkin."
  },
  {
    question: "Loyihani o'zimning serverimga joylashtirish mumkinmi?",
    answer: "Albatta! Loyihani o'zingizning serveringizga, hosting provayderingizga yoki cloud platformangizga (AWS, Google Cloud, DigitalOcean va h.k.) joylashtirishimiz mumkin. Shuningdek, kerak bo'lsa, hosting tanlash va sozlashda yordam beramiz."
  },
  {
    question: "Loyiha kodlari menga beriladimi?",
    answer: "Ha, loyiha uchun to'lov to'liq amalga oshirilgandan so'ng barcha manba kodlari sizga topshiriladi. Shundan keyin siz kodlarning to'liq huquqiy egasiga aylanasiz va ularni xohlagancha o'zgartirish, kengaytirish yoki boshqa tizimlarga integratsiya qilish imkoniyatiga ega bo'lasiz."
  },
  {
    question: "Dizayn xizmati ham kiritilganmi?",
    answer: "Ha, asosiy paketda UI/UX dizayn xizmati ham kiritilgan. Agar maxsus brending, logo dizayni yoki kengaytirilgan dizayn kerak bo'lsa, alohida UI/UX dizayn xizmatidan foydalanishingiz mumkin."
  },
  {
    question: "Mobil versiya ham bo'ladimi?",
    answer: "Barcha veb-saytlar va ilovalar mobil qurilmalarga to'liq moslashtirilgan (responsive) qilib yaratiladi. Alohida native mobil ilova kerak bo'lsa, 'Mobil ilovalar' xizmatidan foydalaning."
  },
  {
    question: "Loyihaga keyinchalik o'zgartirish kiritish bepulmi?",
    answer: "Yo'q, loyiha yakunlangandan so'ng texnik topshiriqda (TZ) ko'rsatilmagan qo'shimcha o'zgarishlar va yangi funksiyalar bepul amalga oshirilmaydi. Agar siz loyihaga qo'shimcha imkoniyatlar qo'shishni yoki mavjud tizimda sezilarli o'zgarishlar kiritishni istasangiz, bu ishlar alohida xizmat sifatida ko'rib chiqiladi. Narx va muddat esa kiritiladigan o'zgarishlarning hajmi, murakkabligi va talab etiladigan mehnat miqdoriga qarab individual ravishda belgilanadi. Shunday qilib, asosiy shartnoma doirasida bo'lmagan barcha qo'shimcha ishlar kelishilgan qo'shimcha haq evaziga bajariladi."
  },
  {
    question: "Qanday texnologiyalardan foydalanasiz?",
    answer: "Biz loyihalarda zamonaviy, ishonchli va tezkor texnologiyalardan foydalanamiz. Har bir loyiha uchun eng optimal yechim tanlanadi. Asosan qo'llaniladigan texnologiyalar:\n\n• Frontend: React, Next.js, Vue.js\n• Backend: Node.js, Python (Django, FastAPI, Flask), PHP (Laravel), Go\n• Ma'lumotlar bazasi: PostgreSQL, MySQL, MongoDB, Firebase, Redis\n• Integratsiyalar: Telegram Bot API, Google API (Sheets, Drive), CRM va ERP tizimlari, turli Payment API'lar\n• To'lov tizimlari: Click, Payme, Paynet, UzumPay, Payze va boshqa xalqaro gateway'lar (Stripe, PayPal)\n• Sun'iy intellekt va avtomatlashtirish: OpenAI API (ChatGPT, GPT-4/5), TensorFlow, scikit-learn, Natural Language Processing (NLP), Computer Vision modullari\n• UI/UX dizayn: Figma, Adobe XD, TailwindCSS, Shadcn UI\n• Xavfsizlik va barqarorlik: JWT, OAuth 2.0, SSL/HTTPS sertifikatlar, kunlik backup va monitoring tizimlari\n\nBizning ustunligimiz shundaki, har bir loyiha uchun moslashtirilgan texnologik stek tanlaymiz. Masalan, tezkor startap loyihalarida eng yengil va moslashuvchan texnologiyalarni, korporativ yechimlarda esa barqaror va kengaytiriladigan platformalarni qo'llaymiz."
  }
];

const partners = [
  { name: "TechCorp", logo: "TC" },
  { name: "InnovateLab", logo: "IL" },
  { name: "DigitalPro", logo: "DP" },
  { name: "SmartSoft", logo: "SS" },
  { name: "CloudMaster", logo: "CM" },
  { name: "WebGenius", logo: "WG" }
];

export default function Help() {
  const [, setLocation] = useLocation();

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
            Yordam va qo'llab-quvvatlash
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Eng ko'p so'raladigan savollar va ularning javoblari
          </motion.p>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border rounded-lg px-6 bg-card hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold text-base">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Javob topolmadingizmi?
            </h2>
            <p className="text-muted-foreground">
              Biz bilan bog'laning, barcha savollaringizga javob beramiz!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Telegram Bot</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Tezkor javob olish uchun
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://t.me/saydx_bot', '_blank')}
                >
                  Botni ochish
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Telefon</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  To'g'ridan-to'g'ri qo'ng'iroq
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('tel:+998901234567')}
                >
                  +998 90 123 45 67
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Yozma murojaat uchun
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('mailto:info@saydx.uz')}
                >
                  info@saydx.uz
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Bizning hamkorlar
            </h2>
            <p className="text-muted-foreground">
              Biz bilan ishlagan brendlar va kompaniyalar
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <Card className="w-full aspect-square flex items-center justify-center p-4 hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {partner.logo}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {partner.name}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Yana savolingiz bormi?
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Biz bilan bog'laning yoki ariza qoldiring
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              size="lg"
              onClick={() => setLocation("/ariza")}
              className="hover:scale-105 transition-transform"
            >
              Ariza qoldirish
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

