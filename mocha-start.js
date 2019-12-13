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

				return resolve(outputData)
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

					return resolve(outputData)
				};

				inputData();
			});
		};
		
		Browser.prototype.OLSKVisit = function(routeObject, params) {
			return this.visit(global.OLSKTestingCanonical(routeObject, params))
		};

		Browser.extend(function(browser) {
		  browser.pipeline.addHandler(function(browser, request, response) {
		  	if (request.url.match('player.vimeo.com')) {
		  		return Object.assign(response, {
		  			status: 200,
		  		})
		  	}
		    
		    return response;
		  });
		});
	},

	// SETUP

	SetupEverything() {
		mod.SetupZombie();

		mod.SetupInternational();

		mod.SetupRoutes();
	},

	SetupZombie() {
		if (process.env.OLSK_TESTING_BEHAVIOUR !== 'true') {
			return;
		}

		const Browser = require('zombie');

		Browser.localhost('loc.tests', process.env.PORT || 3000);
		
		mod._ControlExtendZombie(Browser);

		global.OLSKBrowser = Browser;

		global.browser = new OLSKBrowser();
	},

	SetupInternational() {
		if (process.env.OLSK_TESTING_BEHAVIOUR !== 'true') {
			return;
		}

		mod._ValueInternationalDictionary = require('glob').sync('**/*i18n*.y*(a)ml', {
		  cwd: require('path').join(process.cwd(), process.env.OLSK_APP_FOLDER || 'os-app'),
			realpath: true,
		}).filter(function(e) {
		  return require('OLSKInternational').OLSKInternationalIsTranslationFileBasename(require('path').basename(e));
		}).reduce(function(coll, item) {
			const key = require('OLSKInternational').OLSKInternationalLanguageID(require('path').basename(item));

			coll[key] = Object.assign(coll[key] || {}, require('js-yaml').safeLoad(require('fs').readFileSync(item, 'utf8')))

			return coll;
		}, {});

		global.OLSKTestingLocalized = function(param1, param2) {
			let outputData = require('OLSKInternational').OLSKInternationalLocalizedString(param1, mod._ValueInternationalDictionary[param2]);

			return typeof outputData === 'string' ? outputData.replace('TRANSLATION_MISSING', '') : outputData;
		};
	},

	SetupRoutes() {
		if (process.env.OLSK_TESTING_BEHAVIOUR !== 'true') {
			return;
		}

		global.OLSKTestingCanonicalFor = function() {
			console.warn('OLSKTestingCanonicalFor DEPRECATED');
			return require('OLSKRouting').OLSKRoutingCanonicalPathWithRoutePathAndOptionalParams(...arguments);
		};

		global.OLSKTestingCanonical = function(routeObject, params) {
			return require('OLSKRouting').OLSKRoutingCanonicalPathWithRoutePathAndOptionalParams(routeObject.OLSKRoutePath, params);
		};
	},

	// LIFECYCLE

	LifecycleModuleDidLoad() {
		mod.SetupEverything();
	},

};

mod.LifecycleModuleDidLoad();

(function OLSKMochaPreprocess() {
	const fs = require('fs');
	let oldRequire;

	try {
	  oldRequire = require('OLSKRollupPluginLocalize')()._OLSKRollupLocalizeReplaceInternationalizationToken;
	} catch (e) {
		return;
	}
	
	const replaceFunctions = [
		require('OLSKTesting')._OLSKTestingMochaReplaceES6Import,
		function (inputData) {
			return (oldRequire({
				code: inputData,
			}, mod._ValueInternationalDictionary) || {
				code: inputData,
			}).code;
		},
	];

	require.extensions['.js'] = function(module, filename) {
		if (filename.match('OLSKRollup')) {
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

(function OLSKMochaErrors() {
	process.on('unhandledRejection', () => {
		// console.log('Unhandledd Rejection at:', arguments)
		// Recommended: send the information to sentry.io
		// or whatever crash reporting service you use
	});
})();
