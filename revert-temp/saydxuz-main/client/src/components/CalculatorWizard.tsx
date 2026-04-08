import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Calculator, Download, Send } from "lucide-react";

interface CalculatorStep {
  id: string;
  title: string;
  description: string;
  type: "radio" | "checkbox" | "result";
  options?: { id: string; label: string; price: number }[];
}

const calculatorSteps: CalculatorStep[] = [
  {
    id: "service-type",
    title: "Xizmat turini tanlang",
    description: "Qaysi xizmat sizga kerak?",
    type: "radio",
    options: [
      { id: "telegram-bot", label: "Telegram Bot", price: 500000 },
      { id: "website", label: "Veb-sayt", price: 800000 },
      { id: "sheets", label: "Sheets Avtomatlashtirish", price: 300000 },
      { id: "ui-ux", label: "UI/UX Dizayn", price: 600000 },
      { id: "mini-app", label: "Mini-ilova", price: 400000 },
      { id: "ads", label: "Target Reklama", price: 200000 }
    ]
  },
  {
    id: "features",
    title: "Qo'shimcha imkoniyatlar",
    description: "Qaysi qo'shimcha funksiyalar kerak?",
    type: "checkbox",
    options: [
      { id: "admin-panel", label: "Admin Panel", price: 150000 },
      { id: "payment", label: "To'lov integratsiyasi", price: 200000 },
      { id: "analytics", label: "Analitika", price: 100000 },
      { id: "api", label: "API integratsiya", price: 180000 },
      { id: "seo", label: "SEO optimizatsiya", price: 120000 }
    ]
  },
  {
    id: "timeline",
    title: "Muddat va afzallik",
    description: "Qachon kerak va qanday sifat?",
    type: "radio",
    options: [
      { id: "standard", label: "Standart (2-3 hafta)", price: 0 },
      { id: "fast", label: "Tez (1-2 hafta)", price: 300000 },
      { id: "premium", label: "Premium sifat", price: 500000 }
    ]
  },
  {
    id: "result",
    title: "Taxminiy narx",
    description: "Sizning loyihangiz uchun narx hisoblash",
    type: "result"
  }
];

export default function CalculatorWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});

  const handleNext = () => {
    if (currentStep < calculatorSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRadioChange = (stepId: string, value: string) => {
    setSelections(prev => ({ ...prev, [stepId]: value }));
  };

  const handleCheckboxChange = (stepId: string, optionId: string, checked: boolean) => {
    setSelections(prev => {
      const currentSelections = (prev[stepId] as string[]) || [];
      if (checked) {
        return { ...prev, [stepId]: [...currentSelections, optionId] };
      } else {
        return { ...prev, [stepId]: currentSelections.filter(id => id !== optionId) };
      }
    });
  };

  const calculatePrice = () => {
    let total = 0;
    
    // Base service price
    const serviceType = selections["service-type"] as string;
    if (serviceType) {
      const service = calculatorSteps[0].options?.find(opt => opt.id === serviceType);
      total += service?.price || 0;
    }
    
    // Additional features
    const features = selections["features"] as string[];
    if (features) {
      features.forEach(featureId => {
        const feature = calculatorSteps[1].options?.find(opt => opt.id === featureId);
        total += feature?.price || 0;
      });
    }
    
    // Timeline modifier
    const timeline = selections["timeline"] as string;
    if (timeline) {
      const timelineOption = calculatorSteps[2].options?.find(opt => opt.id === timeline);
      total += timelineOption?.price || 0;
    }
    
    return total;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
  };

  const step = calculatorSteps[currentStep];
  const isLastStep = currentStep === calculatorSteps.length - 1;
  const canProceed = selections[step.id] && 
    (step.type !== "checkbox" || (selections[step.id] as string[])?.length > 0);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              {step.title}
            </CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </div>
          <Badge variant="outline">
            {currentStep + 1} / {calculatorSteps.length}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {step.type === "radio" && (
          <RadioGroup 
            value={selections[step.id] as string || ""} 
            onValueChange={(value) => handleRadioChange(step.id, value)}
          >
            {step.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg border hover-elevate">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span>{option.label}</span>
                    <span className="font-semibold text-primary">
                      {option.price > 0 ? `+${formatPrice(option.price)}` : "Asosiy"}
                    </span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
        
        {step.type === "checkbox" && (
          <div className="space-y-3">
            {step.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg border hover-elevate">
                <Checkbox 
                  id={option.id}
                  checked={(selections[step.id] as string[])?.includes(option.id) || false}
                  onCheckedChange={(checked) => handleCheckboxChange(step.id, option.id, checked as boolean)}
                />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span>{option.label}</span>
                    <span className="font-semibold text-primary">+{formatPrice(option.price)}</span>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        )}
        
        {step.type === "result" && (
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">Taxminiy narx</h3>
              <p className="text-4xl font-bold text-primary mb-2">{formatPrice(calculatePrice())}</p>
              <p className="text-sm text-muted-foreground">
                Aniq narx loyiha murakkabligiga qarab o'zgarishi mumkin
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="w-full"
                data-testid="button-download-estimate"
                onClick={() => console.log("Download PDF triggered")}
              >
                <Download className="w-4 h-4 mr-2" />
                PDF yuklab olish
              </Button>
              <Button 
                className="w-full"
                data-testid="button-send-request"
                onClick={() => console.log("Send request triggered")}
              >
                <Send className="w-4 h-4 mr-2" />
                Ariza yuborish
              </Button>
            </div>
          </div>
        )}
        
        {!isLastStep && (
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handlePrev} 
              disabled={currentStep === 0}
              data-testid="button-prev-step"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Orqaga
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!canProceed}
              data-testid="button-next-step"
            >
              Keyingi
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}