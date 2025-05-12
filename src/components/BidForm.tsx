import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';

interface BidFormProps {
  auctionId: string;
  currentBid: number;
  onBidPlaced?: () => void;
}

const BidForm: React.FC<BidFormProps> = ({ auctionId, currentBid, onBidPlaced }) => {
  const { placeBid } = useAuction();
  const [bidAmount, setBidAmount] = useState<string>((currentBid + 10).toString());
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const minBid = currentBid + 1;

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidAmount(e.target.value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate bid amount
    const amount = Number(bidAmount);
    
    if (isNaN(amount)) {
      setError('Please enter a valid number');
      return;
    }
    
    if (amount <= currentBid) {
      setError(`Bid must be higher than the current bid of $${currentBid}`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      placeBid(auctionId, amount);
      setSuccess(true);
      
      // Reset form
      setBidAmount((amount + 10).toString());
      
      // Reset success message after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
      if (onBidPlaced) {
        onBidPlaced();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
          Your Bid (USD)
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            name="bidAmount"
            id="bidAmount"
            step="0.01"
            min={minBid}
            value={bidAmount}
            onChange={handleBidChange}
            className={`block w-full rounded-md pl-7 pr-12 focus:border-teal-500 focus:ring-teal-500 sm:text-sm ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0.00"
            aria-describedby="price-currency"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm" id="price-currency">
              USD
            </span>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <p className="mt-2 text-sm text-gray-500">
          Minimum bid: ${minBid}
        </p>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500'
        }`}
      >
        {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
      </button>
      
      {success && (
        <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm">
          Your bid has been placed successfully!
        </div>
      )}
    </form>
  );
};

export default BidForm;