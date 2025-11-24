import React, { memo, useState } from 'react';
import { ShoppingCart, Coffee, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = memo(({ cartCount, onCartClick, onAuthClick }) => {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">Daily Grind</h1>
            <p className="text-xs text-gray-400 font-mono hidden sm:block">v2.0.1</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Auth Button/Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
              >
                <User className="w-6 h-6 text-emerald-400" />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-700">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm text-emerald-400 font-mono truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors font-mono text-sm border border-emerald-500/30"
            >
              Sign In
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-emerald-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
