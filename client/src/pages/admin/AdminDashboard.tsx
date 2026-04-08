import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["Veb-sayt", "Mobil ilova", "Telegram Bot", "CRM / ERP", "Dizayn", "SMM / Marketing", "AI Yechimlar"];
const TECHS = ["React", "Vue.js", "Next.js", "Node.js", "Python", "PHP", "Laravel", "Flutter", "Swift", "Kotlin", "TypeScript", "JavaScript", "Go", "PostgreSQL", "MongoDB", "Docker", "AI / ML", "Uzum API", "Click", "Payme"];
const DURATIONS = ["3 kun", "5 kun", "7 kun", "10 kun", "14 kun", "21 kun", "1 oy", "2 oy"];
const SERVICE_FEATURES = ["SEO optimizatsiya", "Admin panel", "To'lov tizimlari", "Telegram bot integratsiya", "Ko'p tilli interfeys", "Mobil optimizatsiya", "Analitika va hisobotlar", "CRM integratsiya", "Jonli chat", "24/7 qo'llab-quvvatlash"];
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Service, Portfolio, Lead, Article, Faq, Question, TeamMember, insertServiceSchema, insertPortfolioSchema, insertArticleSchema, insertFaqSchema, insertQuestionSchema, insertTeamMemberSchema, InsertService, InsertPortfolio, InsertArticle, InsertFaq, InsertQuestion, InsertTeamMember } from "@shared/schema";
import { Loader2, LogOut, Settings, Briefcase, Users, LayoutDashboard, Plus, Pencil, LucideIcon, Newspaper, HelpCircle, Trash2, MessageCircle, UserCheck } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Send } from "lucide-react";

