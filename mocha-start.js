const { deepEqual } = require('assert');

const mod = {

	// VALUE

	_ValueInternationalDictionary: {},

	// CONTROL

	_ControlExtendZombie(Browser) {
		Browser.prototype.OLSKFireKeyboardEvent = function(target, keyCode, eventOptions = {}) {
			const event = this.window.document.createEvent('HTMLEvents');
			event.initEvent('keydown', true, true);
			event.which = event.keyCode = event.key = event.code = keyCode;

			target = typeof target === 'string' ? this.query(target) : target;

			if (!target) {
				throw new Error('no target');
			}

			target.dispatchEvent(Object.assign(event, eventOptions));

			return this._wait(null);
		};

		Browser.extend(function(browser) {
		  browser.on('confirm', function(confirm) {
		    return browser.OLSKConfirmCallback ? browser.OLSKConfirmCallback(confirm) : confirm;
		  });
		});

		Browser.extend(function(browser) {
		  browser.on('prompt', function(prompt) {
		    return browser.OLSKPromptCallback ? browser.OLSKPromptCallback(prompt) : prompt;
		  });
		});
		
		Browser.prototype.OLSKPromptSync = function(inputData) {
			let outputData = undefined;

			let browser = this;
			browser.OLSKPromptCallback = function (prompt) {
				delete browser.OLSKPromptCallback;

				outputData = prompt;
			};

			inputData();

			return outputData;
		};
		
		Browser.prototype.OLSKPrompt = async function(param1, param2) {
			let browser = this;
			return await new Promise(async function (resolve, reject) {
				browser.OLSKPromptCallback = function (prompt) {
					delete browser.OLSKPromptCallback;

					return resolve(param2 ? param2(prompt) : prompt);
				};

				param1();
			});
		};
		
		Browser.prototype.OLSKConfirmSync = function(inputData) {
			let outputData = undefined;

			let browser = this;
			browser.OLSKConfirmCallback = function (confirm) {
				delete browser.OLSKConfirmCallback;

				outputData = confirm;
			};

			inputData();

			return outputData;
		};
		
		Browser.prototype.OLSKConfirm = async function(param1, param2) {
			let browser = this;
			return await new Promise(async function (resolve, reject) {
				browser.OLSKConfirmCallback = function (confirm) {
					delete browser.OLSKConfirmCallback;

					return resolve(param2 ? param2(confirm) : confirm);
				};

				param1();
			});
		};

		Browser.extend(function(browser) {
		  browser.on('alert', function(alert) {
		    return browser.OLSKAlertCallback ? browser.OLSKAlertCallback(alert) : alert;
		  });
		});
		
		Browser.prototype.OLSKAlert = function(inputData) {
			let outputData = undefined;

			let browser = this;
			browser.OLSKAlertCallback = function (alert) {
				delete browser.OLSKAlertCallback;

				outputData = alert;
			};

			inputData();

			return outputData;
		};

		Browser.prototype.OLSKAlertTextAsync = function(inputData) {
			const browser = this;

			return new Promise(async function (resolve, reject) {
				browser.OLSKAlertCallback = function (alert) {
					delete browser.OLSKAlertCallback;

					resolve(alert);
				};

				await inputData();
			});
		};

		Browser.extend(function(browser) {
		  browser.on('OLSKMessage', function(data) {
		    return browser.OLSKMessageCallback ? browser.OLSKMessageCallback(data) : data;
		  });
		});
		
		Browser.prototype.OLSKMessage = function(inputData) {
			let outputData = undefined;

			let browser = this;
			browser.OLSKMessageCallback = function (data) {
				delete browser.OLSKMessageCallback;

				outputData = data;
			};

			inputData();

			return outputData;
		};
		
		Browser.prototype.OLSKMessageAsync = function(inputData) {
			let outputData = undefined;

			let browser = this;
			browser.OLSKMessageCallback = function (data) {
				delete browser.OLSKMessageCallback;

				outputData = data;
			};

			return new Promise(async function (resolve, reject) {
				await inputData();

				return resolve(outputData);
			});
		};

		Browser.extend(function(browser) {
		  browser.on('request', function(request) {
		  	if (request.url.match('player.vimeo.com') || request.url.match('w.soundcloud.com')) {
		  		request.url = 'http://loc.tests';
		  	}

		    return browser.OLSKRequestCallback ? browser.OLSKRequestCallback(request) : request;
		  });
		});
		
		Browser.prototype.OLSKRequest = function(inputData) {
			let outputData = undefined;

			let browser = this;
			browser.OLSKRequestCallback = function (request) {
				delete browser.OLSKRequestCallback;

				outputData = request;
			};

			inputData();

			return outputData;
		};

		Browser.extend(function(browser) {
		  browser.on('response', function(request, response) {
		    return browser.OLSKResponseCallback ? browser.OLSKResponseCallback(response) : response;
		  });
		});
		
		Browser.prototype.OLSKResponse = function(inputData) {
			let browser = this;
			
			return new Promise(async function (resolve, reject) {
				browser.OLSKResponseCallback = function (outputData) {
					delete browser.OLSKResponseCallback;

					return resolve(outputData);
				};

				inputData();
			});
		};
		
		Browser.prototype.OLSKVisit = function(routeObject, params) {
			return this.visit(global.OLSKTestingCanonical(routeObject, params));
		};

		Browser.Assert.prototype.OLSKTextContent = function(param1, param2, param3 = function (inputData) { return inputData; }) {
		  deepEqual(param3(browser.query(param1).textContent.trim()), param2);
		};

		Browser.Assert.prototype.OLSKInnerHTML = function(param1, param2) {
		  deepEqual(browser.query(param1).innerHTML, param2);
		};

		Browser.Assert.prototype.OLSKPromptQuestion = function(param1, param2) {
		  deepEqual(browser.OLSKPromptSync(param1).question, param2);
		};

		Browser.Assert.prototype.OLSKPromptResponse = function(param1, param2) {
		  deepEqual(browser.OLSKPromptSync(param1).response, param2);
		};

		Browser.Assert.prototype.OLSKConfirmQuestion = function(param1, param2) {
		  deepEqual(browser.OLSKConfirmSync(param1).question, param2);
		};

		Browser.Assert.prototype.OLSKConfirmQuestionAsync = async function(param1, param2) {
		  browser.assert.deepEqual((await browser.OLSKConfirm(param1)).question, param2);
		};

		Browser.Assert.prototype.OLSKAlertText = function(param1, param2) {
		  deepEqual(browser.OLSKAlert(param1), param2);
		};

		Browser.Assert.prototype.OLSKIsChecked = function(param1, param2) {
			deepEqual(browser.query(param1).checked, param2);
		};

		Browser.Assert.prototype.deepEqual = function(param1, param2) {
			deepEqual(param1, param2);
		};

		Browser.Assert.prototype.OLSKLauncherItems = async function(param1, param2) {
			await browser.pressButton('.OLSKAppToolbarLauncherButton');
			await browser.fill('.LCHLauncherFilterInput', param1);
			browser.assert.elements('.LCHLauncherPipeItem', param2);
			await browser.pressButton('#TestLCHDebugCloseButton');
		};

		Browser.Assert.prototype.OLSKLauncherItemText = async function(param1, param2) {
			await browser.pressButton('.OLSKAppToolbarLauncherButton');
			await browser.fill('.LCHLauncherFilterInput', param1);
			browser.assert.text('.LCHLauncherPipeItem', param2);
			await browser.pressButton('#TestLCHDebugCloseButton');
		};

		Browser.prototype.OLSKLauncherRun = async function(inputData) {
			await browser.pressButton('.OLSKAppToolbarLauncherButton');
			await browser.fill('.LCHLauncherFilterInput', inputData);
			await browser.click('.LCHLauncherPipeItem');
		};
	},

};

