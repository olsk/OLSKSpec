#!/usr/bin/env node

require('OLSKEnv').OLSKEnvGuard();

const OLSKSpec = require('./main.js');

const mod = {

	// DATA

	DataMochaPath () {
		return OLSKSpec.OLSKSpecMochaPaths({
			ParamPackageDirectory: __dirname,
			ParamWorkingDirectory: process.cwd(),
		}).filter(require('fs').existsSync).shift();
	},

	// CONTROL

	ControlLogicTests(args) {
		require('child_process').spawn(mod.DataMochaPath() || 'mocha', [].concat.apply([], [
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
				env: Object.assign(process.env, {
					npm_lifecycle_script: 'olsk-spec',
				}),
			});
	},

	ControlInterfaceTests(inputData) {
		const args = inputData.slice();

		let include = args.filter(function (e) {
			return e.match(/^-?-?os-match=(.+)/i)
		}).shift();

		if (include) {
			args.splice(args.indexOf(include), 1);

			include = include.match(/^-?-?os-match=(.+)/i)[1]

			const regex = include.match(/^\/(.+)\/(.+)?$/);

			if (regex) {
				include = new RegExp(regex[1], regex[2]);
			}
		}
		
		let exclude = args.filter(function (e) {
			return e.match(/^-?-?os-skip=(.+)/i)
		}).shift();

		if (exclude) {
			args.splice(args.indexOf(exclude), 1);

			exclude = exclude.match(/^-?-?os-skip=(.+)/i)[1]

			const regex = exclude.match(/^\/(.+)\/(.+)?$/);

			if (regex) {
				exclude = new RegExp(regex[1], regex[2]);
			}
		}
		
		const testPaths = OLSKSpec.OLSKSpecUITestPaths(process.cwd()).filter(function (e) {
			if (include && e.match(include)) {
				return true;
			}
			
			if (exclude && e.match(exclude)) {
				return false;
			}

			if (include && !e.match(include)) {
				return false;
			}
			
			if (exclude && !e.match(exclude)) {
				return true;
			}
			
			return true;
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
			'--exec', mod.DataMochaPath() || 'mocha',

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
					OLSK_SPEC_MOCHA_INTERFACE: true,
				}, process.env),
			});
	},

	// SETUP

	SetupEverything () {
		mod.SetupDataArguments();

		if (mod._DataArguments[1].endsWith('olsk-spec-ui')) {
			return mod.ControlInterfaceTests(mod._DataArguments.slice(2));
		}

		if (mod._DataArguments[1].endsWith('olsk-spec') && mod._DataArguments[2] === 'ui') {
			return mod.ControlInterfaceTests(mod._DataArguments.slice(3));
		}

		mod.ControlLogicTests(mod._DataArguments.slice(2));
	},

	SetupDataArguments () {
		mod._DataArguments = OLSKSpec.OLSKSpecUIArguments(process.argv);
	},

	// LIFECYCLE

	LifecycleScriptDidLoad() {
		mod.SetupEverything();
	},

};

mod.LifecycleScriptDidLoad();
