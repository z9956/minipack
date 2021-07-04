(function (modules) {
	function require(id) {
		const [fn, mapping] = modules[id];
		function localRequire(name) {
			return require(mapping[name]);
		}
		const module = { exports: {} };
		fn(localRequire, module, module.exports);
		return module.exports;
	}
	require(0);
})({
	0: [
		function (require, module, exports) {
			'use strict';

			var _demo = require('./demo.js');

			(0, _demo.log)('example '.concat(_demo.value));
			(0, _demo.hello)('world');
		},
		{ './demo.js': 1 },
	],
	1: [
		function (require, module, exports) {
			'use strict';

			Object.defineProperty(exports, '__esModule', {
				value: true,
			});
			exports.value = exports.hello = exports.log = void 0;

			var log = function log(param) {
				console.log('param', param);
			};

			exports.log = log;

			var hello = function hello(param) {
				console.log('hello ', param);
			};

			exports.hello = hello;
			var value = 'value';
			exports.value = value;
		},
		{},
	],
});
