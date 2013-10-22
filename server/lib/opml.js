var _ = require('underscore'),
    xmldoc = require('xml2js').parseString,
    verbs = require('./verbs'),
    utils = require('./utils');

var list_mode = false;

var html = {
    head: [],
    body: [],
    options: {}
};

var opml = {
    events: {},
    parse_document: function(opmldoc) {
        xmldoc(opmldoc, function(err, result) {
            result = result.opml;
            var headers = result.head[0],
                body = result.body[0].outline;
           
            opml.trigger('headers', [headers]);
            var html = opml.parse_body(body);
            opml.trigger('eof', [html]);
        });
    },
    parse_body: function(body, indent) {
        if(_.isUndefined(indent)) {
            indent = 0;
        }
        _.each(body, function(node) {
            if(verbs.is_valid(node['$'].text)) {
                console.log('verb parsing: ' + node['$'].text);
                html = verbs.handle(node, html);
            }
            else {
                if(!_.isUndefined(node.outline)) {
                    // node has children
                    
                    // this is the blog
                    if((indent > 0 && indent < 3) || _.isEqual(node['$'].icon, 'calendar')) {
                        html = opml.parse_body(node.outline, indent + 1);
                    }
                    else {
                        if(!_.isUndefined(node['$'].isFeedItem)) {
                            html.body.push('<div class="post"><h1>' + node['$'].text + '</h1>');
                        }
                        else {
                        }
                        html.body.push('<div>');
                        html = opml.parse_body(node.outline, indent + 1);
                        html.body.push('</div>');
                        if(!_.isUndefined(node['$'].isFeedItem)) {
                            html.body.push('</div>');
                        }
                    }
                }
                else {
                    var s = '';
                    // no children in this node
                    if(indent < 1 || indent > 2)  {
                        s = '<p>' + node['$'].text + '</p>';
                    }
                    html.body.push(s);
                }
            }
        });

        return html;
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
