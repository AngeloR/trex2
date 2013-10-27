var utils = require('../lib/utils'),
    _ = require('underscore');


var type = {
    default: 'bloghome',
    handler: function(node, htmlObj) {
        type.default = utils.strip.quotes(node.$.text);
        htmlObj.options.default_template = type.default;
        return htmlObj;
    }
};

module.exports = type;
