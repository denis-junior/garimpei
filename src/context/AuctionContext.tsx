import React, { createContext, useState, useContext } from 'react';
import { Auction, Bid, User } from '../types';
import { auctions as mockAuctions, currentUser as mockUser } from '../mock/data';

interface AuctionContextType {
  auctions: Auction[];
  currentUser: User;
  addAuction: (auction: Omit<Auction, 'id' | 'bids' | 'status'>) => void;
  updateAuction: (auction: Auction) => void;
  deleteAuction: (id: string) => void;
  placeBid: (auctionId: string, amount: number) => void;
  getAuction: (id: string) => Auction | undefined;
  getUserAuctions: () => Auction[];
  updateUser: (user: User) => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auctions, setAuctions] = useState<Auction[]>(mockAuctions);
  const [currentUser, setCurrentUser] = useState<User>(mockUser);

  // Add new auction
  const addAuction = (auctionData: Omit<Auction, 'id' | 'bids' | 'status'>) => {
    const newAuction: Auction = {
      ...auctionData,
      id: `auction${auctions.length + 1}`,
      bids: [],
      status: new Date(auctionData.startDate) > new Date() ? 'upcoming' : 'active',
    };

    setAuctions([...auctions, newAuction]);
    
    // Update user's created auctions
    setCurrentUser({
      ...currentUser,
      createdAuctions: [...currentUser.createdAuctions, newAuction.id]
    });
  };

  // Update existing auction
  const updateAuction = (updatedAuction: Auction) => {
    setAuctions(auctions.map(auction => 
      auction.id === updatedAuction.id ? updatedAuction : auction
    ));
  };

  // Delete auction
  const deleteAuction = (id: string) => {
    setAuctions(auctions.filter(auction => auction.id !== id));
    
    // Update user's created auctions
    setCurrentUser({
      ...currentUser,
      createdAuctions: currentUser.createdAuctions.filter(auctionId => auctionId !== id)
    });
  };

  // Place bid
  const placeBid = (auctionId: string, amount: number) => {
    const auction = auctions.find(a => a.id === auctionId);
    
    if (!auction) return;
    
    if (amount <= auction.currentBid) {
      throw new Error('Bid amount must be higher than current bid');
    }
    
    const newBid: Bid = {
      id: `bid${Date.now()}`,
      auctionId,
      userId: currentUser.id,
      amount,
      timestamp: new Date().toISOString()
    };
    
    const updatedAuction = {
      ...auction,
      currentBid: amount,
      bids: [...auction.bids, newBid]
    };
    
    updateAuction(updatedAuction);
    
    // Update user's participated auctions if it's a new participation
    if (!currentUser.participatedAuctions.includes(auctionId)) {
      setCurrentUser({
        ...currentUser,
        participatedAuctions: [...currentUser.participatedAuctions, auctionId]
      });
    }
  };

  // Get auction by ID
  const getAuction = (id: string) => {
    return auctions.find(auction => auction.id === id);
  };

  // Get auctions created by current user
  const getUserAuctions = () => {
    return auctions.filter(auction => auction.producerId === currentUser.id);
  };

  // Update user information
  const updateUser = (user: User) => {
    setCurrentUser(user);
  };

  return (
    <AuctionContext.Provider
      value={{
        auctions,
        currentUser,
        addAuction,
        updateAuction,
        deleteAuction,
        placeBid,
        getAuction,
        getUserAuctions,
        updateUser
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};