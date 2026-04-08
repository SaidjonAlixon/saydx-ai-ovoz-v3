import { useTeam } from "@/hooks/use-team";
import { motion } from "framer-motion";
import { useParams } from "wouter";
import {
  Sparkles, Globe, MapPin, ChevronRight,
  Star, Users, TrendingUp, Briefcase, Code2, Smartphone
} from "lucide-react";
import { TeamMember } from "@shared/schema";

type RoleEntry = {
  tagline: string;
  bio: string;
  stats: { icon: any; label: string; value: string }[];
  skills: { name: string; level: number }[];
  experience: { role: string; place: string; period: string; points: string[] }[];
};

const roleData: Record<string, RoleEntry> = {

  "CEO": {
    tagline: "Bosh Ijrochi Direktor (CEO) & Tadbirkor",
    bio: "Ataullayev Saidmuhammadalixon — texnologiya, biznes va kiberxavfsizlik sohasiga qiziqadigan yosh tadbirkor va IT mutaxassisi. Analitik fikrlash, yangi g'oyalarni tez o'zlashtirish va murakkab muammolarga innovatsion yechim topish — asosiy kuchli tomonlari. Veb-saytlar, Telegram botlar, avtomatlashtirish tizimlari, startaplar va kiberxavfsizlik yo'nalishida 50+ loyiha boshqargan.",
    stats: [
      { icon: Briefcase, label: "Loyihalar", value: "50+" },
      { icon: Users, label: "Mijozlar", value: "30+" },
      { icon: TrendingUp, label: "O'sish", value: "200%" },
      { icon: Star, label: "Reyting", value: "4.9★" },
    ],
    skills: [
      { name: "Full-Stack Dasturlash (Frontend & Backend)", level: 95 },
      { name: "Telegram Botlar Yaratish va Integratsiya", level: 96 },
      { name: "Ovozli AI Veb-Saytlar (Voice AI)", level: 88 },
      { name: "Google Sheets va Avtomatlashtirish", level: 97 },
      { name: "Node.js, React va Veb Texnologiyalar", level: 92 },
      { name: "Loyiha va Jamoa Boshqaruvi (PM)", level: 90 },
    ],
    experience: [
      {
        role: "Bosh Ijrochi Direktor (CEO)",
        place: "SAYD.X — IT kompaniyasi",
        period: "2023 – hozirgi kun",
        points: [
          "Kompaniyani noldan tashkil etib, professional jamoani shakllantirdi",
          "Veb-sayt, mobil ilova va Telegram bot yo'nalishlarida 50+ loyiha boshqarildi",
          "Strategik hamkorliklar orqali kompaniya daromadini sezilarli darajada oshirdi",
          "Google Sheets, Node.js, avtomatlashtirish va dashboard tizimlarini loyihalashtirdi",
        ],
      },
      {
        role: "Tadbirkor va Biznes Maslahatchi",
        place: "Mustaqil faoliyat",
        period: "2021 – 2023",
        points: [
          "Kichik va o'rta bizneslar uchun raqamlashtirish yechimlarini ishlab chiqdi",
          "IT va biznes kesishmasida amaliy tajriba orttirib, bozor tahlillarini o'rgandi",
          "Kiberxavfsizlik, startaplar va ta'lim loyihalarida ishladi",
        ],
      },
    ],
  },

  "Full-Stack Developer": {
    tagline: "To'liq Stekli Dasturchi (Full-Stack Developer)",
    bio: "Frontend'dan backend gacha har bir qadamda yaxlit yondashuvni amalga oshiraman. Kodni nafaqat ishlaydigan, balki tushunarli va kengaytiriladigan qilib yozish — mening dasturlash falsafam. Har bir loyiha — bu yangi muammo va yangi yechim topish imkoniyati.",
    stats: [
      { icon: Code2, label: "Loyihalar", value: "20+" },
      { icon: TrendingUp, label: "GitHub Commits", value: "1500+" },
      { icon: Star, label: "Kod Sifati", value: "A+" },
      { icon: Briefcase, label: "Tajriba", value: "3 yil+" },
    ],
    skills: [
      { name: "React.js / Next.js (Frontend)", level: 93 },
      { name: "Node.js / Express.js (Backend)", level: 91 },
      { name: "TypeScript / JavaScript", level: 90 },
      { name: "PostgreSQL / Prisma ORM", level: 87 },
      { name: "REST API / WebSocket", level: 88 },
    ],
    experience: [
      {
        role: "Full-Stack Dasturchi",
        place: "SAYD.X — IT kompaniyasi",
        period: "2023 – hozirgi kun",
        points: [
          "React va Node.js asosida zamonaviy veb-ilova arxitekturasini loyihaladi",
          "PostgreSQL yordamida murakkab ma'lumotlar bazalarini boshqaradi",
          "Xavfsiz va kengaytiriluvchi server tizimlarini ishlab chiqdi",
        ],
      },
      {
        role: "Junior Web Dasturchi",
        place: "Mustaqil Freelance",
        period: "2022 – 2023",
        points: [
          "HTML, CSS, JavaScript asosida responsiv veb-saytlarni noldan yaratdi",
          "Git va GitHub yordamida versiya nazoratini o'rnatdi",
        ],
      },
    ],
  },

  "App Developer": {
    tagline: "Mobil Ilova Dasturchisi (App Developer)",
    bio: "iOS va Android platformalari uchun foydalanuvchi qalbini zabt etadigan ilovalar yarataman. Tezkor, barqaror, chiroyli va intuitiv — har bir mobil ilovam ana shu tamoyillarga qurilgan.",
    stats: [
      { icon: Smartphone, label: "Ilovalar", value: "10+" },
      { icon: Users, label: "Foydalanuvchilar", value: "5000+" },
      { icon: Star, label: "App Store", value: "4.8★" },
      { icon: TrendingUp, label: "Yuklamalar", value: "10K+" },
    ],
    skills: [
      { name: "React Native (Cross-platform)", level: 94 },
      { name: "Flutter / Dart", level: 87 },
      { name: "Firebase / Supabase (Backend)", level: 89 },
      { name: "Mobil UI/UX Dizayn", level: 88 },
      { name: "API Integratsiya", level: 91 },
    ],
    experience: [
      {
        role: "Mobil Ilova Dasturchisi",
        place: "SAYD.X — IT kompaniyasi",
        period: "2023 – hozirgi kun",
        points: [
          "React Native asosida iOS va Android uchun ilovalar nashr etdi",
          "App Store va Google Play'ga ilovalarni muvaffaqiyatli joylashtirdi",
          "Mobil optimizatsiya orqali unumdorlikni sezilarli oshirdi",
        ],
      },
    ],
  },

  "Moliyachi": {
    tagline: "Moliya Mutaxassisi va Tahlilchi",
    bio: "Raqamlar — biznesdagi haqiqiy haqiqat. Moliyaviy hisobotlarni tahlil qilish, byudjetlashtirish va xarajatlarni optimallashtirish — mening asosiy ixtisosligim. Har bir qaror chuqur tahlilga asoslanishi kerak.",
    stats: [
      { icon: TrendingUp, label: "Loyihalar", value: "40+" },
      { icon: Briefcase, label: "Kompaniyalar", value: "15+" },
      { icon: Star, label: "Hisobotlar", value: "99%" },
      { icon: Users, label: "Mijozlar", value: "20+" },
    ],
    skills: [
      { name: "Moliyaviy Tahlil (IFRS)", level: 95 },
      { name: "Byudjetlashtirish va Prognoz", level: 93 },
      { name: "Buxgalteriya va Soliq Hisobi", level: 88 },
      { name: "Excel / Power BI Tahlil", level: 92 },
      { name: "ERP Tizimlari (1C)", level: 85 },
    ],
    experience: [
      {
        role: "Moliya Mutaxassisi",
        place: "SAYD.X — IT kompaniyasi",
        period: "2023 – hozirgi kun",
        points: [
          "Kompaniyaning moliyaviy hisobotlarini tayyorlaydi va tahlil qiladi",
          "Xarajatlarni optimallashtirish orqali tejamkorlikka erishdi",
          "Rahbariyat uchun analitik dashboardlar tayyorladi",
        ],
      },
      {
        role: "Katta Buxgalter",
        place: "Xususiy Sektor",
        period: "2021 – 2023",
        points: [
          "Debitorlik va kreditorlik qarzlarini nazorat qildi",
          "Daromad va xarajatlar tahlili hamda soliq hisobotlarini yuritdi",
        ],
      },
    ],
  },

  "Sheets Mutaxassisi": {
    tagline: "Google Sheets va Avtomatizatsiya Mutaxassisi",
    bio: "Google Sheets oddiy jadval emas, bu – kuchli biznes analitika vositasi. Murakkab formulalar, pivot jadvallar va avtomatik hisobotlar orqali biznes jarayonlarini yengillashtirib beraman.",
    stats: [
      { icon: TrendingUp, label: "Shablonlar", value: "60+" },
      { icon: Briefcase, label: "Jarayonlar", value: "30+" },
      { icon: Star, label: "Aniqlik", value: "99.9%" },
      { icon: Users, label: "Tejlangan vaqt", value: "70%" },
    ],
    skills: [
      { name: "Google Sheets / Excel (Pro)", level: 97 },
      { name: "Google Apps Script (JS)", level: 88 },
      { name: "Pivot Jadval va Formulalar", level: 95 },
      { name: "Data Visualization (Dashboard)", level: 92 },
      { name: "Make.com Avtomatizatsiya", level: 85 },
    ],
    experience: [
      {
        role: "Google Sheets Mutaxassisi",
        place: "SAYD.X — IT kompaniyasi",
        period: "2023 – hozirgi kun",
        points: [
          "Kompaniya jarayonlari uchun maxsus shablonlar ishlab chiqdi",
          "Google Apps Script orqali hisobotlarni avtomatlashtirdi",
          "Interaktiv dashboardlar tizimini yaratdi",
        ],
      },
    ],
  },
};

