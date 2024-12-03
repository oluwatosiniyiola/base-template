import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock data for cities and weather
const cities = ["New York", "London", "Tokyo"];
const mockWeatherData = {
  "New York": {
    current: { temp: 22, humidity: 60, windSpeed: 5, icon: "☀️" },
    forecast: [
      { day: "Mon", temp: 23, description: "Sunny" },
      { day: "Tue", temp: 25, description: "Partly cloudy" },
      { day: "Wed", temp: 21, description: "Rainy" },
      { day: "Thu", temp: 20, description: "Cloudy" },
      { day: "Fri", temp: 24, description: "Sunny" },
    ],
  },
  London: {
    current: { temp: 18, humidity: 70, windSpeed: 4, icon: "🌧️" },
    forecast: [
      { day: "Mon", temp: 19, description: "Rainy" },
      { day: "Tue", temp: 20, description: "Cloudy" },
      { day: "Wed", temp: 18, description: "Rainy" },
      { day: "Thu", temp: 17, description: "Cloudy" },
      { day: "Fri", temp: 21, description: "Partly cloudy" },
    ],
  },
  Tokyo: {
    current: { temp: 28, humidity: 65, windSpeed: 3, icon: "🌤️" },
    forecast: [
      { day: "Mon", temp: 29, description: "Sunny" },
      { day: "Tue", temp: 30, description: "Sunny" },
      { day: "Wed", temp: 28, description: "Partly cloudy" },
      { day: "Thu", temp: 27, description: "Cloudy" },
      { day: "Fri", temp: 29, description: "Sunny" },
    ],
  },
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [apiLimitReached, setApiLimitReached] = useState(false);
  const [lastApiCallTime, setLastApiCallTime] = useState(Date.now());

  useEffect(() => {
    const timer = setTimeout(() => {
      setApiCallCount(0);
      setApiLimitReached(false);
    }, 60000);

    return () => clearTimeout(timer);
  }, [apiCallCount]);

  const fetchWeatherData = () => {
    if (apiCallCount >= 3 && Date.now() - lastApiCallTime < 60000) {
      setApiLimitReached(true);
      return;
    }

    setLoading(true);
    setApiCallCount((prevCount) => prevCount + 1);
    setLastApiCallTime(Date.now());

    setTimeout(() => {
      setWeatherData(mockWeatherData[selectedCity]);
      setLoading(false);
    }, 1000);
  };

  const getBackgroundClass = () => {
    if (!weatherData) return "bg-gray-100";
    const description = weatherData.forecast[0].description.toLowerCase();
    if (description.includes("sunny")) return "bg-yellow-100";
    if (description.includes("rainy")) return "bg-blue-100";
    if (description.includes("cloudy")) return "bg-gray-200";
    return "bg-gray-100";
  };

  return (
    <div className={`min-h-screen p-4 ${getBackgroundClass()}`}>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Weather App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={fetchWeatherData}
              disabled={!selectedCity || loading}
              className="w-full"
            >
              {loading ? "Loading..." : "Fetch Weather Data"}
            </Button>
            {apiLimitReached && (
              <Alert variant="destructive">
                <AlertTitle>API Limit Reached</AlertTitle>
                <AlertDescription>
                  You can only make 3 requests per minute. Please try again
                  later.
                </AlertDescription>
              </Alert>
            )}
            {weatherData && (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{selectedCity}</h2>
                  <p className="text-4xl font-bold">
                    {weatherData.current.temp}°C
                  </p>
                  <p className="text-6xl">{weatherData.current.icon}</p>
                  <p>Humidity: {weatherData.current.humidity}%</p>
                  <p>Wind Speed: {weatherData.current.windSpeed} m/s</p>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="text-center">
                      <p className="font-semibold">{day.day}</p>
                      <p>{day.temp}°C</p>
                      <p className="text-sm">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <p className="text-center mt-4">API Calls: {apiCallCount}</p>
    </div>
  );
}
