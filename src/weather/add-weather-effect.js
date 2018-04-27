import Jimp from 'jimp';
import moment from 'moment';

import { RainyDay } from './add-rain';
import settings from '../../api-settings';

const yrno = require('yr.no-forecast')({
    request: {
        // make calls to locationforecast timeout after 15 seconds
        timeout: 15000,
    },
});

const Canvas = require('canvas');

console.log(settings.location);

const LOCATION = {
    // This is Dublin, Ireland
    lat: settings.location.lat,
    lon: settings.location.lon,
};

const getRainFactor = async () => {
    const weather = await yrno.getWeather(LOCATION);
    const weatherData = await weather.getForecastForTime(moment(new Date()));
    const rain = Number(weatherData.rain.split(' ')[0]);

    return rain;
};


const addRainDrops = (image, percent) => {
    return new Promise((resolve) => {
        image.getBuffer(Jimp.MIME_PNG, (error, buffer) => {
            const canvas = new Canvas(image.bitmap.width, image.bitmap.height);
            // const ctx = canvas.getContext('2d');
            const img = new Canvas.Image();
            img.src = buffer;
            const rainday = new RainyDay({
                image: img, width: image.bitmap.width, height: image.bitmap.height, opacity: 1, blur: percent / 10,
            }, canvas);
            rainday.trail = rainday.TRAIL_SMUDGE;
            rainday.rain([[1, 2, percent], [2, 4, percent / 10]], 0.1);

            for (let i = 0; i < 100; i++) { rainday.animateDrops(); }

            Jimp.read(rainday.canvas.toBuffer(), (err, result) => {
                resolve(result);
            });
        });
    });
};

export const addWeatherEffect = async (image) => {
    const rainfactor = await getRainFactor();
    const rainedImage = await addRainDrops(image, Math.min(rainfactor, 10) * 10);
    return rainedImage;
};
