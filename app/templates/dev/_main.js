require.config({
	urlArgs: "bust=" + Math.random(),
	baseUrl: '/dev',
	paths: {
        requirejs: "bower_components/requirejs/requirejs",
        text: "bower_components/requirejs-text/text",

        "<%= name.machine %>": "../<%= name.machine %>",
    },

    shim: {
        backbone: {
            exports: 'Backbone',
            deps: ['jquery','underscore'],
        },
        underscore: {
            exports: '_',
        }
    },
});

(function() {
    var load = window.__load || 'amd-test-runner';
    require([load], function(mod) {
        console.log('Main loading finished.');
    });
})();
