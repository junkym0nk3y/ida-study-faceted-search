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

            {{ items }}
        </div>
    </div>
</template>

<script>
    // Utils
    import { objectToQuery, applyQuery } from '../assets/js/utils';
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

    const arrUpdateSpecs = ['zone'];

    export default {
        name: 'MainPage',

        components: {
            FilterProjects,
        },

        async asyncData({ app, query }) {
            const values = applyQuery({ ...defaultValues }, query);

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
                    items: projectsRes || [],
                    facets: prepareSpecs(facetsRes) || {},
                    specs: prepareSpecs(specsRes) || {},
                    count: projectsRes?.length || 0,
                    values,
                };
            } catch (err) {
                console.warn('[MainPage/asyncData] request failed: ', err);
            }
        },

        data() {
            return {
                specs: {},
                facets: {},
                items: [],
                values: { ...defaultValues },
                count: 0,
                isReloadActive: false,
            };
        },

        methods: {
            async onFilterChange(val) {
                if (val === 'reset') {
                    await this.handleReset();
                    return;
                }

                if (Object.values(val)[0] === false) {
                    delete this.values[Object.keys(val)[0]];
                } else {
                    this.values = { ...this.values, ...val };
                }

                const valueKey = Object.keys(val)[0];
                await this.handleUpdateItems(arrUpdateSpecs.includes(valueKey));
            },

            async handleReset() {
                if (JSON.stringify(this.values) !== JSON.stringify(defaultValues)) {
                    this.values = { ...defaultValues };
                    await this.handleUpdateItems(true);
                }
            },

            async handleUpdateItems(updateSpecs = false) {
                this.isReloadActive = true;

                const [projectsRes, facetsRes] = await Promise.all([
                    this.handleFetchItems(),
                    this.handleFetchFacets(),
                ]);

                if (updateSpecs) {
                    const specsRes = await this.handleFetchSpecs();
                    const zoneIndex = specsRes.findIndex(i => i.name === 'zone');
                    delete specsRes[zoneIndex];
                    this.specs = { ...this.specs, ...prepareSpecs(specsRes) } || {};
                }

                this.items = projectsRes || [];
                this.count = this.items.length || 0;
                this.facets = prepareSpecs(facetsRes) || {};

                this.handleUpdateQuery();
                this.isReloadActive = false;
            },


            async handleFetchItems() {
                try {
                    const resp = await this.$axios.$get(this.$api.projects.list, {
                        params: this.values,
                        paramsSerializer: params => objectToQuery(params),
                    });
                    return resp || [];
                } catch (err) {
                    console.warn('[projectsPage/handleFetchItems] request failed: ', err);
                }
            },

            async handleFetchSpecs() {
                try {
                    const resp = await this.$axios.$get(this.$api.projects.specs, {
                        params: this.values,
                        paramsSerializer: params => objectToQuery(params),
                    });
                    return resp || [];
                } catch (err) {
                    console.warn('[projectsPage/handleFetchSpecs] request failed: ', err);
                }
            },

            async handleFetchFacets() {
                try {
                    const resp = await this.$axios.$get(this.$api.projects.facets, {
                        params: this.values,
                        paramsSerializer: params => objectToQuery(params),
                    });
                    return resp || [];
                } catch (err) {
                    console.warn('[projectsPage/handleFetchFacets] request failed: ', err);
                }
            },

            handleUpdateQuery() {
                const query = {};

                const values = { ...this.values };
                delete values.type;

                Object.keys(values)
                    .forEach(key => {
                        if (values[key] !== '') {
                            query[key] = values[key];
                        }
                    });

                let url = `${this.$route.path}?`;
                Object.keys(query).length
                    ? url += objectToQuery(query)
                    : url = url.slice(0, -1);
                window.history.replaceState(null, null, url);
            },
        },
    };
</script>

<style lang="scss" module>
    .MainPage {
        //
    }
</style>
