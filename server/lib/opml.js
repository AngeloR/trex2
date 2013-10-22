var _ = require('underscore'),
    xmldoc = require('xml2js').parseString;

var opml = {
    events: {},
    parse_document: function(opmldoc) {
        xmldoc(opmldoc, function(err, result) {
            result = result.opml;
            var headers = result.head[0],
                body = result.body;
           
            opml.trigger('headers', [headers]);
            opml.trigger('eof');
        });
    },
    watch: function(event, cb, scope) {
        if(_.isUndefined(opml.events[event])) {
            opml.events[event] = [];
        }
        if(_.isUndefined(scope)) {
            scope = this;
        }
        opml.events[event].push({
            callback: cb,
            scope: scope
        });
    },
    trigger: function(event, args) {
        _.each(opml.events[event], function(obj, i) {
            obj.callback.apply(obj.scope, args); 
        });
    },
    init: function(deps) {
       // we don't have any deps right now 
       return opml;
    }
};

module.exports = opml;
