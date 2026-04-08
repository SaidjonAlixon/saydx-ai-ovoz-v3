import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, MessageCircle, Phone, Mail, Loader2, Send, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Faq, Question } from "@shared/schema";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [qName, setQName] = useState("");
  const [qText, setQText] = useState("");

  // AI Voice Control Listener
  useEffect(() => {
    const handleAIHelp = (e: any) => {
      const action = e.detail.toLowerCase();
      if (action.includes("faq") || action.includes("savol")) {
        document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" });
      } else if (action.includes("contact") || action.includes("bog'lanish") || action.includes("aloqa")) {
        document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
      }
      console.log("AI triggered help action:", action);
    };

    window.addEventListener("ai-help-action", handleAIHelp);
    return () => window.removeEventListener("ai-help-action", handleAIHelp);
  }, []);

  const { data: faqsRes, isLoading } = useQuery<{ success: boolean, data: Faq[] }>({
    queryKey: ["/api/faqs"],
  });

  const { data: qRes, isLoading: qLoading } = useQuery<{ success: boolean, data: Question[] }>({
    queryKey: ["/api/questions"],
  });

  const faqs = faqsRes?.data || [];
  const questions = qRes?.data || [];

  const submitQ = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: qName, text: qText })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.errors?.[0]?.message || errData.message || "Xatolik yuz berdi";
        throw new Error(errMsg);
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Savol yuborildi!", description: "Yaqin orada javob beramiz." });

      // Save ID to localStorage for private tracking
      try {
        const myQuestions = JSON.parse(localStorage.getItem('my_questions') || '[]');
        if (data.data && data.data.id) {
          myQuestions.push(data.data.id);
          localStorage.setItem('my_questions', JSON.stringify(myQuestions));
        }
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }

      setQName(""); setQText("");
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/questions/my"] });
    },
    onError: (err: Error) => {
      toast({ title: "Xatolik!", description: err.message, variant: "destructive" });
    }
  });

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

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <MyQuestionsSection />
      </div>

      {/* FAQ Section */}
      <section id="faq-section" className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    value={`item-${index}`}
                    className="border rounded-lg px-6 bg-card hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <span className="font-semibold text-base">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 leading-relaxed whitespace-pre-wrap">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          )}
        </div>
      </section>

      {/* Ochiq Savollar Section */}
      <section className="py-12 px-4 shadow-inner">
        <div className="max-w-4xl mx-auto mb-8 border-t pt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Mijozlarimiz savollari</h2>
          {qLoading ? <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : (
            <div className="space-y-6">
              {questions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Hozircha ochiq savollar yo'q.</p>
              ) : (
                questions.map(q => (
                  <Card key={q.id} className="p-6 hover:shadow-md transition-shadow border-l-4 border-l-transparent hover:border-l-primary/50">
                    <div className="flex justify-between items-start mb-3">
                      <p className="font-semibold text-lg">{q.name}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{new Date(q.createdAt || Date.now()).toLocaleDateString('uz-UZ')}</span>
                    </div>
                    <p className="mb-5 text-foreground/90 leading-relaxed whitespace-pre-wrap">{q.text}</p>

                    {q.reply && (
                      <div className="pl-4 py-3 pr-4 border-l-4 border-primary bg-primary/5 rounded-r-lg relative">
                        <div className="absolute top-0 left-[-4px] w-1 h-full bg-primary rounded-l"></div>
                        <p className="text-sm font-bold text-primary mb-1 inline-flex items-center">
                          <MessageCircle className="w-4 h-4 mr-2" /> SAYD.X Javobi:
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{q.reply}</p>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto mt-12 pb-8">
          <Card className="p-6 md:p-8 bg-card border shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">O'z savolingizni qoldiring</h3>
              <p className="text-muted-foreground mb-6">Savolingizni yo'llang, bizning mutaxassislarimiz iloji boricha tez orada javob yozishadi va shu yerda e'lon qilinadi.</p>
              <div className="space-y-5">
                <div>
                  <Input className="bg-background/50 border-input shadow-inner focus-visible:ring-primary/20" placeholder="Ismingizni kiriting" value={qName} onChange={e => setQName(e.target.value)} />
                </div>
                <div>
                  <Textarea className="bg-background/50 border-input shadow-inner focus-visible:ring-primary/20 min-h-[120px] resize-none" placeholder="Savolingizni aniq va to'liq yozing..." value={qText} onChange={e => setQText(e.target.value)} />
                </div>
                <Button className="w-full sm:w-auto mt-2" size="lg" onClick={() => submitQ.mutate()} disabled={submitQ.isPending || !qName || !qText}>
                  {submitQ.isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                  {submitQ.isPending ? "Yuborilmoqda..." : "Savolni yuborish"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-12 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
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
                  onClick={() => window.open('https://t.me/saydxbot', '_blank')}
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

function MyQuestionsSection() {
  const myQuestionsIds = JSON.parse(localStorage.getItem('my_questions') || '[]');

  const { data: questionsRes, isLoading } = useQuery<{ success: boolean, data: Question[] }>({
    queryKey: ["/api/questions/my", myQuestionsIds.join(',')],
    queryFn: async () => {
      if (myQuestionsIds.length === 0) return { success: true, data: [] };
      const res = await fetch(`/api/questions/my?ids=${myQuestionsIds.join(',')}`);
      if (!res.ok) throw new Error("Savollarni yuklashda xatolik");
      return res.json();
    },
    enabled: myQuestionsIds.length > 0,
    refetchInterval: 30000,
  });

  const questions = questionsRes?.data || [];

  if (myQuestionsIds.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Mening savollarim</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : questions.length === 0 ? (
        <p className="text-muted-foreground italic text-center py-6 border rounded-xl bg-card">
          Hali hech qanday savol yo'llamadingiz.
        </p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <Card key={q.id} className="p-5 border-l-4 border-l-primary/30">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-muted-foreground">{new Date(q.createdAt || Date.now()).toLocaleDateString('uz-UZ')}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${q.status === 'answered' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  {q.status === 'answered' ? 'Javob berilgan' : 'Kutilmoqda'}
                </span>
              </div>
              <p className="text-sm font-medium mb-3">{q.text}</p>

              {q.reply ? (
                <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-xs font-bold text-primary mb-1 flex items-center gap-1.5">
                    <MessageCircle className="w-3 h-3" /> SAYD.X Javobi:
                  </p>
                  <p className="text-xs text-foreground/80 leading-relaxed">{q.reply}</p>
                </div>
              ) : (
                <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Mutaxassis javobini kuting...
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

