const config = require("./karma-main.config");

config.webpack.mode = "production";
config.concurrency = Infinity;
config.browsers = ["ChromeHeadless"];
config.singleRun = true;

module.exports = function(cfg) {
    cfg.set(config);
};