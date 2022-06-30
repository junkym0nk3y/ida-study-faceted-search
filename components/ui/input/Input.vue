<template>
    <div :class="[$style.input, classList]">
        <div :class="$style.inner">
            <input :tabindex="inputType === 'files' || inputType === 'file' ? '-1' : '0'"
                   :class="$style.native"
                   :aria-label="label"
                   v-bind="$attrs"
                   :value="value"
                   :type="nativeType"
                   :disabled="disabled"
                   :multiple="!!(inputType === 'files')"
                   @input="onInput"
                   @change="onChange"
                   @focus="onFocus"
                   @blur="onBlur"
            >

            <span v-if="$slots.prefix"
                  :class="$style.prefix"
            >
                <slot name="prefix"></slot>
            </span>

            <span v-if="$slots.suffix"
                  :class="$style.suffix"
            >
                <slot name="suffix"></slot>
            </span>

            <template v-if="nativeType === 'file'">
                <div :class="$style.filename">
                    {{ filename }}
                </div>

                <div :class="[$style.fileIcons, {[$style._active]: filename}]">
                    <svg :class="$style.btn"
                         @click="handleDeleteFiles"
                    >
                        <use v-if="!filename"
                             xlink:href="#ic-attach"
                        />
                        <use v-else
                             xlink:href="#ic-delete"
                        />
                    </svg>
                </div>
            </template>

            <span v-if="isSuffixVisible"
                  :class="$style.suffix"
            >
                <template v-if="!showClear || !showPassword">
                    <i v-if="suffixIcon"
                       :class="'icon-' + suffixIcon"
                    >
                    </i>
                </template>

                <i v-if="showClear"
                   :class="$style.icon"
                   @click="clear"
                >
                </i>

                <i v-if="showPassword"
                   class="__icon icon-eye"
                   @click="togglePasswordVisibility"
                >
                </i>
            </span>
        </div>

        <span class="__label">
            {{ label }}
        </span>
    </div>
</template>

<script>
    export default {
        name: 'Input',

        props: {
            type: {
                type: String,
                default: 'text',
            },

            inputType: {
                type: String,
                default: '',
            },

            value: {
                type: String,
                default: '',
            },

            label: {
                type: String,
                default: '',
            },

            clearable: {
                type: Boolean,
                default: false,
            },

            showPassword: {
                type: Boolean,
                default: false,
            },

            showLabel: {
                type: Boolean,
                default: false,
            },

            keepLabel: {
                type: Boolean,
                default: true,
            },

            color: {
                type: String,
                default: '',
            },

            suffixIcon: {
                type: String,
                default: '',
            },

            prefixIcon: {
                type: String,
                default: '',
            },

            disabled: Boolean,
            error: Boolean,
            success: Boolean,
        },

        data() {
            return {
                isFocused: false,
                isPasswordVisible: false,
                filename: null,
            };
        },

        computed: {
            classList() {
                return {
                    [this.$style[this.color]]: this.color,
                    [this.$style._active]: this.value || this.isFocused,
                    [this.$style._disabled]: this.prefixIcon,
                    [this.$style._error]: this.error,
                    [this.$style._success]: this.success,
                    [this.$style._showLabel]: this.showLabel,
                    [this.$style._keep]: this.keepLabel,
                };
            },

            showClear() {
                return this.clearable && !this.disabled && this.value;
            },

            isSuffixVisible() {
                return this.suffixIcon || this.showClear || this.showPassword;
            },

            nativeType() {
                if (this.inputType === 'file' || this.inputType === 'files') {
                    return 'file';
                } else if (this.type === 'password' && this.isPasswordVisible) {
                    return 'text';
                } else {
                    return this.type;
                }
            },
        },

        methods: {
            onInput(e) {
                this.$emit('input', e.target.value);
            },

            onChange(e) {
                e.preventDefault();

                if (this.inputType === 'file' || this.inputType === 'files') {
                    const files = e.target.files;
                    const nameLength = this.$deviceIs.mobile ? -15 : -50;

                    if (files !== 'undefined' && files !== null) {
                        if (files.length > 1) {
                            const subFilename = files[0].name.substr(nameLength);
                            this.filename = `...${subFilename.trim()} +${files.length - 1}`;
                        } else if (files.length > 0) {
                            const subFilename = files[0].name.substr(nameLength);
                            this.filename = '...' + subFilename.trim();
                        } else {
                            this.filename = '';
                        }
                    }
                }
                this.$emit('change', e);
            },

            onFocus(e) {
                this.isFocused = true;
                this.$emit('focus', e);
            },

            onBlur(e) {
                this.isFocused = false;
                this.$emit('blur', e);
            },

            handleDeleteFiles(e) {
                if (!this.filename) {
                    return;
                }

                this.filename = '';
                this.isFocused = false;
                this.$emit('clear', e);
            },

            clear() {
                this.$emit('input', '');
                this.$emit('change', '');
                this.$emit('clear');
            },

            togglePasswordVisibility() {
                this.isPasswordVisible = !this.isPasswordVisible;
            },
        },
    };
