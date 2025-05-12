import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterBarProps {
  onFilterChange: (filters: Record<string, string>) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    size: '',
    brand: '',
    category: '',
    price: ''
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      size: '',
      brand: '',
      category: '',
      price: ''
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="bg-white shadow-sm mb-6 rounded-lg overflow-hidden">
      <div className="flex items-center p-4 justify-between">
        <h2 className="text-lg font-medium text-gray-800">Filter Auctions</h2>
        <button 
          onClick={toggleFilters}
          className="p-2 text-gray-500 hover:text-teal-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          {isFilterOpen ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
        </button>
      </div>
      
      {isFilterOpen && (
        <div className="p-4 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <select
                id="size"
                name="size"
                value={filters.size}
                onChange={handleFilterChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">All Sizes</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select
                id="brand"
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">All Brands</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Zara">Zara</option>
                <option value="H&M">H&M</option>
                <option value="Levi's">Levi's</option>
                <option value="Gucci">Gucci</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">All Categories</option>
                <option value="Dresses">Dresses</option>
                <option value="Tops">Tops</option>
                <option value="Jackets">Jackets</option>
                <option value="Pants">Pants</option>
                <option value="Skirts">Skirts</option>
                <option value="Shoes">Shoes</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select
                id="price"
                name="price"
                value={filters.price}
                onChange={handleFilterChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Any Price</option>
                <option value="0-100">Under $100</option>
                <option value="100-250">$100 - $250</option>
                <option value="250-500">$250 - $500</option>
                <option value="500">$500+</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;