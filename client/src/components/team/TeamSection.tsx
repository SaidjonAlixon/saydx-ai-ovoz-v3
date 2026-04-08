import { useState, useEffect } from "react";
import { TeamMember } from "@shared/schema";
import { StaffListCard } from "./StaffListCard";
import { EmployeeDetailPanel } from "./EmployeeDetailPanel";
import { motion } from "framer-motion";
import { useTeam } from "@/hooks/use-team";

export default function TeamSection() {
  const { data: teamRes, isLoading } = useTeam();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const teamMembers = teamRes?.data || [];
  
  const selectedMember = teamMembers.find(m => m.id === selectedId) || null;

  useEffect(() => {
    if (teamMembers.length > 0 && !selectedId) {
      // Select main member by default or first one
      const main = teamMembers.find(m => m.isMain === "true") || teamMembers[0];
      setSelectedId(main.id);
    }
  }, [teamMembers, selectedId]);

  // AI Voice Control Listener
  useEffect(() => {
    const handleAISelect = (e: any) => {
      const memberId = e.detail;
      const found = teamMembers.find(m => 
        m.id.toLowerCase() === memberId.toLowerCase() || 
        m.name.toLowerCase().includes(memberId.toLowerCase())
      );
      if (found) {
        setSelectedId(found.id);
        console.log("AI selected team member:", found.name);
      }
    };

    window.addEventListener("ai-select-team", handleAISelect);
    return () => window.removeEventListener("ai-select-team", handleAISelect);
  }, [teamMembers]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8 min-h-[700px]">
        {/* Detail View */}
        <div className="flex-1 h-full">
          <EmployeeDetailPanel employee={selectedMember} />
        </div>

        {/* List View */}
        <div className="lg:w-[440px] flex-shrink-0">
          <div className="sticky top-24">
            <div className="mb-6 flex items-center justify-between px-4">
              <h2 className="text-2xl font-black text-white">Bizning Jamoa</h2>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                {teamMembers.length} a'zo
              </span>
            </div>
            
            <motion.div 
              layout
              className="grid grid-cols-2 gap-4 max-h-[700px] overflow-y-auto overflow-x-hidden p-4 custom-scrollbar"
            >
              {teamMembers.map((member) => (
                <StaffListCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  role={member.role}
                  photo={member.imageUrl || ""}
                  isActive={selectedId === member.id}
                  onClick={() => setSelectedId(member.id)}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
