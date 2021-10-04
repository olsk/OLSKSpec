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
			
			args.includes('--ci') ? [] : '--watch',

			OLSKSpec.OLSKSpecMochaStandardConfiguration(args),

			]), {
				stdio: 'inherit',
				env: Object.assign(process.env, {
					npm_lifecycle_script: 'olsk-spec',
				}),
			}).on('exit', function (code) {
				process.exit(code);
			});
	},

	ControlInterfaceTests(inputData) {
		const args = inputData.slice();
		
		const testPaths = OLSKSpec.OLSKSpecUITestPaths(process.cwd()).filter(OLSKSpec.OLSKSpecUITestPathsFilterFunction(args));
		const sourcePaths = OLSKSpec.OLSKSpecUISourcePaths(process.cwd());

		require('child_process').spawn(mod.DataMochaPath() || 'mocha', [].concat.apply([], [
			testPaths,
			
			args.includes('--ci') ? [] : '--watch',
			'--watch-files', sourcePaths,

			'--timeout', '1000',

			OLSKSpec.OLSKSpecMochaStandardConfiguration(args),

			]), {
				stdio: 'inherit',
				env: Object.assign(process.env, {
					OLSK_SPEC_MOCHA_INTERFACE: true,
				}),
			}).on('exit', function (code) {
				process.exit(code);
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
