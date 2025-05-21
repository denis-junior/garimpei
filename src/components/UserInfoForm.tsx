import React, { useState } from 'react';
import { User } from '../types';
import { useAuction } from '../context/AuctionContext';

interface UserInfoFormProps {
  user: User;
  onClose?: () => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ user, onClose }) => {
  const { updateUser } = useAuction();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    number: user.number,
    instagram: user.instagram,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) errors.name = 'Nome obrigatório';
    if (!formData.email.trim()) errors.email = 'Email obrigatório';
    if (!formData.email.includes('@')) errors.email = 'Format de email inválido';
    if (!formData.number.trim()) errors.number = 'Número obrigatório';
    if (!formData.instagram.trim()) errors.instagram = 'Instagram obrigatório';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    
    updateUser({
      ...user,
      name: formData.name,
      email: formData.email,
      number: formData.number,
      instagram: formData.instagram,
    });
    
    setSuccess(true);
    
    setTimeout(() => {
      setSuccess(false);
      if (onClose) onClose();
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome Completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
            formErrors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formErrors.name && (
          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
            formErrors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formErrors.email && (
          <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
          Número
        </label>
        <input
          type="text"
          id="number"
          name="number"
          placeholder='(XX) XXXXX-XXXX'
          value={formData.number}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
            formErrors.number ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formErrors.number && (
          <p className="mt-1 text-sm text-red-600">{formErrors.number}</p>
        )}
      </div>
      <div>
        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
          Instagram
        </label>
        <input
          type="text"
          id="instagram"
          name="instagram"
          placeholder='meu_usuario'
          value={formData.instagram}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
            formErrors.instagram ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formErrors.instagram && (
          <p className="mt-1 text-sm text-red-600">{formErrors.instagram}</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Save Changes
        </button>
      </div>
      
      {success && (
        <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm">
          Your information has been updated successfully!
        </div>
      )}
    </form>
  );
};

export default UserInfoForm;