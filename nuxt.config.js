const StyleLintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
import { plugins } from './config/plugins';

module.exports = {
    // * Headers of the page
    head: {
        htmlAttrs: {
            lang: 'ru',
        },
        title: 'IDA Study',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                hid: 'description',
                name: 'description',
                content: 'IDA Study | Faceted Search',
            },
            // Favicons
            { name: 'msapplication-TileColor', content: '#fff' },
            { name: 'theme-color', content: '#fff' },
        ],
        link: [
            /* Favicons */
            { rel: 'icon', type: 'image/x-icon', href: '/favicons/favicon.ico' },
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '32x32',
                href: '/favicons/favicon-32x32.png',
            },
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '16x16',
                href: '/favicons/favicon-16x16.png',
            },
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' },
            { rel: 'manifest', href: '/favicons/site.webmanifest' },
            { rel: 'mask-icon', href: '/favicons/safari-pinned-tab.svg', color: '#3200f0' },
        ],
    },

    // * Customize the progress-bar color
    // loading: '~/components/layout/progress/TheProgress.vue',
    loading: {
        color: '#1162d9',
    },

    // * Global CSS
    css: [
        '~/assets/scss/bundle.scss',
    ],

    styleResources: {
        scss: [
            './assets/scss/shared/_mixins.scss',
            './assets/scss/shared/_fonts.scss',
            './assets/scss/shared/_variables.scss',
            './assets/scss/default.scss',
        ],
        // hoistUseStatements: true,
    },

    // * Plugins to load before mounting the App
    plugins,

    // * Nuxt.js modules
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/device',
        '@nuxtjs/style-resources',
        '@nuxtjs/svg-sprite',
    ],

    /**
     * В настройках роутера меняет классы для активных ссылок
     */
    router: {
        linkActiveClass: '_active-link',
        linkExactActiveClass: '_exact-link',
    },

    // * Build configuration
    build: {
        publicPath: '/n/',

        // analyze: true,
        // * You can extend webpack config here
        babel: {},

        terser: {
            terserOptions: {
                mangle: {
                    safari10: true,
                },
            },
        },

        loaders: {
            scss: {
                sourceMap: false,
            },
            vue: {
                cacheBusting: false,
            },
        },


        extractCss: true,

        postcss: {
            // Add plugin names as key and arguments as value
            // Install them before as dependencies with npm or yarn
            preset: {
                // Change the postcss-preset-env settings
                autoprefixer: {
                    grid: false,
                },
            },
        },

        extend(config, ctx) {
            // Fixes npm packages that depend on `fs` module
            config.node = {
                fs: 'empty',
            };

            config.module.rules.push({
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader',
            });

            if (ctx.isDev && ctx.isClient) {
                config.plugins.push(new ESLintPlugin({
                    extensions: ['js', 'vue'],
                    exclude: [
                        'node_modules/',
                    ],
                }));

                config.plugins.push(new StyleLintPlugin({
                    extensions: ['scss', 'vue'],
                    failOnError: false,
                    quiet: true,
                    emitWarning: true,
                    lintDirtyModulesOnly: true,
                }));
            }
        },
    },
};
