var config = require('./config'),
    _ =require('underscore'),
    redis = require('redis').createClient(),
    app = require('express')(),
    request = require('request'),
    fs = require('fs'),
    tmp = {};


var named_outline = require('./lib/named_outline.js').init({
    redis: redis
});

// this is what actually handles our OPML parsing 
var opml = require('./lib/opml.js').init({

});

// watch for certain opml triggers
opml.watch('headers', function(headers) {
    tmp.headers = headers; 
}, this);

app.get('/invalidate/:name', function(req, res) {
    console.log('Invalidate cache for ' + req.params.name);
    named_outline.exists(req.params.name, function(url) {
        if(url) {
            named_outline.load(url, function(opml) {
                fs.writeFile('./cache/' + req.params.name + '.opml',opml, function(err) {
                    if(err) {
                        console.log(err);
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

// ensure this is a valid named outline
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
            var file = fs.readFileSync('./cache/' + name + '.opml'); 
            opml.watch('eof', function(html) {
                var s = '<html>';
                s += '<head>' + html.head.join("\r\n") + '</head>';
                s += '<body>' + html.body.join("\r\n") + '</body>';

                res.send(s);
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
