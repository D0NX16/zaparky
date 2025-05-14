export interface ParkingSpot {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  hourlyRate: number;
  dailyRate: number;
  availability: AvailabilityPeriod[];
  amenities: string[];
  images: string[];
  rating: number;
  reviews: Review[];
  createdAt: string;
}

export interface AvailabilityPeriod {
  dayOfWeek?: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // ISO date string or time string ('08:00')
  endTime: string;  // ISO date string or time string ('18:00')
  isRecurring?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'processing' | 'paid' | 'refunded';

export interface Reservation {
  id: string;
  spotId: string;
  userId: string;
  ownerUserId: string;
  status: ReservationStatus;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  totalPrice: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  paymentId?: string;
}