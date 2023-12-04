const { throws, rejects, deepEqual } = require('assert');

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

		Browser.prototype.OLSKAlertAsync = function(inputData) {
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

		Browser.prototype.innerHTML = function(selector) {
			return this.query(selector).innerHTML;
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

		Browser.Assert.prototype.OLSKAlertTextAsync = async function(param1, param2) {
		  deepEqual(await browser.OLSKAlertAsync(param1), param2);
		};

		Browser.Assert.prototype.OLSKIsChecked = function(param1, param2) {
			deepEqual(browser.query(param1).checked, param2);
		};

		Browser.Assert.prototype.deepEqual = function(param1, param2) {
			deepEqual(param1, param2);
		};

		Browser.Assert.prototype.visible = function(selector) {
			browser.assert.elements(selector, 1);
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

(function OLSKSpecPlaywright() {
	if (process.env.OLSK_SPEC_PLAYWRIGHT !== 'true') {
		return;
	}
	
	const { chromium, expect } = require('@playwright/test');

	global.expect = expect;
	global.browser = {
		OLSKVisit: (function () {
			return global.OSVisit(...arguments);
		}),
		OLSKVisitPath: (function (OLSKRoutePath, params) {
			return global.OSVisit({
				OLSKRoutePath,
			}, params);
		}),
		html: (function () {
			return page.locator('body').innerHTML();
		}),
		innerHTML: (function (selector) {
			return page.locator(selector).innerHTML();
		}),
		pressButton: ((selector) => page.locator(selector).click()),
		click: ((selector) => page.locator(selector).click()),
		fill: ((selector, value) => page.locator(selector).fill(value.toString())),
		fire: ((selector, event) => page.locator(selector).dispatchEvent(event)),
		evaluate: ((code) => page.evaluate(code)),
		OLSKFireKeyboardEvent: ((ignored, key, options = {}) => page.keyboard.press((function() {
			if (options.altKey) {
				return 'Alt+';
			}

			return '';
		})() + key)),
		OLSKAlertAsync: (function(callback) {
			return new Promise(function (res, rej) {
				page.once('dialog', dialog => {
					res(dialog.message());

				  return dialog.dismiss();
				});

				callback();
			});
		}),
		assert: {
			deepEqual,
			visible: ((selector) => expect(page.locator(selector)).toBeVisible()),
			text: ((selector, text) => expect(page.locator(selector)).toHaveText(text)),
			attribute: ((selector, attribute, value) => value !== null ? expect(page.locator(selector)).toHaveAttribute(attribute, value.toString()) : expect(page.locator(selector)).not.toHaveAttribute(attribute, '')),
			input: ((selector, value) => expect(page.locator(selector)).toHaveValue(value)),
			elements: ((selector, count) => expect(page.locator(selector)).toHaveCount(count)),
			hasClass: ((selector, name) => expect(page.locator(selector)).toHaveClass(new RegExp(name))),
			hasNoClass: ((selector, name) => expect(page.locator(selector)).not.toHaveClass(new RegExp(name))),
			hasFocus: ((selector) => expect(page.locator(selector)).toBeFocused()),
			OLSKInnerHTML: (async (selector, html) => expect(await page.locator(selector).innerHTML()).toEqual(html)),
			OLSKConfirmQuestion: (async (param1, param2) => deepEqual(await browser.OLSKAlertAsync(param1), param2)),
			OLSKPromptQuestion: ((param1, param2) => browser.assert.OLSKConfirmQuestion(param1, param2)),
			async OLSKLauncherItemText (param1, param2) {
				await browser.pressButton('.OLSKAppToolbarLauncherButton');
				await browser.fill('.LCHLauncherFilterInput', param1);
				await browser.assert.text('.LCHLauncherPipeItem', param2);
				await browser.pressButton('#TestLCHDebugCloseButton');
			},
			async OLSKLauncherItems (param1, param2) {
				await browser.pressButton('.OLSKAppToolbarLauncherButton');
				await browser.fill('.LCHLauncherFilterInput', param1);
				await browser.assert.elements('.LCHLauncherPipeItem', param2);
				await browser.pressButton('#TestLCHDebugCloseButton');
			},
		},
	};
	
	before(async () => {
		global.playwrightBrowser = await chromium.launch();
		global.page = await playwrightBrowser.newPage();

		global.OSVisit = async function (routeObject, params) {
			await global.page.close();
			global.page = await playwrightBrowser.newPage();
			await global.page.addInitScript({ content: "window.OLSK_SPEC_UI = true" });

			await page.route(/^https/i, route => route.abort());

			const baseURL = 'http://' + (process.env.HOST || 'localhost') + ':' + (process.env.PORT || 3000);
			const isFile = routeObject.toString().match(/^file:\/\//i);

			await page.goto(browser.url = (isFile ? '' : baseURL) + global.OLSKTestingCanonical(isFile ? {
				OLSKRoutePath: routeObject,
			} : routeObject, params));
		};
	});

	after(() => global.playwrightBrowser.close());
})();

(function OLSKSpecZombie() {
	if (process.env.OLSK_SPEC_PLAYWRIGHT === 'true') {
		return;
	}
	
	if (process.env.OLSK_SPEC_MOCHA_INTERFACE !== 'true') {
		return;
	}

	const Browser = require('zombie');

	Browser.localhost('loc.tests', process.env.PORT || 3000);
	Browser.localhost('localhost', process.env.PORT || 3000);
	
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
	const sinon = require('sinon');
	
	afterEach(() => sinon.restore());

	Object.entries({
		sinon,

		deepEqual,
		throws,
		rejects,

		uRandomInt (inputData = 1000) {
			return Math.max(Date.now() % inputData, 1);
		},

		uRandomElement () {
			const array = [].concat(...arguments);
			return array[Date.now() % array.length];
		},

		uRandomize (inputData) {
			const array = [].concat(...arguments);
		  return array
		    .map(value => ({ value, sort: Math.random() }))
		    .sort((a, b) => a.sort - b.sort)
		    .map(({ value }) => value);
		},

		uSerial (inputData) {
			return inputData.reduce(async function (coll, e) {
				return e.then(Array.prototype.concat.bind(await coll));
			}, Promise.resolve([]));
		},

		uCapture (inputData) {
			const item = [];
			
			inputData(function () {
				item.push(...arguments);
			});

			return item;
		},

		async uCaptureAsync (inputData) {
			const item = [];
			
			await inputData(function () {
				item.push(...arguments);
			});

			return item;
		},

		uLink (inputData) {
			return 'https://example.com/' + (inputData || Math.random().toString());
		},

		uEmail (inputData) {
			return (inputData || Math.random().toString()) + '@example.com';
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
