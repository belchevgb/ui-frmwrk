const path = require("path");
const root = path.resolve(__dirname, "..");

module.exports.resolveRootPath = function(...args) {
    if (!args && !args.length) {
        args = [];
    }

    const res = path.join.apply(path, [root].concat(args));
    console.log(res);
    return res;
};