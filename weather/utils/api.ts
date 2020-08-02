import { weather_type, fetchWeatherResponse } from "./types";

type LocationIdQueryResponse = {
  woeid: number;
}[];

interface LocationQueryResponse {
  title: string;
  consolidated_weather: {
    weather_state_name: weather_type;
    the_temp: number;
  }[];
}

export const fetchLocationId = async (city: string): Promise<number> => {
  const response = await fetch(
    `https://www.metaweather.com/api/location/search/?query=${city}`
  );
  const locations = (await response.json()) as LocationIdQueryResponse;
  return locations[0].woeid;
};

export const fetchWeather = async (
  woeid: number
): Promise<fetchWeatherResponse> => {
  const response = await fetch(
    `https://www.metaweather.com/api/location/${woeid}/`
  );
  const {
    title,
    consolidated_weather
  } = (await response.json()) as LocationQueryResponse;
  const { weather_state_name, the_temp } = consolidated_weather[0];

  return {
    location: title,
    weather: weather_state_name,
    temperature: the_temp
  };
};
