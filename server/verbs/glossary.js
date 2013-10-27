var utils = require('../lib/utils'),
    _ = require('underscore');


var glossary = {
    terms: {},
    replace: function(template) {
        _.each(glossary.terms, function(str, term) {
            template = template.replace(term, str);
        });

        return template;
    },
    handler: function(node, htmlObj) {
        if(!_.isUndefined(node.outline)) {
            _.each(node.outline, function(n) {
                glossary.terms[n.$.text] = utils.opml.squish(n.outline);
            });
        }


        return htmlObj;
    }
};

module.exports = glossary;
