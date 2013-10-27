var utils = require('../lib/utils'),
    _ = require('underscore');

var templates = {
    template_list: {},
    load: function(node) {
        _.each(node.outline, function(tNode) {
            templates.template_list[tNode.$.text] = utils.opml.squish(tNode.outline);
        });
    },
    parse: function(node) {
        var str = node.$.text;

        if(!_.isUndefined(node.outline)) {
            _.each(node.outline, function(n) {
                str += templates.parse(n);
            });
        }

        return str;
    },
    handler: function(node, htmlObj) {
        templates.load(node);
        return htmlObj;
    }
};

module.exports = templates; 
