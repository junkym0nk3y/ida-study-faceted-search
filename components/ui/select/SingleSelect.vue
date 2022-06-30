<template>
    <div v-clickoutside="onClickOutside"
         :class="[$style.SingleSelect, classList]"
    >

        <div :class="$style.field"
             @click.stop="toggleMenu"
        >
            <input ref="input"
                   :class="$style.nativeInput"
                   type="text"
                   :value="selectedLabel"
                   :disabled="isDisabled"
                   :readonly="true"
                   @focus.native="onFocus"
                   @keydown.down.stop.prevent="navigateOptions('down')"
                   @keydown.up.stop.prevent="navigateOptions('up')"
                   @keydown.enter.prevent="onEnterPress"
                   @keydown.esc="isOpened = false"
                   @keydown.tab="onBlur"
                   @mouseenter.native="inputHovering = true"
                   @mouseleave.native="inputHovering = false"
            />

            <div :class="$style.arrow">
                <svg width="12"
                     height="7"
                     viewBox="0 0 12 7"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M1 1L6 6L11 1"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                    />
                </svg>
            </div>
        </div>

        <transition name="dropdown">
            <div v-if="isOpened"
                 :class="$style.dropdown"
            >
                <perfect-scrollbar>
                    <Option v-for="(option, index) in optionList"
                            :key="option.value"
                            :option="option"
                            :value="value"
                            :size="size"
                            :is-highlighted="highlightIndex === index"
                            @mouseenter="highlightIndex = index"
                            @mouseleave="highlightIndex = -1 "
                            @click="onOptionSelect"
                    />
                </perfect-scrollbar>
            </div>
        </transition>

        <select :name="name"
                :required="required"
                :class="[$style.nativeSelect, {[$style._visible]: !isDisabled}]"
                @change="onNativeChange"
        >
            <option v-for="option in mobileOptionList"
                    :key="option.value"
                    :value="option.value"
                    :selected="option.value === value"
                    :disabled="option.disabled"
            >
                {{ option.label }}
            </option>
        </select>
    </div>
</template>

<script>
    import Option from './Option';

    export default {
        name: 'SingleSelect',

        components: {
            Option,
        },

        props: {
            /**
             * Имя поля формы
             */
            name: {
                type: String,
                default: '',
            },

            value: {
                type: String,
                required: true,
            },

            options: {
                type: Array,
                default: () => [],
            },

            placeholder: {
                type: String,
                default: '',
            },

            resetLabel: {
                type: String,
                default: '',
            },

            disabled: Boolean,
            error: Boolean,
            success: Boolean,
            required: Boolean,
            hideSelected: Boolean,
            bordered: {
                type: Boolean,
                default: true,
            },

            facet: {
                type: Array,
                default: undefined,
            },

            color: {
                type: String,
                default: null,
                validator: val => [
                    'white',
                    'grey',
                ].includes(val),
            },

            size: {
                type: String,
                default: null,
                validator: val => [
                    's', 'm',
                ].includes(val),
            },
        },

        data() {
            return {
                isFocused: false,
                isOpened: false,
                highlightIndex: -1,
                inputHovering: false,
            };
        },

        computed: {
            classList() {
                return [
                    {
                        _selected: this.selectedOption,
                        _focused: this.isFocused,
                        _opened: this.isOpened,
                        _disabled: this.isDisabled,
                        _error: this.error,
                        _success: this.success,
                        _bordered: this.bordered,
                        [this.$style[`_${this.color}`]]: this.color,
                        [this.$style[`_${this.size}`]]: this.size,
                    },
                ];
            },

            optionList() {
                const options = [];
                if (this.resetLabel && this.value) {
                    options.push({
                        label: this.resetLabel,
                        value: '',
                    });
                }

                this.options.forEach(opt => {
                    if (opt.value === this.value && this.hideSelected) {
                        return;
                    }

                    options.push({
                        ...opt,
                        disabled: this.facet && !this.facet.includes(opt.value) && opt.value !== '',
                    });
                });

                return options;
            },

            mobileOptionList() {
                const options = [];

                if (this.resetLabel) {
                    options.push({
                        label: this.resetLabel ? this.resetLabel : '-',
                        value: '',
                        disabled: false,
                    });
                }

                this.options.forEach(opt => {
                    options.push({
                        ...opt,
                        disabled: this.facet && !this.facet.includes(opt.value) && opt.value !== '',
                    });
                });

                return options;
            },

            selectedOption() {
                const selected = this.options.filter(a => a.value === this.value)[0];
                return selected || null;
            },

            selectedLabel() {
                return this.selectedOption
                    ? this.selectedOption.label
                    : this.placeholder;
            },

            isDisabled() {
                return this.disabled || this.options.length === 0;
            },
        },

        methods: {
            navigateOptions(direction) {
                if (!this.isOpened) {
                    this.isOpened = true;
                    return;
                }

                if (direction === 'down') {
                    this.highlightIndex++;
                    if (this.highlightIndex === this.optionList.length) {
                        this.highlightIndex = 0;
                    }
                } else if (direction === 'up') {
                    this.highlightIndex--;
                    if (this.highlightIndex < 0) {
                        this.highlightIndex = this.optionList.length - 1;
                    }
                }

                const option = this.optionList[this.highlightIndex];
                if (option.disabled) {
                    this.navigateOptions(direction);
                }
            },

            toggleMenu() {
                if (this.isDisabled) {
                    return;
                }
                this.isOpened = !this.isOpened;

                if (this.isOpened) {
                    this.$refs.input.focus();
                }
            },

            onEnterPress() {
                if (!this.isOpened) {
                    this.toggleMenu();
                } else if (this.optionList[this.highlightIndex]) {
                    this.onOptionSelect(this.optionList[this.highlightIndex]);
                }
            },

            onOptionSelect(option) {
                if (this.value !== option.value) {
                    this.$emit('input', option.value);
                    this.name ?
                        this.$emit('change', { [this.name]: option.value }) :
                        this.$emit('change', option.value);
                }
                this.isOpened = false;
                this.$refs.input.focus();
            },

            /**
             * Метод, который обрабатывает собите focus на инпуте
             */
            onFocus() {
                this.isFocused = true;
                this.$emit('focus');
            },

            /**
             * Метод, который обрабатывает собите blur на инпуте
             */
            onBlur() {
                if (this.isOpened) {
                    this.isOpened = false;
                }
                this.isFocused = false;
                this.$emit('blur');
            },

            onClickOutside() {
                if (!this.isFocused) {
                    return;
                }
                this.isOpened = false;
                this.isFocused = false;
                this.$emit('blur');
            },

            onNativeChange(e) {
                this.$emit('input', e.target.value);
                this.name ?
                    this.$emit('change', { [this.name]: e.target.value }) :
                    this.$emit('change', e.target.value);
            },
        },
    };
