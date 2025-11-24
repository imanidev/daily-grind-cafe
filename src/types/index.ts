export interface Product {
  id: number;
  name: string;
  roast: string;
  notes: string;
  price: number;
  intensity: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface BrewingStep {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}
