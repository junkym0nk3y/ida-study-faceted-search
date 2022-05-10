<template>
    <div :class="['c-slider', classList]"
         role="slider"
         :aria-valuemin="min"
         :aria-valuemax="max"
         :aria-valuenow="range ? `${firstValue}-${secondValue}`: firstValue"
         :aria-orientation="vertical ? 'vertical': 'horizontal'"
         :aria-label="`slider between ${min} and ${max}`"
         :aria-disabled="disabled"
    >

        <div v-if="showValue"
             class="c-slider__values"
        >
            <div class="c-slider__val subtitle-2">
                <template v-if="range">
                    {{ formattedValue[0] }}
                </template>
                <template v-else>
                    {{ formattedValue }}
                </template>
            </div>
            <div v-if="range"
                 class="c-slider__val subtitle-2"
            >
                {{ formattedValue[1] }}
            </div>
        </div>

        <div ref="rail"
             class="c-slider__rail"
             :style="railStyle"
             @click="onRailClick"
        >
            <div class="c-slider__track">
                <div class="c-slider__progress"
                     :style="progressStyle"
                >
                </div>

                <SliderDot ref="dot1"
                           v-model="firstValue"
                           :vertical="vertical"
                           :dragging="dragging || noTransition"
                           :focus="focusDotIndex === 0"
                           @dragstart="onDragStart(0)"
                           @dragend="onDragEnd"
                >
                </SliderDot>

                <SliderDot v-if="range"
                           ref="dot2"
                           v-model="secondValue"
                           :vertical="vertical"
                           :dragging="dragging || noTransition"
                           :focus="focusDotIndex === 1"
                           @dragstart="onDragStart(1)"
                           @dragend="onDragEnd"
                >
                </SliderDot>

                <template v-if="showStops && !markList.length">
                    <div v-for="(stop, index) in stops"
                         :key="index"
                         class="c-slider__stop"
                         :style="[vertical ? {bottom: stop + '%'} : {left: stop + '%'}]"
                    >
                    </div>
                </template>

                <template v-if="markList.length">
                    <div>
                        <div v-for="item in markList"
                             :key="item.point"
                             class="c-slider__stop"
                             :style="[vertical ? {bottom: item.position + '%'} : {left: item.position + '%'}]"
                        >
                        </div>
                    </div>

                    <div class="c-slider__marks">
                        <div v-for="item in markList"
                             :key="item.point"
                             class="c-slider__marks-text"
                             :style="[
                                 vertical ? {bottom: item.position + '%'} : {left: item.position + '%'},
                                 item.mark.style ? item.mark.style : '']"
                        >
                            {{ item.mark.label ? item.mark.label : item.mark }}
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import { splitThousands } from '../../assets/js/utils';
    import SliderDot from './SliderDot';

    export default {
        name: 'Slider',

        components: {
            SliderDot,
        },

        props: {
            min: {
                type: Number,
                default: 0,
            },
            max: {
                type: Number,
                default: 100,
            },
            step: {
                type: Number,
                default: 1,
            },
            value: {
                type: [Number, String, Array],
                default: 0,
            },
            range: {
                type: Boolean,
                default: false,
            },
            vertical: {
                type: Boolean,
                default: false,
            },
            height: {
                type: String,
                default: '',
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            showStops: {
                type: Boolean,
                default: false,
            },
            showValue: {
                type: Boolean,
                default: false,
            },
            valueFormat: {
                type: Function,
                default: splitThousands,
            },
            marks: {
                type: Object,
                default: () => ({}),
            },
            tooltip: {
                type: String,
                default: 'never',
            },
            noTransition: Boolean,
            color: {
                type: String,
                default: '',
            },
        },

        data() {
            return {
                firstValue: null,
                secondValue: null,
                oldValue: null,
                dragging: false,
                sliderSize: 1,
                focusDotIndex: null,
            };
        },

        computed: {
            classList() {
                return [
                    this.color ? `c-slider--${this.color}` : 'c-slider--blue',
                    {
                        _disabled: this.disabled,
                        _vertical: this.vertical,
                    },
                ];
            },
            //
            // Используется для расчета ширины прогресс бара и для слежения, когда firstValue
            // станет больше secondValue.
            // @return {Numebr, Float} Минимальное значение слайдера.
            //
            minValue() {
                return Math.min(this.firstValue, this.secondValue);
            },

            //
            // Аналогично предыдущему
            // @return {Numebr, Float} Максимальное значение слайдера.
            //
            maxValue() {
                return Math.max(this.firstValue, this.secondValue);
            },

            //
            // Точность вычесления
            // @return {Number} Целое число (количество символов после запятой)
            //
            precision() {
                // Массив элементами которого являются количество символов после запятой
                const precisions = [this.min, this.max, this.step].map(item => {
                    const decimal = String(item)
                        .split('.')[1];
                    return decimal ? decimal.length : 0;
                });
                return Math.max.apply(null, precisions);
            },

            //
            // Стопперы (засечки) на рельсе. Исключается стопперы на баре
            // @return {Array} Массив смещений для стопперов
            //
            stops() {
                if (!this.showStops || this.min > this.max) {
                    return [];
                }
                if (this.step === 0) {
                    console.warn('[Element Warn][Slider]step should not be 0.');
                    return [];
                }

                const stopCount = (this.max - this.min) / this.step;
                const stepWidth = 100 * this.step / (this.max - this.min);
                const result = [];

                for (let i = 1; i < stopCount; i++) {
                    result.push(i * stepWidth);
                }

                if (this.range) {
                    return result.filter(step => step < 100 * (this.minValue - this.min) / (this.max - this.min) ||
                        step > 100 * (this.maxValue - this.min) / (this.max - this.min));
                } else {
                    return result.filter(step => step > 100 * (this.firstValue - this.min) / (this.max - this.min));
                }
            },

            //
            // Вычисляет метки на слайдере
            // @return {Array} Массив объектов меток
            //
            markList() {
                if (!this.marks) {
                    return [];
                }

                const marksKeys = Object.keys(this.marks);
                return marksKeys
                    .map(parseFloat)
                    .sort((a, b) => a - b)
                    .filter(point => point <= this.max && point >= this.min)
                    .map(point => ({
                        point,
                        position: (point - this.min) * 100 / (this.max - this.min),
                        mark: this.marks[point],
                    }));
            },

            //
            // Высота рельсты для вертикального режима (не используется в горизонтальном)
            // @return {Object}
            //
            railStyle() {
                return this.vertical ? { height: this.height } : {};
            },

            //
            // Ширина прогресс бара между двумя точками или между точкой и началом
            // @return {String}
            //
            progressSize() {
                return this.range
                    ? `${100 * (this.maxValue - this.minValue) / (this.max - this.min)}%`
                    : `${100 * (this.firstValue - this.min) / (this.max - this.min)}%`;
            },

            //
            // Старт прогресс бара от первой точки или от начала
            // @return {String}
            //
            progressStart() {
                return this.range
                    ? `${100 * (this.minValue - this.min) / (this.max - this.min)}%`
                    : '0%';
            },

            //
            // применение barSize и barStart в зависимости от ветикального или
            // горизонтального положения слайдера. Дополнительно вычисляется транзишн для
            // изменения ширины и положения бара
            // @return {Object} объект со стилями
            //
            progressStyle() {
                return this.vertical
                    ? {
                        height: this.progressSize,
                        bottom: this.progressStart,
                        transition:
                            this.dragging || this.noTransition
                                ? 'bottom 0s ease, height 0s ease'
                                : 'bottom .5s ease, height  .5s ease',
                    }
                    : {
                        width: this.progressSize,
                        left: this.progressStart,
                        transition:
                            this.dragging || this.noTransition
                                ? 'left 0s ease, width 0s ease'
                                : 'left .5s ease, width  .5s ease',
                    };
            },

            //
            // Если есть функция форматирования, применяем ее к значениям, в ином случае возвращаем
            // текущее значение слайдера
            //
            formattedValue() {
                if (this.range) {
                    return this.valueFormat ?
                        [this.valueFormat(this.value[0]), this.valueFormat(this.value[1])] :
                        this.value;
                } else {
                    return this.valueFormat ? this.valueFormat(this.value) : this.value;
                }
            },
        },

        watch: {
            //
            // Если дргается ползунок, то игнорируем изменения, так они вызваны самим ползунком
            //
            value(val, oldVal) {
                if (
                    this.dragging ||
                    Array.isArray(val) &&
                    Array.isArray(oldVal) &&
                    val.every((item, index) => item === oldVal[index])
                ) {
                    return;
                }
                this.setValues();
            },

            //
            // Следим за изменением минимального значения у родителя
            //
            min() {
                this.setValues();
            },

            //
            // Следим за изменением максимальнгого значения у родителя
            //
            max() {
                this.setValues();
            },

            //
            // При изменении значения проверям, является ли слайдер рейнджем и эмитим родителю
            // измененные значения
            //
            firstValue(val) {
                if (this.range) {
                    this.$emit('input', [this.minValue, this.maxValue]);
                } else {
                    this.$emit('input', val);
                }
            },

            //
            // Тоже самое, но только для случая рейдж слайдера
            //
            secondValue() {
                if (this.range) {
                    this.$emit('input', [this.minValue, this.maxValue]);
                }
            },
        },

        //
        // При создании присваиваем значения переменным firstValue и secondValue
        // Также устанавливаем oldValue
        //
        created() {
            if (this.range) {
                if (Array.isArray(this.value)) {
                    this.firstValue = Math.max(this.min, this.value[0]);
                    this.secondValue = Math.min(this.max, this.value[1]);
                } else {
                    this.firstValue = this.min;
                    this.secondValue = this.max;
                }
                this.oldValue = [this.firstValue, this.secondValue];
            } else {
                if (typeof this.value !== 'number' || isNaN(this.value)) {
                    this.firstValue = this.min;
                } else {
                    this.firstValue = Math.min(this.max, Math.max(this.min, this.value));
                }
                this.oldValue = this.firstValue;
            }
        },

        //
        // Вычисляем фактический размер слайдера и вешаем обработчик на ресайз
        //
        mounted() {
            this.resetSize();
            window.addEventListener('resize', this.resetSize);
        },

        //
        // Удаляем обработчик на ресайз
        //
        beforeDestroy() {
            window.removeEventListener('resize', this.resetSize);
        },

        methods: {
            //
            // Если слайдер примонтирован, вычисляем его ширину или высоту. Размер слайдера
            // используется для расчета смещения при клике по рельсе
            //
            resetSize() {
                if (this.$refs.rail) {
                    this.sliderSize = this.$refs.rail[`client${this.vertical ? 'Height' : 'Width'}`];
                }
            },

            setValues() {
                if (this.min > this.max) {
                    console.error('[Slider Error] min should not be greater than max.');
                    return;
                }

                if (this.range && Array.isArray(this.value)) {
                    if (this.value[1] < this.min) {
                        this.$emit('input', [this.min, this.min]);
                    } else if (this.value[0] > this.max) {
                        this.$emit('input', [this.max, this.max]);
                    } else if (this.value[0] < this.min) {
                        this.$emit('input', [this.min, this.value[1]]);
                    } else if (this.value[1] > this.max) {
                        this.$emit('input', [this.value[0], this.max]);
                    } else {
                        this.firstValue = this.value[0];
                        this.secondValue = this.value[1];
                        if (this.valueChanged()) {
                            this.oldValue = this.value.slice();
                        }
                    }
                } else if (!this.range && typeof this.value === 'number' && !isNaN(this.value)) {
                    if (this.value < this.min) {
                        this.$emit('input', this.min);
                    } else if (this.value > this.max) {
                        this.$emit('input', this.max);
                    } else {
                        this.firstValue = this.value;
                        if (this.valueChanged()) {
                            this.oldValue = this.value;
                        }
                    }
                }
            },

            //
            // Функция которая определяет изменилось ли значение слайдера
            // @returns {Boolean}
            //
            valueChanged() {
                if (this.range) {
                    return ![this.minValue, this.maxValue].every((item, index) => item === this.oldValue[index]);
                } else {
                    return this.value !== this.oldValue;
                }
            },

            //
            // При клике на рельс устанавливаем позицию слайдера и эмитим изменение
            // @param {percent} - процент от 0 до 100, место где был клик
            // В результате выполнения функция вызовется метод setPosition у SliderDot
            //
            setPosition(percent) {
                let dot = 'dot1';
                if (this.range) {
                    // targetValue пересчет процента в фактическое значение на слайдере
                    // используется для определния с какой точкой будет взаимодействие
                    const targetValue = this.min + percent * (this.max - this.min) / 100;
                    if (Math.abs(this.minValue - targetValue) < Math.abs(this.maxValue - targetValue)) {
                        dot = this.firstValue < this.secondValue ? 'dot1' : 'dot2';
                    } else {
                        dot = this.firstValue > this.secondValue ? 'dot1' : 'dot2';
                    }
                }

                this.$refs[dot].setPosition(percent);
            },

            //
            // При клике на рельс устанавливаем позицию слайдера и эмитим изменение
            //
            onRailClick(e) {
                if (this.disabled || this.dragging) {
                    return;
                }
                // this.resetSize();

                if (this.vertical) {
                    const sliderOffsetBottom = this.$refs.rail.getBoundingClientRect().bottom;
                    this.setPosition((sliderOffsetBottom - event.clientY) / this.sliderSize * 100);
                } else {
                    const sliderOffsetLeft = this.$refs.rail.getBoundingClientRect().left;
                    this.setPosition((event.clientX - sliderOffsetLeft) / this.sliderSize * 100);
                }
                this.emitChange();
            },

            //
            // Слушаем начало драга
            //
            onDragStart(index) {
                this.dragging = true;
                this.focusDotIndex = index;
                this.$emit('dragstart');
            },

            //
            // Слушаем конец драга
            //
            onDragEnd() {
                this.dragging = false;
                this.focusDotIndex = null;
                this.$emit('dragend');
            },

            //
            // Эмитим изменения значений слайдера
            //
            emitChange() {
                this.$nextTick(() => {
                    this.$emit('change', this.range ? [this.minValue, this.maxValue] : this.firstValue);
                });
            },
        },
    };
</script>

<style lang="scss">
    .c-slider {

        /* Colors */

        &--blue {
            .c-slider__track {
                background-color: $grey-medium;
            }

            .c-slider__progress {
                background-color: $ab-blue;
            }

            .c-slider-dot__handle {
                background-color: $ab-blue;
            }
        }

        &.video {
            .c-slider__track {
                background-color: #39485b;
            }

            .c-slider__progress {
                background-color: #fff;
            }

            .c-slider-dot__handle {
                width: 11px;
                height: 11px;
                background-color: #fff;
            }
        }

        /* End Colors */

        &._disabled {
            opacity: .5;

            .c-slider__rail {
                cursor: default;
            }

            .c-slider__bar {
                background-color: #c0c4cc;
            }
        }

        &__rail {
            position: relative;
            padding: 2px 0;
            cursor: pointer;
        }

        &__track {
            position: relative;
            width: calc(100% - 16px);
            height: 2px;
            margin: 0 8px;
            border-radius: 6px;
        }

        &__progress {
            position: absolute;
            height: 100%;
        }

        &__stop {
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 100%;
            background-color: #fff;
            transform: translateX(-50%);
        }

        &__marks {
            top: 0;
            left: 12px;
            width: 18px;
            height: 100%;
        }

        &__marks-text {
            position: absolute;
            margin-top: 15px;
            font-size: 14px;
            color: #909399;
            transform: translateX(-50%);
        }

        &__values {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1.4rem;
        }

        &__val {
            color: #fff;
        }
    }
</style>
