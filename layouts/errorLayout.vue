<template>
    <div :class="$style.errorLayout">
        <nuxt />
    </div>
</template>

<script>
    export default {
        name: 'ErrorLayout',

        components: {},
    };
</script>

<style lang="scss" module>
    .errorLayout {
        height: 100vh;
        padding-top: $header-h;

        @include respond-to(xs) {
            padding-top: $header-h-mobile;
        }
    }
</style>
