<template>
    <div :class="['page', $style.MainPage]">
        <div class="container">
            <h1>Проекты {{ count }}</h1>

            <FilterProjects
                :specs="specs"
                :facets="facets"
                :values="values"
                @change="onFilterChange"
            />
        </div>
    </div>
</template>

<script>
    // Utils
    import { objectToQuery } from '../assets/js/utils';
    import { prepareSpecs } from '../assets/js/utils/filterUtils';

    // Components
    import FilterProjects from '../components/filter/FilterProjects';

    const defaultValues = {
        propertyType: 'flat',
        zone: '',
        complete: '',
        price_max: '',
        price_min: '',
    };

    export default {
        name: 'MainPage',

        components: {
            FilterProjects,
        },


        async asyncData({ app }) {
            const values = { zone: 'moscow', complete: false };

            try {
                const [projectsRes, specsRes, facetsRes] = await Promise.all([
                    await app.$axios.$get(app.$api.projects.list, {
                        params: values,
                        paramsSerializer: params => objectToQuery(params),
                    }),
                    await app.$axios.$get(app.$api.projects.specs),
                    await app.$axios.$get(app.$api.projects.facets, {
                        params: values,
                        paramsSerializer: params => objectToQuery(params),
                    }),
                ]);

                return {
                    projects: projectsRes || {},
                    facets: prepareSpecs(facetsRes) || {},
                    specs: prepareSpecs(specsRes) || {},
                };
            } catch (err) {
                console.warn('[MainPage/asyncData] request failed: ', err);
            }
        },

        data() {
            return {
                specs: {},
                facets: {},
                projects: {},
                values: { ...defaultValues },
                count: 0,
            };
        },

        methods: {
            onTypeChange(val) {
                console.log(val);
            },

            onFilterChange(val) {
                this.values = { ...this.values, ...val };
            },
        },
    };
</script>

<style lang="scss" module>
    .MainPage {
        //
    }
</style>
