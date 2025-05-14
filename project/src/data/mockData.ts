import { User } from '../types/User';
import { ParkingSpot, Reservation } from '../types/Parking';

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '123-456-7890',
    userType: 'owner',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'I have multiple parking spaces available in downtown.',
    createdAt: '2023-01-15T12:00:00Z',
    paymentInfo: {
      accountName: 'John Smith',
      accountNumber: '****4321',
      bankName: 'First National Bank'
    }
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '987-654-3210',
    userType: 'driver',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'Looking for convenient parking spots near my workplace.',
    createdAt: '2023-02-10T10:30:00Z'
  },
  {
    id: 'user-3',
    name: 'Michael Wong',
    email: 'michael@example.com',
    phone: '555-123-4567',
    userType: 'both',
    profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
    bio: 'I occasionally rent out my driveway and also use the app when traveling.',
    createdAt: '2023-03-05T14:15:00Z',
    paymentInfo: {
      accountName: 'Michael Wong',
      accountNumber: '****8765',
      bankName: 'City Credit Union'
    }
  }
];

// Mock parking spots
export const mockParkingSpots: ParkingSpot[] = [
  {
    id: 'spot-1',
    ownerId: 'user-1',
    title: 'Downtown Private Parking Spot',
    description: 'Convenient parking spot in downtown area, close to shops and restaurants. Available most weekdays.',
    address: '123 Main St, Downtown',
    lat: 40.7128,
    lng: -74.0060,
    hourlyRate: 8,
    dailyRate: 30,
    availability: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '18:00', isRecurring: true },
      { dayOfWeek: 2, startTime: '08:00', endTime: '18:00', isRecurring: true },
      { dayOfWeek: 3, startTime: '08:00', endTime: '18:00', isRecurring: true },
      { dayOfWeek: 4, startTime: '08:00', endTime: '18:00', isRecurring: true },
      { dayOfWeek: 5, startTime: '08:00', endTime: '18:00', isRecurring: true }
    ],
    amenities: ['Covered', 'Security Camera', 'Well Lit'],
    images: [
      'https://images.pexels.com/photos/191018/pexels-photo-191018.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/637713/pexels-photo-637713.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    rating: 4.7,
    reviews: [
      {
        id: 'review-1',
        userId: 'user-2',
        userName: 'Sarah Johnson',
        rating: 5,
        comment: 'Great location and very easy to find. Owner was helpful.',
        createdAt: '2023-04-20T09:30:00Z'
      },
      {
        id: 'review-2',
        userId: 'user-3',
        userName: 'Michael Wong',
        rating: 4,
        comment: 'Good spot but a bit tight for larger vehicles.',
        createdAt: '2023-05-15T16:45:00Z'
      }
    ],
    createdAt: '2023-01-20T12:00:00Z'
  },
  {
    id: 'spot-2',
    ownerId: 'user-3',
    title: 'Residential Driveway Near Park',
    description: 'Spacious driveway in a quiet residential area, next to Central Park. Perfect for weekend visitors.',
    address: '456 Park Ave, Westside',
    lat: 40.7829,
    lng: -73.9654,
    hourlyRate: 5,
    dailyRate: 20,
    availability: [
      { dayOfWeek: 6, startTime: '09:00', endTime: '20:00', isRecurring: true },
      { dayOfWeek: 0, startTime: '09:00', endTime: '20:00', isRecurring: true }
    ],
    amenities: ['EV Charging', 'Wide Space'],
    images: [
      'https://images.pexels.com/photos/1416367/pexels-photo-1416367.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    rating: 4.9,
    reviews: [
      {
        id: 'review-3',
        userId: 'user-2',
        userName: 'Sarah Johnson',
        rating: 5,
        comment: 'Beautiful location and very secure. The EV charger was a plus!',
        createdAt: '2023-06-10T14:20:00Z'
      }
    ],
    createdAt: '2023-03-10T15:30:00Z'
  },
  {
    id: 'spot-3',
    ownerId: 'user-1',
    title: 'Secure Garage in Business District',
    description: 'Private garage in the heart of the business district. 24/7 security and easy access.',
    address: '789 Commerce Blvd, Business Center',
    lat: 40.7549,
    lng: -73.9840,
    hourlyRate: 10,
    dailyRate: 40,
    availability: [
      { startTime: '2023-05-01T00:00:00Z', endTime: '2023-12-31T23:59:59Z', isRecurring: false }
    ],
    amenities: ['Covered', 'Security Camera', 'Security Guard', 'Well Lit', 'Gated'],
    images: [
      'https://images.pexels.com/photos/1004665/pexels-photo-1004665.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/700420/pexels-photo-700420.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    rating: 4.8,
    reviews: [
      {
        id: 'review-4',
        userId: 'user-3',
        userName: 'Michael Wong',
        rating: 5,
        comment: 'Excellent secure parking. Worth the premium price.',
        createdAt: '2023-05-25T10:15:00Z'
      }
    ],
    createdAt: '2023-04-05T09:45:00Z'
  },
  {
    id: 'spot-4',
    ownerId: 'user-3',
    title: 'Stadium Adjacent Parking',
    description: 'Perfect for game days! Just a 5-minute walk to the stadium entrance. Book early for event days.',
    address: '321 Stadium Way, Sports District',
    lat: 40.7505,
    lng: -73.9934,
    hourlyRate: 15,
    dailyRate: 50,
    availability: [
      { dayOfWeek: 6, startTime: '12:00', endTime: '23:00', isRecurring: true },
      { dayOfWeek: 0, startTime: '12:00', endTime: '23:00', isRecurring: true }
    ],
    amenities: ['Wide Space', 'Well Lit'],
    images: [
      'https://images.pexels.com/photos/4722174/pexels-photo-4722174.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    rating: 4.5,
    reviews: [],
    createdAt: '2023-05-15T11:20:00Z'
  }
];

// Mock reservations
export const mockReservations: Reservation[] = [
  {
    id: 'reservation-1',
    spotId: 'spot-1',
    userId: 'user-2',
    ownerUserId: 'user-1',
    status: 'completed',
    startTime: '2023-04-20T09:00:00Z',
    endTime: '2023-04-20T17:00:00Z',
    totalPrice: 64,
    paymentStatus: 'paid',
    paymentId: 'pay-123456',
    createdAt: '2023-04-18T14:30:00Z'
  },
  {
    id: 'reservation-2',
    spotId: 'spot-2',
    userId: 'user-2',
    ownerUserId: 'user-3',
    status: 'confirmed',
    startTime: '2023-06-10T10:00:00Z',
    endTime: '2023-06-10T18:00:00Z',
    totalPrice: 40,
    paymentStatus: 'unpaid',
    createdAt: '2023-06-08T09:15:00Z'
  },
  {
    id: 'reservation-3',
    spotId: 'spot-3',
    userId: 'user-3',
    ownerUserId: 'user-1',
    status: 'completed',
    startTime: '2023-05-25T08:00:00Z',
    endTime: '2023-05-25T18:00:00Z',
    totalPrice: 100,
    paymentStatus: 'paid',
    paymentId: 'pay-789012',
    createdAt: '2023-05-23T16:45:00Z'
  }
];