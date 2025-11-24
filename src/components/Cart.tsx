import React from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import type { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: number, delta: number) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, cart, onClose, onUpdateQuantity }) => {
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-emerald-500/20 shadow-2xl">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b border-gray-800">
            <h3 className="text-2xl font-bold font-mono text-emerald-400">Your Cart</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 font-mono">Your cart is empty</p>
                <p className="text-gray-600 text-sm mt-2">Time to fuel up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-bold font-mono text-white">{item.name}</h4>
                        <p className="text-sm text-gray-400">${item.price}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-mono text-emerald-400 font-bold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-400 font-mono">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-gray-800 p-6 space-y-4">
              <div className="flex justify-between text-lg">
                <span className="font-mono text-gray-400">Total</span>
                <span className="font-bold text-2xl text-emerald-400 font-mono">${cartTotal.toFixed(2)}</span>
              </div>
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold py-4 rounded-lg transition-colors font-mono text-lg">
                Checkout
              </button>
              <p className="text-center text-xs text-gray-500 font-mono">Free shipping on orders over $50</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
