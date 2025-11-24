import React from 'react';
import { Coffee, Code, Zap, Leaf } from 'lucide-react';
import type { BrewingStep } from '../types';

const brewingSteps: BrewingStep[] = [
  {
    title: "Source",
    description: "We partner directly with small-scale farmers who use sustainable, organic practices. Fair trade isn't just a label—it's a commitment to paying 30% above market rates.",
    icon: Leaf
  },
  {
    title: "Roast",
    description: "Small-batch roasting in our tech-monitored facility. Every bean is tracked with precision sensors, ensuring consistency from the first cup to the last.",
    icon: Zap
  },
  {
    title: "Test",
    description: "Our QA team (yes, we call them that) cup-tests every batch. If it doesn't pass our rigorous quality gates, it doesn't ship. Simple as that.",
    icon: Code
  },
  {
    title: "Ship",
    description: "Packed fresh to order and shipped within 48 hours. We treat your coffee like production code—fast, reliable, and always delivered on time.",
    icon: Coffee
  }
];

const BrewingProcess: React.FC = () => {
  return (
    <section className="bg-gray-800/30 border-y border-emerald-500/20 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 font-mono text-emerald-400">
            This Is How We Brew It
          </h3>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From bean to bag, every step is optimized for quality. Think of it as our CI/CD pipeline—but for coffee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {brewingSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-emerald-500/50 transition-all h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-emerald-500/20 p-3 rounded-lg">
                      <IconComponent className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-emerald-400 font-mono text-xs">Step {index + 1}</span>
                      <h4 className="text-xl font-bold text-white font-mono">{step.title}</h4>
                    </div>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
                {index < brewingSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-emerald-500 text-2xl z-10">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-lg p-8 text-center">
          <h4 className="text-2xl font-bold mb-3 text-white">The Result?</h4>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Coffee that's as meticulously crafted as your code. Every bag is traceable, sustainable, and guaranteed to keep you in flow state. We're not just selling coffee—we're shipping excellence.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrewingProcess;
