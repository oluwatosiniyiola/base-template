import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const products = [
  { id: 1, name: "T-Shirt", price: 19.99, image: "tshirt.jpg" },
  { id: 2, name: "Jeans", price: 49.99, image: "jeans.jpg" },
  { id: 3, name: "Sneakers", price: 89.99, image: "sneakers.jpg" },
  { id: 4, name: "Hat", price: 15.99, image: "hat.jpg" },
  // Add more products as needed
];

function ProductCard({ product, onAddToCart }) {
  return (
    <Card className="w-full sm:w-64">
      <CardHeader>
        <img
          src={product.image}
          alt={product.name}
          className="h-40 w-full object-cover"
        />
      </CardHeader>
      <CardContent>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>${product.price.toFixed(2)}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onAddToCart(product)}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}

function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="flex justify-between items-center mb-2">
      <span>
        {item.name} x {item.quantity}
      </span>
      <div>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => onUpdate(item, parseInt(e.target.value))}
          className="w-16 mr-2"
        />
        <Button onClick={() => onRemove(item)} variant="destructive">
          Remove
        </Button>
      </div>
    </div>
  );
}

function Cart({
  isOpen,
  onClose,
  cart,
  onUpdateItem,
  onRemoveItem,
  onCheckout,
}) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Shopping Cart</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdate={onUpdateItem}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
        <div className="mt-4 text-right font-bold">
          Total: ${total.toFixed(2)}
        </div>
        <DialogFooter>
          <Button onClick={onCheckout}>Checkout</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);

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

  const updateCartItem = (item, quantity) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: Math.max(1, quantity) }
          : cartItem
      )
    );
  };

  const removeFromCart = (item) => {
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem.id !== item.id)
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckout = () => {
    setIsCheckoutDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search products..."
          className="w-full sm:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={() => setIsCartOpen(true)} className="ml-4">
          Cart <Badge className="ml-2">{cart.length}</Badge>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateItem={updateCartItem}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
      <Dialog
        open={isCheckoutDialogOpen}
        onOpenChange={setIsCheckoutDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>Thank you for your purchase!</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setCart([]);
                setIsCheckoutDialogOpen(false);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
        XX
      </Dialog>
    </div>
  );
}
