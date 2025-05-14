import { useState, useEffect } from 'react';
import { MapPin, Search as SearchIcon } from 'lucide-react';
import ParkingSpotCard from '../components/parking/ParkingSpotCard';
import SearchFilters, { SearchFilters as FilterType } from '../components/parking/SearchFilters';
import { useParking } from '../context/ParkingContext';

const Search = () => {
  const { filteredSpots, searchSpots } = useParking();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterType>({ amenities: [] });

  useEffect(() => {
    // Update page title
    document.title = 'Search Parking Spots - ParkShare';
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchSpots(searchQuery, activeFilters);
  };

  const handleFilterApply = (filters: FilterType) => {
    setActiveFilters(filters);
    searchSpots(searchQuery, filters);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">Find Parking Spots</h1>
          
          <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <MapPin className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter location, address, or area..."
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <SearchIcon className="h-5 w-5 mr-2" />
              Search
            </button>
          </form>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Filter Component */}
        <SearchFilters onApplyFilters={handleFilterApply} />
        
        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {filteredSpots.length} {filteredSpots.length === 1 ? 'spot' : 'spots'} found
          </h2>
          <div className="text-gray-600">
            {Object.keys(activeFilters).length > 0 && activeFilters.amenities.length === 0 
              ? 'No filters applied' 
              : `${activeFilters.amenities.length} ${activeFilters.amenities.length === 1 ? 'filter' : 'filters'} applied`
            }
          </div>
        </div>
        
        {/* Results Grid */}
        {filteredSpots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map(spot => (
              <ParkingSpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No parking spots found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find available parking spots.
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveFilters({ amenities: [] });
                searchSpots('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;