export default function AdminDashboard() {
    const [, setLocation] = useLocation();
    const { user, logoutMutation } = useAuth();
    const { toast } = useToast();
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false);
    const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
    const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
    const [isFaqDialogOpen, setIsFaqDialogOpen] = useState(false);
    const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
    const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
    const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);

    // Queries
    const { data: servicesRes, isLoading: servicesLoading } = useQuery<{ success: boolean, data: Service[] }>({
        queryKey: ["/api/services"],
    });

    const { data: portfoliosRes, isLoading: portfoliosLoading } = useQuery<{ success: boolean, data: Portfolio[] }>({
        queryKey: ["/api/portfolio"],
    });

    const { data: leadsRes, isLoading: leadsLoading } = useQuery<{ success: boolean, data: Lead[] }>({
        queryKey: ["/api/leads"],
    });

    const { data: articlesRes, isLoading: articlesLoading } = useQuery<{ success: boolean, data: Article[] }>({
        queryKey: ["/api/articles"],
    });

    const { data: faqsRes, isLoading: faqsLoading } = useQuery<{ success: boolean, data: Faq[] }>({
        queryKey: ["/api/admin/faqs"],
    });

    const { data: questionsRes, isLoading: questionsLoading } = useQuery<{ success: boolean, data: Question[] }>({
        queryKey: ["/api/admin/questions"],
    });

    const { data: teamRes, isLoading: teamLoading } = useQuery<{ success: boolean, data: TeamMember[] }>({
        queryKey: ["/api/team"],
    });

    const services = servicesRes?.data || [];
    const portfolios = portfoliosRes?.data || [];
    const leads = leadsRes?.data || [];
    const articles = articlesRes?.data || [];
    const faqs = faqsRes?.data || [];
    const questions = questionsRes?.data || [];
    const teamMembers = teamRes?.data || [];

    // Mutations
    const updateServiceMutation = useMutation({
        mutationFn: async ({ slug, data }: { slug: string, data: Partial<Service> }) => {
            const res = await apiRequest("PATCH", `/api/services/${slug}`, data);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/services"] });
            toast({ title: "Muvaffaqiyatli", description: "Xizmat yangilandi" });
            setIsServiceDialogOpen(false);
        },
        onError: (error: Error) => {
            toast({ title: "Xatolik", description: error.message, variant: "destructive" });
        }
    });

    const portfolioMutation = useMutation({
        mutationFn: async ({ id, data }: { id?: string, data: InsertPortfolio }) => {
            const method = id ? "PATCH" : "POST";
            const url = id ? `/api/portfolio/${id}` : "/api/portfolio";
            const res = await apiRequest(method, url, data);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
            toast({ title: "Muvaffaqiyatli", description: "Portfolio saqlandi" });
            setIsPortfolioDialogOpen(false);
        },
        onError: (error: Error) => {
            toast({ title: "Xatolik", description: error.message, variant: "destructive" });
        }
    });

    const articleMutation = useMutation({
        mutationFn: async ({ slug, data }: { slug?: string, data: InsertArticle }) => {
            const method = slug ? "PATCH" : "POST";
            const url = slug ? `/api/articles/${slug}` : "/api/articles";
            const res = await apiRequest(method, url, data);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
            toast({ title: "Muvaffaqiyatli", description: "Maqola saqlandi" });
            setIsArticleDialogOpen(false);
        },
        onError: (error: Error) => {
            toast({ title: "Xatolik", description: error.message, variant: "destructive" });
        }
    });

    const deleteArticleMutation = useMutation({
        mutationFn: async (slug: string) => {
            await apiRequest("DELETE", `/api/articles/${slug}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
            toast({ title: "Muvaffaqiyatli", description: "Maqola ochirildi" });
        }
    });

    const faqMutation = useMutation({
        mutationFn: async ({ id, data }: { id?: string, data: InsertFaq }) => {
            const method = id ? "PATCH" : "POST";
            const url = id ? `/api/faqs/${id}` : "/api/faqs";
            const res = await apiRequest(method, url, data);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/faqs"], });
            queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
            toast({ title: "Muvaffaqiyatli", description: "Savol saqlandi" });
            setIsFaqDialogOpen(false);
        },
        onError: (error: Error) => {
            toast({ title: "Xatolik", description: error.message, variant: "destructive" });
        }
    });

    const deleteFaqMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("DELETE", `/api/faqs/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/faqs"] });
            queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
            toast({ title: "Muvaffaqiyatli", description: "Savol ochirildi" });
        }
    });

    const questionMutation = useMutation({
        mutationFn: async ({ id, reply }: { id: string, reply: string }) => {
            const res = await apiRequest("PATCH", `/api/questions/${id}`, { reply });
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
            queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
            toast({ title: "Muvaffaqiyatli", description: "Javob saqlandi" });
            setIsQuestionDialogOpen(false);
        },
        onError: (error: Error) => {
            toast({ title: "Xatolik", description: error.message, variant: "destructive" });
        }
    });

    const deleteQuestionMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("DELETE", `/api/questions/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
            queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
            toast({ title: "Muvaffaqiyatli", description: "Savol o'chirildi" });
        }
    });

    const teamMutation = useMutation({
        mutationFn: async ({ id, data }: { id?: string, data: InsertTeamMember }) => {
            const method = id ? "PATCH" : "POST";
            const url = id ? `/api/team/${id}` : "/api/team";
            const res = await apiRequest(method, url, data);
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/team"] });
            toast({ title: "Muvaffaqiyatli", description: "Jamoa a'zosi saqlandi" });
            setIsTeamDialogOpen(false);
        },
        onError: (error: Error) => {
            toast({ title: "Xatolik", description: error.message, variant: "destructive" });
        }
    });

    const deleteTeamMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("DELETE", `/api/team/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/team"] });
            toast({ title: "Muvaffaqiyatli", description: "Jamoa xodimi o'chirildi" });
        }
    });

    const updateLeadMutation = useMutation({
        mutationFn: async ({ id, status, adminReply }: { id: string, status?: string, adminReply?: string }) => {
            const res = await apiRequest("PATCH", `/api/leads/${id}`, { status, adminReply });
            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
            toast({ title: "Muvaffaqiyatli", description: "Ma'lumotlar yangilandi" });
        },
        onError: (error: Error) => {
            toast({ title: "Xatolik", description: error.message, variant: "destructive" });
        }
    });

    const deleteLeadMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("DELETE", `/api/leads/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
            toast({ title: "Muvaffaqiyatli", description: "Ariza o'chirildi" });
            setIsLeadDialogOpen(false);
        },
        onError: (error: Error) => {
            toast({ title: "Xatolik", description: error.message, variant: "destructive" });
        }
    });

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                setLocation("/");
            }
        });
    };

    if (servicesLoading || portfoliosLoading || leadsLoading || articlesLoading || faqsLoading || questionsLoading || teamLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#050505] text-white p-4 md:p-8">
            <AnimatedBackground />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative">
                    <div className="relative">
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#00d4ff] rounded-full blur-[2px]" />
                        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            <LayoutDashboard className="w-10 h-10 text-[#00d4ff] drop-shadow-[0_0_15px_rgba(0,212,255,0.5)]" />
                            BOSHQARUV
                        </h1>
                        <p className="text-white/30 mt-1 font-bold tracking-[0.2em] uppercase text-[10px] pl-1">
                            Xush kelibsiz, <span className="text-[#00d4ff]/80">{user?.username}</span>
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="premium-crystal w-fit px-6 h-12 text-red-400 hover:text-red-300 transition-all rounded-2xl border-none font-bold uppercase tracking-widest text-xs relative overflow-hidden group/logout"
                    >
                        <span className="relative z-10 flex items-center">
                            <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Chiqish
                        </span>
                        <div className="crystal-shine" />
                    </Button>
                </header>

                <Tabs defaultValue="overview" className="space-y-8">
                    <TabsList className="bg-white/[0.03] backdrop-blur-[20px] border border-white/5 p-1.5 rounded-[24px] h-auto flex-wrap justify-start shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-[#004dc0]/40 data-[state=active]:text-white transition-all">
                            Umumiy
                        </TabsTrigger>
                        <TabsTrigger value="services" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-[#004dc0]/40 data-[state=active]:text-white transition-all">
                            <Settings className="w-3.5 h-3.5 mr-2" /> Xizmatlar
                        </TabsTrigger>
                        <TabsTrigger value="portfolio" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-[#004dc0]/40 data-[state=active]:text-white transition-all">
                            <Briefcase className="w-3.5 h-3.5 mr-2" /> Portfolio
                        </TabsTrigger>
                        <TabsTrigger value="leads" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-[#004dc0]/40 data-[state=active]:text-white transition-all">
                            <Users className="w-3.5 h-3.5 mr-2" /> Arizalar
                        </TabsTrigger>
                        <TabsTrigger value="articles" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-[#004dc0]/40 data-[state=active]:text-white transition-all">
                            <Newspaper className="w-3.5 h-3.5 mr-2" /> Yangiliklar
                        </TabsTrigger>
                        <TabsTrigger value="faqs" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-[#004dc0]/40 data-[state=active]:text-white transition-all">
                            <HelpCircle className="w-3.5 h-3.5 mr-2" /> Yordam
                        </TabsTrigger>
                        <TabsTrigger value="questions" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-[#004dc0]/40 data-[state=active]:text-white transition-all">
                            <MessageCircle className="w-3.5 h-3.5 mr-2" /> Savollar
                        </TabsTrigger>
                        <TabsTrigger value="team" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-[#004dc0]/40 data-[state=active]:text-white transition-all">
                            <UserCheck className="w-3.5 h-3.5 mr-2" /> Jamoa
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-4">
                            <StatCard title="Xizmatlar" value={services.length} icon={Settings} color="blue" />
                            <StatCard title="Loyihalar" value={portfolios.length} icon={Briefcase} color="purple" />
                            <StatCard title="Arizalar" value={leads.length} icon={Users} color="cyan" />
                            <StatCard title="Maqolalar" value={articles.length} icon={Newspaper} color="blue" />
                            <StatCard title="FAQ" value={faqs.length} icon={HelpCircle} color="purple" />
                            <StatCard title="Savollar" value={questions.length} icon={MessageCircle} color="cyan" />
                            <StatCard title="Jamoa" value={teamMembers.length} icon={UserCheck} color="blue" />
                        </div>
                    </TabsContent>


                    <TabsContent value="services" className="space-y-6 pt-4">
                        <div className="flex justify-between items-center bg-white/[0.03] backdrop-blur-[20px] p-6 rounded-[24px] border border-white/5 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white tracking-tight">Xizmatlarni boshqarish</h3>
                                <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-bold">Barcha taklif etayotgan xizmatlaringiz</p>
                            </div>
                            <Button
                                onClick={() => {
                                    setEditingService(null);
                                    setIsServiceDialogOpen(true);
                                }}
                                className="premium-crystal rounded-2xl h-12 px-6 font-bold uppercase tracking-widest text-xs shadow-[0_10px_20px_rgba(0,212,255,0.3)] hover:scale-105 transition-all relative overflow-hidden group/add"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Yangi xizmat
                                <div className="crystal-shine" />
                            </Button>
                        </div>

                        <Card className="bg-white/[0.02] backdrop-blur-[20px] border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-white/[0.03] border-b border-white/5">
                                            <TableRow className="hover:bg-transparent border-none">
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14 pl-8">Xizmat nomi</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14">Kategoriya</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14">Narxi</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14 text-right pr-8">Amallar</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {services.map((service) => (
                                                <TableRow key={service.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                                    <td className="px-8 py-4">
                                                        <div className="font-bold text-white">{service.name}</div>
                                                        <div className="text-[10px] text-white/30 uppercase tracking-wider">{service.slug}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="outline" className="rounded-lg bg-cyan-500/10 border-cyan-500/20 text-cyan-400 text-[10px] uppercase font-bold tracking-wider">
                                                            {service.category}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-black text-[#00d4ff]">${service.basePrice}</td>
                                                    <td className="px-6 py-4 text-right pr-8">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-white/40 hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 rounded-xl transition-all"
                                                            onClick={() => {
                                                                setEditingService(service);
                                                                setIsServiceDialogOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="w-4 h-4 mr-2" />
                                                            Tahrirlash
                                                        </Button>
                                                    </td>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="portfolio" className="space-y-6 pt-4">
                        <div className="flex justify-between items-center bg-white/[0.03] backdrop-blur-[20px] p-6 rounded-[24px] border border-white/5 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white tracking-tight">Portfolio boshqarish</h3>
                                <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-bold">Loyiha va ishlaringiz galereyasi</p>
                            </div>
                            <Button
                                onClick={() => {
                                    setEditingPortfolio(null);
                                    setIsPortfolioDialogOpen(true);
                                }}
                                className="premium-crystal rounded-2xl h-12 px-6 font-bold uppercase tracking-widest text-xs shadow-[0_10px_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-all relative overflow-hidden group/add"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Yangi loyiha
                                <div className="crystal-shine" />
                            </Button>
                        </div>

                        <Card className="bg-white/[0.02] backdrop-blur-[20px] border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-white/[0.03] border-b border-white/5">
                                            <TableRow className="hover:bg-transparent border-none">
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14 pl-8">Loyiha nomi</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14">Kategoriya</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14">Mijoz</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14 text-right pr-8">Amallar</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {portfolios.map((item) => (
                                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                                    <td className="px-8 py-4">
                                                        <div className="font-bold text-white">{item.title}</div>
                                                        <div className="text-[10px] text-white/30 uppercase tracking-wider line-clamp-1">{item.category}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="outline" className="rounded-lg bg-purple-500/10 border-purple-500/20 text-purple-400 text-[10px] uppercase font-bold tracking-wider">
                                                            {item.category}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-medium text-white/50">{item.clientName}</td>
                                                    <td className="px-6 py-4 text-right pr-8">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 transition-all border border-purple-500/20"
                                                                onClick={() => {
                                                                    setEditingPortfolio(item);
                                                                    setIsPortfolioDialogOpen(true);
                                                                }}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>


                    <TabsContent value="leads" className="space-y-6 pt-4">
                        <div className="flex justify-between items-center bg-white/[0.03] backdrop-blur-[20px] p-6 rounded-[24px] border border-white/5 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white tracking-tight">Yangi Arizalar</h3>
                                <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-bold">Mijozlardan kelgan so'rovlar</p>
                            </div>
                            <div className="premium-crystal rounded-2xl h-10 px-5 flex items-center justify-center font-black text-[10px] uppercase tracking-widest text-[#00d4ff] shadow-[0_5px_15px_rgba(0,212,255,0.2)]">
                                Jami: {leads.length}
                            </div>
                        </div>

                        <Card className="bg-white/[0.02] backdrop-blur-[20px] border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-white/[0.03] border-b border-white/5">
                                            <TableRow className="hover:bg-transparent border-none">
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14 pl-8">Mijoz</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14">Xizmat</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14">Vaqti</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14">Status</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14 text-right pr-8">Amallar</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {leads.map((lead) => (
                                                <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                                    <td className="px-8 py-5">
                                                        <div className="font-bold text-white">{lead.name}</div>
                                                        <div className="text-[10px] text-white/30 font-mono tracking-tight">{lead.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm font-medium text-white/70">{lead.serviceType}</td>
                                                    <td className="px-6 py-5 text-[10px] font-mono text-white/30">
                                                        {new Date(lead.createdAt || "").toLocaleString('uz-UZ', { hour12: false })}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <Badge
                                                            variant="secondary"
                                                            className={`
                                                                rounded-lg text-[9px] uppercase font-black tracking-widest px-2.5 py-0.5
                                                                ${lead.status === 'new' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}
                                                                ${lead.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : ''}
                                                                ${lead.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                                                                ${lead.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/30' : ''}
                                                            `}
                                                        >
                                                            {lead.status === 'new' ? 'Yangi' :
                                                                lead.status === 'contacted' ? 'Bog\'lanildi' :
                                                                    lead.status === 'completed' ? 'Bajarildi' : 'Bekor qilingan'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-5 text-right pr-8">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="rounded-xl h-9 px-4 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 font-bold text-[10px] uppercase tracking-widest transition-all"
                                                            onClick={() => {
                                                                setSelectedLead(lead);
                                                                setIsLeadDialogOpen(true);
                                                            }}
                                                        >
                                                            Batafsil
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>


                    <TabsContent value="articles" className="space-y-6 pt-4">
                        <div className="flex justify-between items-center bg-white/[0.03] backdrop-blur-[20px] p-6 rounded-[24px] border border-white/5 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white tracking-tight">Yangiliklarni boshqarish</h3>
                                <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-bold">Veb-sayt blogi va maqolalari</p>
                            </div>
                            <Button
                                onClick={() => {
                                    setEditingArticle(null);
                                    setIsArticleDialogOpen(true);
                                }}
                                className="premium-crystal rounded-2xl h-12 px-6 font-bold uppercase tracking-widest text-xs shadow-[0_10px_20px_rgba(0,112,243,0.3)] hover:scale-105 transition-all relative overflow-hidden group/add"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Yangi maqola
                                <div className="crystal-shine" />
                            </Button>
                        </div>

                        <Card className="bg-white/[0.02] backdrop-blur-[20px] border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-white/[0.03] border-b border-white/5">
                                            <TableRow className="hover:bg-transparent border-none">
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14 pl-8">Sarlavha</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14">Kategoriya</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14 text-right pr-8">Amallar</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {articles.map((article) => (
                                                <tr key={article.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                                    <td className="px-8 py-4">
                                                        <div className="font-bold text-white line-clamp-1">{article.title}</div>
                                                        <div className="text-[10px] text-white/30 uppercase tracking-tight">{article.slug}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="outline" className="rounded-lg bg-blue-500/10 border-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-wider">
                                                            {article.category}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right pr-8">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                                                onClick={() => {
                                                                    setEditingArticle(article);
                                                                    setIsArticleDialogOpen(true);
                                                                }}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="faqs" className="space-y-6 pt-4">
                        <div className="flex justify-between items-center bg-white/[0.03] backdrop-blur-[20px] p-6 rounded-[24px] border border-white/5 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white tracking-tight">Savol-javoblar</h3>
                                <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-bold">Ko'p beriladigan savollar boshqaruvi</p>
                            </div>
                            <Button
                                onClick={() => {
                                    setEditingFaq(null);
                                    setIsFaqDialogOpen(true);
                                }}
                                className="premium-crystal rounded-2xl h-12 px-6 font-bold uppercase tracking-widest text-xs shadow-[0_10px_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-all relative overflow-hidden group/add"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Yangi savol
                                <div className="crystal-shine" />
                            </Button>
                        </div>

                        <Card className="bg-white/[0.02] backdrop-blur-[20px] border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-white/[0.03] border-b border-white/5">
                                            <TableRow className="hover:bg-transparent border-none">
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14 pl-8">Savol</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14">Holat</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14 text-right pr-8">Amallar</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {faqs.map((faq) => (
                                                <tr key={faq.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                                    <td className="px-8 py-5">
                                                        <div className="font-bold text-white line-clamp-1">{faq.question}</div>
                                                        <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Tartib: #{faq.order}</div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <Badge variant={faq.isActive === "true" ? "default" : "secondary"} className={`rounded-lg text-[9px] uppercase font-black tracking-widest px-2.5 py-0.5 ${faq.isActive === "true" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                                                            {faq.isActive === "true" ? "Faol" : "Noactive"}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-5 text-right pr-8">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                                                                onClick={() => {
                                                                    setEditingFaq(faq);
                                                                    setIsFaqDialogOpen(true);
                                                                }}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="questions" className="space-y-6 pt-4">
                        <div className="flex justify-between items-center bg-white/[0.03] backdrop-blur-[20px] p-6 rounded-[24px] border border-white/5 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white tracking-tight">Mijozlarimiz savollari</h3>
                                <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-bold">Bot va saytdan kelgan savollar</p>
                            </div>
                        </div>

                        <Card className="bg-white/[0.02] backdrop-blur-[20px] border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-white/[0.03] border-b border-white/5">
                                            <TableRow className="hover:bg-transparent border-none">
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14 pl-8">Mijoz</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14">Savol</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14">Holat</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14 text-right pr-8">Amallar</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {questions.map((q) => (
                                                <tr key={q.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                                    <td className="px-8 py-5 font-bold text-white">{q.name}</td>
                                                    <td className="px-6 py-5 text-sm font-medium text-white/50">
                                                        <div className="line-clamp-1 italic">"{q.text}"</div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <Badge variant="outline" className={`rounded-lg text-[9px] uppercase font-black tracking-widest px-2.5 py-0.5 ${q.status === 'answered' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                                                            {q.status === 'answered' ? 'Javob berilgan' : 'Kutilmoqda'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-5 text-right pr-8">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="rounded-xl h-9 px-4 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 font-bold text-[10px] uppercase tracking-widest transition-all"
                                                            onClick={() => {
                                                                setEditingQuestion(q);
                                                                setIsQuestionDialogOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="w-4 h-4 mr-2" /> Javob berish
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="team" className="space-y-6 pt-4">
                        <div className="flex justify-between items-center bg-white/[0.03] backdrop-blur-[20px] p-6 rounded-[24px] border border-white/5 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white tracking-tight">Jamoani boshqarish</h3>
                                <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-bold">Biz haqimizda qismidagi xodimlar ro'yxati</p>
                            </div>
                            <Button
                                onClick={() => {
                                    setEditingTeamMember(null);
                                    setIsTeamDialogOpen(true);
                                }}
                                className="premium-crystal rounded-2xl h-12 px-6 font-bold uppercase tracking-widest text-xs shadow-[0_10px_20px_rgba(0,112,243,0.3)] hover:scale-105 transition-all relative overflow-hidden group/add"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Yangi xodim
                                <div className="crystal-shine" />
                            </Button>
                        </div>

                        <Card className="bg-white/[0.02] backdrop-blur-[20px] border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-white/[0.03] border-b border-white/5">
                                            <TableRow className="hover:bg-transparent border-none">
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14 pl-8">Xodim</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14">Lavozim</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14">Holat</TableHead>
                                                <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black h-14 text-right pr-8">Amallar</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {teamMembers.map((member) => (
                                                <tr key={member.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            {member.imageUrl ? (
                                                                <img src={member.imageUrl} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                                                    <UserCheck className="w-4 h-4 text-white/40" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="font-bold text-white flex items-center gap-2">
                                                                    {member.name}
                                                                    {member.isMain === "true" && (
                                                                        <Badge variant="outline" className="text-[8px] bg-blue-500/10 text-blue-400 border-blue-500/20 uppercase">Asosiy</Badge>
                                                                    )}
                                                                </div>
                                                                <div className="text-[10px] text-white/30 truncate max-w-[200px]">{member.bio}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <Badge variant="outline" className="rounded-lg bg-white/5 border-white/10 text-white/70 text-[10px] uppercase font-bold tracking-wider">
                                                            {member.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <Badge variant={member.isActive === "true" ? "default" : "secondary"} className={`rounded-lg text-[9px] uppercase font-black tracking-widest px-2.5 py-0.5 ${member.isActive === "true" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                                                            {member.isActive === "true" ? "Faol" : "Noactive"}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-5 text-right pr-8">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all border border-blue-500/20"
                                                                onClick={() => {
                                                                    setEditingTeamMember(member);
                                                                    setIsTeamDialogOpen(true);
                                                                }}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                                                                onClick={() => {
                                                                    if (confirm("Bu xodimni o'chirib tashlamoqchimisiz?")) {
                                                                        deleteTeamMutation.mutate(member.id);
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>

            <ServiceDialog
                open={isServiceDialogOpen}
                onOpenChange={setIsServiceDialogOpen}
                service={editingService}
                onSave={(data) => updateServiceMutation.mutate({ slug: editingService!.slug, data })}
                isPending={updateServiceMutation.isPending}
            />

            <PortfolioDialog
                open={isPortfolioDialogOpen}
                onOpenChange={setIsPortfolioDialogOpen}
                item={editingPortfolio}
                onSave={(data) => portfolioMutation.mutate({ id: editingPortfolio?.id, data })}
                isPending={portfolioMutation.isPending}
            />

            <ArticleDialog
                open={isArticleDialogOpen}
                onOpenChange={setIsArticleDialogOpen}
                item={editingArticle}
                onSave={(data) => articleMutation.mutate({ slug: editingArticle?.slug, data })}
                isPending={articleMutation.isPending}
            />

            <FaqDialog
                open={isFaqDialogOpen}
                onOpenChange={setIsFaqDialogOpen}
                item={editingFaq}
                onSave={(data) => faqMutation.mutate({ id: editingFaq?.id, data })}
                isPending={faqMutation.isPending}
            />
            <QuestionDialog
                open={isQuestionDialogOpen}
                onOpenChange={setIsQuestionDialogOpen}
                item={editingQuestion}
                onSave={(data) => questionMutation.mutate({ id: editingQuestion!.id, reply: data.reply })}
                isPending={questionMutation.isPending}
            />
            
            <TeamDialog
                open={isTeamDialogOpen}
                onOpenChange={setIsTeamDialogOpen}
                item={editingTeamMember}
                onSave={(data) => teamMutation.mutate({ id: editingTeamMember?.id, data })}
                isPending={teamMutation.isPending}
            />

            <LeadDetailsDialog
                open={isLeadDialogOpen}
                onOpenChange={setIsLeadDialogOpen}
                lead={selectedLead}
                onDelete={(id) => deleteLeadMutation.mutate(id)}
                onStatusUpdate={(id, status) => updateLeadMutation.mutate({ id, status })}
                onReplyUpdate={(id, adminReply) => updateLeadMutation.mutate({ id, adminReply })}
                isPending={updateLeadMutation.isPending}
            />
        </div >
    );
}

function LeadDetailsDialog({ open, onOpenChange, lead, onDelete, onStatusUpdate, onReplyUpdate, isPending }: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    lead: Lead | null,
    onDelete: (id: string) => void,
    onStatusUpdate: (id: string, status: string) => void,
    onReplyUpdate: (id: string, reply: string) => void,
    isPending: boolean
}) {
    const [replyText, setReplyText] = useState(lead?.adminReply || "");

    // Update replyText when lead changes
    useEffect(() => {
        setReplyText(lead?.adminReply || "");
    }, [lead]);
    if (!lead) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0f172a]/95 backdrop-blur-[30px] border-white/10 text-white max-w-xl rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-0 border overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff]/40 to-transparent" />
                
                <DialogHeader className="p-8 pb-4 relative">
                    <DialogTitle className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                            <Users className="w-5 h-5 text-[#00d4ff]" />
                        </div>
                        Ariza tafsilotlari
                    </DialogTitle>
                </DialogHeader>

                <div className="p-8 pt-4 space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">Mijoz</p>
                            <p className="text-lg font-bold tracking-tight">{lead.name}</p>
                        </div>
                        <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">Telefon</p>
                            <p className="text-lg font-bold text-[#00d4ff] tracking-tight">{lead.phone}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-black pl-1">Statusni boshqarish</p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 'new', label: 'Yangi', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
                                { id: 'contacted', label: 'Bog\'lanildi', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
                                { id: 'completed', label: 'Bajarildi', cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
                                { id: 'cancelled', label: 'Bekor qilindi', cls: 'bg-red-500/20 text-red-400 border-red-500/30' }
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => onStatusUpdate(lead.id, s.id)}
                                    className={`
                                        rounded-xl text-[10px] font-black uppercase tracking-widest px-4 h-9 transition-all border
                                        ${lead.status === s.id ? s.cls + ' shadow-[0_5px_15px_rgba(0,0,0,0.3)]' : 'border-white/10 hover:bg-white/5 text-white/40'}
                                    `}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-black pl-1">Admin javobi</p>
                        <div className="relative group">
                            <Textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Mijozga javob yozing..."
                                className="bg-white/[0.03] border-white/5 rounded-2xl min-h-[140px] text-sm py-4 pr-14 focus:border-[#00d4ff]/40 transition-all resize-none"
                            />
                            <Button
                                size="icon"
                                onClick={() => onReplyUpdate(lead.id, replyText)}
                                disabled={isPending || replyText === (lead.adminReply || "")}
                                className="absolute bottom-4 right-4 premium-crystal w-10 h-10 rounded-xl shadow-[0_5px_15px_rgba(0,212,255,0.2)]"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-8 pt-4 border-t border-white/5 flex flex-col md:flex-row gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            if (confirm("Ushbu arizani o'chirib tashlamoqchimisiz?")) {
                                onDelete(lead.id);
                            }
                        }}
                        className="h-12 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-red-400 hover:text-red-300 hover:bg-red-500/10 order-2 md:order-1"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        O'chirish
                    </Button>
                    <Button onClick={() => onOpenChange(false)} className="premium-crystal flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-[0_10px_20px_rgba(255,255,255,0.05)] order-1 md:order-2">
                        Yopish
                        <div className="crystal-shine" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ArticleDialog({ open, onOpenChange, item, onSave, isPending }: { open: boolean, onOpenChange: (open: boolean) => void, item: Article | null, onSave: (data: any) => void, isPending: boolean }) {
    const form = useForm<InsertArticle>({
        resolver: zodResolver(insertArticleSchema),
        values: item ? {
            title: item.title,
            slug: item.slug,
            excerpt: item.excerpt,
            content: item.content,
            category: item.category,
            author: item.author || "SAYD.X Team",
            readTime: item.readTime || "",
            imageUrl: item.imageUrl || "",
            tags: item.tags || "[]",
            isPublished: item.isPublished || "true"
        } : {
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            category: "",
            author: "SAYD.X Team",
            readTime: "",
            imageUrl: "",
            tags: "[]",
            isPublished: "true"
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0f172a]/95 backdrop-blur-[30px] border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-0 border overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0070f3]/40 to-transparent" />
                
                <DialogHeader className="p-8 pb-4">
                    <DialogTitle className="text-2xl font-black tracking-tight uppercase">{item ? "Maqolani tahrirlash" : "Yangi maqola yaratish"}</DialogTitle>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-1">Blog va yangiliklar bo'limi</p>
                </DialogHeader>

                <div className="p-8 pt-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 pt-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Sarlavha</FormLabel>
                                        <FormControl><Input {...field} className="bg-white/[0.03] border-white/5 rounded-2xl h-12 focus:border-[#0070f3]/50 transition-all" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Slug (URL)</FormLabel>
                                            <FormControl><Input {...field} className="bg-white/[0.03] border-white/5 rounded-2xl h-12 focus:border-[#0070f3]/50 transition-all font-mono text-xs" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Kategoriya</FormLabel>
                                            <FormControl>
                                                <div className="space-y-3">
                                                    <Input {...field} className="bg-white/[0.03] border-white/5 rounded-2xl h-12 focus:border-[#0070f3]/50 transition-all" list="article-categories" />
                                                    <datalist id="article-categories">
                                                        {CATEGORIES.map(c => <option key={c} value={c} />)}
                                                    </datalist>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Matn (Markdown)</FormLabel>
                                        <FormControl><Textarea {...field} className="bg-white/[0.03] border-white/5 rounded-2xl min-h-[300px] focus:border-[#0070f3]/50 transition-all text-sm py-4" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
                                <Button type="submit" disabled={isPending} className="premium-crystal flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-[0_20px_40px_rgba(0,112,243,0.3)] bg-blue-600 hover:bg-blue-500">
                                    {isPending && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
                                    SAQLASH
                                    <div className="crystal-shine" />
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-white/40 hover:text-white hover:bg-white/5 transition-all">
                                    Bekor qilish
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function FaqDialog({ open, onOpenChange, item, onSave, isPending }: { open: boolean, onOpenChange: (open: boolean) => void, item: Faq | null, onSave: (data: any) => void, isPending: boolean }) {
    const form = useForm<InsertFaq>({
        resolver: zodResolver(insertFaqSchema),
        values: item ? {
            question: item.question,
            answer: item.answer,
            order: item.order || 0,
            isActive: item.isActive || "true"
        } : {
            question: "",
            answer: "",
            order: 0,
            isActive: "true"
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0f172a]/95 backdrop-blur-[30px] border-white/10 text-white max-w-2xl rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-0 border overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
                
                <DialogHeader className="p-8 pb-4">
                    <DialogTitle className="text-2xl font-black tracking-tight uppercase">{item ? "Savolni tahrirlash" : "Yangi savol qo'shish"}</DialogTitle>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-1">FAQ boshqaruvi</p>
                </DialogHeader>

                <div className="p-8 pt-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 pt-4">
                            <FormField
                                control={form.control}
                                name="question"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Savol</FormLabel>
                                        <FormControl><Input {...field} className="bg-white/[0.03] border-white/5 rounded-2xl h-12 focus:border-purple-500/50 transition-all font-bold" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="answer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Javob</FormLabel>
                                        <FormControl><Textarea {...field} className="bg-white/[0.03] border-white/5 rounded-2xl min-h-[160px] focus:border-purple-500/50 transition-all py-4" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
                                <Button type="submit" disabled={isPending} className="premium-crystal flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-[0_20px_40px_rgba(168,85,247,0.3)] bg-purple-600 hover:bg-purple-500">
                                    {isPending && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
                                    SAQLASH
                                    <div className="crystal-shine" />
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-white/40 hover:text-white hover:bg-white/5 transition-all">
                                    Yopish
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ServiceDialog({ open, onOpenChange, service, onSave, isPending }: { open: boolean, onOpenChange: (open: boolean) => void, service: Service | null, onSave: (data: any) => void, isPending: boolean }) {
    const form = useForm<InsertService>({
        resolver: zodResolver(insertServiceSchema),
        values: service ? {
            name: service.name,
            slug: service.slug,
            shortDescription: service.shortDescription,
            fullDescription: service.fullDescription,
            category: service.category,
            basePrice: service.basePrice,
            duration: service.duration,
            features: service.features,
            isActive: service.isActive || "true"
        } : {
            name: "",
            slug: "",
            shortDescription: "",
            fullDescription: "",
            category: "",
            basePrice: 0,
            duration: "",
            features: "[]",
            isActive: "true",
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0f172a]/95 backdrop-blur-[30px] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-0 border overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <DialogHeader className="p-8 pb-4 relative">
                    <DialogTitle className="text-2xl font-black tracking-tight uppercase">{service ? "Xizmatni tahrirlash" : "Yangi xizmat qo'shish"}</DialogTitle>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-1">Barcha maydonlarni to'ldiring</p>
                </DialogHeader>

                <div className="p-8 pt-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Xizmat nomi</FormLabel>
                                            <FormControl><Input {...field} className="bg-white/[0.03] border-white/5 rounded-2xl h-12 focus:border-[#00d4ff]/50 transition-all font-medium" placeholder="Masalan: Web-sayt yaratish" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Kategoriya</FormLabel>
                                            <FormControl>
                                                <div className="space-y-3">
                                                    <Input {...field} className="bg-white/[0.03] border-white/5 rounded-2xl h-12 focus:border-[#00d4ff]/50 transition-all font-medium" list="service-categories" placeholder="Tanlang yoki yozing" />
                                                    <datalist id="service-categories">
                                                        {CATEGORIES.map(c => <option key={c} value={c} />)}
                                                    </datalist>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            <FormField
                                control={form.control}
                                name="shortDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Qisqa tavsif</FormLabel>
                                        <FormControl><Textarea {...field} className="bg-white/[0.03] border-white/5 rounded-2xl min-h-[100px] focus:border-[#00d4ff]/50 transition-all text-sm py-4" placeholder="Xizmat haqida qisqacha ma'lumot..." /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="basePrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Narx ($)</FormLabel>
                                            <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="bg-white/[0.03] border-white/5 rounded-2xl h-12 focus:border-[#00d4ff]/50 transition-all font-mono" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Muddati</FormLabel>
                                            <FormControl><Input {...field} className="bg-white/[0.03] border-white/5 rounded-2xl h-12 focus:border-[#00d4ff]/50 transition-all" placeholder="Masalan: 7-10 kun" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
                                <Button type="submit" disabled={isPending} className="premium-crystal flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-sm relative overflow-hidden group/submit shadow-[0_20px_40px_rgba(0,77,192,0.3)]">
                                    <span className="relative z-10 flex items-center justify-center">
                                        {isPending && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
                                        SAQLASH
                                    </span>
                                    <div className="crystal-shine" />
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-14 rounded-2xl font-bold uppercase tracking-widest text-xs text-white/40 hover:text-white hover:bg-white/5 transition-all">
                                    Bekor qilish
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}


function PortfolioDialog({ open, onOpenChange, item, onSave, isPending }: { open: boolean, onOpenChange: (open: boolean) => void, item: Portfolio | null, onSave: (data: any) => void, isPending: boolean }) {
    const form = useForm<InsertPortfolio>({
        resolver: zodResolver(insertPortfolioSchema),
        values: item ? {
            title: item.title,
            description: item.description,
            category: item.category,
            technologies: item.technologies,
            isPublic: item.isPublic || "true",
            clientName: item.clientName || "",
            duration: item.duration || "",
            problemStatement: item.problemStatement || "",
            solution: item.solution || "",
            results: item.results || "[]",
            images: item.images || "[]",
            link: item.link || ""
        } : {
            title: "",
            description: "",
            category: "",
            technologies: "[]",
            isPublic: "true",
            clientName: "",
            duration: "",
            problemStatement: "",
            solution: "",
            results: "[]",
            images: "[]",
            link: ""
        },
    });

    const handleFormSubmit = (data: InsertPortfolio) => {
        const payload = { ...data };
        try {
            JSON.parse(payload.technologies);
        } catch (e) {
            const raw = payload.technologies.replace(/[\[\]]/g, '').trim();
            payload.technologies = raw ? JSON.stringify(raw.split(',').map(s => s.trim())) : "[]";
        }
        onSave(payload);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0f172a]/95 backdrop-blur-[30px] border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-0 border overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a855f7]/40 to-transparent" />
                
                <DialogHeader className="p-8 pb-4">
                    <DialogTitle className="text-2xl font-black tracking-tight uppercase">{item ? "Loyihani tahrirlash" : "Yangi loyiha qo'shish"}</DialogTitle>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-1">Portfolio boshqaruvi</p>
                </DialogHeader>

                <div className="p-8 pt-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Loyiha nomi</FormLabel>
                                            <FormControl><Input {...field} className="bg-white/[0.03] border-white/5 rounded-2xl h-12 focus:border-[#a855f7]/50" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Kategoriya</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="bg-white/[0.03] border-white/5 rounded-2xl h-12" list="portfolio-categories" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Tavsif</FormLabel>
                                        <FormControl><Textarea {...field} className="bg-white/[0.03] border-white/5 rounded-2xl min-h-[100px] py-4" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="clientName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Mijoz nomi</FormLabel>
                                            <FormControl><Input {...field} value={field.value || ""} className="bg-white/[0.03] border-white/5 rounded-2xl h-12" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Tayyor bo'lish vaqti</FormLabel>
                                            <FormControl><Input {...field} value={field.value || ""} className="bg-white/[0.03] border-white/5 rounded-2xl h-12" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
                                <Button type="submit" disabled={isPending} className="premium-crystal flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-[0_20px_40px_rgba(168,85,247,0.3)] bg-purple-600">
                                    {isPending && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
                                    SAQLASH
                                    <div className="crystal-shine" />
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-white/40 hover:text-white hover:bg-white/5 transition-all">
                                    Bekor qilish
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function QuestionDialog({ open, onOpenChange, item, onSave, isPending }: { open: boolean, onOpenChange: (open: boolean) => void, item: Question | null, onSave: (data: any) => void, isPending: boolean }) {
    const form = useForm({
        defaultValues: {
            reply: item?.reply || ""
        },
        values: {
            reply: item?.reply || ""
        }
    });

    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#111111] border-white/10 text-white max-w-2xl rounded-3xl">
                <DialogHeader>
                    <DialogTitle>Savolga javob yozish</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Mijoz: {item.name}</p>
                        <p className="text-sm italic">"{item.text}"</p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="reply"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sizning javobingiz</FormLabel>
                                        <FormControl><Textarea {...field} className="bg-white/5 border-white/10 rounded-xl min-h-[150px]" placeholder="Javob matnini kiriting..." /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit" disabled={isPending} className="bg-[#004dc0] hover:bg-[#0057e7] text-white rounded-xl px-8">
                                    {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Javobni saqlash
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: LucideIcon, color: "blue" | "purple" | "cyan" }) {
    const colors = {
        blue: "shadow-[0_10px_30px_rgba(0,112,243,0.2)] text-blue-400 border-[#004dc0]/30",
        purple: "shadow-[0_10px_30px_rgba(168,85,247,0.2)] text-purple-400 border-purple-500/30",
        cyan: "shadow-[0_10px_30px_rgba(6,182,212,0.2)] text-cyan-400 border-cyan-500/30"
    };

    return (
        <Card className={`bg-white/[0.03] backdrop-blur-[20px] border ${colors[color]} rounded-[32px] overflow-hidden group hover:scale-[1.05] transition-all duration-500 relative`}>
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
            
            <CardContent className="p-7 flex flex-col items-center text-center relative z-10">
                <div className={`p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-4 group-hover:scale-110 transition-transform duration-500 relative`}>
                    <Icon className="w-8 h-8 drop-shadow-[0_0_8px_currentColor]" />
                    <div className="absolute inset-0 bg-current opacity-10 blur-xl rounded-full" />
                </div>
                <div>
                    <h3 className="text-4xl font-black tracking-tighter mb-1">{value}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{title}</p>
                </div>
            </CardContent>
            <div className="crystal-shine" />
        </Card>
    );
}

function TeamDialog({ open, onOpenChange, item, onSave, isPending }: { open: boolean, onOpenChange: (open: boolean) => void, item: TeamMember | null, onSave: (data: any) => void, isPending: boolean }) {
    const form = useForm<InsertTeamMember>({
        resolver: zodResolver(insertTeamMemberSchema),
        values: item ? {
            name: item.name,
            role: item.role,
            bio: item.bio,
            imageUrl: item.imageUrl || "",
            isMain: item.isMain || "false",
            order: item.order || 0,
            isActive: item.isActive || "true"
        } : {
            name: "",
            role: "",
            bio: "",
            imageUrl: "",
            isMain: "false",
            order: 0,
            isActive: "true"
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0f172a]/95 backdrop-blur-[30px] border-white/10 text-white max-w-2xl rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-0 border overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                
                <DialogHeader className="p-8 pb-4">
                    <DialogTitle className="text-2xl font-black tracking-tight uppercase">{item ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}</DialogTitle>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-1">Jamoa a'zosi boshqaruvi</p>
                </DialogHeader>

                <div className="p-8 pt-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Ism va familiya</FormLabel>
                                            <FormControl><Input {...field} className="bg-white/[0.03] border-white/5 rounded-2xl h-12 focus:border-blue-500/50 transition-all font-bold" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Lavozim</FormLabel>
                                            <FormControl><Input {...field} className="bg-white/[0.03] border-white/5 rounded-2xl h-12 focus:border-blue-500/50 transition-all" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Qisqacha ma'lumot (Bio)</FormLabel>
                                        <FormControl><Textarea {...field} className="bg-white/[0.03] border-white/5 rounded-2xl min-h-[100px] focus:border-blue-500/50 transition-all py-4" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Rasm URL manzil / Yo'li</FormLabel>
                                        <FormControl><Input {...field} value={field.value || ""} className="bg-white/[0.03] border-white/5 rounded-2xl h-12 focus:border-blue-500/50 transition-all" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="isMain"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Asosiy shaxsmi?</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="w-full bg-white/[0.03] border-white/5 rounded-2xl h-12 px-3 text-sm focus:border-blue-500/50 transition-all focus:outline-none"
                                                >
                                                    <option value="false" className="bg-[#0f172a]">Yo'q (Pastda chiqadi)</option>
                                                    <option value="true" className="bg-[#0f172a]">Ha (Chapda chiqadi)</option>
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Holati</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="w-full bg-white/[0.03] border-white/5 rounded-2xl h-12 px-3 text-sm focus:border-blue-500/50 transition-all focus:outline-none"
                                                >
                                                    <option value="true" className="bg-[#0f172a]">Faol</option>
                                                    <option value="false" className="bg-[#0f172a]">Nofaol</option>
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 uppercase text-[10px] font-bold tracking-widest pl-1">Tartib raqami</FormLabel>
                                            <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="bg-white/[0.03] border-white/5 rounded-2xl h-12 focus:border-blue-500/50 transition-all" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
                                <Button type="submit" disabled={isPending} className="premium-crystal flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-[0_20px_40px_rgba(0,112,243,0.3)] bg-blue-600 hover:bg-blue-500">
                                    {isPending && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
                                    SAQLASH
                                    <div className="crystal-shine" />
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-white/40 hover:text-white hover:bg-white/5 transition-all">
                                    Yopish
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
