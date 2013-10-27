var bootstrap = {
    stylesheet: '//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css',
    script: '//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js',
    jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
    replace: function(template) {
        var string = '<link rel="stylesheet" href="' + bootstrap.stylesheet + '">';
        string += '<script src="' + bootstrap.script + '"></script>';
        return template.replace('<%useBootstrap%>', string);
    }
}

module.exports = bootstrap;
