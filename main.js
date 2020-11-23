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
	
};

Object.assign(exports, mod);
