import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, Sparkles, FileText, ExternalLink } from "lucide-react";
import { TeamMember } from "@shared/schema";

interface EmployeeDetailPanelProps {
  employee: TeamMember | null;
}

export function EmployeeDetailPanel({ employee }: EmployeeDetailPanelProps) {
  if (!employee) {
    return (
      <div className="flex-1 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[32px] p-12 flex flex-col items-center justify-center text-white/20 min-h-[600px]">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <UserCheck className="w-32 h-32 mb-6" />
        </motion.div>
        <p className="text-xl font-bold tracking-tight text-center max-w-xs">
          Tafsilotlarni ko'rish uchun jamoa a'zosini tanlang
        </p>
      </div>
    );
  }

  const responsibilities = employee.responsibilities 
    ? JSON.parse(employee.responsibilities as string) 
    : [];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={employee.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-12 overflow-y-auto overflow-x-hidden relative glass-panel-dark h-full min-h-[600px] custom-scrollbar"
      >
        <div className="relative z-10">
          {/* Photo Section */}
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-12">
            <motion.div
              initial={{ rotateY: -30, opacity: 0, scale: 0.9 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
              className="relative group w-64 h-64 flex-shrink-0"
            >
              <div className="absolute inset-0 bg-blue-500/20 rounded-[32px] blur-2xl group-hover:bg-cyan-500/30 transition-colors duration-500" />
              <div className="relative w-full h-full rounded-[32px] overflow-hidden border border-white/10 p-1.5 bg-gradient-to-br from-white/10 to-transparent">
                <img
                  src={employee.imageUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"}
                  alt={employee.name}
                  className="w-full h-full object-cover rounded-[26px] block"
                  style={{ objectPosition: "50% 10%" }}
                />
              </div>
            </motion.div>

            <div className="text-center md:text-left pt-4 flex-1">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                    {employee.department || "Mutaxassis"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                  {employee.name}
                </h1>
                <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                  {employee.role}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Info Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <span className="w-8 h-px bg-white/20"></span>
                Biografiya
              </h3>
              <p className="text-lg text-white/70 leading-relaxed font-medium">
                {employee.bio}
              </p>
              {/* Rezume Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.open(`/rezume/${employee.id}`, '_blank')}
                className="mt-4 flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 hover:border-blue-400/60 hover:from-blue-600/30 hover:to-cyan-600/30 text-blue-300 font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
              >
                <FileText className="w-4 h-4" />
                <span>Rezyume Ko'rish</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <span className="w-8 h-px bg-white/20"></span>
                Mas'uliyatlar
              </h3>
              <div className="grid gap-3">
                {responsibilities.length > 0 ? (
                  responsibilities.map((item: string, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      <span className="text-sm text-white/80 font-medium">{item}</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-white/40 italic">Ma'lumot mavjud emas</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
      </motion.div>
    </AnimatePresence>
  );
}
