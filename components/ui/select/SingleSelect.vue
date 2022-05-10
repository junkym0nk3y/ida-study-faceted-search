<template>
    <div v-clickoutside="onClickOutside"
         :class="['c-select', classList]"
    >

        <div class="c-select__field"
             @click.stop="toggleMenu"
        >
            <input ref="input"
                   class="c-select__input"
                   type="text"
                   :value="selectedLabel"
                   :disabled="isDisabled"
                   :readonly="true"
                   @focus="onFocus"
                   @keydown.down.stop.prevent="navigateOptions('down')"
                   @keydown.up.stop.prevent="navigateOptions('up')"
                   @keydown.enter.prevent="onEnterPress"
                   @keydown.esc="isOpened = false"
                   @keydown.tab="onBlur"
                   @mouseenter.native="inputHovering = true"
                   @mouseleave.native="inputHovering = false"
            />

            <div class="c-select__arrow">
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
                 class="c-select__dropdown"
            >
                <CScrollBox ref="scrollbar"
                            class="c-select__dropdownWrap"
                >
                    <Option v-for="(option, index) in optionList"
                            :key="option.value"
                            :option="option"
                            :value="value"
                            :is-highlighted="highlightIndex === index"
                            @mouseenter="highlightIndex = index"
                            @mouseleave="highlightIndex = -1 "
                            @click="onOptionSelect"
                    />
                </CScrollBox>
            </div>
        </transition>

        <select :name="name"
                :required="required"
                class="c-select__native"
                :class="{['visible']: !isDisabled}"
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

<script type="text/babel">
  import Option from './Option';
  import Clickoutside from '../../directives/clickoutside';
  import CScrollBox from '../scrollbox/CScrollBox';

  export default {
    name: 'SingleSelect',

    components: {
      CScrollBox,
      Option,
    },

    directives: {
      Clickoutside,
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

            [`_${this.color}`]: this.color,
            [`_${this.size}`]: this.size,
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
