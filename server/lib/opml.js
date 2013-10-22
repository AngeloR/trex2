var _ = require('underscore'),
    xmldoc = require('xml2js').parseString;

var opml = {
    parse_document: function(opml) {
        xmldoc(opml, function(err, result) {
            result = result.opml;
            var headers = result.head[0],
                body = result.body;
            
            console.log(headers);
        });
    },
    init: function(deps) {
       // we don't have any deps right now 
       return opml;
    }
};

module.exports = opml;
