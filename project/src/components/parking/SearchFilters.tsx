import { useState } from 'react';
import { Sliders, X } from 'lucide-react';

interface SearchFiltersProps {
  onApplyFilters: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  amenities: string[];
  availability?: string;
}

const amenitiesList = [
  'Covered', 
  'Security Camera', 
  'Well Lit', 
  'EV Charging', 
  'Wide Space', 
  'Gated',
  'Security Guard'
];

const SearchFilters = ({ onApplyFilters }: SearchFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string>('any');

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const handleAmenityToggle = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleApplyFilters = () => {
    const filters: SearchFilters = {
      amenities: selectedAmenities,
    };

    if (minPrice) {
      filters.minPrice = parseFloat(minPrice);
    }

    if (maxPrice) {
      filters.maxPrice = parseFloat(maxPrice);
    }

    if (availability !== 'any') {
      filters.availability = availability;
    }

    onApplyFilters(filters);
    toggleFilter();
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedAmenities([]);
    setAvailability('any');
    onApplyFilters({ amenities: [] });
  };

  return (
    <div className="mb-6 relative">
      <button 
        onClick={toggleFilter}
        className="w-full md:w-auto flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
      >
        <Sliders className="h-4 w-4" />
        <span>Filters{selectedAmenities.length > 0 || minPrice || maxPrice ? ` (${selectedAmenities.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0)})` : ''}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-30 overflow-y-auto md:absolute md:inset-auto md:top-full md:left-0 md:right-0 md:mt-2">
          <div className="fixed inset-0 bg-black/30 md:hidden" onClick={toggleFilter}></div>
          <div className="relative bg-white p-5 rounded-t-xl md:rounded-xl shadow-lg max-w-2xl mx-auto md:mx-0 mt-auto md:mt-0 h-[80vh] md:h-auto overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filter Results</h3>
              <button onClick={toggleFilter} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto">
              {/* Price Range */}
              <div>
                <h4 className="text-md font-medium mb-3">Price Range (per hour)</h4>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min"
                      min="0"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max"
                      min="0"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-md font-medium mb-3">Amenities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesList.map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="text-md font-medium mb-3">Availability</h4>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="any">Any Time</option>
                  <option value="weekdays">Weekdays Only</option>
                  <option value="weekends">Weekends Only</option>
                  <option value="24-7">24/7 Availability</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleClearFilters}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;

export { SearchFilters }