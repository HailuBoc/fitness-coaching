'use client';

// Client Workouts Page
import { useEffect, useState } from 'react';
import { ClientLayout } from '@/components/layouts/ClientLayout';
import { workoutApi } from '@/services/mockApi';
import type { Workout } from '@/types';
import { Clock, Play } from 'lucide-react';
import Link from 'next/link';

export default function ClientWorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      // Simulate client ID - in real app, get from auth context
      const clientId = '1';
      const data = await workoutApi.getAll(clientId);
      setWorkouts(data);
    } catch (error) {
      console.error('Failed to load workouts:', error);
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
          My Workouts
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workouts.map((workout) => (
            <Link
              key={workout.id}
              href={`/client/workouts/${workout.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {workout.name}
                </h2>
                {workout.videoUrl && (
                  <Play className="w-5 h-5 text-blue-500" />
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {workout.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {workout.duration} min
                </div>
                <div>{workout.exercises.length} exercises</div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Exercises Preview:
                </div>
                <div className="space-y-1">
                  {workout.exercises.slice(0, 3).map((exercise) => (
                    <div
                      key={exercise.id}
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      • {exercise.name} - {exercise.sets} sets × {exercise.reps}
                    </div>
                  ))}
                  {workout.exercises.length > 3 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      +{workout.exercises.length - 3} more exercises
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {workouts.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">
              No workouts assigned yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}

