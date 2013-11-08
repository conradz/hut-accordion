;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Accordion = require('../'),
    events = require('chi-events'),
    create = require('chi-create'),
    document = window.document,
    counter = 1;

function $(selector) {
    return document.querySelector(selector);
}

var element = $('#my-accordion'),
    accordion = new Accordion(element);

events($('#select-more')).on('click', function() {
    accordion.select($('#more-section'));
});

events($('#collapse')).on('click', function() {
    accordion.select(null);
});

events($('#add-section')).on('click', function() {
    var num = counter++,
        section = create('div', { 'class': 'accordion-section' },
            create('header', { 'class': 'accordion-header' },
                create('h3', 'Section ' + num)),
            create('section', { 'class': 'accordion-content' },
                create('p', 'Section ' + num + ' content.')));

    element.appendChild(section);
});

events($('#remove-section')).on('click', function() {
    var sections = element.children;
    if (sections.length === 0) {
        return;
    }

    element.removeChild(sections[sections.length - 1]);
});

},{"../":2,"chi-create":5,"chi-events":8}],2:[function(require,module,exports){
'use strict';

var Emitter = require('emitter-component'),
    events = require('chi-events'),
    classes = require('chi-classes'),
    inheritPrototype = require('mout/lang/inheritPrototype');

module.exports = Accordion;

function Accordion(element) {
    Emitter.call(this);

    this.element = element;
    this.selected = null;
    this._sections = [];

    var self = this;
    events(element)
        .children('.accordion-header')
        .on('click', function(e) {
            e.preventDefault();

            var section = this.parentNode;
            self.toggle(section);
        });
}

inheritPrototype(Accordion, Emitter);

Accordion.prototype.toggle = function(section) {
    if (this.selected === section) {
        section = null;
    }

    this.select(section);
};

Accordion.prototype.select = function(section) {
    if (this.selected === section) {
        return;
    }

    if (this.selected !== null) {
        var current = this.selected;
        classes(current).remove('accordion-selected');
        classes(this.element).add('accordion-removing');
    } else {
        classes(this.element).remove('accordion-removing');
    }

    if (section) {
        classes(section).add('accordion-selected');
        this.selected = section;
    } else {
        this.selected = null;
    }

    this.emit('select', this.selected);
};

},{"chi-classes":3,"chi-events":8,"emitter-component":11,"mout/lang/inheritPrototype":27}],3:[function(require,module,exports){
var union = require('mout/array/union'),
    difference = require('mout/array/difference'),
    xor = require('mout/array/xor'),
    every = require('mout/array/every'),
    contains = require('mout/array/contains'),
    forEach = require('mout/array/forEach'),
    flatten = require('flatten-list');

var CLASS_SEP = /\s+/g;

function split(input) {
    return input ? input.split(CLASS_SEP) : [];
}

function modifier(action) {
    function modify(node) {
        var existing = split(node.className);
        node.className = action(existing, this).join(' ');
    }

    return function(classes) {
        classes = split(classes);
        forEach(this.nodes, modify, classes);

        return this;
    };
}

function ClassList(nodes) {
    this.nodes = nodes;
}

ClassList.prototype.add = modifier(union);
ClassList.prototype.remove = modifier(difference);
ClassList.prototype.toggle = modifier(xor);

ClassList.prototype.set = function(classes, value) {
    if (value) {
        this.add(classes);
    } else {
        this.remove(classes);
    }

    return this;
};

ClassList.prototype.has = function(classes) {
    classes = split(classes);

    return every(this.nodes, function(node) {
        var existing = split(node.className);
        return every(classes, function(c) { return contains(existing, c); });
    });
};

function classList() {
    return new ClassList(flatten(arguments));
}

module.exports = classList;

},{"flatten-list":4,"mout/array/contains":14,"mout/array/difference":15,"mout/array/every":16,"mout/array/forEach":18,"mout/array/union":21,"mout/array/xor":23}],4:[function(require,module,exports){
var isList;
if (typeof window !== 'undefined') {
    // Running in a browser
    isList = (function(window, Node) {
        return function(value) {
            return (
                value &&
                typeof value === 'object' &&
                typeof value.length === 'number' &&
                !(value instanceof Node) &&
                value !== window);
        }
    })(window, window.Node);
} else {
    // Running in non-browser environment
    isList = function(value) {
        return (
            value &&
            typeof value === 'object' &&
            typeof value.length === 'number');
    };
}


function add(array, value) {
    if (isList(value)) {
        for (var i = 0; i < value.length; i++) {
            add(array, value[i]);
        }
    } else {
        array.push(value);
    }
}

function flatten(value) {
    var items = [];
    add(items, value);
    return items;
}

module.exports = flatten;

},{}],5:[function(require,module,exports){
var forOwn = require('mout/object/forOwn'),
    forEach = require('mout/array/forEach'),
    isArray = require('mout/lang/isArray'),
    isPlainObject = require('mout/lang/isPlainObject');

var document = window.document,
    slice = Array.prototype.slice;

module.exports = create;

function create(tagName) {
    var tag = document.createElement(tagName);
    forEach(slice.call(arguments, 1), addContent, tag);

    return tag;
}

function addContent(value) {
    if (typeof value === 'string') {
        this.appendChild(document.createTextNode(value));
    } else if (isPlainObject(value)) {
        forOwn(value, setAttribute, this);
    } else if (isArray(value)) {
        forEach(value, addContent, this);
    } else {
        this.appendChild(value);
    }
}

function setAttribute(value, name) {
    this.setAttribute(name, value);
}

},{"mout/array/forEach":18,"mout/lang/isArray":28,"mout/lang/isPlainObject":30,"mout/object/forOwn":34}],6:[function(require,module,exports){
'use strict';

var matches = require('chi-matches');

module.exports = DelegateEvents;

function DelegateEvents(parent, filter) {
    this.parent = parent;
    this.filter = filter;
}

DelegateEvents.prototype.on = function(event, handler) {
    return this.parent.on(event, wrap(this.filter, handler));
};

DelegateEvents.prototype.once = function(event, handler) {
    var ref;
    function handle(e) {
        /*jshint validthis: true */
        ref.remove();
        return handler.call(this, e);
    }

    ref = this.on(event, handle);
    return ref;
};

function getFilter(filter) {
    if (typeof filter === 'function') {
        return filter;
    }

    return function(node) {
        return matches(node, filter);
    };
}

function wrap(filter, handler) {
    filter = getFilter(filter);

    function walk(parent, node, e) {
        if (parent === node) {
            return;
        } else if (filter(node)) {
            return handler.call(node, e);
        } else if (node.parentNode) {
            return walk(parent, node.parentNode, e);
        }
    }

    function wrapper(e) {
        /*jshint validthis: true */
        return walk(this, e.target, e);
    }

    return wrapper;
}

},{"chi-matches":9}],7:[function(require,module,exports){
'use strict';

// Fix bug that occurs in at least IE 9 and 10
// Some newly-created nodes will not fire events until they are added to an
// element. After they are added to an element, they will work even after they
// are removed.
//
// The fix is to create an empty container element. Before triggering an event
// on any element that does not have a parent, add the element to the container
// and immediately remove it.
//

var forEach = require('mout/array/forEach'),
    document = window.document;

module.exports = {
    check: check,
    fix: fix
};

function check(trigger) {
    var a = document.createElement('div'),
        called = false;

    // Check if click event works on new DOM element
    a.addEventListener('click', function() { called = true; }, false);
    trigger([a], 'click');
    if (called) {
        return false;
    }

    // Check if event works on element after it is added to another
    var b = document.createElement('div');
    b.appendChild(a);
    trigger([a], 'click');

    // If it works now, it has the bug
    return called;
}

function fix(trigger) {
    var container = document.createElement('div');

    function fixedTrigger(nodes, event) {
        // Initialize the nodes by adding and removing the nodes from the
        // container
        forEach(nodes, function(node) {
            if (node.parentNode === null) {
                container.appendChild(node);
                container.removeChild(node);
            }
        });

        return trigger(nodes, event);
    }

    return fixedTrigger;
}

},{"mout/array/forEach":18}],8:[function(require,module,exports){
'use strict';

var flatten = require('flatten-list'),
    forEach = require('mout/array/forEach'),
    ieBug = require('./ie-bug'),
    document = window.document,
    DelegateEvents = require('./delegate');

if (ieBug.check(trigger)) {
    trigger = ieBug.fix(trigger);
}

module.exports = events;
function events() {
    return new Events(flatten(arguments));
}

function Events(nodes) {
    this.nodes = nodes;
}

Events.prototype.on = function(event, handler) {
    return on(this.nodes, event, handler);
};

Events.prototype.trigger = function(event, detail) {
    return trigger(this.nodes, event, detail);
};

Events.prototype.once = function(event, handler) {
    var ref = this.on(event, wrapped);
    return ref;

    function wrapped(e) {
        /*jshint validthis: true */
        ref.remove();
        return handler.call(this, e);
    }
};

Events.prototype.children = function(filter) {
    return new DelegateEvents(this, filter);
};

function on(nodes, event, handler) {
    forEach(nodes, function(node) {
        node.addEventListener(event, handler, false);
    });

    function removeListener() {
        remove(nodes, event, handler);
    }

    return {
        remove: removeListener
    };
}

function remove(nodes, event, handler) {
    forEach(nodes, function(node) {
        node.removeEventListener(event, handler, false);
    });
}

function trigger(nodes, event) {
    var e = createEvent(event);
    forEach(nodes, function(node) {
        node.dispatchEvent(e);
    });
}

function createEvent(event) {
    var e = document.createEvent('Event');
    e.initEvent(event, true, true);
    return e;
}

},{"./delegate":6,"./ie-bug":7,"flatten-list":10,"mout/array/forEach":18}],9:[function(require,module,exports){
// Get the right method, including vendor prefixes
var proto = Element.prototype,
    method = (
        proto.matches ||
        proto.matchesSelector ||
        proto.mozMatchesSelector ||
        proto.msMatchesSelector ||
        proto.webkitMatchesSelector);

function matches(element, selector) {
    return method.call(element, selector);
}

// Work around IE 9 bug where it always returns false when not attached to
// another DOM node.

// Check if the bug exists in this browser
function checkBug() {
    // Check if it works on newly created node (fails in IE 9)
    var a = document.createElement('div');
    if (method.call(a, 'div')) {
        return false;
    }

    // Check if it works when node is appended to another node (works in IE 9)
    var b = document.createElement('div');
    a.appendChild(b);
    return method.call(b, 'div');
}

// Return a workaround function to fix the bug.
// Note that this will slow down matching, but only if the bug exists in this
// browser.
function workaround() {
    var node = document.createElement('div');

    function matches(element, selector) {
        if (method.call(element, selector)) {
            return true;
        } else if (!element.parentNode) {
            // If node is not attached, temporarily attach to node
            node.appendChild(element);
            var result = method.call(element, selector);
            node.removeChild(element);
            return result;
        } else {
            return false;
        }
    }

    return matches;
}

if (method) {
    module.exports = checkBug() ? workaround() : matches;
} else {
    // Not supported
    module.exports = null;
}
},{}],10:[function(require,module,exports){
module.exports=require(4)
},{}],11:[function(require,module,exports){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{"indexof":12}],12:[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],13:[function(require,module,exports){


    /**
     * Appends an array to the end of another.
     * The first array will be modified.
     */
    function append(arr1, arr2) {
        if (arr2 == null) {
            return arr1;
        }

        var pad = arr1.length,
            i = -1,
            len = arr2.length;
        while (++i < len) {
            arr1[pad + i] = arr2[i];
        }
        return arr1;
    }
    module.exports = append;


},{}],14:[function(require,module,exports){
var indexOf = require('./indexOf');

    /**
     * If array contains values.
     */
    function contains(arr, val) {
        return indexOf(arr, val) !== -1;
    }
    module.exports = contains;


},{"./indexOf":19}],15:[function(require,module,exports){
var unique = require('./unique');
var filter = require('./filter');
var some = require('./some');
var contains = require('./contains');


    /**
     * Return a new Array with elements that aren't present in the other Arrays.
     */
    function difference(arr) {
        var arrs = Array.prototype.slice.call(arguments, 1),
            result = filter(unique(arr), function(needle){
                return !some(arrs, function(haystack){
                    return contains(haystack, needle);
                });
            });
        return result;
    }

    module.exports = difference;



},{"./contains":14,"./filter":17,"./some":20,"./unique":22}],16:[function(require,module,exports){
var makeIterator = require('../function/makeIterator_');

    /**
     * Array every
     */
    function every(arr, callback, thisObj) {
        callback = makeIterator(callback, thisObj);
        var result = true;
        if (arr == null) {
            return result;
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if (!callback(arr[i], i, arr) ) {
                result = false;
                break;
            }
        }

        return result;
    }

    module.exports = every;


},{"../function/makeIterator_":24}],17:[function(require,module,exports){
var makeIterator = require('../function/makeIterator_');

    /**
     * Array filter
     */
    function filter(arr, callback, thisObj) {
        callback = makeIterator(callback, thisObj);
        var results = [];
        if (arr == null) {
            return results;
        }

        var i = -1, len = arr.length, value;
        while (++i < len) {
            value = arr[i];
            if (callback(value, i, arr)) {
                results.push(value);
            }
        }

        return results;
    }

    module.exports = filter;



},{"../function/makeIterator_":24}],18:[function(require,module,exports){


    /**
     * Array forEach
     */
    function forEach(arr, callback, thisObj) {
        if (arr == null) {
            return;
        }
        var i = -1,
            len = arr.length;
        while (++i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if ( callback.call(thisObj, arr[i], i, arr) === false ) {
                break;
            }
        }
    }

    module.exports = forEach;



},{}],19:[function(require,module,exports){


    /**
     * Array.indexOf
     */
    function indexOf(arr, item, fromIndex) {
        fromIndex = fromIndex || 0;
        if (arr == null) {
            return -1;
        }

        var len = arr.length,
            i = fromIndex < 0 ? len + fromIndex : fromIndex;
        while (i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if (arr[i] === item) {
                return i;
            }

            i++;
        }

        return -1;
    }

    module.exports = indexOf;


},{}],20:[function(require,module,exports){
var makeIterator = require('../function/makeIterator_');

    /**
     * Array some
     */
    function some(arr, callback, thisObj) {
        callback = makeIterator(callback, thisObj);
        var result = false;
        if (arr == null) {
            return result;
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if ( callback(arr[i], i, arr) ) {
                result = true;
                break;
            }
        }

        return result;
    }

    module.exports = some;


},{"../function/makeIterator_":24}],21:[function(require,module,exports){
var unique = require('./unique');
var append = require('./append');

    /**
     * Concat multiple arrays and remove duplicates
     */
    function union(arrs) {
        var results = [];
        var i = -1, len = arguments.length;
        while (++i < len) {
            append(results, arguments[i]);
        }

        return unique(results);
    }

    module.exports = union;



},{"./append":13,"./unique":22}],22:[function(require,module,exports){
var indexOf = require('./indexOf');
var filter = require('./filter');

    /**
     * @return {array} Array of unique items
     */
    function unique(arr){
        return filter(arr, isUnique);
    }

    function isUnique(item, i, arr){
        return indexOf(arr, item, i+1) === -1;
    }

    module.exports = unique;



},{"./filter":17,"./indexOf":19}],23:[function(require,module,exports){
var unique = require('./unique');
var filter = require('./filter');
var contains = require('./contains');


    /**
     * Exclusive OR. Returns items that are present in a single array.
     * - like ptyhon's `symmetric_difference`
     */
    function xor(arr1, arr2) {
        arr1 = unique(arr1);
        arr2 = unique(arr2);

        var a1 = filter(arr1, function(item){
                return !contains(arr2, item);
            }),
            a2 = filter(arr2, function(item){
                return !contains(arr1, item);
            });

        return a1.concat(a2);
    }

    module.exports = xor;



},{"./contains":14,"./filter":17,"./unique":22}],24:[function(require,module,exports){
var prop = require('./prop');
var deepMatches = require('../object/deepMatches');

    /**
     * Converts argument into a valid iterator.
     * Used internally on most array/object/collection methods that receives a
     * callback/iterator providing a shortcut syntax.
     */
    function makeIterator(src, thisObj){
        switch(typeof src) {
            case 'function':
                // function is the first to improve perf (most common case)
                return (typeof thisObj !== 'undefined')? function(val, i, arr){
                    return src.call(thisObj, val, i, arr);
                } : src;
            case 'object':
                // typeof null == "object"
                return (src != null)? function(val){
                    return deepMatches(val, src);
                } : src;
            case 'string':
            case 'number':
                return prop(src);
            default:
                return src;
        }
    }

    module.exports = makeIterator;



},{"../object/deepMatches":32,"./prop":25}],25:[function(require,module,exports){


    /**
     * Returns a function that gets a property of the passed object
     */
    function prop(name){
        return function(obj){
            return obj[name];
        };
    }

    module.exports = prop;



},{}],26:[function(require,module,exports){
var mixIn = require('../object/mixIn');

    /**
     * Create Object using prototypal inheritance and setting custom properties.
     * - Mix between Douglas Crockford Prototypal Inheritance <http://javascript.crockford.com/prototypal.html> and the EcmaScript 5 `Object.create()` method.
     * @param {object} parent    Parent Object.
     * @param {object} [props] Object properties.
     * @return {object} Created object.
     */
    function createObject(parent, props){
        function F(){}
        F.prototype = parent;
        return mixIn(new F(), props);

    }
    module.exports = createObject;



},{"../object/mixIn":36}],27:[function(require,module,exports){
var createObject = require('./createObject');

    /**
    * Inherit prototype from another Object.
    * - inspired by Nicholas Zackas <http://nczonline.net> Solution
    * @param {object} child Child object
    * @param {object} parent    Parent Object
    */
    function inheritPrototype(child, parent){
        var p = createObject(parent.prototype);
        p.constructor = child;
        child.prototype = p;
        child.super_ = parent;
    }

    module.exports = inheritPrototype;


},{"./createObject":26}],28:[function(require,module,exports){
var isKind = require('./isKind');
    /**
     */
    var isArray = Array.isArray || function (val) {
        return isKind(val, 'Array');
    };
    module.exports = isArray;


},{"./isKind":29}],29:[function(require,module,exports){
var kindOf = require('./kindOf');
    /**
     * Check if value is from a specific "kind".
     */
    function isKind(val, kind){
        return kindOf(val) === kind;
    }
    module.exports = isKind;


},{"./kindOf":31}],30:[function(require,module,exports){


    /**
     * Checks if the value is created by the `Object` constructor.
     */
    function isPlainObject(value) {
        return (!!value && typeof value === 'object' &&
            value.constructor === Object);
    }

    module.exports = isPlainObject;



},{}],31:[function(require,module,exports){


    var _rKind = /^\[object (.*)\]$/,
        _toString = Object.prototype.toString,
        UNDEF;

    /**
     * Gets the "kind" of value. (e.g. "String", "Number", etc)
     */
    function kindOf(val) {
        if (val === null) {
            return 'Null';
        } else if (val === UNDEF) {
            return 'Undefined';
        } else {
            return _rKind.exec( _toString.call(val) )[1];
        }
    }
    module.exports = kindOf;


},{}],32:[function(require,module,exports){
var forOwn = require('./forOwn');
var isArray = require('../lang/isArray');

    function containsMatch(array, pattern) {
        var i = -1, length = array.length;
        while (++i < length) {
            if (deepMatches(array[i], pattern)) {
                return true;
            }
        }

        return false;
    }

    function matchArray(target, pattern) {
        var i = -1, patternLength = pattern.length;
        while (++i < patternLength) {
            if (!containsMatch(target, pattern[i])) {
                return false;
            }
        }

        return true;
    }

    function matchObject(target, pattern) {
        var result = true;
        forOwn(pattern, function(val, key) {
            if (!deepMatches(target[key], val)) {
                // Return false to break out of forOwn early
                return (result = false);
            }
        });

        return result;
    }

    /**
     * Recursively check if the objects match.
     */
    function deepMatches(target, pattern){
        if (target && typeof target === 'object') {
            if (isArray(target) && isArray(pattern)) {
                return matchArray(target, pattern);
            } else {
                return matchObject(target, pattern);
            }
        } else {
            return target === pattern;
        }
    }

    module.exports = deepMatches;



},{"../lang/isArray":28,"./forOwn":34}],33:[function(require,module,exports){


    var _hasDontEnumBug,
        _dontEnums;

    function checkDontEnum(){
        _dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ];

        _hasDontEnumBug = true;

        for (var key in {'toString': null}) {
            _hasDontEnumBug = false;
        }
    }

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forIn(obj, fn, thisObj){
        var key, i = 0;
        // no need to check if argument is a real object that way we can use
        // it for arrays, functions, date, etc.

        //post-pone check till needed
        if (_hasDontEnumBug == null) checkDontEnum();

        for (key in obj) {
            if (exec(fn, obj, key, thisObj) === false) {
                break;
            }
        }

        if (_hasDontEnumBug) {
            while (key = _dontEnums[i++]) {
                // since we aren't using hasOwn check we need to make sure the
                // property was overwritten
                if (obj[key] !== Object.prototype[key]) {
                    if (exec(fn, obj, key, thisObj) === false) {
                        break;
                    }
                }
            }
        }
    }

    function exec(fn, obj, key, thisObj){
        return fn.call(thisObj, obj[key], key, obj);
    }

    module.exports = forIn;



},{}],34:[function(require,module,exports){
var hasOwn = require('./hasOwn');
var forIn = require('./forIn');

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forOwn(obj, fn, thisObj){
        forIn(obj, function(val, key){
            if (hasOwn(obj, key)) {
                return fn.call(thisObj, obj[key], key, obj);
            }
        });
    }

    module.exports = forOwn;



},{"./forIn":33,"./hasOwn":35}],35:[function(require,module,exports){


    /**
     * Safer Object.hasOwnProperty
     */
     function hasOwn(obj, prop){
         return Object.prototype.hasOwnProperty.call(obj, prop);
     }

     module.exports = hasOwn;



},{}],36:[function(require,module,exports){
var forOwn = require('./forOwn');

    /**
    * Combine properties from all the objects into first one.
    * - This method affects target object in place, if you want to create a new Object pass an empty object as first param.
    * @param {object} target    Target Object
    * @param {...object} objects    Objects to be combined (0...n objects).
    * @return {object} Target Object.
    */
    function mixIn(target, objects){
        var i = 0,
            n = arguments.length,
            obj;
        while(++i < n){
            obj = arguments[i];
            if (obj != null) {
                forOwn(obj, copyProp, target);
            }
        }
        return target;
    }

    function copyProp(val, key){
        this[key] = val;
    }

    module.exports = mixIn;


},{"./forOwn":34}]},{},[1])
;