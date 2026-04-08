import NewsCard from '../NewsCard'
import heroImage from "@assets/generated_images/Modern_tech_workspace_hero_c9c8682e.png";

export default function NewsCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <NewsCard
        title="2025-yilda biznes uchun eng muhim tehnologiya trendlari"
        excerpt="Yangi yilda biznes jarayonlarini avtomatlashtirish va raqamlashtirish bo'yicha eng so'nggi tendentsiyalar."
        category="Tehnologiya"
        date="2 dekabr"
        readTime="5"
        views={142}
        image={heroImage}
      />
    </div>
  )
}