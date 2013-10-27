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
    verbs: verbs,
    views: {
        post_title: function(node) {
            var date = new Date(node.$.created);
            var ds = date.getFullYear() + '/' + (date.getMonth() + 1)

            var s = '<div class="post"><h1>';
            s += '<a href="'+ds+'/'+utils.safen(node.$.text)+'">' + node.$.text + '</a>';
            s += '</h1>';

            opml.trigger('post', [node]);

            return s;
        }
    },
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
    parse_post: function(body, indent, parsed_body) {
        if(_.isUndefined(indent)) {
            indent = 0;
            parsed_body = [];
        }


        _.each(body, function(node) {
            if(verbs.is_valid(node.$.text)) {
                console.log('parsing verb: ' + node.$.text);
                html = verbs.handle(node, html);
            }
            else {
                if(!_.isUndefined(node.outline)) {
                    // this node has children
                    list_mode = true;
                    if(indent > 1) {
                        parsed_body.push('<li>' + node.$.text + '</li>');
                    }
                    else {
                        parsed_body.push('<p>' + node.$.text + '</p>');
                    }
                    parsed_body.push('<ul>');

                    parsed_body = opml.parse_post(node.outline, indent + 1, parsed_body);
                    
                    parsed_body.push('</ul>');

                    list_mode = (indent > 0);
                }
                else {
                    if(list_mode) {
                        parsed_body.push('<li>' + node.$.text + '</li>');
                    }
                    else {
                        parsed_body.push('<p>' + node.$.text + '</p>');
                    }
                }
            }
        });

        return parsed_body;
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
                        var feed_item_mode = !_.isUndefined(node.$.isFeedItem);
                        if(feed_item_mode) {
                            opml.trigger('post', [node, node.outline]);
                        }
                    }
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
