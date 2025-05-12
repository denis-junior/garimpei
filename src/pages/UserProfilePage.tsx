import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { Edit, ClipboardList, Clock } from 'lucide-react';
import UserInfoForm from '../components/UserInfoForm';
import { auctionHistory } from '../mock/data';

const UserProfilePage: React.FC = () => {
  const { currentUser } = useAuction();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
              {!isEditing && (
                <button
                  onClick={toggleEdit}
                  className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-teal-50 text-teal-700 rounded-md hover:bg-teal-100 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
            
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'info'
                    ? 'text-teal-600 border-b-2 border-teal-500'
                    : 'text-gray-500 hover:text-teal-500'
                }`}
              >
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'text-teal-600 border-b-2 border-teal-500'
                    : 'text-gray-500 hover:text-teal-500'
                }`}
              >
                Auction History
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'preferences'
                    ? 'text-teal-600 border-b-2 border-teal-500'
                    : 'text-gray-500 hover:text-teal-500'
                }`}
              >
                Preferences
              </button>
            </div>
            
            <div className="py-6">
              {activeTab === 'info' && (
                isEditing ? (
                  <UserInfoForm user={currentUser} onClose={toggleEdit} />
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="mt-1 text-lg text-gray-800">{currentUser.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                      <p className="mt-1 text-lg text-gray-800">{currentUser.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Delivery Address</h3>
                      <p className="mt-1 text-lg text-gray-800">{currentUser.address}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Account Summary</h3>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                          <ClipboardList className="h-8 w-8 text-purple-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-purple-800">Created Auctions</p>
                            <p className="text-2xl font-bold text-purple-600">{currentUser.createdAuctions.length}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-4 bg-teal-50 rounded-lg">
                          <Clock className="h-8 w-8 text-teal-600" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-teal-800">Bids Placed</p>
                            <p className="text-2xl font-bold text-teal-600">{currentUser.participatedAuctions.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
              
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Auction History</h2>
                  
                  {auctionHistory.length === 0 ? (
                    <p className="text-gray-500">You haven't participated in any auctions yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {auctionHistory.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                <div className="text-sm text-gray-500">{item.role === 'seller' ? 'You sold' : 'You bid'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{item.brand}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">${item.finalPrice}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  item.status === 'sold' ? 'bg-green-100 text-green-800' : 
                                  item.status === 'won' ? 'bg-teal-100 text-teal-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Preferences</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-3">Preferred Sizes</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.preferences.sizes.map((size) => (
                          <span key={size} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-3">Favorite Brands</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.preferences.brands.map((brand) => (
                          <span key={brand} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.preferences.categories.map((category) => (
                          <span key={category} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Edit Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;