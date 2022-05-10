<template>
    <div class="c-select__dropdownOption"
         :class="classList"
         @mouseenter="onMouseEnter"
         @mouseleave="onMouseLeave"
         @click="onClick"
    >
        {{ option.label }}
    </div>
</template>

<script>
    export default {
        props: {
            option: {
                type: Object,
                required: true,
                default: () => ({}),
            },
            value: {
                type: [String, Array],
                required: true,
            },
            isHighlighted: Boolean,
        },

        computed: {
            isSelected() {
                if (Array.isArray(this.value)) {
                    return this.value.includes(this.option.value);
                } else {
                    return this.value === this.option.value;
                }
            },

            classList() {
                return [
                    {
                        _highlighted: this.isHighlighted,
                        _selected: this.isSelected,
                        _disabled: this.option.disabled,
                    },
                ];
            },
        },

        methods: {
            onClick() {
                if (this.option.disabled) {
return;
}
                this.$emit('click', this.option);
            },

            onMouseEnter() {
                if (this.option.disabled) {
return;
}
                this.$emit('mouseenter');
            },

            onMouseLeave() {
                if (this.option.disabled) {
return;
}
                this.$emit('mouseleave');
            },
        },
    };
</script>
