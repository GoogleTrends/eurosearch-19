// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"or4r":[function(require,module,exports) {
var global = arguments[3];
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

},{}],"WEtf":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// device sniffing for mobile
var isMobile = {
  android: function android() {
    return navigator.userAgent.match(/Android/i);
  },
  blackberry: function blackberry() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  ios: function ios() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  opera: function opera() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  windows: function windows() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function any() {
    return isMobile.android() || isMobile.blackberry() || isMobile.ios() || isMobile.opera() || isMobile.windows();
  }
};
var _default = isMobile;
exports.default = _default;
},{}],"yVOz":[function(require,module,exports) {
var define;
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(t.flubber=t.flubber||{})}(this,function(t){"use strict";function n(t){return 10===t||13===t||8232===t||8233===t||32===t||9===t||11===t||12===t||160===t||t>=5760&&an.indexOf(t)>=0}function e(t){switch(32|t){case 109:case 122:case 108:case 104:case 118:case 99:case 115:case 113:case 116:case 97:case 114:return!0}return!1}function r(t){return t>=48&&t<=57}function i(t){return t>=48&&t<=57||43===t||45===t||46===t}function a(t){this.index=0,this.path=t,this.max=t.length,this.result=[],this.param=0,this.err="",this.segmentStart=0,this.data=[]}function o(t){for(;t.index<t.max&&n(t.path.charCodeAt(t.index));)t.index++}function s(t){var n,e=t.index,i=e,a=t.max,o=!1,s=!1,h=!1,u=!1;if(i>=a)return void(t.err="SvgPath: missed param (at pos "+i+")");if(n=t.path.charCodeAt(i),43!==n&&45!==n||(i++,n=i<a?t.path.charCodeAt(i):0),!r(n)&&46!==n)return void(t.err="SvgPath: param should start with 0..9 or `.` (at pos "+i+")");if(46!==n){if(o=48===n,i++,n=i<a?t.path.charCodeAt(i):0,o&&i<a&&n&&r(n))return void(t.err="SvgPath: numbers started with `0` such as `09` are ilegal (at pos "+e+")");for(;i<a&&r(t.path.charCodeAt(i));)i++,s=!0;n=i<a?t.path.charCodeAt(i):0}if(46===n){for(u=!0,i++;r(t.path.charCodeAt(i));)i++,h=!0;n=i<a?t.path.charCodeAt(i):0}if(101===n||69===n){if(u&&!s&&!h)return void(t.err="SvgPath: invalid float exponent (at pos "+i+")");if(i++,n=i<a?t.path.charCodeAt(i):0,43!==n&&45!==n||i++,!(i<a&&r(t.path.charCodeAt(i))))return void(t.err="SvgPath: invalid float exponent (at pos "+i+")");for(;i<a&&r(t.path.charCodeAt(i));)i++}t.index=i,t.param=parseFloat(t.path.slice(e,i))+0}function h(t){var n,e;n=t.path[t.segmentStart],e=n.toLowerCase();var r=t.data;if("m"===e&&r.length>2&&(t.result.push([n,r[0],r[1]]),r=r.slice(2),e="l",n="m"===n?"l":"L"),"r"===e)t.result.push([n].concat(r));else for(;r.length>=rn[e]&&(t.result.push([n].concat(r.splice(0,rn[e]))),rn[e]););}function u(t){var n,r,a,u,c=t.max;if(t.segmentStart=t.index,n=t.path.charCodeAt(t.index),!e(n))return void(t.err="SvgPath: bad command "+t.path[t.index]+" (at pos "+t.index+")");if(a=rn[t.path[t.index].toLowerCase()],t.index++,o(t),t.data=[],!a)return void h(t);for(r=!1;;){for(u=a;u>0;u--){if(s(t),t.err.length)return;t.data.push(t.param),o(t),r=!1,t.index<c&&44===t.path.charCodeAt(t.index)&&(t.index++,o(t),r=!0)}if(!r){if(t.index>=t.max)break;if(!i(t.path.charCodeAt(t.index)))break}}h(t)}function c(t,n){return[t[0]*n[0]+t[2]*n[1],t[1]*n[0]+t[3]*n[1],t[0]*n[2]+t[2]*n[3],t[1]*n[2]+t[3]*n[3],t[0]*n[4]+t[2]*n[5]+t[4],t[1]*n[4]+t[3]*n[5]+t[5]]}function f(){if(!(this instanceof f))return new f;this.queue=[],this.cache=null}function l(t,n,e,r){var i=t*r-n*e<0?-1:1,a=Math.sqrt(t*t+n*n),o=Math.sqrt(t*t+n*n),s=t*e+n*r,h=s/(a*o);return h>1&&(h=1),h<-1&&(h=-1),i*Math.acos(h)}function p(t,n,e,r,i,a,o,s,h,u){var c=u*(t-e)/2+h*(n-r)/2,f=-h*(t-e)/2+u*(n-r)/2,p=o*o,g=s*s,v=c*c,x=f*f,y=p*g-p*x-g*v;y<0&&(y=0),y/=p*x+g*v,y=Math.sqrt(y)*(i===a?-1:1);var d=y*o/s*f,m=y*-s/o*c,M=u*d-h*m+(t+e)/2,w=h*d+u*m+(n+r)/2,b=(c-d)/o,L=(f-m)/s,A=(-c-d)/o,q=(-f-m)/s,k=l(1,0,b,L),P=l(b,L,A,q);return 0===a&&P>0&&(P-=ln),1===a&&P<0&&(P+=ln),[M,w,k,P]}function g(t,n){var e=4/3*Math.tan(n/4),r=Math.cos(t),i=Math.sin(t),a=Math.cos(t+n),o=Math.sin(t+n);return[r,i,r-i*e,i+r*e,a+o*e,o-a*e,a,o]}function v(t,n,e){if(!(this instanceof v))return new v(t,n,e);this.rx=t,this.ry=n,this.ax=e}function x(t){if(!(this instanceof x))return new x(t);var n=on(t);this.segments=n.segments,this.err=n.err,this.__stack=[]}function y(t){var n=t.match(wn);return n?n.map(Number):[]}function d(t,n,e,r,i,a,o,s){this.a={x:t,y:n},this.b={x:e,y:r},this.c={x:i,y:a},this.d={x:o,y:s},null!==o&&void 0!==o&&null!==s&&void 0!==s?(this.getArcLength=_,this.getPoint=L,this.getDerivative=M):(this.getArcLength=A,this.getPoint=b,this.getDerivative=m),this.init()}function m(t,n,e){return{x:2*(1-e)*(t[1]-t[0])+2*e*(t[2]-t[1]),y:2*(1-e)*(n[1]-n[0])+2*e*(n[2]-n[1])}}function M(t,n,e){return b([3*(t[1]-t[0]),3*(t[2]-t[1]),3*(t[3]-t[2])],[3*(n[1]-n[0]),3*(n[2]-n[1]),3*(n[3]-n[2])],e)}function w(t,n,e,r,i){for(var a=1,o=t/n,s=(t-e(r,i,o))/n;a>.001;){var h=e(r,i,o+s),u=e(r,i,o-s),c=Math.abs(t-h)/n,f=Math.abs(t-u)/n;c<a?(a=c,o+=s):f<a?(a=f,o-=s):s/=2}return o}function b(t,n,e){return{x:(1-e)*(1-e)*t[0]+2*(1-e)*e*t[1]+e*e*t[2],y:(1-e)*(1-e)*n[0]+2*(1-e)*e*n[1]+e*e*n[2]}}function L(t,n,e){return{x:(1-e)*(1-e)*(1-e)*t[0]+3*(1-e)*(1-e)*e*t[1]+3*(1-e)*e*e*t[2]+e*e*e*t[3],y:(1-e)*(1-e)*(1-e)*n[0]+3*(1-e)*(1-e)*e*n[1]+3*(1-e)*e*e*n[2]+e*e*e*n[3]}}function A(t,n,e){void 0===e&&(e=1);var r=t[0]-2*t[1]+t[2],i=n[0]-2*n[1]+n[2],a=2*t[1]-2*t[0],o=2*n[1]-2*n[0],s=4*(r*r+i*i),h=4*(r*a+i*o),u=a*a+o*o;if(0===s)return e*Math.sqrt(Math.pow(t[2]-t[0],2)+Math.pow(n[2]-n[0],2));var c=h/(2*s),f=u/s,l=e+c,p=f-c*c;return Math.sqrt(s)/2*(l*Math.sqrt(l*l+p)-c*Math.sqrt(c*c+p)+p*Math.log(Math.abs((l+Math.sqrt(l*l+p))/(c+Math.sqrt(c*c+p)))))}function q(t,n){return qn[t][n]}function k(t,n,e){var r,i,a,o=e.length-1;if(0===o)return 0;if(0===t){for(i=0,a=0;a<=o;a++)i+=q(o,a)*Math.pow(1-n,o-a)*Math.pow(n,a)*e[a];return i}for(r=new Array(o),a=0;a<o;a++)r[a]=o*(e[a+1]-e[a]);return k(t-1,n,r)}function P(t,n,e){var r=k(1,e,t),i=k(1,e,n),a=r*r+i*i;return Math.sqrt(a)}function _(t,n,e){var r,i,a,o;void 0===e&&(e=1);for(r=e/2,i=0,a=0;a<20;a++)o=r*Ln[20][a]+r,i+=An[20][a]*P(t,n,o);return r*i}function E(t,n,e,r){var i=t*r-n*e<0?-1:1,a=t*e+n*r;return a>1&&(a=1),a<-1&&(a=-1),i*Math.acos(a)}function S(t,n,e,r,i,a,o,s,h,u){var c=u*(t-e)/2+h*(n-r)/2,f=-h*(t-e)/2+u*(n-r)/2,l=o*o,p=s*s,g=c*c,v=f*f,x=l*p-l*v-p*g;x<0&&(x=0),x/=l*v+p*g,x=Math.sqrt(x)*(i===a?-1:1);var y=x*o/s*f,d=x*-s/o*c,m=u*y-h*d+(t+e)/2,M=h*y+u*d+(n+r)/2,w=(c-y)/o,b=(f-d)/s,L=(-c-y)/o,A=(-f-d)/s,q=E(1,0,w,b),k=E(w,b,L,A);return 0===a&&k>0&&(k-=kn),1===a&&k<0&&(k+=kn),[m,M,q,k]}function C(t,n){var e=4/3*Math.tan(n/4),r=Math.cos(t),i=Math.sin(t),a=Math.cos(t+n),o=Math.sin(t+n);return[r,i,r-i*e,i+r*e,a+o*e,o-a*e,a,o]}function Z(t,n,e,r,i,a,o,s,h){var u=0,c=[],f=[];Pn(t,n,e,r,i,a,o,s,h).forEach(function(t){var n=new bn(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7]),e=n.getTotalLength();u+=e,c.push(e),f.push(n)}),this.length=u,this.partialLengths=c,this.curves=f}function T(t,n,e,r){this.x0=t,this.x1=n,this.y0=e,this.y1=r}function F(t,n){return Math.sqrt((t[0]-n[0])*(t[0]-n[0])+(t[1]-n[1])*(t[1]-n[1]))}function z(t,n,e){return[t[0]+(n[0]-t[0])*e,t[1]+(n[1]-t[1])*e]}function j(t,n){return F(t,n)<1e-9}function I(t,n,e){var r=t.map(function(t,e){return V(t,n[e])});return function(t){var n=r.map(function(n){return n(t)});return e?H(n):n}}function V(t,n){return function(e){return t.map(function(t,r){return t+e*(n[r]-t)})}}function X(t){return"number"==typeof t&&isFinite(t)}function Y(t){return G(t)?nn(t):[(t[0][0]+t[t.length-1][0])/2,(t[0][1]+t[t.length-1][1])/2]}function G(t){for(var n=0;n<t.length-2;n++){var e=t[n],r=t[n+1],i=t[n+2];if(e[0]*(r[1]-i[1])+r[0]*(i[1]-e[1])+i[0]*(e[1]-r[1]))return!0}return!1}function O(t){return new yn(t).abs()}function D(t){return t.toString().split("M").map(function(t,n){return t=t.trim(),n&&t?"M"+t:t}).filter(function(t){return t})}function H(t){return"M"+t.join("L")+"Z"}function N(t){return D(O(t))}function Q(t,n){var e=O(t);return U(e)||R(e,n)}function U(t){var n=t.segments||[],e=[];if(!n.length||"M"!==n[0][0])return!1;for(var r=0;r<n.length;r++){var i=n[r],a=i[0],o=i[1],s=i[2];if("M"===a&&r||"Z"===a)break;if("M"===a||"L"===a)e.push([o,s]);else if("H"===a)e.push([o,e[e.length-1][1]]);else{if("V"!==a)return!1;e.push([e[e.length-1][0],o])}}return!!e.length&&{ring:e}}function R(t,n){var e,r,i=D(t)[0],a=[],o=3;if(!i)throw new TypeError(Cn);r=B(i),e=r.getTotalLength(),n&&X(n)&&n>0&&(o=Math.max(o,Math.ceil(e/n)));for(var s=0;s<o;s++){var h=r.getPointAtLength(e*s/o);a.push([h.x,h.y])}return{ring:a,skipBisect:!0}}function B(t){if("undefined"!=typeof window&&window&&window.document)try{var n=window.document.createElementNS("http://www.w3.org/2000/svg","path");return n.setAttributeNS(null,"d",t),n}catch(t){}return Sn(t)}function W(t,n){for(var e=t.length+n,r=en(t)/n,i=0,a=0,o=r/2;t.length<e;){var s=t[i],h=t[(i+1)%t.length],u=F(s,h);o<=a+u?(t.splice(i+1,0,u?z(s,h,(o-a)/u):s.slice(0)),o+=r):(a+=u,i++)}}function $(t,n){void 0===n&&(n=1/0);for(var e=0;e<t.length;e++)for(var r=t[e],i=e===t.length-1?t[0]:t[e+1];F(r,i)>n;)i=z(r,i,.5),t.splice(e+1,0,i)}function J(t,n){var e,r,i;if("string"==typeof t){var a=Q(t,n);t=a.ring,i=a.skipBisect}else if(!Array.isArray(t))throw new TypeError(Cn);if(e=t.slice(0),!K(e))throw new TypeError(Cn);return e.length>1&&j(e[0],e[e.length-1])&&e.pop(),r=tn(e),r>0&&e.reverse(),!i&&n&&X(n)&&n>0&&$(e,n),e}function K(t){return t.every(function(t){return Array.isArray(t)&&t.length>=2&&X(t[0])&&X(t[1])})}function tt(t,n,e){var r;return r=t.length-n.length,W(t,r<0?-1*r:0),W(n,r>0?r:0),Tn(t,n),I(t,n,e)}function nt(t,n,e){e=e||2;var r=n&&n.length,i=r?n[0]*e:t.length,a=et(t,0,i,e,!0),o=[];if(!a)return o;var s,h,u,c,f,l,p;if(r&&(a=ut(t,n,a,e)),t.length>80*e){s=u=t[0],h=c=t[1];for(var g=e;g<i;g+=e)f=t[g],l=t[g+1],f<s&&(s=f),l<h&&(h=l),f>u&&(u=f),l>c&&(c=l);p=Math.max(u-s,c-h)}return it(a,o,e,s,h,p),o}function et(t,n,e,r,i){var a,o;if(i===Et(t,n,e,r)>0)for(a=n;a<e;a+=r)o=kt(a,t[a],t[a+1],o);else for(a=e-r;a>=n;a-=r)o=kt(a,t[a],t[a+1],o);return o&&Mt(o,o.next)&&(Pt(o),o=o.next),o}function rt(t,n){if(!t)return t;n||(n=t);var e,r=t;do{if(e=!1,r.steiner||!Mt(r,r.next)&&0!==mt(r.prev,r,r.next))r=r.next;else{if(Pt(r),(r=n=r.prev)===r.next)return null;e=!0}}while(e||r!==n);return n}function it(t,n,e,r,i,a,o){if(t){!o&&a&&pt(t,r,i,a);for(var s,h,u=t;t.prev!==t.next;)if(s=t.prev,h=t.next,a?ot(t,r,i,a):at(t))n.push(s.i/e),n.push(t.i/e),n.push(h.i/e),Pt(t),t=h.next,u=h.next;else if((t=h)===u){o?1===o?(t=st(t,n,e),it(t,n,e,r,i,a,2)):2===o&&ht(t,n,e,r,i,a):it(rt(t),n,e,r,i,a,1);break}}}function at(t){var n=t.prev,e=t,r=t.next;if(mt(n,e,r)>=0)return!1;for(var i=t.next.next;i!==t.prev;){if(yt(n.x,n.y,e.x,e.y,r.x,r.y,i.x,i.y)&&mt(i.prev,i,i.next)>=0)return!1;i=i.next}return!0}function ot(t,n,e,r){var i=t.prev,a=t,o=t.next;if(mt(i,a,o)>=0)return!1;for(var s=i.x<a.x?i.x<o.x?i.x:o.x:a.x<o.x?a.x:o.x,h=i.y<a.y?i.y<o.y?i.y:o.y:a.y<o.y?a.y:o.y,u=i.x>a.x?i.x>o.x?i.x:o.x:a.x>o.x?a.x:o.x,c=i.y>a.y?i.y>o.y?i.y:o.y:a.y>o.y?a.y:o.y,f=vt(s,h,n,e,r),l=vt(u,c,n,e,r),p=t.nextZ;p&&p.z<=l;){if(p!==t.prev&&p!==t.next&&yt(i.x,i.y,a.x,a.y,o.x,o.y,p.x,p.y)&&mt(p.prev,p,p.next)>=0)return!1;p=p.nextZ}for(p=t.prevZ;p&&p.z>=f;){if(p!==t.prev&&p!==t.next&&yt(i.x,i.y,a.x,a.y,o.x,o.y,p.x,p.y)&&mt(p.prev,p,p.next)>=0)return!1;p=p.prevZ}return!0}function st(t,n,e){var r=t;do{var i=r.prev,a=r.next.next;!Mt(i,a)&&wt(i,r,r.next,a)&&Lt(i,a)&&Lt(a,i)&&(n.push(i.i/e),n.push(r.i/e),n.push(a.i/e),Pt(r),Pt(r.next),r=t=a),r=r.next}while(r!==t);return r}function ht(t,n,e,r,i,a){var o=t;do{for(var s=o.next.next;s!==o.prev;){if(o.i!==s.i&&dt(o,s)){var h=qt(o,s);return o=rt(o,o.next),h=rt(h,h.next),it(o,n,e,r,i,a),void it(h,n,e,r,i,a)}s=s.next}o=o.next}while(o!==t)}function ut(t,n,e,r){var i,a,o,s,h,u=[];for(i=0,a=n.length;i<a;i++)o=n[i]*r,s=i<a-1?n[i+1]*r:t.length,h=et(t,o,s,r,!1),h===h.next&&(h.steiner=!0),u.push(xt(h));for(u.sort(ct),i=0;i<u.length;i++)ft(u[i],e),e=rt(e,e.next);return e}function ct(t,n){return t.x-n.x}function ft(t,n){if(n=lt(t,n)){var e=qt(n,t);rt(e,e.next)}}function lt(t,n){var e,r=n,i=t.x,a=t.y,o=-1/0;do{if(a<=r.y&&a>=r.next.y){var s=r.x+(a-r.y)*(r.next.x-r.x)/(r.next.y-r.y);if(s<=i&&s>o){if(o=s,s===i){if(a===r.y)return r;if(a===r.next.y)return r.next}e=r.x<r.next.x?r:r.next}}r=r.next}while(r!==n);if(!e)return null;if(i===o)return e.prev;var h,u=e,c=e.x,f=e.y,l=1/0;for(r=e.next;r!==u;)i>=r.x&&r.x>=c&&yt(a<f?i:o,a,c,f,a<f?o:i,a,r.x,r.y)&&((h=Math.abs(a-r.y)/(i-r.x))<l||h===l&&r.x>e.x)&&Lt(r,t)&&(e=r,l=h),r=r.next;return e}function pt(t,n,e,r){var i=t;do{null===i.z&&(i.z=vt(i.x,i.y,n,e,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next}while(i!==t);i.prevZ.nextZ=null,i.prevZ=null,gt(i)}function gt(t){var n,e,r,i,a,o,s,h,u=1;do{for(e=t,t=null,a=null,o=0;e;){for(o++,r=e,s=0,n=0;n<u&&(s++,r=r.nextZ);n++);for(h=u;s>0||h>0&&r;)0===s?(i=r,r=r.nextZ,h--):0!==h&&r?e.z<=r.z?(i=e,e=e.nextZ,s--):(i=r,r=r.nextZ,h--):(i=e,e=e.nextZ,s--),a?a.nextZ=i:t=i,i.prevZ=a,a=i;e=r}a.nextZ=null,u*=2}while(o>1);return t}function vt(t,n,e,r,i){return t=32767*(t-e)/i,n=32767*(n-r)/i,t=16711935&(t|t<<8),t=252645135&(t|t<<4),t=858993459&(t|t<<2),t=1431655765&(t|t<<1),n=16711935&(n|n<<8),n=252645135&(n|n<<4),n=858993459&(n|n<<2),n=1431655765&(n|n<<1),t|n<<1}function xt(t){var n=t,e=t;do{n.x<e.x&&(e=n),n=n.next}while(n!==t);return e}function yt(t,n,e,r,i,a,o,s){return(i-o)*(n-s)-(t-o)*(a-s)>=0&&(t-o)*(r-s)-(e-o)*(n-s)>=0&&(e-o)*(a-s)-(i-o)*(r-s)>=0}function dt(t,n){return t.next.i!==n.i&&t.prev.i!==n.i&&!bt(t,n)&&Lt(t,n)&&Lt(n,t)&&At(t,n)}function mt(t,n,e){return(n.y-t.y)*(e.x-n.x)-(n.x-t.x)*(e.y-n.y)}function Mt(t,n){return t.x===n.x&&t.y===n.y}function wt(t,n,e,r){return!!(Mt(t,n)&&Mt(e,r)||Mt(t,r)&&Mt(e,n))||mt(t,n,e)>0!=mt(t,n,r)>0&&mt(e,r,t)>0!=mt(e,r,n)>0}function bt(t,n){var e=t;do{if(e.i!==t.i&&e.next.i!==t.i&&e.i!==n.i&&e.next.i!==n.i&&wt(e,e.next,t,n))return!0;e=e.next}while(e!==t);return!1}function Lt(t,n){return mt(t.prev,t,t.next)<0?mt(t,n,t.next)>=0&&mt(t,t.prev,n)>=0:mt(t,n,t.prev)<0||mt(t,t.next,n)<0}function At(t,n){var e=t,r=!1,i=(t.x+n.x)/2,a=(t.y+n.y)/2;do{e.y>a!=e.next.y>a&&i<(e.next.x-e.x)*(a-e.y)/(e.next.y-e.y)+e.x&&(r=!r),e=e.next}while(e!==t);return r}function qt(t,n){var e=new _t(t.i,t.x,t.y),r=new _t(n.i,n.x,n.y),i=t.next,a=n.prev;return t.next=n,n.prev=t,e.next=i,i.prev=e,r.next=e,e.prev=r,a.next=r,r.prev=a,r}function kt(t,n,e,r){var i=new _t(t,n,e);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function Pt(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function _t(t,n,e){this.i=t,this.x=n,this.y=e,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Et(t,n,e,r){for(var i=0,a=n,o=e-r;a<e;a+=r)i+=(t[o]-t[a])*(t[a+1]+t[o+1]),o=a;return i}function St(t,n){var e=n.id,r=n.bbox,i=null==n.properties?{}:n.properties,a=Ct(t,n);return null==e&&null==r?{type:"Feature",properties:i,geometry:a}:null==r?{type:"Feature",id:e,properties:i,geometry:a}:{type:"Feature",id:e,bbox:r,properties:i,geometry:a}}function Ct(t,n){function e(t,n){n.length&&n.pop();for(var e=u[t<0?~t:t],r=0,i=e.length;r<i;++r)n.push(h(e[r],r));t<0&&Vn(n,i)}function r(t){return h(t)}function i(t){for(var n=[],r=0,i=t.length;r<i;++r)e(t[r],n);return n.length<2&&n.push(n[0]),n}function a(t){for(var n=i(t);n.length<4;)n.push(n[0]);return n}function o(t){return t.map(a)}function s(t){var n,e=t.type;switch(e){case"GeometryCollection":return{type:e,geometries:t.geometries.map(s)};case"Point":n=r(t.coordinates);break;case"MultiPoint":n=t.coordinates.map(r);break;case"LineString":n=i(t.arcs);break;case"MultiLineString":n=t.arcs.map(i);break;case"Polygon":n=o(t.arcs);break;case"MultiPolygon":n=t.arcs.map(o);break;default:return null}return{type:e,coordinates:n}}var h=In(t.transform),u=t.arcs;return s(n)}function Zt(t){for(var n,e=-1,r=t.length,i=t[r-1],a=0;++e<r;)n=i,i=t[e],a+=n[0]*i[1]-n[1]*i[0];return Math.abs(a)}function Tt(t,n){function e(t){switch(t.type){case"GeometryCollection":t.geometries.forEach(e);break;case"Polygon":r(t.arcs);break;case"MultiPolygon":t.arcs.forEach(r)}}function r(t){t.forEach(function(n){n.forEach(function(n){(a[n=n<0?~n:n]||(a[n]=[])).push(t)})}),o.push(t)}function i(n){return Zt(Ct(t,{type:"Polygon",arcs:[n]}).coordinates[0])}var a={},o=[],s=[];return n.forEach(e),o.forEach(function(t){if(!t._){var n=[],e=[t];for(t._=1,s.push(n);t=e.pop();)n.push(t),t.forEach(function(t){t.forEach(function(t){a[t<0?~t:t].forEach(function(t){t._||(t._=1,e.push(t))})})})}}),o.forEach(function(t){delete t._}),{type:"MultiPolygon",arcs:s.map(function(n){var e,r=[];if(n.forEach(function(t){t.forEach(function(t){t.forEach(function(t){a[t<0?~t:t].length<2&&r.push(t)})})}),r=Yn(t,r),(e=r.length)>1)for(var o,s,h=1,u=i(r[0]);h<e;++h)(o=i(r[h]))>u&&(s=r[0],r[0]=r[h],r[h]=s,u=o);return r})}}function Ft(t){return function(n,e){return Dn(t(n),e)}}function zt(t,n){var e={},r={type:"Topology",objects:{triangles:{type:"GeometryCollection",geometries:[]}},arcs:[]};return t.forEach(function(t){var i=[];t.forEach(function(t,a){var o=t[0]<t[1]?t.join(","):t[1]+","+t[0],s=t.map(function(t){return n[t]});o in e?i.push(~e[o]):(i.push(e[o]=r.arcs.length),r.arcs.push(s))}),r.objects.triangles.geometries.push({type:"Polygon",area:Math.abs(tn(t.map(function(t){return n[t[0]]}))),arcs:[i]})}),r.objects.triangles.geometries.sort(function(t,n){return t.area-n.area}),r}function jt(t,n){for(var e=t.objects.triangles.geometries,r=Hn(function(t){return t.area}).left;e.length>n;)!function(){var n=e[0],i=On(e)[0][0],a=e[i],o=Tt(t,[n,a]);o.area=n.area+a.area,o.type="Polygon",o.arcs=o.arcs[0],e.splice(i,1),e.shift(),e.splice(r(e,o.area),0,o)}();if(n>e.length)throw new RangeError("Can't collapse topology into "+n+" pieces.");return Xn(t,t.objects.triangles).features.map(function(t){return t.geometry.coordinates[0].pop(),t.geometry.coordinates[0]})}function It(t){for(var n=zn(t.reduce(function(t,n){return t.concat([n[0]],[n[1]])},[])),e=[],r=0,i=n.length;r<i;r+=3)e.push([[n[r],n[r+1]],[n[r+1],n[r+2]],[n[r+2],n[r]]]);return e}function Vt(t,n,e){function r(t,n,o){void 0===n&&(n=[]),void 0===o&&(o=0);for(var s=0;s<t.length;s++){var h=t.splice(s,1),u=e[h[0]][n.length];o+u<i&&(t.length?r(t.slice(),n.concat(h),o+u):(i=o+u,a=n.concat(h))),t.length&&t.splice(s,0,h[0])}}var i=1/0,a=t.map(function(t,n){return n});return r(a),a}function Xt(t,n){var e=F(Y(t),Y(n));return e*e}function Yt(t,n,e){void 0===e&&(e={});var r=e.maxSegmentLength;void 0===r&&(r=10);var i=e.string;void 0===i&&(i=!0);var a=e.single;void 0===a&&(a=!1);var o=J(t,r);o.length<n.length+2&&W(o,n.length+2-o.length);var s,h=Qn(o,n.length),u=n.map(function(t){return J(t,r)}),c="string"==typeof t&&t;return a&&!n.every(function(t){return"string"==typeof t})||(s=n.slice(0)),Dt(h,u,{match:!0,string:i,single:a,t0:c,t1:s})}function Gt(t,n,e){void 0===e&&(e={});var r=e.maxSegmentLength;void 0===r&&(r=10);var i=e.string;void 0===i&&(i=!0);var a=e.single;void 0===a&&(a=!1);var o=Yt(n,t,{maxSegmentLength:r,string:i,single:a});return a?function(t){return o(1-t)}:o.map(function(t){return function(n){return t(1-n)}})}function Ot(t,n,e){void 0===e&&(e={});var r=e.maxSegmentLength;void 0===r&&(r=10);var i=e.string;void 0===i&&(i=!0);var a=e.single;if(void 0===a&&(a=!1),!Array.isArray(t)||!Array.isArray(n)||t.length!==n.length||!t.length)throw new TypeError(Zn);var o,s,h=function(t){return J(t,r)},u=t.map(h),c=n.map(h);return a?(t.every(function(t){return"string"==typeof t})&&(o=t.slice(0)),n.every(function(t){return"string"==typeof t})&&(s=n.slice(0))):(o=t.slice(0),s=n.slice(0)),Dt(u,c,{string:i,single:a,t0:o,t1:s,match:!1})}function Dt(t,n,e){void 0===e&&(e={});var r=e.string,i=e.single,a=e.t0,o=e.t1,s=e.match,h=s?Un(t,n):t.map(function(t,n){return n}),u=h.map(function(e,i){return tt(t[e],n[i],r)});if(s&&Array.isArray(a)&&(a=h.map(function(t){return a[t]})),i&&r&&(Array.isArray(a)&&(a=a.join(" ")),Array.isArray(o)&&(o=o.join(" "))),i){var c=r?function(t){return u.map(function(n){return n(t)}).join(" ")}:function(t){return u.map(function(n){return n(t)})};return r&&(a||o)?function(t){return t<1e-4&&a||1-t<1e-4&&o||c(t)}:c}return r?(a=Array.isArray(a)?a.map(function(t){return"string"==typeof t&&t}):[],o=Array.isArray(o)?o.map(function(t){return"string"==typeof t&&t}):[],u.map(function(t,n){return a[n]||o[n]?function(e){return e<1e-4&&a[n]||1-e<1e-4&&o[n]||t(e)}:t})):u}function Ht(t,n,e,r,i){return Rt(Bt(t,n,e),r,Jt(t,n,e),2*Math.PI*e,i)}function Nt(t,n,e,r,i){var a=Ht(n,e,r,t,i);return function(t){return a(1-t)}}function Qt(t,n,e,r,i,a){return Rt(Wt(t,n,e,r),i,Kt(t,n,e,r),2*e+2*r,a)}function Ut(t,n,e,r,i,a){var o=Qt(n,e,r,i,t,a);return function(t){return o(1-t)}}function Rt(t,n,e,r,i){void 0===i&&(i={});var a=i.maxSegmentLength;void 0===a&&(a=10);var o=i.string;void 0===o&&(o=!0);var s,h,u=J(n,a);return X(r)&&u.length<r/a&&W(u,Math.ceil(r/a-u.length)),s=t(u),h=I(s,u,o),o?function(t){return t<1e-4?e:h(t)}:h}function Bt(t,n,e){return function(r){var i=Y(r),a=en(r.concat([r[0]])),o=Math.atan2(r[0][1]-i[1],r[0][0]-i[0]),s=0;return r.map(function(i,h){var u;return h&&(s+=F(i,r[h-1])),u=o+2*Math.PI*(a?s/a:h/r.length),[Math.cos(u)*e+t,Math.sin(u)*e+n]})}}function Wt(t,n,e,r){return function(i){var a=Y(i),o=en(i.concat([i[0]])),s=Math.atan2(i[0][1]-a[1],i[0][0]-a[0]),h=0;s<0&&(s=2*Math.PI+s);var u=s/(2*Math.PI);return i.map(function(a,s){s&&(h+=F(a,i[s-1]));var c=$t((u+(o?h/o:s/i.length))%1);return[t+c[0]*e,n+c[1]*r]})}}function $t(t){return t<=1/8?[1,.5+4*t]:t<=3/8?[1.5-4*t,1]:t<=5/8?[0,2.5-4*t]:t<=7/8?[4*t-2.5,0]:[1,4*t-3.5]}function Jt(t,n,e){var r=t-e+","+n,i=t+e+","+n,a="A"+e+","+e+",0,1,1,";return"M"+r+a+i+a+r+"Z"}function Kt(t,n,e,r){var i=t+e,a=n+r;return"M"+t+","+n+"L"+i+","+n+"L"+i+","+a+"L"+t+","+a+"Z"}var tn=function(t){for(var n,e=-1,r=t.length,i=t[r-1],a=0;++e<r;)n=i,i=t[e],a+=n[1]*i[0]-n[0]*i[1];return a/2},nn=function(t){for(var n,e,r=-1,i=t.length,a=0,o=0,s=t[i-1],h=0;++r<i;)n=s,s=t[r],h+=e=n[0]*s[1]-s[0]*n[1],a+=(n[0]+s[0])*e,o+=(n[1]+s[1])*e;return h*=3,[a/h,o/h]},en=function(t){for(var n,e,r=-1,i=t.length,a=t[i-1],o=a[0],s=a[1],h=0;++r<i;)n=o,e=s,a=t[r],o=a[0],s=a[1],n-=o,e-=s,h+=Math.sqrt(n*n+e*e);return h},rn={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},an=[5760,6158,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8239,8287,12288,65279],on=function(t){var n=new a(t),e=n.max;for(o(n);n.index<e&&!n.err.length;)u(n);return n.err.length?n.result=[]:n.result.length&&("mM".indexOf(n.result[0][0])<0?(n.err="SvgPath: string should start with `M` or `m`",n.result=[]):n.result[0][0]="M"),{err:n.err,segments:n.result}};f.prototype.matrix=function(t){return 1===t[0]&&0===t[1]&&0===t[2]&&1===t[3]&&0===t[4]&&0===t[5]?this:(this.cache=null,this.queue.push(t),this)},f.prototype.translate=function(t,n){return 0===t&&0===n||(this.cache=null,this.queue.push([1,0,0,1,t,n])),this},f.prototype.scale=function(t,n){return 1===t&&1===n||(this.cache=null,this.queue.push([t,0,0,n,0,0])),this},f.prototype.rotate=function(t,n,e){var r,i,a;return 0!==t&&(this.translate(n,e),r=t*Math.PI/180,i=Math.cos(r),a=Math.sin(r),this.queue.push([i,a,-a,i,0,0]),this.cache=null,this.translate(-n,-e)),this},f.prototype.skewX=function(t){return 0!==t&&(this.cache=null,this.queue.push([1,0,Math.tan(t*Math.PI/180),1,0,0])),this},f.prototype.skewY=function(t){return 0!==t&&(this.cache=null,this.queue.push([1,Math.tan(t*Math.PI/180),0,1,0,0])),this},f.prototype.toArray=function(){var t=this;if(this.cache)return this.cache;if(!this.queue.length)return this.cache=[1,0,0,1,0,0],this.cache;if(this.cache=this.queue[0],1===this.queue.length)return this.cache;for(var n=1;n<this.queue.length;n++)t.cache=c(t.cache,t.queue[n]);return this.cache},f.prototype.calc=function(t,n,e){var r;return this.queue.length?(this.cache||(this.cache=this.toArray()),r=this.cache,[t*r[0]+n*r[2]+(e?0:r[4]),t*r[1]+n*r[3]+(e?0:r[5])]):[t,n]};var sn=f,hn={matrix:!0,scale:!0,rotate:!0,translate:!0,skewX:!0,skewY:!0},un=/\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*(.+?)\s*\)[\s,]*/,cn=/[\s,]+/,fn=function(t){var n,e,r=new sn;return t.split(un).forEach(function(t){if(t.length){if(void 0!==hn[t])return void(n=t);switch(e=t.split(cn).map(function(t){return+t||0}),n){case"matrix":return void(6===e.length&&r.matrix(e));case"scale":return void(1===e.length?r.scale(e[0],e[0]):2===e.length&&r.scale(e[0],e[1]));case"rotate":return void(1===e.length?r.rotate(e[0],0,0):3===e.length&&r.rotate(e[0],e[1],e[2]));case"translate":return void(1===e.length?r.translate(e[0],0):2===e.length&&r.translate(e[0],e[1]));case"skewX":return void(1===e.length&&r.skewX(e[0]));case"skewY":return void(1===e.length&&r.skewY(e[0]))}}}),r},ln=2*Math.PI,pn=function(t,n,e,r,i,a,o,s,h){var u=Math.sin(h*ln/360),c=Math.cos(h*ln/360),f=c*(t-e)/2+u*(n-r)/2,l=-u*(t-e)/2+c*(n-r)/2;if(0===f&&0===l)return[];if(0===o||0===s)return[];o=Math.abs(o),s=Math.abs(s);var v=f*f/(o*o)+l*l/(s*s);v>1&&(o*=Math.sqrt(v),s*=Math.sqrt(v));var x=p(t,n,e,r,i,a,o,s,u,c),y=[],d=x[2],m=x[3],M=Math.max(Math.ceil(Math.abs(m)/(ln/4)),1);m/=M;for(var w=0;w<M;w++)y.push(g(d,m)),d+=m;return y.map(function(t){for(var n=0;n<t.length;n+=2){var e=t[n+0],r=t[n+1];e*=o,r*=s;var i=c*e-u*r,a=u*e+c*r;t[n+0]=i+x[0],t[n+1]=a+x[1]}return t})},gn=Math.PI/180;v.prototype.transform=function(t){var n=Math.cos(this.ax*gn),e=Math.sin(this.ax*gn),r=[this.rx*(t[0]*n+t[2]*e),this.rx*(t[1]*n+t[3]*e),this.ry*(-t[0]*e+t[2]*n),this.ry*(-t[1]*e+t[3]*n)],i=r[0]*r[0]+r[2]*r[2],a=r[1]*r[1]+r[3]*r[3],o=((r[0]-r[3])*(r[0]-r[3])+(r[2]+r[1])*(r[2]+r[1]))*((r[0]+r[3])*(r[0]+r[3])+(r[2]-r[1])*(r[2]-r[1])),s=(i+a)/2;if(o<1e-10*s)return this.rx=this.ry=Math.sqrt(s),this.ax=0,this;var h=r[0]*r[1]+r[2]*r[3];o=Math.sqrt(o);var u=s+o/2,c=s-o/2;return this.ax=Math.abs(h)<1e-10&&Math.abs(u-a)<1e-10?90:180*Math.atan(Math.abs(h)>Math.abs(u-a)?(u-i)/h:h/(u-a))/Math.PI,this.ax>=0?(this.rx=Math.sqrt(u),this.ry=Math.sqrt(c)):(this.ax+=90,this.rx=Math.sqrt(c),this.ry=Math.sqrt(u)),this},v.prototype.isDegenerate=function(){return this.rx<1e-10*this.ry||this.ry<1e-10*this.rx};var vn=v;x.prototype.__matrix=function(t){var n,e=this;t.queue.length&&this.iterate(function(r,i,a,o){var s,h,u,c;switch(r[0]){case"v":s=t.calc(0,r[1],!0),h=0===s[0]?["v",s[1]]:["l",s[0],s[1]];break;case"V":s=t.calc(a,r[1],!1),h=s[0]===t.calc(a,o,!1)[0]?["V",s[1]]:["L",s[0],s[1]];break;case"h":s=t.calc(r[1],0,!0),h=0===s[1]?["h",s[0]]:["l",s[0],s[1]];break;case"H":s=t.calc(r[1],o,!1),h=s[1]===t.calc(a,o,!1)[1]?["H",s[0]]:["L",s[0],s[1]];break;case"a":case"A":var f=t.toArray(),l=vn(r[1],r[2],r[3]).transform(f);if(f[0]*f[3]-f[1]*f[2]<0&&(r[5]=r[5]?"0":"1"),s=t.calc(r[6],r[7],"a"===r[0]),"A"===r[0]&&r[6]===a&&r[7]===o||"a"===r[0]&&0===r[6]&&0===r[7]){h=["a"===r[0]?"l":"L",s[0],s[1]];break}h=l.isDegenerate()?["a"===r[0]?"l":"L",s[0],s[1]]:[r[0],l.rx,l.ry,l.ax,r[4],r[5],s[0],s[1]];break;case"m":c=i>0,s=t.calc(r[1],r[2],c),h=["m",s[0],s[1]];break;default:for(u=r[0],h=[u],c=u.toLowerCase()===u,n=1;n<r.length;n+=2)s=t.calc(r[n],r[n+1],c),h.push(s[0],s[1])}e.segments[i]=h},!0)},x.prototype.__evaluateStack=function(){var t,n,e=this;if(this.__stack.length){if(1===this.__stack.length)return this.__matrix(this.__stack[0]),void(this.__stack=[]);for(t=sn(),n=this.__stack.length;--n>=0;)t.matrix(e.__stack[n].toArray());this.__matrix(t),this.__stack=[]}},x.prototype.toString=function(){var t,n,e=this,r=[];this.__evaluateStack();for(var i=0;i<this.segments.length;i++)n=e.segments[i][0],t=i>0&&"m"!==n&&"M"!==n&&n===e.segments[i-1][0],r=r.concat(t?e.segments[i].slice(1):e.segments[i]);return r.join(" ").replace(/ ?([achlmqrstvz]) ?/gi,"$1").replace(/ \-/g,"-").replace(/zm/g,"z m")},x.prototype.translate=function(t,n){return this.__stack.push(sn().translate(t,n||0)),this},x.prototype.scale=function(t,n){return this.__stack.push(sn().scale(t,n||0===n?n:t)),this},x.prototype.rotate=function(t,n,e){return this.__stack.push(sn().rotate(t,n||0,e||0)),this},x.prototype.skewX=function(t){return this.__stack.push(sn().skewX(t)),this},x.prototype.skewY=function(t){return this.__stack.push(sn().skewY(t)),this},x.prototype.matrix=function(t){return this.__stack.push(sn().matrix(t)),this},x.prototype.transform=function(t){return t.trim()?(this.__stack.push(fn(t)),this):this},x.prototype.round=function(t){var n,e=0,r=0,i=0,a=0;return t=t||0,this.__evaluateStack(),this.segments.forEach(function(o){var s=o[0].toLowerCase()===o[0];switch(o[0]){case"H":case"h":return s&&(o[1]+=i),i=o[1]-o[1].toFixed(t),void(o[1]=+o[1].toFixed(t));case"V":case"v":return s&&(o[1]+=a),a=o[1]-o[1].toFixed(t),void(o[1]=+o[1].toFixed(t));case"Z":case"z":return i=e,void(a=r);case"M":case"m":return s&&(o[1]+=i,o[2]+=a),i=o[1]-o[1].toFixed(t),a=o[2]-o[2].toFixed(t),e=i,r=a,o[1]=+o[1].toFixed(t),void(o[2]=+o[2].toFixed(t));case"A":case"a":return s&&(o[6]+=i,o[7]+=a),i=o[6]-o[6].toFixed(t),a=o[7]-o[7].toFixed(t),o[1]=+o[1].toFixed(t),o[2]=+o[2].toFixed(t),o[3]=+o[3].toFixed(t+2),o[6]=+o[6].toFixed(t),void(o[7]=+o[7].toFixed(t));default:return n=o.length,s&&(o[n-2]+=i,o[n-1]+=a),i=o[n-2]-o[n-2].toFixed(t),a=o[n-1]-o[n-1].toFixed(t),void o.forEach(function(n,e){e&&(o[e]=+o[e].toFixed(t))})}}),this},x.prototype.iterate=function(t,n){var e,r,i,a=this.segments,o={},s=!1,h=0,u=0,c=0,f=0;if(n||this.__evaluateStack(),a.forEach(function(n,e){var r=t(n,e,h,u);Array.isArray(r)&&(o[e]=r,s=!0);var i=n[0]===n[0].toLowerCase();switch(n[0]){case"m":case"M":return h=n[1]+(i?h:0),u=n[2]+(i?u:0),c=h,void(f=u);case"h":case"H":return void(h=n[1]+(i?h:0));case"v":case"V":return void(u=n[1]+(i?u:0));case"z":case"Z":return h=c,void(u=f);default:h=n[n.length-2]+(i?h:0),u=n[n.length-1]+(i?u:0)}}),!s)return this;for(i=[],e=0;e<a.length;e++)if(void 0!==o[e])for(r=0;r<o[e].length;r++)i.push(o[e][r]);else i.push(a[e]);return this.segments=i,this},x.prototype.abs=function(){return this.iterate(function(t,n,e,r){var i,a=t[0],o=a.toUpperCase();if(a!==o)switch(t[0]=o,a){case"v":return void(t[1]+=r);case"a":return t[6]+=e,void(t[7]+=r);default:for(i=1;i<t.length;i++)t[i]+=i%2?e:r}},!0),this},x.prototype.rel=function(){return this.iterate(function(t,n,e,r){var i,a=t[0],o=a.toLowerCase();if(a!==o&&(0!==n||"M"!==a))switch(t[0]=o,a){case"V":return void(t[1]-=r);case"A":return t[6]-=e,void(t[7]-=r);default:for(i=1;i<t.length;i++)t[i]-=i%2?e:r}},!0),this},x.prototype.unarc=function(){return this.iterate(function(t,n,e,r){var i,a,o,s=[],h=t[0];return"A"!==h&&"a"!==h?null:("a"===h?(a=e+t[6],o=r+t[7]):(a=t[6],o=t[7]),i=pn(e,r,a,o,t[4],t[5],t[1],t[2],t[3]),0===i.length?[["a"===t[0]?"l":"L",t[6],t[7]]]:(i.forEach(function(t){s.push(["C",t[2],t[3],t[4],t[5],t[6],t[7]])}),s))}),this},x.prototype.unshort=function(){var t,n,e,r,i,a=this.segments;return this.iterate(function(o,s,h,u){var c,f=o[0],l=f.toUpperCase();s&&("T"===l?(c="t"===f,e=a[s-1],"Q"===e[0]?(t=e[1]-h,n=e[2]-u):"q"===e[0]?(t=e[1]-e[3],n=e[2]-e[4]):(t=0,n=0),r=-t,i=-n,c||(r+=h,i+=u),a[s]=[c?"q":"Q",r,i,o[1],o[2]]):"S"===l&&(c="s"===f,e=a[s-1],"C"===e[0]?(t=e[3]-h,n=e[4]-u):"c"===e[0]?(t=e[3]-e[5],n=e[4]-e[6]):(t=0,n=0),r=-t,i=-n,c||(r+=h,i+=u),a[s]=[c?"c":"C",r,i,o[1],o[2],o[3],o[4]]))}),this};var xn=x,yn=xn,dn={a:7,c:6,h:1,l:2,m:2,q:4,s:4,t:2,v:1,z:0},mn=/([astvzqmhlc])([^astvzqmhlc]*)/gi,Mn=function(t){var n=[];return t.replace(mn,function(t,e,r){var i=e.toLowerCase();for(r=y(r),"m"===i&&r.length>2&&(n.push([e].concat(r.splice(0,2))),i="l",e="m"===e?"l":"L");r.length>=0;){if(r.length===dn[i])return r.unshift(e),n.push(r);if(r.length<dn[i])throw new Error("malformed path data");n.push([e].concat(r.splice(0,dn[i])))}}),n},wn=/-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi,bn=function(t,n,e,r,i,a,o,s){return new d(t,n,e,r,i,a,o,s)};d.prototype={constructor:d,init:function(){this.length=this.getArcLength([this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y])},getTotalLength:function(){return this.length},getPointAtLength:function(t){var n=w(t,this.length,this.getArcLength,[this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y]);return this.getPoint([this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y],n)},getTangentAtLength:function(t){var n=w(t,this.length,this.getArcLength,[this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y]),e=this.getDerivative([this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y],n),r=Math.sqrt(e.x*e.x+e.y*e.y);return r>0?{x:e.x/r,y:e.y/r}:{x:0,y:0}},getPropertiesAtLength:function(t){var n,e=w(t,this.length,this.getArcLength,[this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y]),r=this.getDerivative([this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y],e),i=Math.sqrt(r.x*r.x+r.y*r.y);n=i>0?{x:r.x/i,y:r.y/i}:{
x:0,y:0};var a=this.getPoint([this.a.x,this.b.x,this.c.x,this.d.x],[this.a.y,this.b.y,this.c.y,this.d.y],e);return{x:a.x,y:a.y,tangentX:n.x,tangentY:n.y}}};var Ln=[[],[],[-.5773502691896257,.5773502691896257],[0,-.7745966692414834,.7745966692414834],[-.33998104358485626,.33998104358485626,-.8611363115940526,.8611363115940526],[0,-.5384693101056831,.5384693101056831,-.906179845938664,.906179845938664],[.6612093864662645,-.6612093864662645,-.2386191860831969,.2386191860831969,-.932469514203152,.932469514203152],[0,.4058451513773972,-.4058451513773972,-.7415311855993945,.7415311855993945,-.9491079123427585,.9491079123427585],[-.1834346424956498,.1834346424956498,-.525532409916329,.525532409916329,-.7966664774136267,.7966664774136267,-.9602898564975363,.9602898564975363],[0,-.8360311073266358,.8360311073266358,-.9681602395076261,.9681602395076261,-.3242534234038089,.3242534234038089,-.6133714327005904,.6133714327005904],[-.14887433898163122,.14887433898163122,-.4333953941292472,.4333953941292472,-.6794095682990244,.6794095682990244,-.8650633666889845,.8650633666889845,-.9739065285171717,.9739065285171717],[0,-.26954315595234496,.26954315595234496,-.5190961292068118,.5190961292068118,-.7301520055740494,.7301520055740494,-.8870625997680953,.8870625997680953,-.978228658146057,.978228658146057],[-.1252334085114689,.1252334085114689,-.3678314989981802,.3678314989981802,-.5873179542866175,.5873179542866175,-.7699026741943047,.7699026741943047,-.9041172563704749,.9041172563704749,-.9815606342467192,.9815606342467192],[0,-.2304583159551348,.2304583159551348,-.44849275103644687,.44849275103644687,-.6423493394403402,.6423493394403402,-.8015780907333099,.8015780907333099,-.9175983992229779,.9175983992229779,-.9841830547185881,.9841830547185881],[-.10805494870734367,.10805494870734367,-.31911236892788974,.31911236892788974,-.5152486363581541,.5152486363581541,-.6872929048116855,.6872929048116855,-.827201315069765,.827201315069765,-.9284348836635735,.9284348836635735,-.9862838086968123,.9862838086968123],[0,-.20119409399743451,.20119409399743451,-.3941513470775634,.3941513470775634,-.5709721726085388,.5709721726085388,-.7244177313601701,.7244177313601701,-.8482065834104272,.8482065834104272,-.937273392400706,.937273392400706,-.9879925180204854,.9879925180204854],[-.09501250983763744,.09501250983763744,-.2816035507792589,.2816035507792589,-.45801677765722737,.45801677765722737,-.6178762444026438,.6178762444026438,-.755404408355003,.755404408355003,-.8656312023878318,.8656312023878318,-.9445750230732326,.9445750230732326,-.9894009349916499,.9894009349916499],[0,-.17848418149584785,.17848418149584785,-.3512317634538763,.3512317634538763,-.5126905370864769,.5126905370864769,-.6576711592166907,.6576711592166907,-.7815140038968014,.7815140038968014,-.8802391537269859,.8802391537269859,-.9506755217687678,.9506755217687678,-.9905754753144174,.9905754753144174],[-.0847750130417353,.0847750130417353,-.2518862256915055,.2518862256915055,-.41175116146284263,.41175116146284263,-.5597708310739475,.5597708310739475,-.6916870430603532,.6916870430603532,-.8037049589725231,.8037049589725231,-.8926024664975557,.8926024664975557,-.9558239495713977,.9558239495713977,-.9915651684209309,.9915651684209309],[0,-.16035864564022537,.16035864564022537,-.31656409996362983,.31656409996362983,-.46457074137596094,.46457074137596094,-.600545304661681,.600545304661681,-.7209661773352294,.7209661773352294,-.8227146565371428,.8227146565371428,-.9031559036148179,.9031559036148179,-.96020815213483,.96020815213483,-.9924068438435844,.9924068438435844],[-.07652652113349734,.07652652113349734,-.22778585114164507,.22778585114164507,-.37370608871541955,.37370608871541955,-.5108670019508271,.5108670019508271,-.636053680726515,.636053680726515,-.7463319064601508,.7463319064601508,-.8391169718222188,.8391169718222188,-.912234428251326,.912234428251326,-.9639719272779138,.9639719272779138,-.9931285991850949,.9931285991850949],[0,-.1455618541608951,.1455618541608951,-.2880213168024011,.2880213168024011,-.4243421202074388,.4243421202074388,-.5516188358872198,.5516188358872198,-.6671388041974123,.6671388041974123,-.7684399634756779,.7684399634756779,-.8533633645833173,.8533633645833173,-.9200993341504008,.9200993341504008,-.9672268385663063,.9672268385663063,-.9937521706203895,.9937521706203895],[-.06973927331972223,.06973927331972223,-.20786042668822127,.20786042668822127,-.34193582089208424,.34193582089208424,-.469355837986757,.469355837986757,-.5876404035069116,.5876404035069116,-.6944872631866827,.6944872631866827,-.7878168059792081,.7878168059792081,-.8658125777203002,.8658125777203002,-.926956772187174,.926956772187174,-.9700604978354287,.9700604978354287,-.9942945854823992,.9942945854823992],[0,-.1332568242984661,.1332568242984661,-.26413568097034495,.26413568097034495,-.3903010380302908,.3903010380302908,-.5095014778460075,.5095014778460075,-.6196098757636461,.6196098757636461,-.7186613631319502,.7186613631319502,-.8048884016188399,.8048884016188399,-.8767523582704416,.8767523582704416,-.9329710868260161,.9329710868260161,-.9725424712181152,.9725424712181152,-.9947693349975522,.9947693349975522],[-.06405689286260563,.06405689286260563,-.1911188674736163,.1911188674736163,-.3150426796961634,.3150426796961634,-.4337935076260451,.4337935076260451,-.5454214713888396,.5454214713888396,-.6480936519369755,.6480936519369755,-.7401241915785544,.7401241915785544,-.820001985973903,.820001985973903,-.8864155270044011,.8864155270044011,-.9382745520027328,.9382745520027328,-.9747285559713095,.9747285559713095,-.9951872199970213,.9951872199970213]],An=[[],[],[1,1],[.8888888888888888,.5555555555555556,.5555555555555556],[.6521451548625461,.6521451548625461,.34785484513745385,.34785484513745385],[.5688888888888889,.47862867049936647,.47862867049936647,.23692688505618908,.23692688505618908],[.3607615730481386,.3607615730481386,.46791393457269104,.46791393457269104,.17132449237917036,.17132449237917036],[.4179591836734694,.3818300505051189,.3818300505051189,.27970539148927664,.27970539148927664,.1294849661688697,.1294849661688697],[.362683783378362,.362683783378362,.31370664587788727,.31370664587788727,.22238103445337448,.22238103445337448,.10122853629037626,.10122853629037626],[.3302393550012598,.1806481606948574,.1806481606948574,.08127438836157441,.08127438836157441,.31234707704000286,.31234707704000286,.26061069640293544,.26061069640293544],[.29552422471475287,.29552422471475287,.26926671930999635,.26926671930999635,.21908636251598204,.21908636251598204,.1494513491505806,.1494513491505806,.06667134430868814,.06667134430868814],[.2729250867779006,.26280454451024665,.26280454451024665,.23319376459199048,.23319376459199048,.18629021092773426,.18629021092773426,.1255803694649046,.1255803694649046,.05566856711617366,.05566856711617366],[.24914704581340277,.24914704581340277,.2334925365383548,.2334925365383548,.20316742672306592,.20316742672306592,.16007832854334622,.16007832854334622,.10693932599531843,.10693932599531843,.04717533638651183,.04717533638651183],[.2325515532308739,.22628318026289723,.22628318026289723,.2078160475368885,.2078160475368885,.17814598076194574,.17814598076194574,.13887351021978725,.13887351021978725,.09212149983772845,.09212149983772845,.04048400476531588,.04048400476531588],[.2152638534631578,.2152638534631578,.2051984637212956,.2051984637212956,.18553839747793782,.18553839747793782,.15720316715819355,.15720316715819355,.12151857068790319,.12151857068790319,.08015808715976021,.08015808715976021,.03511946033175186,.03511946033175186],[.2025782419255613,.19843148532711158,.19843148532711158,.1861610000155622,.1861610000155622,.16626920581699392,.16626920581699392,.13957067792615432,.13957067792615432,.10715922046717194,.10715922046717194,.07036604748810812,.07036604748810812,.03075324199611727,.03075324199611727],[.1894506104550685,.1894506104550685,.18260341504492358,.18260341504492358,.16915651939500254,.16915651939500254,.14959598881657674,.14959598881657674,.12462897125553388,.12462897125553388,.09515851168249279,.09515851168249279,.062253523938647894,.062253523938647894,.027152459411754096,.027152459411754096],[.17944647035620653,.17656270536699264,.17656270536699264,.16800410215645004,.16800410215645004,.15404576107681028,.15404576107681028,.13513636846852548,.13513636846852548,.11188384719340397,.11188384719340397,.08503614831717918,.08503614831717918,.0554595293739872,.0554595293739872,.02414830286854793,.02414830286854793],[.1691423829631436,.1691423829631436,.16427648374583273,.16427648374583273,.15468467512626524,.15468467512626524,.14064291467065065,.14064291467065065,.12255520671147846,.12255520671147846,.10094204410628717,.10094204410628717,.07642573025488905,.07642573025488905,.0497145488949698,.0497145488949698,.02161601352648331,.02161601352648331],[.1610544498487837,.15896884339395434,.15896884339395434,.15276604206585967,.15276604206585967,.1426067021736066,.1426067021736066,.12875396253933621,.12875396253933621,.11156664554733399,.11156664554733399,.09149002162245,.09149002162245,.06904454273764123,.06904454273764123,.0448142267656996,.0448142267656996,.019461788229726478,.019461788229726478],[.15275338713072584,.15275338713072584,.14917298647260374,.14917298647260374,.14209610931838204,.14209610931838204,.13168863844917664,.13168863844917664,.11819453196151841,.11819453196151841,.10193011981724044,.10193011981724044,.08327674157670475,.08327674157670475,.06267204833410907,.06267204833410907,.04060142980038694,.04060142980038694,.017614007139152118,.017614007139152118],[.14608113364969041,.14452440398997005,.14452440398997005,.13988739479107315,.13988739479107315,.13226893863333747,.13226893863333747,.12183141605372853,.12183141605372853,.10879729916714838,.10879729916714838,.09344442345603386,.09344442345603386,.0761001136283793,.0761001136283793,.057134425426857205,.057134425426857205,.036953789770852494,.036953789770852494,.016017228257774335,.016017228257774335],[.13925187285563198,.13925187285563198,.13654149834601517,.13654149834601517,.13117350478706238,.13117350478706238,.12325237681051242,.12325237681051242,.11293229608053922,.11293229608053922,.10041414444288096,.10041414444288096,.08594160621706773,.08594160621706773,.06979646842452049,.06979646842452049,.052293335152683286,.052293335152683286,.03377490158481415,.03377490158481415,.0146279952982722,.0146279952982722],[.13365457218610619,.1324620394046966,.1324620394046966,.12890572218808216,.12890572218808216,.12304908430672953,.12304908430672953,.11499664022241136,.11499664022241136,.10489209146454141,.10489209146454141,.09291576606003515,.09291576606003515,.07928141177671895,.07928141177671895,.06423242140852585,.06423242140852585,.04803767173108467,.04803767173108467,.030988005856979445,.030988005856979445,.013411859487141771,.013411859487141771],[.12793819534675216,.12793819534675216,.1258374563468283,.1258374563468283,.12167047292780339,.12167047292780339,.1155056680537256,.1155056680537256,.10744427011596563,.10744427011596563,.09761865210411388,.09761865210411388,.08619016153195327,.08619016153195327,.0733464814110803,.0733464814110803,.05929858491543678,.05929858491543678,.04427743881741981,.04427743881741981,.028531388628933663,.028531388628933663,.0123412297999872,.0123412297999872]],qn=[[1],[1,1],[1,2,1],[1,3,3,1]],kn=2*Math.PI,Pn=function(t,n,e,r,i,a,o,s,h){var u=Math.sin(i*kn/360),c=Math.cos(i*kn/360),f=c*(t-s)/2+u*(n-h)/2,l=-u*(t-s)/2+c*(n-h)/2;if(0===f&&0===l)return[];if(0===e||0===r)return[];e=Math.abs(e),r=Math.abs(r);var p=f*f/(e*e)+l*l/(r*r);p>1&&(e*=Math.sqrt(p),r*=Math.sqrt(p));var g=S(t,n,s,h,a,o,e,r,u,c),v=[],x=g[2],y=g[3],d=Math.max(Math.ceil(Math.abs(y)/(kn/4)),1);y/=d;for(var m=0;m<d;m++)v.push(C(x,y)),x+=y;return v.map(function(t){for(var n=0;n<t.length;n+=2){var i=t[n+0],a=t[n+1];i*=e,a*=r;var o=c*i-u*a,s=u*i+c*a;t[n+0]=o+g[0],t[n+1]=s+g[1]}return t})},_n=function(t,n,e,r,i,a,o,s,h){return new Z(t,n,e,r,i,a,o,s,h)};Z.prototype={constructor:Z,init:function(){},getTotalLength:function(){return this.length},getPointAtLength:function(t){var n=this;t<0?t=0:t>this.length&&(t=this.length);for(var e=this.partialLengths.length-1;this.partialLengths[e]>=t&&this.partialLengths[e]>0;)e--;e<this.partialLengths.length-1&&e++;for(var r=0,i=0;i<e;i++)r+=n.partialLengths[i];return this.curves[e].getPointAtLength(t-r)},getTangentAtLength:function(t){var n=this;t<0?t=0:t>this.length&&(t=this.length);for(var e=this.partialLengths.length-1;this.partialLengths[e]>=t&&this.partialLengths[e]>0;)e--;e<this.partialLengths.length-1&&e++;for(var r=0,i=0;i<e;i++)r+=n.partialLengths[i];return this.curves[e].getTangentAtLength(t-r)},getPropertiesAtLength:function(t){var n=this.getTangentAtLength(t),e=this.getPointAtLength(t);return{x:e.x,y:e.y,tangentX:n.x,tangentY:n.y}}};var En=function(t,n,e,r){return new T(t,n,e,r)};T.prototype.getTotalLength=function(){return Math.sqrt(Math.pow(this.x0-this.x1,2)+Math.pow(this.y0-this.y1,2))},T.prototype.getPointAtLength=function(t){var n=t/Math.sqrt(Math.pow(this.x0-this.x1,2)+Math.pow(this.y0-this.y1,2)),e=(this.x1-this.x0)*n,r=(this.y1-this.y0)*n;return{x:this.x0+e,y:this.y0+r}},T.prototype.getTangentAtLength=function(){var t=Math.sqrt((this.x1-this.x0)*(this.x1-this.x0)+(this.y1-this.y0)*(this.y1-this.y0));return{x:(this.x1-this.x0)/t,y:(this.y1-this.y0)/t}},T.prototype.getPropertiesAtLength=function(t){var n=this.getPointAtLength(t),e=this.getTangentAtLength();return{x:n.x,y:n.y,tangentX:e.x,tangentY:e.y}};var Sn=function(t){function n(t){if(!t)return null;for(var a,o=Mn(t),s=[0,0],h=[0,0],u=0;u<o.length;u++)"M"===o[u][0]?(s=[o[u][1],o[u][2]],i.push(null)):"m"===o[u][0]?(s=[o[u][1]+s[0],o[u][2]+s[1]],i.push(null)):"L"===o[u][0]?(e+=Math.sqrt(Math.pow(s[0]-o[u][1],2)+Math.pow(s[1]-o[u][2],2)),i.push(new En(s[0],o[u][1],s[1],o[u][2])),s=[o[u][1],o[u][2]]):"l"===o[u][0]?(e+=Math.sqrt(Math.pow(o[u][1],2)+Math.pow(o[u][2],2)),i.push(new En(s[0],o[u][1]+s[0],s[1],o[u][2]+s[1])),s=[o[u][1]+s[0],o[u][2]+s[1]]):"H"===o[u][0]?(e+=Math.abs(s[0]-o[u][1]),i.push(new En(s[0],o[u][1],s[1],s[1])),s[0]=o[u][1]):"h"===o[u][0]?(e+=Math.abs(o[u][1]),i.push(new En(s[0],s[0]+o[u][1],s[1],s[1])),s[0]=o[u][1]+s[0]):"V"===o[u][0]?(e+=Math.abs(s[1]-o[u][1]),i.push(new En(s[0],s[0],s[1],o[u][1])),s[1]=o[u][1]):"v"===o[u][0]?(e+=Math.abs(o[u][1]),i.push(new En(s[0],s[0],s[1],s[1]+o[u][1])),s[1]=o[u][1]+s[1]):"z"===o[u][0]||"Z"===o[u][0]?(e+=Math.sqrt(Math.pow(o[0][1]-s[0],2)+Math.pow(o[0][2]-s[1],2)),i.push(new En(s[0],o[0][1],s[1],o[0][2])),s=[o[0][1],o[0][2]]):"C"===o[u][0]?(a=new bn(s[0],s[1],o[u][1],o[u][2],o[u][3],o[u][4],o[u][5],o[u][6]),e+=a.getTotalLength(),s=[o[u][5],o[u][6]],i.push(a)):"c"===o[u][0]?(a=new bn(s[0],s[1],s[0]+o[u][1],s[1]+o[u][2],s[0]+o[u][3],s[1]+o[u][4],s[0]+o[u][5],s[1]+o[u][6]),e+=a.getTotalLength(),s=[o[u][5]+s[0],o[u][6]+s[1]],i.push(a)):"S"===o[u][0]?(a=u>0&&["C","c","S","s"].indexOf(o[u-1][0])>-1?new bn(s[0],s[1],2*s[0]-o[u-1][o[u-1].length-4],2*s[1]-o[u-1][o[u-1].length-3],o[u][1],o[u][2],o[u][3],o[u][4]):new bn(s[0],s[1],s[0],s[1],o[u][1],o[u][2],o[u][3],o[u][4]),e+=a.getTotalLength(),s=[o[u][3],o[u][4]],i.push(a)):"s"===o[u][0]?(a=u>0&&["C","c","S","s"].indexOf(o[u-1][0])>-1?new bn(s[0],s[1],s[0]+a.d.x-a.c.x,s[1]+a.d.y-a.c.y,s[0]+o[u][1],s[1]+o[u][2],s[0]+o[u][3],s[1]+o[u][4]):new bn(s[0],s[1],s[0],s[1],s[0]+o[u][1],s[1]+o[u][2],s[0]+o[u][3],s[1]+o[u][4]),e+=a.getTotalLength(),s=[o[u][3]+s[0],o[u][4]+s[1]],i.push(a)):"Q"===o[u][0]?(a=new bn(s[0],s[1],o[u][1],o[u][2],o[u][3],o[u][4]),e+=a.getTotalLength(),i.push(a),s=[o[u][3],o[u][4]],h=[o[u][1],o[u][2]]):"q"===o[u][0]?(a=new bn(s[0],s[1],s[0]+o[u][1],s[1]+o[u][2],s[0]+o[u][3],s[1]+o[u][4]),e+=a.getTotalLength(),h=[s[0]+o[u][1],s[1]+o[u][2]],s=[o[u][3]+s[0],o[u][4]+s[1]],i.push(a)):"T"===o[u][0]?(a=u>0&&["Q","q","T","t"].indexOf(o[u-1][0])>-1?new bn(s[0],s[1],2*s[0]-h[0],2*s[1]-h[1],o[u][1],o[u][2]):new En(s[0],o[u][1],s[1],o[u][2]),i.push(a),e+=a.getTotalLength(),h=[2*s[0]-h[0],2*s[1]-h[1]],s=[o[u][1],o[u][2]]):"t"===o[u][0]?(a=u>0&&["Q","q","T","t"].indexOf(o[u-1][0])>-1?new bn(s[0],s[1],2*s[0]-h[0],2*s[1]-h[1],s[0]+o[u][1],s[1]+o[u][2]):new En(s[0],s[0]+o[u][1],s[1],s[1]+o[u][2]),e+=a.getTotalLength(),h=[2*s[0]-h[0],2*s[1]-h[1]],s=[o[u][1]+s[0],o[u][2]+s[0]],i.push(a)):"A"===o[u][0]?(a=new _n(s[0],s[1],o[u][1],o[u][2],o[u][3],o[u][4],o[u][5],o[u][6],o[u][7]),e+=a.getTotalLength(),s=[o[u][6],o[u][7]],i.push(a)):"a"===o[u][0]&&(a=new _n(s[0],s[1],o[u][1],o[u][2],o[u][3],o[u][4],o[u][5],s[0]+o[u][6],s[1]+o[u][7]),e+=a.getTotalLength(),s=[s[0]+o[u][6],s[1]+o[u][7]],i.push(a)),r.push(e);return n}var e=0,r=[],i=[];n.getTotalLength=function(){return e},n.getPointAtLength=function(t){var n=a(t);return i[n.i].getPointAtLength(n.fraction)},n.getTangentAtLength=function(t){var n=a(t);return i[n.i].getTangentAtLength(n.fraction)},n.getPropertiesAtLength=function(t){var n=a(t);return i[n.i].getPropertiesAtLength(n.fraction)};var a=function(t){t<0?t=0:t>e&&(t=e);for(var n=r.length-1;r[n]>=t&&r[n]>0;)n--;return n++,{fraction:t-r[n-1],i:n}};return n(t)},Cn='All shapes must be supplied as arrays of [x, y] points or an SVG path string (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).\nExample valid ways of supplying a shape would be:\n[[0, 0], [10, 0], [10, 10]]\n"M0,0 L10,0 L10,10Z"\n',Zn="flubber.all() expects two arrays of equal length as arguments. Each element in both arrays should be an array of [x, y] points or an SVG path string (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).",Tn=function(t,n){for(var e,r,i,a=t.length,o=1/0,s=0;s<a;s++)!function(i){r=0,n.forEach(function(n,e){var o=F(t[(i+e)%a],n);r+=o*o}),r<o&&(o=r,e=i)}(s);e&&(i=t.splice(0,e),t.splice.apply(t,[t.length,0].concat(i)))},Fn=function(t,n,e){void 0===e&&(e={});var r=e.maxSegmentLength;void 0===r&&(r=10);var i=e.string;void 0===i&&(i=!0);var a=J(t,r),o=J(n,r),s=tt(a,o,i);return!i||"string"!=typeof t&&"string"!=typeof n?s:function(e){return e<1e-4&&"string"==typeof t?t:1-e<1e-4&&"string"==typeof n?n:s(e)}},zn=nt;nt.deviation=function(t,n,e,r){var i=n&&n.length,a=i?n[0]*e:t.length,o=Math.abs(Et(t,0,a,e));if(i)for(var s=0,h=n.length;s<h;s++){var u=n[s]*e,c=s<h-1?n[s+1]*e:t.length;o-=Math.abs(Et(t,u,c,e))}var f=0;for(s=0;s<r.length;s+=3){var l=r[s]*e,p=r[s+1]*e,g=r[s+2]*e;f+=Math.abs((t[l]-t[g])*(t[p+1]-t[l+1])-(t[l]-t[p])*(t[g+1]-t[l+1]))}return 0===o&&0===f?0:Math.abs((f-o)/o)},nt.flatten=function(t){for(var n=t[0][0].length,e={vertices:[],holes:[],dimensions:n},r=0,i=0;i<t.length;i++){for(var a=0;a<t[i].length;a++)for(var o=0;o<n;o++)e.vertices.push(t[i][a][o]);i>0&&(r+=t[i-1].length,e.holes.push(r))}return e};var jn=function(t){return t},In=function(t){if(null==t)return jn;var n,e,r=t.scale[0],i=t.scale[1],a=t.translate[0],o=t.translate[1];return function(t,s){s||(n=e=0);var h=2,u=t.length,c=new Array(u);for(c[0]=(n+=t[0])*r+a,c[1]=(e+=t[1])*i+o;h<u;)c[h]=t[h],++h;return c}},Vn=function(t,n){for(var e,r=t.length,i=r-n;i<--r;)e=t[i],t[i++]=t[r],t[r]=e},Xn=function(t,n){return"GeometryCollection"===n.type?{type:"FeatureCollection",features:n.geometries.map(function(n){return St(t,n)})}:St(t,n)},Yn=function(t,n){function e(n){var e,r=t.arcs[n<0?~n:n],i=r[0];return t.transform?(e=[0,0],r.forEach(function(t){e[0]+=t[0],e[1]+=t[1]})):e=r[r.length-1],n<0?[e,i]:[i,e]}function r(t,n){for(var e in t){var r=t[e];delete n[r.start],delete r.start,delete r.end,r.forEach(function(t){i[t<0?~t:t]=1}),s.push(r)}}var i={},a={},o={},s=[],h=-1;return n.forEach(function(e,r){var i,a=t.arcs[e<0?~e:e];a.length<3&&!a[1][0]&&!a[1][1]&&(i=n[++h],n[h]=e,n[r]=i)}),n.forEach(function(t){var n,r,i=e(t),s=i[0],h=i[1];if(n=o[s])if(delete o[n.end],n.push(t),n.end=h,r=a[h]){delete a[r.start];var u=r===n?n:n.concat(r);a[u.start=n.start]=o[u.end=r.end]=u}else a[n.start]=o[n.end]=n;else if(n=a[h])if(delete a[n.start],n.unshift(t),n.start=s,r=o[s]){delete o[r.end];var c=r===n?n:r.concat(n);a[c.start=r.start]=o[c.end=n.end]=c}else a[n.start]=o[n.end]=n;else n=[t],a[n.start=s]=o[n.end=h]=n}),r(o,a),r(a,o),n.forEach(function(t){i[t<0?~t:t]||s.push([t])}),s},Gn=function(t,n){for(var e=0,r=t.length;e<r;){var i=e+r>>>1;t[i]<n?e=i+1:r=i}return e},On=function(t){function n(t,n){t.forEach(function(t){t<0&&(t=~t);var e=i[t];e?e.push(n):i[t]=[n]})}function e(t,e){t.forEach(function(t){n(t,e)})}function r(t,n){"GeometryCollection"===t.type?t.geometries.forEach(function(t){r(t,n)}):t.type in o&&o[t.type](t.arcs,n)}var i={},a=t.map(function(){return[]}),o={LineString:n,MultiLineString:e,Polygon:e,MultiPolygon:function(t,n){t.forEach(function(t){e(t,n)})}};t.forEach(r);for(var s in i)for(var h=i[s],u=h.length,c=0;c<u;++c)for(var f=c+1;f<u;++f){var l,p=h[c],g=h[f];(l=a[p])[s=Gn(l,g)]!==g&&l.splice(s,0,g),(l=a[g])[s=Gn(l,p)]!==p&&l.splice(s,0,p)}return a},Dn=function(t,n){return t<n?-1:t>n?1:t>=n?0:NaN},Hn=function(t){return 1===t.length&&(t=Ft(t)),{left:function(n,e,r,i){for(null==r&&(r=0),null==i&&(i=n.length);r<i;){var a=r+i>>>1;t(n[a],e)<0?r=a+1:i=a}return r},right:function(n,e,r,i){for(null==r&&(r=0),null==i&&(i=n.length);r<i;){var a=r+i>>>1;t(n[a],e)>0?i=a:r=a+1}return r}}},Nn=Hn(Dn),Qn=(Nn.right,Math.sqrt(50),Math.sqrt(10),Math.sqrt(2),function(t,n){return jt(zt(It(t),t),n)}),Un=function(t,n){if(t.length>8)return t.map(function(t,n){return n});var e=t.map(function(t){return n.map(function(n){return Xt(t,n)})});return Vt(t,n,e)};t.interpolate=Fn,t.separate=Yt,t.combine=Gt,t.interpolateAll=Ot,t.splitPathString=N,t.toPathString=H,t.fromCircle=Ht,t.toCircle=Nt,t.fromRect=Qt,t.toRect=Ut,Object.defineProperty(t,"__esModule",{value:!0})});

},{}],"CHz1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
},{}],"TH2p":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _ascending = _interopRequireDefault(require("./ascending"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function (a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;

      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;else hi = mid;
      }

      return lo;
    },
    right: function (a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;

      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;else lo = mid + 1;
      }

      return lo;
    }
  };
}

function ascendingComparator(f) {
  return function (d, x) {
    return (0, _ascending.default)(f(d), x);
  };
}
},{"./ascending":"CHz1"}],"Yob9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.bisectLeft = exports.bisectRight = void 0;

var _ascending = _interopRequireDefault(require("./ascending"));

var _bisector = _interopRequireDefault(require("./bisector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ascendingBisect = (0, _bisector.default)(_ascending.default);
var bisectRight = ascendingBisect.right;
exports.bisectRight = bisectRight;
var bisectLeft = ascendingBisect.left;
exports.bisectLeft = bisectLeft;
var _default = bisectRight;
exports.default = _default;
},{"./ascending":"CHz1","./bisector":"TH2p"}],"PuGY":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.pair = pair;

function _default(array, f) {
  if (f == null) f = pair;
  var i = 0,
      n = array.length - 1,
      p = array[0],
      pairs = new Array(n < 0 ? 0 : n);

  while (i < n) pairs[i] = f(p, p = array[++i]);

  return pairs;
}

function pair(a, b) {
  return [a, b];
}
},{}],"xaEI":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _pairs = require("./pairs");

function _default(values0, values1, reduce) {
  var n0 = values0.length,
      n1 = values1.length,
      values = new Array(n0 * n1),
      i0,
      i1,
      i,
      value0;
  if (reduce == null) reduce = _pairs.pair;

  for (i0 = i = 0; i0 < n0; ++i0) {
    for (value0 = values0[i0], i1 = 0; i1 < n1; ++i1, ++i) {
      values[i] = reduce(value0, values1[i1]);
    }
  }

  return values;
}
},{"./pairs":"PuGY"}],"s7oJ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}
},{}],"Mz1A":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return x === null ? NaN : +x;
}
},{}],"dVf8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, valueof) {
  var n = values.length,
      m = 0,
      i = -1,
      mean = 0,
      value,
      delta,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(values[i]))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  } else {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(valueof(values[i], i, values)))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  if (m > 1) return sum / (m - 1);
}
},{"./number":"Mz1A"}],"/gd/":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _variance = _interopRequireDefault(require("./variance"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(array, f) {
  var v = (0, _variance.default)(array, f);
  return v ? Math.sqrt(v) : v;
}
},{"./variance":"dVf8"}],"CLkD":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min,
      max;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = max = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = max = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  return [min, max];
}
},{}],"gb1M":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map = exports.slice = void 0;
var array = Array.prototype;
var slice = array.slice;
exports.slice = slice;
var map = array.map;
exports.map = map;
},{}],"OKWp":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return function () {
    return x;
  };
}
},{}],"IRat":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return x;
}
},{}],"2p0J":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}
},{}],"ZDeh":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.tickIncrement = tickIncrement;
exports.tickStep = tickStep;
var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

function _default(start, stop, count) {
  var reverse,
      i = -1,
      n,
      ticks,
      step;
  stop = +stop, start = +start, count = +count;
  if (start === stop && count > 0) return [start];
  if (reverse = stop < start) n = start, start = stop, stop = n;
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

  if (step > 0) {
    start = Math.ceil(start / step);
    stop = Math.floor(stop / step);
    ticks = new Array(n = Math.ceil(stop - start + 1));

    while (++i < n) ticks[i] = (start + i) * step;
  } else {
    start = Math.floor(start * step);
    stop = Math.ceil(stop * step);
    ticks = new Array(n = Math.ceil(start - stop + 1));

    while (++i < n) ticks[i] = (start - i) / step;
  }

  if (reverse) ticks.reverse();
  return ticks;
}

function tickIncrement(start, stop, count) {
  var step = (stop - start) / Math.max(0, count),
      power = Math.floor(Math.log(step) / Math.LN10),
      error = step / Math.pow(10, power);
  return power >= 0 ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power) : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count),
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
      error = step0 / step1;
  if (error >= e10) step1 *= 10;else if (error >= e5) step1 *= 5;else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}
},{}],"21H5":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
}
},{}],"zskj":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _array = require("./array");

var _bisect = _interopRequireDefault(require("./bisect"));

var _constant = _interopRequireDefault(require("./constant"));

var _extent = _interopRequireDefault(require("./extent"));

var _identity = _interopRequireDefault(require("./identity"));

var _range = _interopRequireDefault(require("./range"));

var _ticks = require("./ticks");

var _sturges = _interopRequireDefault(require("./threshold/sturges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var value = _identity.default,
      domain = _extent.default,
      threshold = _sturges.default;

  function histogram(data) {
    var i,
        n = data.length,
        x,
        values = new Array(n);

    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }

    var xz = domain(values),
        x0 = xz[0],
        x1 = xz[1],
        tz = threshold(values, x0, x1); // Convert number of thresholds into uniform thresholds.

    if (!Array.isArray(tz)) {
      tz = (0, _ticks.tickStep)(x0, x1, tz);
      tz = (0, _range.default)(Math.ceil(x0 / tz) * tz, x1, tz); // exclusive
    } // Remove any thresholds outside the domain.


    var m = tz.length;

    while (tz[0] <= x0) tz.shift(), --m;

    while (tz[m - 1] > x1) tz.pop(), --m;

    var bins = new Array(m + 1),
        bin; // Initialize bins.

    for (i = 0; i <= m; ++i) {
      bin = bins[i] = [];
      bin.x0 = i > 0 ? tz[i - 1] : x0;
      bin.x1 = i < m ? tz[i] : x1;
    } // Assign data to bins by value, ignoring any outside the domain.


    for (i = 0; i < n; ++i) {
      x = values[i];

      if (x0 <= x && x <= x1) {
        bins[(0, _bisect.default)(tz, x, 0, m)].push(data[i]);
      }
    }

    return bins;
  }

  histogram.value = function (_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : (0, _constant.default)(_), histogram) : value;
  };

  histogram.domain = function (_) {
    return arguments.length ? (domain = typeof _ === "function" ? _ : (0, _constant.default)([_[0], _[1]]), histogram) : domain;
  };

  histogram.thresholds = function (_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? (0, _constant.default)(_array.slice.call(_)) : (0, _constant.default)(_), histogram) : threshold;
  };

  return histogram;
}
},{"./array":"gb1M","./bisect":"Yob9","./constant":"OKWp","./extent":"CLkD","./identity":"IRat","./range":"2p0J","./ticks":"ZDeh","./threshold/sturges":"21H5"}],"1GHm":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, p, valueof) {
  if (valueof == null) valueof = _number.default;
  if (!(n = values.length)) return;
  if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
  if (p >= 1) return +valueof(values[n - 1], n - 1, values);
  var n,
      i = (n - 1) * p,
      i0 = Math.floor(i),
      value0 = +valueof(values[i0], i0, values),
      value1 = +valueof(values[i0 + 1], i0 + 1, values);
  return value0 + (value1 - value0) * (i - i0);
}
},{"./number":"Mz1A"}],"8cBA":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _array = require("../array");

var _ascending = _interopRequireDefault(require("../ascending"));

var _number = _interopRequireDefault(require("../number"));

var _quantile = _interopRequireDefault(require("../quantile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, min, max) {
  values = _array.map.call(values, _number.default).sort(_ascending.default);
  return Math.ceil((max - min) / (2 * ((0, _quantile.default)(values, 0.75) - (0, _quantile.default)(values, 0.25)) * Math.pow(values.length, -1 / 3)));
}
},{"../array":"gb1M","../ascending":"CHz1","../number":"Mz1A","../quantile":"1GHm"}],"lvim":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _deviation = _interopRequireDefault(require("../deviation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, min, max) {
  return Math.ceil((max - min) / (3.5 * (0, _deviation.default)(values) * Math.pow(values.length, -1 / 3)));
}
},{"../deviation":"/gd/"}],"x9wj":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      max;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        max = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null && value > max) {
            max = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        max = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  return max;
}
},{}],"cGYI":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, valueof) {
  var n = values.length,
      m = n,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(values[i]))) sum += value;else --m;
    }
  } else {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(valueof(values[i], i, values)))) sum += value;else --m;
    }
  }

  if (m) return sum / m;
}
},{"./number":"Mz1A"}],"FfrF":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _ascending = _interopRequireDefault(require("./ascending"));

var _number = _interopRequireDefault(require("./number"));

var _quantile = _interopRequireDefault(require("./quantile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      numbers = [];

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(values[i]))) {
        numbers.push(value);
      }
    }
  } else {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(valueof(values[i], i, values)))) {
        numbers.push(value);
      }
    }
  }

  return (0, _quantile.default)(numbers.sort(_ascending.default), 0.5);
}
},{"./ascending":"CHz1","./number":"Mz1A","./quantile":"1GHm"}],"EzuM":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(arrays) {
  var n = arrays.length,
      m,
      i = -1,
      j = 0,
      merged,
      array;

  while (++i < n) j += arrays[i].length;

  merged = new Array(j);

  while (--n >= 0) {
    array = arrays[n];
    m = array.length;

    while (--m >= 0) {
      merged[--j] = array[m];
    }
  }

  return merged;
}
},{}],"3GK+":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null && min > value) {
            min = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  return min;
}
},{}],"XFTn":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(array, indexes) {
  var i = indexes.length,
      permutes = new Array(i);

  while (i--) permutes[i] = array[indexes[i]];

  return permutes;
}
},{}],"H/5n":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _ascending = _interopRequireDefault(require("./ascending"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, compare) {
  if (!(n = values.length)) return;
  var n,
      i = 0,
      j = 0,
      xi,
      xj = values[j];
  if (compare == null) compare = _ascending.default;

  while (++i < n) {
    if (compare(xi = values[i], xj) < 0 || compare(xj, xj) !== 0) {
      xj = xi, j = i;
    }
  }

  if (compare(xj, xj) === 0) return j;
}
},{"./ascending":"CHz1"}],"q8CL":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(array, i0, i1) {
  var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
      t,
      i;

  while (m) {
    i = Math.random() * m-- | 0;
    t = array[m + i0];
    array[m + i0] = array[i + i0];
    array[i + i0] = t;
  }

  return array;
}
},{}],"tfh5":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (value = +values[i]) sum += value; // Note: zero and null are equivalent.
    }
  } else {
    while (++i < n) {
      if (value = +valueof(values[i], i, values)) sum += value;
    }
  }

  return sum;
}
},{}],"ovym":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _min = _interopRequireDefault(require("./min"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(matrix) {
  if (!(n = matrix.length)) return [];

  for (var i = -1, m = (0, _min.default)(matrix, length), transpose = new Array(m); ++i < m;) {
    for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
      row[j] = matrix[j][i];
    }
  }

  return transpose;
}

function length(d) {
  return d.length;
}
},{"./min":"3GK+"}],"DYHk":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _transpose = _interopRequireDefault(require("./transpose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return (0, _transpose.default)(arguments);
}
},{"./transpose":"ovym"}],"Rpnd":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "bisect", {
  enumerable: true,
  get: function () {
    return _bisect.default;
  }
});
Object.defineProperty(exports, "bisectRight", {
  enumerable: true,
  get: function () {
    return _bisect.bisectRight;
  }
});
Object.defineProperty(exports, "bisectLeft", {
  enumerable: true,
  get: function () {
    return _bisect.bisectLeft;
  }
});
Object.defineProperty(exports, "ascending", {
  enumerable: true,
  get: function () {
    return _ascending.default;
  }
});
Object.defineProperty(exports, "bisector", {
  enumerable: true,
  get: function () {
    return _bisector.default;
  }
});
Object.defineProperty(exports, "cross", {
  enumerable: true,
  get: function () {
    return _cross.default;
  }
});
Object.defineProperty(exports, "descending", {
  enumerable: true,
  get: function () {
    return _descending.default;
  }
});
Object.defineProperty(exports, "deviation", {
  enumerable: true,
  get: function () {
    return _deviation.default;
  }
});
Object.defineProperty(exports, "extent", {
  enumerable: true,
  get: function () {
    return _extent.default;
  }
});
Object.defineProperty(exports, "histogram", {
  enumerable: true,
  get: function () {
    return _histogram.default;
  }
});
Object.defineProperty(exports, "thresholdFreedmanDiaconis", {
  enumerable: true,
  get: function () {
    return _freedmanDiaconis.default;
  }
});
Object.defineProperty(exports, "thresholdScott", {
  enumerable: true,
  get: function () {
    return _scott.default;
  }
});
Object.defineProperty(exports, "thresholdSturges", {
  enumerable: true,
  get: function () {
    return _sturges.default;
  }
});
Object.defineProperty(exports, "max", {
  enumerable: true,
  get: function () {
    return _max.default;
  }
});
Object.defineProperty(exports, "mean", {
  enumerable: true,
  get: function () {
    return _mean.default;
  }
});
Object.defineProperty(exports, "median", {
  enumerable: true,
  get: function () {
    return _median.default;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function () {
    return _merge.default;
  }
});
Object.defineProperty(exports, "min", {
  enumerable: true,
  get: function () {
    return _min.default;
  }
});
Object.defineProperty(exports, "pairs", {
  enumerable: true,
  get: function () {
    return _pairs.default;
  }
});
Object.defineProperty(exports, "permute", {
  enumerable: true,
  get: function () {
    return _permute.default;
  }
});
Object.defineProperty(exports, "quantile", {
  enumerable: true,
  get: function () {
    return _quantile.default;
  }
});
Object.defineProperty(exports, "range", {
  enumerable: true,
  get: function () {
    return _range.default;
  }
});
Object.defineProperty(exports, "scan", {
  enumerable: true,
  get: function () {
    return _scan.default;
  }
});
Object.defineProperty(exports, "shuffle", {
  enumerable: true,
  get: function () {
    return _shuffle.default;
  }
});
Object.defineProperty(exports, "sum", {
  enumerable: true,
  get: function () {
    return _sum.default;
  }
});
Object.defineProperty(exports, "ticks", {
  enumerable: true,
  get: function () {
    return _ticks.default;
  }
});
Object.defineProperty(exports, "tickIncrement", {
  enumerable: true,
  get: function () {
    return _ticks.tickIncrement;
  }
});
Object.defineProperty(exports, "tickStep", {
  enumerable: true,
  get: function () {
    return _ticks.tickStep;
  }
});
Object.defineProperty(exports, "transpose", {
  enumerable: true,
  get: function () {
    return _transpose.default;
  }
});
Object.defineProperty(exports, "variance", {
  enumerable: true,
  get: function () {
    return _variance.default;
  }
});
Object.defineProperty(exports, "zip", {
  enumerable: true,
  get: function () {
    return _zip.default;
  }
});

var _bisect = _interopRequireWildcard(require("./bisect"));

var _ascending = _interopRequireDefault(require("./ascending"));

var _bisector = _interopRequireDefault(require("./bisector"));

var _cross = _interopRequireDefault(require("./cross"));

var _descending = _interopRequireDefault(require("./descending"));

var _deviation = _interopRequireDefault(require("./deviation"));

var _extent = _interopRequireDefault(require("./extent"));

var _histogram = _interopRequireDefault(require("./histogram"));

var _freedmanDiaconis = _interopRequireDefault(require("./threshold/freedmanDiaconis"));

var _scott = _interopRequireDefault(require("./threshold/scott"));

var _sturges = _interopRequireDefault(require("./threshold/sturges"));

var _max = _interopRequireDefault(require("./max"));

var _mean = _interopRequireDefault(require("./mean"));

var _median = _interopRequireDefault(require("./median"));

var _merge = _interopRequireDefault(require("./merge"));

var _min = _interopRequireDefault(require("./min"));

var _pairs = _interopRequireDefault(require("./pairs"));

var _permute = _interopRequireDefault(require("./permute"));

var _quantile = _interopRequireDefault(require("./quantile"));

var _range = _interopRequireDefault(require("./range"));

var _scan = _interopRequireDefault(require("./scan"));

var _shuffle = _interopRequireDefault(require("./shuffle"));

var _sum = _interopRequireDefault(require("./sum"));

var _ticks = _interopRequireWildcard(require("./ticks"));

var _transpose = _interopRequireDefault(require("./transpose"));

var _variance = _interopRequireDefault(require("./variance"));

var _zip = _interopRequireDefault(require("./zip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }
},{"./bisect":"Yob9","./ascending":"CHz1","./bisector":"TH2p","./cross":"xaEI","./descending":"s7oJ","./deviation":"/gd/","./extent":"CLkD","./histogram":"zskj","./threshold/freedmanDiaconis":"8cBA","./threshold/scott":"lvim","./threshold/sturges":"21H5","./max":"x9wj","./mean":"cGYI","./median":"FfrF","./merge":"EzuM","./min":"3GK+","./pairs":"PuGY","./permute":"XFTn","./quantile":"1GHm","./range":"2p0J","./scan":"H/5n","./shuffle":"q8CL","./sum":"tfh5","./ticks":"ZDeh","./transpose":"ovym","./variance":"dVf8","./zip":"DYHk"}],"TZ6S":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.xhtml = void 0;
var xhtml = "http://www.w3.org/1999/xhtml";
exports.xhtml = xhtml;
var _default = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
exports.default = _default;
},{}],"Sva1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _namespaces = _interopRequireDefault(require("./namespaces"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  var prefix = name += "",
      i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return _namespaces.default.hasOwnProperty(prefix) ? {
    space: _namespaces.default[prefix],
    local: name
  } : name;
}
},{"./namespaces":"TZ6S"}],"vTHN":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _namespace = _interopRequireDefault(require("./namespace"));

var _namespaces = require("./namespaces");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function creatorInherit(name) {
  return function () {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === _namespaces.xhtml && document.documentElement.namespaceURI === _namespaces.xhtml ? document.createElement(name) : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function () {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function _default(name) {
  var fullname = (0, _namespace.default)(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}
},{"./namespace":"Sva1","./namespaces":"TZ6S"}],"hX8m":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function none() {}

function _default(selector) {
  return selector == null ? none : function () {
    return this.querySelector(selector);
  };
}
},{}],"um0S":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _selector = _interopRequireDefault(require("../selector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(select) {
  if (typeof select !== "function") select = (0, _selector.default)(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new _index.Selection(subgroups, this._parents);
}
},{"./index":"Pd8D","../selector":"hX8m"}],"s/Re":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function empty() {
  return [];
}

function _default(selector) {
  return selector == null ? empty : function () {
    return this.querySelectorAll(selector);
  };
}
},{}],"5EUV":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _selectorAll = _interopRequireDefault(require("../selectorAll"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(select) {
  if (typeof select !== "function") select = (0, _selectorAll.default)(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new _index.Selection(subgroups, parents);
}
},{"./index":"Pd8D","../selectorAll":"s/Re"}],"LbZ4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(selector) {
  return function () {
    return this.matches(selector);
  };
}
},{}],"hZf9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _matcher = _interopRequireDefault(require("../matcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(match) {
  if (typeof match !== "function") match = (0, _matcher.default)(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new _index.Selection(subgroups, this._parents);
}
},{"./index":"Pd8D","../matcher":"LbZ4"}],"NxKh":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(update) {
  return new Array(update.length);
}
},{}],"BlDg":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.EnterNode = EnterNode;

var _sparse = _interopRequireDefault(require("./sparse"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return new _index.Selection(this._enter || this._groups.map(_sparse.default), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function (child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function (child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function (selector) {
    return this._parent.querySelector(selector);
  },
  querySelectorAll: function (selector) {
    return this._parent.querySelectorAll(selector);
  }
};
},{"./sparse":"NxKh","./index":"Pd8D"}],"6U33":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _enter = require("./enter");

var _constant = _interopRequireDefault(require("../constant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length; // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.

  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new _enter.EnterNode(parent, data[i]);
    }
  } // Put any non-null nodes that don’t fit into exit.


  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue; // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.

  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);

      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  } // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.


  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);

    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new _enter.EnterNode(parent, data[i]);
    }
  } // Add any remaining nodes that were not bound to data to exit.


  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue[keyValues[i]] === node) {
      exit[i] = node;
    }
  }
}

function _default(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function (d) {
      data[++j] = d;
    });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;
  if (typeof value !== "function") value = (0, _constant.default)(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key); // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.

    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;

        while (!(next = updateGroup[i1]) && ++i1 < dataLength);

        previous._next = next || null;
      }
    }
  }

  update = new _index.Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}
},{"./index":"Pd8D","./enter":"BlDg","../constant":"OKWp"}],"uwqx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sparse = _interopRequireDefault(require("./sparse"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return new _index.Selection(this._exit || this._groups.map(_sparse.default), this._parents);
}
},{"./sparse":"NxKh","./index":"Pd8D"}],"tBqC":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(onenter, onupdate, onexit) {
  var enter = this.enter(),
      update = this,
      exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove();else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}
},{}],"oMRz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

function _default(selection) {
  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new _index.Selection(merges, this._parents);
}
},{"./index":"Pd8D"}],"DTXT":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}
},{}],"Eo98":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

function _default(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }

    sortgroup.sort(compareNode);
  }

  return new _index.Selection(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
},{"./index":"Pd8D"}],"del/":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}
},{}],"RJvN":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var nodes = new Array(this.size()),
      i = -1;
  this.each(function () {
    nodes[++i] = this;
  });
  return nodes;
}
},{}],"76P0":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}
},{}],"cLfp":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var size = 0;
  this.each(function () {
    ++size;
  });
  return size;
}
},{}],"fLE2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  return !this.node();
}
},{}],"Ex0s":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(callback) {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}
},{}],"kqGm":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _namespace = _interopRequireDefault(require("../namespace"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function attrRemove(name) {
  return function () {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function () {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function () {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function () {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function _default(name, value) {
  var fullname = (0, _namespace.default)(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }

  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}
},{"../namespace":"Sva1"}],"a7iO":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || // node is a Node
  node.document && node // node is a Window
  || node.defaultView; // node is a Document
}
},{}],"4PNU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.styleValue = styleValue;

var _window = _interopRequireDefault(require("../window"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function styleRemove(name) {
  return function () {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function () {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);else this.style.setProperty(name, v, priority);
  };
}

function _default(name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name) || (0, _window.default)(node).getComputedStyle(node, null).getPropertyValue(name);
}
},{"../window":"a7iO"}],"Qc7K":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function propertyRemove(name) {
  return function () {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function () {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];else this[name] = v;
  };
}

function _default(name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}
},{}],"u8Lo":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function (name) {
    var i = this._names.indexOf(name);

    if (i < 0) {
      this._names.push(name);

      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function (name) {
    var i = this._names.indexOf(name);

    if (i >= 0) {
      this._names.splice(i, 1);

      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function (name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node),
      i = -1,
      n = names.length;

  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node),
      i = -1,
      n = names.length;

  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function () {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function () {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function () {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function _default(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()),
        i = -1,
        n = names.length;

    while (++i < n) if (!list.contains(names[i])) return false;

    return true;
  }

  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}
},{}],"sv0a":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function () {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function () {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function _default(value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}
},{}],"IOHV":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function () {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function () {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function _default(value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}
},{}],"1Bs6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function _default() {
  return this.each(raise);
}
},{}],"s7fh":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function _default() {
  return this.each(lower);
}
},{}],"XBOq":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _creator = _interopRequireDefault(require("../creator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  var create = typeof name === "function" ? name : (0, _creator.default)(name);
  return this.select(function () {
    return this.appendChild(create.apply(this, arguments));
  });
}
},{"../creator":"vTHN"}],"+DmT":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _creator = _interopRequireDefault(require("../creator"));

var _selector = _interopRequireDefault(require("../selector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function constantNull() {
  return null;
}

function _default(name, before) {
  var create = typeof name === "function" ? name : (0, _creator.default)(name),
      select = before == null ? constantNull : typeof before === "function" ? before : (0, _selector.default)(before);
  return this.select(function () {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}
},{"../creator":"vTHN","../selector":"hX8m"}],"lzg5":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function _default() {
  return this.each(remove);
}
},{}],"lcuA":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function selection_cloneShallow() {
  return this.parentNode.insertBefore(this.cloneNode(false), this.nextSibling);
}

function selection_cloneDeep() {
  return this.parentNode.insertBefore(this.cloneNode(true), this.nextSibling);
}

function _default(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}
},{}],"rHST":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}
},{}],"tgqN":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.customEvent = customEvent;
exports.event = void 0;
var filterEvents = {};
var event = null;
exports.event = event;

if (typeof document !== "undefined") {
  var element = document.documentElement;

  if (!("onmouseenter" in element)) {
    filterEvents = {
      mouseenter: "mouseover",
      mouseleave: "mouseout"
    };
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function (event) {
    var related = event.relatedTarget;

    if (!related || related !== this && !(related.compareDocumentPosition(this) & 8)) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function (event1) {
    var event0 = event; // Events can be reentrant (e.g., focus).

    exports.event = event = event1;

    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      exports.event = event = event0;
    }
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {
      type: t,
      name: name
    };
  });
}

function onRemove(typename) {
  return function () {
    var on = this.__on;
    if (!on) return;

    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }

    if (++i) on.length = i;else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function (d, i, group) {
    var on = this.__on,
        o,
        listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {
      type: typename.type,
      name: typename.name,
      value: value,
      listener: listener,
      capture: capture
    };
    if (!on) this.__on = [o];else on.push(o);
  };
}

function _default(typename, value, capture) {
  var typenames = parseTypenames(typename + ""),
      i,
      n = typenames.length,
      t;

  if (arguments.length < 2) {
    var on = this.node().__on;

    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;

  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));

  return this;
}

function customEvent(event1, listener, that, args) {
  var event0 = event;
  event1.sourceEvent = event;
  exports.event = event = event1;

  try {
    return listener.apply(that, args);
  } finally {
    exports.event = event = event0;
  }
}
},{}],"8Sfd":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _window = _interopRequireDefault(require("../window"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dispatchEvent(node, type, params) {
  var window = (0, _window.default)(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function () {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function () {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function _default(type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}
},{"../window":"a7iO"}],"Pd8D":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Selection = Selection;
exports.default = exports.root = void 0;

var _select = _interopRequireDefault(require("./select"));

var _selectAll = _interopRequireDefault(require("./selectAll"));

var _filter = _interopRequireDefault(require("./filter"));

var _data = _interopRequireDefault(require("./data"));

var _enter = _interopRequireDefault(require("./enter"));

var _exit = _interopRequireDefault(require("./exit"));

var _join = _interopRequireDefault(require("./join"));

var _merge = _interopRequireDefault(require("./merge"));

var _order = _interopRequireDefault(require("./order"));

var _sort = _interopRequireDefault(require("./sort"));

var _call = _interopRequireDefault(require("./call"));

var _nodes = _interopRequireDefault(require("./nodes"));

var _node = _interopRequireDefault(require("./node"));

var _size = _interopRequireDefault(require("./size"));

var _empty = _interopRequireDefault(require("./empty"));

var _each = _interopRequireDefault(require("./each"));

var _attr = _interopRequireDefault(require("./attr"));

var _style = _interopRequireDefault(require("./style"));

var _property = _interopRequireDefault(require("./property"));

var _classed = _interopRequireDefault(require("./classed"));

var _text = _interopRequireDefault(require("./text"));

var _html = _interopRequireDefault(require("./html"));

var _raise = _interopRequireDefault(require("./raise"));

var _lower = _interopRequireDefault(require("./lower"));

var _append = _interopRequireDefault(require("./append"));

var _insert = _interopRequireDefault(require("./insert"));

var _remove = _interopRequireDefault(require("./remove"));

var _clone = _interopRequireDefault(require("./clone"));

var _datum = _interopRequireDefault(require("./datum"));

var _on = _interopRequireDefault(require("./on"));

var _dispatch = _interopRequireDefault(require("./dispatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = [null];
exports.root = root;

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: _select.default,
  selectAll: _selectAll.default,
  filter: _filter.default,
  data: _data.default,
  enter: _enter.default,
  exit: _exit.default,
  join: _join.default,
  merge: _merge.default,
  order: _order.default,
  sort: _sort.default,
  call: _call.default,
  nodes: _nodes.default,
  node: _node.default,
  size: _size.default,
  empty: _empty.default,
  each: _each.default,
  attr: _attr.default,
  style: _style.default,
  property: _property.default,
  classed: _classed.default,
  text: _text.default,
  html: _html.default,
  raise: _raise.default,
  lower: _lower.default,
  append: _append.default,
  insert: _insert.default,
  remove: _remove.default,
  clone: _clone.default,
  datum: _datum.default,
  on: _on.default,
  dispatch: _dispatch.default
};
var _default = selection;
exports.default = _default;
},{"./select":"um0S","./selectAll":"5EUV","./filter":"hZf9","./data":"6U33","./enter":"BlDg","./exit":"uwqx","./join":"tBqC","./merge":"oMRz","./order":"DTXT","./sort":"Eo98","./call":"del/","./nodes":"RJvN","./node":"76P0","./size":"cLfp","./empty":"fLE2","./each":"Ex0s","./attr":"kqGm","./style":"4PNU","./property":"Qc7K","./classed":"u8Lo","./text":"sv0a","./html":"IOHV","./raise":"1Bs6","./lower":"s7fh","./append":"XBOq","./insert":"+DmT","./remove":"lzg5","./clone":"lcuA","./datum":"rHST","./on":"tgqN","./dispatch":"8Sfd"}],"SawF":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./selection/index");

function _default(selector) {
  return typeof selector === "string" ? new _index.Selection([[document.querySelector(selector)]], [document.documentElement]) : new _index.Selection([[selector]], _index.root);
}
},{"./selection/index":"Pd8D"}],"o4tJ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _creator = _interopRequireDefault(require("./creator"));

var _select = _interopRequireDefault(require("./select"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  return (0, _select.default)((0, _creator.default)(name).call(document.documentElement));
}
},{"./creator":"vTHN","./select":"SawF"}],"5F0n":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = local;
var nextId = 0;

function local() {
  return new Local();
}

function Local() {
  this._ = "@" + (++nextId).toString(36);
}

Local.prototype = local.prototype = {
  constructor: Local,
  get: function (node) {
    var id = this._;

    while (!(id in node)) if (!(node = node.parentNode)) return;

    return node[id];
  },
  set: function (node, value) {
    return node[this._] = value;
  },
  remove: function (node) {
    return this._ in node && delete node[this._];
  },
  toString: function () {
    return this._;
  }
};
},{}],"fcL+":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _on = require("./selection/on");

function _default() {
  var current = _on.event,
      source;

  while (source = current.sourceEvent) current = source;

  return current;
}
},{"./selection/on":"tgqN"}],"tjFE":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
}
},{}],"dfC2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sourceEvent = _interopRequireDefault(require("./sourceEvent"));

var _point = _interopRequireDefault(require("./point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(node) {
  var event = (0, _sourceEvent.default)();
  if (event.changedTouches) event = event.changedTouches[0];
  return (0, _point.default)(node, event);
}
},{"./sourceEvent":"fcL+","./point":"tjFE"}],"n60l":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./selection/index");

function _default(selector) {
  return typeof selector === "string" ? new _index.Selection([document.querySelectorAll(selector)], [document.documentElement]) : new _index.Selection([selector == null ? [] : selector], _index.root);
}
},{"./selection/index":"Pd8D"}],"XEgr":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sourceEvent = _interopRequireDefault(require("./sourceEvent"));

var _point = _interopRequireDefault(require("./point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = (0, _sourceEvent.default)().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return (0, _point.default)(node, touch);
    }
  }

  return null;
}
},{"./sourceEvent":"fcL+","./point":"tjFE"}],"DKY7":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sourceEvent = _interopRequireDefault(require("./sourceEvent"));

var _point = _interopRequireDefault(require("./point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(node, touches) {
  if (touches == null) touches = (0, _sourceEvent.default)().touches;

  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = (0, _point.default)(node, touches[i]);
  }

  return points;
}
},{"./sourceEvent":"fcL+","./point":"tjFE"}],"4Gs4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "create", {
  enumerable: true,
  get: function () {
    return _create.default;
  }
});
Object.defineProperty(exports, "creator", {
  enumerable: true,
  get: function () {
    return _creator.default;
  }
});
Object.defineProperty(exports, "local", {
  enumerable: true,
  get: function () {
    return _local.default;
  }
});
Object.defineProperty(exports, "matcher", {
  enumerable: true,
  get: function () {
    return _matcher.default;
  }
});
Object.defineProperty(exports, "mouse", {
  enumerable: true,
  get: function () {
    return _mouse.default;
  }
});
Object.defineProperty(exports, "namespace", {
  enumerable: true,
  get: function () {
    return _namespace.default;
  }
});
Object.defineProperty(exports, "namespaces", {
  enumerable: true,
  get: function () {
    return _namespaces.default;
  }
});
Object.defineProperty(exports, "clientPoint", {
  enumerable: true,
  get: function () {
    return _point.default;
  }
});
Object.defineProperty(exports, "select", {
  enumerable: true,
  get: function () {
    return _select.default;
  }
});
Object.defineProperty(exports, "selectAll", {
  enumerable: true,
  get: function () {
    return _selectAll.default;
  }
});
Object.defineProperty(exports, "selection", {
  enumerable: true,
  get: function () {
    return _index.default;
  }
});
Object.defineProperty(exports, "selector", {
  enumerable: true,
  get: function () {
    return _selector.default;
  }
});
Object.defineProperty(exports, "selectorAll", {
  enumerable: true,
  get: function () {
    return _selectorAll.default;
  }
});
Object.defineProperty(exports, "style", {
  enumerable: true,
  get: function () {
    return _style.styleValue;
  }
});
Object.defineProperty(exports, "touch", {
  enumerable: true,
  get: function () {
    return _touch.default;
  }
});
Object.defineProperty(exports, "touches", {
  enumerable: true,
  get: function () {
    return _touches.default;
  }
});
Object.defineProperty(exports, "window", {
  enumerable: true,
  get: function () {
    return _window.default;
  }
});
Object.defineProperty(exports, "event", {
  enumerable: true,
  get: function () {
    return _on.event;
  }
});
Object.defineProperty(exports, "customEvent", {
  enumerable: true,
  get: function () {
    return _on.customEvent;
  }
});

var _create = _interopRequireDefault(require("./create"));

var _creator = _interopRequireDefault(require("./creator"));

var _local = _interopRequireDefault(require("./local"));

var _matcher = _interopRequireDefault(require("./matcher"));

var _mouse = _interopRequireDefault(require("./mouse"));

var _namespace = _interopRequireDefault(require("./namespace"));

var _namespaces = _interopRequireDefault(require("./namespaces"));

var _point = _interopRequireDefault(require("./point"));

var _select = _interopRequireDefault(require("./select"));

var _selectAll = _interopRequireDefault(require("./selectAll"));

var _index = _interopRequireDefault(require("./selection/index"));

var _selector = _interopRequireDefault(require("./selector"));

var _selectorAll = _interopRequireDefault(require("./selectorAll"));

var _style = require("./selection/style");

var _touch = _interopRequireDefault(require("./touch"));

var _touches = _interopRequireDefault(require("./touches"));

var _window = _interopRequireDefault(require("./window"));

var _on = require("./selection/on");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./create":"o4tJ","./creator":"vTHN","./local":"5F0n","./matcher":"LbZ4","./mouse":"dfC2","./namespace":"Sva1","./namespaces":"TZ6S","./point":"tjFE","./select":"SawF","./selectAll":"n60l","./selection/index":"Pd8D","./selector":"hX8m","./selectorAll":"s/Re","./selection/style":"4PNU","./touch":"XEgr","./touches":"DKY7","./window":"a7iO","./selection/on":"tgqN"}],"+j72":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.prefix = void 0;
var prefix = "$";
exports.prefix = prefix;

function Map() {}

Map.prototype = map.prototype = {
  constructor: Map,
  has: function (key) {
    return prefix + key in this;
  },
  get: function (key) {
    return this[prefix + key];
  },
  set: function (key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function (key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function () {
    for (var property in this) if (property[0] === prefix) delete this[property];
  },
  keys: function () {
    var keys = [];

    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));

    return keys;
  },
  values: function () {
    var values = [];

    for (var property in this) if (property[0] === prefix) values.push(this[property]);

    return values;
  },
  entries: function () {
    var entries = [];

    for (var property in this) if (property[0] === prefix) entries.push({
      key: property.slice(1),
      value: this[property]
    });

    return entries;
  },
  size: function () {
    var size = 0;

    for (var property in this) if (property[0] === prefix) ++size;

    return size;
  },
  empty: function () {
    for (var property in this) if (property[0] === prefix) return false;

    return true;
  },
  each: function (f) {
    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
  }
};

function map(object, f) {
  var map = new Map(); // Copy constructor.

  if (object instanceof Map) object.each(function (value, key) {
    map.set(key, value);
  }); // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
      var i = -1,
          n = object.length,
          o;
      if (f == null) while (++i < n) map.set(i, object[i]);else while (++i < n) map.set(f(o = object[i], i, object), o);
    } // Convert object to map.
    else if (object) for (var key in object) map.set(key, object[key]);
  return map;
}

var _default = map;
exports.default = _default;
},{}],"frsU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _map = _interopRequireDefault(require("./map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var keys = [],
      sortKeys = [],
      sortValues,
      rollup,
      nest;

  function apply(array, depth, createResult, setResult) {
    if (depth >= keys.length) {
      if (sortValues != null) array.sort(sortValues);
      return rollup != null ? rollup(array) : array;
    }

    var i = -1,
        n = array.length,
        key = keys[depth++],
        keyValue,
        value,
        valuesByKey = (0, _map.default)(),
        values,
        result = createResult();

    while (++i < n) {
      if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
        values.push(value);
      } else {
        valuesByKey.set(keyValue, [value]);
      }
    }

    valuesByKey.each(function (values, key) {
      setResult(result, key, apply(values, depth, createResult, setResult));
    });
    return result;
  }

  function entries(map, depth) {
    if (++depth > keys.length) return map;
    var array,
        sortKey = sortKeys[depth - 1];
    if (rollup != null && depth >= keys.length) array = map.entries();else array = [], map.each(function (v, k) {
      array.push({
        key: k,
        values: entries(v, depth)
      });
    });
    return sortKey != null ? array.sort(function (a, b) {
      return sortKey(a.key, b.key);
    }) : array;
  }

  return nest = {
    object: function (array) {
      return apply(array, 0, createObject, setObject);
    },
    map: function (array) {
      return apply(array, 0, createMap, setMap);
    },
    entries: function (array) {
      return entries(apply(array, 0, createMap, setMap), 0);
    },
    key: function (d) {
      keys.push(d);
      return nest;
    },
    sortKeys: function (order) {
      sortKeys[keys.length - 1] = order;
      return nest;
    },
    sortValues: function (order) {
      sortValues = order;
      return nest;
    },
    rollup: function (f) {
      rollup = f;
      return nest;
    }
  };
}

function createObject() {
  return {};
}

function setObject(object, key, value) {
  object[key] = value;
}

function createMap() {
  return (0, _map.default)();
}

function setMap(map, key, value) {
  map.set(key, value);
}
},{"./map":"+j72"}],"Io8R":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireWildcard(require("./map"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function Set() {}

var proto = _map.default.prototype;
Set.prototype = set.prototype = {
  constructor: Set,
  has: proto.has,
  add: function (value) {
    value += "";
    this[_map.prefix + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set(object, f) {
  var set = new Set(); // Copy constructor.

  if (object instanceof Set) object.each(function (value) {
    set.add(value);
  }); // Otherwise, assume it’s an array.
  else if (object) {
      var i = -1,
          n = object.length;
      if (f == null) while (++i < n) set.add(object[i]);else while (++i < n) set.add(f(object[i], i, object));
    }
  return set;
}

var _default = set;
exports.default = _default;
},{"./map":"+j72"}],"j0Iz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(map) {
  var keys = [];

  for (var key in map) keys.push(key);

  return keys;
}
},{}],"qwPj":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(map) {
  var values = [];

  for (var key in map) values.push(map[key]);

  return values;
}
},{}],"c8dA":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(map) {
  var entries = [];

  for (var key in map) entries.push({
    key: key,
    value: map[key]
  });

  return entries;
}
},{}],"CyPa":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "nest", {
  enumerable: true,
  get: function () {
    return _nest.default;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function () {
    return _set.default;
  }
});
Object.defineProperty(exports, "map", {
  enumerable: true,
  get: function () {
    return _map.default;
  }
});
Object.defineProperty(exports, "keys", {
  enumerable: true,
  get: function () {
    return _keys.default;
  }
});
Object.defineProperty(exports, "values", {
  enumerable: true,
  get: function () {
    return _values.default;
  }
});
Object.defineProperty(exports, "entries", {
  enumerable: true,
  get: function () {
    return _entries.default;
  }
});

var _nest = _interopRequireDefault(require("./nest"));

var _set = _interopRequireDefault(require("./set"));

var _map = _interopRequireDefault(require("./map"));

var _keys = _interopRequireDefault(require("./keys"));

var _values = _interopRequireDefault(require("./values"));

var _entries = _interopRequireDefault(require("./entries"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./nest":"frsU","./set":"Io8R","./map":"+j72","./keys":"j0Iz","./values":"qwPj","./entries":"c8dA"}],"XrLQ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.slice = exports.map = void 0;
var array = Array.prototype;
var map = array.map;
exports.map = map;
var slice = array.slice;
exports.slice = slice;
},{}],"Yv9Y":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ordinal;
exports.implicit = void 0;

var _d3Collection = require("d3-collection");

var _array = require("./array");

var implicit = {
  name: "implicit"
};
exports.implicit = implicit;

function ordinal(range) {
  var index = (0, _d3Collection.map)(),
      domain = [],
      unknown = implicit;
  range = range == null ? [] : _array.slice.call(range);

  function scale(d) {
    var key = d + "",
        i = index.get(key);

    if (!i) {
      if (unknown !== implicit) return unknown;
      index.set(key, i = domain.push(d));
    }

    return range[(i - 1) % range.length];
  }

  scale.domain = function (_) {
    if (!arguments.length) return domain.slice();
    domain = [], index = (0, _d3Collection.map)();
    var i = -1,
        n = _.length,
        d,
        key;

    while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));

    return scale;
  };

  scale.range = function (_) {
    return arguments.length ? (range = _array.slice.call(_), scale) : range.slice();
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function () {
    return ordinal().domain(domain).range(range).unknown(unknown);
  };

  return scale;
}
},{"d3-collection":"CyPa","./array":"XrLQ"}],"GuIC":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = band;
exports.point = point;

var _d3Array = require("d3-array");

var _ordinal = _interopRequireDefault(require("./ordinal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function band() {
  var scale = (0, _ordinal.default)().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range,
      range = [0, 1],
      step,
      bandwidth,
      round = false,
      paddingInner = 0,
      paddingOuter = 0,
      align = 0.5;
  delete scale.unknown;

  function rescale() {
    var n = domain().length,
        reverse = range[1] < range[0],
        start = range[reverse - 0],
        stop = range[1 - reverse];
    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);
    start += (stop - start - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
    var values = (0, _d3Array.range)(n).map(function (i) {
      return start + step * i;
    });
    return ordinalRange(reverse ? values.reverse() : values);
  }

  scale.domain = function (_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.range = function (_) {
    return arguments.length ? (range = [+_[0], +_[1]], rescale()) : range.slice();
  };

  scale.rangeRound = function (_) {
    return range = [+_[0], +_[1]], round = true, rescale();
  };

  scale.bandwidth = function () {
    return bandwidth;
  };

  scale.step = function () {
    return step;
  };

  scale.round = function (_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };

  scale.padding = function (_) {
    return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
  };

  scale.paddingInner = function (_) {
    return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
  };

  scale.paddingOuter = function (_) {
    return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
  };

  scale.align = function (_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };

  scale.copy = function () {
    return band().domain(domain()).range(range).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
  };

  return rescale();
}

function pointish(scale) {
  var copy = scale.copy;
  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;

  scale.copy = function () {
    return pointish(copy());
  };

  return scale;
}

function point() {
  return pointish(band().paddingInner(1));
}
},{"d3-array":"Rpnd","./ordinal":"Yv9Y"}],"7I82":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.extend = extend;

function _default(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);

  for (var key in definition) prototype[key] = definition[key];

  return prototype;
}
},{}],"VvvF":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Color = Color;
exports.default = color;
exports.rgbConvert = rgbConvert;
exports.rgb = rgb;
exports.Rgb = Rgb;
exports.hslConvert = hslConvert;
exports.hsl = hsl;
exports.brighter = exports.darker = void 0;

var _define = _interopRequireWildcard(require("./define"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function Color() {}

var darker = 0.7;
exports.darker = darker;
var brighter = 1 / darker;
exports.brighter = brighter;
var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex3 = /^#([0-9a-f]{3})$/,
    reHex6 = /^#([0-9a-f]{6})$/,
    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};
(0, _define.default)(Color, color, {
  displayable: function () {
    return this.rgb().displayable();
  },
  hex: function () {
    return this.rgb().hex();
  },
  toString: function () {
    return this.rgb() + "";
  }
});

function color(format) {
  var m;
  format = (format + "").trim().toLowerCase();
  return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb(m >> 8 & 0xf | m >> 4 & 0x0f0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1) // #f00
  ) : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
  : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
  : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
  : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
  : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
  : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
  : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
  : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

(0, _define.default)(Rgb, rgb, (0, _define.extend)(Color, {
  brighter: function (k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function () {
    return this;
  },
  displayable: function () {
    return 0 <= this.r && this.r <= 255 && 0 <= this.g && this.g <= 255 && 0 <= this.b && this.b <= 255 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: function () {
    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
  },
  toString: function () {
    var a = this.opacity;
    a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
  }
}));

function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;else if (l <= 0 || l >= 1) h = s = NaN;else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl();
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;

  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;else if (g === max) h = (b - r) / s + 2;else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }

  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

(0, _define.default)(Hsl, hsl, (0, _define.extend)(Color, {
  brighter: function (k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function () {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
  },
  displayable: function () {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  }
}));
/* From FvD 13.37, CSS Color Module Level 3 */

function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}
},{"./define":"7I82"}],"Ip0L":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rad2deg = exports.deg2rad = void 0;
var deg2rad = Math.PI / 180;
exports.deg2rad = deg2rad;
var rad2deg = 180 / Math.PI;
exports.rad2deg = rad2deg;
},{}],"4u9J":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gray = gray;
exports.default = lab;
exports.Lab = Lab;
exports.lch = lch;
exports.hcl = hcl;
exports.Hcl = Hcl;

var _define = _interopRequireWildcard(require("./define"));

var _color = require("./color");

var _math = require("./math");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// https://beta.observablehq.com/@mbostock/lab-and-rgb
var K = 18,
    Xn = 0.96422,
    Yn = 1,
    Zn = 0.82521,
    t0 = 4 / 29,
    t1 = 6 / 29,
    t2 = 3 * t1 * t1,
    t3 = t1 * t1 * t1;

function labConvert(o) {
  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);

  if (o instanceof Hcl) {
    if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
    var h = o.h * _math.deg2rad;
    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
  }

  if (!(o instanceof _color.Rgb)) o = (0, _color.rgbConvert)(o);
  var r = rgb2lrgb(o.r),
      g = rgb2lrgb(o.g),
      b = rgb2lrgb(o.b),
      y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn),
      x,
      z;
  if (r === g && g === b) x = z = y;else {
    x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
    z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
  }
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}

function gray(l, opacity) {
  return new Lab(l, 0, 0, opacity == null ? 1 : opacity);
}

function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}

function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}

(0, _define.default)(Lab, lab, (0, _define.extend)(_color.Color, {
  brighter: function (k) {
    return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker: function (k) {
    return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb: function () {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    x = Xn * lab2xyz(x);
    y = Yn * lab2xyz(y);
    z = Zn * lab2xyz(z);
    return new _color.Rgb(lrgb2rgb(3.1338561 * x - 1.6168667 * y - 0.4906146 * z), lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z), lrgb2rgb(0.0719453 * x - 0.2289914 * y + 1.4052427 * z), this.opacity);
  }
}));

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function lrgb2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2lrgb(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function hclConvert(o) {
  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab)) o = labConvert(o);
  if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0, o.l, o.opacity);

  var h = Math.atan2(o.b, o.a) * _math.rad2deg;

  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}

function lch(l, c, h, opacity) {
  return arguments.length === 1 ? hclConvert(l) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}

(0, _define.default)(Hcl, hcl, (0, _define.extend)(_color.Color, {
  brighter: function (k) {
    return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
  },
  darker: function (k) {
    return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
  },
  rgb: function () {
    return labConvert(this).rgb();
  }
}));
},{"./define":"7I82","./color":"VvvF","./math":"Ip0L"}],"jmkd":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cubehelix;
exports.Cubehelix = Cubehelix;

var _define = _interopRequireWildcard(require("./define"));

var _color = require("./color");

var _math = require("./math");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var A = -0.14861,
    B = +1.78277,
    C = -0.29227,
    D = -0.90649,
    E = +1.97294,
    ED = E * D,
    EB = E * B,
    BC_DA = B * C - D * A;

function cubehelixConvert(o) {
  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof _color.Rgb)) o = (0, _color.rgbConvert)(o);
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
      bl = b - l,
      k = (E * (g - l) - C * bl) / D,
      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)),
      // NaN if l=0 or l=1
  h = s ? Math.atan2(k, bl) * _math.rad2deg - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}

function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}

function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

(0, _define.default)(Cubehelix, cubehelix, (0, _define.extend)(_color.Color, {
  brighter: function (k) {
    k = k == null ? _color.brighter : Math.pow(_color.brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? _color.darker : Math.pow(_color.darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function () {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * _math.deg2rad,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new _color.Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)), this.opacity);
  }
}));
},{"./define":"7I82","./color":"VvvF","./math":"Ip0L"}],"x3do":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "color", {
  enumerable: true,
  get: function () {
    return _color.default;
  }
});
Object.defineProperty(exports, "rgb", {
  enumerable: true,
  get: function () {
    return _color.rgb;
  }
});
Object.defineProperty(exports, "hsl", {
  enumerable: true,
  get: function () {
    return _color.hsl;
  }
});
Object.defineProperty(exports, "lab", {
  enumerable: true,
  get: function () {
    return _lab.default;
  }
});
Object.defineProperty(exports, "hcl", {
  enumerable: true,
  get: function () {
    return _lab.hcl;
  }
});
Object.defineProperty(exports, "lch", {
  enumerable: true,
  get: function () {
    return _lab.lch;
  }
});
Object.defineProperty(exports, "gray", {
  enumerable: true,
  get: function () {
    return _lab.gray;
  }
});
Object.defineProperty(exports, "cubehelix", {
  enumerable: true,
  get: function () {
    return _cubehelix.default;
  }
});

var _color = _interopRequireWildcard(require("./color"));

var _lab = _interopRequireWildcard(require("./lab"));

var _cubehelix = _interopRequireDefault(require("./cubehelix"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }
},{"./color":"VvvF","./lab":"4u9J","./cubehelix":"jmkd"}],"kM48":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basis = basis;
exports.default = _default;

function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1,
      t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}

function _default(values) {
  var n = values.length - 1;
  return function (t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
        v1 = values[i],
        v2 = values[i + 1],
        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}
},{}],"I8m6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _basis = require("./basis");

function _default(values) {
  var n = values.length;
  return function (t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
        v0 = values[(i + n - 1) % n],
        v1 = values[i % n],
        v2 = values[(i + 1) % n],
        v3 = values[(i + 2) % n];
    return (0, _basis.basis)((t - i / n) * n, v0, v1, v2, v3);
  };
}
},{"./basis":"kM48"}],"y6/M":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hue = hue;
exports.gamma = gamma;
exports.default = nogamma;

var _constant = _interopRequireDefault(require("./constant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function linear(a, d) {
  return function (t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function (t) {
    return Math.pow(a + t * b, y);
  };
}

function hue(a, b) {
  var d = b - a;
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : (0, _constant.default)(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function (a, b) {
    return b - a ? exponential(a, b, y) : (0, _constant.default)(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : (0, _constant.default)(isNaN(a) ? b : a);
}
},{"./constant":"OKWp"}],"u/eB":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rgbBasisClosed = exports.rgbBasis = exports.default = void 0;

var _d3Color = require("d3-color");

var _basis = _interopRequireDefault(require("./basis"));

var _basisClosed = _interopRequireDefault(require("./basisClosed"));

var _color = _interopRequireWildcard(require("./color"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function rgbGamma(y) {
  var color = (0, _color.gamma)(y);

  function rgb(start, end) {
    var r = color((start = (0, _d3Color.rgb)(start)).r, (end = (0, _d3Color.rgb)(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb.gamma = rgbGamma;
  return rgb;
}(1);

exports.default = _default;

function rgbSpline(spline) {
  return function (colors) {
    var n = colors.length,
        r = new Array(n),
        g = new Array(n),
        b = new Array(n),
        i,
        color;

    for (i = 0; i < n; ++i) {
      color = (0, _d3Color.rgb)(colors[i]);
      r[i] = color.r || 0;
      g[i] = color.g || 0;
      b[i] = color.b || 0;
    }

    r = spline(r);
    g = spline(g);
    b = spline(b);
    color.opacity = 1;
    return function (t) {
      color.r = r(t);
      color.g = g(t);
      color.b = b(t);
      return color + "";
    };
  };
}

var rgbBasis = rgbSpline(_basis.default);
exports.rgbBasis = rgbBasis;
var rgbBasisClosed = rgbSpline(_basisClosed.default);
exports.rgbBasisClosed = rgbBasisClosed;
},{"d3-color":"x3do","./basis":"kM48","./basisClosed":"I8m6","./color":"y6/M"}],"ZCGf":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _value = _interopRequireDefault(require("./value"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(na),
      c = new Array(nb),
      i;

  for (i = 0; i < na; ++i) x[i] = (0, _value.default)(a[i], b[i]);

  for (; i < nb; ++i) c[i] = b[i];

  return function (t) {
    for (i = 0; i < na; ++i) c[i] = x[i](t);

    return c;
  };
}
},{"./value":"sR+7"}],"PFUW":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  var d = new Date();
  return a = +a, b -= a, function (t) {
    return d.setTime(a + b * t), d;
  };
}
},{}],"5aNy":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return a = +a, b -= a, function (t) {
    return a + b * t;
  };
}
},{}],"oqfw":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _value = _interopRequireDefault(require("./value"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(a, b) {
  var i = {},
      c = {},
      k;
  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = (0, _value.default)(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function (t) {
    for (k in i) c[k] = i[k](t);

    return c;
  };
}
},{"./value":"sR+7"}],"2/4B":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function () {
    return b;
  };
}

function one(b) {
  return function (t) {
    return b(t) + "";
  };
}

function _default(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0,
      // scan index for next number in b
  am,
      // current match in a
  bm,
      // current match in b
  bs,
      // string preceding current number in b, if any
  i = -1,
      // index in s
  s = [],
      // string constants and placeholders
  q = []; // number interpolators
  // Coerce inputs to strings.

  a = a + "", b = b + ""; // Interpolate pairs of numbers in a & b.

  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    if ((am = am[0]) === (bm = bm[0])) {
      // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else {
      // interpolate non-matching numbers
      s[++i] = null;
      q.push({
        i: i,
        x: (0, _number.default)(am, bm)
      });
    }

    bi = reB.lastIndex;
  } // Add remains of b.


  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  } // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.


  return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function (t) {
    for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);

    return s.join("");
  });
}
},{"./number":"5aNy"}],"sR+7":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Color = require("d3-color");

var _rgb = _interopRequireDefault(require("./rgb"));

var _array = _interopRequireDefault(require("./array"));

var _date = _interopRequireDefault(require("./date"));

var _number = _interopRequireDefault(require("./number"));

var _object = _interopRequireDefault(require("./object"));

var _string = _interopRequireDefault(require("./string"));

var _constant = _interopRequireDefault(require("./constant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(a, b) {
  var t = typeof b,
      c;
  return b == null || t === "boolean" ? (0, _constant.default)(b) : (t === "number" ? _number.default : t === "string" ? (c = (0, _d3Color.color)(b)) ? (b = c, _rgb.default) : _string.default : b instanceof _d3Color.color ? _rgb.default : b instanceof Date ? _date.default : Array.isArray(b) ? _array.default : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? _object.default : _number.default)(a, b);
}
},{"d3-color":"x3do","./rgb":"u/eB","./array":"ZCGf","./date":"PFUW","./number":"5aNy","./object":"oqfw","./string":"2/4B","./constant":"OKWp"}],"Erca":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(range) {
  var n = range.length;
  return function (t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}
},{}],"9YmN":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _color = require("./color");

function _default(a, b) {
  var i = (0, _color.hue)(+a, +b);
  return function (t) {
    var x = i(t);
    return x - 360 * Math.floor(x / 360);
  };
}
},{"./color":"y6/M"}],"OHSM":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return a = +a, b -= a, function (t) {
    return Math.round(a + b * t);
  };
}
},{}],"4k89":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.identity = void 0;
var degrees = 180 / Math.PI;
var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
exports.identity = identity;

function _default(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}
},{}],"fUUu":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCss = parseCss;
exports.parseSvg = parseSvg;

var _decompose = _interopRequireWildcard(require("./decompose"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var cssNode, cssRoot, cssView, svgNode;

function parseCss(value) {
  if (value === "none") return _decompose.identity;
  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
  cssNode.style.transform = value;
  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
  cssRoot.removeChild(cssNode);
  value = value.slice(7, -1).split(",");
  return (0, _decompose.default)(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}

function parseSvg(value) {
  if (value == null) return _decompose.identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return _decompose.identity;
  value = value.matrix;
  return (0, _decompose.default)(value.a, value.b, value.c, value.d, value.e, value.f);
}
},{"./decompose":"4k89"}],"tkk+":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interpolateTransformSvg = exports.interpolateTransformCss = void 0;

var _number = _interopRequireDefault(require("../number"));

var _parse = require("./parse");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function interpolateTransform(parse, pxComma, pxParen, degParen) {
  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({
        i: i - 4,
        x: (0, _number.default)(xa, xb)
      }, {
        i: i - 2,
        x: (0, _number.default)(ya, yb)
      });
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360;else if (b - a > 180) a += 360; // shortest path

      q.push({
        i: s.push(pop(s) + "rotate(", null, degParen) - 2,
        x: (0, _number.default)(a, b)
      });
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({
        i: s.push(pop(s) + "skewX(", null, degParen) - 2,
        x: (0, _number.default)(a, b)
      });
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({
        i: i - 4,
        x: (0, _number.default)(xa, xb)
      }, {
        i: i - 2,
        x: (0, _number.default)(ya, yb)
      });
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function (a, b) {
    var s = [],
        // string constants and placeholders
    q = []; // number interpolators

    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc

    return function (t) {
      var i = -1,
          n = q.length,
          o;

      while (++i < n) s[(o = q[i]).i] = o.x(t);

      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(_parse.parseCss, "px, ", "px)", "deg)");
exports.interpolateTransformCss = interpolateTransformCss;
var interpolateTransformSvg = interpolateTransform(_parse.parseSvg, ", ", ")", ")");
exports.interpolateTransformSvg = interpolateTransformSvg;
},{"../number":"5aNy","./parse":"fUUu"}],"/dKm":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var rho = Math.SQRT2,
    rho2 = 2,
    rho4 = 4,
    epsilon2 = 1e-12;

function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
} // p0 = [ux0, uy0, w0]
// p1 = [ux1, uy1, w1]


function _default(p0, p1) {
  var ux0 = p0[0],
      uy0 = p0[1],
      w0 = p0[2],
      ux1 = p1[0],
      uy1 = p1[1],
      w1 = p1[2],
      dx = ux1 - ux0,
      dy = uy1 - uy0,
      d2 = dx * dx + dy * dy,
      i,
      S; // Special case for u0 ≅ u1.

  if (d2 < epsilon2) {
    S = Math.log(w1 / w0) / rho;

    i = function (t) {
      return [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)];
    };
  } // General case.
  else {
      var d1 = Math.sqrt(d2),
          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;

      i = function (t) {
        var s = t * S,
            coshr0 = cosh(r0),
            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / cosh(rho * s + r0)];
      };
    }

  i.duration = S * 1000;
  return i;
}
},{}],"RzWG":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hslLong = exports.default = void 0;

var _d3Color = require("d3-color");

var _color = _interopRequireWildcard(require("./color"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function hsl(hue) {
  return function (start, end) {
    var h = hue((start = (0, _d3Color.hsl)(start)).h, (end = (0, _d3Color.hsl)(end)).h),
        s = (0, _color.default)(start.s, end.s),
        l = (0, _color.default)(start.l, end.l),
        opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.h = h(t);
      start.s = s(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  };
}

var _default = hsl(_color.hue);

exports.default = _default;
var hslLong = hsl(_color.default);
exports.hslLong = hslLong;
},{"d3-color":"x3do","./color":"y6/M"}],"lMlk":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lab;

var _d3Color = require("d3-color");

var _color = _interopRequireDefault(require("./color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function lab(start, end) {
  var l = (0, _color.default)((start = (0, _d3Color.lab)(start)).l, (end = (0, _d3Color.lab)(end)).l),
      a = (0, _color.default)(start.a, end.a),
      b = (0, _color.default)(start.b, end.b),
      opacity = (0, _color.default)(start.opacity, end.opacity);
  return function (t) {
    start.l = l(t);
    start.a = a(t);
    start.b = b(t);
    start.opacity = opacity(t);
    return start + "";
  };
}
},{"d3-color":"x3do","./color":"y6/M"}],"8csI":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hclLong = exports.default = void 0;

var _d3Color = require("d3-color");

var _color = _interopRequireWildcard(require("./color"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function hcl(hue) {
  return function (start, end) {
    var h = hue((start = (0, _d3Color.hcl)(start)).h, (end = (0, _d3Color.hcl)(end)).h),
        c = (0, _color.default)(start.c, end.c),
        l = (0, _color.default)(start.l, end.l),
        opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.h = h(t);
      start.c = c(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  };
}

var _default = hcl(_color.hue);

exports.default = _default;
var hclLong = hcl(_color.default);
exports.hclLong = hclLong;
},{"d3-color":"x3do","./color":"y6/M"}],"F9uV":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cubehelixLong = exports.default = void 0;

var _d3Color = require("d3-color");

var _color = _interopRequireWildcard(require("./color"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function cubehelix(hue) {
  return function cubehelixGamma(y) {
    y = +y;

    function cubehelix(start, end) {
      var h = hue((start = (0, _d3Color.cubehelix)(start)).h, (end = (0, _d3Color.cubehelix)(end)).h),
          s = (0, _color.default)(start.s, end.s),
          l = (0, _color.default)(start.l, end.l),
          opacity = (0, _color.default)(start.opacity, end.opacity);
      return function (t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(Math.pow(t, y));
        start.opacity = opacity(t);
        return start + "";
      };
    }

    cubehelix.gamma = cubehelixGamma;
    return cubehelix;
  }(1);
}

var _default = cubehelix(_color.hue);

exports.default = _default;
var cubehelixLong = cubehelix(_color.default);
exports.cubehelixLong = cubehelixLong;
},{"d3-color":"x3do","./color":"y6/M"}],"wh72":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = piecewise;

function piecewise(interpolate, values) {
  var i = 0,
      n = values.length - 1,
      v = values[0],
      I = new Array(n < 0 ? 0 : n);

  while (i < n) I[i] = interpolate(v, v = values[++i]);

  return function (t) {
    var i = Math.max(0, Math.min(n - 1, Math.floor(t *= n)));
    return I[i](t - i);
  };
}
},{}],"Edvl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(interpolator, n) {
  var samples = new Array(n);

  for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));

  return samples;
}
},{}],"y8gx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "interpolate", {
  enumerable: true,
  get: function () {
    return _value.default;
  }
});
Object.defineProperty(exports, "interpolateArray", {
  enumerable: true,
  get: function () {
    return _array.default;
  }
});
Object.defineProperty(exports, "interpolateBasis", {
  enumerable: true,
  get: function () {
    return _basis.default;
  }
});
Object.defineProperty(exports, "interpolateBasisClosed", {
  enumerable: true,
  get: function () {
    return _basisClosed.default;
  }
});
Object.defineProperty(exports, "interpolateDate", {
  enumerable: true,
  get: function () {
    return _date.default;
  }
});
Object.defineProperty(exports, "interpolateDiscrete", {
  enumerable: true,
  get: function () {
    return _discrete.default;
  }
});
Object.defineProperty(exports, "interpolateHue", {
  enumerable: true,
  get: function () {
    return _hue.default;
  }
});
Object.defineProperty(exports, "interpolateNumber", {
  enumerable: true,
  get: function () {
    return _number.default;
  }
});
Object.defineProperty(exports, "interpolateObject", {
  enumerable: true,
  get: function () {
    return _object.default;
  }
});
Object.defineProperty(exports, "interpolateRound", {
  enumerable: true,
  get: function () {
    return _round.default;
  }
});
Object.defineProperty(exports, "interpolateString", {
  enumerable: true,
  get: function () {
    return _string.default;
  }
});
Object.defineProperty(exports, "interpolateTransformCss", {
  enumerable: true,
  get: function () {
    return _index.interpolateTransformCss;
  }
});
Object.defineProperty(exports, "interpolateTransformSvg", {
  enumerable: true,
  get: function () {
    return _index.interpolateTransformSvg;
  }
});
Object.defineProperty(exports, "interpolateZoom", {
  enumerable: true,
  get: function () {
    return _zoom.default;
  }
});
Object.defineProperty(exports, "interpolateRgb", {
  enumerable: true,
  get: function () {
    return _rgb.default;
  }
});
Object.defineProperty(exports, "interpolateRgbBasis", {
  enumerable: true,
  get: function () {
    return _rgb.rgbBasis;
  }
});
Object.defineProperty(exports, "interpolateRgbBasisClosed", {
  enumerable: true,
  get: function () {
    return _rgb.rgbBasisClosed;
  }
});
Object.defineProperty(exports, "interpolateHsl", {
  enumerable: true,
  get: function () {
    return _hsl.default;
  }
});
Object.defineProperty(exports, "interpolateHslLong", {
  enumerable: true,
  get: function () {
    return _hsl.hslLong;
  }
});
Object.defineProperty(exports, "interpolateLab", {
  enumerable: true,
  get: function () {
    return _lab.default;
  }
});
Object.defineProperty(exports, "interpolateHcl", {
  enumerable: true,
  get: function () {
    return _hcl.default;
  }
});
Object.defineProperty(exports, "interpolateHclLong", {
  enumerable: true,
  get: function () {
    return _hcl.hclLong;
  }
});
Object.defineProperty(exports, "interpolateCubehelix", {
  enumerable: true,
  get: function () {
    return _cubehelix.default;
  }
});
Object.defineProperty(exports, "interpolateCubehelixLong", {
  enumerable: true,
  get: function () {
    return _cubehelix.cubehelixLong;
  }
});
Object.defineProperty(exports, "piecewise", {
  enumerable: true,
  get: function () {
    return _piecewise.default;
  }
});
Object.defineProperty(exports, "quantize", {
  enumerable: true,
  get: function () {
    return _quantize.default;
  }
});

var _value = _interopRequireDefault(require("./value"));

var _array = _interopRequireDefault(require("./array"));

var _basis = _interopRequireDefault(require("./basis"));

var _basisClosed = _interopRequireDefault(require("./basisClosed"));

var _date = _interopRequireDefault(require("./date"));

var _discrete = _interopRequireDefault(require("./discrete"));

var _hue = _interopRequireDefault(require("./hue"));

var _number = _interopRequireDefault(require("./number"));

var _object = _interopRequireDefault(require("./object"));

var _round = _interopRequireDefault(require("./round"));

var _string = _interopRequireDefault(require("./string"));

var _index = require("./transform/index");

var _zoom = _interopRequireDefault(require("./zoom"));

var _rgb = _interopRequireWildcard(require("./rgb"));

var _hsl = _interopRequireWildcard(require("./hsl"));

var _lab = _interopRequireDefault(require("./lab"));

var _hcl = _interopRequireWildcard(require("./hcl"));

var _cubehelix = _interopRequireWildcard(require("./cubehelix"));

var _piecewise = _interopRequireDefault(require("./piecewise"));

var _quantize = _interopRequireDefault(require("./quantize"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./value":"sR+7","./array":"ZCGf","./basis":"kM48","./basisClosed":"I8m6","./date":"PFUW","./discrete":"Erca","./hue":"9YmN","./number":"5aNy","./object":"oqfw","./round":"OHSM","./string":"2/4B","./transform/index":"tkk+","./zoom":"/dKm","./rgb":"u/eB","./hsl":"RzWG","./lab":"lMlk","./hcl":"8csI","./cubehelix":"F9uV","./piecewise":"wh72","./quantize":"Edvl"}],"B+tz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return +x;
}
},{}],"kGze":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deinterpolateLinear = deinterpolateLinear;
exports.copy = copy;
exports.default = continuous;

var _d3Array = require("d3-array");

var _d3Interpolate = require("d3-interpolate");

var _array = require("./array");

var _constant = _interopRequireDefault(require("./constant"));

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var unit = [0, 1];

function deinterpolateLinear(a, b) {
  return (b -= a = +a) ? function (x) {
    return (x - a) / b;
  } : (0, _constant.default)(b);
}

function deinterpolateClamp(deinterpolate) {
  return function (a, b) {
    var d = deinterpolate(a = +a, b = +b);
    return function (x) {
      return x <= a ? 0 : x >= b ? 1 : d(x);
    };
  };
}

function reinterpolateClamp(reinterpolate) {
  return function (a, b) {
    var r = reinterpolate(a = +a, b = +b);
    return function (t) {
      return t <= 0 ? a : t >= 1 ? b : r(t);
    };
  };
}

function bimap(domain, range, deinterpolate, reinterpolate) {
  var d0 = domain[0],
      d1 = domain[1],
      r0 = range[0],
      r1 = range[1];
  if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
  return function (x) {
    return r0(d0(x));
  };
}

function polymap(domain, range, deinterpolate, reinterpolate) {
  var j = Math.min(domain.length, range.length) - 1,
      d = new Array(j),
      r = new Array(j),
      i = -1; // Reverse descending domains.

  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }

  while (++i < j) {
    d[i] = deinterpolate(domain[i], domain[i + 1]);
    r[i] = reinterpolate(range[i], range[i + 1]);
  }

  return function (x) {
    var i = (0, _d3Array.bisect)(domain, x, 1, j) - 1;
    return r[i](d[i](x));
  };
}

function copy(source, target) {
  return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp());
} // deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].


function continuous(deinterpolate, reinterpolate) {
  var domain = unit,
      range = unit,
      interpolate = _d3Interpolate.interpolate,
      clamp = false,
      piecewise,
      output,
      input;

  function rescale() {
    piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return (output || (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate)))(+x);
  }

  scale.invert = function (y) {
    return (input || (input = piecewise(range, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
  };

  scale.domain = function (_) {
    return arguments.length ? (domain = _array.map.call(_, _number.default), rescale()) : domain.slice();
  };

  scale.range = function (_) {
    return arguments.length ? (range = _array.slice.call(_), rescale()) : range.slice();
  };

  scale.rangeRound = function (_) {
    return range = _array.slice.call(_), interpolate = _d3Interpolate.interpolateRound, rescale();
  };

  scale.clamp = function (_) {
    return arguments.length ? (clamp = !!_, rescale()) : clamp;
  };

  scale.interpolate = function (_) {
    return arguments.length ? (interpolate = _, rescale()) : interpolate;
  };

  return rescale();
}
},{"d3-array":"Rpnd","d3-interpolate":"y8gx","./array":"XrLQ","./constant":"OKWp","./number":"B+tz"}],"fiGR":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
function _default(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity

  var i,
      coefficient = x.slice(0, i); // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).

  return [coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient, +x.slice(i + 1)];
}
},{}],"G46r":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _formatDecimal = _interopRequireDefault(require("./formatDecimal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(x) {
  return x = (0, _formatDecimal.default)(Math.abs(x)), x ? x[1] : NaN;
}
},{"./formatDecimal":"fiGR"}],"CupU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(grouping, thousands) {
  return function (value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
}
},{}],"mUgz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(numerals) {
  return function (value) {
    return value.replace(/[0-9]/g, function (i) {
      return numerals[+i];
    });
  };
}
},{}],"Nf4q":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatSpecifier;
// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  return new FormatSpecifier(specifier);
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
  var match;
  this.fill = match[1] || " ";
  this.align = match[2] || ">";
  this.sign = match[3] || "-";
  this.symbol = match[4] || "";
  this.zero = !!match[5];
  this.width = match[6] && +match[6];
  this.comma = !!match[7];
  this.precision = match[8] && +match[8].slice(1);
  this.trim = !!match[9];
  this.type = match[10] || "";
}

FormatSpecifier.prototype.toString = function () {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width == null ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
},{}],"s/ik":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
function _default(s) {
  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (s[i]) {
      case ".":
        i0 = i1 = i;
        break;

      case "0":
        if (i0 === 0) i0 = i;
        i1 = i;
        break;

      default:
        if (i0 > 0) {
          if (!+s[i]) break out;
          i0 = 0;
        }

        break;
    }
  }

  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}
},{}],"WMxc":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.prefixExponent = void 0;

var _formatDecimal = _interopRequireDefault(require("./formatDecimal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefixExponent;
exports.prefixExponent = prefixExponent;

function _default(x, p) {
  var d = (0, _formatDecimal.default)(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1],
      i = exponent - (exports.prefixExponent = prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
      n = coefficient.length;
  return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + (0, _formatDecimal.default)(x, Math.max(0, p + i - 1))[0]; // less than 1y!
}
},{"./formatDecimal":"fiGR"}],"gMFS":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _formatDecimal = _interopRequireDefault(require("./formatDecimal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(x, p) {
  var d = (0, _formatDecimal.default)(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}
},{"./formatDecimal":"fiGR"}],"w40g":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _formatPrefixAuto = _interopRequireDefault(require("./formatPrefixAuto"));

var _formatRounded = _interopRequireDefault(require("./formatRounded"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  "%": function (x, p) {
    return (x * 100).toFixed(p);
  },
  "b": function (x) {
    return Math.round(x).toString(2);
  },
  "c": function (x) {
    return x + "";
  },
  "d": function (x) {
    return Math.round(x).toString(10);
  },
  "e": function (x, p) {
    return x.toExponential(p);
  },
  "f": function (x, p) {
    return x.toFixed(p);
  },
  "g": function (x, p) {
    return x.toPrecision(p);
  },
  "o": function (x) {
    return Math.round(x).toString(8);
  },
  "p": function (x, p) {
    return (0, _formatRounded.default)(x * 100, p);
  },
  "r": _formatRounded.default,
  "s": _formatPrefixAuto.default,
  "X": function (x) {
    return Math.round(x).toString(16).toUpperCase();
  },
  "x": function (x) {
    return Math.round(x).toString(16);
  }
};
exports.default = _default;
},{"./formatPrefixAuto":"WMxc","./formatRounded":"gMFS"}],"Iakc":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _exponent = _interopRequireDefault(require("./exponent"));

var _formatGroup = _interopRequireDefault(require("./formatGroup"));

var _formatNumerals = _interopRequireDefault(require("./formatNumerals"));

var _formatSpecifier = _interopRequireDefault(require("./formatSpecifier"));

var _formatTrim = _interopRequireDefault(require("./formatTrim"));

var _formatTypes = _interopRequireDefault(require("./formatTypes"));

var _formatPrefixAuto = require("./formatPrefixAuto");

var _identity = _interopRequireDefault(require("./identity"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefixes = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];

function _default(locale) {
  var group = locale.grouping && locale.thousands ? (0, _formatGroup.default)(locale.grouping, locale.thousands) : _identity.default,
      currency = locale.currency,
      decimal = locale.decimal,
      numerals = locale.numerals ? (0, _formatNumerals.default)(locale.numerals) : _identity.default,
      percent = locale.percent || "%";

  function newFormat(specifier) {
    specifier = (0, _formatSpecifier.default)(specifier);
    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        trim = specifier.trim,
        type = specifier.type; // The "n" type is an alias for ",g".

    if (type === "n") comma = true, type = "g"; // The "" type, and any invalid type, is an alias for ".12~g".
    else if (!_formatTypes.default[type]) precision == null && (precision = 12), trim = true, type = "g"; // If zero fill is specified, padding goes after sign and before digits.

    if (zero || fill === "0" && align === "=") zero = true, fill = "0", align = "="; // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.

    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : ""; // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?

    var formatType = _formatTypes.default[type],
        maybeSuffix = /[defgprs%]/.test(type); // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].

    precision = precision == null ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));

    function format(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix,
          i,
          n,
          c;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value; // Perform the initial formatting.

        var valueNegative = value < 0;
        value = formatType(Math.abs(value), precision); // Trim insignificant zeros.

        if (trim) value = (0, _formatTrim.default)(value); // If a negative value rounds to zero during formatting, treat as positive.

        if (valueNegative && +value === 0) valueNegative = false; // Compute the prefix and suffix.

        valuePrefix = (valueNegative ? sign === "(" ? sign : "-" : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes[8 + _formatPrefixAuto.prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : ""); // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.

        if (maybeSuffix) {
          i = -1, n = value.length;

          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      } // If the fill character is not "0", grouping is applied before padding.


      if (comma && !zero) value = group(value, Infinity); // Compute the padding.

      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : ""; // If the fill character is "0", grouping is applied after padding.

      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = ""; // Reconstruct the final output based on the desired alignment.

      switch (align) {
        case "<":
          value = valuePrefix + value + valueSuffix + padding;
          break;

        case "=":
          value = valuePrefix + padding + value + valueSuffix;
          break;

        case "^":
          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
          break;

        default:
          value = padding + valuePrefix + value + valueSuffix;
          break;
      }

      return numerals(value);
    }

    format.toString = function () {
      return specifier + "";
    };

    return format;
  }

  function formatPrefix(specifier, value) {
    var f = newFormat((specifier = (0, _formatSpecifier.default)(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor((0, _exponent.default)(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function (value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: newFormat,
    formatPrefix: formatPrefix
  };
}
},{"./exponent":"G46r","./formatGroup":"CupU","./formatNumerals":"mUgz","./formatSpecifier":"Nf4q","./formatTrim":"s/ik","./formatTypes":"w40g","./formatPrefixAuto":"WMxc","./identity":"IRat"}],"00VI":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultLocale;
exports.formatPrefix = exports.format = void 0;

var _locale = _interopRequireDefault(require("./locale"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var locale;
var format;
exports.format = format;
var formatPrefix;
exports.formatPrefix = formatPrefix;
defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});

function defaultLocale(definition) {
  locale = (0, _locale.default)(definition);
  exports.format = format = locale.format;
  exports.formatPrefix = formatPrefix = locale.formatPrefix;
  return locale;
}
},{"./locale":"Iakc"}],"cTEw":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _exponent = _interopRequireDefault(require("./exponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(step) {
  return Math.max(0, -(0, _exponent.default)(Math.abs(step)));
}
},{"./exponent":"G46r"}],"aFxy":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _exponent = _interopRequireDefault(require("./exponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor((0, _exponent.default)(value) / 3))) * 3 - (0, _exponent.default)(Math.abs(step)));
}
},{"./exponent":"G46r"}],"we+8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _exponent = _interopRequireDefault(require("./exponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, (0, _exponent.default)(max) - (0, _exponent.default)(step)) + 1;
}
},{"./exponent":"G46r"}],"SA6z":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "formatDefaultLocale", {
  enumerable: true,
  get: function () {
    return _defaultLocale.default;
  }
});
Object.defineProperty(exports, "format", {
  enumerable: true,
  get: function () {
    return _defaultLocale.format;
  }
});
Object.defineProperty(exports, "formatPrefix", {
  enumerable: true,
  get: function () {
    return _defaultLocale.formatPrefix;
  }
});
Object.defineProperty(exports, "formatLocale", {
  enumerable: true,
  get: function () {
    return _locale.default;
  }
});
Object.defineProperty(exports, "formatSpecifier", {
  enumerable: true,
  get: function () {
    return _formatSpecifier.default;
  }
});
Object.defineProperty(exports, "precisionFixed", {
  enumerable: true,
  get: function () {
    return _precisionFixed.default;
  }
});
Object.defineProperty(exports, "precisionPrefix", {
  enumerable: true,
  get: function () {
    return _precisionPrefix.default;
  }
});
Object.defineProperty(exports, "precisionRound", {
  enumerable: true,
  get: function () {
    return _precisionRound.default;
  }
});

var _defaultLocale = _interopRequireWildcard(require("./defaultLocale"));

var _locale = _interopRequireDefault(require("./locale"));

var _formatSpecifier = _interopRequireDefault(require("./formatSpecifier"));

var _precisionFixed = _interopRequireDefault(require("./precisionFixed"));

var _precisionPrefix = _interopRequireDefault(require("./precisionPrefix"));

var _precisionRound = _interopRequireDefault(require("./precisionRound"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }
},{"./defaultLocale":"00VI","./locale":"Iakc","./formatSpecifier":"Nf4q","./precisionFixed":"cTEw","./precisionPrefix":"aFxy","./precisionRound":"we+8"}],"xMUV":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Array = require("d3-array");

var _d3Format = require("d3-format");

function _default(domain, count, specifier) {
  var start = domain[0],
      stop = domain[domain.length - 1],
      step = (0, _d3Array.tickStep)(start, stop, count == null ? 10 : count),
      precision;
  specifier = (0, _d3Format.formatSpecifier)(specifier == null ? ",f" : specifier);

  switch (specifier.type) {
    case "s":
      {
        var value = Math.max(Math.abs(start), Math.abs(stop));
        if (specifier.precision == null && !isNaN(precision = (0, _d3Format.precisionPrefix)(step, value))) specifier.precision = precision;
        return (0, _d3Format.formatPrefix)(specifier, value);
      }

    case "":
    case "e":
    case "g":
    case "p":
    case "r":
      {
        if (specifier.precision == null && !isNaN(precision = (0, _d3Format.precisionRound)(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
        break;
      }

    case "f":
    case "%":
      {
        if (specifier.precision == null && !isNaN(precision = (0, _d3Format.precisionFixed)(step))) specifier.precision = precision - (specifier.type === "%") * 2;
        break;
      }
  }

  return (0, _d3Format.format)(specifier);
}
},{"d3-array":"Rpnd","d3-format":"SA6z"}],"WtG2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linearish = linearish;
exports.default = linear;

var _d3Array = require("d3-array");

var _d3Interpolate = require("d3-interpolate");

var _continuous = _interopRequireWildcard(require("./continuous"));

var _tickFormat = _interopRequireDefault(require("./tickFormat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function linearish(scale) {
  var domain = scale.domain;

  scale.ticks = function (count) {
    var d = domain();
    return (0, _d3Array.ticks)(d[0], d[d.length - 1], count == null ? 10 : count);
  };

  scale.tickFormat = function (count, specifier) {
    return (0, _tickFormat.default)(domain(), count, specifier);
  };

  scale.nice = function (count) {
    if (count == null) count = 10;
    var d = domain(),
        i0 = 0,
        i1 = d.length - 1,
        start = d[i0],
        stop = d[i1],
        step;

    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }

    step = (0, _d3Array.tickIncrement)(start, stop, count);

    if (step > 0) {
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
      step = (0, _d3Array.tickIncrement)(start, stop, count);
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
      step = (0, _d3Array.tickIncrement)(start, stop, count);
    }

    if (step > 0) {
      d[i0] = Math.floor(start / step) * step;
      d[i1] = Math.ceil(stop / step) * step;
      domain(d);
    } else if (step < 0) {
      d[i0] = Math.ceil(start * step) / step;
      d[i1] = Math.floor(stop * step) / step;
      domain(d);
    }

    return scale;
  };

  return scale;
}

function linear() {
  var scale = (0, _continuous.default)(_continuous.deinterpolateLinear, _d3Interpolate.interpolateNumber);

  scale.copy = function () {
    return (0, _continuous.copy)(scale, linear());
  };

  return linearish(scale);
}
},{"d3-array":"Rpnd","d3-interpolate":"y8gx","./continuous":"kGze","./tickFormat":"xMUV"}],"L+2v":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = identity;

var _array = require("./array");

var _linear = require("./linear");

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function identity() {
  var domain = [0, 1];

  function scale(x) {
    return +x;
  }

  scale.invert = scale;

  scale.domain = scale.range = function (_) {
    return arguments.length ? (domain = _array.map.call(_, _number.default), scale) : domain.slice();
  };

  scale.copy = function () {
    return identity().domain(domain);
  };

  return (0, _linear.linearish)(scale);
}
},{"./array":"XrLQ","./linear":"WtG2","./number":"B+tz"}],"0xl3":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(domain, interval) {
  domain = domain.slice();
  var i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      t;

  if (x1 < x0) {
    t = i0, i0 = i1, i1 = t;
    t = x0, x0 = x1, x1 = t;
  }

  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
}
},{}],"fBKL":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = log;

var _d3Array = require("d3-array");

var _d3Format = require("d3-format");

var _constant = _interopRequireDefault(require("./constant"));

var _nice = _interopRequireDefault(require("./nice"));

var _continuous = _interopRequireWildcard(require("./continuous"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function deinterpolate(a, b) {
  return (b = Math.log(b / a)) ? function (x) {
    return Math.log(x / a) / b;
  } : (0, _constant.default)(b);
}

function reinterpolate(a, b) {
  return a < 0 ? function (t) {
    return -Math.pow(-b, t) * Math.pow(-a, 1 - t);
  } : function (t) {
    return Math.pow(b, t) * Math.pow(a, 1 - t);
  };
}

function pow10(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function powp(base) {
  return base === 10 ? pow10 : base === Math.E ? Math.exp : function (x) {
    return Math.pow(base, x);
  };
}

function logp(base) {
  return base === Math.E ? Math.log : base === 10 && Math.log10 || base === 2 && Math.log2 || (base = Math.log(base), function (x) {
    return Math.log(x) / base;
  });
}

function reflect(f) {
  return function (x) {
    return -f(-x);
  };
}

function log() {
  var scale = (0, _continuous.default)(deinterpolate, reinterpolate).domain([1, 10]),
      domain = scale.domain,
      base = 10,
      logs = logp(10),
      pows = powp(10);

  function rescale() {
    logs = logp(base), pows = powp(base);
    if (domain()[0] < 0) logs = reflect(logs), pows = reflect(pows);
    return scale;
  }

  scale.base = function (_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };

  scale.domain = function (_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.ticks = function (count) {
    var d = domain(),
        u = d[0],
        v = d[d.length - 1],
        r;
    if (r = v < u) i = u, u = v, v = i;
    var i = logs(u),
        j = logs(v),
        p,
        k,
        t,
        n = count == null ? 10 : +count,
        z = [];

    if (!(base % 1) && j - i < n) {
      i = Math.round(i) - 1, j = Math.round(j) + 1;
      if (u > 0) for (; i < j; ++i) {
        for (k = 1, p = pows(i); k < base; ++k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      } else for (; i < j; ++i) {
        for (k = base - 1, p = pows(i); k >= 1; --k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      }
    } else {
      z = (0, _d3Array.ticks)(i, j, Math.min(j - i, n)).map(pows);
    }

    return r ? z.reverse() : z;
  };

  scale.tickFormat = function (count, specifier) {
    if (specifier == null) specifier = base === 10 ? ".0e" : ",";
    if (typeof specifier !== "function") specifier = (0, _d3Format.format)(specifier);
    if (count === Infinity) return specifier;
    if (count == null) count = 10;
    var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?

    return function (d) {
      var i = d / pows(Math.round(logs(d)));
      if (i * base < base - 0.5) i *= base;
      return i <= k ? specifier(d) : "";
    };
  };

  scale.nice = function () {
    return domain((0, _nice.default)(domain(), {
      floor: function (x) {
        return pows(Math.floor(logs(x)));
      },
      ceil: function (x) {
        return pows(Math.ceil(logs(x)));
      }
    }));
  };

  scale.copy = function () {
    return (0, _continuous.copy)(scale, log().base(base));
  };

  return scale;
}
},{"d3-array":"Rpnd","d3-format":"SA6z","./constant":"OKWp","./nice":"0xl3","./continuous":"kGze"}],"f2wX":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pow;
exports.sqrt = sqrt;

var _constant = _interopRequireDefault(require("./constant"));

var _linear = require("./linear");

var _continuous = _interopRequireWildcard(require("./continuous"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function raise(x, exponent) {
  return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
}

function pow() {
  var exponent = 1,
      scale = (0, _continuous.default)(deinterpolate, reinterpolate),
      domain = scale.domain;

  function deinterpolate(a, b) {
    return (b = raise(b, exponent) - (a = raise(a, exponent))) ? function (x) {
      return (raise(x, exponent) - a) / b;
    } : (0, _constant.default)(b);
  }

  function reinterpolate(a, b) {
    b = raise(b, exponent) - (a = raise(a, exponent));
    return function (t) {
      return raise(a + b * t, 1 / exponent);
    };
  }

  scale.exponent = function (_) {
    return arguments.length ? (exponent = +_, domain(domain())) : exponent;
  };

  scale.copy = function () {
    return (0, _continuous.copy)(scale, pow().exponent(exponent));
  };

  return (0, _linear.linearish)(scale);
}

function sqrt() {
  return pow().exponent(0.5);
}
},{"./constant":"OKWp","./linear":"WtG2","./continuous":"kGze"}],"9Dil":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = quantile;

var _d3Array = require("d3-array");

var _array = require("./array");

function quantile() {
  var domain = [],
      range = [],
      thresholds = [];

  function rescale() {
    var i = 0,
        n = Math.max(1, range.length);
    thresholds = new Array(n - 1);

    while (++i < n) thresholds[i - 1] = (0, _d3Array.quantile)(domain, i / n);

    return scale;
  }

  function scale(x) {
    if (!isNaN(x = +x)) return range[(0, _d3Array.bisect)(thresholds, x)];
  }

  scale.invertExtent = function (y) {
    var i = range.indexOf(y);
    return i < 0 ? [NaN, NaN] : [i > 0 ? thresholds[i - 1] : domain[0], i < thresholds.length ? thresholds[i] : domain[domain.length - 1]];
  };

  scale.domain = function (_) {
    if (!arguments.length) return domain.slice();
    domain = [];

    for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);

    domain.sort(_d3Array.ascending);
    return rescale();
  };

  scale.range = function (_) {
    return arguments.length ? (range = _array.slice.call(_), rescale()) : range.slice();
  };

  scale.quantiles = function () {
    return thresholds.slice();
  };

  scale.copy = function () {
    return quantile().domain(domain).range(range);
  };

  return scale;
}
},{"d3-array":"Rpnd","./array":"XrLQ"}],"j3Jj":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = quantize;

var _d3Array = require("d3-array");

var _array = require("./array");

var _linear = require("./linear");

function quantize() {
  var x0 = 0,
      x1 = 1,
      n = 1,
      domain = [0.5],
      range = [0, 1];

  function scale(x) {
    if (x <= x) return range[(0, _d3Array.bisect)(domain, x, 0, n)];
  }

  function rescale() {
    var i = -1;
    domain = new Array(n);

    while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);

    return scale;
  }

  scale.domain = function (_) {
    return arguments.length ? (x0 = +_[0], x1 = +_[1], rescale()) : [x0, x1];
  };

  scale.range = function (_) {
    return arguments.length ? (n = (range = _array.slice.call(_)).length - 1, rescale()) : range.slice();
  };

  scale.invertExtent = function (y) {
    var i = range.indexOf(y);
    return i < 0 ? [NaN, NaN] : i < 1 ? [x0, domain[0]] : i >= n ? [domain[n - 1], x1] : [domain[i - 1], domain[i]];
  };

  scale.copy = function () {
    return quantize().domain([x0, x1]).range(range);
  };

  return (0, _linear.linearish)(scale);
}
},{"d3-array":"Rpnd","./array":"XrLQ","./linear":"WtG2"}],"DmfT":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = threshold;

var _d3Array = require("d3-array");

var _array = require("./array");

function threshold() {
  var domain = [0.5],
      range = [0, 1],
      n = 1;

  function scale(x) {
    if (x <= x) return range[(0, _d3Array.bisect)(domain, x, 0, n)];
  }

  scale.domain = function (_) {
    return arguments.length ? (domain = _array.slice.call(_), n = Math.min(domain.length, range.length - 1), scale) : domain.slice();
  };

  scale.range = function (_) {
    return arguments.length ? (range = _array.slice.call(_), n = Math.min(domain.length, range.length - 1), scale) : range.slice();
  };

  scale.invertExtent = function (y) {
    var i = range.indexOf(y);
    return [domain[i - 1], domain[i]];
  };

  scale.copy = function () {
    return threshold().domain(domain).range(range);
  };

  return scale;
}
},{"d3-array":"Rpnd","./array":"XrLQ"}],"ia2J":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = newInterval;
var t0 = new Date(),
    t1 = new Date();

function newInterval(floori, offseti, count, field) {
  function interval(date) {
    return floori(date = new Date(+date)), date;
  }

  interval.floor = interval;

  interval.ceil = function (date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };

  interval.round = function (date) {
    var d0 = interval(date),
        d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };

  interval.offset = function (date, step) {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };

  interval.range = function (start, stop, step) {
    var range = [],
        previous;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date

    do range.push(previous = new Date(+start)), offseti(start, step), floori(start); while (previous < start && start < stop);

    return range;
  };

  interval.filter = function (test) {
    return newInterval(function (date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, function (date, step) {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty

        } else while (--step >= 0) {
          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty

        }
      }
    });
  };

  if (count) {
    interval.count = function (start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };

    interval.every = function (step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval : interval.filter(field ? function (d) {
        return field(d) % step === 0;
      } : function (d) {
        return interval.count(0, d) % step === 0;
      });
    };
  }

  return interval;
}
},{}],"YQ38":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.milliseconds = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var millisecond = (0, _interval.default)(function () {// noop
}, function (date, step) {
  date.setTime(+date + step);
}, function (start, end) {
  return end - start;
}); // An optimized implementation for this simple case.

millisecond.every = function (k) {
  k = Math.floor(k);
  if (!isFinite(k) || !(k > 0)) return null;
  if (!(k > 1)) return millisecond;
  return (0, _interval.default)(function (date) {
    date.setTime(Math.floor(date / k) * k);
  }, function (date, step) {
    date.setTime(+date + step * k);
  }, function (start, end) {
    return (end - start) / k;
  });
};

var _default = millisecond;
exports.default = _default;
var milliseconds = millisecond.range;
exports.milliseconds = milliseconds;
},{"./interval":"ia2J"}],"woBw":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.durationWeek = exports.durationDay = exports.durationHour = exports.durationMinute = exports.durationSecond = void 0;
var durationSecond = 1e3;
exports.durationSecond = durationSecond;
var durationMinute = 6e4;
exports.durationMinute = durationMinute;
var durationHour = 36e5;
exports.durationHour = durationHour;
var durationDay = 864e5;
exports.durationDay = durationDay;
var durationWeek = 6048e5;
exports.durationWeek = durationWeek;
},{}],"2nNS":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seconds = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval"));

var _duration = require("./duration");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var second = (0, _interval.default)(function (date) {
  date.setTime(date - date.getMilliseconds());
}, function (date, step) {
  date.setTime(+date + step * _duration.durationSecond);
}, function (start, end) {
  return (end - start) / _duration.durationSecond;
}, function (date) {
  return date.getUTCSeconds();
});
var _default = second;
exports.default = _default;
var seconds = second.range;
exports.seconds = seconds;
},{"./interval":"ia2J","./duration":"woBw"}],"0Nxb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minutes = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval"));

var _duration = require("./duration");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var minute = (0, _interval.default)(function (date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * _duration.durationSecond);
}, function (date, step) {
  date.setTime(+date + step * _duration.durationMinute);
}, function (start, end) {
  return (end - start) / _duration.durationMinute;
}, function (date) {
  return date.getMinutes();
});
var _default = minute;
exports.default = _default;
var minutes = minute.range;
exports.minutes = minutes;
},{"./interval":"ia2J","./duration":"woBw"}],"ShhP":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hours = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval"));

var _duration = require("./duration");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hour = (0, _interval.default)(function (date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * _duration.durationSecond - date.getMinutes() * _duration.durationMinute);
}, function (date, step) {
  date.setTime(+date + step * _duration.durationHour);
}, function (start, end) {
  return (end - start) / _duration.durationHour;
}, function (date) {
  return date.getHours();
});
var _default = hour;
exports.default = _default;
var hours = hour.range;
exports.hours = hours;
},{"./interval":"ia2J","./duration":"woBw"}],"mZUN":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.days = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval"));

var _duration = require("./duration");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var day = (0, _interval.default)(function (date) {
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setDate(date.getDate() + step);
}, function (start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * _duration.durationMinute) / _duration.durationDay;
}, function (date) {
  return date.getDate() - 1;
});
var _default = day;
exports.default = _default;
var days = day.range;
exports.days = days;
},{"./interval":"ia2J","./duration":"woBw"}],"8+H/":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saturdays = exports.fridays = exports.thursdays = exports.wednesdays = exports.tuesdays = exports.mondays = exports.sundays = exports.saturday = exports.friday = exports.thursday = exports.wednesday = exports.tuesday = exports.monday = exports.sunday = void 0;

var _interval = _interopRequireDefault(require("./interval"));

var _duration = require("./duration");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function weekday(i) {
  return (0, _interval.default)(function (date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function (start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * _duration.durationMinute) / _duration.durationWeek;
  });
}

var sunday = weekday(0);
exports.sunday = sunday;
var monday = weekday(1);
exports.monday = monday;
var tuesday = weekday(2);
exports.tuesday = tuesday;
var wednesday = weekday(3);
exports.wednesday = wednesday;
var thursday = weekday(4);
exports.thursday = thursday;
var friday = weekday(5);
exports.friday = friday;
var saturday = weekday(6);
exports.saturday = saturday;
var sundays = sunday.range;
exports.sundays = sundays;
var mondays = monday.range;
exports.mondays = mondays;
var tuesdays = tuesday.range;
exports.tuesdays = tuesdays;
var wednesdays = wednesday.range;
exports.wednesdays = wednesdays;
var thursdays = thursday.range;
exports.thursdays = thursdays;
var fridays = friday.range;
exports.fridays = fridays;
var saturdays = saturday.range;
exports.saturdays = saturdays;
},{"./interval":"ia2J","./duration":"woBw"}],"BD8V":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.months = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var month = (0, _interval.default)(function (date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setMonth(date.getMonth() + step);
}, function (start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function (date) {
  return date.getMonth();
});
var _default = month;
exports.default = _default;
var months = month.range;
exports.months = months;
},{"./interval":"ia2J"}],"Aez4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.years = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var year = (0, _interval.default)(function (date) {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function (start, end) {
  return end.getFullYear() - start.getFullYear();
}, function (date) {
  return date.getFullYear();
}); // An optimized implementation for this simple case.

year.every = function (k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : (0, _interval.default)(function (date) {
    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setFullYear(date.getFullYear() + step * k);
  });
};

var _default = year;
exports.default = _default;
var years = year.range;
exports.years = years;
},{"./interval":"ia2J"}],"O3Kl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcMinutes = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval"));

var _duration = require("./duration");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcMinute = (0, _interval.default)(function (date) {
  date.setUTCSeconds(0, 0);
}, function (date, step) {
  date.setTime(+date + step * _duration.durationMinute);
}, function (start, end) {
  return (end - start) / _duration.durationMinute;
}, function (date) {
  return date.getUTCMinutes();
});
var _default = utcMinute;
exports.default = _default;
var utcMinutes = utcMinute.range;
exports.utcMinutes = utcMinutes;
},{"./interval":"ia2J","./duration":"woBw"}],"f0g5":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcHours = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval"));

var _duration = require("./duration");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcHour = (0, _interval.default)(function (date) {
  date.setUTCMinutes(0, 0, 0);
}, function (date, step) {
  date.setTime(+date + step * _duration.durationHour);
}, function (start, end) {
  return (end - start) / _duration.durationHour;
}, function (date) {
  return date.getUTCHours();
});
var _default = utcHour;
exports.default = _default;
var utcHours = utcHour.range;
exports.utcHours = utcHours;
},{"./interval":"ia2J","./duration":"woBw"}],"nsxn":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcDays = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval"));

var _duration = require("./duration");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcDay = (0, _interval.default)(function (date) {
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function (start, end) {
  return (end - start) / _duration.durationDay;
}, function (date) {
  return date.getUTCDate() - 1;
});
var _default = utcDay;
exports.default = _default;
var utcDays = utcDay.range;
exports.utcDays = utcDays;
},{"./interval":"ia2J","./duration":"woBw"}],"bIs+":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcSaturdays = exports.utcFridays = exports.utcThursdays = exports.utcWednesdays = exports.utcTuesdays = exports.utcMondays = exports.utcSundays = exports.utcSaturday = exports.utcFriday = exports.utcThursday = exports.utcWednesday = exports.utcTuesday = exports.utcMonday = exports.utcSunday = void 0;

var _interval = _interopRequireDefault(require("./interval"));

var _duration = require("./duration");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function utcWeekday(i) {
  return (0, _interval.default)(function (date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function (start, end) {
    return (end - start) / _duration.durationWeek;
  });
}

var utcSunday = utcWeekday(0);
exports.utcSunday = utcSunday;
var utcMonday = utcWeekday(1);
exports.utcMonday = utcMonday;
var utcTuesday = utcWeekday(2);
exports.utcTuesday = utcTuesday;
var utcWednesday = utcWeekday(3);
exports.utcWednesday = utcWednesday;
var utcThursday = utcWeekday(4);
exports.utcThursday = utcThursday;
var utcFriday = utcWeekday(5);
exports.utcFriday = utcFriday;
var utcSaturday = utcWeekday(6);
exports.utcSaturday = utcSaturday;
var utcSundays = utcSunday.range;
exports.utcSundays = utcSundays;
var utcMondays = utcMonday.range;
exports.utcMondays = utcMondays;
var utcTuesdays = utcTuesday.range;
exports.utcTuesdays = utcTuesdays;
var utcWednesdays = utcWednesday.range;
exports.utcWednesdays = utcWednesdays;
var utcThursdays = utcThursday.range;
exports.utcThursdays = utcThursdays;
var utcFridays = utcFriday.range;
exports.utcFridays = utcFridays;
var utcSaturdays = utcSaturday.range;
exports.utcSaturdays = utcSaturdays;
},{"./interval":"ia2J","./duration":"woBw"}],"2KVi":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcMonths = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcMonth = (0, _interval.default)(function (date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function (start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function (date) {
  return date.getUTCMonth();
});
var _default = utcMonth;
exports.default = _default;
var utcMonths = utcMonth.range;
exports.utcMonths = utcMonths;
},{"./interval":"ia2J"}],"zjPu":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcYears = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcYear = (0, _interval.default)(function (date) {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function (start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function (date) {
  return date.getUTCFullYear();
}); // An optimized implementation for this simple case.

utcYear.every = function (k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : (0, _interval.default)(function (date) {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step * k);
  });
};

var _default = utcYear;
exports.default = _default;
var utcYears = utcYear.range;
exports.utcYears = utcYears;
},{"./interval":"ia2J"}],"QBVT":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "timeInterval", {
  enumerable: true,
  get: function () {
    return _interval.default;
  }
});
Object.defineProperty(exports, "timeMillisecond", {
  enumerable: true,
  get: function () {
    return _millisecond.default;
  }
});
Object.defineProperty(exports, "timeMilliseconds", {
  enumerable: true,
  get: function () {
    return _millisecond.milliseconds;
  }
});
Object.defineProperty(exports, "utcMillisecond", {
  enumerable: true,
  get: function () {
    return _millisecond.default;
  }
});
Object.defineProperty(exports, "utcMilliseconds", {
  enumerable: true,
  get: function () {
    return _millisecond.milliseconds;
  }
});
Object.defineProperty(exports, "timeSecond", {
  enumerable: true,
  get: function () {
    return _second.default;
  }
});
Object.defineProperty(exports, "timeSeconds", {
  enumerable: true,
  get: function () {
    return _second.seconds;
  }
});
Object.defineProperty(exports, "utcSecond", {
  enumerable: true,
  get: function () {
    return _second.default;
  }
});
Object.defineProperty(exports, "utcSeconds", {
  enumerable: true,
  get: function () {
    return _second.seconds;
  }
});
Object.defineProperty(exports, "timeMinute", {
  enumerable: true,
  get: function () {
    return _minute.default;
  }
});
Object.defineProperty(exports, "timeMinutes", {
  enumerable: true,
  get: function () {
    return _minute.minutes;
  }
});
Object.defineProperty(exports, "timeHour", {
  enumerable: true,
  get: function () {
    return _hour.default;
  }
});
Object.defineProperty(exports, "timeHours", {
  enumerable: true,
  get: function () {
    return _hour.hours;
  }
});
Object.defineProperty(exports, "timeDay", {
  enumerable: true,
  get: function () {
    return _day.default;
  }
});
Object.defineProperty(exports, "timeDays", {
  enumerable: true,
  get: function () {
    return _day.days;
  }
});
Object.defineProperty(exports, "timeWeek", {
  enumerable: true,
  get: function () {
    return _week.sunday;
  }
});
Object.defineProperty(exports, "timeWeeks", {
  enumerable: true,
  get: function () {
    return _week.sundays;
  }
});
Object.defineProperty(exports, "timeSunday", {
  enumerable: true,
  get: function () {
    return _week.sunday;
  }
});
Object.defineProperty(exports, "timeSundays", {
  enumerable: true,
  get: function () {
    return _week.sundays;
  }
});
Object.defineProperty(exports, "timeMonday", {
  enumerable: true,
  get: function () {
    return _week.monday;
  }
});
Object.defineProperty(exports, "timeMondays", {
  enumerable: true,
  get: function () {
    return _week.mondays;
  }
});
Object.defineProperty(exports, "timeTuesday", {
  enumerable: true,
  get: function () {
    return _week.tuesday;
  }
});
Object.defineProperty(exports, "timeTuesdays", {
  enumerable: true,
  get: function () {
    return _week.tuesdays;
  }
});
Object.defineProperty(exports, "timeWednesday", {
  enumerable: true,
  get: function () {
    return _week.wednesday;
  }
});
Object.defineProperty(exports, "timeWednesdays", {
  enumerable: true,
  get: function () {
    return _week.wednesdays;
  }
});
Object.defineProperty(exports, "timeThursday", {
  enumerable: true,
  get: function () {
    return _week.thursday;
  }
});
Object.defineProperty(exports, "timeThursdays", {
  enumerable: true,
  get: function () {
    return _week.thursdays;
  }
});
Object.defineProperty(exports, "timeFriday", {
  enumerable: true,
  get: function () {
    return _week.friday;
  }
});
Object.defineProperty(exports, "timeFridays", {
  enumerable: true,
  get: function () {
    return _week.fridays;
  }
});
Object.defineProperty(exports, "timeSaturday", {
  enumerable: true,
  get: function () {
    return _week.saturday;
  }
});
Object.defineProperty(exports, "timeSaturdays", {
  enumerable: true,
  get: function () {
    return _week.saturdays;
  }
});
Object.defineProperty(exports, "timeMonth", {
  enumerable: true,
  get: function () {
    return _month.default;
  }
});
Object.defineProperty(exports, "timeMonths", {
  enumerable: true,
  get: function () {
    return _month.months;
  }
});
Object.defineProperty(exports, "timeYear", {
  enumerable: true,
  get: function () {
    return _year.default;
  }
});
Object.defineProperty(exports, "timeYears", {
  enumerable: true,
  get: function () {
    return _year.years;
  }
});
Object.defineProperty(exports, "utcMinute", {
  enumerable: true,
  get: function () {
    return _utcMinute.default;
  }
});
Object.defineProperty(exports, "utcMinutes", {
  enumerable: true,
  get: function () {
    return _utcMinute.utcMinutes;
  }
});
Object.defineProperty(exports, "utcHour", {
  enumerable: true,
  get: function () {
    return _utcHour.default;
  }
});
Object.defineProperty(exports, "utcHours", {
  enumerable: true,
  get: function () {
    return _utcHour.utcHours;
  }
});
Object.defineProperty(exports, "utcDay", {
  enumerable: true,
  get: function () {
    return _utcDay.default;
  }
});
Object.defineProperty(exports, "utcDays", {
  enumerable: true,
  get: function () {
    return _utcDay.utcDays;
  }
});
Object.defineProperty(exports, "utcWeek", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSunday;
  }
});
Object.defineProperty(exports, "utcWeeks", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSundays;
  }
});
Object.defineProperty(exports, "utcSunday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSunday;
  }
});
Object.defineProperty(exports, "utcSundays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSundays;
  }
});
Object.defineProperty(exports, "utcMonday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcMonday;
  }
});
Object.defineProperty(exports, "utcMondays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcMondays;
  }
});
Object.defineProperty(exports, "utcTuesday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcTuesday;
  }
});
Object.defineProperty(exports, "utcTuesdays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcTuesdays;
  }
});
Object.defineProperty(exports, "utcWednesday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcWednesday;
  }
});
Object.defineProperty(exports, "utcWednesdays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcWednesdays;
  }
});
Object.defineProperty(exports, "utcThursday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcThursday;
  }
});
Object.defineProperty(exports, "utcThursdays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcThursdays;
  }
});
Object.defineProperty(exports, "utcFriday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcFriday;
  }
});
Object.defineProperty(exports, "utcFridays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcFridays;
  }
});
Object.defineProperty(exports, "utcSaturday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSaturday;
  }
});
Object.defineProperty(exports, "utcSaturdays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSaturdays;
  }
});
Object.defineProperty(exports, "utcMonth", {
  enumerable: true,
  get: function () {
    return _utcMonth.default;
  }
});
Object.defineProperty(exports, "utcMonths", {
  enumerable: true,
  get: function () {
    return _utcMonth.utcMonths;
  }
});
Object.defineProperty(exports, "utcYear", {
  enumerable: true,
  get: function () {
    return _utcYear.default;
  }
});
Object.defineProperty(exports, "utcYears", {
  enumerable: true,
  get: function () {
    return _utcYear.utcYears;
  }
});

var _interval = _interopRequireDefault(require("./interval"));

var _millisecond = _interopRequireWildcard(require("./millisecond"));

var _second = _interopRequireWildcard(require("./second"));

var _minute = _interopRequireWildcard(require("./minute"));

var _hour = _interopRequireWildcard(require("./hour"));

var _day = _interopRequireWildcard(require("./day"));

var _week = require("./week");

var _month = _interopRequireWildcard(require("./month"));

var _year = _interopRequireWildcard(require("./year"));

var _utcMinute = _interopRequireWildcard(require("./utcMinute"));

var _utcHour = _interopRequireWildcard(require("./utcHour"));

var _utcDay = _interopRequireWildcard(require("./utcDay"));

var _utcWeek = require("./utcWeek");

var _utcMonth = _interopRequireWildcard(require("./utcMonth"));

var _utcYear = _interopRequireWildcard(require("./utcYear"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./interval":"ia2J","./millisecond":"YQ38","./second":"2nNS","./minute":"0Nxb","./hour":"ShhP","./day":"mZUN","./week":"8+H/","./month":"BD8V","./year":"Aez4","./utcMinute":"O3Kl","./utcHour":"f0g5","./utcDay":"nsxn","./utcWeek":"bIs+","./utcMonth":"2KVi","./utcYear":"zjPu"}],"iLB2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatLocale;

var _d3Time = require("d3-time");

function localDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }

  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}

function utcDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date.setUTCFullYear(d.y);
    return date;
  }

  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}

function newYear(y) {
  return {
    y: y,
    m: 0,
    d: 1,
    H: 0,
    M: 0,
    S: 0,
    L: 0
  };
}

function formatLocale(locale) {
  var locale_dateTime = locale.dateTime,
      locale_date = locale.date,
      locale_time = locale.time,
      locale_periods = locale.periods,
      locale_weekdays = locale.days,
      locale_shortWeekdays = locale.shortDays,
      locale_months = locale.months,
      locale_shortMonths = locale.shortMonths;
  var periodRe = formatRe(locale_periods),
      periodLookup = formatLookup(locale_periods),
      weekdayRe = formatRe(locale_weekdays),
      weekdayLookup = formatLookup(locale_weekdays),
      shortWeekdayRe = formatRe(locale_shortWeekdays),
      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
      monthRe = formatRe(locale_months),
      monthLookup = formatLookup(locale_months),
      shortMonthRe = formatRe(locale_shortMonths),
      shortMonthLookup = formatLookup(locale_shortMonths);
  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "f": formatMicroseconds,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatSeconds,
    "u": formatWeekdayNumberMonday,
    "U": formatWeekNumberSunday,
    "V": formatWeekNumberISO,
    "w": formatWeekdayNumberSunday,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };
  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "f": formatUTCMicroseconds,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatUTCSeconds,
    "u": formatUTCWeekdayNumberMonday,
    "U": formatUTCWeekNumberSunday,
    "V": formatUTCWeekNumberISO,
    "w": formatUTCWeekdayNumberSunday,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };
  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "f": parseMicroseconds,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "Q": parseUnixTimestamp,
    "s": parseUnixTimestampSeconds,
    "S": parseSeconds,
    "u": parseWeekdayNumberMonday,
    "U": parseWeekNumberSunday,
    "V": parseWeekNumberISO,
    "w": parseWeekdayNumberSunday,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  }; // These recursive directive definitions must be deferred.

  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);

  function newFormat(specifier, formats) {
    return function (date) {
      var string = [],
          i = -1,
          j = 0,
          n = specifier.length,
          c,
          pad,
          format;
      if (!(date instanceof Date)) date = new Date(+date);

      while (++i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string.push(specifier.slice(j, i));
          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);else pad = c === "e" ? " " : "0";
          if (format = formats[c]) c = format(date, pad);
          string.push(c);
          j = i + 1;
        }
      }

      string.push(specifier.slice(j, i));
      return string.join("");
    };
  }

  function newParse(specifier, newDate) {
    return function (string) {
      var d = newYear(1900),
          i = parseSpecifier(d, specifier, string += "", 0),
          week,
          day;
      if (i != string.length) return null; // If a UNIX timestamp is specified, return it.

      if ("Q" in d) return new Date(d.Q); // The am-pm flag is 0 for AM, and 1 for PM.

      if ("p" in d) d.H = d.H % 12 + d.p * 12; // Convert day-of-week and week-of-year to day-of-year.

      if ("V" in d) {
        if (d.V < 1 || d.V > 53) return null;
        if (!("w" in d)) d.w = 1;

        if ("Z" in d) {
          week = utcDate(newYear(d.y)), day = week.getUTCDay();
          week = day > 4 || day === 0 ? _d3Time.utcMonday.ceil(week) : (0, _d3Time.utcMonday)(week);
          week = _d3Time.utcDay.offset(week, (d.V - 1) * 7);
          d.y = week.getUTCFullYear();
          d.m = week.getUTCMonth();
          d.d = week.getUTCDate() + (d.w + 6) % 7;
        } else {
          week = newDate(newYear(d.y)), day = week.getDay();
          week = day > 4 || day === 0 ? _d3Time.timeMonday.ceil(week) : (0, _d3Time.timeMonday)(week);
          week = _d3Time.timeDay.offset(week, (d.V - 1) * 7);
          d.y = week.getFullYear();
          d.m = week.getMonth();
          d.d = week.getDate() + (d.w + 6) % 7;
        }
      } else if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
        day = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
        d.m = 0;
        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
      } // If a time zone is specified, all fields are interpreted as UTC and then
      // offset according to the specified time zone.


      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      } // Otherwise, all fields are in local time.


      return newDate(d);
    };
  }

  function parseSpecifier(d, specifier, string, j) {
    var i = 0,
        n = specifier.length,
        m = string.length,
        c,
        parse;

    while (i < n) {
      if (j >= m) return -1;
      c = specifier.charCodeAt(i++);

      if (c === 37) {
        c = specifier.charAt(i++);
        parse = parses[c in pads ? specifier.charAt(i++) : c];
        if (!parse || (j = parse(d, string, j)) < 0) return -1;
      } else if (c != string.charCodeAt(j++)) {
        return -1;
      }
    }

    return j;
  }

  function parsePeriod(d, string, i) {
    var n = periodRe.exec(string.slice(i));
    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortWeekday(d, string, i) {
    var n = shortWeekdayRe.exec(string.slice(i));
    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseWeekday(d, string, i) {
    var n = weekdayRe.exec(string.slice(i));
    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortMonth(d, string, i) {
    var n = shortMonthRe.exec(string.slice(i));
    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseMonth(d, string, i) {
    var n = monthRe.exec(string.slice(i));
    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseLocaleDateTime(d, string, i) {
    return parseSpecifier(d, locale_dateTime, string, i);
  }

  function parseLocaleDate(d, string, i) {
    return parseSpecifier(d, locale_date, string, i);
  }

  function parseLocaleTime(d, string, i) {
    return parseSpecifier(d, locale_time, string, i);
  }

  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }

  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }

  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }

  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }

  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }

  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }

  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }

  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }

  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }

  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }

  return {
    format: function (specifier) {
      var f = newFormat(specifier += "", formats);

      f.toString = function () {
        return specifier;
      };

      return f;
    },
    parse: function (specifier) {
      var p = newParse(specifier += "", localDate);

      p.toString = function () {
        return specifier;
      };

      return p;
    },
    utcFormat: function (specifier) {
      var f = newFormat(specifier += "", utcFormats);

      f.toString = function () {
        return specifier;
      };

      return f;
    },
    utcParse: function (specifier) {
      var p = newParse(specifier, utcDate);

      p.toString = function () {
        return specifier;
      };

      return p;
    }
  };
}

var pads = {
  "-": "",
  "_": " ",
  "0": "0"
},
    numberRe = /^\s*\d+/,
    // note: ignores next directive
percentRe = /^%/,
    requoteRe = /[\\^$*+?|[\]().{}]/g;

function pad(value, fill, width) {
  var sign = value < 0 ? "-" : "",
      string = (sign ? -value : value) + "",
      length = string.length;
  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}

function requote(s) {
  return s.replace(requoteRe, "\\$&");
}

function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}

function formatLookup(names) {
  var map = {},
      i = -1,
      n = names.length;

  while (++i < n) map[names[i].toLowerCase()] = i;

  return map;
}

function parseWeekdayNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.w = +n[0], i + n[0].length) : -1;
}

function parseWeekdayNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.u = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.U = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberISO(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.V = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.W = +n[0], i + n[0].length) : -1;
}

function parseFullYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 4));
  return n ? (d.y = +n[0], i + n[0].length) : -1;
}

function parseYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}

function parseZone(d, string, i) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
}

function parseMonthNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}

function parseDayOfMonth(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.d = +n[0], i + n[0].length) : -1;
}

function parseDayOfYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}

function parseHour24(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.H = +n[0], i + n[0].length) : -1;
}

function parseMinutes(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.M = +n[0], i + n[0].length) : -1;
}

function parseSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.S = +n[0], i + n[0].length) : -1;
}

function parseMilliseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.L = +n[0], i + n[0].length) : -1;
}

function parseMicroseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 6));
  return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
}

function parseLiteralPercent(d, string, i) {
  var n = percentRe.exec(string.slice(i, i + 1));
  return n ? i + n[0].length : -1;
}

function parseUnixTimestamp(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.Q = +n[0], i + n[0].length) : -1;
}

function parseUnixTimestampSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.Q = +n[0] * 1000, i + n[0].length) : -1;
}

function formatDayOfMonth(d, p) {
  return pad(d.getDate(), p, 2);
}

function formatHour24(d, p) {
  return pad(d.getHours(), p, 2);
}

function formatHour12(d, p) {
  return pad(d.getHours() % 12 || 12, p, 2);
}

function formatDayOfYear(d, p) {
  return pad(1 + _d3Time.timeDay.count((0, _d3Time.timeYear)(d), d), p, 3);
}

function formatMilliseconds(d, p) {
  return pad(d.getMilliseconds(), p, 3);
}

function formatMicroseconds(d, p) {
  return formatMilliseconds(d, p) + "000";
}

function formatMonthNumber(d, p) {
  return pad(d.getMonth() + 1, p, 2);
}

function formatMinutes(d, p) {
  return pad(d.getMinutes(), p, 2);
}

function formatSeconds(d, p) {
  return pad(d.getSeconds(), p, 2);
}

function formatWeekdayNumberMonday(d) {
  var day = d.getDay();
  return day === 0 ? 7 : day;
}

function formatWeekNumberSunday(d, p) {
  return pad(_d3Time.timeSunday.count((0, _d3Time.timeYear)(d), d), p, 2);
}

function formatWeekNumberISO(d, p) {
  var day = d.getDay();
  d = day >= 4 || day === 0 ? (0, _d3Time.timeThursday)(d) : _d3Time.timeThursday.ceil(d);
  return pad(_d3Time.timeThursday.count((0, _d3Time.timeYear)(d), d) + ((0, _d3Time.timeYear)(d).getDay() === 4), p, 2);
}

function formatWeekdayNumberSunday(d) {
  return d.getDay();
}

function formatWeekNumberMonday(d, p) {
  return pad(_d3Time.timeMonday.count((0, _d3Time.timeYear)(d), d), p, 2);
}

function formatYear(d, p) {
  return pad(d.getFullYear() % 100, p, 2);
}

function formatFullYear(d, p) {
  return pad(d.getFullYear() % 10000, p, 4);
}

function formatZone(d) {
  var z = d.getTimezoneOffset();
  return (z > 0 ? "-" : (z *= -1, "+")) + pad(z / 60 | 0, "0", 2) + pad(z % 60, "0", 2);
}

function formatUTCDayOfMonth(d, p) {
  return pad(d.getUTCDate(), p, 2);
}

function formatUTCHour24(d, p) {
  return pad(d.getUTCHours(), p, 2);
}

function formatUTCHour12(d, p) {
  return pad(d.getUTCHours() % 12 || 12, p, 2);
}

function formatUTCDayOfYear(d, p) {
  return pad(1 + _d3Time.utcDay.count((0, _d3Time.utcYear)(d), d), p, 3);
}

function formatUTCMilliseconds(d, p) {
  return pad(d.getUTCMilliseconds(), p, 3);
}

function formatUTCMicroseconds(d, p) {
  return formatUTCMilliseconds(d, p) + "000";
}

function formatUTCMonthNumber(d, p) {
  return pad(d.getUTCMonth() + 1, p, 2);
}

function formatUTCMinutes(d, p) {
  return pad(d.getUTCMinutes(), p, 2);
}

function formatUTCSeconds(d, p) {
  return pad(d.getUTCSeconds(), p, 2);
}

function formatUTCWeekdayNumberMonday(d) {
  var dow = d.getUTCDay();
  return dow === 0 ? 7 : dow;
}

function formatUTCWeekNumberSunday(d, p) {
  return pad(_d3Time.utcSunday.count((0, _d3Time.utcYear)(d), d), p, 2);
}

function formatUTCWeekNumberISO(d, p) {
  var day = d.getUTCDay();
  d = day >= 4 || day === 0 ? (0, _d3Time.utcThursday)(d) : _d3Time.utcThursday.ceil(d);
  return pad(_d3Time.utcThursday.count((0, _d3Time.utcYear)(d), d) + ((0, _d3Time.utcYear)(d).getUTCDay() === 4), p, 2);
}

function formatUTCWeekdayNumberSunday(d) {
  return d.getUTCDay();
}

function formatUTCWeekNumberMonday(d, p) {
  return pad(_d3Time.utcMonday.count((0, _d3Time.utcYear)(d), d), p, 2);
}

function formatUTCYear(d, p) {
  return pad(d.getUTCFullYear() % 100, p, 2);
}

function formatUTCFullYear(d, p) {
  return pad(d.getUTCFullYear() % 10000, p, 4);
}

function formatUTCZone() {
  return "+0000";
}

function formatLiteralPercent() {
  return "%";
}

function formatUnixTimestamp(d) {
  return +d;
}

function formatUnixTimestampSeconds(d) {
  return Math.floor(+d / 1000);
}
},{"d3-time":"QBVT"}],"ydIr":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultLocale;
exports.utcParse = exports.utcFormat = exports.timeParse = exports.timeFormat = void 0;

var _locale = _interopRequireDefault(require("./locale"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var locale;
var timeFormat;
exports.timeFormat = timeFormat;
var timeParse;
exports.timeParse = timeParse;
var utcFormat;
exports.utcFormat = utcFormat;
var utcParse;
exports.utcParse = utcParse;
defaultLocale({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

function defaultLocale(definition) {
  locale = (0, _locale.default)(definition);
  exports.timeFormat = timeFormat = locale.format;
  exports.timeParse = timeParse = locale.parse;
  exports.utcFormat = utcFormat = locale.utcFormat;
  exports.utcParse = utcParse = locale.utcParse;
  return locale;
}
},{"./locale":"iLB2"}],"1IIz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.isoSpecifier = void 0;

var _defaultLocale = require("./defaultLocale");

var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";
exports.isoSpecifier = isoSpecifier;

function formatIsoNative(date) {
  return date.toISOString();
}

var formatIso = Date.prototype.toISOString ? formatIsoNative : (0, _defaultLocale.utcFormat)(isoSpecifier);
var _default = formatIso;
exports.default = _default;
},{"./defaultLocale":"ydIr"}],"u4fb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isoFormat = require("./isoFormat");

var _defaultLocale = require("./defaultLocale");

function parseIsoNative(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
}

var parseIso = +new Date("2000-01-01T00:00:00.000Z") ? parseIsoNative : (0, _defaultLocale.utcParse)(_isoFormat.isoSpecifier);
var _default = parseIso;
exports.default = _default;
},{"./isoFormat":"1IIz","./defaultLocale":"ydIr"}],"fort":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "timeFormatDefaultLocale", {
  enumerable: true,
  get: function () {
    return _defaultLocale.default;
  }
});
Object.defineProperty(exports, "timeFormat", {
  enumerable: true,
  get: function () {
    return _defaultLocale.timeFormat;
  }
});
Object.defineProperty(exports, "timeParse", {
  enumerable: true,
  get: function () {
    return _defaultLocale.timeParse;
  }
});
Object.defineProperty(exports, "utcFormat", {
  enumerable: true,
  get: function () {
    return _defaultLocale.utcFormat;
  }
});
Object.defineProperty(exports, "utcParse", {
  enumerable: true,
  get: function () {
    return _defaultLocale.utcParse;
  }
});
Object.defineProperty(exports, "timeFormatLocale", {
  enumerable: true,
  get: function () {
    return _locale.default;
  }
});
Object.defineProperty(exports, "isoFormat", {
  enumerable: true,
  get: function () {
    return _isoFormat.default;
  }
});
Object.defineProperty(exports, "isoParse", {
  enumerable: true,
  get: function () {
    return _isoParse.default;
  }
});

var _defaultLocale = _interopRequireWildcard(require("./defaultLocale"));

var _locale = _interopRequireDefault(require("./locale"));

var _isoFormat = _interopRequireDefault(require("./isoFormat"));

var _isoParse = _interopRequireDefault(require("./isoParse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }
},{"./defaultLocale":"ydIr","./locale":"iLB2","./isoFormat":"1IIz","./isoParse":"u4fb"}],"h0Y0":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calendar = calendar;
exports.default = _default;

var _d3Array = require("d3-array");

var _d3Interpolate = require("d3-interpolate");

var _d3Time = require("d3-time");

var _d3TimeFormat = require("d3-time-format");

var _array = require("./array");

var _continuous = _interopRequireWildcard(require("./continuous"));

var _nice = _interopRequireDefault(require("./nice"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var durationSecond = 1000,
    durationMinute = durationSecond * 60,
    durationHour = durationMinute * 60,
    durationDay = durationHour * 24,
    durationWeek = durationDay * 7,
    durationMonth = durationDay * 30,
    durationYear = durationDay * 365;

function date(t) {
  return new Date(t);
}

function number(t) {
  return t instanceof Date ? +t : +new Date(+t);
}

function calendar(year, month, week, day, hour, minute, second, millisecond, format) {
  var scale = (0, _continuous.default)(_continuous.deinterpolateLinear, _d3Interpolate.interpolateNumber),
      invert = scale.invert,
      domain = scale.domain;
  var formatMillisecond = format(".%L"),
      formatSecond = format(":%S"),
      formatMinute = format("%I:%M"),
      formatHour = format("%I %p"),
      formatDay = format("%a %d"),
      formatWeek = format("%b %d"),
      formatMonth = format("%B"),
      formatYear = format("%Y");
  var tickIntervals = [[second, 1, durationSecond], [second, 5, 5 * durationSecond], [second, 15, 15 * durationSecond], [second, 30, 30 * durationSecond], [minute, 1, durationMinute], [minute, 5, 5 * durationMinute], [minute, 15, 15 * durationMinute], [minute, 30, 30 * durationMinute], [hour, 1, durationHour], [hour, 3, 3 * durationHour], [hour, 6, 6 * durationHour], [hour, 12, 12 * durationHour], [day, 1, durationDay], [day, 2, 2 * durationDay], [week, 1, durationWeek], [month, 1, durationMonth], [month, 3, 3 * durationMonth], [year, 1, durationYear]];

  function tickFormat(date) {
    return (second(date) < date ? formatMillisecond : minute(date) < date ? formatSecond : hour(date) < date ? formatMinute : day(date) < date ? formatHour : month(date) < date ? week(date) < date ? formatDay : formatWeek : year(date) < date ? formatMonth : formatYear)(date);
  }

  function tickInterval(interval, start, stop, step) {
    if (interval == null) interval = 10; // If a desired tick count is specified, pick a reasonable tick interval
    // based on the extent of the domain and a rough estimate of tick size.
    // Otherwise, assume interval is already a time interval and use it.

    if (typeof interval === "number") {
      var target = Math.abs(stop - start) / interval,
          i = (0, _d3Array.bisector)(function (i) {
        return i[2];
      }).right(tickIntervals, target);

      if (i === tickIntervals.length) {
        step = (0, _d3Array.tickStep)(start / durationYear, stop / durationYear, interval);
        interval = year;
      } else if (i) {
        i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
        step = i[1];
        interval = i[0];
      } else {
        step = Math.max((0, _d3Array.tickStep)(start, stop, interval), 1);
        interval = millisecond;
      }
    }

    return step == null ? interval : interval.every(step);
  }

  scale.invert = function (y) {
    return new Date(invert(y));
  };

  scale.domain = function (_) {
    return arguments.length ? domain(_array.map.call(_, number)) : domain().map(date);
  };

  scale.ticks = function (interval, step) {
    var d = domain(),
        t0 = d[0],
        t1 = d[d.length - 1],
        r = t1 < t0,
        t;
    if (r) t = t0, t0 = t1, t1 = t;
    t = tickInterval(interval, t0, t1, step);
    t = t ? t.range(t0, t1 + 1) : []; // inclusive stop

    return r ? t.reverse() : t;
  };

  scale.tickFormat = function (count, specifier) {
    return specifier == null ? tickFormat : format(specifier);
  };

  scale.nice = function (interval, step) {
    var d = domain();
    return (interval = tickInterval(interval, d[0], d[d.length - 1], step)) ? domain((0, _nice.default)(d, interval)) : scale;
  };

  scale.copy = function () {
    return (0, _continuous.copy)(scale, calendar(year, month, week, day, hour, minute, second, millisecond, format));
  };

  return scale;
}

function _default() {
  return calendar(_d3Time.timeYear, _d3Time.timeMonth, _d3Time.timeWeek, _d3Time.timeDay, _d3Time.timeHour, _d3Time.timeMinute, _d3Time.timeSecond, _d3Time.timeMillisecond, _d3TimeFormat.timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
}
},{"d3-array":"Rpnd","d3-interpolate":"y8gx","d3-time":"QBVT","d3-time-format":"fort","./array":"XrLQ","./continuous":"kGze","./nice":"0xl3"}],"qF83":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _time = require("./time");

var _d3TimeFormat = require("d3-time-format");

var _d3Time = require("d3-time");

function _default() {
  return (0, _time.calendar)(_d3Time.utcYear, _d3Time.utcMonth, _d3Time.utcWeek, _d3Time.utcDay, _d3Time.utcHour, _d3Time.utcMinute, _d3Time.utcSecond, _d3Time.utcMillisecond, _d3TimeFormat.utcFormat).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]);
}
},{"./time":"h0Y0","d3-time-format":"fort","d3-time":"QBVT"}],"ZfR6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(s) {
  return s.match(/.{6}/g).map(function (x) {
    return "#" + x;
  });
}
},{}],"yAjl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("./colors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _colors.default)("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

exports.default = _default;
},{"./colors":"ZfR6"}],"ZR6z":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("./colors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _colors.default)("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

exports.default = _default;
},{"./colors":"ZfR6"}],"xh3a":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("./colors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _colors.default)("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

exports.default = _default;
},{"./colors":"ZfR6"}],"QbfL":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("./colors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _colors.default)("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

exports.default = _default;
},{"./colors":"ZfR6"}],"u19T":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _d3Color = require("d3-color");

var _d3Interpolate = require("d3-interpolate");

var _default = (0, _d3Interpolate.interpolateCubehelixLong)((0, _d3Color.cubehelix)(300, 0.5, 0.0), (0, _d3Color.cubehelix)(-240, 0.5, 1.0));

exports.default = _default;
},{"d3-color":"x3do","d3-interpolate":"y8gx"}],"WIYd":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.cool = exports.warm = void 0;

var _d3Color = require("d3-color");

var _d3Interpolate = require("d3-interpolate");

var warm = (0, _d3Interpolate.interpolateCubehelixLong)((0, _d3Color.cubehelix)(-100, 0.75, 0.35), (0, _d3Color.cubehelix)(80, 1.50, 0.8));
exports.warm = warm;
var cool = (0, _d3Interpolate.interpolateCubehelixLong)((0, _d3Color.cubehelix)(260, 0.75, 0.35), (0, _d3Color.cubehelix)(80, 1.50, 0.8));
exports.cool = cool;
var rainbow = (0, _d3Color.cubehelix)();

function _default(t) {
  if (t < 0 || t > 1) t -= Math.floor(t);
  var ts = Math.abs(t - 0.5);
  rainbow.h = 360 * t - 100;
  rainbow.s = 1.5 - 1.5 * ts;
  rainbow.l = 0.8 - 0.9 * ts;
  return rainbow + "";
}
},{"d3-color":"x3do","d3-interpolate":"y8gx"}],"Ui70":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plasma = exports.inferno = exports.magma = exports.default = void 0;

var _colors = _interopRequireDefault(require("./colors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ramp(range) {
  var n = range.length;
  return function (t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}

var _default = ramp((0, _colors.default)("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

exports.default = _default;
var magma = ramp((0, _colors.default)("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));
exports.magma = magma;
var inferno = ramp((0, _colors.default)("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));
exports.inferno = inferno;
var plasma = ramp((0, _colors.default)("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));
exports.plasma = plasma;
},{"./colors":"ZfR6"}],"BKE3":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sequential;

var _linear = require("./linear");

function sequential(interpolator) {
  var x0 = 0,
      x1 = 1,
      clamp = false;

  function scale(x) {
    var t = (x - x0) / (x1 - x0);
    return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
  }

  scale.domain = function (_) {
    return arguments.length ? (x0 = +_[0], x1 = +_[1], scale) : [x0, x1];
  };

  scale.clamp = function (_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };

  scale.interpolator = function (_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  scale.copy = function () {
    return sequential(interpolator).domain([x0, x1]).clamp(clamp);
  };

  return (0, _linear.linearish)(scale);
}
},{"./linear":"WtG2"}],"K4pn":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "scaleBand", {
  enumerable: true,
  get: function () {
    return _band.default;
  }
});
Object.defineProperty(exports, "scalePoint", {
  enumerable: true,
  get: function () {
    return _band.point;
  }
});
Object.defineProperty(exports, "scaleIdentity", {
  enumerable: true,
  get: function () {
    return _identity.default;
  }
});
Object.defineProperty(exports, "scaleLinear", {
  enumerable: true,
  get: function () {
    return _linear.default;
  }
});
Object.defineProperty(exports, "scaleLog", {
  enumerable: true,
  get: function () {
    return _log.default;
  }
});
Object.defineProperty(exports, "scaleOrdinal", {
  enumerable: true,
  get: function () {
    return _ordinal.default;
  }
});
Object.defineProperty(exports, "scaleImplicit", {
  enumerable: true,
  get: function () {
    return _ordinal.implicit;
  }
});
Object.defineProperty(exports, "scalePow", {
  enumerable: true,
  get: function () {
    return _pow.default;
  }
});
Object.defineProperty(exports, "scaleSqrt", {
  enumerable: true,
  get: function () {
    return _pow.sqrt;
  }
});
Object.defineProperty(exports, "scaleQuantile", {
  enumerable: true,
  get: function () {
    return _quantile.default;
  }
});
Object.defineProperty(exports, "scaleQuantize", {
  enumerable: true,
  get: function () {
    return _quantize.default;
  }
});
Object.defineProperty(exports, "scaleThreshold", {
  enumerable: true,
  get: function () {
    return _threshold.default;
  }
});
Object.defineProperty(exports, "scaleTime", {
  enumerable: true,
  get: function () {
    return _time.default;
  }
});
Object.defineProperty(exports, "scaleUtc", {
  enumerable: true,
  get: function () {
    return _utcTime.default;
  }
});
Object.defineProperty(exports, "schemeCategory10", {
  enumerable: true,
  get: function () {
    return _category.default;
  }
});
Object.defineProperty(exports, "schemeCategory20b", {
  enumerable: true,
  get: function () {
    return _category20b.default;
  }
});
Object.defineProperty(exports, "schemeCategory20c", {
  enumerable: true,
  get: function () {
    return _category20c.default;
  }
});
Object.defineProperty(exports, "schemeCategory20", {
  enumerable: true,
  get: function () {
    return _category2.default;
  }
});
Object.defineProperty(exports, "interpolateCubehelixDefault", {
  enumerable: true,
  get: function () {
    return _cubehelix.default;
  }
});
Object.defineProperty(exports, "interpolateRainbow", {
  enumerable: true,
  get: function () {
    return _rainbow.default;
  }
});
Object.defineProperty(exports, "interpolateWarm", {
  enumerable: true,
  get: function () {
    return _rainbow.warm;
  }
});
Object.defineProperty(exports, "interpolateCool", {
  enumerable: true,
  get: function () {
    return _rainbow.cool;
  }
});
Object.defineProperty(exports, "interpolateViridis", {
  enumerable: true,
  get: function () {
    return _viridis.default;
  }
});
Object.defineProperty(exports, "interpolateMagma", {
  enumerable: true,
  get: function () {
    return _viridis.magma;
  }
});
Object.defineProperty(exports, "interpolateInferno", {
  enumerable: true,
  get: function () {
    return _viridis.inferno;
  }
});
Object.defineProperty(exports, "interpolatePlasma", {
  enumerable: true,
  get: function () {
    return _viridis.plasma;
  }
});
Object.defineProperty(exports, "scaleSequential", {
  enumerable: true,
  get: function () {
    return _sequential.default;
  }
});

var _band = _interopRequireWildcard(require("./src/band"));

var _identity = _interopRequireDefault(require("./src/identity"));

var _linear = _interopRequireDefault(require("./src/linear"));

var _log = _interopRequireDefault(require("./src/log"));

var _ordinal = _interopRequireWildcard(require("./src/ordinal"));

var _pow = _interopRequireWildcard(require("./src/pow"));

var _quantile = _interopRequireDefault(require("./src/quantile"));

var _quantize = _interopRequireDefault(require("./src/quantize"));

var _threshold = _interopRequireDefault(require("./src/threshold"));

var _time = _interopRequireDefault(require("./src/time"));

var _utcTime = _interopRequireDefault(require("./src/utcTime"));

var _category = _interopRequireDefault(require("./src/category10"));

var _category20b = _interopRequireDefault(require("./src/category20b"));

var _category20c = _interopRequireDefault(require("./src/category20c"));

var _category2 = _interopRequireDefault(require("./src/category20"));

var _cubehelix = _interopRequireDefault(require("./src/cubehelix"));

var _rainbow = _interopRequireWildcard(require("./src/rainbow"));

var _viridis = _interopRequireWildcard(require("./src/viridis"));

var _sequential = _interopRequireDefault(require("./src/sequential"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }
},{"./src/band":"GuIC","./src/identity":"L+2v","./src/linear":"WtG2","./src/log":"fBKL","./src/ordinal":"Yv9Y","./src/pow":"f2wX","./src/quantile":"9Dil","./src/quantize":"j3Jj","./src/threshold":"DmfT","./src/time":"h0Y0","./src/utcTime":"qF83","./src/category10":"yAjl","./src/category20b":"ZR6z","./src/category20c":"xh3a","./src/category20":"QbfL","./src/cubehelix":"u19T","./src/rainbow":"WIYd","./src/viridis":"Ui70","./src/sequential":"BKE3"}],"r4k7":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-selection'], factory) :
    (factory((global.fc = global.fc || {}),global.d3));
}(this, function (exports,d3Selection) { 'use strict';

    // "Caution: avoid interpolating to or from the number zero when the interpolator is used to generate
    // a string (such as with attr).
    // Very small values, when stringified, may be converted to scientific notation and
    // cause a temporarily invalid attribute or style property value.
    // For example, the number 0.0000001 is converted to the string "1e-7".
    // This is particularly noticeable when interpolating opacity values.
    // To avoid scientific notation, start or end the transition at 1e-6,
    // which is the smallest value that is not stringified in exponential notation."
    // - https://github.com/mbostock/d3/wiki/Transitions#d3_interpolateNumber
    var effectivelyZero = 1e-6;

    // Wrapper around d3's selectAll/data data-join, which allows decoration of the result.
    // This is achieved by appending the element to the enter selection before exposing it.
    // A default transition of fade in/out is also implicitly added but can be modified.

    function dataJoin (element, className) {
        element = element || 'g';

        var key = function key(_, i) {
            return i;
        };

        var dataJoin = function dataJoin(container, data) {
            data = data || function (d) {
                return d;
            };

            // update
            var selector = className == null ? element : element + '.' + className;
            var selected = container.selectAll(selector)
            // in order to support nested selections, they can be filtered
            // to only return immediate children of the container
            .filter(function () {
                return this.parentNode === container.node();
            });
            var updateSelection = selected.data(data, key);

            // enter
            // when container is a transition, entering elements fade in (from transparent to opaque)
            // N.B. insert() is used to create new elements, rather than append(). insert() behaves in a special manner
            // on enter selections - entering elements will be inserted immediately before the next following sibling
            // in the update selection, if any.
            // This helps order the elements in an order consistent with the data, but doesn't guarantee the ordering;
            // if the updating elements change order then selection.order() would be required to update the order.
            // (#528)
            var enterSelection = updateSelection.enter().insert(element) // <<<--- this is the secret sauce of this whole file
            .attr('class', className);

            // exit
            // when container is a transition, exiting elements fade out (from opaque to transparent)
            var exitSelection = updateSelection.exit();

            // automatically merge in the enter selection
            updateSelection = updateSelection.merge(enterSelection);

            // if transitions are enable inherit the default transition from ancestors
            // and apply a default fade in/out transition
            if (d3Selection.selection.prototype.transition) {
                enterSelection.style('opacity', effectivelyZero);
                updateSelection.transition().style('opacity', 1);
                exitSelection.transition().style('opacity', effectivelyZero);
            }

            // automatically remove nodes in the exit selection
            exitSelection.remove();

            updateSelection.enter = function () {
                return enterSelection;
            };
            updateSelection.exit = function () {
                return exitSelection;
            };

            return updateSelection;
        };

        dataJoin.element = function (x) {
            if (!arguments.length) {
                return element;
            }
            element = x;
            return dataJoin;
        };
        dataJoin.className = function (x) {
            if (!arguments.length) {
                return className;
            }
            className = x;
            return dataJoin;
        };
        dataJoin.key = function (x) {
            if (!arguments.length) {
                return key;
            }
            key = x;
            return dataJoin;
        };

        return dataJoin;
    }

    exports.dataJoin = dataJoin;

}));
},{"d3-selection":"4Gs4"}],"DdIz":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.fc = global.fc || {})));
}(this, (function (exports) { 'use strict';

var createReboundMethod = (function (target, source, name) {
    var method = source[name];
    if (typeof method !== 'function') {
        throw new Error('Attempt to rebind ' + name + ' which isn\'t a function on the source object');
    }
    return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var value = method.apply(source, args);
        return value === source ? target : value;
    };
});

var rebind = (function (target, source) {
    for (var _len = arguments.length, names = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        names[_key - 2] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var name = _step.value;

            target[name] = createReboundMethod(target, source, name);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return target;
});

var createTransform = function createTransform(transforms) {
    return function (name) {
        return transforms.reduce(function (name, fn) {
            return name && fn(name);
        }, name);
    };
};

var rebindAll = (function (target, source) {
    for (var _len = arguments.length, transforms = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        transforms[_key - 2] = arguments[_key];
    }

    var transform = createTransform(transforms);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(source)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var name = _step.value;

            var result = transform(name);
            if (result) {
                target[result] = createReboundMethod(target, source, name);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return target;
});

var regexify = (function (strsOrRegexes) {
    return strsOrRegexes.map(function (strOrRegex) {
        return typeof strOrRegex === 'string' ? new RegExp('^' + strOrRegex + '$') : strOrRegex;
    });
});

var exclude = (function () {
    for (var _len = arguments.length, exclusions = Array(_len), _key = 0; _key < _len; _key++) {
        exclusions[_key] = arguments[_key];
    }

    exclusions = regexify(exclusions);
    return function (name) {
        return exclusions.every(function (exclusion) {
            return !exclusion.test(name);
        }) && name;
    };
});

var include = (function () {
    for (var _len = arguments.length, inclusions = Array(_len), _key = 0; _key < _len; _key++) {
        inclusions[_key] = arguments[_key];
    }

    inclusions = regexify(inclusions);
    return function (name) {
        return inclusions.some(function (inclusion) {
            return inclusion.test(name);
        }) && name;
    };
});

var includeMap = (function (mappings) {
  return function (name) {
    return mappings[name];
  };
});

var capitalizeFirstLetter = function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.slice(1);
};

var prefix = (function (prefix) {
  return function (name) {
    return prefix + capitalizeFirstLetter(name);
  };
});

exports.rebind = rebind;
exports.rebindAll = rebindAll;
exports.exclude = exclude;
exports.include = include;
exports.includeMap = includeMap;
exports.prefix = prefix;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],"LUlz":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array'), require('d3-selection'), require('d3-scale'), require('d3fc-data-join'), require('d3fc-rebind')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-array', 'd3-selection', 'd3-scale', 'd3fc-data-join', 'd3fc-rebind'], factory) :
  (factory((global.fc = global.fc || {}),global.d3,global.d3,global.d3,global.fc,global.fc));
}(this, (function (exports,d3Array,d3Selection,d3Scale,d3fcDataJoin,d3fcRebind) { 'use strict';

var functor = (function (d) {
  return typeof d === 'function' ? d : function () {
    return d;
  };
});

var label = (function (layoutStrategy) {

    var decorate = function decorate() {};
    var size = function size() {
        return [0, 0];
    };
    var position = function position(d, i) {
        return [d.x, d.y];
    };
    var strategy = layoutStrategy || function (x) {
        return x;
    };
    var component = function component() {};
    var xScale = d3Scale.scaleIdentity();
    var yScale = d3Scale.scaleIdentity();

    var dataJoin$$1 = d3fcDataJoin.dataJoin('g', 'label');

    var label = function label(selection) {

        selection.each(function (data, index, group) {

            var g = dataJoin$$1(d3Selection.select(group[index]), data).call(component);

            // obtain the rectangular bounding boxes for each child
            var nodes = g.nodes();
            var childRects = nodes.map(function (node, i) {
                var d = d3Selection.select(node).datum();
                var pos = position(d, i, nodes);
                var childPos = [xScale(pos[0]), yScale(pos[1])];
                var childSize = size(d, i, nodes);
                return {
                    hidden: false,
                    x: childPos[0],
                    y: childPos[1],
                    width: childSize[0],
                    height: childSize[1]
                };
            });

            // apply the strategy to derive the layout. The strategy does not change the order
            // or number of label.
            var layout = strategy(childRects);

            g.attr('style', function (_, i) {
                return 'display:' + (layout[i].hidden ? 'none' : 'inherit');
            }).attr('transform', function (_, i) {
                return 'translate(' + layout[i].x + ', ' + layout[i].y + ')';
            })
            // set the layout width / height so that children can use SVG layout if required
            .attr('layout-width', function (_, i) {
                return layout[i].width;
            }).attr('layout-height', function (_, i) {
                return layout[i].height;
            }).attr('anchor-x', function (d, i, g) {
                return childRects[i].x - layout[i].x;
            }).attr('anchor-y', function (d, i, g) {
                return childRects[i].y - layout[i].y;
            });

            g.call(component);

            decorate(g, data, index);
        });
    };

    d3fcRebind.rebindAll(label, dataJoin$$1, d3fcRebind.include('key'));
    d3fcRebind.rebindAll(label, strategy);

    label.size = function () {
        if (!arguments.length) {
            return size;
        }
        size = functor(arguments.length <= 0 ? undefined : arguments[0]);
        return label;
    };

    label.position = function () {
        if (!arguments.length) {
            return position;
        }
        position = functor(arguments.length <= 0 ? undefined : arguments[0]);
        return label;
    };

    label.component = function () {
        if (!arguments.length) {
            return component;
        }
        component = arguments.length <= 0 ? undefined : arguments[0];
        return label;
    };

    label.decorate = function () {
        if (!arguments.length) {
            return decorate;
        }
        decorate = arguments.length <= 0 ? undefined : arguments[0];
        return label;
    };

    label.xScale = function () {
        if (!arguments.length) {
            return xScale;
        }
        xScale = arguments.length <= 0 ? undefined : arguments[0];
        return label;
    };

    label.yScale = function () {
        if (!arguments.length) {
            return yScale;
        }
        yScale = arguments.length <= 0 ? undefined : arguments[0];
        return label;
    };

    return label;
});

var textLabel = (function (layoutStrategy) {

    var padding = 2;
    var value = function value(x) {
        return x;
    };

    var textJoin = d3fcDataJoin.dataJoin('text');
    var rectJoin = d3fcDataJoin.dataJoin('rect');
    var pointJoin = d3fcDataJoin.dataJoin('circle');

    var textLabel = function textLabel(selection) {
        selection.each(function (data, index, group) {

            var node = group[index];
            var nodeSelection = d3Selection.select(node);

            var width = Number(node.getAttribute('layout-width'));
            var height = Number(node.getAttribute('layout-height'));
            var rect = rectJoin(nodeSelection, [data]);
            rect.attr('width', width).attr('height', height);

            var anchorX = Number(node.getAttribute('anchor-x'));
            var anchorY = Number(node.getAttribute('anchor-y'));
            var circle = pointJoin(nodeSelection, [data]);
            circle.attr('r', 2).attr('cx', anchorX).attr('cy', anchorY);

            var text = textJoin(nodeSelection, [data]);
            text.enter().attr('dy', '0.9em').attr('transform', 'translate(' + padding + ', ' + padding + ')');
            text.text(value);
        });
    };

    textLabel.padding = function () {
        if (!arguments.length) {
            return padding;
        }
        padding = arguments.length <= 0 ? undefined : arguments[0];
        return textLabel;
    };

    textLabel.value = function () {
        if (!arguments.length) {
            return value;
        }
        value = functor(arguments.length <= 0 ? undefined : arguments[0]);
        return textLabel;
    };

    return textLabel;
});

var isIntersecting = function isIntersecting(a, b) {
    return !(a.x >= b.x + b.width || a.x + a.width <= b.x || a.y >= b.y + b.height || a.y + a.height <= b.y);
};

var intersect = (function (a, b) {
    if (isIntersecting(a, b)) {
        var left = Math.max(a.x, b.x);
        var right = Math.min(a.x + a.width, b.x + b.width);
        var top = Math.max(a.y, b.y);
        var bottom = Math.min(a.y + a.height, b.y + b.height);
        return (right - left) * (bottom - top);
    } else {
        return 0;
    }
});

// computes the area of overlap between the rectangle with the given index with the
// rectangles in the array
var collisionArea = function collisionArea(rectangles, index) {
    return d3Array.sum(rectangles.map(function (d, i) {
        return index === i ? 0 : intersect(rectangles[index], d);
    }));
};

// computes the total overlapping area of all of the rectangles in the given array

var getPlacement = function getPlacement(x, y, width, height, location) {
    return {
        x: x,
        y: y,
        width: width,
        height: height,
        location: location
    };
};

// returns all the potential placements of the given label
var placements = (function (label) {
    var x = label.x;
    var y = label.y;
    var width = label.width;
    var height = label.height;
    return [getPlacement(x, y, width, height, 'bottom-right'), getPlacement(x - width, y, width, height, 'bottom-left'), getPlacement(x - width, y - height, width, height, 'top-left'), getPlacement(x, y - height, width, height, 'top-right'), getPlacement(x, y - height / 2, width, height, 'middle-right'), getPlacement(x - width / 2, y, width, height, 'bottom-center'), getPlacement(x - width, y - height / 2, width, height, 'middle-left'), getPlacement(x - width / 2, y - height, width, height, 'top-center')];
});

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var substitute = function substitute(array, index, substitution) {
    return [].concat(toConsumableArray(array.slice(0, index)), [substitution], toConsumableArray(array.slice(index + 1)));
};

var lessThan = function lessThan(a, b) {
    return a < b;
};

// a layout takes an array of rectangles and allows their locations to be optimised.
// it is constructed using two functions, locationScore, which score the placement of and
// individual rectangle, and winningScore which takes the scores for a rectangle
// at two different locations and assigns a winningScore.
var layoutComponent = function layoutComponent() {
    var score = null;

    var winningScore = lessThan;

    var locationScore = function locationScore() {
        return 0;
    };

    var rectangles = void 0;

    var evaluatePlacement = function evaluatePlacement(placement, index) {
        return score - locationScore(rectangles[index], index, rectangles) + locationScore(placement, index, substitute(rectangles, index, placement));
    };

    var layout = function layout(placement, index) {
        if (!score) {
            score = d3Array.sum(rectangles.map(function (r, i) {
                return locationScore(r, i, rectangles);
            }));
        }

        var newScore = evaluatePlacement(placement, index);

        if (winningScore(newScore, score)) {
            return layoutComponent().locationScore(locationScore).winningScore(winningScore).score(newScore).rectangles(substitute(rectangles, index, placement));
        } else {
            return layout;
        }
    };

    layout.rectangles = function () {
        if (!arguments.length) {
            return rectangles;
        }
        rectangles = arguments.length <= 0 ? undefined : arguments[0];
        return layout;
    };
    layout.score = function () {
        if (!arguments.length) {
            return score;
        }
        score = arguments.length <= 0 ? undefined : arguments[0];
        return layout;
    };
    layout.winningScore = function () {
        if (!arguments.length) {
            return winningScore;
        }
        winningScore = arguments.length <= 0 ? undefined : arguments[0];
        return layout;
    };
    layout.locationScore = function () {
        if (!arguments.length) {
            return locationScore;
        }
        locationScore = arguments.length <= 0 ? undefined : arguments[0];
        return layout;
    };

    return layout;
};

var greedy = (function () {

    var bounds = void 0;

    var containerPenalty = function containerPenalty(rectangle) {
        return bounds ? rectangle.width * rectangle.height - intersect(rectangle, bounds) : 0;
    };

    var penaltyForRectangle = function penaltyForRectangle(rectangle, index, rectangles) {
        return collisionArea(rectangles, index) + containerPenalty(rectangle);
    };

    var strategy = function strategy(data) {
        var rectangles = layoutComponent().locationScore(penaltyForRectangle).rectangles(data);

        data.forEach(function (rectangle, index) {
            placements(rectangle).forEach(function (placement, placementIndex) {
                rectangles = rectangles(placement, index);
            });
        });
        return rectangles.rectangles();
    };

    strategy.bounds = function () {
        if (!arguments.length) {
            return bounds;
        }
        bounds = arguments.length <= 0 ? undefined : arguments[0];
        return strategy;
    };

    return strategy;
});

var randomItem = function randomItem(array) {
    return array[randomIndex(array)];
};

var randomIndex = function randomIndex(array) {
    return Math.floor(Math.random() * array.length);
};

var annealing = (function () {

    var temperature = 1000;
    var cooling = 1;
    var bounds = void 0;

    var orientationPenalty = function orientationPenalty(rectangle) {
        switch (rectangle.location) {
            case 'bottom-right':
                return 0;
            case 'middle-right':
            case 'bottom-center':
                return rectangle.width * rectangle.height / 8;
        }
        return rectangle.width * rectangle.height / 4;
    };

    var containerPenalty = function containerPenalty(rectangle) {
        return bounds ? rectangle.width * rectangle.height - intersect(rectangle, bounds) : 0;
    };

    var penaltyForRectangle = function penaltyForRectangle(rectangle, index, rectangles) {
        return collisionArea(rectangles, index) + containerPenalty(rectangle) + orientationPenalty(rectangle);
    };

    var strategy = function strategy(data) {
        var currentTemperature = temperature;

        // use annealing to allow a new score to be picked even if it is worse than the old
        var winningScore = function winningScore(newScore, oldScore) {
            return Math.exp((oldScore - newScore) / currentTemperature) > Math.random();
        };

        var rectangles = layoutComponent().locationScore(penaltyForRectangle).winningScore(winningScore).rectangles(data);

        while (currentTemperature > 0) {
            var index = randomIndex(data);
            var randomNewPlacement = randomItem(placements(data[index]));
            rectangles = rectangles(randomNewPlacement, index);
            currentTemperature -= cooling;
        }
        return rectangles.rectangles();
    };

    strategy.temperature = function () {
        if (!arguments.length) {
            return temperature;
        }
        temperature = arguments.length <= 0 ? undefined : arguments[0];
        return strategy;
    };

    strategy.cooling = function () {
        if (!arguments.length) {
            return cooling;
        }
        cooling = arguments.length <= 0 ? undefined : arguments[0];
        return strategy;
    };

    strategy.bounds = function () {
        if (!arguments.length) {
            return bounds;
        }
        bounds = arguments.length <= 0 ? undefined : arguments[0];
        return strategy;
    };

    return strategy;
});

var scanForObject = function scanForObject(array, comparator) {
    return array[d3Array.scan(array, comparator)];
};

var removeOverlaps = (function (adaptedStrategy) {

    adaptedStrategy = adaptedStrategy || function (x) {
        return x;
    };

    var removeOverlaps = function removeOverlaps(layout) {
        layout = adaptedStrategy(layout);

        var _loop = function _loop() {
            // find the collision area for all overlapping rectangles, hiding the one
            // with the greatest overlap
            var visible = layout.filter(function (d) {
                return !d.hidden;
            });
            var collisions = visible.map(function (d, i) {
                return [d, collisionArea(visible, i)];
            });
            var maximumCollision = scanForObject(collisions, function (a, b) {
                return b[1] - a[1];
            });
            if (maximumCollision[1] > 0) {
                maximumCollision[0].hidden = true;
            } else {
                return 'break';
            }
        };

        while (true) {
            var _ret = _loop();

            if (_ret === 'break') break;
        }
        return layout;
    };

    d3fcRebind.rebindAll(removeOverlaps, adaptedStrategy);

    return removeOverlaps;
});

var boundingBox = (function () {

    var bounds = [0, 0];

    var strategy = function strategy(data) {
        return data.map(function (d, i) {
            var tx = d.x;
            var ty = d.y;
            if (tx + d.width > bounds[0]) {
                tx -= d.width;
            }

            if (ty + d.height > bounds[1]) {
                ty -= d.height;
            }
            return { height: d.height, width: d.width, x: tx, y: ty };
        });
    };

    strategy.bounds = function () {
        if (!arguments.length) {
            return bounds;
        }
        bounds = arguments.length <= 0 ? undefined : arguments[0];
        return strategy;
    };

    return strategy;
});

exports.layoutLabel = label;
exports.layoutTextLabel = textLabel;
exports.layoutGreedy = greedy;
exports.layoutAnnealing = annealing;
exports.layoutRemoveOverlaps = removeOverlaps;
exports.layoutBoundingBox = boundingBox;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{"d3-array":"Rpnd","d3-selection":"4Gs4","d3-scale":"K4pn","d3fc-data-join":"r4k7","d3fc-rebind":"DdIz"}],"SYAW":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var noop = {
  value: function () {}
};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _) throw new Error("illegal type: " + t);
    _[t] = [];
  }

  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {
      type: t,
      name: name
    };
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function (typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length; // If no callback was specified, return the callback of the given type and name.

    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;

      return;
    } // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.


    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);

    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function () {
    var copy = {},
        _ = this._;

    for (var t in _) copy[t] = _[t].slice();

    return new Dispatch(copy);
  },
  call: function (type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);

    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function (type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);

    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }

  if (callback != null) type.push({
    name: name,
    value: callback
  });
  return type;
}

var _default = dispatch;
exports.default = _default;
},{}],"cNf8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "dispatch", {
  enumerable: true,
  get: function () {
    return _dispatch.default;
  }
});

var _dispatch = _interopRequireDefault(require("./dispatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./dispatch":"SYAW"}],"CQsD":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nopropagation = nopropagation;
exports.default = _default;

var _d3Selection = require("d3-selection");

function nopropagation() {
  _d3Selection.event.stopImmediatePropagation();
}

function _default() {
  _d3Selection.event.preventDefault();

  _d3Selection.event.stopImmediatePropagation();
}
},{"d3-selection":"4Gs4"}],"JG2T":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.yesdrag = yesdrag;

var _d3Selection = require("d3-selection");

var _noevent = _interopRequireDefault(require("./noevent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(view) {
  var root = view.document.documentElement,
      selection = (0, _d3Selection.select)(view).on("dragstart.drag", _noevent.default, true);

  if ("onselectstart" in root) {
    selection.on("selectstart.drag", _noevent.default, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = (0, _d3Selection.select)(view).on("dragstart.drag", null);

  if (noclick) {
    selection.on("click.drag", _noevent.default, true);
    setTimeout(function () {
      selection.on("click.drag", null);
    }, 0);
  }

  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}
},{"d3-selection":"4Gs4","./noevent":"CQsD"}],"2Qus":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DragEvent;

function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch) {
  this.target = target;
  this.type = type;
  this.subject = subject;
  this.identifier = id;
  this.active = active;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this._ = dispatch;
}

DragEvent.prototype.on = function () {
  var value = this._.on.apply(this._, arguments);

  return value === this._ ? this : value;
};
},{}],"U7NX":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Dispatch = require("d3-dispatch");

var _d3Selection = require("d3-selection");

var _nodrag = _interopRequireWildcard(require("./nodrag"));

var _noevent = _interopRequireWildcard(require("./noevent"));

var _constant = _interopRequireDefault(require("./constant"));

var _event = _interopRequireDefault(require("./event"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// Ignore right-click, since that should open the context menu.
function defaultFilter() {
  return !_d3Selection.event.button;
}

function defaultContainer() {
  return this.parentNode;
}

function defaultSubject(d) {
  return d == null ? {
    x: _d3Selection.event.x,
    y: _d3Selection.event.y
  } : d;
}

function defaultTouchable() {
  return "ontouchstart" in this;
}

function _default() {
  var filter = defaultFilter,
      container = defaultContainer,
      subject = defaultSubject,
      touchable = defaultTouchable,
      gestures = {},
      listeners = (0, _d3Dispatch.dispatch)("start", "drag", "end"),
      active = 0,
      mousedownx,
      mousedowny,
      mousemoving,
      touchending,
      clickDistance2 = 0;

  function drag(selection) {
    selection.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  function mousedowned() {
    if (touchending || !filter.apply(this, arguments)) return;
    var gesture = beforestart("mouse", container.apply(this, arguments), _d3Selection.mouse, this, arguments);
    if (!gesture) return;
    (0, _d3Selection.select)(_d3Selection.event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
    (0, _nodrag.default)(_d3Selection.event.view);
    (0, _noevent.nopropagation)();
    mousemoving = false;
    mousedownx = _d3Selection.event.clientX;
    mousedowny = _d3Selection.event.clientY;
    gesture("start");
  }

  function mousemoved() {
    (0, _noevent.default)();

    if (!mousemoving) {
      var dx = _d3Selection.event.clientX - mousedownx,
          dy = _d3Selection.event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }

    gestures.mouse("drag");
  }

  function mouseupped() {
    (0, _d3Selection.select)(_d3Selection.event.view).on("mousemove.drag mouseup.drag", null);
    (0, _nodrag.yesdrag)(_d3Selection.event.view, mousemoving);
    (0, _noevent.default)();
    gestures.mouse("end");
  }

  function touchstarted() {
    if (!filter.apply(this, arguments)) return;
    var touches = _d3Selection.event.changedTouches,
        c = container.apply(this, arguments),
        n = touches.length,
        i,
        gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(touches[i].identifier, c, _d3Selection.touch, this, arguments)) {
        (0, _noevent.nopropagation)();
        gesture("start");
      }
    }
  }

  function touchmoved() {
    var touches = _d3Selection.event.changedTouches,
        n = touches.length,
        i,
        gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        (0, _noevent.default)();
        gesture("drag");
      }
    }
  }

  function touchended() {
    var touches = _d3Selection.event.changedTouches,
        n = touches.length,
        i,
        gesture;
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function () {
      touchending = null;
    }, 500); // Ghost clicks are delayed!

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        (0, _noevent.nopropagation)();
        gesture("end");
      }
    }
  }

  function beforestart(id, container, point, that, args) {
    var p = point(container, id),
        s,
        dx,
        dy,
        sublisteners = listeners.copy();
    if (!(0, _d3Selection.customEvent)(new _event.default(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function () {
      if ((_d3Selection.event.subject = s = subject.apply(that, args)) == null) return false;
      dx = s.x - p[0] || 0;
      dy = s.y - p[1] || 0;
      return true;
    })) return;
    return function gesture(type) {
      var p0 = p,
          n;

      switch (type) {
        case "start":
          gestures[id] = gesture, n = active++;
          break;

        case "end":
          delete gestures[id], --active;
        // nobreak

        case "drag":
          p = point(container, id), n = active;
          break;
      }

      (0, _d3Selection.customEvent)(new _event.default(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [type, that, args]);
    };
  }

  drag.filter = function (_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : (0, _constant.default)(!!_), drag) : filter;
  };

  drag.container = function (_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : (0, _constant.default)(_), drag) : container;
  };

  drag.subject = function (_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : (0, _constant.default)(_), drag) : subject;
  };

  drag.touchable = function (_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : (0, _constant.default)(!!_), drag) : touchable;
  };

  drag.on = function () {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };

  drag.clickDistance = function (_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };

  return drag;
}
},{"d3-dispatch":"cNf8","d3-selection":"4Gs4","./nodrag":"JG2T","./noevent":"CQsD","./constant":"OKWp","./event":"2Qus"}],"aj7N":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "drag", {
  enumerable: true,
  get: function () {
    return _drag.default;
  }
});
Object.defineProperty(exports, "dragDisable", {
  enumerable: true,
  get: function () {
    return _nodrag.default;
  }
});
Object.defineProperty(exports, "dragEnable", {
  enumerable: true,
  get: function () {
    return _nodrag.yesdrag;
  }
});

var _drag = _interopRequireDefault(require("./drag"));

var _nodrag = _interopRequireWildcard(require("./nodrag"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./drag":"U7NX","./nodrag":"JG2T"}],"5hCw":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var pi = Math.PI,
    tau = 2 * pi,
    epsilon = 1e-6,
    tauEpsilon = tau - epsilon;

function Path() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null; // end of current subpath

  this._ = "";
}

function path() {
  return new Path();
}

Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function (x, y) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
  },
  closePath: function () {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function (x, y) {
    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  quadraticCurveTo: function (x1, y1, x, y) {
    this._ += "Q" + +x1 + "," + +y1 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  bezierCurveTo: function (x1, y1, x2, y2, x, y) {
    this._ += "C" + +x1 + "," + +y1 + "," + +x2 + "," + +y2 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  arcTo: function (x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    var x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01; // Is the radius negative? Error.

    if (r < 0) throw new Error("negative radius: " + r); // Is this path empty? Move to (x1,y1).

    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    } // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon)) ; // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
      // Equivalently, is (x1,y1) coincident with (x2,y2)?
      // Or, is the radius zero? Line to (x1,y1).
      else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
          this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
        } // Otherwise, draw an arc!
        else {
            var x20 = x2 - x0,
                y20 = y2 - y0,
                l21_2 = x21 * x21 + y21 * y21,
                l20_2 = x20 * x20 + y20 * y20,
                l21 = Math.sqrt(l21_2),
                l01 = Math.sqrt(l01_2),
                l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
                t01 = l / l01,
                t21 = l / l21; // If the start tangent is not coincident with (x0,y0), line to.

            if (Math.abs(t01 - 1) > epsilon) {
              this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
            }

            this._ += "A" + r + "," + r + ",0,0," + +(y01 * x20 > x01 * y20) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
          }
  },
  arc: function (x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r;
    var dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0; // Is the radius negative? Error.

    if (r < 0) throw new Error("negative radius: " + r); // Is this path empty? Move to (x0,y0).

    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    } // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
        this._ += "L" + x0 + "," + y0;
      } // Is this arc empty? We’re done.


    if (!r) return; // Does the angle go the wrong way? Flip the direction.

    if (da < 0) da = da % tau + tau; // Is this a complete circle? Draw two arcs to complete the circle.

    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    } // Is this arc non-empty? Draw an arc!
    else if (da > epsilon) {
        this._ += "A" + r + "," + r + ",0," + +(da >= pi) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
      }
  },
  rect: function (x, y, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + +w + "v" + +h + "h" + -w + "Z";
  },
  toString: function () {
    return this._;
  }
};
var _default = path;
exports.default = _default;
},{}],"2zaW":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "path", {
  enumerable: true,
  get: function () {
    return _path.default;
  }
});

var _path = _interopRequireDefault(require("./path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./path":"5hCw"}],"k9An":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return function constant() {
    return x;
  };
}
},{}],"afGh":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tau = exports.halfPi = exports.pi = exports.epsilon = void 0;
var epsilon = 1e-12;
exports.epsilon = epsilon;
var pi = Math.PI;
exports.pi = pi;
var halfPi = pi / 2;
exports.halfPi = halfPi;
var tau = 2 * pi;
exports.tau = tau;
},{}],"KUIA":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Path = require("d3-path");

var _constant = _interopRequireDefault(require("./constant"));

var _math = require("./math");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function arcInnerRadius(d) {
  return d.innerRadius;
}

function arcOuterRadius(d) {
  return d.outerRadius;
}

function arcStartAngle(d) {
  return d.startAngle;
}

function arcEndAngle(d) {
  return d.endAngle;
}

function arcPadAngle(d) {
  return d && d.padAngle; // Note: optional!
}

function asin(x) {
  return x >= 1 ? _math.halfPi : x <= -1 ? -_math.halfPi : Math.asin(x);
}

function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var x10 = x1 - x0,
      y10 = y1 - y0,
      x32 = x3 - x2,
      y32 = y3 - y2,
      t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / (y32 * x10 - x32 * y10);
  return [x0 + t * x10, y0 + t * y10];
} // Compute perpendicular offset line of length rc.
// http://mathworld.wolfram.com/Circle-LineIntersection.html


function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
  var x01 = x0 - x1,
      y01 = y0 - y1,
      lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01),
      ox = lo * y01,
      oy = -lo * x01,
      x11 = x0 + ox,
      y11 = y0 + oy,
      x10 = x1 + ox,
      y10 = y1 + oy,
      x00 = (x11 + x10) / 2,
      y00 = (y11 + y10) / 2,
      dx = x10 - x11,
      dy = y10 - y11,
      d2 = dx * dx + dy * dy,
      r = r1 - rc,
      D = x11 * y10 - x10 * y11,
      d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D)),
      cx0 = (D * dy - dx * d) / d2,
      cy0 = (-D * dx - dy * d) / d2,
      cx1 = (D * dy + dx * d) / d2,
      cy1 = (-D * dx + dy * d) / d2,
      dx0 = cx0 - x00,
      dy0 = cy0 - y00,
      dx1 = cx1 - x00,
      dy1 = cy1 - y00; // Pick the closer of the two intersection points.
  // TODO Is there a faster way to determine which intersection to use?

  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
  return {
    cx: cx0,
    cy: cy0,
    x01: -ox,
    y01: -oy,
    x11: cx0 * (r1 / r - 1),
    y11: cy0 * (r1 / r - 1)
  };
}

function _default() {
  var innerRadius = arcInnerRadius,
      outerRadius = arcOuterRadius,
      cornerRadius = (0, _constant.default)(0),
      padRadius = null,
      startAngle = arcStartAngle,
      endAngle = arcEndAngle,
      padAngle = arcPadAngle,
      context = null;

  function arc() {
    var buffer,
        r,
        r0 = +innerRadius.apply(this, arguments),
        r1 = +outerRadius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) - _math.halfPi,
        a1 = endAngle.apply(this, arguments) - _math.halfPi,
        da = Math.abs(a1 - a0),
        cw = a1 > a0;

    if (!context) context = buffer = (0, _d3Path.path)(); // Ensure that the outer radius is always larger than the inner radius.

    if (r1 < r0) r = r1, r1 = r0, r0 = r; // Is it a point?

    if (!(r1 > _math.epsilon)) context.moveTo(0, 0); // Or is it a circle or annulus?
    else if (da > _math.tau - _math.epsilon) {
        context.moveTo(r1 * Math.cos(a0), r1 * Math.sin(a0));
        context.arc(0, 0, r1, a0, a1, !cw);

        if (r0 > _math.epsilon) {
          context.moveTo(r0 * Math.cos(a1), r0 * Math.sin(a1));
          context.arc(0, 0, r0, a1, a0, cw);
        }
      } // Or is it a circular or annular sector?
      else {
          var a01 = a0,
              a11 = a1,
              a00 = a0,
              a10 = a1,
              da0 = da,
              da1 = da,
              ap = padAngle.apply(this, arguments) / 2,
              rp = ap > _math.epsilon && (padRadius ? +padRadius.apply(this, arguments) : Math.sqrt(r0 * r0 + r1 * r1)),
              rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
              rc0 = rc,
              rc1 = rc,
              t0,
              t1; // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.

          if (rp > _math.epsilon) {
            var p0 = asin(rp / r0 * Math.sin(ap)),
                p1 = asin(rp / r1 * Math.sin(ap));
            if ((da0 -= p0 * 2) > _math.epsilon) p0 *= cw ? 1 : -1, a00 += p0, a10 -= p0;else da0 = 0, a00 = a10 = (a0 + a1) / 2;
            if ((da1 -= p1 * 2) > _math.epsilon) p1 *= cw ? 1 : -1, a01 += p1, a11 -= p1;else da1 = 0, a01 = a11 = (a0 + a1) / 2;
          }

          var x01 = r1 * Math.cos(a01),
              y01 = r1 * Math.sin(a01),
              x10 = r0 * Math.cos(a10),
              y10 = r0 * Math.sin(a10); // Apply rounded corners?

          if (rc > _math.epsilon) {
            var x11 = r1 * Math.cos(a11),
                y11 = r1 * Math.sin(a11),
                x00 = r0 * Math.cos(a00),
                y00 = r0 * Math.sin(a00); // Restrict the corner radius according to the sector angle.

            if (da < _math.pi) {
              var oc = da0 > _math.epsilon ? intersect(x01, y01, x00, y00, x11, y11, x10, y10) : [x10, y10],
                  ax = x01 - oc[0],
                  ay = y01 - oc[1],
                  bx = x11 - oc[0],
                  by = y11 - oc[1],
                  kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2),
                  lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
              rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
              rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
            }
          } // Is the sector collapsed to a line?


          if (!(da1 > _math.epsilon)) context.moveTo(x01, y01); // Does the sector’s outer ring have rounded corners?
          else if (rc1 > _math.epsilon) {
              t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
              t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);
              context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01); // Have the corners merged?

              if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, Math.atan2(t0.y01, t0.x01), Math.atan2(t1.y01, t1.x01), !cw); // Otherwise, draw the two corners and the ring.
              else {
                  context.arc(t0.cx, t0.cy, rc1, Math.atan2(t0.y01, t0.x01), Math.atan2(t0.y11, t0.x11), !cw);
                  context.arc(0, 0, r1, Math.atan2(t0.cy + t0.y11, t0.cx + t0.x11), Math.atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
                  context.arc(t1.cx, t1.cy, rc1, Math.atan2(t1.y11, t1.x11), Math.atan2(t1.y01, t1.x01), !cw);
                }
            } // Or is the outer ring just a circular arc?
            else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw); // Is there no inner ring, and it’s a circular sector?
          // Or perhaps it’s an annular sector collapsed due to padding?

          if (!(r0 > _math.epsilon) || !(da0 > _math.epsilon)) context.lineTo(x10, y10); // Does the sector’s inner ring (or point) have rounded corners?
          else if (rc0 > _math.epsilon) {
              t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
              t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);
              context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01); // Have the corners merged?

              if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, Math.atan2(t0.y01, t0.x01), Math.atan2(t1.y01, t1.x01), !cw); // Otherwise, draw the two corners and the ring.
              else {
                  context.arc(t0.cx, t0.cy, rc0, Math.atan2(t0.y01, t0.x01), Math.atan2(t0.y11, t0.x11), !cw);
                  context.arc(0, 0, r0, Math.atan2(t0.cy + t0.y11, t0.cx + t0.x11), Math.atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
                  context.arc(t1.cx, t1.cy, rc0, Math.atan2(t1.y11, t1.x11), Math.atan2(t1.y01, t1.x01), !cw);
                }
            } // Or is the inner ring just a circular arc?
            else context.arc(0, 0, r0, a10, a00, cw);
        }
    context.closePath();
    if (buffer) return context = null, buffer + "" || null;
  }

  arc.centroid = function () {
    var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
        a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - _math.pi / 2;
    return [Math.cos(a) * r, Math.sin(a) * r];
  };

  arc.innerRadius = function (_) {
    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : (0, _constant.default)(+_), arc) : innerRadius;
  };

  arc.outerRadius = function (_) {
    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : (0, _constant.default)(+_), arc) : outerRadius;
  };

  arc.cornerRadius = function (_) {
    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : (0, _constant.default)(+_), arc) : cornerRadius;
  };

  arc.padRadius = function (_) {
    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : (0, _constant.default)(+_), arc) : padRadius;
  };

  arc.startAngle = function (_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : (0, _constant.default)(+_), arc) : startAngle;
  };

  arc.endAngle = function (_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : (0, _constant.default)(+_), arc) : endAngle;
  };

  arc.padAngle = function (_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : (0, _constant.default)(+_), arc) : padAngle;
  };

  arc.context = function (_) {
    return arguments.length ? (context = _ == null ? null : _, arc) : context;
  };

  return arc;
}
},{"d3-path":"2zaW","./constant":"k9An","./math":"afGh"}],"0QOZ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function Linear(context) {
  this._context = context;
}

Linear.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;

      case 1:
        this._point = 2;
      // proceed

      default:
        this._context.lineTo(x, y);

        break;
    }
  }
};

function _default(context) {
  return new Linear(context);
}
},{}],"ds32":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.x = x;
exports.y = y;

function x(p) {
  return p[0];
}

function y(p) {
  return p[1];
}
},{}],"dd/x":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Path = require("d3-path");

var _constant = _interopRequireDefault(require("./constant"));

var _linear = _interopRequireDefault(require("./curve/linear"));

var _point = require("./point");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var x = _point.x,
      y = _point.y,
      defined = (0, _constant.default)(true),
      context = null,
      curve = _linear.default,
      output = null;

  function line(data) {
    var i,
        n = data.length,
        d,
        defined0 = false,
        buffer;
    if (context == null) output = curve(buffer = (0, _d3Path.path)());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();else output.lineEnd();
      }

      if (defined0) output.point(+x(d, i, data), +y(d, i, data));
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  line.x = function (_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : (0, _constant.default)(+_), line) : x;
  };

  line.y = function (_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : (0, _constant.default)(+_), line) : y;
  };

  line.defined = function (_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : (0, _constant.default)(!!_), line) : defined;
  };

  line.curve = function (_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };

  line.context = function (_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };

  return line;
}
},{"d3-path":"2zaW","./constant":"k9An","./curve/linear":"0QOZ","./point":"ds32"}],"hF4o":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Path = require("d3-path");

var _constant = _interopRequireDefault(require("./constant"));

var _linear = _interopRequireDefault(require("./curve/linear"));

var _line = _interopRequireDefault(require("./line"));

var _point = require("./point");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var x0 = _point.x,
      x1 = null,
      y0 = (0, _constant.default)(0),
      y1 = _point.y,
      defined = (0, _constant.default)(true),
      context = null,
      curve = _linear.default,
      output = null;

  function area(data) {
    var i,
        j,
        k,
        n = data.length,
        d,
        defined0 = false,
        buffer,
        x0z = new Array(n),
        y0z = new Array(n);
    if (context == null) output = curve(buffer = (0, _d3Path.path)());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) {
          j = i;
          output.areaStart();
          output.lineStart();
        } else {
          output.lineEnd();
          output.lineStart();

          for (k = i - 1; k >= j; --k) {
            output.point(x0z[k], y0z[k]);
          }

          output.lineEnd();
          output.areaEnd();
        }
      }

      if (defined0) {
        x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
        output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
      }
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  function arealine() {
    return (0, _line.default)().defined(defined).curve(curve).context(context);
  }

  area.x = function (_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : (0, _constant.default)(+_), x1 = null, area) : x0;
  };

  area.x0 = function (_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : (0, _constant.default)(+_), area) : x0;
  };

  area.x1 = function (_) {
    return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : (0, _constant.default)(+_), area) : x1;
  };

  area.y = function (_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : (0, _constant.default)(+_), y1 = null, area) : y0;
  };

  area.y0 = function (_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : (0, _constant.default)(+_), area) : y0;
  };

  area.y1 = function (_) {
    return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : (0, _constant.default)(+_), area) : y1;
  };

  area.lineX0 = area.lineY0 = function () {
    return arealine().x(x0).y(y0);
  };

  area.lineY1 = function () {
    return arealine().x(x0).y(y1);
  };

  area.lineX1 = function () {
    return arealine().x(x1).y(y0);
  };

  area.defined = function (_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : (0, _constant.default)(!!_), area) : defined;
  };

  area.curve = function (_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
  };

  area.context = function (_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
  };

  return area;
}
},{"d3-path":"2zaW","./constant":"k9An","./curve/linear":"0QOZ","./line":"dd/x","./point":"ds32"}],"ZE+Q":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(d) {
  return d;
}
},{}],"59wa":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _constant = _interopRequireDefault(require("./constant"));

var _descending = _interopRequireDefault(require("./descending"));

var _identity = _interopRequireDefault(require("./identity"));

var _math = require("./math");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var value = _identity.default,
      sortValues = _descending.default,
      sort = null,
      startAngle = (0, _constant.default)(0),
      endAngle = (0, _constant.default)(_math.tau),
      padAngle = (0, _constant.default)(0);

  function pie(data) {
    var i,
        n = data.length,
        j,
        k,
        sum = 0,
        index = new Array(n),
        arcs = new Array(n),
        a0 = +startAngle.apply(this, arguments),
        da = Math.min(_math.tau, Math.max(-_math.tau, endAngle.apply(this, arguments) - a0)),
        a1,
        p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
        pa = p * (da < 0 ? -1 : 1),
        v;

    for (i = 0; i < n; ++i) {
      if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
        sum += v;
      }
    } // Optionally sort the arcs by previously-computed values or by data.


    if (sortValues != null) index.sort(function (i, j) {
      return sortValues(arcs[i], arcs[j]);
    });else if (sort != null) index.sort(function (i, j) {
      return sort(data[i], data[j]);
    }); // Compute the arcs! They are stored in the original data's order.

    for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
      j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
        data: data[j],
        index: i,
        value: v,
        startAngle: a0,
        endAngle: a1,
        padAngle: p
      };
    }

    return arcs;
  }

  pie.value = function (_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : (0, _constant.default)(+_), pie) : value;
  };

  pie.sortValues = function (_) {
    return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
  };

  pie.sort = function (_) {
    return arguments.length ? (sort = _, sortValues = null, pie) : sort;
  };

  pie.startAngle = function (_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : (0, _constant.default)(+_), pie) : startAngle;
  };

  pie.endAngle = function (_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : (0, _constant.default)(+_), pie) : endAngle;
  };

  pie.padAngle = function (_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : (0, _constant.default)(+_), pie) : padAngle;
  };

  return pie;
}
},{"./constant":"k9An","./descending":"s7oJ","./identity":"ZE+Q","./math":"afGh"}],"cgqr":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = curveRadial;
exports.curveRadialLinear = void 0;

var _linear = _interopRequireDefault(require("./linear"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var curveRadialLinear = curveRadial(_linear.default);
exports.curveRadialLinear = curveRadialLinear;

function Radial(curve) {
  this._curve = curve;
}

Radial.prototype = {
  areaStart: function () {
    this._curve.areaStart();
  },
  areaEnd: function () {
    this._curve.areaEnd();
  },
  lineStart: function () {
    this._curve.lineStart();
  },
  lineEnd: function () {
    this._curve.lineEnd();
  },
  point: function (a, r) {
    this._curve.point(r * Math.sin(a), r * -Math.cos(a));
  }
};

function curveRadial(curve) {
  function radial(context) {
    return new Radial(curve(context));
  }

  radial._curve = curve;
  return radial;
}
},{"./linear":"0QOZ"}],"/F/P":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.radialLine = radialLine;
exports.default = _default;

var _radial = _interopRequireWildcard(require("./curve/radial"));

var _line = _interopRequireDefault(require("./line"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function radialLine(l) {
  var c = l.curve;
  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;

  l.curve = function (_) {
    return arguments.length ? c((0, _radial.default)(_)) : c()._curve;
  };

  return l;
}

function _default() {
  return radialLine((0, _line.default)().curve(_radial.curveRadialLinear));
}
},{"./curve/radial":"cgqr","./line":"dd/x"}],"FL3P":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _radial = _interopRequireWildcard(require("./curve/radial"));

var _area = _interopRequireDefault(require("./area"));

var _radialLine = require("./radialLine");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _default() {
  var a = (0, _area.default)().curve(_radial.curveRadialLinear),
      c = a.curve,
      x0 = a.lineX0,
      x1 = a.lineX1,
      y0 = a.lineY0,
      y1 = a.lineY1;
  a.angle = a.x, delete a.x;
  a.startAngle = a.x0, delete a.x0;
  a.endAngle = a.x1, delete a.x1;
  a.radius = a.y, delete a.y;
  a.innerRadius = a.y0, delete a.y0;
  a.outerRadius = a.y1, delete a.y1;
  a.lineStartAngle = function () {
    return (0, _radialLine.radialLine)(x0());
  }, delete a.lineX0;
  a.lineEndAngle = function () {
    return (0, _radialLine.radialLine)(x1());
  }, delete a.lineX1;
  a.lineInnerRadius = function () {
    return (0, _radialLine.radialLine)(y0());
  }, delete a.lineY0;
  a.lineOuterRadius = function () {
    return (0, _radialLine.radialLine)(y1());
  }, delete a.lineY1;

  a.curve = function (_) {
    return arguments.length ? c((0, _radial.default)(_)) : c()._curve;
  };

  return a;
}
},{"./curve/radial":"cgqr","./area":"hF4o","./radialLine":"/F/P"}],"M8zP":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _math = require("../math");

var _default = {
  draw: function (context, size) {
    var r = Math.sqrt(size / _math.pi);
    context.moveTo(r, 0);
    context.arc(0, 0, r, 0, _math.tau);
  }
};
exports.default = _default;
},{"../math":"afGh"}],"53yk":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  draw: function (context, size) {
    var r = Math.sqrt(size / 5) / 2;
    context.moveTo(-3 * r, -r);
    context.lineTo(-r, -r);
    context.lineTo(-r, -3 * r);
    context.lineTo(r, -3 * r);
    context.lineTo(r, -r);
    context.lineTo(3 * r, -r);
    context.lineTo(3 * r, r);
    context.lineTo(r, r);
    context.lineTo(r, 3 * r);
    context.lineTo(-r, 3 * r);
    context.lineTo(-r, r);
    context.lineTo(-3 * r, r);
    context.closePath();
  }
};
exports.default = _default;
},{}],"dxe+":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var tan30 = Math.sqrt(1 / 3),
    tan30_2 = tan30 * 2;
var _default = {
  draw: function (context, size) {
    var y = Math.sqrt(size / tan30_2),
        x = y * tan30;
    context.moveTo(0, -y);
    context.lineTo(x, 0);
    context.lineTo(0, y);
    context.lineTo(-x, 0);
    context.closePath();
  }
};
exports.default = _default;
},{}],"5R/9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _math = require("../math");

var ka = 0.89081309152928522810,
    kr = Math.sin(_math.pi / 10) / Math.sin(7 * _math.pi / 10),
    kx = Math.sin(_math.tau / 10) * kr,
    ky = -Math.cos(_math.tau / 10) * kr;
var _default = {
  draw: function (context, size) {
    var r = Math.sqrt(size * ka),
        x = kx * r,
        y = ky * r;
    context.moveTo(0, -r);
    context.lineTo(x, y);

    for (var i = 1; i < 5; ++i) {
      var a = _math.tau * i / 5,
          c = Math.cos(a),
          s = Math.sin(a);
      context.lineTo(s * r, -c * r);
      context.lineTo(c * x - s * y, s * x + c * y);
    }

    context.closePath();
  }
};
exports.default = _default;
},{"../math":"afGh"}],"zJh7":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  draw: function (context, size) {
    var w = Math.sqrt(size),
        x = -w / 2;
    context.rect(x, x, w, w);
  }
};
exports.default = _default;
},{}],"FFoX":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var sqrt3 = Math.sqrt(3);
var _default = {
  draw: function (context, size) {
    var y = -Math.sqrt(size / (sqrt3 * 3));
    context.moveTo(0, y * 2);
    context.lineTo(-sqrt3 * y, -y);
    context.lineTo(sqrt3 * y, -y);
    context.closePath();
  }
};
exports.default = _default;
},{}],"pUX9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var c = -0.5,
    s = Math.sqrt(3) / 2,
    k = 1 / Math.sqrt(12),
    a = (k / 2 + 1) * 3;
var _default = {
  draw: function (context, size) {
    var r = Math.sqrt(size / a),
        x0 = r / 2,
        y0 = r * k,
        x1 = x0,
        y1 = r * k + r,
        x2 = -x1,
        y2 = y1;
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(c * x0 - s * y0, s * x0 + c * y0);
    context.lineTo(c * x1 - s * y1, s * x1 + c * y1);
    context.lineTo(c * x2 - s * y2, s * x2 + c * y2);
    context.lineTo(c * x0 + s * y0, c * y0 - s * x0);
    context.lineTo(c * x1 + s * y1, c * y1 - s * x1);
    context.lineTo(c * x2 + s * y2, c * y2 - s * x2);
    context.closePath();
  }
};
exports.default = _default;
},{}],"0JDb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.symbols = void 0;

var _d3Path = require("d3-path");

var _circle = _interopRequireDefault(require("./symbol/circle"));

var _cross = _interopRequireDefault(require("./symbol/cross"));

var _diamond = _interopRequireDefault(require("./symbol/diamond"));

var _star = _interopRequireDefault(require("./symbol/star"));

var _square = _interopRequireDefault(require("./symbol/square"));

var _triangle = _interopRequireDefault(require("./symbol/triangle"));

var _wye = _interopRequireDefault(require("./symbol/wye"));

var _constant = _interopRequireDefault(require("./constant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var symbols = [_circle.default, _cross.default, _diamond.default, _square.default, _star.default, _triangle.default, _wye.default];
exports.symbols = symbols;

function _default() {
  var type = (0, _constant.default)(_circle.default),
      size = (0, _constant.default)(64),
      context = null;

  function symbol() {
    var buffer;
    if (!context) context = buffer = (0, _d3Path.path)();
    type.apply(this, arguments).draw(context, +size.apply(this, arguments));
    if (buffer) return context = null, buffer + "" || null;
  }

  symbol.type = function (_) {
    return arguments.length ? (type = typeof _ === "function" ? _ : (0, _constant.default)(_), symbol) : type;
  };

  symbol.size = function (_) {
    return arguments.length ? (size = typeof _ === "function" ? _ : (0, _constant.default)(+_), symbol) : size;
  };

  symbol.context = function (_) {
    return arguments.length ? (context = _ == null ? null : _, symbol) : context;
  };

  return symbol;
}
},{"d3-path":"2zaW","./symbol/circle":"M8zP","./symbol/cross":"53yk","./symbol/diamond":"dxe+","./symbol/star":"5R/9","./symbol/square":"zJh7","./symbol/triangle":"FFoX","./symbol/wye":"pUX9","./constant":"k9An"}],"67xg":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {}
},{}],"QeRe":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.point = point;
exports.Basis = Basis;
exports.default = _default;

function point(that, x, y) {
  that._context.bezierCurveTo((2 * that._x0 + that._x1) / 3, (2 * that._y0 + that._y1) / 3, (that._x0 + 2 * that._x1) / 3, (that._y0 + 2 * that._y1) / 3, (that._x0 + 4 * that._x1 + x) / 6, (that._y0 + 4 * that._y1 + y) / 6);
}

function Basis(context) {
  this._context = context;
}

Basis.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 3:
        point(this, this._x1, this._y1);
      // proceed

      case 2:
        this._context.lineTo(this._x1, this._y1);

        break;
    }

    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;

      case 1:
        this._point = 2;
        break;

      case 2:
        this._point = 3;

        this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);

      // proceed

      default:
        point(this, x, y);
        break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

function _default(context) {
  return new Basis(context);
}
},{}],"x/xO":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _noop = _interopRequireDefault(require("../noop"));

var _basis = require("./basis");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BasisClosed(context) {
  this._context = context;
}

BasisClosed.prototype = {
  areaStart: _noop.default,
  areaEnd: _noop.default,
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 1:
        {
          this._context.moveTo(this._x2, this._y2);

          this._context.closePath();

          break;
        }

      case 2:
        {
          this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);

          this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);

          this._context.closePath();

          break;
        }

      case 3:
        {
          this.point(this._x2, this._y2);
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          break;
        }
    }
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        this._x2 = x, this._y2 = y;
        break;

      case 1:
        this._point = 2;
        this._x3 = x, this._y3 = y;
        break;

      case 2:
        this._point = 3;
        this._x4 = x, this._y4 = y;

        this._context.moveTo((this._x0 + 4 * this._x1 + x) / 6, (this._y0 + 4 * this._y1 + y) / 6);

        break;

      default:
        (0, _basis.point)(this, x, y);
        break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

function _default(context) {
  return new BasisClosed(context);
}
},{"../noop":"67xg","./basis":"QeRe"}],"si+4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _basis = require("./basis");

function BasisOpen(context) {
  this._context = context;
}

BasisOpen.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        break;

      case 1:
        this._point = 2;
        break;

      case 2:
        this._point = 3;
        var x0 = (this._x0 + 4 * this._x1 + x) / 6,
            y0 = (this._y0 + 4 * this._y1 + y) / 6;
        this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0);
        break;

      case 3:
        this._point = 4;
      // proceed

      default:
        (0, _basis.point)(this, x, y);
        break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

function _default(context) {
  return new BasisOpen(context);
}
},{"./basis":"QeRe"}],"5sNV":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _basis = require("./basis");

function Bundle(context, beta) {
  this._basis = new _basis.Basis(context);
  this._beta = beta;
}

Bundle.prototype = {
  lineStart: function () {
    this._x = [];
    this._y = [];

    this._basis.lineStart();
  },
  lineEnd: function () {
    var x = this._x,
        y = this._y,
        j = x.length - 1;

    if (j > 0) {
      var x0 = x[0],
          y0 = y[0],
          dx = x[j] - x0,
          dy = y[j] - y0,
          i = -1,
          t;

      while (++i <= j) {
        t = i / j;

        this._basis.point(this._beta * x[i] + (1 - this._beta) * (x0 + t * dx), this._beta * y[i] + (1 - this._beta) * (y0 + t * dy));
      }
    }

    this._x = this._y = null;

    this._basis.lineEnd();
  },
  point: function (x, y) {
    this._x.push(+x);

    this._y.push(+y);
  }
};

var _default = function custom(beta) {
  function bundle(context) {
    return beta === 1 ? new _basis.Basis(context) : new Bundle(context, beta);
  }

  bundle.beta = function (beta) {
    return custom(+beta);
  };

  return bundle;
}(0.85);

exports.default = _default;
},{"./basis":"QeRe"}],"Xn7T":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.point = point;
exports.Cardinal = Cardinal;
exports.default = void 0;

function point(that, x, y) {
  that._context.bezierCurveTo(that._x1 + that._k * (that._x2 - that._x0), that._y1 + that._k * (that._y2 - that._y0), that._x2 + that._k * (that._x1 - x), that._y2 + that._k * (that._y1 - y), that._x2, that._y2);
}

function Cardinal(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

Cardinal.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);

        break;

      case 3:
        point(this, this._x1, this._y1);
        break;
    }

    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;

      case 1:
        this._point = 2;
        this._x1 = x, this._y1 = y;
        break;

      case 2:
        this._point = 3;
      // proceed

      default:
        point(this, x, y);
        break;
    }

    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var _default = function custom(tension) {
  function cardinal(context) {
    return new Cardinal(context, tension);
  }

  cardinal.tension = function (tension) {
    return custom(+tension);
  };

  return cardinal;
}(0);

exports.default = _default;
},{}],"Vmco":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CardinalClosed = CardinalClosed;
exports.default = void 0;

var _noop = _interopRequireDefault(require("../noop"));

var _cardinal = require("./cardinal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CardinalClosed(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

CardinalClosed.prototype = {
  areaStart: _noop.default,
  areaEnd: _noop.default,
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 1:
        {
          this._context.moveTo(this._x3, this._y3);

          this._context.closePath();

          break;
        }

      case 2:
        {
          this._context.lineTo(this._x3, this._y3);

          this._context.closePath();

          break;
        }

      case 3:
        {
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          this.point(this._x5, this._y5);
          break;
        }
    }
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        this._x3 = x, this._y3 = y;
        break;

      case 1:
        this._point = 2;

        this._context.moveTo(this._x4 = x, this._y4 = y);

        break;

      case 2:
        this._point = 3;
        this._x5 = x, this._y5 = y;
        break;

      default:
        (0, _cardinal.point)(this, x, y);
        break;
    }

    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var _default = function custom(tension) {
  function cardinal(context) {
    return new CardinalClosed(context, tension);
  }

  cardinal.tension = function (tension) {
    return custom(+tension);
  };

  return cardinal;
}(0);

exports.default = _default;
},{"../noop":"67xg","./cardinal":"Xn7T"}],"qhAo":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CardinalOpen = CardinalOpen;
exports.default = void 0;

var _cardinal = require("./cardinal");

function CardinalOpen(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

CardinalOpen.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        break;

      case 1:
        this._point = 2;
        break;

      case 2:
        this._point = 3;
        this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;

      case 3:
        this._point = 4;
      // proceed

      default:
        (0, _cardinal.point)(this, x, y);
        break;
    }

    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var _default = function custom(tension) {
  function cardinal(context) {
    return new CardinalOpen(context, tension);
  }

  cardinal.tension = function (tension) {
    return custom(+tension);
  };

  return cardinal;
}(0);

exports.default = _default;
},{"./cardinal":"Xn7T"}],"+Wuo":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.point = point;
exports.default = void 0;

var _math = require("../math");

var _cardinal = require("./cardinal");

function point(that, x, y) {
  var x1 = that._x1,
      y1 = that._y1,
      x2 = that._x2,
      y2 = that._y2;

  if (that._l01_a > _math.epsilon) {
    var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
        n = 3 * that._l01_a * (that._l01_a + that._l12_a);
    x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
    y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
  }

  if (that._l23_a > _math.epsilon) {
    var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
        m = 3 * that._l23_a * (that._l23_a + that._l12_a);
    x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
    y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
  }

  that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
}

function CatmullRom(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRom.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);

        break;

      case 3:
        this.point(this._x2, this._y2);
        break;
    }

    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;

      case 1:
        this._point = 2;
        break;

      case 2:
        this._point = 3;
      // proceed

      default:
        point(this, x, y);
        break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var _default = function custom(alpha) {
  function catmullRom(context) {
    return alpha ? new CatmullRom(context, alpha) : new _cardinal.Cardinal(context, 0);
  }

  catmullRom.alpha = function (alpha) {
    return custom(+alpha);
  };

  return catmullRom;
}(0.5);

exports.default = _default;
},{"../math":"afGh","./cardinal":"Xn7T"}],"VAcR":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cardinalClosed = require("./cardinalClosed");

var _noop = _interopRequireDefault(require("../noop"));

var _catmullRom = require("./catmullRom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CatmullRomClosed(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRomClosed.prototype = {
  areaStart: _noop.default,
  areaEnd: _noop.default,
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 1:
        {
          this._context.moveTo(this._x3, this._y3);

          this._context.closePath();

          break;
        }

      case 2:
        {
          this._context.lineTo(this._x3, this._y3);

          this._context.closePath();

          break;
        }

      case 3:
        {
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          this.point(this._x5, this._y5);
          break;
        }
    }
  },
  point: function (x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0:
        this._point = 1;
        this._x3 = x, this._y3 = y;
        break;

      case 1:
        this._point = 2;

        this._context.moveTo(this._x4 = x, this._y4 = y);

        break;

      case 2:
        this._point = 3;
        this._x5 = x, this._y5 = y;
        break;

      default:
        (0, _catmullRom.point)(this, x, y);
        break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var _default = function custom(alpha) {
  function catmullRom(context) {
    return alpha ? new CatmullRomClosed(context, alpha) : new _cardinalClosed.CardinalClosed(context, 0);
  }

  catmullRom.alpha = function (alpha) {
    return custom(+alpha);
  };

  return catmullRom;
}(0.5);

exports.default = _default;
},{"./cardinalClosed":"Vmco","../noop":"67xg","./catmullRom":"+Wuo"}],"ohVI":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cardinalOpen = require("./cardinalOpen");

var _catmullRom = require("./catmullRom");

function CatmullRomOpen(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRomOpen.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function () {
    if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0:
        this._point = 1;
        break;

      case 1:
        this._point = 2;
        break;

      case 2:
        this._point = 3;
        this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;

      case 3:
        this._point = 4;
      // proceed

      default:
        (0, _catmullRom.point)(this, x, y);
        break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var _default = function custom(alpha) {
  function catmullRom(context) {
    return alpha ? new CatmullRomOpen(context, alpha) : new _cardinalOpen.CardinalOpen(context, 0);
  }

  catmullRom.alpha = function (alpha) {
    return custom(+alpha);
  };

  return catmullRom;
}(0.5);

exports.default = _default;
},{"./cardinalOpen":"qhAo","./catmullRom":"+Wuo"}],"+4FT":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _noop = _interopRequireDefault(require("../noop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LinearClosed(context) {
  this._context = context;
}

LinearClosed.prototype = {
  areaStart: _noop.default,
  areaEnd: _noop.default,
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    if (this._point) this._context.closePath();
  },
  point: function (x, y) {
    x = +x, y = +y;
    if (this._point) this._context.lineTo(x, y);else this._point = 1, this._context.moveTo(x, y);
  }
};

function _default(context) {
  return new LinearClosed(context);
}
},{"../noop":"67xg"}],"ipSN":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.monotoneX = monotoneX;
exports.monotoneY = monotoneY;

function sign(x) {
  return x < 0 ? -1 : 1;
} // Calculate the slopes of the tangents (Hermite-type interpolation) based on
// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
// NOV(II), P. 443, 1990.


function slope3(that, x2, y2) {
  var h0 = that._x1 - that._x0,
      h1 = x2 - that._x1,
      s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
      s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
      p = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
} // Calculate a one-sided slope.


function slope2(that, t) {
  var h = that._x1 - that._x0;
  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
} // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".


function point(that, t0, t1) {
  var x0 = that._x0,
      y0 = that._y0,
      x1 = that._x1,
      y1 = that._y1,
      dx = (x1 - x0) / 3;

  that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
}

function MonotoneX(context) {
  this._context = context;
}

MonotoneX.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);

        break;

      case 3:
        point(this, this._t0, slope2(this, this._t0));
        break;
    }

    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    var t1 = NaN;
    x = +x, y = +y;
    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.

    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;

      case 1:
        this._point = 2;
        break;

      case 2:
        this._point = 3;
        point(this, slope2(this, t1 = slope3(this, x, y)), t1);
        break;

      default:
        point(this, this._t0, t1 = slope3(this, x, y));
        break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
    this._t0 = t1;
  }
};

function MonotoneY(context) {
  this._context = new ReflectContext(context);
}

(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function (x, y) {
  MonotoneX.prototype.point.call(this, y, x);
};

function ReflectContext(context) {
  this._context = context;
}

ReflectContext.prototype = {
  moveTo: function (x, y) {
    this._context.moveTo(y, x);
  },
  closePath: function () {
    this._context.closePath();
  },
  lineTo: function (x, y) {
    this._context.lineTo(y, x);
  },
  bezierCurveTo: function (x1, y1, x2, y2, x, y) {
    this._context.bezierCurveTo(y1, x1, y2, x2, y, x);
  }
};

function monotoneX(context) {
  return new MonotoneX(context);
}

function monotoneY(context) {
  return new MonotoneY(context);
}
},{}],"u0Uc":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function Natural(context) {
  this._context = context;
}

Natural.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x = [];
    this._y = [];
  },
  lineEnd: function () {
    var x = this._x,
        y = this._y,
        n = x.length;

    if (n) {
      this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]);

      if (n === 2) {
        this._context.lineTo(x[1], y[1]);
      } else {
        var px = controlPoints(x),
            py = controlPoints(y);

        for (var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1) {
          this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
        }
      }
    }

    if (this._line || this._line !== 0 && n === 1) this._context.closePath();
    this._line = 1 - this._line;
    this._x = this._y = null;
  },
  point: function (x, y) {
    this._x.push(+x);

    this._y.push(+y);
  }
}; // See https://www.particleincell.com/2012/bezier-splines/ for derivation.

function controlPoints(x) {
  var i,
      n = x.length - 1,
      m,
      a = new Array(n),
      b = new Array(n),
      r = new Array(n);
  a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];

  for (i = 1; i < n - 1; ++i) a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];

  a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];

  for (i = 1; i < n; ++i) m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];

  a[n - 1] = r[n - 1] / b[n - 1];

  for (i = n - 2; i >= 0; --i) a[i] = (r[i] - a[i + 1]) / b[i];

  b[n - 1] = (x[n] + a[n - 1]) / 2;

  for (i = 0; i < n - 1; ++i) b[i] = 2 * x[i + 1] - a[i + 1];

  return [a, b];
}

function _default(context) {
  return new Natural(context);
}
},{}],"4tDZ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.stepBefore = stepBefore;
exports.stepAfter = stepAfter;

function Step(context, t) {
  this._context = context;
  this._t = t;
}

Step.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x = this._y = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;

      case 1:
        this._point = 2;
      // proceed

      default:
        {
          if (this._t <= 0) {
            this._context.lineTo(this._x, y);

            this._context.lineTo(x, y);
          } else {
            var x1 = this._x * (1 - this._t) + x * this._t;

            this._context.lineTo(x1, this._y);

            this._context.lineTo(x1, y);
          }

          break;
        }
    }

    this._x = x, this._y = y;
  }
};

function _default(context) {
  return new Step(context, 0.5);
}

function stepBefore(context) {
  return new Step(context, 0);
}

function stepAfter(context) {
  return new Step(context, 1);
}
},{}],"aOxl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.slice = void 0;
var slice = Array.prototype.slice;
exports.slice = slice;
},{}],"tuer":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(series, order) {
  if (!((n = series.length) > 1)) return;

  for (var i = 1, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
    s0 = s1, s1 = series[order[i]];

    for (var j = 0; j < m; ++j) {
      s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
    }
  }
}
},{}],"h5Jt":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(series) {
  var n = series.length,
      o = new Array(n);

  while (--n >= 0) o[n] = n;

  return o;
}
},{}],"4RN2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _array = require("./array");

var _constant = _interopRequireDefault(require("./constant"));

var _none = _interopRequireDefault(require("./offset/none"));

var _none2 = _interopRequireDefault(require("./order/none"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stackValue(d, key) {
  return d[key];
}

function _default() {
  var keys = (0, _constant.default)([]),
      order = _none2.default,
      offset = _none.default,
      value = stackValue;

  function stack(data) {
    var kz = keys.apply(this, arguments),
        i,
        m = data.length,
        n = kz.length,
        sz = new Array(n),
        oz;

    for (i = 0; i < n; ++i) {
      for (var ki = kz[i], si = sz[i] = new Array(m), j = 0, sij; j < m; ++j) {
        si[j] = sij = [0, +value(data[j], ki, j, data)];
        sij.data = data[j];
      }

      si.key = ki;
    }

    for (i = 0, oz = order(sz); i < n; ++i) {
      sz[oz[i]].index = i;
    }

    offset(sz, oz);
    return sz;
  }

  stack.keys = function (_) {
    return arguments.length ? (keys = typeof _ === "function" ? _ : (0, _constant.default)(_array.slice.call(_)), stack) : keys;
  };

  stack.value = function (_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : (0, _constant.default)(+_), stack) : value;
  };

  stack.order = function (_) {
    return arguments.length ? (order = _ == null ? _none2.default : typeof _ === "function" ? _ : (0, _constant.default)(_array.slice.call(_)), stack) : order;
  };

  stack.offset = function (_) {
    return arguments.length ? (offset = _ == null ? _none.default : _, stack) : offset;
  };

  return stack;
}
},{"./array":"aOxl","./constant":"k9An","./offset/none":"tuer","./order/none":"h5Jt"}],"tbmP":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _none = _interopRequireDefault(require("./none"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series, order) {
  if (!((n = series.length) > 0)) return;

  for (var i, n, j = 0, m = series[0].length, y; j < m; ++j) {
    for (y = i = 0; i < n; ++i) y += series[i][j][1] || 0;

    if (y) for (i = 0; i < n; ++i) series[i][j][1] /= y;
  }

  (0, _none.default)(series, order);
}
},{"./none":"tuer"}],"kvrQ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _none = _interopRequireDefault(require("./none"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series, order) {
  if (!((n = series.length) > 0)) return;

  for (var j = 0, s0 = series[order[0]], n, m = s0.length; j < m; ++j) {
    for (var i = 0, y = 0; i < n; ++i) y += series[i][j][1] || 0;

    s0[j][1] += s0[j][0] = -y / 2;
  }

  (0, _none.default)(series, order);
}
},{"./none":"tuer"}],"8hNk":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _none = _interopRequireDefault(require("./none"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series, order) {
  if (!((n = series.length) > 0) || !((m = (s0 = series[order[0]]).length) > 0)) return;

  for (var y = 0, j = 1, s0, m, n; j < m; ++j) {
    for (var i = 0, s1 = 0, s2 = 0; i < n; ++i) {
      var si = series[order[i]],
          sij0 = si[j][1] || 0,
          sij1 = si[j - 1][1] || 0,
          s3 = (sij0 - sij1) / 2;

      for (var k = 0; k < i; ++k) {
        var sk = series[order[k]],
            skj0 = sk[j][1] || 0,
            skj1 = sk[j - 1][1] || 0;
        s3 += skj0 - skj1;
      }

      s1 += sij0, s2 += s3 * sij0;
    }

    s0[j - 1][1] += s0[j - 1][0] = y;
    if (s1) y -= s2 / s1;
  }

  s0[j - 1][1] += s0[j - 1][0] = y;
  (0, _none.default)(series, order);
}
},{"./none":"tuer"}],"doTn":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.sum = sum;

var _none = _interopRequireDefault(require("./none"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series) {
  var sums = series.map(sum);
  return (0, _none.default)(series).sort(function (a, b) {
    return sums[a] - sums[b];
  });
}

function sum(series) {
  var s = 0,
      i = -1,
      n = series.length,
      v;

  while (++i < n) if (v = +series[i][1]) s += v;

  return s;
}
},{"./none":"h5Jt"}],"DVmH":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _ascending = _interopRequireDefault(require("./ascending"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series) {
  return (0, _ascending.default)(series).reverse();
}
},{"./ascending":"doTn"}],"NO12":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _none = _interopRequireDefault(require("./none"));

var _ascending = require("./ascending");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series) {
  var n = series.length,
      i,
      j,
      sums = series.map(_ascending.sum),
      order = (0, _none.default)(series).sort(function (a, b) {
    return sums[b] - sums[a];
  }),
      top = 0,
      bottom = 0,
      tops = [],
      bottoms = [];

  for (i = 0; i < n; ++i) {
    j = order[i];

    if (top < bottom) {
      top += sums[j];
      tops.push(j);
    } else {
      bottom += sums[j];
      bottoms.push(j);
    }
  }

  return bottoms.reverse().concat(tops);
}
},{"./none":"h5Jt","./ascending":"doTn"}],"Eewl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _none = _interopRequireDefault(require("./none"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series) {
  return (0, _none.default)(series).reverse();
}
},{"./none":"h5Jt"}],"UQVl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "arc", {
  enumerable: true,
  get: function () {
    return _arc.default;
  }
});
Object.defineProperty(exports, "area", {
  enumerable: true,
  get: function () {
    return _area.default;
  }
});
Object.defineProperty(exports, "line", {
  enumerable: true,
  get: function () {
    return _line.default;
  }
});
Object.defineProperty(exports, "pie", {
  enumerable: true,
  get: function () {
    return _pie.default;
  }
});
Object.defineProperty(exports, "radialArea", {
  enumerable: true,
  get: function () {
    return _radialArea.default;
  }
});
Object.defineProperty(exports, "radialLine", {
  enumerable: true,
  get: function () {
    return _radialLine.default;
  }
});
Object.defineProperty(exports, "symbol", {
  enumerable: true,
  get: function () {
    return _symbol.default;
  }
});
Object.defineProperty(exports, "symbols", {
  enumerable: true,
  get: function () {
    return _symbol.symbols;
  }
});
Object.defineProperty(exports, "symbolCircle", {
  enumerable: true,
  get: function () {
    return _circle.default;
  }
});
Object.defineProperty(exports, "symbolCross", {
  enumerable: true,
  get: function () {
    return _cross.default;
  }
});
Object.defineProperty(exports, "symbolDiamond", {
  enumerable: true,
  get: function () {
    return _diamond.default;
  }
});
Object.defineProperty(exports, "symbolSquare", {
  enumerable: true,
  get: function () {
    return _square.default;
  }
});
Object.defineProperty(exports, "symbolStar", {
  enumerable: true,
  get: function () {
    return _star.default;
  }
});
Object.defineProperty(exports, "symbolTriangle", {
  enumerable: true,
  get: function () {
    return _triangle.default;
  }
});
Object.defineProperty(exports, "symbolWye", {
  enumerable: true,
  get: function () {
    return _wye.default;
  }
});
Object.defineProperty(exports, "curveBasisClosed", {
  enumerable: true,
  get: function () {
    return _basisClosed.default;
  }
});
Object.defineProperty(exports, "curveBasisOpen", {
  enumerable: true,
  get: function () {
    return _basisOpen.default;
  }
});
Object.defineProperty(exports, "curveBasis", {
  enumerable: true,
  get: function () {
    return _basis.default;
  }
});
Object.defineProperty(exports, "curveBundle", {
  enumerable: true,
  get: function () {
    return _bundle.default;
  }
});
Object.defineProperty(exports, "curveCardinalClosed", {
  enumerable: true,
  get: function () {
    return _cardinalClosed.default;
  }
});
Object.defineProperty(exports, "curveCardinalOpen", {
  enumerable: true,
  get: function () {
    return _cardinalOpen.default;
  }
});
Object.defineProperty(exports, "curveCardinal", {
  enumerable: true,
  get: function () {
    return _cardinal.default;
  }
});
Object.defineProperty(exports, "curveCatmullRomClosed", {
  enumerable: true,
  get: function () {
    return _catmullRomClosed.default;
  }
});
Object.defineProperty(exports, "curveCatmullRomOpen", {
  enumerable: true,
  get: function () {
    return _catmullRomOpen.default;
  }
});
Object.defineProperty(exports, "curveCatmullRom", {
  enumerable: true,
  get: function () {
    return _catmullRom.default;
  }
});
Object.defineProperty(exports, "curveLinearClosed", {
  enumerable: true,
  get: function () {
    return _linearClosed.default;
  }
});
Object.defineProperty(exports, "curveLinear", {
  enumerable: true,
  get: function () {
    return _linear.default;
  }
});
Object.defineProperty(exports, "curveMonotoneX", {
  enumerable: true,
  get: function () {
    return _monotone.monotoneX;
  }
});
Object.defineProperty(exports, "curveMonotoneY", {
  enumerable: true,
  get: function () {
    return _monotone.monotoneY;
  }
});
Object.defineProperty(exports, "curveNatural", {
  enumerable: true,
  get: function () {
    return _natural.default;
  }
});
Object.defineProperty(exports, "curveStep", {
  enumerable: true,
  get: function () {
    return _step.default;
  }
});
Object.defineProperty(exports, "curveStepAfter", {
  enumerable: true,
  get: function () {
    return _step.stepAfter;
  }
});
Object.defineProperty(exports, "curveStepBefore", {
  enumerable: true,
  get: function () {
    return _step.stepBefore;
  }
});
Object.defineProperty(exports, "stack", {
  enumerable: true,
  get: function () {
    return _stack.default;
  }
});
Object.defineProperty(exports, "stackOffsetExpand", {
  enumerable: true,
  get: function () {
    return _expand.default;
  }
});
Object.defineProperty(exports, "stackOffsetNone", {
  enumerable: true,
  get: function () {
    return _none.default;
  }
});
Object.defineProperty(exports, "stackOffsetSilhouette", {
  enumerable: true,
  get: function () {
    return _silhouette.default;
  }
});
Object.defineProperty(exports, "stackOffsetWiggle", {
  enumerable: true,
  get: function () {
    return _wiggle.default;
  }
});
Object.defineProperty(exports, "stackOrderAscending", {
  enumerable: true,
  get: function () {
    return _ascending.default;
  }
});
Object.defineProperty(exports, "stackOrderDescending", {
  enumerable: true,
  get: function () {
    return _descending.default;
  }
});
Object.defineProperty(exports, "stackOrderInsideOut", {
  enumerable: true,
  get: function () {
    return _insideOut.default;
  }
});
Object.defineProperty(exports, "stackOrderNone", {
  enumerable: true,
  get: function () {
    return _none2.default;
  }
});
Object.defineProperty(exports, "stackOrderReverse", {
  enumerable: true,
  get: function () {
    return _reverse.default;
  }
});

var _arc = _interopRequireDefault(require("./src/arc"));

var _area = _interopRequireDefault(require("./src/area"));

var _line = _interopRequireDefault(require("./src/line"));

var _pie = _interopRequireDefault(require("./src/pie"));

var _radialArea = _interopRequireDefault(require("./src/radialArea"));

var _radialLine = _interopRequireDefault(require("./src/radialLine"));

var _symbol = _interopRequireWildcard(require("./src/symbol"));

var _circle = _interopRequireDefault(require("./src/symbol/circle"));

var _cross = _interopRequireDefault(require("./src/symbol/cross"));

var _diamond = _interopRequireDefault(require("./src/symbol/diamond"));

var _square = _interopRequireDefault(require("./src/symbol/square"));

var _star = _interopRequireDefault(require("./src/symbol/star"));

var _triangle = _interopRequireDefault(require("./src/symbol/triangle"));

var _wye = _interopRequireDefault(require("./src/symbol/wye"));

var _basisClosed = _interopRequireDefault(require("./src/curve/basisClosed"));

var _basisOpen = _interopRequireDefault(require("./src/curve/basisOpen"));

var _basis = _interopRequireDefault(require("./src/curve/basis"));

var _bundle = _interopRequireDefault(require("./src/curve/bundle"));

var _cardinalClosed = _interopRequireDefault(require("./src/curve/cardinalClosed"));

var _cardinalOpen = _interopRequireDefault(require("./src/curve/cardinalOpen"));

var _cardinal = _interopRequireDefault(require("./src/curve/cardinal"));

var _catmullRomClosed = _interopRequireDefault(require("./src/curve/catmullRomClosed"));

var _catmullRomOpen = _interopRequireDefault(require("./src/curve/catmullRomOpen"));

var _catmullRom = _interopRequireDefault(require("./src/curve/catmullRom"));

var _linearClosed = _interopRequireDefault(require("./src/curve/linearClosed"));

var _linear = _interopRequireDefault(require("./src/curve/linear"));

var _monotone = require("./src/curve/monotone");

var _natural = _interopRequireDefault(require("./src/curve/natural"));

var _step = _interopRequireWildcard(require("./src/curve/step"));

var _stack = _interopRequireDefault(require("./src/stack"));

var _expand = _interopRequireDefault(require("./src/offset/expand"));

var _none = _interopRequireDefault(require("./src/offset/none"));

var _silhouette = _interopRequireDefault(require("./src/offset/silhouette"));

var _wiggle = _interopRequireDefault(require("./src/offset/wiggle"));

var _ascending = _interopRequireDefault(require("./src/order/ascending"));

var _descending = _interopRequireDefault(require("./src/order/descending"));

var _insideOut = _interopRequireDefault(require("./src/order/insideOut"));

var _none2 = _interopRequireDefault(require("./src/order/none"));

var _reverse = _interopRequireDefault(require("./src/order/reverse"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./src/arc":"KUIA","./src/area":"hF4o","./src/line":"dd/x","./src/pie":"59wa","./src/radialArea":"FL3P","./src/radialLine":"/F/P","./src/symbol":"0JDb","./src/symbol/circle":"M8zP","./src/symbol/cross":"53yk","./src/symbol/diamond":"dxe+","./src/symbol/square":"zJh7","./src/symbol/star":"5R/9","./src/symbol/triangle":"FFoX","./src/symbol/wye":"pUX9","./src/curve/basisClosed":"x/xO","./src/curve/basisOpen":"si+4","./src/curve/basis":"QeRe","./src/curve/bundle":"5sNV","./src/curve/cardinalClosed":"Vmco","./src/curve/cardinalOpen":"qhAo","./src/curve/cardinal":"Xn7T","./src/curve/catmullRomClosed":"VAcR","./src/curve/catmullRomOpen":"ohVI","./src/curve/catmullRom":"+Wuo","./src/curve/linearClosed":"+4FT","./src/curve/linear":"0QOZ","./src/curve/monotone":"ipSN","./src/curve/natural":"u0Uc","./src/curve/step":"4tDZ","./src/stack":"4RN2","./src/offset/expand":"tbmP","./src/offset/none":"tuer","./src/offset/silhouette":"kvrQ","./src/offset/wiggle":"8hNk","./src/order/ascending":"doTn","./src/order/descending":"DVmH","./src/order/insideOut":"NO12","./src/order/none":"h5Jt","./src/order/reverse":"Eewl"}],"7UiF":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "dispatch", {
  enumerable: true,
  get: function () {
    return _dispatch.default;
  }
});

var _dispatch = _interopRequireDefault(require("./src/dispatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./src/dispatch":"SYAW"}],"../../node_modules/d3-svg-annotation/indexRollupNext.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.annotation = annotation;
exports.default = exports.annotationCustomType = exports.annotationBadge = exports.annotationXYThreshold = exports.annotationCalloutRect = exports.annotationCalloutCircle = exports.annotationCalloutElbow = exports.annotationCalloutCurve = exports.annotationCallout = exports.annotationLabel = exports.annotationTypeBase = void 0;

var _d3Selection = require("d3-selection");

var _d3Drag = require("d3-drag");

var _d3Shape = require("d3-shape");

var _d3Dispatch = require("d3-dispatch");

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Annotation = function () {
  function Annotation(_ref) {
    var _ref$x = _ref.x,
        x = _ref$x === undefined ? 0 : _ref$x,
        _ref$y = _ref.y,
        y = _ref$y === undefined ? 0 : _ref$y,
        nx = _ref.nx,
        ny = _ref.ny,
        _ref$dy = _ref.dy,
        dy = _ref$dy === undefined ? 0 : _ref$dy,
        _ref$dx = _ref.dx,
        dx = _ref$dx === undefined ? 0 : _ref$dx,
        _ref$color = _ref.color,
        color = _ref$color === undefined ? "grey" : _ref$color,
        data = _ref.data,
        type = _ref.type,
        subject = _ref.subject,
        connector = _ref.connector,
        note = _ref.note,
        disable = _ref.disable,
        id = _ref.id,
        className = _ref.className;
    classCallCheck(this, Annotation);
    this._dx = nx !== undefined ? nx - x : dx;
    this._dy = ny !== undefined ? ny - y : dy;
    this._x = x;
    this._y = y;
    this._color = color;
    this.id = id;
    this._className = className || "";
    this._type = type || "";
    this.data = data;
    this.note = note || {};
    this.connector = connector || {};
    this.subject = subject || {};
    this.disable = disable || [];
  }

  createClass(Annotation, [{
    key: "updatePosition",
    value: function updatePosition() {
      if (this.type.setPosition) {
        this.type.setPosition();

        if (this.type.subject && this.type.subject.selectAll(":not(.handle)").nodes().length !== 0) {
          this.type.redrawSubject();
        }
      }
    }
  }, {
    key: "clearComponents",
    value: function clearComponents() {
      this.type.clearComponents && this.type.clearComponents();
    }
  }, {
    key: "updateOffset",
    value: function updateOffset() {
      if (this.type.setOffset) {
        this.type.setOffset();

        if (this.type.connector.selectAll(":not(.handle)").nodes().length !== 0) {
          this.type.redrawConnector();
        }

        this.type.redrawNote();
      }
    }
  }, {
    key: "className",
    get: function get$$1() {
      return this._className;
    },
    set: function set$$1(className) {
      this._className = className;
      if (this.type.setClassName) this.type.setClassName();
    }
  }, {
    key: "type",
    get: function get$$1() {
      return this._type;
    },
    set: function set$$1(type) {
      this._type = type;
      this.clearComponents();
    }
  }, {
    key: "x",
    get: function get$$1() {
      return this._x;
    },
    set: function set$$1(x) {
      this._x = x;
      this.updatePosition();
    }
  }, {
    key: "y",
    get: function get$$1() {
      return this._y;
    },
    set: function set$$1(y) {
      this._y = y;
      this.updatePosition();
    }
  }, {
    key: "color",
    get: function get$$1() {
      return this._color;
    },
    set: function set$$1(color) {
      this._color = color;
      this.updatePosition();
    }
  }, {
    key: "dx",
    get: function get$$1() {
      return this._dx;
    },
    set: function set$$1(dx) {
      this._dx = dx;
      this.updateOffset();
    }
  }, {
    key: "dy",
    get: function get$$1() {
      return this._dy;
    },
    set: function set$$1(dy) {
      this._dy = dy;
      this.updateOffset();
    }
  }, {
    key: "nx",
    set: function set$$1(nx) {
      this._dx = nx - this._x;
      this.updateOffset();
    }
  }, {
    key: "ny",
    set: function set$$1(ny) {
      this._dy = ny - this._y;
      this.updateOffset();
    }
  }, {
    key: "offset",
    get: function get$$1() {
      return {
        x: this._dx,
        y: this._dy
      };
    },
    set: function set$$1(_ref2) {
      var x = _ref2.x,
          y = _ref2.y;
      this._dx = x;
      this._dy = y;
      this.updateOffset();
    }
  }, {
    key: "position",
    get: function get$$1() {
      return {
        x: this._x,
        y: this._y
      };
    },
    set: function set$$1(_ref3) {
      var x = _ref3.x,
          y = _ref3.y;
      this._x = x;
      this._y = y;
      this.updatePosition();
    }
  }, {
    key: "translation",
    get: function get$$1() {
      return {
        x: this._x + this._dx,
        y: this._y + this._dy
      };
    }
  }, {
    key: "json",
    get: function get$$1() {
      var json = {
        x: this._x,
        y: this._y,
        dx: this._dx,
        dy: this._dy
      };
      if (this.data && Object.keys(this.data).length > 0) json.data = this.data;
      if (this.type) json.type = this.type;
      if (this._className) json.className = this._className;
      if (Object.keys(this.connector).length > 0) json.connector = this.connector;
      if (Object.keys(this.subject).length > 0) json.subject = this.subject;
      if (Object.keys(this.note).length > 0) json.note = this.note;
      return json;
    }
  }]);
  return Annotation;
}();

var AnnotationCollection = function () {
  function AnnotationCollection(_ref) {
    var annotations = _ref.annotations,
        accessors = _ref.accessors,
        accessorsInverse = _ref.accessorsInverse;
    classCallCheck(this, AnnotationCollection);
    this.accessors = accessors;
    this.accessorsInverse = accessorsInverse;
    this.annotations = annotations;
  }

  createClass(AnnotationCollection, [{
    key: "clearTypes",
    value: function clearTypes(newSettings) {
      this.annotations.forEach(function (d) {
        d.type = undefined;
        d.subject = newSettings && newSettings.subject || d.subject;
        d.connector = newSettings && newSettings.connector || d.connector;
        d.note = newSettings && newSettings.note || d.note;
      });
    }
  }, {
    key: "setPositionWithAccessors",
    value: function setPositionWithAccessors() {
      var _this = this;

      this.annotations.forEach(function (d) {
        d.type.setPositionWithAccessors(_this.accessors);
      });
    }
  }, {
    key: "editMode",
    value: function editMode(_editMode) {
      this.annotations.forEach(function (a) {
        if (a.type) {
          a.type.editMode = _editMode;
          a.type.updateEditMode();
        }
      });
    }
  }, {
    key: "updateDisable",
    value: function updateDisable(disable) {
      this.annotations.forEach(function (a) {
        a.disable = disable;

        if (a.type) {
          disable.forEach(function (d) {
            if (a.type[d]) {
              a.type[d].remove && a.type[d].remove();
              a.type[d] = undefined;
            }
          });
        }
      });
    }
  }, {
    key: "updateTextWrap",
    value: function updateTextWrap(textWrap) {
      this.annotations.forEach(function (a) {
        if (a.type && a.type.updateTextWrap) {
          a.type.updateTextWrap(textWrap);
        }
      });
    }
  }, {
    key: "updateText",
    value: function updateText() {
      this.annotations.forEach(function (a) {
        if (a.type && a.type.drawText) {
          a.type.drawText();
        }
      });
    }
  }, {
    key: "updateNotePadding",
    value: function updateNotePadding(notePadding) {
      this.annotations.forEach(function (a) {
        if (a.type) {
          a.type.notePadding = notePadding;
        }
      });
    }
  }, {
    key: "json",
    get: function get$$1() {
      var _this2 = this;

      return this.annotations.map(function (a) {
        var json = a.json;

        if (_this2.accessorsInverse && a.data) {
          json.data = {};
          Object.keys(_this2.accessorsInverse).forEach(function (k) {
            json.data[k] = _this2.accessorsInverse[k]({
              x: a.x,
              y: a.y
            }); //TODO make this feasible to map back to data for other types of subjects
          });
        }

        return json;
      });
    }
  }, {
    key: "noteNodes",
    get: function get$$1() {
      return this.annotations.map(function (a) {
        return _extends({}, a.type.getNoteBBoxOffset(), {
          positionX: a.x,
          positionY: a.y
        });
      });
    } //TODO: come back and rethink if a.x and a.y are applicable in all situations
    // get connectorNodes() {
    //   return this.annotations.map(a => ({ ...a.type.getConnectorBBox(), startX: a.x, startY: a.y}))
    // }
    // get subjectNodes() {
    //   return this.annotations.map(a => ({ ...a.type.getSubjectBBox(), startX: a.x, startY: a.y}))
    // }
    // get annotationNodes() {
    //   return this.annotations.map(a => ({ ...a.type.getAnnotationBBox(), startX: a.x, startY: a.y}))
    // }

  }]);
  return AnnotationCollection;
}();

var pointHandle = function pointHandle(_ref) {
  var _ref$cx = _ref.cx,
      cx = _ref$cx === undefined ? 0 : _ref$cx,
      _ref$cy = _ref.cy,
      cy = _ref$cy === undefined ? 0 : _ref$cy;
  return {
    move: {
      x: cx,
      y: cy
    }
  };
};

var circleHandles = function circleHandles(_ref2) {
  var _ref2$cx = _ref2.cx,
      cx = _ref2$cx === undefined ? 0 : _ref2$cx,
      _ref2$cy = _ref2.cy,
      cy = _ref2$cy === undefined ? 0 : _ref2$cy,
      r1 = _ref2.r1,
      r2 = _ref2.r2,
      padding = _ref2.padding;
  var h = {
    move: {
      x: cx,
      y: cy
    }
  };

  if (r1 !== undefined) {
    h.r1 = {
      x: cx + r1 / Math.sqrt(2),
      y: cy + r1 / Math.sqrt(2)
    };
  }

  if (r2 !== undefined) {
    h.r2 = {
      x: cx + r2 / Math.sqrt(2),
      y: cy + r2 / Math.sqrt(2)
    };
  }

  if (padding !== undefined) {
    h.padding = {
      x: cx + r1 + padding,
      y: cy
    };
  }

  return h;
}; //arc handles


var addHandles = function addHandles(_ref5) {
  var group = _ref5.group,
      handles = _ref5.handles,
      _ref5$r = _ref5.r,
      r = _ref5$r === undefined ? 10 : _ref5$r; //give it a group and x,y to draw handles
  //then give it instructions on what the handles change

  var h = group.selectAll("circle.handle").data(handles);
  h.enter().append("circle").attr("class", "handle").attr("fill", "grey").attr("fill-opacity", 0.1).attr("cursor", "move").attr("stroke-dasharray", 5).attr("stroke", "grey").call((0, _d3Drag.drag)().container((0, _d3Selection.select)("g.annotations").node()).on("start", function (d) {
    return d.start && d.start(d);
  }).on("drag", function (d) {
    return d.drag && d.drag(d);
  }).on("end", function (d) {
    return d.end && d.end(d);
  }));
  group.selectAll("circle.handle").attr("cx", function (d) {
    return d.x;
  }).attr("cy", function (d) {
    return d.y;
  }).attr("r", function (d) {
    return d.r || r;
  }).attr("class", function (d) {
    return "handle " + (d.className || "");
  });
  h.exit().remove();
};

var leftRightDynamic = function leftRightDynamic(align, y) {
  if (align === "dynamic" || align === "left" || align === "right") {
    if (y < 0) {
      align = "top";
    } else {
      align = "bottom";
    }
  }

  return align;
};

var topBottomDynamic = function topBottomDynamic(align, x) {
  if (align === "dynamic" || align === "top" || align === "bottom") {
    if (x < 0) {
      align = "right";
    } else {
      align = "left";
    }
  }

  return align;
};

var orientationTopBottom = ["topBottom", "top", "bottom"];
var orientationLeftRight = ["leftRight", "left", "right"];

var noteAlignment = function (_ref) {
  var _ref$padding = _ref.padding,
      padding = _ref$padding === undefined ? 0 : _ref$padding,
      _ref$bbox = _ref.bbox,
      bbox = _ref$bbox === undefined ? {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  } : _ref$bbox,
      align = _ref.align,
      orientation = _ref.orientation,
      _ref$offset = _ref.offset,
      offset = _ref$offset === undefined ? {
    x: 0,
    y: 0
  } : _ref$offset;
  var x = -bbox.x;
  var y = 0; //-bbox.y

  if (orientationTopBottom.indexOf(orientation) !== -1) {
    align = topBottomDynamic(align, offset.x);

    if (offset.y < 0 && orientation === "topBottom" || orientation === "top") {
      y -= bbox.height + padding;
    } else {
      y += padding;
    }

    if (align === "middle") {
      x -= bbox.width / 2;
    } else if (align === "right") {
      x -= bbox.width;
    }
  } else if (orientationLeftRight.indexOf(orientation) !== -1) {
    align = leftRightDynamic(align, offset.y);

    if (offset.x < 0 && orientation === "leftRight" || orientation === "left") {
      x -= bbox.width + padding;
    } else {
      x += padding;
    }

    if (align === "middle") {
      y -= bbox.height / 2;
    } else if (align === "top") {
      y -= bbox.height;
    }
  }

  return {
    x: x,
    y: y
  };
};

var lineBuilder = function lineBuilder(_ref) {
  var data = _ref.data,
      _ref$curve = _ref.curve,
      curve = _ref$curve === undefined ? _d3Shape.curveLinear : _ref$curve,
      canvasContext = _ref.canvasContext,
      className = _ref.className,
      classID = _ref.classID;
  var lineGen = (0, _d3Shape.line)().curve(curve);
  var builder = {
    type: 'path',
    className: className,
    classID: classID,
    data: data
  };

  if (canvasContext) {
    lineGen.context(canvasContext);
    builder.pathMethods = lineGen;
  } else {
    builder.attrs = {
      d: lineGen(data)
    };
  }

  return builder;
};

var arcBuilder = function arcBuilder(_ref2) {
  var data = _ref2.data,
      canvasContext = _ref2.canvasContext,
      className = _ref2.className,
      classID = _ref2.classID;
  var builder = {
    type: 'path',
    className: className,
    classID: classID,
    data: data
  };
  var arcShape = (0, _d3Shape.arc)().innerRadius(data.innerRadius || 0).outerRadius(data.outerRadius || data.radius || 2).startAngle(data.startAngle || 0).endAngle(data.endAngle || 2 * Math.PI);

  if (canvasContext) {
    arcShape.context(canvasContext);
    builder.pathMethods = lineGen;
  } else {
    builder.attrs = {
      d: arcShape()
    };
  }

  return builder;
};

var noteVertical = function (_ref) {
  var align = _ref.align,
      _ref$x = _ref.x,
      x = _ref$x === undefined ? 0 : _ref$x,
      _ref$y = _ref.y,
      y = _ref$y === undefined ? 0 : _ref$y,
      bbox = _ref.bbox,
      offset = _ref.offset;
  align = leftRightDynamic(align, offset.y);

  if (align === "top") {
    y -= bbox.height;
  } else if (align === "middle") {
    y -= bbox.height / 2;
  }

  var data = [[x, y], [x, y + bbox.height]];
  return {
    components: [lineBuilder({
      data: data,
      className: "note-line"
    })]
  };
};

var noteHorizontal = function (_ref) {
  var align = _ref.align,
      _ref$x = _ref.x,
      x = _ref$x === undefined ? 0 : _ref$x,
      _ref$y = _ref.y,
      y = _ref$y === undefined ? 0 : _ref$y,
      offset = _ref.offset,
      bbox = _ref.bbox;
  align = topBottomDynamic(align, offset.x);

  if (align === "right") {
    x -= bbox.width;
  } else if (align === "middle") {
    x -= bbox.width / 2;
  }

  var data = [[x, y], [x + bbox.width, y]];
  return {
    components: [lineBuilder({
      data: data,
      className: "note-line"
    })]
  };
};

var lineSetup = function lineSetup(_ref) {
  var type = _ref.type,
      subjectType = _ref.subjectType;
  var annotation = type.annotation;
  var offset = annotation.position;
  var x1 = annotation.x - offset.x,
      x2 = x1 + annotation.dx,
      y1 = annotation.y - offset.y,
      y2 = y1 + annotation.dy;
  var subjectData = annotation.subject;

  if (subjectType === "circle" && (subjectData.outerRadius || subjectData.radius)) {
    var h = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    var angle = Math.asin(-y2 / h);
    var r = subjectData.outerRadius || subjectData.radius + (subjectData.radiusPadding || 0);
    x1 = Math.abs(Math.cos(angle) * r) * (x2 < 0 ? -1 : 1);
    y1 = Math.abs(Math.sin(angle) * r) * (y2 < 0 ? -1 : 1);
  }

  if (subjectType === "rect") {
    var width = subjectData.width,
        height = subjectData.height;

    if (width > 0 && annotation.dx > 0 || width < 0 && annotation.dx < 0) {
      if (Math.abs(width) > Math.abs(annotation.dx)) x1 = width / 2;else x1 = width;
    }

    if (height > 0 && annotation.dy > 0 || height < 0 && annotation.dy < 0) {
      if (Math.abs(height) > Math.abs(annotation.dy)) y1 = height / 2;else y1 = height;
    }

    if (x1 === width / 2 && y1 === height / 2) {
      x1 = x2;
      y1 = y2;
    }
  }

  return [[x1, y1], [x2, y2]];
};

var connectorLine = function (connectorData) {
  var data = lineSetup(connectorData);
  return {
    components: [lineBuilder({
      data: data,
      className: "connector"
    })]
  };
};

var connectorElbow = function (_ref) {
  var type = _ref.type,
      subjectType = _ref.subjectType;
  var annotation = type.annotation;
  var offset = annotation.position;
  var x1 = annotation.x - offset.x,
      x2 = x1 + annotation.dx,
      y1 = annotation.y - offset.y,
      y2 = y1 + annotation.dy;
  var subjectData = annotation.subject;

  if (subjectType === "rect") {
    var width = subjectData.width,
        height = subjectData.height;

    if (width > 0 && annotation.dx > 0 || width < 0 && annotation.dx < 0) {
      if (Math.abs(width) > Math.abs(annotation.dx)) x1 = width / 2;else x1 = width;
    }

    if (height > 0 && annotation.dy > 0 || height < 0 && annotation.dy < 0) {
      if (Math.abs(height) > Math.abs(annotation.dy)) y1 = height / 2;else y1 = height;
    }

    if (x1 === width / 2 && y1 === height / 2) {
      x1 = x2;
      y1 = y2;
    }
  }

  var data = [[x1, y1], [x2, y2]];
  var diffY = y2 - y1;
  var diffX = x2 - x1;
  var xe = x2;
  var ye = y2;
  var opposite = y2 < y1 && x2 > x1 || x2 < x1 && y2 > y1 ? -1 : 1;

  if (Math.abs(diffX) < Math.abs(diffY)) {
    xe = x2;
    ye = y1 + diffX * opposite;
  } else {
    ye = y2;
    xe = x1 + diffY * opposite;
  }

  if (subjectType === "circle" && (subjectData.outerRadius || subjectData.radius)) {
    var r = (subjectData.outerRadius || subjectData.radius) + (subjectData.radiusPadding || 0);
    var length = r / Math.sqrt(2);

    if (Math.abs(diffX) > length && Math.abs(diffY) > length) {
      x1 = length * (x2 < 0 ? -1 : 1);
      y1 = length * (y2 < 0 ? -1 : 1);
      data = [[x1, y1], [xe, ye], [x2, y2]];
    } else if (Math.abs(diffX) > Math.abs(diffY)) {
      var angle = Math.asin(-y2 / r);
      x1 = Math.abs(Math.cos(angle) * r) * (x2 < 0 ? -1 : 1);
      data = [[x1, y2], [x2, y2]];
    } else {
      var _angle = Math.acos(x2 / r);

      y1 = Math.abs(Math.sin(_angle) * r) * (y2 < 0 ? -1 : 1);
      data = [[x2, y1], [x2, y2]];
    }
  } else {
    data = [[x1, y1], [xe, ye], [x2, y2]];
  }

  return {
    components: [lineBuilder({
      data: data,
      className: "connector"
    })]
  };
};

var connectorCurve = function (_ref) {
  var type = _ref.type,
      connectorData = _ref.connectorData,
      subjectType = _ref.subjectType;

  if (!connectorData) {
    connectorData = {};
  }

  if (!connectorData.points || typeof connectorData.points === "number") {
    connectorData.points = createPoints(type.annotation.offset, connectorData.points);
  }

  if (!connectorData.curve) {
    connectorData.curve = _d3Shape.curveCatmullRom;
  }

  var handles = [];

  if (type.editMode) {
    var cHandles = connectorData.points.map(function (c, i) {
      return _extends({}, pointHandle({
        cx: c[0],
        cy: c[1]
      }), {
        index: i
      });
    });

    var updatePoint = function updatePoint(index) {
      connectorData.points[index][0] += _d3Selection.event.dx;
      connectorData.points[index][1] += _d3Selection.event.dy;
      type.redrawConnector();
    };

    handles = type.mapHandles(cHandles.map(function (h) {
      return _extends({}, h.move, {
        drag: updatePoint.bind(type, h.index)
      });
    }));
  }

  var data = lineSetup({
    type: type,
    subjectType: subjectType
  });
  data = [data[0]].concat(toConsumableArray(connectorData.points), [data[1]]);
  var components = [lineBuilder({
    data: data,
    curve: connectorData.curve,
    className: "connector"
  })];
  return {
    components: components,
    handles: handles
  };
};

var createPoints = function createPoints(offset) {
  var anchors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var diff = {
    x: offset.x / (anchors + 1),
    y: offset.y / (anchors + 1)
  };
  var p = [];
  var i = 1;

  for (; i <= anchors; i++) {
    p.push([diff.x * i + i % 2 * 20, diff.y * i - i % 2 * 20]);
  }

  return p;
};

var connectorArrow = function (_ref) {
  var annotation = _ref.annotation,
      start = _ref.start,
      end = _ref.end,
      _ref$scale = _ref.scale,
      scale = _ref$scale === undefined ? 1 : _ref$scale;
  var offset = annotation.position;

  if (!start) {
    start = [annotation.dx, annotation.dy];
  } else {
    start = [-end[0] + start[0], -end[1] + start[1]];
  }

  if (!end) {
    end = [annotation.x - offset.x, annotation.y - offset.y];
  }

  var x1 = end[0],
      y1 = end[1];
  var dx = start[0];
  var dy = start[1];
  var size = 10 * scale;
  var angleOffset = 16 / 180 * Math.PI;
  var angle = Math.atan(dy / dx);

  if (dx < 0) {
    angle += Math.PI;
  }

  var data = [[x1, y1], [Math.cos(angle + angleOffset) * size + x1, Math.sin(angle + angleOffset) * size + y1], [Math.cos(angle - angleOffset) * size + x1, Math.sin(angle - angleOffset) * size + y1], [x1, y1]]; //TODO add in reverse
  // if (canvasContext.arrowReverse){
  //   data = [[x1, y1],
  //   [Math.cos(angle + angleOffset)*size, Math.sin(angle + angleOffset)*size],
  //   [Math.cos(angle - angleOffset)*size, Math.sin(angle - angleOffset)*size],
  //   [x1, y1]
  //   ]
  // } else {
  //   data = [[x1, y1],
  //   [Math.cos(angle + angleOffset)*size, Math.sin(angle + angleOffset)*size],
  //   [Math.cos(angle - angleOffset)*size, Math.sin(angle - angleOffset)*size],
  //   [x1, y1]
  //   ]
  // }

  return {
    components: [lineBuilder({
      data: data,
      className: "connector-end connector-arrow",
      classID: "connector-end"
    })]
  };
};

var connectorDot = function (_ref) {
  var line$$1 = _ref.line,
      _ref$scale = _ref.scale,
      scale = _ref$scale === undefined ? 1 : _ref$scale;
  var dot = arcBuilder({
    className: "connector-end connector-dot",
    classID: "connector-end",
    data: {
      radius: 3 * Math.sqrt(scale)
    }
  });
  dot.attrs.transform = "translate(" + line$$1.data[0][0] + ", " + line$$1.data[0][1] + ")";
  return {
    components: [dot]
  };
};

var subjectCircle = function (_ref) {
  var subjectData = _ref.subjectData,
      type = _ref.type;

  if (!subjectData.radius && !subjectData.outerRadius) {
    subjectData.radius = 20;
  }

  var handles = [];
  var c = arcBuilder({
    data: subjectData,
    className: "subject"
  });

  if (type.editMode) {
    var h = circleHandles({
      r1: c.data.outerRadius || c.data.radius,
      r2: c.data.innerRadius,
      padding: subjectData.radiusPadding
    });

    var updateRadius = function updateRadius(attr) {
      var r = subjectData[attr] + _d3Selection.event.dx * Math.sqrt(2);
      subjectData[attr] = r;
      type.redrawSubject();
      type.redrawConnector();
    };

    var cHandles = [_extends({}, h.r1, {
      drag: updateRadius.bind(type, subjectData.outerRadius !== undefined ? "outerRadius" : "radius")
    })];

    if (subjectData.innerRadius) {
      cHandles.push(_extends({}, h.r2, {
        drag: updateRadius.bind(type, "innerRadius")
      }));
    }

    handles = type.mapHandles(cHandles);
  }

  c.attrs["fill-opacity"] = 0;
  return {
    components: [c],
    handles: handles
  };
};

var subjectRect = function (_ref) {
  var subjectData = _ref.subjectData,
      type = _ref.type;

  if (!subjectData.width) {
    subjectData.width = 100;
  }

  if (!subjectData.height) {
    subjectData.height = 100;
  }

  var handles = [];
  var width = subjectData.width,
      height = subjectData.height;
  var data = [[0, 0], [width, 0], [width, height], [0, height], [0, 0]];
  var rect = lineBuilder({
    data: data,
    className: "subject"
  });

  if (type.editMode) {
    var updateWidth = function updateWidth() {
      subjectData.width = _d3Selection.event.x;
      type.redrawSubject();
      type.redrawConnector();
    };

    var updateHeight = function updateHeight() {
      subjectData.height = _d3Selection.event.y;
      type.redrawSubject();
      type.redrawConnector();
    };

    var rHandles = [{
      x: width,
      y: height / 2,
      drag: updateWidth.bind(type)
    }, {
      x: width / 2,
      y: height,
      drag: updateHeight.bind(type)
    }];
    handles = type.mapHandles(rHandles);
  }

  rect.attrs["fill-opacity"] = 0.1;
  return {
    components: [rect],
    handles: handles
  };
};

var subjectThreshold = function (_ref) {
  var subjectData = _ref.subjectData,
      type = _ref.type;
  var offset = type.annotation.position;
  var x1 = (subjectData.x1 !== undefined ? subjectData.x1 : offset.x) - offset.x,
      x2 = (subjectData.x2 !== undefined ? subjectData.x2 : offset.x) - offset.x,
      y1 = (subjectData.y1 !== undefined ? subjectData.y1 : offset.y) - offset.y,
      y2 = (subjectData.y2 !== undefined ? subjectData.y2 : offset.y) - offset.y;
  var data = [[x1, y1], [x2, y2]];
  return {
    components: [lineBuilder({
      data: data,
      className: 'subject'
    })]
  };
};

var subjectBadge = function (_ref) {
  var _ref$subjectData = _ref.subjectData,
      subjectData = _ref$subjectData === undefined ? {} : _ref$subjectData,
      _ref$type = _ref.type,
      type = _ref$type === undefined ? {} : _ref$type;
  var annotation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var typeSettings = type.typeSettings && type.typeSettings.subject;

  if (!subjectData.radius) {
    if (typeSettings && typeSettings.radius) {
      subjectData.radius = typeSettings.radius;
    } else {
      subjectData.radius = 14;
    }
  }

  if (!subjectData.x) {
    if (typeSettings && typeSettings.x) {
      subjectData.x = typeSettings.x;
    }
  }

  if (!subjectData.y) {
    if (typeSettings && typeSettings.y) {
      subjectData.y = typeSettings.y;
    }
  }

  var handles = [];
  var components = [];
  var radius = subjectData.radius;
  var innerRadius = radius * 0.7;
  var x = 0;
  var y = 0;
  var notCornerOffset = Math.sqrt(2) * radius;
  var placement = {
    xleftcorner: -radius,
    xrightcorner: radius,
    ytopcorner: -radius,
    ybottomcorner: radius,
    xleft: -notCornerOffset,
    xright: notCornerOffset,
    ytop: -notCornerOffset,
    ybottom: notCornerOffset
  };

  if (subjectData.x && !subjectData.y) {
    x = placement["x" + subjectData.x];
  } else if (subjectData.y && !subjectData.x) {
    y = placement["y" + subjectData.y];
  } else if (subjectData.x && subjectData.y) {
    x = placement["x" + subjectData.x + "corner"];
    y = placement["y" + subjectData.y + "corner"];
  }

  var transform = "translate(" + x + ", " + y + ")";
  var circlebg = arcBuilder({
    className: "subject",
    data: {
      radius: radius
    }
  });
  circlebg.attrs.transform = transform;
  circlebg.attrs.fill = annotation.color;
  circlebg.attrs["stroke-linecap"] = "round";
  circlebg.attrs["stroke-width"] = "3px";
  var circle = arcBuilder({
    className: "subject-ring",
    data: {
      outerRadius: radius,
      innerRadius: innerRadius
    }
  });
  circle.attrs.transform = transform; // circle.attrs.fill = annotation.color

  circle.attrs["stroke-width"] = "3px";
  circle.attrs.fill = "white";
  var pointer = void 0;

  if (x && y || !x && !y) {
    pointer = lineBuilder({
      className: "subject-pointer",
      data: [[0, 0], [x || 0, 0], [0, y || 0], [0, 0]]
    });
  } else if (x || y) {
    var notCornerPointerXY = function notCornerPointerXY(v) {
      var sign = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      return v && v / Math.sqrt(2) / Math.sqrt(2) || sign * radius / Math.sqrt(2);
    };

    pointer = lineBuilder({
      className: "subject-pointer",
      data: [[0, 0], [notCornerPointerXY(x), notCornerPointerXY(y)], [notCornerPointerXY(x, -1), notCornerPointerXY(y, -1)], [0, 0]]
    });
  }

  if (pointer) {
    pointer.attrs.fill = annotation.color;
    pointer.attrs["stroke-linecap"] = "round";
    pointer.attrs["stroke-width"] = "3px";
    components.push(pointer);
  }

  if (type.editMode) {
    var dragBadge = function dragBadge() {
      subjectData.x = _d3Selection.event.x < -radius * 2 ? "left" : _d3Selection.event.x > radius * 2 ? "right" : undefined;
      subjectData.y = _d3Selection.event.y < -radius * 2 ? "top" : _d3Selection.event.y > radius * 2 ? "bottom" : undefined;
      type.redrawSubject();
    };

    var bHandles = {
      x: x * 2,
      y: y * 2,
      drag: dragBadge.bind(type)
    };

    if (!bHandles.x && !bHandles.y) {
      bHandles.y = -radius;
    }

    handles = type.mapHandles([bHandles]);
  }

  var text = void 0;

  if (subjectData.text) {
    text = {
      type: "text",
      className: "badge-text",
      attrs: {
        fill: "white",
        stroke: "none",
        "font-size": ".7em",
        text: subjectData.text,
        "text-anchor": "middle",
        dy: ".25em",
        x: x,
        y: y
      }
    };
  }

  components.push(circlebg);
  components.push(circle);
  components.push(text);
  return {
    components: components,
    handles: handles
  };
}; //Note options
//Connector options
//Subject options


var Type = function () {
  function Type(_ref) {
    var a = _ref.a,
        annotation = _ref.annotation,
        editMode = _ref.editMode,
        dispatcher = _ref.dispatcher,
        notePadding = _ref.notePadding,
        accessors = _ref.accessors;
    classCallCheck(this, Type);
    this.a = a;
    this.note = annotation.disable.indexOf("note") === -1 && a.select("g.annotation-note");
    this.noteContent = this.note && a.select("g.annotation-note-content");
    this.connector = annotation.disable.indexOf("connector") === -1 && a.select("g.annotation-connector");
    this.subject = annotation.disable.indexOf("subject") === -1 && a.select("g.annotation-subject");
    this.dispatcher = dispatcher;

    if (dispatcher) {
      var handler = addHandlers.bind(null, dispatcher, annotation);
      handler({
        component: this.note,
        name: "note"
      });
      handler({
        component: this.connector,
        name: "connector"
      });
      handler({
        component: this.subject,
        name: "subject"
      });
    }

    this.annotation = annotation;
    this.editMode = annotation.editMode || editMode;
    this.notePadding = notePadding !== undefined ? notePadding : 3;
    this.offsetCornerX = 0;
    this.offsetCornerY = 0;

    if (accessors && annotation.data) {
      this.init(accessors);
    }
  }

  createClass(Type, [{
    key: "init",
    value: function init(accessors) {
      if (!this.annotation.x) {
        this.mapX(accessors);
      }

      if (!this.annotation.y) {
        this.mapY(accessors);
      }
    }
  }, {
    key: "mapY",
    value: function mapY(accessors) {
      if (accessors.y) {
        this.annotation.y = accessors.y(this.annotation.data);
      }
    }
  }, {
    key: "mapX",
    value: function mapX(accessors) {
      if (accessors.x) {
        this.annotation.x = accessors.x(this.annotation.data);
      }
    }
  }, {
    key: "updateEditMode",
    value: function updateEditMode() {
      this.a.selectAll("circle.handle").remove();
    }
  }, {
    key: "drawOnSVG",
    value: function drawOnSVG(component, builders) {
      var _this = this;

      if (!Array.isArray(builders)) {
        builders = [builders];
      }

      builders.filter(function (b) {
        return b;
      }).forEach(function (_ref2) {
        var type = _ref2.type,
            className = _ref2.className,
            attrs = _ref2.attrs,
            handles = _ref2.handles,
            classID = _ref2.classID;

        if (type === "handle") {
          addHandles({
            group: component,
            r: attrs && attrs.r,
            handles: handles
          });
        } else {
          newWithClass(component, [_this.annotation], type, className, classID);
          var el = component.select(type + "." + (classID || className));
          var addAttrs = Object.keys(attrs);
          var removeAttrs = [];
          var currentAttrs = el.node().attributes;

          for (var i = currentAttrs.length - 1; i >= 0; i--) {
            var name = currentAttrs[i].name;
            if (addAttrs.indexOf(name) === -1 && name !== "class") removeAttrs.push(name);
          }

          addAttrs.forEach(function (attr) {
            if (attr === "text") {
              el.text(attrs[attr]);
            } else {
              el.attr(attr, attrs[attr]);
            }
          });
          removeAttrs.forEach(function (attr) {
            return el.attr(attr, null);
          });
        }
      });
    } //TODO: how to extend this to a drawOnCanvas mode?

  }, {
    key: "getNoteBBox",
    value: function getNoteBBox() {
      return bboxWithoutHandles(this.note, ".annotation-note-content text");
    }
  }, {
    key: "getNoteBBoxOffset",
    value: function getNoteBBoxOffset() {
      var bbox = bboxWithoutHandles(this.note, ".annotation-note-content");
      var transform = this.noteContent.attr("transform").split(/\(|\,|\)/g);
      bbox.offsetCornerX = parseFloat(transform[1]) + this.annotation.dx;
      bbox.offsetCornerY = parseFloat(transform[2]) + this.annotation.dy;
      bbox.offsetX = this.annotation.dx;
      bbox.offsetY = this.annotation.dy;
      return bbox;
    }
  }, {
    key: "drawSubject",
    value: function drawSubject() {
      var _this2 = this;

      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var subjectData = this.annotation.subject;
      var type = context.type;
      var subjectParams = {
        type: this,
        subjectData: subjectData
      };
      var subject = {};
      if (type === "circle") subject = subjectCircle(subjectParams);else if (type === "rect") subject = subjectRect(subjectParams);else if (type === "threshold") subject = subjectThreshold(subjectParams);else if (type === "badge") subject = subjectBadge(subjectParams, this.annotation);
      var _subject = subject,
          _subject$components = _subject.components,
          components = _subject$components === undefined ? [] : _subject$components,
          _subject$handles = _subject.handles,
          handles = _subject$handles === undefined ? [] : _subject$handles;
      components.forEach(function (c) {
        if (c && c.attrs && !c.attrs.stroke) {
          c.attrs.stroke = _this2.annotation.color;
        }
      });

      if (this.editMode) {
        handles = handles.concat(this.mapHandles([{
          drag: this.dragSubject.bind(this)
        }]));
        components.push({
          type: "handle",
          handles: handles
        });
      }

      return components;
    }
  }, {
    key: "drawConnector",
    value: function drawConnector() {
      var _this3 = this;

      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var connectorData = this.annotation.connector;
      var type = connectorData.type || context.type;
      var connectorParams = {
        type: this,
        connectorData: connectorData
      };
      connectorParams.subjectType = this.typeSettings && this.typeSettings.subject && this.typeSettings.subject.type;
      var connector = {};
      if (type === "curve") connector = connectorCurve(connectorParams);else if (type === "elbow") connector = connectorElbow(connectorParams);else connector = connectorLine(connectorParams);
      var _connector = connector,
          _connector$components = _connector.components,
          components = _connector$components === undefined ? [] : _connector$components,
          _connector$handles = _connector.handles,
          handles = _connector$handles === undefined ? [] : _connector$handles;
      var line$$1 = components[0]; //TODO: genericize this into fill t/f stroke t/f

      if (line$$1) {
        line$$1.attrs.stroke = this.annotation.color;
        line$$1.attrs.fill = "none";
      }

      var endType = connectorData.end || context.end;
      var end = {};

      if (endType === "arrow") {
        var s = line$$1.data[1];
        var e = line$$1.data[0];
        var distance = Math.sqrt(Math.pow(s[0] - e[0], 2) + Math.pow(s[1] - e[1], 2));

        if (distance < 5 && line$$1.data[2]) {
          s = line$$1.data[2];
        }

        end = connectorArrow({
          annotation: this.annotation,
          start: s,
          end: e,
          scale: connectorData.endScale
        });
      } else if (endType === "dot") {
        end = connectorDot({
          line: line$$1,
          scale: connectorData.endScale
        });
      } else if (!endType || endType === "none") {
        this.connector && this.connector.select(".connector-end").remove();
      }

      if (end.components) {
        end.components.forEach(function (c) {
          c.attrs.fill = _this3.annotation.color;
          c.attrs.stroke = _this3.annotation.color;
        });
        components = components.concat(end.components);
      }

      if (this.editMode) {
        if (handles.length !== 0) components.push({
          type: "handle",
          handles: handles
        });
      }

      return components;
    }
  }, {
    key: "drawNote",
    value: function drawNote() {
      var _this4 = this;

      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var noteData = this.annotation.note;
      var align = noteData.align || context.align || "dynamic";
      var noteParams = {
        bbox: context.bbox,
        align: align,
        offset: this.annotation.offset
      };
      var lineType = noteData.lineType || context.lineType;
      var note = {};
      if (lineType === "vertical") note = noteVertical(noteParams);else if (lineType === "horizontal") note = noteHorizontal(noteParams);
      var _note = note,
          _note$components = _note.components,
          components = _note$components === undefined ? [] : _note$components,
          _note$handles = _note.handles,
          handles = _note$handles === undefined ? [] : _note$handles;
      components.forEach(function (c) {
        c.attrs.stroke = _this4.annotation.color;
      });

      if (this.editMode) {
        handles = this.mapHandles([{
          x: 0,
          y: 0,
          drag: this.dragNote.bind(this)
        }]);
        components.push({
          type: "handle",
          handles: handles
        });
        var dragging = this.dragNote.bind(this),
            start = this.dragstarted.bind(this),
            end = this.dragended.bind(this);
        this.note.call((0, _d3Drag.drag)().container((0, _d3Selection.select)("g.annotations").node()).on("start", function (d) {
          return start(d);
        }).on("drag", function (d) {
          return dragging(d);
        }).on("end", function (d) {
          return end(d);
        }));
      } else {
        this.note.on("mousedown.drag", null);
      }

      return components;
    }
  }, {
    key: "drawNoteContent",
    value: function drawNoteContent(context) {
      var noteData = this.annotation.note;
      var padding = noteData.padding !== undefined ? noteData.padding : this.notePadding;
      var orientation = noteData.orientation || context.orientation || "topBottom";
      var lineType = noteData.lineType || context.lineType;
      var align = noteData.align || context.align || "dynamic";
      if (lineType === "vertical") orientation = "leftRight";else if (lineType === "horizontal") orientation = "topBottom";
      var noteParams = {
        padding: padding,
        bbox: context.bbox,
        offset: this.annotation.offset,
        orientation: orientation,
        align: align
      };

      var _noteAlignment = noteAlignment(noteParams),
          x = _noteAlignment.x,
          y = _noteAlignment.y;

      this.offsetCornerX = x + this.annotation.dx;
      this.offsetCornerY = y + this.annotation.dy;
      this.note && this.noteContent.attr("transform", "translate(" + x + ", " + y + ")");
      return [];
    }
  }, {
    key: "drawOnScreen",
    value: function drawOnScreen(component, drawFunction) {
      return this.drawOnSVG(component, drawFunction);
    }
  }, {
    key: "redrawSubject",
    value: function redrawSubject() {
      this.subject && this.drawOnScreen(this.subject, this.drawSubject());
    }
  }, {
    key: "redrawConnector",
    value: function redrawConnector() {
      this.connector && this.drawOnScreen(this.connector, this.drawConnector());
    }
  }, {
    key: "redrawNote",
    value: function redrawNote() {
      var bbox = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getNoteBBox();
      this.noteContent && this.drawOnScreen(this.noteContent, this.drawNoteContent({
        bbox: bbox
      }));
      this.note && this.drawOnScreen(this.note, this.drawNote({
        bbox: bbox
      }));
    }
  }, {
    key: "setPosition",
    value: function setPosition() {
      var position = this.annotation.position;
      this.a.attr("transform", "translate(" + position.x + ", " + position.y + ")");
    }
  }, {
    key: "clearComponents",
    value: function clearComponents() {
      this.subject && this.subject.select("*").remove();
      this.connector && this.connector.select("*").remove(); // this.note && this.note.select("*").remove()
    }
  }, {
    key: "setOffset",
    value: function setOffset() {
      if (this.note) {
        var offset = this.annotation.offset;
        this.note.attr("transform", "translate(" + offset.x + ", " + offset.y + ")");
      }
    }
  }, {
    key: "setPositionWithAccessors",
    value: function setPositionWithAccessors(accessors) {
      if (accessors && this.annotation.data) {
        this.mapX(accessors);
        this.mapY(accessors);
      }

      this.setPosition();
    }
  }, {
    key: "setClassName",
    value: function setClassName() {
      this.a.attr("class", "annotation " + (this.className && this.className()) + " " + (this.editMode ? "editable" : "") + " " + (this.annotation.className || ""));
    }
  }, {
    key: "draw",
    value: function draw() {
      this.setClassName();
      this.setPosition();
      this.setOffset();
      this.redrawSubject();
      this.redrawConnector();
      this.redrawNote();
    }
  }, {
    key: "dragstarted",
    value: function dragstarted() {
      _d3Selection.event.sourceEvent.stopPropagation();

      this.dispatcher && this.dispatcher.call("dragstart", this.a, this.annotation);
      this.a.classed("dragging", true);
      this.a.selectAll("circle.handle").style("pointer-events", "none");
    }
  }, {
    key: "dragended",
    value: function dragended() {
      this.dispatcher && this.dispatcher.call("dragend", this.a, this.annotation);
      this.a.classed("dragging", false);
      this.a.selectAll("circle.handle").style("pointer-events", "all");
    }
  }, {
    key: "dragSubject",
    value: function dragSubject() {
      var position = this.annotation.position;
      position.x += _d3Selection.event.dx;
      position.y += _d3Selection.event.dy;
      this.annotation.position = position;
    }
  }, {
    key: "dragNote",
    value: function dragNote() {
      var offset = this.annotation.offset;
      offset.x += _d3Selection.event.dx;
      offset.y += _d3Selection.event.dy;
      this.annotation.offset = offset;
    }
  }, {
    key: "mapHandles",
    value: function mapHandles(handles) {
      var _this5 = this;

      return handles.map(function (h) {
        return _extends({}, h, {
          start: _this5.dragstarted.bind(_this5),
          end: _this5.dragended.bind(_this5)
        });
      });
    }
  }]);
  return Type;
}();

exports.annotationTypeBase = Type;

var customType = function customType(initialType, typeSettings, _init) {
  return function (_initialType) {
    inherits(customType, _initialType);

    function customType(settings) {
      classCallCheck(this, customType);

      var _this6 = possibleConstructorReturn(this, (customType.__proto__ || Object.getPrototypeOf(customType)).call(this, settings));

      _this6.typeSettings = typeSettings;

      if (typeSettings.disable) {
        typeSettings.disable.forEach(function (d) {
          _this6[d] && _this6[d].remove();
          _this6[d] = undefined;

          if (d === "note") {
            _this6.noteContent = undefined;
          }
        });
      }

      return _this6;
    }

    createClass(customType, [{
      key: "className",
      value: function className() {
        return "" + (typeSettings.className || get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), "className", this) && get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), "className", this).call(this) || "");
      }
    }, {
      key: "drawSubject",
      value: function drawSubject(context) {
        this.typeSettings.subject = _extends({}, typeSettings.subject, this.typeSettings.subject);
        return get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), "drawSubject", this).call(this, _extends({}, context, this.typeSettings.subject));
      }
    }, {
      key: "drawConnector",
      value: function drawConnector(context) {
        this.typeSettings.connector = _extends({}, typeSettings.connector, this.typeSettings.connector);
        return get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), "drawConnector", this).call(this, _extends({}, context, typeSettings.connector, this.typeSettings.connector));
      }
    }, {
      key: "drawNote",
      value: function drawNote(context) {
        this.typeSettings.note = _extends({}, typeSettings.note, this.typeSettings.note);
        return get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), "drawNote", this).call(this, _extends({}, context, typeSettings.note, this.typeSettings.note));
      }
    }, {
      key: "drawNoteContent",
      value: function drawNoteContent(context) {
        return get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), "drawNoteContent", this).call(this, _extends({}, context, typeSettings.note, this.typeSettings.note));
      }
    }], [{
      key: "init",
      value: function init(annotation, accessors) {
        get(customType.__proto__ || Object.getPrototypeOf(customType), "init", this).call(this, annotation, accessors);

        if (_init) {
          annotation = _init(annotation, accessors);
        }

        return annotation;
      }
    }]);
    return customType;
  }(initialType);
};

exports.annotationCustomType = customType;

var d3NoteText = function (_Type) {
  inherits(d3NoteText, _Type);

  function d3NoteText(params) {
    classCallCheck(this, d3NoteText);

    var _this7 = possibleConstructorReturn(this, (d3NoteText.__proto__ || Object.getPrototypeOf(d3NoteText)).call(this, params));

    _this7.textWrap = params.textWrap || 120;

    _this7.drawText();

    return _this7;
  }

  createClass(d3NoteText, [{
    key: "updateTextWrap",
    value: function updateTextWrap(textWrap) {
      this.textWrap = textWrap;
      this.drawText();
    } //TODO: add update text functionality

  }, {
    key: "drawText",
    value: function drawText() {
      if (this.note) {
        newWithClass(this.note, [this.annotation], "g", "annotation-note-content");
        var noteContent = this.note.select("g.annotation-note-content");
        newWithClass(noteContent, [this.annotation], "rect", "annotation-note-bg");
        newWithClass(noteContent, [this.annotation], "text", "annotation-note-label");
        newWithClass(noteContent, [this.annotation], "text", "annotation-note-title");
        var titleBBox = {
          height: 0
        };
        var label = this.a.select("text.annotation-note-label");
        var wrapLength = this.annotation.note && this.annotation.note.wrap || this.typeSettings && this.typeSettings.note && this.typeSettings.note.wrap || this.textWrap;
        var wrapSplitter = this.annotation.note && this.annotation.note.wrapSplitter || this.typeSettings && this.typeSettings.note && this.typeSettings.note.wrapSplitter;
        var bgPadding = this.annotation.note && this.annotation.note.bgPadding || this.typeSettings && this.typeSettings.note && this.typeSettings.note.bgPadding;
        var bgPaddingFinal = {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        };

        if (typeof bgPadding === "number") {
          bgPaddingFinal = {
            top: bgPadding,
            bottom: bgPadding,
            left: bgPadding,
            right: bgPadding
          };
        } else if (bgPadding && (typeof bgPadding === "undefined" ? "undefined" : _typeof(bgPadding)) === "object") {
          bgPaddingFinal = _extends(bgPaddingFinal, bgPadding);
        }

        if (this.annotation.note.title) {
          var title = this.a.select("text.annotation-note-title");
          title.text(this.annotation.note.title);
          title.attr("fill", this.annotation.color);
          title.attr("font-weight", "bold");
          title.call(wrap, wrapLength, wrapSplitter);
          titleBBox = title.node().getBBox();
        }

        label.text(this.annotation.note.label).attr("dx", "0");
        label.call(wrap, wrapLength, wrapSplitter);
        label.attr("y", titleBBox.height * 1.1 || 0);
        label.attr("fill", this.annotation.color);
        var bbox = this.getNoteBBox();
        this.a.select("rect.annotation-note-bg").attr("width", bbox.width + bgPaddingFinal.left + bgPaddingFinal.right).attr("height", bbox.height + bgPaddingFinal.top + bgPaddingFinal.bottom).attr("x", bbox.x - bgPaddingFinal.left).attr("y", -bgPaddingFinal.top).attr("fill", "white").attr("fill-opacity", 0);
      }
    }
  }]);
  return d3NoteText;
}(Type);

var d3Label = customType(d3NoteText, {
  className: "label",
  note: {
    align: "middle"
  }
});
exports.annotationLabel = d3Label;
var d3Callout = customType(d3NoteText, {
  className: "callout",
  note: {
    lineType: "horizontal"
  }
});
exports.annotationCallout = d3Callout;
var d3CalloutElbow = customType(d3Callout, {
  className: "callout elbow",
  connector: {
    type: "elbow"
  }
});
exports.annotationCalloutElbow = d3CalloutElbow;
var d3CalloutCurve = customType(d3Callout, {
  className: "callout curve",
  connector: {
    type: "curve"
  }
});
exports.annotationCalloutCurve = d3CalloutCurve;
var d3Badge = customType(Type, {
  className: "badge",
  subject: {
    type: "badge"
  },
  disable: ["connector", "note"]
});
exports.annotationBadge = d3Badge;
var d3CalloutCircle = customType(d3NoteText, {
  className: "callout circle",
  subject: {
    type: "circle"
  },
  note: {
    lineType: "horizontal"
  },
  connector: {
    type: "elbow"
  }
});
exports.annotationCalloutCircle = d3CalloutCircle;
var d3CalloutRect = customType(d3NoteText, {
  className: "callout rect",
  subject: {
    type: "rect"
  },
  note: {
    lineType: "horizontal"
  },
  connector: {
    type: "elbow"
  }
});
exports.annotationCalloutRect = d3CalloutRect;

var ThresholdMap = function (_d3Callout) {
  inherits(ThresholdMap, _d3Callout);

  function ThresholdMap() {
    classCallCheck(this, ThresholdMap);
    return possibleConstructorReturn(this, (ThresholdMap.__proto__ || Object.getPrototypeOf(ThresholdMap)).apply(this, arguments));
  }

  createClass(ThresholdMap, [{
    key: "mapY",
    value: function mapY(accessors) {
      get(ThresholdMap.prototype.__proto__ || Object.getPrototypeOf(ThresholdMap.prototype), "mapY", this).call(this, accessors);
      var a = this.annotation;

      if ((a.subject.x1 || a.subject.x2) && a.data && accessors.y) {
        a.y = accessors.y(a.data);
      }

      if ((a.subject.x1 || a.subject.x2) && !a.x) {
        a.x = a.subject.x1 || a.subject.x2;
      }
    }
  }, {
    key: "mapX",
    value: function mapX(accessors) {
      get(ThresholdMap.prototype.__proto__ || Object.getPrototypeOf(ThresholdMap.prototype), "mapX", this).call(this, accessors);
      var a = this.annotation;

      if ((a.subject.y1 || a.subject.y2) && a.data && accessors.x) {
        a.x = accessors.x(a.data);
      }

      if ((a.subject.y1 || a.subject.y2) && !a.y) {
        a.y = a.subject.y1 || a.subject.y2;
      }
    }
  }]);
  return ThresholdMap;
}(d3Callout);

var d3XYThreshold = customType(ThresholdMap, {
  className: "callout xythreshold",
  subject: {
    type: "threshold"
  }
});
exports.annotationXYThreshold = d3XYThreshold;

var newWithClass = function newWithClass(a, d, type, className, classID) {
  var group = a.selectAll(type + "." + (classID || className)).data(d);
  group.enter().append(type).merge(group).attr("class", className);
  group.exit().remove();
  return a;
};

var addHandlers = function addHandlers(dispatcher, annotation, _ref3) {
  var component = _ref3.component,
      name = _ref3.name;

  if (component) {
    component.on("mouseover.annotations", function () {
      dispatcher.call(name + "over", component, annotation);
    }).on("mouseout.annotations", function () {
      return dispatcher.call(name + "out", component, annotation);
    }).on("click.annotations", function () {
      return dispatcher.call(name + "click", component, annotation);
    });
  }
}; //Text wrapping code adapted from Mike Bostock


var wrap = function wrap(text, width, wrapSplitter) {
  var lineHeight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.2;
  text.each(function () {
    var text = (0, _d3Selection.select)(this),
        words = text.text().split(wrapSplitter || /[ \t\r\n]+/).reverse().filter(function (w) {
      return w !== "";
    });
    var word = void 0,
        line$$1 = [],
        tspan = text.text(null).append("tspan").attr("x", 0).attr("dy", 0.8 + "em");

    while (word = words.pop()) {
      line$$1.push(word);
      tspan.text(line$$1.join(" "));

      if (tspan.node().getComputedTextLength() > width && line$$1.length > 1) {
        line$$1.pop();
        tspan.text(line$$1.join(" "));
        line$$1 = [word];
        tspan = text.append("tspan").attr("x", 0).attr("dy", lineHeight + "em").text(word);
      }
    }
  });
};

var bboxWithoutHandles = function bboxWithoutHandles(selection) {
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ":not(.handle)";

  if (!selection) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }

  return selection.selectAll(selector).nodes().reduce(function (p, c) {
    var bbox = c.getBBox();
    p.x = Math.min(p.x, bbox.x);
    p.y = Math.min(p.y, bbox.y);
    p.width = Math.max(p.width, bbox.width);
    var yOffset = c && c.attributes && c.attributes.y;
    p.height = Math.max(p.height, (yOffset && parseFloat(yOffset.value) || 0) + bbox.height);
    return p;
  }, {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
};

function annotation() {
  var annotations = [],
      collection = void 0,
      context = void 0,
      //TODO: add canvas functionality
  disable = [],
      accessors = {},
      accessorsInverse = {},
      editMode = false,
      ids = void 0,
      type = d3Callout,
      textWrap = void 0,
      notePadding = void 0,
      annotationDispatcher = (0, _d3Dispatch.dispatch)("subjectover", "subjectout", "subjectclick", "connectorover", "connectorout", "connectorclick", "noteover", "noteout", "noteclick", "dragend", "dragstart"),
      sel = void 0;

  var annotation = function annotation(selection) {
    sel = selection; //TODO: check to see if this is still needed

    if (!editMode) {
      selection.selectAll("circle.handle").remove();
    }

    var translatedAnnotations = annotations.map(function (a) {
      if (!a.type) {
        a.type = type;
      }

      if (!a.disable) {
        a.disable = disable;
      }

      return new Annotation(a);
    });
    collection = collection || new AnnotationCollection({
      annotations: translatedAnnotations,
      accessors: accessors,
      accessorsInverse: accessorsInverse,
      ids: ids
    });
    var annotationG = selection.selectAll("g").data([collection]);
    annotationG.enter().append("g").attr("class", "annotations");
    var group = selection.select("g.annotations");
    newWithClass(group, collection.annotations, "g", "annotation");
    var annotation = group.selectAll("g.annotation");
    annotation.each(function (d) {
      var a = (0, _d3Selection.select)(this);
      a.attr("class", "annotation");
      newWithClass(a, [d], "g", "annotation-connector");
      newWithClass(a, [d], "g", "annotation-subject");
      newWithClass(a, [d], "g", "annotation-note");
      newWithClass(a.select("g.annotation-note"), [d], "g", "annotation-note-content");
      d.type = d.type.toString() === "[object Object]" ? d.type : new d.type({
        a: a,
        annotation: d,
        textWrap: textWrap,
        notePadding: notePadding,
        editMode: editMode,
        dispatcher: annotationDispatcher,
        accessors: accessors
      });
      d.type.draw();
      d.type.drawText && d.type.drawText();
    });
  };

  annotation.json = function () {
    /* eslint-disable no-console */
    console.log("Annotations JSON was copied to your clipboard. Please note the annotation type is not JSON compatible. It appears in the objects array in the console, but not in the copied JSON.", collection.json);
    /* eslint-enable no-console */

    window.copy(JSON.stringify(collection.json.map(function (a) {
      delete a.type;
      return a;
    })));
    return annotation;
  };

  annotation.update = function () {
    if (annotations && collection) {
      annotations = collection.annotations.map(function (a) {
        a.type.draw();
        return a;
      });
    }

    return annotation;
  };

  annotation.updateText = function () {
    if (collection) {
      collection.updateText(textWrap);
      annotations = collection.annotations;
    }

    return annotation;
  };

  annotation.updatedAccessors = function () {
    collection.setPositionWithAccessors();
    annotations = collection.annotations;
    return annotation;
  };

  annotation.disable = function (_) {
    if (!arguments.length) return disable;
    disable = _;

    if (collection) {
      collection.updateDisable(disable);
      annotations = collection.annotations;
    }

    return annotation;
  };

  annotation.textWrap = function (_) {
    if (!arguments.length) return textWrap;
    textWrap = _;

    if (collection) {
      collection.updateTextWrap(textWrap);
      annotations = collection.annotations;
    }

    return annotation;
  };

  annotation.notePadding = function (_) {
    if (!arguments.length) return notePadding;
    notePadding = _;

    if (collection) {
      collection.updateNotePadding(notePadding);
      annotations = collection.annotations;
    }

    return annotation;
  }; //todo think of how to handle when undefined is sent


  annotation.type = function (_, settings) {
    if (!arguments.length) return type;
    type = _;

    if (collection) {
      collection.annotations.map(function (a) {
        a.type.note && a.type.note.selectAll("*:not(.annotation-note-content)").remove();
        a.type.noteContent && a.type.noteContent.selectAll("*").remove();
        a.type.subject && a.type.subject.selectAll("*").remove();
        a.type.connector && a.type.connector.selectAll("*").remove();
        a.type.typeSettings = {};
        a.type = type;
        a.subject = settings && settings.subject || a.subject;
        a.connector = settings && settings.connector || a.connector;
        a.note = settings && settings.note || a.note;
      });
      annotations = collection.annotations;
    }

    return annotation;
  };

  annotation.annotations = function (_) {
    if (!arguments.length) return collection && collection.annotations || annotations;
    annotations = _;

    if (collection && collection.annotations) {
      var rerun = annotations.some(function (d) {
        return !d.type || d.type.toString() !== "[object Object]";
      });

      if (rerun) {
        collection = null;
        annotation(sel);
      } else {
        collection.annotations = annotations;
      }
    }

    return annotation;
  };

  annotation.context = function (_) {
    if (!arguments.length) return context;
    context = _;
    return annotation;
  };

  annotation.accessors = function (_) {
    if (!arguments.length) return accessors;
    accessors = _;
    return annotation;
  };

  annotation.accessorsInverse = function (_) {
    if (!arguments.length) return accessorsInverse;
    accessorsInverse = _;
    return annotation;
  };

  annotation.ids = function (_) {
    if (!arguments.length) return ids;
    ids = _;
    return annotation;
  };

  annotation.editMode = function (_) {
    if (!arguments.length) return editMode;
    editMode = _;

    if (sel) {
      sel.selectAll("g.annotation").classed("editable", editMode);
    }

    if (collection) {
      collection.editMode(editMode);
      annotations = collection.annotations;
    }

    return annotation;
  };

  annotation.collection = function (_) {
    if (!arguments.length) return collection;
    collection = _;
    return annotation;
  };

  annotation.on = function () {
    var value = annotationDispatcher.on.apply(annotationDispatcher, arguments);
    return value === annotationDispatcher ? annotation : value;
  };

  return annotation;
}

var index = {
  annotation: annotation,
  annotationTypeBase: Type,
  annotationLabel: d3Label,
  annotationCallout: d3Callout,
  annotationCalloutCurve: d3CalloutCurve,
  annotationCalloutElbow: d3CalloutElbow,
  annotationCalloutCircle: d3CalloutCircle,
  annotationCalloutRect: d3CalloutRect,
  annotationXYThreshold: d3XYThreshold,
  annotationBadge: d3Badge,
  annotationCustomType: customType
};
var _default = index;
exports.default = _default;
},{"d3-selection":"4Gs4","d3-drag":"aj7N","d3-shape":"UQVl","d3-dispatch":"7UiF"}],"graphic.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _flubber = require("flubber");

var _d3fcLabelLayout = require("d3fc-label-layout");

var _d3SvgAnnotation = require("d3-svg-annotation");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function resize() {}

function init() {
  Promise.all([d3.dsv(",", "assets/data/ranking.csv", function (d) {
    return {
      country: d.country,
      search: +d.search,
      tele: +d.tele,
      overall: +d.overall
    };
  }), d3.json('assets/data/eurovision_50m_simple.json'), d3.dsv(",", "assets/data/tele-search-by-year.csv", function (d) {
    return {
      to: d.to,
      searchpoints: +d.searchpoints,
      year: +d.year,
      votepoints: +d.votepoints
    };
  }), d3.dsv(",", "assets/data/votingdata_18.csv", function (d) {
    return {
      to: d.to,
      from: d.from,
      search: +d.search,
      tele: +d.tele
    };
  }), d3.dsv(",", "assets/data/patterns.csv", function (d) {
    return {
      from: d.from,
      to: d.to,
      search: +d.search,
      tele: +d.tele
    };
  })]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 5),
        rankingdata = _ref2[0],
        geodata = _ref2[1],
        points = _ref2[2],
        votingdata = _ref2[3],
        patterns = _ref2[4];

    var grid = {
      ALB: {
        "coords": {
          x: 5,
          y: 8
        },
        "name": "Albania"
      },
      ARM: {
        "coords": {
          x: 9,
          y: 6
        },
        "name": "Armenia"
      },
      AUS: {
        "coords": {
          x: 9,
          y: 9
        },
        "name": "Australia"
      },
      AUT: {
        "coords": {
          x: 4,
          y: 5
        },
        "name": "Austria"
      },
      AZE: {
        "coords": {
          x: 9,
          y: 5
        },
        "name": "Azerbaijan"
      },
      BEL: {
        "coords": {
          x: 2,
          y: 3
        },
        "name": "Belgium"
      },
      BGR: {
        "coords": {
          x: 7,
          y: 6
        },
        "name": "Bulgaria"
      },
      BIH: {
        "coords": {
          x: 5,
          y: 6
        },
        "name": "Bosnia and Herzegovina"
      },
      BLR: {
        "coords": {
          x: 6,
          y: 3
        },
        "name": "Belarus"
      },
      CHE: {
        "coords": {
          x: 3,
          y: 4
        },
        "name": "Switzerland"
      },
      CYP: {
        "coords": {
          x: 8,
          y: 7
        },
        "name": "Cyprus"
      },
      CZE: {
        "coords": {
          x: 4,
          y: 4
        },
        "name": "Czechia"
      },
      DEU: {
        "coords": {
          x: 4,
          y: 3
        },
        "name": "Germany"
      },
      DNK: {
        "coords": {
          x: 4,
          y: 2
        },
        "name": "Denmark"
      },
      ESP: {
        "coords": {
          x: 1,
          y: 5
        },
        "name": "Spain"
      },
      EST: {
        "coords": {
          x: 6,
          y: 1
        },
        "name": "Estonia"
      },
      FIN: {
        "coords": {
          x: 6,
          y: 0
        },
        "name": "Finland"
      },
      FRA: {
        "coords": {
          x: 1,
          y: 4
        },
        "name": "France"
      },
      GBR: {
        "coords": {
          x: 1,
          y: 2
        },
        "name": "UK"
      },
      GEO: {
        "coords": {
          x: 8,
          y: 5
        },
        "name": "Georgia"
      },
      GRC: {
        "coords": {
          x: 6,
          y: 8
        },
        "name": "Greece"
      },
      HUN: {
        "coords": {
          x: 5,
          y: 5
        },
        "name": "Hungaria"
      },
      HRV: {
        "coords": {
          x: 4,
          y: 6
        },
        "name": "Croatia"
      },
      IRL: {
        "coords": {
          x: 0,
          y: 2
        },
        "name": "Ireland"
      },
      ISL: {
        "coords": {
          x: 0,
          y: 0
        },
        "name": "Iceland"
      },
      ISR: {
        "coords": {
          x: 8,
          y: 8
        },
        "name": "Israel"
      },
      ITA: {
        "coords": {
          x: 3,
          y: 5
        },
        "name": "Italia"
      },
      KOS: {
        "coords": {
          x: 6,
          y: 7
        },
        "name": "Kosovo"
      },
      LTU: {
        "coords": {
          x: 6,
          y: 2
        },
        "name": "Lithuania"
      },
      LUX: {
        "coords": {
          x: 2,
          y: 4
        },
        "name": "Luxembourg"
      },
      LVA: {
        "coords": {
          x: 7,
          y: 2
        },
        "name": "Latvia"
      },
      MDA: {
        "coords": {
          x: 7,
          y: 5
        },
        "name": "Moldova"
      },
      MKD: {
        "coords": {
          x: 7,
          y: 7
        },
        "name": "North Macedonia"
      },
      MLT: {
        "coords": {
          x: 1,
          y: 7
        },
        "name": "Malta"
      },
      MNE: {
        "coords": {
          x: 5,
          y: 7
        },
        "name": "Montenegro"
      },
      NLD: {
        "coords": {
          x: 3,
          y: 3
        },
        "name": "Netherlands"
      },
      NOR: {
        "coords": {
          x: 4,
          y: 0
        },
        "name": "Norway"
      },
      POL: {
        "coords": {
          x: 5,
          y: 3
        },
        "name": "Poland"
      },
      PRT: {
        "coords": {
          x: 0,
          y: 5
        },
        "name": "Portugal"
      },
      ROU: {
        "coords": {
          x: 6,
          y: 5
        },
        "name": "Romania"
      },
      RUS: {
        "coords": {
          x: 7,
          y: 3
        },
        "name": "Russia"
      },
      SMR: {
        "coords": {
          x: 2,
          y: 6
        },
        "name": "San Marino"
      },
      SRB: {
        "coords": {
          x: 6,
          y: 6
        },
        "name": "Serbia"
      },
      SVK: {
        "coords": {
          x: 5,
          y: 4
        },
        "name": "Slovakia"
      },
      SVN: {
        "coords": {
          x: 3,
          y: 6
        },
        "name": "Slovenia"
      },
      SWE: {
        "coords": {
          x: 5,
          y: 0
        },
        "name": "Sweden"
      },
      UKR: {
        "coords": {
          x: 6,
          y: 4
        },
        "name": "Ukraine"
      },
      TUR: {
        "coords": {
          x: 8,
          y: 6
        },
        "name": "Turkey"
      }
    };
    var winners = {
      "2004": "UKR",
      "2005": "GRC",
      "2006": "FIN",
      "2007": "SRB",
      "2008": "RUS",
      "2009": "NOR",
      "2010": "DEU",
      "2011": "AZE",
      "2012": "SWE",
      "2013": "DNK",
      "2014": "AUT",
      "2015": "SWE",
      "2016": "UKR",
      "2017": "PRT",
      "2018": "ISR"
    };
    var filtervalues = {
      "country": "ISR",
      "fromto": "to",
      "searchtele": "search"
      /** SELECT LIST **/

    };

    var froms = _toConsumableArray(new Set(votingdata.map(function (el) {
      return el.from;
    })));

    var tos = _toConsumableArray(new Set(votingdata.map(function (el) {
      return el.to;
    })));

    function compare(arr1, arr2) {
      var losers = [];
      arr1.forEach(function (e1) {
        if (!arr2.includes(e1)) {
          losers.push(e1);
        }
      });
      return losers;
    }

    var losers = compare(froms, tos);
    var tofromCountries = {
      "to": tos,
      "from": froms
    };
    d3.select("#countrylist").selectAll("option") //.data(tofromCountries[filtervalues.fromto])
    .data(froms).enter().append("option").attr("value", function (d) {
      return d;
    }).text(function (d) {
      return grid[d].name;
    });
    d3.select("option[value='ISR']").property("selected", true);
    /** RANKING **/

    var rankingHeight = 800;
    var rankingWidth = document.querySelector("#ranking-container").clientWidth;
    var rankingMargin = {
      top: 40,
      left: 120,
      right: 120
    };
    var rankingSvg = d3.select("#ranking").attr("width", rankingWidth).attr("height", rankingHeight);
    var flagfilter = rankingSvg.append("filter").attr("id", "flagglow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    flagfilter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    var flagfeMerge = flagfilter.append("feMerge");
    flagfeMerge.append("feMergeNode").attr("in", "coloredBlur");
    flagfeMerge.append("feMergeNode").attr("in", "SourceGraphic");
    var countryScale = d3.scaleBand().domain(rankingdata.map(function (d) {
      return d.country;
    })).range([rankingMargin.top, rankingHeight]);
    var voteScale = d3.scalePoint().domain(["search", "tele", "overall"]).range([rankingMargin.left, rankingWidth - rankingMargin.right]).padding(0);
    var headers = {
      "search": "Search",
      "tele": "Televoting",
      "overall": "Overall"
    };
    rankingSvg.selectAll('text.header').data(["search", "tele", "overall"]).enter().append("text").attr('x', function (d) {
      return voteScale(d);
    }).attr('y', 20).text(function (d) {
      return headers[d];
    }).attr("class", function (d) {
      return "label-".concat(d);
    }).attr('text-anchor', 'middle').attr('font-size', '16px').attr('font-family', 'Rubik');
    var countryheight = 24; //Connecting lines

    /*let line = d3.line()
      .x((d) => voteScale(d.key))
      .y((d) => d.value*countryScale.bandwidth() + countryheight/2)
      .curve(d3.curveMonotoneX);
     let linedata = [];
    rankingdata.forEach(function(el){
      let obj = {};
      obj.country = el.country;
      obj.values = [];
      obj.values.push({"key": "search", "value": el.search});
      obj.values.push({"key": "tele", "value": el.tele});
      obj.values.push({"key": "overall", "value": el.overall});
      linedata.push(obj)
    });
     rankingSvg.selectAll("line.connection")
      .data(linedata)
      .enter().append("path")
      .attr("d", (d) => line(d.values))
      .style("stroke-width", 1)
      .style("stroke", "white")
      .style("fill", "none")
      .style("filter", "url(#flagglow)");*/
    //Left part, search results

    rankingSvg.selectAll('image.flag').data(rankingdata).enter().append('image').attr("xlink:href", function (d) {
      return 'assets/images/flags/' + d.country + '.svg';
    }).attr('x', voteScale("search") - countryheight / 2).attr("y", function (d) {
      return countryScale(d.country) - countryheight / 2;
    }).attr('class', function (d) {
      return 'id-' + d.Country;
    }).attr('width', countryheight - 2).attr('height', countryheight - 2).style("filter", "url(#flagglow)");
    rankingSvg.selectAll('image.question.tele').data(rankingdata).enter().append('image').attr("xlink:href", function (d) {
      return 'assets/images/help-circle' + '.svg';
    }).attr('x', voteScale("tele") - countryheight / 2).attr('y', function (d) {
      return countryScale(d.country) - countryheight / 2;
    }).attr('class', 'question').attr('width', countryheight - 2).attr('height', countryheight - 2);
    rankingSvg.selectAll('image.question.overall').data(rankingdata).enter().append('image').attr("xlink:href", function (d) {
      return 'assets/images/help-circle' + '.svg';
    }).attr('x', voteScale("overall") - countryheight / 2).attr('y', function (d) {
      return countryScale(d.country) - countryheight / 2;
    }).attr('class', 'question').attr('width', countryheight - 2).attr('height', countryheight - 2);
    rankingSvg.selectAll('text.countrylabel-left').data(rankingdata).enter().append('text').attr('x', 0).attr('y', function (d) {
      return countryScale(d.country);
    }).attr("dy", "0.3em").style('font-family', 'Rubik').style('font-size', '14px').attr('class', function (d) {
      return 'countrylabel id-' + d.country;
    }).attr('id', function (d) {
      return d.key;
    }).html(function (d, i) {
      return i + 1 + '. ' + grid[d.country].name;
    });
    rankingSvg.selectAll('text.countrylabel-right').data(rankingdata).enter().append('text').attr('x', rankingWidth).attr('y', function (d) {
      return countryScale(d.country);
    }).attr("dy", "0.3em").style('font-family', 'Rubik').style('font-size', '14px').style('text-anchor', 'end').attr('class', function (d) {
      return 'countrylabel id-' + d.country;
    }).attr('id', function (d) {
      return d.key;
    }) //.html(function (d, i) { return (i + 1) + '. ' + d.country; });
    .html(function (d, i) {
      return i + 1 + '. ?';
    });
    /** MAP **/
    //const mapWidth = 900;

    var mapWidth = document.querySelector("#map-container").clientWidth;
    var mapHeight = 800;
    var mapPadding = 20;
    var mapSvg = d3.select("#map").attr("width", mapWidth).attr("height", mapHeight);
    var extent = {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [[[10, 70], [35, 70], [10, 30], [35, 30]]]
      }
    };
    var projection = d3.geoAzimuthalEqualArea().rotate([-10, -52, 0]);
    projection.fitExtent([[mapPadding, mapPadding + 25], [mapWidth - mapPadding, mapHeight - mapPadding]], extent);
    var geoPath = d3.geoPath().projection(projection);
    var countries = mapSvg.selectAll('path').data(geodata.features).enter().append('path').attr("id", function (d) {
      return d.properties.ADM0_A3;
    }).attr("class", "country").attr("d", geoPath).style("fill", "#0D1730"); //.style("filter", "url(#glow)");

    /*COLOR MAP*/

    var cols = d3.scaleSequential(d3.interpolatePlasma).domain([1, 12]); //legend

    d3.selectAll('.legend-item').style('background-color', function (d) {
      return cols(d3.select(this).text());
    });

    function getCountryVotingData(filterparams) {
      var countryVotingData = votingdata.filter(function (el) {
        return el[filterparams.fromto] == filterparams.country;
      });
      var countryVoting = countryVotingData.map(function (el) {
        var obj = {};
        obj.to = el.to;
        obj.from = el.from;
        obj.points = el[filterparams.searchtele];
        return obj;
      }); //countryVoting = countryVoting.filter((cntr) => cntr.points > 0)

      return countryVoting;
    }

    function colorMap(filterparams) {
      var countrydata = getCountryVotingData(filterparams);
      var reversefromto = "from";

      if (filterparams.fromto == "from") {
        reversefromto = "to";
      }

      if (filterparams.fromto == "to") {
        losers.forEach(function (el) {
          d3.select("option[value=".concat(el, "]")).property("disabled", true);
        });
      }

      if (filterparams.fromto == "from") {
        d3.selectAll("option").property("disabled", false);
      }

      countries.transition().duration(1000).style("fill", function (d) {
        var countrypoints = countrydata.filter(function (el) {
          return el[reversefromto] == d.properties.ADM0_A3;
        });

        if (countrypoints.length == 1 && countrypoints[0].points > 0) {
          var _points = countrypoints[0].points;
          return cols(_points);
        } else {
          return "#0D1730";
        }
      });
    }

    ;
    colorMap(filtervalues);
    /*MAP UPDATES*/

    var rectDim = 64;
    var gridMarginX = (mapWidth / 2 - 5 * rectDim) / rectDim;
    var gridMarginY = 120 / rectDim;

    function rectToPath(x, y, dim) {
      x = x + gridMarginX;
      y = y + gridMarginY;
      return "M".concat(x * rectDim, ",").concat(y * rectDim, " L").concat(x * rectDim + dim, ",").concat(y * rectDim, " L").concat(x * rectDim + dim, ",").concat(y * rectDim + dim, " L").concat(x * rectDim, ",").concat(y * rectDim + dim, " L").concat(x * rectDim, ",").concat(y * rectDim);
    }

    d3.selectAll("input.mapswitch").on("change", function () {
      var selvalue = d3.select(this).node().value;

      if (selvalue == "rects") {
        mapSvg.selectAll("path.country").transition().duration(2000).attrTween("d", function () {
          return (0, _flubber.combine)((0, _flubber.splitPathString)(d3.select(this).attr("d")), rectToPath(grid[d3.select(this).attr("id")].coords.x, grid[d3.select(this).attr("id")].coords.y, rectDim), {
            "single": true
          });
        }); //.style("filter", "url(#glow)");

        setTimeout(function () {
          var country;

          for (country in grid) {
            var bbox = mapSvg.select("path#" + country).node().getBBox();
            var translate = mapSvg.select("path#" + country).node().getCTM();
            var labelx = bbox.x + bbox.width / 2 + translate.e;
            var labely = bbox.y + bbox.height / 2 + translate.f;
            d3.select("#map").append("text").attr("x", labelx).attr("y", labely + 4).attr("class", "map-label").text(country);
          }
        }, 2000);
      }

      if (selvalue == "geo") {
        mapSvg.selectAll("path.country").transition().duration(2000).attrTween("d", function (d) {
          var cntr = d3.select(this).attr("id");
          return (0, _flubber.separate)(d3.select(this).attr("d"), (0, _flubber.splitPathString)(geoPath(geodata.features.filter(function (el) {
            return el.properties.ADM0_A3 == cntr;
          })[0])), {
            "single": true
          });
        });
        d3.selectAll(".map-label").remove();
      }
    });
    d3.select("#countrylist").on("change", function () {
      filtervalues.country = d3.select(this).node().value;
      countries.classed("highlight", false);
      d3.select(".country#" + filtervalues.country).raise().classed("highlight", true);
      colorMap(filtervalues);
    });
    d3.selectAll("input.fromtoswitch").on("change", function () {
      filtervalues.fromto = d3.select(this).node().value;
      colorMap(filtervalues);
    });
    d3.selectAll("input.searchteleswitch").on("change", function () {
      filtervalues.searchtele = d3.select(this).node().value;
      colorMap(filtervalues);
    });
    /*SCATTER TOTAL*/
    //Calculate average points awarded to each country over the 15 years

    var pointsMean = d3.nest().key(function (d) {
      return d.to;
    }).rollup(function (d) {
      return {
        searchpoints: d3.mean(d, function (g) {
          return g.searchpoints;
        }),
        votepoints: d3.mean(d, function (g) {
          return g.votepoints;
        })
      };
    }).entries(points);
    var maxSearchPoints = d3.max(pointsMean, function (d) {
      return d.value.searchpoints;
    });
    var maxVotePoints = d3.max(pointsMean, function (d) {
      return d.value.votepoints;
    });
    var maxPoints = d3.max([maxSearchPoints, maxVotePoints]);
    var scatterMargins = {
      top: 70,
      right: 40,
      bottom: 60,
      left: 60
    };
    var scatterWidth = document.querySelector("#scatter-container").clientWidth;
    var scatterRatio = 2 / 3;
    var scatterHeight = scatterWidth * scatterRatio;
    var scatterInnerWidth = scatterWidth - scatterMargins.left - scatterMargins.right;
    var scatterInnerHeight = scatterHeight - scatterMargins.top - scatterMargins.bottom;
    var scatterOverallSvg = d3.select("svg#scatter").attr("width", scatterWidth).attr("height", scatterHeight).append("g").attr("transform", "translate(".concat(scatterMargins.left, ",").concat(scatterMargins.top, ")"));
    var defs = scatterOverallSvg.append("defs");
    var filter = defs.append("filter").attr("id", "glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    var scatterScaleX = d3.scaleLinear() //.domain([0,maxPoints])
    .domain([0, 210]).range([0, scatterInnerWidth]);
    var scatterScaleY = d3.scaleLinear() //.domain([0,maxPoints])
    .domain([0, 190]).range([scatterInnerHeight, 0]);
    var tickPadding = 10;
    var xAxis = d3.axisBottom(scatterScaleX).tickValues([50, 100, 150]).tickPadding(tickPadding).tickSize(-scatterInnerHeight);
    var yAxis = d3.axisLeft(scatterScaleY).tickValues([50, 100, 150]).ticks(5).tickPadding(tickPadding).tickSize(-scatterInnerWidth);
    scatterOverallSvg.append("g").attr("class", "axis x-axis").attr("transform", "translate(0,".concat(scatterInnerHeight, ")")).call(xAxis);
    scatterOverallSvg.append("text").text("Search activity points").attr("x", scatterInnerWidth).attr("y", scatterInnerHeight + 20).attr("class", "x axis-title");
    scatterOverallSvg.append("text").text("Televoting points").attr("x", 0).attr("y", -40).attr("class", "y axis-title");
    scatterOverallSvg.append("g").attr("class", "axis y-axis").attr("transform", "translate(0,0)").call(yAxis);
    scatterOverallSvg.append("path").attr("d", "M".concat(scatterScaleX(10), ",").concat(scatterScaleY(0), " L").concat(scatterScaleX(210), ",").concat(scatterScaleY(0), " L").concat(scatterScaleX(210), ",").concat(scatterScaleY(200), " L").concat(scatterScaleX(10), ",").concat(scatterScaleY(0))).style("fill", "#ffffff").style("stroke", "#ffffff").style("stroke-width", 4).style("filter", "url(#glow)").style("opacity", 0.2);
    scatterOverallSvg.append("path").attr("d", "M".concat(scatterScaleX(0), ",").concat(scatterScaleY(10), " L").concat(scatterScaleX(190), ",").concat(scatterScaleY(200), " L").concat(scatterScaleX(0), ",").concat(scatterScaleY(200), " L").concat(scatterScaleX(0), ",").concat(scatterScaleY(10))).style("fill", "#ffffff").style("stroke", "#ffffff").style("stroke-width", 4).style("filter", "url(#glow)").style("opacity", 0.2);
    scatterOverallSvg.append("text").attr("x", scatterScaleX(150)).attr("y", scatterScaleY(30)).text("More search activity than televoting").style("fill", "#ffffff").style("text-anchor", "middle").attr("class", "annotation");
    scatterOverallSvg.append("text").attr("x", scatterScaleX(5)).attr("y", scatterScaleY(180)).text("More televoting than search activity").style("fill", "#ffffff").style("text-anchor", "start").attr("class", "annotation");
    scatterOverallSvg.selectAll("circle").data(pointsMean).enter().append("circle").attr("cx", function (d) {
      return scatterScaleX(d.value.searchpoints);
    }).attr("cy", function (d) {
      return scatterScaleY(d.value.votepoints);
    }).attr("r", 5).attr("class", "circle-mean").style("filter", "url(#glow)").attr("id", function (d) {
      return d.key;
    });
    var labelPadding = 2; //Component used to render labels

    var textLabel = (0, _d3fcLabelLayout.layoutTextLabel)().padding(labelPadding).value(function (d) {
      return grid[d.key].name;
    });
    var strategy = (0, _d3fcLabelLayout.layoutRemoveOverlaps)(); //Create the layout that positions the labels

    var labels = (0, _d3fcLabelLayout.layoutLabel)(strategy).size(function (d, i, g) {
      var textSize = g[i].getElementsByTagName('text')[0].getBBox();
      return [textSize.width + labelPadding * 2, textSize.height + labelPadding * 2];
    }).xScale(scatterScaleX).yScale(scatterScaleY).position(function (d) {
      return [d.value.searchpoints, d.value.votepoints];
    }).component(textLabel); //Render labels

    scatterOverallSvg.datum(pointsMean).call(labels); //Reposition labels to top

    scatterOverallSvg.selectAll("g.label text").attr("dx", function (d) {
      return -d3.select(this.parentNode).attr("layout-width") / 2;
    }).attr("dy", function (d) {
      return -d3.select(this.parentNode).attr("layout-height") / 2 - 3;
    });
    /*YEARLY SCATTER*/

    var maxSearchYearlyPoints = d3.max(points, function (d) {
      return d.searchpoints;
    });
    var maxVoteYearlyPoints = d3.max(points, function (d) {
      return d.votepoints;
    });
    var maxYearlyPoints = d3.max([maxSearchYearlyPoints, maxVoteYearlyPoints]);
    var scatterYearlySvg = d3.select("svg#scatteryearly").attr("width", scatterWidth).attr("height", scatterHeight).append("g").attr("transform", "translate(".concat(scatterMargins.left, ",").concat(scatterMargins.top, ")"));
    var scatterYearlyScaleX = d3.scaleLinear().domain([0, maxYearlyPoints]).range([0, scatterInnerWidth]);
    var scatterYearlyScaleY = d3.scaleLinear().domain([0, maxYearlyPoints]).range([scatterInnerHeight, 0]);
    var xYearlyAxis = d3.axisBottom(scatterYearlyScaleX).tickValues([100, 200, 300]).tickPadding(tickPadding).tickSize(-scatterInnerHeight);
    var yYearlyAxis = d3.axisLeft(scatterYearlyScaleY).tickValues([100, 200, 300]).ticks(5).tickPadding(tickPadding).tickSize(-scatterInnerWidth);
    scatterYearlySvg.append("path").attr("d", "M".concat(scatterYearlyScaleX(10), ",").concat(scatterYearlyScaleY(0), " L").concat(scatterYearlyScaleX(maxYearlyPoints), ",").concat(scatterYearlyScaleY(0), " L").concat(scatterYearlyScaleX(maxYearlyPoints), ",").concat(scatterYearlyScaleY(maxYearlyPoints - 10), " L").concat(scatterYearlyScaleX(10), ",").concat(scatterYearlyScaleY(0))).style("fill", "#ffffff").style("stroke", "#ffffff").style("stroke-width", 4).style("filter", "url(#glow)").style("opacity", 0.2);
    scatterYearlySvg.append("path").attr("d", "M".concat(scatterYearlyScaleX(0), ",").concat(scatterYearlyScaleY(10), " L").concat(scatterYearlyScaleX(maxYearlyPoints - 10), ",").concat(scatterYearlyScaleY(maxYearlyPoints), " L").concat(scatterYearlyScaleX(0), ",").concat(scatterYearlyScaleY(maxYearlyPoints), " L").concat(scatterYearlyScaleX(0), ",").concat(scatterYearlyScaleY(10))).style("fill", "#ffffff").style("stroke", "#ffffff").style("stroke-width", 4).style("filter", "url(#glow)").style("opacity", 0.2);
    scatterYearlySvg.append("g").attr("class", "axis x-axis").attr("transform", "translate(0,".concat(scatterInnerHeight, ")")).call(xYearlyAxis);
    scatterYearlySvg.append("text").text("Search activity points").attr("x", scatterInnerWidth).attr("y", scatterInnerHeight + 20).attr("class", "x axis-title");
    scatterYearlySvg.append("text").text("Televoting points").attr("x", 0).attr("y", -20).attr("class", "y axis-title");
    scatterYearlySvg.append("g").attr("class", "axis y-axis").attr("transform", "translate(0,0)").call(yYearlyAxis);
    var yearlyCircles = scatterYearlySvg.selectAll("circle").data(points).enter().append("circle").attr("cx", function (d) {
      return scatterYearlyScaleX(d.searchpoints);
    }).attr("cy", function (d) {
      return scatterYearlyScaleY(d.votepoints);
    }).attr("r", 2).attr("class", function (d) {
      return "circle-year circle-".concat(d.year, " circle-").concat(d.to);
    }).attr("id", function (d) {
      return d.key;
    });
    var yearTitle = scatterYearlySvg.append("text").attr("x", scatterInnerWidth / 2).attr("y", -16).text("2018").attr("class", "yearly-title");
    var winnerText = scatterYearlySvg.append("text").attr("x", scatterInnerWidth * 9 / 10).attr("y", 30).attr("class", "winner-highlight").text("Winner");
    var textLabelYearly = (0, _d3fcLabelLayout.layoutTextLabel)().padding(labelPadding).value(function (d) {
      return grid[d.to].name;
    });
    var labelsYearly = (0, _d3fcLabelLayout.layoutLabel)(strategy).size(function (d, i, g) {
      var textSize = g[i].getElementsByTagName('text')[0].getBBox();
      return [textSize.width + labelPadding * 2, textSize.height + labelPadding * 2];
    }).xScale(scatterYearlyScaleX).yScale(scatterYearlyScaleY).position(function (d) {
      return [d.searchpoints, d.votepoints];
    }).component(textLabelYearly);

    function highlightYear(yr) {
      scatterYearlySvg.selectAll("g.label text").transition().duration(1000).style("opacity", 0);
      winnerText.classed("winner-highlight", false);
      yearlyCircles.classed("winner-highlight", false).style("filter", "none").transition().duration(1000).attr("r", 4).style("opacity", 0.1);
      var winner = winners[yr]; //Sync winner animation

      requestAnimationFrame(function () {
        startAnimation();
      });

      var startAnimation = function startAnimation() {
        scatterYearlySvg.select(".circle-".concat(yr, ".circle-").concat(winner)).classed("winner-highlight", true);
        winnerText.classed("winner-highlight", true);
      };

      scatterYearlySvg.selectAll(".circle-" + yr).transition().duration(1000).attr("r", 10).style("opacity", 0.8).style("filter", "url(#glow)").on("end", function () {
        scatterYearlySvg.datum(points.filter(function (el) {
          return el.year == yr;
        })).call(labelsYearly);
        scatterYearlySvg.selectAll("g.label text").attr("dx", function (d) {
          return -d3.select(this.parentNode).attr("layout-width") / 2;
        }).attr("dy", function (d) {
          return -d3.select(this.parentNode).attr("layout-height") / 2 - 5;
        });
        scatterYearlySvg.selectAll("g.label text").transition().duration(500).style("opacity", 1);
      });
      yearTitle.text(yr);
    }

    highlightYear(2018);
    d3.select("input#slider").on("change", function () {
      highlightYear(this.value);
    });
    /*SCATTER PATTERNS*/

    var patternscatterMargins = {
      top: 200,
      right: 80,
      bottom: 60,
      left: 60
    };
    var patternscatterWidth = document.querySelector("#votingpattern-container").clientWidth;
    var patternscatterRatio = 3;
    var patternscatterHeight = patternscatterWidth * patternscatterRatio;
    var patternscatterInnerWidth = patternscatterWidth - patternscatterMargins.left - patternscatterMargins.right;
    var patternscatterInnerHeight = patternscatterHeight - patternscatterMargins.top - patternscatterMargins.bottom;
    var maxSearchPatternPoints = d3.max(patterns, function (d) {
      return d.search;
    });
    var maxVotePatternPoints = d3.max(patterns, function (d) {
      return d.tele;
    });
    var maxPatternPoints = d3.max([maxSearchPatternPoints, maxVotePatternPoints]);
    var scatterPatternSvg = d3.select("svg#votingpattern").attr("width", patternscatterWidth).attr("height", patternscatterHeight).append("g").attr("transform", "translate(".concat(patternscatterMargins.left, ",").concat(patternscatterMargins.top, ")"));
    var scatterPatternScaleX = d3.scaleLinear().domain([30, maxPatternPoints]).range([0, patternscatterInnerWidth]);
    var scatterPatternScaleY = d3.scaleLinear().domain([30, maxPatternPoints]).range([patternscatterInnerHeight, 0]);
    var xPatternAxis = d3.axisTop(scatterPatternScaleX).tickValues([50, 100]).tickSize(-patternscatterInnerHeight);
    var yPatternAxis = d3.axisLeft(scatterPatternScaleY).tickValues([50, 75, 100, 125]).ticks(5).tickPadding(10).tickSize(-patternscatterInnerWidth);
    scatterPatternSvg.append("g").attr("class", "axis x-axis").attr("transform", "translate(0,10)").call(xPatternAxis);
    scatterPatternSvg.append("text").text("MORE TELEVOTING POINTS").attr("x", scatterPatternScaleX(30) + 75).attr("y", 0).style("text-anchor", "end").attr("transform", "rotate(-90)").style("font-size", "0.7em").attr("class", "y axis-title");
    scatterPatternSvg.append("g").attr("class", "axis y-axis").attr("transform", "translate(0,0)").call(yPatternAxis);
    scatterPatternSvg.append("line").attr("x1", scatterPatternScaleX(0)).attr("x2", scatterPatternScaleX(200)).attr("y1", scatterPatternScaleY(0)).attr("y2", scatterPatternScaleY(200)).attr("class", "fourtyfive");
    var type = _d3SvgAnnotation.annotationCallout;
    var annotations = [{
      note: {
        label: "",
        padding: 0,
        wrap: 200
      },
      data: {
        search: 30.5,
        tele: maxPatternPoints + 3
      },
      dy: -1,
      dx: -190,
      connector: {
        end: "arrow"
      },
      color: "#ffffff"
    }, {
      note: {
        label: "LINE OF EQUAL SEARCH AND TELEVOTING POINTS",
        padding: 0
      },
      data: {
        search: maxPatternPoints + 3,
        tele: maxPatternPoints + 3
      },
      dy: -1,
      dx: -100,
      connector: {
        end: "arrow"
      },
      color: "#ffffff"
    }, {
      note: {
        label: "MORE SEARCH ACTIVITY",
        padding: 0
      },
      data: {
        search: 50,
        tele: maxPatternPoints + 3
      },
      dy: -1,
      dx: -50,
      connector: {
        end: "arrow"
      },
      color: "#ffffff"
    }, {
      note: {
        label: "The most consistent voting pattern, 141 points awarded over xx Contests",
        title: "Belarus to Russia"
      },
      data: {
        search: 119,
        tele: 141
      },
      dy: -1,
      dx: -180,
      connector: {
        end: "arrow"
      },
      subject: {},
      color: "#ffffff"
    }, {
      note: {
        label: "The most consistent search activity",
        title: "Cyprus to Greece"
      },
      data: {
        search: 142,
        tele: 140
      },
      dy: 200,
      dx: -1,
      subject: {},
      color: "#ffffff"
    }, {
      note: {
        label: "Moldova doesn't search much for Romanian candidates, but votes a lot for them",
        title: "Moldova to Romania"
      },
      data: {
        search: 66,
        tele: 137
      },
      dy: 100,
      dx: -1,
      subject: {},
      color: "#ffffff"
    }, {
      note: {
        label: "Romania returns the favour to Moldova, with slightly more search and a little less televoting",
        title: "Romania to Moldova"
      },
      data: {
        search: 88,
        tele: 118
      },
      dy: 50,
      dx: -1,
      subject: {},
      color: "#ffffff"
    }, {
      note: {
        label: "Sweden is often at the receiving end of televoting points awarded from other Nordic countries",
        title: "Finland to Sweden"
      },
      data: {
        search: 129,
        tele: 105
      },
      dy: 50,
      dx: 1,
      subject: {},
      color: "#ffffff"
    }, {
      note: {
        label: "A big Turkish diaspora drives searches and televoting from Germany and other countries like Belgium and France",
        title: "Germany to Turkey"
      },
      data: {
        search: 64,
        tele: 84
      },
      dy: 0,
      dx: 300,
      subject: {},
      color: "#ffffff"
    }, {
      note: {
        label: "A high search activity for Greek participants in Turkey does not result in many televoting points",
        title: "Turkey to Greece"
      },
      data: {
        search: 91,
        tele: 43
      },
      dy: -200,
      dx: 1,
      subject: {},
      color: "#ffffff"
    }, {
      note: {
        label: "A high search activity for Greek participants in Turkey does not result in many televoting points",
        title: "Turkey to Greece"
      },
      data: {
        search: 91,
        tele: 43
      },
      dy: -200,
      dx: 1,
      subject: {},
      color: "#ffffff"
    }, {
      note: {
        label: "The lowest televoting to search activity ratio is recorded by the Belgians, awarding points to France",
        title: "Belgium to France"
      },
      data: {
        search: 110,
        tele: 42
      },
      dy: 100,
      dx: 1,
      subject: {},
      color: "#ffffff"
    }];
    var makeAnnotations = (0, _d3SvgAnnotation.annotation)().notePadding(15).type(type).annotations(annotations).textWrap(150).accessors({
      x: function x(d) {
        return scatterPatternScaleX(d.search);
      },
      y: function y(d) {
        return scatterPatternScaleY(d.tele);
      }
    });
    scatterPatternSvg.append("g").attr("class", "annotation-group").call(makeAnnotations);
    d3.select(".annotations .annotation .annotation-connector").attr("transform", "rotate(-90)");
    var patternMarkers = scatterPatternSvg.selectAll("g.vote-icon").data(patterns).enter().append("g").attr("transform", function (d) {
      return "translate(".concat(scatterPatternScaleX(d.search) - (30 + countryheight) / 2, ",").concat(scatterPatternScaleY(d.tele) - countryheight / 2, ")");
    }).style("opacity", 1).style("filter", "url(#glow)");
    patternMarkers.append('path').attr("d", d3.symbol().type(d3.symbolTriangle)).attr("transform", "translate(26,12) rotate(90)").style("fill", "white");
    patternMarkers.append("image").attr("xlink:href", function (d) {
      return "assets/images/flags/" + d.from + ".svg";
    }).attr('width', countryheight).attr('height', countryheight);
    patternMarkers.append("image").attr("xlink:href", function (d) {
      return "assets/images/flags/" + d.to + ".svg";
    }).attr("x", 30).attr('width', countryheight).attr('height', countryheight);
  });
}

var _default = {
  init: init,
  resize: resize
};
exports.default = _default;
},{"flubber":"yVOz","d3fc-label-layout":"LUlz","d3-svg-annotation":"../../node_modules/d3-svg-annotation/indexRollupNext.js"}],"epB2":[function(require,module,exports) {
"use strict";

var _lodash = _interopRequireDefault(require("lodash.debounce"));

var _isMobile = _interopRequireDefault(require("./utils/is-mobile"));

var _graphic = _interopRequireDefault(require("./graphic"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global d3 */
//import footer from './footer';
var $body = d3.select('body');
var previousWidth = 0;

function resize() {
  // only do resize on width changes, not height
  // (remove the conditional if you want to trigger on height change)
  var width = $body.node().offsetWidth;

  if (previousWidth !== width) {
    previousWidth = width;

    _graphic.default.resize();
  }
}

function setupStickyHeader() {
  var $header = $body.select('header');

  if ($header.classed('is-sticky')) {
    var $menu = $body.select('.header__menu');
    var $toggle = $body.select('.header__toggle');
    $toggle.on('click', function () {
      var visible = $menu.classed('is-visible');
      $menu.classed('is-visible', !visible);
      $toggle.classed('is-visible', !visible);
    });
  }
}

function init() {
  // add mobile class to body tag
  $body.classed('is-mobile', _isMobile.default.any()); // setup resize event

  window.addEventListener('resize', (0, _lodash.default)(resize, 150)); // setup sticky header menu

  setupStickyHeader(); // kick off graphic code

  _graphic.default.init(); //footer.init();

}

init();
},{"lodash.debounce":"or4r","./utils/is-mobile":"WEtf","./graphic":"graphic.js"}]},{},["epB2"], null)
//# sourceMappingURL=/main.js.map