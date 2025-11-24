import React from 'react';
import { Code, Heart, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-b border-emerald-500/20">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"></div>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #10b981 2px, #10b981 4px)',
          backgroundSize: '100% 4px'
        }}
      ></div>
      <div className="max-w-7xl mx-auto px-4 py-24 relative">
        <div className="max-w-3xl">
          <div className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-6">
            <span className="text-emerald-400 text-sm font-mono">100% Organic • Fair Trade Certified</span>
          </div>
          <h2 className="text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Fuel Your</span>
            <br />
            <span className="text-emerald-400 font-mono">&lt;Grind /&gt;</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Premium organic coffee for developers, designers, and builders who ship.
            Because great code requires great coffee.
          </p>
          <div className="flex gap-4 font-mono text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Built for makers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Heart className="w-4 h-4 text-emerald-400" />
              <span>Ethically sourced</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Shipped fresh</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
