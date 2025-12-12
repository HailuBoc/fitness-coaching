'use client';

// Client Workout Detail Page with Video Player
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ClientLayout } from '@/components/layouts/ClientLayout';
import { workoutApi } from '@/services/mockApi';
import type { Workout } from '@/types';
import { Clock, Play, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { VideoPlayer } from '@/components/VideoPlayer';

export default function WorkoutDetailPage() {
  const params = useParams();
  const workoutId = params.id as string;
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (workoutId) {
      loadWorkout();
    }
  }, [workoutId]);

  const loadWorkout = async () => {
    try {
      const data = await workoutApi.getById(workoutId);
      setWorkout(data);
    } catch (error) {
      console.error('Failed to load workout:', error);
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

  if (!workout) {
    return (
      <ClientLayout>
        <div className="text-red-500">Workout not found</div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-6">
        <Link
          href="/client/workouts"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Workouts
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {workout.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{workout.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {workout.duration} minutes
            </div>
            <div>{workout.exercises.length} exercises</div>
          </div>
        </div>

        {/* Video Player for Workout Demo */}
        {workout.videoUrl && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Workout Demo Video
            </h2>
            <VideoPlayer src={workout.videoUrl} />
          </div>
        )}

        {/* Exercises List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Exercises
          </h2>
          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {index + 1}. {exercise.name}
                    </h3>
                    {exercise.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {exercise.notes}
                      </p>
                    )}
                  </div>
                  {exercise.videoUrl && (
                    <VideoPlayer src={exercise.videoUrl} compact />
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Sets</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {exercise.sets}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Reps</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {exercise.reps}
                    </div>
                  </div>
                  {exercise.weight && (
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Weight</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {exercise.weight} lbs
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Rest</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {exercise.restTime}s
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

