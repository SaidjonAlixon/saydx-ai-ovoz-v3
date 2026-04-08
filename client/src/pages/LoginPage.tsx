import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, InsertUser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "wouter";
import { Loader2, Lock } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useEffect } from "react";

export default function LoginPage() {
    const { user, loginMutation } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (user?.isAdmin) {
            setLocation("/admin");
        }
    }, [user, setLocation]);

    const form = useForm<InsertUser>({
        resolver: zodResolver(insertUserSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = (data: InsertUser) => {
        loginMutation.mutate(data);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#020617]">
            <AnimatedBackground />

            {/* Premium Glow Effect behind the card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#004dc0]/20 blur-[120px] rounded-full pointer-events-none" />

            <Card className="w-full max-w-md relative z-10 bg-white/[0.03] backdrop-blur-[20px] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[32px] overflow-hidden group">
                {/* Glossy Reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] to-transparent pointer-events-none opacity-50" />
                
                {/* Glass edge shine */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <CardHeader className="text-center pb-4 pt-8 relative">
                    <div className="mx-auto w-20 h-20 premium-crystal rounded-3xl flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(0,112,243,0.4)] group-hover:scale-105 transition-transform duration-500">
                        <Lock className="w-10 h-10 text-white drop-shadow-[0_0_12px_rgba(0,212,255,0.8)]" />
                        <div className="crystal-shine" />
                    </div>
                    <CardTitle className="text-4xl font-black text-white tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        ADMIN KIRISH
                    </CardTitle>
                    <p className="text-white/40 text-sm mt-3 font-medium uppercase tracking-widest px-8">
                        BOSHQARUV PANELIGA XAVFSIZ KIRISH
                    </p>
                </CardHeader>

                <CardContent className="px-8 pb-10 relative">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group/field">
                                                <Input
                                                    {...field}
                                                    className="bg-white/[0.03] border-white/5 text-white placeholder:text-white/20 h-14 pl-5 rounded-2xl focus:ring-2 focus:ring-[#00d4ff]/20 focus:border-[#00d4ff]/40 transition-all duration-300 font-medium"
                                                    placeholder="Login"
                                                />
                                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[#00d4ff] group-focus-within/field:w-full transition-all duration-500" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400 font-medium text-xs ml-1" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group/field">
                                                <Input
                                                    type="password"
                                                    {...field}
                                                    className="bg-white/[0.03] border-white/5 text-white placeholder:text-white/20 h-14 pl-5 rounded-2xl focus:ring-2 focus:ring-[#00d4ff]/20 focus:border-[#00d4ff]/40 transition-all duration-300 font-medium"
                                                    placeholder="Parol"
                                                />
                                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[#00d4ff] group-focus-within/field:w-full transition-all duration-500" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400 font-medium text-xs ml-1" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="premium-crystal w-full h-14 text-lg font-bold uppercase tracking-widest text-white rounded-2xl shadow-[0_15px_30px_rgba(0,77,192,0.3)] hover:shadow-[0_20px_40px_rgba(0,112,243,0.5)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 border-none group/btn relative overflow-hidden"
                                disabled={loginMutation.isPending}
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {loginMutation.isPending ? (
                                        <Loader2 className="w-6 h-6 animate-spin mr-3" />
                                    ) : null}
                                    KIRISH
                                </span>
                                <div className="crystal-shine" />
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent opacity-50" />
                            </Button>
                        </form>
                    </Form>
                    
                    {/* Security Info */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-white/20 font-bold tracking-widest uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse" />
                        SSL XIMOYALANGAN TIZIM
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

