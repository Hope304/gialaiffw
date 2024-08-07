import axios from "axios";
import config from "../../config";
import { getCurrCoords } from "../utils/mapFunc";
import { mainURL } from "../contants/Variable";
const WEATHER_TOKEN = '1e52cb7b5a93a86d54181d1fa5724454';
/////////////////////  WEATHERS DATA  ////////////////////
export const getWeatherData = async () => {
  const apiKey = WEATHER_TOKEN;
  try {
    const coords = await getCurrCoords();
    console.log('hhhh', coords);
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}`,
    );
    console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}`);
    const data = res.data;
    console.log(data);
    const iconCode = data.weather[0].icon;
    const temp = (data.main.temp - 273.15).toFixed(0);
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const name = data.name;
    const weatherData = { temp, iconUrl, name };

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
    return res;
  } catch (error) {
    console.log(error);
  }
}