import React from 'react';
import { Filter, X } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onClose
}) => {
  const categories = ['All', 'Traditional', 'Casual', 'Formal', 'Party Wear'];
  const ageGroups = ['All', '0-2 years', '3-5 years', '6-8 years', '9-12 years', '13-16 years'];
  const genders = ['All', 'Boys', 'Girls', 'Unisex'];
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' }
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: 'All',
      ageGroup: 'All',
      gender: 'All',
      priceRange: [0, 5000],
      sortBy: 'featured'
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearFilters}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="md:hidden p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Sort By</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="mr-2 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Age Group */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Age Group</h3>
            <div className="space-y-2">
              {ageGroups.map((age) => (
                <label key={age} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="ageGroup"
                    value={age}
                    checked={filters.ageGroup === age}
                    onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                    className="mr-2 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm">{age}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Gender</h3>
            <div className="space-y-2">
              {genders.map((gender) => (
                <label key={gender} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={filters.gender === gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="mr-2 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #f97316 0%, #f97316 ${filters.priceRange[1] / 50}%, #e5e7eb ${filters.priceRange[1] / 50}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>₹0</span>
                <span>₹{filters.priceRange[1]}</span>
                <span>₹5000+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};