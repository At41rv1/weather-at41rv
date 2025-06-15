
export interface WeatherData {
  location: string;
  temperature: string;
  condition: string;
  humidity?: string;
  wind?: string;
}

export interface ApiData {
  weather: WeatherData;
}
