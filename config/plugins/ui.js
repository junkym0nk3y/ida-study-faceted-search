import Vue from 'vue';

import SingleSelect from '~/components/ui/select/SingleSelect';

const components = [
    SingleSelect,
];

components.forEach(component => {
    if (component.name) {
        Vue.component(component.name, component);
    } else {
        console.warn('[UI] Register / No component name: ', component);
    }
});
