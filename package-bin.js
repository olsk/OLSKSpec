#!/usr/bin/env node

const OLSKSpec = require('./main.js');

const mod = {

	// COMMAND

	CommandLogicTests() {
		require('child_process').spawn('mocha', [].concat.apply([], [
			'**/*-tests.js',
			'--exclude', '**/+(node_modules|__*)/**',
			'--watch',
			process.argv.slice(2).length
			? process.argv.slice(2)
			: ['--reporter', 'min'],
			'--file', require('path').join(__dirname, 'mocha-start.js'),
			]), {
				stdio: 'inherit'
			});
	},

	CommandUITests() {
	},

	// LIFECYCLE

	LifecycleScriptDidLoad() {
		if (process.argv[1].endsWith('olsk-spec-ui')) {
			return mod.CommandUITests();
		};

		if (process.argv[1].endsWith('olsk-spec') && process.argv[2] === 'ui') {
			return mod.CommandUITests();
		};

		mod.CommandLogicTests();
	},

};

mod.LifecycleScriptDidLoad();
