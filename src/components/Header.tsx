import React, { memo } from 'react';
import { ShoppingCart, Coffee } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = memo(({ cartCount, onCartClick }) => {
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
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
