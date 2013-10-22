var utils = require('../lib/utils');
module.exports = function(node, htmlObj) {
    string = utils.strip.quotes(node['$'].text); 
    htmlObj.head.push('<title>' + string + '</title>');

    return htmlObj;
}
