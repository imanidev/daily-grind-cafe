import React, { memo } from 'react';
import { Coffee } from 'lucide-react';

const Footer: React.FC = memo(() => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <Coffee className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <p className="text-gray-400 mb-2 font-mono">Daily Grind Coffee Co.</p>
        <p className="text-gray-500 text-sm">Code. Create. Caffeinate.</p>
        <p className="text-gray-600 text-xs mt-4 font-mono">© 2024 • Brewed with ❤️ for builders</p>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
