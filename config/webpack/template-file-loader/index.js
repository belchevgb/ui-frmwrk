const templateUrlPattern = /templateUrl:(\s*['"`](.*?)['"`])/igm;

module.exports = function (source) {
    const newSource = source.replace(templateUrlPattern, (_, url) => {
        return `template: require(${url})`;
    });

    return newSource;
}