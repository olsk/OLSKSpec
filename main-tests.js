const { throws, deepEqual } = require('assert');

const mainModule = require('./main.js');

const uPath = function (inputData) {
	return require('path').join(__dirname, 'stubs', inputData)
}

describe('OLSKSpecLogicTestPaths', function testOLSKSpecLogicTestPaths() {

	it('throws if not string', function() {
		throws(function() {
			mainModule.OLSKSpecLogicTestPaths(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if not real directory', function() {
		throws(function() {
			mainModule.OLSKSpecLogicTestPaths(uPath('alf'));
		}, /OLSKErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mainModule.OLSKSpecLogicTestPaths(uPath('alfa')), []);
	});

	it('excludes if not formatted', function() {
		deepEqual(mainModule.OLSKSpecLogicTestPaths(uPath('bravo')), []);
	});

	it('includes if formatted', function() {
		deepEqual(mainModule.OLSKSpecLogicTestPaths(uPath('charlie')), [
			uPath('charlie/alfa-tests.js'),
			]);
	});

	it('includes if in subfolder', function() {
		deepEqual(mainModule.OLSKSpecLogicSourcePaths(uPath('foxtrot')), [
			uPath('foxtrot/alfa/alfa.js'),
			]);
	});

	it('excludes if in standard ignore', function() {
		deepEqual(mainModule.OLSKSpecLogicTestPaths(uPath('golf')), []);
	});

});

describe('OLSKSpecLogicSourcePaths', function testOLSKSpecLogicSourcePaths() {

	it('throws if not string', function() {
		throws(function() {
			mainModule.OLSKSpecLogicSourcePaths(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if not real directory', function() {
		throws(function() {
			mainModule.OLSKSpecLogicSourcePaths(uPath('alf'));
		}, /OLSKErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mainModule.OLSKSpecLogicSourcePaths(uPath('alfa')), []);
	});

	it('excludes if not formatted', function() {
		deepEqual(mainModule.OLSKSpecLogicTestPaths(uPath('bravo')), []);
	});

	it('excludes if source not real file', function() {
		deepEqual(mainModule.OLSKSpecLogicSourcePaths(uPath('charlie')), []);
	});

	it('includes if source real file', function() {
		deepEqual(mainModule.OLSKSpecLogicSourcePaths(uPath('delta')), [
			uPath('delta/alfa.js'),
			]);
	});

	it('excludes if style', function() {
		deepEqual(mainModule.OLSKSpecLogicSourcePaths(uPath('echo')), []);
	});

	it('includes if in subfolder', function() {
		deepEqual(mainModule.OLSKSpecLogicSourcePaths(uPath('foxtrot')), [
			uPath('foxtrot/alfa/alfa.js'),
			]);
	});

	it('excludes if in standard ignore', function() {
		deepEqual(mainModule.OLSKSpecLogicSourcePaths(uPath('golf')), []);
	});

});
