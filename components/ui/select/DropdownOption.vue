<template>
    <div :class="[$style.DropdownOption, classList]"
         @mouseenter="onMouseEnter"
         @mouseleave="onMouseLeave"
         @click="onClick"
    >
        {{ option.label }}
    </div>
</template>

<script>
    export default {
        name: 'DropdownOption',

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
                        [this.$style._highlighted]: this.isHighlighted,
                        [this.$style._selected]: this.isSelected,
                        [this.$style._disabled]: this.option.disabled,
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

    .DropdownOption {
        padding: 1.2rem 3.2rem;
        font-size: 2.2rem;
        font-weight: 500;
        line-height: 1.2;
        color: black;
        cursor: pointer;

        &._highlighted {
            background-color: rgba($accept, .3);
        }

        &._selected {
            color: $accept;
        }

        &._disabled {
            color: rgba(0, 0, 0, .25);
            cursor: not-allowed;
        }

        &._hidden {
            display: none;
        }
    }
</style>
