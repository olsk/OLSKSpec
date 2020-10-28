#!/usr/bin/env node

const OLSKSpec = require('./main.js');

const mod = {

	// CONTROL

	ControlLogicTests(args, useGlobal = false) {
		require('child_process').spawn(useGlobal ? 'mocha' : './node_modules/.bin/mocha', [].concat.apply([], [
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
			}).on('error', function (err) {
				throw new Error('ErrorInputNotValid');
				if (useGlobal) {
					return;
				}

				if (!err.message.includes('ENOENT')) {
					return;
				}

				mod.ControlLogicTests(args, true);
			});
	},

	ControlInterfaceTests(inputData, useGlobal = false) {
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
			'--exec', useGlobal ? 'mocha' : './node_modules/.bin/mocha',

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
			}).on('error', function (err) {
				if (useGlobal) {
					return;
				}

				if (!err.message.includes('ENOENT')) {
					return;
				}

				mod.ControlInterfaceTests(inputData, true);
			});
	},

	// SETUP

	SetupEverything () {
		mod.SetupConfigVariables();

		mod.SetupDataArguments();

		if (mod._DataArguments[1].endsWith('olsk-spec-ui')) {
			return mod.ControlInterfaceTests(mod._DataArguments.slice(2));
		};

		if (mod._DataArguments[1].endsWith('olsk-spec') && mod._DataArguments[2] === 'ui') {
			return mod.ControlInterfaceTests(mod._DataArguments.slice(3));
		};

		mod.ControlLogicTests(mod._DataArguments.slice(2));
	},

	SetupConfigVariables () {
		require('dotenv').config();
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
