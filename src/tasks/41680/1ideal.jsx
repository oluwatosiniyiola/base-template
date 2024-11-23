import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm, Controller } from "react-hook-form";

export default function App() {
  const [preview, setPreview] = useState("No preview available");
  const [price, setPrice] = useState(0);
  const [config, setConfig] = useState({
    color: "#ffffff",
    size: "M",
    material: "Cotton",
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleCustomizationChange = (name, value) => {
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreviewUpdate = () => {
    setPreview(
      `Preview for color: ${config.color}, size: ${config.size}, material: ${config.material}`
    );
  };

  const calculatePrice = () => {
    let totalPrice = 10; // Base price
    if (config.material === "Silk") totalPrice += 5;
    if (config.size === "L") totalPrice += 3;
    if (config.size === "XL") totalPrice += 4;
    setPrice(totalPrice);
  };

  const handleSave = () => {
    alert("Configuration saved!");
  };

  const onSubmit = (data) => {
    handleCustomizationChange("color", data.color);
    handleCustomizationChange("size", data.size);
    handleCustomizationChange("material", data.material);
    handlePreviewUpdate();
    calculatePrice();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-semibold mb-8 text-center">
        Product Customization
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Customization Card */}
        <Card>
          <CardHeader>
            <CardTitle>Customize Your Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {/* Color Picker */}
                <FormField
                  control={control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <input
                          type="color"
                          value={config.color}
                          onChange={(e) =>
                            handleCustomizationChange("color", e.target.value)
                          }
                          className="w-full h-10 bg-transparent border-2 border-gray-300 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Size Selector */}
                <FormField
                  control={control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={(value) =>
                            handleCustomizationChange("size", value)
                          }
                        >
                          <SelectItem value="S">Small</SelectItem>
                          <SelectItem value="M">Medium</SelectItem>
                          <SelectItem value="L">Large</SelectItem>
                          <SelectItem value="XL">Extra Large</SelectItem>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Material Selector */}
                <FormField
                  control={control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={(value) =>
                            handleCustomizationChange("material", value)
                          }
                        >
                          <SelectItem value="Cotton">Cotton</SelectItem>
                          <SelectItem value="Silk">Silk</SelectItem>
                          <SelectItem value="Polyester">Polyester</SelectItem>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="mt-4 w-full bg-indigo-600">
                Apply Customization
              </Button>
            </Form>
          </CardContent>
        </Card>

        {/* Product Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Live Product Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60 flex justify-center items-center bg-gray-800 text-center text-lg rounded-lg">
              <p>{preview}</p>
            </div>
          </CardContent>
        </Card>

        {/* Price Calculation Card */}
        <Card>
          <CardHeader>
            <CardTitle>Price Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Price: ${price}</p>
            <ul>
              <li>Base Price: $10</li>
              {config.material === "Silk" && (
                <li>Material Upgrade (Silk): +$5</li>
              )}
              {config.size === "L" && <li>Size Upgrade (Large): +$3</li>}
              {config.size === "XL" && <li>Size Upgrade (Extra Large): +$4</li>}
            </ul>
          </CardContent>
        </Card>

        {/* Order Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Color:</strong> {config.color}
              </p>
              <p>
                <strong>Size:</strong> {config.size}
              </p>
              <p>
                <strong>Material:</strong> {config.material}
              </p>
            </div>
            <div className="mt-4">
              <Button onClick={handleSave} className="w-full bg-green-600">
                Save Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
