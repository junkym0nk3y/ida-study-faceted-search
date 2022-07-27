<template>
    <div class="c-input" :class="classList">
        <div class="c-input__inner">
            <input ref="input"
                   class="c-input__native"
                   :aria-label="label"
                   v-bind="$attrs"
                   :value="splittedValue"
                   type="text"
                   :disabled="disabled"
                   :maxlength="length"
                   @keydown.enter="$refs.input.blur()"
                   @keydown="$emit('keydown', $event)"
                   @input="onInput"
                   @change="onChange"
                   @focus="onFocus"
                   @blur="onBlur"
            >

            <span v-if="responsive"
                  aria-hidden="true"
                  class="c-input__resp"
            >
                {{ splittedValue }}
            </span>

            <!--            <span v-if="prefixIcon"-->
            <!--                  class="c-input__prefix">-->
            <!--                <Icon :name="prefixIcon" />-->
            <!--            </span>-->

            <!--            <span v-if="suffixIcon"-->
            <!--                  class="c-input__suffix">-->
            <!--                <Icon :name="suffixIcon" />-->
            <!--            </span>-->
        </div>

        <span v-if="label"
              class="c-input__label"
        >
            {{ label }}
        </span>
    </div>
</template>

<script>
    export default {
        name: 'InputThousands',

        props: {
            value: {
                type: [String, Number],
                default: '',
            },

            label: {
                type: String,
                default: '',
            },

            color: {
                type: String,
                default: '',
            },

            disabled: Boolean,

            suffixIcon: {
                type: String,
                default: '',
            },

            prefixIcon: {
                type: String,
                default: '',
            },

            error: Boolean,

            delimiter: {
                type: String,
                default: ' ',
            },

            decimalMark: {
                type: String,
                default: '.',
            },

            positiveOnly: {
                type: Boolean,
                default: false,
            },

            decimalCount: {
                type: Number,
                default: 2,
            },

            showLabel: {
                type: Boolean,
                default: false,
            },

            length: {
                type: Number,
                default: 42,
            },

            responsive: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                isFocused: false,
                splittedValue: this.splitThousands(this.value),
            };
        },

        computed: {
            classList() {
                return [
                    this.color ? `_${this.color}` : '',
                    {
                        _active: this.value,
                        _focus: this.isFocused,
                        _disabled: this.disabled,
                        _prefix: this.prefixIcon,
                        _suffix: this.suffixIcon,
                        _show__label: this.showLabel,
                        _responsive: this.responsive,
                        _error: this.error,
                    },
                ];
            },

            cleanValue() {
                return Number(this.splittedValue.split(this.delimiter)
                    .join(''));
            },
        },

        watch: {
            value(newValue) {
                if (newValue !== this.cleanValue) {
                    this.splittedValue = this.splitThousands(newValue);
                }
            },
        },

        methods: {
            cleanValues() {
                return Number(this.splittedValue.split(this.delimiter)
                    .join(''));
            },

            onChange(e) {
                // strip any leading zeros
                if (this.splittedValue.length > 1 && this.splittedValue[0] === '0') {
                    this.splittedValue = this.splitThousands(this.cleanValue.toString()
                        .replace(/^(-)?0+(?=\d)/, '$1'));
                }

                this.$nextTick(() => {
                    this.$emit('change', this.cleanValue);
                });

                this.$emit('inputValue', {
                    value: this.cleanValues(),
                });
            },

            onFocus(e) {
                this.isFocused = true;
                this.$emit('focus', e);
                this.$emit('inputValue', {
                    value: this.cleanValues(),
                });
            },

            onBlur(e) {
                this.isFocused = false;
                if (this.splittedValue.length > 1 && this.splittedValue[0] === '0') {
                    this.splittedValue = this.splitThousands(this.cleanValue.toString()
                        .replace(/^(-)?0+(?=\d)/, '$1'));
                }
                this.$nextTick(() => {
                    this.$emit('change', this.cleanValue);
                });
            },

            onInput(e) {
                if (e.target.value <= 0) {
                    e.target.value = '';
                }
                let endPos = e.target.selectionEnd;
                const oldValue = e.target.value;
                const newValue = this.splitThousands(e.target.value);
                e.target.value = newValue;
                this.splittedValue = newValue;

                this.$nextTick(() => {
                    endPos = this.getNextCursorPosition(endPos, oldValue, newValue, this.delimiter);
                    this.setCursor(e.target, endPos);
                    this.$emit('input', this.cleanValue);
                });
            },

            splitThousands(value) {
                if (typeof value !== 'number' && typeof value !== 'string') {
                    console.warn('[InputThousands] Wrong prop value');
                    return '';
                }

                let partDecimal = '';
                let parts;
                value = value.toString();

                const partSign = value.slice(0, 1) === '-' ? '-' : '';
                const partSignAndPrefix = partSign;
                let partInteger = value;
                if (value.indexOf(this.decimalMark) >= 0) {
                    parts = value.split(this.decimalMark);
                    partInteger = parts[0];
                    partDecimal = this.decimalMark + parts[1].slice(0, this.decimalCount);
                }
                if (partSign === '-') {
                    partInteger = partInteger.slice(1);
                }
                partInteger = partInteger.replace(/(\d)(?=(\d{3})+$)/g, '$1' + this.delimiter);

                return (
                    partSignAndPrefix +
                    partInteger.toString() +
                    (this.decimalCount > 0 ? partDecimal.toString() : '')
                );
            },

            getNextCursorPosition(prevPos, oldValue, newValue, delimiter) {
                return oldValue.length === prevPos
                    ? newValue.length
                    : prevPos + this.getPositionOffset(prevPos, oldValue, newValue, delimiter);
            },

            getPositionOffset(prevPos, oldValue, newValue, delimiter) {
                const oldRawValue = this.stripDelimiters(oldValue.slice(0, prevPos), delimiter);
                const newRawValue = this.stripDelimiters(newValue.slice(0, prevPos), delimiter);
                const lengthOffset = oldRawValue.length - newRawValue.length;
                return lengthOffset !== 0 ? lengthOffset / Math.abs(lengthOffset) : 0;
            },

            stripDelimiters(value, delimiter) {
                const delimiterRE = delimiter
                    ? new RegExp(delimiter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g')
                    : '';
                return value.replace(delimiterRE, '');
            },

            setCursor(el, position) {
                const setSelectionRange = () => {
                    el.setSelectionRange(position, position);
                };

                if (el === document.activeElement) {
                    setSelectionRange();
                    setTimeout(setSelectionRange, 1); // Android Fix
                }
            },
        },
    };
</script>
