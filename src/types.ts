export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isSimulated?: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'all' | 'processed' | 'raw' | 'direct' | 'organic';
  image: string;
  tag: string;
  sellerName?: string;
  totalHarvest?: string;
  address?: string;
}

export interface Plot {
  id: string;
  title: string;
  description: string;
  status: 'HEALTHY' | 'ATTENTION' | 'CRITICAL';
  moisture: number; // 0 - 100
  temp: number; // °C
  nitrogen: 'Optimal' | 'Low' | 'High' | 'Deficient';
  solar: number; // kWh
  image: string;
  nextTask: string;
  days: number;
  phase: string;
}

export interface Task {
  id: string;
  title: string;
  time: string;
  description: string;
  category: 'fertilizer' | 'harvest' | 'soil' | 'general';
  completed: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
