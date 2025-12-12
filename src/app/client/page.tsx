'use client';

// Client PWA Home Page
import { useEffect, useState } from 'react';
import { ClientLayout } from '@/components/layouts/ClientLayout';
import { workoutApi, nutritionApi } from '@/services/mockApi';
import type { Workout, NutritionPlan } from '@/types';
import { Dumbbell, UtensilsCrossed, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ClientHomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Simulate client ID - in real app, get from auth context
      const clientId = '1';
      const [workoutsData, plansData] = await Promise.all([
        workoutApi.getAll(clientId),
        nutritionApi.getAll(clientId),
      ]);
      setWorkouts(workoutsData);
      setNutritionPlans(plansData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your fitness overview for today
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-lg text-white">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Active Workouts
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {workouts.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-lg text-white">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nutrition Plans
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {nutritionPlans.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Workout */}
        {workouts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Today's Workout
              </h2>
              <Link
                href="/client/workouts"
                className="text-blue-600 dark:text-blue-400 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {workouts.slice(0, 1).map((workout) => (
                <Link
                  key={workout.id}
                  href={`/client/workouts/${workout.id}`}
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {workout.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {workout.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{workout.duration} min</span>
                    <span>{workout.exercises.length} exercises</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/client/workouts"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <Dumbbell className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Workouts
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View your training plans
            </p>
          </Link>

          <Link
            href="/client/nutrition"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <UtensilsCrossed className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Nutrition
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Check your meal plans
            </p>
          </Link>

          <Link
            href="/client/progress"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <TrendingUp className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Progress
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your journey
            </p>
          </Link>

          <Link
            href="/client/bookings"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <Calendar className="w-8 h-8 text-orange-500 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Bookings
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Schedule sessions
            </p>
          </Link>
        </div>
      </div>
    </ClientLayout>
  );
}

