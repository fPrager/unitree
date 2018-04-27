import { loadImageSimple } from './layer/loadImageSimple';
import { addWeatherEffect } from './weather/add-weather-effect';

export const render = async () => {
    const image = await loadImageSimple('https://s3.eu-central-1.amazonaws.com/unitree/people.png', { stretch: true });
    const imageWithWeather = await addWeatherEffect(image);
    return imageWithWeather;
};
