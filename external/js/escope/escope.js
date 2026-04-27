var escope = (function () {
	'use strict';

	function _mergeNamespaces(n, m) {
		m.forEach(function (e) {
			e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
				if (k !== 'default' && !(k in n)) {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function () { return e[k]; }
					});
				}
			});
		});
		return Object.freeze(n);
	}

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
	  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				var isInstance = false;
	      try {
	        isInstance = this instanceof a;
	      } catch {}
				if (isInstance) {
	        return Reflect.construct(f, arguments, this.constructor);
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var lib = {};

	var global$1 = (typeof global !== "undefined" ? global :
	  typeof self !== "undefined" ? self :
	  typeof window !== "undefined" ? window : {});

	// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	function isBuffer(obj) {
	  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
	}

	function isFastBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
	}

	var inherits;
	if (typeof Object.create === 'function'){
	  inherits = function inherits(ctor, superCtor) {
	    // implementation from standard node.js 'util' module
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  inherits = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function () {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect$1(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    _extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}

	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect$1.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect$1.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect$1.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect$1.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect$1.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== inspect$1 &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var length = output.reduce(function(prev, cur) {
	    if (cur.indexOf('\n') >= 0) ;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}

	function isNull(arg) {
	  return arg === null;
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isString(arg) {
	  return typeof arg === 'string';
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

	function _extend(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	}
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	function compare(a, b) {
	  if (a === b) {
	    return 0;
	  }

	  var x = a.length;
	  var y = b.length;

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break;
	    }
	  }

	  if (x < y) {
	    return -1;
	  }
	  if (y < x) {
	    return 1;
	  }
	  return 0;
	}
	var hasOwn = Object.prototype.hasOwnProperty;

	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    if (hasOwn.call(obj, key)) keys.push(key);
	  }
	  return keys;
	};
	var pSlice = Array.prototype.slice;
	var _functionsHaveNames;
	function functionsHaveNames() {
	  if (typeof _functionsHaveNames !== 'undefined') {
	    return _functionsHaveNames;
	  }
	  return _functionsHaveNames = (function () {
	    return function foo() {}.name === 'foo';
	  }());
	}
	function pToString (obj) {
	  return Object.prototype.toString.call(obj);
	}
	function isView(arrbuf) {
	  if (isBuffer(arrbuf)) {
	    return false;
	  }
	  if (typeof global$1.ArrayBuffer !== 'function') {
	    return false;
	  }
	  if (typeof ArrayBuffer.isView === 'function') {
	    return ArrayBuffer.isView(arrbuf);
	  }
	  if (!arrbuf) {
	    return false;
	  }
	  if (arrbuf instanceof DataView) {
	    return true;
	  }
	  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
	    return true;
	  }
	  return false;
	}
	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.

	function assert(value, message) {
	  if (!value) fail(value, true, message, '==', ok);
	}

	// 2. The AssertionError is defined in assert.
	// new assert.AssertionError({ message: message,
	//                             actual: actual,
	//                             expected: expected })

	var regex = /\s*function\s+([^\(\s]*)\s*/;
	// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
	function getName(func) {
	  if (!isFunction(func)) {
	    return;
	  }
	  if (functionsHaveNames()) {
	    return func.name;
	  }
	  var str = func.toString();
	  var match = str.match(regex);
	  return match && match[1];
	}
	assert.AssertionError = AssertionError;
	function AssertionError(options) {
	  this.name = 'AssertionError';
	  this.actual = options.actual;
	  this.expected = options.expected;
	  this.operator = options.operator;
	  if (options.message) {
	    this.message = options.message;
	    this.generatedMessage = false;
	  } else {
	    this.message = getMessage(this);
	    this.generatedMessage = true;
	  }
	  var stackStartFunction = options.stackStartFunction || fail;
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, stackStartFunction);
	  } else {
	    // non v8 browsers so we can have a stacktrace
	    var err = new Error();
	    if (err.stack) {
	      var out = err.stack;

	      // try to strip useless frames
	      var fn_name = getName(stackStartFunction);
	      var idx = out.indexOf('\n' + fn_name);
	      if (idx >= 0) {
	        // once we have located the function frame
	        // we need to strip out everything before it (and its line)
	        var next_line = out.indexOf('\n', idx + 1);
	        out = out.substring(next_line + 1);
	      }

	      this.stack = out;
	    }
	  }
	}

	// assert.AssertionError instanceof Error
	inherits(AssertionError, Error);

	function truncate(s, n) {
	  if (typeof s === 'string') {
	    return s.length < n ? s : s.slice(0, n);
	  } else {
	    return s;
	  }
	}
	function inspect(something) {
	  if (functionsHaveNames() || !isFunction(something)) {
	    return inspect$1(something);
	  }
	  var rawname = getName(something);
	  var name = rawname ? ': ' + rawname : '';
	  return '[Function' +  name + ']';
	}
	function getMessage(self) {
	  return truncate(inspect(self.actual), 128) + ' ' +
	         self.operator + ' ' +
	         truncate(inspect(self.expected), 128);
	}

	// At present only the three keys mentioned above are used and
	// understood by the spec. Implementations or sub modules can pass
	// other keys to the AssertionError's constructor - they will be
	// ignored.

	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.

	function fail(actual, expected, message, operator, stackStartFunction) {
	  throw new AssertionError({
	    message: message,
	    actual: actual,
	    expected: expected,
	    operator: operator,
	    stackStartFunction: stackStartFunction
	  });
	}

	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;

	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.

	function ok(value, message) {
	  if (!value) fail(value, true, message, '==', ok);
	}
	assert.ok = ok;

	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);
	assert.equal = equal;
	function equal(actual, expected, message) {
	  if (actual != expected) fail(actual, expected, message, '==', equal);
	}

	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);
	assert.notEqual = notEqual;
	function notEqual(actual, expected, message) {
	  if (actual == expected) {
	    fail(actual, expected, message, '!=', notEqual);
	  }
	}

	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);
	assert.deepEqual = deepEqual;
	function deepEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected, false)) {
	    fail(actual, expected, message, 'deepEqual', deepEqual);
	  }
	}
	assert.deepStrictEqual = deepStrictEqual;
	function deepStrictEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected, true)) {
	    fail(actual, expected, message, 'deepStrictEqual', deepStrictEqual);
	  }
	}

	function _deepEqual(actual, expected, strict, memos) {
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;
	  } else if (isBuffer(actual) && isBuffer(expected)) {
	    return compare(actual, expected) === 0;

	  // 7.2. If the expected value is a Date object, the actual value is
	  // equivalent if it is also a Date object that refers to the same time.
	  } else if (isDate(actual) && isDate(expected)) {
	    return actual.getTime() === expected.getTime();

	  // 7.3 If the expected value is a RegExp object, the actual value is
	  // equivalent if it is also a RegExp object with the same source and
	  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	  } else if (isRegExp(actual) && isRegExp(expected)) {
	    return actual.source === expected.source &&
	           actual.global === expected.global &&
	           actual.multiline === expected.multiline &&
	           actual.lastIndex === expected.lastIndex &&
	           actual.ignoreCase === expected.ignoreCase;

	  // 7.4. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if ((actual === null || typeof actual !== 'object') &&
	             (expected === null || typeof expected !== 'object')) {
	    return strict ? actual === expected : actual == expected;

	  // If both values are instances of typed arrays, wrap their underlying
	  // ArrayBuffers in a Buffer each to increase performance
	  // This optimization requires the arrays to have the same type as checked by
	  // Object.prototype.toString (aka pToString). Never perform binary
	  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
	  // bit patterns are not identical.
	  } else if (isView(actual) && isView(expected) &&
	             pToString(actual) === pToString(expected) &&
	             !(actual instanceof Float32Array ||
	               actual instanceof Float64Array)) {
	    return compare(new Uint8Array(actual.buffer),
	                   new Uint8Array(expected.buffer)) === 0;

	  // 7.5 For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else if (isBuffer(actual) !== isBuffer(expected)) {
	    return false;
	  } else {
	    memos = memos || {actual: [], expected: []};

	    var actualIndex = memos.actual.indexOf(actual);
	    if (actualIndex !== -1) {
	      if (actualIndex === memos.expected.indexOf(expected)) {
	        return true;
	      }
	    }

	    memos.actual.push(actual);
	    memos.expected.push(expected);

	    return objEquiv(actual, expected, strict, memos);
	  }
	}

	function isArguments(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}

	function objEquiv(a, b, strict, actualVisitedObjects) {
	  if (a === null || a === undefined || b === null || b === undefined)
	    return false;
	  // if one is a primitive, the other must be same
	  if (isPrimitive(a) || isPrimitive(b))
	    return a === b;
	  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
	    return false;
	  var aIsArgs = isArguments(a);
	  var bIsArgs = isArguments(b);
	  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
	    return false;
	  if (aIsArgs) {
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return _deepEqual(a, b, strict);
	  }
	  var ka = objectKeys(a);
	  var kb = objectKeys(b);
	  var key, i;
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length !== kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] !== kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
	      return false;
	  }
	  return true;
	}

	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);
	assert.notDeepEqual = notDeepEqual;
	function notDeepEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected, false)) {
	    fail(actual, expected, message, 'notDeepEqual', notDeepEqual);
	  }
	}

	assert.notDeepStrictEqual = notDeepStrictEqual;
	function notDeepStrictEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected, true)) {
	    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
	  }
	}


	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);
	assert.strictEqual = strictEqual;
	function strictEqual(actual, expected, message) {
	  if (actual !== expected) {
	    fail(actual, expected, message, '===', strictEqual);
	  }
	}

	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
	assert.notStrictEqual = notStrictEqual;
	function notStrictEqual(actual, expected, message) {
	  if (actual === expected) {
	    fail(actual, expected, message, '!==', notStrictEqual);
	  }
	}

	function expectedException(actual, expected) {
	  if (!actual || !expected) {
	    return false;
	  }

	  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
	    return expected.test(actual);
	  }

	  try {
	    if (actual instanceof expected) {
	      return true;
	    }
	  } catch (e) {
	    // Ignore.  The instanceof check doesn't work for arrow functions.
	  }

	  if (Error.isPrototypeOf(expected)) {
	    return false;
	  }

	  return expected.call({}, actual) === true;
	}

	function _tryBlock(block) {
	  var error;
	  try {
	    block();
	  } catch (e) {
	    error = e;
	  }
	  return error;
	}

	function _throws(shouldThrow, block, expected, message) {
	  var actual;

	  if (typeof block !== 'function') {
	    throw new TypeError('"block" argument must be a function');
	  }

	  if (typeof expected === 'string') {
	    message = expected;
	    expected = null;
	  }

	  actual = _tryBlock(block);

	  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	            (message ? ' ' + message : '.');

	  if (shouldThrow && !actual) {
	    fail(actual, expected, 'Missing expected exception' + message);
	  }

	  var userProvidedMessage = typeof message === 'string';
	  var isUnwantedException = !shouldThrow && isError(actual);
	  var isUnexpectedException = !shouldThrow && actual && !expected;

	  if ((isUnwantedException &&
	      userProvidedMessage &&
	      expectedException(actual, expected)) ||
	      isUnexpectedException) {
	    fail(actual, expected, 'Got unwanted exception' + message);
	  }

	  if ((shouldThrow && actual && expected &&
	      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	    throw actual;
	  }
	}

	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);
	assert.throws = throws;
	function throws(block, /*optional*/error, /*optional*/message) {
	  _throws(true, block, error, message);
	}

	// EXTENSION! This is annoying to write outside this module.
	assert.doesNotThrow = doesNotThrow;
	function doesNotThrow(block, /*optional*/error, /*optional*/message) {
	  _throws(false, block, error, message);
	}

	assert.ifError = ifError;
	function ifError(err) {
	  if (err) throw err;
	}

	var _polyfillNode_assert = /*#__PURE__*/Object.freeze({
		__proto__: null,
		AssertionError: AssertionError,
		assert: ok,
		deepEqual: deepEqual,
		deepStrictEqual: deepStrictEqual,
		default: assert,
		doesNotThrow: doesNotThrow,
		equal: equal,
		fail: fail,
		ifError: ifError,
		notDeepEqual: notDeepEqual,
		notDeepStrictEqual: notDeepStrictEqual,
		notEqual: notEqual,
		notStrictEqual: notStrictEqual,
		ok: ok,
		strictEqual: strictEqual,
		throws: throws
	});

	var require$$0$1 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_assert);

	var scopeManager = {};

	var scope = {};

	var estraverse$1 = {};

	var version$2 = "4.3.0";
	var require$$0 = {
		version: version$2};

	/*
	  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	var hasRequiredEstraverse$1;

	function requireEstraverse$1 () {
		if (hasRequiredEstraverse$1) return estraverse$1;
		hasRequiredEstraverse$1 = 1;
		(function (exports$1) {
			/*jslint vars:false, bitwise:true*/
			/*jshint indent:4*/
			/*global exports:true*/
			(function clone(exports$1) {

			    var Syntax,
			        VisitorOption,
			        VisitorKeys,
			        BREAK,
			        SKIP,
			        REMOVE;

			    function deepCopy(obj) {
			        var ret = {}, key, val;
			        for (key in obj) {
			            if (obj.hasOwnProperty(key)) {
			                val = obj[key];
			                if (typeof val === 'object' && val !== null) {
			                    ret[key] = deepCopy(val);
			                } else {
			                    ret[key] = val;
			                }
			            }
			        }
			        return ret;
			    }

			    // based on LLVM libc++ upper_bound / lower_bound
			    // MIT License

			    function upperBound(array, func) {
			        var diff, len, i, current;

			        len = array.length;
			        i = 0;

			        while (len) {
			            diff = len >>> 1;
			            current = i + diff;
			            if (func(array[current])) {
			                len = diff;
			            } else {
			                i = current + 1;
			                len -= diff + 1;
			            }
			        }
			        return i;
			    }

			    Syntax = {
			        AssignmentExpression: 'AssignmentExpression',
			        AssignmentPattern: 'AssignmentPattern',
			        ArrayExpression: 'ArrayExpression',
			        ArrayPattern: 'ArrayPattern',
			        ArrowFunctionExpression: 'ArrowFunctionExpression',
			        AwaitExpression: 'AwaitExpression', // CAUTION: It's deferred to ES7.
			        BlockStatement: 'BlockStatement',
			        BinaryExpression: 'BinaryExpression',
			        BreakStatement: 'BreakStatement',
			        CallExpression: 'CallExpression',
			        CatchClause: 'CatchClause',
			        ClassBody: 'ClassBody',
			        ClassDeclaration: 'ClassDeclaration',
			        ClassExpression: 'ClassExpression',
			        ComprehensionBlock: 'ComprehensionBlock',  // CAUTION: It's deferred to ES7.
			        ComprehensionExpression: 'ComprehensionExpression',  // CAUTION: It's deferred to ES7.
			        ConditionalExpression: 'ConditionalExpression',
			        ContinueStatement: 'ContinueStatement',
			        DebuggerStatement: 'DebuggerStatement',
			        DirectiveStatement: 'DirectiveStatement',
			        DoWhileStatement: 'DoWhileStatement',
			        EmptyStatement: 'EmptyStatement',
			        ExportAllDeclaration: 'ExportAllDeclaration',
			        ExportDefaultDeclaration: 'ExportDefaultDeclaration',
			        ExportNamedDeclaration: 'ExportNamedDeclaration',
			        ExportSpecifier: 'ExportSpecifier',
			        ExpressionStatement: 'ExpressionStatement',
			        ForStatement: 'ForStatement',
			        ForInStatement: 'ForInStatement',
			        ForOfStatement: 'ForOfStatement',
			        FunctionDeclaration: 'FunctionDeclaration',
			        FunctionExpression: 'FunctionExpression',
			        GeneratorExpression: 'GeneratorExpression',  // CAUTION: It's deferred to ES7.
			        Identifier: 'Identifier',
			        IfStatement: 'IfStatement',
			        ImportExpression: 'ImportExpression',
			        ImportDeclaration: 'ImportDeclaration',
			        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
			        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
			        ImportSpecifier: 'ImportSpecifier',
			        Literal: 'Literal',
			        LabeledStatement: 'LabeledStatement',
			        LogicalExpression: 'LogicalExpression',
			        MemberExpression: 'MemberExpression',
			        MetaProperty: 'MetaProperty',
			        MethodDefinition: 'MethodDefinition',
			        ModuleSpecifier: 'ModuleSpecifier',
			        NewExpression: 'NewExpression',
			        ObjectExpression: 'ObjectExpression',
			        ObjectPattern: 'ObjectPattern',
			        Program: 'Program',
			        Property: 'Property',
			        RestElement: 'RestElement',
			        ReturnStatement: 'ReturnStatement',
			        SequenceExpression: 'SequenceExpression',
			        SpreadElement: 'SpreadElement',
			        Super: 'Super',
			        SwitchStatement: 'SwitchStatement',
			        SwitchCase: 'SwitchCase',
			        TaggedTemplateExpression: 'TaggedTemplateExpression',
			        TemplateElement: 'TemplateElement',
			        TemplateLiteral: 'TemplateLiteral',
			        ThisExpression: 'ThisExpression',
			        ThrowStatement: 'ThrowStatement',
			        TryStatement: 'TryStatement',
			        UnaryExpression: 'UnaryExpression',
			        UpdateExpression: 'UpdateExpression',
			        VariableDeclaration: 'VariableDeclaration',
			        VariableDeclarator: 'VariableDeclarator',
			        WhileStatement: 'WhileStatement',
			        WithStatement: 'WithStatement',
			        YieldExpression: 'YieldExpression'
			    };

			    VisitorKeys = {
			        AssignmentExpression: ['left', 'right'],
			        AssignmentPattern: ['left', 'right'],
			        ArrayExpression: ['elements'],
			        ArrayPattern: ['elements'],
			        ArrowFunctionExpression: ['params', 'body'],
			        AwaitExpression: ['argument'], // CAUTION: It's deferred to ES7.
			        BlockStatement: ['body'],
			        BinaryExpression: ['left', 'right'],
			        BreakStatement: ['label'],
			        CallExpression: ['callee', 'arguments'],
			        CatchClause: ['param', 'body'],
			        ClassBody: ['body'],
			        ClassDeclaration: ['id', 'superClass', 'body'],
			        ClassExpression: ['id', 'superClass', 'body'],
			        ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
			        ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
			        ConditionalExpression: ['test', 'consequent', 'alternate'],
			        ContinueStatement: ['label'],
			        DebuggerStatement: [],
			        DirectiveStatement: [],
			        DoWhileStatement: ['body', 'test'],
			        EmptyStatement: [],
			        ExportAllDeclaration: ['source'],
			        ExportDefaultDeclaration: ['declaration'],
			        ExportNamedDeclaration: ['declaration', 'specifiers', 'source'],
			        ExportSpecifier: ['exported', 'local'],
			        ExpressionStatement: ['expression'],
			        ForStatement: ['init', 'test', 'update', 'body'],
			        ForInStatement: ['left', 'right', 'body'],
			        ForOfStatement: ['left', 'right', 'body'],
			        FunctionDeclaration: ['id', 'params', 'body'],
			        FunctionExpression: ['id', 'params', 'body'],
			        GeneratorExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
			        Identifier: [],
			        IfStatement: ['test', 'consequent', 'alternate'],
			        ImportExpression: ['source'],
			        ImportDeclaration: ['specifiers', 'source'],
			        ImportDefaultSpecifier: ['local'],
			        ImportNamespaceSpecifier: ['local'],
			        ImportSpecifier: ['imported', 'local'],
			        Literal: [],
			        LabeledStatement: ['label', 'body'],
			        LogicalExpression: ['left', 'right'],
			        MemberExpression: ['object', 'property'],
			        MetaProperty: ['meta', 'property'],
			        MethodDefinition: ['key', 'value'],
			        ModuleSpecifier: [],
			        NewExpression: ['callee', 'arguments'],
			        ObjectExpression: ['properties'],
			        ObjectPattern: ['properties'],
			        Program: ['body'],
			        Property: ['key', 'value'],
			        RestElement: [ 'argument' ],
			        ReturnStatement: ['argument'],
			        SequenceExpression: ['expressions'],
			        SpreadElement: ['argument'],
			        Super: [],
			        SwitchStatement: ['discriminant', 'cases'],
			        SwitchCase: ['test', 'consequent'],
			        TaggedTemplateExpression: ['tag', 'quasi'],
			        TemplateElement: [],
			        TemplateLiteral: ['quasis', 'expressions'],
			        ThisExpression: [],
			        ThrowStatement: ['argument'],
			        TryStatement: ['block', 'handler', 'finalizer'],
			        UnaryExpression: ['argument'],
			        UpdateExpression: ['argument'],
			        VariableDeclaration: ['declarations'],
			        VariableDeclarator: ['id', 'init'],
			        WhileStatement: ['test', 'body'],
			        WithStatement: ['object', 'body'],
			        YieldExpression: ['argument']
			    };

			    // unique id
			    BREAK = {};
			    SKIP = {};
			    REMOVE = {};

			    VisitorOption = {
			        Break: BREAK,
			        Skip: SKIP,
			        Remove: REMOVE
			    };

			    function Reference(parent, key) {
			        this.parent = parent;
			        this.key = key;
			    }

			    Reference.prototype.replace = function replace(node) {
			        this.parent[this.key] = node;
			    };

			    Reference.prototype.remove = function remove() {
			        if (Array.isArray(this.parent)) {
			            this.parent.splice(this.key, 1);
			            return true;
			        } else {
			            this.replace(null);
			            return false;
			        }
			    };

			    function Element(node, path, wrap, ref) {
			        this.node = node;
			        this.path = path;
			        this.wrap = wrap;
			        this.ref = ref;
			    }

			    function Controller() { }

			    // API:
			    // return property path array from root to current node
			    Controller.prototype.path = function path() {
			        var i, iz, j, jz, result, element;

			        function addToPath(result, path) {
			            if (Array.isArray(path)) {
			                for (j = 0, jz = path.length; j < jz; ++j) {
			                    result.push(path[j]);
			                }
			            } else {
			                result.push(path);
			            }
			        }

			        // root node
			        if (!this.__current.path) {
			            return null;
			        }

			        // first node is sentinel, second node is root element
			        result = [];
			        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
			            element = this.__leavelist[i];
			            addToPath(result, element.path);
			        }
			        addToPath(result, this.__current.path);
			        return result;
			    };

			    // API:
			    // return type of current node
			    Controller.prototype.type = function () {
			        var node = this.current();
			        return node.type || this.__current.wrap;
			    };

			    // API:
			    // return array of parent elements
			    Controller.prototype.parents = function parents() {
			        var i, iz, result;

			        // first node is sentinel
			        result = [];
			        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
			            result.push(this.__leavelist[i].node);
			        }

			        return result;
			    };

			    // API:
			    // return current node
			    Controller.prototype.current = function current() {
			        return this.__current.node;
			    };

			    Controller.prototype.__execute = function __execute(callback, element) {
			        var previous, result;

			        result = undefined;

			        previous  = this.__current;
			        this.__current = element;
			        this.__state = null;
			        if (callback) {
			            result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
			        }
			        this.__current = previous;

			        return result;
			    };

			    // API:
			    // notify control skip / break
			    Controller.prototype.notify = function notify(flag) {
			        this.__state = flag;
			    };

			    // API:
			    // skip child nodes of current node
			    Controller.prototype.skip = function () {
			        this.notify(SKIP);
			    };

			    // API:
			    // break traversals
			    Controller.prototype['break'] = function () {
			        this.notify(BREAK);
			    };

			    // API:
			    // remove node
			    Controller.prototype.remove = function () {
			        this.notify(REMOVE);
			    };

			    Controller.prototype.__initialize = function(root, visitor) {
			        this.visitor = visitor;
			        this.root = root;
			        this.__worklist = [];
			        this.__leavelist = [];
			        this.__current = null;
			        this.__state = null;
			        this.__fallback = null;
			        if (visitor.fallback === 'iteration') {
			            this.__fallback = Object.keys;
			        } else if (typeof visitor.fallback === 'function') {
			            this.__fallback = visitor.fallback;
			        }

			        this.__keys = VisitorKeys;
			        if (visitor.keys) {
			            this.__keys = Object.assign(Object.create(this.__keys), visitor.keys);
			        }
			    };

			    function isNode(node) {
			        if (node == null) {
			            return false;
			        }
			        return typeof node === 'object' && typeof node.type === 'string';
			    }

			    function isProperty(nodeType, key) {
			        return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === key;
			    }

			    Controller.prototype.traverse = function traverse(root, visitor) {
			        var worklist,
			            leavelist,
			            element,
			            node,
			            nodeType,
			            ret,
			            key,
			            current,
			            current2,
			            candidates,
			            candidate,
			            sentinel;

			        this.__initialize(root, visitor);

			        sentinel = {};

			        // reference
			        worklist = this.__worklist;
			        leavelist = this.__leavelist;

			        // initialize
			        worklist.push(new Element(root, null, null, null));
			        leavelist.push(new Element(null, null, null, null));

			        while (worklist.length) {
			            element = worklist.pop();

			            if (element === sentinel) {
			                element = leavelist.pop();

			                ret = this.__execute(visitor.leave, element);

			                if (this.__state === BREAK || ret === BREAK) {
			                    return;
			                }
			                continue;
			            }

			            if (element.node) {

			                ret = this.__execute(visitor.enter, element);

			                if (this.__state === BREAK || ret === BREAK) {
			                    return;
			                }

			                worklist.push(sentinel);
			                leavelist.push(element);

			                if (this.__state === SKIP || ret === SKIP) {
			                    continue;
			                }

			                node = element.node;
			                nodeType = node.type || element.wrap;
			                candidates = this.__keys[nodeType];
			                if (!candidates) {
			                    if (this.__fallback) {
			                        candidates = this.__fallback(node);
			                    } else {
			                        throw new Error('Unknown node type ' + nodeType + '.');
			                    }
			                }

			                current = candidates.length;
			                while ((current -= 1) >= 0) {
			                    key = candidates[current];
			                    candidate = node[key];
			                    if (!candidate) {
			                        continue;
			                    }

			                    if (Array.isArray(candidate)) {
			                        current2 = candidate.length;
			                        while ((current2 -= 1) >= 0) {
			                            if (!candidate[current2]) {
			                                continue;
			                            }
			                            if (isProperty(nodeType, candidates[current])) {
			                                element = new Element(candidate[current2], [key, current2], 'Property', null);
			                            } else if (isNode(candidate[current2])) {
			                                element = new Element(candidate[current2], [key, current2], null, null);
			                            } else {
			                                continue;
			                            }
			                            worklist.push(element);
			                        }
			                    } else if (isNode(candidate)) {
			                        worklist.push(new Element(candidate, key, null, null));
			                    }
			                }
			            }
			        }
			    };

			    Controller.prototype.replace = function replace(root, visitor) {
			        var worklist,
			            leavelist,
			            node,
			            nodeType,
			            target,
			            element,
			            current,
			            current2,
			            candidates,
			            candidate,
			            sentinel,
			            outer,
			            key;

			        function removeElem(element) {
			            var i,
			                key,
			                nextElem,
			                parent;

			            if (element.ref.remove()) {
			                // When the reference is an element of an array.
			                key = element.ref.key;
			                parent = element.ref.parent;

			                // If removed from array, then decrease following items' keys.
			                i = worklist.length;
			                while (i--) {
			                    nextElem = worklist[i];
			                    if (nextElem.ref && nextElem.ref.parent === parent) {
			                        if  (nextElem.ref.key < key) {
			                            break;
			                        }
			                        --nextElem.ref.key;
			                    }
			                }
			            }
			        }

			        this.__initialize(root, visitor);

			        sentinel = {};

			        // reference
			        worklist = this.__worklist;
			        leavelist = this.__leavelist;

			        // initialize
			        outer = {
			            root: root
			        };
			        element = new Element(root, null, null, new Reference(outer, 'root'));
			        worklist.push(element);
			        leavelist.push(element);

			        while (worklist.length) {
			            element = worklist.pop();

			            if (element === sentinel) {
			                element = leavelist.pop();

			                target = this.__execute(visitor.leave, element);

			                // node may be replaced with null,
			                // so distinguish between undefined and null in this place
			                if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
			                    // replace
			                    element.ref.replace(target);
			                }

			                if (this.__state === REMOVE || target === REMOVE) {
			                    removeElem(element);
			                }

			                if (this.__state === BREAK || target === BREAK) {
			                    return outer.root;
			                }
			                continue;
			            }

			            target = this.__execute(visitor.enter, element);

			            // node may be replaced with null,
			            // so distinguish between undefined and null in this place
			            if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
			                // replace
			                element.ref.replace(target);
			                element.node = target;
			            }

			            if (this.__state === REMOVE || target === REMOVE) {
			                removeElem(element);
			                element.node = null;
			            }

			            if (this.__state === BREAK || target === BREAK) {
			                return outer.root;
			            }

			            // node may be null
			            node = element.node;
			            if (!node) {
			                continue;
			            }

			            worklist.push(sentinel);
			            leavelist.push(element);

			            if (this.__state === SKIP || target === SKIP) {
			                continue;
			            }

			            nodeType = node.type || element.wrap;
			            candidates = this.__keys[nodeType];
			            if (!candidates) {
			                if (this.__fallback) {
			                    candidates = this.__fallback(node);
			                } else {
			                    throw new Error('Unknown node type ' + nodeType + '.');
			                }
			            }

			            current = candidates.length;
			            while ((current -= 1) >= 0) {
			                key = candidates[current];
			                candidate = node[key];
			                if (!candidate) {
			                    continue;
			                }

			                if (Array.isArray(candidate)) {
			                    current2 = candidate.length;
			                    while ((current2 -= 1) >= 0) {
			                        if (!candidate[current2]) {
			                            continue;
			                        }
			                        if (isProperty(nodeType, candidates[current])) {
			                            element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
			                        } else if (isNode(candidate[current2])) {
			                            element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
			                        } else {
			                            continue;
			                        }
			                        worklist.push(element);
			                    }
			                } else if (isNode(candidate)) {
			                    worklist.push(new Element(candidate, key, null, new Reference(node, key)));
			                }
			            }
			        }

			        return outer.root;
			    };

			    function traverse(root, visitor) {
			        var controller = new Controller();
			        return controller.traverse(root, visitor);
			    }

			    function replace(root, visitor) {
			        var controller = new Controller();
			        return controller.replace(root, visitor);
			    }

			    function extendCommentRange(comment, tokens) {
			        var target;

			        target = upperBound(tokens, function search(token) {
			            return token.range[0] > comment.range[0];
			        });

			        comment.extendedRange = [comment.range[0], comment.range[1]];

			        if (target !== tokens.length) {
			            comment.extendedRange[1] = tokens[target].range[0];
			        }

			        target -= 1;
			        if (target >= 0) {
			            comment.extendedRange[0] = tokens[target].range[1];
			        }

			        return comment;
			    }

			    function attachComments(tree, providedComments, tokens) {
			        // At first, we should calculate extended comment ranges.
			        var comments = [], comment, len, i, cursor;

			        if (!tree.range) {
			            throw new Error('attachComments needs range information');
			        }

			        // tokens array is empty, we attach comments to tree as 'leadingComments'
			        if (!tokens.length) {
			            if (providedComments.length) {
			                for (i = 0, len = providedComments.length; i < len; i += 1) {
			                    comment = deepCopy(providedComments[i]);
			                    comment.extendedRange = [0, tree.range[0]];
			                    comments.push(comment);
			                }
			                tree.leadingComments = comments;
			            }
			            return tree;
			        }

			        for (i = 0, len = providedComments.length; i < len; i += 1) {
			            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
			        }

			        // This is based on John Freeman's implementation.
			        cursor = 0;
			        traverse(tree, {
			            enter: function (node) {
			                var comment;

			                while (cursor < comments.length) {
			                    comment = comments[cursor];
			                    if (comment.extendedRange[1] > node.range[0]) {
			                        break;
			                    }

			                    if (comment.extendedRange[1] === node.range[0]) {
			                        if (!node.leadingComments) {
			                            node.leadingComments = [];
			                        }
			                        node.leadingComments.push(comment);
			                        comments.splice(cursor, 1);
			                    } else {
			                        cursor += 1;
			                    }
			                }

			                // already out of owned node
			                if (cursor === comments.length) {
			                    return VisitorOption.Break;
			                }

			                if (comments[cursor].extendedRange[0] > node.range[1]) {
			                    return VisitorOption.Skip;
			                }
			            }
			        });

			        cursor = 0;
			        traverse(tree, {
			            leave: function (node) {
			                var comment;

			                while (cursor < comments.length) {
			                    comment = comments[cursor];
			                    if (node.range[1] < comment.extendedRange[0]) {
			                        break;
			                    }

			                    if (node.range[1] === comment.extendedRange[0]) {
			                        if (!node.trailingComments) {
			                            node.trailingComments = [];
			                        }
			                        node.trailingComments.push(comment);
			                        comments.splice(cursor, 1);
			                    } else {
			                        cursor += 1;
			                    }
			                }

			                // already out of owned node
			                if (cursor === comments.length) {
			                    return VisitorOption.Break;
			                }

			                if (comments[cursor].extendedRange[0] > node.range[1]) {
			                    return VisitorOption.Skip;
			                }
			            }
			        });

			        return tree;
			    }

			    exports$1.version = require$$0.version;
			    exports$1.Syntax = Syntax;
			    exports$1.traverse = traverse;
			    exports$1.replace = replace;
			    exports$1.attachComments = attachComments;
			    exports$1.VisitorKeys = VisitorKeys;
			    exports$1.VisitorOption = VisitorOption;
			    exports$1.Controller = Controller;
			    exports$1.cloneEnvironment = function () { return clone({}); };

			    return exports$1;
			}(exports$1));
			/* vim: set sw=4 ts=4 et tw=80 : */ 
		} (estraverse$1));
		return estraverse$1;
	}

	var reference = {};

	var hasRequiredReference;

	function requireReference () {
		if (hasRequiredReference) return reference;
		hasRequiredReference = 1;

		Object.defineProperty(reference, "__esModule", {
		  value: true
		});

		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		/*
		  Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>

		  Redistribution and use in source and binary forms, with or without
		  modification, are permitted provided that the following conditions are met:

		    * Redistributions of source code must retain the above copyright
		      notice, this list of conditions and the following disclaimer.
		    * Redistributions in binary form must reproduce the above copyright
		      notice, this list of conditions and the following disclaimer in the
		      documentation and/or other materials provided with the distribution.

		  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
		  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
		  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
		  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
		  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
		  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
		  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
		  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
		  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
		  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		*/

		var READ = 0x1;
		var WRITE = 0x2;
		var RW = READ | WRITE;

		/**
		 * A Reference represents a single occurrence of an identifier in code.
		 * @class Reference
		 */

		var Reference = function () {
		  function Reference(ident, scope, flag, writeExpr, maybeImplicitGlobal, partial, init) {
		    _classCallCheck(this, Reference);

		    /**
		     * Identifier syntax node.
		     * @member {esprima#Identifier} Reference#identifier
		     */
		    this.identifier = ident;
		    /**
		     * Reference to the enclosing Scope.
		     * @member {Scope} Reference#from
		     */
		    this.from = scope;
		    /**
		     * Whether the reference comes from a dynamic scope (such as 'eval',
		     * 'with', etc.), and may be trapped by dynamic scopes.
		     * @member {boolean} Reference#tainted
		     */
		    this.tainted = false;
		    /**
		     * The variable this reference is resolved with.
		     * @member {Variable} Reference#resolved
		     */
		    this.resolved = null;
		    /**
		     * The read-write mode of the reference. (Value is one of {@link
		     * Reference.READ}, {@link Reference.RW}, {@link Reference.WRITE}).
		     * @member {number} Reference#flag
		     * @private
		     */
		    this.flag = flag;
		    if (this.isWrite()) {
		      /**
		       * If reference is writeable, this is the tree being written to it.
		       * @member {esprima#Node} Reference#writeExpr
		       */
		      this.writeExpr = writeExpr;
		      /**
		       * Whether the Reference might refer to a partial value of writeExpr.
		       * @member {boolean} Reference#partial
		       */
		      this.partial = partial;
		      /**
		       * Whether the Reference is to write of initialization.
		       * @member {boolean} Reference#init
		       */
		      this.init = init;
		    }
		    this.__maybeImplicitGlobal = maybeImplicitGlobal;
		  }

		  /**
		   * Whether the reference is static.
		   * @method Reference#isStatic
		   * @return {boolean}
		   */


		  _createClass(Reference, [{
		    key: "isStatic",
		    value: function isStatic() {
		      return !this.tainted && this.resolved && this.resolved.scope.isStatic();
		    }

		    /**
		     * Whether the reference is writeable.
		     * @method Reference#isWrite
		     * @return {boolean}
		     */

		  }, {
		    key: "isWrite",
		    value: function isWrite() {
		      return !!(this.flag & Reference.WRITE);
		    }

		    /**
		     * Whether the reference is readable.
		     * @method Reference#isRead
		     * @return {boolean}
		     */

		  }, {
		    key: "isRead",
		    value: function isRead() {
		      return !!(this.flag & Reference.READ);
		    }

		    /**
		     * Whether the reference is read-only.
		     * @method Reference#isReadOnly
		     * @return {boolean}
		     */

		  }, {
		    key: "isReadOnly",
		    value: function isReadOnly() {
		      return this.flag === Reference.READ;
		    }

		    /**
		     * Whether the reference is write-only.
		     * @method Reference#isWriteOnly
		     * @return {boolean}
		     */

		  }, {
		    key: "isWriteOnly",
		    value: function isWriteOnly() {
		      return this.flag === Reference.WRITE;
		    }

		    /**
		     * Whether the reference is read-write.
		     * @method Reference#isReadWrite
		     * @return {boolean}
		     */

		  }, {
		    key: "isReadWrite",
		    value: function isReadWrite() {
		      return this.flag === Reference.RW;
		    }
		  }]);

		  return Reference;
		}();

		/**
		 * @constant Reference.READ
		 * @private
		 */


		reference.default = Reference;
		Reference.READ = READ;
		/**
		 * @constant Reference.WRITE
		 * @private
		 */
		Reference.WRITE = WRITE;
		/**
		 * @constant Reference.RW
		 * @private
		 */
		Reference.RW = RW;

		/* vim: set sw=4 ts=4 et tw=80 : */
		
		return reference;
	}

	var variable = {};

	var hasRequiredVariable;

	function requireVariable () {
		if (hasRequiredVariable) return variable;
		hasRequiredVariable = 1;

		Object.defineProperty(variable, "__esModule", {
		  value: true
		});

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		/*
		  Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>

		  Redistribution and use in source and binary forms, with or without
		  modification, are permitted provided that the following conditions are met:

		    * Redistributions of source code must retain the above copyright
		      notice, this list of conditions and the following disclaimer.
		    * Redistributions in binary form must reproduce the above copyright
		      notice, this list of conditions and the following disclaimer in the
		      documentation and/or other materials provided with the distribution.

		  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
		  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
		  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
		  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
		  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
		  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
		  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
		  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
		  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
		  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		*/

		/**
		 * A Variable represents a locally scoped identifier. These include arguments to
		 * functions.
		 * @class Variable
		 */
		var Variable = function Variable(name, scope) {
		  _classCallCheck(this, Variable);

		  /**
		   * The variable name, as given in the source code.
		   * @member {String} Variable#name
		   */
		  this.name = name;
		  /**
		   * List of defining occurrences of this variable (like in 'var ...'
		   * statements or as parameter), as AST nodes.
		   * @member {esprima.Identifier[]} Variable#identifiers
		   */
		  this.identifiers = [];
		  /**
		   * List of {@link Reference|references} of this variable (excluding parameter entries)
		   * in its defining scope and all nested scopes. For defining
		   * occurrences only see {@link Variable#defs}.
		   * @member {Reference[]} Variable#references
		   */
		  this.references = [];

		  /**
		   * List of defining occurrences of this variable (like in 'var ...'
		   * statements or as parameter), as custom objects.
		   * @member {Definition[]} Variable#defs
		   */
		  this.defs = [];

		  this.tainted = false;
		  /**
		   * Whether this is a stack variable.
		   * @member {boolean} Variable#stack
		   */
		  this.stack = true;
		  /**
		   * Reference to the enclosing Scope.
		   * @member {Scope} Variable#scope
		   */
		  this.scope = scope;
		};

		variable.default = Variable;


		Variable.CatchClause = 'CatchClause';
		Variable.Parameter = 'Parameter';
		Variable.FunctionName = 'FunctionName';
		Variable.ClassName = 'ClassName';
		Variable.Variable = 'Variable';
		Variable.ImportBinding = 'ImportBinding';
		Variable.TDZ = 'TDZ';
		Variable.ImplicitGlobalVariable = 'ImplicitGlobalVariable';

		/* vim: set sw=4 ts=4 et tw=80 : */
		
		return variable;
	}

	var definition = {};

	var hasRequiredDefinition;

	function requireDefinition () {
		if (hasRequiredDefinition) return definition;
		hasRequiredDefinition = 1;

		Object.defineProperty(definition, "__esModule", {
		  value: true
		});
		definition.Definition = definition.ParameterDefinition = undefined;

		var _variable = requireVariable();

		var _variable2 = _interopRequireDefault(_variable);

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /*
		                                                                                                                                                            Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>
		                                                                                                                                                          
		                                                                                                                                                            Redistribution and use in source and binary forms, with or without
		                                                                                                                                                            modification, are permitted provided that the following conditions are met:
		                                                                                                                                                          
		                                                                                                                                                              * Redistributions of source code must retain the above copyright
		                                                                                                                                                                notice, this list of conditions and the following disclaimer.
		                                                                                                                                                              * Redistributions in binary form must reproduce the above copyright
		                                                                                                                                                                notice, this list of conditions and the following disclaimer in the
		                                                                                                                                                                documentation and/or other materials provided with the distribution.
		                                                                                                                                                          
		                                                                                                                                                            THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
		                                                                                                                                                            AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
		                                                                                                                                                            IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
		                                                                                                                                                            ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
		                                                                                                                                                            DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
		                                                                                                                                                            (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
		                                                                                                                                                            LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
		                                                                                                                                                            ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
		                                                                                                                                                            (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
		                                                                                                                                                            THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		                                                                                                                                                          */

		/**
		 * @class Definition
		 */
		var Definition = function Definition(type, name, node, parent, index, kind) {
		  _classCallCheck(this, Definition);

		  /**
		   * @member {String} Definition#type - type of the occurrence (e.g. "Parameter", "Variable", ...).
		   */
		  this.type = type;
		  /**
		   * @member {esprima.Identifier} Definition#name - the identifier AST node of the occurrence.
		   */
		  this.name = name;
		  /**
		   * @member {esprima.Node} Definition#node - the enclosing node of the identifier.
		   */
		  this.node = node;
		  /**
		   * @member {esprima.Node?} Definition#parent - the enclosing statement node of the identifier.
		   */
		  this.parent = parent;
		  /**
		   * @member {Number?} Definition#index - the index in the declaration statement.
		   */
		  this.index = index;
		  /**
		   * @member {String?} Definition#kind - the kind of the declaration statement.
		   */
		  this.kind = kind;
		};

		/**
		 * @class ParameterDefinition
		 */


		definition.default = Definition;

		var ParameterDefinition = function (_Definition) {
		  _inherits(ParameterDefinition, _Definition);

		  function ParameterDefinition(name, node, index, rest) {
		    _classCallCheck(this, ParameterDefinition);

		    /**
		     * Whether the parameter definition is a part of a rest parameter.
		     * @member {boolean} ParameterDefinition#rest
		     */
		    var _this = _possibleConstructorReturn(this, (ParameterDefinition.__proto__ || Object.getPrototypeOf(ParameterDefinition)).call(this, _variable2.default.Parameter, name, node, null, index, null));

		    _this.rest = rest;
		    return _this;
		  }

		  return ParameterDefinition;
		}(Definition);

		definition.ParameterDefinition = ParameterDefinition;
		definition.Definition = Definition;

		/* vim: set sw=4 ts=4 et tw=80 : */
		
		return definition;
	}

	var hasRequiredScope;

	function requireScope () {
		if (hasRequiredScope) return scope;
		hasRequiredScope = 1;

		Object.defineProperty(scope, "__esModule", {
		    value: true
		});
		scope.ClassScope = scope.ForScope = scope.FunctionScope = scope.SwitchScope = scope.BlockScope = scope.TDZScope = scope.WithScope = scope.CatchScope = scope.FunctionExpressionNameScope = scope.ModuleScope = scope.GlobalScope = undefined;

		var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Redistribution and use in source and binary forms, with or without
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       modification, are permitted provided that the following conditions are met:
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Redistributions of source code must retain the above copyright
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           notice, this list of conditions and the following disclaimer.
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Redistributions in binary form must reproduce the above copyright
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           notice, this list of conditions and the following disclaimer in the
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           documentation and/or other materials provided with the distribution.
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

		var _estraverse = requireEstraverse$1();

		var _reference = requireReference();

		var _reference2 = _interopRequireDefault(_reference);

		var _variable = requireVariable();

		var _variable2 = _interopRequireDefault(_variable);

		var _definition = requireDefinition();

		var _definition2 = _interopRequireDefault(_definition);

		var _assert = require$$0$1;

		var _assert2 = _interopRequireDefault(_assert);

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		function isStrictScope(scope, block, isMethodDefinition, useDirective) {
		    var body, i, iz, stmt, expr;

		    // When upper scope is exists and strict, inner scope is also strict.
		    if (scope.upper && scope.upper.isStrict) {
		        return true;
		    }

		    // ArrowFunctionExpression's scope is always strict scope.
		    if (block.type === _estraverse.Syntax.ArrowFunctionExpression) {
		        return true;
		    }

		    if (isMethodDefinition) {
		        return true;
		    }

		    if (scope.type === 'class' || scope.type === 'module') {
		        return true;
		    }

		    if (scope.type === 'block' || scope.type === 'switch') {
		        return false;
		    }

		    if (scope.type === 'function') {
		        if (block.type === _estraverse.Syntax.Program) {
		            body = block;
		        } else {
		            body = block.body;
		        }
		    } else if (scope.type === 'global') {
		        body = block;
		    } else {
		        return false;
		    }

		    // Search 'use strict' directive.
		    if (useDirective) {
		        for (i = 0, iz = body.body.length; i < iz; ++i) {
		            stmt = body.body[i];
		            if (stmt.type !== _estraverse.Syntax.DirectiveStatement) {
		                break;
		            }
		            if (stmt.raw === '"use strict"' || stmt.raw === '\'use strict\'') {
		                return true;
		            }
		        }
		    } else {
		        for (i = 0, iz = body.body.length; i < iz; ++i) {
		            stmt = body.body[i];
		            if (stmt.type !== _estraverse.Syntax.ExpressionStatement) {
		                break;
		            }
		            expr = stmt.expression;
		            if (expr.type !== _estraverse.Syntax.Literal || typeof expr.value !== 'string') {
		                break;
		            }
		            if (expr.raw != null) {
		                if (expr.raw === '"use strict"' || expr.raw === '\'use strict\'') {
		                    return true;
		                }
		            } else {
		                if (expr.value === 'use strict') {
		                    return true;
		                }
		            }
		        }
		    }
		    return false;
		}

		function registerScope(scopeManager, scope) {
		    var scopes;

		    scopeManager.scopes.push(scope);

		    scopes = scopeManager.__nodeToScope.get(scope.block);
		    if (scopes) {
		        scopes.push(scope);
		    } else {
		        scopeManager.__nodeToScope.set(scope.block, [scope]);
		    }
		}

		function shouldBeStatically(def) {
		    return def.type === _variable2.default.ClassName || def.type === _variable2.default.Variable && def.parent.kind !== 'var';
		}

		/**
		 * @class Scope
		 */

		var Scope = function () {
		    function Scope(scopeManager, type, upperScope, block, isMethodDefinition) {
		        _classCallCheck(this, Scope);

		        /**
		         * One of 'TDZ', 'module', 'block', 'switch', 'function', 'catch', 'with', 'function', 'class', 'global'.
		         * @member {String} Scope#type
		         */
		        this.type = type;
		        /**
		        * The scoped {@link Variable}s of this scope, as <code>{ Variable.name
		        * : Variable }</code>.
		        * @member {Map} Scope#set
		        */
		        this.set = new Map();
		        /**
		         * The tainted variables of this scope, as <code>{ Variable.name :
		         * boolean }</code>.
		         * @member {Map} Scope#taints */
		        this.taints = new Map();
		        /**
		         * Generally, through the lexical scoping of JS you can always know
		         * which variable an identifier in the source code refers to. There are
		         * a few exceptions to this rule. With 'global' and 'with' scopes you
		         * can only decide at runtime which variable a reference refers to.
		         * Moreover, if 'eval()' is used in a scope, it might introduce new
		         * bindings in this or its parent scopes.
		         * All those scopes are considered 'dynamic'.
		         * @member {boolean} Scope#dynamic
		         */
		        this.dynamic = this.type === 'global' || this.type === 'with';
		        /**
		         * A reference to the scope-defining syntax node.
		         * @member {esprima.Node} Scope#block
		         */
		        this.block = block;
		        /**
		        * The {@link Reference|references} that are not resolved with this scope.
		        * @member {Reference[]} Scope#through
		        */
		        this.through = [];
		        /**
		        * The scoped {@link Variable}s of this scope. In the case of a
		        * 'function' scope this includes the automatic argument <em>arguments</em> as
		        * its first element, as well as all further formal arguments.
		        * @member {Variable[]} Scope#variables
		        */
		        this.variables = [];
		        /**
		        * Any variable {@link Reference|reference} found in this scope. This
		        * includes occurrences of local variables as well as variables from
		        * parent scopes (including the global scope). For local variables
		        * this also includes defining occurrences (like in a 'var' statement).
		        * In a 'function' scope this does not include the occurrences of the
		        * formal parameter in the parameter list.
		        * @member {Reference[]} Scope#references
		        */
		        this.references = [];

		        /**
		        * For 'global' and 'function' scopes, this is a self-reference. For
		        * other scope types this is the <em>variableScope</em> value of the
		        * parent scope.
		        * @member {Scope} Scope#variableScope
		        */
		        this.variableScope = this.type === 'global' || this.type === 'function' || this.type === 'module' ? this : upperScope.variableScope;
		        /**
		        * Whether this scope is created by a FunctionExpression.
		        * @member {boolean} Scope#functionExpressionScope
		        */
		        this.functionExpressionScope = false;
		        /**
		        * Whether this is a scope that contains an 'eval()' invocation.
		        * @member {boolean} Scope#directCallToEvalScope
		        */
		        this.directCallToEvalScope = false;
		        /**
		        * @member {boolean} Scope#thisFound
		        */
		        this.thisFound = false;

		        this.__left = [];

		        /**
		        * Reference to the parent {@link Scope|scope}.
		        * @member {Scope} Scope#upper
		        */
		        this.upper = upperScope;
		        /**
		        * Whether 'use strict' is in effect in this scope.
		        * @member {boolean} Scope#isStrict
		        */
		        this.isStrict = isStrictScope(this, block, isMethodDefinition, scopeManager.__useDirective());

		        /**
		        * List of nested {@link Scope}s.
		        * @member {Scope[]} Scope#childScopes
		        */
		        this.childScopes = [];
		        if (this.upper) {
		            this.upper.childScopes.push(this);
		        }

		        this.__declaredVariables = scopeManager.__declaredVariables;

		        registerScope(scopeManager, this);
		    }

		    _createClass(Scope, [{
		        key: '__shouldStaticallyClose',
		        value: function __shouldStaticallyClose(scopeManager) {
		            return !this.dynamic || scopeManager.__isOptimistic();
		        }
		    }, {
		        key: '__shouldStaticallyCloseForGlobal',
		        value: function __shouldStaticallyCloseForGlobal(ref) {
		            // On global scope, let/const/class declarations should be resolved statically.
		            var name = ref.identifier.name;
		            if (!this.set.has(name)) {
		                return false;
		            }

		            var variable = this.set.get(name);
		            var defs = variable.defs;
		            return defs.length > 0 && defs.every(shouldBeStatically);
		        }
		    }, {
		        key: '__staticCloseRef',
		        value: function __staticCloseRef(ref) {
		            if (!this.__resolve(ref)) {
		                this.__delegateToUpperScope(ref);
		            }
		        }
		    }, {
		        key: '__dynamicCloseRef',
		        value: function __dynamicCloseRef(ref) {
		            // notify all names are through to global
		            var current = this;
		            do {
		                current.through.push(ref);
		                current = current.upper;
		            } while (current);
		        }
		    }, {
		        key: '__globalCloseRef',
		        value: function __globalCloseRef(ref) {
		            // let/const/class declarations should be resolved statically.
		            // others should be resolved dynamically.
		            if (this.__shouldStaticallyCloseForGlobal(ref)) {
		                this.__staticCloseRef(ref);
		            } else {
		                this.__dynamicCloseRef(ref);
		            }
		        }
		    }, {
		        key: '__close',
		        value: function __close(scopeManager) {
		            var closeRef;
		            if (this.__shouldStaticallyClose(scopeManager)) {
		                closeRef = this.__staticCloseRef;
		            } else if (this.type !== 'global') {
		                closeRef = this.__dynamicCloseRef;
		            } else {
		                closeRef = this.__globalCloseRef;
		            }

		            // Try Resolving all references in this scope.
		            for (var i = 0, iz = this.__left.length; i < iz; ++i) {
		                var ref = this.__left[i];
		                closeRef.call(this, ref);
		            }
		            this.__left = null;

		            return this.upper;
		        }
		    }, {
		        key: '__resolve',
		        value: function __resolve(ref) {
		            var variable, name;
		            name = ref.identifier.name;
		            if (this.set.has(name)) {
		                variable = this.set.get(name);
		                variable.references.push(ref);
		                variable.stack = variable.stack && ref.from.variableScope === this.variableScope;
		                if (ref.tainted) {
		                    variable.tainted = true;
		                    this.taints.set(variable.name, true);
		                }
		                ref.resolved = variable;
		                return true;
		            }
		            return false;
		        }
		    }, {
		        key: '__delegateToUpperScope',
		        value: function __delegateToUpperScope(ref) {
		            if (this.upper) {
		                this.upper.__left.push(ref);
		            }
		            this.through.push(ref);
		        }
		    }, {
		        key: '__addDeclaredVariablesOfNode',
		        value: function __addDeclaredVariablesOfNode(variable, node) {
		            if (node == null) {
		                return;
		            }

		            var variables = this.__declaredVariables.get(node);
		            if (variables == null) {
		                variables = [];
		                this.__declaredVariables.set(node, variables);
		            }
		            if (variables.indexOf(variable) === -1) {
		                variables.push(variable);
		            }
		        }
		    }, {
		        key: '__defineGeneric',
		        value: function __defineGeneric(name, set, variables, node, def) {
		            var variable;

		            variable = set.get(name);
		            if (!variable) {
		                variable = new _variable2.default(name, this);
		                set.set(name, variable);
		                variables.push(variable);
		            }

		            if (def) {
		                variable.defs.push(def);
		                if (def.type !== _variable2.default.TDZ) {
		                    this.__addDeclaredVariablesOfNode(variable, def.node);
		                    this.__addDeclaredVariablesOfNode(variable, def.parent);
		                }
		            }
		            if (node) {
		                variable.identifiers.push(node);
		            }
		        }
		    }, {
		        key: '__define',
		        value: function __define(node, def) {
		            if (node && node.type === _estraverse.Syntax.Identifier) {
		                this.__defineGeneric(node.name, this.set, this.variables, node, def);
		            }
		        }
		    }, {
		        key: '__referencing',
		        value: function __referencing(node, assign, writeExpr, maybeImplicitGlobal, partial, init) {
		            // because Array element may be null
		            if (!node || node.type !== _estraverse.Syntax.Identifier) {
		                return;
		            }

		            // Specially handle like `this`.
		            if (node.name === 'super') {
		                return;
		            }

		            var ref = new _reference2.default(node, this, assign || _reference2.default.READ, writeExpr, maybeImplicitGlobal, !!partial, !!init);
		            this.references.push(ref);
		            this.__left.push(ref);
		        }
		    }, {
		        key: '__detectEval',
		        value: function __detectEval() {
		            var current;
		            current = this;
		            this.directCallToEvalScope = true;
		            do {
		                current.dynamic = true;
		                current = current.upper;
		            } while (current);
		        }
		    }, {
		        key: '__detectThis',
		        value: function __detectThis() {
		            this.thisFound = true;
		        }
		    }, {
		        key: '__isClosed',
		        value: function __isClosed() {
		            return this.__left === null;
		        }

		        /**
		         * returns resolved {Reference}
		         * @method Scope#resolve
		         * @param {Esprima.Identifier} ident - identifier to be resolved.
		         * @return {Reference}
		         */

		    }, {
		        key: 'resolve',
		        value: function resolve(ident) {
		            var ref, i, iz;
		            (0, _assert2.default)(this.__isClosed(), 'Scope should be closed.');
		            (0, _assert2.default)(ident.type === _estraverse.Syntax.Identifier, 'Target should be identifier.');
		            for (i = 0, iz = this.references.length; i < iz; ++i) {
		                ref = this.references[i];
		                if (ref.identifier === ident) {
		                    return ref;
		                }
		            }
		            return null;
		        }

		        /**
		         * returns this scope is static
		         * @method Scope#isStatic
		         * @return {boolean}
		         */

		    }, {
		        key: 'isStatic',
		        value: function isStatic() {
		            return !this.dynamic;
		        }

		        /**
		         * returns this scope has materialized arguments
		         * @method Scope#isArgumentsMaterialized
		         * @return {boolean}
		         */

		    }, {
		        key: 'isArgumentsMaterialized',
		        value: function isArgumentsMaterialized() {
		            return true;
		        }

		        /**
		         * returns this scope has materialized `this` reference
		         * @method Scope#isThisMaterialized
		         * @return {boolean}
		         */

		    }, {
		        key: 'isThisMaterialized',
		        value: function isThisMaterialized() {
		            return true;
		        }
		    }, {
		        key: 'isUsedName',
		        value: function isUsedName(name) {
		            if (this.set.has(name)) {
		                return true;
		            }
		            for (var i = 0, iz = this.through.length; i < iz; ++i) {
		                if (this.through[i].identifier.name === name) {
		                    return true;
		                }
		            }
		            return false;
		        }
		    }]);

		    return Scope;
		}();

		scope.default = Scope;

		scope.GlobalScope = function (_Scope) {
		    _inherits(GlobalScope, _Scope);

		    function GlobalScope(scopeManager, block) {
		        _classCallCheck(this, GlobalScope);

		        var _this = _possibleConstructorReturn(this, (GlobalScope.__proto__ || Object.getPrototypeOf(GlobalScope)).call(this, scopeManager, 'global', null, block, false));

		        _this.implicit = {
		            set: new Map(),
		            variables: [],
		            /**
		            * List of {@link Reference}s that are left to be resolved (i.e. which
		            * need to be linked to the variable they refer to).
		            * @member {Reference[]} Scope#implicit#left
		            */
		            left: []
		        };
		        return _this;
		    }

		    _createClass(GlobalScope, [{
		        key: '__close',
		        value: function __close(scopeManager) {
		            var implicit = [];
		            for (var i = 0, iz = this.__left.length; i < iz; ++i) {
		                var ref = this.__left[i];
		                if (ref.__maybeImplicitGlobal && !this.set.has(ref.identifier.name)) {
		                    implicit.push(ref.__maybeImplicitGlobal);
		                }
		            }

		            // create an implicit global variable from assignment expression
		            for (var _i = 0, _iz = implicit.length; _i < _iz; ++_i) {
		                var info = implicit[_i];
		                this.__defineImplicit(info.pattern, new _definition2.default(_variable2.default.ImplicitGlobalVariable, info.pattern, info.node, null, null, null));
		            }

		            this.implicit.left = this.__left;

		            return _get(GlobalScope.prototype.__proto__ || Object.getPrototypeOf(GlobalScope.prototype), '__close', this).call(this, scopeManager);
		        }
		    }, {
		        key: '__defineImplicit',
		        value: function __defineImplicit(node, def) {
		            if (node && node.type === _estraverse.Syntax.Identifier) {
		                this.__defineGeneric(node.name, this.implicit.set, this.implicit.variables, node, def);
		            }
		        }
		    }]);

		    return GlobalScope;
		}(Scope);

		scope.ModuleScope = function (_Scope2) {
		    _inherits(ModuleScope, _Scope2);

		    function ModuleScope(scopeManager, upperScope, block) {
		        _classCallCheck(this, ModuleScope);

		        return _possibleConstructorReturn(this, (ModuleScope.__proto__ || Object.getPrototypeOf(ModuleScope)).call(this, scopeManager, 'module', upperScope, block, false));
		    }

		    return ModuleScope;
		}(Scope);

		scope.FunctionExpressionNameScope = function (_Scope3) {
		    _inherits(FunctionExpressionNameScope, _Scope3);

		    function FunctionExpressionNameScope(scopeManager, upperScope, block) {
		        _classCallCheck(this, FunctionExpressionNameScope);

		        var _this3 = _possibleConstructorReturn(this, (FunctionExpressionNameScope.__proto__ || Object.getPrototypeOf(FunctionExpressionNameScope)).call(this, scopeManager, 'function-expression-name', upperScope, block, false));

		        _this3.__define(block.id, new _definition2.default(_variable2.default.FunctionName, block.id, block, null, null, null));
		        _this3.functionExpressionScope = true;
		        return _this3;
		    }

		    return FunctionExpressionNameScope;
		}(Scope);

		scope.CatchScope = function (_Scope4) {
		    _inherits(CatchScope, _Scope4);

		    function CatchScope(scopeManager, upperScope, block) {
		        _classCallCheck(this, CatchScope);

		        return _possibleConstructorReturn(this, (CatchScope.__proto__ || Object.getPrototypeOf(CatchScope)).call(this, scopeManager, 'catch', upperScope, block, false));
		    }

		    return CatchScope;
		}(Scope);

		scope.WithScope = function (_Scope5) {
		    _inherits(WithScope, _Scope5);

		    function WithScope(scopeManager, upperScope, block) {
		        _classCallCheck(this, WithScope);

		        return _possibleConstructorReturn(this, (WithScope.__proto__ || Object.getPrototypeOf(WithScope)).call(this, scopeManager, 'with', upperScope, block, false));
		    }

		    _createClass(WithScope, [{
		        key: '__close',
		        value: function __close(scopeManager) {
		            if (this.__shouldStaticallyClose(scopeManager)) {
		                return _get(WithScope.prototype.__proto__ || Object.getPrototypeOf(WithScope.prototype), '__close', this).call(this, scopeManager);
		            }

		            for (var i = 0, iz = this.__left.length; i < iz; ++i) {
		                var ref = this.__left[i];
		                ref.tainted = true;
		                this.__delegateToUpperScope(ref);
		            }
		            this.__left = null;

		            return this.upper;
		        }
		    }]);

		    return WithScope;
		}(Scope);

		scope.TDZScope = function (_Scope6) {
		    _inherits(TDZScope, _Scope6);

		    function TDZScope(scopeManager, upperScope, block) {
		        _classCallCheck(this, TDZScope);

		        return _possibleConstructorReturn(this, (TDZScope.__proto__ || Object.getPrototypeOf(TDZScope)).call(this, scopeManager, 'TDZ', upperScope, block, false));
		    }

		    return TDZScope;
		}(Scope);

		scope.BlockScope = function (_Scope7) {
		    _inherits(BlockScope, _Scope7);

		    function BlockScope(scopeManager, upperScope, block) {
		        _classCallCheck(this, BlockScope);

		        return _possibleConstructorReturn(this, (BlockScope.__proto__ || Object.getPrototypeOf(BlockScope)).call(this, scopeManager, 'block', upperScope, block, false));
		    }

		    return BlockScope;
		}(Scope);

		scope.SwitchScope = function (_Scope8) {
		    _inherits(SwitchScope, _Scope8);

		    function SwitchScope(scopeManager, upperScope, block) {
		        _classCallCheck(this, SwitchScope);

		        return _possibleConstructorReturn(this, (SwitchScope.__proto__ || Object.getPrototypeOf(SwitchScope)).call(this, scopeManager, 'switch', upperScope, block, false));
		    }

		    return SwitchScope;
		}(Scope);

		scope.FunctionScope = function (_Scope9) {
		    _inherits(FunctionScope, _Scope9);

		    function FunctionScope(scopeManager, upperScope, block, isMethodDefinition) {
		        _classCallCheck(this, FunctionScope);

		        // section 9.2.13, FunctionDeclarationInstantiation.
		        // NOTE Arrow functions never have an arguments objects.
		        var _this9 = _possibleConstructorReturn(this, (FunctionScope.__proto__ || Object.getPrototypeOf(FunctionScope)).call(this, scopeManager, 'function', upperScope, block, isMethodDefinition));

		        if (_this9.block.type !== _estraverse.Syntax.ArrowFunctionExpression) {
		            _this9.__defineArguments();
		        }
		        return _this9;
		    }

		    _createClass(FunctionScope, [{
		        key: 'isArgumentsMaterialized',
		        value: function isArgumentsMaterialized() {
		            // TODO(Constellation)
		            // We can more aggressive on this condition like this.
		            //
		            // function t() {
		            //     // arguments of t is always hidden.
		            //     function arguments() {
		            //     }
		            // }
		            if (this.block.type === _estraverse.Syntax.ArrowFunctionExpression) {
		                return false;
		            }

		            if (!this.isStatic()) {
		                return true;
		            }

		            var variable = this.set.get('arguments');
		            (0, _assert2.default)(variable, 'Always have arguments variable.');
		            return variable.tainted || variable.references.length !== 0;
		        }
		    }, {
		        key: 'isThisMaterialized',
		        value: function isThisMaterialized() {
		            if (!this.isStatic()) {
		                return true;
		            }
		            return this.thisFound;
		        }
		    }, {
		        key: '__defineArguments',
		        value: function __defineArguments() {
		            this.__defineGeneric('arguments', this.set, this.variables, null, null);
		            this.taints.set('arguments', true);
		        }
		    }]);

		    return FunctionScope;
		}(Scope);

		scope.ForScope = function (_Scope10) {
		    _inherits(ForScope, _Scope10);

		    function ForScope(scopeManager, upperScope, block) {
		        _classCallCheck(this, ForScope);

		        return _possibleConstructorReturn(this, (ForScope.__proto__ || Object.getPrototypeOf(ForScope)).call(this, scopeManager, 'for', upperScope, block, false));
		    }

		    return ForScope;
		}(Scope);

		scope.ClassScope = function (_Scope11) {
		    _inherits(ClassScope, _Scope11);

		    function ClassScope(scopeManager, upperScope, block) {
		        _classCallCheck(this, ClassScope);

		        return _possibleConstructorReturn(this, (ClassScope.__proto__ || Object.getPrototypeOf(ClassScope)).call(this, scopeManager, 'class', upperScope, block, false));
		    }

		    return ClassScope;
		}(Scope);

		/* vim: set sw=4 ts=4 et tw=80 : */
		
		return scope;
	}

	var hasRequiredScopeManager;

	function requireScopeManager () {
		if (hasRequiredScopeManager) return scopeManager;
		hasRequiredScopeManager = 1;

		Object.defineProperty(scopeManager, "__esModule", {
		    value: true
		});

		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Redistribution and use in source and binary forms, with or without
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       modification, are permitted provided that the following conditions are met:
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Redistributions of source code must retain the above copyright
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           notice, this list of conditions and the following disclaimer.
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Redistributions in binary form must reproduce the above copyright
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           notice, this list of conditions and the following disclaimer in the
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           documentation and/or other materials provided with the distribution.
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

		var _scope = requireScope();

		_interopRequireDefault(_scope);

		var _assert = require$$0$1;

		var _assert2 = _interopRequireDefault(_assert);

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		/**
		 * @class ScopeManager
		 */
		var ScopeManager = function () {
		    function ScopeManager(options) {
		        _classCallCheck(this, ScopeManager);

		        this.scopes = [];
		        this.globalScope = null;
		        this.__nodeToScope = new WeakMap();
		        this.__currentScope = null;
		        this.__options = options;
		        this.__declaredVariables = new WeakMap();
		    }

		    _createClass(ScopeManager, [{
		        key: '__useDirective',
		        value: function __useDirective() {
		            return this.__options.directive;
		        }
		    }, {
		        key: '__isOptimistic',
		        value: function __isOptimistic() {
		            return this.__options.optimistic;
		        }
		    }, {
		        key: '__ignoreEval',
		        value: function __ignoreEval() {
		            return this.__options.ignoreEval;
		        }
		    }, {
		        key: '__isNodejsScope',
		        value: function __isNodejsScope() {
		            return this.__options.nodejsScope;
		        }
		    }, {
		        key: 'isModule',
		        value: function isModule() {
		            return this.__options.sourceType === 'module';
		        }
		    }, {
		        key: 'isImpliedStrict',
		        value: function isImpliedStrict() {
		            return this.__options.impliedStrict;
		        }
		    }, {
		        key: 'isStrictModeSupported',
		        value: function isStrictModeSupported() {
		            return this.__options.ecmaVersion >= 5;
		        }

		        // Returns appropriate scope for this node.

		    }, {
		        key: '__get',
		        value: function __get(node) {
		            return this.__nodeToScope.get(node);
		        }

		        /**
		         * Get variables that are declared by the node.
		         *
		         * "are declared by the node" means the node is same as `Variable.defs[].node` or `Variable.defs[].parent`.
		         * If the node declares nothing, this method returns an empty array.
		         * CAUTION: This API is experimental. See https://github.com/estools/escope/pull/69 for more details.
		         *
		         * @param {Esprima.Node} node - a node to get.
		         * @returns {Variable[]} variables that declared by the node.
		         */

		    }, {
		        key: 'getDeclaredVariables',
		        value: function getDeclaredVariables(node) {
		            return this.__declaredVariables.get(node) || [];
		        }

		        /**
		         * acquire scope from node.
		         * @method ScopeManager#acquire
		         * @param {Esprima.Node} node - node for the acquired scope.
		         * @param {boolean=} inner - look up the most inner scope, default value is false.
		         * @return {Scope?}
		         */

		    }, {
		        key: 'acquire',
		        value: function acquire(node, inner) {
		            var scopes, scope, i, iz;

		            function predicate(scope) {
		                if (scope.type === 'function' && scope.functionExpressionScope) {
		                    return false;
		                }
		                if (scope.type === 'TDZ') {
		                    return false;
		                }
		                return true;
		            }

		            scopes = this.__get(node);
		            if (!scopes || scopes.length === 0) {
		                return null;
		            }

		            // Heuristic selection from all scopes.
		            // If you would like to get all scopes, please use ScopeManager#acquireAll.
		            if (scopes.length === 1) {
		                return scopes[0];
		            }

		            if (inner) {
		                for (i = scopes.length - 1; i >= 0; --i) {
		                    scope = scopes[i];
		                    if (predicate(scope)) {
		                        return scope;
		                    }
		                }
		            } else {
		                for (i = 0, iz = scopes.length; i < iz; ++i) {
		                    scope = scopes[i];
		                    if (predicate(scope)) {
		                        return scope;
		                    }
		                }
		            }

		            return null;
		        }

		        /**
		         * acquire all scopes from node.
		         * @method ScopeManager#acquireAll
		         * @param {Esprima.Node} node - node for the acquired scope.
		         * @return {Scope[]?}
		         */

		    }, {
		        key: 'acquireAll',
		        value: function acquireAll(node) {
		            return this.__get(node);
		        }

		        /**
		         * release the node.
		         * @method ScopeManager#release
		         * @param {Esprima.Node} node - releasing node.
		         * @param {boolean=} inner - look up the most inner scope, default value is false.
		         * @return {Scope?} upper scope for the node.
		         */

		    }, {
		        key: 'release',
		        value: function release(node, inner) {
		            var scopes, scope;
		            scopes = this.__get(node);
		            if (scopes && scopes.length) {
		                scope = scopes[0].upper;
		                if (!scope) {
		                    return null;
		                }
		                return this.acquire(scope.block, inner);
		            }
		            return null;
		        }
		    }, {
		        key: 'attach',
		        value: function attach() {}
		    }, {
		        key: 'detach',
		        value: function detach() {}
		    }, {
		        key: '__nestScope',
		        value: function __nestScope(scope) {
		            if (scope instanceof _scope.GlobalScope) {
		                (0, _assert2.default)(this.__currentScope === null);
		                this.globalScope = scope;
		            }
		            this.__currentScope = scope;
		            return scope;
		        }
		    }, {
		        key: '__nestGlobalScope',
		        value: function __nestGlobalScope(node) {
		            return this.__nestScope(new _scope.GlobalScope(this, node));
		        }
		    }, {
		        key: '__nestBlockScope',
		        value: function __nestBlockScope(node, isMethodDefinition) {
		            return this.__nestScope(new _scope.BlockScope(this, this.__currentScope, node));
		        }
		    }, {
		        key: '__nestFunctionScope',
		        value: function __nestFunctionScope(node, isMethodDefinition) {
		            return this.__nestScope(new _scope.FunctionScope(this, this.__currentScope, node, isMethodDefinition));
		        }
		    }, {
		        key: '__nestForScope',
		        value: function __nestForScope(node) {
		            return this.__nestScope(new _scope.ForScope(this, this.__currentScope, node));
		        }
		    }, {
		        key: '__nestCatchScope',
		        value: function __nestCatchScope(node) {
		            return this.__nestScope(new _scope.CatchScope(this, this.__currentScope, node));
		        }
		    }, {
		        key: '__nestWithScope',
		        value: function __nestWithScope(node) {
		            return this.__nestScope(new _scope.WithScope(this, this.__currentScope, node));
		        }
		    }, {
		        key: '__nestClassScope',
		        value: function __nestClassScope(node) {
		            return this.__nestScope(new _scope.ClassScope(this, this.__currentScope, node));
		        }
		    }, {
		        key: '__nestSwitchScope',
		        value: function __nestSwitchScope(node) {
		            return this.__nestScope(new _scope.SwitchScope(this, this.__currentScope, node));
		        }
		    }, {
		        key: '__nestModuleScope',
		        value: function __nestModuleScope(node) {
		            return this.__nestScope(new _scope.ModuleScope(this, this.__currentScope, node));
		        }
		    }, {
		        key: '__nestTDZScope',
		        value: function __nestTDZScope(node) {
		            return this.__nestScope(new _scope.TDZScope(this, this.__currentScope, node));
		        }
		    }, {
		        key: '__nestFunctionExpressionNameScope',
		        value: function __nestFunctionExpressionNameScope(node) {
		            return this.__nestScope(new _scope.FunctionExpressionNameScope(this, this.__currentScope, node));
		        }
		    }, {
		        key: '__isES6',
		        value: function __isES6() {
		            return this.__options.ecmaVersion >= 6;
		        }
		    }]);

		    return ScopeManager;
		}();

		/* vim: set sw=4 ts=4 et tw=80 : */


		scopeManager.default = ScopeManager;
		
		return scopeManager;
	}

	var referencer = {};

	var esrecurse = {};

	var estraverse = {};

	/*
	  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	var hasRequiredEstraverse;

	function requireEstraverse () {
		if (hasRequiredEstraverse) return estraverse;
		hasRequiredEstraverse = 1;
		(function (exports$1) {
			/*jslint vars:false, bitwise:true*/
			/*jshint indent:4*/
			/*global exports:true*/
			(function clone(exports$1) {

			    var Syntax,
			        VisitorOption,
			        VisitorKeys,
			        BREAK,
			        SKIP,
			        REMOVE;

			    function deepCopy(obj) {
			        var ret = {}, key, val;
			        for (key in obj) {
			            if (obj.hasOwnProperty(key)) {
			                val = obj[key];
			                if (typeof val === 'object' && val !== null) {
			                    ret[key] = deepCopy(val);
			                } else {
			                    ret[key] = val;
			                }
			            }
			        }
			        return ret;
			    }

			    // based on LLVM libc++ upper_bound / lower_bound
			    // MIT License

			    function upperBound(array, func) {
			        var diff, len, i, current;

			        len = array.length;
			        i = 0;

			        while (len) {
			            diff = len >>> 1;
			            current = i + diff;
			            if (func(array[current])) {
			                len = diff;
			            } else {
			                i = current + 1;
			                len -= diff + 1;
			            }
			        }
			        return i;
			    }

			    Syntax = {
			        AssignmentExpression: 'AssignmentExpression',
			        AssignmentPattern: 'AssignmentPattern',
			        ArrayExpression: 'ArrayExpression',
			        ArrayPattern: 'ArrayPattern',
			        ArrowFunctionExpression: 'ArrowFunctionExpression',
			        AwaitExpression: 'AwaitExpression', // CAUTION: It's deferred to ES7.
			        BlockStatement: 'BlockStatement',
			        BinaryExpression: 'BinaryExpression',
			        BreakStatement: 'BreakStatement',
			        CallExpression: 'CallExpression',
			        CatchClause: 'CatchClause',
			        ChainExpression: 'ChainExpression',
			        ClassBody: 'ClassBody',
			        ClassDeclaration: 'ClassDeclaration',
			        ClassExpression: 'ClassExpression',
			        ComprehensionBlock: 'ComprehensionBlock',  // CAUTION: It's deferred to ES7.
			        ComprehensionExpression: 'ComprehensionExpression',  // CAUTION: It's deferred to ES7.
			        ConditionalExpression: 'ConditionalExpression',
			        ContinueStatement: 'ContinueStatement',
			        DebuggerStatement: 'DebuggerStatement',
			        DirectiveStatement: 'DirectiveStatement',
			        DoWhileStatement: 'DoWhileStatement',
			        EmptyStatement: 'EmptyStatement',
			        ExportAllDeclaration: 'ExportAllDeclaration',
			        ExportDefaultDeclaration: 'ExportDefaultDeclaration',
			        ExportNamedDeclaration: 'ExportNamedDeclaration',
			        ExportSpecifier: 'ExportSpecifier',
			        ExpressionStatement: 'ExpressionStatement',
			        ForStatement: 'ForStatement',
			        ForInStatement: 'ForInStatement',
			        ForOfStatement: 'ForOfStatement',
			        FunctionDeclaration: 'FunctionDeclaration',
			        FunctionExpression: 'FunctionExpression',
			        GeneratorExpression: 'GeneratorExpression',  // CAUTION: It's deferred to ES7.
			        Identifier: 'Identifier',
			        IfStatement: 'IfStatement',
			        ImportExpression: 'ImportExpression',
			        ImportDeclaration: 'ImportDeclaration',
			        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
			        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
			        ImportSpecifier: 'ImportSpecifier',
			        Literal: 'Literal',
			        LabeledStatement: 'LabeledStatement',
			        LogicalExpression: 'LogicalExpression',
			        MemberExpression: 'MemberExpression',
			        MetaProperty: 'MetaProperty',
			        MethodDefinition: 'MethodDefinition',
			        ModuleSpecifier: 'ModuleSpecifier',
			        NewExpression: 'NewExpression',
			        ObjectExpression: 'ObjectExpression',
			        ObjectPattern: 'ObjectPattern',
			        PrivateIdentifier: 'PrivateIdentifier',
			        Program: 'Program',
			        Property: 'Property',
			        PropertyDefinition: 'PropertyDefinition',
			        RestElement: 'RestElement',
			        ReturnStatement: 'ReturnStatement',
			        SequenceExpression: 'SequenceExpression',
			        SpreadElement: 'SpreadElement',
			        Super: 'Super',
			        SwitchStatement: 'SwitchStatement',
			        SwitchCase: 'SwitchCase',
			        TaggedTemplateExpression: 'TaggedTemplateExpression',
			        TemplateElement: 'TemplateElement',
			        TemplateLiteral: 'TemplateLiteral',
			        ThisExpression: 'ThisExpression',
			        ThrowStatement: 'ThrowStatement',
			        TryStatement: 'TryStatement',
			        UnaryExpression: 'UnaryExpression',
			        UpdateExpression: 'UpdateExpression',
			        VariableDeclaration: 'VariableDeclaration',
			        VariableDeclarator: 'VariableDeclarator',
			        WhileStatement: 'WhileStatement',
			        WithStatement: 'WithStatement',
			        YieldExpression: 'YieldExpression'
			    };

			    VisitorKeys = {
			        AssignmentExpression: ['left', 'right'],
			        AssignmentPattern: ['left', 'right'],
			        ArrayExpression: ['elements'],
			        ArrayPattern: ['elements'],
			        ArrowFunctionExpression: ['params', 'body'],
			        AwaitExpression: ['argument'], // CAUTION: It's deferred to ES7.
			        BlockStatement: ['body'],
			        BinaryExpression: ['left', 'right'],
			        BreakStatement: ['label'],
			        CallExpression: ['callee', 'arguments'],
			        CatchClause: ['param', 'body'],
			        ChainExpression: ['expression'],
			        ClassBody: ['body'],
			        ClassDeclaration: ['id', 'superClass', 'body'],
			        ClassExpression: ['id', 'superClass', 'body'],
			        ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
			        ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
			        ConditionalExpression: ['test', 'consequent', 'alternate'],
			        ContinueStatement: ['label'],
			        DebuggerStatement: [],
			        DirectiveStatement: [],
			        DoWhileStatement: ['body', 'test'],
			        EmptyStatement: [],
			        ExportAllDeclaration: ['source'],
			        ExportDefaultDeclaration: ['declaration'],
			        ExportNamedDeclaration: ['declaration', 'specifiers', 'source'],
			        ExportSpecifier: ['exported', 'local'],
			        ExpressionStatement: ['expression'],
			        ForStatement: ['init', 'test', 'update', 'body'],
			        ForInStatement: ['left', 'right', 'body'],
			        ForOfStatement: ['left', 'right', 'body'],
			        FunctionDeclaration: ['id', 'params', 'body'],
			        FunctionExpression: ['id', 'params', 'body'],
			        GeneratorExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
			        Identifier: [],
			        IfStatement: ['test', 'consequent', 'alternate'],
			        ImportExpression: ['source'],
			        ImportDeclaration: ['specifiers', 'source'],
			        ImportDefaultSpecifier: ['local'],
			        ImportNamespaceSpecifier: ['local'],
			        ImportSpecifier: ['imported', 'local'],
			        Literal: [],
			        LabeledStatement: ['label', 'body'],
			        LogicalExpression: ['left', 'right'],
			        MemberExpression: ['object', 'property'],
			        MetaProperty: ['meta', 'property'],
			        MethodDefinition: ['key', 'value'],
			        ModuleSpecifier: [],
			        NewExpression: ['callee', 'arguments'],
			        ObjectExpression: ['properties'],
			        ObjectPattern: ['properties'],
			        PrivateIdentifier: [],
			        Program: ['body'],
			        Property: ['key', 'value'],
			        PropertyDefinition: ['key', 'value'],
			        RestElement: [ 'argument' ],
			        ReturnStatement: ['argument'],
			        SequenceExpression: ['expressions'],
			        SpreadElement: ['argument'],
			        Super: [],
			        SwitchStatement: ['discriminant', 'cases'],
			        SwitchCase: ['test', 'consequent'],
			        TaggedTemplateExpression: ['tag', 'quasi'],
			        TemplateElement: [],
			        TemplateLiteral: ['quasis', 'expressions'],
			        ThisExpression: [],
			        ThrowStatement: ['argument'],
			        TryStatement: ['block', 'handler', 'finalizer'],
			        UnaryExpression: ['argument'],
			        UpdateExpression: ['argument'],
			        VariableDeclaration: ['declarations'],
			        VariableDeclarator: ['id', 'init'],
			        WhileStatement: ['test', 'body'],
			        WithStatement: ['object', 'body'],
			        YieldExpression: ['argument']
			    };

			    // unique id
			    BREAK = {};
			    SKIP = {};
			    REMOVE = {};

			    VisitorOption = {
			        Break: BREAK,
			        Skip: SKIP,
			        Remove: REMOVE
			    };

			    function Reference(parent, key) {
			        this.parent = parent;
			        this.key = key;
			    }

			    Reference.prototype.replace = function replace(node) {
			        this.parent[this.key] = node;
			    };

			    Reference.prototype.remove = function remove() {
			        if (Array.isArray(this.parent)) {
			            this.parent.splice(this.key, 1);
			            return true;
			        } else {
			            this.replace(null);
			            return false;
			        }
			    };

			    function Element(node, path, wrap, ref) {
			        this.node = node;
			        this.path = path;
			        this.wrap = wrap;
			        this.ref = ref;
			    }

			    function Controller() { }

			    // API:
			    // return property path array from root to current node
			    Controller.prototype.path = function path() {
			        var i, iz, j, jz, result, element;

			        function addToPath(result, path) {
			            if (Array.isArray(path)) {
			                for (j = 0, jz = path.length; j < jz; ++j) {
			                    result.push(path[j]);
			                }
			            } else {
			                result.push(path);
			            }
			        }

			        // root node
			        if (!this.__current.path) {
			            return null;
			        }

			        // first node is sentinel, second node is root element
			        result = [];
			        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
			            element = this.__leavelist[i];
			            addToPath(result, element.path);
			        }
			        addToPath(result, this.__current.path);
			        return result;
			    };

			    // API:
			    // return type of current node
			    Controller.prototype.type = function () {
			        var node = this.current();
			        return node.type || this.__current.wrap;
			    };

			    // API:
			    // return array of parent elements
			    Controller.prototype.parents = function parents() {
			        var i, iz, result;

			        // first node is sentinel
			        result = [];
			        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
			            result.push(this.__leavelist[i].node);
			        }

			        return result;
			    };

			    // API:
			    // return current node
			    Controller.prototype.current = function current() {
			        return this.__current.node;
			    };

			    Controller.prototype.__execute = function __execute(callback, element) {
			        var previous, result;

			        result = undefined;

			        previous  = this.__current;
			        this.__current = element;
			        this.__state = null;
			        if (callback) {
			            result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
			        }
			        this.__current = previous;

			        return result;
			    };

			    // API:
			    // notify control skip / break
			    Controller.prototype.notify = function notify(flag) {
			        this.__state = flag;
			    };

			    // API:
			    // skip child nodes of current node
			    Controller.prototype.skip = function () {
			        this.notify(SKIP);
			    };

			    // API:
			    // break traversals
			    Controller.prototype['break'] = function () {
			        this.notify(BREAK);
			    };

			    // API:
			    // remove node
			    Controller.prototype.remove = function () {
			        this.notify(REMOVE);
			    };

			    Controller.prototype.__initialize = function(root, visitor) {
			        this.visitor = visitor;
			        this.root = root;
			        this.__worklist = [];
			        this.__leavelist = [];
			        this.__current = null;
			        this.__state = null;
			        this.__fallback = null;
			        if (visitor.fallback === 'iteration') {
			            this.__fallback = Object.keys;
			        } else if (typeof visitor.fallback === 'function') {
			            this.__fallback = visitor.fallback;
			        }

			        this.__keys = VisitorKeys;
			        if (visitor.keys) {
			            this.__keys = Object.assign(Object.create(this.__keys), visitor.keys);
			        }
			    };

			    function isNode(node) {
			        if (node == null) {
			            return false;
			        }
			        return typeof node === 'object' && typeof node.type === 'string';
			    }

			    function isProperty(nodeType, key) {
			        return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === key;
			    }
			  
			    function candidateExistsInLeaveList(leavelist, candidate) {
			        for (var i = leavelist.length - 1; i >= 0; --i) {
			            if (leavelist[i].node === candidate) {
			                return true;
			            }
			        }
			        return false;
			    }

			    Controller.prototype.traverse = function traverse(root, visitor) {
			        var worklist,
			            leavelist,
			            element,
			            node,
			            nodeType,
			            ret,
			            key,
			            current,
			            current2,
			            candidates,
			            candidate,
			            sentinel;

			        this.__initialize(root, visitor);

			        sentinel = {};

			        // reference
			        worklist = this.__worklist;
			        leavelist = this.__leavelist;

			        // initialize
			        worklist.push(new Element(root, null, null, null));
			        leavelist.push(new Element(null, null, null, null));

			        while (worklist.length) {
			            element = worklist.pop();

			            if (element === sentinel) {
			                element = leavelist.pop();

			                ret = this.__execute(visitor.leave, element);

			                if (this.__state === BREAK || ret === BREAK) {
			                    return;
			                }
			                continue;
			            }

			            if (element.node) {

			                ret = this.__execute(visitor.enter, element);

			                if (this.__state === BREAK || ret === BREAK) {
			                    return;
			                }

			                worklist.push(sentinel);
			                leavelist.push(element);

			                if (this.__state === SKIP || ret === SKIP) {
			                    continue;
			                }

			                node = element.node;
			                nodeType = node.type || element.wrap;
			                candidates = this.__keys[nodeType];
			                if (!candidates) {
			                    if (this.__fallback) {
			                        candidates = this.__fallback(node);
			                    } else {
			                        throw new Error('Unknown node type ' + nodeType + '.');
			                    }
			                }

			                current = candidates.length;
			                while ((current -= 1) >= 0) {
			                    key = candidates[current];
			                    candidate = node[key];
			                    if (!candidate) {
			                        continue;
			                    }

			                    if (Array.isArray(candidate)) {
			                        current2 = candidate.length;
			                        while ((current2 -= 1) >= 0) {
			                            if (!candidate[current2]) {
			                                continue;
			                            }

			                            if (candidateExistsInLeaveList(leavelist, candidate[current2])) {
			                              continue;
			                            }

			                            if (isProperty(nodeType, candidates[current])) {
			                                element = new Element(candidate[current2], [key, current2], 'Property', null);
			                            } else if (isNode(candidate[current2])) {
			                                element = new Element(candidate[current2], [key, current2], null, null);
			                            } else {
			                                continue;
			                            }
			                            worklist.push(element);
			                        }
			                    } else if (isNode(candidate)) {
			                        if (candidateExistsInLeaveList(leavelist, candidate)) {
			                          continue;
			                        }

			                        worklist.push(new Element(candidate, key, null, null));
			                    }
			                }
			            }
			        }
			    };

			    Controller.prototype.replace = function replace(root, visitor) {
			        var worklist,
			            leavelist,
			            node,
			            nodeType,
			            target,
			            element,
			            current,
			            current2,
			            candidates,
			            candidate,
			            sentinel,
			            outer,
			            key;

			        function removeElem(element) {
			            var i,
			                key,
			                nextElem,
			                parent;

			            if (element.ref.remove()) {
			                // When the reference is an element of an array.
			                key = element.ref.key;
			                parent = element.ref.parent;

			                // If removed from array, then decrease following items' keys.
			                i = worklist.length;
			                while (i--) {
			                    nextElem = worklist[i];
			                    if (nextElem.ref && nextElem.ref.parent === parent) {
			                        if  (nextElem.ref.key < key) {
			                            break;
			                        }
			                        --nextElem.ref.key;
			                    }
			                }
			            }
			        }

			        this.__initialize(root, visitor);

			        sentinel = {};

			        // reference
			        worklist = this.__worklist;
			        leavelist = this.__leavelist;

			        // initialize
			        outer = {
			            root: root
			        };
			        element = new Element(root, null, null, new Reference(outer, 'root'));
			        worklist.push(element);
			        leavelist.push(element);

			        while (worklist.length) {
			            element = worklist.pop();

			            if (element === sentinel) {
			                element = leavelist.pop();

			                target = this.__execute(visitor.leave, element);

			                // node may be replaced with null,
			                // so distinguish between undefined and null in this place
			                if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
			                    // replace
			                    element.ref.replace(target);
			                }

			                if (this.__state === REMOVE || target === REMOVE) {
			                    removeElem(element);
			                }

			                if (this.__state === BREAK || target === BREAK) {
			                    return outer.root;
			                }
			                continue;
			            }

			            target = this.__execute(visitor.enter, element);

			            // node may be replaced with null,
			            // so distinguish between undefined and null in this place
			            if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
			                // replace
			                element.ref.replace(target);
			                element.node = target;
			            }

			            if (this.__state === REMOVE || target === REMOVE) {
			                removeElem(element);
			                element.node = null;
			            }

			            if (this.__state === BREAK || target === BREAK) {
			                return outer.root;
			            }

			            // node may be null
			            node = element.node;
			            if (!node) {
			                continue;
			            }

			            worklist.push(sentinel);
			            leavelist.push(element);

			            if (this.__state === SKIP || target === SKIP) {
			                continue;
			            }

			            nodeType = node.type || element.wrap;
			            candidates = this.__keys[nodeType];
			            if (!candidates) {
			                if (this.__fallback) {
			                    candidates = this.__fallback(node);
			                } else {
			                    throw new Error('Unknown node type ' + nodeType + '.');
			                }
			            }

			            current = candidates.length;
			            while ((current -= 1) >= 0) {
			                key = candidates[current];
			                candidate = node[key];
			                if (!candidate) {
			                    continue;
			                }

			                if (Array.isArray(candidate)) {
			                    current2 = candidate.length;
			                    while ((current2 -= 1) >= 0) {
			                        if (!candidate[current2]) {
			                            continue;
			                        }
			                        if (isProperty(nodeType, candidates[current])) {
			                            element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
			                        } else if (isNode(candidate[current2])) {
			                            element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
			                        } else {
			                            continue;
			                        }
			                        worklist.push(element);
			                    }
			                } else if (isNode(candidate)) {
			                    worklist.push(new Element(candidate, key, null, new Reference(node, key)));
			                }
			            }
			        }

			        return outer.root;
			    };

			    function traverse(root, visitor) {
			        var controller = new Controller();
			        return controller.traverse(root, visitor);
			    }

			    function replace(root, visitor) {
			        var controller = new Controller();
			        return controller.replace(root, visitor);
			    }

			    function extendCommentRange(comment, tokens) {
			        var target;

			        target = upperBound(tokens, function search(token) {
			            return token.range[0] > comment.range[0];
			        });

			        comment.extendedRange = [comment.range[0], comment.range[1]];

			        if (target !== tokens.length) {
			            comment.extendedRange[1] = tokens[target].range[0];
			        }

			        target -= 1;
			        if (target >= 0) {
			            comment.extendedRange[0] = tokens[target].range[1];
			        }

			        return comment;
			    }

			    function attachComments(tree, providedComments, tokens) {
			        // At first, we should calculate extended comment ranges.
			        var comments = [], comment, len, i, cursor;

			        if (!tree.range) {
			            throw new Error('attachComments needs range information');
			        }

			        // tokens array is empty, we attach comments to tree as 'leadingComments'
			        if (!tokens.length) {
			            if (providedComments.length) {
			                for (i = 0, len = providedComments.length; i < len; i += 1) {
			                    comment = deepCopy(providedComments[i]);
			                    comment.extendedRange = [0, tree.range[0]];
			                    comments.push(comment);
			                }
			                tree.leadingComments = comments;
			            }
			            return tree;
			        }

			        for (i = 0, len = providedComments.length; i < len; i += 1) {
			            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
			        }

			        // This is based on John Freeman's implementation.
			        cursor = 0;
			        traverse(tree, {
			            enter: function (node) {
			                var comment;

			                while (cursor < comments.length) {
			                    comment = comments[cursor];
			                    if (comment.extendedRange[1] > node.range[0]) {
			                        break;
			                    }

			                    if (comment.extendedRange[1] === node.range[0]) {
			                        if (!node.leadingComments) {
			                            node.leadingComments = [];
			                        }
			                        node.leadingComments.push(comment);
			                        comments.splice(cursor, 1);
			                    } else {
			                        cursor += 1;
			                    }
			                }

			                // already out of owned node
			                if (cursor === comments.length) {
			                    return VisitorOption.Break;
			                }

			                if (comments[cursor].extendedRange[0] > node.range[1]) {
			                    return VisitorOption.Skip;
			                }
			            }
			        });

			        cursor = 0;
			        traverse(tree, {
			            leave: function (node) {
			                var comment;

			                while (cursor < comments.length) {
			                    comment = comments[cursor];
			                    if (node.range[1] < comment.extendedRange[0]) {
			                        break;
			                    }

			                    if (node.range[1] === comment.extendedRange[0]) {
			                        if (!node.trailingComments) {
			                            node.trailingComments = [];
			                        }
			                        node.trailingComments.push(comment);
			                        comments.splice(cursor, 1);
			                    } else {
			                        cursor += 1;
			                    }
			                }

			                // already out of owned node
			                if (cursor === comments.length) {
			                    return VisitorOption.Break;
			                }

			                if (comments[cursor].extendedRange[0] > node.range[1]) {
			                    return VisitorOption.Skip;
			                }
			            }
			        });

			        return tree;
			    }

			    exports$1.Syntax = Syntax;
			    exports$1.traverse = traverse;
			    exports$1.replace = replace;
			    exports$1.attachComments = attachComments;
			    exports$1.VisitorKeys = VisitorKeys;
			    exports$1.VisitorOption = VisitorOption;
			    exports$1.Controller = Controller;
			    exports$1.cloneEnvironment = function () { return clone({}); };

			    return exports$1;
			}(exports$1));
			/* vim: set sw=4 ts=4 et tw=80 : */ 
		} (estraverse));
		return estraverse;
	}

	var version$1 = "4.3.0";
	var require$$1 = {
		version: version$1};

	/*
	  Copyright (C) 2014 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	var hasRequiredEsrecurse;

	function requireEsrecurse () {
		if (hasRequiredEsrecurse) return esrecurse;
		hasRequiredEsrecurse = 1;
		(function () {

		    var estraverse = requireEstraverse();

		    function isNode(node) {
		        if (node == null) {
		            return false;
		        }
		        return typeof node === 'object' && typeof node.type === 'string';
		    }

		    function isProperty(nodeType, key) {
		        return (nodeType === estraverse.Syntax.ObjectExpression || nodeType === estraverse.Syntax.ObjectPattern) && key === 'properties';
		    }

		    function Visitor(visitor, options) {
		        options = options || {};

		        this.__visitor = visitor ||  this;
		        this.__childVisitorKeys = options.childVisitorKeys
		            ? Object.assign({}, estraverse.VisitorKeys, options.childVisitorKeys)
		            : estraverse.VisitorKeys;
		        if (options.fallback === 'iteration') {
		            this.__fallback = Object.keys;
		        } else if (typeof options.fallback === 'function') {
		            this.__fallback = options.fallback;
		        }
		    }

		    /* Default method for visiting children.
		     * When you need to call default visiting operation inside custom visiting
		     * operation, you can use it with `this.visitChildren(node)`.
		     */
		    Visitor.prototype.visitChildren = function (node) {
		        var type, children, i, iz, j, jz, child;

		        if (node == null) {
		            return;
		        }

		        type = node.type || estraverse.Syntax.Property;

		        children = this.__childVisitorKeys[type];
		        if (!children) {
		            if (this.__fallback) {
		                children = this.__fallback(node);
		            } else {
		                throw new Error('Unknown node type ' + type + '.');
		            }
		        }

		        for (i = 0, iz = children.length; i < iz; ++i) {
		            child = node[children[i]];
		            if (child) {
		                if (Array.isArray(child)) {
		                    for (j = 0, jz = child.length; j < jz; ++j) {
		                        if (child[j]) {
		                            if (isNode(child[j]) || isProperty(type, children[i])) {
		                                this.visit(child[j]);
		                            }
		                        }
		                    }
		                } else if (isNode(child)) {
		                    this.visit(child);
		                }
		            }
		        }
		    };

		    /* Dispatching node. */
		    Visitor.prototype.visit = function (node) {
		        var type;

		        if (node == null) {
		            return;
		        }

		        type = node.type || estraverse.Syntax.Property;
		        if (this.__visitor[type]) {
		            this.__visitor[type].call(this, node);
		            return;
		        }
		        this.visitChildren(node);
		    };

		    esrecurse.version = require$$1.version;
		    esrecurse.Visitor = Visitor;
		    esrecurse.visit = function (node, visitor, options) {
		        var v = new Visitor(visitor, options);
		        v.visit(node);
		    };
		}());
		/* vim: set sw=4 ts=4 et tw=80 : */
		return esrecurse;
	}

	var patternVisitor = {};

	var hasRequiredPatternVisitor;

	function requirePatternVisitor () {
		if (hasRequiredPatternVisitor) return patternVisitor;
		hasRequiredPatternVisitor = 1;

		Object.defineProperty(patternVisitor, "__esModule", {
		    value: true
		});

		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

		var _estraverse = requireEstraverse$1();

		var _esrecurse = requireEsrecurse();

		var _esrecurse2 = _interopRequireDefault(_esrecurse);

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 Redistribution and use in source and binary forms, with or without
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 modification, are permitted provided that the following conditions are met:
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Redistributions of source code must retain the above copyright
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     notice, this list of conditions and the following disclaimer.
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Redistributions in binary form must reproduce the above copyright
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     notice, this list of conditions and the following disclaimer in the
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     documentation and/or other materials provided with the distribution.
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

		function getLast(xs) {
		    return xs[xs.length - 1] || null;
		}

		var PatternVisitor = function (_esrecurse$Visitor) {
		    _inherits(PatternVisitor, _esrecurse$Visitor);

		    _createClass(PatternVisitor, null, [{
		        key: 'isPattern',
		        value: function isPattern(node) {
		            var nodeType = node.type;
		            return nodeType === _estraverse.Syntax.Identifier || nodeType === _estraverse.Syntax.ObjectPattern || nodeType === _estraverse.Syntax.ArrayPattern || nodeType === _estraverse.Syntax.SpreadElement || nodeType === _estraverse.Syntax.RestElement || nodeType === _estraverse.Syntax.AssignmentPattern;
		        }
		    }]);

		    function PatternVisitor(options, rootPattern, callback) {
		        _classCallCheck(this, PatternVisitor);

		        var _this = _possibleConstructorReturn(this, (PatternVisitor.__proto__ || Object.getPrototypeOf(PatternVisitor)).call(this, null, options));

		        _this.rootPattern = rootPattern;
		        _this.callback = callback;
		        _this.assignments = [];
		        _this.rightHandNodes = [];
		        _this.restElements = [];
		        return _this;
		    }

		    _createClass(PatternVisitor, [{
		        key: 'Identifier',
		        value: function Identifier(pattern) {
		            var lastRestElement = getLast(this.restElements);
		            this.callback(pattern, {
		                topLevel: pattern === this.rootPattern,
		                rest: lastRestElement != null && lastRestElement.argument === pattern,
		                assignments: this.assignments
		            });
		        }
		    }, {
		        key: 'Property',
		        value: function Property(property) {
		            // Computed property's key is a right hand node.
		            if (property.computed) {
		                this.rightHandNodes.push(property.key);
		            }

		            // If it's shorthand, its key is same as its value.
		            // If it's shorthand and has its default value, its key is same as its value.left (the value is AssignmentPattern).
		            // If it's not shorthand, the name of new variable is its value's.
		            this.visit(property.value);
		        }
		    }, {
		        key: 'ArrayPattern',
		        value: function ArrayPattern(pattern) {
		            var i, iz, element;
		            for (i = 0, iz = pattern.elements.length; i < iz; ++i) {
		                element = pattern.elements[i];
		                this.visit(element);
		            }
		        }
		    }, {
		        key: 'AssignmentPattern',
		        value: function AssignmentPattern(pattern) {
		            this.assignments.push(pattern);
		            this.visit(pattern.left);
		            this.rightHandNodes.push(pattern.right);
		            this.assignments.pop();
		        }
		    }, {
		        key: 'RestElement',
		        value: function RestElement(pattern) {
		            this.restElements.push(pattern);
		            this.visit(pattern.argument);
		            this.restElements.pop();
		        }
		    }, {
		        key: 'MemberExpression',
		        value: function MemberExpression(node) {
		            // Computed property's key is a right hand node.
		            if (node.computed) {
		                this.rightHandNodes.push(node.property);
		            }
		            // the object is only read, write to its property.
		            this.rightHandNodes.push(node.object);
		        }

		        //
		        // ForInStatement.left and AssignmentExpression.left are LeftHandSideExpression.
		        // By spec, LeftHandSideExpression is Pattern or MemberExpression.
		        //   (see also: https://github.com/estree/estree/pull/20#issuecomment-74584758)
		        // But espree 2.0 and esprima 2.0 parse to ArrayExpression, ObjectExpression, etc...
		        //

		    }, {
		        key: 'SpreadElement',
		        value: function SpreadElement(node) {
		            this.visit(node.argument);
		        }
		    }, {
		        key: 'ArrayExpression',
		        value: function ArrayExpression(node) {
		            node.elements.forEach(this.visit, this);
		        }
		    }, {
		        key: 'AssignmentExpression',
		        value: function AssignmentExpression(node) {
		            this.assignments.push(node);
		            this.visit(node.left);
		            this.rightHandNodes.push(node.right);
		            this.assignments.pop();
		        }
		    }, {
		        key: 'CallExpression',
		        value: function CallExpression(node) {
		            var _this2 = this;

		            // arguments are right hand nodes.
		            node.arguments.forEach(function (a) {
		                _this2.rightHandNodes.push(a);
		            });
		            this.visit(node.callee);
		        }
		    }]);

		    return PatternVisitor;
		}(_esrecurse2.default.Visitor);

		/* vim: set sw=4 ts=4 et tw=80 : */


		patternVisitor.default = PatternVisitor;
		
		return patternVisitor;
	}

	var hasRequiredReferencer;

	function requireReferencer () {
		if (hasRequiredReferencer) return referencer;
		hasRequiredReferencer = 1;

		Object.defineProperty(referencer, "__esModule", {
		    value: true
		});

		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

		var _estraverse = requireEstraverse$1();

		var _esrecurse = requireEsrecurse();

		var _esrecurse2 = _interopRequireDefault(_esrecurse);

		var _reference = requireReference();

		var _reference2 = _interopRequireDefault(_reference);

		var _variable = requireVariable();

		var _variable2 = _interopRequireDefault(_variable);

		var _patternVisitor = requirePatternVisitor();

		var _patternVisitor2 = _interopRequireDefault(_patternVisitor);

		var _definition = requireDefinition();

		var _assert = require$$0$1;

		var _assert2 = _interopRequireDefault(_assert);

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

		function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 Redistribution and use in source and binary forms, with or without
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 modification, are permitted provided that the following conditions are met:
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Redistributions of source code must retain the above copyright
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     notice, this list of conditions and the following disclaimer.
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Redistributions in binary form must reproduce the above copyright
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     notice, this list of conditions and the following disclaimer in the
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     documentation and/or other materials provided with the distribution.
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */


		function traverseIdentifierInPattern(options, rootPattern, referencer, callback) {
		    // Call the callback at left hand identifier nodes, and Collect right hand nodes.
		    var visitor = new _patternVisitor2.default(options, rootPattern, callback);
		    visitor.visit(rootPattern);

		    // Process the right hand nodes recursively.
		    if (referencer != null) {
		        visitor.rightHandNodes.forEach(referencer.visit, referencer);
		    }
		}

		// Importing ImportDeclaration.
		// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-moduledeclarationinstantiation
		// https://github.com/estree/estree/blob/master/es6.md#importdeclaration
		// FIXME: Now, we don't create module environment, because the context is
		// implementation dependent.

		var Importer = function (_esrecurse$Visitor) {
		    _inherits(Importer, _esrecurse$Visitor);

		    function Importer(declaration, referencer) {
		        _classCallCheck(this, Importer);

		        var _this = _possibleConstructorReturn(this, (Importer.__proto__ || Object.getPrototypeOf(Importer)).call(this, null, referencer.options));

		        _this.declaration = declaration;
		        _this.referencer = referencer;
		        return _this;
		    }

		    _createClass(Importer, [{
		        key: 'visitImport',
		        value: function visitImport(id, specifier) {
		            var _this2 = this;

		            this.referencer.visitPattern(id, function (pattern) {
		                _this2.referencer.currentScope().__define(pattern, new _definition.Definition(_variable2.default.ImportBinding, pattern, specifier, _this2.declaration, null, null));
		            });
		        }
		    }, {
		        key: 'ImportNamespaceSpecifier',
		        value: function ImportNamespaceSpecifier(node) {
		            var local = node.local || node.id;
		            if (local) {
		                this.visitImport(local, node);
		            }
		        }
		    }, {
		        key: 'ImportDefaultSpecifier',
		        value: function ImportDefaultSpecifier(node) {
		            var local = node.local || node.id;
		            this.visitImport(local, node);
		        }
		    }, {
		        key: 'ImportSpecifier',
		        value: function ImportSpecifier(node) {
		            var local = node.local || node.id;
		            if (node.name) {
		                this.visitImport(node.name, node);
		            } else {
		                this.visitImport(local, node);
		            }
		        }
		    }]);

		    return Importer;
		}(_esrecurse2.default.Visitor);

		// Referencing variables and creating bindings.


		var Referencer = function (_esrecurse$Visitor2) {
		    _inherits(Referencer, _esrecurse$Visitor2);

		    function Referencer(options, scopeManager) {
		        _classCallCheck(this, Referencer);

		        var _this3 = _possibleConstructorReturn(this, (Referencer.__proto__ || Object.getPrototypeOf(Referencer)).call(this, null, options));

		        _this3.options = options;
		        _this3.scopeManager = scopeManager;
		        _this3.parent = null;
		        _this3.isInnerMethodDefinition = false;
		        return _this3;
		    }

		    _createClass(Referencer, [{
		        key: 'currentScope',
		        value: function currentScope() {
		            return this.scopeManager.__currentScope;
		        }
		    }, {
		        key: 'close',
		        value: function close(node) {
		            while (this.currentScope() && node === this.currentScope().block) {
		                this.scopeManager.__currentScope = this.currentScope().__close(this.scopeManager);
		            }
		        }
		    }, {
		        key: 'pushInnerMethodDefinition',
		        value: function pushInnerMethodDefinition(isInnerMethodDefinition) {
		            var previous = this.isInnerMethodDefinition;
		            this.isInnerMethodDefinition = isInnerMethodDefinition;
		            return previous;
		        }
		    }, {
		        key: 'popInnerMethodDefinition',
		        value: function popInnerMethodDefinition(isInnerMethodDefinition) {
		            this.isInnerMethodDefinition = isInnerMethodDefinition;
		        }
		    }, {
		        key: 'materializeTDZScope',
		        value: function materializeTDZScope(node, iterationNode) {
		            // http://people.mozilla.org/~jorendorff/es6-draft.html#sec-runtime-semantics-forin-div-ofexpressionevaluation-abstract-operation
		            // TDZ scope hides the declaration's names.
		            this.scopeManager.__nestTDZScope(node, iterationNode);
		            this.visitVariableDeclaration(this.currentScope(), _variable2.default.TDZ, iterationNode.left, 0, true);
		        }
		    }, {
		        key: 'materializeIterationScope',
		        value: function materializeIterationScope(node) {
		            var _this4 = this;

		            // Generate iteration scope for upper ForIn/ForOf Statements.
		            var letOrConstDecl;
		            this.scopeManager.__nestForScope(node);
		            letOrConstDecl = node.left;
		            this.visitVariableDeclaration(this.currentScope(), _variable2.default.Variable, letOrConstDecl, 0);
		            this.visitPattern(letOrConstDecl.declarations[0].id, function (pattern) {
		                _this4.currentScope().__referencing(pattern, _reference2.default.WRITE, node.right, null, true, true);
		            });
		        }
		    }, {
		        key: 'referencingDefaultValue',
		        value: function referencingDefaultValue(pattern, assignments, maybeImplicitGlobal, init) {
		            var scope = this.currentScope();
		            assignments.forEach(function (assignment) {
		                scope.__referencing(pattern, _reference2.default.WRITE, assignment.right, maybeImplicitGlobal, pattern !== assignment.left, init);
		            });
		        }
		    }, {
		        key: 'visitPattern',
		        value: function visitPattern(node, options, callback) {
		            if (typeof options === 'function') {
		                callback = options;
		                options = { processRightHandNodes: false };
		            }
		            traverseIdentifierInPattern(this.options, node, options.processRightHandNodes ? this : null, callback);
		        }
		    }, {
		        key: 'visitFunction',
		        value: function visitFunction(node) {
		            var _this5 = this;

		            var i, iz;
		            // FunctionDeclaration name is defined in upper scope
		            // NOTE: Not referring variableScope. It is intended.
		            // Since
		            //  in ES5, FunctionDeclaration should be in FunctionBody.
		            //  in ES6, FunctionDeclaration should be block scoped.
		            if (node.type === _estraverse.Syntax.FunctionDeclaration) {
		                // id is defined in upper scope
		                this.currentScope().__define(node.id, new _definition.Definition(_variable2.default.FunctionName, node.id, node, null, null, null));
		            }

		            // FunctionExpression with name creates its special scope;
		            // FunctionExpressionNameScope.
		            if (node.type === _estraverse.Syntax.FunctionExpression && node.id) {
		                this.scopeManager.__nestFunctionExpressionNameScope(node);
		            }

		            // Consider this function is in the MethodDefinition.
		            this.scopeManager.__nestFunctionScope(node, this.isInnerMethodDefinition);

		            // Process parameter declarations.
		            for (i = 0, iz = node.params.length; i < iz; ++i) {
		                this.visitPattern(node.params[i], { processRightHandNodes: true }, function (pattern, info) {
		                    _this5.currentScope().__define(pattern, new _definition.ParameterDefinition(pattern, node, i, info.rest));

		                    _this5.referencingDefaultValue(pattern, info.assignments, null, true);
		                });
		            }

		            // if there's a rest argument, add that
		            if (node.rest) {
		                this.visitPattern({
		                    type: 'RestElement',
		                    argument: node.rest
		                }, function (pattern) {
		                    _this5.currentScope().__define(pattern, new _definition.ParameterDefinition(pattern, node, node.params.length, true));
		                });
		            }

		            // Skip BlockStatement to prevent creating BlockStatement scope.
		            if (node.body.type === _estraverse.Syntax.BlockStatement) {
		                this.visitChildren(node.body);
		            } else {
		                this.visit(node.body);
		            }

		            this.close(node);
		        }
		    }, {
		        key: 'visitClass',
		        value: function visitClass(node) {
		            if (node.type === _estraverse.Syntax.ClassDeclaration) {
		                this.currentScope().__define(node.id, new _definition.Definition(_variable2.default.ClassName, node.id, node, null, null, null));
		            }

		            // FIXME: Maybe consider TDZ.
		            this.visit(node.superClass);

		            this.scopeManager.__nestClassScope(node);

		            if (node.id) {
		                this.currentScope().__define(node.id, new _definition.Definition(_variable2.default.ClassName, node.id, node));
		            }
		            this.visit(node.body);

		            this.close(node);
		        }
		    }, {
		        key: 'visitProperty',
		        value: function visitProperty(node) {
		            var previous, isMethodDefinition;
		            if (node.computed) {
		                this.visit(node.key);
		            }

		            isMethodDefinition = node.type === _estraverse.Syntax.MethodDefinition;
		            if (isMethodDefinition) {
		                previous = this.pushInnerMethodDefinition(true);
		            }
		            this.visit(node.value);
		            if (isMethodDefinition) {
		                this.popInnerMethodDefinition(previous);
		            }
		        }
		    }, {
		        key: 'visitForIn',
		        value: function visitForIn(node) {
		            var _this6 = this;

		            if (node.left.type === _estraverse.Syntax.VariableDeclaration && node.left.kind !== 'var') {
		                this.materializeTDZScope(node.right, node);
		                this.visit(node.right);
		                this.close(node.right);

		                this.materializeIterationScope(node);
		                this.visit(node.body);
		                this.close(node);
		            } else {
		                if (node.left.type === _estraverse.Syntax.VariableDeclaration) {
		                    this.visit(node.left);
		                    this.visitPattern(node.left.declarations[0].id, function (pattern) {
		                        _this6.currentScope().__referencing(pattern, _reference2.default.WRITE, node.right, null, true, true);
		                    });
		                } else {
		                    this.visitPattern(node.left, { processRightHandNodes: true }, function (pattern, info) {
		                        var maybeImplicitGlobal = null;
		                        if (!_this6.currentScope().isStrict) {
		                            maybeImplicitGlobal = {
		                                pattern: pattern,
		                                node: node
		                            };
		                        }
		                        _this6.referencingDefaultValue(pattern, info.assignments, maybeImplicitGlobal, false);
		                        _this6.currentScope().__referencing(pattern, _reference2.default.WRITE, node.right, maybeImplicitGlobal, true, false);
		                    });
		                }
		                this.visit(node.right);
		                this.visit(node.body);
		            }
		        }
		    }, {
		        key: 'visitVariableDeclaration',
		        value: function visitVariableDeclaration(variableTargetScope, type, node, index, fromTDZ) {
		            var _this7 = this;

		            // If this was called to initialize a TDZ scope, this needs to make definitions, but doesn't make references.
		            var decl, init;

		            decl = node.declarations[index];
		            init = decl.init;
		            this.visitPattern(decl.id, { processRightHandNodes: !fromTDZ }, function (pattern, info) {
		                variableTargetScope.__define(pattern, new _definition.Definition(type, pattern, decl, node, index, node.kind));

		                if (!fromTDZ) {
		                    _this7.referencingDefaultValue(pattern, info.assignments, null, true);
		                }
		                if (init) {
		                    _this7.currentScope().__referencing(pattern, _reference2.default.WRITE, init, null, !info.topLevel, true);
		                }
		            });
		        }
		    }, {
		        key: 'AssignmentExpression',
		        value: function AssignmentExpression(node) {
		            var _this8 = this;

		            if (_patternVisitor2.default.isPattern(node.left)) {
		                if (node.operator === '=') {
		                    this.visitPattern(node.left, { processRightHandNodes: true }, function (pattern, info) {
		                        var maybeImplicitGlobal = null;
		                        if (!_this8.currentScope().isStrict) {
		                            maybeImplicitGlobal = {
		                                pattern: pattern,
		                                node: node
		                            };
		                        }
		                        _this8.referencingDefaultValue(pattern, info.assignments, maybeImplicitGlobal, false);
		                        _this8.currentScope().__referencing(pattern, _reference2.default.WRITE, node.right, maybeImplicitGlobal, !info.topLevel, false);
		                    });
		                } else {
		                    this.currentScope().__referencing(node.left, _reference2.default.RW, node.right);
		                }
		            } else {
		                this.visit(node.left);
		            }
		            this.visit(node.right);
		        }
		    }, {
		        key: 'CatchClause',
		        value: function CatchClause(node) {
		            var _this9 = this;

		            this.scopeManager.__nestCatchScope(node);

		            this.visitPattern(node.param, { processRightHandNodes: true }, function (pattern, info) {
		                _this9.currentScope().__define(pattern, new _definition.Definition(_variable2.default.CatchClause, node.param, node, null, null, null));
		                _this9.referencingDefaultValue(pattern, info.assignments, null, true);
		            });
		            this.visit(node.body);

		            this.close(node);
		        }
		    }, {
		        key: 'Program',
		        value: function Program(node) {
		            this.scopeManager.__nestGlobalScope(node);

		            if (this.scopeManager.__isNodejsScope()) {
		                // Force strictness of GlobalScope to false when using node.js scope.
		                this.currentScope().isStrict = false;
		                this.scopeManager.__nestFunctionScope(node, false);
		            }

		            if (this.scopeManager.__isES6() && this.scopeManager.isModule()) {
		                this.scopeManager.__nestModuleScope(node);
		            }

		            if (this.scopeManager.isStrictModeSupported() && this.scopeManager.isImpliedStrict()) {
		                this.currentScope().isStrict = true;
		            }

		            this.visitChildren(node);
		            this.close(node);
		        }
		    }, {
		        key: 'Identifier',
		        value: function Identifier(node) {
		            this.currentScope().__referencing(node);
		        }
		    }, {
		        key: 'UpdateExpression',
		        value: function UpdateExpression(node) {
		            if (_patternVisitor2.default.isPattern(node.argument)) {
		                this.currentScope().__referencing(node.argument, _reference2.default.RW, null);
		            } else {
		                this.visitChildren(node);
		            }
		        }
		    }, {
		        key: 'MemberExpression',
		        value: function MemberExpression(node) {
		            this.visit(node.object);
		            if (node.computed) {
		                this.visit(node.property);
		            }
		        }
		    }, {
		        key: 'Property',
		        value: function Property(node) {
		            this.visitProperty(node);
		        }
		    }, {
		        key: 'MethodDefinition',
		        value: function MethodDefinition(node) {
		            this.visitProperty(node);
		        }
		    }, {
		        key: 'BreakStatement',
		        value: function BreakStatement() {}
		    }, {
		        key: 'ContinueStatement',
		        value: function ContinueStatement() {}
		    }, {
		        key: 'LabeledStatement',
		        value: function LabeledStatement(node) {
		            this.visit(node.body);
		        }
		    }, {
		        key: 'ForStatement',
		        value: function ForStatement(node) {
		            // Create ForStatement declaration.
		            // NOTE: In ES6, ForStatement dynamically generates
		            // per iteration environment. However, escope is
		            // a static analyzer, we only generate one scope for ForStatement.
		            if (node.init && node.init.type === _estraverse.Syntax.VariableDeclaration && node.init.kind !== 'var') {
		                this.scopeManager.__nestForScope(node);
		            }

		            this.visitChildren(node);

		            this.close(node);
		        }
		    }, {
		        key: 'ClassExpression',
		        value: function ClassExpression(node) {
		            this.visitClass(node);
		        }
		    }, {
		        key: 'ClassDeclaration',
		        value: function ClassDeclaration(node) {
		            this.visitClass(node);
		        }
		    }, {
		        key: 'CallExpression',
		        value: function CallExpression(node) {
		            // Check this is direct call to eval
		            if (!this.scopeManager.__ignoreEval() && node.callee.type === _estraverse.Syntax.Identifier && node.callee.name === 'eval') {
		                // NOTE: This should be `variableScope`. Since direct eval call always creates Lexical environment and
		                // let / const should be enclosed into it. Only VariableDeclaration affects on the caller's environment.
		                this.currentScope().variableScope.__detectEval();
		            }
		            this.visitChildren(node);
		        }
		    }, {
		        key: 'BlockStatement',
		        value: function BlockStatement(node) {
		            if (this.scopeManager.__isES6()) {
		                this.scopeManager.__nestBlockScope(node);
		            }

		            this.visitChildren(node);

		            this.close(node);
		        }
		    }, {
		        key: 'ThisExpression',
		        value: function ThisExpression() {
		            this.currentScope().variableScope.__detectThis();
		        }
		    }, {
		        key: 'WithStatement',
		        value: function WithStatement(node) {
		            this.visit(node.object);
		            // Then nest scope for WithStatement.
		            this.scopeManager.__nestWithScope(node);

		            this.visit(node.body);

		            this.close(node);
		        }
		    }, {
		        key: 'VariableDeclaration',
		        value: function VariableDeclaration(node) {
		            var variableTargetScope, i, iz, decl;
		            variableTargetScope = node.kind === 'var' ? this.currentScope().variableScope : this.currentScope();
		            for (i = 0, iz = node.declarations.length; i < iz; ++i) {
		                decl = node.declarations[i];
		                this.visitVariableDeclaration(variableTargetScope, _variable2.default.Variable, node, i);
		                if (decl.init) {
		                    this.visit(decl.init);
		                }
		            }
		        }

		        // sec 13.11.8

		    }, {
		        key: 'SwitchStatement',
		        value: function SwitchStatement(node) {
		            var i, iz;

		            this.visit(node.discriminant);

		            if (this.scopeManager.__isES6()) {
		                this.scopeManager.__nestSwitchScope(node);
		            }

		            for (i = 0, iz = node.cases.length; i < iz; ++i) {
		                this.visit(node.cases[i]);
		            }

		            this.close(node);
		        }
		    }, {
		        key: 'FunctionDeclaration',
		        value: function FunctionDeclaration(node) {
		            this.visitFunction(node);
		        }
		    }, {
		        key: 'FunctionExpression',
		        value: function FunctionExpression(node) {
		            this.visitFunction(node);
		        }
		    }, {
		        key: 'ForOfStatement',
		        value: function ForOfStatement(node) {
		            this.visitForIn(node);
		        }
		    }, {
		        key: 'ForInStatement',
		        value: function ForInStatement(node) {
		            this.visitForIn(node);
		        }
		    }, {
		        key: 'ArrowFunctionExpression',
		        value: function ArrowFunctionExpression(node) {
		            this.visitFunction(node);
		        }
		    }, {
		        key: 'ImportDeclaration',
		        value: function ImportDeclaration(node) {
		            var importer;

		            (0, _assert2.default)(this.scopeManager.__isES6() && this.scopeManager.isModule(), 'ImportDeclaration should appear when the mode is ES6 and in the module context.');

		            importer = new Importer(node, this);
		            importer.visit(node);
		        }
		    }, {
		        key: 'visitExportDeclaration',
		        value: function visitExportDeclaration(node) {
		            if (node.source) {
		                return;
		            }
		            if (node.declaration) {
		                this.visit(node.declaration);
		                return;
		            }

		            this.visitChildren(node);
		        }
		    }, {
		        key: 'ExportDeclaration',
		        value: function ExportDeclaration(node) {
		            this.visitExportDeclaration(node);
		        }
		    }, {
		        key: 'ExportNamedDeclaration',
		        value: function ExportNamedDeclaration(node) {
		            this.visitExportDeclaration(node);
		        }
		    }, {
		        key: 'ExportSpecifier',
		        value: function ExportSpecifier(node) {
		            var local = node.id || node.local;
		            this.visit(local);
		        }
		    }, {
		        key: 'MetaProperty',
		        value: function MetaProperty() {
		            // do nothing.
		        }
		    }]);

		    return Referencer;
		}(_esrecurse2.default.Visitor);

		/* vim: set sw=4 ts=4 et tw=80 : */


		referencer.default = Referencer;
		
		return referencer;
	}

	var version = "4.0.0";
	var require$$6 = {
		version: version};

	var hasRequiredLib;

	function requireLib () {
		if (hasRequiredLib) return lib;
		hasRequiredLib = 1;

		Object.defineProperty(lib, "__esModule", {
		    value: true
		});
		lib.ScopeManager = lib.Scope = lib.Variable = lib.Reference = lib.version = undefined;

		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
		                                                                                                                                                                                                                                                                                Copyright (C) 2012-2014 Yusuke Suzuki <utatane.tea@gmail.com>
		                                                                                                                                                                                                                                                                                Copyright (C) 2013 Alex Seville <hi@alexanderseville.com>
		                                                                                                                                                                                                                                                                                Copyright (C) 2014 Thiago de Arruda <tpadilha84@gmail.com>
		                                                                                                                                                                                                                                                                              
		                                                                                                                                                                                                                                                                                Redistribution and use in source and binary forms, with or without
		                                                                                                                                                                                                                                                                                modification, are permitted provided that the following conditions are met:
		                                                                                                                                                                                                                                                                              
		                                                                                                                                                                                                                                                                                  * Redistributions of source code must retain the above copyright
		                                                                                                                                                                                                                                                                                    notice, this list of conditions and the following disclaimer.
		                                                                                                                                                                                                                                                                                  * Redistributions in binary form must reproduce the above copyright
		                                                                                                                                                                                                                                                                                    notice, this list of conditions and the following disclaimer in the
		                                                                                                                                                                                                                                                                                    documentation and/or other materials provided with the distribution.
		                                                                                                                                                                                                                                                                              
		                                                                                                                                                                                                                                                                                THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
		                                                                                                                                                                                                                                                                                AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
		                                                                                                                                                                                                                                                                                IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
		                                                                                                                                                                                                                                                                                ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
		                                                                                                                                                                                                                                                                                DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
		                                                                                                                                                                                                                                                                                (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
		                                                                                                                                                                                                                                                                                LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
		                                                                                                                                                                                                                                                                                ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
		                                                                                                                                                                                                                                                                                (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
		                                                                                                                                                                                                                                                                                THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		                                                                                                                                                                                                                                                                              */

		/**
		 * Escope (<a href="http://github.com/estools/escope">escope</a>) is an <a
		 * href="http://www.ecma-international.org/publications/standards/Ecma-262.htm">ECMAScript</a>
		 * scope analyzer extracted from the <a
		 * href="http://github.com/estools/esmangle">esmangle project</a/>.
		 * <p>
		 * <em>escope</em> finds lexical scopes in a source program, i.e. areas of that
		 * program where different occurrences of the same identifier refer to the same
		 * variable. With each scope the contained variables are collected, and each
		 * identifier reference in code is linked to its corresponding variable (if
		 * possible).
		 * <p>
		 * <em>escope</em> works on a syntax tree of the parsed source code which has
		 * to adhere to the <a
		 * href="https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API">
		 * Mozilla Parser API</a>. E.g. <a href="http://esprima.org">esprima</a> is a parser
		 * that produces such syntax trees.
		 * <p>
		 * The main interface is the {@link analyze} function.
		 * @module escope
		 */

		/*jslint bitwise:true */

		lib.analyze = analyze;

		var _assert = require$$0$1;

		var _assert2 = _interopRequireDefault(_assert);

		var _scopeManager = requireScopeManager();

		var _scopeManager2 = _interopRequireDefault(_scopeManager);

		var _referencer = requireReferencer();

		var _referencer2 = _interopRequireDefault(_referencer);

		var _reference = requireReference();

		var _reference2 = _interopRequireDefault(_reference);

		var _variable = requireVariable();

		var _variable2 = _interopRequireDefault(_variable);

		var _scope = requireScope();

		var _scope2 = _interopRequireDefault(_scope);

		var _package = require$$6;

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		function defaultOptions() {
		    return {
		        optimistic: false,
		        directive: false,
		        nodejsScope: false,
		        impliedStrict: false,
		        sourceType: 'script', // one of ['script', 'module']
		        ecmaVersion: 5,
		        childVisitorKeys: null,
		        fallback: 'iteration'
		    };
		}

		function updateDeeply(target, override) {
		    var key, val;

		    function isHashObject(target) {
		        return (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target instanceof Object && !(target instanceof Array) && !(target instanceof RegExp);
		    }

		    for (key in override) {
		        if (override.hasOwnProperty(key)) {
		            val = override[key];
		            if (isHashObject(val)) {
		                if (isHashObject(target[key])) {
		                    updateDeeply(target[key], val);
		                } else {
		                    target[key] = updateDeeply({}, val);
		                }
		            } else {
		                target[key] = val;
		            }
		        }
		    }
		    return target;
		}

		/**
		 * Main interface function. Takes an Esprima syntax tree and returns the
		 * analyzed scopes.
		 * @function analyze
		 * @param {esprima.Tree} tree
		 * @param {Object} providedOptions - Options that tailor the scope analysis
		 * @param {boolean} [providedOptions.optimistic=false] - the optimistic flag
		 * @param {boolean} [providedOptions.directive=false]- the directive flag
		 * @param {boolean} [providedOptions.ignoreEval=false]- whether to check 'eval()' calls
		 * @param {boolean} [providedOptions.nodejsScope=false]- whether the whole
		 * script is executed under node.js environment. When enabled, escope adds
		 * a function scope immediately following the global scope.
		 * @param {boolean} [providedOptions.impliedStrict=false]- implied strict mode
		 * (if ecmaVersion >= 5).
		 * @param {string} [providedOptions.sourceType='script']- the source type of the script. one of 'script' and 'module'
		 * @param {number} [providedOptions.ecmaVersion=5]- which ECMAScript version is considered
		 * @param {Object} [providedOptions.childVisitorKeys=null] - Additional known visitor keys. See [esrecurse](https://github.com/estools/esrecurse)'s the `childVisitorKeys` option.
		 * @param {string} [providedOptions.fallback='iteration'] - A kind of the fallback in order to encounter with unknown node. See [esrecurse](https://github.com/estools/esrecurse)'s the `fallback` option.
		 * @return {ScopeManager}
		 */
		function analyze(tree, providedOptions) {
		    var scopeManager, referencer, options;

		    options = updateDeeply(defaultOptions(), providedOptions);

		    scopeManager = new _scopeManager2.default(options);

		    referencer = new _referencer2.default(options, scopeManager);
		    referencer.visit(tree);

		    (0, _assert2.default)(scopeManager.__currentScope === null, 'currentScope should be null.');

		    return scopeManager;
		}

		lib.version = _package.version;
		lib.Reference = _reference2.default;
		lib.Variable = _variable2.default;
		lib.Scope = _scope2.default;
		lib.ScopeManager = _scopeManager2.default;

		/* vim: set sw=4 ts=4 et tw=80 : */
		
		return lib;
	}

	var libExports = requireLib();
	var index = /*@__PURE__*/getDefaultExportFromCjs(libExports);

	var escope = /*#__PURE__*/_mergeNamespaces({
		__proto__: null,
		default: index
	}, [libExports]);

	return escope;

})();
