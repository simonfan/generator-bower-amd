'use strict';
var util = require('util'),
    yeoman = require('yeoman-generator'),
    path = require('path');

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
