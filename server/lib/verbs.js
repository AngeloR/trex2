var _ = require('underscore');

var verbs = {
    is_valid: function(string) {
        string = string.split(' ');
        if(!_.isUndefined(verbs.verb_handlers[string[0]])) {
            return true;
        }
        return false;
    },
    handle: function(node, htmlObj) {
        var verb = node['$'].text.split(' ')[0];
        node.$.text = node.$.text.replace(verb + ' ', '');
        return verbs.verb_handlers[verb](node, htmlObj);
    },
    verb_handlers: {
        '#text': require('../verbs/text'),
        '#domain': require('../verbs/blank'),
        '#glossary': require('../verbs/blank.js'),
        '#menus': require('../verbs/blank.js'),
        '#templates': require('../verbs/blank.js')
    }
};

module.exports = verbs;
