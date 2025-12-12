// Type definitions for the fitness coaching platform

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "inactive" | "pending";
  subscription: Subscription;
  avatar?: string;
}

export interface Subscription {
  id: string;
  plan: "basic" | "premium" | "elite";
  status: "active" | "cancelled" | "expired";
  startDate: string;
  endDate: string;
  price: number;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  exercises: Exercise[];
  clientId?: string;
  createdAt: string;
  videoUrl?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: number;
  restTime: number; // in seconds
  notes?: string;
  videoUrl?: string;
}

export interface NutritionPlan {
  id: string;
  name: string;
  description: string;
  meals: Meal[];
  clientId?: string;
  createdAt: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  foods: Food[];
  calories: number;
  time: string;
}

export interface Food {
  id?: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface ProgressCheckIn {
  id: string;
  clientId: string;
  date: string;
  weight: number;
  bodyFat?: number;
  measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  notes?: string;
  photos?: string[];
}

export interface Booking {
  id: string;
  clientId: string;
  trainerId: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: "consultation" | "training" | "check-in";
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  date: string;
  status: "pending" | "completed" | "failed";
  type: "subscription" | "one-time";
  description: string;
}

export interface Analytics {
  totalClients: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  upcomingBookings: number;
  clientGrowth: { month: string; count: number }[];
  revenueData: { month: string; revenue: number }[];
}
