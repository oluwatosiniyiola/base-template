import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const products = [
  {
    id: 1,
    title: "Smartphone",
    description: "Latest model",
    price: 999,
    category: "Electronics",
  },
  {
    id: 2,
    title: "Laptop",
    description: "Powerful performance",
    price: 1299,
    category: "Electronics",
  },
  {
    id: 3,
    title: "T-shirt",
    description: "Cotton comfort",
    price: 29,
    category: "Clothing",
  },
  {
    id: 4,
    title: "Jeans",
    description: "Stylish denim",
    price: 79,
    category: "Clothing",
  },
  {
    id: 5,
    title: "Book",
    description: "Bestseller novel",
    price: 19,
    category: "Books",
  },
];

const categories = ["All", "Electronics", "Clothing", "Books"];

function ProductList({ addToCart, selectedCategory }) {
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>{product.title}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">${product.price}</p>
            <p className="text-sm text-gray-500">{product.category}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => addToCart(product)}>Add to Cart</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function Cart({ cart, updateQuantity, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between items-center mb-2">
          <span>{item.title}</span>
          <div>
            <Input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.id, parseInt(e.target.value))
              }
              className="w-16 mr-2"
            />
            <Button
              onClick={() => removeFromCart(item.id)}
              variant="destructive"
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      <p className="text-xl font-bold mt-4">Total: ${total}</p>
    </div>
  );
}

function Checkout({ cart }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order placed successfully! (This is a mock payment process)");
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <Input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        <Input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleInputChange}
          required
        />
        <Input
          name="zipCode"
          placeholder="Zip Code"
          value={formData.zipCode}
          onChange={handleInputChange}
          required
        />
        <Input
          name="cardNumber"
          placeholder="Card Number"
          value={formData.cardNumber}
          onChange={handleInputChange}
          required
        />
        <Input
          name="expiryDate"
          placeholder="Expiry Date (MM/YY)"
          value={formData.expiryDate}
          onChange={handleInputChange}
          required
        />
        <Input
          name="cvv"
          placeholder="CVV"
          value={formData.cvv}
          onChange={handleInputChange}
          required
        />
        <Button type="submit">Place Order</Button>
      </form>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCheckout, setShowCheckout] = useState(false);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">E-Commerce Store</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="mb-4">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ProductList
            addToCart={addToCart}
            selectedCategory={selectedCategory}
          />
        </div>
        <div className="md:w-1/3">
          <Cart
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
          {cart.length > 0 && (
            <Button onClick={() => setShowCheckout(true)} className="mt-4">
              Proceed to Checkout
            </Button>
          )}
        </div>
      </div>
      {showCheckout && <Checkout cart={cart} />}
    </div>
  );
}
