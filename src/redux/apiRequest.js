import axios from "axios";
import config from "../../config";
import { getCurrCoords } from "../utils/mapFunc";
import { mainURL } from "../contans/Variable";

/////////////////////  WEATHERS DATA  ////////////////////
export const getWeatherData = async () => {
  const apiKey = '306f7ce7a80341e492583526242204';
  try {
    const coords = await getCurrCoords();
    const res = await axios.get(
      `https://api.weatherapi.com/v1/current.json?q=${coords.latitude},${coords.longitude}&key=${apiKey}`,
    );

    const data = res.data;
    const weather = data.current;
    const temp = weather.temp_c.toFixed(0);
    const iconUrl = `https:${weather.condition.icon}`;
    const humidity = weather.humidity.toFixed(0);
    const wind_kph = weather.wind_kph;
    const wind_degree = weather.wind_degree;
    const weatherData = { temp, iconUrl, humidity, wind_kph, wind_degree };

    return weatherData;
  } catch (error) {
    console.log(error);
  }
};

export const getListFireLevel = async () => {
  try {
    const api = `${mainURL}/api/capchayIFEE`;
    const res = await axios.get(api);
    res => res.json();
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export const getCommuneName = async () => {
  try {
    const coords = await getCurrCoords();
    const res = await axios.get(
      `https://forestry.ifee.edu.vn/api/mylocation?lat=${coords.latitude}&lon=${coords.longitude}`,
    );
    return res.data;
  } catch (error) { }
};
