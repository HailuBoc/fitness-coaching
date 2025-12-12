// Mock API service for the fitness coaching platform
// In production, these would be replaced with actual API calls

import type {
  Client,
  Workout,
  NutritionPlan,
  ProgressCheckIn,
  Booking,
  Payment,
  Analytics,
  Exercise,
  Meal,
} from '@/types';

// Mock data storage (simulates database)
let clients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    joinDate: '2024-01-15',
    status: 'active',
    subscription: {
      id: 'sub1',
      plan: 'premium',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      price: 99.99,
    },
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    joinDate: '2024-02-01',
    status: 'active',
    subscription: {
      id: 'sub2',
      plan: 'elite',
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      price: 149.99,
    },
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1234567892',
    joinDate: '2024-01-20',
    status: 'active',
    subscription: {
      id: 'sub3',
      plan: 'basic',
      status: 'active',
      startDate: '2024-01-20',
      endDate: '2024-04-20',
      price: 49.99,
    },
  },
];

let workouts: Workout[] = [
  {
    id: 'w1',
    name: 'Upper Body Strength',
    description: 'Focus on chest, shoulders, and arms',
    duration: 60,
    exercises: [
      {
        id: 'e1',
        name: 'Bench Press',
        sets: 4,
        reps: '8-10',
        weight: 80,
        restTime: 90,
        notes: 'Focus on form',
      },
      {
        id: 'e2',
        name: 'Shoulder Press',
        sets: 3,
        reps: '10-12',
        weight: 25,
        restTime: 60,
      },
    ],
    clientId: '1',
    createdAt: '2024-01-20',
  },
];

let nutritionPlans: NutritionPlan[] = [
  {
    id: 'n1',
    name: 'High Protein Plan',
    description: 'Designed for muscle building',
    meals: [
      {
        id: 'm1',
        name: 'Protein Breakfast',
        type: 'breakfast',
        foods: [
          {
            id: 'f1',
            name: 'Eggs',
            quantity: '3 whole eggs',
            calories: 210,
            protein: 18,
            carbs: 1,
            fats: 15,
          },
        ],
        calories: 400,
        time: '08:00',
      },
    ],
    clientId: '1',
    createdAt: '2024-01-20',
    calories: 2200,
    macros: {
      protein: 180,
      carbs: 200,
      fats: 80,
    },
  },
];

let progressCheckIns: ProgressCheckIn[] = [
  {
    id: 'p1',
    clientId: '1',
    date: '2024-01-15',
    weight: 180,
    bodyFat: 15,
    measurements: {
      chest: 42,
      waist: 34,
      hips: 38,
      arms: 15,
      thighs: 24,
    },
  },
];

let bookings: Booking[] = [
  {
    id: 'b1',
    clientId: '1',
    trainerId: 'trainer1',
    date: '2024-02-15',
    time: '10:00',
    duration: 60,
    type: 'training',
    status: 'scheduled',
  },
];

let payments: Payment[] = [
  {
    id: 'pay1',
    clientId: '1',
    amount: 99.99,
    date: '2024-01-15',
    status: 'completed',
    type: 'subscription',
    description: 'Premium Plan - Monthly',
  },
];

// API Functions
export const clientApi = {
  getAll: async (): Promise<Client[]> => {
    await delay(500);
    return [...clients];
  },

  getById: async (id: string): Promise<Client | null> => {
    await delay(300);
    return clients.find((c) => c.id === id) || null;
  },

  create: async (client: Omit<Client, 'id'>): Promise<Client> => {
    await delay(500);
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
    };
    clients.push(newClient);
    return newClient;
  },

  update: async (id: string, updates: Partial<Client>): Promise<Client> => {
    await delay(500);
    const index = clients.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Client not found');
    clients[index] = { ...clients[index], ...updates };
    return clients[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    clients = clients.filter((c) => c.id !== id);
  },
};

