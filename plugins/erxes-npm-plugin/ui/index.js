import List from './containers/List';
import Form from './containers/Form';

export default () => ({
    routes: [
        {
            path: '/list2',
            component: List
        },
        {
            path: '/form2',
            component: Form
        },
    ],
    menu: {
        label: 'My plugin2',
        icon: 'icon-mp3',
        link: '/list2',
    }
});