import { render } from './render';

render().then((image) => {
    image.write('test.png');
});
