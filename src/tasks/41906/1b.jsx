import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Predefined city data
const cities = [
  {
    name: "New York",
    temp: 22,
    humidity: 60,
    wind_speed: 10,
    sunrise: "06:00",
    sunset: "20:00",
  },
  {
    name: "London",
    temp: 15,
    humidity: 70,
    wind_speed: 8,
    sunrise: "05:30",
    sunset: "21:00",
  },
  {
    name: "Tokyo",
    temp: 28,
    humidity: 65,
    wind_speed: 12,
    sunrise: "04:30",
    sunset: "19:00",
  },
  {
    name: "Paris",
    temp: 18,
    humidity: 55,
    wind_speed: 6,
    sunrise: "06:15",
    sunset: "21:30",
  },
  {
    name: "Sydney",
    temp: 25,
    humidity: 50,
    wind_speed: 15,
    sunrise: "06:30",
    sunset: "17:30",
  },
  {
    name: "Moscow",
    temp: 5,
    humidity: 75,
    wind_speed: 9,
    sunrise: "04:00",
    sunset: "22:00",
  },
  {
    name: "Dubai",
    temp: 35,
    humidity: 40,
    wind_speed: 7,
    sunrise: "05:45",
    sunset: "19:15",
  },
  {
    name: "Rio de Janeiro",
    temp: 30,
    humidity: 80,
    wind_speed: 11,
    sunrise: "06:00",
    sunset: "18:00",
  },
  {
    name: "Cape Town",
    temp: 20,
    humidity: 60,
    wind_speed: 14,
    sunrise: "07:00",
    sunset: "18:30",
  },
  {
    name: "Mumbai",
    temp: 32,
    humidity: 75,
    wind_speed: 8,
    sunrise: "06:15",
    sunset: "19:45",
  },
];

// Generate 5-day forecast data
const generateForecast = (baseTemp) => {
  return Array.from({ length: 5 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri"][i],
    temp: baseTemp + Math.floor(Math.random() * 5) - 2,
  }));
};

const WeatherCard = ({ city, unit, forecast }) => {
  const tempUnit = unit === "celsius" ? "°C" : "°F";
  const temp =
    unit === "celsius" ? city.temp : Math.round((city.temp * 9) / 5 + 32);

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>{city.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold mb-4">
          {temp}
          {tempUnit}
        </p>
        <p>Humidity: {city.humidity}%</p>
        <p>Wind Speed: {city.wind_speed} km/h</p>
        <p>Sunrise: {city.sunrise}</p>
        <p>Sunset: {city.sunset}</p>
        <div className="mt-4">
          <h3 className="font-bold mb-2">5-Day Forecast</h3>
          <div className="flex justify-between">
            {forecast.map((day) => (
              <div key={day.day} className="text-center">
                <p>{day.day}</p>
                <p>
                  {unit === "celsius"
                    ? day.temp
                    : Math.round((day.temp * 9) / 5 + 32)}
                  {tempUnit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [unit, setUnit] = useState("celsius");
  const [tempFilter, setTempFilter] = useState("all");
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    if (selectedCity) {
      setForecast(generateForecast(selectedCity.temp));
    }
  }, [selectedCity]);

  const handleSearch = () => {
    const city = cities.find(
      (c) => c.name.toLowerCase() === searchTerm.toLowerCase()
    );
    setSelectedCity(city || null);
  };

  const filteredCities = cities.filter((city) => {
    if (tempFilter === "all") return true;
    if (tempFilter === "cold") return city.temp < 10;
    if (tempFilter === "mild") return city.temp >= 10 && city.temp <= 20;
    if (tempFilter === "hot") return city.temp > 20;
    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Weather Forecast App</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          type="text"
          placeholder="Enter city name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Select value={unit} onValueChange={setUnit}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Temperature Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="celsius">Celsius</SelectItem>
            <SelectItem value="fahrenheit">Fahrenheit</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tempFilter} onValueChange={setTempFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Temperature Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="cold">Cold (&lt;10°C)</SelectItem>
            <SelectItem value="mild">Mild (10-20°C)</SelectItem>
            <SelectItem value="hot">Hot (&gt;20°C)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {selectedCity && (
        <WeatherCard city={selectedCity} unit={unit} forecast={forecast} />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {filteredCities.map((city) => (
          <Card
            key={city.name}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedCity(city)}
          >
            <CardHeader>
              <CardTitle>{city.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {unit === "celsius"
                  ? city.temp
                  : Math.round((city.temp * 9) / 5 + 32)}
                {unit === "celsius" ? "°C" : "°F"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
