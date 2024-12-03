import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const cities = [
  {
    name: "New York",
    weather: { temp: 22, humidity: 70, wind: 10, condition: "sunny" },
  },
  {
    name: "London",
    weather: { temp: 15, humidity: 80, wind: 15, condition: "cloudy" },
  },
  {
    name: "Tokyo",
    weather: { temp: 28, humidity: 65, wind: 5, condition: "rainy" },
  },
];

const forecast = {
  "New York": Array(5)
    .fill()
    .map((_, i) => ({
      day: `Day ${i + 1}`,
      temp: 20 + i,
      desc: "Partly Cloudy",
    })),
  London: Array(5)
    .fill()
    .map((_, i) => ({ day: `Day ${i + 1}`, temp: 13 + i, desc: "Rainy" })),
  Tokyo: Array(5)
    .fill()
    .map((_, i) => ({ day: `Day ${i + 1}`, temp: 25 + i, desc: "Sunny" })),
};

function App() {
  const [selectedCity, setSelectedCity] = useState(cities[0].name);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiCalls, setApiCalls] = useState(0);
  const [lastCallTime, setLastCallTime] = useState(Date.now());
  const [limitExceeded, setLimitExceeded] = useState(false);

  const fetchWeather = useCallback(() => {
    if (limitExceeded) return;
    const now = Date.now();
    if (now - lastCallTime < 60000 && apiCalls >= 3) {
      setLimitExceeded(true);
      setTimeout(() => setLimitExceeded(false), 60000);
      return;
    }

    setIsLoading(true);
    setLastCallTime(now);
    setApiCalls((prev) => prev + 1);

    setTimeout(() => {
      const cityData = cities.find((city) => city.name === selectedCity);
      setWeatherData({
        ...cityData.weather,
        forecast: forecast[selectedCity],
      });
      setIsLoading(false);
    }, 1000);
  }, [selectedCity, apiCalls, lastCallTime, limitExceeded]);

  useEffect(() => {
    if (apiCalls === 0 || Date.now() - lastCallTime > 60000) {
      setApiCalls(0);
    }
  }, [apiCalls, lastCallTime]);

  const getBackgroundClass = (condition) => {
    switch (condition) {
      case "sunny":
        return "bg-yellow-100";
      case "cloudy":
        return "bg-gray-200";
      case "rainy":
        return "bg-blue-100";
      default:
        return "bg-white";
    }
  };

  return (
    <div
      className={`min-h-screen p-4 ${getBackgroundClass(
        weatherData?.condition || "sunny"
      )}`}
    >
      <Card className="max-w-lg mx-auto sm:w-full">
        <CardHeader>
          <CardTitle>Weather App</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {cities.map((city) => (
              <SelectItem key={city.name} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </Select>
          <Button
            onClick={fetchWeather}
            disabled={isLoading || limitExceeded}
            className="mt-4 w-full"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Fetch Weather Data"
            )}
          </Button>
          {limitExceeded && (
            <p className="text-red-500 text-sm mt-2">
              API call limit exceeded. Try again in a minute.
            </p>
          )}
          {weatherData && (
            <div className="mt-4">
              <h2 className="text-xl font-bold">{selectedCity}</h2>
              <p>Temp: {weatherData.temp}°C</p>
              <p>Humidity: {weatherData.humidity}%</p>
              <p>Wind: {weatherData.wind} km/h</p>
              <h3 className="mt-4 text-lg">5-Day Forecast:</h3>
              {weatherData.forecast.map((day) => (
                <div
                  key={day.day}
                  className="border-t border-gray-200 pt-2 mt-2"
                >
                  <p>
                    {day.day}: {day.temp}°C - {day.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
