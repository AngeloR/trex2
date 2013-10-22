var _ = require('underscore'),
    xmldoc = require('xmldoc');

var opml = {
    regex: {
        BODY: '<body>(.?)*</body>',
        HEAD: '<head>(.?)*</head>'
    },
    parse_document: function(opml) {
        var head = opml.match(opml.regex.HEAD)[0];
        var doc = new xmldoc.XmlDocument(head);
        console.log(doc.toString());
    }
};

module.exports = opml;
