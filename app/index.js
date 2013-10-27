'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    fs = require('fs');




/**
 * hash of default dependencies
 */
var componentDefaultDependencies = {
    'backbone.model': ['backbone'],
    'backbone.view': ['jquery','backbone'],
    'backbone.collection': ['backbone'],
    'jquery': ['jquery'],
    'underscore.mixin': ['underscore'],

    'other': [],
};


var Generator = module.exports = function Generator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));


    // generate a demo
    this.hookFor('bower-amd:demo', {
        args: ['main']
    });

    // generate a test
    this.hookFor('bower-amd:qunit', {
        args: ['base']
    });

    // run grunt when the scaffolding is finished.
    this.on('end', function () {
        this.spawnCommand('grunt',['bower','live']);
    }.bind(this));

    /**
     * Save original source and destination roots.
     */
    this.originalSourceRoot = path.resolve(this.sourceRoot());
    this.originalDestinationRoot = path.resolve(this.destinationRoot());
};

util.inherits(Generator, yeoman.generators.Base);




/**
 * internal methods
 */

/**
 * Set sourceRoot relative to originalSourceRoot and originalDestinationRoot
 */
Generator.prototype._source = function(dir) {
    var source = path.join(this.originalSourceRoot, dir);
    return this.sourceRoot(source);
};

Generator.prototype._destination = function(dir) {
    var destination = path.join(this.originalDestinationRoot, dir);
    return this.destinationRoot(destination);
};









Generator.prototype.askFor = function askFor() {
	var _ = this._,
        // prompts callback
        cb = this.async();

	// have Yeoman greet the user.
	console.log(this.yeoman);

	var prompts = [];

	prompts.push({
		name: 'name',
		type: 'input',
		message: 'What is the name of your component?',
		default: this._.last(process.cwd().split('/')),
        filter: function(name) {
            return {
                machine: name,
                classified: _.classify(name.replace(/\./g,'-')),
            };
        }
	});

    prompts.push({
        name: 'componentType',
        type: 'list',
        message: 'What type of component is it?',
        choices: _.keys(componentDefaultDependencies),
    });

    prompts.push({
        name: 'dependenciesInput',
        type: 'input',
        message: 'What bower packages do you need? [ just as you\'d use when calling bower install ]',
        default: function(answers) {
            return componentDefaultDependencies[answers.componentType].join(' ') || componentDefaultDependencies['other'].join(' ');
        },
    });

	// run prompt
    this.prompt(prompts, function(answers) {
        // make sure the set of defaultDependencies for the given component type
        // is in the dependenciesInput string

            // get the default dependencies for the componentType
        var _ = this._,
            defaultDeps = componentDefaultDependencies[ answers.componentType ],
            dependenciesInputArr = _.words(answers.dependenciesInput),
            dependencies = _.union(dependenciesInputArr, defaultDeps);

        answers.dependenciesInput = dependencies.join(' ');

        // save answers to context.
        this._.extend(this, answers);

        cb();
	}.bind(this));
};


/**
 * bower process:
 *  1- template the bower.json file
 *  2- install bower dependencies (and save them to the bower.json)
 *  3- read the dependency names from the bower.json itself and make them
 *      available to other templates.
 */
Generator.prototype.bowerTemplateFiles = function() {
    this.template('_bower.json', 'bower.json');
    this.copy('bowerrc', '.bowerrc');
};

/**
 * Install bower dependencies synchronously
 */
Generator.prototype.bowerInstallDependencies = function() {
    var cb = this.async();

    console.log('We are now installing the required dependencies for the component.')

    this.bowerInstall(this.dependenciesInput, { save: true }, cb);
};

// after installing dependencies, read bower json
Generator.prototype.bowerReadDependencies = function() {
    var _ = this._,
        bower = JSON.parse(this.readFileAsString(path.join(this.destinationRoot(), 'bower.json')));

    // dependencies
    this.dependencies = bower.dependencies;
};

/**
 * @method
 * Templates and copies files for the root.
 */
Generator.prototype.root = function() {

    /**
     * /
     * /bower.json
     * /package.json
     * /README.md
     *
     * /.bowerrc
     * /.gitignore
     * /.editorconfig
     * /.jshintrc
     * /Gruntfile.js
     *
     * /component.js
     *
     * /dev/
     * /dev/amd-test-config.json
     * /dev/amd-test-runner.js
     * /dev/index.html
     * /dev/main.js
     * /dev/tests.html
     *
     * /dev/test-cases/
     * /dev/test-cases/component_test.js
     */
    this.template('_package.json', 'package.json');
    this.template('_README.md', 'README.md');

    this.copy('gitignore', '.gitignore');
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');

    this.template('_Gruntfile.js','Gruntfile.js');
};

Generator.prototype.rootTemplateComponent = function() {

    if (this.componentType.match('backbone')) {

        this.template('_component.backbone.js', this.name.machine + '.js');

    } else if (this.componentType === 'jquery') {

        this.template('_component.jquery.js', this.name.machine + '.js');

    } else if (this.componentType === 'underscore.mixin') {

        this.template('_component.underscore.js', this.name.machine + '.js');

    } else {

        this.template('_component.other.js', this.name.machine + '.js');

    }

};

/**
 * dev tree and files.
 *
 */
Generator.prototype.devTree = function() {
    this.mkdir('dev');
    this.mkdir('dev/tests');
    this.mkdir('dev/demo');
    this.mkdir('dev/generator-' + this.name.machine );
};


Generator.prototype.devFiles = function() {
    // go to /dev
    this._source('dev');
    this._destination('dev');

    this.template('_amd-test-config.json', 'amd-test-config.json');
    this.template('_amd-test-runner.js', 'amd-test-runner.js');

    this.template('_main.js', 'main.js');
    this.template('_tests.html', 'tests.html');


    this.template('_index.html', 'index.html');

    // back to /
    /*
    this.sourceRoot( path.join(this.sourceRoot(), '..') );
    this.destinationRoot( path.join(this.destinationRoot(), '..') );
    */
}

/**
 * Template and copy files for the component instance generator.
 */
Generator.prototype.componentGenerator = function() {
    this._source('dev/generator-component');
    this._destination('dev/generator-' + this.name.machine);

    this.template('_package.json', 'package.json');
    this.mkdir( path.join(this.destinationRoot(), 'app') );
    this.mkdir( path.join(this.destinationRoot(), 'app/templates') );

    this.template('app/_index.js', 'app/index.js');
    this.template('app/templates/__instance.js', 'app/templates/_instance.js');
}

/**
 * Install all dependencies, run grunt bower
 */
Generator.prototype.finish = function() {
    this._source('.');
    this._destination('.');

    var cb = this.async();

    this.installDependencies({
        npm: true,
        bower: true,

        callback: cb,
    });
};
