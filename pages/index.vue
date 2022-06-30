<template>
    <div :class="['page', $style.MainPage]">
        <div class="container">
            <h1>Проекты {{ count }}</h1>

            <SingleSelect
                v-model="value"
                :options="options"
                color="grey"
                @change="onTypeChange"
            >
            </singleselect>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MainPage',

        data() {
            return {
                options: [''],
                facet: [
                    {
                        label: 'test1',
                        value: 'test1',
                    },
                    {
                        label: 'test2',
                        value: 'test2',
                    },
                ],

                value: '',
                count: 0,
            };
        },

        methods: {
            onTypeChange(val) {
                console.log(val);
            },
        },
    };
</script>

<style lang="scss" module>
    .MainPage {
        //
    }
</style>
