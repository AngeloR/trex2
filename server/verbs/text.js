var utils = require('../lib/utils');
module.exports = function(string, htmlObj) {
    string = utils.strip.quotes(string); 
    htmlObj.head.push('<title>' + string + '</title>');

    return htmlObj;
}
