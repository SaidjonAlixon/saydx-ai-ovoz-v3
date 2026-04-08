# SAYD.X Mobile-First Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern service platforms like Linear and Notion for clean interfaces, with mobile-first navigation patterns similar to Telegram and WhatsApp for familiar user experience in the Uzbek market.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Brand Primary: 220 85% 60% (modern blue for trust and technology)
- Dark Mode Primary: 220 75% 70% (lighter variant for dark backgrounds)

**Accent Colors:**
- Neon Accent: 160 85% 55% (subtle teal for interactive elements and success states)
- Warning: 35 90% 60% (orange for attention and CTAs)

**Neutrals:**
- Light Mode: 220 15% 98% (background), 220 10% 20% (text)
- Dark Mode: 220 15% 8% (background), 220 5% 90% (text)

**Gradient Usage:**
- Hero backgrounds with subtle 220 85% 60% to 160 85% 55% gradients
- Card overlays and navigation elements with gentle opacity transitions
- Background treatments using very subtle milliy pattern SVGs at low opacity

### B. Typography
**Primary Font:** Inter (Google Fonts CDN)
- Headlines: 700 weight for hero and section titles
- Body: 400 weight for general content
- Emphasis: 500 weight for navigation and CTAs

**Hierarchy:**
- Hero: text-4xl md:text-6xl font-bold
- Section Headers: text-2xl md:text-3xl font-bold  
- Body Text: text-base leading-relaxed
- Captions: text-sm text-opacity-70

### C. Layout System
**Spacing Primitives:** Using Tailwind units of 2, 4, 8, and 12
- Component padding: p-4 or p-8
- Section margins: mb-8 or mb-12
- Element spacing: gap-4 between items
- Container max-width: max-w-6xl with px-4 horizontal padding

**Grid System:**
- Mobile: Single column with full-width cards
- Tablet/Desktop: 2-3 column grids for services and portfolio

### D. Component Library

**Navigation:**
- Bottom tab bar with 5 fixed tabs (Bosh, Xizmatlar, Portfolio, Ariza, Ko'mak)
- 44px minimum touch targets with icon + label
- Active state with accent color and subtle background

**Cards & Surfaces:**
- Rounded corners: rounded-xl (12px)
- Subtle shadows: shadow-sm with increased shadow-lg on hover
- White/dark card backgrounds with border-opacity-10

**Interactive Elements:**
- Primary buttons: bg-primary with white text, rounded-lg, py-3 px-6
- Outline buttons on images: backdrop-blur-sm bg-white/10 border border-white/30
- Chip filters: rounded-full with toggle states
- Bottom sheets for forms and detailed content

**Calculators:**
- Step-by-step wizard layout with progress indicators
- Input groups with labels and tooltips
- Result cards showing pricing tiers (Minimal/Optimal/Max)
- Sticky CTA bar at bottom

**Forms:**
- Floating labels or clear placeholder text in Uzbek
- Phone number masking for +998 format
- File upload with drag-and-drop visual feedback
- Form validation with inline error messages

### E. Animations
**Minimal Animation Strategy:**
- Hero typewriter effect for main tagline
- Subtle fade-in animations for content sections (opacity transitions)
- Bottom sheet slide-up animations
- Loading states with simple spinners
- NO complex page transitions or heavy animations

## Special Considerations

**Uzbek Language Interface:**
- All UI text in Uzbek with proper typography support
- CTAs: "Ariza yuborish", "Tez taklif", "Telegram'da yozish"
- Number formatting for Uzbek locale (pricing display)

**Mobile-First Interactions:**
- Large touch targets (minimum 44px)
- Swipe gestures for carousels and content browsing
- Pull-to-refresh on service listings
- Thumb-friendly bottom navigation positioning

**Performance Considerations:**
- WebP images with lazy loading
- Critical CSS inlined for LCP optimization
- Service worker caching for PWA offline support
- Minimal JavaScript for Core Web Vitals compliance

## Images
**Hero Section:** Full-width hero image showcasing modern office/technology workspace, optimized for mobile viewing with gradient overlay for text readability.

**Service Cards:** Icon-based illustrations for each service type (Telegram bot, Web-site, etc.) using consistent style.

**Portfolio Section:** Project screenshots and case study images, optimized for mobile viewing with lazy loading.

**No large decorative images** - focus on functional imagery that supports the service-oriented content structure.