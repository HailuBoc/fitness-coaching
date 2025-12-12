'use client';

// Create New Nutrition Plan Page
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { nutritionApi, clientApi } from '@/services/mockApi';
import { useForm, useFieldArray } from 'react-hook-form';
import type { Client, Meal, Food } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

interface NutritionFormData {
  name: string;
  description: string;
  clientId: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: Omit<Meal, 'id'>[];
}

export default function NewNutritionPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<NutritionFormData>({
    defaultValues: {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fats: 70,
      meals: [
        {
          name: 'Breakfast',
          type: 'breakfast',
          time: '08:00',
          calories: 500,
          foods: [{ name: '', quantity: '', calories: 0, protein: 0, carbs: 0, fats: 0 }],
        },
      ],
    },
  });

  const {
    fields: mealFields,
    append: appendMeal,
    remove: removeMeal,
  } = useFieldArray({
    control,
    name: 'meals',
  });

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await clientApi.getAll();
        setClients(data);
      } catch (error) {
        console.error('Failed to load clients:', error);
      }
    };
    loadClients();
  }, []);

  const onSubmit = async (data: NutritionFormData) => {
    setSubmitting(true);
    try {
      await nutritionApi.create({
        name: data.name,
        description: data.description,
        clientId: data.clientId || undefined,
        calories: data.calories,
        macros: {
          protein: data.protein,
          carbs: data.carbs,
          fats: data.fats,
        },
        meals: data.meals.map((meal, mealIdx) => ({
          ...meal,
          id: `m${Date.now()}-${mealIdx}`,
          foods: meal.foods.map((food, foodIdx) => ({
            ...food,
            id: `f${Date.now()}-${mealIdx}-${foodIdx}`,
          })),
        })),
      });
      router.push('/trainer/nutrition');
    } catch (error) {
      console.error('Failed to create nutrition plan:', error);
      alert('Failed to create nutrition plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Nutrition Plan
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Plan Name *
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assign to Client (optional)
              </label>
              <select
                {...register('clientId')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">General Plan</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Calories *
              </label>
              <input
                type="number"
                {...register('calories', { required: true, min: 0 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Protein (g) *
              </label>
              <input
                type="number"
                {...register('protein', { required: true, min: 0 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Carbs (g) *
              </label>
              <input
                type="number"
                {...register('carbs', { required: true, min: 0 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Fats (g) *
              </label>
              <input
                type="number"
                {...register('fats', { required: true, min: 0 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Meals *
              </label>
              <button
                type="button"
                onClick={() =>
                  appendMeal({
                    name: '',
                    type: 'breakfast',
                    time: '12:00',
                    calories: 0,
                    foods: [{ name: '', quantity: '', calories: 0, protein: 0, carbs: 0, fats: 0 }],
                  })
                }
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Meal
              </button>
            </div>

            <div className="space-y-4">
              {mealFields.map((mealField, mealIndex) => (
                <div
                  key={mealField.id}
                  className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Meal {mealIndex + 1}
                    </h4>
                    {mealFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMeal(mealIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Meal Name *
                      </label>
                      <input
                        {...register(`meals.${mealIndex}.name`, {
                          required: 'Meal name is required',
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Breakfast"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Type *
                      </label>
                      <select
                        {...register(`meals.${mealIndex}.type`, {
                          required: true,
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Time *
                      </label>
                      <input
                        type="time"
                        {...register(`meals.${mealIndex}.time`, {
                          required: true,
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Calories *
                      </label>
                      <input
                        type="number"
                        {...register(`meals.${mealIndex}.calories`, {
                          required: true,
                          min: 0,
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Foods:
                    </div>
                    <div className="space-y-2">
                      {mealField.foods?.map((food: Food, foodIndex: number) => (
                        <div
                          key={foodIndex}
                          className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                        >
                          <input
                            {...register(
                              `meals.${mealIndex}.foods.${foodIndex}.name`
                            )}
                            placeholder="Food name"
                            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <input
                            {...register(
                              `meals.${mealIndex}.foods.${foodIndex}.quantity`
                            )}
                            placeholder="Quantity"
                            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <input
                            type="number"
                            {...register(
                              `meals.${mealIndex}.foods.${foodIndex}.calories`,
                              { valueAsNumber: true }
                            )}
                            placeholder="Calories"
                            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Plan'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

