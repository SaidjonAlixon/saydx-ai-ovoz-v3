import ServiceCard from '../ServiceCard'
import { Bot } from "lucide-react";

export default function ServiceCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <ServiceCard
        title="Telegram Bot"
        description="Biznesingiz uchun maxsus Telegram bot yaratamiz. Buyurtma qabul qilish, to'lov va mijozlar bilan muloqot."
        price="500,000 so'mdan"
        duration="5-7 kun"
        rating={4.8}
        category="Avtomatlashtirish"
        icon={<Bot className="w-5 h-5" />}
        features={[
          "Buyurtma qabul qilish",
          "To'lov integratsiyasi",
          "Admin panel",
          "Mijozlar bazasi"
        ]}
      />
    </div>
  )
}