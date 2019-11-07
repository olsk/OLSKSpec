const { throws, deepEqual } = require('assert');

const mainModule = require('./main.js');

const uPath = function (inputData) {
	return require('path').join(__dirname, 'stubs', inputData)
}

describe('OLSKSpecUITestPaths', function testOLSKSpecUITestPaths() {

	it('throws if not string', function() {
		throws(function() {
			mainModule.OLSKSpecUITestPaths(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if not real directory', function() {
		throws(function() {
			mainModule.OLSKSpecUITestPaths(uPath('alf'));
		}, /OLSKErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mainModule.OLSKSpecUITestPaths(uPath('alfa')), []);
	});

	it('excludes if not formatted', function() {
		deepEqual(mainModule.OLSKSpecUITestPaths(uPath('bravo')), []);
	});

	it('includes if formatted', function() {
		deepEqual(mainModule.OLSKSpecUITestPaths(uPath('charlie')), [
			uPath('charlie/ui-test-alfa.js'),
			]);
	});

	it('includes if in subfolder', function() {
		deepEqual(mainModule.OLSKSpecUITestPaths(uPath('echo')), [
			uPath('echo/alfa/ui-test-alfa.js'),
			]);
	});

	it('excludes if in standard ignore', function() {
		deepEqual(mainModule.OLSKSpecUITestPaths(uPath('foxtrot')), []);
	});

});

describe('OLSKSpecUISourcePaths', function testOLSKSpecUISourcePaths() {

	it('throws if not string', function() {
		throws(function() {
			mainModule.OLSKSpecUISourcePaths(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if not real directory', function() {
		throws(function() {
			mainModule.OLSKSpecUISourcePaths(uPath('alf'));
		}, /OLSKErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mainModule.OLSKSpecUISourcePaths(uPath('alfa')), []);
	});

	it('includes ui-behaviour.js', function() {
		deepEqual(mainModule.OLSKSpecUISourcePaths(uPath('charlie')), [
			uPath('charlie/ui-behaviour.js'),
			]);
	});

	it('includes if in subfolder', function() {
		deepEqual(mainModule.OLSKSpecUISourcePaths(uPath('echo')), [
			uPath('echo/alfa/ui-behaviour.js'),
			]);
	});

	it('excludes if in standard ignore', function() {
		deepEqual(mainModule.OLSKSpecUISourcePaths(uPath('foxtrot')), []);
	});

	it('includes view.ejs', function() {
		deepEqual(mainModule.OLSKSpecUISourcePaths(uPath('golf')), [
			uPath('golf/view.ejs'),
			]);
	});

	it('includes *.md', function() {
		deepEqual(mainModule.OLSKSpecUISourcePaths(uPath('hotel')), [
			uPath('hotel/alfa.md'),
			]);
	});

});
