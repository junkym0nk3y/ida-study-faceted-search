<template>
    <div :class="$style.FilterProjects">
        <div :class="$style.row">
            <SingleSelect
                :class="$style.filter"
                name="zone"
                :value="values.zone"
                :specs="specs.zone"
                placeholder="Район"
                @change="$emit('change', $event)"
            />

            <SingleSelect
                :class="$style.filter"
                name="propertyType"
                :value="values.propertyType"
                :specs="specs.propertyType"
                placeholder="Купить"
                @change="$emit('change', $event)"
            />

            <SingleSelect
                :class="$style.filter"
                name="complete"
                :value="values.complete"
                :specs="specs.complete"
                placeholder="Срок сдачи"
                @change="$emit('change', $event)"
            />
        </div>

    </div>
</template>

<script>
    export default {
        name: 'FilterProjects',

        props: {
            values: {
                type: Object,
                default: () => ({}),
            },

            specs: {
                type: Object,
                default: () => ({}),
            },

            facets: {
                type: Object,
                default: () => ({}),
            },
        },
    };
</script>

<style lang="scss" module>
    .FilterProjects {
        //
    }

    .row {
        display: flex;
        flex-flow: row nowrap;
    }

    .filter {
        flex: 1;
        margin-right: 2rem;

        &:last-child {
            margin-right: 0;
        }
    }
</style>
