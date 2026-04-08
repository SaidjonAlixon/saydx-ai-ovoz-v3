import { useTeam } from "@/hooks/use-team";
import { TeamMember } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UserCheck } from "lucide-react";

export default function AboutSection() {
  const { data: teamRes } = useTeam();

  const teamMembers = teamRes?.data || [];
  const mainMember = teamMembers.find((m) => m.isMain === "true");
  const otherMembers = teamMembers.filter((m) => m.isMain !== "true");

  return (
    <section className="py-24 px-4 relative overflow-hidden" id="about">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -right-1/4 w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-cyan-500/10 blur-[150px] rounded-full mix-blend-screen"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Biz Haqimizda</span>
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Tajribali va <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Professional</span> Jamoa
          </motion.h2>
        </div>

        {mainMember && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-2xl group-hover:bg-cyan-500/30 transition-colors duration-500" />
              <div className="relative rounded-[32px] overflow-hidden border border-white/10 bg-white/5 p-2">
                {mainMember.imageUrl ? (
                  <img
                    src={mainMember.imageUrl}
                    alt={mainMember.name}
                    className="w-full h-auto aspect-[4/5] object-cover rounded-[24px]"
                  />
                ) : (
                  <div className="w-full aspect-[4/5] flex items-center justify-center bg-white/5 rounded-[24px]">
                    <UserCheck className="w-20 h-20 text-white/20" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-3xl font-black tracking-tight text-white">{mainMember.name}</h3>
              <p className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold uppercase tracking-widest text-[#00d4ff]">
                {mainMember.role}
              </p>
              <div className="text-lg text-white/60 leading-relaxed font-medium whitespace-pre-wrap mt-6 border-l-2 border-blue-500/50 pl-6">
                {mainMember.bio}
              </div>
            </div>
          </motion.div>
        )}

        {otherMembers.length > 0 && (
          <div className="space-y-8">
            <h4 className="text-2xl font-black tracking-tight text-center mb-10 text-white/90">Bizning Mutaxassislar</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherMembers.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="bg-white/[0.02] backdrop-blur-[20px] border-white/5 rounded-[32px] overflow-hidden hover:border-blue-500/30 transition-colors duration-500 group h-full">
                    <CardContent className="p-0 flex flex-col items-center text-center p-8 h-full justify-center">
                      <div className="w-32 h-32 rounded-full mb-6 p-1 bg-gradient-to-tr from-blue-500/40 to-cyan-500/40 opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover object-top border-4 border-[#0a0f1c]"
                            style={{ objectPosition: "50% 15%" }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center rounded-full bg-[#0a0f1c] border-4 border-[#0a0f1c]">
                            <UserCheck className="w-8 h-8 text-white/20" />
                          </div>
                        )}
                      </div>
                      <h4 className="text-lg font-black tracking-tight mb-2 text-white">{member.name}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4">{member.role}</p>
                      <p className="text-sm text-white/50 font-medium leading-relaxed">
                        {member.bio}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {!mainMember && otherMembers.length === 0 && (
          <div className="text-center py-12 text-white/50 border border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-xl">
             <UserCheck className="w-16 h-16 mx-auto mb-4 text-white/20" />
             <h3 className="text-xl font-bold text-white mb-2">Hozircha xodimlar kiritilmagan</h3>
             <p className="text-sm">Admin paneli orqali jamoa a'zolarini qo'shishingiz mumkin.</p>
          </div>
        )}
      </div>
    </section>
  );
}
