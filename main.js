const _require = require;

const mod = {

	OLSKSpecUIArguments (inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return inputData.map(function (e) {
			if (e.match(/^match=/)) {
				return e.replace(/^match=/, '-os-match=');
			}

			if (e.match(/^skip=/)) {
				return e.replace(/^skip=/, '-os-skip=');
			}

			return e;
		});
	},

	OLSKSpecUITestPaths (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!_require('OLSKDisk').OLSKDiskIsRealFolderPath(inputData)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return _require('glob').globSync('**/ui-test-*.js', {
			cwd: inputData,
			realpath: true,
		}).filter(function (e) {
			return !e.match(_require('OLSKDisk').OLSKDiskStandardIgnorePattern());
		});
	},

	OLSKSpecUITestPathsFilterFunction (inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('OLSKErrorInputNotValid');
		}

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

		return function (e) {
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
		};
	},

	OLSKSpecUISourcePaths (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!_require('OLSKDisk').OLSKDiskIsRealFolderPath(inputData)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return _require('glob').globSync('**/+(ui-behaviour.js|*.ejs|*.md|*.html|*.hbs)', {
			cwd: inputData,
			realpath: true,
		}).filter(function (e) {
			if (e.match('__compiled')) {
				return true;
			}
			
			return !e.match(_require('OLSKDisk').OLSKDiskStandardIgnorePattern());
		});
	},

	OLSKSpecMochaPaths (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof inputData.ParamPackageDirectory !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof inputData.ParamWorkingDirectory !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return [
			_require('path').join(inputData.ParamPackageDirectory, './node_modules/.bin/mocha'),
			_require('path').join(inputData.ParamPackageDirectory, '../.bin/mocha'),
			_require('path').join(inputData.ParamWorkingDirectory, './node_modules/.bin/mocha'),
			];
	},

	_OLSKSpecMochaReplaceES6Import (inputData) {
		const exportable = [];
		
		inputData = inputData
			.replace(/^import \* as (\w+) from ['"]([^'"]+)['"];?/gm, 'var $1 = require("$2");')
			// .replace(/^import (\w+) from ['"]([^'"]+)['"];?/gm, 'var {default: $1} = require("$2");')
			.replace(/^import (\w+) from ['"]([^'"]+)['"];?/gm, 'var _$1 = require("$2"); const $1 = _$1.default || _$1')
			.replace(/^import {([^}]+)} from ['"](.+)['"];?/gm, 'var {$1} = require("$2");')
			.replace(/^export default /gm, 'exports.default = ')
			.replace(/^export (const|let|var|class|function) (\w+)/gm, (match, type, name) => {
				exportable.push(name);
				return `${type} ${name}`;
			})
			.replace(/^export \{([^}]+)\}(?: from ['"]([^'"]+)['"];?)?/gm, (match, names, source) => {
				names.split(',').filter(Boolean).forEach(name => {
					exportable.push(name);
				});

				return source ? `const { ${names} } = require("${source}");` : '';
			})
			.replace(/^export function (\w+)/gm, 'exports.$1 = function $1');

		exportable.forEach(name => {
			inputData += `\nexports.${name} = ${name};`;
		});

		return inputData;
	},

	OLSKSpecMochaStandardConfiguration (inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return [].concat.apply([], [
			'--file', _require('path').join(__dirname, 'mocha-start.js'),
			_require('fs').existsSync(_require('path').join(process.cwd(), 'mocha-start.js')) ? ['--file', _require('path').join(process.cwd(), 'mocha-start.js')] : [],
			inputData.includes('--reporter') ? [] : ['--reporter', 'min'],
			inputData.length
			? inputData
			: [],
		]);
	},
	
};

Object.assign(exports, mod);

if (typeof exports === 'object') {
	exports.OLSK_SPEC_UI = function () {
		if (typeof navigator === 'undefined') {
			return false;
		}

		if (typeof window !== 'undefined' && window.location.hostname === 'loc.tests') {
			return true;
		}

		return navigator.appName === 'Zombie';
	};
}
