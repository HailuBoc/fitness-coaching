'use client';

// Trainer Bookings & Scheduling Page
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { bookingApi, clientApi } from '@/services/mockApi';
import type { Booking, Client } from '@/types';
import { Plus, Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

interface BookingFormData {
  clientId: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'training' | 'check-in';
  notes?: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsData, clientsData] = await Promise.all([
        bookingApi.getAll(),
        clientApi.getAll(),
      ]);
      setBookings(bookingsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      await bookingApi.create({
        ...data,
        trainerId: 'trainer1',
        status: 'scheduled',
      });
      reset();
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Failed to create booking');
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Unknown';
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
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
            Bookings & Scheduling
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Booking
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Create New Booking
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client *
                  </label>
                  <select
                    {...register('clientId', { required: 'Client is required' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  {errors.clientId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.clientId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type *
                  </label>
                  <select
                    {...register('type', { required: 'Type is required' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="training">Training</option>
                    <option value="check-in">Check-in</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    {...register('date', { required: 'Date is required' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    {...register('time', { required: 'Time is required' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.time.message}
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
                      min: 15,
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
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Booking
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    reset();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(booking.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                      {booking.type}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getClientName(booking.clientId)}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(booking.date), 'MMM dd, yyyy')}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  {booking.time} ({booking.duration} min)
                </div>
              </div>

              {booking.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-200 dark:border-gray-700">
                  {booking.notes}
                </p>
              )}
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No bookings yet. Create your first booking!
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

