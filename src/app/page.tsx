"use client";

// Landing Page - Choose between Trainer Dashboard or Client PWA
import Link from "next/link";
import { Dumbbell, Users, ArrowRight } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Fitness Coach
            </h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Fitness Coaching Platform
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Complete solution for trainers and clients. Manage workouts,
            nutrition plans, track progress, and more.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Trainer Dashboard */}
          <Link
            href="/trainer/dashboard"
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Trainer Dashboard
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Manage clients, create workouts and nutrition plans, track
              analytics, handle bookings and payments.
            </p>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-4 transition-all">
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>

          {/* Client PWA */}
          <Link
            href="/client"
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                <Dumbbell className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Client App
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              View workouts, meal plans, track your progress, and submit
              check-ins. Works offline!
            </p>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold group-hover:gap-4 transition-all">
              Open Client App
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📊
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              Analytics Dashboard
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track client growth and revenue with interactive charts
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📱
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              Progressive Web App
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Works offline with push notifications
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🎯
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              Complete Solution
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Workouts, nutrition, bookings, and payments all in one
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
