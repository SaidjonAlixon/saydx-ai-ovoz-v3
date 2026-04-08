import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  duration: string;
  rating: number;
  category: string;
  icon: React.ReactNode;
  features: string[];
  slug: string;
}

export default function ServiceCard({
  title,
  description,
  price,
  duration,
  rating,
  category,
  icon,
  features,
  slug
}: ServiceCardProps) {
  const [, setLocation] = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="group"
    >
      <Card className="relative bg-[#0f172a]/80 backdrop-blur-xl border-white/5 rounded-[32px] overflow-hidden transition-all duration-500 group-hover:border-cyan-500/30 group-hover:shadow-[0_20px_50px_rgba(6,182,212,0.2)] h-full flex flex-col">
        {/* Animated Glow Backlight */}
        <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] bg-cyan-600/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute -bottom-[20%] -left-[20%] w-[60%] h-[60%] bg-purple-600/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Glass Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400"
              >
                {icon}
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-white/40 text-[9px] uppercase font-black px-2 py-0.5 border-white/5">
                    {category}
                  </Badge>
                  {rating > 4.8 && (
                    <Badge className="bg-cyan-500/10 text-cyan-400 text-[9px] uppercase font-black px-2 border-cyan-500/20">
                      Popular
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-black text-white tracking-tight uppercase leading-none">{title}</CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white/60">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span>{rating}</span>
            </div>
          </div>
          <CardDescription className="text-sm leading-relaxed text-white/40 font-medium">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10 flex-1 flex flex-col">
          <div className="flex justify-between items-center py-4 border-y border-white/5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/30">
              <Clock className="w-4 h-4 text-cyan-500/50" />
              <span>{duration}</span>
            </div>
            <div className="text-lg font-black text-[#00d4ff] drop-shadow-[0_0_10px_rgba(0,212,255,0.3)]">{price}</div>
          </div>

          <div className="space-y-4 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 pl-1">Asosiy imkoniyatlar:</p>
            <ul className="grid grid-cols-1 gap-3">
              {(() => {
                let featuresList = features;
                if (typeof features === 'string') {
                  try {
                    featuresList = JSON.parse(features);
                  } catch (e) {
                    featuresList = [];
                  }
                }
                if (!Array.isArray(featuresList)) featuresList = [];

                return featuresList.map((feature, index) => (
                  <motion.li 
                    key={index} 
                    className="text-xs text-white/50 flex items-center gap-3 group/item"
                    initial={{ opacity: 0, x: -5 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full flex-shrink-0 group-hover/item:scale-150 transition-transform shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    <span className="group-hover/item:text-white transition-colors">{feature}</span>
                  </motion.li>
                ));
              })()}
            </ul>
          </div>

          <Button
            className="w-full premium-crystal crystal-shine h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group/btn border-white/20"
            onClick={() => setLocation(`/xizmatlar/${slug}`)}
          >
            <span className="flex items-center gap-2 relative z-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              Batafsil ma'lumot
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-cyan-400" />
            </span>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}