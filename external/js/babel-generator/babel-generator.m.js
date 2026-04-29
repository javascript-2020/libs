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

var lib$3 = {};

var sourceMap = {};

var genMapping_umd$1 = {exports: {}};

var global$1 = (typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */


var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

/*
 * Export kMaxLength after typed array support is determined.
 */
kMaxLength();

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) ;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -2147483648) {
    byteOffset = -2147483648;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -128);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


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

var sourcemapCodec_umd$1 = {exports: {}};

var sourcemapCodec_umd = sourcemapCodec_umd$1.exports;

var hasRequiredSourcemapCodec_umd;

function requireSourcemapCodec_umd () {
	if (hasRequiredSourcemapCodec_umd) return sourcemapCodec_umd$1.exports;
	hasRequiredSourcemapCodec_umd = 1;
	(function (module, exports$1) {
		(function (global, factory) {
		  {
		    factory(module);
		    module.exports = def(module);
		  }
		  function def(m) { return 'default' in m.exports ? m.exports.default : m.exports; }
		})(sourcemapCodec_umd, (function (module) {
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __export = (target, all) => {
		  for (var name in all)
		    __defProp(target, name, { get: all[name], enumerable: true });
		};
		var __copyProps = (to, from, except, desc) => {
		  if (from && typeof from === "object" || typeof from === "function") {
		    for (let key of __getOwnPropNames(from))
		      if (!__hasOwnProp.call(to, key) && key !== except)
		        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
		  }
		  return to;
		};
		var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

		// src/sourcemap-codec.ts
		var sourcemap_codec_exports = {};
		__export(sourcemap_codec_exports, {
		  decode: () => decode,
		  decodeGeneratedRanges: () => decodeGeneratedRanges,
		  decodeOriginalScopes: () => decodeOriginalScopes,
		  encode: () => encode,
		  encodeGeneratedRanges: () => encodeGeneratedRanges,
		  encodeOriginalScopes: () => encodeOriginalScopes
		});
		module.exports = __toCommonJS(sourcemap_codec_exports);

		// src/vlq.ts
		var comma = ",".charCodeAt(0);
		var semicolon = ";".charCodeAt(0);
		var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var intToChar = new Uint8Array(64);
		var charToInt = new Uint8Array(128);
		for (let i = 0; i < chars.length; i++) {
		  const c = chars.charCodeAt(i);
		  intToChar[i] = c;
		  charToInt[c] = i;
		}
		function decodeInteger(reader, relative) {
		  let value = 0;
		  let shift = 0;
		  let integer = 0;
		  do {
		    const c = reader.next();
		    integer = charToInt[c];
		    value |= (integer & 31) << shift;
		    shift += 5;
		  } while (integer & 32);
		  const shouldNegate = value & 1;
		  value >>>= 1;
		  if (shouldNegate) {
		    value = -2147483648 | -value;
		  }
		  return relative + value;
		}
		function encodeInteger(builder, num, relative) {
		  let delta = num - relative;
		  delta = delta < 0 ? -delta << 1 | 1 : delta << 1;
		  do {
		    let clamped = delta & 31;
		    delta >>>= 5;
		    if (delta > 0) clamped |= 32;
		    builder.write(intToChar[clamped]);
		  } while (delta > 0);
		  return num;
		}
		function hasMoreVlq(reader, max) {
		  if (reader.pos >= max) return false;
		  return reader.peek() !== comma;
		}

		// src/strings.ts
		var bufLength = 1024 * 16;
		var td = typeof TextDecoder !== "undefined" ? /* @__PURE__ */ new TextDecoder() : typeof Buffer !== "undefined" ? {
		  decode(buf) {
		    const out = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
		    return out.toString();
		  }
		} : {
		  decode(buf) {
		    let out = "";
		    for (let i = 0; i < buf.length; i++) {
		      out += String.fromCharCode(buf[i]);
		    }
		    return out;
		  }
		};
		var StringWriter = class {
		  constructor() {
		    this.pos = 0;
		    this.out = "";
		    this.buffer = new Uint8Array(bufLength);
		  }
		  write(v) {
		    const { buffer } = this;
		    buffer[this.pos++] = v;
		    if (this.pos === bufLength) {
		      this.out += td.decode(buffer);
		      this.pos = 0;
		    }
		  }
		  flush() {
		    const { buffer, out, pos } = this;
		    return pos > 0 ? out + td.decode(buffer.subarray(0, pos)) : out;
		  }
		};
		var StringReader = class {
		  constructor(buffer) {
		    this.pos = 0;
		    this.buffer = buffer;
		  }
		  next() {
		    return this.buffer.charCodeAt(this.pos++);
		  }
		  peek() {
		    return this.buffer.charCodeAt(this.pos);
		  }
		  indexOf(char) {
		    const { buffer, pos } = this;
		    const idx = buffer.indexOf(char, pos);
		    return idx === -1 ? buffer.length : idx;
		  }
		};

		// src/scopes.ts
		var EMPTY = [];
		function decodeOriginalScopes(input) {
		  const { length } = input;
		  const reader = new StringReader(input);
		  const scopes = [];
		  const stack = [];
		  let line = 0;
		  for (; reader.pos < length; reader.pos++) {
		    line = decodeInteger(reader, line);
		    const column = decodeInteger(reader, 0);
		    if (!hasMoreVlq(reader, length)) {
		      const last = stack.pop();
		      last[2] = line;
		      last[3] = column;
		      continue;
		    }
		    const kind = decodeInteger(reader, 0);
		    const fields = decodeInteger(reader, 0);
		    const hasName = fields & 1;
		    const scope = hasName ? [line, column, 0, 0, kind, decodeInteger(reader, 0)] : [line, column, 0, 0, kind];
		    let vars = EMPTY;
		    if (hasMoreVlq(reader, length)) {
		      vars = [];
		      do {
		        const varsIndex = decodeInteger(reader, 0);
		        vars.push(varsIndex);
		      } while (hasMoreVlq(reader, length));
		    }
		    scope.vars = vars;
		    scopes.push(scope);
		    stack.push(scope);
		  }
		  return scopes;
		}
		function encodeOriginalScopes(scopes) {
		  const writer = new StringWriter();
		  for (let i = 0; i < scopes.length; ) {
		    i = _encodeOriginalScopes(scopes, i, writer, [0]);
		  }
		  return writer.flush();
		}
		function _encodeOriginalScopes(scopes, index, writer, state) {
		  const scope = scopes[index];
		  const { 0: startLine, 1: startColumn, 2: endLine, 3: endColumn, 4: kind, vars } = scope;
		  if (index > 0) writer.write(comma);
		  state[0] = encodeInteger(writer, startLine, state[0]);
		  encodeInteger(writer, startColumn, 0);
		  encodeInteger(writer, kind, 0);
		  const fields = scope.length === 6 ? 1 : 0;
		  encodeInteger(writer, fields, 0);
		  if (scope.length === 6) encodeInteger(writer, scope[5], 0);
		  for (const v of vars) {
		    encodeInteger(writer, v, 0);
		  }
		  for (index++; index < scopes.length; ) {
		    const next = scopes[index];
		    const { 0: l, 1: c } = next;
		    if (l > endLine || l === endLine && c >= endColumn) {
		      break;
		    }
		    index = _encodeOriginalScopes(scopes, index, writer, state);
		  }
		  writer.write(comma);
		  state[0] = encodeInteger(writer, endLine, state[0]);
		  encodeInteger(writer, endColumn, 0);
		  return index;
		}
		function decodeGeneratedRanges(input) {
		  const { length } = input;
		  const reader = new StringReader(input);
		  const ranges = [];
		  const stack = [];
		  let genLine = 0;
		  let definitionSourcesIndex = 0;
		  let definitionScopeIndex = 0;
		  let callsiteSourcesIndex = 0;
		  let callsiteLine = 0;
		  let callsiteColumn = 0;
		  let bindingLine = 0;
		  let bindingColumn = 0;
		  do {
		    const semi = reader.indexOf(";");
		    let genColumn = 0;
		    for (; reader.pos < semi; reader.pos++) {
		      genColumn = decodeInteger(reader, genColumn);
		      if (!hasMoreVlq(reader, semi)) {
		        const last = stack.pop();
		        last[2] = genLine;
		        last[3] = genColumn;
		        continue;
		      }
		      const fields = decodeInteger(reader, 0);
		      const hasDefinition = fields & 1;
		      const hasCallsite = fields & 2;
		      const hasScope = fields & 4;
		      let callsite = null;
		      let bindings = EMPTY;
		      let range;
		      if (hasDefinition) {
		        const defSourcesIndex = decodeInteger(reader, definitionSourcesIndex);
		        definitionScopeIndex = decodeInteger(
		          reader,
		          definitionSourcesIndex === defSourcesIndex ? definitionScopeIndex : 0
		        );
		        definitionSourcesIndex = defSourcesIndex;
		        range = [genLine, genColumn, 0, 0, defSourcesIndex, definitionScopeIndex];
		      } else {
		        range = [genLine, genColumn, 0, 0];
		      }
		      range.isScope = !!hasScope;
		      if (hasCallsite) {
		        const prevCsi = callsiteSourcesIndex;
		        const prevLine = callsiteLine;
		        callsiteSourcesIndex = decodeInteger(reader, callsiteSourcesIndex);
		        const sameSource = prevCsi === callsiteSourcesIndex;
		        callsiteLine = decodeInteger(reader, sameSource ? callsiteLine : 0);
		        callsiteColumn = decodeInteger(
		          reader,
		          sameSource && prevLine === callsiteLine ? callsiteColumn : 0
		        );
		        callsite = [callsiteSourcesIndex, callsiteLine, callsiteColumn];
		      }
		      range.callsite = callsite;
		      if (hasMoreVlq(reader, semi)) {
		        bindings = [];
		        do {
		          bindingLine = genLine;
		          bindingColumn = genColumn;
		          const expressionsCount = decodeInteger(reader, 0);
		          let expressionRanges;
		          if (expressionsCount < -1) {
		            expressionRanges = [[decodeInteger(reader, 0)]];
		            for (let i = -1; i > expressionsCount; i--) {
		              const prevBl = bindingLine;
		              bindingLine = decodeInteger(reader, bindingLine);
		              bindingColumn = decodeInteger(reader, bindingLine === prevBl ? bindingColumn : 0);
		              const expression = decodeInteger(reader, 0);
		              expressionRanges.push([expression, bindingLine, bindingColumn]);
		            }
		          } else {
		            expressionRanges = [[expressionsCount]];
		          }
		          bindings.push(expressionRanges);
		        } while (hasMoreVlq(reader, semi));
		      }
		      range.bindings = bindings;
		      ranges.push(range);
		      stack.push(range);
		    }
		    genLine++;
		    reader.pos = semi + 1;
		  } while (reader.pos < length);
		  return ranges;
		}
		function encodeGeneratedRanges(ranges) {
		  if (ranges.length === 0) return "";
		  const writer = new StringWriter();
		  for (let i = 0; i < ranges.length; ) {
		    i = _encodeGeneratedRanges(ranges, i, writer, [0, 0, 0, 0, 0, 0, 0]);
		  }
		  return writer.flush();
		}
		function _encodeGeneratedRanges(ranges, index, writer, state) {
		  const range = ranges[index];
		  const {
		    0: startLine,
		    1: startColumn,
		    2: endLine,
		    3: endColumn,
		    isScope,
		    callsite,
		    bindings
		  } = range;
		  if (state[0] < startLine) {
		    catchupLine(writer, state[0], startLine);
		    state[0] = startLine;
		    state[1] = 0;
		  } else if (index > 0) {
		    writer.write(comma);
		  }
		  state[1] = encodeInteger(writer, range[1], state[1]);
		  const fields = (range.length === 6 ? 1 : 0) | (callsite ? 2 : 0) | (isScope ? 4 : 0);
		  encodeInteger(writer, fields, 0);
		  if (range.length === 6) {
		    const { 4: sourcesIndex, 5: scopesIndex } = range;
		    if (sourcesIndex !== state[2]) {
		      state[3] = 0;
		    }
		    state[2] = encodeInteger(writer, sourcesIndex, state[2]);
		    state[3] = encodeInteger(writer, scopesIndex, state[3]);
		  }
		  if (callsite) {
		    const { 0: sourcesIndex, 1: callLine, 2: callColumn } = range.callsite;
		    if (sourcesIndex !== state[4]) {
		      state[5] = 0;
		      state[6] = 0;
		    } else if (callLine !== state[5]) {
		      state[6] = 0;
		    }
		    state[4] = encodeInteger(writer, sourcesIndex, state[4]);
		    state[5] = encodeInteger(writer, callLine, state[5]);
		    state[6] = encodeInteger(writer, callColumn, state[6]);
		  }
		  if (bindings) {
		    for (const binding of bindings) {
		      if (binding.length > 1) encodeInteger(writer, -binding.length, 0);
		      const expression = binding[0][0];
		      encodeInteger(writer, expression, 0);
		      let bindingStartLine = startLine;
		      let bindingStartColumn = startColumn;
		      for (let i = 1; i < binding.length; i++) {
		        const expRange = binding[i];
		        bindingStartLine = encodeInteger(writer, expRange[1], bindingStartLine);
		        bindingStartColumn = encodeInteger(writer, expRange[2], bindingStartColumn);
		        encodeInteger(writer, expRange[0], 0);
		      }
		    }
		  }
		  for (index++; index < ranges.length; ) {
		    const next = ranges[index];
		    const { 0: l, 1: c } = next;
		    if (l > endLine || l === endLine && c >= endColumn) {
		      break;
		    }
		    index = _encodeGeneratedRanges(ranges, index, writer, state);
		  }
		  if (state[0] < endLine) {
		    catchupLine(writer, state[0], endLine);
		    state[0] = endLine;
		    state[1] = 0;
		  } else {
		    writer.write(comma);
		  }
		  state[1] = encodeInteger(writer, endColumn, state[1]);
		  return index;
		}
		function catchupLine(writer, lastLine, line) {
		  do {
		    writer.write(semicolon);
		  } while (++lastLine < line);
		}

		// src/sourcemap-codec.ts
		function decode(mappings) {
		  const { length } = mappings;
		  const reader = new StringReader(mappings);
		  const decoded = [];
		  let genColumn = 0;
		  let sourcesIndex = 0;
		  let sourceLine = 0;
		  let sourceColumn = 0;
		  let namesIndex = 0;
		  do {
		    const semi = reader.indexOf(";");
		    const line = [];
		    let sorted = true;
		    let lastCol = 0;
		    genColumn = 0;
		    while (reader.pos < semi) {
		      let seg;
		      genColumn = decodeInteger(reader, genColumn);
		      if (genColumn < lastCol) sorted = false;
		      lastCol = genColumn;
		      if (hasMoreVlq(reader, semi)) {
		        sourcesIndex = decodeInteger(reader, sourcesIndex);
		        sourceLine = decodeInteger(reader, sourceLine);
		        sourceColumn = decodeInteger(reader, sourceColumn);
		        if (hasMoreVlq(reader, semi)) {
		          namesIndex = decodeInteger(reader, namesIndex);
		          seg = [genColumn, sourcesIndex, sourceLine, sourceColumn, namesIndex];
		        } else {
		          seg = [genColumn, sourcesIndex, sourceLine, sourceColumn];
		        }
		      } else {
		        seg = [genColumn];
		      }
		      line.push(seg);
		      reader.pos++;
		    }
		    if (!sorted) sort(line);
		    decoded.push(line);
		    reader.pos = semi + 1;
		  } while (reader.pos <= length);
		  return decoded;
		}
		function sort(line) {
		  line.sort(sortComparator);
		}
		function sortComparator(a, b) {
		  return a[0] - b[0];
		}
		function encode(decoded) {
		  const writer = new StringWriter();
		  let sourcesIndex = 0;
		  let sourceLine = 0;
		  let sourceColumn = 0;
		  let namesIndex = 0;
		  for (let i = 0; i < decoded.length; i++) {
		    const line = decoded[i];
		    if (i > 0) writer.write(semicolon);
		    if (line.length === 0) continue;
		    let genColumn = 0;
		    for (let j = 0; j < line.length; j++) {
		      const segment = line[j];
		      if (j > 0) writer.write(comma);
		      genColumn = encodeInteger(writer, segment[0], genColumn);
		      if (segment.length === 1) continue;
		      sourcesIndex = encodeInteger(writer, segment[1], sourcesIndex);
		      sourceLine = encodeInteger(writer, segment[2], sourceLine);
		      sourceColumn = encodeInteger(writer, segment[3], sourceColumn);
		      if (segment.length === 4) continue;
		      namesIndex = encodeInteger(writer, segment[4], namesIndex);
		    }
		  }
		  return writer.flush();
		}
		}));
		
	} (sourcemapCodec_umd$1));
	return sourcemapCodec_umd$1.exports;
}

var traceMapping_umd$1 = {exports: {}};

var resolveUri_umd$1 = {exports: {}};

var resolveUri_umd = resolveUri_umd$1.exports;

var hasRequiredResolveUri_umd;

function requireResolveUri_umd () {
	if (hasRequiredResolveUri_umd) return resolveUri_umd$1.exports;
	hasRequiredResolveUri_umd = 1;
	(function (module, exports$1) {
		(function (global, factory) {
		    module.exports = factory() ;
		})(resolveUri_umd, (function () {
		    // Matches the scheme of a URL, eg "http://"
		    const schemeRegex = /^[\w+.-]+:\/\//;
		    /**
		     * Matches the parts of a URL:
		     * 1. Scheme, including ":", guaranteed.
		     * 2. User/password, including "@", optional.
		     * 3. Host, guaranteed.
		     * 4. Port, including ":", optional.
		     * 5. Path, including "/", optional.
		     * 6. Query, including "?", optional.
		     * 7. Hash, including "#", optional.
		     */
		    const urlRegex = /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/;
		    /**
		     * File URLs are weird. They dont' need the regular `//` in the scheme, they may or may not start
		     * with a leading `/`, they can have a domain (but only if they don't start with a Windows drive).
		     *
		     * 1. Host, optional.
		     * 2. Path, which may include "/", guaranteed.
		     * 3. Query, including "?", optional.
		     * 4. Hash, including "#", optional.
		     */
		    const fileRegex = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
		    function isAbsoluteUrl(input) {
		        return schemeRegex.test(input);
		    }
		    function isSchemeRelativeUrl(input) {
		        return input.startsWith('//');
		    }
		    function isAbsolutePath(input) {
		        return input.startsWith('/');
		    }
		    function isFileUrl(input) {
		        return input.startsWith('file:');
		    }
		    function isRelative(input) {
		        return /^[.?#]/.test(input);
		    }
		    function parseAbsoluteUrl(input) {
		        const match = urlRegex.exec(input);
		        return makeUrl(match[1], match[2] || '', match[3], match[4] || '', match[5] || '/', match[6] || '', match[7] || '');
		    }
		    function parseFileUrl(input) {
		        const match = fileRegex.exec(input);
		        const path = match[2];
		        return makeUrl('file:', '', match[1] || '', '', isAbsolutePath(path) ? path : '/' + path, match[3] || '', match[4] || '');
		    }
		    function makeUrl(scheme, user, host, port, path, query, hash) {
		        return {
		            scheme,
		            user,
		            host,
		            port,
		            path,
		            query,
		            hash,
		            type: 7 /* Absolute */,
		        };
		    }
		    function parseUrl(input) {
		        if (isSchemeRelativeUrl(input)) {
		            const url = parseAbsoluteUrl('http:' + input);
		            url.scheme = '';
		            url.type = 6 /* SchemeRelative */;
		            return url;
		        }
		        if (isAbsolutePath(input)) {
		            const url = parseAbsoluteUrl('http://foo.com' + input);
		            url.scheme = '';
		            url.host = '';
		            url.type = 5 /* AbsolutePath */;
		            return url;
		        }
		        if (isFileUrl(input))
		            return parseFileUrl(input);
		        if (isAbsoluteUrl(input))
		            return parseAbsoluteUrl(input);
		        const url = parseAbsoluteUrl('http://foo.com/' + input);
		        url.scheme = '';
		        url.host = '';
		        url.type = input
		            ? input.startsWith('?')
		                ? 3 /* Query */
		                : input.startsWith('#')
		                    ? 2 /* Hash */
		                    : 4 /* RelativePath */
		            : 1 /* Empty */;
		        return url;
		    }
		    function stripPathFilename(path) {
		        // If a path ends with a parent directory "..", then it's a relative path with excess parent
		        // paths. It's not a file, so we can't strip it.
		        if (path.endsWith('/..'))
		            return path;
		        const index = path.lastIndexOf('/');
		        return path.slice(0, index + 1);
		    }
		    function mergePaths(url, base) {
		        normalizePath(base, base.type);
		        // If the path is just a "/", then it was an empty path to begin with (remember, we're a relative
		        // path).
		        if (url.path === '/') {
		            url.path = base.path;
		        }
		        else {
		            // Resolution happens relative to the base path's directory, not the file.
		            url.path = stripPathFilename(base.path) + url.path;
		        }
		    }
		    /**
		     * The path can have empty directories "//", unneeded parents "foo/..", or current directory
		     * "foo/.". We need to normalize to a standard representation.
		     */
		    function normalizePath(url, type) {
		        const rel = type <= 4 /* RelativePath */;
		        const pieces = url.path.split('/');
		        // We need to preserve the first piece always, so that we output a leading slash. The item at
		        // pieces[0] is an empty string.
		        let pointer = 1;
		        // Positive is the number of real directories we've output, used for popping a parent directory.
		        // Eg, "foo/bar/.." will have a positive 2, and we can decrement to be left with just "foo".
		        let positive = 0;
		        // We need to keep a trailing slash if we encounter an empty directory (eg, splitting "foo/" will
		        // generate `["foo", ""]` pieces). And, if we pop a parent directory. But once we encounter a
		        // real directory, we won't need to append, unless the other conditions happen again.
		        let addTrailingSlash = false;
		        for (let i = 1; i < pieces.length; i++) {
		            const piece = pieces[i];
		            // An empty directory, could be a trailing slash, or just a double "//" in the path.
		            if (!piece) {
		                addTrailingSlash = true;
		                continue;
		            }
		            // If we encounter a real directory, then we don't need to append anymore.
		            addTrailingSlash = false;
		            // A current directory, which we can always drop.
		            if (piece === '.')
		                continue;
		            // A parent directory, we need to see if there are any real directories we can pop. Else, we
		            // have an excess of parents, and we'll need to keep the "..".
		            if (piece === '..') {
		                if (positive) {
		                    addTrailingSlash = true;
		                    positive--;
		                    pointer--;
		                }
		                else if (rel) {
		                    // If we're in a relativePath, then we need to keep the excess parents. Else, in an absolute
		                    // URL, protocol relative URL, or an absolute path, we don't need to keep excess.
		                    pieces[pointer++] = piece;
		                }
		                continue;
		            }
		            // We've encountered a real directory. Move it to the next insertion pointer, which accounts for
		            // any popped or dropped directories.
		            pieces[pointer++] = piece;
		            positive++;
		        }
		        let path = '';
		        for (let i = 1; i < pointer; i++) {
		            path += '/' + pieces[i];
		        }
		        if (!path || (addTrailingSlash && !path.endsWith('/..'))) {
		            path += '/';
		        }
		        url.path = path;
		    }
		    /**
		     * Attempts to resolve `input` URL/path relative to `base`.
		     */
		    function resolve(input, base) {
		        if (!input && !base)
		            return '';
		        const url = parseUrl(input);
		        let inputType = url.type;
		        if (base && inputType !== 7 /* Absolute */) {
		            const baseUrl = parseUrl(base);
		            const baseType = baseUrl.type;
		            switch (inputType) {
		                case 1 /* Empty */:
		                    url.hash = baseUrl.hash;
		                // fall through
		                case 2 /* Hash */:
		                    url.query = baseUrl.query;
		                // fall through
		                case 3 /* Query */:
		                case 4 /* RelativePath */:
		                    mergePaths(url, baseUrl);
		                // fall through
		                case 5 /* AbsolutePath */:
		                    // The host, user, and port are joined, you can't copy one without the others.
		                    url.user = baseUrl.user;
		                    url.host = baseUrl.host;
		                    url.port = baseUrl.port;
		                // fall through
		                case 6 /* SchemeRelative */:
		                    // The input doesn't have a schema at least, so we need to copy at least that over.
		                    url.scheme = baseUrl.scheme;
		            }
		            if (baseType > inputType)
		                inputType = baseType;
		        }
		        normalizePath(url, inputType);
		        const queryHash = url.query + url.hash;
		        switch (inputType) {
		            // This is impossible, because of the empty checks at the start of the function.
		            // case UrlType.Empty:
		            case 2 /* Hash */:
		            case 3 /* Query */:
		                return queryHash;
		            case 4 /* RelativePath */: {
		                // The first char is always a "/", and we need it to be relative.
		                const path = url.path.slice(1);
		                if (!path)
		                    return queryHash || '.';
		                if (isRelative(base || input) && !isRelative(path)) {
		                    // If base started with a leading ".", or there is no base and input started with a ".",
		                    // then we need to ensure that the relative path starts with a ".". We don't know if
		                    // relative starts with a "..", though, so check before prepending.
		                    return './' + path + queryHash;
		                }
		                return path + queryHash;
		            }
		            case 5 /* AbsolutePath */:
		                return url.path + queryHash;
		            default:
		                return url.scheme + '//' + url.user + url.host + url.port + url.path + queryHash;
		        }
		    }

		    return resolve;

		}));
		
	} (resolveUri_umd$1));
	return resolveUri_umd$1.exports;
}

var traceMapping_umd = traceMapping_umd$1.exports;

var hasRequiredTraceMapping_umd;

function requireTraceMapping_umd () {
	if (hasRequiredTraceMapping_umd) return traceMapping_umd$1.exports;
	hasRequiredTraceMapping_umd = 1;
	(function (module, exports$1) {
		(function (global, factory) {
		  {
		    factory(module, requireResolveUri_umd(), requireSourcemapCodec_umd());
		    module.exports = def(module);
		  }
		  function def(m) { return 'default' in m.exports ? m.exports.default : m.exports; }
		})(traceMapping_umd, (function (module, require_resolveURI, require_sourcemapCodec) {
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __commonJS = (cb, mod) => function __require() {
		  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
		};
		var __export = (target, all) => {
		  for (var name in all)
		    __defProp(target, name, { get: all[name], enumerable: true });
		};
		var __copyProps = (to, from, except, desc) => {
		  if (from && typeof from === "object" || typeof from === "function") {
		    for (let key of __getOwnPropNames(from))
		      if (!__hasOwnProp.call(to, key) && key !== except)
		        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
		  }
		  return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
		  // If the importer is in node compatibility mode or this is not an ESM
		  // file that has been converted to a CommonJS file using a Babel-
		  // compatible transform (i.e. "__esModule" has not been set), then set
		  // "default" to the CommonJS "module.exports" for node compatibility.
		  !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
		  mod
		));
		var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

		// umd:@jridgewell/sourcemap-codec
		var require_sourcemap_codec = __commonJS({
		  "umd:@jridgewell/sourcemap-codec"(exports$1, module2) {
		    module2.exports = require_sourcemapCodec;
		  }
		});

		// umd:@jridgewell/resolve-uri
		var require_resolve_uri = __commonJS({
		  "umd:@jridgewell/resolve-uri"(exports$1, module2) {
		    module2.exports = require_resolveURI;
		  }
		});

		// src/trace-mapping.ts
		var trace_mapping_exports = {};
		__export(trace_mapping_exports, {
		  AnyMap: () => FlattenMap,
		  FlattenMap: () => FlattenMap,
		  GREATEST_LOWER_BOUND: () => GREATEST_LOWER_BOUND,
		  LEAST_UPPER_BOUND: () => LEAST_UPPER_BOUND,
		  TraceMap: () => TraceMap,
		  allGeneratedPositionsFor: () => allGeneratedPositionsFor,
		  decodedMap: () => decodedMap,
		  decodedMappings: () => decodedMappings,
		  eachMapping: () => eachMapping,
		  encodedMap: () => encodedMap,
		  encodedMappings: () => encodedMappings,
		  generatedPositionFor: () => generatedPositionFor,
		  isIgnored: () => isIgnored,
		  originalPositionFor: () => originalPositionFor,
		  presortedDecodedMap: () => presortedDecodedMap,
		  sourceContentFor: () => sourceContentFor,
		  traceSegment: () => traceSegment
		});
		module.exports = __toCommonJS(trace_mapping_exports);
		var import_sourcemap_codec = __toESM(require_sourcemap_codec());

		// src/resolve.ts
		var import_resolve_uri = __toESM(require_resolve_uri());

		// src/strip-filename.ts
		function stripFilename(path) {
		  if (!path) return "";
		  const index = path.lastIndexOf("/");
		  return path.slice(0, index + 1);
		}

		// src/resolve.ts
		function resolver(mapUrl, sourceRoot) {
		  const from = stripFilename(mapUrl);
		  const prefix = sourceRoot ? sourceRoot + "/" : "";
		  return (source) => (0, import_resolve_uri.default)(prefix + (source || ""), from);
		}

		// src/sourcemap-segment.ts
		var COLUMN = 0;
		var SOURCES_INDEX = 1;
		var SOURCE_LINE = 2;
		var SOURCE_COLUMN = 3;
		var NAMES_INDEX = 4;
		var REV_GENERATED_LINE = 1;
		var REV_GENERATED_COLUMN = 2;

		// src/sort.ts
		function maybeSort(mappings, owned) {
		  const unsortedIndex = nextUnsortedSegmentLine(mappings, 0);
		  if (unsortedIndex === mappings.length) return mappings;
		  if (!owned) mappings = mappings.slice();
		  for (let i = unsortedIndex; i < mappings.length; i = nextUnsortedSegmentLine(mappings, i + 1)) {
		    mappings[i] = sortSegments(mappings[i], owned);
		  }
		  return mappings;
		}
		function nextUnsortedSegmentLine(mappings, start) {
		  for (let i = start; i < mappings.length; i++) {
		    if (!isSorted(mappings[i])) return i;
		  }
		  return mappings.length;
		}
		function isSorted(line) {
		  for (let j = 1; j < line.length; j++) {
		    if (line[j][COLUMN] < line[j - 1][COLUMN]) {
		      return false;
		    }
		  }
		  return true;
		}
		function sortSegments(line, owned) {
		  if (!owned) line = line.slice();
		  return line.sort(sortComparator);
		}
		function sortComparator(a, b) {
		  return a[COLUMN] - b[COLUMN];
		}

		// src/by-source.ts
		function buildBySources(decoded, memos) {
		  const sources = memos.map(() => []);
		  for (let i = 0; i < decoded.length; i++) {
		    const line = decoded[i];
		    for (let j = 0; j < line.length; j++) {
		      const seg = line[j];
		      if (seg.length === 1) continue;
		      const sourceIndex2 = seg[SOURCES_INDEX];
		      const sourceLine = seg[SOURCE_LINE];
		      const sourceColumn = seg[SOURCE_COLUMN];
		      const source = sources[sourceIndex2];
		      const segs = source[sourceLine] || (source[sourceLine] = []);
		      segs.push([sourceColumn, i, seg[COLUMN]]);
		    }
		  }
		  for (let i = 0; i < sources.length; i++) {
		    const source = sources[i];
		    for (let j = 0; j < source.length; j++) {
		      const line = source[j];
		      if (line) line.sort(sortComparator);
		    }
		  }
		  return sources;
		}

		// src/binary-search.ts
		var found = false;
		function binarySearch(haystack, needle, low, high) {
		  while (low <= high) {
		    const mid = low + (high - low >> 1);
		    const cmp = haystack[mid][COLUMN] - needle;
		    if (cmp === 0) {
		      found = true;
		      return mid;
		    }
		    if (cmp < 0) {
		      low = mid + 1;
		    } else {
		      high = mid - 1;
		    }
		  }
		  found = false;
		  return low - 1;
		}
		function upperBound(haystack, needle, index) {
		  for (let i = index + 1; i < haystack.length; index = i++) {
		    if (haystack[i][COLUMN] !== needle) break;
		  }
		  return index;
		}
		function lowerBound(haystack, needle, index) {
		  for (let i = index - 1; i >= 0; index = i--) {
		    if (haystack[i][COLUMN] !== needle) break;
		  }
		  return index;
		}
		function memoizedState() {
		  return {
		    lastKey: -1,
		    lastNeedle: -1,
		    lastIndex: -1
		  };
		}
		function memoizedBinarySearch(haystack, needle, state, key) {
		  const { lastKey, lastNeedle, lastIndex } = state;
		  let low = 0;
		  let high = haystack.length - 1;
		  if (key === lastKey) {
		    if (needle === lastNeedle) {
		      found = lastIndex !== -1 && haystack[lastIndex][COLUMN] === needle;
		      return lastIndex;
		    }
		    if (needle >= lastNeedle) {
		      low = lastIndex === -1 ? 0 : lastIndex;
		    } else {
		      high = lastIndex;
		    }
		  }
		  state.lastKey = key;
		  state.lastNeedle = needle;
		  return state.lastIndex = binarySearch(haystack, needle, low, high);
		}

		// src/types.ts
		function parse(map) {
		  return typeof map === "string" ? JSON.parse(map) : map;
		}

		// src/flatten-map.ts
		var FlattenMap = function(map, mapUrl) {
		  const parsed = parse(map);
		  if (!("sections" in parsed)) {
		    return new TraceMap(parsed, mapUrl);
		  }
		  const mappings = [];
		  const sources = [];
		  const sourcesContent = [];
		  const names = [];
		  const ignoreList = [];
		  recurse(
		    parsed,
		    mapUrl,
		    mappings,
		    sources,
		    sourcesContent,
		    names,
		    ignoreList,
		    0,
		    0,
		    Infinity,
		    Infinity
		  );
		  const joined = {
		    version: 3,
		    file: parsed.file,
		    names,
		    sources,
		    sourcesContent,
		    mappings,
		    ignoreList
		  };
		  return presortedDecodedMap(joined);
		};
		function recurse(input, mapUrl, mappings, sources, sourcesContent, names, ignoreList, lineOffset, columnOffset, stopLine, stopColumn) {
		  const { sections } = input;
		  for (let i = 0; i < sections.length; i++) {
		    const { map, offset } = sections[i];
		    let sl = stopLine;
		    let sc = stopColumn;
		    if (i + 1 < sections.length) {
		      const nextOffset = sections[i + 1].offset;
		      sl = Math.min(stopLine, lineOffset + nextOffset.line);
		      if (sl === stopLine) {
		        sc = Math.min(stopColumn, columnOffset + nextOffset.column);
		      } else if (sl < stopLine) {
		        sc = columnOffset + nextOffset.column;
		      }
		    }
		    addSection(
		      map,
		      mapUrl,
		      mappings,
		      sources,
		      sourcesContent,
		      names,
		      ignoreList,
		      lineOffset + offset.line,
		      columnOffset + offset.column,
		      sl,
		      sc
		    );
		  }
		}
		function addSection(input, mapUrl, mappings, sources, sourcesContent, names, ignoreList, lineOffset, columnOffset, stopLine, stopColumn) {
		  const parsed = parse(input);
		  if ("sections" in parsed) return recurse(...arguments);
		  const map = new TraceMap(parsed, mapUrl);
		  const sourcesOffset = sources.length;
		  const namesOffset = names.length;
		  const decoded = decodedMappings(map);
		  const { resolvedSources, sourcesContent: contents, ignoreList: ignores } = map;
		  append(sources, resolvedSources);
		  append(names, map.names);
		  if (contents) append(sourcesContent, contents);
		  else for (let i = 0; i < resolvedSources.length; i++) sourcesContent.push(null);
		  if (ignores) for (let i = 0; i < ignores.length; i++) ignoreList.push(ignores[i] + sourcesOffset);
		  for (let i = 0; i < decoded.length; i++) {
		    const lineI = lineOffset + i;
		    if (lineI > stopLine) return;
		    const out = getLine(mappings, lineI);
		    const cOffset = i === 0 ? columnOffset : 0;
		    const line = decoded[i];
		    for (let j = 0; j < line.length; j++) {
		      const seg = line[j];
		      const column = cOffset + seg[COLUMN];
		      if (lineI === stopLine && column >= stopColumn) return;
		      if (seg.length === 1) {
		        out.push([column]);
		        continue;
		      }
		      const sourcesIndex = sourcesOffset + seg[SOURCES_INDEX];
		      const sourceLine = seg[SOURCE_LINE];
		      const sourceColumn = seg[SOURCE_COLUMN];
		      out.push(
		        seg.length === 4 ? [column, sourcesIndex, sourceLine, sourceColumn] : [column, sourcesIndex, sourceLine, sourceColumn, namesOffset + seg[NAMES_INDEX]]
		      );
		    }
		  }
		}
		function append(arr, other) {
		  for (let i = 0; i < other.length; i++) arr.push(other[i]);
		}
		function getLine(arr, index) {
		  for (let i = arr.length; i <= index; i++) arr[i] = [];
		  return arr[index];
		}

		// src/trace-mapping.ts
		var LINE_GTR_ZERO = "`line` must be greater than 0 (lines start at line 1)";
		var COL_GTR_EQ_ZERO = "`column` must be greater than or equal to 0 (columns start at column 0)";
		var LEAST_UPPER_BOUND = -1;
		var GREATEST_LOWER_BOUND = 1;
		var TraceMap = class {
		  constructor(map, mapUrl) {
		    const isString = typeof map === "string";
		    if (!isString && map._decodedMemo) return map;
		    const parsed = parse(map);
		    const { version, file, names, sourceRoot, sources, sourcesContent } = parsed;
		    this.version = version;
		    this.file = file;
		    this.names = names || [];
		    this.sourceRoot = sourceRoot;
		    this.sources = sources;
		    this.sourcesContent = sourcesContent;
		    this.ignoreList = parsed.ignoreList || parsed.x_google_ignoreList || void 0;
		    const resolve = resolver(mapUrl, sourceRoot);
		    this.resolvedSources = sources.map(resolve);
		    const { mappings } = parsed;
		    if (typeof mappings === "string") {
		      this._encoded = mappings;
		      this._decoded = void 0;
		    } else if (Array.isArray(mappings)) {
		      this._encoded = void 0;
		      this._decoded = maybeSort(mappings, isString);
		    } else if (parsed.sections) {
		      throw new Error(`TraceMap passed sectioned source map, please use FlattenMap export instead`);
		    } else {
		      throw new Error(`invalid source map: ${JSON.stringify(parsed)}`);
		    }
		    this._decodedMemo = memoizedState();
		    this._bySources = void 0;
		    this._bySourceMemos = void 0;
		  }
		};
		function cast(map) {
		  return map;
		}
		function encodedMappings(map) {
		  var _a, _b;
		  return (_b = (_a = cast(map))._encoded) != null ? _b : _a._encoded = (0, import_sourcemap_codec.encode)(cast(map)._decoded);
		}
		function decodedMappings(map) {
		  var _a;
		  return (_a = cast(map))._decoded || (_a._decoded = (0, import_sourcemap_codec.decode)(cast(map)._encoded));
		}
		function traceSegment(map, line, column) {
		  const decoded = decodedMappings(map);
		  if (line >= decoded.length) return null;
		  const segments = decoded[line];
		  const index = traceSegmentInternal(
		    segments,
		    cast(map)._decodedMemo,
		    line,
		    column,
		    GREATEST_LOWER_BOUND
		  );
		  return index === -1 ? null : segments[index];
		}
		function originalPositionFor(map, needle) {
		  let { line, column, bias } = needle;
		  line--;
		  if (line < 0) throw new Error(LINE_GTR_ZERO);
		  if (column < 0) throw new Error(COL_GTR_EQ_ZERO);
		  const decoded = decodedMappings(map);
		  if (line >= decoded.length) return OMapping(null, null, null, null);
		  const segments = decoded[line];
		  const index = traceSegmentInternal(
		    segments,
		    cast(map)._decodedMemo,
		    line,
		    column,
		    bias || GREATEST_LOWER_BOUND
		  );
		  if (index === -1) return OMapping(null, null, null, null);
		  const segment = segments[index];
		  if (segment.length === 1) return OMapping(null, null, null, null);
		  const { names, resolvedSources } = map;
		  return OMapping(
		    resolvedSources[segment[SOURCES_INDEX]],
		    segment[SOURCE_LINE] + 1,
		    segment[SOURCE_COLUMN],
		    segment.length === 5 ? names[segment[NAMES_INDEX]] : null
		  );
		}
		function generatedPositionFor(map, needle) {
		  const { source, line, column, bias } = needle;
		  return generatedPosition(map, source, line, column, bias || GREATEST_LOWER_BOUND, false);
		}
		function allGeneratedPositionsFor(map, needle) {
		  const { source, line, column, bias } = needle;
		  return generatedPosition(map, source, line, column, bias || LEAST_UPPER_BOUND, true);
		}
		function eachMapping(map, cb) {
		  const decoded = decodedMappings(map);
		  const { names, resolvedSources } = map;
		  for (let i = 0; i < decoded.length; i++) {
		    const line = decoded[i];
		    for (let j = 0; j < line.length; j++) {
		      const seg = line[j];
		      const generatedLine = i + 1;
		      const generatedColumn = seg[0];
		      let source = null;
		      let originalLine = null;
		      let originalColumn = null;
		      let name = null;
		      if (seg.length !== 1) {
		        source = resolvedSources[seg[1]];
		        originalLine = seg[2] + 1;
		        originalColumn = seg[3];
		      }
		      if (seg.length === 5) name = names[seg[4]];
		      cb({
		        generatedLine,
		        generatedColumn,
		        source,
		        originalLine,
		        originalColumn,
		        name
		      });
		    }
		  }
		}
		function sourceIndex(map, source) {
		  const { sources, resolvedSources } = map;
		  let index = sources.indexOf(source);
		  if (index === -1) index = resolvedSources.indexOf(source);
		  return index;
		}
		function sourceContentFor(map, source) {
		  const { sourcesContent } = map;
		  if (sourcesContent == null) return null;
		  const index = sourceIndex(map, source);
		  return index === -1 ? null : sourcesContent[index];
		}
		function isIgnored(map, source) {
		  const { ignoreList } = map;
		  if (ignoreList == null) return false;
		  const index = sourceIndex(map, source);
		  return index === -1 ? false : ignoreList.includes(index);
		}
		function presortedDecodedMap(map, mapUrl) {
		  const tracer = new TraceMap(clone(map, []), mapUrl);
		  cast(tracer)._decoded = map.mappings;
		  return tracer;
		}
		function decodedMap(map) {
		  return clone(map, decodedMappings(map));
		}
		function encodedMap(map) {
		  return clone(map, encodedMappings(map));
		}
		function clone(map, mappings) {
		  return {
		    version: map.version,
		    file: map.file,
		    names: map.names,
		    sourceRoot: map.sourceRoot,
		    sources: map.sources,
		    sourcesContent: map.sourcesContent,
		    mappings,
		    ignoreList: map.ignoreList || map.x_google_ignoreList
		  };
		}
		function OMapping(source, line, column, name) {
		  return { source, line, column, name };
		}
		function GMapping(line, column) {
		  return { line, column };
		}
		function traceSegmentInternal(segments, memo, line, column, bias) {
		  let index = memoizedBinarySearch(segments, column, memo, line);
		  if (found) {
		    index = (bias === LEAST_UPPER_BOUND ? upperBound : lowerBound)(segments, column, index);
		  } else if (bias === LEAST_UPPER_BOUND) index++;
		  if (index === -1 || index === segments.length) return -1;
		  return index;
		}
		function sliceGeneratedPositions(segments, memo, line, column, bias) {
		  let min = traceSegmentInternal(segments, memo, line, column, GREATEST_LOWER_BOUND);
		  if (!found && bias === LEAST_UPPER_BOUND) min++;
		  if (min === -1 || min === segments.length) return [];
		  const matchedColumn = found ? column : segments[min][COLUMN];
		  if (!found) min = lowerBound(segments, matchedColumn, min);
		  const max = upperBound(segments, matchedColumn, min);
		  const result = [];
		  for (; min <= max; min++) {
		    const segment = segments[min];
		    result.push(GMapping(segment[REV_GENERATED_LINE] + 1, segment[REV_GENERATED_COLUMN]));
		  }
		  return result;
		}
		function generatedPosition(map, source, line, column, bias, all) {
		  var _a, _b;
		  line--;
		  if (line < 0) throw new Error(LINE_GTR_ZERO);
		  if (column < 0) throw new Error(COL_GTR_EQ_ZERO);
		  const { sources, resolvedSources } = map;
		  let sourceIndex2 = sources.indexOf(source);
		  if (sourceIndex2 === -1) sourceIndex2 = resolvedSources.indexOf(source);
		  if (sourceIndex2 === -1) return all ? [] : GMapping(null, null);
		  const bySourceMemos = (_a = cast(map))._bySourceMemos || (_a._bySourceMemos = sources.map(memoizedState));
		  const generated = (_b = cast(map))._bySources || (_b._bySources = buildBySources(decodedMappings(map), bySourceMemos));
		  const segments = generated[sourceIndex2][line];
		  if (segments == null) return all ? [] : GMapping(null, null);
		  const memo = bySourceMemos[sourceIndex2];
		  if (all) return sliceGeneratedPositions(segments, memo, line, column, bias);
		  const index = traceSegmentInternal(segments, memo, line, column, bias);
		  if (index === -1) return GMapping(null, null);
		  const segment = segments[index];
		  return GMapping(segment[REV_GENERATED_LINE] + 1, segment[REV_GENERATED_COLUMN]);
		}
		}));
		
	} (traceMapping_umd$1));
	return traceMapping_umd$1.exports;
}

var genMapping_umd = genMapping_umd$1.exports;

var hasRequiredGenMapping_umd;

function requireGenMapping_umd () {
	if (hasRequiredGenMapping_umd) return genMapping_umd$1.exports;
	hasRequiredGenMapping_umd = 1;
	(function (module, exports$1) {
		(function (global, factory) {
		  {
		    factory(module, requireSourcemapCodec_umd(), requireTraceMapping_umd());
		    module.exports = def(module);
		  }
		  function def(m) { return 'default' in m.exports ? m.exports.default : m.exports; }
		})(genMapping_umd, (function (module, require_sourcemapCodec, require_traceMapping) {
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __commonJS = (cb, mod) => function __require() {
		  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
		};
		var __export = (target, all) => {
		  for (var name in all)
		    __defProp(target, name, { get: all[name], enumerable: true });
		};
		var __copyProps = (to, from, except, desc) => {
		  if (from && typeof from === "object" || typeof from === "function") {
		    for (let key of __getOwnPropNames(from))
		      if (!__hasOwnProp.call(to, key) && key !== except)
		        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
		  }
		  return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
		  // If the importer is in node compatibility mode or this is not an ESM
		  // file that has been converted to a CommonJS file using a Babel-
		  // compatible transform (i.e. "__esModule" has not been set), then set
		  // "default" to the CommonJS "module.exports" for node compatibility.
		  !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
		  mod
		));
		var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

		// umd:@jridgewell/sourcemap-codec
		var require_sourcemap_codec = __commonJS({
		  "umd:@jridgewell/sourcemap-codec"(exports$1, module2) {
		    module2.exports = require_sourcemapCodec;
		  }
		});

		// umd:@jridgewell/trace-mapping
		var require_trace_mapping = __commonJS({
		  "umd:@jridgewell/trace-mapping"(exports$1, module2) {
		    module2.exports = require_traceMapping;
		  }
		});

		// src/gen-mapping.ts
		var gen_mapping_exports = {};
		__export(gen_mapping_exports, {
		  GenMapping: () => GenMapping,
		  addMapping: () => addMapping,
		  addSegment: () => addSegment,
		  allMappings: () => allMappings,
		  fromMap: () => fromMap,
		  maybeAddMapping: () => maybeAddMapping,
		  maybeAddSegment: () => maybeAddSegment,
		  setIgnore: () => setIgnore,
		  setSourceContent: () => setSourceContent,
		  toDecodedMap: () => toDecodedMap,
		  toEncodedMap: () => toEncodedMap
		});
		module.exports = __toCommonJS(gen_mapping_exports);

		// src/set-array.ts
		var SetArray = class {
		  constructor() {
		    this._indexes = { __proto__: null };
		    this.array = [];
		  }
		};
		function cast(set) {
		  return set;
		}
		function get(setarr, key) {
		  return cast(setarr)._indexes[key];
		}
		function put(setarr, key) {
		  const index = get(setarr, key);
		  if (index !== void 0) return index;
		  const { array, _indexes: indexes } = cast(setarr);
		  const length = array.push(key);
		  return indexes[key] = length - 1;
		}
		function remove(setarr, key) {
		  const index = get(setarr, key);
		  if (index === void 0) return;
		  const { array, _indexes: indexes } = cast(setarr);
		  for (let i = index + 1; i < array.length; i++) {
		    const k = array[i];
		    array[i - 1] = k;
		    indexes[k]--;
		  }
		  indexes[key] = void 0;
		  array.pop();
		}

		// src/gen-mapping.ts
		var import_sourcemap_codec = __toESM(require_sourcemap_codec());
		var import_trace_mapping = __toESM(require_trace_mapping());

		// src/sourcemap-segment.ts
		var COLUMN = 0;
		var SOURCES_INDEX = 1;
		var SOURCE_LINE = 2;
		var SOURCE_COLUMN = 3;
		var NAMES_INDEX = 4;

		// src/gen-mapping.ts
		var NO_NAME = -1;
		var GenMapping = class {
		  constructor({ file, sourceRoot } = {}) {
		    this._names = new SetArray();
		    this._sources = new SetArray();
		    this._sourcesContent = [];
		    this._mappings = [];
		    this.file = file;
		    this.sourceRoot = sourceRoot;
		    this._ignoreList = new SetArray();
		  }
		};
		function cast2(map) {
		  return map;
		}
		function addSegment(map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) {
		  return addSegmentInternal(
		    false,
		    map,
		    genLine,
		    genColumn,
		    source,
		    sourceLine,
		    sourceColumn,
		    name,
		    content
		  );
		}
		function addMapping(map, mapping) {
		  return addMappingInternal(false, map, mapping);
		}
		var maybeAddSegment = (map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) => {
		  return addSegmentInternal(
		    true,
		    map,
		    genLine,
		    genColumn,
		    source,
		    sourceLine,
		    sourceColumn,
		    name,
		    content
		  );
		};
		var maybeAddMapping = (map, mapping) => {
		  return addMappingInternal(true, map, mapping);
		};
		function setSourceContent(map, source, content) {
		  const {
		    _sources: sources,
		    _sourcesContent: sourcesContent
		    // _originalScopes: originalScopes,
		  } = cast2(map);
		  const index = put(sources, source);
		  sourcesContent[index] = content;
		}
		function setIgnore(map, source, ignore = true) {
		  const {
		    _sources: sources,
		    _sourcesContent: sourcesContent,
		    _ignoreList: ignoreList
		    // _originalScopes: originalScopes,
		  } = cast2(map);
		  const index = put(sources, source);
		  if (index === sourcesContent.length) sourcesContent[index] = null;
		  if (ignore) put(ignoreList, index);
		  else remove(ignoreList, index);
		}
		function toDecodedMap(map) {
		  const {
		    _mappings: mappings,
		    _sources: sources,
		    _sourcesContent: sourcesContent,
		    _names: names,
		    _ignoreList: ignoreList
		    // _originalScopes: originalScopes,
		    // _generatedRanges: generatedRanges,
		  } = cast2(map);
		  removeEmptyFinalLines(mappings);
		  return {
		    version: 3,
		    file: map.file || void 0,
		    names: names.array,
		    sourceRoot: map.sourceRoot || void 0,
		    sources: sources.array,
		    sourcesContent,
		    mappings,
		    // originalScopes,
		    // generatedRanges,
		    ignoreList: ignoreList.array
		  };
		}
		function toEncodedMap(map) {
		  const decoded = toDecodedMap(map);
		  return Object.assign({}, decoded, {
		    // originalScopes: decoded.originalScopes.map((os) => encodeOriginalScopes(os)),
		    // generatedRanges: encodeGeneratedRanges(decoded.generatedRanges as GeneratedRange[]),
		    mappings: (0, import_sourcemap_codec.encode)(decoded.mappings)
		  });
		}
		function fromMap(input) {
		  const map = new import_trace_mapping.TraceMap(input);
		  const gen = new GenMapping({ file: map.file, sourceRoot: map.sourceRoot });
		  putAll(cast2(gen)._names, map.names);
		  putAll(cast2(gen)._sources, map.sources);
		  cast2(gen)._sourcesContent = map.sourcesContent || map.sources.map(() => null);
		  cast2(gen)._mappings = (0, import_trace_mapping.decodedMappings)(map);
		  if (map.ignoreList) putAll(cast2(gen)._ignoreList, map.ignoreList);
		  return gen;
		}
		function allMappings(map) {
		  const out = [];
		  const { _mappings: mappings, _sources: sources, _names: names } = cast2(map);
		  for (let i = 0; i < mappings.length; i++) {
		    const line = mappings[i];
		    for (let j = 0; j < line.length; j++) {
		      const seg = line[j];
		      const generated = { line: i + 1, column: seg[COLUMN] };
		      let source = void 0;
		      let original = void 0;
		      let name = void 0;
		      if (seg.length !== 1) {
		        source = sources.array[seg[SOURCES_INDEX]];
		        original = { line: seg[SOURCE_LINE] + 1, column: seg[SOURCE_COLUMN] };
		        if (seg.length === 5) name = names.array[seg[NAMES_INDEX]];
		      }
		      out.push({ generated, source, original, name });
		    }
		  }
		  return out;
		}
		function addSegmentInternal(skipable, map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) {
		  const {
		    _mappings: mappings,
		    _sources: sources,
		    _sourcesContent: sourcesContent,
		    _names: names
		    // _originalScopes: originalScopes,
		  } = cast2(map);
		  const line = getIndex(mappings, genLine);
		  const index = getColumnIndex(line, genColumn);
		  if (!source) {
		    if (skipable && skipSourceless(line, index)) return;
		    return insert(line, index, [genColumn]);
		  }
		  const sourcesIndex = put(sources, source);
		  const namesIndex = name ? put(names, name) : NO_NAME;
		  if (sourcesIndex === sourcesContent.length) sourcesContent[sourcesIndex] = content != null ? content : null;
		  if (skipable && skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex)) {
		    return;
		  }
		  return insert(
		    line,
		    index,
		    name ? [genColumn, sourcesIndex, sourceLine, sourceColumn, namesIndex] : [genColumn, sourcesIndex, sourceLine, sourceColumn]
		  );
		}
		function getIndex(arr, index) {
		  for (let i = arr.length; i <= index; i++) {
		    arr[i] = [];
		  }
		  return arr[index];
		}
		function getColumnIndex(line, genColumn) {
		  let index = line.length;
		  for (let i = index - 1; i >= 0; index = i--) {
		    const current = line[i];
		    if (genColumn >= current[COLUMN]) break;
		  }
		  return index;
		}
		function insert(array, index, value) {
		  for (let i = array.length; i > index; i--) {
		    array[i] = array[i - 1];
		  }
		  array[index] = value;
		}
		function removeEmptyFinalLines(mappings) {
		  const { length } = mappings;
		  let len = length;
		  for (let i = len - 1; i >= 0; len = i, i--) {
		    if (mappings[i].length > 0) break;
		  }
		  if (len < length) mappings.length = len;
		}
		function putAll(setarr, array) {
		  for (let i = 0; i < array.length; i++) put(setarr, array[i]);
		}
		function skipSourceless(line, index) {
		  if (index === 0) return true;
		  const prev = line[index - 1];
		  return prev.length === 1;
		}
		function skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex) {
		  if (index === 0) return false;
		  const prev = line[index - 1];
		  if (prev.length === 1) return false;
		  return sourcesIndex === prev[SOURCES_INDEX] && sourceLine === prev[SOURCE_LINE] && sourceColumn === prev[SOURCE_COLUMN] && namesIndex === (prev.length === 5 ? prev[NAMES_INDEX] : NO_NAME);
		}
		function addMappingInternal(skipable, map, mapping) {
		  const { generated, source, original, name, content } = mapping;
		  if (!source) {
		    return addSegmentInternal(
		      skipable,
		      map,
		      generated.line - 1,
		      generated.column,
		      null,
		      null,
		      null,
		      null,
		      null
		    );
		  }
		  return addSegmentInternal(
		    skipable,
		    map,
		    generated.line - 1,
		    generated.column,
		    source,
		    original.line - 1,
		    original.column,
		    name,
		    content
		  );
		}
		}));
		
	} (genMapping_umd$1));
	return genMapping_umd$1.exports;
}

var hasRequiredSourceMap;

function requireSourceMap () {
	if (hasRequiredSourceMap) return sourceMap;
	hasRequiredSourceMap = 1;

	Object.defineProperty(sourceMap, "__esModule", {
	  value: true
	});
	sourceMap.default = void 0;
	var _genMapping = requireGenMapping_umd();
	var _traceMapping = requireTraceMapping_umd();
	class SourceMap {
	  constructor(opts, code) {
	    var _opts$sourceFileName;
	    this._map = void 0;
	    this._rawMappings = void 0;
	    this._sourceFileName = void 0;
	    this._lastGenLine = 0;
	    this._lastSourceLine = 0;
	    this._lastSourceColumn = 0;
	    this._inputMap = null;
	    const map = this._map = new _genMapping.GenMapping({
	      sourceRoot: opts.sourceRoot
	    });
	    this._sourceFileName = (_opts$sourceFileName = opts.sourceFileName) == null ? void 0 : _opts$sourceFileName.replace(/\\/g, "/");
	    this._rawMappings = undefined;
	    if (opts.inputSourceMap) {
	      this._inputMap = new _traceMapping.TraceMap(opts.inputSourceMap);
	      const resolvedSources = this._inputMap.resolvedSources;
	      if (resolvedSources.length) {
	        for (let i = 0; i < resolvedSources.length; i++) {
	          var _this$_inputMap$sourc;
	          (0, _genMapping.setSourceContent)(map, resolvedSources[i], (_this$_inputMap$sourc = this._inputMap.sourcesContent) == null ? void 0 : _this$_inputMap$sourc[i]);
	        }
	      }
	    }
	    if (typeof code === "string" && !opts.inputSourceMap) {
	      (0, _genMapping.setSourceContent)(map, this._sourceFileName, code);
	    } else if (typeof code === "object") {
	      for (const sourceFileName of Object.keys(code)) {
	        (0, _genMapping.setSourceContent)(map, sourceFileName.replace(/\\/g, "/"), code[sourceFileName]);
	      }
	    }
	  }
	  get() {
	    return (0, _genMapping.toEncodedMap)(this._map);
	  }
	  getDecoded() {
	    return (0, _genMapping.toDecodedMap)(this._map);
	  }
	  getRawMappings() {
	    return this._rawMappings || (this._rawMappings = (0, _genMapping.allMappings)(this._map));
	  }
	  mark(generated, line, column, identifierName, identifierNamePos, filename) {
	    var _originalMapping;
	    this._rawMappings = undefined;
	    let originalMapping;
	    if (line != null) {
	      if (this._inputMap) {
	        originalMapping = (0, _traceMapping.originalPositionFor)(this._inputMap, {
	          line,
	          column: column
	        });
	        if (!originalMapping.name && identifierNamePos) {
	          const originalIdentifierMapping = (0, _traceMapping.originalPositionFor)(this._inputMap, identifierNamePos);
	          if (originalIdentifierMapping.name) {
	            identifierName = originalIdentifierMapping.name;
	          }
	        }
	      } else {
	        originalMapping = {
	          name: null,
	          source: (filename == null ? void 0 : filename.replace(/\\/g, "/")) || this._sourceFileName,
	          line: line,
	          column: column
	        };
	      }
	    }
	    (0, _genMapping.maybeAddMapping)(this._map, {
	      name: identifierName,
	      generated,
	      source: (_originalMapping = originalMapping) == null ? void 0 : _originalMapping.source,
	      original: originalMapping
	    });
	  }
	}
	sourceMap.default = SourceMap;

	
	return sourceMap;
}

var printer = {};

var buffer = {};

var hasRequiredBuffer;

function requireBuffer () {
	if (hasRequiredBuffer) return buffer;
	hasRequiredBuffer = 1;

	Object.defineProperty(buffer, "__esModule", {
	  value: true
	});
	buffer.default = void 0;
	const spaceIndents = [];
	for (let i = 0; i < 32; i++) {
	  spaceIndents.push(" ".repeat(i * 2));
	}
	class Buffer {
	  constructor(map, indentChar) {
	    this._map = null;
	    this._buf = "";
	    this._str = "";
	    this._appendCount = 0;
	    this._last = 0;
	    this._canMarkIdName = true;
	    this._indentChar = "";
	    this._queuedChar = 0;
	    this._position = {
	      line: 1,
	      column: 0
	    };
	    this._sourcePosition = {
	      identifierName: undefined,
	      identifierNamePos: undefined,
	      line: undefined,
	      column: undefined,
	      filename: undefined
	    };
	    this._map = map;
	    this._indentChar = indentChar;
	  }
	  get() {
	    const {
	      _map,
	      _last
	    } = this;
	    if (this._queuedChar !== 32) {
	      this._flush();
	    }
	    const code = _last === 10 ? (this._buf + this._str).trimRight() : this._buf + this._str;
	    if (_map === null) {
	      return {
	        code: code,
	        decodedMap: undefined,
	        map: null,
	        rawMappings: undefined
	      };
	    }
	    const result = {
	      code: code,
	      decodedMap: _map.getDecoded(),
	      get __mergedMap() {
	        return this.map;
	      },
	      get map() {
	        const resultMap = _map.get();
	        result.map = resultMap;
	        return resultMap;
	      },
	      set map(value) {
	        Object.defineProperty(result, "map", {
	          value,
	          writable: true
	        });
	      },
	      get rawMappings() {
	        const mappings = _map.getRawMappings();
	        result.rawMappings = mappings;
	        return mappings;
	      },
	      set rawMappings(value) {
	        Object.defineProperty(result, "rawMappings", {
	          value,
	          writable: true
	        });
	      }
	    };
	    return result;
	  }
	  append(str, maybeNewline) {
	    this._flush();
	    this._append(str, maybeNewline);
	  }
	  appendChar(char) {
	    this._flush();
	    this._appendChar(char, 1, true);
	  }
	  queue(char) {
	    this._flush();
	    this._queuedChar = char;
	  }
	  _flush() {
	    const queuedChar = this._queuedChar;
	    if (queuedChar !== 0) {
	      this._appendChar(queuedChar, 1, true);
	      this._queuedChar = 0;
	    }
	  }
	  _appendChar(char, repeat, useSourcePos) {
	    this._last = char;
	    if (char === -1) {
	      const indent = repeat >= 64 ? this._indentChar.repeat(repeat) : spaceIndents[repeat / 2];
	      this._str += indent;
	    } else {
	      this._str += repeat > 1 ? String.fromCharCode(char).repeat(repeat) : String.fromCharCode(char);
	    }
	    const isSpace = char === 32;
	    const position = this._position;
	    if (char !== 10) {
	      if (this._map) {
	        const sourcePos = this._sourcePosition;
	        if (useSourcePos && sourcePos) {
	          this._map.mark(position, sourcePos.line, sourcePos.column, isSpace ? undefined : sourcePos.identifierName, isSpace ? undefined : sourcePos.identifierNamePos, sourcePos.filename);
	          if (!isSpace && this._canMarkIdName) {
	            sourcePos.identifierName = undefined;
	            sourcePos.identifierNamePos = undefined;
	          }
	        } else {
	          this._map.mark(position);
	        }
	      }
	      position.column += repeat;
	    } else {
	      position.line++;
	      position.column = 0;
	    }
	  }
	  _append(str, maybeNewline) {
	    const len = str.length;
	    const position = this._position;
	    const sourcePos = this._sourcePosition;
	    this._last = -1;
	    if (++this._appendCount > 4096) {
	      +this._str;
	      this._buf += this._str;
	      this._str = str;
	      this._appendCount = 0;
	    } else {
	      this._str += str;
	    }
	    const hasMap = this._map !== null;
	    if (!maybeNewline && !hasMap) {
	      position.column += len;
	      return;
	    }
	    const {
	      column,
	      identifierName,
	      identifierNamePos,
	      filename
	    } = sourcePos;
	    let line = sourcePos.line;
	    if ((identifierName != null || identifierNamePos != null) && this._canMarkIdName) {
	      sourcePos.identifierName = undefined;
	      sourcePos.identifierNamePos = undefined;
	    }
	    let i = str.indexOf("\n");
	    let last = 0;
	    if (hasMap && i !== 0) {
	      this._map.mark(position, line, column, identifierName, identifierNamePos, filename);
	    }
	    while (i !== -1) {
	      position.line++;
	      position.column = 0;
	      last = i + 1;
	      if (last < len && line !== undefined) {
	        line++;
	        if (hasMap) {
	          this._map.mark(position, line, 0, undefined, undefined, filename);
	        }
	      }
	      i = str.indexOf("\n", last);
	    }
	    position.column += len - last;
	  }
	  removeLastSemicolon() {
	    if (this._queuedChar === 59) {
	      this._queuedChar = 0;
	    }
	  }
	  getLastChar(checkQueue) {
	    if (!checkQueue) {
	      return this._last;
	    }
	    const queuedChar = this._queuedChar;
	    return queuedChar !== 0 ? queuedChar : this._last;
	  }
	  getNewlineCount() {
	    return this._queuedChar === 0 && this._last === 10 ? 1 : 0;
	  }
	  hasContent() {
	    return this._last !== 0;
	  }
	  exactSource(loc, cb) {
	    if (!this._map) {
	      cb();
	      return;
	    }
	    this.source("start", loc);
	    const identifierName = loc.identifierName;
	    const sourcePos = this._sourcePosition;
	    if (identifierName != null) {
	      this._canMarkIdName = false;
	      sourcePos.identifierName = identifierName;
	    }
	    cb();
	    if (identifierName != null) {
	      this._canMarkIdName = true;
	      sourcePos.identifierName = undefined;
	      sourcePos.identifierNamePos = undefined;
	    }
	    this.source("end", loc);
	  }
	  source(prop, loc) {
	    if (!this._map) return;
	    this._normalizePosition(prop, loc, 0);
	  }
	  sourceWithOffset(prop, loc, columnOffset) {
	    if (!this._map) return;
	    this._normalizePosition(prop, loc, columnOffset);
	  }
	  _normalizePosition(prop, loc, columnOffset) {
	    this._flush();
	    const pos = loc[prop];
	    const target = this._sourcePosition;
	    if (pos) {
	      target.line = pos.line;
	      target.column = Math.max(pos.column + columnOffset, 0);
	      target.filename = loc.filename;
	    }
	  }
	  getCurrentColumn() {
	    return this._position.column + (this._queuedChar ? 1 : 0);
	  }
	  getCurrentLine() {
	    return this._position.line;
	  }
	}
	buffer.default = Buffer;

	
	return buffer;
}

var node = {};

var parentheses = {};

var env = {};

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

var browser$1 = {
  env: env};

var lib$2 = {};

var isReactComponent = {};

var buildMatchMemberExpression = {};

var matchesPattern = {};

var generated$3 = {};

var shallowEqual = {};

var hasRequiredShallowEqual;

function requireShallowEqual () {
	if (hasRequiredShallowEqual) return shallowEqual;
	hasRequiredShallowEqual = 1;

	Object.defineProperty(shallowEqual, "__esModule", {
	  value: true
	});
	shallowEqual.default = shallowEqual$1;
	function shallowEqual$1(actual, expected) {
	  const keys = Object.keys(expected);
	  for (const key of keys) {
	    if (actual[key] !== expected[key]) {
	      return false;
	    }
	  }
	  return true;
	}

	
	return shallowEqual;
}

var deprecationWarning = {};

var hasRequiredDeprecationWarning;

function requireDeprecationWarning () {
	if (hasRequiredDeprecationWarning) return deprecationWarning;
	hasRequiredDeprecationWarning = 1;

	Object.defineProperty(deprecationWarning, "__esModule", {
	  value: true
	});
	deprecationWarning.default = deprecationWarning$1;
	const warnings = new Set();
	function deprecationWarning$1(oldName, newName, prefix = "", cacheKey = oldName) {
	  if (warnings.has(cacheKey)) return;
	  warnings.add(cacheKey);
	  const {
	    internal,
	    trace
	  } = captureShortStackTrace(1, 2);
	  if (internal) {
	    return;
	  }
	  console.warn(`${prefix}\`${oldName}\` has been deprecated, please migrate to \`${newName}\`\n${trace}`);
	}
	function captureShortStackTrace(skip, length) {
	  const {
	    stackTraceLimit,
	    prepareStackTrace
	  } = Error;
	  let stackTrace;
	  Error.stackTraceLimit = 1 + skip + length;
	  Error.prepareStackTrace = function (err, stack) {
	    stackTrace = stack;
	  };
	  new Error().stack;
	  Error.stackTraceLimit = stackTraceLimit;
	  Error.prepareStackTrace = prepareStackTrace;
	  if (!stackTrace) return {
	    internal: false,
	    trace: ""
	  };
	  const shortStackTrace = stackTrace.slice(1 + skip, 1 + skip + length);
	  return {
	    internal: /[\\/]@babel[\\/]/.test(shortStackTrace[1].getFileName()),
	    trace: shortStackTrace.map(frame => `    at ${frame}`).join("\n")
	  };
	}

	
	return deprecationWarning;
}

var hasRequiredGenerated$3;

function requireGenerated$3 () {
	if (hasRequiredGenerated$3) return generated$3;
	hasRequiredGenerated$3 = 1;

	Object.defineProperty(generated$3, "__esModule", {
	  value: true
	});
	generated$3.isAccessor = isAccessor;
	generated$3.isAnyTypeAnnotation = isAnyTypeAnnotation;
	generated$3.isArgumentPlaceholder = isArgumentPlaceholder;
	generated$3.isArrayExpression = isArrayExpression;
	generated$3.isArrayPattern = isArrayPattern;
	generated$3.isArrayTypeAnnotation = isArrayTypeAnnotation;
	generated$3.isArrowFunctionExpression = isArrowFunctionExpression;
	generated$3.isAssignmentExpression = isAssignmentExpression;
	generated$3.isAssignmentPattern = isAssignmentPattern;
	generated$3.isAwaitExpression = isAwaitExpression;
	generated$3.isBigIntLiteral = isBigIntLiteral;
	generated$3.isBinary = isBinary;
	generated$3.isBinaryExpression = isBinaryExpression;
	generated$3.isBindExpression = isBindExpression;
	generated$3.isBlock = isBlock;
	generated$3.isBlockParent = isBlockParent;
	generated$3.isBlockStatement = isBlockStatement;
	generated$3.isBooleanLiteral = isBooleanLiteral;
	generated$3.isBooleanLiteralTypeAnnotation = isBooleanLiteralTypeAnnotation;
	generated$3.isBooleanTypeAnnotation = isBooleanTypeAnnotation;
	generated$3.isBreakStatement = isBreakStatement;
	generated$3.isCallExpression = isCallExpression;
	generated$3.isCatchClause = isCatchClause;
	generated$3.isClass = isClass;
	generated$3.isClassAccessorProperty = isClassAccessorProperty;
	generated$3.isClassBody = isClassBody;
	generated$3.isClassDeclaration = isClassDeclaration;
	generated$3.isClassExpression = isClassExpression;
	generated$3.isClassImplements = isClassImplements;
	generated$3.isClassMethod = isClassMethod;
	generated$3.isClassPrivateMethod = isClassPrivateMethod;
	generated$3.isClassPrivateProperty = isClassPrivateProperty;
	generated$3.isClassProperty = isClassProperty;
	generated$3.isCompletionStatement = isCompletionStatement;
	generated$3.isConditional = isConditional;
	generated$3.isConditionalExpression = isConditionalExpression;
	generated$3.isContinueStatement = isContinueStatement;
	generated$3.isDebuggerStatement = isDebuggerStatement;
	generated$3.isDecimalLiteral = isDecimalLiteral;
	generated$3.isDeclaration = isDeclaration;
	generated$3.isDeclareClass = isDeclareClass;
	generated$3.isDeclareExportAllDeclaration = isDeclareExportAllDeclaration;
	generated$3.isDeclareExportDeclaration = isDeclareExportDeclaration;
	generated$3.isDeclareFunction = isDeclareFunction;
	generated$3.isDeclareInterface = isDeclareInterface;
	generated$3.isDeclareModule = isDeclareModule;
	generated$3.isDeclareModuleExports = isDeclareModuleExports;
	generated$3.isDeclareOpaqueType = isDeclareOpaqueType;
	generated$3.isDeclareTypeAlias = isDeclareTypeAlias;
	generated$3.isDeclareVariable = isDeclareVariable;
	generated$3.isDeclaredPredicate = isDeclaredPredicate;
	generated$3.isDecorator = isDecorator;
	generated$3.isDirective = isDirective;
	generated$3.isDirectiveLiteral = isDirectiveLiteral;
	generated$3.isDoExpression = isDoExpression;
	generated$3.isDoWhileStatement = isDoWhileStatement;
	generated$3.isEmptyStatement = isEmptyStatement;
	generated$3.isEmptyTypeAnnotation = isEmptyTypeAnnotation;
	generated$3.isEnumBody = isEnumBody;
	generated$3.isEnumBooleanBody = isEnumBooleanBody;
	generated$3.isEnumBooleanMember = isEnumBooleanMember;
	generated$3.isEnumDeclaration = isEnumDeclaration;
	generated$3.isEnumDefaultedMember = isEnumDefaultedMember;
	generated$3.isEnumMember = isEnumMember;
	generated$3.isEnumNumberBody = isEnumNumberBody;
	generated$3.isEnumNumberMember = isEnumNumberMember;
	generated$3.isEnumStringBody = isEnumStringBody;
	generated$3.isEnumStringMember = isEnumStringMember;
	generated$3.isEnumSymbolBody = isEnumSymbolBody;
	generated$3.isExistsTypeAnnotation = isExistsTypeAnnotation;
	generated$3.isExportAllDeclaration = isExportAllDeclaration;
	generated$3.isExportDeclaration = isExportDeclaration;
	generated$3.isExportDefaultDeclaration = isExportDefaultDeclaration;
	generated$3.isExportDefaultSpecifier = isExportDefaultSpecifier;
	generated$3.isExportNamedDeclaration = isExportNamedDeclaration;
	generated$3.isExportNamespaceSpecifier = isExportNamespaceSpecifier;
	generated$3.isExportSpecifier = isExportSpecifier;
	generated$3.isExpression = isExpression;
	generated$3.isExpressionStatement = isExpressionStatement;
	generated$3.isExpressionWrapper = isExpressionWrapper;
	generated$3.isFile = isFile;
	generated$3.isFlow = isFlow;
	generated$3.isFlowBaseAnnotation = isFlowBaseAnnotation;
	generated$3.isFlowDeclaration = isFlowDeclaration;
	generated$3.isFlowPredicate = isFlowPredicate;
	generated$3.isFlowType = isFlowType;
	generated$3.isFor = isFor;
	generated$3.isForInStatement = isForInStatement;
	generated$3.isForOfStatement = isForOfStatement;
	generated$3.isForStatement = isForStatement;
	generated$3.isForXStatement = isForXStatement;
	generated$3.isFunction = isFunction;
	generated$3.isFunctionDeclaration = isFunctionDeclaration;
	generated$3.isFunctionExpression = isFunctionExpression;
	generated$3.isFunctionParameter = isFunctionParameter;
	generated$3.isFunctionParent = isFunctionParent;
	generated$3.isFunctionTypeAnnotation = isFunctionTypeAnnotation;
	generated$3.isFunctionTypeParam = isFunctionTypeParam;
	generated$3.isGenericTypeAnnotation = isGenericTypeAnnotation;
	generated$3.isIdentifier = isIdentifier;
	generated$3.isIfStatement = isIfStatement;
	generated$3.isImmutable = isImmutable;
	generated$3.isImport = isImport;
	generated$3.isImportAttribute = isImportAttribute;
	generated$3.isImportDeclaration = isImportDeclaration;
	generated$3.isImportDefaultSpecifier = isImportDefaultSpecifier;
	generated$3.isImportExpression = isImportExpression;
	generated$3.isImportNamespaceSpecifier = isImportNamespaceSpecifier;
	generated$3.isImportOrExportDeclaration = isImportOrExportDeclaration;
	generated$3.isImportSpecifier = isImportSpecifier;
	generated$3.isIndexedAccessType = isIndexedAccessType;
	generated$3.isInferredPredicate = isInferredPredicate;
	generated$3.isInterfaceDeclaration = isInterfaceDeclaration;
	generated$3.isInterfaceExtends = isInterfaceExtends;
	generated$3.isInterfaceTypeAnnotation = isInterfaceTypeAnnotation;
	generated$3.isInterpreterDirective = isInterpreterDirective;
	generated$3.isIntersectionTypeAnnotation = isIntersectionTypeAnnotation;
	generated$3.isJSX = isJSX;
	generated$3.isJSXAttribute = isJSXAttribute;
	generated$3.isJSXClosingElement = isJSXClosingElement;
	generated$3.isJSXClosingFragment = isJSXClosingFragment;
	generated$3.isJSXElement = isJSXElement;
	generated$3.isJSXEmptyExpression = isJSXEmptyExpression;
	generated$3.isJSXExpressionContainer = isJSXExpressionContainer;
	generated$3.isJSXFragment = isJSXFragment;
	generated$3.isJSXIdentifier = isJSXIdentifier;
	generated$3.isJSXMemberExpression = isJSXMemberExpression;
	generated$3.isJSXNamespacedName = isJSXNamespacedName;
	generated$3.isJSXOpeningElement = isJSXOpeningElement;
	generated$3.isJSXOpeningFragment = isJSXOpeningFragment;
	generated$3.isJSXSpreadAttribute = isJSXSpreadAttribute;
	generated$3.isJSXSpreadChild = isJSXSpreadChild;
	generated$3.isJSXText = isJSXText;
	generated$3.isLVal = isLVal;
	generated$3.isLabeledStatement = isLabeledStatement;
	generated$3.isLiteral = isLiteral;
	generated$3.isLogicalExpression = isLogicalExpression;
	generated$3.isLoop = isLoop;
	generated$3.isMemberExpression = isMemberExpression;
	generated$3.isMetaProperty = isMetaProperty;
	generated$3.isMethod = isMethod;
	generated$3.isMiscellaneous = isMiscellaneous;
	generated$3.isMixedTypeAnnotation = isMixedTypeAnnotation;
	generated$3.isModuleDeclaration = isModuleDeclaration;
	generated$3.isModuleExpression = isModuleExpression;
	generated$3.isModuleSpecifier = isModuleSpecifier;
	generated$3.isNewExpression = isNewExpression;
	generated$3.isNoop = isNoop;
	generated$3.isNullLiteral = isNullLiteral;
	generated$3.isNullLiteralTypeAnnotation = isNullLiteralTypeAnnotation;
	generated$3.isNullableTypeAnnotation = isNullableTypeAnnotation;
	generated$3.isNumberLiteral = isNumberLiteral;
	generated$3.isNumberLiteralTypeAnnotation = isNumberLiteralTypeAnnotation;
	generated$3.isNumberTypeAnnotation = isNumberTypeAnnotation;
	generated$3.isNumericLiteral = isNumericLiteral;
	generated$3.isObjectExpression = isObjectExpression;
	generated$3.isObjectMember = isObjectMember;
	generated$3.isObjectMethod = isObjectMethod;
	generated$3.isObjectPattern = isObjectPattern;
	generated$3.isObjectProperty = isObjectProperty;
	generated$3.isObjectTypeAnnotation = isObjectTypeAnnotation;
	generated$3.isObjectTypeCallProperty = isObjectTypeCallProperty;
	generated$3.isObjectTypeIndexer = isObjectTypeIndexer;
	generated$3.isObjectTypeInternalSlot = isObjectTypeInternalSlot;
	generated$3.isObjectTypeProperty = isObjectTypeProperty;
	generated$3.isObjectTypeSpreadProperty = isObjectTypeSpreadProperty;
	generated$3.isOpaqueType = isOpaqueType;
	generated$3.isOptionalCallExpression = isOptionalCallExpression;
	generated$3.isOptionalIndexedAccessType = isOptionalIndexedAccessType;
	generated$3.isOptionalMemberExpression = isOptionalMemberExpression;
	generated$3.isParenthesizedExpression = isParenthesizedExpression;
	generated$3.isPattern = isPattern;
	generated$3.isPatternLike = isPatternLike;
	generated$3.isPipelineBareFunction = isPipelineBareFunction;
	generated$3.isPipelinePrimaryTopicReference = isPipelinePrimaryTopicReference;
	generated$3.isPipelineTopicExpression = isPipelineTopicExpression;
	generated$3.isPlaceholder = isPlaceholder;
	generated$3.isPrivate = isPrivate;
	generated$3.isPrivateName = isPrivateName;
	generated$3.isProgram = isProgram;
	generated$3.isProperty = isProperty;
	generated$3.isPureish = isPureish;
	generated$3.isQualifiedTypeIdentifier = isQualifiedTypeIdentifier;
	generated$3.isRecordExpression = isRecordExpression;
	generated$3.isRegExpLiteral = isRegExpLiteral;
	generated$3.isRegexLiteral = isRegexLiteral;
	generated$3.isRestElement = isRestElement;
	generated$3.isRestProperty = isRestProperty;
	generated$3.isReturnStatement = isReturnStatement;
	generated$3.isScopable = isScopable;
	generated$3.isSequenceExpression = isSequenceExpression;
	generated$3.isSpreadElement = isSpreadElement;
	generated$3.isSpreadProperty = isSpreadProperty;
	generated$3.isStandardized = isStandardized;
	generated$3.isStatement = isStatement;
	generated$3.isStaticBlock = isStaticBlock;
	generated$3.isStringLiteral = isStringLiteral;
	generated$3.isStringLiteralTypeAnnotation = isStringLiteralTypeAnnotation;
	generated$3.isStringTypeAnnotation = isStringTypeAnnotation;
	generated$3.isSuper = isSuper;
	generated$3.isSwitchCase = isSwitchCase;
	generated$3.isSwitchStatement = isSwitchStatement;
	generated$3.isSymbolTypeAnnotation = isSymbolTypeAnnotation;
	generated$3.isTSAnyKeyword = isTSAnyKeyword;
	generated$3.isTSArrayType = isTSArrayType;
	generated$3.isTSAsExpression = isTSAsExpression;
	generated$3.isTSBaseType = isTSBaseType;
	generated$3.isTSBigIntKeyword = isTSBigIntKeyword;
	generated$3.isTSBooleanKeyword = isTSBooleanKeyword;
	generated$3.isTSCallSignatureDeclaration = isTSCallSignatureDeclaration;
	generated$3.isTSConditionalType = isTSConditionalType;
	generated$3.isTSConstructSignatureDeclaration = isTSConstructSignatureDeclaration;
	generated$3.isTSConstructorType = isTSConstructorType;
	generated$3.isTSDeclareFunction = isTSDeclareFunction;
	generated$3.isTSDeclareMethod = isTSDeclareMethod;
	generated$3.isTSEntityName = isTSEntityName;
	generated$3.isTSEnumBody = isTSEnumBody;
	generated$3.isTSEnumDeclaration = isTSEnumDeclaration;
	generated$3.isTSEnumMember = isTSEnumMember;
	generated$3.isTSExportAssignment = isTSExportAssignment;
	generated$3.isTSExpressionWithTypeArguments = isTSExpressionWithTypeArguments;
	generated$3.isTSExternalModuleReference = isTSExternalModuleReference;
	generated$3.isTSFunctionType = isTSFunctionType;
	generated$3.isTSImportEqualsDeclaration = isTSImportEqualsDeclaration;
	generated$3.isTSImportType = isTSImportType;
	generated$3.isTSIndexSignature = isTSIndexSignature;
	generated$3.isTSIndexedAccessType = isTSIndexedAccessType;
	generated$3.isTSInferType = isTSInferType;
	generated$3.isTSInstantiationExpression = isTSInstantiationExpression;
	generated$3.isTSInterfaceBody = isTSInterfaceBody;
	generated$3.isTSInterfaceDeclaration = isTSInterfaceDeclaration;
	generated$3.isTSIntersectionType = isTSIntersectionType;
	generated$3.isTSIntrinsicKeyword = isTSIntrinsicKeyword;
	generated$3.isTSLiteralType = isTSLiteralType;
	generated$3.isTSMappedType = isTSMappedType;
	generated$3.isTSMethodSignature = isTSMethodSignature;
	generated$3.isTSModuleBlock = isTSModuleBlock;
	generated$3.isTSModuleDeclaration = isTSModuleDeclaration;
	generated$3.isTSNamedTupleMember = isTSNamedTupleMember;
	generated$3.isTSNamespaceExportDeclaration = isTSNamespaceExportDeclaration;
	generated$3.isTSNeverKeyword = isTSNeverKeyword;
	generated$3.isTSNonNullExpression = isTSNonNullExpression;
	generated$3.isTSNullKeyword = isTSNullKeyword;
	generated$3.isTSNumberKeyword = isTSNumberKeyword;
	generated$3.isTSObjectKeyword = isTSObjectKeyword;
	generated$3.isTSOptionalType = isTSOptionalType;
	generated$3.isTSParameterProperty = isTSParameterProperty;
	generated$3.isTSParenthesizedType = isTSParenthesizedType;
	generated$3.isTSPropertySignature = isTSPropertySignature;
	generated$3.isTSQualifiedName = isTSQualifiedName;
	generated$3.isTSRestType = isTSRestType;
	generated$3.isTSSatisfiesExpression = isTSSatisfiesExpression;
	generated$3.isTSStringKeyword = isTSStringKeyword;
	generated$3.isTSSymbolKeyword = isTSSymbolKeyword;
	generated$3.isTSTemplateLiteralType = isTSTemplateLiteralType;
	generated$3.isTSThisType = isTSThisType;
	generated$3.isTSTupleType = isTSTupleType;
	generated$3.isTSType = isTSType;
	generated$3.isTSTypeAliasDeclaration = isTSTypeAliasDeclaration;
	generated$3.isTSTypeAnnotation = isTSTypeAnnotation;
	generated$3.isTSTypeAssertion = isTSTypeAssertion;
	generated$3.isTSTypeElement = isTSTypeElement;
	generated$3.isTSTypeLiteral = isTSTypeLiteral;
	generated$3.isTSTypeOperator = isTSTypeOperator;
	generated$3.isTSTypeParameter = isTSTypeParameter;
	generated$3.isTSTypeParameterDeclaration = isTSTypeParameterDeclaration;
	generated$3.isTSTypeParameterInstantiation = isTSTypeParameterInstantiation;
	generated$3.isTSTypePredicate = isTSTypePredicate;
	generated$3.isTSTypeQuery = isTSTypeQuery;
	generated$3.isTSTypeReference = isTSTypeReference;
	generated$3.isTSUndefinedKeyword = isTSUndefinedKeyword;
	generated$3.isTSUnionType = isTSUnionType;
	generated$3.isTSUnknownKeyword = isTSUnknownKeyword;
	generated$3.isTSVoidKeyword = isTSVoidKeyword;
	generated$3.isTaggedTemplateExpression = isTaggedTemplateExpression;
	generated$3.isTemplateElement = isTemplateElement;
	generated$3.isTemplateLiteral = isTemplateLiteral;
	generated$3.isTerminatorless = isTerminatorless;
	generated$3.isThisExpression = isThisExpression;
	generated$3.isThisTypeAnnotation = isThisTypeAnnotation;
	generated$3.isThrowStatement = isThrowStatement;
	generated$3.isTopicReference = isTopicReference;
	generated$3.isTryStatement = isTryStatement;
	generated$3.isTupleExpression = isTupleExpression;
	generated$3.isTupleTypeAnnotation = isTupleTypeAnnotation;
	generated$3.isTypeAlias = isTypeAlias;
	generated$3.isTypeAnnotation = isTypeAnnotation;
	generated$3.isTypeCastExpression = isTypeCastExpression;
	generated$3.isTypeParameter = isTypeParameter;
	generated$3.isTypeParameterDeclaration = isTypeParameterDeclaration;
	generated$3.isTypeParameterInstantiation = isTypeParameterInstantiation;
	generated$3.isTypeScript = isTypeScript;
	generated$3.isTypeofTypeAnnotation = isTypeofTypeAnnotation;
	generated$3.isUnaryExpression = isUnaryExpression;
	generated$3.isUnaryLike = isUnaryLike;
	generated$3.isUnionTypeAnnotation = isUnionTypeAnnotation;
	generated$3.isUpdateExpression = isUpdateExpression;
	generated$3.isUserWhitespacable = isUserWhitespacable;
	generated$3.isV8IntrinsicIdentifier = isV8IntrinsicIdentifier;
	generated$3.isVariableDeclaration = isVariableDeclaration;
	generated$3.isVariableDeclarator = isVariableDeclarator;
	generated$3.isVariance = isVariance;
	generated$3.isVoidPattern = isVoidPattern;
	generated$3.isVoidTypeAnnotation = isVoidTypeAnnotation;
	generated$3.isWhile = isWhile;
	generated$3.isWhileStatement = isWhileStatement;
	generated$3.isWithStatement = isWithStatement;
	generated$3.isYieldExpression = isYieldExpression;
	var _shallowEqual = requireShallowEqual();
	var _deprecationWarning = requireDeprecationWarning();
	function isArrayExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ArrayExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isAssignmentExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "AssignmentExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isBinaryExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "BinaryExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isInterpreterDirective(node, opts) {
	  if (!node) return false;
	  if (node.type !== "InterpreterDirective") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDirective(node, opts) {
	  if (!node) return false;
	  if (node.type !== "Directive") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDirectiveLiteral(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DirectiveLiteral") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isBlockStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "BlockStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isBreakStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "BreakStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isCallExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "CallExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isCatchClause(node, opts) {
	  if (!node) return false;
	  if (node.type !== "CatchClause") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isConditionalExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ConditionalExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isContinueStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ContinueStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDebuggerStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DebuggerStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDoWhileStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DoWhileStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isEmptyStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "EmptyStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isExpressionStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ExpressionStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isFile(node, opts) {
	  if (!node) return false;
	  if (node.type !== "File") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isForInStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ForInStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isForStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ForStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isFunctionDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "FunctionDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isFunctionExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "FunctionExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isIdentifier(node, opts) {
	  if (!node) return false;
	  if (node.type !== "Identifier") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isIfStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "IfStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isLabeledStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "LabeledStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isStringLiteral(node, opts) {
	  if (!node) return false;
	  if (node.type !== "StringLiteral") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isNumericLiteral(node, opts) {
	  if (!node) return false;
	  if (node.type !== "NumericLiteral") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isNullLiteral(node, opts) {
	  if (!node) return false;
	  if (node.type !== "NullLiteral") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isBooleanLiteral(node, opts) {
	  if (!node) return false;
	  if (node.type !== "BooleanLiteral") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isRegExpLiteral(node, opts) {
	  if (!node) return false;
	  if (node.type !== "RegExpLiteral") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isLogicalExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "LogicalExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isMemberExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "MemberExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isNewExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "NewExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isProgram(node, opts) {
	  if (!node) return false;
	  if (node.type !== "Program") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isObjectExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ObjectExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isObjectMethod(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ObjectMethod") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isObjectProperty(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ObjectProperty") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isRestElement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "RestElement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isReturnStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ReturnStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isSequenceExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "SequenceExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isParenthesizedExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ParenthesizedExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isSwitchCase(node, opts) {
	  if (!node) return false;
	  if (node.type !== "SwitchCase") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isSwitchStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "SwitchStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isThisExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ThisExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isThrowStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ThrowStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTryStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TryStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isUnaryExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "UnaryExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isUpdateExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "UpdateExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isVariableDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "VariableDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isVariableDeclarator(node, opts) {
	  if (!node) return false;
	  if (node.type !== "VariableDeclarator") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isWhileStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "WhileStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isWithStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "WithStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isAssignmentPattern(node, opts) {
	  if (!node) return false;
	  if (node.type !== "AssignmentPattern") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isArrayPattern(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ArrayPattern") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isArrowFunctionExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ArrowFunctionExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isClassBody(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ClassBody") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isClassExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ClassExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isClassDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ClassDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isExportAllDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ExportAllDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isExportDefaultDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ExportDefaultDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isExportNamedDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ExportNamedDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isExportSpecifier(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ExportSpecifier") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isForOfStatement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ForOfStatement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isImportDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ImportDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isImportDefaultSpecifier(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ImportDefaultSpecifier") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isImportNamespaceSpecifier(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ImportNamespaceSpecifier") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isImportSpecifier(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ImportSpecifier") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isImportExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ImportExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isMetaProperty(node, opts) {
	  if (!node) return false;
	  if (node.type !== "MetaProperty") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isClassMethod(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ClassMethod") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isObjectPattern(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ObjectPattern") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isSpreadElement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "SpreadElement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isSuper(node, opts) {
	  if (!node) return false;
	  if (node.type !== "Super") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTaggedTemplateExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TaggedTemplateExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTemplateElement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TemplateElement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTemplateLiteral(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TemplateLiteral") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isYieldExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "YieldExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isAwaitExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "AwaitExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isImport(node, opts) {
	  if (!node) return false;
	  if (node.type !== "Import") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isBigIntLiteral(node, opts) {
	  if (!node) return false;
	  if (node.type !== "BigIntLiteral") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isExportNamespaceSpecifier(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ExportNamespaceSpecifier") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isOptionalMemberExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "OptionalMemberExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isOptionalCallExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "OptionalCallExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isClassProperty(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ClassProperty") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isClassAccessorProperty(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ClassAccessorProperty") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isClassPrivateProperty(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ClassPrivateProperty") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isClassPrivateMethod(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ClassPrivateMethod") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isPrivateName(node, opts) {
	  if (!node) return false;
	  if (node.type !== "PrivateName") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isStaticBlock(node, opts) {
	  if (!node) return false;
	  if (node.type !== "StaticBlock") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isImportAttribute(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ImportAttribute") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isAnyTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "AnyTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isArrayTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ArrayTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isBooleanTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "BooleanTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isBooleanLiteralTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "BooleanLiteralTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isNullLiteralTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "NullLiteralTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isClassImplements(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ClassImplements") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDeclareClass(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DeclareClass") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDeclareFunction(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DeclareFunction") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDeclareInterface(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DeclareInterface") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDeclareModule(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DeclareModule") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDeclareModuleExports(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DeclareModuleExports") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDeclareTypeAlias(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DeclareTypeAlias") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDeclareOpaqueType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DeclareOpaqueType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDeclareVariable(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DeclareVariable") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDeclareExportDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DeclareExportDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDeclareExportAllDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DeclareExportAllDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDeclaredPredicate(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DeclaredPredicate") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isExistsTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ExistsTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isFunctionTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "FunctionTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isFunctionTypeParam(node, opts) {
	  if (!node) return false;
	  if (node.type !== "FunctionTypeParam") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isGenericTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "GenericTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isInferredPredicate(node, opts) {
	  if (!node) return false;
	  if (node.type !== "InferredPredicate") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isInterfaceExtends(node, opts) {
	  if (!node) return false;
	  if (node.type !== "InterfaceExtends") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isInterfaceDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "InterfaceDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isInterfaceTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "InterfaceTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isIntersectionTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "IntersectionTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isMixedTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "MixedTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isEmptyTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "EmptyTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isNullableTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "NullableTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isNumberLiteralTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "NumberLiteralTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isNumberTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "NumberTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isObjectTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ObjectTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isObjectTypeInternalSlot(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ObjectTypeInternalSlot") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isObjectTypeCallProperty(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ObjectTypeCallProperty") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isObjectTypeIndexer(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ObjectTypeIndexer") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isObjectTypeProperty(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ObjectTypeProperty") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isObjectTypeSpreadProperty(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ObjectTypeSpreadProperty") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isOpaqueType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "OpaqueType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isQualifiedTypeIdentifier(node, opts) {
	  if (!node) return false;
	  if (node.type !== "QualifiedTypeIdentifier") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isStringLiteralTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "StringLiteralTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isStringTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "StringTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isSymbolTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "SymbolTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isThisTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ThisTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTupleTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TupleTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTypeofTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TypeofTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTypeAlias(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TypeAlias") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTypeCastExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TypeCastExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTypeParameter(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TypeParameter") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTypeParameterDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TypeParameterDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTypeParameterInstantiation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TypeParameterInstantiation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isUnionTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "UnionTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isVariance(node, opts) {
	  if (!node) return false;
	  if (node.type !== "Variance") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isVoidTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "VoidTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isEnumDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "EnumDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isEnumBooleanBody(node, opts) {
	  if (!node) return false;
	  if (node.type !== "EnumBooleanBody") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isEnumNumberBody(node, opts) {
	  if (!node) return false;
	  if (node.type !== "EnumNumberBody") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isEnumStringBody(node, opts) {
	  if (!node) return false;
	  if (node.type !== "EnumStringBody") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isEnumSymbolBody(node, opts) {
	  if (!node) return false;
	  if (node.type !== "EnumSymbolBody") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isEnumBooleanMember(node, opts) {
	  if (!node) return false;
	  if (node.type !== "EnumBooleanMember") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isEnumNumberMember(node, opts) {
	  if (!node) return false;
	  if (node.type !== "EnumNumberMember") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isEnumStringMember(node, opts) {
	  if (!node) return false;
	  if (node.type !== "EnumStringMember") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isEnumDefaultedMember(node, opts) {
	  if (!node) return false;
	  if (node.type !== "EnumDefaultedMember") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isIndexedAccessType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "IndexedAccessType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isOptionalIndexedAccessType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "OptionalIndexedAccessType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXAttribute(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXAttribute") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXClosingElement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXClosingElement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXElement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXElement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXEmptyExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXEmptyExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXExpressionContainer(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXExpressionContainer") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXSpreadChild(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXSpreadChild") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXIdentifier(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXIdentifier") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXMemberExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXMemberExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXNamespacedName(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXNamespacedName") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXOpeningElement(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXOpeningElement") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXSpreadAttribute(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXSpreadAttribute") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXText(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXText") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXFragment(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXFragment") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXOpeningFragment(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXOpeningFragment") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSXClosingFragment(node, opts) {
	  if (!node) return false;
	  if (node.type !== "JSXClosingFragment") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isNoop(node, opts) {
	  if (!node) return false;
	  if (node.type !== "Noop") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isPlaceholder(node, opts) {
	  if (!node) return false;
	  if (node.type !== "Placeholder") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isV8IntrinsicIdentifier(node, opts) {
	  if (!node) return false;
	  if (node.type !== "V8IntrinsicIdentifier") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isArgumentPlaceholder(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ArgumentPlaceholder") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isBindExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "BindExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDecorator(node, opts) {
	  if (!node) return false;
	  if (node.type !== "Decorator") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDoExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DoExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isExportDefaultSpecifier(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ExportDefaultSpecifier") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isRecordExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "RecordExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTupleExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TupleExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDecimalLiteral(node, opts) {
	  if (!node) return false;
	  if (node.type !== "DecimalLiteral") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isModuleExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "ModuleExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTopicReference(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TopicReference") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isPipelineTopicExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "PipelineTopicExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isPipelineBareFunction(node, opts) {
	  if (!node) return false;
	  if (node.type !== "PipelineBareFunction") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isPipelinePrimaryTopicReference(node, opts) {
	  if (!node) return false;
	  if (node.type !== "PipelinePrimaryTopicReference") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isVoidPattern(node, opts) {
	  if (!node) return false;
	  if (node.type !== "VoidPattern") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSParameterProperty(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSParameterProperty") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSDeclareFunction(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSDeclareFunction") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSDeclareMethod(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSDeclareMethod") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSQualifiedName(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSQualifiedName") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSCallSignatureDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSCallSignatureDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSConstructSignatureDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSConstructSignatureDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSPropertySignature(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSPropertySignature") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSMethodSignature(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSMethodSignature") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSIndexSignature(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSIndexSignature") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSAnyKeyword(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSAnyKeyword") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSBooleanKeyword(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSBooleanKeyword") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSBigIntKeyword(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSBigIntKeyword") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSIntrinsicKeyword(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSIntrinsicKeyword") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSNeverKeyword(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSNeverKeyword") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSNullKeyword(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSNullKeyword") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSNumberKeyword(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSNumberKeyword") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSObjectKeyword(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSObjectKeyword") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSStringKeyword(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSStringKeyword") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSSymbolKeyword(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSSymbolKeyword") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSUndefinedKeyword(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSUndefinedKeyword") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSUnknownKeyword(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSUnknownKeyword") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSVoidKeyword(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSVoidKeyword") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSThisType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSThisType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSFunctionType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSFunctionType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSConstructorType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSConstructorType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSTypeReference(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSTypeReference") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSTypePredicate(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSTypePredicate") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSTypeQuery(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSTypeQuery") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSTypeLiteral(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSTypeLiteral") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSArrayType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSArrayType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSTupleType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSTupleType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSOptionalType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSOptionalType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSRestType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSRestType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSNamedTupleMember(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSNamedTupleMember") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSUnionType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSUnionType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSIntersectionType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSIntersectionType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSConditionalType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSConditionalType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSInferType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSInferType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSParenthesizedType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSParenthesizedType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSTypeOperator(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSTypeOperator") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSIndexedAccessType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSIndexedAccessType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSMappedType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSMappedType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSTemplateLiteralType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSTemplateLiteralType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSLiteralType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSLiteralType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSExpressionWithTypeArguments(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSExpressionWithTypeArguments") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSInterfaceDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSInterfaceDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSInterfaceBody(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSInterfaceBody") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSTypeAliasDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSTypeAliasDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSInstantiationExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSInstantiationExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSAsExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSAsExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSSatisfiesExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSSatisfiesExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSTypeAssertion(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSTypeAssertion") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSEnumBody(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSEnumBody") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSEnumDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSEnumDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSEnumMember(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSEnumMember") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSModuleDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSModuleDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSModuleBlock(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSModuleBlock") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSImportType(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSImportType") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSImportEqualsDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSImportEqualsDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSExternalModuleReference(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSExternalModuleReference") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSNonNullExpression(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSNonNullExpression") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSExportAssignment(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSExportAssignment") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSNamespaceExportDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSNamespaceExportDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSTypeAnnotation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSTypeAnnotation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSTypeParameterInstantiation(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSTypeParameterInstantiation") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSTypeParameterDeclaration(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSTypeParameterDeclaration") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSTypeParameter(node, opts) {
	  if (!node) return false;
	  if (node.type !== "TSTypeParameter") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isStandardized(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ArrayExpression":
	    case "AssignmentExpression":
	    case "BinaryExpression":
	    case "InterpreterDirective":
	    case "Directive":
	    case "DirectiveLiteral":
	    case "BlockStatement":
	    case "BreakStatement":
	    case "CallExpression":
	    case "CatchClause":
	    case "ConditionalExpression":
	    case "ContinueStatement":
	    case "DebuggerStatement":
	    case "DoWhileStatement":
	    case "EmptyStatement":
	    case "ExpressionStatement":
	    case "File":
	    case "ForInStatement":
	    case "ForStatement":
	    case "FunctionDeclaration":
	    case "FunctionExpression":
	    case "Identifier":
	    case "IfStatement":
	    case "LabeledStatement":
	    case "StringLiteral":
	    case "NumericLiteral":
	    case "NullLiteral":
	    case "BooleanLiteral":
	    case "RegExpLiteral":
	    case "LogicalExpression":
	    case "MemberExpression":
	    case "NewExpression":
	    case "Program":
	    case "ObjectExpression":
	    case "ObjectMethod":
	    case "ObjectProperty":
	    case "RestElement":
	    case "ReturnStatement":
	    case "SequenceExpression":
	    case "ParenthesizedExpression":
	    case "SwitchCase":
	    case "SwitchStatement":
	    case "ThisExpression":
	    case "ThrowStatement":
	    case "TryStatement":
	    case "UnaryExpression":
	    case "UpdateExpression":
	    case "VariableDeclaration":
	    case "VariableDeclarator":
	    case "WhileStatement":
	    case "WithStatement":
	    case "AssignmentPattern":
	    case "ArrayPattern":
	    case "ArrowFunctionExpression":
	    case "ClassBody":
	    case "ClassExpression":
	    case "ClassDeclaration":
	    case "ExportAllDeclaration":
	    case "ExportDefaultDeclaration":
	    case "ExportNamedDeclaration":
	    case "ExportSpecifier":
	    case "ForOfStatement":
	    case "ImportDeclaration":
	    case "ImportDefaultSpecifier":
	    case "ImportNamespaceSpecifier":
	    case "ImportSpecifier":
	    case "ImportExpression":
	    case "MetaProperty":
	    case "ClassMethod":
	    case "ObjectPattern":
	    case "SpreadElement":
	    case "Super":
	    case "TaggedTemplateExpression":
	    case "TemplateElement":
	    case "TemplateLiteral":
	    case "YieldExpression":
	    case "AwaitExpression":
	    case "Import":
	    case "BigIntLiteral":
	    case "ExportNamespaceSpecifier":
	    case "OptionalMemberExpression":
	    case "OptionalCallExpression":
	    case "ClassProperty":
	    case "ClassAccessorProperty":
	    case "ClassPrivateProperty":
	    case "ClassPrivateMethod":
	    case "PrivateName":
	    case "StaticBlock":
	    case "ImportAttribute":
	      break;
	    case "Placeholder":
	      switch (node.expectedNode) {
	        case "Identifier":
	        case "StringLiteral":
	        case "BlockStatement":
	        case "ClassBody":
	          break;
	        default:
	          return false;
	      }
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isExpression(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ArrayExpression":
	    case "AssignmentExpression":
	    case "BinaryExpression":
	    case "CallExpression":
	    case "ConditionalExpression":
	    case "FunctionExpression":
	    case "Identifier":
	    case "StringLiteral":
	    case "NumericLiteral":
	    case "NullLiteral":
	    case "BooleanLiteral":
	    case "RegExpLiteral":
	    case "LogicalExpression":
	    case "MemberExpression":
	    case "NewExpression":
	    case "ObjectExpression":
	    case "SequenceExpression":
	    case "ParenthesizedExpression":
	    case "ThisExpression":
	    case "UnaryExpression":
	    case "UpdateExpression":
	    case "ArrowFunctionExpression":
	    case "ClassExpression":
	    case "ImportExpression":
	    case "MetaProperty":
	    case "Super":
	    case "TaggedTemplateExpression":
	    case "TemplateLiteral":
	    case "YieldExpression":
	    case "AwaitExpression":
	    case "Import":
	    case "BigIntLiteral":
	    case "OptionalMemberExpression":
	    case "OptionalCallExpression":
	    case "TypeCastExpression":
	    case "JSXElement":
	    case "JSXFragment":
	    case "BindExpression":
	    case "DoExpression":
	    case "RecordExpression":
	    case "TupleExpression":
	    case "DecimalLiteral":
	    case "ModuleExpression":
	    case "TopicReference":
	    case "PipelineTopicExpression":
	    case "PipelineBareFunction":
	    case "PipelinePrimaryTopicReference":
	    case "TSInstantiationExpression":
	    case "TSAsExpression":
	    case "TSSatisfiesExpression":
	    case "TSTypeAssertion":
	    case "TSNonNullExpression":
	      break;
	    case "Placeholder":
	      switch (node.expectedNode) {
	        case "Expression":
	        case "Identifier":
	        case "StringLiteral":
	          break;
	        default:
	          return false;
	      }
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isBinary(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "BinaryExpression":
	    case "LogicalExpression":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isScopable(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "BlockStatement":
	    case "CatchClause":
	    case "DoWhileStatement":
	    case "ForInStatement":
	    case "ForStatement":
	    case "FunctionDeclaration":
	    case "FunctionExpression":
	    case "Program":
	    case "ObjectMethod":
	    case "SwitchStatement":
	    case "WhileStatement":
	    case "ArrowFunctionExpression":
	    case "ClassExpression":
	    case "ClassDeclaration":
	    case "ForOfStatement":
	    case "ClassMethod":
	    case "ClassPrivateMethod":
	    case "StaticBlock":
	    case "TSModuleBlock":
	      break;
	    case "Placeholder":
	      if (node.expectedNode === "BlockStatement") break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isBlockParent(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "BlockStatement":
	    case "CatchClause":
	    case "DoWhileStatement":
	    case "ForInStatement":
	    case "ForStatement":
	    case "FunctionDeclaration":
	    case "FunctionExpression":
	    case "Program":
	    case "ObjectMethod":
	    case "SwitchStatement":
	    case "WhileStatement":
	    case "ArrowFunctionExpression":
	    case "ForOfStatement":
	    case "ClassMethod":
	    case "ClassPrivateMethod":
	    case "StaticBlock":
	    case "TSModuleBlock":
	      break;
	    case "Placeholder":
	      if (node.expectedNode === "BlockStatement") break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isBlock(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "BlockStatement":
	    case "Program":
	    case "TSModuleBlock":
	      break;
	    case "Placeholder":
	      if (node.expectedNode === "BlockStatement") break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isStatement(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "BlockStatement":
	    case "BreakStatement":
	    case "ContinueStatement":
	    case "DebuggerStatement":
	    case "DoWhileStatement":
	    case "EmptyStatement":
	    case "ExpressionStatement":
	    case "ForInStatement":
	    case "ForStatement":
	    case "FunctionDeclaration":
	    case "IfStatement":
	    case "LabeledStatement":
	    case "ReturnStatement":
	    case "SwitchStatement":
	    case "ThrowStatement":
	    case "TryStatement":
	    case "VariableDeclaration":
	    case "WhileStatement":
	    case "WithStatement":
	    case "ClassDeclaration":
	    case "ExportAllDeclaration":
	    case "ExportDefaultDeclaration":
	    case "ExportNamedDeclaration":
	    case "ForOfStatement":
	    case "ImportDeclaration":
	    case "DeclareClass":
	    case "DeclareFunction":
	    case "DeclareInterface":
	    case "DeclareModule":
	    case "DeclareModuleExports":
	    case "DeclareTypeAlias":
	    case "DeclareOpaqueType":
	    case "DeclareVariable":
	    case "DeclareExportDeclaration":
	    case "DeclareExportAllDeclaration":
	    case "InterfaceDeclaration":
	    case "OpaqueType":
	    case "TypeAlias":
	    case "EnumDeclaration":
	    case "TSDeclareFunction":
	    case "TSInterfaceDeclaration":
	    case "TSTypeAliasDeclaration":
	    case "TSEnumDeclaration":
	    case "TSModuleDeclaration":
	    case "TSImportEqualsDeclaration":
	    case "TSExportAssignment":
	    case "TSNamespaceExportDeclaration":
	      break;
	    case "Placeholder":
	      switch (node.expectedNode) {
	        case "Statement":
	        case "Declaration":
	        case "BlockStatement":
	          break;
	        default:
	          return false;
	      }
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTerminatorless(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "BreakStatement":
	    case "ContinueStatement":
	    case "ReturnStatement":
	    case "ThrowStatement":
	    case "YieldExpression":
	    case "AwaitExpression":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isCompletionStatement(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "BreakStatement":
	    case "ContinueStatement":
	    case "ReturnStatement":
	    case "ThrowStatement":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isConditional(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ConditionalExpression":
	    case "IfStatement":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isLoop(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "DoWhileStatement":
	    case "ForInStatement":
	    case "ForStatement":
	    case "WhileStatement":
	    case "ForOfStatement":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isWhile(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "DoWhileStatement":
	    case "WhileStatement":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isExpressionWrapper(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ExpressionStatement":
	    case "ParenthesizedExpression":
	    case "TypeCastExpression":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isFor(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ForInStatement":
	    case "ForStatement":
	    case "ForOfStatement":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isForXStatement(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ForInStatement":
	    case "ForOfStatement":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isFunction(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "FunctionDeclaration":
	    case "FunctionExpression":
	    case "ObjectMethod":
	    case "ArrowFunctionExpression":
	    case "ClassMethod":
	    case "ClassPrivateMethod":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isFunctionParent(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "FunctionDeclaration":
	    case "FunctionExpression":
	    case "ObjectMethod":
	    case "ArrowFunctionExpression":
	    case "ClassMethod":
	    case "ClassPrivateMethod":
	    case "StaticBlock":
	    case "TSModuleBlock":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isPureish(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "FunctionDeclaration":
	    case "FunctionExpression":
	    case "StringLiteral":
	    case "NumericLiteral":
	    case "NullLiteral":
	    case "BooleanLiteral":
	    case "RegExpLiteral":
	    case "ArrowFunctionExpression":
	    case "BigIntLiteral":
	    case "DecimalLiteral":
	      break;
	    case "Placeholder":
	      if (node.expectedNode === "StringLiteral") break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isDeclaration(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "FunctionDeclaration":
	    case "VariableDeclaration":
	    case "ClassDeclaration":
	    case "ExportAllDeclaration":
	    case "ExportDefaultDeclaration":
	    case "ExportNamedDeclaration":
	    case "ImportDeclaration":
	    case "DeclareClass":
	    case "DeclareFunction":
	    case "DeclareInterface":
	    case "DeclareModule":
	    case "DeclareModuleExports":
	    case "DeclareTypeAlias":
	    case "DeclareOpaqueType":
	    case "DeclareVariable":
	    case "DeclareExportDeclaration":
	    case "DeclareExportAllDeclaration":
	    case "InterfaceDeclaration":
	    case "OpaqueType":
	    case "TypeAlias":
	    case "EnumDeclaration":
	    case "TSDeclareFunction":
	    case "TSInterfaceDeclaration":
	    case "TSTypeAliasDeclaration":
	    case "TSEnumDeclaration":
	    case "TSModuleDeclaration":
	    case "TSImportEqualsDeclaration":
	      break;
	    case "Placeholder":
	      if (node.expectedNode === "Declaration") break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isFunctionParameter(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "Identifier":
	    case "RestElement":
	    case "AssignmentPattern":
	    case "ArrayPattern":
	    case "ObjectPattern":
	    case "VoidPattern":
	      break;
	    case "Placeholder":
	      if (node.expectedNode === "Identifier") break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isPatternLike(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "Identifier":
	    case "MemberExpression":
	    case "RestElement":
	    case "AssignmentPattern":
	    case "ArrayPattern":
	    case "ObjectPattern":
	    case "VoidPattern":
	    case "TSAsExpression":
	    case "TSSatisfiesExpression":
	    case "TSTypeAssertion":
	    case "TSNonNullExpression":
	      break;
	    case "Placeholder":
	      switch (node.expectedNode) {
	        case "Pattern":
	        case "Identifier":
	          break;
	        default:
	          return false;
	      }
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isLVal(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "Identifier":
	    case "MemberExpression":
	    case "RestElement":
	    case "AssignmentPattern":
	    case "ArrayPattern":
	    case "ObjectPattern":
	    case "TSParameterProperty":
	    case "TSAsExpression":
	    case "TSSatisfiesExpression":
	    case "TSTypeAssertion":
	    case "TSNonNullExpression":
	      break;
	    case "Placeholder":
	      switch (node.expectedNode) {
	        case "Pattern":
	        case "Identifier":
	          break;
	        default:
	          return false;
	      }
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSEntityName(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "Identifier":
	    case "TSQualifiedName":
	      break;
	    case "Placeholder":
	      if (node.expectedNode === "Identifier") break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isLiteral(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "StringLiteral":
	    case "NumericLiteral":
	    case "NullLiteral":
	    case "BooleanLiteral":
	    case "RegExpLiteral":
	    case "TemplateLiteral":
	    case "BigIntLiteral":
	    case "DecimalLiteral":
	      break;
	    case "Placeholder":
	      if (node.expectedNode === "StringLiteral") break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isImmutable(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "StringLiteral":
	    case "NumericLiteral":
	    case "NullLiteral":
	    case "BooleanLiteral":
	    case "BigIntLiteral":
	    case "JSXAttribute":
	    case "JSXClosingElement":
	    case "JSXElement":
	    case "JSXExpressionContainer":
	    case "JSXSpreadChild":
	    case "JSXOpeningElement":
	    case "JSXText":
	    case "JSXFragment":
	    case "JSXOpeningFragment":
	    case "JSXClosingFragment":
	    case "DecimalLiteral":
	      break;
	    case "Placeholder":
	      if (node.expectedNode === "StringLiteral") break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isUserWhitespacable(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ObjectMethod":
	    case "ObjectProperty":
	    case "ObjectTypeInternalSlot":
	    case "ObjectTypeCallProperty":
	    case "ObjectTypeIndexer":
	    case "ObjectTypeProperty":
	    case "ObjectTypeSpreadProperty":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isMethod(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ObjectMethod":
	    case "ClassMethod":
	    case "ClassPrivateMethod":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isObjectMember(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ObjectMethod":
	    case "ObjectProperty":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isProperty(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ObjectProperty":
	    case "ClassProperty":
	    case "ClassAccessorProperty":
	    case "ClassPrivateProperty":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isUnaryLike(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "UnaryExpression":
	    case "SpreadElement":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isPattern(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "AssignmentPattern":
	    case "ArrayPattern":
	    case "ObjectPattern":
	    case "VoidPattern":
	      break;
	    case "Placeholder":
	      if (node.expectedNode === "Pattern") break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isClass(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ClassExpression":
	    case "ClassDeclaration":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isImportOrExportDeclaration(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ExportAllDeclaration":
	    case "ExportDefaultDeclaration":
	    case "ExportNamedDeclaration":
	    case "ImportDeclaration":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isExportDeclaration(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ExportAllDeclaration":
	    case "ExportDefaultDeclaration":
	    case "ExportNamedDeclaration":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isModuleSpecifier(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ExportSpecifier":
	    case "ImportDefaultSpecifier":
	    case "ImportNamespaceSpecifier":
	    case "ImportSpecifier":
	    case "ExportNamespaceSpecifier":
	    case "ExportDefaultSpecifier":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isAccessor(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ClassAccessorProperty":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isPrivate(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "ClassPrivateProperty":
	    case "ClassPrivateMethod":
	    case "PrivateName":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isFlow(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "AnyTypeAnnotation":
	    case "ArrayTypeAnnotation":
	    case "BooleanTypeAnnotation":
	    case "BooleanLiteralTypeAnnotation":
	    case "NullLiteralTypeAnnotation":
	    case "ClassImplements":
	    case "DeclareClass":
	    case "DeclareFunction":
	    case "DeclareInterface":
	    case "DeclareModule":
	    case "DeclareModuleExports":
	    case "DeclareTypeAlias":
	    case "DeclareOpaqueType":
	    case "DeclareVariable":
	    case "DeclareExportDeclaration":
	    case "DeclareExportAllDeclaration":
	    case "DeclaredPredicate":
	    case "ExistsTypeAnnotation":
	    case "FunctionTypeAnnotation":
	    case "FunctionTypeParam":
	    case "GenericTypeAnnotation":
	    case "InferredPredicate":
	    case "InterfaceExtends":
	    case "InterfaceDeclaration":
	    case "InterfaceTypeAnnotation":
	    case "IntersectionTypeAnnotation":
	    case "MixedTypeAnnotation":
	    case "EmptyTypeAnnotation":
	    case "NullableTypeAnnotation":
	    case "NumberLiteralTypeAnnotation":
	    case "NumberTypeAnnotation":
	    case "ObjectTypeAnnotation":
	    case "ObjectTypeInternalSlot":
	    case "ObjectTypeCallProperty":
	    case "ObjectTypeIndexer":
	    case "ObjectTypeProperty":
	    case "ObjectTypeSpreadProperty":
	    case "OpaqueType":
	    case "QualifiedTypeIdentifier":
	    case "StringLiteralTypeAnnotation":
	    case "StringTypeAnnotation":
	    case "SymbolTypeAnnotation":
	    case "ThisTypeAnnotation":
	    case "TupleTypeAnnotation":
	    case "TypeofTypeAnnotation":
	    case "TypeAlias":
	    case "TypeAnnotation":
	    case "TypeCastExpression":
	    case "TypeParameter":
	    case "TypeParameterDeclaration":
	    case "TypeParameterInstantiation":
	    case "UnionTypeAnnotation":
	    case "Variance":
	    case "VoidTypeAnnotation":
	    case "EnumDeclaration":
	    case "EnumBooleanBody":
	    case "EnumNumberBody":
	    case "EnumStringBody":
	    case "EnumSymbolBody":
	    case "EnumBooleanMember":
	    case "EnumNumberMember":
	    case "EnumStringMember":
	    case "EnumDefaultedMember":
	    case "IndexedAccessType":
	    case "OptionalIndexedAccessType":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isFlowType(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "AnyTypeAnnotation":
	    case "ArrayTypeAnnotation":
	    case "BooleanTypeAnnotation":
	    case "BooleanLiteralTypeAnnotation":
	    case "NullLiteralTypeAnnotation":
	    case "ExistsTypeAnnotation":
	    case "FunctionTypeAnnotation":
	    case "GenericTypeAnnotation":
	    case "InterfaceTypeAnnotation":
	    case "IntersectionTypeAnnotation":
	    case "MixedTypeAnnotation":
	    case "EmptyTypeAnnotation":
	    case "NullableTypeAnnotation":
	    case "NumberLiteralTypeAnnotation":
	    case "NumberTypeAnnotation":
	    case "ObjectTypeAnnotation":
	    case "StringLiteralTypeAnnotation":
	    case "StringTypeAnnotation":
	    case "SymbolTypeAnnotation":
	    case "ThisTypeAnnotation":
	    case "TupleTypeAnnotation":
	    case "TypeofTypeAnnotation":
	    case "UnionTypeAnnotation":
	    case "VoidTypeAnnotation":
	    case "IndexedAccessType":
	    case "OptionalIndexedAccessType":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isFlowBaseAnnotation(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "AnyTypeAnnotation":
	    case "BooleanTypeAnnotation":
	    case "NullLiteralTypeAnnotation":
	    case "MixedTypeAnnotation":
	    case "EmptyTypeAnnotation":
	    case "NumberTypeAnnotation":
	    case "StringTypeAnnotation":
	    case "SymbolTypeAnnotation":
	    case "ThisTypeAnnotation":
	    case "VoidTypeAnnotation":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isFlowDeclaration(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "DeclareClass":
	    case "DeclareFunction":
	    case "DeclareInterface":
	    case "DeclareModule":
	    case "DeclareModuleExports":
	    case "DeclareTypeAlias":
	    case "DeclareOpaqueType":
	    case "DeclareVariable":
	    case "DeclareExportDeclaration":
	    case "DeclareExportAllDeclaration":
	    case "InterfaceDeclaration":
	    case "OpaqueType":
	    case "TypeAlias":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isFlowPredicate(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "DeclaredPredicate":
	    case "InferredPredicate":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isEnumBody(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "EnumBooleanBody":
	    case "EnumNumberBody":
	    case "EnumStringBody":
	    case "EnumSymbolBody":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isEnumMember(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "EnumBooleanMember":
	    case "EnumNumberMember":
	    case "EnumStringMember":
	    case "EnumDefaultedMember":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isJSX(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "JSXAttribute":
	    case "JSXClosingElement":
	    case "JSXElement":
	    case "JSXEmptyExpression":
	    case "JSXExpressionContainer":
	    case "JSXSpreadChild":
	    case "JSXIdentifier":
	    case "JSXMemberExpression":
	    case "JSXNamespacedName":
	    case "JSXOpeningElement":
	    case "JSXSpreadAttribute":
	    case "JSXText":
	    case "JSXFragment":
	    case "JSXOpeningFragment":
	    case "JSXClosingFragment":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isMiscellaneous(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "Noop":
	    case "Placeholder":
	    case "V8IntrinsicIdentifier":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTypeScript(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "TSParameterProperty":
	    case "TSDeclareFunction":
	    case "TSDeclareMethod":
	    case "TSQualifiedName":
	    case "TSCallSignatureDeclaration":
	    case "TSConstructSignatureDeclaration":
	    case "TSPropertySignature":
	    case "TSMethodSignature":
	    case "TSIndexSignature":
	    case "TSAnyKeyword":
	    case "TSBooleanKeyword":
	    case "TSBigIntKeyword":
	    case "TSIntrinsicKeyword":
	    case "TSNeverKeyword":
	    case "TSNullKeyword":
	    case "TSNumberKeyword":
	    case "TSObjectKeyword":
	    case "TSStringKeyword":
	    case "TSSymbolKeyword":
	    case "TSUndefinedKeyword":
	    case "TSUnknownKeyword":
	    case "TSVoidKeyword":
	    case "TSThisType":
	    case "TSFunctionType":
	    case "TSConstructorType":
	    case "TSTypeReference":
	    case "TSTypePredicate":
	    case "TSTypeQuery":
	    case "TSTypeLiteral":
	    case "TSArrayType":
	    case "TSTupleType":
	    case "TSOptionalType":
	    case "TSRestType":
	    case "TSNamedTupleMember":
	    case "TSUnionType":
	    case "TSIntersectionType":
	    case "TSConditionalType":
	    case "TSInferType":
	    case "TSParenthesizedType":
	    case "TSTypeOperator":
	    case "TSIndexedAccessType":
	    case "TSMappedType":
	    case "TSTemplateLiteralType":
	    case "TSLiteralType":
	    case "TSExpressionWithTypeArguments":
	    case "TSInterfaceDeclaration":
	    case "TSInterfaceBody":
	    case "TSTypeAliasDeclaration":
	    case "TSInstantiationExpression":
	    case "TSAsExpression":
	    case "TSSatisfiesExpression":
	    case "TSTypeAssertion":
	    case "TSEnumBody":
	    case "TSEnumDeclaration":
	    case "TSEnumMember":
	    case "TSModuleDeclaration":
	    case "TSModuleBlock":
	    case "TSImportType":
	    case "TSImportEqualsDeclaration":
	    case "TSExternalModuleReference":
	    case "TSNonNullExpression":
	    case "TSExportAssignment":
	    case "TSNamespaceExportDeclaration":
	    case "TSTypeAnnotation":
	    case "TSTypeParameterInstantiation":
	    case "TSTypeParameterDeclaration":
	    case "TSTypeParameter":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSTypeElement(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "TSCallSignatureDeclaration":
	    case "TSConstructSignatureDeclaration":
	    case "TSPropertySignature":
	    case "TSMethodSignature":
	    case "TSIndexSignature":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSType(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "TSAnyKeyword":
	    case "TSBooleanKeyword":
	    case "TSBigIntKeyword":
	    case "TSIntrinsicKeyword":
	    case "TSNeverKeyword":
	    case "TSNullKeyword":
	    case "TSNumberKeyword":
	    case "TSObjectKeyword":
	    case "TSStringKeyword":
	    case "TSSymbolKeyword":
	    case "TSUndefinedKeyword":
	    case "TSUnknownKeyword":
	    case "TSVoidKeyword":
	    case "TSThisType":
	    case "TSFunctionType":
	    case "TSConstructorType":
	    case "TSTypeReference":
	    case "TSTypePredicate":
	    case "TSTypeQuery":
	    case "TSTypeLiteral":
	    case "TSArrayType":
	    case "TSTupleType":
	    case "TSOptionalType":
	    case "TSRestType":
	    case "TSUnionType":
	    case "TSIntersectionType":
	    case "TSConditionalType":
	    case "TSInferType":
	    case "TSParenthesizedType":
	    case "TSTypeOperator":
	    case "TSIndexedAccessType":
	    case "TSMappedType":
	    case "TSTemplateLiteralType":
	    case "TSLiteralType":
	    case "TSExpressionWithTypeArguments":
	    case "TSImportType":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isTSBaseType(node, opts) {
	  if (!node) return false;
	  switch (node.type) {
	    case "TSAnyKeyword":
	    case "TSBooleanKeyword":
	    case "TSBigIntKeyword":
	    case "TSIntrinsicKeyword":
	    case "TSNeverKeyword":
	    case "TSNullKeyword":
	    case "TSNumberKeyword":
	    case "TSObjectKeyword":
	    case "TSStringKeyword":
	    case "TSSymbolKeyword":
	    case "TSUndefinedKeyword":
	    case "TSUnknownKeyword":
	    case "TSVoidKeyword":
	    case "TSThisType":
	    case "TSTemplateLiteralType":
	    case "TSLiteralType":
	      break;
	    default:
	      return false;
	  }
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isNumberLiteral(node, opts) {
	  (0, _deprecationWarning.default)("isNumberLiteral", "isNumericLiteral");
	  if (!node) return false;
	  if (node.type !== "NumberLiteral") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isRegexLiteral(node, opts) {
	  (0, _deprecationWarning.default)("isRegexLiteral", "isRegExpLiteral");
	  if (!node) return false;
	  if (node.type !== "RegexLiteral") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isRestProperty(node, opts) {
	  (0, _deprecationWarning.default)("isRestProperty", "isRestElement");
	  if (!node) return false;
	  if (node.type !== "RestProperty") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isSpreadProperty(node, opts) {
	  (0, _deprecationWarning.default)("isSpreadProperty", "isSpreadElement");
	  if (!node) return false;
	  if (node.type !== "SpreadProperty") return false;
	  return opts == null || (0, _shallowEqual.default)(node, opts);
	}
	function isModuleDeclaration(node, opts) {
	  (0, _deprecationWarning.default)("isModuleDeclaration", "isImportOrExportDeclaration");
	  return isImportOrExportDeclaration(node, opts);
	}

	
	return generated$3;
}

var hasRequiredMatchesPattern;

function requireMatchesPattern () {
	if (hasRequiredMatchesPattern) return matchesPattern;
	hasRequiredMatchesPattern = 1;

	Object.defineProperty(matchesPattern, "__esModule", {
	  value: true
	});
	matchesPattern.default = matchesPattern$1;
	var _index = requireGenerated$3();
	function isMemberExpressionLike(node) {
	  return (0, _index.isMemberExpression)(node) || (0, _index.isMetaProperty)(node);
	}
	function matchesPattern$1(member, match, allowPartial) {
	  if (!isMemberExpressionLike(member)) return false;
	  const parts = Array.isArray(match) ? match : match.split(".");
	  const nodes = [];
	  let node;
	  for (node = member; isMemberExpressionLike(node); node = (_object = node.object) != null ? _object : node.meta) {
	    var _object;
	    nodes.push(node.property);
	  }
	  nodes.push(node);
	  if (nodes.length < parts.length) return false;
	  if (!allowPartial && nodes.length > parts.length) return false;
	  for (let i = 0, j = nodes.length - 1; i < parts.length; i++, j--) {
	    const node = nodes[j];
	    let value;
	    if ((0, _index.isIdentifier)(node)) {
	      value = node.name;
	    } else if ((0, _index.isStringLiteral)(node)) {
	      value = node.value;
	    } else if ((0, _index.isThisExpression)(node)) {
	      value = "this";
	    } else if ((0, _index.isSuper)(node)) {
	      value = "super";
	    } else if ((0, _index.isPrivateName)(node)) {
	      value = "#" + node.id.name;
	    } else {
	      return false;
	    }
	    if (parts[i] !== value) return false;
	  }
	  return true;
	}

	
	return matchesPattern;
}

var hasRequiredBuildMatchMemberExpression;

function requireBuildMatchMemberExpression () {
	if (hasRequiredBuildMatchMemberExpression) return buildMatchMemberExpression;
	hasRequiredBuildMatchMemberExpression = 1;

	Object.defineProperty(buildMatchMemberExpression, "__esModule", {
	  value: true
	});
	buildMatchMemberExpression.default = buildMatchMemberExpression$1;
	var _matchesPattern = requireMatchesPattern();
	function buildMatchMemberExpression$1(match, allowPartial) {
	  const parts = match.split(".");
	  return member => (0, _matchesPattern.default)(member, parts, allowPartial);
	}

	
	return buildMatchMemberExpression;
}

var hasRequiredIsReactComponent;

function requireIsReactComponent () {
	if (hasRequiredIsReactComponent) return isReactComponent;
	hasRequiredIsReactComponent = 1;

	Object.defineProperty(isReactComponent, "__esModule", {
	  value: true
	});
	isReactComponent.default = void 0;
	var _buildMatchMemberExpression = requireBuildMatchMemberExpression();
	const isReactComponent$1 = (0, _buildMatchMemberExpression.default)("React.Component");
	isReactComponent.default = isReactComponent$1;

	
	return isReactComponent;
}

var isCompatTag = {};

var hasRequiredIsCompatTag;

function requireIsCompatTag () {
	if (hasRequiredIsCompatTag) return isCompatTag;
	hasRequiredIsCompatTag = 1;

	Object.defineProperty(isCompatTag, "__esModule", {
	  value: true
	});
	isCompatTag.default = isCompatTag$1;
	function isCompatTag$1(tagName) {
	  return !!tagName && /^[a-z]/.test(tagName);
	}

	
	return isCompatTag;
}

var buildChildren = {};

var cleanJSXElementLiteralChild = {};

var generated$2 = {};

var lowercase = {};

var validate = {};

var definitions = {};

var core = {};

var is = {};

var isType = {};

var hasRequiredIsType;

function requireIsType () {
	if (hasRequiredIsType) return isType;
	hasRequiredIsType = 1;

	Object.defineProperty(isType, "__esModule", {
	  value: true
	});
	isType.default = isType$1;
	var _index = requireDefinitions();
	function isType$1(nodeType, targetType) {
	  if (nodeType === targetType) return true;
	  if (nodeType == null) return false;
	  if (_index.ALIAS_KEYS[targetType]) return false;
	  const aliases = _index.FLIPPED_ALIAS_KEYS[targetType];
	  if (aliases != null && aliases.includes(nodeType)) return true;
	  return false;
	}

	
	return isType;
}

var isPlaceholderType = {};

var hasRequiredIsPlaceholderType;

function requireIsPlaceholderType () {
	if (hasRequiredIsPlaceholderType) return isPlaceholderType;
	hasRequiredIsPlaceholderType = 1;

	Object.defineProperty(isPlaceholderType, "__esModule", {
	  value: true
	});
	isPlaceholderType.default = isPlaceholderType$1;
	var _index = requireDefinitions();
	function isPlaceholderType$1(placeholderType, targetType) {
	  if (placeholderType === targetType) return true;
	  const aliases = _index.PLACEHOLDERS_ALIAS[placeholderType];
	  if (aliases != null && aliases.includes(targetType)) return true;
	  return false;
	}

	
	return isPlaceholderType;
}

var hasRequiredIs;

function requireIs () {
	if (hasRequiredIs) return is;
	hasRequiredIs = 1;

	Object.defineProperty(is, "__esModule", {
	  value: true
	});
	is.default = is$1;
	var _shallowEqual = requireShallowEqual();
	var _isType = requireIsType();
	var _isPlaceholderType = requireIsPlaceholderType();
	var _index = requireDefinitions();
	function is$1(type, node, opts) {
	  if (!node) return false;
	  const matches = (0, _isType.default)(node.type, type);
	  if (!matches) {
	    if (!opts && node.type === "Placeholder" && type in _index.FLIPPED_ALIAS_KEYS) {
	      return (0, _isPlaceholderType.default)(node.expectedNode, type);
	    }
	    return false;
	  }
	  if (opts === undefined) {
	    return true;
	  } else {
	    return (0, _shallowEqual.default)(node, opts);
	  }
	}

	
	return is;
}

var isValidIdentifier = {};

var lib$1 = {};

var identifier = {};

var hasRequiredIdentifier;

function requireIdentifier () {
	if (hasRequiredIdentifier) return identifier;
	hasRequiredIdentifier = 1;

	Object.defineProperty(identifier, "__esModule", {
	  value: true
	});
	identifier.isIdentifierChar = isIdentifierChar;
	identifier.isIdentifierName = isIdentifierName;
	identifier.isIdentifierStart = isIdentifierStart;
	let nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0560-\u0588\u05d0-\u05ea\u05ef-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0860-\u086a\u0870-\u0887\u0889-\u088f\u08a0-\u08c9\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u09fc\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c5c\u0c5d\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cdc-\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d04-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e86-\u0e8a\u0e8c-\u0ea3\u0ea5\u0ea7-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u1711\u171f-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1878\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4c\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c8a\u1c90-\u1cba\u1cbd-\u1cbf\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1cfa\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312f\u3131-\u318e\u31a0-\u31bf\u31f0-\u31ff\u3400-\u4dbf\u4e00-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7dc\ua7f1-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua8fe\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab69\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
	let nonASCIIidentifierChars = "\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u07fd\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u0897-\u089f\u08ca-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u09fe\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0afa-\u0aff\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b55-\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c04\u0c3c\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0cf3\u0d00-\u0d03\u0d3b\u0d3c\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d81-\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0ebc\u0ec8-\u0ece\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u180f-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1abf-\u1add\u1ae0-\u1aeb\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf4\u1cf7-\u1cf9\u1dc0-\u1dff\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\u30fb\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua82c\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua8ff-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f\uff65";
	const nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
	const nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
	nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
	const astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 7, 25, 39, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39, 27, 10, 22, 251, 41, 7, 1, 17, 5, 57, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 200, 32, 32, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 24, 43, 261, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 26, 3994, 6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 433, 44, 212, 63, 33, 24, 3, 24, 45, 74, 6, 0, 67, 12, 65, 1, 2, 0, 15, 4, 10, 7381, 42, 31, 98, 114, 8702, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3, 0, 208, 30, 2, 2, 2, 1, 2, 6, 3, 4, 10, 1, 225, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4381, 3, 5773, 3, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 8489];
	const astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 7, 9, 32, 4, 318, 1, 78, 5, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 68, 8, 2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 199, 7, 137, 9, 54, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 55, 9, 266, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 10, 5350, 0, 7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 233, 0, 3, 0, 8, 1, 6, 0, 475, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];
	function isInAstralSet(code, set) {
	  let pos = 0x10000;
	  for (let i = 0, length = set.length; i < length; i += 2) {
	    pos += set[i];
	    if (pos > code) return false;
	    pos += set[i + 1];
	    if (pos >= code) return true;
	  }
	  return false;
	}
	function isIdentifierStart(code) {
	  if (code < 65) return code === 36;
	  if (code <= 90) return true;
	  if (code < 97) return code === 95;
	  if (code <= 122) return true;
	  if (code <= 0xffff) {
	    return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
	  }
	  return isInAstralSet(code, astralIdentifierStartCodes);
	}
	function isIdentifierChar(code) {
	  if (code < 48) return code === 36;
	  if (code < 58) return true;
	  if (code < 65) return false;
	  if (code <= 90) return true;
	  if (code < 97) return code === 95;
	  if (code <= 122) return true;
	  if (code <= 0xffff) {
	    return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
	  }
	  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
	}
	function isIdentifierName(name) {
	  let isFirst = true;
	  for (let i = 0; i < name.length; i++) {
	    let cp = name.charCodeAt(i);
	    if ((cp & 0xfc00) === 0xd800 && i + 1 < name.length) {
	      const trail = name.charCodeAt(++i);
	      if ((trail & 0xfc00) === 0xdc00) {
	        cp = 0x10000 + ((cp & 0x3ff) << 10) + (trail & 0x3ff);
	      }
	    }
	    if (isFirst) {
	      isFirst = false;
	      if (!isIdentifierStart(cp)) {
	        return false;
	      }
	    } else if (!isIdentifierChar(cp)) {
	      return false;
	    }
	  }
	  return !isFirst;
	}

	
	return identifier;
}

var keyword = {};

var hasRequiredKeyword;

function requireKeyword () {
	if (hasRequiredKeyword) return keyword;
	hasRequiredKeyword = 1;

	Object.defineProperty(keyword, "__esModule", {
	  value: true
	});
	keyword.isKeyword = isKeyword;
	keyword.isReservedWord = isReservedWord;
	keyword.isStrictBindOnlyReservedWord = isStrictBindOnlyReservedWord;
	keyword.isStrictBindReservedWord = isStrictBindReservedWord;
	keyword.isStrictReservedWord = isStrictReservedWord;
	const reservedWords = {
	  keyword: ["break", "case", "catch", "continue", "debugger", "default", "do", "else", "finally", "for", "function", "if", "return", "switch", "throw", "try", "var", "const", "while", "with", "new", "this", "super", "class", "extends", "export", "import", "null", "true", "false", "in", "instanceof", "typeof", "void", "delete"],
	  strict: ["implements", "interface", "let", "package", "private", "protected", "public", "static", "yield"],
	  strictBind: ["eval", "arguments"]
	};
	const keywords = new Set(reservedWords.keyword);
	const reservedWordsStrictSet = new Set(reservedWords.strict);
	const reservedWordsStrictBindSet = new Set(reservedWords.strictBind);
	function isReservedWord(word, inModule) {
	  return inModule && word === "await" || word === "enum";
	}
	function isStrictReservedWord(word, inModule) {
	  return isReservedWord(word, inModule) || reservedWordsStrictSet.has(word);
	}
	function isStrictBindOnlyReservedWord(word) {
	  return reservedWordsStrictBindSet.has(word);
	}
	function isStrictBindReservedWord(word, inModule) {
	  return isStrictReservedWord(word, inModule) || isStrictBindOnlyReservedWord(word);
	}
	function isKeyword(word) {
	  return keywords.has(word);
	}

	
	return keyword;
}

var hasRequiredLib$3;

function requireLib$3 () {
	if (hasRequiredLib$3) return lib$1;
	hasRequiredLib$3 = 1;
	(function (exports$1) {

		Object.defineProperty(exports$1, "__esModule", {
		  value: true
		});
		Object.defineProperty(exports$1, "isIdentifierChar", {
		  enumerable: true,
		  get: function () {
		    return _identifier.isIdentifierChar;
		  }
		});
		Object.defineProperty(exports$1, "isIdentifierName", {
		  enumerable: true,
		  get: function () {
		    return _identifier.isIdentifierName;
		  }
		});
		Object.defineProperty(exports$1, "isIdentifierStart", {
		  enumerable: true,
		  get: function () {
		    return _identifier.isIdentifierStart;
		  }
		});
		Object.defineProperty(exports$1, "isKeyword", {
		  enumerable: true,
		  get: function () {
		    return _keyword.isKeyword;
		  }
		});
		Object.defineProperty(exports$1, "isReservedWord", {
		  enumerable: true,
		  get: function () {
		    return _keyword.isReservedWord;
		  }
		});
		Object.defineProperty(exports$1, "isStrictBindOnlyReservedWord", {
		  enumerable: true,
		  get: function () {
		    return _keyword.isStrictBindOnlyReservedWord;
		  }
		});
		Object.defineProperty(exports$1, "isStrictBindReservedWord", {
		  enumerable: true,
		  get: function () {
		    return _keyword.isStrictBindReservedWord;
		  }
		});
		Object.defineProperty(exports$1, "isStrictReservedWord", {
		  enumerable: true,
		  get: function () {
		    return _keyword.isStrictReservedWord;
		  }
		});
		var _identifier = requireIdentifier();
		var _keyword = requireKeyword();

		
	} (lib$1));
	return lib$1;
}

var hasRequiredIsValidIdentifier;

function requireIsValidIdentifier () {
	if (hasRequiredIsValidIdentifier) return isValidIdentifier;
	hasRequiredIsValidIdentifier = 1;

	Object.defineProperty(isValidIdentifier, "__esModule", {
	  value: true
	});
	isValidIdentifier.default = isValidIdentifier$1;
	var _helperValidatorIdentifier = requireLib$3();
	function isValidIdentifier$1(name, reserved = true) {
	  if (typeof name !== "string") return false;
	  if (reserved) {
	    if ((0, _helperValidatorIdentifier.isKeyword)(name) || (0, _helperValidatorIdentifier.isStrictReservedWord)(name, true)) {
	      return false;
	    }
	  }
	  return (0, _helperValidatorIdentifier.isIdentifierName)(name);
	}

	
	return isValidIdentifier;
}

var lib = {};

var hasRequiredLib$2;

function requireLib$2 () {
	if (hasRequiredLib$2) return lib;
	hasRequiredLib$2 = 1;

	Object.defineProperty(lib, "__esModule", {
	  value: true
	});
	lib.readCodePoint = readCodePoint;
	lib.readInt = readInt;
	lib.readStringContents = readStringContents;
	var _isDigit = function isDigit(code) {
	  return code >= 48 && code <= 57;
	};
	const forbiddenNumericSeparatorSiblings = {
	  decBinOct: new Set([46, 66, 69, 79, 95, 98, 101, 111]),
	  hex: new Set([46, 88, 95, 120])
	};
	const isAllowedNumericSeparatorSibling = {
	  bin: ch => ch === 48 || ch === 49,
	  oct: ch => ch >= 48 && ch <= 55,
	  dec: ch => ch >= 48 && ch <= 57,
	  hex: ch => ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102
	};
	function readStringContents(type, input, pos, lineStart, curLine, errors) {
	  const initialPos = pos;
	  const initialLineStart = lineStart;
	  const initialCurLine = curLine;
	  let out = "";
	  let firstInvalidLoc = null;
	  let chunkStart = pos;
	  const {
	    length
	  } = input;
	  for (;;) {
	    if (pos >= length) {
	      errors.unterminated(initialPos, initialLineStart, initialCurLine);
	      out += input.slice(chunkStart, pos);
	      break;
	    }
	    const ch = input.charCodeAt(pos);
	    if (isStringEnd(type, ch, input, pos)) {
	      out += input.slice(chunkStart, pos);
	      break;
	    }
	    if (ch === 92) {
	      out += input.slice(chunkStart, pos);
	      const res = readEscapedChar(input, pos, lineStart, curLine, type === "template", errors);
	      if (res.ch === null && !firstInvalidLoc) {
	        firstInvalidLoc = {
	          pos,
	          lineStart,
	          curLine
	        };
	      } else {
	        out += res.ch;
	      }
	      ({
	        pos,
	        lineStart,
	        curLine
	      } = res);
	      chunkStart = pos;
	    } else if (ch === 8232 || ch === 8233) {
	      ++pos;
	      ++curLine;
	      lineStart = pos;
	    } else if (ch === 10 || ch === 13) {
	      if (type === "template") {
	        out += input.slice(chunkStart, pos) + "\n";
	        ++pos;
	        if (ch === 13 && input.charCodeAt(pos) === 10) {
	          ++pos;
	        }
	        ++curLine;
	        chunkStart = lineStart = pos;
	      } else {
	        errors.unterminated(initialPos, initialLineStart, initialCurLine);
	      }
	    } else {
	      ++pos;
	    }
	  }
	  return {
	    pos,
	    str: out,
	    firstInvalidLoc,
	    lineStart,
	    curLine,
	    containsInvalid: !!firstInvalidLoc
	  };
	}
	function isStringEnd(type, ch, input, pos) {
	  if (type === "template") {
	    return ch === 96 || ch === 36 && input.charCodeAt(pos + 1) === 123;
	  }
	  return ch === (type === "double" ? 34 : 39);
	}
	function readEscapedChar(input, pos, lineStart, curLine, inTemplate, errors) {
	  const throwOnInvalid = !inTemplate;
	  pos++;
	  const res = ch => ({
	    pos,
	    ch,
	    lineStart,
	    curLine
	  });
	  const ch = input.charCodeAt(pos++);
	  switch (ch) {
	    case 110:
	      return res("\n");
	    case 114:
	      return res("\r");
	    case 120:
	      {
	        let code;
	        ({
	          code,
	          pos
	        } = readHexChar(input, pos, lineStart, curLine, 2, false, throwOnInvalid, errors));
	        return res(code === null ? null : String.fromCharCode(code));
	      }
	    case 117:
	      {
	        let code;
	        ({
	          code,
	          pos
	        } = readCodePoint(input, pos, lineStart, curLine, throwOnInvalid, errors));
	        return res(code === null ? null : String.fromCodePoint(code));
	      }
	    case 116:
	      return res("\t");
	    case 98:
	      return res("\b");
	    case 118:
	      return res("\u000b");
	    case 102:
	      return res("\f");
	    case 13:
	      if (input.charCodeAt(pos) === 10) {
	        ++pos;
	      }
	    case 10:
	      lineStart = pos;
	      ++curLine;
	    case 8232:
	    case 8233:
	      return res("");
	    case 56:
	    case 57:
	      if (inTemplate) {
	        return res(null);
	      } else {
	        errors.strictNumericEscape(pos - 1, lineStart, curLine);
	      }
	    default:
	      if (ch >= 48 && ch <= 55) {
	        const startPos = pos - 1;
	        const match = /^[0-7]+/.exec(input.slice(startPos, pos + 2));
	        let octalStr = match[0];
	        let octal = parseInt(octalStr, 8);
	        if (octal > 255) {
	          octalStr = octalStr.slice(0, -1);
	          octal = parseInt(octalStr, 8);
	        }
	        pos += octalStr.length - 1;
	        const next = input.charCodeAt(pos);
	        if (octalStr !== "0" || next === 56 || next === 57) {
	          if (inTemplate) {
	            return res(null);
	          } else {
	            errors.strictNumericEscape(startPos, lineStart, curLine);
	          }
	        }
	        return res(String.fromCharCode(octal));
	      }
	      return res(String.fromCharCode(ch));
	  }
	}
	function readHexChar(input, pos, lineStart, curLine, len, forceLen, throwOnInvalid, errors) {
	  const initialPos = pos;
	  let n;
	  ({
	    n,
	    pos
	  } = readInt(input, pos, lineStart, curLine, 16, len, forceLen, false, errors, !throwOnInvalid));
	  if (n === null) {
	    if (throwOnInvalid) {
	      errors.invalidEscapeSequence(initialPos, lineStart, curLine);
	    } else {
	      pos = initialPos - 1;
	    }
	  }
	  return {
	    code: n,
	    pos
	  };
	}
	function readInt(input, pos, lineStart, curLine, radix, len, forceLen, allowNumSeparator, errors, bailOnError) {
	  const start = pos;
	  const forbiddenSiblings = radix === 16 ? forbiddenNumericSeparatorSiblings.hex : forbiddenNumericSeparatorSiblings.decBinOct;
	  const isAllowedSibling = radix === 16 ? isAllowedNumericSeparatorSibling.hex : radix === 10 ? isAllowedNumericSeparatorSibling.dec : radix === 8 ? isAllowedNumericSeparatorSibling.oct : isAllowedNumericSeparatorSibling.bin;
	  let invalid = false;
	  let total = 0;
	  for (let i = 0, e = len == null ? Infinity : len; i < e; ++i) {
	    const code = input.charCodeAt(pos);
	    let val;
	    if (code === 95 && allowNumSeparator !== "bail") {
	      const prev = input.charCodeAt(pos - 1);
	      const next = input.charCodeAt(pos + 1);
	      if (!allowNumSeparator) {
	        if (bailOnError) return {
	          n: null,
	          pos
	        };
	        errors.numericSeparatorInEscapeSequence(pos, lineStart, curLine);
	      } else if (Number.isNaN(next) || !isAllowedSibling(next) || forbiddenSiblings.has(prev) || forbiddenSiblings.has(next)) {
	        if (bailOnError) return {
	          n: null,
	          pos
	        };
	        errors.unexpectedNumericSeparator(pos, lineStart, curLine);
	      }
	      ++pos;
	      continue;
	    }
	    if (code >= 97) {
	      val = code - 97 + 10;
	    } else if (code >= 65) {
	      val = code - 65 + 10;
	    } else if (_isDigit(code)) {
	      val = code - 48;
	    } else {
	      val = Infinity;
	    }
	    if (val >= radix) {
	      if (val <= 9 && bailOnError) {
	        return {
	          n: null,
	          pos
	        };
	      } else if (val <= 9 && errors.invalidDigit(pos, lineStart, curLine, radix)) {
	        val = 0;
	      } else if (forceLen) {
	        val = 0;
	        invalid = true;
	      } else {
	        break;
	      }
	    }
	    ++pos;
	    total = total * radix + val;
	  }
	  if (pos === start || len != null && pos - start !== len || invalid) {
	    return {
	      n: null,
	      pos
	    };
	  }
	  return {
	    n: total,
	    pos
	  };
	}
	function readCodePoint(input, pos, lineStart, curLine, throwOnInvalid, errors) {
	  const ch = input.charCodeAt(pos);
	  let code;
	  if (ch === 123) {
	    ++pos;
	    ({
	      code,
	      pos
	    } = readHexChar(input, pos, lineStart, curLine, input.indexOf("}", pos) - pos, true, throwOnInvalid, errors));
	    ++pos;
	    if (code !== null && code > 0x10ffff) {
	      if (throwOnInvalid) {
	        errors.invalidCodePoint(pos, lineStart, curLine);
	      } else {
	        return {
	          code: null,
	          pos
	        };
	      }
	    }
	  } else {
	    ({
	      code,
	      pos
	    } = readHexChar(input, pos, lineStart, curLine, 4, false, throwOnInvalid, errors));
	  }
	  return {
	    code,
	    pos
	  };
	}

	
	return lib;
}

var constants = {};

var hasRequiredConstants;

function requireConstants () {
	if (hasRequiredConstants) return constants;
	hasRequiredConstants = 1;

	Object.defineProperty(constants, "__esModule", {
	  value: true
	});
	constants.UPDATE_OPERATORS = constants.UNARY_OPERATORS = constants.STRING_UNARY_OPERATORS = constants.STATEMENT_OR_BLOCK_KEYS = constants.NUMBER_UNARY_OPERATORS = constants.NUMBER_BINARY_OPERATORS = constants.LOGICAL_OPERATORS = constants.INHERIT_KEYS = constants.FOR_INIT_KEYS = constants.FLATTENABLE_KEYS = constants.EQUALITY_BINARY_OPERATORS = constants.COMPARISON_BINARY_OPERATORS = constants.COMMENT_KEYS = constants.BOOLEAN_UNARY_OPERATORS = constants.BOOLEAN_NUMBER_BINARY_OPERATORS = constants.BOOLEAN_BINARY_OPERATORS = constants.BINARY_OPERATORS = constants.ASSIGNMENT_OPERATORS = void 0;
	constants.STATEMENT_OR_BLOCK_KEYS = ["consequent", "body", "alternate"];
	constants.FLATTENABLE_KEYS = ["body", "expressions"];
	constants.FOR_INIT_KEYS = ["left", "init"];
	constants.COMMENT_KEYS = ["leadingComments", "trailingComments", "innerComments"];
	const LOGICAL_OPERATORS = constants.LOGICAL_OPERATORS = ["||", "&&", "??"];
	constants.UPDATE_OPERATORS = ["++", "--"];
	const BOOLEAN_NUMBER_BINARY_OPERATORS = constants.BOOLEAN_NUMBER_BINARY_OPERATORS = [">", "<", ">=", "<="];
	const EQUALITY_BINARY_OPERATORS = constants.EQUALITY_BINARY_OPERATORS = ["==", "===", "!=", "!=="];
	const COMPARISON_BINARY_OPERATORS = constants.COMPARISON_BINARY_OPERATORS = [...EQUALITY_BINARY_OPERATORS, "in", "instanceof"];
	const BOOLEAN_BINARY_OPERATORS = constants.BOOLEAN_BINARY_OPERATORS = [...COMPARISON_BINARY_OPERATORS, ...BOOLEAN_NUMBER_BINARY_OPERATORS];
	const NUMBER_BINARY_OPERATORS = constants.NUMBER_BINARY_OPERATORS = ["-", "/", "%", "*", "**", "&", "|", ">>", ">>>", "<<", "^"];
	constants.BINARY_OPERATORS = ["+", ...NUMBER_BINARY_OPERATORS, ...BOOLEAN_BINARY_OPERATORS, "|>"];
	constants.ASSIGNMENT_OPERATORS = ["=", "+=", ...NUMBER_BINARY_OPERATORS.map(op => op + "="), ...LOGICAL_OPERATORS.map(op => op + "=")];
	const BOOLEAN_UNARY_OPERATORS = constants.BOOLEAN_UNARY_OPERATORS = ["delete", "!"];
	const NUMBER_UNARY_OPERATORS = constants.NUMBER_UNARY_OPERATORS = ["+", "-", "~"];
	const STRING_UNARY_OPERATORS = constants.STRING_UNARY_OPERATORS = ["typeof"];
	constants.UNARY_OPERATORS = ["void", "throw", ...BOOLEAN_UNARY_OPERATORS, ...NUMBER_UNARY_OPERATORS, ...STRING_UNARY_OPERATORS];
	constants.INHERIT_KEYS = {
	  optional: ["typeAnnotation", "typeParameters", "returnType"],
	  force: ["start", "loc", "end"]
	};
	constants.BLOCK_SCOPED_SYMBOL = Symbol.for("var used to be block scoped");
	constants.NOT_LOCAL_BINDING = Symbol.for("should not be considered a local binding");

	
	return constants;
}

var utils = {};

var hasRequiredUtils;

function requireUtils () {
	if (hasRequiredUtils) return utils;
	hasRequiredUtils = 1;

	Object.defineProperty(utils, "__esModule", {
	  value: true
	});
	utils.allExpandedTypes = utils.VISITOR_KEYS = utils.NODE_UNION_SHAPES__PRIVATE = utils.NODE_PARENT_VALIDATIONS = utils.NODE_FIELDS = utils.FLIPPED_ALIAS_KEYS = utils.DEPRECATED_KEYS = utils.BUILDER_KEYS = utils.ALIAS_KEYS = void 0;
	utils.arrayOf = arrayOf;
	utils.arrayOfType = arrayOfType;
	utils.assertEach = assertEach;
	utils.assertNodeOrValueType = assertNodeOrValueType;
	utils.assertNodeType = assertNodeType;
	utils.assertOneOf = assertOneOf;
	utils.assertOptionalChainStart = assertOptionalChainStart;
	utils.assertShape = assertShape;
	utils.assertValueType = assertValueType;
	utils.chain = chain;
	utils.default = defineType;
	utils.defineAliasedType = defineAliasedType;
	utils.validate = validate;
	utils.validateArrayOfType = validateArrayOfType;
	utils.validateOptional = validateOptional;
	utils.validateOptionalType = validateOptionalType;
	utils.validateType = validateType;
	var _is = requireIs();
	var _validate = requireValidate();
	const VISITOR_KEYS = utils.VISITOR_KEYS = {};
	const ALIAS_KEYS = utils.ALIAS_KEYS = {};
	const FLIPPED_ALIAS_KEYS = utils.FLIPPED_ALIAS_KEYS = {};
	const NODE_FIELDS = utils.NODE_FIELDS = {};
	const BUILDER_KEYS = utils.BUILDER_KEYS = {};
	const DEPRECATED_KEYS = utils.DEPRECATED_KEYS = {};
	const NODE_PARENT_VALIDATIONS = utils.NODE_PARENT_VALIDATIONS = {};
	const NODE_UNION_SHAPES__PRIVATE = utils.NODE_UNION_SHAPES__PRIVATE = {};
	function getType(val) {
	  if (Array.isArray(val)) {
	    return "array";
	  } else if (val === null) {
	    return "null";
	  } else {
	    return typeof val;
	  }
	}
	function validate(validate) {
	  return {
	    validate
	  };
	}
	function validateType(...typeNames) {
	  return validate(assertNodeType(...typeNames));
	}
	function validateOptional(validate) {
	  return {
	    validate,
	    optional: true
	  };
	}
	function validateOptionalType(...typeNames) {
	  return {
	    validate: assertNodeType(...typeNames),
	    optional: true
	  };
	}
	function arrayOf(elementType) {
	  return chain(assertValueType("array"), assertEach(elementType));
	}
	function arrayOfType(...typeNames) {
	  return arrayOf(assertNodeType(...typeNames));
	}
	function validateArrayOfType(...typeNames) {
	  return validate(arrayOfType(...typeNames));
	}
	function assertEach(callback) {
	  const childValidator = browser$1.env.BABEL_TYPES_8_BREAKING ? _validate.validateChild : () => {};
	  function validator(node, key, val) {
	    if (!Array.isArray(val)) return;
	    let i = 0;
	    const subKey = {
	      toString() {
	        return `${key}[${i}]`;
	      }
	    };
	    for (; i < val.length; i++) {
	      const v = val[i];
	      callback(node, subKey, v);
	      childValidator(node, subKey, v);
	    }
	  }
	  validator.each = callback;
	  return validator;
	}
	function assertOneOf(...values) {
	  function validate(node, key, val) {
	    if (!values.includes(val)) {
	      throw new TypeError(`Property ${key} expected value to be one of ${JSON.stringify(values)} but got ${JSON.stringify(val)}`);
	    }
	  }
	  validate.oneOf = values;
	  return validate;
	}
	const allExpandedTypes = utils.allExpandedTypes = [];
	function assertNodeType(...types) {
	  const expandedTypes = new Set();
	  allExpandedTypes.push({
	    types,
	    set: expandedTypes
	  });
	  function validate(node, key, val) {
	    const valType = val == null ? void 0 : val.type;
	    if (valType != null) {
	      if (expandedTypes.has(valType)) {
	        (0, _validate.validateChild)(node, key, val);
	        return;
	      }
	      if (valType === "Placeholder") {
	        for (const type of types) {
	          if ((0, _is.default)(type, val)) {
	            (0, _validate.validateChild)(node, key, val);
	            return;
	          }
	        }
	      }
	    }
	    throw new TypeError(`Property ${key} of ${node.type} expected node to be of a type ${JSON.stringify(types)} but instead got ${JSON.stringify(valType)}`);
	  }
	  validate.oneOfNodeTypes = types;
	  return validate;
	}
	function assertNodeOrValueType(...types) {
	  function validate(node, key, val) {
	    const primitiveType = getType(val);
	    for (const type of types) {
	      if (primitiveType === type || (0, _is.default)(type, val)) {
	        (0, _validate.validateChild)(node, key, val);
	        return;
	      }
	    }
	    throw new TypeError(`Property ${key} of ${node.type} expected node to be of a type ${JSON.stringify(types)} but instead got ${JSON.stringify(val == null ? void 0 : val.type)}`);
	  }
	  validate.oneOfNodeOrValueTypes = types;
	  return validate;
	}
	function assertValueType(type) {
	  function validate(node, key, val) {
	    if (getType(val) === type) {
	      return;
	    }
	    throw new TypeError(`Property ${key} expected type of ${type} but got ${getType(val)}`);
	  }
	  validate.type = type;
	  return validate;
	}
	function assertShape(shape) {
	  const keys = Object.keys(shape);
	  function validate(node, key, val) {
	    const errors = [];
	    for (const property of keys) {
	      try {
	        (0, _validate.validateField)(node, property, val[property], shape[property]);
	      } catch (error) {
	        if (error instanceof TypeError) {
	          errors.push(error.message);
	          continue;
	        }
	        throw error;
	      }
	    }
	    if (errors.length) {
	      throw new TypeError(`Property ${key} of ${node.type} expected to have the following:\n${errors.join("\n")}`);
	    }
	  }
	  validate.shapeOf = shape;
	  return validate;
	}
	function assertOptionalChainStart() {
	  function validate(node) {
	    var _current;
	    let current = node;
	    while (node) {
	      const {
	        type
	      } = current;
	      if (type === "OptionalCallExpression") {
	        if (current.optional) return;
	        current = current.callee;
	        continue;
	      }
	      if (type === "OptionalMemberExpression") {
	        if (current.optional) return;
	        current = current.object;
	        continue;
	      }
	      break;
	    }
	    throw new TypeError(`Non-optional ${node.type} must chain from an optional OptionalMemberExpression or OptionalCallExpression. Found chain from ${(_current = current) == null ? void 0 : _current.type}`);
	  }
	  return validate;
	}
	function chain(...fns) {
	  function validate(...args) {
	    for (const fn of fns) {
	      fn(...args);
	    }
	  }
	  validate.chainOf = fns;
	  if (fns.length >= 2 && "type" in fns[0] && fns[0].type === "array" && !("each" in fns[1])) {
	    throw new Error(`An assertValueType("array") validator can only be followed by an assertEach(...) validator.`);
	  }
	  return validate;
	}
	const validTypeOpts = new Set(["aliases", "builder", "deprecatedAlias", "fields", "inherits", "visitor", "validate", "unionShape"]);
	const validFieldKeys = new Set(["default", "optional", "deprecated", "validate"]);
	const store = {};
	function defineAliasedType(...aliases) {
	  return (type, opts = {}) => {
	    let defined = opts.aliases;
	    if (!defined) {
	      var _store$opts$inherits$;
	      if (opts.inherits) defined = (_store$opts$inherits$ = store[opts.inherits].aliases) == null ? void 0 : _store$opts$inherits$.slice();
	      defined != null ? defined : defined = [];
	      opts.aliases = defined;
	    }
	    const additional = aliases.filter(a => !defined.includes(a));
	    defined.unshift(...additional);
	    defineType(type, opts);
	  };
	}
	function defineType(type, opts = {}) {
	  const inherits = opts.inherits && store[opts.inherits] || {};
	  let fields = opts.fields;
	  if (!fields) {
	    fields = {};
	    if (inherits.fields) {
	      const keys = Object.getOwnPropertyNames(inherits.fields);
	      for (const key of keys) {
	        const field = inherits.fields[key];
	        const def = field.default;
	        if (Array.isArray(def) ? def.length > 0 : def && typeof def === "object") {
	          throw new Error("field defaults can only be primitives or empty arrays currently");
	        }
	        fields[key] = {
	          default: Array.isArray(def) ? [] : def,
	          optional: field.optional,
	          deprecated: field.deprecated,
	          validate: field.validate
	        };
	      }
	    }
	  }
	  const visitor = opts.visitor || inherits.visitor || [];
	  const aliases = opts.aliases || inherits.aliases || [];
	  const builder = opts.builder || inherits.builder || opts.visitor || [];
	  for (const k of Object.keys(opts)) {
	    if (!validTypeOpts.has(k)) {
	      throw new Error(`Unknown type option "${k}" on ${type}`);
	    }
	  }
	  if (opts.deprecatedAlias) {
	    DEPRECATED_KEYS[opts.deprecatedAlias] = type;
	  }
	  for (const key of visitor.concat(builder)) {
	    fields[key] = fields[key] || {};
	  }
	  for (const key of Object.keys(fields)) {
	    const field = fields[key];
	    if (field.default !== undefined && !builder.includes(key)) {
	      field.optional = true;
	    }
	    if (field.default === undefined) {
	      field.default = null;
	    } else if (!field.validate && field.default != null) {
	      field.validate = assertValueType(getType(field.default));
	    }
	    for (const k of Object.keys(field)) {
	      if (!validFieldKeys.has(k)) {
	        throw new Error(`Unknown field key "${k}" on ${type}.${key}`);
	      }
	    }
	  }
	  VISITOR_KEYS[type] = opts.visitor = visitor;
	  BUILDER_KEYS[type] = opts.builder = builder;
	  NODE_FIELDS[type] = opts.fields = fields;
	  ALIAS_KEYS[type] = opts.aliases = aliases;
	  aliases.forEach(alias => {
	    FLIPPED_ALIAS_KEYS[alias] = FLIPPED_ALIAS_KEYS[alias] || [];
	    FLIPPED_ALIAS_KEYS[alias].push(type);
	  });
	  if (opts.validate) {
	    NODE_PARENT_VALIDATIONS[type] = opts.validate;
	  }
	  if (opts.unionShape) {
	    NODE_UNION_SHAPES__PRIVATE[type] = opts.unionShape;
	  }
	  store[type] = opts;
	}

	
	return utils;
}

var hasRequiredCore;

function requireCore () {
	if (hasRequiredCore) return core;
	hasRequiredCore = 1;

	Object.defineProperty(core, "__esModule", {
	  value: true
	});
	core.patternLikeCommon = core.importAttributes = core.functionTypeAnnotationCommon = core.functionDeclarationCommon = core.functionCommon = core.classMethodOrPropertyUnionShapeCommon = core.classMethodOrPropertyCommon = core.classMethodOrDeclareMethodCommon = void 0;
	var _is = requireIs();
	var _isValidIdentifier = requireIsValidIdentifier();
	var _helperValidatorIdentifier = requireLib$3();
	var _helperStringParser = requireLib$2();
	var _index = requireConstants();
	var _utils = requireUtils();
	const classMethodOrPropertyUnionShapeCommon = (allowPrivateName = false) => ({
	  unionShape: {
	    discriminator: "computed",
	    shapes: [{
	      name: "computed",
	      value: [true],
	      properties: {
	        key: {
	          validate: (0, _utils.assertNodeType)("Expression")
	        }
	      }
	    }, {
	      name: "nonComputed",
	      value: [false],
	      properties: {
	        key: {
	          validate: allowPrivateName ? (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "PrivateName") : (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral")
	        }
	      }
	    }]
	  }
	});
	core.classMethodOrPropertyUnionShapeCommon = classMethodOrPropertyUnionShapeCommon;
	const defineType = (0, _utils.defineAliasedType)("Standardized");
	defineType("ArrayExpression", {
	  fields: {
	    elements: {
	      validate: (0, _utils.arrayOf)((0, _utils.assertNodeOrValueType)("null", "Expression", "SpreadElement")),
	      default: !browser$1.env.BABEL_TYPES_8_BREAKING ? [] : undefined
	    }
	  },
	  visitor: ["elements"],
	  aliases: ["Expression"]
	});
	defineType("AssignmentExpression", {
	  fields: {
	    operator: {
	      validate: !browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.assertValueType)("string") : Object.assign(function () {
	        const identifier = (0, _utils.assertOneOf)(..._index.ASSIGNMENT_OPERATORS);
	        const pattern = (0, _utils.assertOneOf)("=");
	        return function (node, key, val) {
	          const validator = (0, _is.default)("Pattern", node.left) ? pattern : identifier;
	          validator(node, key, val);
	        };
	      }(), {
	        oneOf: _index.ASSIGNMENT_OPERATORS
	      })
	    },
	    left: {
	      validate: !browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.assertNodeType)("LVal", "OptionalMemberExpression") : (0, _utils.assertNodeType)("Identifier", "MemberExpression", "OptionalMemberExpression", "ArrayPattern", "ObjectPattern", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression")
	    },
	    right: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  },
	  builder: ["operator", "left", "right"],
	  visitor: ["left", "right"],
	  aliases: ["Expression"]
	});
	defineType("BinaryExpression", {
	  builder: ["operator", "left", "right"],
	  fields: {
	    operator: {
	      validate: (0, _utils.assertOneOf)(..._index.BINARY_OPERATORS)
	    },
	    left: {
	      validate: function () {
	        const expression = (0, _utils.assertNodeType)("Expression");
	        const inOp = (0, _utils.assertNodeType)("Expression", "PrivateName");
	        const validator = Object.assign(function (node, key, val) {
	          const validator = node.operator === "in" ? inOp : expression;
	          validator(node, key, val);
	        }, {
	          oneOfNodeTypes: ["Expression", "PrivateName"]
	        });
	        return validator;
	      }()
	    },
	    right: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  },
	  visitor: ["left", "right"],
	  aliases: ["Binary", "Expression"]
	});
	defineType("InterpreterDirective", {
	  builder: ["value"],
	  fields: {
	    value: {
	      validate: (0, _utils.assertValueType)("string")
	    }
	  }
	});
	defineType("Directive", {
	  visitor: ["value"],
	  fields: {
	    value: {
	      validate: (0, _utils.assertNodeType)("DirectiveLiteral")
	    }
	  }
	});
	defineType("DirectiveLiteral", {
	  builder: ["value"],
	  fields: {
	    value: {
	      validate: (0, _utils.assertValueType)("string")
	    }
	  }
	});
	defineType("BlockStatement", {
	  builder: ["body", "directives"],
	  visitor: ["directives", "body"],
	  fields: {
	    directives: {
	      validate: (0, _utils.arrayOfType)("Directive"),
	      default: []
	    },
	    body: (0, _utils.validateArrayOfType)("Statement")
	  },
	  aliases: ["Scopable", "BlockParent", "Block", "Statement"]
	});
	defineType("BreakStatement", {
	  visitor: ["label"],
	  fields: {
	    label: {
	      validate: (0, _utils.assertNodeType)("Identifier"),
	      optional: true
	    }
	  },
	  aliases: ["Statement", "Terminatorless", "CompletionStatement"]
	});
	defineType("CallExpression", {
	  visitor: ["callee", "typeParameters", "typeArguments", "arguments"],
	  builder: ["callee", "arguments"],
	  aliases: ["Expression"],
	  fields: Object.assign({
	    callee: {
	      validate: (0, _utils.assertNodeType)("Expression", "Super", "V8IntrinsicIdentifier")
	    },
	    arguments: (0, _utils.validateArrayOfType)("Expression", "SpreadElement", "ArgumentPlaceholder"),
	    typeArguments: {
	      validate: (0, _utils.assertNodeType)("TypeParameterInstantiation"),
	      optional: true
	    }
	  }, browser$1.env.BABEL_TYPES_8_BREAKING ? {} : {
	    optional: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    typeParameters: {
	      validate: (0, _utils.assertNodeType)("TSTypeParameterInstantiation"),
	      optional: true
	    }
	  })
	});
	defineType("CatchClause", {
	  visitor: ["param", "body"],
	  fields: {
	    param: {
	      validate: (0, _utils.assertNodeType)("Identifier", "ArrayPattern", "ObjectPattern"),
	      optional: true
	    },
	    body: {
	      validate: (0, _utils.assertNodeType)("BlockStatement")
	    }
	  },
	  aliases: ["Scopable", "BlockParent"]
	});
	defineType("ConditionalExpression", {
	  visitor: ["test", "consequent", "alternate"],
	  fields: {
	    test: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    consequent: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    alternate: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  },
	  aliases: ["Expression", "Conditional"]
	});
	defineType("ContinueStatement", {
	  visitor: ["label"],
	  fields: {
	    label: {
	      validate: (0, _utils.assertNodeType)("Identifier"),
	      optional: true
	    }
	  },
	  aliases: ["Statement", "Terminatorless", "CompletionStatement"]
	});
	defineType("DebuggerStatement", {
	  aliases: ["Statement"]
	});
	defineType("DoWhileStatement", {
	  builder: ["test", "body"],
	  visitor: ["body", "test"],
	  fields: {
	    test: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    body: {
	      validate: (0, _utils.assertNodeType)("Statement")
	    }
	  },
	  aliases: ["Statement", "BlockParent", "Loop", "While", "Scopable"]
	});
	defineType("EmptyStatement", {
	  aliases: ["Statement"]
	});
	defineType("ExpressionStatement", {
	  visitor: ["expression"],
	  fields: {
	    expression: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  },
	  aliases: ["Statement", "ExpressionWrapper"]
	});
	defineType("File", {
	  builder: ["program", "comments", "tokens"],
	  visitor: ["program"],
	  fields: {
	    program: {
	      validate: (0, _utils.assertNodeType)("Program")
	    },
	    comments: {
	      validate: !browser$1.env.BABEL_TYPES_8_BREAKING ? Object.assign(() => {}, {
	        each: {
	          oneOfNodeTypes: ["CommentBlock", "CommentLine"]
	        }
	      }) : (0, _utils.assertEach)((0, _utils.assertNodeType)("CommentBlock", "CommentLine")),
	      optional: true
	    },
	    tokens: {
	      validate: (0, _utils.assertEach)(Object.assign(() => {}, {
	        type: "any"
	      })),
	      optional: true
	    }
	  }
	});
	defineType("ForInStatement", {
	  visitor: ["left", "right", "body"],
	  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop", "ForXStatement"],
	  fields: {
	    left: {
	      validate: !browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.assertNodeType)("VariableDeclaration", "LVal") : (0, _utils.assertNodeType)("VariableDeclaration", "Identifier", "MemberExpression", "ArrayPattern", "ObjectPattern", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression")
	    },
	    right: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    body: {
	      validate: (0, _utils.assertNodeType)("Statement")
	    }
	  }
	});
	defineType("ForStatement", {
	  visitor: ["init", "test", "update", "body"],
	  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop"],
	  fields: {
	    init: {
	      validate: (0, _utils.assertNodeType)("VariableDeclaration", "Expression"),
	      optional: true
	    },
	    test: {
	      validate: (0, _utils.assertNodeType)("Expression"),
	      optional: true
	    },
	    update: {
	      validate: (0, _utils.assertNodeType)("Expression"),
	      optional: true
	    },
	    body: {
	      validate: (0, _utils.assertNodeType)("Statement")
	    }
	  }
	});
	const functionCommon = () => ({
	  params: (0, _utils.validateArrayOfType)("FunctionParameter"),
	  generator: {
	    default: false
	  },
	  async: {
	    default: false
	  }
	});
	core.functionCommon = functionCommon;
	const functionTypeAnnotationCommon = () => ({
	  returnType: {
	    validate: (0, _utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
	    optional: true
	  },
	  typeParameters: {
	    validate: (0, _utils.assertNodeType)("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
	    optional: true
	  }
	});
	core.functionTypeAnnotationCommon = functionTypeAnnotationCommon;
	const functionDeclarationCommon = () => Object.assign({}, functionCommon(), {
	  declare: {
	    validate: (0, _utils.assertValueType)("boolean"),
	    optional: true
	  },
	  id: {
	    validate: (0, _utils.assertNodeType)("Identifier"),
	    optional: true
	  }
	});
	core.functionDeclarationCommon = functionDeclarationCommon;
	defineType("FunctionDeclaration", {
	  builder: ["id", "params", "body", "generator", "async"],
	  visitor: ["id", "typeParameters", "params", "predicate", "returnType", "body"],
	  fields: Object.assign({}, functionDeclarationCommon(), functionTypeAnnotationCommon(), {
	    body: {
	      validate: (0, _utils.assertNodeType)("BlockStatement")
	    },
	    predicate: {
	      validate: (0, _utils.assertNodeType)("DeclaredPredicate", "InferredPredicate"),
	      optional: true
	    }
	  }),
	  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Statement", "Pureish", "Declaration"],
	  validate: !browser$1.env.BABEL_TYPES_8_BREAKING ? undefined : function () {
	    const identifier = (0, _utils.assertNodeType)("Identifier");
	    return function (parent, key, node) {
	      if (!(0, _is.default)("ExportDefaultDeclaration", parent)) {
	        identifier(node, "id", node.id);
	      }
	    };
	  }()
	});
	defineType("FunctionExpression", {
	  inherits: "FunctionDeclaration",
	  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Expression", "Pureish"],
	  fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
	    id: {
	      validate: (0, _utils.assertNodeType)("Identifier"),
	      optional: true
	    },
	    body: {
	      validate: (0, _utils.assertNodeType)("BlockStatement")
	    },
	    predicate: {
	      validate: (0, _utils.assertNodeType)("DeclaredPredicate", "InferredPredicate"),
	      optional: true
	    }
	  })
	});
	const patternLikeCommon = () => ({
	  typeAnnotation: {
	    validate: (0, _utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
	    optional: true
	  },
	  optional: {
	    validate: (0, _utils.assertValueType)("boolean"),
	    optional: true
	  },
	  decorators: {
	    validate: (0, _utils.arrayOfType)("Decorator"),
	    optional: true
	  }
	});
	core.patternLikeCommon = patternLikeCommon;
	defineType("Identifier", {
	  builder: ["name"],
	  visitor: ["typeAnnotation", "decorators"],
	  aliases: ["Expression", "FunctionParameter", "PatternLike", "LVal", "TSEntityName"],
	  fields: Object.assign({}, patternLikeCommon(), {
	    name: {
	      validate: browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.chain)((0, _utils.assertValueType)("string"), Object.assign(function (node, key, val) {
	        if (!(0, _isValidIdentifier.default)(val, false)) {
	          throw new TypeError(`"${val}" is not a valid identifier name`);
	        }
	      }, {
	        type: "string"
	      })) : (0, _utils.assertValueType)("string")
	    }
	  }),
	  validate: browser$1.env.BABEL_TYPES_8_BREAKING ? function (parent, key, node) {
	    const match = /\.(\w+)$/.exec(key.toString());
	    if (!match) return;
	    const [, parentKey] = match;
	    const nonComp = {
	      computed: false
	    };
	    if (parentKey === "property") {
	      if ((0, _is.default)("MemberExpression", parent, nonComp)) return;
	      if ((0, _is.default)("OptionalMemberExpression", parent, nonComp)) return;
	    } else if (parentKey === "key") {
	      if ((0, _is.default)("Property", parent, nonComp)) return;
	      if ((0, _is.default)("Method", parent, nonComp)) return;
	    } else if (parentKey === "exported") {
	      if ((0, _is.default)("ExportSpecifier", parent)) return;
	    } else if (parentKey === "imported") {
	      if ((0, _is.default)("ImportSpecifier", parent, {
	        imported: node
	      })) return;
	    } else if (parentKey === "meta") {
	      if ((0, _is.default)("MetaProperty", parent, {
	        meta: node
	      })) return;
	    }
	    if (((0, _helperValidatorIdentifier.isKeyword)(node.name) || (0, _helperValidatorIdentifier.isReservedWord)(node.name, false)) && node.name !== "this") {
	      throw new TypeError(`"${node.name}" is not a valid identifier`);
	    }
	  } : undefined
	});
	defineType("IfStatement", {
	  visitor: ["test", "consequent", "alternate"],
	  aliases: ["Statement", "Conditional"],
	  fields: {
	    test: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    consequent: {
	      validate: (0, _utils.assertNodeType)("Statement")
	    },
	    alternate: {
	      optional: true,
	      validate: (0, _utils.assertNodeType)("Statement")
	    }
	  }
	});
	defineType("LabeledStatement", {
	  visitor: ["label", "body"],
	  aliases: ["Statement"],
	  fields: {
	    label: {
	      validate: (0, _utils.assertNodeType)("Identifier")
	    },
	    body: {
	      validate: (0, _utils.assertNodeType)("Statement")
	    }
	  }
	});
	defineType("StringLiteral", {
	  builder: ["value"],
	  fields: {
	    value: {
	      validate: (0, _utils.assertValueType)("string")
	    }
	  },
	  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
	});
	defineType("NumericLiteral", {
	  builder: ["value"],
	  deprecatedAlias: "NumberLiteral",
	  fields: {
	    value: {
	      validate: (0, _utils.chain)((0, _utils.assertValueType)("number"), Object.assign(function (node, key, val) {
	      }, {
	        type: "number"
	      }))
	    }
	  },
	  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
	});
	defineType("NullLiteral", {
	  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
	});
	defineType("BooleanLiteral", {
	  builder: ["value"],
	  fields: {
	    value: {
	      validate: (0, _utils.assertValueType)("boolean")
	    }
	  },
	  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
	});
	defineType("RegExpLiteral", {
	  builder: ["pattern", "flags"],
	  deprecatedAlias: "RegexLiteral",
	  aliases: ["Expression", "Pureish", "Literal"],
	  fields: {
	    pattern: {
	      validate: (0, _utils.assertValueType)("string")
	    },
	    flags: {
	      validate: browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.chain)((0, _utils.assertValueType)("string"), Object.assign(function (node, key, val) {
	        const invalid = /[^dgimsuvy]/.exec(val);
	        if (invalid) {
	          throw new TypeError(`"${invalid[0]}" is not a valid RegExp flag`);
	        }
	      }, {
	        type: "string"
	      })) : (0, _utils.assertValueType)("string"),
	      default: ""
	    }
	  }
	});
	defineType("LogicalExpression", {
	  builder: ["operator", "left", "right"],
	  visitor: ["left", "right"],
	  aliases: ["Binary", "Expression"],
	  fields: {
	    operator: {
	      validate: (0, _utils.assertOneOf)(..._index.LOGICAL_OPERATORS)
	    },
	    left: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    right: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  }
	});
	defineType("MemberExpression", {
	  builder: ["object", "property", "computed", ...(!browser$1.env.BABEL_TYPES_8_BREAKING ? ["optional"] : [])],
	  visitor: ["object", "property"],
	  aliases: ["Expression", "LVal", "PatternLike"],
	  unionShape: {
	    discriminator: "computed",
	    shapes: [{
	      name: "computed",
	      value: [true],
	      properties: {
	        property: {
	          validate: (0, _utils.assertNodeType)("Expression")
	        }
	      }
	    }, {
	      name: "nonComputed",
	      value: [false],
	      properties: {
	        property: {
	          validate: (0, _utils.assertNodeType)("Identifier", "PrivateName")
	        }
	      }
	    }]
	  },
	  fields: Object.assign({
	    object: {
	      validate: (0, _utils.assertNodeType)("Expression", "Super")
	    },
	    property: {
	      validate: function () {
	        const normal = (0, _utils.assertNodeType)("Identifier", "PrivateName");
	        const computed = (0, _utils.assertNodeType)("Expression");
	        const validator = function (node, key, val) {
	          const validator = node.computed ? computed : normal;
	          validator(node, key, val);
	        };
	        validator.oneOfNodeTypes = ["Expression", "Identifier", "PrivateName"];
	        return validator;
	      }()
	    },
	    computed: {
	      default: false
	    }
	  }, !browser$1.env.BABEL_TYPES_8_BREAKING ? {
	    optional: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    }
	  } : {})
	});
	defineType("NewExpression", {
	  inherits: "CallExpression"
	});
	defineType("Program", {
	  visitor: ["directives", "body"],
	  builder: ["body", "directives", "sourceType", "interpreter"],
	  fields: {
	    sourceType: {
	      validate: (0, _utils.assertOneOf)("script", "module"),
	      default: "script"
	    },
	    interpreter: {
	      validate: (0, _utils.assertNodeType)("InterpreterDirective"),
	      default: null,
	      optional: true
	    },
	    directives: {
	      validate: (0, _utils.arrayOfType)("Directive"),
	      default: []
	    },
	    body: (0, _utils.validateArrayOfType)("Statement")
	  },
	  aliases: ["Scopable", "BlockParent", "Block"]
	});
	defineType("ObjectExpression", {
	  visitor: ["properties"],
	  aliases: ["Expression"],
	  fields: {
	    properties: (0, _utils.validateArrayOfType)("ObjectMethod", "ObjectProperty", "SpreadElement")
	  }
	});
	defineType("ObjectMethod", Object.assign({
	  builder: ["kind", "key", "params", "body", "computed", "generator", "async"],
	  visitor: ["decorators", "key", "typeParameters", "params", "returnType", "body"]
	}, classMethodOrPropertyUnionShapeCommon(), {
	  fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
	    kind: Object.assign({
	      validate: (0, _utils.assertOneOf)("method", "get", "set")
	    }, !browser$1.env.BABEL_TYPES_8_BREAKING ? {
	      default: "method"
	    } : {}),
	    computed: {
	      default: false
	    },
	    key: {
	      validate: function () {
	        const normal = (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral");
	        const computed = (0, _utils.assertNodeType)("Expression");
	        const validator = function (node, key, val) {
	          const validator = node.computed ? computed : normal;
	          validator(node, key, val);
	        };
	        validator.oneOfNodeTypes = ["Expression", "Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral"];
	        return validator;
	      }()
	    },
	    decorators: {
	      validate: (0, _utils.arrayOfType)("Decorator"),
	      optional: true
	    },
	    body: {
	      validate: (0, _utils.assertNodeType)("BlockStatement")
	    }
	  }),
	  aliases: ["UserWhitespacable", "Function", "Scopable", "BlockParent", "FunctionParent", "Method", "ObjectMember"]
	}));
	defineType("ObjectProperty", {
	  builder: ["key", "value", "computed", "shorthand", ...(!browser$1.env.BABEL_TYPES_8_BREAKING ? ["decorators"] : [])],
	  unionShape: {
	    discriminator: "computed",
	    shapes: [{
	      name: "computed",
	      value: [true],
	      properties: {
	        key: {
	          validate: (0, _utils.assertNodeType)("Expression")
	        }
	      }
	    }, {
	      name: "nonComputed",
	      value: [false],
	      properties: {
	        key: {
	          validate: (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "DecimalLiteral", "PrivateName")
	        }
	      }
	    }]
	  },
	  fields: {
	    computed: {
	      default: false
	    },
	    key: {
	      validate: function () {
	        const normal = (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "DecimalLiteral", "PrivateName");
	        const computed = (0, _utils.assertNodeType)("Expression");
	        const validator = Object.assign(function (node, key, val) {
	          const validator = node.computed ? computed : normal;
	          validator(node, key, val);
	        }, {
	          oneOfNodeTypes: ["Expression", "Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "DecimalLiteral", "PrivateName"]
	        });
	        return validator;
	      }()
	    },
	    value: {
	      validate: (0, _utils.assertNodeType)("Expression", "PatternLike")
	    },
	    shorthand: {
	      validate: browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.chain)((0, _utils.assertValueType)("boolean"), Object.assign(function (node, key, shorthand) {
	        if (!shorthand) return;
	        if (node.computed) {
	          throw new TypeError("Property shorthand of ObjectProperty cannot be true if computed is true");
	        }
	        if (!(0, _is.default)("Identifier", node.key)) {
	          throw new TypeError("Property shorthand of ObjectProperty cannot be true if key is not an Identifier");
	        }
	      }, {
	        type: "boolean"
	      })) : (0, _utils.assertValueType)("boolean"),
	      default: false
	    },
	    decorators: {
	      validate: (0, _utils.arrayOfType)("Decorator"),
	      optional: true
	    }
	  },
	  visitor: ["decorators", "key", "value"],
	  aliases: ["UserWhitespacable", "Property", "ObjectMember"],
	  validate: !browser$1.env.BABEL_TYPES_8_BREAKING ? undefined : function () {
	    const pattern = (0, _utils.assertNodeType)("Identifier", "Pattern", "TSAsExpression", "TSSatisfiesExpression", "TSNonNullExpression", "TSTypeAssertion");
	    const expression = (0, _utils.assertNodeType)("Expression");
	    return function (parent, key, node) {
	      const validator = (0, _is.default)("ObjectPattern", parent) ? pattern : expression;
	      validator(node, "value", node.value);
	    };
	  }()
	});
	defineType("RestElement", {
	  visitor: ["argument", "typeAnnotation"],
	  builder: ["argument"],
	  aliases: ["FunctionParameter", "PatternLike", "LVal"],
	  deprecatedAlias: "RestProperty",
	  fields: Object.assign({}, patternLikeCommon(), {
	    argument: {
	      validate: !browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.assertNodeType)("Identifier", "ArrayPattern", "ObjectPattern", "MemberExpression", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression", "RestElement", "AssignmentPattern") : (0, _utils.assertNodeType)("Identifier", "ArrayPattern", "ObjectPattern", "MemberExpression", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression")
	    }
	  }),
	  validate: browser$1.env.BABEL_TYPES_8_BREAKING ? function (parent, key) {
	    const match = /(\w+)\[(\d+)\]/.exec(key.toString());
	    if (!match) throw new Error("Internal Babel error: malformed key.");
	    const [, listKey, index] = match;
	    if (parent[listKey].length > +index + 1) {
	      throw new TypeError(`RestElement must be last element of ${listKey}`);
	    }
	  } : undefined
	});
	defineType("ReturnStatement", {
	  visitor: ["argument"],
	  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
	  fields: {
	    argument: {
	      validate: (0, _utils.assertNodeType)("Expression"),
	      optional: true
	    }
	  }
	});
	defineType("SequenceExpression", {
	  visitor: ["expressions"],
	  fields: {
	    expressions: (0, _utils.validateArrayOfType)("Expression")
	  },
	  aliases: ["Expression"]
	});
	defineType("ParenthesizedExpression", {
	  visitor: ["expression"],
	  aliases: ["Expression", "ExpressionWrapper"],
	  fields: {
	    expression: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  }
	});
	defineType("SwitchCase", {
	  visitor: ["test", "consequent"],
	  fields: {
	    test: {
	      validate: (0, _utils.assertNodeType)("Expression"),
	      optional: true
	    },
	    consequent: (0, _utils.validateArrayOfType)("Statement")
	  }
	});
	defineType("SwitchStatement", {
	  visitor: ["discriminant", "cases"],
	  aliases: ["Statement", "BlockParent", "Scopable"],
	  fields: {
	    discriminant: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    cases: (0, _utils.validateArrayOfType)("SwitchCase")
	  }
	});
	defineType("ThisExpression", {
	  aliases: ["Expression"]
	});
	defineType("ThrowStatement", {
	  visitor: ["argument"],
	  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
	  fields: {
	    argument: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  }
	});
	defineType("TryStatement", {
	  visitor: ["block", "handler", "finalizer"],
	  aliases: ["Statement"],
	  fields: {
	    block: {
	      validate: browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.chain)((0, _utils.assertNodeType)("BlockStatement"), Object.assign(function (node) {
	        if (!node.handler && !node.finalizer) {
	          throw new TypeError("TryStatement expects either a handler or finalizer, or both");
	        }
	      }, {
	        oneOfNodeTypes: ["BlockStatement"]
	      })) : (0, _utils.assertNodeType)("BlockStatement")
	    },
	    handler: {
	      optional: true,
	      validate: (0, _utils.assertNodeType)("CatchClause")
	    },
	    finalizer: {
	      optional: true,
	      validate: (0, _utils.assertNodeType)("BlockStatement")
	    }
	  }
	});
	defineType("UnaryExpression", {
	  builder: ["operator", "argument", "prefix"],
	  fields: {
	    prefix: {
	      default: true
	    },
	    argument: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    operator: {
	      validate: (0, _utils.assertOneOf)(..._index.UNARY_OPERATORS)
	    }
	  },
	  visitor: ["argument"],
	  aliases: ["UnaryLike", "Expression"]
	});
	defineType("UpdateExpression", {
	  builder: ["operator", "argument", "prefix"],
	  fields: {
	    prefix: {
	      default: false
	    },
	    argument: {
	      validate: !browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.assertNodeType)("Expression") : (0, _utils.assertNodeType)("Identifier", "MemberExpression")
	    },
	    operator: {
	      validate: (0, _utils.assertOneOf)(..._index.UPDATE_OPERATORS)
	    }
	  },
	  visitor: ["argument"],
	  aliases: ["Expression"]
	});
	defineType("VariableDeclaration", {
	  builder: ["kind", "declarations"],
	  visitor: ["declarations"],
	  aliases: ["Statement", "Declaration"],
	  fields: {
	    declare: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    kind: {
	      validate: (0, _utils.assertOneOf)("var", "let", "const", "using", "await using")
	    },
	    declarations: (0, _utils.validateArrayOfType)("VariableDeclarator")
	  },
	  validate: browser$1.env.BABEL_TYPES_8_BREAKING ? (() => {
	    const withoutInit = (0, _utils.assertNodeType)("Identifier", "Placeholder");
	    const constOrLetOrVar = (0, _utils.assertNodeType)("Identifier", "ArrayPattern", "ObjectPattern", "Placeholder");
	    const usingOrAwaitUsing = (0, _utils.assertNodeType)("Identifier", "VoidPattern", "Placeholder");
	    return function (parent, key, node) {
	      const {
	        kind,
	        declarations
	      } = node;
	      const parentIsForX = (0, _is.default)("ForXStatement", parent, {
	        left: node
	      });
	      if (parentIsForX) {
	        if (declarations.length !== 1) {
	          throw new TypeError(`Exactly one VariableDeclarator is required in the VariableDeclaration of a ${parent.type}`);
	        }
	      }
	      for (const decl of declarations) {
	        if (kind === "const" || kind === "let" || kind === "var") {
	          if (!parentIsForX && !decl.init) {
	            withoutInit(decl, "id", decl.id);
	          } else {
	            constOrLetOrVar(decl, "id", decl.id);
	          }
	        } else {
	          usingOrAwaitUsing(decl, "id", decl.id);
	        }
	      }
	    };
	  })() : undefined
	});
	defineType("VariableDeclarator", {
	  visitor: ["id", "init"],
	  fields: {
	    id: {
	      validate: !browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.assertNodeType)("LVal", "VoidPattern") : (0, _utils.assertNodeType)("Identifier", "ArrayPattern", "ObjectPattern", "VoidPattern")
	    },
	    definite: {
	      optional: true,
	      validate: (0, _utils.assertValueType)("boolean")
	    },
	    init: {
	      optional: true,
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  }
	});
	defineType("WhileStatement", {
	  visitor: ["test", "body"],
	  aliases: ["Statement", "BlockParent", "Loop", "While", "Scopable"],
	  fields: {
	    test: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    body: {
	      validate: (0, _utils.assertNodeType)("Statement")
	    }
	  }
	});
	defineType("WithStatement", {
	  visitor: ["object", "body"],
	  aliases: ["Statement"],
	  fields: {
	    object: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    body: {
	      validate: (0, _utils.assertNodeType)("Statement")
	    }
	  }
	});
	defineType("AssignmentPattern", {
	  visitor: ["left", "right", "decorators"],
	  builder: ["left", "right"],
	  aliases: ["FunctionParameter", "Pattern", "PatternLike", "LVal"],
	  fields: Object.assign({}, patternLikeCommon(), {
	    left: {
	      validate: (0, _utils.assertNodeType)("Identifier", "ObjectPattern", "ArrayPattern", "MemberExpression", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression")
	    },
	    right: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    decorators: {
	      validate: (0, _utils.arrayOfType)("Decorator"),
	      optional: true
	    }
	  })
	});
	defineType("ArrayPattern", {
	  visitor: ["elements", "typeAnnotation"],
	  builder: ["elements"],
	  aliases: ["FunctionParameter", "Pattern", "PatternLike", "LVal"],
	  fields: Object.assign({}, patternLikeCommon(), {
	    elements: {
	      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeOrValueType)("null", "PatternLike")))
	    }
	  })
	});
	defineType("ArrowFunctionExpression", {
	  builder: ["params", "body", "async"],
	  visitor: ["typeParameters", "params", "predicate", "returnType", "body"],
	  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Expression", "Pureish"],
	  fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
	    expression: {
	      validate: (0, _utils.assertValueType)("boolean")
	    },
	    body: {
	      validate: (0, _utils.assertNodeType)("BlockStatement", "Expression")
	    },
	    predicate: {
	      validate: (0, _utils.assertNodeType)("DeclaredPredicate", "InferredPredicate"),
	      optional: true
	    }
	  })
	});
	defineType("ClassBody", {
	  visitor: ["body"],
	  fields: {
	    body: (0, _utils.validateArrayOfType)("ClassMethod", "ClassPrivateMethod", "ClassProperty", "ClassPrivateProperty", "ClassAccessorProperty", "TSDeclareMethod", "TSIndexSignature", "StaticBlock")
	  }
	});
	defineType("ClassExpression", {
	  builder: ["id", "superClass", "body", "decorators"],
	  visitor: ["decorators", "id", "typeParameters", "superClass", "superTypeParameters", "mixins", "implements", "body"],
	  aliases: ["Scopable", "Class", "Expression"],
	  fields: {
	    id: {
	      validate: (0, _utils.assertNodeType)("Identifier"),
	      optional: true
	    },
	    typeParameters: {
	      validate: (0, _utils.assertNodeType)("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
	      optional: true
	    },
	    body: {
	      validate: (0, _utils.assertNodeType)("ClassBody")
	    },
	    superClass: {
	      optional: true,
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    ["superTypeParameters"]: {
	      validate: (0, _utils.assertNodeType)("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
	      optional: true
	    },
	    implements: {
	      validate: (0, _utils.arrayOfType)("TSExpressionWithTypeArguments", "ClassImplements"),
	      optional: true
	    },
	    decorators: {
	      validate: (0, _utils.arrayOfType)("Decorator"),
	      optional: true
	    },
	    mixins: {
	      validate: (0, _utils.assertNodeType)("InterfaceExtends"),
	      optional: true
	    }
	  }
	});
	defineType("ClassDeclaration", {
	  inherits: "ClassExpression",
	  aliases: ["Scopable", "Class", "Statement", "Declaration"],
	  fields: {
	    id: {
	      validate: (0, _utils.assertNodeType)("Identifier"),
	      optional: true
	    },
	    typeParameters: {
	      validate: (0, _utils.assertNodeType)("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
	      optional: true
	    },
	    body: {
	      validate: (0, _utils.assertNodeType)("ClassBody")
	    },
	    superClass: {
	      optional: true,
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    ["superTypeParameters"]: {
	      validate: (0, _utils.assertNodeType)("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
	      optional: true
	    },
	    implements: {
	      validate: (0, _utils.arrayOfType)("TSExpressionWithTypeArguments", "ClassImplements"),
	      optional: true
	    },
	    decorators: {
	      validate: (0, _utils.arrayOfType)("Decorator"),
	      optional: true
	    },
	    mixins: {
	      validate: (0, _utils.assertNodeType)("InterfaceExtends"),
	      optional: true
	    },
	    declare: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    abstract: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    }
	  },
	  validate: !browser$1.env.BABEL_TYPES_8_BREAKING ? undefined : function () {
	    const identifier = (0, _utils.assertNodeType)("Identifier");
	    return function (parent, key, node) {
	      if (!(0, _is.default)("ExportDefaultDeclaration", parent)) {
	        identifier(node, "id", node.id);
	      }
	    };
	  }()
	});
	const importAttributes = core.importAttributes = {
	  attributes: {
	    optional: true,
	    validate: (0, _utils.arrayOfType)("ImportAttribute")
	  }
	};
	importAttributes.assertions = {
	  deprecated: true,
	  optional: true,
	  validate: (0, _utils.arrayOfType)("ImportAttribute")
	};
	defineType("ExportAllDeclaration", {
	  builder: ["source", "attributes"],
	  visitor: ["source", "attributes", "assertions"],
	  aliases: ["Statement", "Declaration", "ImportOrExportDeclaration", "ExportDeclaration"],
	  fields: Object.assign({
	    source: {
	      validate: (0, _utils.assertNodeType)("StringLiteral")
	    },
	    exportKind: (0, _utils.validateOptional)((0, _utils.assertOneOf)("type", "value"))
	  }, importAttributes)
	});
	defineType("ExportDefaultDeclaration", {
	  visitor: ["declaration"],
	  aliases: ["Statement", "Declaration", "ImportOrExportDeclaration", "ExportDeclaration"],
	  fields: {
	    declaration: (0, _utils.validateType)("TSDeclareFunction", "FunctionDeclaration", "ClassDeclaration", "Expression"),
	    exportKind: (0, _utils.validateOptional)((0, _utils.assertOneOf)("value"))
	  }
	});
	defineType("ExportNamedDeclaration", {
	  builder: ["declaration", "specifiers", "source", "attributes"],
	  visitor: ["declaration", "specifiers", "source", "attributes", "assertions"],
	  aliases: ["Statement", "Declaration", "ImportOrExportDeclaration", "ExportDeclaration"],
	  fields: Object.assign({
	    declaration: {
	      optional: true,
	      validate: browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.chain)((0, _utils.assertNodeType)("Declaration"), Object.assign(function (node, key, val) {
	        if (val && node.specifiers.length) {
	          throw new TypeError("Only declaration or specifiers is allowed on ExportNamedDeclaration");
	        }
	        if (val && node.source) {
	          throw new TypeError("Cannot export a declaration from a source");
	        }
	      }, {
	        oneOfNodeTypes: ["Declaration"]
	      })) : (0, _utils.assertNodeType)("Declaration")
	    }
	  }, importAttributes, {
	    specifiers: {
	      default: [],
	      validate: (0, _utils.arrayOf)(function () {
	        const sourced = (0, _utils.assertNodeType)("ExportSpecifier", "ExportDefaultSpecifier", "ExportNamespaceSpecifier");
	        const sourceless = (0, _utils.assertNodeType)("ExportSpecifier");
	        if (!browser$1.env.BABEL_TYPES_8_BREAKING) return sourced;
	        return Object.assign(function (node, key, val) {
	          const validator = node.source ? sourced : sourceless;
	          validator(node, key, val);
	        }, {
	          oneOfNodeTypes: ["ExportSpecifier", "ExportDefaultSpecifier", "ExportNamespaceSpecifier"]
	        });
	      }())
	    },
	    source: {
	      validate: (0, _utils.assertNodeType)("StringLiteral"),
	      optional: true
	    },
	    exportKind: (0, _utils.validateOptional)((0, _utils.assertOneOf)("type", "value"))
	  })
	});
	defineType("ExportSpecifier", {
	  visitor: ["local", "exported"],
	  aliases: ["ModuleSpecifier"],
	  fields: {
	    local: {
	      validate: (0, _utils.assertNodeType)("Identifier")
	    },
	    exported: {
	      validate: (0, _utils.assertNodeType)("Identifier", "StringLiteral")
	    },
	    exportKind: {
	      validate: (0, _utils.assertOneOf)("type", "value"),
	      optional: true
	    }
	  }
	});
	defineType("ForOfStatement", {
	  visitor: ["left", "right", "body"],
	  builder: ["left", "right", "body", "await"],
	  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop", "ForXStatement"],
	  fields: {
	    left: {
	      validate: function () {
	        if (!browser$1.env.BABEL_TYPES_8_BREAKING) {
	          return (0, _utils.assertNodeType)("VariableDeclaration", "LVal");
	        }
	        const declaration = (0, _utils.assertNodeType)("VariableDeclaration");
	        const lval = (0, _utils.assertNodeType)("Identifier", "MemberExpression", "ArrayPattern", "ObjectPattern", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression");
	        return Object.assign(function (node, key, val) {
	          if ((0, _is.default)("VariableDeclaration", val)) {
	            declaration(node, key, val);
	          } else {
	            lval(node, key, val);
	          }
	        }, {
	          oneOfNodeTypes: ["VariableDeclaration", "Identifier", "MemberExpression", "ArrayPattern", "ObjectPattern", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression"]
	        });
	      }()
	    },
	    right: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    body: {
	      validate: (0, _utils.assertNodeType)("Statement")
	    },
	    await: {
	      default: false
	    }
	  }
	});
	defineType("ImportDeclaration", {
	  builder: ["specifiers", "source", "attributes"],
	  visitor: ["specifiers", "source", "attributes", "assertions"],
	  aliases: ["Statement", "Declaration", "ImportOrExportDeclaration"],
	  fields: Object.assign({}, importAttributes, {
	    module: {
	      optional: true,
	      validate: (0, _utils.assertValueType)("boolean")
	    },
	    phase: {
	      default: null,
	      validate: (0, _utils.assertOneOf)("source", "defer")
	    },
	    specifiers: (0, _utils.validateArrayOfType)("ImportSpecifier", "ImportDefaultSpecifier", "ImportNamespaceSpecifier"),
	    source: {
	      validate: (0, _utils.assertNodeType)("StringLiteral")
	    },
	    importKind: {
	      validate: (0, _utils.assertOneOf)("type", "typeof", "value"),
	      optional: true
	    }
	  })
	});
	defineType("ImportDefaultSpecifier", {
	  visitor: ["local"],
	  aliases: ["ModuleSpecifier"],
	  fields: {
	    local: {
	      validate: (0, _utils.assertNodeType)("Identifier")
	    }
	  }
	});
	defineType("ImportNamespaceSpecifier", {
	  visitor: ["local"],
	  aliases: ["ModuleSpecifier"],
	  fields: {
	    local: {
	      validate: (0, _utils.assertNodeType)("Identifier")
	    }
	  }
	});
	defineType("ImportSpecifier", {
	  visitor: ["imported", "local"],
	  builder: ["local", "imported"],
	  aliases: ["ModuleSpecifier"],
	  fields: {
	    local: {
	      validate: (0, _utils.assertNodeType)("Identifier")
	    },
	    imported: {
	      validate: (0, _utils.assertNodeType)("Identifier", "StringLiteral")
	    },
	    importKind: {
	      validate: (0, _utils.assertOneOf)("type", "typeof", "value"),
	      optional: true
	    }
	  }
	});
	defineType("ImportExpression", {
	  visitor: ["source", "options"],
	  aliases: ["Expression"],
	  fields: {
	    phase: {
	      default: null,
	      validate: (0, _utils.assertOneOf)("source", "defer")
	    },
	    source: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    options: {
	      validate: (0, _utils.assertNodeType)("Expression"),
	      optional: true
	    }
	  }
	});
	defineType("MetaProperty", {
	  visitor: ["meta", "property"],
	  aliases: ["Expression"],
	  fields: {
	    meta: {
	      validate: browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.chain)((0, _utils.assertNodeType)("Identifier"), Object.assign(function (node, key, val) {
	        let property;
	        switch (val.name) {
	          case "function":
	            property = "sent";
	            break;
	          case "new":
	            property = "target";
	            break;
	          case "import":
	            property = "meta";
	            break;
	        }
	        if (!(0, _is.default)("Identifier", node.property, {
	          name: property
	        })) {
	          throw new TypeError("Unrecognised MetaProperty");
	        }
	      }, {
	        oneOfNodeTypes: ["Identifier"]
	      })) : (0, _utils.assertNodeType)("Identifier")
	    },
	    property: {
	      validate: (0, _utils.assertNodeType)("Identifier")
	    }
	  }
	});
	const classMethodOrPropertyCommon = () => ({
	  abstract: {
	    validate: (0, _utils.assertValueType)("boolean"),
	    optional: true
	  },
	  accessibility: {
	    validate: (0, _utils.assertOneOf)("public", "private", "protected"),
	    optional: true
	  },
	  static: {
	    default: false
	  },
	  override: {
	    default: false
	  },
	  computed: {
	    default: false
	  },
	  optional: {
	    validate: (0, _utils.assertValueType)("boolean"),
	    optional: true
	  },
	  key: {
	    validate: (0, _utils.chain)(function () {
	      const normal = (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral");
	      const computed = (0, _utils.assertNodeType)("Expression");
	      return function (node, key, val) {
	        const validator = node.computed ? computed : normal;
	        validator(node, key, val);
	      };
	    }(), (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "Expression"))
	  }
	});
	core.classMethodOrPropertyCommon = classMethodOrPropertyCommon;
	const classMethodOrDeclareMethodCommon = () => Object.assign({}, functionCommon(), classMethodOrPropertyCommon(), {
	  params: (0, _utils.validateArrayOfType)("FunctionParameter", "TSParameterProperty"),
	  kind: {
	    validate: (0, _utils.assertOneOf)("get", "set", "method", "constructor"),
	    default: "method"
	  },
	  access: {
	    validate: (0, _utils.chain)((0, _utils.assertValueType)("string"), (0, _utils.assertOneOf)("public", "private", "protected")),
	    optional: true
	  },
	  decorators: {
	    validate: (0, _utils.arrayOfType)("Decorator"),
	    optional: true
	  }
	});
	core.classMethodOrDeclareMethodCommon = classMethodOrDeclareMethodCommon;
	defineType("ClassMethod", Object.assign({
	  aliases: ["Function", "Scopable", "BlockParent", "FunctionParent", "Method"],
	  builder: ["kind", "key", "params", "body", "computed", "static", "generator", "async"],
	  visitor: ["decorators", "key", "typeParameters", "params", "returnType", "body"]
	}, classMethodOrPropertyUnionShapeCommon(), {
	  fields: Object.assign({}, classMethodOrDeclareMethodCommon(), functionTypeAnnotationCommon(), {
	    body: {
	      validate: (0, _utils.assertNodeType)("BlockStatement")
	    }
	  })
	}));
	defineType("ObjectPattern", {
	  visitor: ["decorators", "properties", "typeAnnotation"],
	  builder: ["properties"],
	  aliases: ["FunctionParameter", "Pattern", "PatternLike", "LVal"],
	  fields: Object.assign({}, patternLikeCommon(), {
	    properties: (0, _utils.validateArrayOfType)("RestElement", "ObjectProperty")
	  })
	});
	defineType("SpreadElement", {
	  visitor: ["argument"],
	  aliases: ["UnaryLike"],
	  deprecatedAlias: "SpreadProperty",
	  fields: {
	    argument: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  }
	});
	defineType("Super", {
	  aliases: ["Expression"]
	});
	defineType("TaggedTemplateExpression", {
	  visitor: ["tag", "typeParameters", "quasi"],
	  builder: ["tag", "quasi"],
	  aliases: ["Expression"],
	  fields: {
	    tag: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    quasi: {
	      validate: (0, _utils.assertNodeType)("TemplateLiteral")
	    },
	    ["typeParameters"]: {
	      validate: (0, _utils.assertNodeType)("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
	      optional: true
	    }
	  }
	});
	defineType("TemplateElement", {
	  builder: ["value", "tail"],
	  fields: {
	    value: {
	      validate: (0, _utils.chain)((0, _utils.assertShape)({
	        raw: {
	          validate: (0, _utils.assertValueType)("string")
	        },
	        cooked: {
	          validate: (0, _utils.assertValueType)("string"),
	          optional: true
	        }
	      }), function templateElementCookedValidator(node) {
	        const raw = node.value.raw;
	        let unterminatedCalled = false;
	        const error = () => {
	          throw new Error("Internal @babel/types error.");
	        };
	        const {
	          str,
	          firstInvalidLoc
	        } = (0, _helperStringParser.readStringContents)("template", raw, 0, 0, 0, {
	          unterminated() {
	            unterminatedCalled = true;
	          },
	          strictNumericEscape: error,
	          invalidEscapeSequence: error,
	          numericSeparatorInEscapeSequence: error,
	          unexpectedNumericSeparator: error,
	          invalidDigit: error,
	          invalidCodePoint: error
	        });
	        if (!unterminatedCalled) throw new Error("Invalid raw");
	        node.value.cooked = firstInvalidLoc ? null : str;
	      })
	    },
	    tail: {
	      default: false
	    }
	  }
	});
	defineType("TemplateLiteral", {
	  visitor: ["quasis", "expressions"],
	  aliases: ["Expression", "Literal"],
	  fields: {
	    quasis: (0, _utils.validateArrayOfType)("TemplateElement"),
	    expressions: {
	      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Expression", "TSType")), function (node, key, val) {
	        if (node.quasis.length !== val.length + 1) {
	          throw new TypeError(`Number of ${node.type} quasis should be exactly one more than the number of expressions.\nExpected ${val.length + 1} quasis but got ${node.quasis.length}`);
	        }
	      })
	    }
	  }
	});
	defineType("YieldExpression", {
	  builder: ["argument", "delegate"],
	  visitor: ["argument"],
	  aliases: ["Expression", "Terminatorless"],
	  fields: {
	    delegate: {
	      validate: browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.chain)((0, _utils.assertValueType)("boolean"), Object.assign(function (node, key, val) {
	        if (val && !node.argument) {
	          throw new TypeError("Property delegate of YieldExpression cannot be true if there is no argument");
	        }
	      }, {
	        type: "boolean"
	      })) : (0, _utils.assertValueType)("boolean"),
	      default: false
	    },
	    argument: {
	      optional: true,
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  }
	});
	defineType("AwaitExpression", {
	  builder: ["argument"],
	  visitor: ["argument"],
	  aliases: ["Expression", "Terminatorless"],
	  fields: {
	    argument: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  }
	});
	defineType("Import", {
	  aliases: ["Expression"]
	});
	defineType("BigIntLiteral", {
	  builder: ["value"],
	  fields: {
	    value: {
	      validate: (0, _utils.assertValueType)("string")
	    }
	  },
	  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
	});
	defineType("ExportNamespaceSpecifier", {
	  visitor: ["exported"],
	  aliases: ["ModuleSpecifier"],
	  fields: {
	    exported: {
	      validate: (0, _utils.assertNodeType)("Identifier")
	    }
	  }
	});
	defineType("OptionalMemberExpression", {
	  builder: ["object", "property", "computed", "optional"],
	  visitor: ["object", "property"],
	  aliases: ["Expression"],
	  fields: {
	    object: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    property: {
	      validate: function () {
	        const normal = (0, _utils.assertNodeType)("Identifier");
	        const computed = (0, _utils.assertNodeType)("Expression");
	        const validator = Object.assign(function (node, key, val) {
	          const validator = node.computed ? computed : normal;
	          validator(node, key, val);
	        }, {
	          oneOfNodeTypes: ["Expression", "Identifier"]
	        });
	        return validator;
	      }()
	    },
	    computed: {
	      default: false
	    },
	    optional: {
	      validate: !browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.assertValueType)("boolean") : (0, _utils.chain)((0, _utils.assertValueType)("boolean"), (0, _utils.assertOptionalChainStart)())
	    }
	  }
	});
	defineType("OptionalCallExpression", {
	  visitor: ["callee", "typeParameters", "typeArguments", "arguments"],
	  builder: ["callee", "arguments", "optional"],
	  aliases: ["Expression"],
	  fields: Object.assign({
	    callee: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    arguments: (0, _utils.validateArrayOfType)("Expression", "SpreadElement", "ArgumentPlaceholder"),
	    optional: {
	      validate: !browser$1.env.BABEL_TYPES_8_BREAKING ? (0, _utils.assertValueType)("boolean") : (0, _utils.chain)((0, _utils.assertValueType)("boolean"), (0, _utils.assertOptionalChainStart)())
	    },
	    typeArguments: {
	      validate: (0, _utils.assertNodeType)("TypeParameterInstantiation"),
	      optional: true
	    }
	  }, {
	    typeParameters: {
	      validate: (0, _utils.assertNodeType)("TSTypeParameterInstantiation"),
	      optional: true
	    }
	  })
	});
	defineType("ClassProperty", Object.assign({
	  visitor: ["decorators", "variance", "key", "typeAnnotation", "value"],
	  builder: ["key", "value", "typeAnnotation", "decorators", "computed", "static"],
	  aliases: ["Property"]
	}, classMethodOrPropertyUnionShapeCommon(), {
	  fields: Object.assign({}, classMethodOrPropertyCommon(), {
	    value: {
	      validate: (0, _utils.assertNodeType)("Expression"),
	      optional: true
	    },
	    definite: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    typeAnnotation: {
	      validate: (0, _utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
	      optional: true
	    },
	    decorators: {
	      validate: (0, _utils.arrayOfType)("Decorator"),
	      optional: true
	    },
	    readonly: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    declare: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    variance: {
	      validate: (0, _utils.assertNodeType)("Variance"),
	      optional: true
	    }
	  })
	}));
	defineType("ClassAccessorProperty", Object.assign({
	  visitor: ["decorators", "key", "typeAnnotation", "value"],
	  builder: ["key", "value", "typeAnnotation", "decorators", "computed", "static"],
	  aliases: ["Property", "Accessor"]
	}, classMethodOrPropertyUnionShapeCommon(true), {
	  fields: Object.assign({}, classMethodOrPropertyCommon(), {
	    key: {
	      validate: (0, _utils.chain)(function () {
	        const normal = (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "PrivateName");
	        const computed = (0, _utils.assertNodeType)("Expression");
	        return function (node, key, val) {
	          const validator = node.computed ? computed : normal;
	          validator(node, key, val);
	        };
	      }(), (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "Expression", "PrivateName"))
	    },
	    value: {
	      validate: (0, _utils.assertNodeType)("Expression"),
	      optional: true
	    },
	    definite: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    typeAnnotation: {
	      validate: (0, _utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
	      optional: true
	    },
	    decorators: {
	      validate: (0, _utils.arrayOfType)("Decorator"),
	      optional: true
	    },
	    readonly: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    declare: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    variance: {
	      validate: (0, _utils.assertNodeType)("Variance"),
	      optional: true
	    }
	  })
	}));
	defineType("ClassPrivateProperty", {
	  visitor: ["decorators", "variance", "key", "typeAnnotation", "value"],
	  builder: ["key", "value", "decorators", "static"],
	  aliases: ["Property", "Private"],
	  fields: {
	    key: {
	      validate: (0, _utils.assertNodeType)("PrivateName")
	    },
	    value: {
	      validate: (0, _utils.assertNodeType)("Expression"),
	      optional: true
	    },
	    typeAnnotation: {
	      validate: (0, _utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
	      optional: true
	    },
	    decorators: {
	      validate: (0, _utils.arrayOfType)("Decorator"),
	      optional: true
	    },
	    static: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      default: false
	    },
	    readonly: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    optional: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    definite: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    variance: {
	      validate: (0, _utils.assertNodeType)("Variance"),
	      optional: true
	    }
	  }
	});
	defineType("ClassPrivateMethod", {
	  builder: ["kind", "key", "params", "body", "static"],
	  visitor: ["decorators", "key", "typeParameters", "params", "returnType", "body"],
	  aliases: ["Function", "Scopable", "BlockParent", "FunctionParent", "Method", "Private"],
	  fields: Object.assign({}, classMethodOrDeclareMethodCommon(), functionTypeAnnotationCommon(), {
	    kind: {
	      validate: (0, _utils.assertOneOf)("get", "set", "method"),
	      default: "method"
	    },
	    key: {
	      validate: (0, _utils.assertNodeType)("PrivateName")
	    },
	    body: {
	      validate: (0, _utils.assertNodeType)("BlockStatement")
	    }
	  })
	});
	defineType("PrivateName", {
	  visitor: ["id"],
	  aliases: ["Private"],
	  fields: {
	    id: {
	      validate: (0, _utils.assertNodeType)("Identifier")
	    }
	  }
	});
	defineType("StaticBlock", {
	  visitor: ["body"],
	  fields: {
	    body: (0, _utils.validateArrayOfType)("Statement")
	  },
	  aliases: ["Scopable", "BlockParent", "FunctionParent"]
	});
	defineType("ImportAttribute", {
	  visitor: ["key", "value"],
	  fields: {
	    key: {
	      validate: (0, _utils.assertNodeType)("Identifier", "StringLiteral")
	    },
	    value: {
	      validate: (0, _utils.assertNodeType)("StringLiteral")
	    }
	  }
	});

	
	return core;
}

var flow$1 = {};

var hasRequiredFlow$1;

function requireFlow$1 () {
	if (hasRequiredFlow$1) return flow$1;
	hasRequiredFlow$1 = 1;

	var _core = requireCore();
	var _utils = requireUtils();
	const defineType = (0, _utils.defineAliasedType)("Flow");
	const defineInterfaceishType = name => {
	  const isDeclareClass = name === "DeclareClass";
	  defineType(name, {
	    builder: ["id", "typeParameters", "extends", "body"],
	    visitor: ["id", "typeParameters", "extends", ...(isDeclareClass ? ["mixins", "implements"] : []), "body"],
	    aliases: ["FlowDeclaration", "Statement", "Declaration"],
	    fields: Object.assign({
	      id: (0, _utils.validateType)("Identifier"),
	      typeParameters: (0, _utils.validateOptionalType)("TypeParameterDeclaration"),
	      extends: (0, _utils.validateOptional)((0, _utils.arrayOfType)("InterfaceExtends"))
	    }, isDeclareClass ? {
	      mixins: (0, _utils.validateOptional)((0, _utils.arrayOfType)("InterfaceExtends")),
	      implements: (0, _utils.validateOptional)((0, _utils.arrayOfType)("ClassImplements"))
	    } : {}, {
	      body: (0, _utils.validateType)("ObjectTypeAnnotation")
	    })
	  });
	};
	defineType("AnyTypeAnnotation", {
	  aliases: ["FlowType", "FlowBaseAnnotation"]
	});
	defineType("ArrayTypeAnnotation", {
	  visitor: ["elementType"],
	  aliases: ["FlowType"],
	  fields: {
	    elementType: (0, _utils.validateType)("FlowType")
	  }
	});
	defineType("BooleanTypeAnnotation", {
	  aliases: ["FlowType", "FlowBaseAnnotation"]
	});
	defineType("BooleanLiteralTypeAnnotation", {
	  builder: ["value"],
	  aliases: ["FlowType"],
	  fields: {
	    value: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
	  }
	});
	defineType("NullLiteralTypeAnnotation", {
	  aliases: ["FlowType", "FlowBaseAnnotation"]
	});
	defineType("ClassImplements", {
	  visitor: ["id", "typeParameters"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier"),
	    typeParameters: (0, _utils.validateOptionalType)("TypeParameterInstantiation")
	  }
	});
	defineInterfaceishType("DeclareClass");
	defineType("DeclareFunction", {
	  builder: ["id"],
	  visitor: ["id", "predicate"],
	  aliases: ["FlowDeclaration", "Statement", "Declaration"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier"),
	    predicate: (0, _utils.validateOptionalType)("DeclaredPredicate")
	  }
	});
	defineInterfaceishType("DeclareInterface");
	defineType("DeclareModule", {
	  builder: ["id", "body", "kind"],
	  visitor: ["id", "body"],
	  aliases: ["FlowDeclaration", "Statement", "Declaration"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier", "StringLiteral"),
	    body: (0, _utils.validateType)("BlockStatement"),
	    kind: (0, _utils.validateOptional)((0, _utils.assertOneOf)("CommonJS", "ES"))
	  }
	});
	defineType("DeclareModuleExports", {
	  visitor: ["typeAnnotation"],
	  aliases: ["FlowDeclaration", "Statement", "Declaration"],
	  fields: {
	    typeAnnotation: (0, _utils.validateType)("TypeAnnotation")
	  }
	});
	defineType("DeclareTypeAlias", {
	  visitor: ["id", "typeParameters", "right"],
	  aliases: ["FlowDeclaration", "Statement", "Declaration"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier"),
	    typeParameters: (0, _utils.validateOptionalType)("TypeParameterDeclaration"),
	    right: (0, _utils.validateType)("FlowType")
	  }
	});
	defineType("DeclareOpaqueType", {
	  visitor: ["id", "typeParameters", "supertype"],
	  aliases: ["FlowDeclaration", "Statement", "Declaration"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier"),
	    typeParameters: (0, _utils.validateOptionalType)("TypeParameterDeclaration"),
	    supertype: (0, _utils.validateOptionalType)("FlowType"),
	    impltype: (0, _utils.validateOptionalType)("FlowType")
	  }
	});
	defineType("DeclareVariable", {
	  visitor: ["id"],
	  aliases: ["FlowDeclaration", "Statement", "Declaration"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier")
	  }
	});
	defineType("DeclareExportDeclaration", {
	  visitor: ["declaration", "specifiers", "source", "attributes"],
	  aliases: ["FlowDeclaration", "Statement", "Declaration"],
	  fields: Object.assign({
	    declaration: (0, _utils.validateOptionalType)("Flow"),
	    specifiers: (0, _utils.validateOptional)((0, _utils.arrayOfType)("ExportSpecifier", "ExportNamespaceSpecifier")),
	    source: (0, _utils.validateOptionalType)("StringLiteral"),
	    default: (0, _utils.validateOptional)((0, _utils.assertValueType)("boolean"))
	  }, _core.importAttributes)
	});
	defineType("DeclareExportAllDeclaration", {
	  visitor: ["source", "attributes"],
	  aliases: ["FlowDeclaration", "Statement", "Declaration"],
	  fields: Object.assign({
	    source: (0, _utils.validateType)("StringLiteral"),
	    exportKind: (0, _utils.validateOptional)((0, _utils.assertOneOf)("type", "value"))
	  }, _core.importAttributes)
	});
	defineType("DeclaredPredicate", {
	  visitor: ["value"],
	  aliases: ["FlowPredicate"],
	  fields: {
	    value: (0, _utils.validateType)("Flow")
	  }
	});
	defineType("ExistsTypeAnnotation", {
	  aliases: ["FlowType"]
	});
	defineType("FunctionTypeAnnotation", {
	  builder: ["typeParameters", "params", "rest", "returnType"],
	  visitor: ["typeParameters", "this", "params", "rest", "returnType"],
	  aliases: ["FlowType"],
	  fields: {
	    typeParameters: (0, _utils.validateOptionalType)("TypeParameterDeclaration"),
	    params: (0, _utils.validateArrayOfType)("FunctionTypeParam"),
	    rest: (0, _utils.validateOptionalType)("FunctionTypeParam"),
	    this: (0, _utils.validateOptionalType)("FunctionTypeParam"),
	    returnType: (0, _utils.validateType)("FlowType")
	  }
	});
	defineType("FunctionTypeParam", {
	  visitor: ["name", "typeAnnotation"],
	  fields: {
	    name: (0, _utils.validateOptionalType)("Identifier"),
	    typeAnnotation: (0, _utils.validateType)("FlowType"),
	    optional: (0, _utils.validateOptional)((0, _utils.assertValueType)("boolean"))
	  }
	});
	defineType("GenericTypeAnnotation", {
	  visitor: ["id", "typeParameters"],
	  aliases: ["FlowType"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier", "QualifiedTypeIdentifier"),
	    typeParameters: (0, _utils.validateOptionalType)("TypeParameterInstantiation")
	  }
	});
	defineType("InferredPredicate", {
	  aliases: ["FlowPredicate"]
	});
	defineType("InterfaceExtends", {
	  visitor: ["id", "typeParameters"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier", "QualifiedTypeIdentifier"),
	    typeParameters: (0, _utils.validateOptionalType)("TypeParameterInstantiation")
	  }
	});
	defineInterfaceishType("InterfaceDeclaration");
	defineType("InterfaceTypeAnnotation", {
	  visitor: ["extends", "body"],
	  aliases: ["FlowType"],
	  fields: {
	    extends: (0, _utils.validateOptional)((0, _utils.arrayOfType)("InterfaceExtends")),
	    body: (0, _utils.validateType)("ObjectTypeAnnotation")
	  }
	});
	defineType("IntersectionTypeAnnotation", {
	  visitor: ["types"],
	  aliases: ["FlowType"],
	  fields: {
	    types: (0, _utils.validate)((0, _utils.arrayOfType)("FlowType"))
	  }
	});
	defineType("MixedTypeAnnotation", {
	  aliases: ["FlowType", "FlowBaseAnnotation"]
	});
	defineType("EmptyTypeAnnotation", {
	  aliases: ["FlowType", "FlowBaseAnnotation"]
	});
	defineType("NullableTypeAnnotation", {
	  visitor: ["typeAnnotation"],
	  aliases: ["FlowType"],
	  fields: {
	    typeAnnotation: (0, _utils.validateType)("FlowType")
	  }
	});
	defineType("NumberLiteralTypeAnnotation", {
	  builder: ["value"],
	  aliases: ["FlowType"],
	  fields: {
	    value: (0, _utils.validate)((0, _utils.assertValueType)("number"))
	  }
	});
	defineType("NumberTypeAnnotation", {
	  aliases: ["FlowType", "FlowBaseAnnotation"]
	});
	defineType("ObjectTypeAnnotation", {
	  visitor: ["properties", "indexers", "callProperties", "internalSlots"],
	  aliases: ["FlowType"],
	  builder: ["properties", "indexers", "callProperties", "internalSlots", "exact"],
	  fields: {
	    properties: (0, _utils.validate)((0, _utils.arrayOfType)("ObjectTypeProperty", "ObjectTypeSpreadProperty")),
	    indexers: {
	      validate: (0, _utils.arrayOfType)("ObjectTypeIndexer"),
	      optional: true,
	      default: []
	    },
	    callProperties: {
	      validate: (0, _utils.arrayOfType)("ObjectTypeCallProperty"),
	      optional: true,
	      default: []
	    },
	    internalSlots: {
	      validate: (0, _utils.arrayOfType)("ObjectTypeInternalSlot"),
	      optional: true,
	      default: []
	    },
	    exact: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      default: false
	    },
	    inexact: (0, _utils.validateOptional)((0, _utils.assertValueType)("boolean"))
	  }
	});
	defineType("ObjectTypeInternalSlot", {
	  visitor: ["id", "value"],
	  builder: ["id", "value", "optional", "static", "method"],
	  aliases: ["UserWhitespacable"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier"),
	    value: (0, _utils.validateType)("FlowType"),
	    optional: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
	    static: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
	    method: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
	  }
	});
	defineType("ObjectTypeCallProperty", {
	  visitor: ["value"],
	  aliases: ["UserWhitespacable"],
	  fields: {
	    value: (0, _utils.validateType)("FlowType"),
	    static: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
	  }
	});
	defineType("ObjectTypeIndexer", {
	  visitor: ["variance", "id", "key", "value"],
	  builder: ["id", "key", "value", "variance"],
	  aliases: ["UserWhitespacable"],
	  fields: {
	    id: (0, _utils.validateOptionalType)("Identifier"),
	    key: (0, _utils.validateType)("FlowType"),
	    value: (0, _utils.validateType)("FlowType"),
	    static: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
	    variance: (0, _utils.validateOptionalType)("Variance")
	  }
	});
	defineType("ObjectTypeProperty", {
	  visitor: ["key", "value", "variance"],
	  aliases: ["UserWhitespacable"],
	  fields: {
	    key: (0, _utils.validateType)("Identifier", "StringLiteral"),
	    value: (0, _utils.validateType)("FlowType"),
	    kind: (0, _utils.validate)((0, _utils.assertOneOf)("init", "get", "set")),
	    static: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
	    proto: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
	    optional: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
	    variance: (0, _utils.validateOptionalType)("Variance"),
	    method: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
	  }
	});
	defineType("ObjectTypeSpreadProperty", {
	  visitor: ["argument"],
	  aliases: ["UserWhitespacable"],
	  fields: {
	    argument: (0, _utils.validateType)("FlowType")
	  }
	});
	defineType("OpaqueType", {
	  visitor: ["id", "typeParameters", "supertype", "impltype"],
	  aliases: ["FlowDeclaration", "Statement", "Declaration"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier"),
	    typeParameters: (0, _utils.validateOptionalType)("TypeParameterDeclaration"),
	    supertype: (0, _utils.validateOptionalType)("FlowType"),
	    impltype: (0, _utils.validateType)("FlowType")
	  }
	});
	defineType("QualifiedTypeIdentifier", {
	  visitor: ["qualification", "id"],
	  builder: ["id", "qualification"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier"),
	    qualification: (0, _utils.validateType)("Identifier", "QualifiedTypeIdentifier")
	  }
	});
	defineType("StringLiteralTypeAnnotation", {
	  builder: ["value"],
	  aliases: ["FlowType"],
	  fields: {
	    value: (0, _utils.validate)((0, _utils.assertValueType)("string"))
	  }
	});
	defineType("StringTypeAnnotation", {
	  aliases: ["FlowType", "FlowBaseAnnotation"]
	});
	defineType("SymbolTypeAnnotation", {
	  aliases: ["FlowType", "FlowBaseAnnotation"]
	});
	defineType("ThisTypeAnnotation", {
	  aliases: ["FlowType", "FlowBaseAnnotation"]
	});
	defineType("TupleTypeAnnotation", {
	  visitor: ["types"],
	  aliases: ["FlowType"],
	  fields: {
	    types: (0, _utils.validate)((0, _utils.arrayOfType)("FlowType"))
	  }
	});
	defineType("TypeofTypeAnnotation", {
	  visitor: ["argument"],
	  aliases: ["FlowType"],
	  fields: {
	    argument: (0, _utils.validateType)("FlowType")
	  }
	});
	defineType("TypeAlias", {
	  visitor: ["id", "typeParameters", "right"],
	  aliases: ["FlowDeclaration", "Statement", "Declaration"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier"),
	    typeParameters: (0, _utils.validateOptionalType)("TypeParameterDeclaration"),
	    right: (0, _utils.validateType)("FlowType")
	  }
	});
	defineType("TypeAnnotation", {
	  visitor: ["typeAnnotation"],
	  fields: {
	    typeAnnotation: (0, _utils.validateType)("FlowType")
	  }
	});
	defineType("TypeCastExpression", {
	  visitor: ["expression", "typeAnnotation"],
	  aliases: ["ExpressionWrapper", "Expression"],
	  fields: {
	    expression: (0, _utils.validateType)("Expression"),
	    typeAnnotation: (0, _utils.validateType)("TypeAnnotation")
	  }
	});
	defineType("TypeParameter", {
	  visitor: ["bound", "default", "variance"],
	  fields: {
	    name: (0, _utils.validate)((0, _utils.assertValueType)("string")),
	    bound: (0, _utils.validateOptionalType)("TypeAnnotation"),
	    default: (0, _utils.validateOptionalType)("FlowType"),
	    variance: (0, _utils.validateOptionalType)("Variance")
	  }
	});
	defineType("TypeParameterDeclaration", {
	  visitor: ["params"],
	  fields: {
	    params: (0, _utils.validate)((0, _utils.arrayOfType)("TypeParameter"))
	  }
	});
	defineType("TypeParameterInstantiation", {
	  visitor: ["params"],
	  fields: {
	    params: (0, _utils.validate)((0, _utils.arrayOfType)("FlowType"))
	  }
	});
	defineType("UnionTypeAnnotation", {
	  visitor: ["types"],
	  aliases: ["FlowType"],
	  fields: {
	    types: (0, _utils.validate)((0, _utils.arrayOfType)("FlowType"))
	  }
	});
	defineType("Variance", {
	  builder: ["kind"],
	  fields: {
	    kind: (0, _utils.validate)((0, _utils.assertOneOf)("minus", "plus"))
	  }
	});
	defineType("VoidTypeAnnotation", {
	  aliases: ["FlowType", "FlowBaseAnnotation"]
	});
	defineType("EnumDeclaration", {
	  aliases: ["Statement", "Declaration"],
	  visitor: ["id", "body"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier"),
	    body: (0, _utils.validateType)("EnumBooleanBody", "EnumNumberBody", "EnumStringBody", "EnumSymbolBody")
	  }
	});
	defineType("EnumBooleanBody", {
	  aliases: ["EnumBody"],
	  visitor: ["members"],
	  fields: {
	    explicitType: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
	    members: (0, _utils.validateArrayOfType)("EnumBooleanMember"),
	    hasUnknownMembers: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
	  }
	});
	defineType("EnumNumberBody", {
	  aliases: ["EnumBody"],
	  visitor: ["members"],
	  fields: {
	    explicitType: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
	    members: (0, _utils.validateArrayOfType)("EnumNumberMember"),
	    hasUnknownMembers: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
	  }
	});
	defineType("EnumStringBody", {
	  aliases: ["EnumBody"],
	  visitor: ["members"],
	  fields: {
	    explicitType: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
	    members: (0, _utils.validateArrayOfType)("EnumStringMember", "EnumDefaultedMember"),
	    hasUnknownMembers: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
	  }
	});
	defineType("EnumSymbolBody", {
	  aliases: ["EnumBody"],
	  visitor: ["members"],
	  fields: {
	    members: (0, _utils.validateArrayOfType)("EnumDefaultedMember"),
	    hasUnknownMembers: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
	  }
	});
	defineType("EnumBooleanMember", {
	  aliases: ["EnumMember"],
	  builder: ["id"],
	  visitor: ["id", "init"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier"),
	    init: (0, _utils.validateType)("BooleanLiteral")
	  }
	});
	defineType("EnumNumberMember", {
	  aliases: ["EnumMember"],
	  visitor: ["id", "init"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier"),
	    init: (0, _utils.validateType)("NumericLiteral")
	  }
	});
	defineType("EnumStringMember", {
	  aliases: ["EnumMember"],
	  visitor: ["id", "init"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier"),
	    init: (0, _utils.validateType)("StringLiteral")
	  }
	});
	defineType("EnumDefaultedMember", {
	  aliases: ["EnumMember"],
	  visitor: ["id"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier")
	  }
	});
	defineType("IndexedAccessType", {
	  visitor: ["objectType", "indexType"],
	  aliases: ["FlowType"],
	  fields: {
	    objectType: (0, _utils.validateType)("FlowType"),
	    indexType: (0, _utils.validateType)("FlowType")
	  }
	});
	defineType("OptionalIndexedAccessType", {
	  visitor: ["objectType", "indexType"],
	  aliases: ["FlowType"],
	  fields: {
	    objectType: (0, _utils.validateType)("FlowType"),
	    indexType: (0, _utils.validateType)("FlowType"),
	    optional: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
	  }
	});

	
	return flow$1;
}

var jsx$1 = {};

var hasRequiredJsx$1;

function requireJsx$1 () {
	if (hasRequiredJsx$1) return jsx$1;
	hasRequiredJsx$1 = 1;

	var _utils = requireUtils();
	const defineType = (0, _utils.defineAliasedType)("JSX");
	defineType("JSXAttribute", {
	  visitor: ["name", "value"],
	  aliases: ["Immutable"],
	  fields: {
	    name: {
	      validate: (0, _utils.assertNodeType)("JSXIdentifier", "JSXNamespacedName")
	    },
	    value: {
	      optional: true,
	      validate: (0, _utils.assertNodeType)("JSXElement", "JSXFragment", "StringLiteral", "JSXExpressionContainer")
	    }
	  }
	});
	defineType("JSXClosingElement", {
	  visitor: ["name"],
	  aliases: ["Immutable"],
	  fields: {
	    name: {
	      validate: (0, _utils.assertNodeType)("JSXIdentifier", "JSXMemberExpression", "JSXNamespacedName")
	    }
	  }
	});
	defineType("JSXElement", {
	  builder: ["openingElement", "closingElement", "children", "selfClosing"],
	  visitor: ["openingElement", "children", "closingElement"],
	  aliases: ["Immutable", "Expression"],
	  fields: Object.assign({
	    openingElement: {
	      validate: (0, _utils.assertNodeType)("JSXOpeningElement")
	    },
	    closingElement: {
	      optional: true,
	      validate: (0, _utils.assertNodeType)("JSXClosingElement")
	    },
	    children: (0, _utils.validateArrayOfType)("JSXText", "JSXExpressionContainer", "JSXSpreadChild", "JSXElement", "JSXFragment")
	  }, {
	    selfClosing: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    }
	  })
	});
	defineType("JSXEmptyExpression", {});
	defineType("JSXExpressionContainer", {
	  visitor: ["expression"],
	  aliases: ["Immutable"],
	  fields: {
	    expression: {
	      validate: (0, _utils.assertNodeType)("Expression", "JSXEmptyExpression")
	    }
	  }
	});
	defineType("JSXSpreadChild", {
	  visitor: ["expression"],
	  aliases: ["Immutable"],
	  fields: {
	    expression: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  }
	});
	defineType("JSXIdentifier", {
	  builder: ["name"],
	  fields: {
	    name: {
	      validate: (0, _utils.assertValueType)("string")
	    }
	  }
	});
	defineType("JSXMemberExpression", {
	  visitor: ["object", "property"],
	  fields: {
	    object: {
	      validate: (0, _utils.assertNodeType)("JSXMemberExpression", "JSXIdentifier")
	    },
	    property: {
	      validate: (0, _utils.assertNodeType)("JSXIdentifier")
	    }
	  }
	});
	defineType("JSXNamespacedName", {
	  visitor: ["namespace", "name"],
	  fields: {
	    namespace: {
	      validate: (0, _utils.assertNodeType)("JSXIdentifier")
	    },
	    name: {
	      validate: (0, _utils.assertNodeType)("JSXIdentifier")
	    }
	  }
	});
	defineType("JSXOpeningElement", {
	  builder: ["name", "attributes", "selfClosing"],
	  visitor: ["name", "typeParameters", "typeArguments", "attributes"],
	  aliases: ["Immutable"],
	  fields: Object.assign({
	    name: {
	      validate: (0, _utils.assertNodeType)("JSXIdentifier", "JSXMemberExpression", "JSXNamespacedName")
	    },
	    selfClosing: {
	      default: false
	    },
	    attributes: (0, _utils.validateArrayOfType)("JSXAttribute", "JSXSpreadAttribute"),
	    typeArguments: {
	      validate: (0, _utils.assertNodeType)("TypeParameterInstantiation"),
	      optional: true
	    }
	  }, {
	    typeParameters: {
	      validate: (0, _utils.assertNodeType)("TSTypeParameterInstantiation"),
	      optional: true
	    }
	  })
	});
	defineType("JSXSpreadAttribute", {
	  visitor: ["argument"],
	  fields: {
	    argument: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  }
	});
	defineType("JSXText", {
	  aliases: ["Immutable"],
	  builder: ["value"],
	  fields: {
	    value: {
	      validate: (0, _utils.assertValueType)("string")
	    }
	  }
	});
	defineType("JSXFragment", {
	  builder: ["openingFragment", "closingFragment", "children"],
	  visitor: ["openingFragment", "children", "closingFragment"],
	  aliases: ["Immutable", "Expression"],
	  fields: {
	    openingFragment: {
	      validate: (0, _utils.assertNodeType)("JSXOpeningFragment")
	    },
	    closingFragment: {
	      validate: (0, _utils.assertNodeType)("JSXClosingFragment")
	    },
	    children: (0, _utils.validateArrayOfType)("JSXText", "JSXExpressionContainer", "JSXSpreadChild", "JSXElement", "JSXFragment")
	  }
	});
	defineType("JSXOpeningFragment", {
	  aliases: ["Immutable"]
	});
	defineType("JSXClosingFragment", {
	  aliases: ["Immutable"]
	});

	
	return jsx$1;
}

var misc = {};

var placeholders = {};

var hasRequiredPlaceholders;

function requirePlaceholders () {
	if (hasRequiredPlaceholders) return placeholders;
	hasRequiredPlaceholders = 1;

	Object.defineProperty(placeholders, "__esModule", {
	  value: true
	});
	placeholders.PLACEHOLDERS_FLIPPED_ALIAS = placeholders.PLACEHOLDERS_ALIAS = placeholders.PLACEHOLDERS = void 0;
	var _utils = requireUtils();
	const PLACEHOLDERS = placeholders.PLACEHOLDERS = ["Identifier", "StringLiteral", "Expression", "Statement", "Declaration", "BlockStatement", "ClassBody", "Pattern"];
	const PLACEHOLDERS_ALIAS = placeholders.PLACEHOLDERS_ALIAS = {
	  Declaration: ["Statement"],
	  Pattern: ["PatternLike", "LVal"]
	};
	for (const type of PLACEHOLDERS) {
	  const alias = _utils.ALIAS_KEYS[type];
	  if (alias != null && alias.length) PLACEHOLDERS_ALIAS[type] = alias;
	}
	const PLACEHOLDERS_FLIPPED_ALIAS = placeholders.PLACEHOLDERS_FLIPPED_ALIAS = {};
	Object.keys(PLACEHOLDERS_ALIAS).forEach(type => {
	  PLACEHOLDERS_ALIAS[type].forEach(alias => {
	    if (!hasOwnProperty.call(PLACEHOLDERS_FLIPPED_ALIAS, alias)) {
	      PLACEHOLDERS_FLIPPED_ALIAS[alias] = [];
	    }
	    PLACEHOLDERS_FLIPPED_ALIAS[alias].push(type);
	  });
	});

	
	return placeholders;
}

var hasRequiredMisc;

function requireMisc () {
	if (hasRequiredMisc) return misc;
	hasRequiredMisc = 1;

	var _utils = requireUtils();
	var _placeholders = requirePlaceholders();
	var _core = requireCore();
	const defineType = (0, _utils.defineAliasedType)("Miscellaneous");
	defineType("Noop", {
	  visitor: []
	});
	defineType("Placeholder", {
	  visitor: [],
	  builder: ["expectedNode", "name"],
	  fields: Object.assign({
	    name: {
	      validate: (0, _utils.assertNodeType)("Identifier")
	    },
	    expectedNode: {
	      validate: (0, _utils.assertOneOf)(..._placeholders.PLACEHOLDERS)
	    }
	  }, (0, _core.patternLikeCommon)())
	});
	defineType("V8IntrinsicIdentifier", {
	  builder: ["name"],
	  fields: {
	    name: {
	      validate: (0, _utils.assertValueType)("string")
	    }
	  }
	});

	
	return misc;
}

var experimental = {};

var hasRequiredExperimental;

function requireExperimental () {
	if (hasRequiredExperimental) return experimental;
	hasRequiredExperimental = 1;

	var _utils = requireUtils();
	(0, _utils.default)("ArgumentPlaceholder", {});
	(0, _utils.default)("BindExpression", {
	  visitor: ["object", "callee"],
	  aliases: ["Expression"],
	  fields: !browser$1.env.BABEL_TYPES_8_BREAKING ? {
	    object: {
	      validate: Object.assign(() => {}, {
	        oneOfNodeTypes: ["Expression"]
	      })
	    },
	    callee: {
	      validate: Object.assign(() => {}, {
	        oneOfNodeTypes: ["Expression"]
	      })
	    }
	  } : {
	    object: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    },
	    callee: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  }
	});
	(0, _utils.default)("Decorator", {
	  visitor: ["expression"],
	  fields: {
	    expression: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  }
	});
	(0, _utils.default)("DoExpression", {
	  visitor: ["body"],
	  builder: ["body", "async"],
	  aliases: ["Expression"],
	  fields: {
	    body: {
	      validate: (0, _utils.assertNodeType)("BlockStatement")
	    },
	    async: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      default: false
	    }
	  }
	});
	(0, _utils.default)("ExportDefaultSpecifier", {
	  visitor: ["exported"],
	  aliases: ["ModuleSpecifier"],
	  fields: {
	    exported: {
	      validate: (0, _utils.assertNodeType)("Identifier")
	    }
	  }
	});
	(0, _utils.default)("RecordExpression", {
	  visitor: ["properties"],
	  aliases: ["Expression"],
	  fields: {
	    properties: (0, _utils.validateArrayOfType)("ObjectProperty", "SpreadElement")
	  }
	});
	(0, _utils.default)("TupleExpression", {
	  fields: {
	    elements: {
	      validate: (0, _utils.arrayOfType)("Expression", "SpreadElement"),
	      default: []
	    }
	  },
	  visitor: ["elements"],
	  aliases: ["Expression"]
	});
	(0, _utils.default)("DecimalLiteral", {
	  builder: ["value"],
	  fields: {
	    value: {
	      validate: (0, _utils.assertValueType)("string")
	    }
	  },
	  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
	});
	(0, _utils.default)("ModuleExpression", {
	  visitor: ["body"],
	  fields: {
	    body: {
	      validate: (0, _utils.assertNodeType)("Program")
	    }
	  },
	  aliases: ["Expression"]
	});
	(0, _utils.default)("TopicReference", {
	  aliases: ["Expression"]
	});
	(0, _utils.default)("PipelineTopicExpression", {
	  builder: ["expression"],
	  visitor: ["expression"],
	  fields: {
	    expression: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  },
	  aliases: ["Expression"]
	});
	(0, _utils.default)("PipelineBareFunction", {
	  builder: ["callee"],
	  visitor: ["callee"],
	  fields: {
	    callee: {
	      validate: (0, _utils.assertNodeType)("Expression")
	    }
	  },
	  aliases: ["Expression"]
	});
	(0, _utils.default)("PipelinePrimaryTopicReference", {
	  aliases: ["Expression"]
	});
	(0, _utils.default)("VoidPattern", {
	  aliases: ["Pattern", "PatternLike", "FunctionParameter"]
	});

	
	return experimental;
}

var typescript$1 = {};

var hasRequiredTypescript$1;

function requireTypescript$1 () {
	if (hasRequiredTypescript$1) return typescript$1;
	hasRequiredTypescript$1 = 1;

	var _utils = requireUtils();
	var _core = requireCore();
	var _is = requireIs();
	const defineType = (0, _utils.defineAliasedType)("TypeScript");
	const bool = (0, _utils.assertValueType)("boolean");
	const tSFunctionTypeAnnotationCommon = () => ({
	  returnType: {
	    validate: (0, _utils.assertNodeType)("TSTypeAnnotation", "Noop"),
	    optional: true
	  },
	  typeParameters: {
	    validate: (0, _utils.assertNodeType)("TSTypeParameterDeclaration", "Noop"),
	    optional: true
	  }
	});
	defineType("TSParameterProperty", {
	  aliases: ["LVal"],
	  visitor: ["parameter"],
	  fields: {
	    accessibility: {
	      validate: (0, _utils.assertOneOf)("public", "private", "protected"),
	      optional: true
	    },
	    readonly: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    parameter: {
	      validate: (0, _utils.assertNodeType)("Identifier", "AssignmentPattern")
	    },
	    override: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    decorators: {
	      validate: (0, _utils.arrayOfType)("Decorator"),
	      optional: true
	    }
	  }
	});
	defineType("TSDeclareFunction", {
	  aliases: ["Statement", "Declaration"],
	  visitor: ["id", "typeParameters", "params", "returnType"],
	  fields: Object.assign({}, (0, _core.functionDeclarationCommon)(), tSFunctionTypeAnnotationCommon())
	});
	defineType("TSDeclareMethod", Object.assign({
	  visitor: ["decorators", "key", "typeParameters", "params", "returnType"]
	}, (0, _core.classMethodOrPropertyUnionShapeCommon)(), {
	  fields: Object.assign({}, (0, _core.classMethodOrDeclareMethodCommon)(), tSFunctionTypeAnnotationCommon())
	}));
	defineType("TSQualifiedName", {
	  aliases: ["TSEntityName"],
	  visitor: ["left", "right"],
	  fields: {
	    left: (0, _utils.validateType)("TSEntityName"),
	    right: (0, _utils.validateType)("Identifier")
	  }
	});
	const signatureDeclarationCommon = () => ({
	  typeParameters: (0, _utils.validateOptionalType)("TSTypeParameterDeclaration"),
	  ["parameters"]: (0, _utils.validateArrayOfType)("ArrayPattern", "Identifier", "ObjectPattern", "RestElement"),
	  ["typeAnnotation"]: (0, _utils.validateOptionalType)("TSTypeAnnotation")
	});
	const callConstructSignatureDeclaration = {
	  aliases: ["TSTypeElement"],
	  visitor: ["typeParameters", "parameters", "typeAnnotation"],
	  fields: signatureDeclarationCommon()
	};
	defineType("TSCallSignatureDeclaration", callConstructSignatureDeclaration);
	defineType("TSConstructSignatureDeclaration", callConstructSignatureDeclaration);
	const namedTypeElementCommon = () => ({
	  key: (0, _utils.validateType)("Expression"),
	  computed: {
	    default: false
	  },
	  optional: (0, _utils.validateOptional)(bool)
	});
	defineType("TSPropertySignature", {
	  aliases: ["TSTypeElement"],
	  visitor: ["key", "typeAnnotation"],
	  fields: Object.assign({}, namedTypeElementCommon(), {
	    readonly: (0, _utils.validateOptional)(bool),
	    typeAnnotation: (0, _utils.validateOptionalType)("TSTypeAnnotation"),
	    kind: {
	      optional: true,
	      validate: (0, _utils.assertOneOf)("get", "set")
	    }
	  })
	});
	defineType("TSMethodSignature", {
	  aliases: ["TSTypeElement"],
	  visitor: ["key", "typeParameters", "parameters", "typeAnnotation"],
	  fields: Object.assign({}, signatureDeclarationCommon(), namedTypeElementCommon(), {
	    kind: {
	      validate: (0, _utils.assertOneOf)("method", "get", "set")
	    }
	  })
	});
	defineType("TSIndexSignature", {
	  aliases: ["TSTypeElement"],
	  visitor: ["parameters", "typeAnnotation"],
	  fields: {
	    readonly: (0, _utils.validateOptional)(bool),
	    static: (0, _utils.validateOptional)(bool),
	    parameters: (0, _utils.validateArrayOfType)("Identifier"),
	    typeAnnotation: (0, _utils.validateOptionalType)("TSTypeAnnotation")
	  }
	});
	const tsKeywordTypes = ["TSAnyKeyword", "TSBooleanKeyword", "TSBigIntKeyword", "TSIntrinsicKeyword", "TSNeverKeyword", "TSNullKeyword", "TSNumberKeyword", "TSObjectKeyword", "TSStringKeyword", "TSSymbolKeyword", "TSUndefinedKeyword", "TSUnknownKeyword", "TSVoidKeyword"];
	for (const type of tsKeywordTypes) {
	  defineType(type, {
	    aliases: ["TSType", "TSBaseType"],
	    visitor: [],
	    fields: {}
	  });
	}
	defineType("TSThisType", {
	  aliases: ["TSType", "TSBaseType"],
	  visitor: [],
	  fields: {}
	});
	const fnOrCtrBase = {
	  aliases: ["TSType"],
	  visitor: ["typeParameters", "parameters", "typeAnnotation"]
	};
	defineType("TSFunctionType", Object.assign({}, fnOrCtrBase, {
	  fields: signatureDeclarationCommon()
	}));
	defineType("TSConstructorType", Object.assign({}, fnOrCtrBase, {
	  fields: Object.assign({}, signatureDeclarationCommon(), {
	    abstract: (0, _utils.validateOptional)(bool)
	  })
	}));
	defineType("TSTypeReference", {
	  aliases: ["TSType"],
	  visitor: ["typeName", "typeParameters"],
	  fields: {
	    typeName: (0, _utils.validateType)("TSEntityName"),
	    ["typeParameters"]: (0, _utils.validateOptionalType)("TSTypeParameterInstantiation")
	  }
	});
	defineType("TSTypePredicate", {
	  aliases: ["TSType"],
	  visitor: ["parameterName", "typeAnnotation"],
	  builder: ["parameterName", "typeAnnotation", "asserts"],
	  fields: {
	    parameterName: (0, _utils.validateType)("Identifier", "TSThisType"),
	    typeAnnotation: (0, _utils.validateOptionalType)("TSTypeAnnotation"),
	    asserts: (0, _utils.validateOptional)(bool)
	  }
	});
	defineType("TSTypeQuery", {
	  aliases: ["TSType"],
	  visitor: ["exprName", "typeParameters"],
	  fields: {
	    exprName: (0, _utils.validateType)("TSEntityName", "TSImportType"),
	    ["typeParameters"]: (0, _utils.validateOptionalType)("TSTypeParameterInstantiation")
	  }
	});
	defineType("TSTypeLiteral", {
	  aliases: ["TSType"],
	  visitor: ["members"],
	  fields: {
	    members: (0, _utils.validateArrayOfType)("TSTypeElement")
	  }
	});
	defineType("TSArrayType", {
	  aliases: ["TSType"],
	  visitor: ["elementType"],
	  fields: {
	    elementType: (0, _utils.validateType)("TSType")
	  }
	});
	defineType("TSTupleType", {
	  aliases: ["TSType"],
	  visitor: ["elementTypes"],
	  fields: {
	    elementTypes: (0, _utils.validateArrayOfType)("TSType", "TSNamedTupleMember")
	  }
	});
	defineType("TSOptionalType", {
	  aliases: ["TSType"],
	  visitor: ["typeAnnotation"],
	  fields: {
	    typeAnnotation: (0, _utils.validateType)("TSType")
	  }
	});
	defineType("TSRestType", {
	  aliases: ["TSType"],
	  visitor: ["typeAnnotation"],
	  fields: {
	    typeAnnotation: (0, _utils.validateType)("TSType")
	  }
	});
	defineType("TSNamedTupleMember", {
	  visitor: ["label", "elementType"],
	  builder: ["label", "elementType", "optional"],
	  fields: {
	    label: (0, _utils.validateType)("Identifier"),
	    optional: {
	      validate: bool,
	      default: false
	    },
	    elementType: (0, _utils.validateType)("TSType")
	  }
	});
	const unionOrIntersection = {
	  aliases: ["TSType"],
	  visitor: ["types"],
	  fields: {
	    types: (0, _utils.validateArrayOfType)("TSType")
	  }
	};
	defineType("TSUnionType", unionOrIntersection);
	defineType("TSIntersectionType", unionOrIntersection);
	defineType("TSConditionalType", {
	  aliases: ["TSType"],
	  visitor: ["checkType", "extendsType", "trueType", "falseType"],
	  fields: {
	    checkType: (0, _utils.validateType)("TSType"),
	    extendsType: (0, _utils.validateType)("TSType"),
	    trueType: (0, _utils.validateType)("TSType"),
	    falseType: (0, _utils.validateType)("TSType")
	  }
	});
	defineType("TSInferType", {
	  aliases: ["TSType"],
	  visitor: ["typeParameter"],
	  fields: {
	    typeParameter: (0, _utils.validateType)("TSTypeParameter")
	  }
	});
	defineType("TSParenthesizedType", {
	  aliases: ["TSType"],
	  visitor: ["typeAnnotation"],
	  fields: {
	    typeAnnotation: (0, _utils.validateType)("TSType")
	  }
	});
	defineType("TSTypeOperator", {
	  aliases: ["TSType"],
	  visitor: ["typeAnnotation"],
	  builder: ["typeAnnotation", "operator"],
	  fields: {
	    operator: {
	      validate: (0, _utils.assertValueType)("string"),
	      default: "keyof"
	    },
	    typeAnnotation: (0, _utils.validateType)("TSType")
	  }
	});
	defineType("TSIndexedAccessType", {
	  aliases: ["TSType"],
	  visitor: ["objectType", "indexType"],
	  fields: {
	    objectType: (0, _utils.validateType)("TSType"),
	    indexType: (0, _utils.validateType)("TSType")
	  }
	});
	defineType("TSMappedType", {
	  aliases: ["TSType"],
	  visitor: ["typeParameter", "nameType", "typeAnnotation"],
	  builder: ["typeParameter", "typeAnnotation", "nameType"],
	  fields: Object.assign({}, {
	    typeParameter: (0, _utils.validateType)("TSTypeParameter")
	  }, {
	    readonly: (0, _utils.validateOptional)((0, _utils.assertOneOf)(true, false, "+", "-")),
	    optional: (0, _utils.validateOptional)((0, _utils.assertOneOf)(true, false, "+", "-")),
	    typeAnnotation: (0, _utils.validateOptionalType)("TSType"),
	    nameType: (0, _utils.validateOptionalType)("TSType")
	  })
	});
	defineType("TSTemplateLiteralType", {
	  aliases: ["TSType", "TSBaseType"],
	  visitor: ["quasis", "types"],
	  fields: {
	    quasis: (0, _utils.validateArrayOfType)("TemplateElement"),
	    types: {
	      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("TSType")), function (node, key, val) {
	        if (node.quasis.length !== val.length + 1) {
	          throw new TypeError(`Number of ${node.type} quasis should be exactly one more than the number of types.\nExpected ${val.length + 1} quasis but got ${node.quasis.length}`);
	        }
	      })
	    }
	  }
	});
	defineType("TSLiteralType", {
	  aliases: ["TSType", "TSBaseType"],
	  visitor: ["literal"],
	  fields: {
	    literal: {
	      validate: function () {
	        const unaryExpression = (0, _utils.assertNodeType)("NumericLiteral", "BigIntLiteral");
	        const unaryOperator = (0, _utils.assertOneOf)("-");
	        const literal = (0, _utils.assertNodeType)("NumericLiteral", "StringLiteral", "BooleanLiteral", "BigIntLiteral", "TemplateLiteral");
	        const validator = function validator(parent, key, node) {
	          if ((0, _is.default)("UnaryExpression", node)) {
	            unaryOperator(node, "operator", node.operator);
	            unaryExpression(node, "argument", node.argument);
	          } else {
	            literal(parent, key, node);
	          }
	        };
	        validator.oneOfNodeTypes = ["NumericLiteral", "StringLiteral", "BooleanLiteral", "BigIntLiteral", "TemplateLiteral", "UnaryExpression"];
	        return validator;
	      }()
	    }
	  }
	});
	defineType("TSExpressionWithTypeArguments", {
	  aliases: ["TSType"],
	  visitor: ["expression", "typeParameters"],
	  fields: {
	    expression: (0, _utils.validateType)("TSEntityName"),
	    typeParameters: (0, _utils.validateOptionalType)("TSTypeParameterInstantiation")
	  }
	});
	defineType("TSInterfaceDeclaration", {
	  aliases: ["Statement", "Declaration"],
	  visitor: ["id", "typeParameters", "extends", "body"],
	  fields: {
	    declare: (0, _utils.validateOptional)(bool),
	    id: (0, _utils.validateType)("Identifier"),
	    typeParameters: (0, _utils.validateOptionalType)("TSTypeParameterDeclaration"),
	    extends: (0, _utils.validateOptional)((0, _utils.arrayOfType)("TSExpressionWithTypeArguments")),
	    body: (0, _utils.validateType)("TSInterfaceBody")
	  }
	});
	defineType("TSInterfaceBody", {
	  visitor: ["body"],
	  fields: {
	    body: (0, _utils.validateArrayOfType)("TSTypeElement")
	  }
	});
	defineType("TSTypeAliasDeclaration", {
	  aliases: ["Statement", "Declaration"],
	  visitor: ["id", "typeParameters", "typeAnnotation"],
	  fields: {
	    declare: (0, _utils.validateOptional)(bool),
	    id: (0, _utils.validateType)("Identifier"),
	    typeParameters: (0, _utils.validateOptionalType)("TSTypeParameterDeclaration"),
	    typeAnnotation: (0, _utils.validateType)("TSType")
	  }
	});
	defineType("TSInstantiationExpression", {
	  aliases: ["Expression"],
	  visitor: ["expression", "typeParameters"],
	  fields: {
	    expression: (0, _utils.validateType)("Expression"),
	    ["typeParameters"]: (0, _utils.validateOptionalType)("TSTypeParameterInstantiation")
	  }
	});
	const TSTypeExpression = {
	  aliases: ["Expression", "LVal", "PatternLike"],
	  visitor: ["expression", "typeAnnotation"],
	  fields: {
	    expression: (0, _utils.validateType)("Expression"),
	    typeAnnotation: (0, _utils.validateType)("TSType")
	  }
	};
	defineType("TSAsExpression", TSTypeExpression);
	defineType("TSSatisfiesExpression", TSTypeExpression);
	defineType("TSTypeAssertion", {
	  aliases: ["Expression", "LVal", "PatternLike"],
	  visitor: ["typeAnnotation", "expression"],
	  fields: {
	    typeAnnotation: (0, _utils.validateType)("TSType"),
	    expression: (0, _utils.validateType)("Expression")
	  }
	});
	defineType("TSEnumBody", {
	  visitor: ["members"],
	  fields: {
	    members: (0, _utils.validateArrayOfType)("TSEnumMember")
	  }
	});
	defineType("TSEnumDeclaration", {
	  aliases: ["Statement", "Declaration"],
	  visitor: ["id", "members"],
	  fields: {
	    declare: (0, _utils.validateOptional)(bool),
	    const: (0, _utils.validateOptional)(bool),
	    id: (0, _utils.validateType)("Identifier"),
	    members: (0, _utils.validateArrayOfType)("TSEnumMember"),
	    initializer: (0, _utils.validateOptionalType)("Expression"),
	    body: (0, _utils.validateOptionalType)("TSEnumBody")
	  }
	});
	defineType("TSEnumMember", {
	  visitor: ["id", "initializer"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier", "StringLiteral"),
	    initializer: (0, _utils.validateOptionalType)("Expression")
	  }
	});
	defineType("TSModuleDeclaration", {
	  aliases: ["Statement", "Declaration"],
	  visitor: ["id", "body"],
	  fields: Object.assign({
	    kind: {
	      validate: (0, _utils.assertOneOf)("global", "module", "namespace")
	    },
	    declare: (0, _utils.validateOptional)(bool)
	  }, {
	    global: (0, _utils.validateOptional)(bool)
	  }, {
	    id: (0, _utils.validateType)("Identifier", "StringLiteral"),
	    body: (0, _utils.validateType)("TSModuleBlock", "TSModuleDeclaration")
	  })
	});
	defineType("TSModuleBlock", {
	  aliases: ["Scopable", "Block", "BlockParent", "FunctionParent"],
	  visitor: ["body"],
	  fields: {
	    body: (0, _utils.validateArrayOfType)("Statement")
	  }
	});
	defineType("TSImportType", {
	  aliases: ["TSType"],
	  builder: ["argument", "qualifier", "typeParameters"],
	  visitor: ["argument", "options", "qualifier", "typeParameters"],
	  fields: Object.assign({}, {
	    argument: (0, _utils.validateType)("StringLiteral")
	  }, {
	    qualifier: (0, _utils.validateOptionalType)("TSEntityName")
	  }, {
	    typeParameters: (0, _utils.validateOptionalType)("TSTypeParameterInstantiation")
	  }, {
	    options: {
	      validate: (0, _utils.assertNodeType)("ObjectExpression"),
	      optional: true
	    }
	  })
	});
	defineType("TSImportEqualsDeclaration", {
	  aliases: ["Statement", "Declaration"],
	  visitor: ["id", "moduleReference"],
	  fields: Object.assign({}, {
	    isExport: (0, _utils.validate)(bool)
	  }, {
	    id: (0, _utils.validateType)("Identifier"),
	    moduleReference: (0, _utils.validateType)("TSEntityName", "TSExternalModuleReference"),
	    importKind: {
	      validate: (0, _utils.assertOneOf)("type", "value"),
	      optional: true
	    }
	  })
	});
	defineType("TSExternalModuleReference", {
	  visitor: ["expression"],
	  fields: {
	    expression: (0, _utils.validateType)("StringLiteral")
	  }
	});
	defineType("TSNonNullExpression", {
	  aliases: ["Expression", "LVal", "PatternLike"],
	  visitor: ["expression"],
	  fields: {
	    expression: (0, _utils.validateType)("Expression")
	  }
	});
	defineType("TSExportAssignment", {
	  aliases: ["Statement"],
	  visitor: ["expression"],
	  fields: {
	    expression: (0, _utils.validateType)("Expression")
	  }
	});
	defineType("TSNamespaceExportDeclaration", {
	  aliases: ["Statement"],
	  visitor: ["id"],
	  fields: {
	    id: (0, _utils.validateType)("Identifier")
	  }
	});
	defineType("TSTypeAnnotation", {
	  visitor: ["typeAnnotation"],
	  fields: {
	    typeAnnotation: {
	      validate: (0, _utils.assertNodeType)("TSType")
	    }
	  }
	});
	defineType("TSTypeParameterInstantiation", {
	  visitor: ["params"],
	  fields: {
	    params: (0, _utils.validateArrayOfType)("TSType")
	  }
	});
	defineType("TSTypeParameterDeclaration", {
	  visitor: ["params"],
	  fields: {
	    params: (0, _utils.validateArrayOfType)("TSTypeParameter")
	  }
	});
	defineType("TSTypeParameter", {
	  builder: ["constraint", "default", "name"],
	  visitor: ["constraint", "default"],
	  fields: {
	    name: {
	      validate: (0, _utils.assertValueType)("string")
	    },
	    in: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    out: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    const: {
	      validate: (0, _utils.assertValueType)("boolean"),
	      optional: true
	    },
	    constraint: {
	      validate: (0, _utils.assertNodeType)("TSType"),
	      optional: true
	    },
	    default: {
	      validate: (0, _utils.assertNodeType)("TSType"),
	      optional: true
	    }
	  }
	});

	
	return typescript$1;
}

var deprecatedAliases = {};

var hasRequiredDeprecatedAliases;

function requireDeprecatedAliases () {
	if (hasRequiredDeprecatedAliases) return deprecatedAliases;
	hasRequiredDeprecatedAliases = 1;

	Object.defineProperty(deprecatedAliases, "__esModule", {
	  value: true
	});
	deprecatedAliases.DEPRECATED_ALIASES = void 0;
	deprecatedAliases.DEPRECATED_ALIASES = {
	  ModuleDeclaration: "ImportOrExportDeclaration"
	};

	
	return deprecatedAliases;
}

var hasRequiredDefinitions;

function requireDefinitions () {
	if (hasRequiredDefinitions) return definitions;
	hasRequiredDefinitions = 1;
	(function (exports$1) {

		Object.defineProperty(exports$1, "__esModule", {
		  value: true
		});
		Object.defineProperty(exports$1, "ALIAS_KEYS", {
		  enumerable: true,
		  get: function () {
		    return _utils.ALIAS_KEYS;
		  }
		});
		Object.defineProperty(exports$1, "BUILDER_KEYS", {
		  enumerable: true,
		  get: function () {
		    return _utils.BUILDER_KEYS;
		  }
		});
		Object.defineProperty(exports$1, "DEPRECATED_ALIASES", {
		  enumerable: true,
		  get: function () {
		    return _deprecatedAliases.DEPRECATED_ALIASES;
		  }
		});
		Object.defineProperty(exports$1, "DEPRECATED_KEYS", {
		  enumerable: true,
		  get: function () {
		    return _utils.DEPRECATED_KEYS;
		  }
		});
		Object.defineProperty(exports$1, "FLIPPED_ALIAS_KEYS", {
		  enumerable: true,
		  get: function () {
		    return _utils.FLIPPED_ALIAS_KEYS;
		  }
		});
		Object.defineProperty(exports$1, "NODE_FIELDS", {
		  enumerable: true,
		  get: function () {
		    return _utils.NODE_FIELDS;
		  }
		});
		Object.defineProperty(exports$1, "NODE_PARENT_VALIDATIONS", {
		  enumerable: true,
		  get: function () {
		    return _utils.NODE_PARENT_VALIDATIONS;
		  }
		});
		Object.defineProperty(exports$1, "NODE_UNION_SHAPES__PRIVATE", {
		  enumerable: true,
		  get: function () {
		    return _utils.NODE_UNION_SHAPES__PRIVATE;
		  }
		});
		Object.defineProperty(exports$1, "PLACEHOLDERS", {
		  enumerable: true,
		  get: function () {
		    return _placeholders.PLACEHOLDERS;
		  }
		});
		Object.defineProperty(exports$1, "PLACEHOLDERS_ALIAS", {
		  enumerable: true,
		  get: function () {
		    return _placeholders.PLACEHOLDERS_ALIAS;
		  }
		});
		Object.defineProperty(exports$1, "PLACEHOLDERS_FLIPPED_ALIAS", {
		  enumerable: true,
		  get: function () {
		    return _placeholders.PLACEHOLDERS_FLIPPED_ALIAS;
		  }
		});
		exports$1.TYPES = void 0;
		Object.defineProperty(exports$1, "VISITOR_KEYS", {
		  enumerable: true,
		  get: function () {
		    return _utils.VISITOR_KEYS;
		  }
		});
		requireCore();
		requireFlow$1();
		requireJsx$1();
		requireMisc();
		requireExperimental();
		requireTypescript$1();
		var _utils = requireUtils();
		var _placeholders = requirePlaceholders();
		var _deprecatedAliases = requireDeprecatedAliases();
		Object.keys(_deprecatedAliases.DEPRECATED_ALIASES).forEach(deprecatedAlias => {
		  _utils.FLIPPED_ALIAS_KEYS[deprecatedAlias] = _utils.FLIPPED_ALIAS_KEYS[_deprecatedAliases.DEPRECATED_ALIASES[deprecatedAlias]];
		});
		for (const {
		  types,
		  set
		} of _utils.allExpandedTypes) {
		  for (const type of types) {
		    const aliases = _utils.FLIPPED_ALIAS_KEYS[type];
		    if (aliases) {
		      aliases.forEach(set.add, set);
		    } else {
		      set.add(type);
		    }
		  }
		}
		exports$1.TYPES = [].concat(Object.keys(_utils.VISITOR_KEYS), Object.keys(_utils.FLIPPED_ALIAS_KEYS), Object.keys(_utils.DEPRECATED_KEYS));

		
	} (definitions));
	return definitions;
}

var hasRequiredValidate;

function requireValidate () {
	if (hasRequiredValidate) return validate;
	hasRequiredValidate = 1;

	Object.defineProperty(validate, "__esModule", {
	  value: true
	});
	validate.default = validate$1;
	validate.validateChild = validateChild;
	validate.validateField = validateField;
	validate.validateInternal = validateInternal;
	var _index = requireDefinitions();
	function validate$1(node, key, val) {
	  if (!node) return;
	  const fields = _index.NODE_FIELDS[node.type];
	  if (!fields) return;
	  const field = fields[key];
	  validateField(node, key, val, field);
	  validateChild(node, key, val);
	}
	function validateInternal(field, node, key, val, maybeNode) {
	  if (!(field != null && field.validate)) return;
	  if (field.optional && val == null) return;
	  field.validate(node, key, val);
	  if (maybeNode) {
	    var _NODE_PARENT_VALIDATI;
	    const type = val.type;
	    if (type == null) return;
	    (_NODE_PARENT_VALIDATI = _index.NODE_PARENT_VALIDATIONS[type]) == null || _NODE_PARENT_VALIDATI.call(_index.NODE_PARENT_VALIDATIONS, node, key, val);
	  }
	}
	function validateField(node, key, val, field) {
	  if (!(field != null && field.validate)) return;
	  if (field.optional && val == null) return;
	  field.validate(node, key, val);
	}
	function validateChild(node, key, val) {
	  var _NODE_PARENT_VALIDATI2;
	  const type = val == null ? void 0 : val.type;
	  if (type == null) return;
	  (_NODE_PARENT_VALIDATI2 = _index.NODE_PARENT_VALIDATIONS[type]) == null || _NODE_PARENT_VALIDATI2.call(_index.NODE_PARENT_VALIDATIONS, node, key, val);
	}

	
	return validate;
}

var hasRequiredLowercase;

function requireLowercase () {
	if (hasRequiredLowercase) return lowercase;
	hasRequiredLowercase = 1;

	Object.defineProperty(lowercase, "__esModule", {
	  value: true
	});
	lowercase.anyTypeAnnotation = anyTypeAnnotation;
	lowercase.argumentPlaceholder = argumentPlaceholder;
	lowercase.arrayExpression = arrayExpression;
	lowercase.arrayPattern = arrayPattern;
	lowercase.arrayTypeAnnotation = arrayTypeAnnotation;
	lowercase.arrowFunctionExpression = arrowFunctionExpression;
	lowercase.assignmentExpression = assignmentExpression;
	lowercase.assignmentPattern = assignmentPattern;
	lowercase.awaitExpression = awaitExpression;
	lowercase.bigIntLiteral = bigIntLiteral;
	lowercase.binaryExpression = binaryExpression;
	lowercase.bindExpression = bindExpression;
	lowercase.blockStatement = blockStatement;
	lowercase.booleanLiteral = booleanLiteral;
	lowercase.booleanLiteralTypeAnnotation = booleanLiteralTypeAnnotation;
	lowercase.booleanTypeAnnotation = booleanTypeAnnotation;
	lowercase.breakStatement = breakStatement;
	lowercase.callExpression = callExpression;
	lowercase.catchClause = catchClause;
	lowercase.classAccessorProperty = classAccessorProperty;
	lowercase.classBody = classBody;
	lowercase.classDeclaration = classDeclaration;
	lowercase.classExpression = classExpression;
	lowercase.classImplements = classImplements;
	lowercase.classMethod = classMethod;
	lowercase.classPrivateMethod = classPrivateMethod;
	lowercase.classPrivateProperty = classPrivateProperty;
	lowercase.classProperty = classProperty;
	lowercase.conditionalExpression = conditionalExpression;
	lowercase.continueStatement = continueStatement;
	lowercase.debuggerStatement = debuggerStatement;
	lowercase.decimalLiteral = decimalLiteral;
	lowercase.declareClass = declareClass;
	lowercase.declareExportAllDeclaration = declareExportAllDeclaration;
	lowercase.declareExportDeclaration = declareExportDeclaration;
	lowercase.declareFunction = declareFunction;
	lowercase.declareInterface = declareInterface;
	lowercase.declareModule = declareModule;
	lowercase.declareModuleExports = declareModuleExports;
	lowercase.declareOpaqueType = declareOpaqueType;
	lowercase.declareTypeAlias = declareTypeAlias;
	lowercase.declareVariable = declareVariable;
	lowercase.declaredPredicate = declaredPredicate;
	lowercase.decorator = decorator;
	lowercase.directive = directive;
	lowercase.directiveLiteral = directiveLiteral;
	lowercase.doExpression = doExpression;
	lowercase.doWhileStatement = doWhileStatement;
	lowercase.emptyStatement = emptyStatement;
	lowercase.emptyTypeAnnotation = emptyTypeAnnotation;
	lowercase.enumBooleanBody = enumBooleanBody;
	lowercase.enumBooleanMember = enumBooleanMember;
	lowercase.enumDeclaration = enumDeclaration;
	lowercase.enumDefaultedMember = enumDefaultedMember;
	lowercase.enumNumberBody = enumNumberBody;
	lowercase.enumNumberMember = enumNumberMember;
	lowercase.enumStringBody = enumStringBody;
	lowercase.enumStringMember = enumStringMember;
	lowercase.enumSymbolBody = enumSymbolBody;
	lowercase.existsTypeAnnotation = existsTypeAnnotation;
	lowercase.exportAllDeclaration = exportAllDeclaration;
	lowercase.exportDefaultDeclaration = exportDefaultDeclaration;
	lowercase.exportDefaultSpecifier = exportDefaultSpecifier;
	lowercase.exportNamedDeclaration = exportNamedDeclaration;
	lowercase.exportNamespaceSpecifier = exportNamespaceSpecifier;
	lowercase.exportSpecifier = exportSpecifier;
	lowercase.expressionStatement = expressionStatement;
	lowercase.file = file;
	lowercase.forInStatement = forInStatement;
	lowercase.forOfStatement = forOfStatement;
	lowercase.forStatement = forStatement;
	lowercase.functionDeclaration = functionDeclaration;
	lowercase.functionExpression = functionExpression;
	lowercase.functionTypeAnnotation = functionTypeAnnotation;
	lowercase.functionTypeParam = functionTypeParam;
	lowercase.genericTypeAnnotation = genericTypeAnnotation;
	lowercase.identifier = identifier;
	lowercase.ifStatement = ifStatement;
	lowercase.import = _import;
	lowercase.importAttribute = importAttribute;
	lowercase.importDeclaration = importDeclaration;
	lowercase.importDefaultSpecifier = importDefaultSpecifier;
	lowercase.importExpression = importExpression;
	lowercase.importNamespaceSpecifier = importNamespaceSpecifier;
	lowercase.importSpecifier = importSpecifier;
	lowercase.indexedAccessType = indexedAccessType;
	lowercase.inferredPredicate = inferredPredicate;
	lowercase.interfaceDeclaration = interfaceDeclaration;
	lowercase.interfaceExtends = interfaceExtends;
	lowercase.interfaceTypeAnnotation = interfaceTypeAnnotation;
	lowercase.interpreterDirective = interpreterDirective;
	lowercase.intersectionTypeAnnotation = intersectionTypeAnnotation;
	lowercase.jSXAttribute = lowercase.jsxAttribute = jsxAttribute;
	lowercase.jSXClosingElement = lowercase.jsxClosingElement = jsxClosingElement;
	lowercase.jSXClosingFragment = lowercase.jsxClosingFragment = jsxClosingFragment;
	lowercase.jSXElement = lowercase.jsxElement = jsxElement;
	lowercase.jSXEmptyExpression = lowercase.jsxEmptyExpression = jsxEmptyExpression;
	lowercase.jSXExpressionContainer = lowercase.jsxExpressionContainer = jsxExpressionContainer;
	lowercase.jSXFragment = lowercase.jsxFragment = jsxFragment;
	lowercase.jSXIdentifier = lowercase.jsxIdentifier = jsxIdentifier;
	lowercase.jSXMemberExpression = lowercase.jsxMemberExpression = jsxMemberExpression;
	lowercase.jSXNamespacedName = lowercase.jsxNamespacedName = jsxNamespacedName;
	lowercase.jSXOpeningElement = lowercase.jsxOpeningElement = jsxOpeningElement;
	lowercase.jSXOpeningFragment = lowercase.jsxOpeningFragment = jsxOpeningFragment;
	lowercase.jSXSpreadAttribute = lowercase.jsxSpreadAttribute = jsxSpreadAttribute;
	lowercase.jSXSpreadChild = lowercase.jsxSpreadChild = jsxSpreadChild;
	lowercase.jSXText = lowercase.jsxText = jsxText;
	lowercase.labeledStatement = labeledStatement;
	lowercase.logicalExpression = logicalExpression;
	lowercase.memberExpression = memberExpression;
	lowercase.metaProperty = metaProperty;
	lowercase.mixedTypeAnnotation = mixedTypeAnnotation;
	lowercase.moduleExpression = moduleExpression;
	lowercase.newExpression = newExpression;
	lowercase.noop = noop;
	lowercase.nullLiteral = nullLiteral;
	lowercase.nullLiteralTypeAnnotation = nullLiteralTypeAnnotation;
	lowercase.nullableTypeAnnotation = nullableTypeAnnotation;
	lowercase.numberLiteral = NumberLiteral;
	lowercase.numberLiteralTypeAnnotation = numberLiteralTypeAnnotation;
	lowercase.numberTypeAnnotation = numberTypeAnnotation;
	lowercase.numericLiteral = numericLiteral;
	lowercase.objectExpression = objectExpression;
	lowercase.objectMethod = objectMethod;
	lowercase.objectPattern = objectPattern;
	lowercase.objectProperty = objectProperty;
	lowercase.objectTypeAnnotation = objectTypeAnnotation;
	lowercase.objectTypeCallProperty = objectTypeCallProperty;
	lowercase.objectTypeIndexer = objectTypeIndexer;
	lowercase.objectTypeInternalSlot = objectTypeInternalSlot;
	lowercase.objectTypeProperty = objectTypeProperty;
	lowercase.objectTypeSpreadProperty = objectTypeSpreadProperty;
	lowercase.opaqueType = opaqueType;
	lowercase.optionalCallExpression = optionalCallExpression;
	lowercase.optionalIndexedAccessType = optionalIndexedAccessType;
	lowercase.optionalMemberExpression = optionalMemberExpression;
	lowercase.parenthesizedExpression = parenthesizedExpression;
	lowercase.pipelineBareFunction = pipelineBareFunction;
	lowercase.pipelinePrimaryTopicReference = pipelinePrimaryTopicReference;
	lowercase.pipelineTopicExpression = pipelineTopicExpression;
	lowercase.placeholder = placeholder;
	lowercase.privateName = privateName;
	lowercase.program = program;
	lowercase.qualifiedTypeIdentifier = qualifiedTypeIdentifier;
	lowercase.recordExpression = recordExpression;
	lowercase.regExpLiteral = regExpLiteral;
	lowercase.regexLiteral = RegexLiteral;
	lowercase.restElement = restElement;
	lowercase.restProperty = RestProperty;
	lowercase.returnStatement = returnStatement;
	lowercase.sequenceExpression = sequenceExpression;
	lowercase.spreadElement = spreadElement;
	lowercase.spreadProperty = SpreadProperty;
	lowercase.staticBlock = staticBlock;
	lowercase.stringLiteral = stringLiteral;
	lowercase.stringLiteralTypeAnnotation = stringLiteralTypeAnnotation;
	lowercase.stringTypeAnnotation = stringTypeAnnotation;
	lowercase.super = _super;
	lowercase.switchCase = switchCase;
	lowercase.switchStatement = switchStatement;
	lowercase.symbolTypeAnnotation = symbolTypeAnnotation;
	lowercase.taggedTemplateExpression = taggedTemplateExpression;
	lowercase.templateElement = templateElement;
	lowercase.templateLiteral = templateLiteral;
	lowercase.thisExpression = thisExpression;
	lowercase.thisTypeAnnotation = thisTypeAnnotation;
	lowercase.throwStatement = throwStatement;
	lowercase.topicReference = topicReference;
	lowercase.tryStatement = tryStatement;
	lowercase.tSAnyKeyword = lowercase.tsAnyKeyword = tsAnyKeyword;
	lowercase.tSArrayType = lowercase.tsArrayType = tsArrayType;
	lowercase.tSAsExpression = lowercase.tsAsExpression = tsAsExpression;
	lowercase.tSBigIntKeyword = lowercase.tsBigIntKeyword = tsBigIntKeyword;
	lowercase.tSBooleanKeyword = lowercase.tsBooleanKeyword = tsBooleanKeyword;
	lowercase.tSCallSignatureDeclaration = lowercase.tsCallSignatureDeclaration = tsCallSignatureDeclaration;
	lowercase.tSConditionalType = lowercase.tsConditionalType = tsConditionalType;
	lowercase.tSConstructSignatureDeclaration = lowercase.tsConstructSignatureDeclaration = tsConstructSignatureDeclaration;
	lowercase.tSConstructorType = lowercase.tsConstructorType = tsConstructorType;
	lowercase.tSDeclareFunction = lowercase.tsDeclareFunction = tsDeclareFunction;
	lowercase.tSDeclareMethod = lowercase.tsDeclareMethod = tsDeclareMethod;
	lowercase.tSEnumBody = lowercase.tsEnumBody = tsEnumBody;
	lowercase.tSEnumDeclaration = lowercase.tsEnumDeclaration = tsEnumDeclaration;
	lowercase.tSEnumMember = lowercase.tsEnumMember = tsEnumMember;
	lowercase.tSExportAssignment = lowercase.tsExportAssignment = tsExportAssignment;
	lowercase.tSExpressionWithTypeArguments = lowercase.tsExpressionWithTypeArguments = tsExpressionWithTypeArguments;
	lowercase.tSExternalModuleReference = lowercase.tsExternalModuleReference = tsExternalModuleReference;
	lowercase.tSFunctionType = lowercase.tsFunctionType = tsFunctionType;
	lowercase.tSImportEqualsDeclaration = lowercase.tsImportEqualsDeclaration = tsImportEqualsDeclaration;
	lowercase.tSImportType = lowercase.tsImportType = tsImportType;
	lowercase.tSIndexSignature = lowercase.tsIndexSignature = tsIndexSignature;
	lowercase.tSIndexedAccessType = lowercase.tsIndexedAccessType = tsIndexedAccessType;
	lowercase.tSInferType = lowercase.tsInferType = tsInferType;
	lowercase.tSInstantiationExpression = lowercase.tsInstantiationExpression = tsInstantiationExpression;
	lowercase.tSInterfaceBody = lowercase.tsInterfaceBody = tsInterfaceBody;
	lowercase.tSInterfaceDeclaration = lowercase.tsInterfaceDeclaration = tsInterfaceDeclaration;
	lowercase.tSIntersectionType = lowercase.tsIntersectionType = tsIntersectionType;
	lowercase.tSIntrinsicKeyword = lowercase.tsIntrinsicKeyword = tsIntrinsicKeyword;
	lowercase.tSLiteralType = lowercase.tsLiteralType = tsLiteralType;
	lowercase.tSMappedType = lowercase.tsMappedType = tsMappedType;
	lowercase.tSMethodSignature = lowercase.tsMethodSignature = tsMethodSignature;
	lowercase.tSModuleBlock = lowercase.tsModuleBlock = tsModuleBlock;
	lowercase.tSModuleDeclaration = lowercase.tsModuleDeclaration = tsModuleDeclaration;
	lowercase.tSNamedTupleMember = lowercase.tsNamedTupleMember = tsNamedTupleMember;
	lowercase.tSNamespaceExportDeclaration = lowercase.tsNamespaceExportDeclaration = tsNamespaceExportDeclaration;
	lowercase.tSNeverKeyword = lowercase.tsNeverKeyword = tsNeverKeyword;
	lowercase.tSNonNullExpression = lowercase.tsNonNullExpression = tsNonNullExpression;
	lowercase.tSNullKeyword = lowercase.tsNullKeyword = tsNullKeyword;
	lowercase.tSNumberKeyword = lowercase.tsNumberKeyword = tsNumberKeyword;
	lowercase.tSObjectKeyword = lowercase.tsObjectKeyword = tsObjectKeyword;
	lowercase.tSOptionalType = lowercase.tsOptionalType = tsOptionalType;
	lowercase.tSParameterProperty = lowercase.tsParameterProperty = tsParameterProperty;
	lowercase.tSParenthesizedType = lowercase.tsParenthesizedType = tsParenthesizedType;
	lowercase.tSPropertySignature = lowercase.tsPropertySignature = tsPropertySignature;
	lowercase.tSQualifiedName = lowercase.tsQualifiedName = tsQualifiedName;
	lowercase.tSRestType = lowercase.tsRestType = tsRestType;
	lowercase.tSSatisfiesExpression = lowercase.tsSatisfiesExpression = tsSatisfiesExpression;
	lowercase.tSStringKeyword = lowercase.tsStringKeyword = tsStringKeyword;
	lowercase.tSSymbolKeyword = lowercase.tsSymbolKeyword = tsSymbolKeyword;
	lowercase.tSTemplateLiteralType = lowercase.tsTemplateLiteralType = tsTemplateLiteralType;
	lowercase.tSThisType = lowercase.tsThisType = tsThisType;
	lowercase.tSTupleType = lowercase.tsTupleType = tsTupleType;
	lowercase.tSTypeAliasDeclaration = lowercase.tsTypeAliasDeclaration = tsTypeAliasDeclaration;
	lowercase.tSTypeAnnotation = lowercase.tsTypeAnnotation = tsTypeAnnotation;
	lowercase.tSTypeAssertion = lowercase.tsTypeAssertion = tsTypeAssertion;
	lowercase.tSTypeLiteral = lowercase.tsTypeLiteral = tsTypeLiteral;
	lowercase.tSTypeOperator = lowercase.tsTypeOperator = tsTypeOperator;
	lowercase.tSTypeParameter = lowercase.tsTypeParameter = tsTypeParameter;
	lowercase.tSTypeParameterDeclaration = lowercase.tsTypeParameterDeclaration = tsTypeParameterDeclaration;
	lowercase.tSTypeParameterInstantiation = lowercase.tsTypeParameterInstantiation = tsTypeParameterInstantiation;
	lowercase.tSTypePredicate = lowercase.tsTypePredicate = tsTypePredicate;
	lowercase.tSTypeQuery = lowercase.tsTypeQuery = tsTypeQuery;
	lowercase.tSTypeReference = lowercase.tsTypeReference = tsTypeReference;
	lowercase.tSUndefinedKeyword = lowercase.tsUndefinedKeyword = tsUndefinedKeyword;
	lowercase.tSUnionType = lowercase.tsUnionType = tsUnionType;
	lowercase.tSUnknownKeyword = lowercase.tsUnknownKeyword = tsUnknownKeyword;
	lowercase.tSVoidKeyword = lowercase.tsVoidKeyword = tsVoidKeyword;
	lowercase.tupleExpression = tupleExpression;
	lowercase.tupleTypeAnnotation = tupleTypeAnnotation;
	lowercase.typeAlias = typeAlias;
	lowercase.typeAnnotation = typeAnnotation;
	lowercase.typeCastExpression = typeCastExpression;
	lowercase.typeParameter = typeParameter;
	lowercase.typeParameterDeclaration = typeParameterDeclaration;
	lowercase.typeParameterInstantiation = typeParameterInstantiation;
	lowercase.typeofTypeAnnotation = typeofTypeAnnotation;
	lowercase.unaryExpression = unaryExpression;
	lowercase.unionTypeAnnotation = unionTypeAnnotation;
	lowercase.updateExpression = updateExpression;
	lowercase.v8IntrinsicIdentifier = v8IntrinsicIdentifier;
	lowercase.variableDeclaration = variableDeclaration;
	lowercase.variableDeclarator = variableDeclarator;
	lowercase.variance = variance;
	lowercase.voidPattern = voidPattern;
	lowercase.voidTypeAnnotation = voidTypeAnnotation;
	lowercase.whileStatement = whileStatement;
	lowercase.withStatement = withStatement;
	lowercase.yieldExpression = yieldExpression;
	var _validate = requireValidate();
	var _deprecationWarning = requireDeprecationWarning();
	var utils = requireUtils();
	const {
	  validateInternal: validate
	} = _validate;
	const {
	  NODE_FIELDS
	} = utils;
	function bigIntLiteral(value) {
	  if (typeof value === "bigint") {
	    value = value.toString();
	  }
	  const node = {
	    type: "BigIntLiteral",
	    value
	  };
	  const defs = NODE_FIELDS.BigIntLiteral;
	  validate(defs.value, node, "value", value);
	  return node;
	}
	function arrayExpression(elements = []) {
	  const node = {
	    type: "ArrayExpression",
	    elements
	  };
	  const defs = NODE_FIELDS.ArrayExpression;
	  validate(defs.elements, node, "elements", elements, 1);
	  return node;
	}
	function assignmentExpression(operator, left, right) {
	  const node = {
	    type: "AssignmentExpression",
	    operator,
	    left,
	    right
	  };
	  const defs = NODE_FIELDS.AssignmentExpression;
	  validate(defs.operator, node, "operator", operator);
	  validate(defs.left, node, "left", left, 1);
	  validate(defs.right, node, "right", right, 1);
	  return node;
	}
	function binaryExpression(operator, left, right) {
	  const node = {
	    type: "BinaryExpression",
	    operator,
	    left,
	    right
	  };
	  const defs = NODE_FIELDS.BinaryExpression;
	  validate(defs.operator, node, "operator", operator);
	  validate(defs.left, node, "left", left, 1);
	  validate(defs.right, node, "right", right, 1);
	  return node;
	}
	function interpreterDirective(value) {
	  const node = {
	    type: "InterpreterDirective",
	    value
	  };
	  const defs = NODE_FIELDS.InterpreterDirective;
	  validate(defs.value, node, "value", value);
	  return node;
	}
	function directive(value) {
	  const node = {
	    type: "Directive",
	    value
	  };
	  const defs = NODE_FIELDS.Directive;
	  validate(defs.value, node, "value", value, 1);
	  return node;
	}
	function directiveLiteral(value) {
	  const node = {
	    type: "DirectiveLiteral",
	    value
	  };
	  const defs = NODE_FIELDS.DirectiveLiteral;
	  validate(defs.value, node, "value", value);
	  return node;
	}
	function blockStatement(body, directives = []) {
	  const node = {
	    type: "BlockStatement",
	    body,
	    directives
	  };
	  const defs = NODE_FIELDS.BlockStatement;
	  validate(defs.body, node, "body", body, 1);
	  validate(defs.directives, node, "directives", directives, 1);
	  return node;
	}
	function breakStatement(label = null) {
	  const node = {
	    type: "BreakStatement",
	    label
	  };
	  const defs = NODE_FIELDS.BreakStatement;
	  validate(defs.label, node, "label", label, 1);
	  return node;
	}
	function callExpression(callee, _arguments) {
	  const node = {
	    type: "CallExpression",
	    callee,
	    arguments: _arguments
	  };
	  const defs = NODE_FIELDS.CallExpression;
	  validate(defs.callee, node, "callee", callee, 1);
	  validate(defs.arguments, node, "arguments", _arguments, 1);
	  return node;
	}
	function catchClause(param = null, body) {
	  const node = {
	    type: "CatchClause",
	    param,
	    body
	  };
	  const defs = NODE_FIELDS.CatchClause;
	  validate(defs.param, node, "param", param, 1);
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function conditionalExpression(test, consequent, alternate) {
	  const node = {
	    type: "ConditionalExpression",
	    test,
	    consequent,
	    alternate
	  };
	  const defs = NODE_FIELDS.ConditionalExpression;
	  validate(defs.test, node, "test", test, 1);
	  validate(defs.consequent, node, "consequent", consequent, 1);
	  validate(defs.alternate, node, "alternate", alternate, 1);
	  return node;
	}
	function continueStatement(label = null) {
	  const node = {
	    type: "ContinueStatement",
	    label
	  };
	  const defs = NODE_FIELDS.ContinueStatement;
	  validate(defs.label, node, "label", label, 1);
	  return node;
	}
	function debuggerStatement() {
	  return {
	    type: "DebuggerStatement"
	  };
	}
	function doWhileStatement(test, body) {
	  const node = {
	    type: "DoWhileStatement",
	    test,
	    body
	  };
	  const defs = NODE_FIELDS.DoWhileStatement;
	  validate(defs.test, node, "test", test, 1);
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function emptyStatement() {
	  return {
	    type: "EmptyStatement"
	  };
	}
	function expressionStatement(expression) {
	  const node = {
	    type: "ExpressionStatement",
	    expression
	  };
	  const defs = NODE_FIELDS.ExpressionStatement;
	  validate(defs.expression, node, "expression", expression, 1);
	  return node;
	}
	function file(program, comments = null, tokens = null) {
	  const node = {
	    type: "File",
	    program,
	    comments,
	    tokens
	  };
	  const defs = NODE_FIELDS.File;
	  validate(defs.program, node, "program", program, 1);
	  validate(defs.comments, node, "comments", comments, 1);
	  validate(defs.tokens, node, "tokens", tokens);
	  return node;
	}
	function forInStatement(left, right, body) {
	  const node = {
	    type: "ForInStatement",
	    left,
	    right,
	    body
	  };
	  const defs = NODE_FIELDS.ForInStatement;
	  validate(defs.left, node, "left", left, 1);
	  validate(defs.right, node, "right", right, 1);
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function forStatement(init = null, test = null, update = null, body) {
	  const node = {
	    type: "ForStatement",
	    init,
	    test,
	    update,
	    body
	  };
	  const defs = NODE_FIELDS.ForStatement;
	  validate(defs.init, node, "init", init, 1);
	  validate(defs.test, node, "test", test, 1);
	  validate(defs.update, node, "update", update, 1);
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function functionDeclaration(id = null, params, body, generator = false, async = false) {
	  const node = {
	    type: "FunctionDeclaration",
	    id,
	    params,
	    body,
	    generator,
	    async
	  };
	  const defs = NODE_FIELDS.FunctionDeclaration;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.params, node, "params", params, 1);
	  validate(defs.body, node, "body", body, 1);
	  validate(defs.generator, node, "generator", generator);
	  validate(defs.async, node, "async", async);
	  return node;
	}
	function functionExpression(id = null, params, body, generator = false, async = false) {
	  const node = {
	    type: "FunctionExpression",
	    id,
	    params,
	    body,
	    generator,
	    async
	  };
	  const defs = NODE_FIELDS.FunctionExpression;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.params, node, "params", params, 1);
	  validate(defs.body, node, "body", body, 1);
	  validate(defs.generator, node, "generator", generator);
	  validate(defs.async, node, "async", async);
	  return node;
	}
	function identifier(name) {
	  const node = {
	    type: "Identifier",
	    name
	  };
	  const defs = NODE_FIELDS.Identifier;
	  validate(defs.name, node, "name", name);
	  return node;
	}
	function ifStatement(test, consequent, alternate = null) {
	  const node = {
	    type: "IfStatement",
	    test,
	    consequent,
	    alternate
	  };
	  const defs = NODE_FIELDS.IfStatement;
	  validate(defs.test, node, "test", test, 1);
	  validate(defs.consequent, node, "consequent", consequent, 1);
	  validate(defs.alternate, node, "alternate", alternate, 1);
	  return node;
	}
	function labeledStatement(label, body) {
	  const node = {
	    type: "LabeledStatement",
	    label,
	    body
	  };
	  const defs = NODE_FIELDS.LabeledStatement;
	  validate(defs.label, node, "label", label, 1);
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function stringLiteral(value) {
	  const node = {
	    type: "StringLiteral",
	    value
	  };
	  const defs = NODE_FIELDS.StringLiteral;
	  validate(defs.value, node, "value", value);
	  return node;
	}
	function numericLiteral(value) {
	  const node = {
	    type: "NumericLiteral",
	    value
	  };
	  const defs = NODE_FIELDS.NumericLiteral;
	  validate(defs.value, node, "value", value);
	  return node;
	}
	function nullLiteral() {
	  return {
	    type: "NullLiteral"
	  };
	}
	function booleanLiteral(value) {
	  const node = {
	    type: "BooleanLiteral",
	    value
	  };
	  const defs = NODE_FIELDS.BooleanLiteral;
	  validate(defs.value, node, "value", value);
	  return node;
	}
	function regExpLiteral(pattern, flags = "") {
	  const node = {
	    type: "RegExpLiteral",
	    pattern,
	    flags
	  };
	  const defs = NODE_FIELDS.RegExpLiteral;
	  validate(defs.pattern, node, "pattern", pattern);
	  validate(defs.flags, node, "flags", flags);
	  return node;
	}
	function logicalExpression(operator, left, right) {
	  const node = {
	    type: "LogicalExpression",
	    operator,
	    left,
	    right
	  };
	  const defs = NODE_FIELDS.LogicalExpression;
	  validate(defs.operator, node, "operator", operator);
	  validate(defs.left, node, "left", left, 1);
	  validate(defs.right, node, "right", right, 1);
	  return node;
	}
	function memberExpression(object, property, computed = false, optional = null) {
	  const node = {
	    type: "MemberExpression",
	    object,
	    property,
	    computed,
	    optional
	  };
	  const defs = NODE_FIELDS.MemberExpression;
	  validate(defs.object, node, "object", object, 1);
	  validate(defs.property, node, "property", property, 1);
	  validate(defs.computed, node, "computed", computed);
	  validate(defs.optional, node, "optional", optional);
	  return node;
	}
	function newExpression(callee, _arguments) {
	  const node = {
	    type: "NewExpression",
	    callee,
	    arguments: _arguments
	  };
	  const defs = NODE_FIELDS.NewExpression;
	  validate(defs.callee, node, "callee", callee, 1);
	  validate(defs.arguments, node, "arguments", _arguments, 1);
	  return node;
	}
	function program(body, directives = [], sourceType = "script", interpreter = null) {
	  const node = {
	    type: "Program",
	    body,
	    directives,
	    sourceType,
	    interpreter
	  };
	  const defs = NODE_FIELDS.Program;
	  validate(defs.body, node, "body", body, 1);
	  validate(defs.directives, node, "directives", directives, 1);
	  validate(defs.sourceType, node, "sourceType", sourceType);
	  validate(defs.interpreter, node, "interpreter", interpreter, 1);
	  return node;
	}
	function objectExpression(properties) {
	  const node = {
	    type: "ObjectExpression",
	    properties
	  };
	  const defs = NODE_FIELDS.ObjectExpression;
	  validate(defs.properties, node, "properties", properties, 1);
	  return node;
	}
	function objectMethod(kind = "method", key, params, body, computed = false, generator = false, async = false) {
	  const node = {
	    type: "ObjectMethod",
	    kind,
	    key,
	    params,
	    body,
	    computed,
	    generator,
	    async
	  };
	  const defs = NODE_FIELDS.ObjectMethod;
	  validate(defs.kind, node, "kind", kind);
	  validate(defs.key, node, "key", key, 1);
	  validate(defs.params, node, "params", params, 1);
	  validate(defs.body, node, "body", body, 1);
	  validate(defs.computed, node, "computed", computed);
	  validate(defs.generator, node, "generator", generator);
	  validate(defs.async, node, "async", async);
	  return node;
	}
	function objectProperty(key, value, computed = false, shorthand = false, decorators = null) {
	  const node = {
	    type: "ObjectProperty",
	    key,
	    value,
	    computed,
	    shorthand,
	    decorators
	  };
	  const defs = NODE_FIELDS.ObjectProperty;
	  validate(defs.key, node, "key", key, 1);
	  validate(defs.value, node, "value", value, 1);
	  validate(defs.computed, node, "computed", computed);
	  validate(defs.shorthand, node, "shorthand", shorthand);
	  validate(defs.decorators, node, "decorators", decorators, 1);
	  return node;
	}
	function restElement(argument) {
	  const node = {
	    type: "RestElement",
	    argument
	  };
	  const defs = NODE_FIELDS.RestElement;
	  validate(defs.argument, node, "argument", argument, 1);
	  return node;
	}
	function returnStatement(argument = null) {
	  const node = {
	    type: "ReturnStatement",
	    argument
	  };
	  const defs = NODE_FIELDS.ReturnStatement;
	  validate(defs.argument, node, "argument", argument, 1);
	  return node;
	}
	function sequenceExpression(expressions) {
	  const node = {
	    type: "SequenceExpression",
	    expressions
	  };
	  const defs = NODE_FIELDS.SequenceExpression;
	  validate(defs.expressions, node, "expressions", expressions, 1);
	  return node;
	}
	function parenthesizedExpression(expression) {
	  const node = {
	    type: "ParenthesizedExpression",
	    expression
	  };
	  const defs = NODE_FIELDS.ParenthesizedExpression;
	  validate(defs.expression, node, "expression", expression, 1);
	  return node;
	}
	function switchCase(test = null, consequent) {
	  const node = {
	    type: "SwitchCase",
	    test,
	    consequent
	  };
	  const defs = NODE_FIELDS.SwitchCase;
	  validate(defs.test, node, "test", test, 1);
	  validate(defs.consequent, node, "consequent", consequent, 1);
	  return node;
	}
	function switchStatement(discriminant, cases) {
	  const node = {
	    type: "SwitchStatement",
	    discriminant,
	    cases
	  };
	  const defs = NODE_FIELDS.SwitchStatement;
	  validate(defs.discriminant, node, "discriminant", discriminant, 1);
	  validate(defs.cases, node, "cases", cases, 1);
	  return node;
	}
	function thisExpression() {
	  return {
	    type: "ThisExpression"
	  };
	}
	function throwStatement(argument) {
	  const node = {
	    type: "ThrowStatement",
	    argument
	  };
	  const defs = NODE_FIELDS.ThrowStatement;
	  validate(defs.argument, node, "argument", argument, 1);
	  return node;
	}
	function tryStatement(block, handler = null, finalizer = null) {
	  const node = {
	    type: "TryStatement",
	    block,
	    handler,
	    finalizer
	  };
	  const defs = NODE_FIELDS.TryStatement;
	  validate(defs.block, node, "block", block, 1);
	  validate(defs.handler, node, "handler", handler, 1);
	  validate(defs.finalizer, node, "finalizer", finalizer, 1);
	  return node;
	}
	function unaryExpression(operator, argument, prefix = true) {
	  const node = {
	    type: "UnaryExpression",
	    operator,
	    argument,
	    prefix
	  };
	  const defs = NODE_FIELDS.UnaryExpression;
	  validate(defs.operator, node, "operator", operator);
	  validate(defs.argument, node, "argument", argument, 1);
	  validate(defs.prefix, node, "prefix", prefix);
	  return node;
	}
	function updateExpression(operator, argument, prefix = false) {
	  const node = {
	    type: "UpdateExpression",
	    operator,
	    argument,
	    prefix
	  };
	  const defs = NODE_FIELDS.UpdateExpression;
	  validate(defs.operator, node, "operator", operator);
	  validate(defs.argument, node, "argument", argument, 1);
	  validate(defs.prefix, node, "prefix", prefix);
	  return node;
	}
	function variableDeclaration(kind, declarations) {
	  const node = {
	    type: "VariableDeclaration",
	    kind,
	    declarations
	  };
	  const defs = NODE_FIELDS.VariableDeclaration;
	  validate(defs.kind, node, "kind", kind);
	  validate(defs.declarations, node, "declarations", declarations, 1);
	  return node;
	}
	function variableDeclarator(id, init = null) {
	  const node = {
	    type: "VariableDeclarator",
	    id,
	    init
	  };
	  const defs = NODE_FIELDS.VariableDeclarator;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.init, node, "init", init, 1);
	  return node;
	}
	function whileStatement(test, body) {
	  const node = {
	    type: "WhileStatement",
	    test,
	    body
	  };
	  const defs = NODE_FIELDS.WhileStatement;
	  validate(defs.test, node, "test", test, 1);
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function withStatement(object, body) {
	  const node = {
	    type: "WithStatement",
	    object,
	    body
	  };
	  const defs = NODE_FIELDS.WithStatement;
	  validate(defs.object, node, "object", object, 1);
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function assignmentPattern(left, right) {
	  const node = {
	    type: "AssignmentPattern",
	    left,
	    right
	  };
	  const defs = NODE_FIELDS.AssignmentPattern;
	  validate(defs.left, node, "left", left, 1);
	  validate(defs.right, node, "right", right, 1);
	  return node;
	}
	function arrayPattern(elements) {
	  const node = {
	    type: "ArrayPattern",
	    elements
	  };
	  const defs = NODE_FIELDS.ArrayPattern;
	  validate(defs.elements, node, "elements", elements, 1);
	  return node;
	}
	function arrowFunctionExpression(params, body, async = false) {
	  const node = {
	    type: "ArrowFunctionExpression",
	    params,
	    body,
	    async,
	    expression: null
	  };
	  const defs = NODE_FIELDS.ArrowFunctionExpression;
	  validate(defs.params, node, "params", params, 1);
	  validate(defs.body, node, "body", body, 1);
	  validate(defs.async, node, "async", async);
	  return node;
	}
	function classBody(body) {
	  const node = {
	    type: "ClassBody",
	    body
	  };
	  const defs = NODE_FIELDS.ClassBody;
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function classExpression(id = null, superClass = null, body, decorators = null) {
	  const node = {
	    type: "ClassExpression",
	    id,
	    superClass,
	    body,
	    decorators
	  };
	  const defs = NODE_FIELDS.ClassExpression;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.superClass, node, "superClass", superClass, 1);
	  validate(defs.body, node, "body", body, 1);
	  validate(defs.decorators, node, "decorators", decorators, 1);
	  return node;
	}
	function classDeclaration(id = null, superClass = null, body, decorators = null) {
	  const node = {
	    type: "ClassDeclaration",
	    id,
	    superClass,
	    body,
	    decorators
	  };
	  const defs = NODE_FIELDS.ClassDeclaration;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.superClass, node, "superClass", superClass, 1);
	  validate(defs.body, node, "body", body, 1);
	  validate(defs.decorators, node, "decorators", decorators, 1);
	  return node;
	}
	function exportAllDeclaration(source, attributes = null) {
	  const node = {
	    type: "ExportAllDeclaration",
	    source,
	    attributes
	  };
	  const defs = NODE_FIELDS.ExportAllDeclaration;
	  validate(defs.source, node, "source", source, 1);
	  validate(defs.attributes, node, "attributes", attributes, 1);
	  return node;
	}
	function exportDefaultDeclaration(declaration) {
	  const node = {
	    type: "ExportDefaultDeclaration",
	    declaration
	  };
	  const defs = NODE_FIELDS.ExportDefaultDeclaration;
	  validate(defs.declaration, node, "declaration", declaration, 1);
	  return node;
	}
	function exportNamedDeclaration(declaration = null, specifiers = [], source = null, attributes = null) {
	  const node = {
	    type: "ExportNamedDeclaration",
	    declaration,
	    specifiers,
	    source,
	    attributes
	  };
	  const defs = NODE_FIELDS.ExportNamedDeclaration;
	  validate(defs.declaration, node, "declaration", declaration, 1);
	  validate(defs.specifiers, node, "specifiers", specifiers, 1);
	  validate(defs.source, node, "source", source, 1);
	  validate(defs.attributes, node, "attributes", attributes, 1);
	  return node;
	}
	function exportSpecifier(local, exported) {
	  const node = {
	    type: "ExportSpecifier",
	    local,
	    exported
	  };
	  const defs = NODE_FIELDS.ExportSpecifier;
	  validate(defs.local, node, "local", local, 1);
	  validate(defs.exported, node, "exported", exported, 1);
	  return node;
	}
	function forOfStatement(left, right, body, _await = false) {
	  const node = {
	    type: "ForOfStatement",
	    left,
	    right,
	    body,
	    await: _await
	  };
	  const defs = NODE_FIELDS.ForOfStatement;
	  validate(defs.left, node, "left", left, 1);
	  validate(defs.right, node, "right", right, 1);
	  validate(defs.body, node, "body", body, 1);
	  validate(defs.await, node, "await", _await);
	  return node;
	}
	function importDeclaration(specifiers, source, attributes = null) {
	  const node = {
	    type: "ImportDeclaration",
	    specifiers,
	    source,
	    attributes
	  };
	  const defs = NODE_FIELDS.ImportDeclaration;
	  validate(defs.specifiers, node, "specifiers", specifiers, 1);
	  validate(defs.source, node, "source", source, 1);
	  validate(defs.attributes, node, "attributes", attributes, 1);
	  return node;
	}
	function importDefaultSpecifier(local) {
	  const node = {
	    type: "ImportDefaultSpecifier",
	    local
	  };
	  const defs = NODE_FIELDS.ImportDefaultSpecifier;
	  validate(defs.local, node, "local", local, 1);
	  return node;
	}
	function importNamespaceSpecifier(local) {
	  const node = {
	    type: "ImportNamespaceSpecifier",
	    local
	  };
	  const defs = NODE_FIELDS.ImportNamespaceSpecifier;
	  validate(defs.local, node, "local", local, 1);
	  return node;
	}
	function importSpecifier(local, imported) {
	  const node = {
	    type: "ImportSpecifier",
	    local,
	    imported
	  };
	  const defs = NODE_FIELDS.ImportSpecifier;
	  validate(defs.local, node, "local", local, 1);
	  validate(defs.imported, node, "imported", imported, 1);
	  return node;
	}
	function importExpression(source, options = null) {
	  const node = {
	    type: "ImportExpression",
	    source,
	    options
	  };
	  const defs = NODE_FIELDS.ImportExpression;
	  validate(defs.source, node, "source", source, 1);
	  validate(defs.options, node, "options", options, 1);
	  return node;
	}
	function metaProperty(meta, property) {
	  const node = {
	    type: "MetaProperty",
	    meta,
	    property
	  };
	  const defs = NODE_FIELDS.MetaProperty;
	  validate(defs.meta, node, "meta", meta, 1);
	  validate(defs.property, node, "property", property, 1);
	  return node;
	}
	function classMethod(kind = "method", key, params, body, computed = false, _static = false, generator = false, async = false) {
	  const node = {
	    type: "ClassMethod",
	    kind,
	    key,
	    params,
	    body,
	    computed,
	    static: _static,
	    generator,
	    async
	  };
	  const defs = NODE_FIELDS.ClassMethod;
	  validate(defs.kind, node, "kind", kind);
	  validate(defs.key, node, "key", key, 1);
	  validate(defs.params, node, "params", params, 1);
	  validate(defs.body, node, "body", body, 1);
	  validate(defs.computed, node, "computed", computed);
	  validate(defs.static, node, "static", _static);
	  validate(defs.generator, node, "generator", generator);
	  validate(defs.async, node, "async", async);
	  return node;
	}
	function objectPattern(properties) {
	  const node = {
	    type: "ObjectPattern",
	    properties
	  };
	  const defs = NODE_FIELDS.ObjectPattern;
	  validate(defs.properties, node, "properties", properties, 1);
	  return node;
	}
	function spreadElement(argument) {
	  const node = {
	    type: "SpreadElement",
	    argument
	  };
	  const defs = NODE_FIELDS.SpreadElement;
	  validate(defs.argument, node, "argument", argument, 1);
	  return node;
	}
	function _super() {
	  return {
	    type: "Super"
	  };
	}
	function taggedTemplateExpression(tag, quasi) {
	  const node = {
	    type: "TaggedTemplateExpression",
	    tag,
	    quasi
	  };
	  const defs = NODE_FIELDS.TaggedTemplateExpression;
	  validate(defs.tag, node, "tag", tag, 1);
	  validate(defs.quasi, node, "quasi", quasi, 1);
	  return node;
	}
	function templateElement(value, tail = false) {
	  const node = {
	    type: "TemplateElement",
	    value,
	    tail
	  };
	  const defs = NODE_FIELDS.TemplateElement;
	  validate(defs.value, node, "value", value);
	  validate(defs.tail, node, "tail", tail);
	  return node;
	}
	function templateLiteral(quasis, expressions) {
	  const node = {
	    type: "TemplateLiteral",
	    quasis,
	    expressions
	  };
	  const defs = NODE_FIELDS.TemplateLiteral;
	  validate(defs.quasis, node, "quasis", quasis, 1);
	  validate(defs.expressions, node, "expressions", expressions, 1);
	  return node;
	}
	function yieldExpression(argument = null, delegate = false) {
	  const node = {
	    type: "YieldExpression",
	    argument,
	    delegate
	  };
	  const defs = NODE_FIELDS.YieldExpression;
	  validate(defs.argument, node, "argument", argument, 1);
	  validate(defs.delegate, node, "delegate", delegate);
	  return node;
	}
	function awaitExpression(argument) {
	  const node = {
	    type: "AwaitExpression",
	    argument
	  };
	  const defs = NODE_FIELDS.AwaitExpression;
	  validate(defs.argument, node, "argument", argument, 1);
	  return node;
	}
	function _import() {
	  return {
	    type: "Import"
	  };
	}
	function exportNamespaceSpecifier(exported) {
	  const node = {
	    type: "ExportNamespaceSpecifier",
	    exported
	  };
	  const defs = NODE_FIELDS.ExportNamespaceSpecifier;
	  validate(defs.exported, node, "exported", exported, 1);
	  return node;
	}
	function optionalMemberExpression(object, property, computed = false, optional) {
	  const node = {
	    type: "OptionalMemberExpression",
	    object,
	    property,
	    computed,
	    optional
	  };
	  const defs = NODE_FIELDS.OptionalMemberExpression;
	  validate(defs.object, node, "object", object, 1);
	  validate(defs.property, node, "property", property, 1);
	  validate(defs.computed, node, "computed", computed);
	  validate(defs.optional, node, "optional", optional);
	  return node;
	}
	function optionalCallExpression(callee, _arguments, optional) {
	  const node = {
	    type: "OptionalCallExpression",
	    callee,
	    arguments: _arguments,
	    optional
	  };
	  const defs = NODE_FIELDS.OptionalCallExpression;
	  validate(defs.callee, node, "callee", callee, 1);
	  validate(defs.arguments, node, "arguments", _arguments, 1);
	  validate(defs.optional, node, "optional", optional);
	  return node;
	}
	function classProperty(key, value = null, typeAnnotation = null, decorators = null, computed = false, _static = false) {
	  const node = {
	    type: "ClassProperty",
	    key,
	    value,
	    typeAnnotation,
	    decorators,
	    computed,
	    static: _static
	  };
	  const defs = NODE_FIELDS.ClassProperty;
	  validate(defs.key, node, "key", key, 1);
	  validate(defs.value, node, "value", value, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  validate(defs.decorators, node, "decorators", decorators, 1);
	  validate(defs.computed, node, "computed", computed);
	  validate(defs.static, node, "static", _static);
	  return node;
	}
	function classAccessorProperty(key, value = null, typeAnnotation = null, decorators = null, computed = false, _static = false) {
	  const node = {
	    type: "ClassAccessorProperty",
	    key,
	    value,
	    typeAnnotation,
	    decorators,
	    computed,
	    static: _static
	  };
	  const defs = NODE_FIELDS.ClassAccessorProperty;
	  validate(defs.key, node, "key", key, 1);
	  validate(defs.value, node, "value", value, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  validate(defs.decorators, node, "decorators", decorators, 1);
	  validate(defs.computed, node, "computed", computed);
	  validate(defs.static, node, "static", _static);
	  return node;
	}
	function classPrivateProperty(key, value = null, decorators = null, _static = false) {
	  const node = {
	    type: "ClassPrivateProperty",
	    key,
	    value,
	    decorators,
	    static: _static
	  };
	  const defs = NODE_FIELDS.ClassPrivateProperty;
	  validate(defs.key, node, "key", key, 1);
	  validate(defs.value, node, "value", value, 1);
	  validate(defs.decorators, node, "decorators", decorators, 1);
	  validate(defs.static, node, "static", _static);
	  return node;
	}
	function classPrivateMethod(kind = "method", key, params, body, _static = false) {
	  const node = {
	    type: "ClassPrivateMethod",
	    kind,
	    key,
	    params,
	    body,
	    static: _static
	  };
	  const defs = NODE_FIELDS.ClassPrivateMethod;
	  validate(defs.kind, node, "kind", kind);
	  validate(defs.key, node, "key", key, 1);
	  validate(defs.params, node, "params", params, 1);
	  validate(defs.body, node, "body", body, 1);
	  validate(defs.static, node, "static", _static);
	  return node;
	}
	function privateName(id) {
	  const node = {
	    type: "PrivateName",
	    id
	  };
	  const defs = NODE_FIELDS.PrivateName;
	  validate(defs.id, node, "id", id, 1);
	  return node;
	}
	function staticBlock(body) {
	  const node = {
	    type: "StaticBlock",
	    body
	  };
	  const defs = NODE_FIELDS.StaticBlock;
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function importAttribute(key, value) {
	  const node = {
	    type: "ImportAttribute",
	    key,
	    value
	  };
	  const defs = NODE_FIELDS.ImportAttribute;
	  validate(defs.key, node, "key", key, 1);
	  validate(defs.value, node, "value", value, 1);
	  return node;
	}
	function anyTypeAnnotation() {
	  return {
	    type: "AnyTypeAnnotation"
	  };
	}
	function arrayTypeAnnotation(elementType) {
	  const node = {
	    type: "ArrayTypeAnnotation",
	    elementType
	  };
	  const defs = NODE_FIELDS.ArrayTypeAnnotation;
	  validate(defs.elementType, node, "elementType", elementType, 1);
	  return node;
	}
	function booleanTypeAnnotation() {
	  return {
	    type: "BooleanTypeAnnotation"
	  };
	}
	function booleanLiteralTypeAnnotation(value) {
	  const node = {
	    type: "BooleanLiteralTypeAnnotation",
	    value
	  };
	  const defs = NODE_FIELDS.BooleanLiteralTypeAnnotation;
	  validate(defs.value, node, "value", value);
	  return node;
	}
	function nullLiteralTypeAnnotation() {
	  return {
	    type: "NullLiteralTypeAnnotation"
	  };
	}
	function classImplements(id, typeParameters = null) {
	  const node = {
	    type: "ClassImplements",
	    id,
	    typeParameters
	  };
	  const defs = NODE_FIELDS.ClassImplements;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  return node;
	}
	function declareClass(id, typeParameters = null, _extends = null, body) {
	  const node = {
	    type: "DeclareClass",
	    id,
	    typeParameters,
	    extends: _extends,
	    body
	  };
	  const defs = NODE_FIELDS.DeclareClass;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.extends, node, "extends", _extends, 1);
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function declareFunction(id) {
	  const node = {
	    type: "DeclareFunction",
	    id
	  };
	  const defs = NODE_FIELDS.DeclareFunction;
	  validate(defs.id, node, "id", id, 1);
	  return node;
	}
	function declareInterface(id, typeParameters = null, _extends = null, body) {
	  const node = {
	    type: "DeclareInterface",
	    id,
	    typeParameters,
	    extends: _extends,
	    body
	  };
	  const defs = NODE_FIELDS.DeclareInterface;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.extends, node, "extends", _extends, 1);
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function declareModule(id, body, kind = null) {
	  const node = {
	    type: "DeclareModule",
	    id,
	    body,
	    kind
	  };
	  const defs = NODE_FIELDS.DeclareModule;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.body, node, "body", body, 1);
	  validate(defs.kind, node, "kind", kind);
	  return node;
	}
	function declareModuleExports(typeAnnotation) {
	  const node = {
	    type: "DeclareModuleExports",
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.DeclareModuleExports;
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function declareTypeAlias(id, typeParameters = null, right) {
	  const node = {
	    type: "DeclareTypeAlias",
	    id,
	    typeParameters,
	    right
	  };
	  const defs = NODE_FIELDS.DeclareTypeAlias;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.right, node, "right", right, 1);
	  return node;
	}
	function declareOpaqueType(id, typeParameters = null, supertype = null) {
	  const node = {
	    type: "DeclareOpaqueType",
	    id,
	    typeParameters,
	    supertype
	  };
	  const defs = NODE_FIELDS.DeclareOpaqueType;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.supertype, node, "supertype", supertype, 1);
	  return node;
	}
	function declareVariable(id) {
	  const node = {
	    type: "DeclareVariable",
	    id
	  };
	  const defs = NODE_FIELDS.DeclareVariable;
	  validate(defs.id, node, "id", id, 1);
	  return node;
	}
	function declareExportDeclaration(declaration = null, specifiers = null, source = null, attributes = null) {
	  const node = {
	    type: "DeclareExportDeclaration",
	    declaration,
	    specifiers,
	    source,
	    attributes
	  };
	  const defs = NODE_FIELDS.DeclareExportDeclaration;
	  validate(defs.declaration, node, "declaration", declaration, 1);
	  validate(defs.specifiers, node, "specifiers", specifiers, 1);
	  validate(defs.source, node, "source", source, 1);
	  validate(defs.attributes, node, "attributes", attributes, 1);
	  return node;
	}
	function declareExportAllDeclaration(source, attributes = null) {
	  const node = {
	    type: "DeclareExportAllDeclaration",
	    source,
	    attributes
	  };
	  const defs = NODE_FIELDS.DeclareExportAllDeclaration;
	  validate(defs.source, node, "source", source, 1);
	  validate(defs.attributes, node, "attributes", attributes, 1);
	  return node;
	}
	function declaredPredicate(value) {
	  const node = {
	    type: "DeclaredPredicate",
	    value
	  };
	  const defs = NODE_FIELDS.DeclaredPredicate;
	  validate(defs.value, node, "value", value, 1);
	  return node;
	}
	function existsTypeAnnotation() {
	  return {
	    type: "ExistsTypeAnnotation"
	  };
	}
	function functionTypeAnnotation(typeParameters = null, params, rest = null, returnType) {
	  const node = {
	    type: "FunctionTypeAnnotation",
	    typeParameters,
	    params,
	    rest,
	    returnType
	  };
	  const defs = NODE_FIELDS.FunctionTypeAnnotation;
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.params, node, "params", params, 1);
	  validate(defs.rest, node, "rest", rest, 1);
	  validate(defs.returnType, node, "returnType", returnType, 1);
	  return node;
	}
	function functionTypeParam(name = null, typeAnnotation) {
	  const node = {
	    type: "FunctionTypeParam",
	    name,
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.FunctionTypeParam;
	  validate(defs.name, node, "name", name, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function genericTypeAnnotation(id, typeParameters = null) {
	  const node = {
	    type: "GenericTypeAnnotation",
	    id,
	    typeParameters
	  };
	  const defs = NODE_FIELDS.GenericTypeAnnotation;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  return node;
	}
	function inferredPredicate() {
	  return {
	    type: "InferredPredicate"
	  };
	}
	function interfaceExtends(id, typeParameters = null) {
	  const node = {
	    type: "InterfaceExtends",
	    id,
	    typeParameters
	  };
	  const defs = NODE_FIELDS.InterfaceExtends;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  return node;
	}
	function interfaceDeclaration(id, typeParameters = null, _extends = null, body) {
	  const node = {
	    type: "InterfaceDeclaration",
	    id,
	    typeParameters,
	    extends: _extends,
	    body
	  };
	  const defs = NODE_FIELDS.InterfaceDeclaration;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.extends, node, "extends", _extends, 1);
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function interfaceTypeAnnotation(_extends = null, body) {
	  const node = {
	    type: "InterfaceTypeAnnotation",
	    extends: _extends,
	    body
	  };
	  const defs = NODE_FIELDS.InterfaceTypeAnnotation;
	  validate(defs.extends, node, "extends", _extends, 1);
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function intersectionTypeAnnotation(types) {
	  const node = {
	    type: "IntersectionTypeAnnotation",
	    types
	  };
	  const defs = NODE_FIELDS.IntersectionTypeAnnotation;
	  validate(defs.types, node, "types", types, 1);
	  return node;
	}
	function mixedTypeAnnotation() {
	  return {
	    type: "MixedTypeAnnotation"
	  };
	}
	function emptyTypeAnnotation() {
	  return {
	    type: "EmptyTypeAnnotation"
	  };
	}
	function nullableTypeAnnotation(typeAnnotation) {
	  const node = {
	    type: "NullableTypeAnnotation",
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.NullableTypeAnnotation;
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function numberLiteralTypeAnnotation(value) {
	  const node = {
	    type: "NumberLiteralTypeAnnotation",
	    value
	  };
	  const defs = NODE_FIELDS.NumberLiteralTypeAnnotation;
	  validate(defs.value, node, "value", value);
	  return node;
	}
	function numberTypeAnnotation() {
	  return {
	    type: "NumberTypeAnnotation"
	  };
	}
	function objectTypeAnnotation(properties, indexers = [], callProperties = [], internalSlots = [], exact = false) {
	  const node = {
	    type: "ObjectTypeAnnotation",
	    properties,
	    indexers,
	    callProperties,
	    internalSlots,
	    exact
	  };
	  const defs = NODE_FIELDS.ObjectTypeAnnotation;
	  validate(defs.properties, node, "properties", properties, 1);
	  validate(defs.indexers, node, "indexers", indexers, 1);
	  validate(defs.callProperties, node, "callProperties", callProperties, 1);
	  validate(defs.internalSlots, node, "internalSlots", internalSlots, 1);
	  validate(defs.exact, node, "exact", exact);
	  return node;
	}
	function objectTypeInternalSlot(id, value, optional, _static, method) {
	  const node = {
	    type: "ObjectTypeInternalSlot",
	    id,
	    value,
	    optional,
	    static: _static,
	    method
	  };
	  const defs = NODE_FIELDS.ObjectTypeInternalSlot;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.value, node, "value", value, 1);
	  validate(defs.optional, node, "optional", optional);
	  validate(defs.static, node, "static", _static);
	  validate(defs.method, node, "method", method);
	  return node;
	}
	function objectTypeCallProperty(value) {
	  const node = {
	    type: "ObjectTypeCallProperty",
	    value,
	    static: null
	  };
	  const defs = NODE_FIELDS.ObjectTypeCallProperty;
	  validate(defs.value, node, "value", value, 1);
	  return node;
	}
	function objectTypeIndexer(id = null, key, value, variance = null) {
	  const node = {
	    type: "ObjectTypeIndexer",
	    id,
	    key,
	    value,
	    variance,
	    static: null
	  };
	  const defs = NODE_FIELDS.ObjectTypeIndexer;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.key, node, "key", key, 1);
	  validate(defs.value, node, "value", value, 1);
	  validate(defs.variance, node, "variance", variance, 1);
	  return node;
	}
	function objectTypeProperty(key, value, variance = null) {
	  const node = {
	    type: "ObjectTypeProperty",
	    key,
	    value,
	    variance,
	    kind: null,
	    method: null,
	    optional: null,
	    proto: null,
	    static: null
	  };
	  const defs = NODE_FIELDS.ObjectTypeProperty;
	  validate(defs.key, node, "key", key, 1);
	  validate(defs.value, node, "value", value, 1);
	  validate(defs.variance, node, "variance", variance, 1);
	  return node;
	}
	function objectTypeSpreadProperty(argument) {
	  const node = {
	    type: "ObjectTypeSpreadProperty",
	    argument
	  };
	  const defs = NODE_FIELDS.ObjectTypeSpreadProperty;
	  validate(defs.argument, node, "argument", argument, 1);
	  return node;
	}
	function opaqueType(id, typeParameters = null, supertype = null, impltype) {
	  const node = {
	    type: "OpaqueType",
	    id,
	    typeParameters,
	    supertype,
	    impltype
	  };
	  const defs = NODE_FIELDS.OpaqueType;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.supertype, node, "supertype", supertype, 1);
	  validate(defs.impltype, node, "impltype", impltype, 1);
	  return node;
	}
	function qualifiedTypeIdentifier(id, qualification) {
	  const node = {
	    type: "QualifiedTypeIdentifier",
	    id,
	    qualification
	  };
	  const defs = NODE_FIELDS.QualifiedTypeIdentifier;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.qualification, node, "qualification", qualification, 1);
	  return node;
	}
	function stringLiteralTypeAnnotation(value) {
	  const node = {
	    type: "StringLiteralTypeAnnotation",
	    value
	  };
	  const defs = NODE_FIELDS.StringLiteralTypeAnnotation;
	  validate(defs.value, node, "value", value);
	  return node;
	}
	function stringTypeAnnotation() {
	  return {
	    type: "StringTypeAnnotation"
	  };
	}
	function symbolTypeAnnotation() {
	  return {
	    type: "SymbolTypeAnnotation"
	  };
	}
	function thisTypeAnnotation() {
	  return {
	    type: "ThisTypeAnnotation"
	  };
	}
	function tupleTypeAnnotation(types) {
	  const node = {
	    type: "TupleTypeAnnotation",
	    types
	  };
	  const defs = NODE_FIELDS.TupleTypeAnnotation;
	  validate(defs.types, node, "types", types, 1);
	  return node;
	}
	function typeofTypeAnnotation(argument) {
	  const node = {
	    type: "TypeofTypeAnnotation",
	    argument
	  };
	  const defs = NODE_FIELDS.TypeofTypeAnnotation;
	  validate(defs.argument, node, "argument", argument, 1);
	  return node;
	}
	function typeAlias(id, typeParameters = null, right) {
	  const node = {
	    type: "TypeAlias",
	    id,
	    typeParameters,
	    right
	  };
	  const defs = NODE_FIELDS.TypeAlias;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.right, node, "right", right, 1);
	  return node;
	}
	function typeAnnotation(typeAnnotation) {
	  const node = {
	    type: "TypeAnnotation",
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TypeAnnotation;
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function typeCastExpression(expression, typeAnnotation) {
	  const node = {
	    type: "TypeCastExpression",
	    expression,
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TypeCastExpression;
	  validate(defs.expression, node, "expression", expression, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function typeParameter(bound = null, _default = null, variance = null) {
	  const node = {
	    type: "TypeParameter",
	    bound,
	    default: _default,
	    variance,
	    name: null
	  };
	  const defs = NODE_FIELDS.TypeParameter;
	  validate(defs.bound, node, "bound", bound, 1);
	  validate(defs.default, node, "default", _default, 1);
	  validate(defs.variance, node, "variance", variance, 1);
	  return node;
	}
	function typeParameterDeclaration(params) {
	  const node = {
	    type: "TypeParameterDeclaration",
	    params
	  };
	  const defs = NODE_FIELDS.TypeParameterDeclaration;
	  validate(defs.params, node, "params", params, 1);
	  return node;
	}
	function typeParameterInstantiation(params) {
	  const node = {
	    type: "TypeParameterInstantiation",
	    params
	  };
	  const defs = NODE_FIELDS.TypeParameterInstantiation;
	  validate(defs.params, node, "params", params, 1);
	  return node;
	}
	function unionTypeAnnotation(types) {
	  const node = {
	    type: "UnionTypeAnnotation",
	    types
	  };
	  const defs = NODE_FIELDS.UnionTypeAnnotation;
	  validate(defs.types, node, "types", types, 1);
	  return node;
	}
	function variance(kind) {
	  const node = {
	    type: "Variance",
	    kind
	  };
	  const defs = NODE_FIELDS.Variance;
	  validate(defs.kind, node, "kind", kind);
	  return node;
	}
	function voidTypeAnnotation() {
	  return {
	    type: "VoidTypeAnnotation"
	  };
	}
	function enumDeclaration(id, body) {
	  const node = {
	    type: "EnumDeclaration",
	    id,
	    body
	  };
	  const defs = NODE_FIELDS.EnumDeclaration;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function enumBooleanBody(members) {
	  const node = {
	    type: "EnumBooleanBody",
	    members,
	    explicitType: null,
	    hasUnknownMembers: null
	  };
	  const defs = NODE_FIELDS.EnumBooleanBody;
	  validate(defs.members, node, "members", members, 1);
	  return node;
	}
	function enumNumberBody(members) {
	  const node = {
	    type: "EnumNumberBody",
	    members,
	    explicitType: null,
	    hasUnknownMembers: null
	  };
	  const defs = NODE_FIELDS.EnumNumberBody;
	  validate(defs.members, node, "members", members, 1);
	  return node;
	}
	function enumStringBody(members) {
	  const node = {
	    type: "EnumStringBody",
	    members,
	    explicitType: null,
	    hasUnknownMembers: null
	  };
	  const defs = NODE_FIELDS.EnumStringBody;
	  validate(defs.members, node, "members", members, 1);
	  return node;
	}
	function enumSymbolBody(members) {
	  const node = {
	    type: "EnumSymbolBody",
	    members,
	    hasUnknownMembers: null
	  };
	  const defs = NODE_FIELDS.EnumSymbolBody;
	  validate(defs.members, node, "members", members, 1);
	  return node;
	}
	function enumBooleanMember(id) {
	  const node = {
	    type: "EnumBooleanMember",
	    id,
	    init: null
	  };
	  const defs = NODE_FIELDS.EnumBooleanMember;
	  validate(defs.id, node, "id", id, 1);
	  return node;
	}
	function enumNumberMember(id, init) {
	  const node = {
	    type: "EnumNumberMember",
	    id,
	    init
	  };
	  const defs = NODE_FIELDS.EnumNumberMember;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.init, node, "init", init, 1);
	  return node;
	}
	function enumStringMember(id, init) {
	  const node = {
	    type: "EnumStringMember",
	    id,
	    init
	  };
	  const defs = NODE_FIELDS.EnumStringMember;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.init, node, "init", init, 1);
	  return node;
	}
	function enumDefaultedMember(id) {
	  const node = {
	    type: "EnumDefaultedMember",
	    id
	  };
	  const defs = NODE_FIELDS.EnumDefaultedMember;
	  validate(defs.id, node, "id", id, 1);
	  return node;
	}
	function indexedAccessType(objectType, indexType) {
	  const node = {
	    type: "IndexedAccessType",
	    objectType,
	    indexType
	  };
	  const defs = NODE_FIELDS.IndexedAccessType;
	  validate(defs.objectType, node, "objectType", objectType, 1);
	  validate(defs.indexType, node, "indexType", indexType, 1);
	  return node;
	}
	function optionalIndexedAccessType(objectType, indexType) {
	  const node = {
	    type: "OptionalIndexedAccessType",
	    objectType,
	    indexType,
	    optional: null
	  };
	  const defs = NODE_FIELDS.OptionalIndexedAccessType;
	  validate(defs.objectType, node, "objectType", objectType, 1);
	  validate(defs.indexType, node, "indexType", indexType, 1);
	  return node;
	}
	function jsxAttribute(name, value = null) {
	  const node = {
	    type: "JSXAttribute",
	    name,
	    value
	  };
	  const defs = NODE_FIELDS.JSXAttribute;
	  validate(defs.name, node, "name", name, 1);
	  validate(defs.value, node, "value", value, 1);
	  return node;
	}
	function jsxClosingElement(name) {
	  const node = {
	    type: "JSXClosingElement",
	    name
	  };
	  const defs = NODE_FIELDS.JSXClosingElement;
	  validate(defs.name, node, "name", name, 1);
	  return node;
	}
	function jsxElement(openingElement, closingElement = null, children, selfClosing = null) {
	  const node = {
	    type: "JSXElement",
	    openingElement,
	    closingElement,
	    children,
	    selfClosing
	  };
	  const defs = NODE_FIELDS.JSXElement;
	  validate(defs.openingElement, node, "openingElement", openingElement, 1);
	  validate(defs.closingElement, node, "closingElement", closingElement, 1);
	  validate(defs.children, node, "children", children, 1);
	  validate(defs.selfClosing, node, "selfClosing", selfClosing);
	  return node;
	}
	function jsxEmptyExpression() {
	  return {
	    type: "JSXEmptyExpression"
	  };
	}
	function jsxExpressionContainer(expression) {
	  const node = {
	    type: "JSXExpressionContainer",
	    expression
	  };
	  const defs = NODE_FIELDS.JSXExpressionContainer;
	  validate(defs.expression, node, "expression", expression, 1);
	  return node;
	}
	function jsxSpreadChild(expression) {
	  const node = {
	    type: "JSXSpreadChild",
	    expression
	  };
	  const defs = NODE_FIELDS.JSXSpreadChild;
	  validate(defs.expression, node, "expression", expression, 1);
	  return node;
	}
	function jsxIdentifier(name) {
	  const node = {
	    type: "JSXIdentifier",
	    name
	  };
	  const defs = NODE_FIELDS.JSXIdentifier;
	  validate(defs.name, node, "name", name);
	  return node;
	}
	function jsxMemberExpression(object, property) {
	  const node = {
	    type: "JSXMemberExpression",
	    object,
	    property
	  };
	  const defs = NODE_FIELDS.JSXMemberExpression;
	  validate(defs.object, node, "object", object, 1);
	  validate(defs.property, node, "property", property, 1);
	  return node;
	}
	function jsxNamespacedName(namespace, name) {
	  const node = {
	    type: "JSXNamespacedName",
	    namespace,
	    name
	  };
	  const defs = NODE_FIELDS.JSXNamespacedName;
	  validate(defs.namespace, node, "namespace", namespace, 1);
	  validate(defs.name, node, "name", name, 1);
	  return node;
	}
	function jsxOpeningElement(name, attributes, selfClosing = false) {
	  const node = {
	    type: "JSXOpeningElement",
	    name,
	    attributes,
	    selfClosing
	  };
	  const defs = NODE_FIELDS.JSXOpeningElement;
	  validate(defs.name, node, "name", name, 1);
	  validate(defs.attributes, node, "attributes", attributes, 1);
	  validate(defs.selfClosing, node, "selfClosing", selfClosing);
	  return node;
	}
	function jsxSpreadAttribute(argument) {
	  const node = {
	    type: "JSXSpreadAttribute",
	    argument
	  };
	  const defs = NODE_FIELDS.JSXSpreadAttribute;
	  validate(defs.argument, node, "argument", argument, 1);
	  return node;
	}
	function jsxText(value) {
	  const node = {
	    type: "JSXText",
	    value
	  };
	  const defs = NODE_FIELDS.JSXText;
	  validate(defs.value, node, "value", value);
	  return node;
	}
	function jsxFragment(openingFragment, closingFragment, children) {
	  const node = {
	    type: "JSXFragment",
	    openingFragment,
	    closingFragment,
	    children
	  };
	  const defs = NODE_FIELDS.JSXFragment;
	  validate(defs.openingFragment, node, "openingFragment", openingFragment, 1);
	  validate(defs.closingFragment, node, "closingFragment", closingFragment, 1);
	  validate(defs.children, node, "children", children, 1);
	  return node;
	}
	function jsxOpeningFragment() {
	  return {
	    type: "JSXOpeningFragment"
	  };
	}
	function jsxClosingFragment() {
	  return {
	    type: "JSXClosingFragment"
	  };
	}
	function noop() {
	  return {
	    type: "Noop"
	  };
	}
	function placeholder(expectedNode, name) {
	  const node = {
	    type: "Placeholder",
	    expectedNode,
	    name
	  };
	  const defs = NODE_FIELDS.Placeholder;
	  validate(defs.expectedNode, node, "expectedNode", expectedNode);
	  validate(defs.name, node, "name", name, 1);
	  return node;
	}
	function v8IntrinsicIdentifier(name) {
	  const node = {
	    type: "V8IntrinsicIdentifier",
	    name
	  };
	  const defs = NODE_FIELDS.V8IntrinsicIdentifier;
	  validate(defs.name, node, "name", name);
	  return node;
	}
	function argumentPlaceholder() {
	  return {
	    type: "ArgumentPlaceholder"
	  };
	}
	function bindExpression(object, callee) {
	  const node = {
	    type: "BindExpression",
	    object,
	    callee
	  };
	  const defs = NODE_FIELDS.BindExpression;
	  validate(defs.object, node, "object", object, 1);
	  validate(defs.callee, node, "callee", callee, 1);
	  return node;
	}
	function decorator(expression) {
	  const node = {
	    type: "Decorator",
	    expression
	  };
	  const defs = NODE_FIELDS.Decorator;
	  validate(defs.expression, node, "expression", expression, 1);
	  return node;
	}
	function doExpression(body, async = false) {
	  const node = {
	    type: "DoExpression",
	    body,
	    async
	  };
	  const defs = NODE_FIELDS.DoExpression;
	  validate(defs.body, node, "body", body, 1);
	  validate(defs.async, node, "async", async);
	  return node;
	}
	function exportDefaultSpecifier(exported) {
	  const node = {
	    type: "ExportDefaultSpecifier",
	    exported
	  };
	  const defs = NODE_FIELDS.ExportDefaultSpecifier;
	  validate(defs.exported, node, "exported", exported, 1);
	  return node;
	}
	function recordExpression(properties) {
	  const node = {
	    type: "RecordExpression",
	    properties
	  };
	  const defs = NODE_FIELDS.RecordExpression;
	  validate(defs.properties, node, "properties", properties, 1);
	  return node;
	}
	function tupleExpression(elements = []) {
	  const node = {
	    type: "TupleExpression",
	    elements
	  };
	  const defs = NODE_FIELDS.TupleExpression;
	  validate(defs.elements, node, "elements", elements, 1);
	  return node;
	}
	function decimalLiteral(value) {
	  const node = {
	    type: "DecimalLiteral",
	    value
	  };
	  const defs = NODE_FIELDS.DecimalLiteral;
	  validate(defs.value, node, "value", value);
	  return node;
	}
	function moduleExpression(body) {
	  const node = {
	    type: "ModuleExpression",
	    body
	  };
	  const defs = NODE_FIELDS.ModuleExpression;
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function topicReference() {
	  return {
	    type: "TopicReference"
	  };
	}
	function pipelineTopicExpression(expression) {
	  const node = {
	    type: "PipelineTopicExpression",
	    expression
	  };
	  const defs = NODE_FIELDS.PipelineTopicExpression;
	  validate(defs.expression, node, "expression", expression, 1);
	  return node;
	}
	function pipelineBareFunction(callee) {
	  const node = {
	    type: "PipelineBareFunction",
	    callee
	  };
	  const defs = NODE_FIELDS.PipelineBareFunction;
	  validate(defs.callee, node, "callee", callee, 1);
	  return node;
	}
	function pipelinePrimaryTopicReference() {
	  return {
	    type: "PipelinePrimaryTopicReference"
	  };
	}
	function voidPattern() {
	  return {
	    type: "VoidPattern"
	  };
	}
	function tsParameterProperty(parameter) {
	  const node = {
	    type: "TSParameterProperty",
	    parameter
	  };
	  const defs = NODE_FIELDS.TSParameterProperty;
	  validate(defs.parameter, node, "parameter", parameter, 1);
	  return node;
	}
	function tsDeclareFunction(id = null, typeParameters = null, params, returnType = null) {
	  const node = {
	    type: "TSDeclareFunction",
	    id,
	    typeParameters,
	    params,
	    returnType
	  };
	  const defs = NODE_FIELDS.TSDeclareFunction;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.params, node, "params", params, 1);
	  validate(defs.returnType, node, "returnType", returnType, 1);
	  return node;
	}
	function tsDeclareMethod(decorators = null, key, typeParameters = null, params, returnType = null) {
	  const node = {
	    type: "TSDeclareMethod",
	    decorators,
	    key,
	    typeParameters,
	    params,
	    returnType
	  };
	  const defs = NODE_FIELDS.TSDeclareMethod;
	  validate(defs.decorators, node, "decorators", decorators, 1);
	  validate(defs.key, node, "key", key, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.params, node, "params", params, 1);
	  validate(defs.returnType, node, "returnType", returnType, 1);
	  return node;
	}
	function tsQualifiedName(left, right) {
	  const node = {
	    type: "TSQualifiedName",
	    left,
	    right
	  };
	  const defs = NODE_FIELDS.TSQualifiedName;
	  validate(defs.left, node, "left", left, 1);
	  validate(defs.right, node, "right", right, 1);
	  return node;
	}
	function tsCallSignatureDeclaration(typeParameters = null, parameters, typeAnnotation = null) {
	  const node = {
	    type: "TSCallSignatureDeclaration",
	    typeParameters,
	    parameters,
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TSCallSignatureDeclaration;
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.parameters, node, "parameters", parameters, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function tsConstructSignatureDeclaration(typeParameters = null, parameters, typeAnnotation = null) {
	  const node = {
	    type: "TSConstructSignatureDeclaration",
	    typeParameters,
	    parameters,
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TSConstructSignatureDeclaration;
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.parameters, node, "parameters", parameters, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function tsPropertySignature(key, typeAnnotation = null) {
	  const node = {
	    type: "TSPropertySignature",
	    key,
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TSPropertySignature;
	  validate(defs.key, node, "key", key, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function tsMethodSignature(key, typeParameters = null, parameters, typeAnnotation = null) {
	  const node = {
	    type: "TSMethodSignature",
	    key,
	    typeParameters,
	    parameters,
	    typeAnnotation,
	    kind: null
	  };
	  const defs = NODE_FIELDS.TSMethodSignature;
	  validate(defs.key, node, "key", key, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.parameters, node, "parameters", parameters, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function tsIndexSignature(parameters, typeAnnotation = null) {
	  const node = {
	    type: "TSIndexSignature",
	    parameters,
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TSIndexSignature;
	  validate(defs.parameters, node, "parameters", parameters, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function tsAnyKeyword() {
	  return {
	    type: "TSAnyKeyword"
	  };
	}
	function tsBooleanKeyword() {
	  return {
	    type: "TSBooleanKeyword"
	  };
	}
	function tsBigIntKeyword() {
	  return {
	    type: "TSBigIntKeyword"
	  };
	}
	function tsIntrinsicKeyword() {
	  return {
	    type: "TSIntrinsicKeyword"
	  };
	}
	function tsNeverKeyword() {
	  return {
	    type: "TSNeverKeyword"
	  };
	}
	function tsNullKeyword() {
	  return {
	    type: "TSNullKeyword"
	  };
	}
	function tsNumberKeyword() {
	  return {
	    type: "TSNumberKeyword"
	  };
	}
	function tsObjectKeyword() {
	  return {
	    type: "TSObjectKeyword"
	  };
	}
	function tsStringKeyword() {
	  return {
	    type: "TSStringKeyword"
	  };
	}
	function tsSymbolKeyword() {
	  return {
	    type: "TSSymbolKeyword"
	  };
	}
	function tsUndefinedKeyword() {
	  return {
	    type: "TSUndefinedKeyword"
	  };
	}
	function tsUnknownKeyword() {
	  return {
	    type: "TSUnknownKeyword"
	  };
	}
	function tsVoidKeyword() {
	  return {
	    type: "TSVoidKeyword"
	  };
	}
	function tsThisType() {
	  return {
	    type: "TSThisType"
	  };
	}
	function tsFunctionType(typeParameters = null, parameters, typeAnnotation = null) {
	  const node = {
	    type: "TSFunctionType",
	    typeParameters,
	    parameters,
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TSFunctionType;
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.parameters, node, "parameters", parameters, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function tsConstructorType(typeParameters = null, parameters, typeAnnotation = null) {
	  const node = {
	    type: "TSConstructorType",
	    typeParameters,
	    parameters,
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TSConstructorType;
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.parameters, node, "parameters", parameters, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function tsTypeReference(typeName, typeParameters = null) {
	  const node = {
	    type: "TSTypeReference",
	    typeName,
	    typeParameters
	  };
	  const defs = NODE_FIELDS.TSTypeReference;
	  validate(defs.typeName, node, "typeName", typeName, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  return node;
	}
	function tsTypePredicate(parameterName, typeAnnotation = null, asserts = null) {
	  const node = {
	    type: "TSTypePredicate",
	    parameterName,
	    typeAnnotation,
	    asserts
	  };
	  const defs = NODE_FIELDS.TSTypePredicate;
	  validate(defs.parameterName, node, "parameterName", parameterName, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  validate(defs.asserts, node, "asserts", asserts);
	  return node;
	}
	function tsTypeQuery(exprName, typeParameters = null) {
	  const node = {
	    type: "TSTypeQuery",
	    exprName,
	    typeParameters
	  };
	  const defs = NODE_FIELDS.TSTypeQuery;
	  validate(defs.exprName, node, "exprName", exprName, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  return node;
	}
	function tsTypeLiteral(members) {
	  const node = {
	    type: "TSTypeLiteral",
	    members
	  };
	  const defs = NODE_FIELDS.TSTypeLiteral;
	  validate(defs.members, node, "members", members, 1);
	  return node;
	}
	function tsArrayType(elementType) {
	  const node = {
	    type: "TSArrayType",
	    elementType
	  };
	  const defs = NODE_FIELDS.TSArrayType;
	  validate(defs.elementType, node, "elementType", elementType, 1);
	  return node;
	}
	function tsTupleType(elementTypes) {
	  const node = {
	    type: "TSTupleType",
	    elementTypes
	  };
	  const defs = NODE_FIELDS.TSTupleType;
	  validate(defs.elementTypes, node, "elementTypes", elementTypes, 1);
	  return node;
	}
	function tsOptionalType(typeAnnotation) {
	  const node = {
	    type: "TSOptionalType",
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TSOptionalType;
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function tsRestType(typeAnnotation) {
	  const node = {
	    type: "TSRestType",
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TSRestType;
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function tsNamedTupleMember(label, elementType, optional = false) {
	  const node = {
	    type: "TSNamedTupleMember",
	    label,
	    elementType,
	    optional
	  };
	  const defs = NODE_FIELDS.TSNamedTupleMember;
	  validate(defs.label, node, "label", label, 1);
	  validate(defs.elementType, node, "elementType", elementType, 1);
	  validate(defs.optional, node, "optional", optional);
	  return node;
	}
	function tsUnionType(types) {
	  const node = {
	    type: "TSUnionType",
	    types
	  };
	  const defs = NODE_FIELDS.TSUnionType;
	  validate(defs.types, node, "types", types, 1);
	  return node;
	}
	function tsIntersectionType(types) {
	  const node = {
	    type: "TSIntersectionType",
	    types
	  };
	  const defs = NODE_FIELDS.TSIntersectionType;
	  validate(defs.types, node, "types", types, 1);
	  return node;
	}
	function tsConditionalType(checkType, extendsType, trueType, falseType) {
	  const node = {
	    type: "TSConditionalType",
	    checkType,
	    extendsType,
	    trueType,
	    falseType
	  };
	  const defs = NODE_FIELDS.TSConditionalType;
	  validate(defs.checkType, node, "checkType", checkType, 1);
	  validate(defs.extendsType, node, "extendsType", extendsType, 1);
	  validate(defs.trueType, node, "trueType", trueType, 1);
	  validate(defs.falseType, node, "falseType", falseType, 1);
	  return node;
	}
	function tsInferType(typeParameter) {
	  const node = {
	    type: "TSInferType",
	    typeParameter
	  };
	  const defs = NODE_FIELDS.TSInferType;
	  validate(defs.typeParameter, node, "typeParameter", typeParameter, 1);
	  return node;
	}
	function tsParenthesizedType(typeAnnotation) {
	  const node = {
	    type: "TSParenthesizedType",
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TSParenthesizedType;
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function tsTypeOperator(typeAnnotation, operator = "keyof") {
	  const node = {
	    type: "TSTypeOperator",
	    typeAnnotation,
	    operator
	  };
	  const defs = NODE_FIELDS.TSTypeOperator;
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  validate(defs.operator, node, "operator", operator);
	  return node;
	}
	function tsIndexedAccessType(objectType, indexType) {
	  const node = {
	    type: "TSIndexedAccessType",
	    objectType,
	    indexType
	  };
	  const defs = NODE_FIELDS.TSIndexedAccessType;
	  validate(defs.objectType, node, "objectType", objectType, 1);
	  validate(defs.indexType, node, "indexType", indexType, 1);
	  return node;
	}
	function tsMappedType(typeParameter, typeAnnotation = null, nameType = null) {
	  const node = {
	    type: "TSMappedType",
	    typeParameter,
	    typeAnnotation,
	    nameType
	  };
	  const defs = NODE_FIELDS.TSMappedType;
	  validate(defs.typeParameter, node, "typeParameter", typeParameter, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  validate(defs.nameType, node, "nameType", nameType, 1);
	  return node;
	}
	function tsTemplateLiteralType(quasis, types) {
	  const node = {
	    type: "TSTemplateLiteralType",
	    quasis,
	    types
	  };
	  const defs = NODE_FIELDS.TSTemplateLiteralType;
	  validate(defs.quasis, node, "quasis", quasis, 1);
	  validate(defs.types, node, "types", types, 1);
	  return node;
	}
	function tsLiteralType(literal) {
	  const node = {
	    type: "TSLiteralType",
	    literal
	  };
	  const defs = NODE_FIELDS.TSLiteralType;
	  validate(defs.literal, node, "literal", literal, 1);
	  return node;
	}
	function tsExpressionWithTypeArguments(expression, typeParameters = null) {
	  const node = {
	    type: "TSExpressionWithTypeArguments",
	    expression,
	    typeParameters
	  };
	  const defs = NODE_FIELDS.TSExpressionWithTypeArguments;
	  validate(defs.expression, node, "expression", expression, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  return node;
	}
	function tsInterfaceDeclaration(id, typeParameters = null, _extends = null, body) {
	  const node = {
	    type: "TSInterfaceDeclaration",
	    id,
	    typeParameters,
	    extends: _extends,
	    body
	  };
	  const defs = NODE_FIELDS.TSInterfaceDeclaration;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.extends, node, "extends", _extends, 1);
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function tsInterfaceBody(body) {
	  const node = {
	    type: "TSInterfaceBody",
	    body
	  };
	  const defs = NODE_FIELDS.TSInterfaceBody;
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function tsTypeAliasDeclaration(id, typeParameters = null, typeAnnotation) {
	  const node = {
	    type: "TSTypeAliasDeclaration",
	    id,
	    typeParameters,
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TSTypeAliasDeclaration;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function tsInstantiationExpression(expression, typeParameters = null) {
	  const node = {
	    type: "TSInstantiationExpression",
	    expression,
	    typeParameters
	  };
	  const defs = NODE_FIELDS.TSInstantiationExpression;
	  validate(defs.expression, node, "expression", expression, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  return node;
	}
	function tsAsExpression(expression, typeAnnotation) {
	  const node = {
	    type: "TSAsExpression",
	    expression,
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TSAsExpression;
	  validate(defs.expression, node, "expression", expression, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function tsSatisfiesExpression(expression, typeAnnotation) {
	  const node = {
	    type: "TSSatisfiesExpression",
	    expression,
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TSSatisfiesExpression;
	  validate(defs.expression, node, "expression", expression, 1);
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function tsTypeAssertion(typeAnnotation, expression) {
	  const node = {
	    type: "TSTypeAssertion",
	    typeAnnotation,
	    expression
	  };
	  const defs = NODE_FIELDS.TSTypeAssertion;
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  validate(defs.expression, node, "expression", expression, 1);
	  return node;
	}
	function tsEnumBody(members) {
	  const node = {
	    type: "TSEnumBody",
	    members
	  };
	  const defs = NODE_FIELDS.TSEnumBody;
	  validate(defs.members, node, "members", members, 1);
	  return node;
	}
	function tsEnumDeclaration(id, members) {
	  const node = {
	    type: "TSEnumDeclaration",
	    id,
	    members
	  };
	  const defs = NODE_FIELDS.TSEnumDeclaration;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.members, node, "members", members, 1);
	  return node;
	}
	function tsEnumMember(id, initializer = null) {
	  const node = {
	    type: "TSEnumMember",
	    id,
	    initializer
	  };
	  const defs = NODE_FIELDS.TSEnumMember;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.initializer, node, "initializer", initializer, 1);
	  return node;
	}
	function tsModuleDeclaration(id, body) {
	  const node = {
	    type: "TSModuleDeclaration",
	    id,
	    body,
	    kind: null
	  };
	  const defs = NODE_FIELDS.TSModuleDeclaration;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function tsModuleBlock(body) {
	  const node = {
	    type: "TSModuleBlock",
	    body
	  };
	  const defs = NODE_FIELDS.TSModuleBlock;
	  validate(defs.body, node, "body", body, 1);
	  return node;
	}
	function tsImportType(argument, qualifier = null, typeParameters = null) {
	  const node = {
	    type: "TSImportType",
	    argument,
	    qualifier,
	    typeParameters
	  };
	  const defs = NODE_FIELDS.TSImportType;
	  validate(defs.argument, node, "argument", argument, 1);
	  validate(defs.qualifier, node, "qualifier", qualifier, 1);
	  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
	  return node;
	}
	function tsImportEqualsDeclaration(id, moduleReference) {
	  const node = {
	    type: "TSImportEqualsDeclaration",
	    id,
	    moduleReference,
	    isExport: null
	  };
	  const defs = NODE_FIELDS.TSImportEqualsDeclaration;
	  validate(defs.id, node, "id", id, 1);
	  validate(defs.moduleReference, node, "moduleReference", moduleReference, 1);
	  return node;
	}
	function tsExternalModuleReference(expression) {
	  const node = {
	    type: "TSExternalModuleReference",
	    expression
	  };
	  const defs = NODE_FIELDS.TSExternalModuleReference;
	  validate(defs.expression, node, "expression", expression, 1);
	  return node;
	}
	function tsNonNullExpression(expression) {
	  const node = {
	    type: "TSNonNullExpression",
	    expression
	  };
	  const defs = NODE_FIELDS.TSNonNullExpression;
	  validate(defs.expression, node, "expression", expression, 1);
	  return node;
	}
	function tsExportAssignment(expression) {
	  const node = {
	    type: "TSExportAssignment",
	    expression
	  };
	  const defs = NODE_FIELDS.TSExportAssignment;
	  validate(defs.expression, node, "expression", expression, 1);
	  return node;
	}
	function tsNamespaceExportDeclaration(id) {
	  const node = {
	    type: "TSNamespaceExportDeclaration",
	    id
	  };
	  const defs = NODE_FIELDS.TSNamespaceExportDeclaration;
	  validate(defs.id, node, "id", id, 1);
	  return node;
	}
	function tsTypeAnnotation(typeAnnotation) {
	  const node = {
	    type: "TSTypeAnnotation",
	    typeAnnotation
	  };
	  const defs = NODE_FIELDS.TSTypeAnnotation;
	  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
	  return node;
	}
	function tsTypeParameterInstantiation(params) {
	  const node = {
	    type: "TSTypeParameterInstantiation",
	    params
	  };
	  const defs = NODE_FIELDS.TSTypeParameterInstantiation;
	  validate(defs.params, node, "params", params, 1);
	  return node;
	}
	function tsTypeParameterDeclaration(params) {
	  const node = {
	    type: "TSTypeParameterDeclaration",
	    params
	  };
	  const defs = NODE_FIELDS.TSTypeParameterDeclaration;
	  validate(defs.params, node, "params", params, 1);
	  return node;
	}
	function tsTypeParameter(constraint = null, _default = null, name) {
	  const node = {
	    type: "TSTypeParameter",
	    constraint,
	    default: _default,
	    name
	  };
	  const defs = NODE_FIELDS.TSTypeParameter;
	  validate(defs.constraint, node, "constraint", constraint, 1);
	  validate(defs.default, node, "default", _default, 1);
	  validate(defs.name, node, "name", name);
	  return node;
	}
	function NumberLiteral(value) {
	  (0, _deprecationWarning.default)("NumberLiteral", "NumericLiteral", "The node type ");
	  return numericLiteral(value);
	}
	function RegexLiteral(pattern, flags = "") {
	  (0, _deprecationWarning.default)("RegexLiteral", "RegExpLiteral", "The node type ");
	  return regExpLiteral(pattern, flags);
	}
	function RestProperty(argument) {
	  (0, _deprecationWarning.default)("RestProperty", "RestElement", "The node type ");
	  return restElement(argument);
	}
	function SpreadProperty(argument) {
	  (0, _deprecationWarning.default)("SpreadProperty", "SpreadElement", "The node type ");
	  return spreadElement(argument);
	}

	
	return lowercase;
}

var uppercase = {};

var hasRequiredUppercase;

function requireUppercase () {
	if (hasRequiredUppercase) return uppercase;
	hasRequiredUppercase = 1;

	Object.defineProperty(uppercase, "__esModule", {
	  value: true
	});
	uppercase.JSXIdentifier = uppercase.JSXFragment = uppercase.JSXExpressionContainer = uppercase.JSXEmptyExpression = uppercase.JSXElement = uppercase.JSXClosingFragment = uppercase.JSXClosingElement = uppercase.JSXAttribute = uppercase.IntersectionTypeAnnotation = uppercase.InterpreterDirective = uppercase.InterfaceTypeAnnotation = uppercase.InterfaceExtends = uppercase.InterfaceDeclaration = uppercase.InferredPredicate = uppercase.IndexedAccessType = uppercase.ImportSpecifier = uppercase.ImportNamespaceSpecifier = uppercase.ImportExpression = uppercase.ImportDefaultSpecifier = uppercase.ImportDeclaration = uppercase.ImportAttribute = uppercase.Import = uppercase.IfStatement = uppercase.Identifier = uppercase.GenericTypeAnnotation = uppercase.FunctionTypeParam = uppercase.FunctionTypeAnnotation = uppercase.FunctionExpression = uppercase.FunctionDeclaration = uppercase.ForStatement = uppercase.ForOfStatement = uppercase.ForInStatement = uppercase.File = uppercase.ExpressionStatement = uppercase.ExportSpecifier = uppercase.ExportNamespaceSpecifier = uppercase.ExportNamedDeclaration = uppercase.ExportDefaultSpecifier = uppercase.ExportDefaultDeclaration = uppercase.ExportAllDeclaration = uppercase.ExistsTypeAnnotation = uppercase.EnumSymbolBody = uppercase.EnumStringMember = uppercase.EnumStringBody = uppercase.EnumNumberMember = uppercase.EnumNumberBody = uppercase.EnumDefaultedMember = uppercase.EnumDeclaration = uppercase.EnumBooleanMember = uppercase.EnumBooleanBody = uppercase.EmptyTypeAnnotation = uppercase.EmptyStatement = uppercase.DoWhileStatement = uppercase.DoExpression = uppercase.DirectiveLiteral = uppercase.Directive = uppercase.Decorator = uppercase.DeclaredPredicate = uppercase.DeclareVariable = uppercase.DeclareTypeAlias = uppercase.DeclareOpaqueType = uppercase.DeclareModuleExports = uppercase.DeclareModule = uppercase.DeclareInterface = uppercase.DeclareFunction = uppercase.DeclareExportDeclaration = uppercase.DeclareExportAllDeclaration = uppercase.DeclareClass = uppercase.DecimalLiteral = uppercase.DebuggerStatement = uppercase.ContinueStatement = uppercase.ConditionalExpression = uppercase.ClassProperty = uppercase.ClassPrivateProperty = uppercase.ClassPrivateMethod = uppercase.ClassMethod = uppercase.ClassImplements = uppercase.ClassExpression = uppercase.ClassDeclaration = uppercase.ClassBody = uppercase.ClassAccessorProperty = uppercase.CatchClause = uppercase.CallExpression = uppercase.BreakStatement = uppercase.BooleanTypeAnnotation = uppercase.BooleanLiteralTypeAnnotation = uppercase.BooleanLiteral = uppercase.BlockStatement = uppercase.BindExpression = uppercase.BinaryExpression = uppercase.BigIntLiteral = uppercase.AwaitExpression = uppercase.AssignmentPattern = uppercase.AssignmentExpression = uppercase.ArrowFunctionExpression = uppercase.ArrayTypeAnnotation = uppercase.ArrayPattern = uppercase.ArrayExpression = uppercase.ArgumentPlaceholder = uppercase.AnyTypeAnnotation = void 0;
	uppercase.TSNumberKeyword = uppercase.TSNullKeyword = uppercase.TSNonNullExpression = uppercase.TSNeverKeyword = uppercase.TSNamespaceExportDeclaration = uppercase.TSNamedTupleMember = uppercase.TSModuleDeclaration = uppercase.TSModuleBlock = uppercase.TSMethodSignature = uppercase.TSMappedType = uppercase.TSLiteralType = uppercase.TSIntrinsicKeyword = uppercase.TSIntersectionType = uppercase.TSInterfaceDeclaration = uppercase.TSInterfaceBody = uppercase.TSInstantiationExpression = uppercase.TSInferType = uppercase.TSIndexedAccessType = uppercase.TSIndexSignature = uppercase.TSImportType = uppercase.TSImportEqualsDeclaration = uppercase.TSFunctionType = uppercase.TSExternalModuleReference = uppercase.TSExpressionWithTypeArguments = uppercase.TSExportAssignment = uppercase.TSEnumMember = uppercase.TSEnumDeclaration = uppercase.TSEnumBody = uppercase.TSDeclareMethod = uppercase.TSDeclareFunction = uppercase.TSConstructorType = uppercase.TSConstructSignatureDeclaration = uppercase.TSConditionalType = uppercase.TSCallSignatureDeclaration = uppercase.TSBooleanKeyword = uppercase.TSBigIntKeyword = uppercase.TSAsExpression = uppercase.TSArrayType = uppercase.TSAnyKeyword = uppercase.SymbolTypeAnnotation = uppercase.SwitchStatement = uppercase.SwitchCase = uppercase.Super = uppercase.StringTypeAnnotation = uppercase.StringLiteralTypeAnnotation = uppercase.StringLiteral = uppercase.StaticBlock = uppercase.SpreadProperty = uppercase.SpreadElement = uppercase.SequenceExpression = uppercase.ReturnStatement = uppercase.RestProperty = uppercase.RestElement = uppercase.RegexLiteral = uppercase.RegExpLiteral = uppercase.RecordExpression = uppercase.QualifiedTypeIdentifier = uppercase.Program = uppercase.PrivateName = uppercase.Placeholder = uppercase.PipelineTopicExpression = uppercase.PipelinePrimaryTopicReference = uppercase.PipelineBareFunction = uppercase.ParenthesizedExpression = uppercase.OptionalMemberExpression = uppercase.OptionalIndexedAccessType = uppercase.OptionalCallExpression = uppercase.OpaqueType = uppercase.ObjectTypeSpreadProperty = uppercase.ObjectTypeProperty = uppercase.ObjectTypeInternalSlot = uppercase.ObjectTypeIndexer = uppercase.ObjectTypeCallProperty = uppercase.ObjectTypeAnnotation = uppercase.ObjectProperty = uppercase.ObjectPattern = uppercase.ObjectMethod = uppercase.ObjectExpression = uppercase.NumericLiteral = uppercase.NumberTypeAnnotation = uppercase.NumberLiteralTypeAnnotation = uppercase.NumberLiteral = uppercase.NullableTypeAnnotation = uppercase.NullLiteralTypeAnnotation = uppercase.NullLiteral = uppercase.Noop = uppercase.NewExpression = uppercase.ModuleExpression = uppercase.MixedTypeAnnotation = uppercase.MetaProperty = uppercase.MemberExpression = uppercase.LogicalExpression = uppercase.LabeledStatement = uppercase.JSXText = uppercase.JSXSpreadChild = uppercase.JSXSpreadAttribute = uppercase.JSXOpeningFragment = uppercase.JSXOpeningElement = uppercase.JSXNamespacedName = uppercase.JSXMemberExpression = void 0;
	uppercase.YieldExpression = uppercase.WithStatement = uppercase.WhileStatement = uppercase.VoidTypeAnnotation = uppercase.VoidPattern = uppercase.Variance = uppercase.VariableDeclarator = uppercase.VariableDeclaration = uppercase.V8IntrinsicIdentifier = uppercase.UpdateExpression = uppercase.UnionTypeAnnotation = uppercase.UnaryExpression = uppercase.TypeofTypeAnnotation = uppercase.TypeParameterInstantiation = uppercase.TypeParameterDeclaration = uppercase.TypeParameter = uppercase.TypeCastExpression = uppercase.TypeAnnotation = uppercase.TypeAlias = uppercase.TupleTypeAnnotation = uppercase.TupleExpression = uppercase.TryStatement = uppercase.TopicReference = uppercase.ThrowStatement = uppercase.ThisTypeAnnotation = uppercase.ThisExpression = uppercase.TemplateLiteral = uppercase.TemplateElement = uppercase.TaggedTemplateExpression = uppercase.TSVoidKeyword = uppercase.TSUnknownKeyword = uppercase.TSUnionType = uppercase.TSUndefinedKeyword = uppercase.TSTypeReference = uppercase.TSTypeQuery = uppercase.TSTypePredicate = uppercase.TSTypeParameterInstantiation = uppercase.TSTypeParameterDeclaration = uppercase.TSTypeParameter = uppercase.TSTypeOperator = uppercase.TSTypeLiteral = uppercase.TSTypeAssertion = uppercase.TSTypeAnnotation = uppercase.TSTypeAliasDeclaration = uppercase.TSTupleType = uppercase.TSThisType = uppercase.TSTemplateLiteralType = uppercase.TSSymbolKeyword = uppercase.TSStringKeyword = uppercase.TSSatisfiesExpression = uppercase.TSRestType = uppercase.TSQualifiedName = uppercase.TSPropertySignature = uppercase.TSParenthesizedType = uppercase.TSParameterProperty = uppercase.TSOptionalType = uppercase.TSObjectKeyword = void 0;
	var b = requireLowercase();
	requireDeprecationWarning();
	function alias(lowercase) {
	  return b[lowercase];
	}
	uppercase.ArrayExpression = alias("arrayExpression");
	  uppercase.AssignmentExpression = alias("assignmentExpression");
	  uppercase.BinaryExpression = alias("binaryExpression");
	  uppercase.InterpreterDirective = alias("interpreterDirective");
	  uppercase.Directive = alias("directive");
	  uppercase.DirectiveLiteral = alias("directiveLiteral");
	  uppercase.BlockStatement = alias("blockStatement");
	  uppercase.BreakStatement = alias("breakStatement");
	  uppercase.CallExpression = alias("callExpression");
	  uppercase.CatchClause = alias("catchClause");
	  uppercase.ConditionalExpression = alias("conditionalExpression");
	  uppercase.ContinueStatement = alias("continueStatement");
	  uppercase.DebuggerStatement = alias("debuggerStatement");
	  uppercase.DoWhileStatement = alias("doWhileStatement");
	  uppercase.EmptyStatement = alias("emptyStatement");
	  uppercase.ExpressionStatement = alias("expressionStatement");
	  uppercase.File = alias("file");
	  uppercase.ForInStatement = alias("forInStatement");
	  uppercase.ForStatement = alias("forStatement");
	  uppercase.FunctionDeclaration = alias("functionDeclaration");
	  uppercase.FunctionExpression = alias("functionExpression");
	  uppercase.Identifier = alias("identifier");
	  uppercase.IfStatement = alias("ifStatement");
	  uppercase.LabeledStatement = alias("labeledStatement");
	  uppercase.StringLiteral = alias("stringLiteral");
	  uppercase.NumericLiteral = alias("numericLiteral");
	  uppercase.NullLiteral = alias("nullLiteral");
	  uppercase.BooleanLiteral = alias("booleanLiteral");
	  uppercase.RegExpLiteral = alias("regExpLiteral");
	  uppercase.LogicalExpression = alias("logicalExpression");
	  uppercase.MemberExpression = alias("memberExpression");
	  uppercase.NewExpression = alias("newExpression");
	  uppercase.Program = alias("program");
	  uppercase.ObjectExpression = alias("objectExpression");
	  uppercase.ObjectMethod = alias("objectMethod");
	  uppercase.ObjectProperty = alias("objectProperty");
	  uppercase.RestElement = alias("restElement");
	  uppercase.ReturnStatement = alias("returnStatement");
	  uppercase.SequenceExpression = alias("sequenceExpression");
	  uppercase.ParenthesizedExpression = alias("parenthesizedExpression");
	  uppercase.SwitchCase = alias("switchCase");
	  uppercase.SwitchStatement = alias("switchStatement");
	  uppercase.ThisExpression = alias("thisExpression");
	  uppercase.ThrowStatement = alias("throwStatement");
	  uppercase.TryStatement = alias("tryStatement");
	  uppercase.UnaryExpression = alias("unaryExpression");
	  uppercase.UpdateExpression = alias("updateExpression");
	  uppercase.VariableDeclaration = alias("variableDeclaration");
	  uppercase.VariableDeclarator = alias("variableDeclarator");
	  uppercase.WhileStatement = alias("whileStatement");
	  uppercase.WithStatement = alias("withStatement");
	  uppercase.AssignmentPattern = alias("assignmentPattern");
	  uppercase.ArrayPattern = alias("arrayPattern");
	  uppercase.ArrowFunctionExpression = alias("arrowFunctionExpression");
	  uppercase.ClassBody = alias("classBody");
	  uppercase.ClassExpression = alias("classExpression");
	  uppercase.ClassDeclaration = alias("classDeclaration");
	  uppercase.ExportAllDeclaration = alias("exportAllDeclaration");
	  uppercase.ExportDefaultDeclaration = alias("exportDefaultDeclaration");
	  uppercase.ExportNamedDeclaration = alias("exportNamedDeclaration");
	  uppercase.ExportSpecifier = alias("exportSpecifier");
	  uppercase.ForOfStatement = alias("forOfStatement");
	  uppercase.ImportDeclaration = alias("importDeclaration");
	  uppercase.ImportDefaultSpecifier = alias("importDefaultSpecifier");
	  uppercase.ImportNamespaceSpecifier = alias("importNamespaceSpecifier");
	  uppercase.ImportSpecifier = alias("importSpecifier");
	  uppercase.ImportExpression = alias("importExpression");
	  uppercase.MetaProperty = alias("metaProperty");
	  uppercase.ClassMethod = alias("classMethod");
	  uppercase.ObjectPattern = alias("objectPattern");
	  uppercase.SpreadElement = alias("spreadElement");
	  uppercase.Super = alias("super");
	  uppercase.TaggedTemplateExpression = alias("taggedTemplateExpression");
	  uppercase.TemplateElement = alias("templateElement");
	  uppercase.TemplateLiteral = alias("templateLiteral");
	  uppercase.YieldExpression = alias("yieldExpression");
	  uppercase.AwaitExpression = alias("awaitExpression");
	  uppercase.Import = alias("import");
	  uppercase.BigIntLiteral = alias("bigIntLiteral");
	  uppercase.ExportNamespaceSpecifier = alias("exportNamespaceSpecifier");
	  uppercase.OptionalMemberExpression = alias("optionalMemberExpression");
	  uppercase.OptionalCallExpression = alias("optionalCallExpression");
	  uppercase.ClassProperty = alias("classProperty");
	  uppercase.ClassAccessorProperty = alias("classAccessorProperty");
	  uppercase.ClassPrivateProperty = alias("classPrivateProperty");
	  uppercase.ClassPrivateMethod = alias("classPrivateMethod");
	  uppercase.PrivateName = alias("privateName");
	  uppercase.StaticBlock = alias("staticBlock");
	  uppercase.ImportAttribute = alias("importAttribute");
	  uppercase.AnyTypeAnnotation = alias("anyTypeAnnotation");
	  uppercase.ArrayTypeAnnotation = alias("arrayTypeAnnotation");
	  uppercase.BooleanTypeAnnotation = alias("booleanTypeAnnotation");
	  uppercase.BooleanLiteralTypeAnnotation = alias("booleanLiteralTypeAnnotation");
	  uppercase.NullLiteralTypeAnnotation = alias("nullLiteralTypeAnnotation");
	  uppercase.ClassImplements = alias("classImplements");
	  uppercase.DeclareClass = alias("declareClass");
	  uppercase.DeclareFunction = alias("declareFunction");
	  uppercase.DeclareInterface = alias("declareInterface");
	  uppercase.DeclareModule = alias("declareModule");
	  uppercase.DeclareModuleExports = alias("declareModuleExports");
	  uppercase.DeclareTypeAlias = alias("declareTypeAlias");
	  uppercase.DeclareOpaqueType = alias("declareOpaqueType");
	  uppercase.DeclareVariable = alias("declareVariable");
	  uppercase.DeclareExportDeclaration = alias("declareExportDeclaration");
	  uppercase.DeclareExportAllDeclaration = alias("declareExportAllDeclaration");
	  uppercase.DeclaredPredicate = alias("declaredPredicate");
	  uppercase.ExistsTypeAnnotation = alias("existsTypeAnnotation");
	  uppercase.FunctionTypeAnnotation = alias("functionTypeAnnotation");
	  uppercase.FunctionTypeParam = alias("functionTypeParam");
	  uppercase.GenericTypeAnnotation = alias("genericTypeAnnotation");
	  uppercase.InferredPredicate = alias("inferredPredicate");
	  uppercase.InterfaceExtends = alias("interfaceExtends");
	  uppercase.InterfaceDeclaration = alias("interfaceDeclaration");
	  uppercase.InterfaceTypeAnnotation = alias("interfaceTypeAnnotation");
	  uppercase.IntersectionTypeAnnotation = alias("intersectionTypeAnnotation");
	  uppercase.MixedTypeAnnotation = alias("mixedTypeAnnotation");
	  uppercase.EmptyTypeAnnotation = alias("emptyTypeAnnotation");
	  uppercase.NullableTypeAnnotation = alias("nullableTypeAnnotation");
	  uppercase.NumberLiteralTypeAnnotation = alias("numberLiteralTypeAnnotation");
	  uppercase.NumberTypeAnnotation = alias("numberTypeAnnotation");
	  uppercase.ObjectTypeAnnotation = alias("objectTypeAnnotation");
	  uppercase.ObjectTypeInternalSlot = alias("objectTypeInternalSlot");
	  uppercase.ObjectTypeCallProperty = alias("objectTypeCallProperty");
	  uppercase.ObjectTypeIndexer = alias("objectTypeIndexer");
	  uppercase.ObjectTypeProperty = alias("objectTypeProperty");
	  uppercase.ObjectTypeSpreadProperty = alias("objectTypeSpreadProperty");
	  uppercase.OpaqueType = alias("opaqueType");
	  uppercase.QualifiedTypeIdentifier = alias("qualifiedTypeIdentifier");
	  uppercase.StringLiteralTypeAnnotation = alias("stringLiteralTypeAnnotation");
	  uppercase.StringTypeAnnotation = alias("stringTypeAnnotation");
	  uppercase.SymbolTypeAnnotation = alias("symbolTypeAnnotation");
	  uppercase.ThisTypeAnnotation = alias("thisTypeAnnotation");
	  uppercase.TupleTypeAnnotation = alias("tupleTypeAnnotation");
	  uppercase.TypeofTypeAnnotation = alias("typeofTypeAnnotation");
	  uppercase.TypeAlias = alias("typeAlias");
	  uppercase.TypeAnnotation = alias("typeAnnotation");
	  uppercase.TypeCastExpression = alias("typeCastExpression");
	  uppercase.TypeParameter = alias("typeParameter");
	  uppercase.TypeParameterDeclaration = alias("typeParameterDeclaration");
	  uppercase.TypeParameterInstantiation = alias("typeParameterInstantiation");
	  uppercase.UnionTypeAnnotation = alias("unionTypeAnnotation");
	  uppercase.Variance = alias("variance");
	  uppercase.VoidTypeAnnotation = alias("voidTypeAnnotation");
	  uppercase.EnumDeclaration = alias("enumDeclaration");
	  uppercase.EnumBooleanBody = alias("enumBooleanBody");
	  uppercase.EnumNumberBody = alias("enumNumberBody");
	  uppercase.EnumStringBody = alias("enumStringBody");
	  uppercase.EnumSymbolBody = alias("enumSymbolBody");
	  uppercase.EnumBooleanMember = alias("enumBooleanMember");
	  uppercase.EnumNumberMember = alias("enumNumberMember");
	  uppercase.EnumStringMember = alias("enumStringMember");
	  uppercase.EnumDefaultedMember = alias("enumDefaultedMember");
	  uppercase.IndexedAccessType = alias("indexedAccessType");
	  uppercase.OptionalIndexedAccessType = alias("optionalIndexedAccessType");
	  uppercase.JSXAttribute = alias("jsxAttribute");
	  uppercase.JSXClosingElement = alias("jsxClosingElement");
	  uppercase.JSXElement = alias("jsxElement");
	  uppercase.JSXEmptyExpression = alias("jsxEmptyExpression");
	  uppercase.JSXExpressionContainer = alias("jsxExpressionContainer");
	  uppercase.JSXSpreadChild = alias("jsxSpreadChild");
	  uppercase.JSXIdentifier = alias("jsxIdentifier");
	  uppercase.JSXMemberExpression = alias("jsxMemberExpression");
	  uppercase.JSXNamespacedName = alias("jsxNamespacedName");
	  uppercase.JSXOpeningElement = alias("jsxOpeningElement");
	  uppercase.JSXSpreadAttribute = alias("jsxSpreadAttribute");
	  uppercase.JSXText = alias("jsxText");
	  uppercase.JSXFragment = alias("jsxFragment");
	  uppercase.JSXOpeningFragment = alias("jsxOpeningFragment");
	  uppercase.JSXClosingFragment = alias("jsxClosingFragment");
	  uppercase.Noop = alias("noop");
	  uppercase.Placeholder = alias("placeholder");
	  uppercase.V8IntrinsicIdentifier = alias("v8IntrinsicIdentifier");
	  uppercase.ArgumentPlaceholder = alias("argumentPlaceholder");
	  uppercase.BindExpression = alias("bindExpression");
	  uppercase.Decorator = alias("decorator");
	  uppercase.DoExpression = alias("doExpression");
	  uppercase.ExportDefaultSpecifier = alias("exportDefaultSpecifier");
	  uppercase.RecordExpression = alias("recordExpression");
	  uppercase.TupleExpression = alias("tupleExpression");
	  uppercase.DecimalLiteral = alias("decimalLiteral");
	  uppercase.ModuleExpression = alias("moduleExpression");
	  uppercase.TopicReference = alias("topicReference");
	  uppercase.PipelineTopicExpression = alias("pipelineTopicExpression");
	  uppercase.PipelineBareFunction = alias("pipelineBareFunction");
	  uppercase.PipelinePrimaryTopicReference = alias("pipelinePrimaryTopicReference");
	  uppercase.VoidPattern = alias("voidPattern");
	  uppercase.TSParameterProperty = alias("tsParameterProperty");
	  uppercase.TSDeclareFunction = alias("tsDeclareFunction");
	  uppercase.TSDeclareMethod = alias("tsDeclareMethod");
	  uppercase.TSQualifiedName = alias("tsQualifiedName");
	  uppercase.TSCallSignatureDeclaration = alias("tsCallSignatureDeclaration");
	  uppercase.TSConstructSignatureDeclaration = alias("tsConstructSignatureDeclaration");
	  uppercase.TSPropertySignature = alias("tsPropertySignature");
	  uppercase.TSMethodSignature = alias("tsMethodSignature");
	  uppercase.TSIndexSignature = alias("tsIndexSignature");
	  uppercase.TSAnyKeyword = alias("tsAnyKeyword");
	  uppercase.TSBooleanKeyword = alias("tsBooleanKeyword");
	  uppercase.TSBigIntKeyword = alias("tsBigIntKeyword");
	  uppercase.TSIntrinsicKeyword = alias("tsIntrinsicKeyword");
	  uppercase.TSNeverKeyword = alias("tsNeverKeyword");
	  uppercase.TSNullKeyword = alias("tsNullKeyword");
	  uppercase.TSNumberKeyword = alias("tsNumberKeyword");
	  uppercase.TSObjectKeyword = alias("tsObjectKeyword");
	  uppercase.TSStringKeyword = alias("tsStringKeyword");
	  uppercase.TSSymbolKeyword = alias("tsSymbolKeyword");
	  uppercase.TSUndefinedKeyword = alias("tsUndefinedKeyword");
	  uppercase.TSUnknownKeyword = alias("tsUnknownKeyword");
	  uppercase.TSVoidKeyword = alias("tsVoidKeyword");
	  uppercase.TSThisType = alias("tsThisType");
	  uppercase.TSFunctionType = alias("tsFunctionType");
	  uppercase.TSConstructorType = alias("tsConstructorType");
	  uppercase.TSTypeReference = alias("tsTypeReference");
	  uppercase.TSTypePredicate = alias("tsTypePredicate");
	  uppercase.TSTypeQuery = alias("tsTypeQuery");
	  uppercase.TSTypeLiteral = alias("tsTypeLiteral");
	  uppercase.TSArrayType = alias("tsArrayType");
	  uppercase.TSTupleType = alias("tsTupleType");
	  uppercase.TSOptionalType = alias("tsOptionalType");
	  uppercase.TSRestType = alias("tsRestType");
	  uppercase.TSNamedTupleMember = alias("tsNamedTupleMember");
	  uppercase.TSUnionType = alias("tsUnionType");
	  uppercase.TSIntersectionType = alias("tsIntersectionType");
	  uppercase.TSConditionalType = alias("tsConditionalType");
	  uppercase.TSInferType = alias("tsInferType");
	  uppercase.TSParenthesizedType = alias("tsParenthesizedType");
	  uppercase.TSTypeOperator = alias("tsTypeOperator");
	  uppercase.TSIndexedAccessType = alias("tsIndexedAccessType");
	  uppercase.TSMappedType = alias("tsMappedType");
	  uppercase.TSTemplateLiteralType = alias("tsTemplateLiteralType");
	  uppercase.TSLiteralType = alias("tsLiteralType");
	  uppercase.TSExpressionWithTypeArguments = alias("tsExpressionWithTypeArguments");
	  uppercase.TSInterfaceDeclaration = alias("tsInterfaceDeclaration");
	  uppercase.TSInterfaceBody = alias("tsInterfaceBody");
	  uppercase.TSTypeAliasDeclaration = alias("tsTypeAliasDeclaration");
	  uppercase.TSInstantiationExpression = alias("tsInstantiationExpression");
	  uppercase.TSAsExpression = alias("tsAsExpression");
	  uppercase.TSSatisfiesExpression = alias("tsSatisfiesExpression");
	  uppercase.TSTypeAssertion = alias("tsTypeAssertion");
	  uppercase.TSEnumBody = alias("tsEnumBody");
	  uppercase.TSEnumDeclaration = alias("tsEnumDeclaration");
	  uppercase.TSEnumMember = alias("tsEnumMember");
	  uppercase.TSModuleDeclaration = alias("tsModuleDeclaration");
	  uppercase.TSModuleBlock = alias("tsModuleBlock");
	  uppercase.TSImportType = alias("tsImportType");
	  uppercase.TSImportEqualsDeclaration = alias("tsImportEqualsDeclaration");
	  uppercase.TSExternalModuleReference = alias("tsExternalModuleReference");
	  uppercase.TSNonNullExpression = alias("tsNonNullExpression");
	  uppercase.TSExportAssignment = alias("tsExportAssignment");
	  uppercase.TSNamespaceExportDeclaration = alias("tsNamespaceExportDeclaration");
	  uppercase.TSTypeAnnotation = alias("tsTypeAnnotation");
	  uppercase.TSTypeParameterInstantiation = alias("tsTypeParameterInstantiation");
	  uppercase.TSTypeParameterDeclaration = alias("tsTypeParameterDeclaration");
	  uppercase.TSTypeParameter = alias("tsTypeParameter");
	uppercase.NumberLiteral = b.numberLiteral;
	  uppercase.RegexLiteral = b.regexLiteral;
	  uppercase.RestProperty = b.restProperty;
	  uppercase.SpreadProperty = b.spreadProperty;

	
	return uppercase;
}

var hasRequiredGenerated$2;

function requireGenerated$2 () {
	if (hasRequiredGenerated$2) return generated$2;
	hasRequiredGenerated$2 = 1;
	(function (exports$1) {

		Object.defineProperty(exports$1, "__esModule", {
		  value: true
		});
		var _lowercase = requireLowercase();
		Object.keys(_lowercase).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (key in exports$1 && exports$1[key] === _lowercase[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _lowercase[key];
		    }
		  });
		});
		var _uppercase = requireUppercase();
		Object.keys(_uppercase).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (key in exports$1 && exports$1[key] === _uppercase[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _uppercase[key];
		    }
		  });
		});

		
	} (generated$2));
	return generated$2;
}

var hasRequiredCleanJSXElementLiteralChild;

function requireCleanJSXElementLiteralChild () {
	if (hasRequiredCleanJSXElementLiteralChild) return cleanJSXElementLiteralChild;
	hasRequiredCleanJSXElementLiteralChild = 1;

	Object.defineProperty(cleanJSXElementLiteralChild, "__esModule", {
	  value: true
	});
	cleanJSXElementLiteralChild.default = cleanJSXElementLiteralChild$1;
	var _index = requireGenerated$2();
	var _index2 = requireLib$1();
	function cleanJSXElementLiteralChild$1(child, args) {
	  const lines = child.value.split(/\r\n|\n|\r/);
	  let lastNonEmptyLine = 0;
	  for (let i = 0; i < lines.length; i++) {
	    if (/[^ \t]/.exec(lines[i])) {
	      lastNonEmptyLine = i;
	    }
	  }
	  let str = "";
	  for (let i = 0; i < lines.length; i++) {
	    const line = lines[i];
	    const isFirstLine = i === 0;
	    const isLastLine = i === lines.length - 1;
	    const isLastNonEmptyLine = i === lastNonEmptyLine;
	    let trimmedLine = line.replace(/\t/g, " ");
	    if (!isFirstLine) {
	      trimmedLine = trimmedLine.replace(/^ +/, "");
	    }
	    if (!isLastLine) {
	      trimmedLine = trimmedLine.replace(/ +$/, "");
	    }
	    if (trimmedLine) {
	      if (!isLastNonEmptyLine) {
	        trimmedLine += " ";
	      }
	      str += trimmedLine;
	    }
	  }
	  if (str) args.push((0, _index2.inherits)((0, _index.stringLiteral)(str), child));
	}

	
	return cleanJSXElementLiteralChild;
}

var hasRequiredBuildChildren;

function requireBuildChildren () {
	if (hasRequiredBuildChildren) return buildChildren;
	hasRequiredBuildChildren = 1;

	Object.defineProperty(buildChildren, "__esModule", {
	  value: true
	});
	buildChildren.default = buildChildren$1;
	var _index = requireGenerated$3();
	var _cleanJSXElementLiteralChild = requireCleanJSXElementLiteralChild();
	function buildChildren$1(node) {
	  const elements = [];
	  for (let i = 0; i < node.children.length; i++) {
	    let child = node.children[i];
	    if ((0, _index.isJSXText)(child)) {
	      (0, _cleanJSXElementLiteralChild.default)(child, elements);
	      continue;
	    }
	    if ((0, _index.isJSXExpressionContainer)(child)) child = child.expression;
	    if ((0, _index.isJSXEmptyExpression)(child)) continue;
	    elements.push(child);
	  }
	  return elements;
	}

	
	return buildChildren;
}

var assertNode = {};

var isNode = {};

var hasRequiredIsNode;

function requireIsNode () {
	if (hasRequiredIsNode) return isNode;
	hasRequiredIsNode = 1;

	Object.defineProperty(isNode, "__esModule", {
	  value: true
	});
	isNode.default = isNode$1;
	var _index = requireDefinitions();
	function isNode$1(node) {
	  return !!(node && _index.VISITOR_KEYS[node.type]);
	}

	
	return isNode;
}

var hasRequiredAssertNode;

function requireAssertNode () {
	if (hasRequiredAssertNode) return assertNode;
	hasRequiredAssertNode = 1;

	Object.defineProperty(assertNode, "__esModule", {
	  value: true
	});
	assertNode.default = assertNode$1;
	var _isNode = requireIsNode();
	function assertNode$1(node) {
	  if (!(0, _isNode.default)(node)) {
	    var _node$type;
	    const type = (_node$type = node == null ? void 0 : node.type) != null ? _node$type : JSON.stringify(node);
	    throw new TypeError(`Not a valid node of type "${type}"`);
	  }
	}

	
	return assertNode;
}

var generated$1 = {};

var hasRequiredGenerated$1;

function requireGenerated$1 () {
	if (hasRequiredGenerated$1) return generated$1;
	hasRequiredGenerated$1 = 1;

	Object.defineProperty(generated$1, "__esModule", {
	  value: true
	});
	generated$1.assertAccessor = assertAccessor;
	generated$1.assertAnyTypeAnnotation = assertAnyTypeAnnotation;
	generated$1.assertArgumentPlaceholder = assertArgumentPlaceholder;
	generated$1.assertArrayExpression = assertArrayExpression;
	generated$1.assertArrayPattern = assertArrayPattern;
	generated$1.assertArrayTypeAnnotation = assertArrayTypeAnnotation;
	generated$1.assertArrowFunctionExpression = assertArrowFunctionExpression;
	generated$1.assertAssignmentExpression = assertAssignmentExpression;
	generated$1.assertAssignmentPattern = assertAssignmentPattern;
	generated$1.assertAwaitExpression = assertAwaitExpression;
	generated$1.assertBigIntLiteral = assertBigIntLiteral;
	generated$1.assertBinary = assertBinary;
	generated$1.assertBinaryExpression = assertBinaryExpression;
	generated$1.assertBindExpression = assertBindExpression;
	generated$1.assertBlock = assertBlock;
	generated$1.assertBlockParent = assertBlockParent;
	generated$1.assertBlockStatement = assertBlockStatement;
	generated$1.assertBooleanLiteral = assertBooleanLiteral;
	generated$1.assertBooleanLiteralTypeAnnotation = assertBooleanLiteralTypeAnnotation;
	generated$1.assertBooleanTypeAnnotation = assertBooleanTypeAnnotation;
	generated$1.assertBreakStatement = assertBreakStatement;
	generated$1.assertCallExpression = assertCallExpression;
	generated$1.assertCatchClause = assertCatchClause;
	generated$1.assertClass = assertClass;
	generated$1.assertClassAccessorProperty = assertClassAccessorProperty;
	generated$1.assertClassBody = assertClassBody;
	generated$1.assertClassDeclaration = assertClassDeclaration;
	generated$1.assertClassExpression = assertClassExpression;
	generated$1.assertClassImplements = assertClassImplements;
	generated$1.assertClassMethod = assertClassMethod;
	generated$1.assertClassPrivateMethod = assertClassPrivateMethod;
	generated$1.assertClassPrivateProperty = assertClassPrivateProperty;
	generated$1.assertClassProperty = assertClassProperty;
	generated$1.assertCompletionStatement = assertCompletionStatement;
	generated$1.assertConditional = assertConditional;
	generated$1.assertConditionalExpression = assertConditionalExpression;
	generated$1.assertContinueStatement = assertContinueStatement;
	generated$1.assertDebuggerStatement = assertDebuggerStatement;
	generated$1.assertDecimalLiteral = assertDecimalLiteral;
	generated$1.assertDeclaration = assertDeclaration;
	generated$1.assertDeclareClass = assertDeclareClass;
	generated$1.assertDeclareExportAllDeclaration = assertDeclareExportAllDeclaration;
	generated$1.assertDeclareExportDeclaration = assertDeclareExportDeclaration;
	generated$1.assertDeclareFunction = assertDeclareFunction;
	generated$1.assertDeclareInterface = assertDeclareInterface;
	generated$1.assertDeclareModule = assertDeclareModule;
	generated$1.assertDeclareModuleExports = assertDeclareModuleExports;
	generated$1.assertDeclareOpaqueType = assertDeclareOpaqueType;
	generated$1.assertDeclareTypeAlias = assertDeclareTypeAlias;
	generated$1.assertDeclareVariable = assertDeclareVariable;
	generated$1.assertDeclaredPredicate = assertDeclaredPredicate;
	generated$1.assertDecorator = assertDecorator;
	generated$1.assertDirective = assertDirective;
	generated$1.assertDirectiveLiteral = assertDirectiveLiteral;
	generated$1.assertDoExpression = assertDoExpression;
	generated$1.assertDoWhileStatement = assertDoWhileStatement;
	generated$1.assertEmptyStatement = assertEmptyStatement;
	generated$1.assertEmptyTypeAnnotation = assertEmptyTypeAnnotation;
	generated$1.assertEnumBody = assertEnumBody;
	generated$1.assertEnumBooleanBody = assertEnumBooleanBody;
	generated$1.assertEnumBooleanMember = assertEnumBooleanMember;
	generated$1.assertEnumDeclaration = assertEnumDeclaration;
	generated$1.assertEnumDefaultedMember = assertEnumDefaultedMember;
	generated$1.assertEnumMember = assertEnumMember;
	generated$1.assertEnumNumberBody = assertEnumNumberBody;
	generated$1.assertEnumNumberMember = assertEnumNumberMember;
	generated$1.assertEnumStringBody = assertEnumStringBody;
	generated$1.assertEnumStringMember = assertEnumStringMember;
	generated$1.assertEnumSymbolBody = assertEnumSymbolBody;
	generated$1.assertExistsTypeAnnotation = assertExistsTypeAnnotation;
	generated$1.assertExportAllDeclaration = assertExportAllDeclaration;
	generated$1.assertExportDeclaration = assertExportDeclaration;
	generated$1.assertExportDefaultDeclaration = assertExportDefaultDeclaration;
	generated$1.assertExportDefaultSpecifier = assertExportDefaultSpecifier;
	generated$1.assertExportNamedDeclaration = assertExportNamedDeclaration;
	generated$1.assertExportNamespaceSpecifier = assertExportNamespaceSpecifier;
	generated$1.assertExportSpecifier = assertExportSpecifier;
	generated$1.assertExpression = assertExpression;
	generated$1.assertExpressionStatement = assertExpressionStatement;
	generated$1.assertExpressionWrapper = assertExpressionWrapper;
	generated$1.assertFile = assertFile;
	generated$1.assertFlow = assertFlow;
	generated$1.assertFlowBaseAnnotation = assertFlowBaseAnnotation;
	generated$1.assertFlowDeclaration = assertFlowDeclaration;
	generated$1.assertFlowPredicate = assertFlowPredicate;
	generated$1.assertFlowType = assertFlowType;
	generated$1.assertFor = assertFor;
	generated$1.assertForInStatement = assertForInStatement;
	generated$1.assertForOfStatement = assertForOfStatement;
	generated$1.assertForStatement = assertForStatement;
	generated$1.assertForXStatement = assertForXStatement;
	generated$1.assertFunction = assertFunction;
	generated$1.assertFunctionDeclaration = assertFunctionDeclaration;
	generated$1.assertFunctionExpression = assertFunctionExpression;
	generated$1.assertFunctionParameter = assertFunctionParameter;
	generated$1.assertFunctionParent = assertFunctionParent;
	generated$1.assertFunctionTypeAnnotation = assertFunctionTypeAnnotation;
	generated$1.assertFunctionTypeParam = assertFunctionTypeParam;
	generated$1.assertGenericTypeAnnotation = assertGenericTypeAnnotation;
	generated$1.assertIdentifier = assertIdentifier;
	generated$1.assertIfStatement = assertIfStatement;
	generated$1.assertImmutable = assertImmutable;
	generated$1.assertImport = assertImport;
	generated$1.assertImportAttribute = assertImportAttribute;
	generated$1.assertImportDeclaration = assertImportDeclaration;
	generated$1.assertImportDefaultSpecifier = assertImportDefaultSpecifier;
	generated$1.assertImportExpression = assertImportExpression;
	generated$1.assertImportNamespaceSpecifier = assertImportNamespaceSpecifier;
	generated$1.assertImportOrExportDeclaration = assertImportOrExportDeclaration;
	generated$1.assertImportSpecifier = assertImportSpecifier;
	generated$1.assertIndexedAccessType = assertIndexedAccessType;
	generated$1.assertInferredPredicate = assertInferredPredicate;
	generated$1.assertInterfaceDeclaration = assertInterfaceDeclaration;
	generated$1.assertInterfaceExtends = assertInterfaceExtends;
	generated$1.assertInterfaceTypeAnnotation = assertInterfaceTypeAnnotation;
	generated$1.assertInterpreterDirective = assertInterpreterDirective;
	generated$1.assertIntersectionTypeAnnotation = assertIntersectionTypeAnnotation;
	generated$1.assertJSX = assertJSX;
	generated$1.assertJSXAttribute = assertJSXAttribute;
	generated$1.assertJSXClosingElement = assertJSXClosingElement;
	generated$1.assertJSXClosingFragment = assertJSXClosingFragment;
	generated$1.assertJSXElement = assertJSXElement;
	generated$1.assertJSXEmptyExpression = assertJSXEmptyExpression;
	generated$1.assertJSXExpressionContainer = assertJSXExpressionContainer;
	generated$1.assertJSXFragment = assertJSXFragment;
	generated$1.assertJSXIdentifier = assertJSXIdentifier;
	generated$1.assertJSXMemberExpression = assertJSXMemberExpression;
	generated$1.assertJSXNamespacedName = assertJSXNamespacedName;
	generated$1.assertJSXOpeningElement = assertJSXOpeningElement;
	generated$1.assertJSXOpeningFragment = assertJSXOpeningFragment;
	generated$1.assertJSXSpreadAttribute = assertJSXSpreadAttribute;
	generated$1.assertJSXSpreadChild = assertJSXSpreadChild;
	generated$1.assertJSXText = assertJSXText;
	generated$1.assertLVal = assertLVal;
	generated$1.assertLabeledStatement = assertLabeledStatement;
	generated$1.assertLiteral = assertLiteral;
	generated$1.assertLogicalExpression = assertLogicalExpression;
	generated$1.assertLoop = assertLoop;
	generated$1.assertMemberExpression = assertMemberExpression;
	generated$1.assertMetaProperty = assertMetaProperty;
	generated$1.assertMethod = assertMethod;
	generated$1.assertMiscellaneous = assertMiscellaneous;
	generated$1.assertMixedTypeAnnotation = assertMixedTypeAnnotation;
	generated$1.assertModuleDeclaration = assertModuleDeclaration;
	generated$1.assertModuleExpression = assertModuleExpression;
	generated$1.assertModuleSpecifier = assertModuleSpecifier;
	generated$1.assertNewExpression = assertNewExpression;
	generated$1.assertNoop = assertNoop;
	generated$1.assertNullLiteral = assertNullLiteral;
	generated$1.assertNullLiteralTypeAnnotation = assertNullLiteralTypeAnnotation;
	generated$1.assertNullableTypeAnnotation = assertNullableTypeAnnotation;
	generated$1.assertNumberLiteral = assertNumberLiteral;
	generated$1.assertNumberLiteralTypeAnnotation = assertNumberLiteralTypeAnnotation;
	generated$1.assertNumberTypeAnnotation = assertNumberTypeAnnotation;
	generated$1.assertNumericLiteral = assertNumericLiteral;
	generated$1.assertObjectExpression = assertObjectExpression;
	generated$1.assertObjectMember = assertObjectMember;
	generated$1.assertObjectMethod = assertObjectMethod;
	generated$1.assertObjectPattern = assertObjectPattern;
	generated$1.assertObjectProperty = assertObjectProperty;
	generated$1.assertObjectTypeAnnotation = assertObjectTypeAnnotation;
	generated$1.assertObjectTypeCallProperty = assertObjectTypeCallProperty;
	generated$1.assertObjectTypeIndexer = assertObjectTypeIndexer;
	generated$1.assertObjectTypeInternalSlot = assertObjectTypeInternalSlot;
	generated$1.assertObjectTypeProperty = assertObjectTypeProperty;
	generated$1.assertObjectTypeSpreadProperty = assertObjectTypeSpreadProperty;
	generated$1.assertOpaqueType = assertOpaqueType;
	generated$1.assertOptionalCallExpression = assertOptionalCallExpression;
	generated$1.assertOptionalIndexedAccessType = assertOptionalIndexedAccessType;
	generated$1.assertOptionalMemberExpression = assertOptionalMemberExpression;
	generated$1.assertParenthesizedExpression = assertParenthesizedExpression;
	generated$1.assertPattern = assertPattern;
	generated$1.assertPatternLike = assertPatternLike;
	generated$1.assertPipelineBareFunction = assertPipelineBareFunction;
	generated$1.assertPipelinePrimaryTopicReference = assertPipelinePrimaryTopicReference;
	generated$1.assertPipelineTopicExpression = assertPipelineTopicExpression;
	generated$1.assertPlaceholder = assertPlaceholder;
	generated$1.assertPrivate = assertPrivate;
	generated$1.assertPrivateName = assertPrivateName;
	generated$1.assertProgram = assertProgram;
	generated$1.assertProperty = assertProperty;
	generated$1.assertPureish = assertPureish;
	generated$1.assertQualifiedTypeIdentifier = assertQualifiedTypeIdentifier;
	generated$1.assertRecordExpression = assertRecordExpression;
	generated$1.assertRegExpLiteral = assertRegExpLiteral;
	generated$1.assertRegexLiteral = assertRegexLiteral;
	generated$1.assertRestElement = assertRestElement;
	generated$1.assertRestProperty = assertRestProperty;
	generated$1.assertReturnStatement = assertReturnStatement;
	generated$1.assertScopable = assertScopable;
	generated$1.assertSequenceExpression = assertSequenceExpression;
	generated$1.assertSpreadElement = assertSpreadElement;
	generated$1.assertSpreadProperty = assertSpreadProperty;
	generated$1.assertStandardized = assertStandardized;
	generated$1.assertStatement = assertStatement;
	generated$1.assertStaticBlock = assertStaticBlock;
	generated$1.assertStringLiteral = assertStringLiteral;
	generated$1.assertStringLiteralTypeAnnotation = assertStringLiteralTypeAnnotation;
	generated$1.assertStringTypeAnnotation = assertStringTypeAnnotation;
	generated$1.assertSuper = assertSuper;
	generated$1.assertSwitchCase = assertSwitchCase;
	generated$1.assertSwitchStatement = assertSwitchStatement;
	generated$1.assertSymbolTypeAnnotation = assertSymbolTypeAnnotation;
	generated$1.assertTSAnyKeyword = assertTSAnyKeyword;
	generated$1.assertTSArrayType = assertTSArrayType;
	generated$1.assertTSAsExpression = assertTSAsExpression;
	generated$1.assertTSBaseType = assertTSBaseType;
	generated$1.assertTSBigIntKeyword = assertTSBigIntKeyword;
	generated$1.assertTSBooleanKeyword = assertTSBooleanKeyword;
	generated$1.assertTSCallSignatureDeclaration = assertTSCallSignatureDeclaration;
	generated$1.assertTSConditionalType = assertTSConditionalType;
	generated$1.assertTSConstructSignatureDeclaration = assertTSConstructSignatureDeclaration;
	generated$1.assertTSConstructorType = assertTSConstructorType;
	generated$1.assertTSDeclareFunction = assertTSDeclareFunction;
	generated$1.assertTSDeclareMethod = assertTSDeclareMethod;
	generated$1.assertTSEntityName = assertTSEntityName;
	generated$1.assertTSEnumBody = assertTSEnumBody;
	generated$1.assertTSEnumDeclaration = assertTSEnumDeclaration;
	generated$1.assertTSEnumMember = assertTSEnumMember;
	generated$1.assertTSExportAssignment = assertTSExportAssignment;
	generated$1.assertTSExpressionWithTypeArguments = assertTSExpressionWithTypeArguments;
	generated$1.assertTSExternalModuleReference = assertTSExternalModuleReference;
	generated$1.assertTSFunctionType = assertTSFunctionType;
	generated$1.assertTSImportEqualsDeclaration = assertTSImportEqualsDeclaration;
	generated$1.assertTSImportType = assertTSImportType;
	generated$1.assertTSIndexSignature = assertTSIndexSignature;
	generated$1.assertTSIndexedAccessType = assertTSIndexedAccessType;
	generated$1.assertTSInferType = assertTSInferType;
	generated$1.assertTSInstantiationExpression = assertTSInstantiationExpression;
	generated$1.assertTSInterfaceBody = assertTSInterfaceBody;
	generated$1.assertTSInterfaceDeclaration = assertTSInterfaceDeclaration;
	generated$1.assertTSIntersectionType = assertTSIntersectionType;
	generated$1.assertTSIntrinsicKeyword = assertTSIntrinsicKeyword;
	generated$1.assertTSLiteralType = assertTSLiteralType;
	generated$1.assertTSMappedType = assertTSMappedType;
	generated$1.assertTSMethodSignature = assertTSMethodSignature;
	generated$1.assertTSModuleBlock = assertTSModuleBlock;
	generated$1.assertTSModuleDeclaration = assertTSModuleDeclaration;
	generated$1.assertTSNamedTupleMember = assertTSNamedTupleMember;
	generated$1.assertTSNamespaceExportDeclaration = assertTSNamespaceExportDeclaration;
	generated$1.assertTSNeverKeyword = assertTSNeverKeyword;
	generated$1.assertTSNonNullExpression = assertTSNonNullExpression;
	generated$1.assertTSNullKeyword = assertTSNullKeyword;
	generated$1.assertTSNumberKeyword = assertTSNumberKeyword;
	generated$1.assertTSObjectKeyword = assertTSObjectKeyword;
	generated$1.assertTSOptionalType = assertTSOptionalType;
	generated$1.assertTSParameterProperty = assertTSParameterProperty;
	generated$1.assertTSParenthesizedType = assertTSParenthesizedType;
	generated$1.assertTSPropertySignature = assertTSPropertySignature;
	generated$1.assertTSQualifiedName = assertTSQualifiedName;
	generated$1.assertTSRestType = assertTSRestType;
	generated$1.assertTSSatisfiesExpression = assertTSSatisfiesExpression;
	generated$1.assertTSStringKeyword = assertTSStringKeyword;
	generated$1.assertTSSymbolKeyword = assertTSSymbolKeyword;
	generated$1.assertTSTemplateLiteralType = assertTSTemplateLiteralType;
	generated$1.assertTSThisType = assertTSThisType;
	generated$1.assertTSTupleType = assertTSTupleType;
	generated$1.assertTSType = assertTSType;
	generated$1.assertTSTypeAliasDeclaration = assertTSTypeAliasDeclaration;
	generated$1.assertTSTypeAnnotation = assertTSTypeAnnotation;
	generated$1.assertTSTypeAssertion = assertTSTypeAssertion;
	generated$1.assertTSTypeElement = assertTSTypeElement;
	generated$1.assertTSTypeLiteral = assertTSTypeLiteral;
	generated$1.assertTSTypeOperator = assertTSTypeOperator;
	generated$1.assertTSTypeParameter = assertTSTypeParameter;
	generated$1.assertTSTypeParameterDeclaration = assertTSTypeParameterDeclaration;
	generated$1.assertTSTypeParameterInstantiation = assertTSTypeParameterInstantiation;
	generated$1.assertTSTypePredicate = assertTSTypePredicate;
	generated$1.assertTSTypeQuery = assertTSTypeQuery;
	generated$1.assertTSTypeReference = assertTSTypeReference;
	generated$1.assertTSUndefinedKeyword = assertTSUndefinedKeyword;
	generated$1.assertTSUnionType = assertTSUnionType;
	generated$1.assertTSUnknownKeyword = assertTSUnknownKeyword;
	generated$1.assertTSVoidKeyword = assertTSVoidKeyword;
	generated$1.assertTaggedTemplateExpression = assertTaggedTemplateExpression;
	generated$1.assertTemplateElement = assertTemplateElement;
	generated$1.assertTemplateLiteral = assertTemplateLiteral;
	generated$1.assertTerminatorless = assertTerminatorless;
	generated$1.assertThisExpression = assertThisExpression;
	generated$1.assertThisTypeAnnotation = assertThisTypeAnnotation;
	generated$1.assertThrowStatement = assertThrowStatement;
	generated$1.assertTopicReference = assertTopicReference;
	generated$1.assertTryStatement = assertTryStatement;
	generated$1.assertTupleExpression = assertTupleExpression;
	generated$1.assertTupleTypeAnnotation = assertTupleTypeAnnotation;
	generated$1.assertTypeAlias = assertTypeAlias;
	generated$1.assertTypeAnnotation = assertTypeAnnotation;
	generated$1.assertTypeCastExpression = assertTypeCastExpression;
	generated$1.assertTypeParameter = assertTypeParameter;
	generated$1.assertTypeParameterDeclaration = assertTypeParameterDeclaration;
	generated$1.assertTypeParameterInstantiation = assertTypeParameterInstantiation;
	generated$1.assertTypeScript = assertTypeScript;
	generated$1.assertTypeofTypeAnnotation = assertTypeofTypeAnnotation;
	generated$1.assertUnaryExpression = assertUnaryExpression;
	generated$1.assertUnaryLike = assertUnaryLike;
	generated$1.assertUnionTypeAnnotation = assertUnionTypeAnnotation;
	generated$1.assertUpdateExpression = assertUpdateExpression;
	generated$1.assertUserWhitespacable = assertUserWhitespacable;
	generated$1.assertV8IntrinsicIdentifier = assertV8IntrinsicIdentifier;
	generated$1.assertVariableDeclaration = assertVariableDeclaration;
	generated$1.assertVariableDeclarator = assertVariableDeclarator;
	generated$1.assertVariance = assertVariance;
	generated$1.assertVoidPattern = assertVoidPattern;
	generated$1.assertVoidTypeAnnotation = assertVoidTypeAnnotation;
	generated$1.assertWhile = assertWhile;
	generated$1.assertWhileStatement = assertWhileStatement;
	generated$1.assertWithStatement = assertWithStatement;
	generated$1.assertYieldExpression = assertYieldExpression;
	var _is = requireIs();
	var _deprecationWarning = requireDeprecationWarning();
	function assert(type, node, opts) {
	  if (!(0, _is.default)(type, node, opts)) {
	    throw new Error(`Expected type "${type}" with option ${JSON.stringify(opts)}, ` + `but instead got "${node.type}".`);
	  }
	}
	function assertArrayExpression(node, opts) {
	  assert("ArrayExpression", node, opts);
	}
	function assertAssignmentExpression(node, opts) {
	  assert("AssignmentExpression", node, opts);
	}
	function assertBinaryExpression(node, opts) {
	  assert("BinaryExpression", node, opts);
	}
	function assertInterpreterDirective(node, opts) {
	  assert("InterpreterDirective", node, opts);
	}
	function assertDirective(node, opts) {
	  assert("Directive", node, opts);
	}
	function assertDirectiveLiteral(node, opts) {
	  assert("DirectiveLiteral", node, opts);
	}
	function assertBlockStatement(node, opts) {
	  assert("BlockStatement", node, opts);
	}
	function assertBreakStatement(node, opts) {
	  assert("BreakStatement", node, opts);
	}
	function assertCallExpression(node, opts) {
	  assert("CallExpression", node, opts);
	}
	function assertCatchClause(node, opts) {
	  assert("CatchClause", node, opts);
	}
	function assertConditionalExpression(node, opts) {
	  assert("ConditionalExpression", node, opts);
	}
	function assertContinueStatement(node, opts) {
	  assert("ContinueStatement", node, opts);
	}
	function assertDebuggerStatement(node, opts) {
	  assert("DebuggerStatement", node, opts);
	}
	function assertDoWhileStatement(node, opts) {
	  assert("DoWhileStatement", node, opts);
	}
	function assertEmptyStatement(node, opts) {
	  assert("EmptyStatement", node, opts);
	}
	function assertExpressionStatement(node, opts) {
	  assert("ExpressionStatement", node, opts);
	}
	function assertFile(node, opts) {
	  assert("File", node, opts);
	}
	function assertForInStatement(node, opts) {
	  assert("ForInStatement", node, opts);
	}
	function assertForStatement(node, opts) {
	  assert("ForStatement", node, opts);
	}
	function assertFunctionDeclaration(node, opts) {
	  assert("FunctionDeclaration", node, opts);
	}
	function assertFunctionExpression(node, opts) {
	  assert("FunctionExpression", node, opts);
	}
	function assertIdentifier(node, opts) {
	  assert("Identifier", node, opts);
	}
	function assertIfStatement(node, opts) {
	  assert("IfStatement", node, opts);
	}
	function assertLabeledStatement(node, opts) {
	  assert("LabeledStatement", node, opts);
	}
	function assertStringLiteral(node, opts) {
	  assert("StringLiteral", node, opts);
	}
	function assertNumericLiteral(node, opts) {
	  assert("NumericLiteral", node, opts);
	}
	function assertNullLiteral(node, opts) {
	  assert("NullLiteral", node, opts);
	}
	function assertBooleanLiteral(node, opts) {
	  assert("BooleanLiteral", node, opts);
	}
	function assertRegExpLiteral(node, opts) {
	  assert("RegExpLiteral", node, opts);
	}
	function assertLogicalExpression(node, opts) {
	  assert("LogicalExpression", node, opts);
	}
	function assertMemberExpression(node, opts) {
	  assert("MemberExpression", node, opts);
	}
	function assertNewExpression(node, opts) {
	  assert("NewExpression", node, opts);
	}
	function assertProgram(node, opts) {
	  assert("Program", node, opts);
	}
	function assertObjectExpression(node, opts) {
	  assert("ObjectExpression", node, opts);
	}
	function assertObjectMethod(node, opts) {
	  assert("ObjectMethod", node, opts);
	}
	function assertObjectProperty(node, opts) {
	  assert("ObjectProperty", node, opts);
	}
	function assertRestElement(node, opts) {
	  assert("RestElement", node, opts);
	}
	function assertReturnStatement(node, opts) {
	  assert("ReturnStatement", node, opts);
	}
	function assertSequenceExpression(node, opts) {
	  assert("SequenceExpression", node, opts);
	}
	function assertParenthesizedExpression(node, opts) {
	  assert("ParenthesizedExpression", node, opts);
	}
	function assertSwitchCase(node, opts) {
	  assert("SwitchCase", node, opts);
	}
	function assertSwitchStatement(node, opts) {
	  assert("SwitchStatement", node, opts);
	}
	function assertThisExpression(node, opts) {
	  assert("ThisExpression", node, opts);
	}
	function assertThrowStatement(node, opts) {
	  assert("ThrowStatement", node, opts);
	}
	function assertTryStatement(node, opts) {
	  assert("TryStatement", node, opts);
	}
	function assertUnaryExpression(node, opts) {
	  assert("UnaryExpression", node, opts);
	}
	function assertUpdateExpression(node, opts) {
	  assert("UpdateExpression", node, opts);
	}
	function assertVariableDeclaration(node, opts) {
	  assert("VariableDeclaration", node, opts);
	}
	function assertVariableDeclarator(node, opts) {
	  assert("VariableDeclarator", node, opts);
	}
	function assertWhileStatement(node, opts) {
	  assert("WhileStatement", node, opts);
	}
	function assertWithStatement(node, opts) {
	  assert("WithStatement", node, opts);
	}
	function assertAssignmentPattern(node, opts) {
	  assert("AssignmentPattern", node, opts);
	}
	function assertArrayPattern(node, opts) {
	  assert("ArrayPattern", node, opts);
	}
	function assertArrowFunctionExpression(node, opts) {
	  assert("ArrowFunctionExpression", node, opts);
	}
	function assertClassBody(node, opts) {
	  assert("ClassBody", node, opts);
	}
	function assertClassExpression(node, opts) {
	  assert("ClassExpression", node, opts);
	}
	function assertClassDeclaration(node, opts) {
	  assert("ClassDeclaration", node, opts);
	}
	function assertExportAllDeclaration(node, opts) {
	  assert("ExportAllDeclaration", node, opts);
	}
	function assertExportDefaultDeclaration(node, opts) {
	  assert("ExportDefaultDeclaration", node, opts);
	}
	function assertExportNamedDeclaration(node, opts) {
	  assert("ExportNamedDeclaration", node, opts);
	}
	function assertExportSpecifier(node, opts) {
	  assert("ExportSpecifier", node, opts);
	}
	function assertForOfStatement(node, opts) {
	  assert("ForOfStatement", node, opts);
	}
	function assertImportDeclaration(node, opts) {
	  assert("ImportDeclaration", node, opts);
	}
	function assertImportDefaultSpecifier(node, opts) {
	  assert("ImportDefaultSpecifier", node, opts);
	}
	function assertImportNamespaceSpecifier(node, opts) {
	  assert("ImportNamespaceSpecifier", node, opts);
	}
	function assertImportSpecifier(node, opts) {
	  assert("ImportSpecifier", node, opts);
	}
	function assertImportExpression(node, opts) {
	  assert("ImportExpression", node, opts);
	}
	function assertMetaProperty(node, opts) {
	  assert("MetaProperty", node, opts);
	}
	function assertClassMethod(node, opts) {
	  assert("ClassMethod", node, opts);
	}
	function assertObjectPattern(node, opts) {
	  assert("ObjectPattern", node, opts);
	}
	function assertSpreadElement(node, opts) {
	  assert("SpreadElement", node, opts);
	}
	function assertSuper(node, opts) {
	  assert("Super", node, opts);
	}
	function assertTaggedTemplateExpression(node, opts) {
	  assert("TaggedTemplateExpression", node, opts);
	}
	function assertTemplateElement(node, opts) {
	  assert("TemplateElement", node, opts);
	}
	function assertTemplateLiteral(node, opts) {
	  assert("TemplateLiteral", node, opts);
	}
	function assertYieldExpression(node, opts) {
	  assert("YieldExpression", node, opts);
	}
	function assertAwaitExpression(node, opts) {
	  assert("AwaitExpression", node, opts);
	}
	function assertImport(node, opts) {
	  assert("Import", node, opts);
	}
	function assertBigIntLiteral(node, opts) {
	  assert("BigIntLiteral", node, opts);
	}
	function assertExportNamespaceSpecifier(node, opts) {
	  assert("ExportNamespaceSpecifier", node, opts);
	}
	function assertOptionalMemberExpression(node, opts) {
	  assert("OptionalMemberExpression", node, opts);
	}
	function assertOptionalCallExpression(node, opts) {
	  assert("OptionalCallExpression", node, opts);
	}
	function assertClassProperty(node, opts) {
	  assert("ClassProperty", node, opts);
	}
	function assertClassAccessorProperty(node, opts) {
	  assert("ClassAccessorProperty", node, opts);
	}
	function assertClassPrivateProperty(node, opts) {
	  assert("ClassPrivateProperty", node, opts);
	}
	function assertClassPrivateMethod(node, opts) {
	  assert("ClassPrivateMethod", node, opts);
	}
	function assertPrivateName(node, opts) {
	  assert("PrivateName", node, opts);
	}
	function assertStaticBlock(node, opts) {
	  assert("StaticBlock", node, opts);
	}
	function assertImportAttribute(node, opts) {
	  assert("ImportAttribute", node, opts);
	}
	function assertAnyTypeAnnotation(node, opts) {
	  assert("AnyTypeAnnotation", node, opts);
	}
	function assertArrayTypeAnnotation(node, opts) {
	  assert("ArrayTypeAnnotation", node, opts);
	}
	function assertBooleanTypeAnnotation(node, opts) {
	  assert("BooleanTypeAnnotation", node, opts);
	}
	function assertBooleanLiteralTypeAnnotation(node, opts) {
	  assert("BooleanLiteralTypeAnnotation", node, opts);
	}
	function assertNullLiteralTypeAnnotation(node, opts) {
	  assert("NullLiteralTypeAnnotation", node, opts);
	}
	function assertClassImplements(node, opts) {
	  assert("ClassImplements", node, opts);
	}
	function assertDeclareClass(node, opts) {
	  assert("DeclareClass", node, opts);
	}
	function assertDeclareFunction(node, opts) {
	  assert("DeclareFunction", node, opts);
	}
	function assertDeclareInterface(node, opts) {
	  assert("DeclareInterface", node, opts);
	}
	function assertDeclareModule(node, opts) {
	  assert("DeclareModule", node, opts);
	}
	function assertDeclareModuleExports(node, opts) {
	  assert("DeclareModuleExports", node, opts);
	}
	function assertDeclareTypeAlias(node, opts) {
	  assert("DeclareTypeAlias", node, opts);
	}
	function assertDeclareOpaqueType(node, opts) {
	  assert("DeclareOpaqueType", node, opts);
	}
	function assertDeclareVariable(node, opts) {
	  assert("DeclareVariable", node, opts);
	}
	function assertDeclareExportDeclaration(node, opts) {
	  assert("DeclareExportDeclaration", node, opts);
	}
	function assertDeclareExportAllDeclaration(node, opts) {
	  assert("DeclareExportAllDeclaration", node, opts);
	}
	function assertDeclaredPredicate(node, opts) {
	  assert("DeclaredPredicate", node, opts);
	}
	function assertExistsTypeAnnotation(node, opts) {
	  assert("ExistsTypeAnnotation", node, opts);
	}
	function assertFunctionTypeAnnotation(node, opts) {
	  assert("FunctionTypeAnnotation", node, opts);
	}
	function assertFunctionTypeParam(node, opts) {
	  assert("FunctionTypeParam", node, opts);
	}
	function assertGenericTypeAnnotation(node, opts) {
	  assert("GenericTypeAnnotation", node, opts);
	}
	function assertInferredPredicate(node, opts) {
	  assert("InferredPredicate", node, opts);
	}
	function assertInterfaceExtends(node, opts) {
	  assert("InterfaceExtends", node, opts);
	}
	function assertInterfaceDeclaration(node, opts) {
	  assert("InterfaceDeclaration", node, opts);
	}
	function assertInterfaceTypeAnnotation(node, opts) {
	  assert("InterfaceTypeAnnotation", node, opts);
	}
	function assertIntersectionTypeAnnotation(node, opts) {
	  assert("IntersectionTypeAnnotation", node, opts);
	}
	function assertMixedTypeAnnotation(node, opts) {
	  assert("MixedTypeAnnotation", node, opts);
	}
	function assertEmptyTypeAnnotation(node, opts) {
	  assert("EmptyTypeAnnotation", node, opts);
	}
	function assertNullableTypeAnnotation(node, opts) {
	  assert("NullableTypeAnnotation", node, opts);
	}
	function assertNumberLiteralTypeAnnotation(node, opts) {
	  assert("NumberLiteralTypeAnnotation", node, opts);
	}
	function assertNumberTypeAnnotation(node, opts) {
	  assert("NumberTypeAnnotation", node, opts);
	}
	function assertObjectTypeAnnotation(node, opts) {
	  assert("ObjectTypeAnnotation", node, opts);
	}
	function assertObjectTypeInternalSlot(node, opts) {
	  assert("ObjectTypeInternalSlot", node, opts);
	}
	function assertObjectTypeCallProperty(node, opts) {
	  assert("ObjectTypeCallProperty", node, opts);
	}
	function assertObjectTypeIndexer(node, opts) {
	  assert("ObjectTypeIndexer", node, opts);
	}
	function assertObjectTypeProperty(node, opts) {
	  assert("ObjectTypeProperty", node, opts);
	}
	function assertObjectTypeSpreadProperty(node, opts) {
	  assert("ObjectTypeSpreadProperty", node, opts);
	}
	function assertOpaqueType(node, opts) {
	  assert("OpaqueType", node, opts);
	}
	function assertQualifiedTypeIdentifier(node, opts) {
	  assert("QualifiedTypeIdentifier", node, opts);
	}
	function assertStringLiteralTypeAnnotation(node, opts) {
	  assert("StringLiteralTypeAnnotation", node, opts);
	}
	function assertStringTypeAnnotation(node, opts) {
	  assert("StringTypeAnnotation", node, opts);
	}
	function assertSymbolTypeAnnotation(node, opts) {
	  assert("SymbolTypeAnnotation", node, opts);
	}
	function assertThisTypeAnnotation(node, opts) {
	  assert("ThisTypeAnnotation", node, opts);
	}
	function assertTupleTypeAnnotation(node, opts) {
	  assert("TupleTypeAnnotation", node, opts);
	}
	function assertTypeofTypeAnnotation(node, opts) {
	  assert("TypeofTypeAnnotation", node, opts);
	}
	function assertTypeAlias(node, opts) {
	  assert("TypeAlias", node, opts);
	}
	function assertTypeAnnotation(node, opts) {
	  assert("TypeAnnotation", node, opts);
	}
	function assertTypeCastExpression(node, opts) {
	  assert("TypeCastExpression", node, opts);
	}
	function assertTypeParameter(node, opts) {
	  assert("TypeParameter", node, opts);
	}
	function assertTypeParameterDeclaration(node, opts) {
	  assert("TypeParameterDeclaration", node, opts);
	}
	function assertTypeParameterInstantiation(node, opts) {
	  assert("TypeParameterInstantiation", node, opts);
	}
	function assertUnionTypeAnnotation(node, opts) {
	  assert("UnionTypeAnnotation", node, opts);
	}
	function assertVariance(node, opts) {
	  assert("Variance", node, opts);
	}
	function assertVoidTypeAnnotation(node, opts) {
	  assert("VoidTypeAnnotation", node, opts);
	}
	function assertEnumDeclaration(node, opts) {
	  assert("EnumDeclaration", node, opts);
	}
	function assertEnumBooleanBody(node, opts) {
	  assert("EnumBooleanBody", node, opts);
	}
	function assertEnumNumberBody(node, opts) {
	  assert("EnumNumberBody", node, opts);
	}
	function assertEnumStringBody(node, opts) {
	  assert("EnumStringBody", node, opts);
	}
	function assertEnumSymbolBody(node, opts) {
	  assert("EnumSymbolBody", node, opts);
	}
	function assertEnumBooleanMember(node, opts) {
	  assert("EnumBooleanMember", node, opts);
	}
	function assertEnumNumberMember(node, opts) {
	  assert("EnumNumberMember", node, opts);
	}
	function assertEnumStringMember(node, opts) {
	  assert("EnumStringMember", node, opts);
	}
	function assertEnumDefaultedMember(node, opts) {
	  assert("EnumDefaultedMember", node, opts);
	}
	function assertIndexedAccessType(node, opts) {
	  assert("IndexedAccessType", node, opts);
	}
	function assertOptionalIndexedAccessType(node, opts) {
	  assert("OptionalIndexedAccessType", node, opts);
	}
	function assertJSXAttribute(node, opts) {
	  assert("JSXAttribute", node, opts);
	}
	function assertJSXClosingElement(node, opts) {
	  assert("JSXClosingElement", node, opts);
	}
	function assertJSXElement(node, opts) {
	  assert("JSXElement", node, opts);
	}
	function assertJSXEmptyExpression(node, opts) {
	  assert("JSXEmptyExpression", node, opts);
	}
	function assertJSXExpressionContainer(node, opts) {
	  assert("JSXExpressionContainer", node, opts);
	}
	function assertJSXSpreadChild(node, opts) {
	  assert("JSXSpreadChild", node, opts);
	}
	function assertJSXIdentifier(node, opts) {
	  assert("JSXIdentifier", node, opts);
	}
	function assertJSXMemberExpression(node, opts) {
	  assert("JSXMemberExpression", node, opts);
	}
	function assertJSXNamespacedName(node, opts) {
	  assert("JSXNamespacedName", node, opts);
	}
	function assertJSXOpeningElement(node, opts) {
	  assert("JSXOpeningElement", node, opts);
	}
	function assertJSXSpreadAttribute(node, opts) {
	  assert("JSXSpreadAttribute", node, opts);
	}
	function assertJSXText(node, opts) {
	  assert("JSXText", node, opts);
	}
	function assertJSXFragment(node, opts) {
	  assert("JSXFragment", node, opts);
	}
	function assertJSXOpeningFragment(node, opts) {
	  assert("JSXOpeningFragment", node, opts);
	}
	function assertJSXClosingFragment(node, opts) {
	  assert("JSXClosingFragment", node, opts);
	}
	function assertNoop(node, opts) {
	  assert("Noop", node, opts);
	}
	function assertPlaceholder(node, opts) {
	  assert("Placeholder", node, opts);
	}
	function assertV8IntrinsicIdentifier(node, opts) {
	  assert("V8IntrinsicIdentifier", node, opts);
	}
	function assertArgumentPlaceholder(node, opts) {
	  assert("ArgumentPlaceholder", node, opts);
	}
	function assertBindExpression(node, opts) {
	  assert("BindExpression", node, opts);
	}
	function assertDecorator(node, opts) {
	  assert("Decorator", node, opts);
	}
	function assertDoExpression(node, opts) {
	  assert("DoExpression", node, opts);
	}
	function assertExportDefaultSpecifier(node, opts) {
	  assert("ExportDefaultSpecifier", node, opts);
	}
	function assertRecordExpression(node, opts) {
	  assert("RecordExpression", node, opts);
	}
	function assertTupleExpression(node, opts) {
	  assert("TupleExpression", node, opts);
	}
	function assertDecimalLiteral(node, opts) {
	  assert("DecimalLiteral", node, opts);
	}
	function assertModuleExpression(node, opts) {
	  assert("ModuleExpression", node, opts);
	}
	function assertTopicReference(node, opts) {
	  assert("TopicReference", node, opts);
	}
	function assertPipelineTopicExpression(node, opts) {
	  assert("PipelineTopicExpression", node, opts);
	}
	function assertPipelineBareFunction(node, opts) {
	  assert("PipelineBareFunction", node, opts);
	}
	function assertPipelinePrimaryTopicReference(node, opts) {
	  assert("PipelinePrimaryTopicReference", node, opts);
	}
	function assertVoidPattern(node, opts) {
	  assert("VoidPattern", node, opts);
	}
	function assertTSParameterProperty(node, opts) {
	  assert("TSParameterProperty", node, opts);
	}
	function assertTSDeclareFunction(node, opts) {
	  assert("TSDeclareFunction", node, opts);
	}
	function assertTSDeclareMethod(node, opts) {
	  assert("TSDeclareMethod", node, opts);
	}
	function assertTSQualifiedName(node, opts) {
	  assert("TSQualifiedName", node, opts);
	}
	function assertTSCallSignatureDeclaration(node, opts) {
	  assert("TSCallSignatureDeclaration", node, opts);
	}
	function assertTSConstructSignatureDeclaration(node, opts) {
	  assert("TSConstructSignatureDeclaration", node, opts);
	}
	function assertTSPropertySignature(node, opts) {
	  assert("TSPropertySignature", node, opts);
	}
	function assertTSMethodSignature(node, opts) {
	  assert("TSMethodSignature", node, opts);
	}
	function assertTSIndexSignature(node, opts) {
	  assert("TSIndexSignature", node, opts);
	}
	function assertTSAnyKeyword(node, opts) {
	  assert("TSAnyKeyword", node, opts);
	}
	function assertTSBooleanKeyword(node, opts) {
	  assert("TSBooleanKeyword", node, opts);
	}
	function assertTSBigIntKeyword(node, opts) {
	  assert("TSBigIntKeyword", node, opts);
	}
	function assertTSIntrinsicKeyword(node, opts) {
	  assert("TSIntrinsicKeyword", node, opts);
	}
	function assertTSNeverKeyword(node, opts) {
	  assert("TSNeverKeyword", node, opts);
	}
	function assertTSNullKeyword(node, opts) {
	  assert("TSNullKeyword", node, opts);
	}
	function assertTSNumberKeyword(node, opts) {
	  assert("TSNumberKeyword", node, opts);
	}
	function assertTSObjectKeyword(node, opts) {
	  assert("TSObjectKeyword", node, opts);
	}
	function assertTSStringKeyword(node, opts) {
	  assert("TSStringKeyword", node, opts);
	}
	function assertTSSymbolKeyword(node, opts) {
	  assert("TSSymbolKeyword", node, opts);
	}
	function assertTSUndefinedKeyword(node, opts) {
	  assert("TSUndefinedKeyword", node, opts);
	}
	function assertTSUnknownKeyword(node, opts) {
	  assert("TSUnknownKeyword", node, opts);
	}
	function assertTSVoidKeyword(node, opts) {
	  assert("TSVoidKeyword", node, opts);
	}
	function assertTSThisType(node, opts) {
	  assert("TSThisType", node, opts);
	}
	function assertTSFunctionType(node, opts) {
	  assert("TSFunctionType", node, opts);
	}
	function assertTSConstructorType(node, opts) {
	  assert("TSConstructorType", node, opts);
	}
	function assertTSTypeReference(node, opts) {
	  assert("TSTypeReference", node, opts);
	}
	function assertTSTypePredicate(node, opts) {
	  assert("TSTypePredicate", node, opts);
	}
	function assertTSTypeQuery(node, opts) {
	  assert("TSTypeQuery", node, opts);
	}
	function assertTSTypeLiteral(node, opts) {
	  assert("TSTypeLiteral", node, opts);
	}
	function assertTSArrayType(node, opts) {
	  assert("TSArrayType", node, opts);
	}
	function assertTSTupleType(node, opts) {
	  assert("TSTupleType", node, opts);
	}
	function assertTSOptionalType(node, opts) {
	  assert("TSOptionalType", node, opts);
	}
	function assertTSRestType(node, opts) {
	  assert("TSRestType", node, opts);
	}
	function assertTSNamedTupleMember(node, opts) {
	  assert("TSNamedTupleMember", node, opts);
	}
	function assertTSUnionType(node, opts) {
	  assert("TSUnionType", node, opts);
	}
	function assertTSIntersectionType(node, opts) {
	  assert("TSIntersectionType", node, opts);
	}
	function assertTSConditionalType(node, opts) {
	  assert("TSConditionalType", node, opts);
	}
	function assertTSInferType(node, opts) {
	  assert("TSInferType", node, opts);
	}
	function assertTSParenthesizedType(node, opts) {
	  assert("TSParenthesizedType", node, opts);
	}
	function assertTSTypeOperator(node, opts) {
	  assert("TSTypeOperator", node, opts);
	}
	function assertTSIndexedAccessType(node, opts) {
	  assert("TSIndexedAccessType", node, opts);
	}
	function assertTSMappedType(node, opts) {
	  assert("TSMappedType", node, opts);
	}
	function assertTSTemplateLiteralType(node, opts) {
	  assert("TSTemplateLiteralType", node, opts);
	}
	function assertTSLiteralType(node, opts) {
	  assert("TSLiteralType", node, opts);
	}
	function assertTSExpressionWithTypeArguments(node, opts) {
	  assert("TSExpressionWithTypeArguments", node, opts);
	}
	function assertTSInterfaceDeclaration(node, opts) {
	  assert("TSInterfaceDeclaration", node, opts);
	}
	function assertTSInterfaceBody(node, opts) {
	  assert("TSInterfaceBody", node, opts);
	}
	function assertTSTypeAliasDeclaration(node, opts) {
	  assert("TSTypeAliasDeclaration", node, opts);
	}
	function assertTSInstantiationExpression(node, opts) {
	  assert("TSInstantiationExpression", node, opts);
	}
	function assertTSAsExpression(node, opts) {
	  assert("TSAsExpression", node, opts);
	}
	function assertTSSatisfiesExpression(node, opts) {
	  assert("TSSatisfiesExpression", node, opts);
	}
	function assertTSTypeAssertion(node, opts) {
	  assert("TSTypeAssertion", node, opts);
	}
	function assertTSEnumBody(node, opts) {
	  assert("TSEnumBody", node, opts);
	}
	function assertTSEnumDeclaration(node, opts) {
	  assert("TSEnumDeclaration", node, opts);
	}
	function assertTSEnumMember(node, opts) {
	  assert("TSEnumMember", node, opts);
	}
	function assertTSModuleDeclaration(node, opts) {
	  assert("TSModuleDeclaration", node, opts);
	}
	function assertTSModuleBlock(node, opts) {
	  assert("TSModuleBlock", node, opts);
	}
	function assertTSImportType(node, opts) {
	  assert("TSImportType", node, opts);
	}
	function assertTSImportEqualsDeclaration(node, opts) {
	  assert("TSImportEqualsDeclaration", node, opts);
	}
	function assertTSExternalModuleReference(node, opts) {
	  assert("TSExternalModuleReference", node, opts);
	}
	function assertTSNonNullExpression(node, opts) {
	  assert("TSNonNullExpression", node, opts);
	}
	function assertTSExportAssignment(node, opts) {
	  assert("TSExportAssignment", node, opts);
	}
	function assertTSNamespaceExportDeclaration(node, opts) {
	  assert("TSNamespaceExportDeclaration", node, opts);
	}
	function assertTSTypeAnnotation(node, opts) {
	  assert("TSTypeAnnotation", node, opts);
	}
	function assertTSTypeParameterInstantiation(node, opts) {
	  assert("TSTypeParameterInstantiation", node, opts);
	}
	function assertTSTypeParameterDeclaration(node, opts) {
	  assert("TSTypeParameterDeclaration", node, opts);
	}
	function assertTSTypeParameter(node, opts) {
	  assert("TSTypeParameter", node, opts);
	}
	function assertStandardized(node, opts) {
	  assert("Standardized", node, opts);
	}
	function assertExpression(node, opts) {
	  assert("Expression", node, opts);
	}
	function assertBinary(node, opts) {
	  assert("Binary", node, opts);
	}
	function assertScopable(node, opts) {
	  assert("Scopable", node, opts);
	}
	function assertBlockParent(node, opts) {
	  assert("BlockParent", node, opts);
	}
	function assertBlock(node, opts) {
	  assert("Block", node, opts);
	}
	function assertStatement(node, opts) {
	  assert("Statement", node, opts);
	}
	function assertTerminatorless(node, opts) {
	  assert("Terminatorless", node, opts);
	}
	function assertCompletionStatement(node, opts) {
	  assert("CompletionStatement", node, opts);
	}
	function assertConditional(node, opts) {
	  assert("Conditional", node, opts);
	}
	function assertLoop(node, opts) {
	  assert("Loop", node, opts);
	}
	function assertWhile(node, opts) {
	  assert("While", node, opts);
	}
	function assertExpressionWrapper(node, opts) {
	  assert("ExpressionWrapper", node, opts);
	}
	function assertFor(node, opts) {
	  assert("For", node, opts);
	}
	function assertForXStatement(node, opts) {
	  assert("ForXStatement", node, opts);
	}
	function assertFunction(node, opts) {
	  assert("Function", node, opts);
	}
	function assertFunctionParent(node, opts) {
	  assert("FunctionParent", node, opts);
	}
	function assertPureish(node, opts) {
	  assert("Pureish", node, opts);
	}
	function assertDeclaration(node, opts) {
	  assert("Declaration", node, opts);
	}
	function assertFunctionParameter(node, opts) {
	  assert("FunctionParameter", node, opts);
	}
	function assertPatternLike(node, opts) {
	  assert("PatternLike", node, opts);
	}
	function assertLVal(node, opts) {
	  assert("LVal", node, opts);
	}
	function assertTSEntityName(node, opts) {
	  assert("TSEntityName", node, opts);
	}
	function assertLiteral(node, opts) {
	  assert("Literal", node, opts);
	}
	function assertImmutable(node, opts) {
	  assert("Immutable", node, opts);
	}
	function assertUserWhitespacable(node, opts) {
	  assert("UserWhitespacable", node, opts);
	}
	function assertMethod(node, opts) {
	  assert("Method", node, opts);
	}
	function assertObjectMember(node, opts) {
	  assert("ObjectMember", node, opts);
	}
	function assertProperty(node, opts) {
	  assert("Property", node, opts);
	}
	function assertUnaryLike(node, opts) {
	  assert("UnaryLike", node, opts);
	}
	function assertPattern(node, opts) {
	  assert("Pattern", node, opts);
	}
	function assertClass(node, opts) {
	  assert("Class", node, opts);
	}
	function assertImportOrExportDeclaration(node, opts) {
	  assert("ImportOrExportDeclaration", node, opts);
	}
	function assertExportDeclaration(node, opts) {
	  assert("ExportDeclaration", node, opts);
	}
	function assertModuleSpecifier(node, opts) {
	  assert("ModuleSpecifier", node, opts);
	}
	function assertAccessor(node, opts) {
	  assert("Accessor", node, opts);
	}
	function assertPrivate(node, opts) {
	  assert("Private", node, opts);
	}
	function assertFlow(node, opts) {
	  assert("Flow", node, opts);
	}
	function assertFlowType(node, opts) {
	  assert("FlowType", node, opts);
	}
	function assertFlowBaseAnnotation(node, opts) {
	  assert("FlowBaseAnnotation", node, opts);
	}
	function assertFlowDeclaration(node, opts) {
	  assert("FlowDeclaration", node, opts);
	}
	function assertFlowPredicate(node, opts) {
	  assert("FlowPredicate", node, opts);
	}
	function assertEnumBody(node, opts) {
	  assert("EnumBody", node, opts);
	}
	function assertEnumMember(node, opts) {
	  assert("EnumMember", node, opts);
	}
	function assertJSX(node, opts) {
	  assert("JSX", node, opts);
	}
	function assertMiscellaneous(node, opts) {
	  assert("Miscellaneous", node, opts);
	}
	function assertTypeScript(node, opts) {
	  assert("TypeScript", node, opts);
	}
	function assertTSTypeElement(node, opts) {
	  assert("TSTypeElement", node, opts);
	}
	function assertTSType(node, opts) {
	  assert("TSType", node, opts);
	}
	function assertTSBaseType(node, opts) {
	  assert("TSBaseType", node, opts);
	}
	function assertNumberLiteral(node, opts) {
	  (0, _deprecationWarning.default)("assertNumberLiteral", "assertNumericLiteral");
	  assert("NumberLiteral", node, opts);
	}
	function assertRegexLiteral(node, opts) {
	  (0, _deprecationWarning.default)("assertRegexLiteral", "assertRegExpLiteral");
	  assert("RegexLiteral", node, opts);
	}
	function assertRestProperty(node, opts) {
	  (0, _deprecationWarning.default)("assertRestProperty", "assertRestElement");
	  assert("RestProperty", node, opts);
	}
	function assertSpreadProperty(node, opts) {
	  (0, _deprecationWarning.default)("assertSpreadProperty", "assertSpreadElement");
	  assert("SpreadProperty", node, opts);
	}
	function assertModuleDeclaration(node, opts) {
	  (0, _deprecationWarning.default)("assertModuleDeclaration", "assertImportOrExportDeclaration");
	  assert("ModuleDeclaration", node, opts);
	}

	
	return generated$1;
}

var createTypeAnnotationBasedOnTypeof = {};

var hasRequiredCreateTypeAnnotationBasedOnTypeof;

function requireCreateTypeAnnotationBasedOnTypeof () {
	if (hasRequiredCreateTypeAnnotationBasedOnTypeof) return createTypeAnnotationBasedOnTypeof;
	hasRequiredCreateTypeAnnotationBasedOnTypeof = 1;

	Object.defineProperty(createTypeAnnotationBasedOnTypeof, "__esModule", {
	  value: true
	});
	createTypeAnnotationBasedOnTypeof.default = void 0;
	var _index = requireGenerated$2();
	createTypeAnnotationBasedOnTypeof.default = createTypeAnnotationBasedOnTypeof$1;
	function createTypeAnnotationBasedOnTypeof$1(type) {
	  switch (type) {
	    case "string":
	      return (0, _index.stringTypeAnnotation)();
	    case "number":
	      return (0, _index.numberTypeAnnotation)();
	    case "undefined":
	      return (0, _index.voidTypeAnnotation)();
	    case "boolean":
	      return (0, _index.booleanTypeAnnotation)();
	    case "function":
	      return (0, _index.genericTypeAnnotation)((0, _index.identifier)("Function"));
	    case "object":
	      return (0, _index.genericTypeAnnotation)((0, _index.identifier)("Object"));
	    case "symbol":
	      return (0, _index.genericTypeAnnotation)((0, _index.identifier)("Symbol"));
	    case "bigint":
	      return (0, _index.anyTypeAnnotation)();
	  }
	  throw new Error("Invalid typeof value: " + type);
	}

	
	return createTypeAnnotationBasedOnTypeof;
}

var createFlowUnionType = {};

var removeTypeDuplicates$1 = {};

var hasRequiredRemoveTypeDuplicates$1;

function requireRemoveTypeDuplicates$1 () {
	if (hasRequiredRemoveTypeDuplicates$1) return removeTypeDuplicates$1;
	hasRequiredRemoveTypeDuplicates$1 = 1;

	Object.defineProperty(removeTypeDuplicates$1, "__esModule", {
	  value: true
	});
	removeTypeDuplicates$1.default = removeTypeDuplicates;
	var _index = requireGenerated$3();
	function getQualifiedName(node) {
	  return (0, _index.isIdentifier)(node) ? node.name : `${node.id.name}.${getQualifiedName(node.qualification)}`;
	}
	function removeTypeDuplicates(nodesIn) {
	  const nodes = Array.from(nodesIn);
	  const generics = new Map();
	  const bases = new Map();
	  const typeGroups = new Set();
	  const types = [];
	  for (let i = 0; i < nodes.length; i++) {
	    const node = nodes[i];
	    if (!node) continue;
	    if (types.includes(node)) {
	      continue;
	    }
	    if ((0, _index.isAnyTypeAnnotation)(node)) {
	      return [node];
	    }
	    if ((0, _index.isFlowBaseAnnotation)(node)) {
	      bases.set(node.type, node);
	      continue;
	    }
	    if ((0, _index.isUnionTypeAnnotation)(node)) {
	      if (!typeGroups.has(node.types)) {
	        nodes.push(...node.types);
	        typeGroups.add(node.types);
	      }
	      continue;
	    }
	    if ((0, _index.isGenericTypeAnnotation)(node)) {
	      const name = getQualifiedName(node.id);
	      if (generics.has(name)) {
	        let existing = generics.get(name);
	        if (existing.typeParameters) {
	          if (node.typeParameters) {
	            existing.typeParameters.params.push(...node.typeParameters.params);
	            existing.typeParameters.params = removeTypeDuplicates(existing.typeParameters.params);
	          }
	        } else {
	          existing = node.typeParameters;
	        }
	      } else {
	        generics.set(name, node);
	      }
	      continue;
	    }
	    types.push(node);
	  }
	  for (const [, baseType] of bases) {
	    types.push(baseType);
	  }
	  for (const [, genericName] of generics) {
	    types.push(genericName);
	  }
	  return types;
	}

	
	return removeTypeDuplicates$1;
}

var hasRequiredCreateFlowUnionType;

function requireCreateFlowUnionType () {
	if (hasRequiredCreateFlowUnionType) return createFlowUnionType;
	hasRequiredCreateFlowUnionType = 1;

	Object.defineProperty(createFlowUnionType, "__esModule", {
	  value: true
	});
	createFlowUnionType.default = createFlowUnionType$1;
	var _index = requireGenerated$2();
	var _removeTypeDuplicates = requireRemoveTypeDuplicates$1();
	function createFlowUnionType$1(types) {
	  const flattened = (0, _removeTypeDuplicates.default)(types);
	  if (flattened.length === 1) {
	    return flattened[0];
	  } else {
	    return (0, _index.unionTypeAnnotation)(flattened);
	  }
	}

	
	return createFlowUnionType;
}

var createTSUnionType = {};

var removeTypeDuplicates = {};

var hasRequiredRemoveTypeDuplicates;

function requireRemoveTypeDuplicates () {
	if (hasRequiredRemoveTypeDuplicates) return removeTypeDuplicates;
	hasRequiredRemoveTypeDuplicates = 1;

	Object.defineProperty(removeTypeDuplicates, "__esModule", {
	  value: true
	});
	removeTypeDuplicates.default = removeTypeDuplicates$1;
	var _index = requireGenerated$3();
	function getQualifiedName(node) {
	  return (0, _index.isIdentifier)(node) ? node.name : (0, _index.isThisExpression)(node) ? "this" : `${node.right.name}.${getQualifiedName(node.left)}`;
	}
	function removeTypeDuplicates$1(nodesIn) {
	  const nodes = Array.from(nodesIn);
	  const generics = new Map();
	  const bases = new Map();
	  const typeGroups = new Set();
	  const types = [];
	  for (let i = 0; i < nodes.length; i++) {
	    const node = nodes[i];
	    if (!node) continue;
	    if (types.includes(node)) {
	      continue;
	    }
	    if ((0, _index.isTSAnyKeyword)(node)) {
	      return [node];
	    }
	    if ((0, _index.isTSBaseType)(node)) {
	      bases.set(node.type, node);
	      continue;
	    }
	    if ((0, _index.isTSUnionType)(node)) {
	      if (!typeGroups.has(node.types)) {
	        nodes.push(...node.types);
	        typeGroups.add(node.types);
	      }
	      continue;
	    }
	    const typeArgumentsKey = "typeParameters";
	    if ((0, _index.isTSTypeReference)(node) && node[typeArgumentsKey]) {
	      const typeArguments = node[typeArgumentsKey];
	      const name = getQualifiedName(node.typeName);
	      if (generics.has(name)) {
	        let existing = generics.get(name);
	        const existingTypeArguments = existing[typeArgumentsKey];
	        if (existingTypeArguments) {
	          existingTypeArguments.params.push(...typeArguments.params);
	          existingTypeArguments.params = removeTypeDuplicates$1(existingTypeArguments.params);
	        } else {
	          existing = typeArguments;
	        }
	      } else {
	        generics.set(name, node);
	      }
	      continue;
	    }
	    types.push(node);
	  }
	  for (const [, baseType] of bases) {
	    types.push(baseType);
	  }
	  for (const [, genericName] of generics) {
	    types.push(genericName);
	  }
	  return types;
	}

	
	return removeTypeDuplicates;
}

var hasRequiredCreateTSUnionType;

function requireCreateTSUnionType () {
	if (hasRequiredCreateTSUnionType) return createTSUnionType;
	hasRequiredCreateTSUnionType = 1;

	Object.defineProperty(createTSUnionType, "__esModule", {
	  value: true
	});
	createTSUnionType.default = createTSUnionType$1;
	var _index = requireGenerated$2();
	var _removeTypeDuplicates = requireRemoveTypeDuplicates();
	var _index2 = requireGenerated$3();
	function createTSUnionType$1(typeAnnotations) {
	  const types = typeAnnotations.map(type => {
	    return (0, _index2.isTSTypeAnnotation)(type) ? type.typeAnnotation : type;
	  });
	  const flattened = (0, _removeTypeDuplicates.default)(types);
	  if (flattened.length === 1) {
	    return flattened[0];
	  } else {
	    return (0, _index.tsUnionType)(flattened);
	  }
	}

	
	return createTSUnionType;
}

var productions = {};

var hasRequiredProductions;

function requireProductions () {
	if (hasRequiredProductions) return productions;
	hasRequiredProductions = 1;

	Object.defineProperty(productions, "__esModule", {
	  value: true
	});
	productions.buildUndefinedNode = buildUndefinedNode;
	var _index = requireGenerated$2();
	function buildUndefinedNode() {
	  return (0, _index.unaryExpression)("void", (0, _index.numericLiteral)(0), true);
	}

	
	return productions;
}

var cloneNode = {};

var hasRequiredCloneNode;

function requireCloneNode () {
	if (hasRequiredCloneNode) return cloneNode;
	hasRequiredCloneNode = 1;

	Object.defineProperty(cloneNode, "__esModule", {
	  value: true
	});
	cloneNode.default = cloneNode$1;
	var _index = requireDefinitions();
	var _index2 = requireGenerated$3();
	const {
	  hasOwn
	} = {
	  hasOwn: Function.call.bind(Object.prototype.hasOwnProperty)
	};
	function cloneIfNode(obj, deep, withoutLoc, commentsCache) {
	  if (obj && typeof obj.type === "string") {
	    return cloneNodeInternal(obj, deep, withoutLoc, commentsCache);
	  }
	  return obj;
	}
	function cloneIfNodeOrArray(obj, deep, withoutLoc, commentsCache) {
	  if (Array.isArray(obj)) {
	    return obj.map(node => cloneIfNode(node, deep, withoutLoc, commentsCache));
	  }
	  return cloneIfNode(obj, deep, withoutLoc, commentsCache);
	}
	function cloneNode$1(node, deep = true, withoutLoc = false) {
	  return cloneNodeInternal(node, deep, withoutLoc, new Map());
	}
	function cloneNodeInternal(node, deep = true, withoutLoc = false, commentsCache) {
	  if (!node) return node;
	  const {
	    type
	  } = node;
	  const newNode = {
	    type: node.type
	  };
	  if ((0, _index2.isIdentifier)(node)) {
	    newNode.name = node.name;
	    if (hasOwn(node, "optional") && typeof node.optional === "boolean") {
	      newNode.optional = node.optional;
	    }
	    if (hasOwn(node, "typeAnnotation")) {
	      newNode.typeAnnotation = deep ? cloneIfNodeOrArray(node.typeAnnotation, true, withoutLoc, commentsCache) : node.typeAnnotation;
	    }
	    if (hasOwn(node, "decorators")) {
	      newNode.decorators = deep ? cloneIfNodeOrArray(node.decorators, true, withoutLoc, commentsCache) : node.decorators;
	    }
	  } else if (!hasOwn(_index.NODE_FIELDS, type)) {
	    throw new Error(`Unknown node type: "${type}"`);
	  } else {
	    for (const field of Object.keys(_index.NODE_FIELDS[type])) {
	      if (hasOwn(node, field)) {
	        if (deep) {
	          newNode[field] = (0, _index2.isFile)(node) && field === "comments" ? maybeCloneComments(node.comments, deep, withoutLoc, commentsCache) : cloneIfNodeOrArray(node[field], true, withoutLoc, commentsCache);
	        } else {
	          newNode[field] = node[field];
	        }
	      }
	    }
	  }
	  if (hasOwn(node, "loc")) {
	    if (withoutLoc) {
	      newNode.loc = null;
	    } else {
	      newNode.loc = node.loc;
	    }
	  }
	  if (hasOwn(node, "leadingComments")) {
	    newNode.leadingComments = maybeCloneComments(node.leadingComments, deep, withoutLoc, commentsCache);
	  }
	  if (hasOwn(node, "innerComments")) {
	    newNode.innerComments = maybeCloneComments(node.innerComments, deep, withoutLoc, commentsCache);
	  }
	  if (hasOwn(node, "trailingComments")) {
	    newNode.trailingComments = maybeCloneComments(node.trailingComments, deep, withoutLoc, commentsCache);
	  }
	  if (hasOwn(node, "extra")) {
	    newNode.extra = Object.assign({}, node.extra);
	  }
	  return newNode;
	}
	function maybeCloneComments(comments, deep, withoutLoc, commentsCache) {
	  if (!comments || !deep) {
	    return comments;
	  }
	  return comments.map(comment => {
	    const cache = commentsCache.get(comment);
	    if (cache) return cache;
	    const {
	      type,
	      value,
	      loc
	    } = comment;
	    const ret = {
	      type,
	      value,
	      loc
	    };
	    if (withoutLoc) {
	      ret.loc = null;
	    }
	    commentsCache.set(comment, ret);
	    return ret;
	  });
	}

	
	return cloneNode;
}

var clone = {};

var hasRequiredClone;

function requireClone () {
	if (hasRequiredClone) return clone;
	hasRequiredClone = 1;

	Object.defineProperty(clone, "__esModule", {
	  value: true
	});
	clone.default = clone$1;
	var _cloneNode = requireCloneNode();
	function clone$1(node) {
	  return (0, _cloneNode.default)(node, false);
	}

	
	return clone;
}

var cloneDeep = {};

var hasRequiredCloneDeep;

function requireCloneDeep () {
	if (hasRequiredCloneDeep) return cloneDeep;
	hasRequiredCloneDeep = 1;

	Object.defineProperty(cloneDeep, "__esModule", {
	  value: true
	});
	cloneDeep.default = cloneDeep$1;
	var _cloneNode = requireCloneNode();
	function cloneDeep$1(node) {
	  return (0, _cloneNode.default)(node);
	}

	
	return cloneDeep;
}

var cloneDeepWithoutLoc = {};

var hasRequiredCloneDeepWithoutLoc;

function requireCloneDeepWithoutLoc () {
	if (hasRequiredCloneDeepWithoutLoc) return cloneDeepWithoutLoc;
	hasRequiredCloneDeepWithoutLoc = 1;

	Object.defineProperty(cloneDeepWithoutLoc, "__esModule", {
	  value: true
	});
	cloneDeepWithoutLoc.default = cloneDeepWithoutLoc$1;
	var _cloneNode = requireCloneNode();
	function cloneDeepWithoutLoc$1(node) {
	  return (0, _cloneNode.default)(node, true, true);
	}

	
	return cloneDeepWithoutLoc;
}

var cloneWithoutLoc = {};

var hasRequiredCloneWithoutLoc;

function requireCloneWithoutLoc () {
	if (hasRequiredCloneWithoutLoc) return cloneWithoutLoc;
	hasRequiredCloneWithoutLoc = 1;

	Object.defineProperty(cloneWithoutLoc, "__esModule", {
	  value: true
	});
	cloneWithoutLoc.default = cloneWithoutLoc$1;
	var _cloneNode = requireCloneNode();
	function cloneWithoutLoc$1(node) {
	  return (0, _cloneNode.default)(node, false, true);
	}

	
	return cloneWithoutLoc;
}

var addComment = {};

var addComments = {};

var hasRequiredAddComments;

function requireAddComments () {
	if (hasRequiredAddComments) return addComments;
	hasRequiredAddComments = 1;

	Object.defineProperty(addComments, "__esModule", {
	  value: true
	});
	addComments.default = addComments$1;
	function addComments$1(node, type, comments) {
	  if (!comments || !node) return node;
	  const key = `${type}Comments`;
	  if (node[key]) {
	    if (type === "leading") {
	      node[key] = comments.concat(node[key]);
	    } else {
	      node[key].push(...comments);
	    }
	  } else {
	    node[key] = comments;
	  }
	  return node;
	}

	
	return addComments;
}

var hasRequiredAddComment;

function requireAddComment () {
	if (hasRequiredAddComment) return addComment;
	hasRequiredAddComment = 1;

	Object.defineProperty(addComment, "__esModule", {
	  value: true
	});
	addComment.default = addComment$1;
	var _addComments = requireAddComments();
	function addComment$1(node, type, content, line) {
	  return (0, _addComments.default)(node, type, [{
	    type: line ? "CommentLine" : "CommentBlock",
	    value: content
	  }]);
	}

	
	return addComment;
}

var inheritInnerComments = {};

var inherit = {};

var hasRequiredInherit;

function requireInherit () {
	if (hasRequiredInherit) return inherit;
	hasRequiredInherit = 1;

	Object.defineProperty(inherit, "__esModule", {
	  value: true
	});
	inherit.default = inherit$1;
	function inherit$1(key, child, parent) {
	  if (child && parent) {
	    child[key] = Array.from(new Set([].concat(child[key], parent[key]).filter(Boolean)));
	  }
	}

	
	return inherit;
}

var hasRequiredInheritInnerComments;

function requireInheritInnerComments () {
	if (hasRequiredInheritInnerComments) return inheritInnerComments;
	hasRequiredInheritInnerComments = 1;

	Object.defineProperty(inheritInnerComments, "__esModule", {
	  value: true
	});
	inheritInnerComments.default = inheritInnerComments$1;
	var _inherit = requireInherit();
	function inheritInnerComments$1(child, parent) {
	  (0, _inherit.default)("innerComments", child, parent);
	}

	
	return inheritInnerComments;
}

var inheritLeadingComments = {};

var hasRequiredInheritLeadingComments;

function requireInheritLeadingComments () {
	if (hasRequiredInheritLeadingComments) return inheritLeadingComments;
	hasRequiredInheritLeadingComments = 1;

	Object.defineProperty(inheritLeadingComments, "__esModule", {
	  value: true
	});
	inheritLeadingComments.default = inheritLeadingComments$1;
	var _inherit = requireInherit();
	function inheritLeadingComments$1(child, parent) {
	  (0, _inherit.default)("leadingComments", child, parent);
	}

	
	return inheritLeadingComments;
}

var inheritsComments = {};

var inheritTrailingComments = {};

var hasRequiredInheritTrailingComments;

function requireInheritTrailingComments () {
	if (hasRequiredInheritTrailingComments) return inheritTrailingComments;
	hasRequiredInheritTrailingComments = 1;

	Object.defineProperty(inheritTrailingComments, "__esModule", {
	  value: true
	});
	inheritTrailingComments.default = inheritTrailingComments$1;
	var _inherit = requireInherit();
	function inheritTrailingComments$1(child, parent) {
	  (0, _inherit.default)("trailingComments", child, parent);
	}

	
	return inheritTrailingComments;
}

var hasRequiredInheritsComments;

function requireInheritsComments () {
	if (hasRequiredInheritsComments) return inheritsComments;
	hasRequiredInheritsComments = 1;

	Object.defineProperty(inheritsComments, "__esModule", {
	  value: true
	});
	inheritsComments.default = inheritsComments$1;
	var _inheritTrailingComments = requireInheritTrailingComments();
	var _inheritLeadingComments = requireInheritLeadingComments();
	var _inheritInnerComments = requireInheritInnerComments();
	function inheritsComments$1(child, parent) {
	  (0, _inheritTrailingComments.default)(child, parent);
	  (0, _inheritLeadingComments.default)(child, parent);
	  (0, _inheritInnerComments.default)(child, parent);
	  return child;
	}

	
	return inheritsComments;
}

var removeComments = {};

var hasRequiredRemoveComments;

function requireRemoveComments () {
	if (hasRequiredRemoveComments) return removeComments;
	hasRequiredRemoveComments = 1;

	Object.defineProperty(removeComments, "__esModule", {
	  value: true
	});
	removeComments.default = removeComments$1;
	var _index = requireConstants();
	function removeComments$1(node) {
	  _index.COMMENT_KEYS.forEach(key => {
	    node[key] = null;
	  });
	  return node;
	}

	
	return removeComments;
}

var generated = {};

var hasRequiredGenerated;

function requireGenerated () {
	if (hasRequiredGenerated) return generated;
	hasRequiredGenerated = 1;

	Object.defineProperty(generated, "__esModule", {
	  value: true
	});
	generated.WHILE_TYPES = generated.USERWHITESPACABLE_TYPES = generated.UNARYLIKE_TYPES = generated.TYPESCRIPT_TYPES = generated.TSTYPE_TYPES = generated.TSTYPEELEMENT_TYPES = generated.TSENTITYNAME_TYPES = generated.TSBASETYPE_TYPES = generated.TERMINATORLESS_TYPES = generated.STATEMENT_TYPES = generated.STANDARDIZED_TYPES = generated.SCOPABLE_TYPES = generated.PUREISH_TYPES = generated.PROPERTY_TYPES = generated.PRIVATE_TYPES = generated.PATTERN_TYPES = generated.PATTERNLIKE_TYPES = generated.OBJECTMEMBER_TYPES = generated.MODULESPECIFIER_TYPES = generated.MODULEDECLARATION_TYPES = generated.MISCELLANEOUS_TYPES = generated.METHOD_TYPES = generated.LVAL_TYPES = generated.LOOP_TYPES = generated.LITERAL_TYPES = generated.JSX_TYPES = generated.IMPORTOREXPORTDECLARATION_TYPES = generated.IMMUTABLE_TYPES = generated.FUNCTION_TYPES = generated.FUNCTIONPARENT_TYPES = generated.FUNCTIONPARAMETER_TYPES = generated.FOR_TYPES = generated.FORXSTATEMENT_TYPES = generated.FLOW_TYPES = generated.FLOWTYPE_TYPES = generated.FLOWPREDICATE_TYPES = generated.FLOWDECLARATION_TYPES = generated.FLOWBASEANNOTATION_TYPES = generated.EXPRESSION_TYPES = generated.EXPRESSIONWRAPPER_TYPES = generated.EXPORTDECLARATION_TYPES = generated.ENUMMEMBER_TYPES = generated.ENUMBODY_TYPES = generated.DECLARATION_TYPES = generated.CONDITIONAL_TYPES = generated.COMPLETIONSTATEMENT_TYPES = generated.CLASS_TYPES = generated.BLOCK_TYPES = generated.BLOCKPARENT_TYPES = generated.BINARY_TYPES = generated.ACCESSOR_TYPES = void 0;
	var _index = requireDefinitions();
	generated.STANDARDIZED_TYPES = _index.FLIPPED_ALIAS_KEYS["Standardized"];
	generated.EXPRESSION_TYPES = _index.FLIPPED_ALIAS_KEYS["Expression"];
	generated.BINARY_TYPES = _index.FLIPPED_ALIAS_KEYS["Binary"];
	generated.SCOPABLE_TYPES = _index.FLIPPED_ALIAS_KEYS["Scopable"];
	generated.BLOCKPARENT_TYPES = _index.FLIPPED_ALIAS_KEYS["BlockParent"];
	generated.BLOCK_TYPES = _index.FLIPPED_ALIAS_KEYS["Block"];
	generated.STATEMENT_TYPES = _index.FLIPPED_ALIAS_KEYS["Statement"];
	generated.TERMINATORLESS_TYPES = _index.FLIPPED_ALIAS_KEYS["Terminatorless"];
	generated.COMPLETIONSTATEMENT_TYPES = _index.FLIPPED_ALIAS_KEYS["CompletionStatement"];
	generated.CONDITIONAL_TYPES = _index.FLIPPED_ALIAS_KEYS["Conditional"];
	generated.LOOP_TYPES = _index.FLIPPED_ALIAS_KEYS["Loop"];
	generated.WHILE_TYPES = _index.FLIPPED_ALIAS_KEYS["While"];
	generated.EXPRESSIONWRAPPER_TYPES = _index.FLIPPED_ALIAS_KEYS["ExpressionWrapper"];
	generated.FOR_TYPES = _index.FLIPPED_ALIAS_KEYS["For"];
	generated.FORXSTATEMENT_TYPES = _index.FLIPPED_ALIAS_KEYS["ForXStatement"];
	generated.FUNCTION_TYPES = _index.FLIPPED_ALIAS_KEYS["Function"];
	generated.FUNCTIONPARENT_TYPES = _index.FLIPPED_ALIAS_KEYS["FunctionParent"];
	generated.PUREISH_TYPES = _index.FLIPPED_ALIAS_KEYS["Pureish"];
	generated.DECLARATION_TYPES = _index.FLIPPED_ALIAS_KEYS["Declaration"];
	generated.FUNCTIONPARAMETER_TYPES = _index.FLIPPED_ALIAS_KEYS["FunctionParameter"];
	generated.PATTERNLIKE_TYPES = _index.FLIPPED_ALIAS_KEYS["PatternLike"];
	generated.LVAL_TYPES = _index.FLIPPED_ALIAS_KEYS["LVal"];
	generated.TSENTITYNAME_TYPES = _index.FLIPPED_ALIAS_KEYS["TSEntityName"];
	generated.LITERAL_TYPES = _index.FLIPPED_ALIAS_KEYS["Literal"];
	generated.IMMUTABLE_TYPES = _index.FLIPPED_ALIAS_KEYS["Immutable"];
	generated.USERWHITESPACABLE_TYPES = _index.FLIPPED_ALIAS_KEYS["UserWhitespacable"];
	generated.METHOD_TYPES = _index.FLIPPED_ALIAS_KEYS["Method"];
	generated.OBJECTMEMBER_TYPES = _index.FLIPPED_ALIAS_KEYS["ObjectMember"];
	generated.PROPERTY_TYPES = _index.FLIPPED_ALIAS_KEYS["Property"];
	generated.UNARYLIKE_TYPES = _index.FLIPPED_ALIAS_KEYS["UnaryLike"];
	generated.PATTERN_TYPES = _index.FLIPPED_ALIAS_KEYS["Pattern"];
	generated.CLASS_TYPES = _index.FLIPPED_ALIAS_KEYS["Class"];
	const IMPORTOREXPORTDECLARATION_TYPES = generated.IMPORTOREXPORTDECLARATION_TYPES = _index.FLIPPED_ALIAS_KEYS["ImportOrExportDeclaration"];
	generated.EXPORTDECLARATION_TYPES = _index.FLIPPED_ALIAS_KEYS["ExportDeclaration"];
	generated.MODULESPECIFIER_TYPES = _index.FLIPPED_ALIAS_KEYS["ModuleSpecifier"];
	generated.ACCESSOR_TYPES = _index.FLIPPED_ALIAS_KEYS["Accessor"];
	generated.PRIVATE_TYPES = _index.FLIPPED_ALIAS_KEYS["Private"];
	generated.FLOW_TYPES = _index.FLIPPED_ALIAS_KEYS["Flow"];
	generated.FLOWTYPE_TYPES = _index.FLIPPED_ALIAS_KEYS["FlowType"];
	generated.FLOWBASEANNOTATION_TYPES = _index.FLIPPED_ALIAS_KEYS["FlowBaseAnnotation"];
	generated.FLOWDECLARATION_TYPES = _index.FLIPPED_ALIAS_KEYS["FlowDeclaration"];
	generated.FLOWPREDICATE_TYPES = _index.FLIPPED_ALIAS_KEYS["FlowPredicate"];
	generated.ENUMBODY_TYPES = _index.FLIPPED_ALIAS_KEYS["EnumBody"];
	generated.ENUMMEMBER_TYPES = _index.FLIPPED_ALIAS_KEYS["EnumMember"];
	generated.JSX_TYPES = _index.FLIPPED_ALIAS_KEYS["JSX"];
	generated.MISCELLANEOUS_TYPES = _index.FLIPPED_ALIAS_KEYS["Miscellaneous"];
	generated.TYPESCRIPT_TYPES = _index.FLIPPED_ALIAS_KEYS["TypeScript"];
	generated.TSTYPEELEMENT_TYPES = _index.FLIPPED_ALIAS_KEYS["TSTypeElement"];
	generated.TSTYPE_TYPES = _index.FLIPPED_ALIAS_KEYS["TSType"];
	generated.TSBASETYPE_TYPES = _index.FLIPPED_ALIAS_KEYS["TSBaseType"];
	generated.MODULEDECLARATION_TYPES = IMPORTOREXPORTDECLARATION_TYPES;

	
	return generated;
}

var ensureBlock = {};

var toBlock = {};

var hasRequiredToBlock;

function requireToBlock () {
	if (hasRequiredToBlock) return toBlock;
	hasRequiredToBlock = 1;

	Object.defineProperty(toBlock, "__esModule", {
	  value: true
	});
	toBlock.default = toBlock$1;
	var _index = requireGenerated$3();
	var _index2 = requireGenerated$2();
	function toBlock$1(node, parent) {
	  if ((0, _index.isBlockStatement)(node)) {
	    return node;
	  }
	  let blockNodes = [];
	  if ((0, _index.isEmptyStatement)(node)) {
	    blockNodes = [];
	  } else {
	    if (!(0, _index.isStatement)(node)) {
	      if ((0, _index.isFunction)(parent)) {
	        node = (0, _index2.returnStatement)(node);
	      } else {
	        node = (0, _index2.expressionStatement)(node);
	      }
	    }
	    blockNodes = [node];
	  }
	  return (0, _index2.blockStatement)(blockNodes);
	}

	
	return toBlock;
}

var hasRequiredEnsureBlock;

function requireEnsureBlock () {
	if (hasRequiredEnsureBlock) return ensureBlock;
	hasRequiredEnsureBlock = 1;

	Object.defineProperty(ensureBlock, "__esModule", {
	  value: true
	});
	ensureBlock.default = ensureBlock$1;
	var _toBlock = requireToBlock();
	function ensureBlock$1(node, key = "body") {
	  const result = (0, _toBlock.default)(node[key], node);
	  node[key] = result;
	  return result;
	}

	
	return ensureBlock;
}

var toBindingIdentifierName = {};

var toIdentifier = {};

var hasRequiredToIdentifier;

function requireToIdentifier () {
	if (hasRequiredToIdentifier) return toIdentifier;
	hasRequiredToIdentifier = 1;

	Object.defineProperty(toIdentifier, "__esModule", {
	  value: true
	});
	toIdentifier.default = toIdentifier$1;
	var _isValidIdentifier = requireIsValidIdentifier();
	var _helperValidatorIdentifier = requireLib$3();
	function toIdentifier$1(input) {
	  input = input + "";
	  let name = "";
	  for (const c of input) {
	    name += (0, _helperValidatorIdentifier.isIdentifierChar)(c.codePointAt(0)) ? c : "-";
	  }
	  name = name.replace(/^[-0-9]+/, "");
	  name = name.replace(/[-\s]+(.)?/g, function (match, c) {
	    return c ? c.toUpperCase() : "";
	  });
	  if (!(0, _isValidIdentifier.default)(name)) {
	    name = `_${name}`;
	  }
	  return name || "_";
	}

	
	return toIdentifier;
}

var hasRequiredToBindingIdentifierName;

function requireToBindingIdentifierName () {
	if (hasRequiredToBindingIdentifierName) return toBindingIdentifierName;
	hasRequiredToBindingIdentifierName = 1;

	Object.defineProperty(toBindingIdentifierName, "__esModule", {
	  value: true
	});
	toBindingIdentifierName.default = toBindingIdentifierName$1;
	var _toIdentifier = requireToIdentifier();
	function toBindingIdentifierName$1(name) {
	  name = (0, _toIdentifier.default)(name);
	  if (name === "eval" || name === "arguments") name = "_" + name;
	  return name;
	}

	
	return toBindingIdentifierName;
}

var toComputedKey = {};

var hasRequiredToComputedKey;

function requireToComputedKey () {
	if (hasRequiredToComputedKey) return toComputedKey;
	hasRequiredToComputedKey = 1;

	Object.defineProperty(toComputedKey, "__esModule", {
	  value: true
	});
	toComputedKey.default = toComputedKey$1;
	var _index = requireGenerated$3();
	var _index2 = requireGenerated$2();
	function toComputedKey$1(node, key = node.key || node.property) {
	  if (!node.computed && (0, _index.isIdentifier)(key)) key = (0, _index2.stringLiteral)(key.name);
	  return key;
	}

	
	return toComputedKey;
}

var toExpression = {};

var hasRequiredToExpression;

function requireToExpression () {
	if (hasRequiredToExpression) return toExpression;
	hasRequiredToExpression = 1;

	Object.defineProperty(toExpression, "__esModule", {
	  value: true
	});
	toExpression.default = void 0;
	var _index = requireGenerated$3();
	toExpression.default = toExpression$1;
	function toExpression$1(node) {
	  if ((0, _index.isExpressionStatement)(node)) {
	    node = node.expression;
	  }
	  if ((0, _index.isExpression)(node)) {
	    return node;
	  }
	  if ((0, _index.isClass)(node)) {
	    node.type = "ClassExpression";
	    node.abstract = false;
	  } else if ((0, _index.isFunction)(node)) {
	    node.type = "FunctionExpression";
	  }
	  if (!(0, _index.isExpression)(node)) {
	    throw new Error(`cannot turn ${node.type} to an expression`);
	  }
	  return node;
	}

	
	return toExpression;
}

var toKeyAlias = {};

var removePropertiesDeep = {};

var traverseFast = {};

var hasRequiredTraverseFast;

function requireTraverseFast () {
	if (hasRequiredTraverseFast) return traverseFast;
	hasRequiredTraverseFast = 1;

	Object.defineProperty(traverseFast, "__esModule", {
	  value: true
	});
	traverseFast.default = traverseFast$1;
	var _index = requireDefinitions();
	const _skip = Symbol();
	const _stop = Symbol();
	function traverseFast$1(node, enter, opts) {
	  if (!node) return false;
	  const keys = _index.VISITOR_KEYS[node.type];
	  if (!keys) return false;
	  opts = opts || {};
	  const ret = enter(node, opts);
	  if (ret !== undefined) {
	    switch (ret) {
	      case _skip:
	        return false;
	      case _stop:
	        return true;
	    }
	  }
	  for (const key of keys) {
	    const subNode = node[key];
	    if (!subNode) continue;
	    if (Array.isArray(subNode)) {
	      for (const node of subNode) {
	        if (traverseFast$1(node, enter, opts)) return true;
	      }
	    } else {
	      if (traverseFast$1(subNode, enter, opts)) return true;
	    }
	  }
	  return false;
	}
	traverseFast$1.skip = _skip;
	traverseFast$1.stop = _stop;

	
	return traverseFast;
}

var removeProperties = {};

var hasRequiredRemoveProperties;

function requireRemoveProperties () {
	if (hasRequiredRemoveProperties) return removeProperties;
	hasRequiredRemoveProperties = 1;

	Object.defineProperty(removeProperties, "__esModule", {
	  value: true
	});
	removeProperties.default = removeProperties$1;
	var _index = requireConstants();
	const CLEAR_KEYS = ["tokens", "start", "end", "loc", "raw", "rawValue"];
	const CLEAR_KEYS_PLUS_COMMENTS = [..._index.COMMENT_KEYS, "comments", ...CLEAR_KEYS];
	function removeProperties$1(node, opts = {}) {
	  const map = opts.preserveComments ? CLEAR_KEYS : CLEAR_KEYS_PLUS_COMMENTS;
	  for (const key of map) {
	    if (node[key] != null) node[key] = undefined;
	  }
	  for (const key of Object.keys(node)) {
	    if (key.startsWith("_") && node[key] != null) node[key] = undefined;
	  }
	  const symbols = Object.getOwnPropertySymbols(node);
	  for (const sym of symbols) {
	    node[sym] = null;
	  }
	}

	
	return removeProperties;
}

var hasRequiredRemovePropertiesDeep;

function requireRemovePropertiesDeep () {
	if (hasRequiredRemovePropertiesDeep) return removePropertiesDeep;
	hasRequiredRemovePropertiesDeep = 1;

	Object.defineProperty(removePropertiesDeep, "__esModule", {
	  value: true
	});
	removePropertiesDeep.default = removePropertiesDeep$1;
	var _traverseFast = requireTraverseFast();
	var _removeProperties = requireRemoveProperties();
	function removePropertiesDeep$1(tree, opts) {
	  (0, _traverseFast.default)(tree, _removeProperties.default, opts);
	  return tree;
	}

	
	return removePropertiesDeep;
}

var hasRequiredToKeyAlias;

function requireToKeyAlias () {
	if (hasRequiredToKeyAlias) return toKeyAlias;
	hasRequiredToKeyAlias = 1;

	Object.defineProperty(toKeyAlias, "__esModule", {
	  value: true
	});
	toKeyAlias.default = toKeyAlias$1;
	var _index = requireGenerated$3();
	var _cloneNode = requireCloneNode();
	var _removePropertiesDeep = requireRemovePropertiesDeep();
	function toKeyAlias$1(node, key = node.key) {
	  let alias;
	  if (node.kind === "method") {
	    return toKeyAlias$1.increment() + "";
	  } else if ((0, _index.isIdentifier)(key)) {
	    alias = key.name;
	  } else if ((0, _index.isStringLiteral)(key)) {
	    alias = JSON.stringify(key.value);
	  } else {
	    alias = JSON.stringify((0, _removePropertiesDeep.default)((0, _cloneNode.default)(key)));
	  }
	  if (node.computed) {
	    alias = `[${alias}]`;
	  }
	  if (node.static) {
	    alias = `static:${alias}`;
	  }
	  return alias;
	}
	toKeyAlias$1.uid = 0;
	toKeyAlias$1.increment = function () {
	  if (toKeyAlias$1.uid >= Number.MAX_SAFE_INTEGER) {
	    return toKeyAlias$1.uid = 0;
	  } else {
	    return toKeyAlias$1.uid++;
	  }
	};

	
	return toKeyAlias;
}

var toStatement = {};

var hasRequiredToStatement;

function requireToStatement () {
	if (hasRequiredToStatement) return toStatement;
	hasRequiredToStatement = 1;

	Object.defineProperty(toStatement, "__esModule", {
	  value: true
	});
	toStatement.default = void 0;
	var _index = requireGenerated$3();
	var _index2 = requireGenerated$2();
	toStatement.default = toStatement$1;
	function toStatement$1(node, ignore) {
	  if ((0, _index.isStatement)(node)) {
	    return node;
	  }
	  let mustHaveId = false;
	  let newType;
	  if ((0, _index.isClass)(node)) {
	    mustHaveId = true;
	    newType = "ClassDeclaration";
	  } else if ((0, _index.isFunction)(node)) {
	    mustHaveId = true;
	    newType = "FunctionDeclaration";
	  } else if ((0, _index.isAssignmentExpression)(node)) {
	    return (0, _index2.expressionStatement)(node);
	  }
	  if (mustHaveId && !node.id) {
	    newType = false;
	  }
	  if (!newType) {
	    if (ignore) {
	      return false;
	    } else {
	      throw new Error(`cannot turn ${node.type} to a statement`);
	    }
	  }
	  node.type = newType;
	  return node;
	}

	
	return toStatement;
}

var valueToNode = {};

var hasRequiredValueToNode;

function requireValueToNode () {
	if (hasRequiredValueToNode) return valueToNode;
	hasRequiredValueToNode = 1;

	Object.defineProperty(valueToNode, "__esModule", {
	  value: true
	});
	valueToNode.default = void 0;
	var _isValidIdentifier = requireIsValidIdentifier();
	var _index = requireGenerated$2();
	valueToNode.default = valueToNode$1;
	const objectToString = Function.call.bind(Object.prototype.toString);
	function isRegExp(value) {
	  return objectToString(value) === "[object RegExp]";
	}
	function isPlainObject(value) {
	  if (typeof value !== "object" || value === null || Object.prototype.toString.call(value) !== "[object Object]") {
	    return false;
	  }
	  const proto = Object.getPrototypeOf(value);
	  return proto === null || Object.getPrototypeOf(proto) === null;
	}
	function valueToNode$1(value) {
	  if (value === undefined) {
	    return (0, _index.identifier)("undefined");
	  }
	  if (value === true || value === false) {
	    return (0, _index.booleanLiteral)(value);
	  }
	  if (value === null) {
	    return (0, _index.nullLiteral)();
	  }
	  if (typeof value === "string") {
	    return (0, _index.stringLiteral)(value);
	  }
	  if (typeof value === "number") {
	    let result;
	    if (Number.isFinite(value)) {
	      result = (0, _index.numericLiteral)(Math.abs(value));
	    } else {
	      let numerator;
	      if (Number.isNaN(value)) {
	        numerator = (0, _index.numericLiteral)(0);
	      } else {
	        numerator = (0, _index.numericLiteral)(1);
	      }
	      result = (0, _index.binaryExpression)("/", numerator, (0, _index.numericLiteral)(0));
	    }
	    if (value < 0 || Object.is(value, -0)) {
	      result = (0, _index.unaryExpression)("-", result);
	    }
	    return result;
	  }
	  if (typeof value === "bigint") {
	    if (value < 0) {
	      return (0, _index.unaryExpression)("-", (0, _index.bigIntLiteral)(-value));
	    } else {
	      return (0, _index.bigIntLiteral)(value);
	    }
	  }
	  if (isRegExp(value)) {
	    const pattern = value.source;
	    const flags = /\/([a-z]*)$/.exec(value.toString())[1];
	    return (0, _index.regExpLiteral)(pattern, flags);
	  }
	  if (Array.isArray(value)) {
	    return (0, _index.arrayExpression)(value.map(valueToNode$1));
	  }
	  if (isPlainObject(value)) {
	    const props = [];
	    for (const key of Object.keys(value)) {
	      let nodeKey,
	        computed = false;
	      if ((0, _isValidIdentifier.default)(key)) {
	        if (key === "__proto__") {
	          computed = true;
	          nodeKey = (0, _index.stringLiteral)(key);
	        } else {
	          nodeKey = (0, _index.identifier)(key);
	        }
	      } else {
	        nodeKey = (0, _index.stringLiteral)(key);
	      }
	      props.push((0, _index.objectProperty)(nodeKey, valueToNode$1(value[key]), computed));
	    }
	    return (0, _index.objectExpression)(props);
	  }
	  throw new Error("don't know how to turn this value into a node");
	}

	
	return valueToNode;
}

var appendToMemberExpression = {};

var hasRequiredAppendToMemberExpression;

function requireAppendToMemberExpression () {
	if (hasRequiredAppendToMemberExpression) return appendToMemberExpression;
	hasRequiredAppendToMemberExpression = 1;

	Object.defineProperty(appendToMemberExpression, "__esModule", {
	  value: true
	});
	appendToMemberExpression.default = appendToMemberExpression$1;
	var _index = requireGenerated$2();
	function appendToMemberExpression$1(member, append, computed = false) {
	  member.object = (0, _index.memberExpression)(member.object, member.property, member.computed);
	  member.property = append;
	  member.computed = !!computed;
	  return member;
	}

	
	return appendToMemberExpression;
}

var inherits = {};

var hasRequiredInherits;

function requireInherits () {
	if (hasRequiredInherits) return inherits;
	hasRequiredInherits = 1;

	Object.defineProperty(inherits, "__esModule", {
	  value: true
	});
	inherits.default = inherits$1;
	var _index = requireConstants();
	var _inheritsComments = requireInheritsComments();
	function inherits$1(child, parent) {
	  if (!child || !parent) return child;
	  for (const key of _index.INHERIT_KEYS.optional) {
	    if (child[key] == null) {
	      child[key] = parent[key];
	    }
	  }
	  for (const key of Object.keys(parent)) {
	    if (key.startsWith("_") && key !== "__clone") {
	      child[key] = parent[key];
	    }
	  }
	  for (const key of _index.INHERIT_KEYS.force) {
	    child[key] = parent[key];
	  }
	  (0, _inheritsComments.default)(child, parent);
	  return child;
	}

	
	return inherits;
}

var prependToMemberExpression = {};

var hasRequiredPrependToMemberExpression;

function requirePrependToMemberExpression () {
	if (hasRequiredPrependToMemberExpression) return prependToMemberExpression;
	hasRequiredPrependToMemberExpression = 1;

	Object.defineProperty(prependToMemberExpression, "__esModule", {
	  value: true
	});
	prependToMemberExpression.default = prependToMemberExpression$1;
	var _index = requireGenerated$2();
	var _index2 = requireLib$1();
	function prependToMemberExpression$1(member, prepend) {
	  if ((0, _index2.isSuper)(member.object)) {
	    throw new Error("Cannot prepend node to super property access (`super.foo`).");
	  }
	  member.object = (0, _index.memberExpression)(prepend, member.object);
	  return member;
	}

	
	return prependToMemberExpression;
}

var getAssignmentIdentifiers = {};

var hasRequiredGetAssignmentIdentifiers;

function requireGetAssignmentIdentifiers () {
	if (hasRequiredGetAssignmentIdentifiers) return getAssignmentIdentifiers;
	hasRequiredGetAssignmentIdentifiers = 1;

	Object.defineProperty(getAssignmentIdentifiers, "__esModule", {
	  value: true
	});
	getAssignmentIdentifiers.default = getAssignmentIdentifiers$1;
	function getAssignmentIdentifiers$1(node) {
	  const search = [].concat(node);
	  const ids = Object.create(null);
	  while (search.length) {
	    const id = search.pop();
	    if (!id) continue;
	    switch (id.type) {
	      case "ArrayPattern":
	        search.push(...id.elements);
	        break;
	      case "AssignmentExpression":
	      case "AssignmentPattern":
	      case "ForInStatement":
	      case "ForOfStatement":
	        search.push(id.left);
	        break;
	      case "ObjectPattern":
	        search.push(...id.properties);
	        break;
	      case "ObjectProperty":
	        search.push(id.value);
	        break;
	      case "RestElement":
	      case "UpdateExpression":
	        search.push(id.argument);
	        break;
	      case "UnaryExpression":
	        if (id.operator === "delete") {
	          search.push(id.argument);
	        }
	        break;
	      case "Identifier":
	        ids[id.name] = id;
	        break;
	    }
	  }
	  return ids;
	}

	
	return getAssignmentIdentifiers;
}

var getBindingIdentifiers = {};

var hasRequiredGetBindingIdentifiers;

function requireGetBindingIdentifiers () {
	if (hasRequiredGetBindingIdentifiers) return getBindingIdentifiers;
	hasRequiredGetBindingIdentifiers = 1;

	Object.defineProperty(getBindingIdentifiers, "__esModule", {
	  value: true
	});
	getBindingIdentifiers.default = getBindingIdentifiers$1;
	var _index = requireGenerated$3();
	function getBindingIdentifiers$1(node, duplicates, outerOnly, newBindingsOnly) {
	  const search = [].concat(node);
	  const ids = Object.create(null);
	  while (search.length) {
	    const id = search.shift();
	    if (!id) continue;
	    if (newBindingsOnly && ((0, _index.isAssignmentExpression)(id) || (0, _index.isUnaryExpression)(id) || (0, _index.isUpdateExpression)(id))) {
	      continue;
	    }
	    if ((0, _index.isIdentifier)(id)) {
	      if (duplicates) {
	        const _ids = ids[id.name] = ids[id.name] || [];
	        _ids.push(id);
	      } else {
	        ids[id.name] = id;
	      }
	      continue;
	    }
	    if ((0, _index.isExportDeclaration)(id) && !(0, _index.isExportAllDeclaration)(id)) {
	      if ((0, _index.isDeclaration)(id.declaration)) {
	        search.push(id.declaration);
	      }
	      continue;
	    }
	    if (outerOnly) {
	      if ((0, _index.isFunctionDeclaration)(id)) {
	        search.push(id.id);
	        continue;
	      }
	      if ((0, _index.isFunctionExpression)(id)) {
	        continue;
	      }
	    }
	    const keys = getBindingIdentifiers$1.keys[id.type];
	    if (keys) {
	      for (let i = 0; i < keys.length; i++) {
	        const key = keys[i];
	        const nodes = id[key];
	        if (nodes) {
	          if (Array.isArray(nodes)) {
	            search.push(...nodes);
	          } else {
	            search.push(nodes);
	          }
	        }
	      }
	    }
	  }
	  return ids;
	}
	const keys = {
	  DeclareClass: ["id"],
	  DeclareFunction: ["id"],
	  DeclareModule: ["id"],
	  DeclareVariable: ["id"],
	  DeclareInterface: ["id"],
	  DeclareTypeAlias: ["id"],
	  DeclareOpaqueType: ["id"],
	  InterfaceDeclaration: ["id"],
	  TypeAlias: ["id"],
	  OpaqueType: ["id"],
	  CatchClause: ["param"],
	  LabeledStatement: ["label"],
	  UnaryExpression: ["argument"],
	  AssignmentExpression: ["left"],
	  ImportSpecifier: ["local"],
	  ImportNamespaceSpecifier: ["local"],
	  ImportDefaultSpecifier: ["local"],
	  ImportDeclaration: ["specifiers"],
	  TSImportEqualsDeclaration: ["id"],
	  ExportSpecifier: ["exported"],
	  ExportNamespaceSpecifier: ["exported"],
	  ExportDefaultSpecifier: ["exported"],
	  FunctionDeclaration: ["id", "params"],
	  FunctionExpression: ["id", "params"],
	  ArrowFunctionExpression: ["params"],
	  ObjectMethod: ["params"],
	  ClassMethod: ["params"],
	  ClassPrivateMethod: ["params"],
	  ForInStatement: ["left"],
	  ForOfStatement: ["left"],
	  ClassDeclaration: ["id"],
	  ClassExpression: ["id"],
	  RestElement: ["argument"],
	  UpdateExpression: ["argument"],
	  ObjectProperty: ["value"],
	  AssignmentPattern: ["left"],
	  ArrayPattern: ["elements"],
	  ObjectPattern: ["properties"],
	  VariableDeclaration: ["declarations"],
	  VariableDeclarator: ["id"]
	};
	getBindingIdentifiers$1.keys = keys;

	
	return getBindingIdentifiers;
}

var getOuterBindingIdentifiers = {};

var hasRequiredGetOuterBindingIdentifiers;

function requireGetOuterBindingIdentifiers () {
	if (hasRequiredGetOuterBindingIdentifiers) return getOuterBindingIdentifiers;
	hasRequiredGetOuterBindingIdentifiers = 1;

	Object.defineProperty(getOuterBindingIdentifiers, "__esModule", {
	  value: true
	});
	getOuterBindingIdentifiers.default = void 0;
	var _getBindingIdentifiers = requireGetBindingIdentifiers();
	getOuterBindingIdentifiers.default = getOuterBindingIdentifiers$1;
	function getOuterBindingIdentifiers$1(node, duplicates) {
	  return (0, _getBindingIdentifiers.default)(node, duplicates, true);
	}

	
	return getOuterBindingIdentifiers;
}

var getFunctionName = {};

var hasRequiredGetFunctionName;

function requireGetFunctionName () {
	if (hasRequiredGetFunctionName) return getFunctionName;
	hasRequiredGetFunctionName = 1;

	Object.defineProperty(getFunctionName, "__esModule", {
	  value: true
	});
	getFunctionName.default = getFunctionName$1;
	var _index = requireGenerated$3();
	function getNameFromLiteralId(id) {
	  if ((0, _index.isNullLiteral)(id)) {
	    return "null";
	  }
	  if ((0, _index.isRegExpLiteral)(id)) {
	    return `/${id.pattern}/${id.flags}`;
	  }
	  if ((0, _index.isTemplateLiteral)(id)) {
	    return id.quasis.map(quasi => quasi.value.raw).join("");
	  }
	  if (id.value !== undefined) {
	    return String(id.value);
	  }
	  return null;
	}
	function getObjectMemberKey(node) {
	  if (!node.computed || (0, _index.isLiteral)(node.key)) {
	    return node.key;
	  }
	}
	function getFunctionName$1(node, parent) {
	  if ("id" in node && node.id) {
	    return {
	      name: node.id.name,
	      originalNode: node.id
	    };
	  }
	  let prefix = "";
	  let id;
	  if ((0, _index.isObjectProperty)(parent, {
	    value: node
	  })) {
	    id = getObjectMemberKey(parent);
	  } else if ((0, _index.isObjectMethod)(node) || (0, _index.isClassMethod)(node)) {
	    id = getObjectMemberKey(node);
	    if (node.kind === "get") prefix = "get ";else if (node.kind === "set") prefix = "set ";
	  } else if ((0, _index.isVariableDeclarator)(parent, {
	    init: node
	  })) {
	    id = parent.id;
	  } else if ((0, _index.isAssignmentExpression)(parent, {
	    operator: "=",
	    right: node
	  })) {
	    id = parent.left;
	  }
	  if (!id) return null;
	  const name = (0, _index.isLiteral)(id) ? getNameFromLiteralId(id) : (0, _index.isIdentifier)(id) ? id.name : (0, _index.isPrivateName)(id) ? id.id.name : null;
	  if (name == null) return null;
	  return {
	    name: prefix + name,
	    originalNode: id
	  };
	}

	
	return getFunctionName;
}

var traverse = {};

var hasRequiredTraverse;

function requireTraverse () {
	if (hasRequiredTraverse) return traverse;
	hasRequiredTraverse = 1;

	Object.defineProperty(traverse, "__esModule", {
	  value: true
	});
	traverse.default = traverse$1;
	var _index = requireDefinitions();
	function traverse$1(node, handlers, state) {
	  if (typeof handlers === "function") {
	    handlers = {
	      enter: handlers
	    };
	  }
	  const {
	    enter,
	    exit
	  } = handlers;
	  traverseSimpleImpl(node, enter, exit, state, []);
	}
	function traverseSimpleImpl(node, enter, exit, state, ancestors) {
	  const keys = _index.VISITOR_KEYS[node.type];
	  if (!keys) return;
	  if (enter) enter(node, ancestors, state);
	  for (const key of keys) {
	    const subNode = node[key];
	    if (Array.isArray(subNode)) {
	      for (let i = 0; i < subNode.length; i++) {
	        const child = subNode[i];
	        if (!child) continue;
	        ancestors.push({
	          node,
	          key,
	          index: i
	        });
	        traverseSimpleImpl(child, enter, exit, state, ancestors);
	        ancestors.pop();
	      }
	    } else if (subNode) {
	      ancestors.push({
	        node,
	        key
	      });
	      traverseSimpleImpl(subNode, enter, exit, state, ancestors);
	      ancestors.pop();
	    }
	  }
	  if (exit) exit(node, ancestors, state);
	}

	
	return traverse;
}

var isBinding = {};

var hasRequiredIsBinding;

function requireIsBinding () {
	if (hasRequiredIsBinding) return isBinding;
	hasRequiredIsBinding = 1;

	Object.defineProperty(isBinding, "__esModule", {
	  value: true
	});
	isBinding.default = isBinding$1;
	var _getBindingIdentifiers = requireGetBindingIdentifiers();
	function isBinding$1(node, parent, grandparent) {
	  if (grandparent && node.type === "Identifier" && parent.type === "ObjectProperty" && grandparent.type === "ObjectExpression") {
	    return false;
	  }
	  const keys = _getBindingIdentifiers.default.keys[parent.type];
	  if (keys) {
	    for (let i = 0; i < keys.length; i++) {
	      const key = keys[i];
	      const val = parent[key];
	      if (Array.isArray(val)) {
	        if (val.includes(node)) return true;
	      } else {
	        if (val === node) return true;
	      }
	    }
	  }
	  return false;
	}

	
	return isBinding;
}

var isBlockScoped = {};

var isLet = {};

var hasRequiredIsLet;

function requireIsLet () {
	if (hasRequiredIsLet) return isLet;
	hasRequiredIsLet = 1;

	Object.defineProperty(isLet, "__esModule", {
	  value: true
	});
	isLet.default = isLet$1;
	var _index = requireGenerated$3();
	var BLOCK_SCOPED_SYMBOL = Symbol.for("var used to be block scoped");
	function isLet$1(node) {
	  return (0, _index.isVariableDeclaration)(node) && (node.kind !== "var" || node[BLOCK_SCOPED_SYMBOL]);
	}

	
	return isLet;
}

var hasRequiredIsBlockScoped;

function requireIsBlockScoped () {
	if (hasRequiredIsBlockScoped) return isBlockScoped;
	hasRequiredIsBlockScoped = 1;

	Object.defineProperty(isBlockScoped, "__esModule", {
	  value: true
	});
	isBlockScoped.default = isBlockScoped$1;
	var _index = requireGenerated$3();
	var _isLet = requireIsLet();
	function isBlockScoped$1(node) {
	  return (0, _index.isFunctionDeclaration)(node) || (0, _index.isClassDeclaration)(node) || (0, _isLet.default)(node);
	}

	
	return isBlockScoped;
}

var isImmutable = {};

var hasRequiredIsImmutable;

function requireIsImmutable () {
	if (hasRequiredIsImmutable) return isImmutable;
	hasRequiredIsImmutable = 1;

	Object.defineProperty(isImmutable, "__esModule", {
	  value: true
	});
	isImmutable.default = isImmutable$1;
	var _isType = requireIsType();
	var _index = requireGenerated$3();
	function isImmutable$1(node) {
	  if ((0, _isType.default)(node.type, "Immutable")) return true;
	  if ((0, _index.isIdentifier)(node)) {
	    if (node.name === "undefined") {
	      return true;
	    } else {
	      return false;
	    }
	  }
	  return false;
	}

	
	return isImmutable;
}

var isNodesEquivalent = {};

var hasRequiredIsNodesEquivalent;

function requireIsNodesEquivalent () {
	if (hasRequiredIsNodesEquivalent) return isNodesEquivalent;
	hasRequiredIsNodesEquivalent = 1;

	Object.defineProperty(isNodesEquivalent, "__esModule", {
	  value: true
	});
	isNodesEquivalent.default = isNodesEquivalent$1;
	var _index = requireDefinitions();
	function isNodesEquivalent$1(a, b) {
	  if (typeof a !== "object" || typeof b !== "object" || a == null || b == null) {
	    return a === b;
	  }
	  if (a.type !== b.type) {
	    return false;
	  }
	  const fields = Object.keys(_index.NODE_FIELDS[a.type] || a.type);
	  const visitorKeys = _index.VISITOR_KEYS[a.type];
	  for (const field of fields) {
	    const val_a = a[field];
	    const val_b = b[field];
	    if (typeof val_a !== typeof val_b) {
	      return false;
	    }
	    if (val_a == null && val_b == null) {
	      continue;
	    } else if (val_a == null || val_b == null) {
	      return false;
	    }
	    if (Array.isArray(val_a)) {
	      if (!Array.isArray(val_b)) {
	        return false;
	      }
	      if (val_a.length !== val_b.length) {
	        return false;
	      }
	      for (let i = 0; i < val_a.length; i++) {
	        if (!isNodesEquivalent$1(val_a[i], val_b[i])) {
	          return false;
	        }
	      }
	      continue;
	    }
	    if (typeof val_a === "object" && !(visitorKeys != null && visitorKeys.includes(field))) {
	      for (const key of Object.keys(val_a)) {
	        if (val_a[key] !== val_b[key]) {
	          return false;
	        }
	      }
	      continue;
	    }
	    if (!isNodesEquivalent$1(val_a, val_b)) {
	      return false;
	    }
	  }
	  return true;
	}

	
	return isNodesEquivalent;
}

var isReferenced = {};

var hasRequiredIsReferenced;

function requireIsReferenced () {
	if (hasRequiredIsReferenced) return isReferenced;
	hasRequiredIsReferenced = 1;

	Object.defineProperty(isReferenced, "__esModule", {
	  value: true
	});
	isReferenced.default = isReferenced$1;
	function isReferenced$1(node, parent, grandparent) {
	  switch (parent.type) {
	    case "MemberExpression":
	    case "OptionalMemberExpression":
	      if (parent.property === node) {
	        return !!parent.computed;
	      }
	      return parent.object === node;
	    case "JSXMemberExpression":
	      return parent.object === node;
	    case "VariableDeclarator":
	      return parent.init === node;
	    case "ArrowFunctionExpression":
	      return parent.body === node;
	    case "PrivateName":
	      return false;
	    case "ClassMethod":
	    case "ClassPrivateMethod":
	    case "ObjectMethod":
	      if (parent.key === node) {
	        return !!parent.computed;
	      }
	      return false;
	    case "ObjectProperty":
	      if (parent.key === node) {
	        return !!parent.computed;
	      }
	      return (grandparent == null ? void 0 : grandparent.type) !== "ObjectPattern";
	    case "ClassProperty":
	    case "ClassAccessorProperty":
	      if (parent.key === node) {
	        return !!parent.computed;
	      }
	      return true;
	    case "ClassPrivateProperty":
	      return parent.key !== node;
	    case "ClassDeclaration":
	    case "ClassExpression":
	      return parent.superClass === node;
	    case "AssignmentExpression":
	      return parent.right === node;
	    case "AssignmentPattern":
	      return parent.right === node;
	    case "LabeledStatement":
	      return false;
	    case "CatchClause":
	      return false;
	    case "RestElement":
	      return false;
	    case "BreakStatement":
	    case "ContinueStatement":
	      return false;
	    case "FunctionDeclaration":
	    case "FunctionExpression":
	      return false;
	    case "ExportNamespaceSpecifier":
	    case "ExportDefaultSpecifier":
	      return false;
	    case "ExportSpecifier":
	      if (grandparent != null && grandparent.source) {
	        return false;
	      }
	      return parent.local === node;
	    case "ImportDefaultSpecifier":
	    case "ImportNamespaceSpecifier":
	    case "ImportSpecifier":
	      return false;
	    case "ImportAttribute":
	      return false;
	    case "JSXAttribute":
	      return false;
	    case "ObjectPattern":
	    case "ArrayPattern":
	      return false;
	    case "MetaProperty":
	      return false;
	    case "ObjectTypeProperty":
	      return parent.key !== node;
	    case "TSEnumMember":
	      return parent.id !== node;
	    case "TSPropertySignature":
	      if (parent.key === node) {
	        return !!parent.computed;
	      }
	      return true;
	  }
	  return true;
	}

	
	return isReferenced;
}

var isScope = {};

var hasRequiredIsScope;

function requireIsScope () {
	if (hasRequiredIsScope) return isScope;
	hasRequiredIsScope = 1;

	Object.defineProperty(isScope, "__esModule", {
	  value: true
	});
	isScope.default = isScope$1;
	var _index = requireGenerated$3();
	function isScope$1(node, parent) {
	  if ((0, _index.isBlockStatement)(node) && ((0, _index.isFunction)(parent) || (0, _index.isCatchClause)(parent))) {
	    return false;
	  }
	  if ((0, _index.isPattern)(node) && ((0, _index.isFunction)(parent) || (0, _index.isCatchClause)(parent))) {
	    return true;
	  }
	  return (0, _index.isScopable)(node);
	}

	
	return isScope;
}

var isSpecifierDefault = {};

var hasRequiredIsSpecifierDefault;

function requireIsSpecifierDefault () {
	if (hasRequiredIsSpecifierDefault) return isSpecifierDefault;
	hasRequiredIsSpecifierDefault = 1;

	Object.defineProperty(isSpecifierDefault, "__esModule", {
	  value: true
	});
	isSpecifierDefault.default = isSpecifierDefault$1;
	var _index = requireGenerated$3();
	function isSpecifierDefault$1(specifier) {
	  return (0, _index.isImportDefaultSpecifier)(specifier) || (0, _index.isIdentifier)(specifier.imported || specifier.exported, {
	    name: "default"
	  });
	}

	
	return isSpecifierDefault;
}

var isValidES3Identifier = {};

var hasRequiredIsValidES3Identifier;

function requireIsValidES3Identifier () {
	if (hasRequiredIsValidES3Identifier) return isValidES3Identifier;
	hasRequiredIsValidES3Identifier = 1;

	Object.defineProperty(isValidES3Identifier, "__esModule", {
	  value: true
	});
	isValidES3Identifier.default = isValidES3Identifier$1;
	var _isValidIdentifier = requireIsValidIdentifier();
	const RESERVED_WORDS_ES3_ONLY = new Set(["abstract", "boolean", "byte", "char", "double", "enum", "final", "float", "goto", "implements", "int", "interface", "long", "native", "package", "private", "protected", "public", "short", "static", "synchronized", "throws", "transient", "volatile"]);
	function isValidES3Identifier$1(name) {
	  return (0, _isValidIdentifier.default)(name) && !RESERVED_WORDS_ES3_ONLY.has(name);
	}

	
	return isValidES3Identifier;
}

var isVar = {};

var hasRequiredIsVar;

function requireIsVar () {
	if (hasRequiredIsVar) return isVar;
	hasRequiredIsVar = 1;

	Object.defineProperty(isVar, "__esModule", {
	  value: true
	});
	isVar.default = isVar$1;
	var _index = requireGenerated$3();
	var BLOCK_SCOPED_SYMBOL = Symbol.for("var used to be block scoped");
	function isVar$1(node) {
	  return (0, _index.isVariableDeclaration)(node, {
	    kind: "var"
	  }) && !node[BLOCK_SCOPED_SYMBOL];
	}

	
	return isVar;
}

var toSequenceExpression = {};

var gatherSequenceExpressions = {};

var hasRequiredGatherSequenceExpressions;

function requireGatherSequenceExpressions () {
	if (hasRequiredGatherSequenceExpressions) return gatherSequenceExpressions;
	hasRequiredGatherSequenceExpressions = 1;

	Object.defineProperty(gatherSequenceExpressions, "__esModule", {
	  value: true
	});
	gatherSequenceExpressions.default = gatherSequenceExpressions$1;
	var _getBindingIdentifiers = requireGetBindingIdentifiers();
	var _index = requireGenerated$3();
	var _index2 = requireGenerated$2();
	var _productions = requireProductions();
	var _cloneNode = requireCloneNode();
	function gatherSequenceExpressions$1(nodes, declars) {
	  const exprs = [];
	  let ensureLastUndefined = true;
	  for (const node of nodes) {
	    if (!(0, _index.isEmptyStatement)(node)) {
	      ensureLastUndefined = false;
	    }
	    if ((0, _index.isExpression)(node)) {
	      exprs.push(node);
	    } else if ((0, _index.isExpressionStatement)(node)) {
	      exprs.push(node.expression);
	    } else if ((0, _index.isVariableDeclaration)(node)) {
	      if (node.kind !== "var") return;
	      for (const declar of node.declarations) {
	        const bindings = (0, _getBindingIdentifiers.default)(declar);
	        for (const key of Object.keys(bindings)) {
	          declars.push({
	            kind: node.kind,
	            id: (0, _cloneNode.default)(bindings[key])
	          });
	        }
	        if (declar.init) {
	          exprs.push((0, _index2.assignmentExpression)("=", declar.id, declar.init));
	        }
	      }
	      ensureLastUndefined = true;
	    } else if ((0, _index.isIfStatement)(node)) {
	      const consequent = node.consequent ? gatherSequenceExpressions$1([node.consequent], declars) : (0, _productions.buildUndefinedNode)();
	      const alternate = node.alternate ? gatherSequenceExpressions$1([node.alternate], declars) : (0, _productions.buildUndefinedNode)();
	      if (!consequent || !alternate) return;
	      exprs.push((0, _index2.conditionalExpression)(node.test, consequent, alternate));
	    } else if ((0, _index.isBlockStatement)(node)) {
	      const body = gatherSequenceExpressions$1(node.body, declars);
	      if (!body) return;
	      exprs.push(body);
	    } else if ((0, _index.isEmptyStatement)(node)) {
	      if (nodes.indexOf(node) === 0) {
	        ensureLastUndefined = true;
	      }
	    } else {
	      return;
	    }
	  }
	  if (ensureLastUndefined) {
	    exprs.push((0, _productions.buildUndefinedNode)());
	  }
	  if (exprs.length === 1) {
	    return exprs[0];
	  } else {
	    return (0, _index2.sequenceExpression)(exprs);
	  }
	}

	
	return gatherSequenceExpressions;
}

var hasRequiredToSequenceExpression;

function requireToSequenceExpression () {
	if (hasRequiredToSequenceExpression) return toSequenceExpression;
	hasRequiredToSequenceExpression = 1;

	Object.defineProperty(toSequenceExpression, "__esModule", {
	  value: true
	});
	toSequenceExpression.default = toSequenceExpression$1;
	var _gatherSequenceExpressions = requireGatherSequenceExpressions();
	function toSequenceExpression$1(nodes, scope) {
	  if (!(nodes != null && nodes.length)) return;
	  const declars = [];
	  const result = (0, _gatherSequenceExpressions.default)(nodes, declars);
	  if (!result) return;
	  for (const declar of declars) {
	    scope.push(declar);
	  }
	  return result;
	}

	
	return toSequenceExpression;
}

var hasRequiredLib$1;

function requireLib$1 () {
	if (hasRequiredLib$1) return lib$2;
	hasRequiredLib$1 = 1;
	(function (exports$1) {

		Object.defineProperty(exports$1, "__esModule", {
		  value: true
		});
		var _exportNames = {
		  react: true,
		  assertNode: true,
		  createTypeAnnotationBasedOnTypeof: true,
		  createUnionTypeAnnotation: true,
		  createFlowUnionType: true,
		  createTSUnionType: true,
		  cloneNode: true,
		  clone: true,
		  cloneDeep: true,
		  cloneDeepWithoutLoc: true,
		  cloneWithoutLoc: true,
		  addComment: true,
		  addComments: true,
		  inheritInnerComments: true,
		  inheritLeadingComments: true,
		  inheritsComments: true,
		  inheritTrailingComments: true,
		  removeComments: true,
		  ensureBlock: true,
		  toBindingIdentifierName: true,
		  toBlock: true,
		  toComputedKey: true,
		  toExpression: true,
		  toIdentifier: true,
		  toKeyAlias: true,
		  toStatement: true,
		  valueToNode: true,
		  appendToMemberExpression: true,
		  inherits: true,
		  prependToMemberExpression: true,
		  removeProperties: true,
		  removePropertiesDeep: true,
		  removeTypeDuplicates: true,
		  getAssignmentIdentifiers: true,
		  getBindingIdentifiers: true,
		  getOuterBindingIdentifiers: true,
		  getFunctionName: true,
		  traverse: true,
		  traverseFast: true,
		  shallowEqual: true,
		  is: true,
		  isBinding: true,
		  isBlockScoped: true,
		  isImmutable: true,
		  isLet: true,
		  isNode: true,
		  isNodesEquivalent: true,
		  isPlaceholderType: true,
		  isReferenced: true,
		  isScope: true,
		  isSpecifierDefault: true,
		  isType: true,
		  isValidES3Identifier: true,
		  isValidIdentifier: true,
		  isVar: true,
		  matchesPattern: true,
		  validate: true,
		  buildMatchMemberExpression: true,
		  __internal__deprecationWarning: true
		};
		Object.defineProperty(exports$1, "__internal__deprecationWarning", {
		  enumerable: true,
		  get: function () {
		    return _deprecationWarning.default;
		  }
		});
		Object.defineProperty(exports$1, "addComment", {
		  enumerable: true,
		  get: function () {
		    return _addComment.default;
		  }
		});
		Object.defineProperty(exports$1, "addComments", {
		  enumerable: true,
		  get: function () {
		    return _addComments.default;
		  }
		});
		Object.defineProperty(exports$1, "appendToMemberExpression", {
		  enumerable: true,
		  get: function () {
		    return _appendToMemberExpression.default;
		  }
		});
		Object.defineProperty(exports$1, "assertNode", {
		  enumerable: true,
		  get: function () {
		    return _assertNode.default;
		  }
		});
		Object.defineProperty(exports$1, "buildMatchMemberExpression", {
		  enumerable: true,
		  get: function () {
		    return _buildMatchMemberExpression.default;
		  }
		});
		Object.defineProperty(exports$1, "clone", {
		  enumerable: true,
		  get: function () {
		    return _clone.default;
		  }
		});
		Object.defineProperty(exports$1, "cloneDeep", {
		  enumerable: true,
		  get: function () {
		    return _cloneDeep.default;
		  }
		});
		Object.defineProperty(exports$1, "cloneDeepWithoutLoc", {
		  enumerable: true,
		  get: function () {
		    return _cloneDeepWithoutLoc.default;
		  }
		});
		Object.defineProperty(exports$1, "cloneNode", {
		  enumerable: true,
		  get: function () {
		    return _cloneNode.default;
		  }
		});
		Object.defineProperty(exports$1, "cloneWithoutLoc", {
		  enumerable: true,
		  get: function () {
		    return _cloneWithoutLoc.default;
		  }
		});
		Object.defineProperty(exports$1, "createFlowUnionType", {
		  enumerable: true,
		  get: function () {
		    return _createFlowUnionType.default;
		  }
		});
		Object.defineProperty(exports$1, "createTSUnionType", {
		  enumerable: true,
		  get: function () {
		    return _createTSUnionType.default;
		  }
		});
		Object.defineProperty(exports$1, "createTypeAnnotationBasedOnTypeof", {
		  enumerable: true,
		  get: function () {
		    return _createTypeAnnotationBasedOnTypeof.default;
		  }
		});
		Object.defineProperty(exports$1, "createUnionTypeAnnotation", {
		  enumerable: true,
		  get: function () {
		    return _createFlowUnionType.default;
		  }
		});
		Object.defineProperty(exports$1, "ensureBlock", {
		  enumerable: true,
		  get: function () {
		    return _ensureBlock.default;
		  }
		});
		Object.defineProperty(exports$1, "getAssignmentIdentifiers", {
		  enumerable: true,
		  get: function () {
		    return _getAssignmentIdentifiers.default;
		  }
		});
		Object.defineProperty(exports$1, "getBindingIdentifiers", {
		  enumerable: true,
		  get: function () {
		    return _getBindingIdentifiers.default;
		  }
		});
		Object.defineProperty(exports$1, "getFunctionName", {
		  enumerable: true,
		  get: function () {
		    return _getFunctionName.default;
		  }
		});
		Object.defineProperty(exports$1, "getOuterBindingIdentifiers", {
		  enumerable: true,
		  get: function () {
		    return _getOuterBindingIdentifiers.default;
		  }
		});
		Object.defineProperty(exports$1, "inheritInnerComments", {
		  enumerable: true,
		  get: function () {
		    return _inheritInnerComments.default;
		  }
		});
		Object.defineProperty(exports$1, "inheritLeadingComments", {
		  enumerable: true,
		  get: function () {
		    return _inheritLeadingComments.default;
		  }
		});
		Object.defineProperty(exports$1, "inheritTrailingComments", {
		  enumerable: true,
		  get: function () {
		    return _inheritTrailingComments.default;
		  }
		});
		Object.defineProperty(exports$1, "inherits", {
		  enumerable: true,
		  get: function () {
		    return _inherits.default;
		  }
		});
		Object.defineProperty(exports$1, "inheritsComments", {
		  enumerable: true,
		  get: function () {
		    return _inheritsComments.default;
		  }
		});
		Object.defineProperty(exports$1, "is", {
		  enumerable: true,
		  get: function () {
		    return _is.default;
		  }
		});
		Object.defineProperty(exports$1, "isBinding", {
		  enumerable: true,
		  get: function () {
		    return _isBinding.default;
		  }
		});
		Object.defineProperty(exports$1, "isBlockScoped", {
		  enumerable: true,
		  get: function () {
		    return _isBlockScoped.default;
		  }
		});
		Object.defineProperty(exports$1, "isImmutable", {
		  enumerable: true,
		  get: function () {
		    return _isImmutable.default;
		  }
		});
		Object.defineProperty(exports$1, "isLet", {
		  enumerable: true,
		  get: function () {
		    return _isLet.default;
		  }
		});
		Object.defineProperty(exports$1, "isNode", {
		  enumerable: true,
		  get: function () {
		    return _isNode.default;
		  }
		});
		Object.defineProperty(exports$1, "isNodesEquivalent", {
		  enumerable: true,
		  get: function () {
		    return _isNodesEquivalent.default;
		  }
		});
		Object.defineProperty(exports$1, "isPlaceholderType", {
		  enumerable: true,
		  get: function () {
		    return _isPlaceholderType.default;
		  }
		});
		Object.defineProperty(exports$1, "isReferenced", {
		  enumerable: true,
		  get: function () {
		    return _isReferenced.default;
		  }
		});
		Object.defineProperty(exports$1, "isScope", {
		  enumerable: true,
		  get: function () {
		    return _isScope.default;
		  }
		});
		Object.defineProperty(exports$1, "isSpecifierDefault", {
		  enumerable: true,
		  get: function () {
		    return _isSpecifierDefault.default;
		  }
		});
		Object.defineProperty(exports$1, "isType", {
		  enumerable: true,
		  get: function () {
		    return _isType.default;
		  }
		});
		Object.defineProperty(exports$1, "isValidES3Identifier", {
		  enumerable: true,
		  get: function () {
		    return _isValidES3Identifier.default;
		  }
		});
		Object.defineProperty(exports$1, "isValidIdentifier", {
		  enumerable: true,
		  get: function () {
		    return _isValidIdentifier.default;
		  }
		});
		Object.defineProperty(exports$1, "isVar", {
		  enumerable: true,
		  get: function () {
		    return _isVar.default;
		  }
		});
		Object.defineProperty(exports$1, "matchesPattern", {
		  enumerable: true,
		  get: function () {
		    return _matchesPattern.default;
		  }
		});
		Object.defineProperty(exports$1, "prependToMemberExpression", {
		  enumerable: true,
		  get: function () {
		    return _prependToMemberExpression.default;
		  }
		});
		exports$1.react = void 0;
		Object.defineProperty(exports$1, "removeComments", {
		  enumerable: true,
		  get: function () {
		    return _removeComments.default;
		  }
		});
		Object.defineProperty(exports$1, "removeProperties", {
		  enumerable: true,
		  get: function () {
		    return _removeProperties.default;
		  }
		});
		Object.defineProperty(exports$1, "removePropertiesDeep", {
		  enumerable: true,
		  get: function () {
		    return _removePropertiesDeep.default;
		  }
		});
		Object.defineProperty(exports$1, "removeTypeDuplicates", {
		  enumerable: true,
		  get: function () {
		    return _removeTypeDuplicates.default;
		  }
		});
		Object.defineProperty(exports$1, "shallowEqual", {
		  enumerable: true,
		  get: function () {
		    return _shallowEqual.default;
		  }
		});
		Object.defineProperty(exports$1, "toBindingIdentifierName", {
		  enumerable: true,
		  get: function () {
		    return _toBindingIdentifierName.default;
		  }
		});
		Object.defineProperty(exports$1, "toBlock", {
		  enumerable: true,
		  get: function () {
		    return _toBlock.default;
		  }
		});
		Object.defineProperty(exports$1, "toComputedKey", {
		  enumerable: true,
		  get: function () {
		    return _toComputedKey.default;
		  }
		});
		Object.defineProperty(exports$1, "toExpression", {
		  enumerable: true,
		  get: function () {
		    return _toExpression.default;
		  }
		});
		Object.defineProperty(exports$1, "toIdentifier", {
		  enumerable: true,
		  get: function () {
		    return _toIdentifier.default;
		  }
		});
		Object.defineProperty(exports$1, "toKeyAlias", {
		  enumerable: true,
		  get: function () {
		    return _toKeyAlias.default;
		  }
		});
		Object.defineProperty(exports$1, "toStatement", {
		  enumerable: true,
		  get: function () {
		    return _toStatement.default;
		  }
		});
		Object.defineProperty(exports$1, "traverse", {
		  enumerable: true,
		  get: function () {
		    return _traverse.default;
		  }
		});
		Object.defineProperty(exports$1, "traverseFast", {
		  enumerable: true,
		  get: function () {
		    return _traverseFast.default;
		  }
		});
		Object.defineProperty(exports$1, "validate", {
		  enumerable: true,
		  get: function () {
		    return _validate.default;
		  }
		});
		Object.defineProperty(exports$1, "valueToNode", {
		  enumerable: true,
		  get: function () {
		    return _valueToNode.default;
		  }
		});
		var _isReactComponent = requireIsReactComponent();
		var _isCompatTag = requireIsCompatTag();
		var _buildChildren = requireBuildChildren();
		var _assertNode = requireAssertNode();
		var _index = requireGenerated$1();
		Object.keys(_index).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		  if (key in exports$1 && exports$1[key] === _index[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _index[key];
		    }
		  });
		});
		var _createTypeAnnotationBasedOnTypeof = requireCreateTypeAnnotationBasedOnTypeof();
		var _createFlowUnionType = requireCreateFlowUnionType();
		var _createTSUnionType = requireCreateTSUnionType();
		var _productions = requireProductions();
		Object.keys(_productions).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		  if (key in exports$1 && exports$1[key] === _productions[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _productions[key];
		    }
		  });
		});
		var _index2 = requireGenerated$2();
		Object.keys(_index2).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		  if (key in exports$1 && exports$1[key] === _index2[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _index2[key];
		    }
		  });
		});
		var _cloneNode = requireCloneNode();
		var _clone = requireClone();
		var _cloneDeep = requireCloneDeep();
		var _cloneDeepWithoutLoc = requireCloneDeepWithoutLoc();
		var _cloneWithoutLoc = requireCloneWithoutLoc();
		var _addComment = requireAddComment();
		var _addComments = requireAddComments();
		var _inheritInnerComments = requireInheritInnerComments();
		var _inheritLeadingComments = requireInheritLeadingComments();
		var _inheritsComments = requireInheritsComments();
		var _inheritTrailingComments = requireInheritTrailingComments();
		var _removeComments = requireRemoveComments();
		var _index3 = requireGenerated();
		Object.keys(_index3).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		  if (key in exports$1 && exports$1[key] === _index3[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _index3[key];
		    }
		  });
		});
		var _index4 = requireConstants();
		Object.keys(_index4).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		  if (key in exports$1 && exports$1[key] === _index4[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _index4[key];
		    }
		  });
		});
		var _ensureBlock = requireEnsureBlock();
		var _toBindingIdentifierName = requireToBindingIdentifierName();
		var _toBlock = requireToBlock();
		var _toComputedKey = requireToComputedKey();
		var _toExpression = requireToExpression();
		var _toIdentifier = requireToIdentifier();
		var _toKeyAlias = requireToKeyAlias();
		var _toStatement = requireToStatement();
		var _valueToNode = requireValueToNode();
		var _index5 = requireDefinitions();
		Object.keys(_index5).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		  if (key in exports$1 && exports$1[key] === _index5[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _index5[key];
		    }
		  });
		});
		var _appendToMemberExpression = requireAppendToMemberExpression();
		var _inherits = requireInherits();
		var _prependToMemberExpression = requirePrependToMemberExpression();
		var _removeProperties = requireRemoveProperties();
		var _removePropertiesDeep = requireRemovePropertiesDeep();
		var _removeTypeDuplicates = requireRemoveTypeDuplicates$1();
		var _getAssignmentIdentifiers = requireGetAssignmentIdentifiers();
		var _getBindingIdentifiers = requireGetBindingIdentifiers();
		var _getOuterBindingIdentifiers = requireGetOuterBindingIdentifiers();
		var _getFunctionName = requireGetFunctionName();
		var _traverse = requireTraverse();
		Object.keys(_traverse).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		  if (key in exports$1 && exports$1[key] === _traverse[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _traverse[key];
		    }
		  });
		});
		var _traverseFast = requireTraverseFast();
		var _shallowEqual = requireShallowEqual();
		var _is = requireIs();
		var _isBinding = requireIsBinding();
		var _isBlockScoped = requireIsBlockScoped();
		var _isImmutable = requireIsImmutable();
		var _isLet = requireIsLet();
		var _isNode = requireIsNode();
		var _isNodesEquivalent = requireIsNodesEquivalent();
		var _isPlaceholderType = requireIsPlaceholderType();
		var _isReferenced = requireIsReferenced();
		var _isScope = requireIsScope();
		var _isSpecifierDefault = requireIsSpecifierDefault();
		var _isType = requireIsType();
		var _isValidES3Identifier = requireIsValidES3Identifier();
		var _isValidIdentifier = requireIsValidIdentifier();
		var _isVar = requireIsVar();
		var _matchesPattern = requireMatchesPattern();
		var _validate = requireValidate();
		var _buildMatchMemberExpression = requireBuildMatchMemberExpression();
		var _index6 = requireGenerated$3();
		Object.keys(_index6).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
		  if (key in exports$1 && exports$1[key] === _index6[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _index6[key];
		    }
		  });
		});
		var _deprecationWarning = requireDeprecationWarning();
		var _toSequenceExpression = requireToSequenceExpression();
		exports$1.react = {
		  isReactComponent: _isReactComponent.default,
		  isCompatTag: _isCompatTag.default,
		  buildChildren: _buildChildren.default
		};
		exports$1.toSequenceExpression = _toSequenceExpression.default;
		if (browser$1.env.BABEL_TYPES_8_BREAKING) {
		  console.warn("BABEL_TYPES_8_BREAKING is not supported anymore. Use the latest Babel 8.0.0 pre-release instead!");
		}

		
	} (lib$2));
	return lib$2;
}

var hasRequiredParentheses;

function requireParentheses () {
	if (hasRequiredParentheses) return parentheses;
	hasRequiredParentheses = 1;

	Object.defineProperty(parentheses, "__esModule", {
	  value: true
	});
	parentheses.AssignmentExpression = AssignmentExpression;
	parentheses.BinaryExpression = BinaryExpression;
	parentheses.ClassExpression = ClassExpression;
	parentheses.ArrowFunctionExpression = parentheses.ConditionalExpression = ConditionalExpression;
	parentheses.DoExpression = DoExpression;
	parentheses.FunctionExpression = FunctionExpression;
	parentheses.FunctionTypeAnnotation = FunctionTypeAnnotation;
	parentheses.Identifier = Identifier;
	parentheses.LogicalExpression = LogicalExpression;
	parentheses.NullableTypeAnnotation = NullableTypeAnnotation;
	parentheses.ObjectExpression = ObjectExpression;
	parentheses.OptionalIndexedAccessType = OptionalIndexedAccessType;
	parentheses.OptionalCallExpression = parentheses.OptionalMemberExpression = OptionalMemberExpression;
	parentheses.SequenceExpression = SequenceExpression;
	parentheses.TSSatisfiesExpression = parentheses.TSAsExpression = TSAsExpression;
	parentheses.TSConditionalType = TSConditionalType;
	parentheses.TSConstructorType = parentheses.TSFunctionType = TSFunctionType;
	parentheses.TSInferType = TSInferType;
	parentheses.TSInstantiationExpression = TSInstantiationExpression;
	parentheses.TSIntersectionType = TSIntersectionType;
	parentheses.SpreadElement = parentheses.UnaryExpression = parentheses.TSTypeAssertion = UnaryLike;
	parentheses.TSTypeOperator = TSTypeOperator;
	parentheses.TSUnionType = TSUnionType;
	parentheses.IntersectionTypeAnnotation = parentheses.UnionTypeAnnotation = UnionTypeAnnotation;
	parentheses.UpdateExpression = UpdateExpression;
	parentheses.AwaitExpression = parentheses.YieldExpression = YieldExpression;
	var _t = requireLib$1();
	var _index = requireNode();
	const {
	  isMemberExpression,
	  isOptionalMemberExpression,
	  isYieldExpression,
	  isStatement
	} = _t;
	const PRECEDENCE = new Map([["||", 0], ["??", 1], ["&&", 2], ["|", 3], ["^", 4], ["&", 5], ["==", 6], ["===", 6], ["!=", 6], ["!==", 6], ["<", 7], [">", 7], ["<=", 7], [">=", 7], ["in", 7], ["instanceof", 7], [">>", 8], ["<<", 8], [">>>", 8], ["+", 9], ["-", 9], ["*", 10], ["/", 10], ["%", 10], ["**", 11]]);
	function isTSTypeExpression(nodeId) {
	  return nodeId === 156 || nodeId === 201 || nodeId === 209;
	}
	const isClassExtendsClause = (node, parent, parentId) => {
	  return (parentId === 21 || parentId === 22) && parent.superClass === node;
	};
	const hasPostfixPart = (node, parent, parentId) => {
	  switch (parentId) {
	    case 108:
	    case 132:
	      return parent.object === node;
	    case 17:
	    case 130:
	    case 112:
	      return parent.callee === node;
	    case 222:
	      return parent.tag === node;
	    case 191:
	      return true;
	  }
	  return false;
	};
	function NullableTypeAnnotation(node, parent, parentId) {
	  return parentId === 4;
	}
	function FunctionTypeAnnotation(node, parent, parentId, tokenContext) {
	  return (parentId === 239 || parentId === 90 || parentId === 4 || (tokenContext & _index.TokenContext.arrowFlowReturnType) > 0
	  );
	}
	function UpdateExpression(node, parent, parentId) {
	  return hasPostfixPart(node, parent, parentId) || isClassExtendsClause(node, parent, parentId);
	}
	function needsParenBeforeExpressionBrace(tokenContext) {
	  return (tokenContext & (_index.TokenContext.expressionStatement | _index.TokenContext.arrowBody)) > 0;
	}
	function ObjectExpression(node, parent, parentId, tokenContext) {
	  return needsParenBeforeExpressionBrace(tokenContext);
	}
	function DoExpression(node, parent, parentId, tokenContext) {
	  return (tokenContext & _index.TokenContext.expressionStatement) > 0 && !node.async;
	}
	function BinaryLike(node, parent, parentId, nodeType) {
	  if (isClassExtendsClause(node, parent, parentId)) {
	    return true;
	  }
	  if (hasPostfixPart(node, parent, parentId) || parentId === 238 || parentId === 145 || parentId === 8) {
	    return true;
	  }
	  let parentPos;
	  switch (parentId) {
	    case 10:
	    case 107:
	      parentPos = PRECEDENCE.get(parent.operator);
	      break;
	    case 156:
	    case 201:
	      parentPos = 7;
	  }
	  if (parentPos !== undefined) {
	    const nodePos = nodeType === 2 ? 7 : PRECEDENCE.get(node.operator);
	    if (parentPos > nodePos) return true;
	    if (parentPos === nodePos && parentId === 10 && (nodePos === 11 ? parent.left === node : parent.right === node)) {
	      return true;
	    }
	    if (nodeType === 1 && parentId === 107 && (nodePos === 1 && parentPos !== 1 || parentPos === 1 && nodePos !== 1)) {
	      return true;
	    }
	  }
	  return false;
	}
	function UnionTypeAnnotation(node, parent, parentId) {
	  switch (parentId) {
	    case 4:
	    case 115:
	    case 90:
	    case 239:
	      return true;
	  }
	  return false;
	}
	function OptionalIndexedAccessType(node, parent, parentId) {
	  return parentId === 84 && parent.objectType === node;
	}
	function TSAsExpression(node, parent, parentId) {
	  if ((parentId === 6 || parentId === 7) && parent.left === node) {
	    return true;
	  }
	  if (parentId === 10 && (parent.operator === "|" || parent.operator === "&") && node === parent.left) {
	    return true;
	  }
	  return BinaryLike(node, parent, parentId, 2);
	}
	function TSConditionalType(node, parent, parentId) {
	  switch (parentId) {
	    case 155:
	    case 195:
	    case 211:
	    case 212:
	      return true;
	    case 175:
	      return parent.objectType === node;
	    case 181:
	    case 219:
	      return parent.types[0] === node;
	    case 161:
	      return parent.checkType === node || parent.extendsType === node;
	  }
	  return false;
	}
	function TSUnionType(node, parent, parentId) {
	  switch (parentId) {
	    case 181:
	    case 211:
	    case 155:
	    case 195:
	      return true;
	    case 175:
	      return parent.objectType === node;
	  }
	  return false;
	}
	function TSIntersectionType(node, parent, parentId) {
	  return parentId === 211 || TSTypeOperator(node, parent, parentId);
	}
	function TSInferType(node, parent, parentId) {
	  if (TSTypeOperator(node, parent, parentId)) {
	    return true;
	  }
	  if ((parentId === 181 || parentId === 219) && node.typeParameter.constraint && parent.types[0] === node) {
	    return true;
	  }
	  return false;
	}
	function TSTypeOperator(node, parent, parentId) {
	  switch (parentId) {
	    case 155:
	    case 195:
	      return true;
	    case 175:
	      if (parent.objectType === node) {
	        return true;
	      }
	  }
	  return false;
	}
	function TSInstantiationExpression(node, parent, parentId) {
	  switch (parentId) {
	    case 17:
	    case 130:
	    case 112:
	    case 177:
	      return (parent.typeParameters
	      ) != null;
	  }
	  return false;
	}
	function TSFunctionType(node, parent, parentId) {
	  if (TSUnionType(node, parent, parentId)) return true;
	  return parentId === 219 || parentId === 161 && (parent.checkType === node || parent.extendsType === node);
	}
	function BinaryExpression(node, parent, parentId, tokenContext) {
	  if (BinaryLike(node, parent, parentId, 0)) return true;
	  return (tokenContext & _index.TokenContext.forInOrInitHeadAccumulate) > 0 && node.operator === "in";
	}
	function LogicalExpression(node, parent, parentId) {
	  return BinaryLike(node, parent, parentId, 1);
	}
	function SequenceExpression(node, parent, parentId) {
	  if (parentId === 144 || parentId === 133 || parentId === 108 && parent.property === node || parentId === 132 && parent.property === node || parentId === 224) {
	    return false;
	  }
	  if (parentId === 21) {
	    return true;
	  }
	  if (parentId === 68) {
	    return parent.right === node;
	  }
	  if (parentId === 60) {
	    return true;
	  }
	  return !isStatement(parent);
	}
	function YieldExpression(node, parent, parentId) {
	  return parentId === 10 || parentId === 107 || parentId === 238 || parentId === 145 || hasPostfixPart(node, parent, parentId) || parentId === 8 && isYieldExpression(node) || parentId === 28 && node === parent.test || isClassExtendsClause(node, parent, parentId) || isTSTypeExpression(parentId);
	}
	function ClassExpression(node, parent, parentId, tokenContext) {
	  return (tokenContext & (_index.TokenContext.expressionStatement | _index.TokenContext.exportDefault)) > 0;
	}
	function UnaryLike(node, parent, parentId) {
	  return hasPostfixPart(node, parent, parentId) || parentId === 10 && parent.operator === "**" && parent.left === node || isClassExtendsClause(node, parent, parentId);
	}
	function FunctionExpression(node, parent, parentId, tokenContext) {
	  return (tokenContext & (_index.TokenContext.expressionStatement | _index.TokenContext.exportDefault)) > 0;
	}
	function ConditionalExpression(node, parent, parentId) {
	  switch (parentId) {
	    case 238:
	    case 145:
	    case 10:
	    case 107:
	    case 8:
	      return true;
	    case 28:
	      if (parent.test === node) {
	        return true;
	      }
	  }
	  if (isTSTypeExpression(parentId)) {
	    return true;
	  }
	  return UnaryLike(node, parent, parentId);
	}
	function OptionalMemberExpression(node, parent, parentId) {
	  switch (parentId) {
	    case 17:
	      return parent.callee === node;
	    case 108:
	      return parent.object === node;
	  }
	  return false;
	}
	function AssignmentExpression(node, parent, parentId, tokenContext) {
	  if (needsParenBeforeExpressionBrace(tokenContext) && node.left.type === "ObjectPattern") {
	    return true;
	  }
	  return ConditionalExpression(node, parent, parentId);
	}
	function Identifier(node, parent, parentId, tokenContext, getRawIdentifier) {
	  var _node$extra;
	  if (getRawIdentifier && getRawIdentifier(node) !== node.name) {
	    return false;
	  }
	  if (parentId === 6 && (_node$extra = node.extra) != null && _node$extra.parenthesized && parent.left === node) {
	    const rightType = parent.right.type;
	    if ((rightType === "FunctionExpression" || rightType === "ClassExpression") && parent.right.id == null) {
	      return true;
	    }
	  }
	  if (tokenContext & _index.TokenContext.forOfHead || (parentId === 108 || parentId === 132) && tokenContext & (_index.TokenContext.expressionStatement | _index.TokenContext.forInitHead | _index.TokenContext.forInHead)) {
	    if (node.name === "let") {
	      const isFollowedByBracket = isMemberExpression(parent, {
	        object: node,
	        computed: true
	      }) || isOptionalMemberExpression(parent, {
	        object: node,
	        computed: true,
	        optional: false
	      });
	      if (isFollowedByBracket && tokenContext & (_index.TokenContext.expressionStatement | _index.TokenContext.forInitHead | _index.TokenContext.forInHead)) {
	        return true;
	      }
	      return (tokenContext & _index.TokenContext.forOfHead) > 0;
	    }
	  }
	  return parentId === 68 && parent.left === node && node.name === "async" && !parent.await;
	}

	
	return parentheses;
}

var nodes = {};

var generators = {};

var templateLiterals = {};

var hasRequiredTemplateLiterals;

function requireTemplateLiterals () {
	if (hasRequiredTemplateLiterals) return templateLiterals;
	hasRequiredTemplateLiterals = 1;

	Object.defineProperty(templateLiterals, "__esModule", {
	  value: true
	});
	templateLiterals.TaggedTemplateExpression = TaggedTemplateExpression;
	templateLiterals.TemplateElement = TemplateElement;
	templateLiterals.TemplateLiteral = TemplateLiteral;
	templateLiterals._printTemplate = _printTemplate;
	function TaggedTemplateExpression(node) {
	  this.print(node.tag);
	  this.print(node.typeParameters);
	  this.print(node.quasi);
	}
	function TemplateElement() {
	  throw new Error("TemplateElement printing is handled in TemplateLiteral");
	}
	function _printTemplate(node, substitutions) {
	  const quasis = node.quasis;
	  let partRaw = "`";
	  for (let i = 0; i < quasis.length - 1; i++) {
	    partRaw += quasis[i].value.raw;
	    this.token(partRaw + "${", true);
	    this.print(substitutions[i]);
	    partRaw = "}";
	    if (this.tokenMap) {
	      const token = this.tokenMap.findMatching(node, "}", i);
	      if (token) this._catchUpTo(token.loc.start);
	    }
	  }
	  partRaw += quasis[quasis.length - 1].value.raw;
	  this.token(partRaw + "`", true);
	}
	function TemplateLiteral(node) {
	  _printTemplate.call(this, node, node.expressions);
	}

	
	return templateLiterals;
}

var expressions = {};

var hasRequiredExpressions;

function requireExpressions () {
	if (hasRequiredExpressions) return expressions;
	hasRequiredExpressions = 1;

	Object.defineProperty(expressions, "__esModule", {
	  value: true
	});
	expressions.LogicalExpression = expressions.AssignmentExpression = AssignmentExpression;
	expressions.AssignmentPattern = AssignmentPattern;
	expressions.AwaitExpression = AwaitExpression;
	expressions.BinaryExpression = BinaryExpression;
	expressions.BindExpression = BindExpression;
	expressions.CallExpression = CallExpression;
	expressions.ConditionalExpression = ConditionalExpression;
	expressions.Decorator = Decorator;
	expressions.DoExpression = DoExpression;
	expressions.EmptyStatement = EmptyStatement;
	expressions.ExpressionStatement = ExpressionStatement;
	expressions.Import = Import;
	expressions.MemberExpression = MemberExpression;
	expressions.MetaProperty = MetaProperty;
	expressions.ModuleExpression = ModuleExpression;
	expressions.NewExpression = NewExpression;
	expressions.OptionalCallExpression = OptionalCallExpression;
	expressions.OptionalMemberExpression = OptionalMemberExpression;
	expressions.ParenthesizedExpression = ParenthesizedExpression;
	expressions.PrivateName = PrivateName;
	expressions.SequenceExpression = SequenceExpression;
	expressions.Super = Super;
	expressions.ThisExpression = ThisExpression;
	expressions.UnaryExpression = UnaryExpression;
	expressions.UpdateExpression = UpdateExpression;
	expressions.V8IntrinsicIdentifier = V8IntrinsicIdentifier;
	expressions.YieldExpression = YieldExpression;
	expressions._shouldPrintDecoratorsBeforeExport = _shouldPrintDecoratorsBeforeExport;
	var _t = requireLib$1();
	var _index = requireNode();
	const {
	  isCallExpression,
	  isLiteral,
	  isMemberExpression,
	  isNewExpression,
	  isPattern
	} = _t;
	function UnaryExpression(node) {
	  const {
	    operator
	  } = node;
	  const firstChar = operator.charCodeAt(0);
	  if (firstChar >= 97 && firstChar <= 122) {
	    this.word(operator);
	    this.space();
	  } else {
	    this.tokenChar(firstChar);
	  }
	  this.print(node.argument);
	}
	function DoExpression(node) {
	  if (node.async) {
	    this.word("async", true);
	    this.space();
	  }
	  this.word("do");
	  this.space();
	  this.print(node.body);
	}
	function ParenthesizedExpression(node) {
	  this.tokenChar(40);
	  const oldNoLineTerminatorAfterNode = this.enterDelimited();
	  this.print(node.expression, undefined, true);
	  this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
	  this.rightParens(node);
	}
	function UpdateExpression(node) {
	  if (node.prefix) {
	    this.token(node.operator, false, 0, true);
	    this.print(node.argument);
	  } else {
	    this.print(node.argument, true);
	    this.token(node.operator, false, 0, true);
	  }
	}
	function ConditionalExpression(node) {
	  this.print(node.test);
	  this.space();
	  this.tokenChar(63);
	  this.space();
	  this.print(node.consequent);
	  this.space();
	  this.tokenChar(58);
	  this.space();
	  this.print(node.alternate);
	}
	function NewExpression(node, parent) {
	  this.word("new");
	  this.space();
	  this.print(node.callee);
	  if (this.format.minified && node.arguments.length === 0 && !node.optional && !isCallExpression(parent, {
	    callee: node
	  }) && !isMemberExpression(parent) && !isNewExpression(parent)) {
	    return;
	  }
	  this.print(node.typeArguments);
	  this.print(node.typeParameters);
	  if (node.optional) {
	    this.token("?.");
	  }
	  if (node.arguments.length === 0 && this.tokenMap && !this.tokenMap.endMatches(node, ")")) {
	    return;
	  }
	  this.tokenChar(40);
	  const oldNoLineTerminatorAfterNode = this.enterDelimited();
	  this.printList(node.arguments, this.shouldPrintTrailingComma(")"), undefined, undefined, undefined, true);
	  this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
	  this.rightParens(node);
	}
	function SequenceExpression(node) {
	  this.printList(node.expressions);
	}
	function ThisExpression() {
	  this.word("this");
	}
	function Super() {
	  this.word("super");
	}
	function _shouldPrintDecoratorsBeforeExport(node) {
	  if (typeof this.format.decoratorsBeforeExport === "boolean") {
	    return this.format.decoratorsBeforeExport;
	  }
	  return typeof node.start === "number" && node.start === node.declaration.start;
	}
	function Decorator(node) {
	  this.tokenChar(64);
	  const {
	    expression
	  } = node;
	  this.print(expression);
	  this.newline();
	}
	function OptionalMemberExpression(node) {
	  let {
	    computed
	  } = node;
	  const {
	    optional,
	    property
	  } = node;
	  this.print(node.object);
	  if (!computed && isMemberExpression(property)) {
	    throw new TypeError("Got a MemberExpression for MemberExpression property");
	  }
	  if (isLiteral(property) && typeof property.value === "number") {
	    computed = true;
	  }
	  if (optional) {
	    this.token("?.");
	  }
	  if (computed) {
	    this.tokenChar(91);
	    this.print(property);
	    this.tokenChar(93);
	  } else {
	    if (!optional) {
	      this.tokenChar(46);
	    }
	    this.print(property);
	  }
	}
	function OptionalCallExpression(node) {
	  this.print(node.callee);
	  this.print(node.typeParameters);
	  if (node.optional) {
	    this.token("?.");
	  }
	  this.print(node.typeArguments);
	  this.tokenChar(40);
	  const oldNoLineTerminatorAfterNode = this.enterDelimited();
	  this.printList(node.arguments, undefined, undefined, undefined, undefined, true);
	  this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
	  this.rightParens(node);
	}
	function CallExpression(node) {
	  this.print(node.callee);
	  this.print(node.typeArguments);
	  this.print(node.typeParameters);
	  this.tokenChar(40);
	  const oldNoLineTerminatorAfterNode = this.enterDelimited();
	  this.printList(node.arguments, this.shouldPrintTrailingComma(")"), undefined, undefined, undefined, true);
	  this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
	  this.rightParens(node);
	}
	function Import() {
	  this.word("import");
	}
	function AwaitExpression(node) {
	  this.word("await");
	  this.space();
	  this.print(node.argument);
	}
	function YieldExpression(node) {
	  if (node.delegate) {
	    this.word("yield", true);
	    this.tokenChar(42);
	    if (node.argument) {
	      this.space();
	      this.print(node.argument);
	    }
	  } else if (node.argument) {
	    this.word("yield", true);
	    this.space();
	    this.print(node.argument);
	  } else {
	    this.word("yield");
	  }
	}
	function EmptyStatement() {
	  this.semicolon(true);
	}
	function ExpressionStatement(node) {
	  this.tokenContext |= _index.TokenContext.expressionStatement;
	  this.print(node.expression);
	  this.semicolon();
	}
	function AssignmentPattern(node) {
	  this.print(node.left);
	  if (node.left.type === "Identifier" || isPattern(node.left)) {
	    if (node.left.optional) this.tokenChar(63);
	    this.print(node.left.typeAnnotation);
	  }
	  this.space();
	  this.tokenChar(61);
	  this.space();
	  this.print(node.right);
	}
	function AssignmentExpression(node) {
	  this.print(node.left);
	  this.space();
	  this.token(node.operator, false, 0, true);
	  this.space();
	  this.print(node.right);
	}
	function BinaryExpression(node) {
	  this.print(node.left);
	  this.space();
	  const {
	    operator
	  } = node;
	  if (operator.charCodeAt(0) === 105) {
	    this.word(operator);
	  } else {
	    this.token(operator, false, 0, true);
	    this.setLastChar(operator.charCodeAt(operator.length - 1));
	  }
	  this.space();
	  this.print(node.right);
	}
	function BindExpression(node) {
	  this.print(node.object);
	  this.token("::");
	  this.print(node.callee);
	}
	function MemberExpression(node) {
	  this.print(node.object);
	  if (!node.computed && isMemberExpression(node.property)) {
	    throw new TypeError("Got a MemberExpression for MemberExpression property");
	  }
	  let computed = node.computed;
	  if (isLiteral(node.property) && typeof node.property.value === "number") {
	    computed = true;
	  }
	  if (computed) {
	    const oldNoLineTerminatorAfterNode = this.enterDelimited();
	    this.tokenChar(91);
	    this.print(node.property, undefined, true);
	    this.tokenChar(93);
	    this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
	  } else {
	    this.tokenChar(46);
	    this.print(node.property);
	  }
	}
	function MetaProperty(node) {
	  this.print(node.meta);
	  this.tokenChar(46);
	  this.print(node.property);
	}
	function PrivateName(node) {
	  this.tokenChar(35);
	  this.print(node.id);
	}
	function V8IntrinsicIdentifier(node) {
	  this.tokenChar(37);
	  this.word(node.name);
	}
	function ModuleExpression(node) {
	  this.word("module", true);
	  this.space();
	  this.tokenChar(123);
	  this.indent();
	  const {
	    body
	  } = node;
	  if (body.body.length || body.directives.length) {
	    this.newline();
	  }
	  this.print(body);
	  this.dedent();
	  this.rightBrace(node);
	}

	
	return expressions;
}

var statements = {};

var hasRequiredStatements;

function requireStatements () {
	if (hasRequiredStatements) return statements;
	hasRequiredStatements = 1;

	Object.defineProperty(statements, "__esModule", {
	  value: true
	});
	statements.BreakStatement = BreakStatement;
	statements.CatchClause = CatchClause;
	statements.ContinueStatement = ContinueStatement;
	statements.DebuggerStatement = DebuggerStatement;
	statements.DoWhileStatement = DoWhileStatement;
	statements.ForInStatement = ForInStatement;
	statements.ForOfStatement = ForOfStatement;
	statements.ForStatement = ForStatement;
	statements.IfStatement = IfStatement;
	statements.LabeledStatement = LabeledStatement;
	statements.ReturnStatement = ReturnStatement;
	statements.SwitchCase = SwitchCase;
	statements.SwitchStatement = SwitchStatement;
	statements.ThrowStatement = ThrowStatement;
	statements.TryStatement = TryStatement;
	statements.VariableDeclaration = VariableDeclaration;
	statements.VariableDeclarator = VariableDeclarator;
	statements.WhileStatement = WhileStatement;
	statements.WithStatement = WithStatement;
	var _t = requireLib$1();
	var _index = requireNode();
	const {
	  isFor,
	  isIfStatement,
	  isStatement
	} = _t;
	function WithStatement(node) {
	  this.word("with");
	  this.space();
	  this.tokenChar(40);
	  this.print(node.object);
	  this.tokenChar(41);
	  this.printBlock(node.body);
	}
	function IfStatement(node) {
	  this.word("if");
	  this.space();
	  this.tokenChar(40);
	  this.print(node.test);
	  this.tokenChar(41);
	  this.space();
	  const needsBlock = node.alternate && isIfStatement(getLastStatement(node.consequent));
	  if (needsBlock) {
	    this.tokenChar(123);
	    this.newline();
	    this.indent();
	  }
	  this.printAndIndentOnComments(node.consequent);
	  if (needsBlock) {
	    this.dedent();
	    this.newline();
	    this.tokenChar(125);
	  }
	  if (node.alternate) {
	    if (this.endsWith(125)) this.space();
	    this.word("else");
	    this.space();
	    this.printAndIndentOnComments(node.alternate);
	  }
	}
	function getLastStatement(statement) {
	  const {
	    body
	  } = statement;
	  if (isStatement(body) === false) {
	    return statement;
	  }
	  return getLastStatement(body);
	}
	function ForStatement(node) {
	  this.word("for");
	  this.space();
	  this.tokenChar(40);
	  this.tokenContext |= _index.TokenContext.forInitHead | _index.TokenContext.forInOrInitHeadAccumulate;
	  this.print(node.init);
	  this.tokenContext = _index.TokenContext.normal;
	  this.tokenChar(59);
	  if (node.test) {
	    this.space();
	    this.print(node.test);
	  }
	  this.tokenChar(59, 1);
	  if (node.update) {
	    this.space();
	    this.print(node.update);
	  }
	  this.tokenChar(41);
	  this.printBlock(node.body);
	}
	function WhileStatement(node) {
	  this.word("while");
	  this.space();
	  this.tokenChar(40);
	  this.print(node.test);
	  this.tokenChar(41);
	  this.printBlock(node.body);
	}
	function ForInStatement(node) {
	  this.word("for");
	  this.space();
	  this.noIndentInnerCommentsHere();
	  this.tokenChar(40);
	  this.tokenContext |= _index.TokenContext.forInHead | _index.TokenContext.forInOrInitHeadAccumulate;
	  this.print(node.left);
	  this.tokenContext = _index.TokenContext.normal;
	  this.space();
	  this.word("in");
	  this.space();
	  this.print(node.right);
	  this.tokenChar(41);
	  this.printBlock(node.body);
	}
	function ForOfStatement(node) {
	  this.word("for");
	  this.space();
	  if (node.await) {
	    this.word("await");
	    this.space();
	  }
	  this.noIndentInnerCommentsHere();
	  this.tokenChar(40);
	  this.tokenContext |= _index.TokenContext.forOfHead;
	  this.print(node.left);
	  this.space();
	  this.word("of");
	  this.space();
	  this.print(node.right);
	  this.tokenChar(41);
	  this.printBlock(node.body);
	}
	function DoWhileStatement(node) {
	  this.word("do");
	  this.space();
	  this.print(node.body);
	  this.space();
	  this.word("while");
	  this.space();
	  this.tokenChar(40);
	  this.print(node.test);
	  this.tokenChar(41);
	  this.semicolon();
	}
	function printStatementAfterKeyword(printer, node) {
	  if (node) {
	    printer.space();
	    printer.printTerminatorless(node);
	  }
	  printer.semicolon();
	}
	function BreakStatement(node) {
	  this.word("break");
	  printStatementAfterKeyword(this, node.label);
	}
	function ContinueStatement(node) {
	  this.word("continue");
	  printStatementAfterKeyword(this, node.label);
	}
	function ReturnStatement(node) {
	  this.word("return");
	  printStatementAfterKeyword(this, node.argument);
	}
	function ThrowStatement(node) {
	  this.word("throw");
	  printStatementAfterKeyword(this, node.argument);
	}
	function LabeledStatement(node) {
	  this.print(node.label);
	  this.tokenChar(58);
	  this.space();
	  this.print(node.body);
	}
	function TryStatement(node) {
	  this.word("try");
	  this.space();
	  this.print(node.block);
	  this.space();
	  if (node.handlers) {
	    this.print(node.handlers[0]);
	  } else {
	    this.print(node.handler);
	  }
	  if (node.finalizer) {
	    this.space();
	    this.word("finally");
	    this.space();
	    this.print(node.finalizer);
	  }
	}
	function CatchClause(node) {
	  this.word("catch");
	  this.space();
	  if (node.param) {
	    this.tokenChar(40);
	    this.print(node.param);
	    this.print(node.param.typeAnnotation);
	    this.tokenChar(41);
	    this.space();
	  }
	  this.print(node.body);
	}
	function SwitchStatement(node) {
	  this.word("switch");
	  this.space();
	  this.tokenChar(40);
	  this.print(node.discriminant);
	  this.tokenChar(41);
	  this.space();
	  this.tokenChar(123);
	  this.printSequence(node.cases, true);
	  this.rightBrace(node);
	}
	function SwitchCase(node) {
	  if (node.test) {
	    this.word("case");
	    this.space();
	    this.print(node.test);
	    this.tokenChar(58);
	  } else {
	    this.word("default");
	    this.tokenChar(58);
	  }
	  if (node.consequent.length) {
	    this.newline();
	    this.printSequence(node.consequent, true);
	  }
	}
	function DebuggerStatement() {
	  this.word("debugger");
	  this.semicolon();
	}
	function commaSeparatorWithNewline(occurrenceCount) {
	  this.tokenChar(44, occurrenceCount);
	  this.newline();
	}
	function VariableDeclaration(node, parent) {
	  if (node.declare) {
	    this.word("declare");
	    this.space();
	  }
	  const {
	    kind
	  } = node;
	  switch (kind) {
	    case "await using":
	      this.word("await");
	      this.space();
	    case "using":
	      this.word("using", true);
	      break;
	    default:
	      this.word(kind);
	  }
	  this.space();
	  let hasInits = false;
	  if (!isFor(parent)) {
	    for (const declar of node.declarations) {
	      if (declar.init) {
	        hasInits = true;
	        break;
	      }
	    }
	  }
	  this.printList(node.declarations, undefined, undefined, node.declarations.length > 1, hasInits ? commaSeparatorWithNewline : undefined);
	  if (parent != null) {
	    switch (parent.type) {
	      case "ForStatement":
	        if (parent.init === node) {
	          return;
	        }
	        break;
	      case "ForInStatement":
	      case "ForOfStatement":
	        if (parent.left === node) {
	          return;
	        }
	    }
	  }
	  this.semicolon();
	}
	function VariableDeclarator(node) {
	  this.print(node.id);
	  if (node.definite) this.tokenChar(33);
	  this.print(node.id.typeAnnotation);
	  if (node.init) {
	    this.space();
	    this.tokenChar(61);
	    this.space();
	    this.print(node.init);
	  }
	}

	
	return statements;
}

var classes = {};

var typescript = {};

var methods = {};

var hasRequiredMethods;

function requireMethods () {
	if (hasRequiredMethods) return methods;
	hasRequiredMethods = 1;

	Object.defineProperty(methods, "__esModule", {
	  value: true
	});
	methods.ArrowFunctionExpression = ArrowFunctionExpression;
	methods.FunctionDeclaration = methods.FunctionExpression = FunctionExpression;
	methods._functionHead = _functionHead;
	methods._methodHead = _methodHead;
	methods._param = _param;
	methods._parameters = _parameters;
	methods._params = _params;
	methods._predicate = _predicate;
	methods._shouldPrintArrowParamsParens = _shouldPrintArrowParamsParens;
	var _t = requireLib$1();
	var _index = requireNode();
	const {
	  isIdentifier
	} = _t;
	function _params(node, noLineTerminator, idNode, parentNode) {
	  this.print(node.typeParameters);
	  if (idNode !== undefined || parentNode !== undefined) {
	    const nameInfo = _getFuncIdName.call(this, idNode, parentNode);
	    if (nameInfo) {
	      this.sourceIdentifierName(nameInfo.name, nameInfo.pos);
	    }
	  }
	  this.tokenChar(40);
	  _parameters.call(this, node.params, 41);
	  this.print(node.returnType, noLineTerminator);
	  this._noLineTerminator = noLineTerminator;
	}
	function _parameters(parameters, endToken) {
	  const oldNoLineTerminatorAfterNode = this.enterDelimited();
	  const trailingComma = this.shouldPrintTrailingComma(endToken);
	  const paramLength = parameters.length;
	  for (let i = 0; i < paramLength; i++) {
	    _param.call(this, parameters[i]);
	    if (trailingComma || i < paramLength - 1) {
	      this.tokenChar(44, i);
	      this.space();
	    }
	  }
	  this.tokenChar(endToken);
	  this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
	}
	function _param(parameter) {
	  this.printJoin(parameter.decorators, undefined, undefined, undefined, undefined, true);
	  this.print(parameter, undefined, true);
	  if (parameter.optional) {
	    this.tokenChar(63);
	  }
	  this.print(parameter.typeAnnotation, undefined, true);
	}
	function _methodHead(node) {
	  const kind = node.kind;
	  const key = node.key;
	  if (kind === "get" || kind === "set") {
	    this.word(kind);
	    this.space();
	  }
	  if (node.async) {
	    this.word("async", true);
	    this.space();
	  }
	  if (kind === "method" || kind === "init") {
	    if (node.generator) {
	      this.tokenChar(42);
	    }
	  }
	  if (node.computed) {
	    this.tokenChar(91);
	    this.print(key);
	    this.tokenChar(93);
	  } else {
	    this.print(key);
	  }
	  if (node.optional) {
	    this.tokenChar(63);
	  }
	  if (this._buf._map) {
	    _params.call(this, node, false, node.computed && node.key.type !== "StringLiteral" ? undefined : node.key);
	  } else {
	    _params.call(this, node, false);
	  }
	}
	function _predicate(node, noLineTerminatorAfter) {
	  if (node.predicate) {
	    if (!node.returnType) {
	      this.tokenChar(58);
	    }
	    this.space();
	    this.print(node.predicate, noLineTerminatorAfter);
	  }
	}
	function _functionHead(node, parent, hasPredicate) {
	  if (node.async) {
	    this.word("async");
	    if (!this.format.preserveFormat) {
	      this._innerCommentsState = 0;
	    }
	    this.space();
	  }
	  this.word("function");
	  if (node.generator) {
	    if (!this.format.preserveFormat) {
	      this._innerCommentsState = 0;
	    }
	    this.tokenChar(42);
	  }
	  this.space();
	  if (node.id) {
	    this.print(node.id);
	  }
	  if (this._buf._map) {
	    _params.call(this, node, false, node.id, parent);
	  } else {
	    _params.call(this, node, false);
	  }
	  if (hasPredicate) {
	    _predicate.call(this, node);
	  }
	}
	function FunctionExpression(node, parent) {
	  _functionHead.call(this, node, parent, true);
	  this.space();
	  this.print(node.body);
	}
	function ArrowFunctionExpression(node, parent) {
	  if (node.async) {
	    this.word("async", true);
	    this.space();
	  }
	  if (_shouldPrintArrowParamsParens.call(this, node)) {
	    _params.call(this, node, true, undefined, this._buf._map ? parent : undefined);
	  } else {
	    this.print(node.params[0], true);
	  }
	  _predicate.call(this, node, true);
	  this.space();
	  this.printInnerComments();
	  this.token("=>");
	  this.space();
	  this.tokenContext |= _index.TokenContext.arrowBody;
	  this.print(node.body);
	}
	function _shouldPrintArrowParamsParens(node) {
	  var _firstParam$leadingCo, _firstParam$trailingC;
	  if (node.params.length !== 1) return true;
	  if (node.typeParameters || node.returnType || node.predicate) {
	    return true;
	  }
	  const firstParam = node.params[0];
	  if (!isIdentifier(firstParam) || firstParam.typeAnnotation || firstParam.optional || (_firstParam$leadingCo = firstParam.leadingComments) != null && _firstParam$leadingCo.length || (_firstParam$trailingC = firstParam.trailingComments) != null && _firstParam$trailingC.length) {
	    return true;
	  }
	  if (this.tokenMap) {
	    if (node.loc == null) return true;
	    if (this.tokenMap.findMatching(node, "(") !== null) return true;
	    const arrowToken = this.tokenMap.findMatching(node, "=>");
	    if ((arrowToken == null ? void 0 : arrowToken.loc) == null) return true;
	    return arrowToken.loc.start.line !== node.loc.start.line;
	  }
	  if (this.format.retainLines) return true;
	  return false;
	}
	function _getFuncIdName(idNode, parent) {
	  let id = idNode;
	  if (!id && parent) {
	    const parentType = parent.type;
	    if (parentType === "VariableDeclarator") {
	      id = parent.id;
	    } else if (parentType === "AssignmentExpression" || parentType === "AssignmentPattern") {
	      id = parent.left;
	    } else if (parentType === "ObjectProperty" || parentType === "ClassProperty") {
	      if (!parent.computed || parent.key.type === "StringLiteral") {
	        id = parent.key;
	      }
	    } else if (parentType === "ClassPrivateProperty" || parentType === "ClassAccessorProperty") {
	      id = parent.key;
	    }
	  }
	  if (!id) return;
	  let nameInfo;
	  if (id.type === "Identifier") {
	    var _id$loc, _id$loc2;
	    nameInfo = {
	      pos: (_id$loc = id.loc) == null ? void 0 : _id$loc.start,
	      name: ((_id$loc2 = id.loc) == null ? void 0 : _id$loc2.identifierName) || id.name
	    };
	  } else if (id.type === "PrivateName") {
	    var _id$loc3;
	    nameInfo = {
	      pos: (_id$loc3 = id.loc) == null ? void 0 : _id$loc3.start,
	      name: "#" + id.id.name
	    };
	  } else if (id.type === "StringLiteral") {
	    var _id$loc4;
	    nameInfo = {
	      pos: (_id$loc4 = id.loc) == null ? void 0 : _id$loc4.start,
	      name: id.value
	    };
	  }
	  return nameInfo;
	}

	
	return methods;
}

var hasRequiredTypescript;

function requireTypescript () {
	if (hasRequiredTypescript) return typescript;
	hasRequiredTypescript = 1;

	Object.defineProperty(typescript, "__esModule", {
	  value: true
	});
	typescript.TSAnyKeyword = TSAnyKeyword;
	typescript.TSArrayType = TSArrayType;
	typescript.TSAsExpression = TSAsExpression;
	typescript.TSBigIntKeyword = TSBigIntKeyword;
	typescript.TSBooleanKeyword = TSBooleanKeyword;
	typescript.TSCallSignatureDeclaration = TSCallSignatureDeclaration;
	typescript.TSInterfaceHeritage = typescript.TSClassImplements = TSClassImplements;
	typescript.TSConditionalType = TSConditionalType;
	typescript.TSConstructSignatureDeclaration = TSConstructSignatureDeclaration;
	typescript.TSConstructorType = TSConstructorType;
	typescript.TSDeclareFunction = TSDeclareFunction;
	typescript.TSDeclareMethod = TSDeclareMethod;
	typescript.TSEnumBody = TSEnumBody;
	typescript.TSEnumDeclaration = TSEnumDeclaration;
	typescript.TSEnumMember = TSEnumMember;
	typescript.TSExportAssignment = TSExportAssignment;
	typescript.TSExternalModuleReference = TSExternalModuleReference;
	typescript.TSFunctionType = TSFunctionType;
	typescript.TSImportEqualsDeclaration = TSImportEqualsDeclaration;
	typescript.TSImportType = TSImportType;
	typescript.TSIndexSignature = TSIndexSignature;
	typescript.TSIndexedAccessType = TSIndexedAccessType;
	typescript.TSInferType = TSInferType;
	typescript.TSInstantiationExpression = TSInstantiationExpression;
	typescript.TSInterfaceBody = TSInterfaceBody;
	typescript.TSInterfaceDeclaration = TSInterfaceDeclaration;
	typescript.TSIntersectionType = TSIntersectionType;
	typescript.TSIntrinsicKeyword = TSIntrinsicKeyword;
	typescript.TSLiteralType = TSLiteralType;
	typescript.TSMappedType = TSMappedType;
	typescript.TSMethodSignature = TSMethodSignature;
	typescript.TSModuleBlock = TSModuleBlock;
	typescript.TSModuleDeclaration = TSModuleDeclaration;
	typescript.TSNamedTupleMember = TSNamedTupleMember;
	typescript.TSNamespaceExportDeclaration = TSNamespaceExportDeclaration;
	typescript.TSNeverKeyword = TSNeverKeyword;
	typescript.TSNonNullExpression = TSNonNullExpression;
	typescript.TSNullKeyword = TSNullKeyword;
	typescript.TSNumberKeyword = TSNumberKeyword;
	typescript.TSObjectKeyword = TSObjectKeyword;
	typescript.TSOptionalType = TSOptionalType;
	typescript.TSParameterProperty = TSParameterProperty;
	typescript.TSParenthesizedType = TSParenthesizedType;
	typescript.TSPropertySignature = TSPropertySignature;
	typescript.TSQualifiedName = TSQualifiedName;
	typescript.TSRestType = TSRestType;
	typescript.TSSatisfiesExpression = TSSatisfiesExpression;
	typescript.TSStringKeyword = TSStringKeyword;
	typescript.TSSymbolKeyword = TSSymbolKeyword;
	typescript.TSTemplateLiteralType = TSTemplateLiteralType;
	typescript.TSThisType = TSThisType;
	typescript.TSTupleType = TSTupleType;
	typescript.TSTypeAliasDeclaration = TSTypeAliasDeclaration;
	typescript.TSTypeAnnotation = TSTypeAnnotation;
	typescript.TSTypeAssertion = TSTypeAssertion;
	typescript.TSTypeLiteral = TSTypeLiteral;
	typescript.TSTypeOperator = TSTypeOperator;
	typescript.TSTypeParameter = TSTypeParameter;
	typescript.TSTypeParameterDeclaration = typescript.TSTypeParameterInstantiation = TSTypeParameterInstantiation;
	typescript.TSTypePredicate = TSTypePredicate;
	typescript.TSTypeQuery = TSTypeQuery;
	typescript.TSTypeReference = TSTypeReference;
	typescript.TSUndefinedKeyword = TSUndefinedKeyword;
	typescript.TSUnionType = TSUnionType;
	typescript.TSUnknownKeyword = TSUnknownKeyword;
	typescript.TSVoidKeyword = TSVoidKeyword;
	typescript._tsPrintClassMemberModifiers = _tsPrintClassMemberModifiers;
	var _methods = requireMethods();
	var _classes = requireClasses();
	var _templateLiterals = requireTemplateLiterals();
	function TSTypeAnnotation(node, parent) {
	  this.token((parent.type === "TSFunctionType" || parent.type === "TSConstructorType") && parent.typeAnnotation === node ? "=>" : ":");
	  this.space();
	  if (node.optional) this.tokenChar(63);
	  this.print(node.typeAnnotation);
	}
	function TSTypeParameterInstantiation(node, parent) {
	  this.tokenChar(60);
	  let printTrailingSeparator = parent.type === "ArrowFunctionExpression" && node.params.length === 1;
	  if (this.tokenMap && node.start != null && node.end != null) {
	    printTrailingSeparator && (printTrailingSeparator = !!this.tokenMap.find(node, t => this.tokenMap.matchesOriginal(t, ",")));
	    printTrailingSeparator || (printTrailingSeparator = this.shouldPrintTrailingComma(">"));
	  }
	  this.printList(node.params, printTrailingSeparator);
	  this.tokenChar(62);
	}
	function TSTypeParameter(node) {
	  if (node.const) {
	    this.word("const");
	    this.space();
	  }
	  if (node.in) {
	    this.word("in");
	    this.space();
	  }
	  if (node.out) {
	    this.word("out");
	    this.space();
	  }
	  this.word(node.name);
	  if (node.constraint) {
	    this.space();
	    this.word("extends");
	    this.space();
	    this.print(node.constraint);
	  }
	  if (node.default) {
	    this.space();
	    this.tokenChar(61);
	    this.space();
	    this.print(node.default);
	  }
	}
	function TSParameterProperty(node) {
	  if (node.accessibility) {
	    this.word(node.accessibility);
	    this.space();
	  }
	  if (node.readonly) {
	    this.word("readonly");
	    this.space();
	  }
	  _methods._param.call(this, node.parameter);
	}
	function TSDeclareFunction(node, parent) {
	  if (node.declare) {
	    this.word("declare");
	    this.space();
	  }
	  _methods._functionHead.call(this, node, parent, false);
	  this.semicolon();
	}
	function TSDeclareMethod(node) {
	  _classes._classMethodHead.call(this, node);
	  this.semicolon();
	}
	function TSQualifiedName(node) {
	  this.print(node.left);
	  this.tokenChar(46);
	  this.print(node.right);
	}
	function TSCallSignatureDeclaration(node) {
	  tsPrintSignatureDeclarationBase.call(this, node);
	  maybePrintTrailingCommaOrSemicolon(this, node);
	}
	function maybePrintTrailingCommaOrSemicolon(printer, node) {
	  if (!printer.tokenMap || !node.start || !node.end) {
	    printer.semicolon();
	    return;
	  }
	  if (printer.tokenMap.endMatches(node, ",")) {
	    printer.token(",");
	  } else if (printer.tokenMap.endMatches(node, ";")) {
	    printer.semicolon();
	  }
	}
	function TSConstructSignatureDeclaration(node) {
	  this.word("new");
	  this.space();
	  tsPrintSignatureDeclarationBase.call(this, node);
	  maybePrintTrailingCommaOrSemicolon(this, node);
	}
	function TSPropertySignature(node) {
	  const {
	    readonly
	  } = node;
	  if (readonly) {
	    this.word("readonly");
	    this.space();
	  }
	  tsPrintPropertyOrMethodName.call(this, node);
	  this.print(node.typeAnnotation);
	  maybePrintTrailingCommaOrSemicolon(this, node);
	}
	function tsPrintPropertyOrMethodName(node) {
	  if (node.computed) {
	    this.tokenChar(91);
	  }
	  this.print(node.key);
	  if (node.computed) {
	    this.tokenChar(93);
	  }
	  if (node.optional) {
	    this.tokenChar(63);
	  }
	}
	function TSMethodSignature(node) {
	  const {
	    kind
	  } = node;
	  if (kind === "set" || kind === "get") {
	    this.word(kind);
	    this.space();
	  }
	  tsPrintPropertyOrMethodName.call(this, node);
	  tsPrintSignatureDeclarationBase.call(this, node);
	  maybePrintTrailingCommaOrSemicolon(this, node);
	}
	function TSIndexSignature(node) {
	  const {
	    readonly,
	    static: isStatic
	  } = node;
	  if (isStatic) {
	    this.word("static");
	    this.space();
	  }
	  if (readonly) {
	    this.word("readonly");
	    this.space();
	  }
	  this.tokenChar(91);
	  _methods._parameters.call(this, node.parameters, 93);
	  this.print(node.typeAnnotation);
	  maybePrintTrailingCommaOrSemicolon(this, node);
	}
	function TSAnyKeyword() {
	  this.word("any");
	}
	function TSBigIntKeyword() {
	  this.word("bigint");
	}
	function TSUnknownKeyword() {
	  this.word("unknown");
	}
	function TSNumberKeyword() {
	  this.word("number");
	}
	function TSObjectKeyword() {
	  this.word("object");
	}
	function TSBooleanKeyword() {
	  this.word("boolean");
	}
	function TSStringKeyword() {
	  this.word("string");
	}
	function TSSymbolKeyword() {
	  this.word("symbol");
	}
	function TSVoidKeyword() {
	  this.word("void");
	}
	function TSUndefinedKeyword() {
	  this.word("undefined");
	}
	function TSNullKeyword() {
	  this.word("null");
	}
	function TSNeverKeyword() {
	  this.word("never");
	}
	function TSIntrinsicKeyword() {
	  this.word("intrinsic");
	}
	function TSThisType() {
	  this.word("this");
	}
	function TSFunctionType(node) {
	  tsPrintFunctionOrConstructorType.call(this, node);
	}
	function TSConstructorType(node) {
	  if (node.abstract) {
	    this.word("abstract");
	    this.space();
	  }
	  this.word("new");
	  this.space();
	  tsPrintFunctionOrConstructorType.call(this, node);
	}
	function tsPrintFunctionOrConstructorType(node) {
	  const {
	    typeParameters
	  } = node;
	  const parameters = node.parameters;
	  this.print(typeParameters);
	  this.tokenChar(40);
	  _methods._parameters.call(this, parameters, 41);
	  this.space();
	  const returnType = node.typeAnnotation;
	  this.print(returnType);
	}
	function TSTypeReference(node) {
	  const typeArguments = node.typeParameters;
	  this.print(node.typeName, !!typeArguments);
	  this.print(typeArguments);
	}
	function TSTypePredicate(node) {
	  if (node.asserts) {
	    this.word("asserts");
	    this.space();
	  }
	  this.print(node.parameterName);
	  if (node.typeAnnotation) {
	    this.space();
	    this.word("is");
	    this.space();
	    this.print(node.typeAnnotation.typeAnnotation);
	  }
	}
	function TSTypeQuery(node) {
	  this.word("typeof");
	  this.space();
	  this.print(node.exprName);
	  const typeArguments = node.typeParameters;
	  if (typeArguments) {
	    this.print(typeArguments);
	  }
	}
	function TSTypeLiteral(node) {
	  printBraced(this, node, () => this.printJoin(node.members, true, true, undefined, undefined, true));
	}
	function TSArrayType(node) {
	  this.print(node.elementType, true);
	  this.tokenChar(91);
	  this.tokenChar(93);
	}
	function TSTupleType(node) {
	  this.tokenChar(91);
	  this.printList(node.elementTypes, this.shouldPrintTrailingComma("]"));
	  this.tokenChar(93);
	}
	function TSOptionalType(node) {
	  this.print(node.typeAnnotation);
	  this.tokenChar(63);
	}
	function TSRestType(node) {
	  this.token("...");
	  this.print(node.typeAnnotation);
	}
	function TSNamedTupleMember(node) {
	  this.print(node.label);
	  if (node.optional) this.tokenChar(63);
	  this.tokenChar(58);
	  this.space();
	  this.print(node.elementType);
	}
	function TSUnionType(node) {
	  tsPrintUnionOrIntersectionType(this, node, "|");
	}
	function TSIntersectionType(node) {
	  tsPrintUnionOrIntersectionType(this, node, "&");
	}
	function tsPrintUnionOrIntersectionType(printer, node, sep) {
	  var _printer$tokenMap;
	  let hasLeadingToken = 0;
	  if ((_printer$tokenMap = printer.tokenMap) != null && _printer$tokenMap.startMatches(node, sep)) {
	    hasLeadingToken = 1;
	    printer.token(sep);
	  }
	  printer.printJoin(node.types, undefined, undefined, function (i) {
	    this.space();
	    this.token(sep, undefined, i + hasLeadingToken);
	    this.space();
	  });
	}
	function TSConditionalType(node) {
	  this.print(node.checkType);
	  this.space();
	  this.word("extends");
	  this.space();
	  this.print(node.extendsType);
	  this.space();
	  this.tokenChar(63);
	  this.space();
	  this.print(node.trueType);
	  this.space();
	  this.tokenChar(58);
	  this.space();
	  this.print(node.falseType);
	}
	function TSInferType(node) {
	  this.word("infer");
	  this.print(node.typeParameter);
	}
	function TSParenthesizedType(node) {
	  this.tokenChar(40);
	  this.print(node.typeAnnotation);
	  this.tokenChar(41);
	}
	function TSTypeOperator(node) {
	  this.word(node.operator);
	  this.space();
	  this.print(node.typeAnnotation);
	}
	function TSIndexedAccessType(node) {
	  this.print(node.objectType, true);
	  this.tokenChar(91);
	  this.print(node.indexType);
	  this.tokenChar(93);
	}
	function TSMappedType(node) {
	  const {
	    nameType,
	    optional,
	    readonly,
	    typeAnnotation
	  } = node;
	  this.tokenChar(123);
	  const oldNoLineTerminatorAfterNode = this.enterDelimited();
	  this.space();
	  if (readonly) {
	    tokenIfPlusMinus(this, readonly);
	    this.word("readonly");
	    this.space();
	  }
	  this.tokenChar(91);
	  this.word(node.typeParameter.name);
	  this.space();
	  this.word("in");
	  this.space();
	  this.print(node.typeParameter.constraint, undefined, true);
	  if (nameType) {
	    this.space();
	    this.word("as");
	    this.space();
	    this.print(nameType, undefined, true);
	  }
	  this.tokenChar(93);
	  if (optional) {
	    tokenIfPlusMinus(this, optional);
	    this.tokenChar(63);
	  }
	  if (typeAnnotation) {
	    this.tokenChar(58);
	    this.space();
	    this.print(typeAnnotation, undefined, true);
	  }
	  this.space();
	  this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
	  this.tokenChar(125);
	}
	function tokenIfPlusMinus(self, tok) {
	  if (tok !== true) {
	    self.token(tok);
	  }
	}
	function TSTemplateLiteralType(node) {
	  _templateLiterals._printTemplate.call(this, node, node.types);
	}
	function TSLiteralType(node) {
	  this.print(node.literal);
	}
	function TSClassImplements(node) {
	  this.print(node.expression);
	  this.print(node.typeArguments);
	}
	function TSInterfaceDeclaration(node) {
	  const {
	    declare,
	    id,
	    typeParameters,
	    extends: extendz,
	    body
	  } = node;
	  if (declare) {
	    this.word("declare");
	    this.space();
	  }
	  this.word("interface");
	  this.space();
	  this.print(id);
	  this.print(typeParameters);
	  if (extendz != null && extendz.length) {
	    this.space();
	    this.word("extends");
	    this.space();
	    this.printList(extendz);
	  }
	  this.space();
	  this.print(body);
	}
	function TSInterfaceBody(node) {
	  printBraced(this, node, () => this.printJoin(node.body, true, true, undefined, undefined, true));
	}
	function TSTypeAliasDeclaration(node) {
	  const {
	    declare,
	    id,
	    typeParameters,
	    typeAnnotation
	  } = node;
	  if (declare) {
	    this.word("declare");
	    this.space();
	  }
	  this.word("type");
	  this.space();
	  this.print(id);
	  this.print(typeParameters);
	  this.space();
	  this.tokenChar(61);
	  this.space();
	  this.print(typeAnnotation);
	  this.semicolon();
	}
	function TSAsExpression(node) {
	  const {
	    expression,
	    typeAnnotation
	  } = node;
	  this.print(expression, true);
	  this.space();
	  this.word("as");
	  this.space();
	  this.print(typeAnnotation);
	}
	function TSSatisfiesExpression(node) {
	  const {
	    expression,
	    typeAnnotation
	  } = node;
	  this.print(expression, true);
	  this.space();
	  this.word("satisfies");
	  this.space();
	  this.print(typeAnnotation);
	}
	function TSTypeAssertion(node) {
	  const {
	    typeAnnotation,
	    expression
	  } = node;
	  this.tokenChar(60);
	  this.print(typeAnnotation);
	  this.tokenChar(62);
	  this.space();
	  this.print(expression);
	}
	function TSInstantiationExpression(node) {
	  this.print(node.expression);
	  this.print(node.typeParameters);
	}
	function TSEnumDeclaration(node) {
	  const {
	    declare,
	    const: isConst,
	    id
	  } = node;
	  if (declare) {
	    this.word("declare");
	    this.space();
	  }
	  if (isConst) {
	    this.word("const");
	    this.space();
	  }
	  this.word("enum");
	  this.space();
	  this.print(id);
	  this.space();
	  TSEnumBody.call(this, node);
	}
	function TSEnumBody(node) {
	  printBraced(this, node, () => {
	    var _this$shouldPrintTrai;
	    return this.printList(node.members, (_this$shouldPrintTrai = this.shouldPrintTrailingComma("}")) != null ? _this$shouldPrintTrai : true, true, true, undefined, true);
	  });
	}
	function TSEnumMember(node) {
	  const {
	    id,
	    initializer
	  } = node;
	  this.print(id);
	  if (initializer) {
	    this.space();
	    this.tokenChar(61);
	    this.space();
	    this.print(initializer);
	  }
	}
	function TSModuleDeclaration(node) {
	  const {
	    declare,
	    id,
	    kind
	  } = node;
	  if (declare) {
	    this.word("declare");
	    this.space();
	  }
	  if (!node.global) {
	    this.word(kind != null ? kind : id.type === "Identifier" ? "namespace" : "module");
	    this.space();
	  }
	  this.print(id);
	  if (!node.body) {
	    this.semicolon();
	    return;
	  }
	  let body = node.body;
	  while (body.type === "TSModuleDeclaration") {
	    this.tokenChar(46);
	    this.print(body.id);
	    body = body.body;
	  }
	  this.space();
	  this.print(body);
	}
	function TSModuleBlock(node) {
	  printBraced(this, node, () => this.printSequence(node.body, true, true));
	}
	function TSImportType(node) {
	  const {
	    qualifier,
	    options
	  } = node;
	  this.word("import");
	  this.tokenChar(40);
	  this.print(node.argument);
	  if (options) {
	    this.tokenChar(44);
	    this.print(options);
	  }
	  this.tokenChar(41);
	  if (qualifier) {
	    this.tokenChar(46);
	    this.print(qualifier);
	  }
	  const typeArguments = node.typeParameters;
	  if (typeArguments) {
	    this.print(typeArguments);
	  }
	}
	function TSImportEqualsDeclaration(node) {
	  const {
	    id,
	    moduleReference
	  } = node;
	  if (node.isExport) {
	    this.word("export");
	    this.space();
	  }
	  this.word("import");
	  this.space();
	  this.print(id);
	  this.space();
	  this.tokenChar(61);
	  this.space();
	  this.print(moduleReference);
	  this.semicolon();
	}
	function TSExternalModuleReference(node) {
	  this.token("require(");
	  this.print(node.expression);
	  this.tokenChar(41);
	}
	function TSNonNullExpression(node) {
	  this.print(node.expression);
	  this.tokenChar(33);
	  this.setLastChar(33);
	}
	function TSExportAssignment(node) {
	  this.word("export");
	  this.space();
	  this.tokenChar(61);
	  this.space();
	  this.print(node.expression);
	  this.semicolon();
	}
	function TSNamespaceExportDeclaration(node) {
	  this.word("export");
	  this.space();
	  this.word("as");
	  this.space();
	  this.word("namespace");
	  this.space();
	  this.print(node.id);
	  this.semicolon();
	}
	function tsPrintSignatureDeclarationBase(node) {
	  const {
	    typeParameters
	  } = node;
	  const parameters = node.parameters;
	  this.print(typeParameters);
	  this.tokenChar(40);
	  _methods._parameters.call(this, parameters, 41);
	  const returnType = node.typeAnnotation;
	  this.print(returnType);
	}
	function _tsPrintClassMemberModifiers(node) {
	  const isPrivateField = node.type === "ClassPrivateProperty";
	  const isPublicField = node.type === "ClassAccessorProperty" || node.type === "ClassProperty";
	  printModifiersList(this, node, [isPublicField && node.declare && "declare", !isPrivateField && node.accessibility]);
	  if (node.static) {
	    this.word("static");
	    this.space();
	  }
	  printModifiersList(this, node, [!isPrivateField && node.abstract && "abstract", !isPrivateField && node.override && "override", (isPublicField || isPrivateField) && node.readonly && "readonly"]);
	}
	function printBraced(printer, node, cb) {
	  printer.token("{");
	  const oldNoLineTerminatorAfterNode = printer.enterDelimited();
	  cb();
	  printer._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
	  printer.rightBrace(node);
	}
	function printModifiersList(printer, node, modifiers) {
	  var _printer$tokenMap2;
	  const modifiersSet = new Set();
	  for (const modifier of modifiers) {
	    if (modifier) modifiersSet.add(modifier);
	  }
	  (_printer$tokenMap2 = printer.tokenMap) == null || _printer$tokenMap2.find(node, tok => {
	    if (modifiersSet.has(tok.value)) {
	      printer.token(tok.value);
	      printer.space();
	      modifiersSet.delete(tok.value);
	      return modifiersSet.size === 0;
	    }
	    return false;
	  });
	  for (const modifier of modifiersSet) {
	    printer.word(modifier);
	    printer.space();
	  }
	}

	
	return typescript;
}

var flow = {};

var modules = {};

var hasRequiredModules;

function requireModules () {
	if (hasRequiredModules) return modules;
	hasRequiredModules = 1;

	Object.defineProperty(modules, "__esModule", {
	  value: true
	});
	modules.ExportAllDeclaration = ExportAllDeclaration;
	modules.ExportDefaultDeclaration = ExportDefaultDeclaration;
	modules.ExportDefaultSpecifier = ExportDefaultSpecifier;
	modules.ExportNamedDeclaration = ExportNamedDeclaration;
	modules.ExportNamespaceSpecifier = ExportNamespaceSpecifier;
	modules.ExportSpecifier = ExportSpecifier;
	modules.ImportAttribute = ImportAttribute;
	modules.ImportDeclaration = ImportDeclaration;
	modules.ImportDefaultSpecifier = ImportDefaultSpecifier;
	modules.ImportExpression = ImportExpression;
	modules.ImportNamespaceSpecifier = ImportNamespaceSpecifier;
	modules.ImportSpecifier = ImportSpecifier;
	modules._printAttributes = _printAttributes;
	var _t = requireLib$1();
	var _index = requireNode();
	var _expressions = requireExpressions();
	const {
	  isClassDeclaration,
	  isExportDefaultSpecifier,
	  isExportNamespaceSpecifier,
	  isImportDefaultSpecifier,
	  isImportNamespaceSpecifier,
	  isStatement
	} = _t;
	function ImportSpecifier(node) {
	  if (node.importKind === "type" || node.importKind === "typeof") {
	    this.word(node.importKind);
	    this.space();
	  }
	  this.print(node.imported);
	  if (node.local && node.local.name !== node.imported.name) {
	    this.space();
	    this.word("as");
	    this.space();
	    this.print(node.local);
	  }
	}
	function ImportDefaultSpecifier(node) {
	  this.print(node.local);
	}
	function ExportDefaultSpecifier(node) {
	  this.print(node.exported);
	}
	function ExportSpecifier(node) {
	  if (node.exportKind === "type") {
	    this.word("type");
	    this.space();
	  }
	  this.print(node.local);
	  if (node.exported && node.local.name !== node.exported.name) {
	    this.space();
	    this.word("as");
	    this.space();
	    this.print(node.exported);
	  }
	}
	function ExportNamespaceSpecifier(node) {
	  this.tokenChar(42);
	  this.space();
	  this.word("as");
	  this.space();
	  this.print(node.exported);
	}
	let warningShown = false;
	function _printAttributes(node, hasPreviousBrace) {
	  var _node$extra;
	  const {
	    attributes
	  } = node;
	  var {
	    assertions
	  } = node;
	  const {
	    importAttributesKeyword
	  } = this.format;
	  if (attributes && !importAttributesKeyword && node.extra && (node.extra.deprecatedAssertSyntax || node.extra.deprecatedWithLegacySyntax) && !warningShown) {
	    warningShown = true;
	    console.warn(`\
You are using import attributes, without specifying the desired output syntax.
Please specify the "importAttributesKeyword" generator option, whose value can be one of:
 - "with"        : \`import { a } from "b" with { type: "json" };\`
 - "assert"      : \`import { a } from "b" assert { type: "json" };\`
 - "with-legacy" : \`import { a } from "b" with type: "json";\`
`);
	  }
	  const useAssertKeyword = importAttributesKeyword === "assert" || !importAttributesKeyword && assertions;
	  this.word(useAssertKeyword ? "assert" : "with");
	  this.space();
	  if (!useAssertKeyword && (importAttributesKeyword === "with-legacy" || !importAttributesKeyword && (_node$extra = node.extra) != null && _node$extra.deprecatedWithLegacySyntax)) {
	    this.printList(attributes || assertions);
	    return;
	  }
	  const occurrenceCount = hasPreviousBrace ? 1 : 0;
	  this.token("{", undefined, occurrenceCount);
	  this.space();
	  this.printList(attributes || assertions, this.shouldPrintTrailingComma("}"));
	  this.space();
	  this.token("}", undefined, occurrenceCount);
	}
	function ExportAllDeclaration(node) {
	  var _node$attributes, _node$assertions;
	  this.word("export");
	  this.space();
	  if (node.exportKind === "type") {
	    this.word("type");
	    this.space();
	  }
	  this.tokenChar(42);
	  this.space();
	  this.word("from");
	  this.space();
	  if ((_node$attributes = node.attributes) != null && _node$attributes.length || (_node$assertions = node.assertions) != null && _node$assertions.length) {
	    this.print(node.source, true);
	    this.space();
	    _printAttributes.call(this, node, false);
	  } else {
	    this.print(node.source);
	  }
	  this.semicolon();
	}
	function maybePrintDecoratorsBeforeExport(printer, node) {
	  if (isClassDeclaration(node.declaration) && _expressions._shouldPrintDecoratorsBeforeExport.call(printer, node)) {
	    printer.printJoin(node.declaration.decorators);
	  }
	}
	function ExportNamedDeclaration(node) {
	  maybePrintDecoratorsBeforeExport(this, node);
	  this.word("export");
	  this.space();
	  if (node.declaration) {
	    const declar = node.declaration;
	    this.print(declar);
	    if (!isStatement(declar)) this.semicolon();
	  } else {
	    if (node.exportKind === "type") {
	      this.word("type");
	      this.space();
	    }
	    const specifiers = node.specifiers.slice(0);
	    let hasSpecial = false;
	    for (;;) {
	      const first = specifiers[0];
	      if (isExportDefaultSpecifier(first) || isExportNamespaceSpecifier(first)) {
	        hasSpecial = true;
	        this.print(specifiers.shift());
	        if (specifiers.length) {
	          this.tokenChar(44);
	          this.space();
	        }
	      } else {
	        break;
	      }
	    }
	    let hasBrace = false;
	    if (specifiers.length || !specifiers.length && !hasSpecial) {
	      hasBrace = true;
	      this.tokenChar(123);
	      if (specifiers.length) {
	        this.space();
	        this.printList(specifiers, this.shouldPrintTrailingComma("}"));
	        this.space();
	      }
	      this.tokenChar(125);
	    }
	    if (node.source) {
	      var _node$attributes2, _node$assertions2;
	      this.space();
	      this.word("from");
	      this.space();
	      if ((_node$attributes2 = node.attributes) != null && _node$attributes2.length || (_node$assertions2 = node.assertions) != null && _node$assertions2.length) {
	        this.print(node.source, true);
	        this.space();
	        _printAttributes.call(this, node, hasBrace);
	      } else {
	        this.print(node.source);
	      }
	    }
	    this.semicolon();
	  }
	}
	function ExportDefaultDeclaration(node) {
	  maybePrintDecoratorsBeforeExport(this, node);
	  this.word("export");
	  this.noIndentInnerCommentsHere();
	  this.space();
	  this.word("default");
	  this.space();
	  this.tokenContext |= _index.TokenContext.exportDefault;
	  const declar = node.declaration;
	  this.print(declar);
	  if (!isStatement(declar)) this.semicolon();
	}
	function ImportDeclaration(node) {
	  var _node$attributes3, _node$assertions3;
	  this.word("import");
	  this.space();
	  const isTypeKind = node.importKind === "type" || node.importKind === "typeof";
	  if (isTypeKind) {
	    this.noIndentInnerCommentsHere();
	    this.word(node.importKind);
	    this.space();
	  } else if (node.module) {
	    this.noIndentInnerCommentsHere();
	    this.word("module");
	    this.space();
	  } else if (node.phase) {
	    this.noIndentInnerCommentsHere();
	    this.word(node.phase);
	    this.space();
	  }
	  const specifiers = node.specifiers.slice(0);
	  const hasSpecifiers = !!specifiers.length;
	  while (hasSpecifiers) {
	    const first = specifiers[0];
	    if (isImportDefaultSpecifier(first) || isImportNamespaceSpecifier(first)) {
	      this.print(specifiers.shift());
	      if (specifiers.length) {
	        this.tokenChar(44);
	        this.space();
	      }
	    } else {
	      break;
	    }
	  }
	  let hasBrace = false;
	  if (specifiers.length) {
	    hasBrace = true;
	    this.tokenChar(123);
	    this.space();
	    this.printList(specifiers, this.shouldPrintTrailingComma("}"));
	    this.space();
	    this.tokenChar(125);
	  } else if (isTypeKind && !hasSpecifiers) {
	    hasBrace = true;
	    this.tokenChar(123);
	    this.tokenChar(125);
	  }
	  if (hasSpecifiers || isTypeKind) {
	    this.space();
	    this.word("from");
	    this.space();
	  }
	  if ((_node$attributes3 = node.attributes) != null && _node$attributes3.length || (_node$assertions3 = node.assertions) != null && _node$assertions3.length) {
	    this.print(node.source, true);
	    this.space();
	    _printAttributes.call(this, node, hasBrace);
	  } else {
	    this.print(node.source);
	  }
	  this.semicolon();
	}
	function ImportAttribute(node) {
	  this.print(node.key);
	  this.tokenChar(58);
	  this.space();
	  this.print(node.value);
	}
	function ImportNamespaceSpecifier(node) {
	  this.tokenChar(42);
	  this.space();
	  this.word("as");
	  this.space();
	  this.print(node.local);
	}
	function ImportExpression(node) {
	  this.word("import");
	  if (node.phase) {
	    this.tokenChar(46);
	    this.word(node.phase);
	  }
	  this.tokenChar(40);
	  const shouldPrintTrailingComma = this.shouldPrintTrailingComma(")");
	  this.print(node.source);
	  if (node.options != null) {
	    this.tokenChar(44);
	    this.space();
	    this.print(node.options);
	  }
	  if (shouldPrintTrailingComma) {
	    this.tokenChar(44);
	  }
	  this.rightParens(node);
	}

	
	return modules;
}

var types = {};

var jsesc_1;
var hasRequiredJsesc;

function requireJsesc () {
	if (hasRequiredJsesc) return jsesc_1;
	hasRequiredJsesc = 1;

	const object = {};
	const hasOwnProperty = object.hasOwnProperty;
	const forOwn = (object, callback) => {
		for (const key in object) {
			if (hasOwnProperty.call(object, key)) {
				callback(key, object[key]);
			}
		}
	};

	const extend = (destination, source) => {
		if (!source) {
			return destination;
		}
		forOwn(source, (key, value) => {
			destination[key] = value;
		});
		return destination;
	};

	const forEach = (array, callback) => {
		const length = array.length;
		let index = -1;
		while (++index < length) {
			callback(array[index]);
		}
	};

	const fourHexEscape = (hex) => {
		return '\\u' + ('0000' + hex).slice(-4);
	};

	const hexadecimal = (code, lowercase) => {
		let hexadecimal = code.toString(16);
		if (lowercase) return hexadecimal;
		return hexadecimal.toUpperCase();
	};

	const toString = object.toString;
	const isArray = Array.isArray;
	const isBuffer = (value) => {
		return typeof Buffer === 'function' && Buffer.isBuffer(value);
	};
	const isObject = (value) => {
		// This is a very simple check, but it’s good enough for what we need.
		return toString.call(value) == '[object Object]';
	};
	const isString = (value) => {
		return typeof value == 'string' ||
			toString.call(value) == '[object String]';
	};
	const isNumber = (value) => {
		return typeof value == 'number' ||
			toString.call(value) == '[object Number]';
	};
	const isBigInt = (value) => {
	  return typeof value == 'bigint';
	};
	const isFunction = (value) => {
		return typeof value == 'function';
	};
	const isMap = (value) => {
		return toString.call(value) == '[object Map]';
	};
	const isSet = (value) => {
		return toString.call(value) == '[object Set]';
	};

	/*--------------------------------------------------------------------------*/

	// https://mathiasbynens.be/notes/javascript-escapes#single
	const singleEscapes = {
		'\\': '\\\\',
		'\b': '\\b',
		'\f': '\\f',
		'\n': '\\n',
		'\r': '\\r',
		'\t': '\\t'
		// `\v` is omitted intentionally, because in IE < 9, '\v' == 'v'.
		// '\v': '\\x0B'
	};
	const regexSingleEscape = /[\\\b\f\n\r\t]/;

	const regexDigit = /[0-9]/;
	const regexWhitespace = /[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;

	const escapeEverythingRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^]/g;
	const escapeNonAsciiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^ !#-&\(-\[\]-_a-~]/g;

	const jsesc = (argument, options) => {
		const increaseIndentation = () => {
			oldIndent = indent;
			++options.indentLevel;
			indent = options.indent.repeat(options.indentLevel);
		};
		// Handle options
		const defaults = {
			'escapeEverything': false,
			'minimal': false,
			'isScriptContext': false,
			'quotes': 'single',
			'wrap': false,
			'es6': false,
			'json': false,
			'compact': true,
			'lowercaseHex': false,
			'numbers': 'decimal',
			'indent': '\t',
			'indentLevel': 0,
			'__inline1__': false,
			'__inline2__': false
		};
		const json = options && options.json;
		if (json) {
			defaults.quotes = 'double';
			defaults.wrap = true;
		}
		options = extend(defaults, options);
		if (
			options.quotes != 'single' &&
			options.quotes != 'double' &&
			options.quotes != 'backtick'
		) {
			options.quotes = 'single';
		}
		const quote = options.quotes == 'double' ?
			'"' :
			(options.quotes == 'backtick' ?
				'`' :
				'\''
			);
		const compact = options.compact;
		const lowercaseHex = options.lowercaseHex;
		let indent = options.indent.repeat(options.indentLevel);
		let oldIndent = '';
		const inline1 = options.__inline1__;
		const inline2 = options.__inline2__;
		const newLine = compact ? '' : '\n';
		let result;
		let isEmpty = true;
		const useBinNumbers = options.numbers == 'binary';
		const useOctNumbers = options.numbers == 'octal';
		const useDecNumbers = options.numbers == 'decimal';
		const useHexNumbers = options.numbers == 'hexadecimal';

		if (json && argument && isFunction(argument.toJSON)) {
			argument = argument.toJSON();
		}

		if (!isString(argument)) {
			if (isMap(argument)) {
				if (argument.size == 0) {
					return 'new Map()';
				}
				if (!compact) {
					options.__inline1__ = true;
					options.__inline2__ = false;
				}
				return 'new Map(' + jsesc(Array.from(argument), options) + ')';
			}
			if (isSet(argument)) {
				if (argument.size == 0) {
					return 'new Set()';
				}
				return 'new Set(' + jsesc(Array.from(argument), options) + ')';
			}
			if (isBuffer(argument)) {
				if (argument.length == 0) {
					return 'Buffer.from([])';
				}
				return 'Buffer.from(' + jsesc(Array.from(argument), options) + ')';
			}
			if (isArray(argument)) {
				result = [];
				options.wrap = true;
				if (inline1) {
					options.__inline1__ = false;
					options.__inline2__ = true;
				}
				if (!inline2) {
					increaseIndentation();
				}
				forEach(argument, (value) => {
					isEmpty = false;
					if (inline2) {
						options.__inline2__ = false;
					}
					result.push(
						(compact || inline2 ? '' : indent) +
						jsesc(value, options)
					);
				});
				if (isEmpty) {
					return '[]';
				}
				if (inline2) {
					return '[' + result.join(', ') + ']';
				}
				return '[' + newLine + result.join(',' + newLine) + newLine +
					(compact ? '' : oldIndent) + ']';
			} else if (isNumber(argument) || isBigInt(argument)) {
				if (json) {
					// Some number values (e.g. `Infinity`) cannot be represented in JSON.
					// `BigInt` values less than `-Number.MAX_VALUE` or greater than
	        // `Number.MAX_VALUE` cannot be represented in JSON so they will become
	        // `-Infinity` or `Infinity`, respectively, and then become `null` when
	        // stringified.
					return JSON.stringify(Number(argument));
				}

	      let result;
				if (useDecNumbers) {
					result = String(argument);
				} else if (useHexNumbers) {
					let hexadecimal = argument.toString(16);
					if (!lowercaseHex) {
						hexadecimal = hexadecimal.toUpperCase();
					}
					result = '0x' + hexadecimal;
				} else if (useBinNumbers) {
					result = '0b' + argument.toString(2);
				} else if (useOctNumbers) {
					result = '0o' + argument.toString(8);
				}

	      if (isBigInt(argument)) {
	        return result + 'n';
	      }
	      return result;
			} else if (isBigInt(argument)) {
				if (json) {
					// `BigInt` values less than `-Number.MAX_VALUE` or greater than
	        // `Number.MAX_VALUE` will become `-Infinity` or `Infinity`,
	        // respectively, and cannot be represented in JSON.
					return JSON.stringify(Number(argument));
				}
	      return argument + 'n';
	    } else if (!isObject(argument)) {
				if (json) {
					// For some values (e.g. `undefined`, `function` objects),
					// `JSON.stringify(value)` returns `undefined` (which isn’t valid
					// JSON) instead of `'null'`.
					return JSON.stringify(argument) || 'null';
				}
				return String(argument);
			} else { // it’s an object
				result = [];
				options.wrap = true;
				increaseIndentation();
				forOwn(argument, (key, value) => {
					isEmpty = false;
					result.push(
						(compact ? '' : indent) +
						jsesc(key, options) + ':' +
						(compact ? '' : ' ') +
						jsesc(value, options)
					);
				});
				if (isEmpty) {
					return '{}';
				}
				return '{' + newLine + result.join(',' + newLine) + newLine +
					(compact ? '' : oldIndent) + '}';
			}
		}

		const regex = options.escapeEverything ? escapeEverythingRegex : escapeNonAsciiRegex;
		result = argument.replace(regex, (char, pair, lone, quoteChar, index, string) => {
			if (pair) {
				if (options.minimal) return pair;
				const first = pair.charCodeAt(0);
				const second = pair.charCodeAt(1);
				if (options.es6) {
					// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					const codePoint = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
					const hex = hexadecimal(codePoint, lowercaseHex);
					return '\\u{' + hex + '}';
				}
				return fourHexEscape(hexadecimal(first, lowercaseHex)) + fourHexEscape(hexadecimal(second, lowercaseHex));
			}

			if (lone) {
				return fourHexEscape(hexadecimal(lone.charCodeAt(0), lowercaseHex));
			}

			if (
				char == '\0' &&
				!json &&
				!regexDigit.test(string.charAt(index + 1))
			) {
				return '\\0';
			}

			if (quoteChar) {
				if (quoteChar == quote || options.escapeEverything) {
					return '\\' + quoteChar;
				}
				return quoteChar;
			}

			if (regexSingleEscape.test(char)) {
				// no need for a `hasOwnProperty` check here
				return singleEscapes[char];
			}

			if (options.minimal && !regexWhitespace.test(char)) {
				return char;
			}

			const hex = hexadecimal(char.charCodeAt(0), lowercaseHex);
			if (json || hex.length > 2) {
				return fourHexEscape(hex);
			}

			return '\\x' + ('00' + hex).slice(-2);
		});

		if (quote == '`') {
			result = result.replace(/\$\{/g, '\\${');
		}
		if (options.isScriptContext) {
			// https://mathiasbynens.be/notes/etago
			result = result
				.replace(/<\/(script|style)/gi, '<\\/$1')
				.replace(/<!--/g, json ? '\\u003C!--' : '\\x3C!--');
		}
		if (options.wrap) {
			result = quote + result + quote;
		}
		return result;
	};

	jsesc.version = '3.0.2';

	jsesc_1 = jsesc;
	return jsesc_1;
}

var hasRequiredTypes;

function requireTypes () {
	if (hasRequiredTypes) return types;
	hasRequiredTypes = 1;

	Object.defineProperty(types, "__esModule", {
	  value: true
	});
	types.ArgumentPlaceholder = ArgumentPlaceholder;
	types.ArrayPattern = types.ArrayExpression = ArrayExpression;
	types.BigIntLiteral = BigIntLiteral;
	types.BooleanLiteral = BooleanLiteral;
	types.Identifier = Identifier;
	types.NullLiteral = NullLiteral;
	types.NumericLiteral = NumericLiteral;
	types.ObjectPattern = types.ObjectExpression = ObjectExpression;
	types.ObjectMethod = ObjectMethod;
	types.ObjectProperty = ObjectProperty;
	types.PipelineBareFunction = PipelineBareFunction;
	types.PipelinePrimaryTopicReference = PipelinePrimaryTopicReference;
	types.PipelineTopicExpression = PipelineTopicExpression;
	types.RegExpLiteral = RegExpLiteral;
	types.SpreadElement = types.RestElement = RestElement;
	types.StringLiteral = StringLiteral;
	types.TopicReference = TopicReference;
	types.VoidPattern = VoidPattern;
	types._getRawIdentifier = _getRawIdentifier;
	var _t = requireLib$1();
	var _jsesc = requireJsesc();
	var _methods = requireMethods();
	const {
	  isAssignmentPattern,
	  isIdentifier
	} = _t;
	let lastRawIdentResult = "";
	function _getRawIdentifier(node) {
	  const {
	    name
	  } = node;
	  const token = this.tokenMap.find(node, tok => tok.value === name);
	  if (token) {
	    lastRawIdentResult = this._originalCode.slice(token.start, token.end);
	    return lastRawIdentResult;
	  }
	  return lastRawIdentResult = node.name;
	}
	function Identifier(node) {
	  if (this._buf._map) {
	    var _node$loc;
	    this.sourceIdentifierName(((_node$loc = node.loc) == null ? void 0 : _node$loc.identifierName) || node.name);
	  }
	  this.word(this.tokenMap ? lastRawIdentResult : node.name);
	}
	function ArgumentPlaceholder() {
	  this.tokenChar(63);
	}
	function RestElement(node) {
	  this.token("...");
	  this.print(node.argument);
	}
	function ObjectExpression(node) {
	  const props = node.properties;
	  this.tokenChar(123);
	  if (props.length) {
	    const oldNoLineTerminatorAfterNode = this.enterDelimited();
	    this.space();
	    this.printList(props, this.shouldPrintTrailingComma("}"), true, true, undefined, true);
	    this.space();
	    this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
	  }
	  this.rightBrace(node);
	}
	function ObjectMethod(node) {
	  this.printJoin(node.decorators);
	  _methods._methodHead.call(this, node);
	  this.space();
	  this.print(node.body);
	}
	function ObjectProperty(node) {
	  this.printJoin(node.decorators);
	  if (node.computed) {
	    this.tokenChar(91);
	    this.print(node.key);
	    this.tokenChar(93);
	  } else {
	    if (isAssignmentPattern(node.value) && isIdentifier(node.key) && node.key.name === node.value.left.name) {
	      this.print(node.value);
	      return;
	    }
	    this.print(node.key);
	    if (node.shorthand && isIdentifier(node.key) && isIdentifier(node.value) && node.key.name === node.value.name) {
	      return;
	    }
	  }
	  this.tokenChar(58);
	  this.space();
	  this.print(node.value);
	}
	function ArrayExpression(node) {
	  const elems = node.elements;
	  const len = elems.length;
	  this.tokenChar(91);
	  const oldNoLineTerminatorAfterNode = this.enterDelimited();
	  for (let i = 0; i < elems.length; i++) {
	    const elem = elems[i];
	    if (elem) {
	      if (i > 0) this.space();
	      this.print(elem, undefined, true);
	      if (i < len - 1 || this.shouldPrintTrailingComma("]")) {
	        this.tokenChar(44, i);
	      }
	    } else {
	      this.tokenChar(44, i);
	    }
	  }
	  this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
	  this.tokenChar(93);
	}
	function RegExpLiteral(node) {
	  this.word(`/${node.pattern}/${node.flags}`, false);
	}
	function BooleanLiteral(node) {
	  this.word(node.value ? "true" : "false");
	}
	function NullLiteral() {
	  this.word("null");
	}
	function NumericLiteral(node) {
	  const raw = this.getPossibleRaw(node);
	  const opts = this.format.jsescOption;
	  const value = node.value;
	  const str = value + "";
	  if (opts.numbers) {
	    this.number(_jsesc(value, opts), value);
	  } else if (raw == null) {
	    this.number(str, value);
	  } else if (this.format.minified) {
	    this.number(raw.length < str.length ? raw : str, value);
	  } else {
	    this.number(raw, value);
	  }
	}
	function StringLiteral(node) {
	  const raw = this.getPossibleRaw(node);
	  if (!this.format.minified && raw !== undefined) {
	    this.token(raw);
	    return;
	  }
	  const val = _jsesc(node.value, this.format.jsescOption);
	  this.token(val);
	}
	function BigIntLiteral(node) {
	  const raw = this.getPossibleRaw(node);
	  if (!this.format.minified && raw !== undefined) {
	    this.word(raw);
	    return;
	  }
	  this.word(node.value + "n");
	}
	const validTopicTokenSet = new Set(["^^", "@@", "^", "%", "#"]);
	function TopicReference() {
	  const {
	    topicToken
	  } = this.format;
	  if (validTopicTokenSet.has(topicToken)) {
	    this.token(topicToken);
	  } else {
	    const givenTopicTokenJSON = JSON.stringify(topicToken);
	    const validTopics = Array.from(validTopicTokenSet, v => JSON.stringify(v));
	    throw new Error(`The "topicToken" generator option must be one of ` + `${validTopics.join(", ")} (${givenTopicTokenJSON} received instead).`);
	  }
	}
	function PipelineTopicExpression(node) {
	  this.print(node.expression);
	}
	function PipelineBareFunction(node) {
	  this.print(node.callee);
	}
	function PipelinePrimaryTopicReference() {
	  this.tokenChar(35);
	}
	function VoidPattern() {
	  this.word("void");
	}

	
	return types;
}

var hasRequiredFlow;

function requireFlow () {
	if (hasRequiredFlow) return flow;
	hasRequiredFlow = 1;
	(function (exports$1) {

		Object.defineProperty(exports$1, "__esModule", {
		  value: true
		});
		exports$1.AnyTypeAnnotation = AnyTypeAnnotation;
		exports$1.ArrayTypeAnnotation = ArrayTypeAnnotation;
		exports$1.BooleanLiteralTypeAnnotation = BooleanLiteralTypeAnnotation;
		exports$1.BooleanTypeAnnotation = BooleanTypeAnnotation;
		exports$1.DeclareClass = DeclareClass;
		exports$1.DeclareExportAllDeclaration = DeclareExportAllDeclaration;
		exports$1.DeclareExportDeclaration = DeclareExportDeclaration;
		exports$1.DeclareFunction = DeclareFunction;
		exports$1.DeclareInterface = DeclareInterface;
		exports$1.DeclareModule = DeclareModule;
		exports$1.DeclareModuleExports = DeclareModuleExports;
		exports$1.DeclareOpaqueType = DeclareOpaqueType;
		exports$1.DeclareTypeAlias = DeclareTypeAlias;
		exports$1.DeclareVariable = DeclareVariable;
		exports$1.DeclaredPredicate = DeclaredPredicate;
		exports$1.EmptyTypeAnnotation = EmptyTypeAnnotation;
		exports$1.EnumBooleanBody = EnumBooleanBody;
		exports$1.EnumBooleanMember = EnumBooleanMember;
		exports$1.EnumDeclaration = EnumDeclaration;
		exports$1.EnumDefaultedMember = EnumDefaultedMember;
		exports$1.EnumNumberBody = EnumNumberBody;
		exports$1.EnumNumberMember = EnumNumberMember;
		exports$1.EnumStringBody = EnumStringBody;
		exports$1.EnumStringMember = EnumStringMember;
		exports$1.EnumSymbolBody = EnumSymbolBody;
		exports$1.ExistsTypeAnnotation = ExistsTypeAnnotation;
		exports$1.FunctionTypeAnnotation = FunctionTypeAnnotation;
		exports$1.FunctionTypeParam = FunctionTypeParam;
		exports$1.IndexedAccessType = IndexedAccessType;
		exports$1.InferredPredicate = InferredPredicate;
		exports$1.InterfaceDeclaration = InterfaceDeclaration;
		exports$1.GenericTypeAnnotation = exports$1.ClassImplements = exports$1.InterfaceExtends = InterfaceExtends;
		exports$1.InterfaceTypeAnnotation = InterfaceTypeAnnotation;
		exports$1.IntersectionTypeAnnotation = IntersectionTypeAnnotation;
		exports$1.MixedTypeAnnotation = MixedTypeAnnotation;
		exports$1.NullLiteralTypeAnnotation = NullLiteralTypeAnnotation;
		exports$1.NullableTypeAnnotation = NullableTypeAnnotation;
		Object.defineProperty(exports$1, "NumberLiteralTypeAnnotation", {
		  enumerable: true,
		  get: function () {
		    return _types2.NumericLiteral;
		  }
		});
		exports$1.NumberTypeAnnotation = NumberTypeAnnotation;
		exports$1.ObjectTypeAnnotation = ObjectTypeAnnotation;
		exports$1.ObjectTypeCallProperty = ObjectTypeCallProperty;
		exports$1.ObjectTypeIndexer = ObjectTypeIndexer;
		exports$1.ObjectTypeInternalSlot = ObjectTypeInternalSlot;
		exports$1.ObjectTypeProperty = ObjectTypeProperty;
		exports$1.ObjectTypeSpreadProperty = ObjectTypeSpreadProperty;
		exports$1.OpaqueType = OpaqueType;
		exports$1.OptionalIndexedAccessType = OptionalIndexedAccessType;
		exports$1.QualifiedTypeIdentifier = QualifiedTypeIdentifier;
		Object.defineProperty(exports$1, "StringLiteralTypeAnnotation", {
		  enumerable: true,
		  get: function () {
		    return _types2.StringLiteral;
		  }
		});
		exports$1.StringTypeAnnotation = StringTypeAnnotation;
		exports$1.SymbolTypeAnnotation = SymbolTypeAnnotation;
		exports$1.ThisTypeAnnotation = ThisTypeAnnotation;
		exports$1.TupleTypeAnnotation = TupleTypeAnnotation;
		exports$1.TypeAlias = TypeAlias;
		exports$1.TypeAnnotation = TypeAnnotation;
		exports$1.TypeCastExpression = TypeCastExpression;
		exports$1.TypeParameter = TypeParameter;
		exports$1.TypeParameterDeclaration = exports$1.TypeParameterInstantiation = TypeParameterInstantiation;
		exports$1.TypeofTypeAnnotation = TypeofTypeAnnotation;
		exports$1.UnionTypeAnnotation = UnionTypeAnnotation;
		exports$1.Variance = Variance;
		exports$1.VoidTypeAnnotation = VoidTypeAnnotation;
		exports$1._interfaceish = _interfaceish;
		exports$1._variance = _variance;
		var _t = requireLib$1();
		var _modules = requireModules();
		var _index = requireNode();
		var _types2 = requireTypes();
		const {
		  isDeclareExportDeclaration,
		  isStatement
		} = _t;
		function AnyTypeAnnotation() {
		  this.word("any");
		}
		function ArrayTypeAnnotation(node) {
		  this.print(node.elementType, true);
		  this.tokenChar(91);
		  this.tokenChar(93);
		}
		function BooleanTypeAnnotation() {
		  this.word("boolean");
		}
		function BooleanLiteralTypeAnnotation(node) {
		  this.word(node.value ? "true" : "false");
		}
		function NullLiteralTypeAnnotation() {
		  this.word("null");
		}
		function DeclareClass(node, parent) {
		  if (!isDeclareExportDeclaration(parent)) {
		    this.word("declare");
		    this.space();
		  }
		  this.word("class");
		  this.space();
		  _interfaceish.call(this, node);
		}
		function DeclareFunction(node, parent) {
		  if (!isDeclareExportDeclaration(parent)) {
		    this.word("declare");
		    this.space();
		  }
		  this.word("function");
		  this.space();
		  this.print(node.id);
		  this.print(node.id.typeAnnotation.typeAnnotation);
		  if (node.predicate) {
		    this.space();
		    this.print(node.predicate);
		  }
		  this.semicolon();
		}
		function InferredPredicate() {
		  this.tokenChar(37);
		  this.word("checks");
		}
		function DeclaredPredicate(node) {
		  this.tokenChar(37);
		  this.word("checks");
		  this.tokenChar(40);
		  this.print(node.value);
		  this.tokenChar(41);
		}
		function DeclareInterface(node) {
		  this.word("declare");
		  this.space();
		  InterfaceDeclaration.call(this, node);
		}
		function DeclareModule(node) {
		  this.word("declare");
		  this.space();
		  this.word("module");
		  this.space();
		  this.print(node.id);
		  this.space();
		  this.print(node.body);
		}
		function DeclareModuleExports(node) {
		  this.word("declare");
		  this.space();
		  this.word("module");
		  this.tokenChar(46);
		  this.word("exports");
		  this.print(node.typeAnnotation);
		}
		function DeclareTypeAlias(node) {
		  this.word("declare");
		  this.space();
		  TypeAlias.call(this, node);
		}
		function DeclareOpaqueType(node, parent) {
		  if (!isDeclareExportDeclaration(parent)) {
		    this.word("declare");
		    this.space();
		  }
		  OpaqueType.call(this, node);
		}
		function DeclareVariable(node, parent) {
		  if (!isDeclareExportDeclaration(parent)) {
		    this.word("declare");
		    this.space();
		  }
		  this.word("var");
		  this.space();
		  this.print(node.id);
		  this.print(node.id.typeAnnotation);
		  this.semicolon();
		}
		function DeclareExportDeclaration(node) {
		  this.word("declare");
		  this.space();
		  this.word("export");
		  this.space();
		  if (node.default) {
		    this.word("default");
		    this.space();
		  }
		  FlowExportDeclaration.call(this, node);
		}
		function DeclareExportAllDeclaration(node) {
		  this.word("declare");
		  this.space();
		  _modules.ExportAllDeclaration.call(this, node);
		}
		function EnumDeclaration(node) {
		  const {
		    id,
		    body
		  } = node;
		  this.word("enum");
		  this.space();
		  this.print(id);
		  this.print(body);
		}
		function enumExplicitType(context, name, hasExplicitType) {
		  if (hasExplicitType) {
		    context.space();
		    context.word("of");
		    context.space();
		    context.word(name);
		  }
		  context.space();
		}
		function enumBody(context, node) {
		  const {
		    members
		  } = node;
		  context.token("{");
		  context.indent();
		  context.newline();
		  for (const member of members) {
		    context.print(member);
		    context.newline();
		  }
		  if (node.hasUnknownMembers) {
		    context.token("...");
		    context.newline();
		  }
		  context.dedent();
		  context.token("}");
		}
		function EnumBooleanBody(node) {
		  const {
		    explicitType
		  } = node;
		  enumExplicitType(this, "boolean", explicitType);
		  enumBody(this, node);
		}
		function EnumNumberBody(node) {
		  const {
		    explicitType
		  } = node;
		  enumExplicitType(this, "number", explicitType);
		  enumBody(this, node);
		}
		function EnumStringBody(node) {
		  const {
		    explicitType
		  } = node;
		  enumExplicitType(this, "string", explicitType);
		  enumBody(this, node);
		}
		function EnumSymbolBody(node) {
		  enumExplicitType(this, "symbol", true);
		  enumBody(this, node);
		}
		function EnumDefaultedMember(node) {
		  const {
		    id
		  } = node;
		  this.print(id);
		  this.tokenChar(44);
		}
		function enumInitializedMember(context, node) {
		  context.print(node.id);
		  context.space();
		  context.token("=");
		  context.space();
		  context.print(node.init);
		  context.token(",");
		}
		function EnumBooleanMember(node) {
		  enumInitializedMember(this, node);
		}
		function EnumNumberMember(node) {
		  enumInitializedMember(this, node);
		}
		function EnumStringMember(node) {
		  enumInitializedMember(this, node);
		}
		function FlowExportDeclaration(node) {
		  if (node.declaration) {
		    const declar = node.declaration;
		    this.print(declar);
		    if (!isStatement(declar)) this.semicolon();
		  } else {
		    this.tokenChar(123);
		    if (node.specifiers.length) {
		      this.space();
		      this.printList(node.specifiers);
		      this.space();
		    }
		    this.tokenChar(125);
		    if (node.source) {
		      this.space();
		      this.word("from");
		      this.space();
		      this.print(node.source);
		    }
		    this.semicolon();
		  }
		}
		function ExistsTypeAnnotation() {
		  this.tokenChar(42);
		}
		function FunctionTypeAnnotation(node, parent) {
		  this.print(node.typeParameters);
		  this.tokenChar(40);
		  if (node.this) {
		    this.word("this");
		    this.tokenChar(58);
		    this.space();
		    this.print(node.this.typeAnnotation);
		    if (node.params.length || node.rest) {
		      this.tokenChar(44);
		      this.space();
		    }
		  }
		  this.printList(node.params);
		  if (node.rest) {
		    if (node.params.length) {
		      this.tokenChar(44);
		      this.space();
		    }
		    this.token("...");
		    this.print(node.rest);
		  }
		  this.tokenChar(41);
		  const type = parent == null ? void 0 : parent.type;
		  if (type != null && (type === "ObjectTypeCallProperty" || type === "ObjectTypeInternalSlot" || type === "DeclareFunction" || type === "ObjectTypeProperty" && parent.method)) {
		    this.tokenChar(58);
		  } else {
		    this.space();
		    this.token("=>");
		  }
		  this.space();
		  this.print(node.returnType);
		}
		function FunctionTypeParam(node) {
		  this.print(node.name);
		  if (node.optional) this.tokenChar(63);
		  if (node.name) {
		    this.tokenChar(58);
		    this.space();
		  }
		  this.print(node.typeAnnotation);
		}
		function InterfaceExtends(node) {
		  this.print(node.id);
		  this.print(node.typeParameters, true);
		}
		function _interfaceish(node) {
		  var _node$extends;
		  this.print(node.id);
		  this.print(node.typeParameters);
		  if ((_node$extends = node.extends) != null && _node$extends.length) {
		    this.space();
		    this.word("extends");
		    this.space();
		    this.printList(node.extends);
		  }
		  if (node.type === "DeclareClass") {
		    var _node$mixins, _node$implements;
		    if ((_node$mixins = node.mixins) != null && _node$mixins.length) {
		      this.space();
		      this.word("mixins");
		      this.space();
		      this.printList(node.mixins);
		    }
		    if ((_node$implements = node.implements) != null && _node$implements.length) {
		      this.space();
		      this.word("implements");
		      this.space();
		      this.printList(node.implements);
		    }
		  }
		  this.space();
		  this.print(node.body);
		}
		function _variance(node) {
		  var _node$variance;
		  const kind = (_node$variance = node.variance) == null ? void 0 : _node$variance.kind;
		  if (kind != null) {
		    if (kind === "plus") {
		      this.tokenChar(43);
		    } else if (kind === "minus") {
		      this.tokenChar(45);
		    }
		  }
		}
		function InterfaceDeclaration(node) {
		  this.word("interface");
		  this.space();
		  _interfaceish.call(this, node);
		}
		function andSeparator(occurrenceCount) {
		  this.space();
		  this.token("&", false, occurrenceCount);
		  this.space();
		}
		function InterfaceTypeAnnotation(node) {
		  var _node$extends2;
		  this.word("interface");
		  if ((_node$extends2 = node.extends) != null && _node$extends2.length) {
		    this.space();
		    this.word("extends");
		    this.space();
		    this.printList(node.extends);
		  }
		  this.space();
		  this.print(node.body);
		}
		function IntersectionTypeAnnotation(node) {
		  this.printJoin(node.types, undefined, undefined, andSeparator);
		}
		function MixedTypeAnnotation() {
		  this.word("mixed");
		}
		function EmptyTypeAnnotation() {
		  this.word("empty");
		}
		function NullableTypeAnnotation(node) {
		  this.tokenChar(63);
		  this.print(node.typeAnnotation);
		}
		function NumberTypeAnnotation() {
		  this.word("number");
		}
		function StringTypeAnnotation() {
		  this.word("string");
		}
		function ThisTypeAnnotation() {
		  this.word("this");
		}
		function TupleTypeAnnotation(node) {
		  this.tokenChar(91);
		  this.printList(node.types);
		  this.tokenChar(93);
		}
		function TypeofTypeAnnotation(node) {
		  this.word("typeof");
		  this.space();
		  this.print(node.argument);
		}
		function TypeAlias(node) {
		  this.word("type");
		  this.space();
		  this.print(node.id);
		  this.print(node.typeParameters);
		  this.space();
		  this.tokenChar(61);
		  this.space();
		  this.print(node.right);
		  this.semicolon();
		}
		function TypeAnnotation(node, parent) {
		  this.tokenChar(58);
		  this.space();
		  if (parent.type === "ArrowFunctionExpression") {
		    this.tokenContext |= _index.TokenContext.arrowFlowReturnType;
		  } else if (node.optional) {
		    this.tokenChar(63);
		  }
		  this.print(node.typeAnnotation);
		}
		function TypeParameterInstantiation(node) {
		  this.tokenChar(60);
		  this.printList(node.params);
		  this.tokenChar(62);
		}
		function TypeParameter(node) {
		  _variance.call(this, node);
		  this.word(node.name);
		  if (node.bound) {
		    this.print(node.bound);
		  }
		  if (node.default) {
		    this.space();
		    this.tokenChar(61);
		    this.space();
		    this.print(node.default);
		  }
		}
		function OpaqueType(node) {
		  this.word("opaque");
		  this.space();
		  this.word("type");
		  this.space();
		  this.print(node.id);
		  this.print(node.typeParameters);
		  if (node.supertype) {
		    this.tokenChar(58);
		    this.space();
		    this.print(node.supertype);
		  }
		  if (node.impltype) {
		    this.space();
		    this.tokenChar(61);
		    this.space();
		    this.print(node.impltype);
		  }
		  this.semicolon();
		}
		function ObjectTypeAnnotation(node) {
		  if (node.exact) {
		    this.token("{|");
		  } else {
		    this.tokenChar(123);
		  }
		  const props = [...node.properties, ...(node.callProperties || []), ...(node.indexers || []), ...(node.internalSlots || [])];
		  if (props.length) {
		    this.newline();
		    this.space();
		    this.printJoin(props, true, true, () => {
		      if (props.length !== 1 || node.inexact) {
		        this.tokenChar(44);
		        this.space();
		      }
		    }, true);
		    this.space();
		  }
		  if (node.inexact) {
		    this.indent();
		    this.token("...");
		    if (props.length) {
		      this.newline();
		    }
		    this.dedent();
		  }
		  if (node.exact) {
		    this.token("|}");
		  } else {
		    this.tokenChar(125);
		  }
		}
		function ObjectTypeInternalSlot(node) {
		  if (node.static) {
		    this.word("static");
		    this.space();
		  }
		  this.tokenChar(91);
		  this.tokenChar(91);
		  this.print(node.id);
		  this.tokenChar(93);
		  this.tokenChar(93);
		  if (node.optional) this.tokenChar(63);
		  if (!node.method) {
		    this.tokenChar(58);
		    this.space();
		  }
		  this.print(node.value);
		}
		function ObjectTypeCallProperty(node) {
		  if (node.static) {
		    this.word("static");
		    this.space();
		  }
		  this.print(node.value);
		}
		function ObjectTypeIndexer(node) {
		  if (node.static) {
		    this.word("static");
		    this.space();
		  }
		  _variance.call(this, node);
		  this.tokenChar(91);
		  if (node.id) {
		    this.print(node.id);
		    this.tokenChar(58);
		    this.space();
		  }
		  this.print(node.key);
		  this.tokenChar(93);
		  this.tokenChar(58);
		  this.space();
		  this.print(node.value);
		}
		function ObjectTypeProperty(node) {
		  if (node.proto) {
		    this.word("proto");
		    this.space();
		  }
		  if (node.static) {
		    this.word("static");
		    this.space();
		  }
		  if (node.kind === "get" || node.kind === "set") {
		    this.word(node.kind);
		    this.space();
		  }
		  _variance.call(this, node);
		  this.print(node.key);
		  if (node.optional) this.tokenChar(63);
		  if (!node.method) {
		    this.tokenChar(58);
		    this.space();
		  }
		  this.print(node.value);
		}
		function ObjectTypeSpreadProperty(node) {
		  this.token("...");
		  this.print(node.argument);
		}
		function QualifiedTypeIdentifier(node) {
		  this.print(node.qualification);
		  this.tokenChar(46);
		  this.print(node.id);
		}
		function SymbolTypeAnnotation() {
		  this.word("symbol");
		}
		function orSeparator(occurrenceCount) {
		  this.space();
		  this.token("|", false, occurrenceCount);
		  this.space();
		}
		function UnionTypeAnnotation(node) {
		  this.printJoin(node.types, undefined, undefined, orSeparator);
		}
		function TypeCastExpression(node) {
		  this.tokenChar(40);
		  this.print(node.expression);
		  this.print(node.typeAnnotation);
		  this.tokenChar(41);
		}
		function Variance(node) {
		  if (node.kind === "plus") {
		    this.tokenChar(43);
		  } else {
		    this.tokenChar(45);
		  }
		}
		function VoidTypeAnnotation() {
		  this.word("void");
		}
		function IndexedAccessType(node) {
		  this.print(node.objectType, true);
		  this.tokenChar(91);
		  this.print(node.indexType);
		  this.tokenChar(93);
		}
		function OptionalIndexedAccessType(node) {
		  this.print(node.objectType);
		  if (node.optional) {
		    this.token("?.");
		  }
		  this.tokenChar(91);
		  this.print(node.indexType);
		  this.tokenChar(93);
		}

		
	} (flow));
	return flow;
}

var hasRequiredClasses;

function requireClasses () {
	if (hasRequiredClasses) return classes;
	hasRequiredClasses = 1;

	Object.defineProperty(classes, "__esModule", {
	  value: true
	});
	classes.ClassAccessorProperty = ClassAccessorProperty;
	classes.ClassBody = ClassBody;
	classes.ClassExpression = classes.ClassDeclaration = ClassDeclaration;
	classes.ClassMethod = ClassMethod;
	classes.ClassPrivateMethod = ClassPrivateMethod;
	classes.ClassPrivateProperty = ClassPrivateProperty;
	classes.ClassProperty = ClassProperty;
	classes.StaticBlock = StaticBlock;
	classes._classMethodHead = _classMethodHead;
	var _t = requireLib$1();
	var _expressions = requireExpressions();
	var _typescript = requireTypescript();
	var _flow = requireFlow();
	var _methods = requireMethods();
	const {
	  isExportDefaultDeclaration,
	  isExportNamedDeclaration
	} = _t;
	function ClassDeclaration(node, parent) {
	  const inExport = isExportDefaultDeclaration(parent) || isExportNamedDeclaration(parent);
	  if (!inExport || !_expressions._shouldPrintDecoratorsBeforeExport.call(this, parent)) {
	    this.printJoin(node.decorators);
	  }
	  if (node.declare) {
	    this.word("declare");
	    this.space();
	  }
	  if (node.abstract) {
	    this.word("abstract");
	    this.space();
	  }
	  this.word("class");
	  if (node.id) {
	    this.space();
	    this.print(node.id);
	  }
	  this.print(node.typeParameters);
	  if (node.superClass) {
	    this.space();
	    this.word("extends");
	    this.space();
	    this.print(node.superClass);
	    this.print(node.superTypeParameters);
	  }
	  if (node.implements) {
	    this.space();
	    this.word("implements");
	    this.space();
	    this.printList(node.implements);
	  }
	  this.space();
	  this.print(node.body);
	}
	function ClassBody(node) {
	  this.tokenChar(123);
	  if (node.body.length === 0) {
	    this.tokenChar(125);
	  } else {
	    const separator = classBodyEmptySemicolonsPrinter(this, node);
	    separator == null || separator(-1);
	    const oldNoLineTerminatorAfterNode = this.enterDelimited();
	    this.printJoin(node.body, true, true, separator, true, true);
	    this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
	    if (!this.endsWith(10)) this.newline();
	    this.rightBrace(node);
	  }
	}
	function classBodyEmptySemicolonsPrinter(printer, node) {
	  if (!printer.tokenMap || node.start == null || node.end == null) {
	    return null;
	  }
	  const indexes = printer.tokenMap.getIndexes(node);
	  if (!indexes) return null;
	  let k = 1;
	  let occurrenceCount = 0;
	  let nextLocIndex = 0;
	  const advanceNextLocIndex = () => {
	    while (nextLocIndex < node.body.length && node.body[nextLocIndex].start == null) {
	      nextLocIndex++;
	    }
	  };
	  advanceNextLocIndex();
	  return i => {
	    if (nextLocIndex <= i) {
	      nextLocIndex = i + 1;
	      advanceNextLocIndex();
	    }
	    const end = nextLocIndex === node.body.length ? node.end : node.body[nextLocIndex].start;
	    let tok;
	    while (k < indexes.length && printer.tokenMap.matchesOriginal(tok = printer._tokens[indexes[k]], ";") && tok.start < end) {
	      printer.tokenChar(59, occurrenceCount++);
	      k++;
	    }
	  };
	}
	function ClassProperty(node) {
	  this.printJoin(node.decorators);
	  if (!node.static && !this.format.preserveFormat) {
	    var _node$key$loc;
	    const endLine = (_node$key$loc = node.key.loc) == null || (_node$key$loc = _node$key$loc.end) == null ? void 0 : _node$key$loc.line;
	    if (endLine) this.catchUp(endLine);
	  }
	  _typescript._tsPrintClassMemberModifiers.call(this, node);
	  if (node.computed) {
	    this.tokenChar(91);
	    this.print(node.key);
	    this.tokenChar(93);
	  } else {
	    _flow._variance.call(this, node);
	    this.print(node.key);
	  }
	  if (node.optional) {
	    this.tokenChar(63);
	  }
	  if (node.definite) {
	    this.tokenChar(33);
	  }
	  this.print(node.typeAnnotation);
	  if (node.value) {
	    this.space();
	    this.tokenChar(61);
	    this.space();
	    this.print(node.value);
	  }
	  this.semicolon();
	}
	function ClassAccessorProperty(node) {
	  var _node$key$loc2;
	  this.printJoin(node.decorators);
	  const endLine = (_node$key$loc2 = node.key.loc) == null || (_node$key$loc2 = _node$key$loc2.end) == null ? void 0 : _node$key$loc2.line;
	  if (endLine) this.catchUp(endLine);
	  _typescript._tsPrintClassMemberModifiers.call(this, node);
	  this.word("accessor", true);
	  this.space();
	  if (node.computed) {
	    this.tokenChar(91);
	    this.print(node.key);
	    this.tokenChar(93);
	  } else {
	    _flow._variance.call(this, node);
	    this.print(node.key);
	  }
	  if (node.optional) {
	    this.tokenChar(63);
	  }
	  if (node.definite) {
	    this.tokenChar(33);
	  }
	  this.print(node.typeAnnotation);
	  if (node.value) {
	    this.space();
	    this.tokenChar(61);
	    this.space();
	    this.print(node.value);
	  }
	  this.semicolon();
	}
	function ClassPrivateProperty(node) {
	  this.printJoin(node.decorators);
	  _typescript._tsPrintClassMemberModifiers.call(this, node);
	  this.print(node.key);
	  if (node.optional) {
	    this.tokenChar(63);
	  }
	  if (node.definite) {
	    this.tokenChar(33);
	  }
	  this.print(node.typeAnnotation);
	  if (node.value) {
	    this.space();
	    this.tokenChar(61);
	    this.space();
	    this.print(node.value);
	  }
	  this.semicolon();
	}
	function ClassMethod(node) {
	  _classMethodHead.call(this, node);
	  this.space();
	  this.print(node.body);
	}
	function ClassPrivateMethod(node) {
	  _classMethodHead.call(this, node);
	  this.space();
	  this.print(node.body);
	}
	function _classMethodHead(node) {
	  this.printJoin(node.decorators);
	  if (!this.format.preserveFormat) {
	    var _node$key$loc3;
	    const endLine = (_node$key$loc3 = node.key.loc) == null || (_node$key$loc3 = _node$key$loc3.end) == null ? void 0 : _node$key$loc3.line;
	    if (endLine) this.catchUp(endLine);
	  }
	  _typescript._tsPrintClassMemberModifiers.call(this, node);
	  _methods._methodHead.call(this, node);
	}
	function StaticBlock(node) {
	  this.word("static");
	  this.space();
	  this.tokenChar(123);
	  if (node.body.length === 0) {
	    this.tokenChar(125);
	  } else {
	    this.newline();
	    this.printSequence(node.body, true);
	    this.rightBrace(node);
	  }
	}

	
	return classes;
}

var base = {};

var hasRequiredBase;

function requireBase () {
	if (hasRequiredBase) return base;
	hasRequiredBase = 1;

	Object.defineProperty(base, "__esModule", {
	  value: true
	});
	base.BlockStatement = BlockStatement;
	base.Directive = Directive;
	base.DirectiveLiteral = DirectiveLiteral;
	base.File = File;
	base.InterpreterDirective = InterpreterDirective;
	base.Placeholder = Placeholder;
	base.Program = Program;
	function File(node) {
	  if (node.program) {
	    this.print(node.program.interpreter);
	  }
	  this.print(node.program);
	}
	function Program(node) {
	  var _node$directives;
	  this.printInnerComments(false);
	  const directivesLen = (_node$directives = node.directives) == null ? void 0 : _node$directives.length;
	  if (directivesLen) {
	    var _node$directives$trai;
	    const newline = node.body.length ? 2 : 1;
	    this.printSequence(node.directives, undefined, undefined, newline);
	    if (!((_node$directives$trai = node.directives[directivesLen - 1].trailingComments) != null && _node$directives$trai.length)) {
	      this.newline(newline);
	    }
	  }
	  this.printSequence(node.body);
	}
	function BlockStatement(node) {
	  var _node$directives2;
	  this.tokenChar(123);
	  const oldNoLineTerminatorAfterNode = this.enterDelimited();
	  const directivesLen = (_node$directives2 = node.directives) == null ? void 0 : _node$directives2.length;
	  if (directivesLen) {
	    var _node$directives$trai2;
	    const newline = node.body.length ? 2 : 1;
	    this.printSequence(node.directives, true, true, newline);
	    if (!((_node$directives$trai2 = node.directives[directivesLen - 1].trailingComments) != null && _node$directives$trai2.length)) {
	      this.newline(newline);
	    }
	  }
	  this.printSequence(node.body, true, true);
	  this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
	  this.rightBrace(node);
	}
	function Directive(node) {
	  this.print(node.value);
	  this.semicolon();
	}
	const unescapedSingleQuoteRE = /(?:^|[^\\])(?:\\\\)*'/;
	const unescapedDoubleQuoteRE = /(?:^|[^\\])(?:\\\\)*"/;
	function DirectiveLiteral(node) {
	  const raw = this.getPossibleRaw(node);
	  if (!this.format.minified && raw !== undefined) {
	    this.token(raw);
	    return;
	  }
	  const {
	    value
	  } = node;
	  if (!unescapedDoubleQuoteRE.test(value)) {
	    this.token(`"${value}"`);
	  } else if (!unescapedSingleQuoteRE.test(value)) {
	    this.token(`'${value}'`);
	  } else {
	    throw new Error("Malformed AST: it is not possible to print a directive containing" + " both unescaped single and double quotes.");
	  }
	}
	function InterpreterDirective(node) {
	  this.token(`#!${node.value}`);
	  this._newline();
	}
	function Placeholder(node) {
	  this.token("%%");
	  this.print(node.name);
	  this.token("%%");
	  if (node.expectedNode === "Statement") {
	    this.semicolon();
	  }
	}

	
	return base;
}

var jsx = {};

var hasRequiredJsx;

function requireJsx () {
	if (hasRequiredJsx) return jsx;
	hasRequiredJsx = 1;

	Object.defineProperty(jsx, "__esModule", {
	  value: true
	});
	jsx.JSXAttribute = JSXAttribute;
	jsx.JSXClosingElement = JSXClosingElement;
	jsx.JSXClosingFragment = JSXClosingFragment;
	jsx.JSXElement = JSXElement;
	jsx.JSXEmptyExpression = JSXEmptyExpression;
	jsx.JSXExpressionContainer = JSXExpressionContainer;
	jsx.JSXFragment = JSXFragment;
	jsx.JSXIdentifier = JSXIdentifier;
	jsx.JSXMemberExpression = JSXMemberExpression;
	jsx.JSXNamespacedName = JSXNamespacedName;
	jsx.JSXOpeningElement = JSXOpeningElement;
	jsx.JSXOpeningFragment = JSXOpeningFragment;
	jsx.JSXSpreadAttribute = JSXSpreadAttribute;
	jsx.JSXSpreadChild = JSXSpreadChild;
	jsx.JSXText = JSXText;
	function JSXAttribute(node) {
	  this.print(node.name);
	  if (node.value) {
	    this.tokenChar(61);
	    this.print(node.value);
	  }
	}
	function JSXIdentifier(node) {
	  this.word(node.name);
	}
	function JSXNamespacedName(node) {
	  this.print(node.namespace);
	  this.tokenChar(58);
	  this.print(node.name);
	}
	function JSXMemberExpression(node) {
	  this.print(node.object);
	  this.tokenChar(46);
	  this.print(node.property);
	}
	function JSXSpreadAttribute(node) {
	  this.tokenChar(123);
	  this.token("...");
	  this.print(node.argument);
	  this.rightBrace(node);
	}
	function JSXExpressionContainer(node) {
	  this.tokenChar(123);
	  this.print(node.expression);
	  this.rightBrace(node);
	}
	function JSXSpreadChild(node) {
	  this.tokenChar(123);
	  this.token("...");
	  this.print(node.expression);
	  this.rightBrace(node);
	}
	function JSXText(node) {
	  const raw = this.getPossibleRaw(node);
	  if (raw !== undefined) {
	    this.token(raw, true);
	  } else {
	    this.token(node.value, true);
	  }
	}
	function JSXElement(node) {
	  const open = node.openingElement;
	  this.print(open);
	  if (open.selfClosing) return;
	  this.indent();
	  for (const child of node.children) {
	    this.print(child);
	  }
	  this.dedent();
	  this.print(node.closingElement);
	}
	function spaceSeparator() {
	  this.space();
	}
	function JSXOpeningElement(node) {
	  this.tokenChar(60);
	  this.print(node.name);
	  if (node.typeArguments) {
	    this.print(node.typeArguments);
	  }
	  this.print(node.typeParameters);
	  if (node.attributes.length > 0) {
	    this.space();
	    this.printJoin(node.attributes, undefined, undefined, spaceSeparator);
	  }
	  if (node.selfClosing) {
	    this.space();
	    this.tokenChar(47);
	  }
	  this.tokenChar(62);
	}
	function JSXClosingElement(node) {
	  this.tokenChar(60);
	  this.tokenChar(47);
	  this.print(node.name);
	  this.tokenChar(62);
	}
	function JSXEmptyExpression() {
	  this.printInnerComments();
	}
	function JSXFragment(node) {
	  this.print(node.openingFragment);
	  this.indent();
	  for (const child of node.children) {
	    this.print(child);
	  }
	  this.dedent();
	  this.print(node.closingFragment);
	}
	function JSXOpeningFragment() {
	  this.tokenChar(60);
	  this.tokenChar(62);
	}
	function JSXClosingFragment() {
	  this.token("</");
	  this.tokenChar(62);
	}

	
	return jsx;
}

var hasRequiredGenerators;

function requireGenerators () {
	if (hasRequiredGenerators) return generators;
	hasRequiredGenerators = 1;
	(function (exports$1) {

		Object.defineProperty(exports$1, "__esModule", {
		  value: true
		});
		var _templateLiterals = requireTemplateLiterals();
		Object.keys(_templateLiterals).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (key in exports$1 && exports$1[key] === _templateLiterals[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _templateLiterals[key];
		    }
		  });
		});
		var _expressions = requireExpressions();
		Object.keys(_expressions).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (key in exports$1 && exports$1[key] === _expressions[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _expressions[key];
		    }
		  });
		});
		var _statements = requireStatements();
		Object.keys(_statements).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (key in exports$1 && exports$1[key] === _statements[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _statements[key];
		    }
		  });
		});
		var _classes = requireClasses();
		Object.keys(_classes).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (key in exports$1 && exports$1[key] === _classes[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _classes[key];
		    }
		  });
		});
		var _methods = requireMethods();
		Object.keys(_methods).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (key in exports$1 && exports$1[key] === _methods[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _methods[key];
		    }
		  });
		});
		var _modules = requireModules();
		Object.keys(_modules).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (key in exports$1 && exports$1[key] === _modules[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _modules[key];
		    }
		  });
		});
		var _types = requireTypes();
		Object.keys(_types).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (key in exports$1 && exports$1[key] === _types[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _types[key];
		    }
		  });
		});
		var _flow = requireFlow();
		Object.keys(_flow).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (key in exports$1 && exports$1[key] === _flow[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _flow[key];
		    }
		  });
		});
		var _base = requireBase();
		Object.keys(_base).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (key in exports$1 && exports$1[key] === _base[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _base[key];
		    }
		  });
		});
		var _jsx = requireJsx();
		Object.keys(_jsx).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (key in exports$1 && exports$1[key] === _jsx[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _jsx[key];
		    }
		  });
		});
		var _typescript = requireTypescript();
		Object.keys(_typescript).forEach(function (key) {
		  if (key === "default" || key === "__esModule") return;
		  if (key in exports$1 && exports$1[key] === _typescript[key]) return;
		  Object.defineProperty(exports$1, key, {
		    enumerable: true,
		    get: function () {
		      return _typescript[key];
		    }
		  });
		});

		
	} (generators));
	return generators;
}

var deprecated = {};

var hasRequiredDeprecated;

function requireDeprecated () {
	if (hasRequiredDeprecated) return deprecated;
	hasRequiredDeprecated = 1;

	Object.defineProperty(deprecated, "__esModule", {
	  value: true
	});
	deprecated.DecimalLiteral = DecimalLiteral;
	deprecated.Noop = Noop;
	deprecated.RecordExpression = RecordExpression;
	deprecated.TSExpressionWithTypeArguments = TSExpressionWithTypeArguments;
	deprecated.TupleExpression = TupleExpression;
	function Noop() {}
	function TSExpressionWithTypeArguments(node) {
	  this.print(node.expression);
	  this.print(node.typeParameters);
	}
	function DecimalLiteral(node) {
	  const raw = this.getPossibleRaw(node);
	  if (!this.format.minified && raw !== undefined) {
	    this.word(raw);
	    return;
	  }
	  this.word(node.value + "m");
	}
	function RecordExpression(node) {
	  const props = node.properties;
	  let startToken;
	  let endToken;
	  if (this.format.recordAndTupleSyntaxType === "bar") {
	    startToken = "{|";
	    endToken = "|}";
	  } else if (this.format.recordAndTupleSyntaxType !== "hash" && this.format.recordAndTupleSyntaxType != null) {
	    throw new Error(`The "recordAndTupleSyntaxType" generator option must be "bar" or "hash" (${JSON.stringify(this.format.recordAndTupleSyntaxType)} received).`);
	  } else {
	    startToken = "#{";
	    endToken = "}";
	  }
	  this.token(startToken);
	  if (props.length) {
	    this.space();
	    this.printList(props, this.shouldPrintTrailingComma(endToken), true, true);
	    this.space();
	  }
	  this.token(endToken);
	}
	function TupleExpression(node) {
	  const elems = node.elements;
	  const len = elems.length;
	  let startToken;
	  let endToken;
	  if (this.format.recordAndTupleSyntaxType === "bar") {
	    startToken = "[|";
	    endToken = "|]";
	  } else if (this.format.recordAndTupleSyntaxType === "hash") {
	    startToken = "#[";
	    endToken = "]";
	  } else {
	    throw new Error(`${this.format.recordAndTupleSyntaxType} is not a valid recordAndTuple syntax type`);
	  }
	  this.token(startToken);
	  for (let i = 0; i < elems.length; i++) {
	    const elem = elems[i];
	    if (elem) {
	      if (i > 0) this.space();
	      this.print(elem);
	      if (i < len - 1 || this.shouldPrintTrailingComma(endToken)) {
	        this.token(",", false, i);
	      }
	    }
	  }
	  this.token(endToken);
	}

	
	return deprecated;
}

var hasRequiredNodes;

function requireNodes () {
	if (hasRequiredNodes) return nodes;
	hasRequiredNodes = 1;

	Object.defineProperty(nodes, "__esModule", {
	  value: true
	});
	nodes.generatorInfosMap = void 0;
	var generatorFunctions = requireGenerators();
	var deprecatedGeneratorFunctions = requireDeprecated();
	const generatorInfosMap = nodes.generatorInfosMap = new Map();
	let index = 0;
	for (const key of Object.keys(generatorFunctions).sort()) {
	  if (key.startsWith("_")) continue;
	  generatorInfosMap.set(key, [generatorFunctions[key], index++, undefined]);
	}
	for (const key of Object.keys(deprecatedGeneratorFunctions)) {
	  generatorInfosMap.set(key, [deprecatedGeneratorFunctions[key], index++, undefined]);
	}

	
	return nodes;
}

var hasRequiredNode;

function requireNode () {
	if (hasRequiredNode) return node;
	hasRequiredNode = 1;

	Object.defineProperty(node, "__esModule", {
	  value: true
	});
	node.TokenContext = void 0;
	node.isLastChild = isLastChild;
	node.parentNeedsParens = parentNeedsParens;
	var parens = requireParentheses();
	var _t = requireLib$1();
	var _nodes = requireNodes();
	const {
	  VISITOR_KEYS
	} = _t;
	node.TokenContext = {
	  normal: 0,
	  expressionStatement: 1,
	  arrowBody: 2,
	  exportDefault: 4,
	  arrowFlowReturnType: 8,
	  forInitHead: 16,
	  forInHead: 32,
	  forOfHead: 64,
	  forInOrInitHeadAccumulate: 128,
	  forInOrInitHeadAccumulatePassThroughMask: 128
	};
	for (const type of Object.keys(parens)) {
	  const func = parens[type];
	  if (_nodes.generatorInfosMap.has(type)) {
	    _nodes.generatorInfosMap.get(type)[2] = func;
	  }
	}
	function isOrHasCallExpression(node) {
	  switch (node.type) {
	    case "CallExpression":
	      return true;
	    case "MemberExpression":
	      return isOrHasCallExpression(node.object);
	  }
	  return false;
	}
	function parentNeedsParens(node, parent, parentId) {
	  switch (parentId) {
	    case 112:
	      if (parent.callee === node) {
	        if (isOrHasCallExpression(node)) return true;
	      }
	      break;
	    case 42:
	      return !isDecoratorMemberExpression(node) && !(node.type === "CallExpression" && isDecoratorMemberExpression(node.callee)) && node.type !== "ParenthesizedExpression";
	  }
	  return false;
	}
	function isDecoratorMemberExpression(node) {
	  switch (node.type) {
	    case "Identifier":
	      return true;
	    case "MemberExpression":
	      return !node.computed && node.property.type === "Identifier" && isDecoratorMemberExpression(node.object);
	    default:
	      return false;
	  }
	}
	function isLastChild(parent, child) {
	  const visitorKeys = VISITOR_KEYS[parent.type];
	  for (let i = visitorKeys.length - 1; i >= 0; i--) {
	    const val = parent[visitorKeys[i]];
	    if (val === child) {
	      return true;
	    } else if (Array.isArray(val)) {
	      let j = val.length - 1;
	      while (j >= 0 && val[j] === null) j--;
	      return j >= 0 && val[j] === child;
	    } else if (val) {
	      return false;
	    }
	  }
	  return false;
	}

	
	return node;
}

var tokenMap = {};

var hasRequiredTokenMap;

function requireTokenMap () {
	if (hasRequiredTokenMap) return tokenMap;
	hasRequiredTokenMap = 1;

	Object.defineProperty(tokenMap, "__esModule", {
	  value: true
	});
	tokenMap.TokenMap = void 0;
	var _t = requireLib$1();
	const {
	  traverseFast,
	  VISITOR_KEYS
	} = _t;
	class TokenMap {
	  constructor(ast, tokens, source) {
	    this._tokens = void 0;
	    this._source = void 0;
	    this._nodesToTokenIndexes = new Map();
	    this._nodesOccurrencesCountCache = new Map();
	    this._tokensCache = new Map();
	    this._tokens = tokens;
	    this._source = source;
	    traverseFast(ast, node => {
	      const indexes = this._getTokensIndexesOfNode(node);
	      if (indexes.length > 0) this._nodesToTokenIndexes.set(node, indexes);
	    });
	    this._tokensCache.clear();
	  }
	  has(node) {
	    return this._nodesToTokenIndexes.has(node);
	  }
	  getIndexes(node) {
	    return this._nodesToTokenIndexes.get(node);
	  }
	  find(node, condition) {
	    const indexes = this._nodesToTokenIndexes.get(node);
	    if (indexes) {
	      for (let k = 0; k < indexes.length; k++) {
	        const index = indexes[k];
	        const tok = this._tokens[index];
	        if (condition(tok, index)) return tok;
	      }
	    }
	    return null;
	  }
	  findLastIndex(node, condition) {
	    const indexes = this._nodesToTokenIndexes.get(node);
	    if (indexes) {
	      for (let k = indexes.length - 1; k >= 0; k--) {
	        const index = indexes[k];
	        const tok = this._tokens[index];
	        if (condition(tok, index)) return index;
	      }
	    }
	    return -1;
	  }
	  findMatching(node, test, occurrenceCount = 0) {
	    const indexes = this._nodesToTokenIndexes.get(node);
	    if (indexes) {
	      if (typeof test === "number") {
	        test = String.fromCharCode(test);
	      }
	      let i = 0;
	      const count = occurrenceCount;
	      if (count > 1) {
	        const cache = this._nodesOccurrencesCountCache.get(node);
	        if ((cache == null ? void 0 : cache.test) === test && cache.count < count) {
	          i = cache.i + 1;
	          occurrenceCount -= cache.count + 1;
	        }
	      }
	      for (; i < indexes.length; i++) {
	        const tok = this._tokens[indexes[i]];
	        if (this.matchesOriginal(tok, test)) {
	          if (occurrenceCount === 0) {
	            if (count > 0) {
	              this._nodesOccurrencesCountCache.set(node, {
	                test,
	                count,
	                i
	              });
	            }
	            return tok;
	          }
	          occurrenceCount--;
	        }
	      }
	    }
	    return null;
	  }
	  matchesOriginal(token, test) {
	    if (token.end - token.start !== test.length) return false;
	    if (token.value != null) return token.value === test;
	    return this._source.startsWith(test, token.start);
	  }
	  startMatches(node, test) {
	    const indexes = this._nodesToTokenIndexes.get(node);
	    if (!indexes) return false;
	    const tok = this._tokens[indexes[0]];
	    if (tok.start !== node.start) return false;
	    return this.matchesOriginal(tok, test);
	  }
	  endMatches(node, test) {
	    const indexes = this._nodesToTokenIndexes.get(node);
	    if (!indexes) return false;
	    const tok = this._tokens[indexes[indexes.length - 1]];
	    if (tok.end !== node.end) return false;
	    return this.matchesOriginal(tok, test);
	  }
	  _getTokensIndexesOfNode(node) {
	    var _node$declaration;
	    if (node.start == null || node.end == null) return [];
	    const {
	      first,
	      last
	    } = this._findTokensOfNode(node, 0, this._tokens.length - 1);
	    let low = first;
	    const children = childrenIterator(node);
	    if ((node.type === "ExportNamedDeclaration" || node.type === "ExportDefaultDeclaration") && ((_node$declaration = node.declaration) == null ? void 0 : _node$declaration.type) === "ClassDeclaration") {
	      children.next();
	    }
	    const indexes = [];
	    for (const child of children) {
	      if (child == null) continue;
	      if (child.start == null || child.end == null) continue;
	      const childTok = this._findTokensOfNode(child, low, last);
	      const high = childTok.first;
	      for (let k = low; k < high; k++) indexes.push(k);
	      low = childTok.last + 1;
	    }
	    for (let k = low; k <= last; k++) indexes.push(k);
	    return indexes;
	  }
	  _findTokensOfNode(node, low, high) {
	    const cached = this._tokensCache.get(node);
	    if (cached) return cached;
	    const first = this._findFirstTokenOfNode(node.start, low, high);
	    const last = this._findLastTokenOfNode(node.end, first, high);
	    this._tokensCache.set(node, {
	      first,
	      last
	    });
	    return {
	      first,
	      last
	    };
	  }
	  _findFirstTokenOfNode(start, low, high) {
	    while (low <= high) {
	      const mid = high + low >> 1;
	      if (start < this._tokens[mid].start) {
	        high = mid - 1;
	      } else if (start > this._tokens[mid].start) {
	        low = mid + 1;
	      } else {
	        return mid;
	      }
	    }
	    return low;
	  }
	  _findLastTokenOfNode(end, low, high) {
	    while (low <= high) {
	      const mid = high + low >> 1;
	      if (end < this._tokens[mid].end) {
	        high = mid - 1;
	      } else if (end > this._tokens[mid].end) {
	        low = mid + 1;
	      } else {
	        return mid;
	      }
	    }
	    return high;
	  }
	}
	tokenMap.TokenMap = TokenMap;
	function* childrenIterator(node) {
	  if (node.type === "TemplateLiteral") {
	    yield node.quasis[0];
	    for (let i = 1; i < node.quasis.length; i++) {
	      yield node.expressions[i - 1];
	      yield node.quasis[i];
	    }
	    return;
	  }
	  const keys = VISITOR_KEYS[node.type];
	  for (const key of keys) {
	    const child = node[key];
	    if (!child) continue;
	    if (Array.isArray(child)) {
	      yield* child;
	    } else {
	      yield child;
	    }
	  }
	}

	
	return tokenMap;
}

var hasRequiredPrinter;

function requirePrinter () {
	if (hasRequiredPrinter) return printer;
	hasRequiredPrinter = 1;

	Object.defineProperty(printer, "__esModule", {
	  value: true
	});
	printer.default = void 0;
	var _buffer = requireBuffer();
	var _index = requireNode();
	var _nodes = requireNodes();
	var _t = requireLib$1();
	var _tokenMap = requireTokenMap();
	var _types2 = requireTypes();
	const {
	  isExpression,
	  isFunction,
	  isStatement,
	  isClassBody,
	  isTSInterfaceBody,
	  isTSEnumMember
	} = _t;
	const SCIENTIFIC_NOTATION = /e/i;
	const ZERO_DECIMAL_INTEGER = /\.0+$/;
	const HAS_NEWLINE = /[\n\r\u2028\u2029]/;
	const HAS_NEWLINE_OR_BlOCK_COMMENT_END = /[\n\r\u2028\u2029]|\*\//;
	function commentIsNewline(c) {
	  return c.type === "CommentLine" || HAS_NEWLINE.test(c.value);
	}
	class Printer {
	  constructor(format, map, tokens = null, originalCode = null) {
	    this.tokenContext = _index.TokenContext.normal;
	    this._tokens = null;
	    this._originalCode = null;
	    this._currentNode = null;
	    this._currentTypeId = null;
	    this._indent = 0;
	    this._indentRepeat = 0;
	    this._insideAux = false;
	    this._noLineTerminator = false;
	    this._noLineTerminatorAfterNode = null;
	    this._printAuxAfterOnNextUserNode = false;
	    this._printedComments = new Set();
	    this._lastCommentLine = 0;
	    this._innerCommentsState = 0;
	    this._flags = 0;
	    this.tokenMap = null;
	    this._boundGetRawIdentifier = null;
	    this._printSemicolonBeforeNextNode = -1;
	    this._printSemicolonBeforeNextToken = -1;
	    this.format = format;
	    this._tokens = tokens;
	    this._originalCode = originalCode;
	    this._indentRepeat = format.indent.style.length;
	    this._inputMap = (map == null ? void 0 : map._inputMap) || null;
	    this._buf = new _buffer.default(map, format.indent.style[0]);
	    const {
	      preserveFormat,
	      compact,
	      concise,
	      retainLines,
	      retainFunctionParens
	    } = format;
	    if (preserveFormat) {
	      this._flags |= 1;
	    }
	    if (compact) {
	      this._flags |= 2;
	    }
	    if (concise) {
	      this._flags |= 4;
	    }
	    if (retainLines) {
	      this._flags |= 8;
	    }
	    if (retainFunctionParens) {
	      this._flags |= 16;
	    }
	    if (format.auxiliaryCommentBefore || format.auxiliaryCommentAfter) {
	      this._flags |= 32;
	    }
	  }
	  enterDelimited() {
	    const oldNoLineTerminatorAfterNode = this._noLineTerminatorAfterNode;
	    if (oldNoLineTerminatorAfterNode !== null) {
	      this._noLineTerminatorAfterNode = null;
	    }
	    return oldNoLineTerminatorAfterNode;
	  }
	  generate(ast) {
	    if (this.format.preserveFormat) {
	      this.tokenMap = new _tokenMap.TokenMap(ast, this._tokens, this._originalCode);
	      this._boundGetRawIdentifier = _types2._getRawIdentifier.bind(this);
	    }
	    this.print(ast);
	    this._maybeAddAuxComment();
	    return this._buf.get();
	  }
	  indent(flags = this._flags) {
	    if (flags & (1 | 2 | 4)) {
	      return;
	    }
	    this._indent += this._indentRepeat;
	  }
	  dedent(flags = this._flags) {
	    if (flags & (1 | 2 | 4)) {
	      return;
	    }
	    this._indent -= this._indentRepeat;
	  }
	  semicolon(force = false) {
	    const flags = this._flags;
	    if (flags & 32) {
	      this._maybeAddAuxComment();
	    }
	    if (flags & 1) {
	      const node = this._currentNode;
	      if (node.start != null && node.end != null) {
	        if (!this.tokenMap.endMatches(node, ";")) {
	          this._printSemicolonBeforeNextNode = this._buf.getCurrentLine();
	          return;
	        }
	        const indexes = this.tokenMap.getIndexes(this._currentNode);
	        this._catchUpTo(this._tokens[indexes[indexes.length - 1]].loc.start);
	      }
	    }
	    if (force) {
	      this._appendChar(59);
	    } else {
	      this._queue(59);
	    }
	    this._noLineTerminator = false;
	  }
	  rightBrace(node) {
	    if (this.format.minified) {
	      this._buf.removeLastSemicolon();
	    }
	    this.sourceWithOffset("end", node.loc, -1);
	    this.tokenChar(125);
	  }
	  rightParens(node) {
	    this.sourceWithOffset("end", node.loc, -1);
	    this.tokenChar(41);
	  }
	  space(force = false) {
	    if (this._flags & (1 | 2)) {
	      return;
	    }
	    if (force) {
	      this._space();
	    } else {
	      const lastCp = this.getLastChar(true);
	      if (lastCp !== 0 && lastCp !== 32 && lastCp !== 10) {
	        this._space();
	      }
	    }
	  }
	  word(str, noLineTerminatorAfter = false) {
	    this.tokenContext &= _index.TokenContext.forInOrInitHeadAccumulatePassThroughMask;
	    this._maybePrintInnerComments(str);
	    const flags = this._flags;
	    if (flags & 32) {
	      this._maybeAddAuxComment();
	    }
	    if (flags & 1) this._catchUpToCurrentToken(str);
	    const lastChar = this.getLastChar();
	    if (lastChar === -2 || lastChar === -3 || lastChar === 47 && str.charCodeAt(0) === 47) {
	      this._space();
	    }
	    this._append(str, false);
	    this.setLastChar(-3);
	    this._noLineTerminator = noLineTerminatorAfter;
	  }
	  number(str, number) {
	    function isNonDecimalLiteral(str) {
	      if (str.length > 2 && str.charCodeAt(0) === 48) {
	        const secondChar = str.charCodeAt(1);
	        return secondChar === 98 || secondChar === 111 || secondChar === 120;
	      }
	      return false;
	    }
	    this.word(str);
	    if (Number.isInteger(number) && !isNonDecimalLiteral(str) && !SCIENTIFIC_NOTATION.test(str) && !ZERO_DECIMAL_INTEGER.test(str) && str.charCodeAt(str.length - 1) !== 46) {
	      this.setLastChar(-2);
	    }
	  }
	  token(str, maybeNewline = false, occurrenceCount = 0, mayNeedSpace = false) {
	    this.tokenContext &= _index.TokenContext.forInOrInitHeadAccumulatePassThroughMask;
	    this._maybePrintInnerComments(str, occurrenceCount);
	    const flags = this._flags;
	    if (flags & 32) {
	      this._maybeAddAuxComment();
	    }
	    if (flags & 1) {
	      this._catchUpToCurrentToken(str, occurrenceCount);
	    }
	    if (mayNeedSpace) {
	      const strFirst = str.charCodeAt(0);
	      if ((strFirst === 45 && str === "--" || strFirst === 61) && this.getLastChar() === 33 || strFirst === 43 && this.getLastChar() === 43 || strFirst === 45 && this.getLastChar() === 45 || strFirst === 46 && this.getLastChar() === -2) {
	        this._space();
	      }
	    }
	    this._append(str, maybeNewline);
	    this._noLineTerminator = false;
	  }
	  tokenChar(char, occurrenceCount = 0) {
	    this.tokenContext &= _index.TokenContext.forInOrInitHeadAccumulatePassThroughMask;
	    this._maybePrintInnerComments(char, occurrenceCount);
	    const flags = this._flags;
	    if (flags & 32) {
	      this._maybeAddAuxComment();
	    }
	    if (flags & 1) {
	      this._catchUpToCurrentToken(char, occurrenceCount);
	    }
	    if (char === 43 && this.getLastChar() === 43 || char === 45 && this.getLastChar() === 45 || char === 46 && this.getLastChar() === -2) {
	      this._space();
	    }
	    this._appendChar(char);
	    this._noLineTerminator = false;
	  }
	  newline(i = 1, flags = this._flags) {
	    if (i <= 0) return;
	    if (flags & (8 | 2)) {
	      return;
	    }
	    if (flags & 4) {
	      this.space();
	      return;
	    }
	    if (i > 2) i = 2;
	    i -= this._buf.getNewlineCount();
	    for (let j = 0; j < i; j++) {
	      this._newline();
	    }
	  }
	  endsWith(char) {
	    return this.getLastChar(true) === char;
	  }
	  getLastChar(checkQueue) {
	    return this._buf.getLastChar(checkQueue);
	  }
	  setLastChar(char) {
	    this._buf._last = char;
	  }
	  exactSource(loc, cb) {
	    if (!loc) {
	      cb();
	      return;
	    }
	    this._catchUp("start", loc);
	    this._buf.exactSource(loc, cb);
	  }
	  source(prop, loc) {
	    if (!loc) return;
	    this._catchUp(prop, loc);
	    this._buf.source(prop, loc);
	  }
	  sourceWithOffset(prop, loc, columnOffset) {
	    if (!loc || this.format.preserveFormat) return;
	    this._catchUp(prop, loc);
	    this._buf.sourceWithOffset(prop, loc, columnOffset);
	  }
	  sourceIdentifierName(identifierName, pos) {
	    if (!this._buf._canMarkIdName) return;
	    const sourcePosition = this._buf._sourcePosition;
	    sourcePosition.identifierNamePos = pos;
	    sourcePosition.identifierName = identifierName;
	  }
	  _space() {
	    this._queue(32);
	  }
	  _newline() {
	    if (this._buf._queuedChar === 32) this._buf._queuedChar = 0;
	    this._appendChar(10, true);
	  }
	  _catchUpToCurrentToken(str, occurrenceCount = 0) {
	    const token = this.tokenMap.findMatching(this._currentNode, str, occurrenceCount);
	    if (token) this._catchUpTo(token.loc.start);
	    if (this._printSemicolonBeforeNextToken !== -1 && this._printSemicolonBeforeNextToken === this._buf.getCurrentLine()) {
	      this._appendChar(59, true);
	    }
	    this._printSemicolonBeforeNextToken = -1;
	    this._printSemicolonBeforeNextNode = -1;
	  }
	  _append(str, maybeNewline) {
	    this._maybeIndent();
	    this._buf.append(str, maybeNewline);
	  }
	  _appendChar(char, noIndent) {
	    if (!noIndent) {
	      this._maybeIndent();
	    }
	    this._buf.appendChar(char);
	  }
	  _queue(char) {
	    this._buf.queue(char);
	    this.setLastChar(-1);
	  }
	  _maybeIndent() {
	    const indent = this._shouldIndent();
	    if (indent > 0) {
	      this._buf._appendChar(-1, indent, false);
	    }
	  }
	  _shouldIndent() {
	    return this.endsWith(10) ? this._indent : 0;
	  }
	  catchUp(line) {
	    if (!this.format.retainLines) return;
	    const count = line - this._buf.getCurrentLine();
	    for (let i = 0; i < count; i++) {
	      this._newline();
	    }
	  }
	  _catchUp(prop, loc) {
	    const flags = this._flags;
	    if ((flags & 1) === 0) {
	      if (flags & 8 && loc != null && loc[prop]) {
	        this.catchUp(loc[prop].line);
	      }
	      return;
	    }
	    const pos = loc == null ? void 0 : loc[prop];
	    if (pos != null) this._catchUpTo(pos);
	  }
	  _catchUpTo({
	    line,
	    column,
	    index
	  }) {
	    const count = line - this._buf.getCurrentLine();
	    if (count > 0 && this._noLineTerminator) {
	      return;
	    }
	    for (let i = 0; i < count; i++) {
	      this._newline();
	    }
	    const spacesCount = count > 0 ? column : column - this._buf.getCurrentColumn();
	    if (spacesCount > 0) {
	      const spaces = this._originalCode ? this._originalCode.slice(index - spacesCount, index).replace(/[^\t\x0B\f \xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF]/gu, " ") : " ".repeat(spacesCount);
	      this._append(spaces, false);
	      this.setLastChar(32);
	    }
	  }
	  printTerminatorless(node) {
	    this._noLineTerminator = true;
	    this.print(node);
	  }
	  print(node, noLineTerminatorAfter = false, resetTokenContext = false, trailingCommentsLineOffset) {
	    var _node$leadingComments, _node$leadingComments2;
	    if (!node) return;
	    this._innerCommentsState = 0;
	    const {
	      type,
	      loc,
	      extra
	    } = node;
	    const flags = this._flags;
	    let changedFlags = false;
	    if (node._compact) {
	      this._flags |= 4;
	      changedFlags = true;
	    }
	    const nodeInfo = _nodes.generatorInfosMap.get(type);
	    if (nodeInfo === undefined) {
	      throw new ReferenceError(`unknown node of type ${JSON.stringify(type)} with constructor ${JSON.stringify(node.constructor.name)}`);
	    }
	    const [printMethod, nodeId, needsParens] = nodeInfo;
	    const parent = this._currentNode;
	    const parentId = this._currentTypeId;
	    this._currentNode = node;
	    this._currentTypeId = nodeId;
	    if (flags & 1) {
	      this._printSemicolonBeforeNextToken = this._printSemicolonBeforeNextNode;
	    }
	    let oldInAux;
	    if (flags & 32) {
	      oldInAux = this._insideAux;
	      this._insideAux = loc == null;
	      this._maybeAddAuxComment(this._insideAux && !oldInAux);
	    }
	    let oldTokenContext = 0;
	    if (resetTokenContext) {
	      oldTokenContext = this.tokenContext;
	      if (oldTokenContext & _index.TokenContext.forInOrInitHeadAccumulate) {
	        this.tokenContext = 0;
	      } else {
	        oldTokenContext = 0;
	      }
	    }
	    const parenthesized = extra != null && extra.parenthesized;
	    let shouldPrintParens = parenthesized && flags & 1 || parenthesized && flags & 16 && nodeId === 71 || parent && ((0, _index.parentNeedsParens)(node, parent, parentId) || needsParens != null && needsParens(node, parent, parentId, this.tokenContext, flags & 1 ? this._boundGetRawIdentifier : undefined));
	    if (!shouldPrintParens && parenthesized && (_node$leadingComments = node.leadingComments) != null && _node$leadingComments.length && node.leadingComments[0].type === "CommentBlock") {
	      switch (parentId) {
	        case 65:
	        case 243:
	        case 6:
	        case 143:
	          break;
	        case 17:
	        case 130:
	        case 112:
	          if (parent.callee !== node) break;
	        default:
	          shouldPrintParens = true;
	      }
	    }
	    let indentParenthesized = false;
	    if (!shouldPrintParens && this._noLineTerminator && ((_node$leadingComments2 = node.leadingComments) != null && _node$leadingComments2.some(commentIsNewline) || flags & 8 && loc && loc.start.line > this._buf.getCurrentLine())) {
	      shouldPrintParens = true;
	      indentParenthesized = true;
	    }
	    let oldNoLineTerminatorAfterNode;
	    if (!shouldPrintParens) {
	      noLineTerminatorAfter || (noLineTerminatorAfter = !!parent && this._noLineTerminatorAfterNode === parent && (0, _index.isLastChild)(parent, node));
	      if (noLineTerminatorAfter) {
	        var _node$trailingComment;
	        if ((_node$trailingComment = node.trailingComments) != null && _node$trailingComment.some(commentIsNewline)) {
	          if (isExpression(node)) shouldPrintParens = true;
	        } else {
	          oldNoLineTerminatorAfterNode = this._noLineTerminatorAfterNode;
	          this._noLineTerminatorAfterNode = node;
	        }
	      }
	    }
	    if (shouldPrintParens) {
	      this.tokenChar(40);
	      if (indentParenthesized) this.indent();
	      this._innerCommentsState = 0;
	      if (!resetTokenContext) {
	        oldTokenContext = this.tokenContext;
	      }
	      if (oldTokenContext & _index.TokenContext.forInOrInitHeadAccumulate) {
	        this.tokenContext = 0;
	      }
	      oldNoLineTerminatorAfterNode = this._noLineTerminatorAfterNode;
	      this._noLineTerminatorAfterNode = null;
	    }
	    this._printLeadingComments(node, parent);
	    this.exactSource(nodeId === 139 || nodeId === 66 ? null : loc, printMethod.bind(this, node, parent));
	    if (shouldPrintParens) {
	      this._printTrailingComments(node, parent);
	      if (indentParenthesized) {
	        this.dedent();
	        this.newline();
	      }
	      this.tokenChar(41);
	      this._noLineTerminator = noLineTerminatorAfter;
	    } else if (noLineTerminatorAfter && !this._noLineTerminator) {
	      this._noLineTerminator = true;
	      this._printTrailingComments(node, parent);
	    } else {
	      this._printTrailingComments(node, parent, trailingCommentsLineOffset);
	    }
	    if (oldTokenContext) this.tokenContext = oldTokenContext;
	    this._currentNode = parent;
	    this._currentTypeId = parentId;
	    if (changedFlags) {
	      this._flags = flags;
	    }
	    if (flags & 32) {
	      this._insideAux = oldInAux;
	    }
	    if (oldNoLineTerminatorAfterNode != null) {
	      this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
	    }
	    this._innerCommentsState = 0;
	  }
	  _maybeAddAuxComment(enteredPositionlessNode) {
	    if (enteredPositionlessNode) this._printAuxBeforeComment();
	    if (!this._insideAux) this._printAuxAfterComment();
	  }
	  _printAuxBeforeComment() {
	    if (this._printAuxAfterOnNextUserNode) return;
	    this._printAuxAfterOnNextUserNode = true;
	    const comment = this.format.auxiliaryCommentBefore;
	    if (comment) {
	      this._printComment({
	        type: "CommentBlock",
	        value: comment
	      }, 0);
	    }
	  }
	  _printAuxAfterComment() {
	    if (!this._printAuxAfterOnNextUserNode) return;
	    this._printAuxAfterOnNextUserNode = false;
	    const comment = this.format.auxiliaryCommentAfter;
	    if (comment) {
	      this._printComment({
	        type: "CommentBlock",
	        value: comment
	      }, 0);
	    }
	  }
	  getPossibleRaw(node) {
	    const extra = node.extra;
	    if ((extra == null ? void 0 : extra.raw) != null && extra.rawValue != null && node.value === extra.rawValue) {
	      return extra.raw;
	    }
	  }
	  printJoin(nodes, statement, indent, separator, printTrailingSeparator, resetTokenContext, trailingCommentsLineOffset) {
	    if (!(nodes != null && nodes.length)) return;
	    const flags = this._flags;
	    if (indent == null && flags & 8) {
	      var _nodes$0$loc;
	      const startLine = (_nodes$0$loc = nodes[0].loc) == null ? void 0 : _nodes$0$loc.start.line;
	      if (startLine != null && startLine !== this._buf.getCurrentLine()) {
	        indent = true;
	      }
	    }
	    if (indent) this.indent(flags);
	    const len = nodes.length;
	    for (let i = 0; i < len; i++) {
	      const node = nodes[i];
	      if (!node) continue;
	      if (statement && i === 0 && this._buf.hasContent()) {
	        this.newline(1, flags);
	      }
	      this.print(node, false, resetTokenContext, trailingCommentsLineOffset || 0);
	      if (separator != null) {
	        if (i < len - 1) separator.call(this, i, false);else if (printTrailingSeparator) separator.call(this, i, true);
	      }
	      if (statement) {
	        if (i + 1 === len) {
	          this.newline(1, flags);
	        } else {
	          const lastCommentLine = this._lastCommentLine;
	          if (lastCommentLine > 0) {
	            var _nodes$loc;
	            const offset = (((_nodes$loc = nodes[i + 1].loc) == null ? void 0 : _nodes$loc.start.line) || 0) - lastCommentLine;
	            if (offset >= 0) {
	              this.newline(offset || 1, flags);
	              continue;
	            }
	          }
	          this.newline(1, flags);
	        }
	      }
	    }
	    if (indent) this.dedent(flags);
	  }
	  printAndIndentOnComments(node) {
	    const indent = node.leadingComments && node.leadingComments.length > 0;
	    if (indent) this.indent();
	    this.print(node);
	    if (indent) this.dedent();
	  }
	  printBlock(body) {
	    if (body.type !== "EmptyStatement") {
	      this.space();
	    }
	    this.print(body);
	  }
	  _printTrailingComments(node, parent, lineOffset) {
	    const {
	      innerComments,
	      trailingComments
	    } = node;
	    if (innerComments != null && innerComments.length) {
	      this._printComments(2, innerComments, node, parent, lineOffset);
	    }
	    if (trailingComments != null && trailingComments.length) {
	      this._printComments(2, trailingComments, node, parent, lineOffset);
	    } else {
	      this._lastCommentLine = 0;
	    }
	  }
	  _printLeadingComments(node, parent) {
	    const comments = node.leadingComments;
	    if (!(comments != null && comments.length)) return;
	    this._printComments(0, comments, node, parent);
	  }
	  _maybePrintInnerComments(nextTokenStr, nextTokenOccurrenceCount) {
	    var _this$tokenMap;
	    const state = this._innerCommentsState;
	    switch (state & 3) {
	      case 0:
	        this._innerCommentsState = 1 | 4;
	        return;
	      case 1:
	        this.printInnerComments((state & 4) > 0, (_this$tokenMap = this.tokenMap) == null ? void 0 : _this$tokenMap.findMatching(this._currentNode, nextTokenStr, nextTokenOccurrenceCount));
	    }
	  }
	  printInnerComments(indent = true, nextToken) {
	    const node = this._currentNode;
	    const comments = node.innerComments;
	    if (!(comments != null && comments.length)) {
	      this._innerCommentsState = 2;
	      return;
	    }
	    const hasSpace = this.endsWith(32);
	    if (indent) this.indent();
	    switch (this._printComments(1, comments, node, undefined, undefined, nextToken)) {
	      case 2:
	        this._innerCommentsState = 2;
	      case 1:
	        if (hasSpace) this.space();
	    }
	    if (indent) this.dedent();
	  }
	  noIndentInnerCommentsHere() {
	    this._innerCommentsState &= -5;
	  }
	  printSequence(nodes, indent, resetTokenContext, trailingCommentsLineOffset) {
	    this.printJoin(nodes, true, indent != null ? indent : false, undefined, undefined, resetTokenContext, trailingCommentsLineOffset);
	  }
	  printList(items, printTrailingSeparator, statement, indent, separator, resetTokenContext) {
	    this.printJoin(items, statement, indent, separator != null ? separator : commaSeparator, printTrailingSeparator, resetTokenContext);
	  }
	  shouldPrintTrailingComma(listEnd) {
	    if (!this.tokenMap) return null;
	    const listEndIndex = this.tokenMap.findLastIndex(this._currentNode, token => this.tokenMap.matchesOriginal(token, typeof listEnd === "number" ? String.fromCharCode(listEnd) : listEnd));
	    if (listEndIndex <= 0) return null;
	    return this.tokenMap.matchesOriginal(this._tokens[listEndIndex - 1], ",");
	  }
	  _shouldPrintComment(comment, nextToken) {
	    if (comment.ignore) return 0;
	    if (this._printedComments.has(comment)) return 0;
	    if (this._noLineTerminator && HAS_NEWLINE_OR_BlOCK_COMMENT_END.test(comment.value)) {
	      return 2;
	    }
	    if (nextToken && this.tokenMap) {
	      const commentTok = this.tokenMap.find(this._currentNode, token => token.value === comment.value);
	      if (commentTok && commentTok.start > nextToken.start) {
	        return 2;
	      }
	    }
	    this._printedComments.add(comment);
	    if (!this.format.shouldPrintComment(comment.value)) {
	      return 0;
	    }
	    return 1;
	  }
	  _printComment(comment, skipNewLines) {
	    const noLineTerminator = this._noLineTerminator;
	    const isBlockComment = comment.type === "CommentBlock";
	    const printNewLines = isBlockComment && skipNewLines !== 1 && !noLineTerminator;
	    if (printNewLines && this._buf.hasContent() && skipNewLines !== 2) {
	      this.newline(1);
	    }
	    switch (this.getLastChar(true)) {
	      case 47:
	        this._space();
	      case 91:
	      case 123:
	      case 40:
	        break;
	      default:
	        this.space();
	    }
	    let val;
	    if (isBlockComment) {
	      val = `/*${comment.value}*/`;
	      if (this.format.indent.adjustMultilineComment) {
	        var _comment$loc;
	        const offset = (_comment$loc = comment.loc) == null ? void 0 : _comment$loc.start.column;
	        if (offset) {
	          const newlineRegex = new RegExp("\\n\\s{1," + offset + "}", "g");
	          val = val.replace(newlineRegex, "\n");
	        }
	        if (this._flags & 4) {
	          val = val.replace(/\n(?!$)/g, `\n`);
	        } else {
	          let indentSize = this.format.retainLines ? 0 : this._buf.getCurrentColumn();
	          if (this._shouldIndent() || this.format.retainLines) {
	            indentSize += this._indent;
	          }
	          val = val.replace(/\n(?!$)/g, `\n${" ".repeat(indentSize)}`);
	        }
	      }
	    } else if (!noLineTerminator) {
	      val = `//${comment.value}`;
	    } else {
	      val = `/*${comment.value}*/`;
	    }
	    this.source("start", comment.loc);
	    this._append(val, isBlockComment);
	    if (!isBlockComment && !noLineTerminator) {
	      this._newline();
	    }
	    if (printNewLines && skipNewLines !== 3) {
	      this.newline(1);
	    }
	  }
	  _printComments(type, comments, node, parent, lineOffset = 0, nextToken) {
	    const nodeLoc = node.loc;
	    const len = comments.length;
	    let hasLoc = !!nodeLoc;
	    const nodeStartLine = hasLoc ? nodeLoc.start.line : 0;
	    const nodeEndLine = hasLoc ? nodeLoc.end.line : 0;
	    let lastLine = 0;
	    let leadingCommentNewline = 0;
	    const {
	      _noLineTerminator,
	      _flags
	    } = this;
	    for (let i = 0; i < len; i++) {
	      const comment = comments[i];
	      const shouldPrint = this._shouldPrintComment(comment, nextToken);
	      if (shouldPrint === 2) {
	        return i === 0 ? 0 : 1;
	      }
	      if (hasLoc && comment.loc && shouldPrint === 1) {
	        const commentStartLine = comment.loc.start.line;
	        const commentEndLine = comment.loc.end.line;
	        if (type === 0) {
	          let offset = 0;
	          if (i === 0) {
	            if (this._buf.hasContent() && (comment.type === "CommentLine" || commentStartLine !== commentEndLine)) {
	              offset = leadingCommentNewline = 1;
	            }
	          } else {
	            offset = commentStartLine - lastLine;
	          }
	          lastLine = commentEndLine;
	          if (offset > 0 && !_noLineTerminator) {
	            this.newline(offset, _flags);
	          }
	          this._printComment(comment, 1);
	          if (i + 1 === len) {
	            const count = Math.max(nodeStartLine - lastLine, leadingCommentNewline);
	            if (count > 0 && !_noLineTerminator) {
	              this.newline(count, _flags);
	            }
	            lastLine = nodeStartLine;
	          }
	        } else if (type === 1) {
	          const offset = commentStartLine - (i === 0 ? nodeStartLine : lastLine);
	          lastLine = commentEndLine;
	          if (offset > 0 && !_noLineTerminator) {
	            this.newline(offset, _flags);
	          }
	          this._printComment(comment, 1);
	          if (i + 1 === len) {
	            const count = Math.min(1, nodeEndLine - lastLine);
	            if (count > 0 && !_noLineTerminator) {
	              this.newline(count, _flags);
	            }
	            lastLine = nodeEndLine;
	          }
	        } else {
	          const offset = commentStartLine - (i === 0 ? nodeEndLine - lineOffset : lastLine);
	          lastLine = commentEndLine;
	          if (offset > 0 && !_noLineTerminator) {
	            this.newline(offset, _flags);
	          }
	          this._printComment(comment, 1);
	        }
	      } else {
	        hasLoc = false;
	        if (shouldPrint !== 1) {
	          continue;
	        }
	        if (len === 1) {
	          const singleLine = comment.loc ? comment.loc.start.line === comment.loc.end.line : !HAS_NEWLINE.test(comment.value);
	          const shouldSkipNewline = singleLine && !isStatement(node) && !isClassBody(parent) && !isTSInterfaceBody(parent) && !isTSEnumMember(node);
	          if (type === 0) {
	            this._printComment(comment, shouldSkipNewline && node.type !== "ObjectExpression" || singleLine && isFunction(parent) && parent.body === node ? 1 : 0);
	          } else if (shouldSkipNewline && type === 2) {
	            this._printComment(comment, 1);
	          } else {
	            this._printComment(comment, 0);
	          }
	        } else if (type === 1 && !(node.type === "ObjectExpression" && node.properties.length > 1) && node.type !== "ClassBody" && node.type !== "TSInterfaceBody") {
	          this._printComment(comment, i === 0 ? 2 : i === len - 1 ? 3 : 0);
	        } else {
	          this._printComment(comment, 0);
	        }
	      }
	    }
	    if (type === 2 && hasLoc && lastLine) {
	      this._lastCommentLine = lastLine;
	    }
	    return 2;
	  }
	}
	printer.default = Printer;
	function commaSeparator(occurrenceCount, last) {
	  this.tokenChar(44, occurrenceCount);
	  if (!last) this.space();
	}

	
	return printer;
}

var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib$3;
	hasRequiredLib = 1;

	Object.defineProperty(lib$3, "__esModule", {
	  value: true
	});
	lib$3.default = void 0;
	lib$3.generate = generate;
	var _sourceMap = requireSourceMap();
	var _printer = requirePrinter();
	function normalizeOptions(code, opts, ast) {
	  var _opts$recordAndTupleS;
	  if (opts.experimental_preserveFormat) {
	    if (typeof code !== "string") {
	      throw new Error("`experimental_preserveFormat` requires the original `code` to be passed to @babel/generator as a string");
	    }
	    if (!opts.retainLines) {
	      throw new Error("`experimental_preserveFormat` requires `retainLines` to be set to `true`");
	    }
	    if (opts.compact && opts.compact !== "auto") {
	      throw new Error("`experimental_preserveFormat` is not compatible with the `compact` option");
	    }
	    if (opts.minified) {
	      throw new Error("`experimental_preserveFormat` is not compatible with the `minified` option");
	    }
	    if (opts.jsescOption) {
	      throw new Error("`experimental_preserveFormat` is not compatible with the `jsescOption` option");
	    }
	    if (!Array.isArray(ast.tokens)) {
	      throw new Error("`experimental_preserveFormat` requires the AST to have attached the token of the input code. Make sure to enable the `tokens: true` parser option.");
	    }
	  }
	  const format = {
	    auxiliaryCommentBefore: opts.auxiliaryCommentBefore,
	    auxiliaryCommentAfter: opts.auxiliaryCommentAfter,
	    shouldPrintComment: opts.shouldPrintComment,
	    preserveFormat: opts.experimental_preserveFormat,
	    retainLines: opts.retainLines,
	    retainFunctionParens: opts.retainFunctionParens,
	    comments: opts.comments == null || opts.comments,
	    compact: opts.compact,
	    minified: opts.minified,
	    concise: opts.concise,
	    indent: {
	      adjustMultilineComment: true,
	      style: "  "
	    },
	    jsescOption: Object.assign({
	      quotes: "double",
	      wrap: true,
	      minimal: false
	    }, opts.jsescOption),
	    topicToken: opts.topicToken
	  };
	  format.decoratorsBeforeExport = opts.decoratorsBeforeExport;
	  format.jsescOption.json = opts.jsonCompatibleStrings;
	  format.recordAndTupleSyntaxType = (_opts$recordAndTupleS = opts.recordAndTupleSyntaxType) != null ? _opts$recordAndTupleS : "hash";
	  format.importAttributesKeyword = opts.importAttributesKeyword;
	  if (format.minified) {
	    format.compact = true;
	    format.shouldPrintComment = format.shouldPrintComment || (() => format.comments);
	  } else {
	    format.shouldPrintComment = format.shouldPrintComment || (value => format.comments || value.includes("@license") || value.includes("@preserve"));
	  }
	  if (format.compact === "auto") {
	    format.compact = typeof code === "string" && code.length > 500000;
	    if (format.compact) {
	      console.error("[BABEL] Note: The code generator has deoptimised the styling of " + `${opts.filename} as it exceeds the max of ${"500KB"}.`);
	    }
	  }
	  if (format.compact || format.preserveFormat) {
	    format.indent.adjustMultilineComment = false;
	  }
	  const {
	    auxiliaryCommentBefore,
	    auxiliaryCommentAfter,
	    shouldPrintComment
	  } = format;
	  if (auxiliaryCommentBefore && !shouldPrintComment(auxiliaryCommentBefore)) {
	    format.auxiliaryCommentBefore = undefined;
	  }
	  if (auxiliaryCommentAfter && !shouldPrintComment(auxiliaryCommentAfter)) {
	    format.auxiliaryCommentAfter = undefined;
	  }
	  return format;
	}
	lib$3.CodeGenerator = class CodeGenerator {
	  constructor(ast, opts = {}, code) {
	    this._ast = void 0;
	    this._format = void 0;
	    this._map = void 0;
	    this._ast = ast;
	    this._format = normalizeOptions(code, opts, ast);
	    this._map = opts.sourceMaps ? new _sourceMap.default(opts, code) : null;
	  }
	  generate() {
	    const printer = new _printer.default(this._format, this._map);
	    return printer.generate(this._ast);
	  }
	};
	function generate(ast, opts = {}, code) {
	  const format = normalizeOptions(code, opts, ast);
	  const map = opts.sourceMaps ? new _sourceMap.default(opts, code) : null;
	  const printer = new _printer.default(format, map, ast.tokens, typeof code === "string" ? code : null);
	  return printer.generate(ast);
	}
	lib$3.default = generate;

	
	return lib$3;
}

var libExports = requireLib();
var index = /*@__PURE__*/getDefaultExportFromCjs(libExports);

var index$1 = /*#__PURE__*/_mergeNamespaces({
	__proto__: null,
	default: index
}, [libExports]);

export { index$1 as generator };
