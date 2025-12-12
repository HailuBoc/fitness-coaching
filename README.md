# Fitness Coaching Platform

A comprehensive Next.js 14+ application with TypeScript and Tailwind CSS for fitness coaching. Includes a trainer admin dashboard and a client Progressive Web App (PWA).

## Features

### Trainer Admin Dashboard
- **Client Management**: Full CRUD operations for managing clients
- **Workout Builder**: Create and manage workout plans with exercises
- **Nutrition Planner**: Build comprehensive nutrition plans with meals and macros
- **Analytics Dashboard**: Interactive charts showing client growth and revenue
- **Booking & Scheduling**: Manage appointments and training sessions
- **Payment Management**: Track subscriptions and payments

### Client PWA
- **Workout Viewer**: View assigned workouts with exercise details
- **Nutrition Plans**: Access meal plans with macro breakdowns
- **Progress Tracking**: Submit check-ins with weight, body fat, and measurements
- **Data Visualization**: Charts showing progress over time
- **Video Player**: Watch exercise demonstration videos
- **Offline Support**: Service worker for offline functionality
- **Push Notifications**: Browser notifications for updates

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with dark/light theme support
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with validation
- **Icons**: Lucide React
- **PWA**: Service Workers and Web App Manifest

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── client/            # Client PWA pages
│   ├── trainer/            # Trainer dashboard pages
│   ├── layout.tsx          # Root layout with theme provider
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── layouts/            # Layout components
│   └── ...
├── contexts/               # React contexts (Theme)
├── hooks/                  # Custom React hooks
├── services/               # API services (mock)
├── types/                  # TypeScript type definitions
└── styles/                 # Global styles

public/
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
└── icons/                  # PWA icons
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Landing Page
Visit `/` to choose between:
- **Trainer Dashboard**: `/trainer/dashboard`
- **Client PWA**: `/client`

### Trainer Dashboard Routes
- `/trainer/dashboard` - Analytics overview
- `/trainer/clients` - Client management
- `/trainer/clients/new` - Add new client
- `/trainer/clients/[id]/edit` - Edit client
- `/trainer/workouts` - Workout management
- `/trainer/workouts/new` - Create workout
- `/trainer/nutrition` - Nutrition plan management
- `/trainer/nutrition/new` - Create nutrition plan
- `/trainer/bookings` - Booking & scheduling
- `/trainer/payments` - Payment management

### Client PWA Routes
- `/client` - Home dashboard
- `/client/workouts` - View workouts
- `/client/workouts/[id]` - Workout details with video
- `/client/nutrition` - View nutrition plans
- `/client/progress` - Progress tracking and check-ins

## PWA Features

### Install as App
The app can be installed as a Progressive Web App. Look for the install prompt or use the install button.

### Offline Support
Service worker caches essential resources for offline access.

### Push Notifications
The app supports browser push notifications (simulated in this version).

## Theme Support

The app includes dark/light mode toggle. Theme preference is saved in localStorage.

## Mock Data

The application uses mock API services located in `src/services/mockApi.ts`. In production, replace these with actual API endpoints.

## Development Notes

- All forms use React Hook Form for validation
- Charts use Recharts library
- Mobile-first responsive design with Tailwind CSS
- TypeScript types defined in `src/types/index.ts`
- Service worker handles offline caching and push notifications

## Future Enhancements

- Real API integration
- Authentication & authorization
- WebSocket for real-time updates
- File upload for progress photos
- Advanced analytics
- Wearable device data integration

## License

MIT
