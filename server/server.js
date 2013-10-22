_ = require('underscore');

var config = require('./config'),
    redis = require('redis').createClient(),
    app = require('express')(),
    request = require('request'),
    fs = require('fs');


var named_outline = require('./lib/named_outline.js').init({
    redis: redis
});

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
    var name = named_outline.get_name_from_host(req.host); 
    console.log('Outline required for ' + name);
    named_outline.exists(name, function(url) {
        if(url) {
            var file = fs.readFileSync('./cache/' + name + '.opml'); 
            res.send(file.toString());
        }
        else {
            console.log('Named outline for ' + name + ' does not exist');
            res.send('There is no outline configured at this address.');
        }
    });
});

app.listen(config.server.port);
console.log('Listening on ' + config.server.host +':' + config.server.port);
