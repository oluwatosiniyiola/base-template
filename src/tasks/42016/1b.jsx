import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectItem,
} from "@/components/ui/card";

const products = [
  {
    id: 1,
    title: "Smartphone",
    price: 799,
    category: "Electronics",
    description: "Latest model with high-resolution camera.",
  },
  {
    id: 2,
    title: "Laptop",
    price: 1299,
    category: "Electronics",
    description: "Lightweight with long battery life.",
  },
  {
    id: 3,
    title: "T-shirt",
    price: 20,
    category: "Clothing",
    description: "Comfortable cotton t-shirt.",
  },
  {
    id: 4,
    title: "Jeans",
    price: 50,
    category: "Clothing",
    description: "Durable denim jeans.",
  },
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState("All");
  const [checkout, setCheckout] = useState({ name: "", address: "" });

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

  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (checkout.name && checkout.address) {
      alert("Order placed! (Mock Payment Processed)");
      setCart([]);
      setCheckout({ name: "", address: "" });
    }
  };

  const filteredProducts =
    filter === "All" ? products : products.filter((p) => p.category === filter);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">E-commerce Store</h1>

      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4"
      >
        <SelectItem value="All">All Categories</SelectItem>
        <SelectItem value="Electronics">Electronics</SelectItem>
        <SelectItem value="Clothing">Clothing</SelectItem>
      </Select>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>

      <Cart
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />

      {cart.length > 0 && (
        <CheckoutForm
          checkout={checkout}
          setCheckout={setCheckout}
          handleCheckout={handleCheckout}
        />
      )}
    </div>
  );
}

function ProductCard({ product, addToCart }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.title}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Price: ${product.price}</p>
        <p>Category: {product.category}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => addToCart(product)}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}

function Cart({ cart, updateQuantity, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between items-center mb-2">
          <span>
            {item.title} x {item.quantity}
          </span>
          <div>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.id, parseInt(e.target.value))
              }
              className="w-20"
            />
            <Button onClick={() => removeFromCart(item.id)} className="ml-2">
              Remove
            </Button>
          </div>
        </div>
      ))}
      <div className="mt-4 font-bold">Total: ${total.toFixed(2)}</div>
    </div>
  );
}

function CheckoutForm({ checkout, setCheckout, handleCheckout }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="space-y-4">
        <Label>
          Name:
          <Input
            value={checkout.name}
            onChange={(e) => setCheckout({ ...checkout, name: e.target.value })}
          />
        </Label>
        <Label>
          Address:
          <Input
            value={checkout.address}
            onChange={(e) =>
              setCheckout({ ...checkout, address: e.target.value })
            }
          />
        </Label>
        <Button onClick={handleCheckout}>Place Order</Button>
      </div>
    </div>
  );
}
