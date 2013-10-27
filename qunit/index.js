'use strict';
var util = require('util'),
    yeoman = require('yeoman-generator'),
    path = require('path'),
    fs = require('fs');

var TestGenerator = module.exports = function TestGenerator(args, options, config) {

    // By calling `NamedBase` here, we get the argument to the subgenerator call
    // as `this.name`.
    yeoman.generators.NamedBase.apply(this, arguments);

    console.log('Creating a qunit test: ' + this.name + '.');
};

util.inherits(TestGenerator, yeoman.generators.NamedBase);

/**
 * Add the test to the qunit test config file.
 */
TestGenerator.prototype.qunitTestConfig = function qunitTestConfig() {
    // read
    var _ = this._,
        testConfig = JSON.parse(this.readFileAsString(path.join(this.destinationRoot(), 'dev/amd-test-config.json')));

    testConfig.tests = _.union(testConfig.tests, [this.name]);

    // overwrite the original file
    fs.writeFileSync(path.join(this.destinationRoot(), 'dev/amd-test-config.json'), JSON.stringify(testConfig, null, '\t'));

}


/**
 * Data about the tested module
 */
TestGenerator.prototype.bowerJSON = function() {
    // read
    var bower = JSON.parse(this.readFileAsString(path.join(this.destinationRoot(), 'bower.json')));

    // remove trailing .js
    this.mainFile = bower.main.replace(/\.js$/,'');
    this.componentName = bower.name;
};

TestGenerator.prototype.files = function files() {
    this.template('_test.js', 'dev/tests/'+ this.name +'.js');
};
