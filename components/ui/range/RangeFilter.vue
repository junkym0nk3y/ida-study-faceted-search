<template>
    <div :class="$style.RangeFilter">
        <div :class="$style.inputs">
            <InputThousands
                :value="value[0]"
                :class="$style.input"
                :color="color"
                :positive-only="positiveOnly"
                @keydown="onKeyDown"
                @change="onInputChange($event, 'first')"
            />

            <InputThousands
                :value="value[1]"
                :class="$style.input"
                :color="color"
                @keydown="onKeyDown"
                @change="onInputChange($event, 'second')"
            />
        </div>

        <Slider
            v-model="value"
            :min="spec.min"
            :max="spec.max"
            :no-transition="noTransition"
            range
            @change="emitChange"
        />
    </div>
</template>

<script>
    import Slider from '../slider/Slider';
    import InputThousands from '../input/InputThousands';

    export default {
        name: 'RangeFilter',

        components: {
            Slider,
            InputThousands,
        },

        props: {
            name: {
                type: [Array, String],
                required: true,
            },

            spec: {
                type: Object,
                required: true,
                default: () => ({ min: 1, max: 100 }),
            },

            facet: {
                type: Object,
                required: true,
                default: () => ({}),
            },

            values: {
                type: Object,
                default: () => ({}),
            },

            valueMin: {
                type: String,
                default: '',
            },

            valueMax: {
                type: String,
                default: '',
            },

            color: {
                type: String,
                default: '',
            },

            positiveOnly: {
                type: Boolean,
                default: true,
            },
        },

        data() {
            return {
                noTransition: false,
                value: [this.valueMin ? this.valueMin : this.spec.min, this.valueMax ? this.valueMax : this.spec.max],
            };
        },

        watch: {
            facet() {
                if (!this.valueMin && !this.valueMax) {
                    this.applyFacet();
                }
            },

            spec() {
                if (!this.valueMin && !this.valueMax) {
                    this.value = [this.spec.min, this.spec.max];
                }
            },

            values() {
                this.applyValues();
            },
        },

        created() {
            if (this.facet?.min && this.facet?.max) {
                this.value = [
                    this.valueMin ? this.valueMin : this.facet.min,
                    this.valueMax ? this.valueMax : this.facet.max,
                ];
            }
        },

        methods: {
            applyValues() {
                const min = this.valueMin ? this.valueMin : this.facet.min;
                const max = this.valueMax ? this.valueMax : this.facet.max;
                this.value = [min, max];
            },

            applyFacet() {
                if (this.facet.min && this.facet.max && (!this.valueMin && !this.valueMax)) {
                    this.value = [this.facet.min, this.facet.max];
                } else {
                    console.warn('Something wrong with range facets');
                }
            },

            onKeyDown(e) {
                if (isNaN(parseInt(e.key, 10))) {
                    e.preventDefault();
                }
            },

            onInputChange(val, handler) {
                if (handler === 'first') {
                    if (val !== this.value[0]) {
                        val > this.value[1]
                            ? this.value = [this.value[1], val]
                            : this.value = [val, this.value[1]];

                        this.$nextTick(() => {
                            this.emitChange();
                        });
                    }
                }
                if (handler === 'second') {
                    if (val !== this.value[1]) {
                        val < this.value[0]
                            ? this.value = [val, this.value[0]]
                            : this.value = [this.value[0], val];
                        this.$nextTick(() => {
                            this.emitChange();
                        });
                    }
                }
            },

            emitChange() {
                let minValue = this.value[0].toString();
                let maxValue = this.value[1].toString();

                if (minValue <= this.spec.min) {
                    minValue = '';
                }
                if (maxValue >= this.spec.max) {
                    maxValue = '';
                }

                let name = [];
                if (Array.isArray(this.name)) {
                    name = [...this.name];
                } else {
                    name = [`${this.name}Min`, `${this.name}Max`];
                }

                console.warn(name[0]);

                this.$emit('change', {
                    [name[0]]: minValue,
                    [name[1]]: maxValue,
                });
            },
        },
    };
</script>

<style lang="scss" module>
    .RangeFilter {
        display: flex;
        flex-direction: column;
        height: 4.2rem;

        :global(.c-input) {
            width: 50%;
            padding-top: 0;
        }

        :global(.c-input__inner) {
            &:before,
            &:after {
                content: none;
            }
        }

        :global(.c-input__native) {
            height: calc(2.8rem - 4px);
            padding-bottom: 0;
        }
    }

    .inputs {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1.4rem;
    }

    .input {
        &:last-child {
            :global(.c-input__native) {
                text-align: right;
            }
        }
    }
</style>
