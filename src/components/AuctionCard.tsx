import React from 'react';
import { Link } from 'react-router-dom';
import { Auction } from '../types';
import CountdownTimer from './CountdownTimer';
import { Clock, Tag } from 'lucide-react';

interface AuctionCardProps {
  auction: Auction;
  compact?: boolean;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, compact = false }) => {
  const { id, title, images, currentBid, size, endDate } = auction;

  return (
    <Link 
      to={`/auction/${id}`}
      className="group block bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative">
        <img 
          src={images[0]} 
          alt={title} 
          className="w-full h-48 sm:h-64 object-cover object-center"
        />
        
        <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 m-2 rounded-md text-sm">
          <span className="flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            {size}
          </span>
        </div>
        
        {!compact && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <CountdownTimer endDate={endDate} />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
          {title}
        </h3>
                
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Lance atual</p>
            <p className="text-lg font-bold text-teal-600">${currentBid}</p>
          </div>
          
          {compact && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <CountdownTimer endDate={endDate} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;