export const workoutApi = {
  getAll: async (clientId?: string): Promise<Workout[]> => {
    await delay(500);
    if (clientId) {
      return workouts.filter((w) => w.clientId === clientId);
    }
    return [...workouts];
  },

  getById: async (id: string): Promise<Workout | null> => {
    await delay(300);
    return workouts.find((w) => w.id === id) || null;
  },

  create: async (workout: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> => {
    await delay(500);
    const newWorkout: Workout = {
      ...workout,
      id: `w${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    workouts.push(newWorkout);
    return newWorkout;
  },

  update: async (id: string, updates: Partial<Workout>): Promise<Workout> => {
    await delay(500);
    const index = workouts.findIndex((w) => w.id === id);
    if (index === -1) throw new Error('Workout not found');
    workouts[index] = { ...workouts[index], ...updates };
    return workouts[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    workouts = workouts.filter((w) => w.id !== id);
  },
};

export const nutritionApi = {
  getAll: async (clientId?: string): Promise<NutritionPlan[]> => {
    await delay(500);
    if (clientId) {
      return nutritionPlans.filter((n) => n.clientId === clientId);
    }
    return [...nutritionPlans];
  },

  getById: async (id: string): Promise<NutritionPlan | null> => {
    await delay(300);
    return nutritionPlans.find((n) => n.id === id) || null;
  },

  create: async (
    plan: Omit<NutritionPlan, 'id' | 'createdAt'>
  ): Promise<NutritionPlan> => {
    await delay(500);
    const newPlan: NutritionPlan = {
      ...plan,
      id: `n${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    nutritionPlans.push(newPlan);
    return newPlan;
  },

  update: async (
    id: string,
    updates: Partial<NutritionPlan>
  ): Promise<NutritionPlan> => {
    await delay(500);
    const index = nutritionPlans.findIndex((n) => n.id === id);
    if (index === -1) throw new Error('Nutrition plan not found');
    nutritionPlans[index] = { ...nutritionPlans[index], ...updates };
    return nutritionPlans[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    nutritionPlans = nutritionPlans.filter((n) => n.id !== id);
  },
};

export const progressApi = {
  getAll: async (clientId?: string): Promise<ProgressCheckIn[]> => {
    await delay(500);
    if (clientId) {
      return progressCheckIns.filter((p) => p.clientId === clientId);
    }
    return [...progressCheckIns];
  },

  create: async (
    checkIn: Omit<ProgressCheckIn, 'id'>
  ): Promise<ProgressCheckIn> => {
    await delay(500);
    const newCheckIn: ProgressCheckIn = {
      ...checkIn,
      id: `p${Date.now()}`,
    };
    progressCheckIns.push(newCheckIn);
    return newCheckIn;
  },
};

export const bookingApi = {
  getAll: async (): Promise<Booking[]> => {
    await delay(500);
    return [...bookings];
  },

  create: async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
    await delay(500);
    const newBooking: Booking = {
      ...booking,
      id: `b${Date.now()}`,
    };
    bookings.push(newBooking);
    return newBooking;
  },

  update: async (id: string, updates: Partial<Booking>): Promise<Booking> => {
    await delay(500);
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    bookings[index] = { ...bookings[index], ...updates };
    return bookings[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    bookings = bookings.filter((b) => b.id !== id);
  },
};

export const paymentApi = {
  getAll: async (): Promise<Payment[]> => {
    await delay(500);
    return [...payments];
  },

  create: async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
    await delay(500);
    const newPayment: Payment = {
      ...payment,
      id: `pay${Date.now()}`,
    };
    payments.push(newPayment);
    return newPayment;
  },
};

export const analyticsApi = {
  getAnalytics: async (): Promise<Analytics> => {
    await delay(500);
    return {
      totalClients: clients.length,
      activeSubscriptions: clients.filter(
        (c) => c.subscription.status === 'active'
      ).length,
      monthlyRevenue: payments
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0),
      upcomingBookings: bookings.filter(
        (b) => b.status === 'scheduled'
      ).length,
      clientGrowth: [
        { month: 'Jan', count: 2 },
        { month: 'Feb', count: 3 },
        { month: 'Mar', count: 3 },
      ],
      revenueData: [
        { month: 'Jan', revenue: 199.98 },
        { month: 'Feb', revenue: 249.98 },
        { month: 'Mar', revenue: 299.97 },
      ],
    };
  },
};

// Helper function to simulate API delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

