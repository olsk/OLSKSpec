const mod = {

	OLSKSpecUITestPaths (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!require('OLSKDisk').OLSKDiskIsRealFolderPath(inputData)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return mod._OLSKSpecUITestPaths(inputData);
	},

	_OLSKSpecUITestPaths (inputData) {
		return require('glob').sync('**/ui-test-*.js', {
			cwd: inputData,
			realpath: true,
		}).filter(function (e) {
			return !e.match(require('OLSKDisk').OLSKDiskStandardIgnorePattern());
		});
	},

	OLSKSpecLogicSourcePaths (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!require('OLSKDisk').OLSKDiskIsRealFolderPath(inputData)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return mod._OLSKSpecUITestPaths(inputData).map(function (e) {
			return e.replace(/-tests/i, '');
		}).filter(require('OLSKDisk').OLSKDiskIsRealFilePath);
	},
	
};

Object.assign(exports, mod);
