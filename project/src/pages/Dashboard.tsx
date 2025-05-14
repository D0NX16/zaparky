import { useEffect } from 'react';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import ParkingSpotCard from '../components/parking/ParkingSpotCard';
import { Car, Calendar, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const { getUserSpots, getUserReservations } = useParking();
  const { user } = useAuth();
  
  useEffect(() => {
    document.title = 'Dashboard - ParkShare';
  }, []);

  const userSpots = getUserSpots();
  const userReservations = getUserReservations();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Car className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">My Spots</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{userSpots.length}</p>
          <p className="text-gray-600 mt-1">Active parking spots</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Reservations</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{userReservations.length}</p>
          <p className="text-gray-600 mt-1">Total bookings</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="h-6 w-6 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Earnings</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${userReservations.reduce((total, res) => total + (res.paymentStatus === 'paid' ? res.totalPrice : 0), 0)}
          </p>
          <p className="text-gray-600 mt-1">Total earnings</p>
        </div>
      </div>

      {/* My Parking Spots */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Parking Spots</h2>
        </div>
        
        {userSpots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userSpots.map(spot => (
              <ParkingSpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Parking Spots Listed</h3>
            <p className="text-gray-600">You haven't listed any parking spots yet.</p>
          </div>
        )}
      </section>

      {/* Recent Reservations */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Reservations</h2>
        
        {userReservations.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spot
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userReservations.map(reservation => {
                    const spot = getUserSpots().find(s => s.id === reservation.spotId);
                    return (
                      <tr key={reservation.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {spot?.title || 'Unknown Spot'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {spot?.address || 'Address not available'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(reservation.startTime).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(reservation.startTime).toLocaleTimeString()} - 
                            {new Date(reservation.endTime).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${reservation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${reservation.totalPrice}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reservations Yet</h3>
            <p className="text-gray-600">You haven't made any parking reservations.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;