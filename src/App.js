import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("Mumbai");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  const API_KEY = "6c75c18e6d0bfb6da7a551383f121791";

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const fetchWeather = async (cityName) => {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const forecastResponse = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      setWeather(response.data);
      setForecast(forecastResponse.data.list.slice(0, 5)); // Next 5 intervals
      setError("");
    } catch (err) {
      setError("City not found. Please try again.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const getBackgroundClass = (weatherCondition) => {
    if (!weatherCondition) return "default-bg";
    const condition = weatherCondition.toLowerCase();
    if (condition.includes("clear")) return "sunny-bg";
    if (condition.includes("clouds")) return "cloudy-bg";
    if (condition.includes("rain")) return "rainy-bg";
    if (condition.includes("snow")) return "snowy-bg";
    if (condition.includes("thunderstorm")) return "stormy-bg";
    return "default-bg";
  };

  return (
    <div className={`app ${weather ? getBackgroundClass(weather.weather[0].main) : ""}`}>
      <div className="weather-app">
        <header>
          <h1>Weather App</h1>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
            />
            <button type="submit">Search</button>
          </form>
        </header>
        {error && <p className="error">{error}</p>}
        {weather && (
          <div className="current-weather">
            <h2>{weather.name}</h2>
            <p>{new Date().toLocaleDateString()}</p>
            <div className="weather-info">
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="Weather Icon"
                className="animated-weather-icon"
              />
              <div>
                <h3>{weather.main.temp}°C</h3>
                <p>{weather.weather[0].description}</p>
              </div>
            </div>
          </div>
        )}
        {forecast.length > 0 && (
          <div className="forecast">
            <h3>Forecast</h3>
            <div className="forecast-grid">
              {forecast.map((item, index) => (
                <div key={index} className="forecast-item">
                  <p>{new Date(item.dt_txt).toLocaleDateString()}</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt="Forecast Icon"
                  />
                  <p>{item.main.temp}°C</p>
                  <p>Humidity: {item.main.humidity}%</p>
                  <p>Wind: {item.wind.speed} km/h</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
