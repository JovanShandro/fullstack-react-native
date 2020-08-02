export type weather_type =
  | "Clear"
  | "Hail"
  | "Heavy Cloud"
  | "Light Cloud"
  | "Light Rain"
  | "Showers"
  | "Sleet"
  | "Snow"
  | "Thunder";

export interface fetchWeatherResponse {
  location: string;
  weather: weather_type;
  temperature: number;
}
