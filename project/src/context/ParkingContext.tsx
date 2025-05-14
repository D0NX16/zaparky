import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ParkingSpot, Reservation } from '../types/Parking';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface ParkingContextType {
  spots: ParkingSpot[];
  filteredSpots: ParkingSpot[];
  reservations: Reservation[];
  loading: boolean;
  addSpot: (spot: Partial<ParkingSpot>) => Promise<string | null>;
  updateSpot: (id: string, spot: Partial<ParkingSpot>) => Promise<boolean>;
  deleteSpot: (id: string) => Promise<boolean>;
  getSpotById: (id: string) => ParkingSpot | undefined;
  searchSpots: (searchQuery: string, filters?: Record<string, any>) => Promise<void>;
  createReservation: (spotId: string, startTime: string, endTime: string) => Promise<string | null>;
  getUserReservations: () => Reservation[];
  getUserSpots: () => ParkingSpot[];
  getSpotReservations: (spotId: string) => Reservation[];
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};

export const ParkingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<ParkingSpot[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch spots from Firestore on mount
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        setLoading(true);
        const spotsRef = collection(db, 'spots');
        const spotsQuery = query(spotsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(spotsQuery);
        
        const spotsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ParkingSpot[];
        
        setSpots(spotsData);
        setFilteredSpots(spotsData);
      } catch (error) {
        console.error('Error fetching spots:', error);
        toast.error('Failed to load parking spots');
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

  // Fetch reservations when user changes
  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) {
        setReservations([]);
        return;
      }

      try {
        setLoading(true);
        const reservationsRef = collection(db, 'reservations');
        const userReservationsQuery = query(
          reservationsRef,
          where('userId', '==', user.id),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(userReservationsQuery);
        const reservationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Reservation[];
        
        setReservations(reservationsData);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        toast.error('Failed to load reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user]);

  const addSpot = async (spot: Partial<ParkingSpot>): Promise<string | null> => {
    try {
      setLoading(true);
      
      if (!user) return null;
      
      const newSpot: ParkingSpot = {
        id: '', // Will be set by Firestore
        ownerId: user.id,
        title: spot.title || 'Parking Spot',
        description: spot.description || '',
        address: spot.address || '',
        lat: spot.lat || 0,
        lng: spot.lng || 0,
        hourlyRate: spot.hourlyRate || 5,
        dailyRate: spot.dailyRate || 20,
        availability: spot.availability || [],
        amenities: spot.amenities || [],
        images: spot.images || [],
        rating: 0,
        reviews: [],
        createdAt: new Date().toISOString(),
        ...spot
      };
      
      const docRef = await addDoc(collection(db, 'spots'), newSpot);
      newSpot.id = docRef.id;
      
      setSpots(prevSpots => [newSpot, ...prevSpots]);
      setFilteredSpots(prevSpots => [newSpot, ...prevSpots]);
      
      return docRef.id;
    } catch (error) {
      console.error('Add spot error:', error);
      toast.error('Failed to add parking spot');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSpot = async (id: string, spot: Partial<ParkingSpot>): Promise<boolean> => {
    try {
      setLoading(true);
      const spotRef = doc(db, 'spots', id);
      await updateDoc(spotRef, {
        ...spot,
        updatedAt: new Date().toISOString()
      });
      
      setSpots(prevSpots => 
        prevSpots.map(p => 
          p.id === id ? { ...p, ...spot } : p
        )
      );
      setFilteredSpots(prevSpots => 
        prevSpots.map(p => 
          p.id === id ? { ...p, ...spot } : p
        )
      );
      return true;
    } catch (error) {
      console.error('Update spot error:', error);
      toast.error('Failed to update parking spot');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSpot = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'spots', id));
      
      setSpots(prevSpots => prevSpots.filter(p => p.id !== id));
      setFilteredSpots(prevSpots => prevSpots.filter(p => p.id !== id));
      return true;
    } catch (error) {
      console.error('Delete spot error:', error);
      toast.error('Failed to delete parking spot');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getSpotById = (id: string): ParkingSpot | undefined => {
    return spots.find(spot => spot.id === id);
  };

  const searchSpots = async (searchQuery: string, filters?: Record<string, any>) => {
    try {
      setLoading(true);
      const spotsRef = collection(db, 'spots');
      let queryRef = query(spotsRef);

      // If there's a search query, filter by address
      if (searchQuery) {
        queryRef = query(
          spotsRef,
          where('address', '>=', searchQuery.toLowerCase()),
          where('address', '<=', searchQuery.toLowerCase() + '\uf8ff')
        );
      }

      const querySnapshot = await getDocs(queryRef);
      let results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ParkingSpot[];

      // Apply additional filters
      if (filters) {
        if (filters.minPrice !== undefined) {
          results = results.filter(spot => spot.hourlyRate >= filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
          results = results.filter(spot => spot.hourlyRate <= filters.maxPrice);
        }
        if (filters.amenities && filters.amenities.length > 0) {
          results = results.filter(spot => 
            filters.amenities.every((amenity: string) => spot.amenities.includes(amenity))
          );
        }
      }

      setFilteredSpots(results);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search parking spots');
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (
    spotId: string, 
    startTime: string, 
    endTime: string
  ): Promise<string | null> => {
    try {
      setLoading(true);
      
      if (!user) return null;
      const spot = spots.find(s => s.id === spotId);
      if (!spot) return null;
      
      const newReservation: Reservation = {
        id: '', // Will be set by Firestore
        spotId,
        userId: user.id,
        ownerUserId: spot.ownerId,
        status: 'pending',
        startTime,
        endTime,
        totalPrice: calculatePrice(spot, new Date(startTime), new Date(endTime)),
        paymentStatus: 'unpaid',
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'reservations'), newReservation);
      newReservation.id = docRef.id;
      
      setReservations(prevReservations => [newReservation, ...prevReservations]);
      return docRef.id;
    } catch (error) {
      console.error('Create reservation error:', error);
      toast.error('Failed to create reservation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (
    spot: ParkingSpot, 
    startTime: Date, 
    endTime: Date
  ): number => {
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const durationDays = durationHours / 24;
    
    if (durationHours >= 24) {
      return Math.ceil(durationDays) * spot.dailyRate;
    } else {
      return Math.ceil(durationHours) * spot.hourlyRate;
    }
  };

  const getUserReservations = (): Reservation[] => {
    if (!user) return [];
    return reservations.filter(reservation => reservation.userId === user.id);
  };

  const getUserSpots = (): ParkingSpot[] => {
    if (!user) return [];
    return spots.filter(spot => spot.ownerId === user.id);
  };

  const getSpotReservations = (spotId: string): Reservation[] => {
    return reservations.filter(reservation => reservation.spotId === spotId);
  };

  return (
    <ParkingContext.Provider 
      value={{
        spots,
        filteredSpots,
        reservations,
        loading,
        addSpot,
        updateSpot,
        deleteSpot,
        getSpotById,
        searchSpots,
        createReservation,
        getUserReservations,
        getUserSpots,
        getSpotReservations
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};