'use client';

// Dashboard layout component for trainer admin
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  Calendar,
  BarChart3,
  UtensilsCrossed,
  Dumbbell,
  CreditCard,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { href: '/trainer/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/trainer/clients', label: 'Clients', icon: Users },
  { href: '/trainer/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/trainer/nutrition', label: 'Nutrition', icon: UtensilsCrossed },
  { href: '/trainer/bookings', label: 'Bookings', icon: Calendar },
  { href: '/trainer/payments', label: 'Payments', icon: CreditCard },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Fitness Coach
        </h1>
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

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-200 ease-in-out`}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Fitness Coach
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Trainer Dashboard
              </p>
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
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <ThemeToggle />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>

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

