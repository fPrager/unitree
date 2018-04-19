import { loadImageSimple } from './layer/loadImageSimple';

export const render = () => {
    loadImageSimple('https://s3.eu-central-1.amazonaws.com/unitree/imageOrig.png', { stretch: true })
        .then(() => {
            console.log('image loaded');
        });
};
