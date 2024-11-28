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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Mock data for predefined cities
const mockCities = [
  {
    name: "New York",
    temp: 15,
    humidity: 65,
    windSpeed: 10,
    sunrise: "06:30",
    sunset: "19:45",
    forecast: [14, 16, 13, 17, 15],
  },
  {
    name: "London",
    temp: 10,
    humidity: 80,
    windSpeed: 15,
    sunrise: "07:00",
    sunset: "18:30",
    forecast: [9, 11, 10, 12, 9],
  },
  {
    name: "Tokyo",
    temp: 22,
    humidity: 70,
    windSpeed: 8,
    sunrise: "05:00",
    sunset: "18:00",
    forecast: [20, 23, 21, 24, 22],
  },
  {
    name: "Sydney",
    temp: 25,
    humidity: 50,
    windSpeed: 20,
    sunrise: "06:00",
    sunset: "17:00",
    forecast: [24, 26, 25, 27, 25],
  },
  // ... Add more cities as needed
];

function WeatherCard({ city, unit, onDelete }) {
  const [isCelsius, setIsCelsius] = useState(true);
  const toggleUnit = () => setIsCelsius(!isCelsius);

  const displayTemp = isCelsius ? city.temp : (city.temp * 9) / 5 + 32;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{city.name}</CardTitle>
        <CardDescription>{isCelsius ? "°C" : "°F"}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Temperature: {displayTemp.toFixed(1)} {isCelsius ? "°C" : "°F"}
        </p>
        <p>Humidity: {city.humidity}%</p>
        <p>Wind Speed: {city.windSpeed} km/h</p>
        <p>Sunrise: {city.sunrise}</p>
        <p>Sunset: {city.sunset}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onDelete}>Delete</Button>
        <Switch checked={!isCelsius} onCheckedChange={toggleUnit} />
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [cityName, setCityName] = useState("");
  const [cities, setCities] = useState([]);
  const [unit, setUnit] = useState("Celsius");
  const [tempFilter, setTempFilter] = useState("all");

  const handleSearch = () => {
    const foundCity = mockCities.find(
      (city) => city.name.toLowerCase() === cityName.toLowerCase()
    );
    if (foundCity && !cities.some((city) => city.name === foundCity.name)) {
      setCities([...cities, foundCity]);
    }
    setCityName("");
  };

  const deleteCity = (cityToDelete) => {
    setCities(cities.filter((city) => city.name !== cityToDelete.name));
  };

  const filteredCities = cities.filter((city) => {
    switch (tempFilter) {
      case "<10":
        return city.temp < 10;
      case "10-20":
        return city.temp >= 10 && city.temp <= 20;
      case ">20":
        return city.temp > 20;
      default:
        return true;
    }
  });

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Weather Forecast</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Enter city name"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>Search</Button>
        <div className="flex items-center">
          <Label htmlFor="unit">Fahrenheit</Label>
          <Switch
            id="unit"
            checked={unit === "Fahrenheit"}
            onCheckedChange={() =>
              setUnit(unit === "Celsius" ? "Fahrenheit" : "Celsius")
            }
            className="ml-2"
          />
        </div>
      </div>
      <div className="mb-4">
        <Label>Temperature Filter:</Label>
        <select
          onChange={(e) => setTempFilter(e.target.value)}
          className="ml-2 border p-1"
        >
          <option value="all">All</option>
          <option value="<10">&lt;10°C</option>
          <option value="10-20">10-20°C</option>
          <option value=">20">&gt;20°C</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCities.map((city, index) => (
          <WeatherCard
            key={index}
            city={city}
            unit={unit}
            onDelete={() => deleteCity(city)}
          />
        ))}
      </div>
    </div>
  );
}
