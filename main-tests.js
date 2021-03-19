const { throws, deepEqual } = require('assert');

const mod = require('./main.js');

const uPath = function (inputData) {
	return require('path').join(__dirname, 'stubs', inputData);
};

describe('OLSKSpecUIArguments', function test_OLSKSpecUIArguments() {

	it('throws if not array', function() {
		throws(function() {
			mod.OLSKSpecUIArguments(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns input', function() {
		const item = [Math.random().toString()];
		deepEqual(mod.OLSKSpecUIArguments(item), item);
	});

	context('match=', function () {
		
		it('ignores if not starting', function() {
			const item = ['alfa-match=bravo'];
			deepEqual(mod.OLSKSpecUIArguments(item), item);
		});

		it('replaces match=', function() {
			const item = ['match=bravo'];
			deepEqual(mod.OLSKSpecUIArguments(item), ['-os-match=bravo']);
		});
	
	});

	context('skip=', function () {
		
		it('ignores if not starting', function() {
			const item = ['alfa-skip=bravo'];
			deepEqual(mod.OLSKSpecUIArguments(item), item);
		});

		it('replaces skip=', function() {
			const item = ['skip=bravo'];
			deepEqual(mod.OLSKSpecUIArguments(item), ['-os-skip=bravo']);
		});
	
	});

});

describe('OLSKSpecUITestPaths', function test_OLSKSpecUITestPaths() {

	it('throws if not string', function() {
		throws(function() {
			mod.OLSKSpecUITestPaths(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if not real directory', function() {
		throws(function() {
			mod.OLSKSpecUITestPaths(uPath('alf'));
		}, /OLSKErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mod.OLSKSpecUITestPaths(uPath('alfa')), []);
	});

	it('excludes if not formatted', function() {
		deepEqual(mod.OLSKSpecUITestPaths(uPath('bravo')), []);
	});

	it('includes if formatted', function() {
		deepEqual(mod.OLSKSpecUITestPaths(uPath('charlie')), [
			uPath('charlie/ui-test-alfa.js'),
		]);
	});

	it('includes if in subfolder', function() {
		deepEqual(mod.OLSKSpecUITestPaths(uPath('echo')), [
			uPath('echo/alfa/ui-test-alfa.js'),
		]);
	});

	it('excludes if in standard ignore', function() {
		deepEqual(mod.OLSKSpecUITestPaths(uPath('foxtrot')), []);
	});

});

describe('OLSKSpecUISourcePaths', function test_OLSKSpecUISourcePaths() {

	it('throws if not string', function() {
		throws(function() {
			mod.OLSKSpecUISourcePaths(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if not real directory', function() {
		throws(function() {
			mod.OLSKSpecUISourcePaths(uPath('alf'));
		}, /OLSKErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mod.OLSKSpecUISourcePaths(uPath('alfa')), []);
	});

	it('includes ui-behaviour.js', function() {
		deepEqual(mod.OLSKSpecUISourcePaths(uPath('charlie')), [
			uPath('charlie/ui-behaviour.js'),
		]);
	});

	it('includes if in subfolder', function() {
		deepEqual(mod.OLSKSpecUISourcePaths(uPath('echo')), [
			uPath('echo/alfa/ui-behaviour.js'),
		]);
	});

	it('excludes if in standard ignore', function() {
		deepEqual(mod.OLSKSpecUISourcePaths(uPath('foxtrot')), []);
	});

	it('includes view.ejs', function() {
		deepEqual(mod.OLSKSpecUISourcePaths(uPath('golf')), [
			uPath('golf/view.ejs'),
		]);
	});

	it('includes *.md', function() {
		deepEqual(mod.OLSKSpecUISourcePaths(uPath('hotel')), [
			uPath('hotel/alfa.md'),
		]);
	});

	it('includes __compiled', function() {
		deepEqual(mod.OLSKSpecUISourcePaths(uPath('indigo')), [
			uPath('indigo/__compiled/ui-behaviour.js'),
		]);
	});

	it('includes *.html', function() {
		deepEqual(mod.OLSKSpecUISourcePaths(uPath('juliet')), [
			uPath('juliet/alfa.html'),
		]);
	});

});

describe('OLSKSpecMochaPaths', function test_OLSKSpecMochaPaths() {

	const _OLSKSpecMochaPaths = function (inputData) {
		return mod.OLSKSpecMochaPaths(Object.assign({
			ParamPackageDirectory: Math.random().toString(),
			ParamWorkingDirectory: Math.random().toString(),
		}, inputData));
	}

	it('throws if not object', function () {
		throws(function () {
			mod.OLSKSpecMochaPaths(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if ParamPackageDirectory not string', function () {
		throws(function () {
			_OLSKSpecMochaPaths({
				ParamPackageDirectory: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if ParamWorkingDirectory not string', function () {
		throws(function () {
			_OLSKSpecMochaPaths({
				ParamWorkingDirectory: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('returns array', function() {
		const ParamPackageDirectory = Math.random().toString();
		const ParamWorkingDirectory = Math.random().toString();
		deepEqual(mod.OLSKSpecMochaPaths({
			ParamPackageDirectory,
			ParamWorkingDirectory,
		}), [
			require('path').join(ParamPackageDirectory, './node_modules/.bin/mocha'),
			require('path').join(ParamPackageDirectory, '../.bin/mocha'),
			require('path').join(ParamWorkingDirectory, './node_modules/.bin/mocha'),
			]);
	});

});
