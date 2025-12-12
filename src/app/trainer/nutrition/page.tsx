'use client';

// Trainer Nutrition Plans Management Page
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { nutritionApi, clientApi } from '@/services/mockApi';
import type { NutritionPlan, Client } from '@/types';
import { Plus, Edit, Trash2, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

export default function NutritionPage() {
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansData, clientsData] = await Promise.all([
        nutritionApi.getAll(),
        clientApi.getAll(),
      ]);
      setPlans(plansData);
      setClients(clientsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this nutrition plan?')) {
      try {
        await nutritionApi.delete(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete plan:', error);
        alert('Failed to delete nutrition plan');
      }
    }
  };

  const getClientName = (clientId?: string) => {
    if (!clientId) return 'General';
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Unknown';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Nutrition Plans
          </h1>
          <Link
            href="/trainer/nutrition/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Plan
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {getClientName(plan.clientId)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/trainer/nutrition/${plan.id}/edit`}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {plan.description}
              </p>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <UtensilsCrossed className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {plan.calories} cal/day
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Protein</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {plan.macros.protein}g
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Carbs</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {plan.macros.carbs}g
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Fats</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {plan.macros.fats}g
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {plan.meals.length} meals
                </div>
              </div>
            </div>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No nutrition plans yet. Create your first plan!
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

