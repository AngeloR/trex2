var _ = require('underscore');

var verbs = {
    registered: [
        '#text'
    ],
    is_valid: function(string) {
        string = string.split(' ');
        if(verbs.registered.indexOf(string[0]) >= 0) {
            return true;
        }
        return false;
    },
    handle: function(obj, htmlObj) {
        var text = obj['$'].text;
        text = text.split(' ');
        var verb = text.shift();
        text = text.join(' ');

        return verbs.verb_handlers[verb](text, htmlObj);
    },
    verb_handlers: {
        '#text': require('../verbs/text') 
    }
};

module.exports = verbs;
