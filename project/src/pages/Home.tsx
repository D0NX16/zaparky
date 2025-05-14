import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Map, DollarSign, Star } from 'lucide-react';
import { useParking } from '../context/ParkingContext';

const Home = () => {
  const { searchSpots } = useParking();
  
  useEffect(() => {
    // Reset any filters when landing on home page
    searchSpots('');
    
    // Update page title
    document.title = 'Zaparky - Find or List Parking Spaces';
  }, [searchSpots]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/1004665/pexels-photo-1004665.jpeg?auto=compress&cs=tinysrgb&w=1280" 
            alt="Parking garage" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Find Parking Anywhere with Zaparky
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Connect with local parking spot owners to find affordable parking or earn extra income by renting out your unused space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/search" 
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
              >
                Find Parking
              </Link>
              <Link 
                to="/list-spot" 
                className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                List Your Spot
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 mt-8">
        <h2 className="text-3xl font-bold text-center mb-12">How Zaparky Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Map className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Find a Spot</h3>
            <p className="text-gray-600">
              Search for available parking spots in your desired location. Filter by price, amenities, and availability.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Car className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Book & Park</h3>
            <p className="text-gray-600">
              Reserve your spot in advance with secure online booking. Arrive and park with peace of mind.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Pay After Use</h3>
            <p className="text-gray-600">
              Only pay after your parking session is complete. Our smart pricing adjusts based on location and time.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex text-yellow-500 mb-4">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="text-gray-600 mb-4">
              "Zaparky has been a game-changer for me. I rent out my driveway during business hours and make an extra $400 a month!"
            </p>
            <div className="flex items-center">
              <img 
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300" 
                alt="User" 
                className="h-10 w-10 rounded-full mr-3 object-cover"
              />
              <div>
                <h4 className="font-semibold">John S.</h4>
                <p className="text-sm text-gray-500">Parking Space Owner</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex text-yellow-500 mb-4">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="text-gray-600 mb-4">
              "I used to spend 30 minutes looking for parking downtown. Now I book through Zaparky and always have a guaranteed spot."
            </p>
            <div className="flex items-center">
              <img 
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="User" 
                className="h-10 w-10 rounded-full mr-3 object-cover"
              />
              <div>
                <h4 className="font-semibold">Sarah J.</h4>
                <p className="text-sm text-gray-500">Driver</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex text-yellow-500 mb-4">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5" />
            </div>
            <p className="text-gray-600 mb-4">
              "The app is easy to use and the pricing is fair. I've saved money and time by using Zaparky for my daily commute."
            </p>
            <div className="flex items-center">
              <img 
                src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300" 
                alt="User" 
                className="h-10 w-10 rounded-full mr-3 object-cover"
              />
              <div>
                <h4 className="font-semibold">Michael W.</h4>
                <p className="text-sm text-gray-500">Regular User</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Parking Experience?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are saving time and money with Zaparky. List your spot or find parking today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link 
              to="/search" 
              className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Browse Spots
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;