export type UserType = 'owner' | 'driver' | 'both';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  profileImage?: string;
  bio?: string;
  createdAt: string;
  // Fields needed if user is also a parking spot owner
  paymentInfo?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
  };
}