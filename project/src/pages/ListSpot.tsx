import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MapPin, Clock, DollarSign, Car, Plus, Trash, Phone, User } from 'lucide-react';

const ListSpot = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addSpot } = useParking();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    ownerName: '',
    phone: '',
    address: '',
    description: '',
    price: '',
    availabilitySchedule: [
      {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
      }
    ],
    features: {
      covered: false,
      security: false,
      charging: false,
      camera: false
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isSubmitting) return;
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    if (isSubmitting) return;
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature as keyof typeof prev.features]
      }
    }));
  };

  const handleAvailabilityChange = (index: number, field: string, value: string | number) => {
    if (isSubmitting) return;
    setFormData(prev => ({
      ...prev,
      availabilitySchedule: prev.availabilitySchedule.map((schedule, i) => 
        i === index ? { ...schedule, [field]: value } : schedule
      )
    }));
  };

  const addAvailabilitySlot = () => {
    if (isSubmitting) return;
    setFormData(prev => ({
      ...prev,
      availabilitySchedule: [
        ...prev.availabilitySchedule,
        {
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '17:00',
        }
      ]
    }));
  };

  const removeAvailabilitySlot = (index: number) => {
    if (isSubmitting) return;
    setFormData(prev => ({
      ...prev,
      availabilitySchedule: prev.availabilitySchedule.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.ownerName.trim()) {
      toast.error('Please enter your name');
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title for your parking spot');
      return false;
    }

    if (!formData.address.trim()) {
      toast.error('Please enter the address');
      return false;
    }

    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading('Creating your listing...');
      
      const spotData = {
        title: formData.title,
        ownerName: formData.ownerName,
        phone: formData.phone,
        description: formData.description,
        address: formData.address.toLowerCase(), // Store address in lowercase for better search
        hourlyRate: parseFloat(formData.price),
        dailyRate: parseFloat(formData.price) * 8,
        availability: formData.availabilitySchedule.map(schedule => ({
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isRecurring: true
        })),
        amenities: Object.entries(formData.features)
          .filter(([_, value]) => value)
          .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)),
        images: [],
        lat: 0,
        lng: 0,
        createdAt: new Date().toISOString()
      };

      const spotId = await addSpot(spotData);
      
      if (spotId) {
        toast.dismiss(loadingToast);
        toast.success('Parking spot listed successfully!');
        navigate('/dashboard');
      } else {
        throw new Error('Failed to create spot');
      }
    } catch (error) {
      console.error('Error creating spot:', error);
      toast.error('Failed to list parking spot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDayName = (day: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">List Your Parking Spot</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Owner Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Owner Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline-block w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="Your full name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline-block w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="Your contact number"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Spot Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Spot Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spot Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="e.g., Secure Parking Near Downtown"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline-block w-4 h-4 mr-2" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="Full address of the parking spot"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="Describe your parking spot and any special instructions"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline-block w-4 h-4 mr-2" />
                  Price per Hour
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="15"
                  min="0"
                  step="0.01"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Availability Schedule */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                <Clock className="inline-block w-4 h-4 mr-2" />
                Availability Schedule
              </label>
              <button
                type="button"
                onClick={addAvailabilitySlot}
                disabled={isSubmitting}
                className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium disabled:opacity-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Time Slot
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.availabilitySchedule.map((schedule, index) => (
                <div key={index} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex-1">
                    <select
                      value={schedule.dayOfWeek}
                      onChange={(e) => handleAvailabilityChange(index, 'dayOfWeek', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      disabled={isSubmitting}
                    >
                      {[0, 1, 2, 3, 4, 5, 6].map(day => (
                        <option key={day} value={day}>
                          {getDayName(day)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <input
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <input
                      type="time"
                      value={schedule.endTime}
                      onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  {formData.availabilitySchedule.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAvailabilitySlot(index)}
                      disabled={isSubmitting}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              <Car className="inline-block w-4 h-4 mr-2" />
              Features
            </label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.features).map(([feature, value]) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => handleFeatureToggle(feature)}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-md border ${
                    value
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  } transition-colors duration-200 disabled:opacity-50`}
                >
                  {feature.charAt(0).toUpperCase() + feature.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Listing Spot...
              </>
            ) : (
              'List Parking Spot'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListSpot;