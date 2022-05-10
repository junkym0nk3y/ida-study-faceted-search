import Vue from 'vue';

// Импорт компонентов
import VInput from '~/components/ui/input/VInput';
import VSelect from '~/components/ui/select/VSelect';
import VRangeInput from '~/components/ui/range-input/VRangeInput';
import CheckboxButton from '~/components/ui/checkbox/CheckboxButton';

const components = [
    VInput,
    VSelect,
    VRangeInput,
    CheckboxButton,
];

components.forEach(component => {
    if (component.name) {
        Vue.component(component.name, component);
    } else {
        console.warn('[UI] Register / No component name: ', component);
    }
});
