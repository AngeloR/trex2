var utils = require('../lib/utils');

var blank = {
    handler: function(node, htmlObj) {
        console.log(node);
        return htmlObj;
    }
}

module.exports = blank;
