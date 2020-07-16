#!/usr/bin/env node

const OLSKSpec = require('./main.js');

const mod = {

	// CONTROL

	ControlLogicTests(args) {
		require('child_process').spawn('mocha', [].concat.apply([], [
			'**/*-tests.js',
			'--exclude', '**/+(node_modules|__*)/**',
			'--watch',
			'--file', require('path').join(__dirname, 'mocha-start.js'),
			require('fs').existsSync(require('path').join(process.cwd(), 'mocha-start.js')) ? ['--file', require('path').join(process.cwd(), 'mocha-start.js')] : [],
			args.includes('--reporter') ? [] : ['--reporter', 'min'],

			args.length
			? args
			: [],

			]), {
				stdio: 'inherit',
			});
	},

	ControlInterfaceTests(args) {
		let pattern = args.filter(function (e) {
			return e.match(/^-?-?os-match=(.+)/i)
		}).shift();

		if (pattern) {
			args.splice(args.indexOf(pattern), 1);

			pattern = pattern.match(/^-?-?os-match=(.+)/i)[1]

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
			require('fs').existsSync(require('path').join(process.cwd(), 'mocha-start.js')) ? ['--file', require('path').join(process.cwd(), 'mocha-start.js')] : [],
			'--timeout', '1000',
			args.includes('--reporter') ? [] : ['--reporter', 'min'],

			args.length
			? args
			: [],

			]), {
				stdio: 'inherit',
				env: Object.assign({
					OLSK_TESTING_BEHAVIOUR: true,
				}, process.env),
			});
	},

	// LIFECYCLE

	LifecycleScriptDidLoad() {
		require('dotenv').config();
		
		if (process.argv[1].endsWith('olsk-spec-ui')) {
			return mod.ControlInterfaceTests(process.argv.slice(2));
		};

		if (process.argv[1].endsWith('olsk-spec') && process.argv[2] === 'ui') {
			return mod.ControlInterfaceTests(process.argv.slice(3));
		};

		mod.ControlLogicTests(process.argv.slice(2));
	},

};

mod.LifecycleScriptDidLoad();
