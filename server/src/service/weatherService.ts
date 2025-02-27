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
// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string = process.env.API_BASE_URL!;
  private apiKey: string = process.env.API_KEY!;

  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
private async fetchLocationData(query: string): Promise<Coordinates> {
  const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
  const data: LocationData[] = await response.json() as LocationData[];
  return { lat: data[0].lat, lon: data[0].lon };
}
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method

private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
  const response = await fetch(`${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`);
  return response.json();
}
  // TODO: Build parseCurrentWeather method
private parseCurrentWeather(response: any): Weather {
  const currentWeather = response.list[0];
  return {
    city: response.city.name,
    date: currentWeather.dt_txt,
    icon: currentWeather.weather[0].icon,
    iconDescription: currentWeather.weather[0].description,
    tempF: currentWeather.main.temp,
    windSpeed: currentWeather.wind.speed,
    humidity: currentWeather.main.humidity
  };
}
  // TODO: Complete buildForecastArray method
private buildForecastArray(weatherData: any[]): Weather[] {
  return weatherData.map((data: any) => ({
    city: data.city.name,
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
  const forecast = this.buildForecastArray(weatherData.list.slice(1, 6));
  return [currentWeather, ...forecast];
  }
}

export default new WeatherService();
