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

		if (!require('OLSKDisk').OLSKDiskIsRealFolderPath(inputData)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return require('glob').sync('**/ui-test-*.js', {
			cwd: inputData,
			realpath: true,
		}).filter(function (e) {
			return !e.match(require('OLSKDisk').OLSKDiskStandardIgnorePattern());
		});
	},

	OLSKSpecUISourcePaths (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!require('OLSKDisk').OLSKDiskIsRealFolderPath(inputData)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return require('glob').sync('**/+(ui-behaviour.js|*.ejs|*.md)', {
			cwd: inputData,
			realpath: true,
		}).filter(function (e) {
			if (e.match('__compiled')) {
				return true;
			}
			
			return !e.match(require('OLSKDisk').OLSKDiskStandardIgnorePattern());
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
			require('path').join(inputData.ParamPackageDirectory, './node_modules/.bin/mocha'),
			require('path').join(inputData.ParamPackageDirectory, '../.bin/mocha'),
			require('path').join(inputData.ParamWorkingDirectory, './node_modules/.bin/mocha'),
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

	OLSK_SPEC_UI () {
		if (typeof navigator === 'undefined') {
			return false;
		}

		return navigator.appName === 'Zombie';
	},
	
};

Object.assign(exports, mod);
