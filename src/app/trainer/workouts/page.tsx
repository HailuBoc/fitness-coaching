'use client';

// Trainer Workouts Management Page
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { workoutApi, clientApi } from '@/services/mockApi';
import type { Workout, Client } from '@/types';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [workoutsData, clientsData] = await Promise.all([
        workoutApi.getAll(),
        clientApi.getAll(),
      ]);
      setWorkouts(workoutsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      try {
        await workoutApi.delete(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete workout:', error);
        alert('Failed to delete workout');
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
            Workouts
          </h1>
          <Link
            href="/trainer/workouts/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Workout
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {workout.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {getClientName(workout.clientId)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/trainer/workouts/${workout.id}/edit`}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(workout.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {workout.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {workout.duration} min
                </div>
                <div>{workout.exercises.length} exercises</div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Exercises:
                </div>
                <div className="space-y-1">
                  {workout.exercises.slice(0, 3).map((exercise) => (
                    <div
                      key={exercise.id}
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      • {exercise.name} ({exercise.sets} sets × {exercise.reps})
                    </div>
                  ))}
                  {workout.exercises.length > 3 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      +{workout.exercises.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {workouts.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No workouts yet. Create your first workout!
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

