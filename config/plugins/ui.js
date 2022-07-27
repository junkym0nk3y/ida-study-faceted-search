import Vue from 'vue';

import SingleSelect from '~/components/ui/select/SingleSelect';
import RangeFilter from '~/components/ui/range/RangeFilter';

const components = [
    SingleSelect,
    RangeFilter,
];

components.forEach(component => {
    if (component.name) {
        Vue.component(component.name, component);
    } else {
        console.warn('[UI] Register / No component name: ', component);
    }
});
