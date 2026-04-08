import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";
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
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (defaultService) {
      setFormData(prev => ({ ...prev, service: defaultService }));
    }
  }, [defaultService]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.startsWith('998')) {
      const formatted = numbers.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
      return formatted;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    
    // Real-time validatsiya
    const error = validateField('phone', formatted);
    setFieldErrors(prev => ({ ...prev, phone: error }));
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Real-time validatsiya
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
        const phoneRegex = /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) return "To'g'ri telefon raqam kiriting (+998 90 123 45 67)";
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
    const errors: {[key: string]: string} = {};
    let isValid = true;

    // Majburiy maydonlarni tekshiramiz
    const nameError = validateField('name', formData.name);
    if (nameError) {
      errors.name = nameError;
      isValid = false;
    }

    const phoneError = validateField('phone', formData.phone);
    if (phoneError) {
      errors.phone = phoneError;
      isValid = false;
    }

    const serviceError = validateField('service', formData.service);
    if (serviceError) {
      errors.service = serviceError;
      isValid = false;
    }

    const telegramError = validateField('telegram', formData.telegram);
    if (telegramError) {
      errors.telegram = telegramError;
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Form validatsiyasini tekshiramiz
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // JSON formatida yuboramiz (FormData o'rniga)
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
      
      // Debug uchun ma'lumotlarni console'ga chiqaramiz
      console.log('Yuborilayotgan ma\'lumotlar:', requestData);
      
      console.log('Form yuborish jarayoni boshlanmoqda...');
      console.log('Request data:', requestData);
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const result = await response.json();
      console.log('Response result:', result);
      
      if (result.success) {
        toast({
          title: "Buyurtma qabul qilindi!",
          description: "Arizangiz ko'rib chiqilmoqda. Tez orada siz bilan bog'lanamiz. Rahmat!"
        });
        
        // Reset form
        setFormData({
          name: "",
          phone: "",
          telegram: "",
          service: defaultService || "",
          budget: "",
          timeline: "",
          description: ""
        });
      } else {
        console.error('Form yuborishda xatolik:', result);
        toast({
          title: "Xatolik!",
          description: result.message || "Arizani yuborishda xatolik yuz berdi",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Form yuborishda kutilmagan xatolik:', error);
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
    <Card className="w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <CardTitle>Tez Ariza Yuborish</CardTitle>
        <CardDescription>
          Ma'lumotlaringizni qoldiring, biz tez orada siz bilan bog'lanamiz
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Ism-familiya *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Ismingizni kiriting"
              data-testid="input-name"
              className={fieldErrors.name ? "border-red-500 focus:border-red-500" : ""}
              required
            />
            {fieldErrors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="text-red-500">⚠</span>
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon raqam *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="+998 90 123 45 67"
              data-testid="input-phone"
              className={fieldErrors.phone ? "border-red-500 focus:border-red-500" : ""}
              required
            />
            {fieldErrors.phone && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="text-red-500">⚠</span>
                {fieldErrors.phone}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram username</Label>
            <Input
              id="telegram"
              value={formData.telegram}
              onChange={(e) => handleFieldChange('telegram', e.target.value)}
              placeholder="@username"
              data-testid="input-telegram"
              className={fieldErrors.telegram ? "border-red-500 focus:border-red-500" : ""}
            />
            {fieldErrors.telegram && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="text-red-500">⚠</span>
                {fieldErrors.telegram}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Xizmat turi *</Label>
            <Select 
              value={formData.service} 
              onValueChange={(value) => handleFieldChange('service', value)}
            >
              <SelectTrigger 
                data-testid="select-service"
                className={fieldErrors.service ? "border-red-500 focus:border-red-500" : ""}
              >
                <SelectValue placeholder="Xizmatni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.service && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="text-red-500">⚠</span>
                {fieldErrors.service}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Taxminiy byudjet</Label>
            <Select 
              value={formData.budget} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
            >
              <SelectTrigger data-testid="select-budget">
                <SelectValue placeholder="Byudjetni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {budgetRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Kerakli muddat</Label>
            <Select 
              value={formData.timeline} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}
            >
              <SelectTrigger data-testid="select-timeline">
                <SelectValue placeholder="Muddatni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {timelines.map((timeline) => (
                  <SelectItem key={timeline} value={timeline}>
                    {timeline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Qisqa tavsif</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Loyihangiz haqida qisqacha ma'lumot bering..."
              rows={3}
              data-testid="textarea-description"
            />
          </div>


          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isFormValid || isSubmitting}
            data-testid="button-submit-lead"
          >
            {isSubmitting ? (
              <>Yuborilmoqda...</>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Ariza yuborish
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}