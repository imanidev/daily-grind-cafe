import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-emerald-500/50 transition-all group">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-gray-900/90 px-2 py-1 rounded text-xs font-mono text-emerald-400">
          {product.roast}
        </div>
      </div>
      <div className="p-5">
        <h4 className="text-xl font-bold mb-2 font-mono text-white">{product.name}</h4>
        <p className="text-gray-400 text-sm mb-4">{product.notes}</p>
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${i < product.intensity ? 'bg-emerald-400' : 'bg-gray-700'}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-2 font-mono">Intensity</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-emerald-400 font-mono">${product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 font-mono text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
