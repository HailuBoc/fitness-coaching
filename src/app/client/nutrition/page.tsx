'use client';

// Client Nutrition Plans Page
import { useEffect, useState } from 'react';
import { ClientLayout } from '@/components/layouts/ClientLayout';
import { nutritionApi } from '@/services/mockApi';
import type { NutritionPlan } from '@/types';
import { UtensilsCrossed, Clock } from 'lucide-react';

export default function ClientNutritionPage() {
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      // Simulate client ID - in real app, get from auth context
      const clientId = '1';
      const data = await nutritionApi.getAll(clientId);
      setPlans(data);
    } catch (error) {
      console.error('Failed to load nutrition plans:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Nutrition Plans
        </h1>

        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6"
          >
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
            </div>

            {/* Macros Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Calories
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {plan.calories}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Protein
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {plan.macros.protein}g
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Carbs
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {plan.macros.carbs}g
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Fats</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {plan.macros.fats}g
                </div>
              </div>
            </div>

            {/* Meals */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Daily Meals
              </h3>
              <div className="space-y-4">
                {plan.meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                          {meal.type}: {meal.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          {meal.time}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {meal.calories} cal
                      </div>
                    </div>

                    <div className="space-y-2">
                      {meal.foods.map((food) => (
                        <div
                          key={food.id}
                          className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded"
                        >
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {food.name}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                              ({food.quantity})
                            </span>
                          </div>
                          <div className="text-gray-600 dark:text-gray-300">
                            {food.calories} cal
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {plans.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <UtensilsCrossed className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No nutrition plans assigned yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}

