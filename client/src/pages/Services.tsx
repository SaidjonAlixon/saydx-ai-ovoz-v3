import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ServiceGrid from "@/components/ServiceGrid";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import QuickLeadForm from "@/components/QuickLeadForm";

export default function Services() {
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // AI Voice Control Listener
  useEffect(() => {
    const handleAIUIEvent = (e: any) => {
      if (e.detail === "OPEN_LEAD_FORM") {
        setIsDialogOpen(true);
        console.log("AI triggered: Opening Lead Form");
      }
    };

    window.addEventListener("ai-ui-event", handleAIUIEvent);
    return () => window.removeEventListener("ai-ui-event", handleAIUIEvent);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header with Back Button */}
      <div className="relative pt-10 pb-6 rounded-b-[3rem] bg-card/10 border-b border-border/30 overflow-hidden mb-8">
        <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
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
              className="rounded-full border-border/50 bg-background/50 backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Asosiy sahifaga qaytish
            </Button>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Xizmatlar
          </motion.h1>
        </div>
      </div>

      {/* Services Grid */}
      <ServiceGrid />

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
              onClick={() => setIsDialogOpen(true)}
              className="rounded-full h-14 px-10 text-lg font-medium shadow-[0_0_30px_-5px_hsl(var(--primary))] hover:shadow-[0_0_40px_-5px_hsl(var(--primary))] transition-shadow duration-300"
            >
              Ariza qoldirish
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Lead Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <QuickLeadForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
