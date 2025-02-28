import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
interface Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
}
interface LocationData {
  lat: number;
  lon: number;
}

interface WeatherApiResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    '1h': number;
  };
  snow?: {
    '1h': number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string = process.env.API_BASE_URL!;
  private apiKey: string = process.env.API_KEY!;

  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
private async fetchLocationData(query: string): Promise<Coordinates> {
  const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
  const data: LocationData[] = await response.json() as LocationData[];
  if (data.length === 0) {
    throw new Error('Location not found');
  }
  return { lat: data[0].lat, lon: data[0].lon };
}


private async fetchWeatherData(coordinates: Coordinates): Promise<WeatherApiResponse> {
  const response = await fetch(`${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`);
  const data = await response.json() as WeatherApiResponse;
  if (!data || !data.weather || data.weather.length === 0) {
    throw new Error('Weather data not found');
  }
  console.log('Weather Data:', data);
  return data;
}
  // TODO: Build parseCurrentWeather method
private parseCurrentWeather(response: WeatherApiResponse): Weather {
  const currentWeather = response;
  return {
    city: response.name,
    date: new Date(response.dt * 1000).toLocaleDateString(),
    icon: currentWeather.weather[0].icon,
    iconDescription: currentWeather.weather[0].description,
    tempF: currentWeather.main.temp,
    windSpeed: currentWeather.wind.speed,
    humidity: currentWeather.main.humidity
  };
}
  // TODO: Complete buildForecastArray method
private buildForecastArray(list: WeatherApiResponse['list'], city: string): Weather[] {
  return list.map((data) => ({
    city,
    date: data.dt_txt,
    icon: data.weather[0].icon,
    iconDescription: data.weather[0].description,
    tempF: data.main.temp,
    windSpeed: data.wind.speed,
    humidity: data.main.humidity
  }));
}
  // TODO: Complete getWeatherForCity method
async getWeatherForCity(city: string): Promise<Weather[]> {
  const coordinates = await this.fetchLocationData(city);
  const weatherData = await this.fetchWeatherData(coordinates);
  const currentWeather = this.parseCurrentWeather(weatherData);
  return currentWeather;
  }
}

export default new WeatherService();
