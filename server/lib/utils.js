var utils = {
    strip: {
        quotes: function(str) {
            return str.replace(/"/g, '');
        }
    },
    repeat: function(str, times) {
        var s = '';
        for(var i = 0; i < times; ++i) {
            s += str;
        }
        return s;
    }
};

module.exports = utils;
