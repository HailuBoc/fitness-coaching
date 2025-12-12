'use client';

// Edit Client Page
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>();

  useEffect(() => {
    const loadClient = async () => {
      try {
        const data = await clientApi.getById(clientId);
        if (data) {
          setClient(data);
          reset({
            name: data.name,
            email: data.email,
            phone: data.phone,
            status: data.status,
            plan: data.subscription.plan,
          });
        }
      } catch (error) {
        console.error('Failed to load client:', error);
      } finally {
        setLoading(false);
      }
    };
    if (clientId) {
      loadClient();
    }
  }, [clientId, reset]);

  const onSubmit = async (data: ClientFormData) => {
    if (!client) return;
    setSubmitting(true);
    try {
      await clientApi.update(clientId, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        subscription: {
          ...client.subscription,
          plan: data.plan,
          price:
            data.plan === 'basic'
              ? 49.99
              : data.plan === 'premium'
              ? 99.99
              : 149.99,
        },
      });
      router.push('/trainer/clients');
    } catch (error) {
      console.error('Failed to update client:', error);
      alert('Failed to update client');
    } finally {
      setSubmitting(false);
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

  if (!client) {
    return (
      <DashboardLayout>
        <div className="text-red-500">Client not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Client
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
              {submitting ? 'Updating...' : 'Update Client'}
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

