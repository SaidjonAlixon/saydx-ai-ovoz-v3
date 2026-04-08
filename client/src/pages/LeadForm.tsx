import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ClipboardList, Loader2, CheckCircle2, Clock, MessageSquare, Sparkles, Send, Calendar } from "lucide-react";
import { useLocation } from "wouter";
import QuickLeadForm from "@/components/QuickLeadForm";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Lead } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

export default function LeadForm() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00d4ff]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 py-12 px-4">
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
              className="mb-8 text-white/40 hover:text-white hover:bg-white/5 rounded-xl px-4 h-10 border border-transparent hover:border-white/10 transition-all font-bold uppercase tracking-widest text-[10px]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Asosiy sahifa
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#00d4ff] text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <Sparkles className="w-3 h-3" />
              SAYD.X Premium Xizmati
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter text-white leading-tight">
              LOYYIHA YAKUNIGA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-blue-500 to-purple-500">BIR QADAM</span>
            </h1>
            <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed font-medium">
              Ma'lumotlaringizni qoldiring, bizning mutaxassislarimiz tez orada siz bilan bog'lanib barcha savollaringizga javob berishadi.
            </p>
          </motion.div>

          {/* Form Container */}
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <QuickLeadForm />
            </motion.div>
          </div>

          {/* User History Section */}
          <MyLeadsSection />
        </div>
      </div>
    </div>
  );
}

function MyLeadsSection() {
  const myLeadsIds = JSON.parse(localStorage.getItem('my_leads') || '[]');

  const { data: leadsRes, isLoading } = useQuery<{ success: boolean, data: Lead[] }>({
    queryKey: ["/api/leads/my", myLeadsIds.join(',')],
    queryFn: async () => {
      if (myLeadsIds.length === 0) return { success: true, data: [] };
      const res = await fetch(`/api/leads/my?ids=${myLeadsIds.join(',')}`);
      if (!res.ok) throw new Error("Arizalarni yuklashda xatolik");
      return res.json();
    },
    enabled: myLeadsIds.length > 0,
    refetchInterval: 30000,
  });

  const leads = leadsRes?.data || [];

  if (myLeadsIds.length === 0) return null;

  return (
    <motion.div
      className="w-full mt-24 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-10 pl-2">
        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
          <ClipboardList className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">Mening murojaatlarim</h2>
          <p className="text-white/30 text-[10px] uppercase tracking-widest font-black mt-1">Yuborilgan arizalaringiz tarixi</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20 bg-white/[0.02] border border-white/5 rounded-[40px] backdrop-blur-xl">
          <Loader2 className="w-10 h-10 animate-spin text-[#00d4ff]/50" />
        </div>
      ) : leads.length === 0 ? (
        <div className="text-white/20 text-center py-20 border border-dashed border-white/10 rounded-[40px] bg-white/[0.01] items-center flex flex-col gap-4">
          <Send className="w-10 h-10 opacity-20" />
          <p className="font-bold uppercase tracking-widest text-xs">Hozircha faol arizalar topilmadi</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {leads.map((lead) => (
            <Card key={lead.id} className="p-8 bg-white/[0.03] backdrop-blur-[20px] border-white/5 rounded-[32px] hover:bg-white/[0.05] transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#00d4ff]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-white tracking-tight uppercase">{lead.serviceType}</h3>
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-white/40 text-[9px] uppercase font-black px-2">
                      #{lead.id.slice(-4)}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-black flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(lead.createdAt || Date.now()).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 self-end md:self-auto">
                  {lead.status === 'completed' ? (
                    <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Bajarildi
                    </span>
                  ) : lead.status === 'contacted' || lead.status === 'in_progress' ? (
                    <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                      <Clock className="w-3.5 h-3.5" /> Jarayonda
                    </span>
                  ) : (
                    <span className="px-4 py-2 rounded-xl bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest border border-white/10">
                      Yangi tushgan
                    </span>
                  )}
                </div>
              </div>

              {lead.description && (
                <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 mb-6 group-hover:bg-white/[0.04] transition-colors">
                  <p className="text-sm text-white/50 leading-relaxed italic line-clamp-3">
                    "{lead.description}"
                  </p>
                </div>
              )}

              {lead.adminReply && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 rounded-2xl bg-[#00d4ff]/5 border border-[#00d4ff]/10 relative group/reply"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MessageSquare className="w-12 h-12 text-[#00d4ff]" />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-[#00d4ff]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-[#00d4ff] uppercase tracking-widest">SAYD.X JAVOBI</span>
                      <p className="text-[9px] text-white/20 uppercase font-bold">MUTAXASSIS TOMONIDAN</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap font-medium">
                    {lead.adminReply}
                  </p>
                </motion.div>
              )}
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
