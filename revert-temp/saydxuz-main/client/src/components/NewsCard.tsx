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
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="overflow-hidden hover-elevate transition-all duration-300 hover:shadow-xl">
      {image && (
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{views}</span>
            </div>
          </div>
        </div>
        
        <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
          {title}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed line-clamp-3">
          {excerpt}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{readTime} daqiqa</span>
          <Button 
            variant="ghost" 
            size="sm"
            data-testid={`button-read-news-${title.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => console.log(`Reading news: ${title}`)}
          >
            O'qish
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}