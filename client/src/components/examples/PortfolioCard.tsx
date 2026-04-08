import PortfolioCard from '../PortfolioCard'
import { TrendingUp, Users, DollarSign } from "lucide-react";
import mobileApp from "@assets/generated_images/Mobile_app_interface_mockup_5376ed7a.png";

export default function PortfolioCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <PortfolioCard
        title="Yetkazib berish boti"
        description="Restoran uchun telegram bot orqali buyurtma qabul qilish va yetkazib berish tizimi."
        category="Telegram Bot"
        technologies={["Node.js", "Telegram API", "PostgreSQL", "Payment API"]}
        results={[
          {
            metric: "Buyurtmalar",
            value: "+250%",
            icon: <TrendingUp className="w-4 h-4 text-green-500" />
          },
          {
            metric: "Mijozlar",
            value: "1,200+",
            icon: <Users className="w-4 h-4 text-blue-500" />
          },
          {
            metric: "Daromad",
            value: "+180%",
            icon: <DollarSign className="w-4 h-4 text-yellow-500" />
          }
        ]}
        image={mobileApp}
        duration="7 kun"
      />
    </div>
  )
}