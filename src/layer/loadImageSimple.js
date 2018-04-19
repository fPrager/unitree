import Jimp from 'jimp';
import renderSettings from '../../render-settings.json';

export const loadImageSimple = (url, options) => {
    return new Promise((resolve) => {
        Jimp.read(url).then((image) => {
            if (options.stretch) { image.resize(renderSettings.width, renderSettings.height); }
            resolve(image);
        });
    });
};
