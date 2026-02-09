# Atlas Onboarding MVP

Premium credit card and concierge membership onboarding flow.

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: use `nvm` or `fnm`)
- npm, pnpm, or yarn

### Installation

```bash
cd atlas-onboarding
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

## Testing the Flow

### Invite Verification (Step 1)
- Enter any 10-digit phone number to proceed (stub accepts all valid phone formats)
- Numbers starting with `555` are explicitly allowed for testing

### OTP Verification (Step 2)
- Use code `1234` to verify

### Application Form (Step 4)
- Fill out all required fields
- Bank connection is stubbed (click "Connect with Plaid" to simulate)

### Credit Check (Step 5)
- Approve the credit check authorization
- Submit to proceed (always approves in MVP)

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** with custom Atlas theme
- **Framer Motion** for animations
- **React Hook Form** + **Zod** for form validation
- **Zustand** for state management

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   └── steps/        # Step-specific components
├── lib/
│   ├── store.ts      # Zustand state management
│   ├── utils.ts      # Utility functions
│   └── validation.ts # Zod schemas
├── types/
│   └── application.ts # TypeScript types
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Design System

### Colors
- **Background:** `#0A0A0A` (near-black)
- **Text:** `#F0F0EC` (off-white)
- **Secondary text:** `#9A9A9A` (medium gray)
- **Accent:** `#2A52BE` (royal blue)
- **Error:** `#C94040` (muted red)
- **Silver/Logo:** `#C0C0C0`

### Typography
- Font: Inter
- Body: 16-18px
- Headings: 24-40px
- Minimum touch targets: 48px
