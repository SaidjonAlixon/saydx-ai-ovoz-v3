import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface NewsCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  views: number;
  image?: string;
}

export default function NewsCard({
  title,
  excerpt,
  category,
  date,
  readTime,
  views,
  image
}: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden premium-crystal crystal-shine border-white/5 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] rounded-[32px] group relative flex flex-col">
        {image && (
          <div className="aspect-[16/10] overflow-hidden relative">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
            
            <div className="absolute top-4 left-4">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                {category}
              </Badge>
            </div>
          </div>
        )}

        <CardHeader className="pb-3 flex-1">
          <div className="flex items-center gap-4 mb-3 text-[10px] font-bold uppercase tracking-wider text-white/40">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-cyan-500" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-cyan-500" />
              <span>{views}</span>
            </div>
          </div>

          <CardTitle className="text-xl font-black leading-tight text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
            {title}
          </CardTitle>
          <CardDescription className="text-sm font-medium leading-relaxed text-white/60 line-clamp-3">
            {excerpt}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 pb-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{readTime} daqiqa o'qish</span>
            <Button
              variant="ghost"
              size="sm"
              className="premium-crystal crystal-shine h-10 px-6 rounded-xl font-black uppercase tracking-widest text-[9px] text-white border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 group/btn transition-all shrink-0"
              onClick={() => console.log(`Reading news: ${title}`)}
            >
              <span className="relative z-10 flex items-center gap-2 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                O'qish
                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform text-cyan-400" />
              </span>
            </Button>
          </div>
        </CardContent>
        
        {/* Neon Glow Bottom Line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-[1px]" />
      </Card>
    </motion.div>
  );
}