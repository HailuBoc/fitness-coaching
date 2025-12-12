'use client';

// Client PWA layout component
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  Bell,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { href: '/client', label: 'Home', icon: Home },
  { href: '/client/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/client/nutrition', label: 'Nutrition', icon: UtensilsCrossed },
  { href: '/client/progress', label: 'Progress', icon: TrendingUp },
];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Mobile header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          My Fitness
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // Simulate push notification
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('New workout assigned!', {
                  body: 'Check out your new training plan',
                  icon: '/icon-192x192.png',
                });
              }
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop header */}
      <header className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Fitness
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => {
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('New workout assigned!', {
                    body: 'Check out your new training plan',
                    icon: '/icon-192x192.png',
                  });
                }
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-200 ease-in-out`}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 lg:hidden">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Fitness
              </h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 w-full">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>

      {/* Bottom navigation for mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-3 px-4 flex-1 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

