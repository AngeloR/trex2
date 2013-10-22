var request = require('request'),
    config = require('../config');

var named_outline = {
    // parse the host and figure out if a named 
    // outline exists. If it does return the URL 
    // for the OPML file associated with it.
    
    get_name_from_host: function(host) {
        name = host.replace(config.server.hostname, '');
        return name;
    },
    exists: function(outline_name, cb) {
       named_outline.redis.hget('named_outlines',outline_name, function(err, opml_url) {
        
            if(!err){
                cb(opml_url);
            }
            else {
                console.log(err);
            }
        });
    },
    load: function(url, cb) {
        request.get({url: url}, function(e, r, b) {
            cb(b);
        });
    },
    init: function(deps) {
        named_outline.redis = deps.redis;
        return named_outline;
    }
};

module.exports = named_outline;
