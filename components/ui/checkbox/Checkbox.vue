<template>
    <label ref="label"
           :class="[$style.Checkbox, classList]"
           role="checkbox"
           :aria-checked="isChecked"
           :aria-disabled="disabled"
           @click="$emit('click')"
    >

        <input v-model="computedValue"
               :class="$style.native"
               type="checkbox"
               :name="name"
               :value="trueValue"
               :true-value="trueValue"
               :false-value="falseValue"
               :disabled="disabled || readonly"
               @keydown.enter.stop.prevent="$refs.label.click()"
               @focus="onFocus"
               @blur="onBlur"
        >

        <span v-if="$slots.default"
              :class="$style.label"
        >
            <slot></slot>
        </span>
    </label>
</template>

<script>
    export default {
        name: 'Checkbox',

        props: {
            /**
             * Имя, которое используется при отправке формы
             */
            name: {
                type: String,
                default: '',
            },

            /**
             * Текущее значение чекбокса
             */
            value: {
                type: [Array, String, Number, Boolean],
                default: false,
                required: true,
            },

            /**
             * Значение, которое используется при отправке формы, а также передается в value
             * при активации чекбокса
             */
            trueValue: {
                type: [String, Number, Boolean],
                default: true,
            },

            falseValue: {
                type: [String, Number, Boolean],
                default: false,
            },

            /**
             * Определяет классы, которые будут модифицировать размер
             */
            size: {
                type: String,
                default: 'medium',
                validator: value => ['medium', 'small', 'sm'].includes(value),
            },

            /**
             * Определяет классы, которые будут модифицировать цвет
             */
            color: {
                type: String,
                default: 'white',
                validator: value => ['white', 'blue', 'grey', 'silver'].includes(value),
            },

            /**
             * Очевидно, что это свойство отключает взаимодействие с чекбоксом
             */
            disabled: Boolean,
            readonly: Boolean,

            border: {
                type: Boolean,
                default: false,
            },

            isFilterVisible: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                isFocused: false,
            };
        },

        computed: {
            classList() {
                return [{
                    [this.$style[`_${this.color}`]]: this.color,
                    [this.$style[`_${this.size}`]]: this.size,
                    [this.$style._disabled]: this.disabled,
                    [this.$style._checked]: this.isChecked,
                    [this.$style._focused]: this.isFocused,
                    [this.$style._border]: this.border,
                    [this.$style._filter_visible]: this.isFilterVisible,
                }];
            },

            computedValue: {
                get() {
                    return this.value;
                },

                set(value) {
                    this.$emit('input', value);
                },
            },

            isChecked() {
                if (Array.isArray(this.value)) {
                    return this.value.indexOf(this.trueValue) > -1;
                } else {
                    return this.value === this.trueValue;
                }
            },
        },

        methods: {
            onFocus() {
                this.isFocused = true;
            },

            onBlur() {
                this.isFocused = false;
            },
        },
    };
</script>

<style lang="scss" module>
    .CheckboxButton {
        display: inline-flex;
        align-items: center;
        outline: none;
        transition: opacity .3s ease, background-color .3s ease, border .3s ease;
        cursor: pointer;
        user-select: none;

        /* Sizes */
        &._small {
            .label {
                padding: 1rem 1.6rem;
                text-transform: uppercase;
                font-size: 1.2rem;
                line-height: 1;
                letter-spacing: -.005em;
            }
        }

        &._sm {
            .label {
                padding: 1.8rem 3.2rem;
                text-transform: uppercase;
                font-size: 1.2rem;
                font-weight: 500;
                line-height: 1;
                letter-spacing: -.005em;

                @include respond-to(sm) {
                    padding: 16px;
                }
            }
        }

        &._medium {
            .label {
                padding: 1.8rem 3.2rem;
                text-transform: uppercase;
                font-size: 1.2rem;
                line-height: 1;
                letter-spacing: -.005em;
            }
        }

        &._border {
            overflow: hidden;
            border-radius: 10rem;
            border: 1px solid #dae0e9;
        }

        /* End Sizes */

        /* Colors */
        &._white {
            background-color: #fff;

            .label {
                font-weight: 500;
                color: $base-dark;
            }

            &._checked {
                background-color: $base-dark;

                .label {
                    color: #fff;
                }

                &._border {
                    border: 1px solid transparent;
                }
            }

            &._filter_visible {
                background-color: $base-700;
            }
        }

        &._blue {
            background-color: #fff;

            .label {
                color: $base-dark;
            }

            &._checked {
                .label {
                    color: $blue;
                }

                &._border {
                    border: 1px solid $blue;
                }
            }

            &._disabled {
                opacity: .5;
            }
        }

        &._grey {
            border: 1px solid $base-100;
            background-color: $base-100;

            .label {
                color: $base-500;
            }

            &._checked {
                .label {
                    color: $blue;
                }
            }

            &._disabled {
                opacity: .5;
            }
        }

        &._silver {
            background-color: #fff;

            .label {
                color: #788095;
            }

            &._checked {
                .label {
                    color: $blue;
                }

                &._border {
                    border: 1px solid $blue;
                }
            }

            &._disabled {
                opacity: .5;
            }
        }

        /* Modificators */

        &._disabled {
            pointer-events: none;
        }

        /* End Modificators */

        &:hover {
            border: 1px solid $base-600;

            @include respond-to(sm) {
                border: 1px solid $base-300;
            }
        }

        .native {
            display: none;
        }

        .label {
            width: 100%;
            text-align: center;
            white-space: nowrap;
            transition: color .3s ease;
        }
    }
</style>
