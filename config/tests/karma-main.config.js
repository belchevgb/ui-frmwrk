const webpackConfig = require("../webpack/webpack-dev.config");

const testsPattern = "../../tests/**/*.spec.ts";
const srcPattern = "../../src/**/*.ts";

module.exports = {
    basePath: '',
    frameworks: ['jasmine'],
    files: [testsPattern],
    plugins: [
        require("karma-jasmine"),
        require("karma-webpack"),
        require("karma-chrome-launcher"),
        require('karma-sourcemap-loader')
    ],
    preprocessors: {
        [testsPattern]: ['webpack'],
        [srcPattern]: ['webpack'],
    },
    reporters: ['progress'],
    port: 9876,
    autoWatch: true,
    browsers: ['Chrome'],
    mime: {
        'text/x-typescript': ['ts']
    },
    webpack: webpackConfig
};