var utils = require('../lib/utils');

var text = {
    title: undefined,
    handler: function(node, htmlObj) {
        string = utils.strip.quotes(node['$'].text); 
        htmlObj.options.title = string;

        return htmlObj;
    }
}

module.exports = text;
