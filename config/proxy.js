export const proxy = () => ({
    '/graphql': {
        target: process.env.PROXY_URL,
        pathRewrite: {
            '^/graphql': '/graphql/',
        },
    },
    '/api': {
        target: process.env.PROXY_URL,
        logLevel: 'debug',
        secure: false,
        pathRewrite: {
            '^/api': '/api',
        },
    },
    '/video': process.env.PROXY_URL,
    '/media': process.env.PROXY_URL,
});
