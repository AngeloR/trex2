var utils = require('../lib/utils');

module.exports = function(string, htmlObj) {
    string = utils.strip.quotes(string);
    htmlObj.options.domain = string;

    return htmlObj;
}
