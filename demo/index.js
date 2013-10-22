'use strict';

var util = require('util'),
    yeoman = require('yeoman-generator'),
    path = require('path'),
    fs = require('fs'),
    jsdom = require('jsdom');

var DemoGenerator = module.exports = function DemoGenerator(args, options, config) {
    // By calling `NamedBase` here, we get the argument to the subgenerator call
    // as `this.name`.
    yeoman.generators.NamedBase.apply(this, arguments);

    console.log('You called the demo subgenerator with the argument ' + this.name + '.');
};

util.inherits(DemoGenerator, yeoman.generators.NamedBase);

/**
 * Data about the tested module
 */
DemoGenerator.prototype.bowerJSON = function() {
    // read
    var bower = JSON.parse(this.readFileAsString(path.join(this.destinationRoot(), 'bower.json')));

    // remove trailing .js
    this.mainFile = bower.main.replace(/\.js$/,'');
    this.componentName = bower.name;
};


DemoGenerator.prototype.files = function files() {
    this.template('_demo.js', 'dev/demo/'+ this.name +'.js');
    this.template('_demo.html', 'dev/demo/'+ this.name +'.html');
};

DemoGenerator.prototype.linkIndex = function() {

    var devIndexFilePath = path.join(this.destinationRoot(), 'dev/index.html');

    jsdom.env({
        file: devIndexFilePath,
        scripts: ['//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js'],
        done: function (errors, window) {
            var $ = window.$,
                href = 'demo/' + this.name + '.html';

            $('#links').append('<li><a href="'+ href +'">Demo: ' + this.name + '</a></li>');

            console.log('Update dev/index.html');

            // overwrite the index.html file without notifying the user
            fs.writeFileSync(path.join(this.destinationRoot(), 'dev/index.html'), window.document.doctype + window.document.innerHTML);

        }.bind(this),
    });
};
