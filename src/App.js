import React, { useState } from "react";
import {
  ChevronLeft,
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Moon,
  CloudMoon,
  Clock,
  Thermometer,
  Droplets,
} from "lucide-react";

const WeatherIcon = ({ type }) => {
  const icons = {
    sunnyCloudy: <CloudSun className="w-8 h-8 text-gray-600" />,
    sunny: <Sun className="w-8 h-8 text-yellow-500" />,
    cloudy: <Cloud className="w-8 h-8 text-gray-400" />,
    cloudyMoon: <CloudMoon className="w-8 h-8 text-blue-400" />,
    rainy: <CloudRain className="w-8 h-8 text-gray-600" />,
    moon: <Moon className="w-8 h-8 text-blue-400" />,
  };
  return icons[type] || null;
};

const HourlyTable = ({ data }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="grid grid-cols-9 gap-4">
      <div className="space-y-8">
        <div className="flex items-center justify-center">
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex items-center justify-center">
          <Cloud className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex items-center justify-center">
          <Thermometer className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex items-center justify-center">
          <Droplets className="w-6 h-6 text-gray-400" />
        </div>
      </div>
      {data.map((item, index) => (
        <div
          key={index}
          className="space-y-8 text-center border-l border-gray-100"
        >
          <div className="text-sm font-medium">{item.time}</div>
          <div>
            <WeatherIcon type={item.icon} />
          </div>
          <div className="text-xl font-bold">{item.temp}°</div>
          <div className="text-sm text-gray-600">{item.humidity}%</div>
        </div>
      ))}
    </div>
  </div>
);

const DailyForecast = ({ data, onDaySelect }) => (
  <div className="bg-gray-50 rounded-lg p-6 mt-6">
    <h3 className="font-semibold mb-4">3-Day Forecast</h3>
    <div className="space-y-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
          onClick={() => onDaySelect(item)}
        >
          <div className="w-24">{item.day}</div>
          <WeatherIcon type={item.icon} />
          <div className="flex-1 text-center">{item.desc}</div>
          <div className="w-24 text-right">{item.temp}</div>
        </div>
      ))}
    </div>
  </div>
);

export default function WeatherApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const cities = [
    {
      name: "New York",
      state: "New York",
      country: "USA",
      timezone: "America/New_York",
      seasons: {
        winter: { temp: [-2, 4], humidity: [65, 75] },
        spring: { temp: [10, 18], humidity: [60, 70] },
        summer: { temp: [22, 30], humidity: [65, 75] },
        fall: { temp: [12, 20], humidity: [65, 75] },
      },
      conditions: ["sunny", "rainy", "cloudy"],
    },
    {
      name: "London",
      state: "England",
      country: "UK",
      timezone: "Europe/London",
      seasons: {
        winter: { temp: [2, 8], humidity: [80, 90] },
        spring: { temp: [8, 15], humidity: [70, 80] },
        summer: { temp: [15, 23], humidity: [65, 75] },
        fall: { temp: [10, 17], humidity: [75, 85] },
      },
      conditions: ["cloudy", "rainy", "sunnyCloudy"],
    },
    {
      name: "Tokyo",
      state: "",
      country: "Japan",
      timezone: "Asia/Tokyo",
      seasons: {
        winter: { temp: [4, 12], humidity: [50, 60] },
        spring: { temp: [14, 22], humidity: [65, 75] },
        summer: { temp: [24, 31], humidity: [75, 85] },
        fall: { temp: [16, 24], humidity: [70, 80] },
      },
      conditions: ["sunny", "rainy", "cloudy"],
    },
  ];

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "fall";
    return "winter";
  };

  const getLocalTime = (timezone) => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timezone,
    });
  };

  const generateHourlyData = (city) => {
    const season = getCurrentSeason();
    const {
      temp: [minTemp, maxTemp],
      humidity: [minHum, maxHum],
    } = city.seasons[season];
    const currentHour = parseInt(getLocalTime(city.timezone));

    return Array.from({ length: 8 }, (_, i) => {
      const hour = (currentHour + i * 3) % 24;
      const time = `${hour.toString().padStart(2, "0")}:00`;
      const tempProgress =
        hour >= 6 && hour <= 14
          ? (hour - 6) / 8
          : hour > 14
          ? 1 - (hour - 14) / 10
          : 0;
      const tempRange = maxTemp - minTemp;
      const temp = Math.round(minTemp + tempRange * tempProgress);
      const humidity = Math.round(minHum + Math.random() * (maxHum - minHum));
      return {
        time,
        temp,
        humidity,
        icon: hour >= 6 && hour < 20 ? "sunny" : "moon",
      };
    });
  };

  const generateDailyData = (city) => {
    const season = getCurrentSeason();
    const {
      temp: [minTemp, maxTemp],
    } = city.seasons[season];
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDay = new Date().getDay();

    return Array.from({ length: 3 }, (_, i) => {
      const dayTemp = Math.round(minTemp + Math.random() * (maxTemp - minTemp));
      const nightTemp = Math.round(
        minTemp + Math.random() * (dayTemp - minTemp)
      );
      const condition =
        city.conditions[Math.floor(Math.random() * city.conditions.length)];
      return {
        day: weekdays[(currentDay + i) % 7],
        icon: condition,
        desc:
          condition === "sunny"
            ? "Clear sky"
            : condition === "rainy"
            ? "Rain showers"
            : condition === "cloudy"
            ? "Cloudy"
            : "Partly cloudy",
        temp: `${dayTemp}° / ${nightTemp}°`,
        hourlyData: generateHourlyData(city),
      };
    });
  };

  const handleCitySelect = (city) => {
    const season = getCurrentSeason();
    const {
      temp: [minTemp, maxTemp],
    } = city.seasons[season];
    const currentTemp = Math.round(
      minTemp + Math.random() * (maxTemp - minTemp)
    );
    setSelectedCity({
      ...city,
      currentTemp,
      currentWeather: city.conditions[0],
      time: getLocalTime(city.timezone),
    });
    setSearchQuery("");
  };

  if (!selectedCity) {
    return (
      <div className="min-h-screen bg-white p-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Weather App</h1>
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              className="w-full p-4 rounded-lg border"
              placeholder="Search for a city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className="absolute w-full mt-2 bg-white border rounded-lg shadow-lg">
                {cities
                  .filter(
                    (city) =>
                      city.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      city.country
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((city, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCitySelect(city)}
                    >
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-gray-600">
                        {city.country}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {selectedCity.name}, {selectedCity.time}
          </h2>
          <div className="flex items-center gap-2">
            <WeatherIcon type={selectedCity.currentWeather} />
            <span className="text-4xl font-bold">
              {selectedCity.currentTemp}°C
            </span>
          </div>
        </div>

        {selectedDay ? (
          <div>
            <button
              onClick={() => setSelectedDay(null)}
              className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to forecast</span>
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {selectedDay.day} - Detailed Forecast
            </h3>
            <HourlyTable data={selectedDay.hourlyData} />
          </div>
        ) : (
          <>
            <HourlyTable data={generateHourlyData(selectedCity)} />
            <DailyForecast
              data={generateDailyData(selectedCity)}
              onDaySelect={setSelectedDay}
            />
          </>
        )}
      </div>
    </div>
  );
}
