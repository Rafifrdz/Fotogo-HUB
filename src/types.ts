export interface BoothConfig {
  id: string;
  boothId: string;
  status: 'available' | 'busy' | 'pause';
  capacityPerSession: number;
  averageSessionMinutes: number;
  packages: { name: string; price: number }[];
}

export interface Booking {
  id: string;
  userId: string;
  boothId: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  package: string;
  price: number;
}

export interface QueueEntry {
  id: string;
  userId: string;
  boothId: string;
  position: number;
  estimatedWaitMinutes: number;
  status: 'waiting' | 'called' | 'completed' | 'no-show';
  joinedAt: string;
}

export interface Transaction {
  id: string;
  boothId: string;
  userId?: string;
  amount: number;
  type: 'online' | 'offline';
  package: string;
  commission: number;
  createdAt: string;
}

export interface PhotoSession {
  id: string;
  boothName: string;
  location: string;
  date: string;
  imageUrl: string;
  pointsEarned: number;
  tags: string[];
}

export interface Booth {
  id: string;
  name: string;
  rating: number;
  price: string;
  imageUrl: string;
  address: string;
  promo?: string;
  distance?: string;
  latitude?: number;
  longitude?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  photoUrl: string;
  totalMemories: number;
  boothsVisited: number;
  points: number;
  referralCode: string;
  badges: string[];
}

export interface Reward {
  id: string;
  title: string;
  points: number;
  description: string;
  icon: string;
}
