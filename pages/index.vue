<template>
    <div :class="['page', $style.MainPage]">
        <div class="container">
            <h1>Проекты {{ count }}</h1>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MainPage',
    };
</script>

<style lang="scss" module>
    .MainPage {
        //
    }
</style>
