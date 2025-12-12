'use client';

// Add New Client Page
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { clientApi } from '@/services/mockApi';
import { useForm } from 'react-hook-form';
import type { Client } from '@/types';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  plan: 'basic' | 'premium' | 'elite';
}

export default function NewClientPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>();

  const onSubmit = async (data: ClientFormData) => {
    setSubmitting(true);
    try {
      const newClient: Omit<Client, 'id'> = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        joinDate: new Date().toISOString().split('T')[0],
        status: data.status,
        subscription: {
          id: `sub${Date.now()}`,
          plan: data.plan,
          status: 'active',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
          ).toISOString().split('T')[0],
          price:
            data.plan === 'basic'
              ? 49.99
              : data.plan === 'premium'
              ? 99.99
              : 149.99,
        },
      };
      await clientApi.create(newClient);
      router.push('/trainer/clients');
    } catch (error) {
      console.error('Failed to create client:', error);
      alert('Failed to create client');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Add New Client
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name *
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone *
            </label>
            <input
              {...register('phone', { required: 'Phone is required' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subscription Plan *
            </label>
            <select
              {...register('plan', { required: 'Plan is required' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="basic">Basic ($49.99/mo)</option>
              <option value="premium">Premium ($99.99/mo)</option>
              <option value="elite">Elite ($149.99/mo)</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Client'}
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

