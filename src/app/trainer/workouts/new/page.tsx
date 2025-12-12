'use client';

// Create New Workout Page
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { workoutApi, clientApi } from '@/services/mockApi';
import { useForm, useFieldArray } from 'react-hook-form';
import type { Client, Exercise } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

interface WorkoutFormData {
  name: string;
  description: string;
  duration: number;
  clientId: string;
  exercises: Omit<Exercise, 'id'>[];
}

export default function NewWorkoutPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<WorkoutFormData>({
    defaultValues: {
      exercises: [{ name: '', sets: 3, reps: '10', restTime: 60 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exercises',
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

  const onSubmit = async (data: WorkoutFormData) => {
    setSubmitting(true);
    try {
      await workoutApi.create({
        name: data.name,
        description: data.description,
        duration: data.duration,
        clientId: data.clientId || undefined,
        exercises: data.exercises.map((ex, idx) => ({
          ...ex,
          id: `e${Date.now()}-${idx}`,
        })),
      });
      router.push('/trainer/workouts');
    } catch (error) {
      console.error('Failed to create workout:', error);
      alert('Failed to create workout');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Workout
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Workout Name *
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
                Duration (minutes) *
              </label>
              <input
                type="number"
                {...register('duration', {
                  required: 'Duration is required',
                  min: { value: 1, message: 'Must be at least 1 minute' },
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.duration.message}
                </p>
              )}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assign to Client (optional)
            </label>
            <select
              {...register('clientId')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">General Workout</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Exercises *
              </label>
              <button
                type="button"
                onClick={() =>
                  append({ name: '', sets: 3, reps: '10', restTime: 60 })
                }
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Exercise
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Exercise {index + 1}
                    </h4>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Name *
                      </label>
                      <input
                        {...register(`exercises.${index}.name`, {
                          required: 'Exercise name is required',
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Bench Press"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Sets *
                      </label>
                      <input
                        type="number"
                        {...register(`exercises.${index}.sets`, {
                          required: 'Sets is required',
                          min: 1,
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Reps *
                      </label>
                      <input
                        {...register(`exercises.${index}.reps`, {
                          required: 'Reps is required',
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="10-12"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Rest (sec) *
                      </label>
                      <input
                        type="number"
                        {...register(`exercises.${index}.restTime`, {
                          required: 'Rest time is required',
                          min: 0,
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
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
              {submitting ? 'Creating...' : 'Create Workout'}
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

