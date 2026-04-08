import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, User, Phone, SendHorizontal, Briefcase, DollarSign, Calendar, MessageSquare, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  phone: string;
  telegram: string;
  service: string;
  budget: string;
  timeline: string;
  description: string;
}

interface QuickLeadFormProps {
  defaultService?: string;
}

const services = [
  "Telegram Bot",
  "Veb-sayt",
  "Sheets Avtomatlashtirish",
  "UI/UX Dizayn",
  "Mini-ilova",
  "Target Reklama",
  "Mobil ilovalar",
  "Avtomatlashtirilgan AyTi xizmatlar",
  "Mijoz talabi asosida"
];

const budgetRanges = [
  "$100 - $300",
  "$300 - $500",
  "$500 - $1,000",
  "$1,000 - $1,500",
  "$1,500+"
];

const timelines = [
  "1 hafta ichida",
  "2-3 hafta ichida",
  "1 oy ichida",
  "Muddati muhim emas"
];

export default function QuickLeadForm({ defaultService }: QuickLeadFormProps = { defaultService: undefined }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    telegram: "",
    service: defaultService || "",
    budget: "",
    timeline: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (defaultService) {
      setFormData(prev => ({ ...prev, service: defaultService }));
    }
  }, [defaultService]);

  const formatPhoneNumber = (value: string) => {
    let numbers = value.replace(/\D/g, '');
    if (numbers.length > 0 && numbers.length <= 9 && !numbers.startsWith('998')) {
      numbers = '998' + numbers;
    }
    if (numbers.startsWith('998')) {
      const formatted = numbers.replace(/(\d{3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/, (match, p1, p2, p3, p4, p5) => {
        let res = '+' + p1;
        if (p2) res += ' ' + p2;
        if (p3) res += ' ' + p3;
        if (p4) res += ' ' + p4;
        if (p5) res += ' ' + p5;
        return res;
      });
      return formatted;
    }
    return '+' + numbers;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    const error = validateField('phone', formatted);
    setFieldErrors(prev => ({ ...prev, phone: error }));
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    const error = validateField(fieldName, value);
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case 'name':
        if (!value.trim()) return "Ism maydonini to'ldiring";
        if (value.trim().length < 2) return "Ism kamida 2 ta harf bo'lishi kerak";
        return "";
      case 'phone':
        if (!value.trim()) return "Telefon raqamini to'ldiring";
        const phoneNumbers = value.replace(/\D/g, '');
        if (phoneNumbers.length !== 12 || !phoneNumbers.startsWith('998')) {
          return "To'g'ri telefon raqam kiriting (+998 90 123 45 67)";
        }
        return "";
      case 'service':
        if (!value.trim()) return "Xizmat turini tanlang";
        return "";
      case 'telegram':
        if (value.trim() && !value.startsWith('@')) return "Telegram username @ bilan boshlanishi kerak";
        return "";
      default:
        return "";
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    let isValid = true;
    const nameError = validateField('name', formData.name);
    if (nameError) { errors.name = nameError; isValid = false; }
    const phoneError = validateField('phone', formData.phone);
    if (phoneError) { errors.phone = phoneError; isValid = false; }
    const serviceError = validateField('service', formData.service);
    if (serviceError) { errors.service = serviceError; isValid = false; }
    const telegramError = validateField('telegram', formData.telegram);
    if (telegramError) { errors.telegram = telegramError; isValid = false; }
    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    try {
      const requestData = {
        name: formData.name,
        phone: formData.phone,
        serviceType: formData.service,
        telegram: formData.telegram || null,
        budget: formData.budget || null,
        timeline: formData.timeline || null,
        description: formData.description || null,
        source: "website"
      };
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      const result = await response.json();
      if (result.success) {
        try {
          const myLeads = JSON.parse(localStorage.getItem('my_leads') || '[]');
          if (result.data && result.data.id) {
            myLeads.push(result.data.id);
            localStorage.setItem('my_leads', JSON.stringify(myLeads));
          }
        } catch (e) {
          console.error('Error saving to localStorage:', e);
        }
        toast({
          title: "Buyurtma qabul qilindi!",
          description: "Arizangiz ko'rib chiqilmoqda. Tez orada siz bilan bog'lanamiz. Rahmat!"
        });
        setFormData({
          name: "", phone: "", telegram: "",
          service: defaultService || "",
          budget: "", timeline: "", description: ""
        });
      } else {
        toast({
          title: "Xatolik!",
          description: result.message || "Arizani yuborishda xatolik yuz berdi",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Xatolik!",
        description: "Arizani yuborishda kutilmagan xatolik yuz berdi",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.phone && formData.service;

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/[0.03] backdrop-blur-[30px] border-white/5 rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff]/30 to-transparent" />
      
      <CardHeader className="p-8 pb-4 relative">
        <CardTitle className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/20">
            <Send className="w-6 h-6 text-[#00d4ff]" />
          </div>
          Tez Ariza Yuborish
        </CardTitle>
        <CardDescription className="text-white/40 text-[11px] uppercase tracking-[0.2em] font-bold mt-2">
          Ma'lumotlaringizni qoldiring, biz 24 soat ichida javob beramiz
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 group">
              <Label htmlFor="name" className="text-[10px] uppercase tracking-widest font-black text-white/40 pl-1">Ism-familiya *</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#00d4ff] transition-colors" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="Ismingizni kiriting"
                  className={`bg-white/[0.03] border-white/5 rounded-2xl h-14 pl-11 focus:border-[#00d4ff]/40 transition-all text-white placeholder:text-white/10 ${fieldErrors.name ? "border-red-500/50" : ""}`}
                  required
                />
              </div>
              {fieldErrors.name && <p className="text-[10px] text-red-500 font-bold uppercase pl-1">{fieldErrors.name}</p>}
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest font-black text-white/40 pl-1">Telefon raqam *</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#00d4ff] transition-colors" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="+998 90 123 45 67"
                  className={`bg-white/[0.03] border-white/5 rounded-2xl h-14 pl-11 focus:border-[#00d4ff]/40 transition-all text-white placeholder:text-white/10 ${fieldErrors.phone ? "border-red-500/50" : ""}`}
                  required
                />
              </div>
              {fieldErrors.phone && <p className="text-[10px] text-red-500 font-bold uppercase pl-1">{fieldErrors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 group">
              <Label htmlFor="telegram" className="text-[10px] uppercase tracking-widest font-black text-white/40 pl-1">Telegram username</Label>
              <div className="relative">
                <SendHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#00d4ff] transition-colors" />
                <Input
                  id="telegram"
                  value={formData.telegram}
                  onChange={(e) => handleFieldChange('telegram', e.target.value)}
                  placeholder="@username"
                  className={`bg-white/[0.03] border-white/5 rounded-2xl h-14 pl-11 focus:border-[#00d4ff]/40 transition-all text-white placeholder:text-white/10 ${fieldErrors.telegram ? "border-red-500/50" : ""}`}
                />
              </div>
              {fieldErrors.telegram && <p className="text-[10px] text-red-500 font-bold uppercase pl-1">{fieldErrors.telegram}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service" className="text-[10px] uppercase tracking-widest font-black text-white/40 pl-1">Xizmat turi *</Label>
              <Select
                value={formData.service}
                onValueChange={(value) => handleFieldChange('service', value)}
              >
                <SelectTrigger className={`bg-white/[0.03] border-white/5 rounded-2xl h-14 focus:border-[#00d4ff]/40 transition-all text-white ${fieldErrors.service ? "border-red-500/50" : ""}`}>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-white/20" />
                    <SelectValue placeholder="Xizmatni tanlang" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#0f172a] border-white/10 text-white rounded-2xl backdrop-blur-3xl">
                  {services.map((service) => (
                    <SelectItem key={service} value={service} className="focus:bg-white/10 focus:text-[#00d4ff] rounded-xl my-1">
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.service && <p className="text-[10px] text-red-500 font-bold uppercase pl-1">{fieldErrors.service}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-[10px] uppercase tracking-widest font-black text-white/40 pl-1">Taxminiy byudjet</Label>
              <Select
                value={formData.budget}
                onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
              >
                <SelectTrigger className="bg-white/[0.03] border-white/5 rounded-2xl h-14 focus:border-[#00d4ff]/40 transition-all text-white">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-white/20" />
                    <SelectValue placeholder="Byudjetni tanlang" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#0f172a] border-white/10 text-white rounded-2xl backdrop-blur-3xl">
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range} className="focus:bg-white/10 focus:text-green-400 rounded-xl my-1">
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline" className="text-[10px] uppercase tracking-widest font-black text-white/40 pl-1">Kerakli muddat</Label>
              <Select
                value={formData.timeline}
                onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}
              >
                <SelectTrigger className="bg-white/[0.03] border-white/5 rounded-2xl h-14 focus:border-[#00d4ff]/40 transition-all text-white">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/20" />
                    <SelectValue placeholder="Muddatni tanlang" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#0f172a] border-white/10 text-white rounded-2xl backdrop-blur-3xl">
                  {timelines.map((timeline) => (
                    <SelectItem key={timeline} value={timeline} className="focus:bg-white/10 focus:text-blue-400 rounded-xl my-1">
                      {timeline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 group">
            <Label htmlFor="description" className="text-[10px] uppercase tracking-widest font-black text-white/40 pl-1">Qisqa tavsif</Label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-white/20 group-focus-within:text-[#00d4ff] transition-colors" />
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Loyihangiz haqida qisqacha ma'lumot bering..."
                rows={4}
                className="bg-white/[0.03] border-white/5 rounded-2xl pl-11 pt-4 focus:border-[#00d4ff]/40 transition-all text-white placeholder:text-white/10 resize-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full premium-crystal h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-[0_15px_30px_rgba(0,212,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group/btn disabled:text-white/40 text-white"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <div className="flex items-center gap-3">
                Ariza yuborish
                <Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </div>
            )}
            <div className="crystal-shine" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}