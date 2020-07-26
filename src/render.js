import { loadImageSimple } from './layer/loadImageSimple';
import { addWeatherEffect } from './weather/add-weather-effect';
import { addTree } from './tree/add-tree';

export const render = async () => {
    const image = await loadImageSimple('imageOrig.png', { stretch: true });
    const imageWithTree = await addTree(image);
    const imageWithWeather = await addWeatherEffect(imageWithTree);
    return imageWithWeather;
};