function getResumeData(role: string): RoleEntry {
  if (role === "CEO") return roleData["CEO"];
  if (role === "App Developer") return roleData["App Developer"];
  if (role === "Moliyachi") return roleData["Moliyachi"];
  if (role === "Sheets Mutaxassisi") return roleData["Sheets Mutaxassisi"];
  return roleData["Full-Stack Developer"];
}

export default function ResumePage() {
  const params = useParams<{ id: string }>();
  const { data: teamRes } = useTeam();

  const member = teamRes?.data?.find(m => m.id === params.id);
  const resume = member ? getResumeData(member.role) : null;

  if (!member || !resume) {
    return (
      <div className="min-h-screen bg-[#050810] text-white flex items-center justify-center">
        <p className="text-white/40 text-2xl font-bold animate-pulse">Ma'lumot yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050810] text-white relative overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Background glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-8 py-20 relative z-10">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row gap-12 items-center md:items-start mb-20"
        >
          {/* Detailed Profile Photo */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/30 rounded-[40px] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative w-64 h-64 rounded-[36px] overflow-hidden border-2 border-white/10 p-2 bg-gradient-to-br from-white/10 to-transparent">
              <img
                src={member.imageUrl || ""}
                alt={member.name}
                className="w-full h-full object-cover object-top rounded-[28px]"
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-2 bg-[#0a0f1c]/80 backdrop-blur-md border border-emerald-500/40 rounded-full px-5 py-2 shadow-xl shadow-emerald-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Ishga Tayyor</span>
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center md:text-left pt-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Shaxsiy Rezyume</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 text-white uppercase drop-shadow-2xl">
              {member.name}
            </h1>
            <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 mb-8">
              {resume.tagline}
            </p>
            <p className="text-white/70 text-2xl leading-relaxed max-w-2xl font-medium tracking-tight">
              {resume.bio}
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {resume.stats.map((s, i) => (
            <div key={i} className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-[32px] p-8 text-center hover:bg-white/[0.06] hover:border-blue-500/30 transition-all duration-300 group">
              <s.icon className="w-8 h-8 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-500" />
              <div className="text-4xl font-black text-white mb-2">{s.value}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Experience Timeline */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-4 mb-10">
              <span className="w-12 h-px bg-white/20" /> Tajriba
            </h2>
            <div className="space-y-12">
              {resume.experience.map((exp, i) => (
                <div key={i} className="relative pl-8 border-l-2 border-white/5 group">
                  <div className="absolute left-[-2px] top-1.5 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050810] border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:scale-125 transition-transform duration-300" />
                  <div className="text-sm font-black uppercase tracking-widest text-blue-400/80 mb-2">{exp.period}</div>
                  <h3 className="text-2xl font-black text-white mb-1 group-hover:text-blue-400 transition-colors">{exp.role}</h3>
                  <p className="text-lg text-white/50 font-bold mb-5 italic">{exp.place}</p>
                  <ul className="space-y-4">
                    {exp.points.map((p, j) => (
                      <li key={j} className="flex items-start gap-3 text-lg text-white/70 font-medium leading-relaxed">
                        <ChevronRight className="w-5 h-5 text-blue-500/50 mt-1 flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hard Skills */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-4 mb-10">
              <span className="w-12 h-px bg-white/20" /> Ko'nikmalar
            </h2>
            <div className="space-y-8 bg-white/[0.02] border border-white/5 p-10 rounded-[40px]">
              {resume.skills.map((skill, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-lg font-black text-white/90 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{skill.name}</span>
                    <span className="text-sm font-black text-blue-400/60">{skill.level}%</span>
                  </div>
                  <div className="h-2.5 bg-white/[0.05] rounded-full overflow-hidden p-[1px]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Balance */}
            <div className="mt-16 text-center">
               <div className="inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-blue-500/5 border border-blue-500/10 text-white/30 text-lg font-bold">
                 <MapPin className="w-5 h-5" /> Toshkent, O'zbekiston
               </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 pt-10 border-t border-white/5 text-center"
        >
          <a href="/jamoa" className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 font-black tracking-widest uppercase text-sm">
            ← Jamoa sahifasiga qaytish
          </a>
          <div className="mt-8 text-white/20 text-xs font-black tracking-[0.3em] uppercase">
            SAYD.X Ecosystem — 2024
          </div>
        </motion.div>
      </div>
    </div>
  );
}