(function OLSKSpecZombie() {
	if (process.env.OLSK_SPEC_MOCHA_INTERFACE !== 'true') {
		return;
	}

	const Browser = require('zombie');

	Browser.localhost('loc.tests', process.env.PORT || 3000);
	
	mod._ControlExtendZombie(Browser);

	global.OLSKBrowser = Browser;

	global.browser = new OLSKBrowser();
})();

(function OLSKSpecInternational() {
	if (process.env.OLSK_SPEC_MOCHA_INTERFACE !== 'true') {
		return;
	}

	mod._ValueInternationalDictionary = require('OLSKInternational').OLSKInternationalDictionary(process.cwd());

	global.OLSKTestingLocalized = function(param1, param2) {
		let outputData = require('OLSKInternational').OLSKInternationalLocalizedString(param1, mod._ValueInternationalDictionary[param2]);

		return typeof outputData === 'string' ? outputData.replace('TRANSLATION_MISSING', '') : outputData;
	};

	global.OLSKTestingFormatted = require('OLSKString').OLSKStringFormatted;
})();

(function OLSKSpecRoutes() {
	global.OLSKTestingCanonical = function(routeObject, params) {
		return require('OLSKRouting').OLSKRoutingCanonicalPath(routeObject.OLSKRoutePath, params);
	};
})();

(function OLSKSpecMochaPreprocess() {
	const fs = require('fs');
	let oldRequire;

	try {
	  oldRequire = require('OLSKRollupPluginLocalize')()._OLSKRollupLocalizeReplaceInternationalizationToken;
	} catch (e) {
		return;
	}
	
	const replaceFunctions = [
		require('./main.js')._OLSKSpecMochaReplaceES6Import,
		function (inputData) {
			return (oldRequire({
				code: inputData,
			}, mod._ValueInternationalDictionary) || {
				code: inputData,
			}).code;
		},
	];

	require.extensions['.js'] = function(module, filename) {
		if (filename.match('OLSKRollupScaffold')) {
			return;
		}

		try {
			return module._compile(replaceFunctions.reduce(function (coll, item) {
				return item(coll);
			}, fs.readFileSync(filename, 'utf-8')), filename);
		} catch (err) {
			// console.log(code); // eslint-disable-line no-console
			throw err;
		}
	};
})();

(function OLSKSpecMochaStubs() {
	Object.entries({

		uRandomInt () {
			return Math.max(Date.now() % 1000, 1);
		},

	}).map(function (e) {
		return global[e.shift()] = e.pop();
	});
})();

(function OLSKSpecMochaErrors() {
	process.on('unhandledRejection', () => {
		// console.log('Unhandledd Rejection at:', arguments)
		// Recommended: send the information to sentry.io
		// or whatever crash reporting service you use
	});
})();
