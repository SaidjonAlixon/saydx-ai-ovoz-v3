import { useState } from "react";
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

  return (
    <div className="min-h-screen">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 py-2 px-4">
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
              className="mb-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Orqaga
            </Button>
          </motion.div>
          
        </div>
      </div>

      {/* Services Grid */}
      <ServiceGrid />

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Keling loyhangiz haqida gaplashamiz!
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
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
              onClick={() => setIsDialogOpen(true)}
              className="hover:scale-105 transition-transform"
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
