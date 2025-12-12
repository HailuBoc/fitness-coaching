'use client';

// Client Progress Check-ins Page with Form and Visualization
import { useEffect, useState } from 'react';
import { ClientLayout } from '@/components/layouts/ClientLayout';
import { progressApi } from '@/services/mockApi';
import { useForm } from 'react-hook-form';
import type { ProgressCheckIn } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Scale } from 'lucide-react';

interface ProgressFormData {
  weight: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
}

export default function ClientProgressPage() {
  const [checkIns, setCheckIns] = useState<ProgressCheckIn[]>([]);
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProgressFormData>();

  useEffect(() => {
    loadCheckIns();
  }, []);

  const loadCheckIns = async () => {
    try {
      // Simulate client ID - in real app, get from auth context
      const clientId = '1';
      const data = await progressApi.getAll(clientId);
      setCheckIns(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } catch (error) {
      console.error('Failed to load check-ins:', error);
    }
  };

  const onSubmit = async (data: ProgressFormData) => {
    try {
      await progressApi.create({
        clientId: '1',
        date: new Date().toISOString().split('T')[0],
        weight: data.weight,
        bodyFat: data.bodyFat,
        measurements: {
          chest: data.chest,
          waist: data.waist,
          hips: data.hips,
          arms: data.arms,
          thighs: data.thighs,
        },
        notes: data.notes,
      });
      reset();
      setShowForm(false);
      loadCheckIns();
    } catch (error) {
      console.error('Failed to create check-in:', error);
      alert('Failed to submit check-in');
    }
  };

  // Prepare chart data
  const chartData = checkIns.map((checkIn) => ({
    date: new Date(checkIn.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    weight: checkIn.weight,
    bodyFat: checkIn.bodyFat || 0,
  }));

  const measurementsData = checkIns.map((checkIn) => ({
    date: new Date(checkIn.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    chest: checkIn.measurements.chest || 0,
    waist: checkIn.measurements.waist || 0,
    hips: checkIn.measurements.hips || 0,
    arms: checkIn.measurements.arms || 0,
    thighs: checkIn.measurements.thighs || 0,
  }));

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Progress Tracking
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : 'New Check-in'}
          </button>
        </div>

        {/* Check-in Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Submit Progress Check-in
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (lbs) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('weight', {
                      required: 'Weight is required',
                      min: { value: 0, message: 'Weight must be positive' },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.weight && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.weight.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Body Fat (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('bodyFat', { min: 0, max: 100 })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Body Measurements (inches)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Chest
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('chest', { min: 0 })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Waist
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('waist', { min: 0 })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Hips
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('hips', { min: 0 })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Arms
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('arms', { min: 0 })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Thighs
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('thighs', { min: 0 })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="How are you feeling? Any challenges or wins?"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Check-in
              </button>
            </form>
          </div>
        )}

        {/* Charts */}
        {checkIns.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Weight & Body Fat
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Weight (lbs)"
                  />
                  <Line
                    type="monotone"
                    dataKey="bodyFat"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Body Fat (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Body Measurements
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={measurementsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="chest"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Chest"
                  />
                  <Line
                    type="monotone"
                    dataKey="waist"
                    stroke="#ec4899"
                    strokeWidth={2}
                    name="Waist"
                  />
                  <Line
                    type="monotone"
                    dataKey="hips"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Hips"
                  />
                  <Line
                    type="monotone"
                    dataKey="arms"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Arms"
                  />
                  <Line
                    type="monotone"
                    dataKey="thighs"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Thighs"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Check-in History */}
        {checkIns.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Check-in History
            </h2>
            <div className="space-y-4">
              {checkIns.map((checkIn) => (
                <div
                  key={checkIn.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {new Date(checkIn.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {checkIn.weight} lbs
                    </div>
                  </div>
                  {checkIn.bodyFat && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Body Fat: {checkIn.bodyFat}%
                    </div>
                  )}
                  {checkIn.measurements && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-gray-600 dark:text-gray-400">
                      {checkIn.measurements.chest && (
                        <div>Chest: {checkIn.measurements.chest}"</div>
                      )}
                      {checkIn.measurements.waist && (
                        <div>Waist: {checkIn.measurements.waist}"</div>
                      )}
                      {checkIn.measurements.hips && (
                        <div>Hips: {checkIn.measurements.hips}"</div>
                      )}
                      {checkIn.measurements.arms && (
                        <div>Arms: {checkIn.measurements.arms}"</div>
                      )}
                      {checkIn.measurements.thighs && (
                        <div>Thighs: {checkIn.measurements.thighs}"</div>
                      )}
                    </div>
                  )}
                  {checkIn.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                      {checkIn.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {checkIns.length === 0 && !showForm && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No progress check-ins yet. Start tracking your journey!
            </p>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}

