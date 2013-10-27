var config = require('./config'),
    _ =require('underscore'),
    utils = require('./lib/utils'),
    redis = require('redis').createClient(),
    express = require('express'),
    bootstrap = require('./lib/bootstrap'),
    app = express(),
    request = require('request'),
    fs = require('fs'),
    tmp = {};

app.use(express.bodyParser());

var named_outline = require('./lib/named_outline.js').init({
    redis: redis
});

// this is what actually handles our OPML parsing 
var opml = require('./lib/opml.js').init();

// watch for certain opml triggers
opml.watch('headers', function(headers) {
    tmp.headers = headers; 
}, this);

app.post('/name-outline', function(req, res) {
    if(_.isEmpty(req.body.name) || _.isEmpty(req.body.opml)) {
        res.send(400);
    }

    named_outline.exists(req.body.name, function(url) {
        if(url) {
            res.send(304);
        }
        else {
            named_outline.load(req.body.opml, function(opml) {
                named_outline.save(req.body.name, opml, function(err) {
                    if(err) {
                        res.send(500);    
                    }
                    else {
                        redis.hset('named_outlines',req.body.name, req.body.opml, function(err) {
                            if(!err) {
                                res.send(201);
                            }
                            else {
                                console.log(err);
                                res.send(500);
                            }
                        });
                    }
                });
            });
        }
    });
});

app.post('/invalidate/:name', function(req, res) {
    console.log('Invalidate cache for ' + req.params.name);
    named_outline.exists(req.params.name, function(url) {
        if(url) {
            named_outline.load(url, function(opml) {
                named_outline.save(req.params.name, opml, function(err) {
                    if(err) {
                        console.log(err);
                        res.send(500);
                    }
                    else {
                        res.send(204);
                    }
                });
            });
        }
        else {
            res.send(204);
        }
    });
});

// Load a single post for any outline
app.get('/:year/:month/:postname', function(req, res, next) {
    var name = named_outline.get_name_from_host(req.host);
    named_outline.exists(name, function(url) {
        if(url) {
            console.log('parsing opml');
            var file = fs.readFileSync('./cache/' + name + '.opml'),
                body = '';

            opml.watch('post', function(node) {
                if(_.isEqual(utils.safen(node.$.text), req.params.postname)) {
                    var post = '<div class="post">';
                    post += '<h1>' + node.$.text + '</h1>';
                    post += opml.parse_post(node.outline).join("\r\n");
                    post += '</div>';
                    body = post;
                }
            });

            opml.watch('eof', function(html) {
                var s = '<html>';
                s += '<head>' + html.head.join("\r\n"); + '</head>';
                s += '<body>' + body + '</body>';
                res.send(s);
            });

            opml.parse_document(file);
        }
        else {
            console.log('404 on requested post');
            res.send('404');
        }
    });
});

// Load the homepage of ANY outline
app.get('/*', function(req, res, next) {
    // ignore favicon
    if(req.params[0] == 'favicon.ico') {
        res.send(404);
    }

    var name = named_outline.get_name_from_host(req.host); 
    console.log('Outline required for ' + name);
    named_outline.exists(name, function(url) {
        if(url) {
            console.log('Parsing opml');
            var file = fs.readFileSync('./cache/' + name + '.opml'),
                body = '';

            // watch post to get individual post details!
            opml.watch('post', function(node) {
                var d = new Date(node.$.created);
                var post = '<div class="post">';
                post += '<h1><a href="/'+d.getFullYear()+'/'+(d.getMonth() + 1) + '/' + utils.safen(node.$.text) +'">' + node.$.text + '</a></h1>';
                post += opml.parse_post(node.outline).join("\r\n");
                post += '</div>';
                body += post;
            });

            // watch end of file to do complete render
            opml.watch('eof', function(html) {
                console.log('Render with template: ' + html.options.default_template);
                var template = opml.verbs.verb_handlers['#templates'].template_list[html.options.default_template];
                template = bootstrap.replace(template);
                template = template.replace('<%text%>', html.options.title);
                template = opml.verbs.verb_handlers['#glossary'].replace(template);
                template = template.replace('<%bodytext%>', body);

                res.send(template);
            }, this);

            opml.parse_document(file);
        }
        else {
            console.log('Named outline for ' + name + ' does not exist');
            res.send('There is no outline configured at this address.');
        }
    });
});

app.listen(config.server.port);
console.log('Listening on ' + config.server.host +':' + config.server.port);
