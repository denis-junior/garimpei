import React from 'react';
import { ShoppingBag, Heart, Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center mb-4">
              <ShoppingBag className="h-8 w-8 text-teal-400" />
              <span className="ml-2 text-xl font-bold text-white">Garimpei</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Discover unique fashion pieces and bid on your favorite items. Find vintage treasures and designer gems.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Auctions
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Brands
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Trending
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Sell</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/producer" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Create Auction
                </Link>
              </li>
              <li>
                <Link to="/producer" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Tips for Sellers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Garimpei Auction App. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for fashion lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;