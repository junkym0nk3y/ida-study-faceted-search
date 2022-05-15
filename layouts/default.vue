<template>
    <div id="app"
         :class="$style.DefaultLayout"
    >
        <TheHeader
            class="container"
        />

        <main :class="$style.main">
            <nuxt />
        </main>

        <!--        <TheFooter />-->
    </div>
</template>

<script>
    import TheHeader from '../components/layout/TheHeader';
    // import TheFooter from '../components/layout/TheFooter';

    export default {
        name: 'DefaultLayout',
        components: {
            TheHeader,
            // TheFooter,
        },
    };
</script>

<style lang="scss" module>
    .DefaultLayout {
        //
    }

    .main {
        position: relative;
        min-height: calc(100vh - #{$footer-h});
    }
</style>