</script>

<style lang="scss" module>
    $grey-background: $grey-light;
    $grey-color: $grey;
    $grey-accent-color: $base-300;
    $select-background: $accept;

    .SingleSelect {
        position: relative;
        z-index: 2;

        &._grey {
            &:after {
                background-color: $grey-background;
            }

            input.nativeInput {
                font-weight: 500;
                color: $grey-color;
            }

            .arrow {
                stroke: $grey-color;
            }
        }

        &._s {
            &:after {
                content: none;
            }

            input.nativeInput {
                height: 2.4rem;
                padding-bottom: 0;
                font-size: 1.4rem;
            }
        }

        &._m {
            &:after {
                content: none;
            }

            input.nativeInput {
                height: 2.4rem;
                padding-bottom: 0;
                font-size: 1.8rem;
                font-weight: 400;
            }

            .dropdownWrap {
                max-height: 24rem;
            }
        }

        &._selected {
            &:after {
                background-color: $select-background;
            }
        }

        &._focused {
            input.nativeInput {
                border-color: blue;
            }
        }

        &._opened {
            .arrow {
                transform: rotate(180deg);
            }
        }

        &._disabled {
            opacity: .5;
            pointer-events: none;

            input.nativeInput {
                pointer-events: none;
            }
        }

        &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            border-radius: 2px;
            background-color: $grey-accent-color;
        }
    }

    .field {
        position: relative;
        width: 100%;
    }

    .arrow {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 12px;
        height: 2.4rem;
        transition: transform .2s ease;
        cursor: pointer;
        stroke: white;

        svg {
            width: 100%;
            height: 7px;
        }
    }

    .dropdown {
        position: absolute;
        top: calc(100% - 4px);
        left: 0;
        z-index: 3;
        width: 100%;
        padding: 1.2rem 0;
        border-radius: 4px;
        background: #fff;
        transition: opacity .2s ease, transform .2s ease;
        box-shadow: 8px 8px 30px rgba(0, 0, 0, .12);
        will-change: opacity, transform;

        :global(.ps) {
            max-height: 45.6rem;
        }
    }

    input.nativeInput {
        overflow: hidden;
        display: inline-block;
        width: 100%;
        height: 4.2rem;
        padding-right: 24px;
        padding-bottom: 1.8rem;
        text-overflow: ellipsis;
        font-size: 2rem;
        line-height: 1.2;
        color: #fff;
        cursor: pointer;
    }

    select.nativeSelect {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        opacity: 0;
        pointer-events: none;

        @include respond-to(sm) {
            z-index: 2;
            display: block;
            pointer-events: auto;
        }

        &._visible {
            z-index: 2;
            pointer-events: auto;
        }
    }
</style>
