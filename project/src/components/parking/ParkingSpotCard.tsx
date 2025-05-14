import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Car } from 'lucide-react';
import { ParkingSpot } from '../../types/Parking';

interface ParkingSpotCardProps {
  spot: ParkingSpot;
  className?: string;
}

const ParkingSpotCard = ({ spot, className = '' }: ParkingSpotCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={spot.images[0] || 'https://images.pexels.com/photos/2078885/pexels-photo-2078885.jpeg?auto=compress&cs=tinysrgb&w=600'} 
          alt={spot.title}
          className="w-full h-full object-cover" 
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">{spot.title}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1 text-blue-500" />
          <span className="text-sm truncate">{spot.address}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">
              {spot.rating > 0 ? spot.rating.toFixed(1) : 'New'} 
              {spot.reviews.length > 0 && ` (${spot.reviews.length})`}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{getAvailabilityText(spot)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-blue-600">${spot.hourlyRate}</span>
            <span className="text-gray-500 text-sm"> /hour</span>
          </div>
          <Link 
            to={`/spots/${spot.id}`} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            View
          </Link>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {spot.amenities.slice(0, 3).map((amenity, index) => (
            <span 
              key={index} 
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center"
            >
              <Car className="h-3 w-3 mr-1" />
              {amenity}
            </span>
          ))}
          {spot.amenities.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              +{spot.amenities.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const getAvailabilityText = (spot: ParkingSpot): string => {
  if (spot.availability.length === 0) {
    return "Not available";
  }
  
  if (spot.availability.some(a => !a.isRecurring)) {
    return "Check calendar";
  }
  
  // For recurring weekly availabilities
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const recurringDays = spot.availability
    .filter(a => a.isRecurring && a.dayOfWeek !== undefined)
    .map(a => days[a.dayOfWeek!]);
    
  if (recurringDays.length === 7) {
    return "Available daily";
  } else if (recurringDays.length === 5 && 
             !recurringDays.includes("Sat") && 
             !recurringDays.includes("Sun")) {
    return "Weekdays only";
  } else if (recurringDays.length === 2 && 
             recurringDays.includes("Sat") && 
             recurringDays.includes("Sun")) {
    return "Weekends only";
  } else if (recurringDays.length > 0) {
    return `${recurringDays.slice(0, 2).join(", ")}${recurringDays.length > 2 ? "..." : ""}`;
  }
  
  return "Limited availability";
};

export default ParkingSpotCard;