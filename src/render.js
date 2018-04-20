import { loadImageSimple } from './layer/loadImageSimple';

export const render = () => {
    return loadImageSimple('https://s3.eu-central-1.amazonaws.com/unitree/people.png', { stretch: true });
};
