import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, DollarSign, Calendar, Car, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SpotDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSpotById, createReservation } = useParking();
  const { user } = useAuth();
  const spot = getSpotById(id || '');
  
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    // Update page title
    if (spot) {
      document.title = `${spot.title} - ParkShare`;
    } else {
      document.title = 'Parking Spot Details - ParkShare';
    }
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [spot]);

  if (!spot) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Parking spot not found</h2>
        <p className="mb-8">The parking spot you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to make a reservation');
      navigate('/login');
      return;
    }
    
    if (!startDate || !endDate) {
      toast.error('Please select start and end times');
      return;
    }
    
    const reservationId = await createReservation(spot.id, startDate, endDate);
    
    if (reservationId) {
      toast.success('Reservation created successfully!');
      navigate('/dashboard');
    } else {
      toast.error('Failed to create reservation. Please try again.');
    }
  };
  
  const nextImage = () => {
    if (spot.images.length > 1) {
      setImageIndex((imageIndex + 1) % spot.images.length);
    }
  };
  
  const prevImage = () => {
    if (spot.images.length > 1) {
      setImageIndex((imageIndex - 1 + spot.images.length) % spot.images.length);
    }
  };

  // Format for the day of week display
  const getDayOfWeek = (day: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };

  // Format time for display (converts 24hr to 12hr format)
  const formatTime = (time: string): string => {
    if (time.includes('T')) { 
      // Handle ISO string
      const date = new Date(time);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // Handle time string like "08:00"
      const [hours, minutes] = time.split(':').map(Number);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
  };
  
  return (
    <div className="bg-white min-h-screen">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to search
        </button>
      </div>
      
      {/* Image Gallery */}
      <div className="bg-gray-100 relative">
        <div className="container mx-auto">
          <div className="relative aspect-video max-h-[500px] overflow-hidden">
            {spot.images.length > 0 ? (
              <img 
                src={spot.images[imageIndex]} 
                alt={spot.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <Car className="h-16 w-16 text-gray-400" />
              </div>
            )}
            
            {spot.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {spot.images.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`block h-2 w-2 rounded-full ${idx === imageIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Details */}
          <div className="lg:w-2/3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{spot.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                <span>{spot.address}</span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="font-medium">{spot.rating > 0 ? spot.rating.toFixed(1) : 'New'}</span>
                  {spot.reviews.length > 0 && (
                    <span className="text-gray-600 ml-1">({spot.reviews.length} reviews)</span>
                  )}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-500 mr-1" />
                  <span className="font-medium">${spot.hourlyRate}/hour</span>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700">{spot.description}</p>
            </div>
            
            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {spot.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-md p-3">
                    <Car className="h-5 w-5 text-blue-500 mr-2" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Availability */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Availability</h2>
              {spot.availability.length > 0 ? (
                <div className="space-y-3">
                  {spot.availability.map((avail, index) => (
                    <div key={index} className="flex items-start border-l-4 border-blue-500 pl-3 py-1">
                      <Clock className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        {avail.isRecurring && avail.dayOfWeek !== undefined ? (
                          <p>
                            <span className="font-medium">{getDayOfWeek(avail.dayOfWeek)}:</span> {formatTime(avail.startTime)} - {formatTime(avail.endTime)}
                          </p>
                        ) : (
                          <p>
                            <span className="font-medium">
                              {new Date(avail.startTime).toLocaleDateString()} - {new Date(avail.endTime).toLocaleDateString()}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No availability information provided.</p>
              )}
            </div>
            
            {/* Reviews */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Reviews</h2>
              {spot.reviews.length > 0 ? (
                <div className="space-y-6">
                  {spot.reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="font-medium">{review.userName}</div>
                          <div className="text-gray-500 text-sm ml-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                          <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                          <span className="font-medium">{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet.</p>
              )}
            </div>
          </div>
          
          {/* Right Column: Reservation */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Reserve this spot</h2>
              
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg">
                  <span className="font-bold text-blue-600">${spot.hourlyRate}</span> / hour
                </div>
                <div className="text-lg">
                  <span className="font-bold text-blue-600">${spot.dailyRate}</span> / day
                </div>
              </div>
              
              {showReservationForm ? (
                <form onSubmit={handleReservation} className="space-y-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date & Time
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <input
                        type="datetime-local"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date & Time
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <input
                        type="datetime-local"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowReservationForm(false)}
                      className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Reserve Now
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => {
                    if (!user) {
                      toast.error('Please log in to make a reservation');
                      navigate('/login');
                      return;
                    }
                    setShowReservationForm(true);
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Check Availability
                </button>
              )}
              
              <div className="mt-6 text-center text-gray-600 text-sm">
                You won't be charged until after your parking session
              </div>
              
              <div className="border-t border-gray-200 mt-6 pt-4">
                <h3 className="font-medium mb-2">Property rules:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Please arrive on time for your reservation</li>
                  <li>• Follow any posted instructions at the location</li>
                  <li>• Be respectful of the property and surrounding area</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;