<template>
    <div :class="[$style.Option, classList]"
         @mouseenter="onMouseEnter"
         @mouseleave="onMouseLeave"
         @click="onClick"
    >
        {{ option.label }}
    </div>
</template>

<script>
    export default {
        name: 'Option',

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

            size: {
                type: String,
                default: null,
                validator: val => [
                    's', 'm',
                ].includes(val),
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
                        [this.$style[`_${this.size}`]]: this.size,
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

<style lang="scss" module>
    $highlighted-background: $accept;
    $select-color: $base-300;

    .dropdownOption {
        padding: 1.2rem 3.2rem;
        cursor: pointer;

        &._highlighted {
            background-color: $highlighted-background;
        }

        &._selected {
            color: $select-color;
        }

        &._disabled {
            color: rgba(0, 0, 0, .25);
            cursor: not-allowed;
        }

        &._m {
            padding: 1.2rem;
            font-size: 1.8rem;
        }
    }
</style>
