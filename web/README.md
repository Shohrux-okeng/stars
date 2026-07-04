# Stars Premium - Web Dashboard

A beautiful, modern web application for the Telegram Stars premium rewards platform. Built with Next.js 16, TypeScript, and Tailwind CSS v4 with a stunning dark theme and glass-morphism design.

## Features

✨ **Premium Design System**
- Dark theme with purple-to-pink gradient aesthetic
- Glass-morphism UI components with backdrop blur
- Animated starfield background
- Fully responsive mobile-first design
- Smooth animations and transitions

📱 **Pages**
- **Home/Dashboard** - Balance display, quick actions, referral info, statistics
- **Leaderboard** - Top sellers/buyers ranked by earnings with medals
- **Shop** - Browse and purchase premium items with cart functionality
- **Premium** - Subscription plans with feature comparison and FAQ
- **Profile** - User info, statistics, settings, and logout

🎯 **Interactive Features**
- Add funds modal with smooth animations
- Shopping cart with real-time calculations
- Modal overlays with backdrop blur effects
- Premium subscription plans (3 tiers)
- Referral system display with copy link
- Transaction history and user rankings
- Mobile bottom navigation + Desktop header
- Fully responsive adaptive layouts

## Getting Started

### Installation

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install
# or with other package managers
pnpm install
yarn install
bun install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The page auto-updates as you edit files.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

- `app/page.tsx` - Home dashboard with balance and quick actions
- `app/leaderboard/page.tsx` - Seller rankings with medals
- `app/shop/page.tsx` - Product grid with shopping cart
- `app/premium/page.tsx` - Pricing plans and FAQ
- `app/profile/page.tsx` - User profile and settings
- `app/globals.css` - Design system and theme colors
- `components/header.tsx` - Desktop navigation
- `components/bottom-nav.tsx` - Mobile bottom navigation
- `components/page-container.tsx` - Layout wrapper

## Design Colors

- **Primary**: Purple (#8b5cf6) to Pink (#ec4899) gradients
- **Accents**: Cyan (#06b6d4), Green (#10b981), Orange (#f59e0b), Red (#ef4444)
- **Background**: Dark navy (#0f0a1a)
- **Text**: Light gray (#f1f5f9) for contrast

## Customization

### Change Colors
Edit `app/globals.css` `:root` variables

### Connect to Backend
Use SWR or React Query to fetch from APIs instead of hardcoded data

### Add Pages
Create new directories in `app/` with `page.tsx` files

## Deploy on Vercel

The easiest way to deploy is using [Vercel Platform](https://vercel.com/new):

```bash
# Connect your GitHub repository and Vercel auto-deploys
```

Manual deployment requires Node.js 18+:
```bash
npm run build && npm start
```

## Browser Support

Chrome/Edge 90+, Firefox 88+, Safari 14+, Mobile browsers (iOS 14+, Android 5+)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

Built with ❤️ for the Telegram Stars community
