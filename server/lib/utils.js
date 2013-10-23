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
    },
    is_alpha: function(ch) {
        return (((ch >= 'a') && (ch <= 'z')) || ((ch >= 'A') && (ch <= 'Z')));
    },
    is_numeric: function(ch) {
        return ((ch >= '0') && (ch <= '9'));
    },
    safen: function(text) {
        var s = "", ch, flNextUpper = false;
        for (var i = 0; i < text.length; i++)  { 
            ch = text [i];
            if (utils.is_alpha (ch) || utils.is_numeric (ch))  { 
                if (flNextUpper)  { 
                    ch = ch.toUpperCase ();
                    flNextUpper = false;
                }
                else  { 
                    ch = ch.toLowerCase ();
                }
                s += ch;
            }
            else  { 
                if (ch == ' ')  { 
                    flNextUpper = true;
                }
            }
        }
        return (s);
    }
};

module.exports = utils;
