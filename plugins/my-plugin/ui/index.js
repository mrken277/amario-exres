import List from './containers/List';
import Form from './containers/Form';

export default () => ({
    routes: [
        {
            path: '/list',
            component: List
        },
        {
            path: '/form',
            component: Form
        },
    ],
    menu: {
        label: 'My plugin',
        icon: 'icon-mp3',
        link: '/list',
    }
});