</script>

<style lang="scss" module>
    .input {
        position: relative;
        width: 100%;
        padding-top: 1.6rem;

        &._showLabel {
            .label {
                color: $grey;
                transition: .3s all ease;

                &._active._keep {
                    font-size: 1.4rem;
                    line-height: 1.6rem;
                    opacity: 1;
                    transform: translateY(-4rem);
                }
            }
        }

        &._active {
            .inner:after {
                transform: scaleX(1);
            }

            .label {
                opacity: 0;
            }

            .filename {
                opacity: 1;
            }
        }

        &._error {
            .inner:after {
                background-color: #de0337;
                transform: scaleX(1);
            }
        }

        &._disabled {
            .native {
                border-color: #e4e7ed;
                color: #c0c4cc;
                cursor: not-allowed;
            }
        }

        &._white {
            .native {
                color: #fff;
            }
        }
    }

    .fileIcons {
        position: absolute;
        right: 0;
        bottom: 1rem;
        z-index: -1;
        height: 4rem;
        padding-right: 2rem;

        &._active {
            z-index: 10;
        }

        .btn {
            width: 2rem;
            height: inherit;
            margin-right: 3rem;
            cursor: pointer;
            fill: #1162d9;

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .filename {
        position: absolute;
        top: .5rem;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 4.2rem;
        white-space: nowrap;
        font-size: 2rem;
        font-weight: 500;
        line-height: 2.4rem;
        color: #000;
        opacity: 0;
        cursor: pointer;
        user-select: none;

        @include respond-to(xs) {
            width: 100%;
            white-space: normal;
        }
    }

    input[type="file"] {
        z-index: 1;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    .inner {
        position: relative;
        z-index: 2;

        &:before,
        &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            border-radius: 2px;
        }

        &:before {
            z-index: 1;
            background-color: $ab-blue-easy;
        }

        &:after {
            z-index: 2;
            background-color: $ab-blue;
            transform: scaleX(0);
            transform-origin: left center;
            transition: transform .3s ease;
        }
    }

    &.label {
        position: absolute;
        bottom: 1.8rem;
        left: 0;
        font-size: 2rem;
        font-weight: 500;
        transition: opacity .3s ease;
        pointer-events: none;
    }

    &.suffix {
        position: absolute;
        top: 0;
        right: 6px;
        height: 100%;
        text-align: center;
        color: #000;

        &:after {
            content: "";
            display: inline-block;
            width: 0;
            height: 100%;
            vertical-align: middle;
        }
    }

    &.prefix {
        position: absolute;
        top: 0;
        left: 6px;
        height: 100%;
        text-align: center;
        color: #000;

        &:after {
            content: "";
            display: inline-block;
            width: 0;
            height: 100%;
            vertical-align: middle;
        }
    }

    &.icon {
        pointer-events: all;
        transition: color .2s;
        cursor: pointer;

        &:hover {
            color: #000;
        }
    }
</style>
