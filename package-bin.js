#!/usr/bin/env node

const OLSKSpec = require('./main.js');

const mod = {

	// COMMAND

	CommandLogicTests() {
		require('child_process').spawn('mocha', [].concat.apply([], [
			'**/*-tests.js',
			'--exclude', '**/+(node_modules|__*)/**',
			'--watch',
			'--file', require('path').join(__dirname, 'mocha-start.js'),

			process.argv.slice(2).length
			? process.argv.slice(2)
			: ['--reporter', 'min'],

			]), {
				stdio: 'inherit'
			});
	},

	CommandUITests(args) {
		let pattern = args.filter(function (e) {
			return e.match(/^-?-?olsk-match=(.+)/i)
		}).shift();

		if (pattern) {
			args.splice(args.indexOf(pattern))

			pattern = pattern.match(/^-?-?olsk-match=(.+)/i)[1]

			const regex = pattern.match(/^\/(.+)\/(.+)?$/);

			if (regex) {
				pattern = new RegExp(regex[1], regex[2]);
			};
		};

		const testPaths = OLSKSpec.OLSKSpecUITestPaths(process.cwd()).filter(function (e) {
			return pattern ? e.match(pattern) : true;
		});
		const sourcePaths = OLSKSpec.OLSKSpecUISourcePaths(process.cwd());

		require('child_process').spawn('supervisor', [].concat.apply([], [
			'--watch', sourcePaths.concat(testPaths).join(','),
			'--extensions', sourcePaths.concat(testPaths).reduce(function (coll, item) {
				const ext = require('path').extname(item).split('.').pop();

				if (!coll.includes(ext)) {
					coll.push(ext);
				};
				
				return coll;
			}, []).join(','),
			'--no-restart-on', 'exit',
			'--quiet',
			'--exec', 'mocha',

			'--',

			testPaths,
			'--file', require('path').join(__dirname, 'mocha-start.js'),
			'--timeout', '1000',

			args.length
			? args
			: ['--reporter', 'min'],

			]), {
				stdio: 'inherit',
				env: Object.assign({
					OLSK_TESTING_BEHAVIOUR: true,
				}, process.env),
			});
	},

	// LIFECYCLE

	LifecycleScriptDidLoad() {
		if (process.argv[1].endsWith('olsk-spec-ui')) {
			return mod.CommandUITests(process.argv.slice(2));
		};

		if (process.argv[1].endsWith('olsk-spec') && process.argv[2] === 'ui') {
			return mod.CommandUITests(process.argv.slice(3));
		};

		mod.CommandLogicTests();
	},

};

mod.LifecycleScriptDidLoad();
