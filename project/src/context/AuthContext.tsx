import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types/User';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isOnline: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineToast, setOfflineToast] = useState<string | null>(null);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (offlineToast) {
        toast.dismiss(offlineToast);
        setOfflineToast(null);
      }
      toast.success('Back online!');
    };

    const handleOffline = () => {
      setIsOnline(false);
      const toastId = toast.error('You are offline. Some features may be limited.', {
        duration: Infinity
      });
      setOfflineToast(toastId);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineToast]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Set basic user data immediately
          const basicUserData: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            phone: '',
            userType: 'driver',
            createdAt: new Date().toISOString()
          };

          // Set basic user data first
          setUser(basicUserData);

          // Only attempt to fetch additional data if online
          if (navigator.onLine) {
            try {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                setUser({
                  ...userData,
                  id: firebaseUser.uid,
                  email: firebaseUser.email || '',
                });
              }
            } catch (firestoreError) {
              console.warn('Failed to fetch additional user data:', firestoreError);
              // Keep using basic user data if Firestore fetch fails
            }
          } else {
            // If offline, inform the user that we're using limited data
            toast.error('Using limited profile data while offline');
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        if (!navigator.onLine) {
          toast.error('Limited functionality available while offline');
        } else {
          toast.error('Authentication error occurred');
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!navigator.onLine) {
      toast.error('Cannot login while offline');
      return false;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data() as User;
      
      setUser({
        ...userData,
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<boolean> => {
    if (!navigator.onLine) {
      toast.error('Cannot register while offline');
      return false;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const name = `${firstName} ${lastName}`;
      await updateFirebaseProfile(userCredential.user, {
        displayName: name
      });

      const newUser: User = {
        id: userCredential.user.uid,
        name,
        email: userCredential.user.email || '',
        phone: '',
        userType: 'driver',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      setUser(newUser);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to create account');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!navigator.onLine) {
      toast.error('Cannot logout while offline');
      return;
    }

    try {
      await signOut(auth);
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!navigator.onLine) {
      toast.error('Cannot update profile while offline');
      return false;
    }

    try {
      setLoading(true);
      
      if (!user || !auth.currentUser) {
        throw new Error('No authenticated user');
      }

      if (userData.name) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: userData.name
        });
      }

      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, {
        ...user,
        ...userData
      }, { merge: true });

      setUser(prev => prev ? { ...prev, ...userData } : null);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      isOnline,
      login, 
      register, 
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};