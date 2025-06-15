
export interface WeatherData {
  location: string;
  temperature: string;
  condition: string;
  humidity?: string;
  wind?: string;
}

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
}

export interface ApiData {
  weather: WeatherData;
  news: NewsArticle[];
}
