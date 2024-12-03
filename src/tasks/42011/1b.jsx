import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const products = [
  {
    id: 1,
    name: "Product 1",
    price: 19.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Product 2",
    price: 29.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Product 3",
    price: 39.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Product 4",
    price: 49.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 5,
    name: "Product 5",
    price: 59.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 6,
    name: "Product 6",
    price: 69.99,
    image: "https://via.placeholder.com/150",
  },
];

function ProductCard({ product, addToCart }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 object-cover"
        />
      </CardHeader>
      <CardContent>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>${product.price.toFixed(2)}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button onClick={() => addToCart(product)}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}

function CartItem({ item, updateQuantity, removeFromCart }) {
  return (
    <div className="flex justify-between items-center mb-2">
      <div>
        <p>{item.name}</p>
        <p>${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center">
        <Button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
          -
        </Button>
        <span className="mx-2">{item.quantity}</span>
        <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
          +
        </Button>
        <Button onClick={() => removeFromCart(item.id)} className="ml-2">
          Remove
        </Button>
      </div>
    </div>
  );
}

function Cart({ cart, updateQuantity, removeFromCart, total, onCheckout }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Cart</h2>
      {cart.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      ))}
      <div className="mt-4">
        <p className="font-bold">Total: ${total.toFixed(2)}</p>
        <Button onClick={onCheckout} className="mt-2 w-full">
          Checkout
        </Button>
      </div>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setIsCheckoutDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Online Store</h1>
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-2"
          />
          <Button onClick={() => setIsCartOpen(true)}>
            Cart ({cart.length})
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-lg">
            <Button
              onClick={() => setIsCartOpen(false)}
              className="absolute top-2 right-2"
            >
              Close
            </Button>
            <Cart
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              total={total}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      )}

      <Dialog
        open={isCheckoutDialogOpen}
        onOpenChange={setIsCheckoutDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout Confirmation</DialogTitle>
          </DialogHeader>
          <p>Thank you for your purchase! Your total is ${total.toFixed(2)}.</p>
          <DialogFooter>
            <Button onClick={() => setIsCheckoutDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
