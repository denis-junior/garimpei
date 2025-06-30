import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useUser } from "../hooks/useUser";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigationsItems, UserType } from "@/core/navigationsItems";
const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut } = useUser();
  const location = useLocation();
  const navigationItems = useNavigationsItems();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-teal-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                Garimpei
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => {
              if (item.type === UserType.SELLER && !user?.seller) return null;
              if (!item.offToken && !user) return null;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "text-teal-600 border-b-2 border-teal-500"
                      : "text-gray-600 hover:text-teal-500"
                  }`}
                >
                  {item.icon}
                  <span className="ml-1">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <div className="hidden md:flex items-center cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-teal-800">
                          {user?.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.name.split(" ")[0]}
                    </div>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flexgap-2">
                  <div
                    className=" items-center gap-4 bg-red-200 p-2 rounded-md text-center cursor-pointer"
                    onClick={logOut}
                  >
                    Sair
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="hidden md:flex space-x-4">
              <Link
                to="/auth/login"
                className="hidden md:inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-500 hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                Entrar
              </Link>
              <Link
                to="/auth/register/buyer"
                className="hidden md:inline-flex items-center px-3 py-2 text-sm font-medium text-teal-600 bg-teal-100 hover:bg-teal-200 rounded-md transition-colors duration-200"
              >
                Registrar
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-teal-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          {navigationItems.map((item) => {
            if (item.type === UserType.SELLER && !user?.seller) return null;
            if (!item.offToken && !user) return null;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMenu}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-teal-50 text-teal-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-teal-500"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            );
          })}
          {user ? (
            <div className="pt-4 pb-2 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-teal-800">
                      {user?.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center px-4 py-2">
              <Link
                to="/auth/login"
                className="text-sm font-medium text-gray-700 hover:text-teal-500"
              >
                Entrar
              </Link>
              <span className="mx-2">|</span>
              <Link
                to="/auth/register/buyer"
                className="text-sm font-medium text-teal-600 hover:text-teal-500"
              >
                Registrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
