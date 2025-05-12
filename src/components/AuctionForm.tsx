import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { addDays } from 'date-fns';

interface AuctionFormProps {
  onSubmitSuccess?: () => void;
}

const AuctionForm: React.FC<AuctionFormProps> = ({ onSubmitSuccess }) => {
  const { addAuction, currentUser } = useAuction();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: ['https://images.pexels.com/photos/6770031/pexels-photo-6770031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'],
    size: '',
    brand: '',
    category: '',
    startingPrice: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: addDays(new Date(), 7).toISOString().split('T')[0]
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.size.trim()) errors.size = 'Size is required';
    if (!formData.brand.trim()) errors.brand = 'Brand is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    
    if (!formData.startingPrice || isNaN(Number(formData.startingPrice)) || Number(formData.startingPrice) <= 0) {
      errors.startingPrice = 'Starting price must be a positive number';
    }
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate <= startDate) {
      errors.endDate = 'End date must be after start date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    addAuction({
      title: formData.title,
      description: formData.description,
      images: [formData.images[0]], // For simplicity, just using one image
      size: formData.size,
      brand: formData.brand,
      category: formData.category,
      startingPrice: Number(formData.startingPrice),
      currentBid: Number(formData.startingPrice),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      producerId: currentUser.id
    });
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      images: ['https://images.pexels.com/photos/6770031/pexels-photo-6770031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'],
      size: '',
      brand: '',
      category: '',
      startingPrice: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: addDays(new Date(), 7).toISOString().split('T')[0]
    });
    
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Item Name
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
            formErrors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Vintage Leather Jacket"
        />
        {formErrors.title && (
          <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
            formErrors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe the item in detail, including condition, history, etc."
        />
        {formErrors.description && (
          <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
              formErrors.brand ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Zara, H&M, Nike"
          />
          {formErrors.brand && (
            <p className="mt-1 text-sm text-red-600">{formErrors.brand}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
              formErrors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Category</option>
            <option value="Dresses">Dresses</option>
            <option value="Tops">Tops</option>
            <option value="Jackets">Jackets</option>
            <option value="Pants">Pants</option>
            <option value="Skirts">Skirts</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>
          {formErrors.category && (
            <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
            Size
          </label>
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
              formErrors.size ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Size</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="XXXL">XXXL</option>
          </select>
          {formErrors.size && (
            <p className="mt-1 text-sm text-red-600">{formErrors.size}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Starting Price ($)
          </label>
          <input
            type="number"
            id="startingPrice"
            name="startingPrice"
            value={formData.startingPrice}
            onChange={handleChange}
            min="1"
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
              formErrors.startingPrice ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {formErrors.startingPrice && (
            <p className="mt-1 text-sm text-red-600">{formErrors.startingPrice}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
              formErrors.endDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.endDate && (
            <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>
          )}
        </div>
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          className="w-full py-3 px-4 bg-teal-600 text-white font-medium rounded-md shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
        >
          Create Auction
        </button>
      </div>
    </form>
  );
};

export default AuctionForm;