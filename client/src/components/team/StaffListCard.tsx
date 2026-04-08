import { motion } from "framer-motion";

interface StaffListCardProps {
  id: string;
  name: string;
  role: string;
  photo: string;
  isActive: boolean;
  onClick: () => void;
}

export function StaffListCard({ name, role, photo, isActive, onClick }: StaffListCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl p-4 cursor-pointer
        hover:bg-white/[0.08] transition-all duration-300 relative group
        ${isActive ? 'ring-2 ring-blue-500/50 bg-white/[0.1] border-blue-500/30' : ''}
      `}
    >
      <div className="aspect-square rounded-xl overflow-hidden mb-3 relative">
        <img
          src={photo || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"}
          alt={name}
          className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500 block"
        />
        {isActive && (
          <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
        )}
      </div>
      <h3 className="text-white font-bold text-sm mb-0.5 truncate">{name}</h3>
      <p className="text-blue-400 text-[10px] uppercase font-black tracking-widest truncate">{role}</p>
    </motion.div>
  );
}
