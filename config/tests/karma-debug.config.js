const config = require("./karma-main.config");

config.webpack.mode = "development";
config.concurrency = 1;

module.exports = function(cfg) {
    cfg.set({
        ...config,
        logLevel: cfg.LOG_INFO
    });
};