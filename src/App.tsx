import { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import BrewingProcess from './components/BrewingProcess';
import Cart from './components/Cart';
import Footer from './components/Footer';
import AICoffeeAssistant from './components/AICoffeeAssistant';
import AuthModal from './components/AuthModal';
import { products } from './data/products';
import type { Product, CartItem } from './types';

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const addToCart = useCallback((product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const handleCartOpen = useCallback(() => setCartOpen(true), []);
  const handleCartClose = useCallback(() => setCartOpen(false), []);
  const handleAuthOpen = useCallback(() => setAuthOpen(true), []);
  const handleAuthClose = useCallback(() => setAuthOpen(false), []);

  const cartCount = useMemo(() =>
    cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Header cartCount={cartCount} onCartClick={handleCartOpen} onAuthClick={handleAuthOpen} />
      <Hero />

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold mb-3 font-mono text-emerald-400">The Collection</h3>
          <p className="text-gray-400">Handpicked blends for every stage of your workflow</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </section>

      <BrewingProcess />
      <Footer />

      <Cart
        isOpen={cartOpen}
        cart={cart}
        onClose={handleCartClose}
        onUpdateQuantity={updateQuantity}
      />

      <AuthModal isOpen={authOpen} onClose={handleAuthClose} />

      <AICoffeeAssistant onAddToCart={addToCart} />
    </div>
  );
}

export default App;
