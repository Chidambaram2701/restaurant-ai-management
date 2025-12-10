import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { WaiterIcon } from './icons/WaiterIcon';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { FeedbackIcon } from './icons/FeedbackIcon';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-white font-bold text-xl">
              RestroAI
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" className={navLinkClass}>
                  <WaiterIcon className="h-5 w-5 mr-2" />
                  Table View
                </NavLink>
                <NavLink to="/kitchen" className={navLinkClass}>
                  <ChefHatIcon className="h-5 w-5 mr-2" />
                  Kitchen KOT
                </NavLink>
                <NavLink to="/dashboard" className={navLinkClass}>
                  <DashboardIcon className="h-5 w-5 mr-2" />
                  Dashboard
                </NavLink>
                 <NavLink to="/dashboard" className={navLinkClass}>
                  <FeedbackIcon className="h-5 w-5 mr-2" />
                  Feedback
                </NavLink>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
                <WaiterIcon className="h-5 w-5 mr-2" />
                Table View
            </NavLink>
            <NavLink to="/kitchen" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
                <ChefHatIcon className="h-5 w-5 mr-2" />
                Kitchen KOT
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
                <DashboardIcon className="h-5 w-5 mr-2" />
                Dashboard
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
                <FeedbackIcon className="h-5 w-5 mr-2" />
                Feedback
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
