/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 344:
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
     true ? factory(exports) :
    0;
})(this, (function (exports) { 'use strict';

    exports.PipsMode = void 0;
    (function (PipsMode) {
        PipsMode["Range"] = "range";
        PipsMode["Steps"] = "steps";
        PipsMode["Positions"] = "positions";
        PipsMode["Count"] = "count";
        PipsMode["Values"] = "values";
    })(exports.PipsMode || (exports.PipsMode = {}));
    exports.PipsType = void 0;
    (function (PipsType) {
        PipsType[PipsType["None"] = -1] = "None";
        PipsType[PipsType["NoValue"] = 0] = "NoValue";
        PipsType[PipsType["LargeValue"] = 1] = "LargeValue";
        PipsType[PipsType["SmallValue"] = 2] = "SmallValue";
    })(exports.PipsType || (exports.PipsType = {}));
    //region Helper Methods
    function isValidFormatter(entry) {
        return isValidPartialFormatter(entry) && typeof entry.from === "function";
    }
    function isValidPartialFormatter(entry) {
        // partial formatters only need a to function and not a from function
        return typeof entry === "object" && typeof entry.to === "function";
    }
    function removeElement(el) {
        el.parentElement.removeChild(el);
    }
    function isSet(value) {
        return value !== null && value !== undefined;
    }
    // Bindable version
    function preventDefault(e) {
        e.preventDefault();
    }
    // Removes duplicates from an array.
    function unique(array) {
        return array.filter(function (a) {
            return !this[a] ? (this[a] = true) : false;
        }, {});
    }
    // Round a value to the closest 'to'.
    function closest(value, to) {
        return Math.round(value / to) * to;
    }
    // Current position of an element relative to the document.
    function offset(elem, orientation) {
        var rect = elem.getBoundingClientRect();
        var doc = elem.ownerDocument;
        var docElem = doc.documentElement;
        var pageOffset = getPageOffset(doc);
        // getBoundingClientRect contains left scroll in Chrome on Android.
        // I haven't found a feature detection that proves this. Worst case
        // scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
        if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) {
            pageOffset.x = 0;
        }
        return orientation ? rect.top + pageOffset.y - docElem.clientTop : rect.left + pageOffset.x - docElem.clientLeft;
    }
    // Checks whether a value is numerical.
    function isNumeric(a) {
        return typeof a === "number" && !isNaN(a) && isFinite(a);
    }
    // Sets a class and removes it after [duration] ms.
    function addClassFor(element, className, duration) {
        if (duration > 0) {
            addClass(element, className);
            setTimeout(function () {
                removeClass(element, className);
            }, duration);
        }
    }
    // Limits a value to 0 - 100
    function limit(a) {
        return Math.max(Math.min(a, 100), 0);
    }
    // Wraps a variable as an array, if it isn't one yet.
    // Note that an input array is returned by reference!
    function asArray(a) {
        return Array.isArray(a) ? a : [a];
    }
    // Counts decimals
    function countDecimals(numStr) {
        numStr = String(numStr);
        var pieces = numStr.split(".");
        return pieces.length > 1 ? pieces[1].length : 0;
    }
    // http://youmightnotneedjquery.com/#add_class
    function addClass(el, className) {
        if (el.classList && !/\s/.test(className)) {
            el.classList.add(className);
        }
        else {
            el.className += " " + className;
        }
    }
    // http://youmightnotneedjquery.com/#remove_class
    function removeClass(el, className) {
        if (el.classList && !/\s/.test(className)) {
            el.classList.remove(className);
        }
        else {
            el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
        }
    }
    // https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
    function hasClass(el, className) {
        return el.classList ? el.classList.contains(className) : new RegExp("\\b" + className + "\\b").test(el.className);
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
    function getPageOffset(doc) {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = (doc.compatMode || "") === "CSS1Compat";
        var x = supportPageOffset
            ? window.pageXOffset
            : isCSS1Compat
                ? doc.documentElement.scrollLeft
                : doc.body.scrollLeft;
        var y = supportPageOffset
            ? window.pageYOffset
            : isCSS1Compat
                ? doc.documentElement.scrollTop
                : doc.body.scrollTop;
        return {
            x: x,
            y: y,
        };
    }
    // we provide a function to compute constants instead
    // of accessing window.* as soon as the module needs it
    // so that we do not compute anything if not needed
    function getActions() {
        // Determine the events to bind. IE11 implements pointerEvents without
        // a prefix, which breaks compatibility with the IE10 implementation.
        return window.navigator.pointerEnabled
            ? {
                start: "pointerdown",
                move: "pointermove",
                end: "pointerup",
            }
            : window.navigator.msPointerEnabled
                ? {
                    start: "MSPointerDown",
                    move: "MSPointerMove",
                    end: "MSPointerUp",
                }
                : {
                    start: "mousedown touchstart",
                    move: "mousemove touchmove",
                    end: "mouseup touchend",
                };
    }
    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
    // Issue #785
    function getSupportsPassive() {
        var supportsPassive = false;
        /* eslint-disable */
        try {
            var opts = Object.defineProperty({}, "passive", {
                get: function () {
                    supportsPassive = true;
                },
            });
            // @ts-ignore
            window.addEventListener("test", null, opts);
        }
        catch (e) { }
        /* eslint-enable */
        return supportsPassive;
    }
    function getSupportsTouchActionNone() {
        return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
    }
    //endregion
    //region Range Calculation
    // Determine the size of a sub-range in relation to a full range.
    function subRangeRatio(pa, pb) {
        return 100 / (pb - pa);
    }
    // (percentage) How many percent is this value of this range?
    function fromPercentage(range, value, startRange) {
        return (value * 100) / (range[startRange + 1] - range[startRange]);
    }
    // (percentage) Where is this value on this range?
    function toPercentage(range, value) {
        return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0], 0);
    }
    // (value) How much is this percentage on this range?
    function isPercentage(range, value) {
        return (value * (range[1] - range[0])) / 100 + range[0];
    }
    function getJ(value, arr) {
        var j = 1;
        while (value >= arr[j]) {
            j += 1;
        }
        return j;
    }
    // (percentage) Input a value, find where, on a scale of 0-100, it applies.
    function toStepping(xVal, xPct, value) {
        if (value >= xVal.slice(-1)[0]) {
            return 100;
        }
        var j = getJ(value, xVal);
        var va = xVal[j - 1];
        var vb = xVal[j];
        var pa = xPct[j - 1];
        var pb = xPct[j];
        return pa + toPercentage([va, vb], value) / subRangeRatio(pa, pb);
    }
    // (value) Input a percentage, find where it is on the specified range.
    function fromStepping(xVal, xPct, value) {
        // There is no range group that fits 100
        if (value >= 100) {
            return xVal.slice(-1)[0];
        }
        var j = getJ(value, xPct);
        var va = xVal[j - 1];
        var vb = xVal[j];
        var pa = xPct[j - 1];
        var pb = xPct[j];
        return isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb));
    }
    // (percentage) Get the step that applies at a certain value.
    function getStep(xPct, xSteps, snap, value) {
        if (value === 100) {
            return value;
        }
        var j = getJ(value, xPct);
        var a = xPct[j - 1];
        var b = xPct[j];
        // If 'snap' is set, steps are used as fixed points on the slider.
        if (snap) {
            // Find the closest position, a or b.
            if (value - a > (b - a) / 2) {
                return b;
            }
            return a;
        }
        if (!xSteps[j - 1]) {
            return value;
        }
        return xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1]);
    }
    //endregion
    //region Spectrum
    var Spectrum = /** @class */ (function () {
        function Spectrum(entry, snap, singleStep) {
            this.xPct = [];
            this.xVal = [];
            this.xSteps = [];
            this.xNumSteps = [];
            this.xHighestCompleteStep = [];
            this.xSteps = [singleStep || false];
            this.xNumSteps = [false];
            this.snap = snap;
            var index;
            var ordered = [];
            // Map the object keys to an array.
            Object.keys(entry).forEach(function (index) {
                ordered.push([asArray(entry[index]), index]);
            });
            // Sort all entries by value (numeric sort).
            ordered.sort(function (a, b) {
                return a[0][0] - b[0][0];
            });
            // Convert all entries to subranges.
            for (index = 0; index < ordered.length; index++) {
                this.handleEntryPoint(ordered[index][1], ordered[index][0]);
            }
            // Store the actual step values.
            // xSteps is sorted in the same order as xPct and xVal.
            this.xNumSteps = this.xSteps.slice(0);
            // Convert all numeric steps to the percentage of the subrange they represent.
            for (index = 0; index < this.xNumSteps.length; index++) {
                this.handleStepPoint(index, this.xNumSteps[index]);
            }
        }
        Spectrum.prototype.getDistance = function (value) {
            var distances = [];
            for (var index = 0; index < this.xNumSteps.length - 1; index++) {
                distances[index] = fromPercentage(this.xVal, value, index);
            }
            return distances;
        };
        // Calculate the percentual distance over the whole scale of ranges.
        // direction: 0 = backwards / 1 = forwards
        Spectrum.prototype.getAbsoluteDistance = function (value, distances, direction) {
            var xPct_index = 0;
            // Calculate range where to start calculation
            if (value < this.xPct[this.xPct.length - 1]) {
                while (value > this.xPct[xPct_index + 1]) {
                    xPct_index++;
                }
            }
            else if (value === this.xPct[this.xPct.length - 1]) {
                xPct_index = this.xPct.length - 2;
            }
            // If looking backwards and the value is exactly at a range separator then look one range further
            if (!direction && value === this.xPct[xPct_index + 1]) {
                xPct_index++;
            }
            if (distances === null) {
                distances = [];
            }
            var start_factor;
            var rest_factor = 1;
            var rest_rel_distance = distances[xPct_index];
            var range_pct = 0;
            var rel_range_distance = 0;
            var abs_distance_counter = 0;
            var range_counter = 0;
            // Calculate what part of the start range the value is
            if (direction) {
                start_factor = (value - this.xPct[xPct_index]) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
            }
            else {
                start_factor = (this.xPct[xPct_index + 1] - value) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
            }
            // Do until the complete distance across ranges is calculated
            while (rest_rel_distance > 0) {
                // Calculate the percentage of total range
                range_pct = this.xPct[xPct_index + 1 + range_counter] - this.xPct[xPct_index + range_counter];
                // Detect if the margin, padding or limit is larger then the current range and calculate
                if (distances[xPct_index + range_counter] * rest_factor + 100 - start_factor * 100 > 100) {
                    // If larger then take the percentual distance of the whole range
                    rel_range_distance = range_pct * start_factor;
                    // Rest factor of relative percentual distance still to be calculated
                    rest_factor = (rest_rel_distance - 100 * start_factor) / distances[xPct_index + range_counter];
                    // Set start factor to 1 as for next range it does not apply.
                    start_factor = 1;
                }
                else {
                    // If smaller or equal then take the percentual distance of the calculate percentual part of that range
                    rel_range_distance = ((distances[xPct_index + range_counter] * range_pct) / 100) * rest_factor;
                    // No rest left as the rest fits in current range
                    rest_factor = 0;
                }
                if (direction) {
                    abs_distance_counter = abs_distance_counter - rel_range_distance;
                    // Limit range to first range when distance becomes outside of minimum range
                    if (this.xPct.length + range_counter >= 1) {
                        range_counter--;
                    }
                }
                else {
                    abs_distance_counter = abs_distance_counter + rel_range_distance;
                    // Limit range to last range when distance becomes outside of maximum range
                    if (this.xPct.length - range_counter >= 1) {
                        range_counter++;
                    }
                }
                // Rest of relative percentual distance still to be calculated
                rest_rel_distance = distances[xPct_index + range_counter] * rest_factor;
            }
            return value + abs_distance_counter;
        };
        Spectrum.prototype.toStepping = function (value) {
            value = toStepping(this.xVal, this.xPct, value);
            return value;
        };
        Spectrum.prototype.fromStepping = function (value) {
            return fromStepping(this.xVal, this.xPct, value);
        };
        Spectrum.prototype.getStep = function (value) {
            value = getStep(this.xPct, this.xSteps, this.snap, value);
            return value;
        };
        Spectrum.prototype.getDefaultStep = function (value, isDown, size) {
            var j = getJ(value, this.xPct);
            // When at the top or stepping down, look at the previous sub-range
            if (value === 100 || (isDown && value === this.xPct[j - 1])) {
                j = Math.max(j - 1, 1);
            }
            return (this.xVal[j] - this.xVal[j - 1]) / size;
        };
        Spectrum.prototype.getNearbySteps = function (value) {
            var j = getJ(value, this.xPct);
            return {
                stepBefore: {
                    startValue: this.xVal[j - 2],
                    step: this.xNumSteps[j - 2],
                    highestStep: this.xHighestCompleteStep[j - 2],
                },
                thisStep: {
                    startValue: this.xVal[j - 1],
                    step: this.xNumSteps[j - 1],
                    highestStep: this.xHighestCompleteStep[j - 1],
                },
                stepAfter: {
                    startValue: this.xVal[j],
                    step: this.xNumSteps[j],
                    highestStep: this.xHighestCompleteStep[j],
                },
            };
        };
        Spectrum.prototype.countStepDecimals = function () {
            var stepDecimals = this.xNumSteps.map(countDecimals);
            return Math.max.apply(null, stepDecimals);
        };
        Spectrum.prototype.hasNoSize = function () {
            return this.xVal[0] === this.xVal[this.xVal.length - 1];
        };
        // Outside testing
        Spectrum.prototype.convert = function (value) {
            return this.getStep(this.toStepping(value));
        };
        Spectrum.prototype.handleEntryPoint = function (index, value) {
            var percentage;
            // Covert min/max syntax to 0 and 100.
            if (index === "min") {
                percentage = 0;
            }
            else if (index === "max") {
                percentage = 100;
            }
            else {
                percentage = parseFloat(index);
            }
            // Check for correct input.
            if (!isNumeric(percentage) || !isNumeric(value[0])) {
                throw new Error("noUiSlider: 'range' value isn't numeric.");
            }
            // Store values.
            this.xPct.push(percentage);
            this.xVal.push(value[0]);
            var value1 = Number(value[1]);
            // NaN will evaluate to false too, but to keep
            // logging clear, set step explicitly. Make sure
            // not to override the 'step' setting with false.
            if (!percentage) {
                if (!isNaN(value1)) {
                    this.xSteps[0] = value1;
                }
            }
            else {
                this.xSteps.push(isNaN(value1) ? false : value1);
            }
            this.xHighestCompleteStep.push(0);
        };
        Spectrum.prototype.handleStepPoint = function (i, n) {
            // Ignore 'false' stepping.
            if (!n) {
                return;
            }
            // Step over zero-length ranges (#948);
            if (this.xVal[i] === this.xVal[i + 1]) {
                this.xSteps[i] = this.xHighestCompleteStep[i] = this.xVal[i];
                return;
            }
            // Factor to range ratio
            this.xSteps[i] =
                fromPercentage([this.xVal[i], this.xVal[i + 1]], n, 0) / subRangeRatio(this.xPct[i], this.xPct[i + 1]);
            var totalSteps = (this.xVal[i + 1] - this.xVal[i]) / this.xNumSteps[i];
            var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
            var step = this.xVal[i] + this.xNumSteps[i] * highestStep;
            this.xHighestCompleteStep[i] = step;
        };
        return Spectrum;
    }());
    //endregion
    //region Options
    /*	Every input option is tested and parsed. This will prevent
        endless validation in internal methods. These tests are
        structured with an item for every option available. An
        option can be marked as required by setting the 'r' flag.
        The testing function is provided with three arguments:
            - The provided value for the option;
            - A reference to the options object;
            - The name for the option;

        The testing function returns false when an error is detected,
        or true when everything is OK. It can also modify the option
        object, to make sure all values can be correctly looped elsewhere. */
    //region Defaults
    var defaultFormatter = {
        to: function (value) {
            return value === undefined ? "" : value.toFixed(2);
        },
        from: Number,
    };
    var cssClasses = {
        target: "target",
        base: "base",
        origin: "origin",
        handle: "handle",
        handleLower: "handle-lower",
        handleUpper: "handle-upper",
        touchArea: "touch-area",
        horizontal: "horizontal",
        vertical: "vertical",
        background: "background",
        connect: "connect",
        connects: "connects",
        ltr: "ltr",
        rtl: "rtl",
        textDirectionLtr: "txt-dir-ltr",
        textDirectionRtl: "txt-dir-rtl",
        draggable: "draggable",
        drag: "state-drag",
        tap: "state-tap",
        active: "active",
        tooltip: "tooltip",
        pips: "pips",
        pipsHorizontal: "pips-horizontal",
        pipsVertical: "pips-vertical",
        marker: "marker",
        markerHorizontal: "marker-horizontal",
        markerVertical: "marker-vertical",
        markerNormal: "marker-normal",
        markerLarge: "marker-large",
        markerSub: "marker-sub",
        value: "value",
        valueHorizontal: "value-horizontal",
        valueVertical: "value-vertical",
        valueNormal: "value-normal",
        valueLarge: "value-large",
        valueSub: "value-sub",
    };
    // Namespaces of internal event listeners
    var INTERNAL_EVENT_NS = {
        tooltips: ".__tooltips",
        aria: ".__aria",
    };
    //endregion
    function testStep(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider: 'step' is not numeric.");
        }
        // The step option can still be used to set stepping
        // for linear sliders. Overwritten if set in 'range'.
        parsed.singleStep = entry;
    }
    function testKeyboardPageMultiplier(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");
        }
        parsed.keyboardPageMultiplier = entry;
    }
    function testKeyboardMultiplier(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
        }
        parsed.keyboardMultiplier = entry;
    }
    function testKeyboardDefaultStep(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
        }
        parsed.keyboardDefaultStep = entry;
    }
    function testRange(parsed, entry) {
        // Filter incorrect input.
        if (typeof entry !== "object" || Array.isArray(entry)) {
            throw new Error("noUiSlider: 'range' is not an object.");
        }
        // Catch missing start or end.
        if (entry.min === undefined || entry.max === undefined) {
            throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
        }
        parsed.spectrum = new Spectrum(entry, parsed.snap || false, parsed.singleStep);
    }
    function testStart(parsed, entry) {
        entry = asArray(entry);
        // Validate input. Values aren't tested, as the public .val method
        // will always provide a valid location.
        if (!Array.isArray(entry) || !entry.length) {
            throw new Error("noUiSlider: 'start' option is incorrect.");
        }
        // Store the number of handles.
        parsed.handles = entry.length;
        // When the slider is initialized, the .val method will
        // be called with the start options.
        parsed.start = entry;
    }
    function testSnap(parsed, entry) {
        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider: 'snap' option must be a boolean.");
        }
        // Enforce 100% stepping within subranges.
        parsed.snap = entry;
    }
    function testAnimate(parsed, entry) {
        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider: 'animate' option must be a boolean.");
        }
        // Enforce 100% stepping within subranges.
        parsed.animate = entry;
    }
    function testAnimationDuration(parsed, entry) {
        if (typeof entry !== "number") {
            throw new Error("noUiSlider: 'animationDuration' option must be a number.");
        }
        parsed.animationDuration = entry;
    }
    function testConnect(parsed, entry) {
        var connect = [false];
        var i;
        // Map legacy options
        if (entry === "lower") {
            entry = [true, false];
        }
        else if (entry === "upper") {
            entry = [false, true];
        }
        // Handle boolean options
        if (entry === true || entry === false) {
            for (i = 1; i < parsed.handles; i++) {
                connect.push(entry);
            }
            connect.push(false);
        }
        // Reject invalid input
        else if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) {
            throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
        }
        else {
            connect = entry;
        }
        parsed.connect = connect;
    }
    function testOrientation(parsed, entry) {
        // Set orientation to an a numerical value for easy
        // array selection.
        switch (entry) {
            case "horizontal":
                parsed.ort = 0;
                break;
            case "vertical":
                parsed.ort = 1;
                break;
            default:
                throw new Error("noUiSlider: 'orientation' option is invalid.");
        }
    }
    function testMargin(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider: 'margin' option must be numeric.");
        }
        // Issue #582
        if (entry === 0) {
            return;
        }
        parsed.margin = parsed.spectrum.getDistance(entry);
    }
    function testLimit(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider: 'limit' option must be numeric.");
        }
        parsed.limit = parsed.spectrum.getDistance(entry);
        if (!parsed.limit || parsed.handles < 2) {
            throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.");
        }
    }
    function testPadding(parsed, entry) {
        var index;
        if (!isNumeric(entry) && !Array.isArray(entry)) {
            throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
        }
        if (Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1]))) {
            throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
        }
        if (entry === 0) {
            return;
        }
        if (!Array.isArray(entry)) {
            entry = [entry, entry];
        }
        // 'getDistance' returns false for invalid values.
        parsed.padding = [parsed.spectrum.getDistance(entry[0]), parsed.spectrum.getDistance(entry[1])];
        for (index = 0; index < parsed.spectrum.xNumSteps.length - 1; index++) {
            // last "range" can't contain step size as it is purely an endpoint.
            if (parsed.padding[0][index] < 0 || parsed.padding[1][index] < 0) {
                throw new Error("noUiSlider: 'padding' option must be a positive number(s).");
            }
        }
        var totalPadding = entry[0] + entry[1];
        var firstValue = parsed.spectrum.xVal[0];
        var lastValue = parsed.spectrum.xVal[parsed.spectrum.xVal.length - 1];
        if (totalPadding / (lastValue - firstValue) > 1) {
            throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.");
        }
    }
    function testDirection(parsed, entry) {
        // Set direction as a numerical value for easy parsing.
        // Invert connection for RTL sliders, so that the proper
        // handles get the connect/background classes.
        switch (entry) {
            case "ltr":
                parsed.dir = 0;
                break;
            case "rtl":
                parsed.dir = 1;
                break;
            default:
                throw new Error("noUiSlider: 'direction' option was not recognized.");
        }
    }
    function testBehaviour(parsed, entry) {
        // Make sure the input is a string.
        if (typeof entry !== "string") {
            throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
        }
        // Check if the string contains any keywords.
        // None are required.
        var tap = entry.indexOf("tap") >= 0;
        var drag = entry.indexOf("drag") >= 0;
        var fixed = entry.indexOf("fixed") >= 0;
        var snap = entry.indexOf("snap") >= 0;
        var hover = entry.indexOf("hover") >= 0;
        var unconstrained = entry.indexOf("unconstrained") >= 0;
        var dragAll = entry.indexOf("drag-all") >= 0;
        var smoothSteps = entry.indexOf("smooth-steps") >= 0;
        if (fixed) {
            if (parsed.handles !== 2) {
                throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
            }
            // Use margin to enforce fixed state
            testMargin(parsed, parsed.start[1] - parsed.start[0]);
        }
        if (unconstrained && (parsed.margin || parsed.limit)) {
            throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
        }
        parsed.events = {
            tap: tap || snap,
            drag: drag,
            dragAll: dragAll,
            smoothSteps: smoothSteps,
            fixed: fixed,
            snap: snap,
            hover: hover,
            unconstrained: unconstrained,
        };
    }
    function testTooltips(parsed, entry) {
        if (entry === false) {
            return;
        }
        if (entry === true || isValidPartialFormatter(entry)) {
            parsed.tooltips = [];
            for (var i = 0; i < parsed.handles; i++) {
                parsed.tooltips.push(entry);
            }
        }
        else {
            entry = asArray(entry);
            if (entry.length !== parsed.handles) {
                throw new Error("noUiSlider: must pass a formatter for all handles.");
            }
            entry.forEach(function (formatter) {
                if (typeof formatter !== "boolean" && !isValidPartialFormatter(formatter)) {
                    throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
                }
            });
            parsed.tooltips = entry;
        }
    }
    function testHandleAttributes(parsed, entry) {
        if (entry.length !== parsed.handles) {
            throw new Error("noUiSlider: must pass a attributes for all handles.");
        }
        parsed.handleAttributes = entry;
    }
    function testAriaFormat(parsed, entry) {
        if (!isValidPartialFormatter(entry)) {
            throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
        }
        parsed.ariaFormat = entry;
    }
    function testFormat(parsed, entry) {
        if (!isValidFormatter(entry)) {
            throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
        }
        parsed.format = entry;
    }
    function testKeyboardSupport(parsed, entry) {
        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
        }
        parsed.keyboardSupport = entry;
    }
    function testDocumentElement(parsed, entry) {
        // This is an advanced option. Passed values are used without validation.
        parsed.documentElement = entry;
    }
    function testCssPrefix(parsed, entry) {
        if (typeof entry !== "string" && entry !== false) {
            throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
        }
        parsed.cssPrefix = entry;
    }
    function testCssClasses(parsed, entry) {
        if (typeof entry !== "object") {
            throw new Error("noUiSlider: 'cssClasses' must be an object.");
        }
        if (typeof parsed.cssPrefix === "string") {
            parsed.cssClasses = {};
            Object.keys(entry).forEach(function (key) {
                parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
            });
        }
        else {
            parsed.cssClasses = entry;
        }
    }
    // Test all developer settings and parse to assumption-safe values.
    function testOptions(options) {
        // To prove a fix for #537, freeze options here.
        // If the object is modified, an error will be thrown.
        // Object.freeze(options);
        var parsed = {
            margin: null,
            limit: null,
            padding: null,
            animate: true,
            animationDuration: 300,
            ariaFormat: defaultFormatter,
            format: defaultFormatter,
        };
        // Tests are executed in the order they are presented here.
        var tests = {
            step: { r: false, t: testStep },
            keyboardPageMultiplier: { r: false, t: testKeyboardPageMultiplier },
            keyboardMultiplier: { r: false, t: testKeyboardMultiplier },
            keyboardDefaultStep: { r: false, t: testKeyboardDefaultStep },
            start: { r: true, t: testStart },
            connect: { r: true, t: testConnect },
            direction: { r: true, t: testDirection },
            snap: { r: false, t: testSnap },
            animate: { r: false, t: testAnimate },
            animationDuration: { r: false, t: testAnimationDuration },
            range: { r: true, t: testRange },
            orientation: { r: false, t: testOrientation },
            margin: { r: false, t: testMargin },
            limit: { r: false, t: testLimit },
            padding: { r: false, t: testPadding },
            behaviour: { r: true, t: testBehaviour },
            ariaFormat: { r: false, t: testAriaFormat },
            format: { r: false, t: testFormat },
            tooltips: { r: false, t: testTooltips },
            keyboardSupport: { r: true, t: testKeyboardSupport },
            documentElement: { r: false, t: testDocumentElement },
            cssPrefix: { r: true, t: testCssPrefix },
            cssClasses: { r: true, t: testCssClasses },
            handleAttributes: { r: false, t: testHandleAttributes },
        };
        var defaults = {
            connect: false,
            direction: "ltr",
            behaviour: "tap",
            orientation: "horizontal",
            keyboardSupport: true,
            cssPrefix: "noUi-",
            cssClasses: cssClasses,
            keyboardPageMultiplier: 5,
            keyboardMultiplier: 1,
            keyboardDefaultStep: 10,
        };
        // AriaFormat defaults to regular format, if any.
        if (options.format && !options.ariaFormat) {
            options.ariaFormat = options.format;
        }
        // Run all options through a testing mechanism to ensure correct
        // input. It should be noted that options might get modified to
        // be handled properly. E.g. wrapping integers in arrays.
        Object.keys(tests).forEach(function (name) {
            // If the option isn't set, but it is required, throw an error.
            if (!isSet(options[name]) && defaults[name] === undefined) {
                if (tests[name].r) {
                    throw new Error("noUiSlider: '" + name + "' is required.");
                }
                return;
            }
            tests[name].t(parsed, !isSet(options[name]) ? defaults[name] : options[name]);
        });
        // Forward pips options
        parsed.pips = options.pips;
        // All recent browsers accept unprefixed transform.
        // We need -ms- for IE9 and -webkit- for older Android;
        // Assume use of -webkit- if unprefixed and -ms- are not supported.
        // https://caniuse.com/#feat=transforms2d
        var d = document.createElement("div");
        var msPrefix = d.style.msTransform !== undefined;
        var noPrefix = d.style.transform !== undefined;
        parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";
        // Pips don't move, so we can place them using left/top.
        var styles = [
            ["left", "top"],
            ["right", "bottom"],
        ];
        parsed.style = styles[parsed.dir][parsed.ort];
        return parsed;
    }
    //endregion
    function scope(target, options, originalOptions) {
        var actions = getActions();
        var supportsTouchActionNone = getSupportsTouchActionNone();
        var supportsPassive = supportsTouchActionNone && getSupportsPassive();
        // All variables local to 'scope' are prefixed with 'scope_'
        // Slider DOM Nodes
        var scope_Target = target;
        var scope_Base;
        var scope_Handles;
        var scope_Connects;
        var scope_Pips;
        var scope_Tooltips;
        // Slider state values
        var scope_Spectrum = options.spectrum;
        var scope_Values = [];
        var scope_Locations = [];
        var scope_HandleNumbers = [];
        var scope_ActiveHandlesCount = 0;
        var scope_Events = {};
        // Document Nodes
        var scope_Document = target.ownerDocument;
        var scope_DocumentElement = options.documentElement || scope_Document.documentElement;
        var scope_Body = scope_Document.body;
        // For horizontal sliders in standard ltr documents,
        // make .noUi-origin overflow to the left so the document doesn't scroll.
        var scope_DirOffset = scope_Document.dir === "rtl" || options.ort === 1 ? 0 : 100;
        // Creates a node, adds it to target, returns the new node.
        function addNodeTo(addTarget, className) {
            var div = scope_Document.createElement("div");
            if (className) {
                addClass(div, className);
            }
            addTarget.appendChild(div);
            return div;
        }
        // Append a origin to the base
        function addOrigin(base, handleNumber) {
            var origin = addNodeTo(base, options.cssClasses.origin);
            var handle = addNodeTo(origin, options.cssClasses.handle);
            addNodeTo(handle, options.cssClasses.touchArea);
            handle.setAttribute("data-handle", String(handleNumber));
            if (options.keyboardSupport) {
                // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
                // 0 = focusable and reachable
                handle.setAttribute("tabindex", "0");
                handle.addEventListener("keydown", function (event) {
                    return eventKeydown(event, handleNumber);
                });
            }
            if (options.handleAttributes !== undefined) {
                var attributes_1 = options.handleAttributes[handleNumber];
                Object.keys(attributes_1).forEach(function (attribute) {
                    handle.setAttribute(attribute, attributes_1[attribute]);
                });
            }
            handle.setAttribute("role", "slider");
            handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal");
            if (handleNumber === 0) {
                addClass(handle, options.cssClasses.handleLower);
            }
            else if (handleNumber === options.handles - 1) {
                addClass(handle, options.cssClasses.handleUpper);
            }
            return origin;
        }
        // Insert nodes for connect elements
        function addConnect(base, add) {
            if (!add) {
                return false;
            }
            return addNodeTo(base, options.cssClasses.connect);
        }
        // Add handles to the slider base.
        function addElements(connectOptions, base) {
            var connectBase = addNodeTo(base, options.cssClasses.connects);
            scope_Handles = [];
            scope_Connects = [];
            scope_Connects.push(addConnect(connectBase, connectOptions[0]));
            // [::::O====O====O====]
            // connectOptions = [0, 1, 1, 1]
            for (var i = 0; i < options.handles; i++) {
                // Keep a list of all added handles.
                scope_Handles.push(addOrigin(base, i));
                scope_HandleNumbers[i] = i;
                scope_Connects.push(addConnect(connectBase, connectOptions[i + 1]));
            }
        }
        // Initialize a single slider.
        function addSlider(addTarget) {
            // Apply classes and data to the target.
            addClass(addTarget, options.cssClasses.target);
            if (options.dir === 0) {
                addClass(addTarget, options.cssClasses.ltr);
            }
            else {
                addClass(addTarget, options.cssClasses.rtl);
            }
            if (options.ort === 0) {
                addClass(addTarget, options.cssClasses.horizontal);
            }
            else {
                addClass(addTarget, options.cssClasses.vertical);
            }
            var textDirection = getComputedStyle(addTarget).direction;
            if (textDirection === "rtl") {
                addClass(addTarget, options.cssClasses.textDirectionRtl);
            }
            else {
                addClass(addTarget, options.cssClasses.textDirectionLtr);
            }
            return addNodeTo(addTarget, options.cssClasses.base);
        }
        function addTooltip(handle, handleNumber) {
            if (!options.tooltips || !options.tooltips[handleNumber]) {
                return false;
            }
            return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
        }
        function isSliderDisabled() {
            return scope_Target.hasAttribute("disabled");
        }
        // Disable the slider dragging if any handle is disabled
        function isHandleDisabled(handleNumber) {
            var handleOrigin = scope_Handles[handleNumber];
            return handleOrigin.hasAttribute("disabled");
        }
        function removeTooltips() {
            if (scope_Tooltips) {
                removeEvent("update" + INTERNAL_EVENT_NS.tooltips);
                scope_Tooltips.forEach(function (tooltip) {
                    if (tooltip) {
                        removeElement(tooltip);
                    }
                });
                scope_Tooltips = null;
            }
        }
        // The tooltips option is a shorthand for using the 'update' event.
        function tooltips() {
            removeTooltips();
            // Tooltips are added with options.tooltips in original order.
            scope_Tooltips = scope_Handles.map(addTooltip);
            bindEvent("update" + INTERNAL_EVENT_NS.tooltips, function (values, handleNumber, unencoded) {
                if (!scope_Tooltips || !options.tooltips) {
                    return;
                }
                if (scope_Tooltips[handleNumber] === false) {
                    return;
                }
                var formattedValue = values[handleNumber];
                if (options.tooltips[handleNumber] !== true) {
                    formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
                }
                scope_Tooltips[handleNumber].innerHTML = formattedValue;
            });
        }
        function aria() {
            removeEvent("update" + INTERNAL_EVENT_NS.aria);
            bindEvent("update" + INTERNAL_EVENT_NS.aria, function (values, handleNumber, unencoded, tap, positions) {
                // Update Aria Values for all handles, as a change in one changes min and max values for the next.
                scope_HandleNumbers.forEach(function (index) {
                    var handle = scope_Handles[index];
                    var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
                    var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);
                    var now = positions[index];
                    // Formatted value for display
                    var text = String(options.ariaFormat.to(unencoded[index]));
                    // Map to slider range values
                    min = scope_Spectrum.fromStepping(min).toFixed(1);
                    max = scope_Spectrum.fromStepping(max).toFixed(1);
                    now = scope_Spectrum.fromStepping(now).toFixed(1);
                    handle.children[0].setAttribute("aria-valuemin", min);
                    handle.children[0].setAttribute("aria-valuemax", max);
                    handle.children[0].setAttribute("aria-valuenow", now);
                    handle.children[0].setAttribute("aria-valuetext", text);
                });
            });
        }
        function getGroup(pips) {
            // Use the range.
            if (pips.mode === exports.PipsMode.Range || pips.mode === exports.PipsMode.Steps) {
                return scope_Spectrum.xVal;
            }
            if (pips.mode === exports.PipsMode.Count) {
                if (pips.values < 2) {
                    throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
                }
                // Divide 0 - 100 in 'count' parts.
                var interval = pips.values - 1;
                var spread = 100 / interval;
                var values = [];
                // List these parts and have them handled as 'positions'.
                while (interval--) {
                    values[interval] = interval * spread;
                }
                values.push(100);
                return mapToRange(values, pips.stepped);
            }
            if (pips.mode === exports.PipsMode.Positions) {
                // Map all percentages to on-range values.
                return mapToRange(pips.values, pips.stepped);
            }
            if (pips.mode === exports.PipsMode.Values) {
                // If the value must be stepped, it needs to be converted to a percentage first.
                if (pips.stepped) {
                    return pips.values.map(function (value) {
                        // Convert to percentage, apply step, return to value.
                        return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
                    });
                }
                // Otherwise, we can simply use the values.
                return pips.values;
            }
            return []; // pips.mode = never
        }
        function mapToRange(values, stepped) {
            return values.map(function (value) {
                return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
            });
        }
        function generateSpread(pips) {
            function safeIncrement(value, increment) {
                // Avoid floating point variance by dropping the smallest decimal places.
                return Number((value + increment).toFixed(7));
            }
            var group = getGroup(pips);
            var indexes = {};
            var firstInRange = scope_Spectrum.xVal[0];
            var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1];
            var ignoreFirst = false;
            var ignoreLast = false;
            var prevPct = 0;
            // Create a copy of the group, sort it and filter away all duplicates.
            group = unique(group.slice().sort(function (a, b) {
                return a - b;
            }));
            // Make sure the range starts with the first element.
            if (group[0] !== firstInRange) {
                group.unshift(firstInRange);
                ignoreFirst = true;
            }
            // Likewise for the last one.
            if (group[group.length - 1] !== lastInRange) {
                group.push(lastInRange);
                ignoreLast = true;
            }
            group.forEach(function (current, index) {
                // Get the current step and the lower + upper positions.
                var step;
                var i;
                var q;
                var low = current;
                var high = group[index + 1];
                var newPct;
                var pctDifference;
                var pctPos;
                var type;
                var steps;
                var realSteps;
                var stepSize;
                var isSteps = pips.mode === exports.PipsMode.Steps;
                // When using 'steps' mode, use the provided steps.
                // Otherwise, we'll step on to the next subrange.
                if (isSteps) {
                    step = scope_Spectrum.xNumSteps[index];
                }
                // Default to a 'full' step.
                if (!step) {
                    step = high - low;
                }
                // If high is undefined we are at the last subrange. Make sure it iterates once (#1088)
                if (high === undefined) {
                    high = low;
                }
                // Make sure step isn't 0, which would cause an infinite loop (#654)
                step = Math.max(step, 0.0000001);
                // Find all steps in the subrange.
                for (i = low; i <= high; i = safeIncrement(i, step)) {
                    // Get the percentage value for the current step,
                    // calculate the size for the subrange.
                    newPct = scope_Spectrum.toStepping(i);
                    pctDifference = newPct - prevPct;
                    steps = pctDifference / (pips.density || 1);
                    realSteps = Math.round(steps);
                    // This ratio represents the amount of percentage-space a point indicates.
                    // For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-divided.
                    // Round the percentage offset to an even number, then divide by two
                    // to spread the offset on both sides of the range.
                    stepSize = pctDifference / realSteps;
                    // Divide all points evenly, adding the correct number to this subrange.
                    // Run up to <= so that 100% gets a point, event if ignoreLast is set.
                    for (q = 1; q <= realSteps; q += 1) {
                        // The ratio between the rounded value and the actual size might be ~1% off.
                        // Correct the percentage offset by the number of points
                        // per subrange. density = 1 will result in 100 points on the
                        // full range, 2 for 50, 4 for 25, etc.
                        pctPos = prevPct + q * stepSize;
                        indexes[pctPos.toFixed(5)] = [scope_Spectrum.fromStepping(pctPos), 0];
                    }
                    // Determine the point type.
                    type = group.indexOf(i) > -1 ? exports.PipsType.LargeValue : isSteps ? exports.PipsType.SmallValue : exports.PipsType.NoValue;
                    // Enforce the 'ignoreFirst' option by overwriting the type for 0.
                    if (!index && ignoreFirst && i !== high) {
                        type = 0;
                    }
                    if (!(i === high && ignoreLast)) {
                        // Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
                        indexes[newPct.toFixed(5)] = [i, type];
                    }
                    // Update the percentage count.
                    prevPct = newPct;
                }
            });
            return indexes;
        }
        function addMarking(spread, filterFunc, formatter) {
            var _a, _b;
            var element = scope_Document.createElement("div");
            var valueSizeClasses = (_a = {},
                _a[exports.PipsType.None] = "",
                _a[exports.PipsType.NoValue] = options.cssClasses.valueNormal,
                _a[exports.PipsType.LargeValue] = options.cssClasses.valueLarge,
                _a[exports.PipsType.SmallValue] = options.cssClasses.valueSub,
                _a);
            var markerSizeClasses = (_b = {},
                _b[exports.PipsType.None] = "",
                _b[exports.PipsType.NoValue] = options.cssClasses.markerNormal,
                _b[exports.PipsType.LargeValue] = options.cssClasses.markerLarge,
                _b[exports.PipsType.SmallValue] = options.cssClasses.markerSub,
                _b);
            var valueOrientationClasses = [options.cssClasses.valueHorizontal, options.cssClasses.valueVertical];
            var markerOrientationClasses = [options.cssClasses.markerHorizontal, options.cssClasses.markerVertical];
            addClass(element, options.cssClasses.pips);
            addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);
            function getClasses(type, source) {
                var a = source === options.cssClasses.value;
                var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
                var sizeClasses = a ? valueSizeClasses : markerSizeClasses;
                return source + " " + orientationClasses[options.ort] + " " + sizeClasses[type];
            }
            function addSpread(offset, value, type) {
                // Apply the filter function, if it is set.
                type = filterFunc ? filterFunc(value, type) : type;
                if (type === exports.PipsType.None) {
                    return;
                }
                // Add a marker for every point
                var node = addNodeTo(element, false);
                node.className = getClasses(type, options.cssClasses.marker);
                node.style[options.style] = offset + "%";
                // Values are only appended for points marked '1' or '2'.
                if (type > exports.PipsType.NoValue) {
                    node = addNodeTo(element, false);
                    node.className = getClasses(type, options.cssClasses.value);
                    node.setAttribute("data-value", String(value));
                    node.style[options.style] = offset + "%";
                    node.innerHTML = String(formatter.to(value));
                }
            }
            // Append all points.
            Object.keys(spread).forEach(function (offset) {
                addSpread(offset, spread[offset][0], spread[offset][1]);
            });
            return element;
        }
        function removePips() {
            if (scope_Pips) {
                removeElement(scope_Pips);
                scope_Pips = null;
            }
        }
        function pips(pips) {
            // Fix #669
            removePips();
            var spread = generateSpread(pips);
            var filter = pips.filter;
            var format = pips.format || {
                to: function (value) {
                    return String(Math.round(value));
                },
            };
            scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));
            return scope_Pips;
        }
        // Shorthand for base dimensions.
        function baseSize() {
            var rect = scope_Base.getBoundingClientRect();
            var alt = ("offset" + ["Width", "Height"][options.ort]);
            return options.ort === 0 ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
        }
        // Handler for attaching events trough a proxy.
        function attachEvent(events, element, callback, data) {
            // This function can be used to 'filter' events to the slider.
            // element is a node, not a nodeList
            var method = function (event) {
                var e = fixEvent(event, data.pageOffset, data.target || element);
                // fixEvent returns false if this event has a different target
                // when handling (multi-) touch events;
                if (!e) {
                    return false;
                }
                // doNotReject is passed by all end events to make sure released touches
                // are not rejected, leaving the slider "stuck" to the cursor;
                if (isSliderDisabled() && !data.doNotReject) {
                    return false;
                }
                // Stop if an active 'tap' transition is taking place.
                if (hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject) {
                    return false;
                }
                // Ignore right or middle clicks on start #454
                if (events === actions.start && e.buttons !== undefined && e.buttons > 1) {
                    return false;
                }
                // Ignore right or middle clicks on start #454
                if (data.hover && e.buttons) {
                    return false;
                }
                // 'supportsPassive' is only true if a browser also supports touch-action: none in CSS.
                // iOS safari does not, so it doesn't get to benefit from passive scrolling. iOS does support
                // touch-action: manipulation, but that allows panning, which breaks
                // sliders after zooming/on non-responsive pages.
                // See: https://bugs.webkit.org/show_bug.cgi?id=133112
                if (!supportsPassive) {
                    e.preventDefault();
                }
                e.calcPoint = e.points[options.ort];
                // Call the event handler with the event [ and additional data ].
                callback(e, data);
                return;
            };
            var methods = [];
            // Bind a closure on the target for every event type.
            events.split(" ").forEach(function (eventName) {
                element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
                methods.push([eventName, method]);
            });
            return methods;
        }
        // Provide a clean event with standardized offset values.
        function fixEvent(e, pageOffset, eventTarget) {
            // Filter the event to register the type, which can be
            // touch, mouse or pointer. Offset changes need to be
            // made on an event specific basis.
            var touch = e.type.indexOf("touch") === 0;
            var mouse = e.type.indexOf("mouse") === 0;
            var pointer = e.type.indexOf("pointer") === 0;
            var x = 0;
            var y = 0;
            // IE10 implemented pointer events with a prefix;
            if (e.type.indexOf("MSPointer") === 0) {
                pointer = true;
            }
            // Erroneous events seem to be passed in occasionally on iOS/iPadOS after user finishes interacting with
            // the slider. They appear to be of type MouseEvent, yet they don't have usual properties set. Ignore
            // events that have no touches or buttons associated with them. (#1057, #1079, #1095)
            if (e.type === "mousedown" && !e.buttons && !e.touches) {
                return false;
            }
            // The only thing one handle should be concerned about is the touches that originated on top of it.
            if (touch) {
                // Returns true if a touch originated on the target.
                var isTouchOnTarget = function (checkTouch) {
                    var target = checkTouch.target;
                    return (target === eventTarget ||
                        eventTarget.contains(target) ||
                        (e.composed && e.composedPath().shift() === eventTarget));
                };
                // In the case of touchstart events, we need to make sure there is still no more than one
                // touch on the target so we look amongst all touches.
                if (e.type === "touchstart") {
                    var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);
                    // Do not support more than one touch per handle.
                    if (targetTouches.length > 1) {
                        return false;
                    }
                    x = targetTouches[0].pageX;
                    y = targetTouches[0].pageY;
                }
                else {
                    // In the other cases, find on changedTouches is enough.
                    var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);
                    // Cancel if the target touch has not moved.
                    if (!targetTouch) {
                        return false;
                    }
                    x = targetTouch.pageX;
                    y = targetTouch.pageY;
                }
            }
            pageOffset = pageOffset || getPageOffset(scope_Document);
            if (mouse || pointer) {
                x = e.clientX + pageOffset.x;
                y = e.clientY + pageOffset.y;
            }
            e.pageOffset = pageOffset;
            e.points = [x, y];
            e.cursor = mouse || pointer; // Fix #435
            return e;
        }
        // Translate a coordinate in the document to a percentage on the slider
        function calcPointToPercentage(calcPoint) {
            var location = calcPoint - offset(scope_Base, options.ort);
            var proposal = (location * 100) / baseSize();
            // Clamp proposal between 0% and 100%
            // Out-of-bound coordinates may occur when .noUi-base pseudo-elements
            // are used (e.g. contained handles feature)
            proposal = limit(proposal);
            return options.dir ? 100 - proposal : proposal;
        }
        // Find handle closest to a certain percentage on the slider
        function getClosestHandle(clickedPosition) {
            var smallestDifference = 100;
            var handleNumber = false;
            scope_Handles.forEach(function (handle, index) {
                // Disabled handles are ignored
                if (isHandleDisabled(index)) {
                    return;
                }
                var handlePosition = scope_Locations[index];
                var differenceWithThisHandle = Math.abs(handlePosition - clickedPosition);
                // Initial state
                var clickAtEdge = differenceWithThisHandle === 100 && smallestDifference === 100;
                // Difference with this handle is smaller than the previously checked handle
                var isCloser = differenceWithThisHandle < smallestDifference;
                var isCloserAfter = differenceWithThisHandle <= smallestDifference && clickedPosition > handlePosition;
                if (isCloser || isCloserAfter || clickAtEdge) {
                    handleNumber = index;
                    smallestDifference = differenceWithThisHandle;
                }
            });
            return handleNumber;
        }
        // Fire 'end' when a mouse or pen leaves the document.
        function documentLeave(event, data) {
            if (event.type === "mouseout" &&
                event.target.nodeName === "HTML" &&
                event.relatedTarget === null) {
                eventEnd(event, data);
            }
        }
        // Handle movement on document for handle and range drag.
        function eventMove(event, data) {
            // Fix #498
            // Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
            // https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
            // IE9 has .buttons and .which zero on mousemove.
            // Firefox breaks the spec MDN defines.
            if (navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0) {
                return eventEnd(event, data);
            }
            // Check if we are moving up or down
            var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);
            // Convert the movement into a percentage of the slider width/height
            var proposal = (movement * 100) / data.baseSize;
            moveHandles(movement > 0, proposal, data.locations, data.handleNumbers, data.connect);
        }
        // Unbind move events on document, call callbacks.
        function eventEnd(event, data) {
            // The handle is no longer active, so remove the class.
            if (data.handle) {
                removeClass(data.handle, options.cssClasses.active);
                scope_ActiveHandlesCount -= 1;
            }
            // Unbind the move and end events, which are added on 'start'.
            data.listeners.forEach(function (c) {
                scope_DocumentElement.removeEventListener(c[0], c[1]);
            });
            if (scope_ActiveHandlesCount === 0) {
                // Remove dragging class.
                removeClass(scope_Target, options.cssClasses.drag);
                setZindex();
                // Remove cursor styles and text-selection events bound to the body.
                if (event.cursor) {
                    scope_Body.style.cursor = "";
                    scope_Body.removeEventListener("selectstart", preventDefault);
                }
            }
            if (options.events.smoothSteps) {
                data.handleNumbers.forEach(function (handleNumber) {
                    setHandle(handleNumber, scope_Locations[handleNumber], true, true, false, false);
                });
                data.handleNumbers.forEach(function (handleNumber) {
                    fireEvent("update", handleNumber);
                });
            }
            data.handleNumbers.forEach(function (handleNumber) {
                fireEvent("change", handleNumber);
                fireEvent("set", handleNumber);
                fireEvent("end", handleNumber);
            });
        }
        // Bind move events on document.
        function eventStart(event, data) {
            // Ignore event if any handle is disabled
            if (data.handleNumbers.some(isHandleDisabled)) {
                return;
            }
            var handle;
            if (data.handleNumbers.length === 1) {
                var handleOrigin = scope_Handles[data.handleNumbers[0]];
                handle = handleOrigin.children[0];
                scope_ActiveHandlesCount += 1;
                // Mark the handle as 'active' so it can be styled.
                addClass(handle, options.cssClasses.active);
            }
            // A drag should never propagate up to the 'tap' event.
            event.stopPropagation();
            // Record the event listeners.
            var listeners = [];
            // Attach the move and end events.
            var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
                // The event target has changed so we need to propagate the original one so that we keep
                // relying on it to extract target touches.
                target: event.target,
                handle: handle,
                connect: data.connect,
                listeners: listeners,
                startCalcPoint: event.calcPoint,
                baseSize: baseSize(),
                pageOffset: event.pageOffset,
                handleNumbers: data.handleNumbers,
                buttonsProperty: event.buttons,
                locations: scope_Locations.slice(),
            });
            var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
                target: event.target,
                handle: handle,
                listeners: listeners,
                doNotReject: true,
                handleNumbers: data.handleNumbers,
            });
            var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
                target: event.target,
                handle: handle,
                listeners: listeners,
                doNotReject: true,
                handleNumbers: data.handleNumbers,
            });
            // We want to make sure we pushed the listeners in the listener list rather than creating
            // a new one as it has already been passed to the event handlers.
            listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));
            // Text selection isn't an issue on touch devices,
            // so adding cursor styles can be skipped.
            if (event.cursor) {
                // Prevent the 'I' cursor and extend the range-drag cursor.
                scope_Body.style.cursor = getComputedStyle(event.target).cursor;
                // Mark the target with a dragging state.
                if (scope_Handles.length > 1) {
                    addClass(scope_Target, options.cssClasses.drag);
                }
                // Prevent text selection when dragging the handles.
                // In noUiSlider <= 9.2.0, this was handled by calling preventDefault on mouse/touch start/move,
                // which is scroll blocking. The selectstart event is supported by FireFox starting from version 52,
                // meaning the only holdout is iOS Safari. This doesn't matter: text selection isn't triggered there.
                // The 'cursor' flag is false.
                // See: http://caniuse.com/#search=selectstart
                scope_Body.addEventListener("selectstart", preventDefault, false);
            }
            data.handleNumbers.forEach(function (handleNumber) {
                fireEvent("start", handleNumber);
            });
        }
        // Move closest handle to tapped location.
        function eventTap(event) {
            // The tap event shouldn't propagate up
            event.stopPropagation();
            var proposal = calcPointToPercentage(event.calcPoint);
            var handleNumber = getClosestHandle(proposal);
            // Tackle the case that all handles are 'disabled'.
            if (handleNumber === false) {
                return;
            }
            // Flag the slider as it is now in a transitional state.
            // Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
            if (!options.events.snap) {
                addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
            }
            setHandle(handleNumber, proposal, true, true);
            setZindex();
            fireEvent("slide", handleNumber, true);
            fireEvent("update", handleNumber, true);
            if (!options.events.snap) {
                fireEvent("change", handleNumber, true);
                fireEvent("set", handleNumber, true);
            }
            else {
                eventStart(event, { handleNumbers: [handleNumber] });
            }
        }
        // Fires a 'hover' event for a hovered mouse/pen position.
        function eventHover(event) {
            var proposal = calcPointToPercentage(event.calcPoint);
            var to = scope_Spectrum.getStep(proposal);
            var value = scope_Spectrum.fromStepping(to);
            Object.keys(scope_Events).forEach(function (targetEvent) {
                if ("hover" === targetEvent.split(".")[0]) {
                    scope_Events[targetEvent].forEach(function (callback) {
                        callback.call(scope_Self, value);
                    });
                }
            });
        }
        // Handles keydown on focused handles
        // Don't move the document when pressing arrow keys on focused handles
        function eventKeydown(event, handleNumber) {
            if (isSliderDisabled() || isHandleDisabled(handleNumber)) {
                return false;
            }
            var horizontalKeys = ["Left", "Right"];
            var verticalKeys = ["Down", "Up"];
            var largeStepKeys = ["PageDown", "PageUp"];
            var edgeKeys = ["Home", "End"];
            if (options.dir && !options.ort) {
                // On an right-to-left slider, the left and right keys act inverted
                horizontalKeys.reverse();
            }
            else if (options.ort && !options.dir) {
                // On a top-to-bottom slider, the up and down keys act inverted
                verticalKeys.reverse();
                largeStepKeys.reverse();
            }
            // Strip "Arrow" for IE compatibility. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
            var key = event.key.replace("Arrow", "");
            var isLargeDown = key === largeStepKeys[0];
            var isLargeUp = key === largeStepKeys[1];
            var isDown = key === verticalKeys[0] || key === horizontalKeys[0] || isLargeDown;
            var isUp = key === verticalKeys[1] || key === horizontalKeys[1] || isLargeUp;
            var isMin = key === edgeKeys[0];
            var isMax = key === edgeKeys[1];
            if (!isDown && !isUp && !isMin && !isMax) {
                return true;
            }
            event.preventDefault();
            var to;
            if (isUp || isDown) {
                var direction = isDown ? 0 : 1;
                var steps = getNextStepsForHandle(handleNumber);
                var step = steps[direction];
                // At the edge of a slider, do nothing
                if (step === null) {
                    return false;
                }
                // No step set, use the default of 10% of the sub-range
                if (step === false) {
                    step = scope_Spectrum.getDefaultStep(scope_Locations[handleNumber], isDown, options.keyboardDefaultStep);
                }
                if (isLargeUp || isLargeDown) {
                    step *= options.keyboardPageMultiplier;
                }
                else {
                    step *= options.keyboardMultiplier;
                }
                // Step over zero-length ranges (#948);
                step = Math.max(step, 0.0000001);
                // Decrement for down steps
                step = (isDown ? -1 : 1) * step;
                to = scope_Values[handleNumber] + step;
            }
            else if (isMax) {
                // End key
                to = options.spectrum.xVal[options.spectrum.xVal.length - 1];
            }
            else {
                // Home key
                to = options.spectrum.xVal[0];
            }
            setHandle(handleNumber, scope_Spectrum.toStepping(to), true, true);
            fireEvent("slide", handleNumber);
            fireEvent("update", handleNumber);
            fireEvent("change", handleNumber);
            fireEvent("set", handleNumber);
            return false;
        }
        // Attach events to several slider parts.
        function bindSliderEvents(behaviour) {
            // Attach the standard drag event to the handles.
            if (!behaviour.fixed) {
                scope_Handles.forEach(function (handle, index) {
                    // These events are only bound to the visual handle
                    // element, not the 'real' origin element.
                    attachEvent(actions.start, handle.children[0], eventStart, {
                        handleNumbers: [index],
                    });
                });
            }
            // Attach the tap event to the slider base.
            if (behaviour.tap) {
                attachEvent(actions.start, scope_Base, eventTap, {});
            }
            // Fire hover events
            if (behaviour.hover) {
                attachEvent(actions.move, scope_Base, eventHover, {
                    hover: true,
                });
            }
            // Make the range draggable.
            if (behaviour.drag) {
                scope_Connects.forEach(function (connect, index) {
                    if (connect === false || index === 0 || index === scope_Connects.length - 1) {
                        return;
                    }
                    var handleBefore = scope_Handles[index - 1];
                    var handleAfter = scope_Handles[index];
                    var eventHolders = [connect];
                    var handlesToDrag = [handleBefore, handleAfter];
                    var handleNumbersToDrag = [index - 1, index];
                    addClass(connect, options.cssClasses.draggable);
                    // When the range is fixed, the entire range can
                    // be dragged by the handles. The handle in the first
                    // origin will propagate the start event upward,
                    // but it needs to be bound manually on the other.
                    if (behaviour.fixed) {
                        eventHolders.push(handleBefore.children[0]);
                        eventHolders.push(handleAfter.children[0]);
                    }
                    if (behaviour.dragAll) {
                        handlesToDrag = scope_Handles;
                        handleNumbersToDrag = scope_HandleNumbers;
                    }
                    eventHolders.forEach(function (eventHolder) {
                        attachEvent(actions.start, eventHolder, eventStart, {
                            handles: handlesToDrag,
                            handleNumbers: handleNumbersToDrag,
                            connect: connect,
                        });
                    });
                });
            }
        }
        // Attach an event to this slider, possibly including a namespace
        function bindEvent(namespacedEvent, callback) {
            scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
            scope_Events[namespacedEvent].push(callback);
            // If the event bound is 'update,' fire it immediately for all handles.
            if (namespacedEvent.split(".")[0] === "update") {
                scope_Handles.forEach(function (a, index) {
                    fireEvent("update", index);
                });
            }
        }
        function isInternalNamespace(namespace) {
            return namespace === INTERNAL_EVENT_NS.aria || namespace === INTERNAL_EVENT_NS.tooltips;
        }
        // Undo attachment of event
        function removeEvent(namespacedEvent) {
            var event = namespacedEvent && namespacedEvent.split(".")[0];
            var namespace = event ? namespacedEvent.substring(event.length) : namespacedEvent;
            Object.keys(scope_Events).forEach(function (bind) {
                var tEvent = bind.split(".")[0];
                var tNamespace = bind.substring(tEvent.length);
                if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) {
                    // only delete protected internal event if intentional
                    if (!isInternalNamespace(tNamespace) || namespace === tNamespace) {
                        delete scope_Events[bind];
                    }
                }
            });
        }
        // External event handling
        function fireEvent(eventName, handleNumber, tap) {
            Object.keys(scope_Events).forEach(function (targetEvent) {
                var eventType = targetEvent.split(".")[0];
                if (eventName === eventType) {
                    scope_Events[targetEvent].forEach(function (callback) {
                        callback.call(
                        // Use the slider public API as the scope ('this')
                        scope_Self, 
                        // Return values as array, so arg_1[arg_2] is always valid.
                        scope_Values.map(options.format.to), 
                        // Handle index, 0 or 1
                        handleNumber, 
                        // Un-formatted slider values
                        scope_Values.slice(), 
                        // Event is fired by tap, true or false
                        tap || false, 
                        // Left offset of the handle, in relation to the slider
                        scope_Locations.slice(), 
                        // add the slider public API to an accessible parameter when this is unavailable
                        scope_Self);
                    });
                }
            });
        }
        // Split out the handle positioning logic so the Move event can use it, too
        function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue, smoothSteps) {
            var distance;
            // For sliders with multiple handles, limit movement to the other handle.
            // Apply the margin option by adding it to the handle positions.
            if (scope_Handles.length > 1 && !options.events.unconstrained) {
                if (lookBackward && handleNumber > 0) {
                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.margin, false);
                    to = Math.max(to, distance);
                }
                if (lookForward && handleNumber < scope_Handles.length - 1) {
                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.margin, true);
                    to = Math.min(to, distance);
                }
            }
            // The limit option has the opposite effect, limiting handles to a
            // maximum distance from another. Limit must be > 0, as otherwise
            // handles would be unmovable.
            if (scope_Handles.length > 1 && options.limit) {
                if (lookBackward && handleNumber > 0) {
                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.limit, false);
                    to = Math.min(to, distance);
                }
                if (lookForward && handleNumber < scope_Handles.length - 1) {
                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.limit, true);
                    to = Math.max(to, distance);
                }
            }
            // The padding option keeps the handles a certain distance from the
            // edges of the slider. Padding must be > 0.
            if (options.padding) {
                if (handleNumber === 0) {
                    distance = scope_Spectrum.getAbsoluteDistance(0, options.padding[0], false);
                    to = Math.max(to, distance);
                }
                if (handleNumber === scope_Handles.length - 1) {
                    distance = scope_Spectrum.getAbsoluteDistance(100, options.padding[1], true);
                    to = Math.min(to, distance);
                }
            }
            if (!smoothSteps) {
                to = scope_Spectrum.getStep(to);
            }
            // Limit percentage to the 0 - 100 range
            to = limit(to);
            // Return false if handle can't move
            if (to === reference[handleNumber] && !getValue) {
                return false;
            }
            return to;
        }
        // Uses slider orientation to create CSS rules. a = base value;
        function inRuleOrder(v, a) {
            var o = options.ort;
            return (o ? a : v) + ", " + (o ? v : a);
        }
        // Moves handle(s) by a percentage
        // (bool, % to move, [% where handle started, ...], [index in scope_Handles, ...])
        function moveHandles(upward, proposal, locations, handleNumbers, connect) {
            var proposals = locations.slice();
            // Store first handle now, so we still have it in case handleNumbers is reversed
            var firstHandle = handleNumbers[0];
            var smoothSteps = options.events.smoothSteps;
            var b = [!upward, upward];
            var f = [upward, !upward];
            // Copy handleNumbers so we don't change the dataset
            handleNumbers = handleNumbers.slice();
            // Check to see which handle is 'leading'.
            // If that one can't move the second can't either.
            if (upward) {
                handleNumbers.reverse();
            }
            // Step 1: get the maximum percentage that any of the handles can move
            if (handleNumbers.length > 1) {
                handleNumbers.forEach(function (handleNumber, o) {
                    var to = checkHandlePosition(proposals, handleNumber, proposals[handleNumber] + proposal, b[o], f[o], false, smoothSteps);
                    // Stop if one of the handles can't move.
                    if (to === false) {
                        proposal = 0;
                    }
                    else {
                        proposal = to - proposals[handleNumber];
                        proposals[handleNumber] = to;
                    }
                });
            }
            // If using one handle, check backward AND forward
            else {
                b = f = [true];
            }
            var state = false;
            // Step 2: Try to set the handles with the found percentage
            handleNumbers.forEach(function (handleNumber, o) {
                state =
                    setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o], false, smoothSteps) || state;
            });
            // Step 3: If a handle moved, fire events
            if (state) {
                handleNumbers.forEach(function (handleNumber) {
                    fireEvent("update", handleNumber);
                    fireEvent("slide", handleNumber);
                });
                // If target is a connect, then fire drag event
                if (connect != undefined) {
                    fireEvent("drag", firstHandle);
                }
            }
        }
        // Takes a base value and an offset. This offset is used for the connect bar size.
        // In the initial design for this feature, the origin element was 1% wide.
        // Unfortunately, a rounding bug in Chrome makes it impossible to implement this feature
        // in this manner: https://bugs.chromium.org/p/chromium/issues/detail?id=798223
        function transformDirection(a, b) {
            return options.dir ? 100 - a - b : a;
        }
        // Updates scope_Locations and scope_Values, updates visual state
        function updateHandlePosition(handleNumber, to) {
            // Update locations.
            scope_Locations[handleNumber] = to;
            // Convert the value to the slider stepping/range.
            scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);
            var translation = transformDirection(to, 0) - scope_DirOffset;
            var translateRule = "translate(" + inRuleOrder(translation + "%", "0") + ")";
            scope_Handles[handleNumber].style[options.transformRule] = translateRule;
            updateConnect(handleNumber);
            updateConnect(handleNumber + 1);
        }
        // Handles before the slider middle are stacked later = higher,
        // Handles after the middle later is lower
        // [[7] [8] .......... | .......... [5] [4]
        function setZindex() {
            scope_HandleNumbers.forEach(function (handleNumber) {
                var dir = scope_Locations[handleNumber] > 50 ? -1 : 1;
                var zIndex = 3 + (scope_Handles.length + dir * handleNumber);
                scope_Handles[handleNumber].style.zIndex = String(zIndex);
            });
        }
        // Test suggested values and apply margin, step.
        // if exactInput is true, don't run checkHandlePosition, then the handle can be placed in between steps (#436)
        function setHandle(handleNumber, to, lookBackward, lookForward, exactInput, smoothSteps) {
            if (!exactInput) {
                to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false, smoothSteps);
            }
            if (to === false) {
                return false;
            }
            updateHandlePosition(handleNumber, to);
            return true;
        }
        // Updates style attribute for connect nodes
        function updateConnect(index) {
            // Skip connects set to false
            if (!scope_Connects[index]) {
                return;
            }
            var l = 0;
            var h = 100;
            if (index !== 0) {
                l = scope_Locations[index - 1];
            }
            if (index !== scope_Connects.length - 1) {
                h = scope_Locations[index];
            }
            // We use two rules:
            // 'translate' to change the left/top offset;
            // 'scale' to change the width of the element;
            // As the element has a width of 100%, a translation of 100% is equal to 100% of the parent (.noUi-base)
            var connectWidth = h - l;
            var translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")";
            var scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";
            scope_Connects[index].style[options.transformRule] =
                translateRule + " " + scaleRule;
        }
        // Parses value passed to .set method. Returns current value if not parse-able.
        function resolveToValue(to, handleNumber) {
            // Setting with null indicates an 'ignore'.
            // Inputting 'false' is invalid.
            if (to === null || to === false || to === undefined) {
                return scope_Locations[handleNumber];
            }
            // If a formatted number was passed, attempt to decode it.
            if (typeof to === "number") {
                to = String(to);
            }
            to = options.format.from(to);
            if (to !== false) {
                to = scope_Spectrum.toStepping(to);
            }
            // If parsing the number failed, use the current value.
            if (to === false || isNaN(to)) {
                return scope_Locations[handleNumber];
            }
            return to;
        }
        // Set the slider value.
        function valueSet(input, fireSetEvent, exactInput) {
            var values = asArray(input);
            var isInit = scope_Locations[0] === undefined;
            // Event fires by default
            fireSetEvent = fireSetEvent === undefined ? true : fireSetEvent;
            // Animation is optional.
            // Make sure the initial values were set before using animated placement.
            if (options.animate && !isInit) {
                addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
            }
            // First pass, without lookAhead but with lookBackward. Values are set from left to right.
            scope_HandleNumbers.forEach(function (handleNumber) {
                setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false, exactInput);
            });
            var i = scope_HandleNumbers.length === 1 ? 0 : 1;
            // Spread handles evenly across the slider if the range has no size (min=max)
            if (isInit && scope_Spectrum.hasNoSize()) {
                exactInput = true;
                scope_Locations[0] = 0;
                if (scope_HandleNumbers.length > 1) {
                    var space_1 = 100 / (scope_HandleNumbers.length - 1);
                    scope_HandleNumbers.forEach(function (handleNumber) {
                        scope_Locations[handleNumber] = handleNumber * space_1;
                    });
                }
            }
            // Secondary passes. Now that all base values are set, apply constraints.
            // Iterate all handles to ensure constraints are applied for the entire slider (Issue #1009)
            for (; i < scope_HandleNumbers.length; ++i) {
                scope_HandleNumbers.forEach(function (handleNumber) {
                    setHandle(handleNumber, scope_Locations[handleNumber], true, true, exactInput);
                });
            }
            setZindex();
            scope_HandleNumbers.forEach(function (handleNumber) {
                fireEvent("update", handleNumber);
                // Fire the event only for handles that received a new value, as per #579
                if (values[handleNumber] !== null && fireSetEvent) {
                    fireEvent("set", handleNumber);
                }
            });
        }
        // Reset slider to initial values
        function valueReset(fireSetEvent) {
            valueSet(options.start, fireSetEvent);
        }
        // Set value for a single handle
        function valueSetHandle(handleNumber, value, fireSetEvent, exactInput) {
            // Ensure numeric input
            handleNumber = Number(handleNumber);
            if (!(handleNumber >= 0 && handleNumber < scope_HandleNumbers.length)) {
                throw new Error("noUiSlider: invalid handle number, got: " + handleNumber);
            }
            // Look both backward and forward, since we don't want this handle to "push" other handles (#960);
            // The exactInput argument can be used to ignore slider stepping (#436)
            setHandle(handleNumber, resolveToValue(value, handleNumber), true, true, exactInput);
            fireEvent("update", handleNumber);
            if (fireSetEvent) {
                fireEvent("set", handleNumber);
            }
        }
        // Get the slider value.
        function valueGet(unencoded) {
            if (unencoded === void 0) { unencoded = false; }
            if (unencoded) {
                // return a copy of the raw values
                return scope_Values.length === 1 ? scope_Values[0] : scope_Values.slice(0);
            }
            var values = scope_Values.map(options.format.to);
            // If only one handle is used, return a single value.
            if (values.length === 1) {
                return values[0];
            }
            return values;
        }
        // Removes classes from the root and empties it.
        function destroy() {
            // remove protected internal listeners
            removeEvent(INTERNAL_EVENT_NS.aria);
            removeEvent(INTERNAL_EVENT_NS.tooltips);
            Object.keys(options.cssClasses).forEach(function (key) {
                removeClass(scope_Target, options.cssClasses[key]);
            });
            while (scope_Target.firstChild) {
                scope_Target.removeChild(scope_Target.firstChild);
            }
            delete scope_Target.noUiSlider;
        }
        function getNextStepsForHandle(handleNumber) {
            var location = scope_Locations[handleNumber];
            var nearbySteps = scope_Spectrum.getNearbySteps(location);
            var value = scope_Values[handleNumber];
            var increment = nearbySteps.thisStep.step;
            var decrement = null;
            // If snapped, directly use defined step value
            if (options.snap) {
                return [
                    value - nearbySteps.stepBefore.startValue || null,
                    nearbySteps.stepAfter.startValue - value || null,
                ];
            }
            // If the next value in this step moves into the next step,
            // the increment is the start of the next step - the current value
            if (increment !== false) {
                if (value + increment > nearbySteps.stepAfter.startValue) {
                    increment = nearbySteps.stepAfter.startValue - value;
                }
            }
            // If the value is beyond the starting point
            if (value > nearbySteps.thisStep.startValue) {
                decrement = nearbySteps.thisStep.step;
            }
            else if (nearbySteps.stepBefore.step === false) {
                decrement = false;
            }
            // If a handle is at the start of a step, it always steps back into the previous step first
            else {
                decrement = value - nearbySteps.stepBefore.highestStep;
            }
            // Now, if at the slider edges, there is no in/decrement
            if (location === 100) {
                increment = null;
            }
            else if (location === 0) {
                decrement = null;
            }
            // As per #391, the comparison for the decrement step can have some rounding issues.
            var stepDecimals = scope_Spectrum.countStepDecimals();
            // Round per #391
            if (increment !== null && increment !== false) {
                increment = Number(increment.toFixed(stepDecimals));
            }
            if (decrement !== null && decrement !== false) {
                decrement = Number(decrement.toFixed(stepDecimals));
            }
            return [decrement, increment];
        }
        // Get the current step size for the slider.
        function getNextSteps() {
            return scope_HandleNumbers.map(getNextStepsForHandle);
        }
        // Updatable: margin, limit, padding, step, range, animate, snap
        function updateOptions(optionsToUpdate, fireSetEvent) {
            // Spectrum is created using the range, snap, direction and step options.
            // 'snap' and 'step' can be updated.
            // If 'snap' and 'step' are not passed, they should remain unchanged.
            var v = valueGet();
            var updateAble = [
                "margin",
                "limit",
                "padding",
                "range",
                "animate",
                "snap",
                "step",
                "format",
                "pips",
                "tooltips",
            ];
            // Only change options that we're actually passed to update.
            updateAble.forEach(function (name) {
                // Check for undefined. null removes the value.
                if (optionsToUpdate[name] !== undefined) {
                    originalOptions[name] = optionsToUpdate[name];
                }
            });
            var newOptions = testOptions(originalOptions);
            // Load new options into the slider state
            updateAble.forEach(function (name) {
                if (optionsToUpdate[name] !== undefined) {
                    options[name] = newOptions[name];
                }
            });
            scope_Spectrum = newOptions.spectrum;
            // Limit, margin and padding depend on the spectrum but are stored outside of it. (#677)
            options.margin = newOptions.margin;
            options.limit = newOptions.limit;
            options.padding = newOptions.padding;
            // Update pips, removes existing.
            if (options.pips) {
                pips(options.pips);
            }
            else {
                removePips();
            }
            // Update tooltips, removes existing.
            if (options.tooltips) {
                tooltips();
            }
            else {
                removeTooltips();
            }
            // Invalidate the current positioning so valueSet forces an update.
            scope_Locations = [];
            valueSet(isSet(optionsToUpdate.start) ? optionsToUpdate.start : v, fireSetEvent);
        }
        // Initialization steps
        function setupSlider() {
            // Create the base element, initialize HTML and set classes.
            // Add handles and connect elements.
            scope_Base = addSlider(scope_Target);
            addElements(options.connect, scope_Base);
            // Attach user events.
            bindSliderEvents(options.events);
            // Use the public value method to set the start values.
            valueSet(options.start);
            if (options.pips) {
                pips(options.pips);
            }
            if (options.tooltips) {
                tooltips();
            }
            aria();
        }
        setupSlider();
        var scope_Self = {
            destroy: destroy,
            steps: getNextSteps,
            on: bindEvent,
            off: removeEvent,
            get: valueGet,
            set: valueSet,
            setHandle: valueSetHandle,
            reset: valueReset,
            // Exposed for unit testing, don't use this in your application.
            __moveHandles: function (upward, proposal, handleNumbers) {
                moveHandles(upward, proposal, scope_Locations, handleNumbers);
            },
            options: originalOptions,
            updateOptions: updateOptions,
            target: scope_Target,
            removePips: removePips,
            removeTooltips: removeTooltips,
            getPositions: function () {
                return scope_Locations.slice();
            },
            getTooltips: function () {
                return scope_Tooltips;
            },
            getOrigins: function () {
                return scope_Handles;
            },
            pips: pips, // Issue #594
        };
        return scope_Self;
    }
    // Run the standard initializer
    function initialize(target, originalOptions) {
        if (!target || !target.nodeName) {
            throw new Error("noUiSlider: create requires a single element, got: " + target);
        }
        // Throw an error if the slider was already initialized.
        if (target.noUiSlider) {
            throw new Error("noUiSlider: Slider was already initialized.");
        }
        // Test the options and create the slider environment;
        var options = testOptions(originalOptions);
        var api = scope(target, options, originalOptions);
        target.noUiSlider = api;
        return api;
    }
    var nouislider = {
        // Exposed for unit testing, don't use this in your application.
        __spectrum: Spectrum,
        // A reference to the default classes, allows global changes.
        // Use the cssClasses option for changes to one slider.
        cssClasses: cssClasses,
        create: initialize,
    };

    exports.create = initialize;
    exports.cssClasses = cssClasses;
    exports["default"] = nouislider;

    Object.defineProperty(exports, '__esModule', { value: true });

}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/createClass.js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/inherits.js

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js


function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}
;// CONCATENATED MODULE: ../node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
;// CONCATENATED MODULE: ./components/view/BaseComponent.ts



var BaseComponent = function BaseComponent() {
  var _this$element$classLi;

  var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
  var styles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  _classCallCheck(this, BaseComponent);

  _defineProperty(this, "element", void 0);

  this.element = document.createElement(tag);

  (_this$element$classLi = this.element.classList).add.apply(_this$element$classLi, _toConsumableArray(styles));
};
;// CONCATENATED MODULE: ./components/view/main/toysPage/card/CardView.ts






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var CardView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(CardView, _BaseComponent);

  var _super = _createSuper(CardView);

  function CardView() {
    _classCallCheck(this, CardView);

    return _super.call(this, 'div', ['card']);
  }

  _createClass(CardView, [{
    key: "createCardsContainer",
    value: function createCardsContainer(model) {
      this.element.innerHTML = "\n      <h2 class=\"card-title\">".concat(model.name, "</h2>\n      <img class=\"card-img\" src=\"./assets/toys/").concat(model.num, ".png\" alt=\"toy\">\n      <div class=\"card-description\">      \n        <p class=\"count\">\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E:<span>").concat(model.count, "</span></p>\n        <p class=\"year\">\u0413\u043E\u0434 \u043F\u043E\u043A\u0443\u043F\u043A\u0438:<span>").concat(model.year, "</span></p>\n        <p class=\"shape\">\u0424\u043E\u0440\u043C\u0430:<span>").concat(model.shape, "</span></p>\n        <p class=\"color\">\u0426\u0432\u0435\u0442:<span>").concat(model.color, "</span></p>\n        <p class=\"size\">\u0420\u0430\u0437\u043C\u0435\u0440:<span>").concat(model.size, "</span></p>\n        <p class=\"favorite\">\u041B\u044E\u0431\u0438\u043C\u0430\u044F:<span>").concat(model.favorite, "</span></p>\n      </div>\n      <div class=\"ribbon\"></div>\n    ");
      return this.element;
    }
  }]);

  return CardView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/toysPage/cardsContainer/CardsContainerView.ts





function CardsContainerView_createSuper(Derived) { var hasNativeReflectConstruct = CardsContainerView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function CardsContainerView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var CardsContainerView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(CardsContainerView, _BaseComponent);

  var _super = CardsContainerView_createSuper(CardsContainerView);

  function CardsContainerView() {
    _classCallCheck(this, CardsContainerView);

    return _super.call(this, 'div', ['cards-container']);
  }

  return CardsContainerView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/toysPage/filters/FiltersView.ts






function FiltersView_createSuper(Derived) { var hasNativeReflectConstruct = FiltersView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function FiltersView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var FiltersView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(FiltersView, _BaseComponent);

  var _super = FiltersView_createSuper(FiltersView);

  function FiltersView() {
    _classCallCheck(this, FiltersView);

    return _super.call(this, 'div', ['filters']);
  }

  _createClass(FiltersView, [{
    key: "renderFilterBlock",
    value: function renderFilterBlock() {
      this.element.innerHTML = "\n      <div class=\"controls-title\">\u0424\u0438\u043B\u044C\u0442\u0440\u044B \u043F\u043E \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044E</div>\n      <div class=\"shape\">\u0424\u043E\u0440\u043C\u0430:  \n        <button data-filter=\"\u0448\u0430\u0440\"></button>\n        <button data-filter=\"\u043A\u043E\u043B\u043E\u043A\u043E\u043B\u044C\u0447\u0438\u043A\"></button>\n        <button data-filter=\"\u0448\u0438\u0448\u043A\u0430\"></button>\n        <button data-filter=\"\u0441\u043D\u0435\u0436\u0438\u043D\u043A\u0430\"></button>\n        <button data-filter=\"\u0444\u0438\u0433\u0443\u0440\u043A\u0430\"></button>\n      </div>\n      <div class=\"color\">\u0426\u0432\u0435\u0442:   \n        <button data-filter=\"\u0431\u0435\u043B\u044B\u0439\"></button>\n        <button data-filter=\"\u0436\u0435\u043B\u0442\u044B\u0439\"></button>\n        <button data-filter=\"\u043A\u0440\u0430\u0441\u043D\u044B\u0439\"></button>\n        <button data-filter=\"\u0441\u0438\u043D\u0438\u0439\"></button>\n        <button data-filter=\"\u0437\u0435\u043B\u0451\u043D\u044B\u0439\"></button>\n      </div>\n      <div class=\"size\">\u0420\u0430\u0437\u043C\u0435\u0440: \n        <button data-filter=\"\u0431\u043E\u043B\u044C\u0448\u043E\u0439\"></button>\n        <button data-filter=\"\u0441\u0440\u0435\u0434\u043D\u0438\u0439\"></button>\n        <button data-filter=\"\u043C\u0430\u043B\u044B\u0439\"></button>\n      </div>\n      <div class=\"favorite-container\">\u0422\u043E\u043B\u044C\u043A\u043E \u043B\u044E\u0431\u0438\u043C\u044B\u0435:\n        <div class=\"form-group\">\n          <input type=\"checkbox\" class=\"favorite-input\" id=\"checkbox\">\n          <label for=\"checkbox\" class=\"favorite-input-label\"></label>\n        </div>   \n      </div> \n    ";
      return this.element;
    }
  }]);

  return FiltersView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/toysPage/range/RangeView.ts






function RangeView_createSuper(Derived) { var hasNativeReflectConstruct = RangeView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function RangeView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var RangeView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(RangeView, _BaseComponent);

  var _super = RangeView_createSuper(RangeView);

  function RangeView() {
    _classCallCheck(this, RangeView);

    return _super.call(this, 'div', ['range']);
  }

  _createClass(RangeView, [{
    key: "renderRangeBlock",
    value: function renderRangeBlock() {
      this.element.innerHTML = "\n      <div class=\"controls-title\">\u0424\u0438\u043B\u044C\u0442\u0440\u044B \u043F\u043E \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u0443</div>\n      <div class=\"count\">\n        <span class=\"control-span\">\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u044D\u043A\u0437\u0435\u043C\u043F\u043B\u044F\u0440\u043E\u0432:</span> \n        <div class=\"count-slider-container\">\n          <output class=\"slider-output\">1</output>\n          <div id=\"count-slider\" class=\"count-slider\"></div>\n          <output class=\"slider-output\">12</output>\n        </div>          \n      </div>\n      <div class=\"year\">\n        <span class=\"control-span\">\u0413\u043E\u0434 \u043F\u0440\u0438\u043E\u0431\u0440\u0435\u0442\u0435\u043D\u0438\u044F:</span> \n        <div class=\"year-slider-container\">\n          <output class=\"slider-output\">1940</output>\n          <div id=\"year-slider\" class=\"year-slider\"></div>\n          <output class=\"slider-output\">2020</output>\n        </div>          \n      </div>\n    ";
      return this.element;
    }
  }]);

  return RangeView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/toysPage/sort/SortView.ts






function SortView_createSuper(Derived) { var hasNativeReflectConstruct = SortView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function SortView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var SortView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(SortView, _BaseComponent);

  var _super = SortView_createSuper(SortView);

  function SortView() {
    var _this;

    _classCallCheck(this, SortView);

    _this = _super.call(this, 'div', ['sort']);

    _this.renderSortBlock();

    return _this;
  }

  _createClass(SortView, [{
    key: "renderSortBlock",
    value: function renderSortBlock() {
      this.element.innerHTML = "\n      <div class=\"controls-title\">\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430</div>\n      <select class=\"sort-select\">\n        <option selected=\"\" value=\"sort-name-max\">\u041F\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044E \u043E\u0442 \xAB\u0410\xBB \u0434\u043E \xAB\u042F\xBB</option>\n        <option value=\"sort-name-min\">\u041F\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044E \u043E\u0442 \xAB\u042F\xBB \u0434\u043E \xAB\u0410\xBB</option>\n        <option value=\"sort-count-max\">\u041F\u043E \u0433\u043E\u0434\u0443 \u043F\u043E\u043A\u0443\u043F\u043A\u0438 \u043F\u043E \u0432\u043E\u0437\u0440\u0430\u0441\u0442\u0430\u043D\u0438\u044E</option>\n        <option value=\"sort-count-min\">\u041F\u043E \u0433\u043E\u0434\u0443 \u043F\u043E\u043A\u0443\u043F\u043A\u0438 \u043F\u043E \u0443\u0431\u044B\u0432\u0430\u043D\u0438\u044E</option>\n      </select>\n      <button class=\"reset-filters\">\u0421\u0431\u0440\u043E\u0441 \u0444\u0438\u043B\u044C\u0442\u0440\u043E\u0432</button>\n      <button class=\"reset-settings\">\u0421\u0431\u0440\u043E\u0441 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A</button>\n    ";
    }
  }]);

  return SortView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/toysPage/controls/ControlsView.ts








function ControlsView_createSuper(Derived) { var hasNativeReflectConstruct = ControlsView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function ControlsView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }






var ControlsView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(ControlsView, _BaseComponent);

  var _super = ControlsView_createSuper(ControlsView);

  function ControlsView() {
    var _this;

    _classCallCheck(this, ControlsView);

    _this = _super.call(this, 'div', ['controls']);

    _defineProperty(_assertThisInitialized(_this), "filtersBlock", void 0);

    _defineProperty(_assertThisInitialized(_this), "rangeBlock", void 0);

    _defineProperty(_assertThisInitialized(_this), "sortBlock", void 0);

    _this.filtersBlock = new FiltersView();
    _this.rangeBlock = new RangeView();
    _this.sortBlock = new SortView();
    return _this;
  }

  _createClass(ControlsView, [{
    key: "createControlsBlock",
    value: function createControlsBlock() {
      var fragment = document.createDocumentFragment();
      fragment.appendChild(this.filtersBlock.renderFilterBlock());
      fragment.appendChild(this.rangeBlock.renderRangeBlock());
      fragment.appendChild(this.sortBlock.element);
      this.element.appendChild(fragment);
      return this.element;
    }
  }]);

  return ControlsView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/toysPage/ToysPageView.ts








function ToysPageView_createSuper(Derived) { var hasNativeReflectConstruct = ToysPageView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function ToysPageView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }





var ToysPageView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(ToysPageView, _BaseComponent);

  var _super = ToysPageView_createSuper(ToysPageView);

  function ToysPageView() {
    var _this;

    _classCallCheck(this, ToysPageView);

    _this = _super.call(this, 'div', ['toys-page']);

    _defineProperty(_assertThisInitialized(_this), "controls", void 0);

    _defineProperty(_assertThisInitialized(_this), "cardsContainer", void 0);

    _this.controls = new ControlsView();
    _this.cardsContainer = new CardsContainerView();
    return _this;
  }

  _createClass(ToysPageView, [{
    key: "createToysPage",
    value: function createToysPage() {
      this.element.className = 'page toys-page';
      this.element.setAttribute('data-page', 'toysPage');
      var fragment = document.createDocumentFragment();
      var blur = document.createElement('div');
      blur.className = 'blur';
      blur.appendChild(this.controls.createControlsBlock());
      blur.appendChild(this.cardsContainer.element);
      fragment.appendChild(blur);
      this.element.appendChild(fragment);
      return this.element;
    }
  }]);

  return ToysPageView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/controllers/LoadToysPage.ts



var LoadToysPage = /*#__PURE__*/function () {
  function LoadToysPage() {
    _classCallCheck(this, LoadToysPage);
  }

  _createClass(LoadToysPage, [{
    key: "getToysPageView",
    value: function getToysPageView() {
      return new ToysPageView().createToysPage();
    }
  }]);

  return LoadToysPage;
}();
;// CONCATENATED MODULE: ./data.ts
var data = [{
  num: '1',
  name: 'Большой шар с рисунком',
  count: '2',
  year: '1960',
  shape: 'шар',
  color: 'желтый',
  size: 'большой',
  favorite: false
}, {
  num: '2',
  name: 'Зелёный шар с цветами',
  count: '5',
  year: '2000',
  shape: 'шар',
  color: 'зелёный',
  size: 'большой',
  favorite: false
}, {
  num: '3',
  name: 'Красный матовый шар',
  count: '3',
  year: '1990',
  shape: 'шар',
  color: 'красный',
  size: 'большой',
  favorite: false
}, {
  num: '4',
  name: 'Сосулька красная',
  count: '2',
  year: '1980',
  shape: 'фигурка',
  color: 'красный',
  size: 'большой',
  favorite: false
}, {
  num: '5',
  name: 'Красный виноград',
  count: '4',
  year: '1980',
  shape: 'фигурка',
  color: 'красный',
  size: 'средний',
  favorite: true
}, {
  num: '6',
  name: 'Красный шар с рисунком',
  count: '6',
  year: '2010',
  shape: 'шар',
  color: 'красный',
  size: 'большой',
  favorite: false
}, {
  num: '7',
  name: 'Молочно-белый шар',
  count: '12',
  year: '1960',
  shape: 'шар',
  color: 'белый',
  size: 'средний',
  favorite: true
}, {
  num: '8',
  name: 'Красный шар',
  count: '10',
  year: '2010',
  shape: 'шар',
  color: 'красный',
  size: 'большой',
  favorite: false
}, {
  num: '9',
  name: 'Колокольчик старинный',
  count: '2',
  year: '1950',
  shape: 'колокольчик',
  color: 'белый',
  size: 'большой',
  favorite: false
}, {
  num: '10',
  name: 'Белый шар ретро',
  count: '7',
  year: '1960',
  shape: 'шар',
  color: 'белый',
  size: 'большой',
  favorite: false
}, {
  num: '11',
  name: 'Шишка еловая белая',
  count: '11',
  year: '1960',
  shape: 'шишка',
  color: 'белый',
  size: 'малый',
  favorite: false
}, {
  num: '12',
  name: 'Белый шар с цветами',
  count: '5',
  year: '1980',
  shape: 'шар',
  color: 'белый',
  size: 'большой',
  favorite: false
}, {
  num: '13',
  name: 'Шар расписной Река',
  count: '3',
  year: '1970',
  shape: 'шар',
  color: 'синий',
  size: 'большой',
  favorite: true
}, {
  num: '14',
  name: 'Шар расписной Деревня',
  count: '4',
  year: '1970',
  shape: 'шар',
  color: 'синий',
  size: 'большой',
  favorite: true
}, {
  num: '15',
  name: 'Колокольчик расписной',
  count: '3',
  year: '1970',
  shape: 'колокольчик',
  color: 'синий',
  size: 'средний',
  favorite: false
}, {
  num: '16',
  name: 'Шишка расписная Пейзаж',
  count: '3',
  year: '1970',
  shape: 'шишка',
  color: 'синий',
  size: 'средний',
  favorite: true
}, {
  num: '17',
  name: 'Шишка расписная',
  count: '7',
  year: '1970',
  shape: 'шишка',
  color: 'красный',
  size: 'средний',
  favorite: false
}, {
  num: '18',
  name: 'Желтый шар с бантом',
  count: '2',
  year: '2010',
  shape: 'шар',
  color: 'желтый',
  size: 'большой',
  favorite: false
}, {
  num: '19',
  name: 'Желтый шар с паетками',
  count: '12',
  year: '1980',
  shape: 'шар',
  color: 'желтый',
  size: 'большой',
  favorite: false
}, {
  num: '20',
  name: 'Красный шар с бантом',
  count: '8',
  year: '1950',
  shape: 'шар',
  color: 'красный',
  size: 'средний',
  favorite: true
}, {
  num: '21',
  name: 'Красный шар с звёздами',
  count: '4',
  year: '1970',
  shape: 'шар',
  color: 'красный',
  size: 'большой',
  favorite: true
}, {
  num: '22',
  name: 'Шишка еловая золотая',
  count: '11',
  year: '1990',
  shape: 'шишка',
  color: 'желтый',
  size: 'малый',
  favorite: false
}, {
  num: '23',
  name: 'Колокольчик старинный',
  count: '9',
  year: '1950',
  shape: 'колокольчик',
  color: 'желтый',
  size: 'большой',
  favorite: false
}, {
  num: '24',
  name: 'Снежинка изящная',
  count: '1',
  year: '1940',
  shape: 'снежинка',
  color: 'белый',
  size: 'большой',
  favorite: false
}, {
  num: '25',
  name: 'Розовый шар с блёстками',
  count: '12',
  year: '2010',
  shape: 'шар',
  color: 'красный',
  size: 'большой',
  favorite: false
}, {
  num: '26',
  name: 'Рубиново-золотой шар',
  count: '8',
  year: '1960',
  shape: 'шар',
  color: 'желтый',
  size: 'большой',
  favorite: false
}, {
  num: '27',
  name: 'Красный шар с узором',
  count: '4',
  year: '2010',
  shape: 'шар',
  color: 'красный',
  size: 'большой',
  favorite: false
}, {
  num: '28',
  name: 'Бордовый шар с узором',
  count: '10',
  year: '2010',
  shape: 'шар',
  color: 'красный',
  size: 'большой',
  favorite: false
}, {
  num: '29',
  name: 'Старинный шар с цветами',
  count: '5',
  year: '1950',
  shape: 'шар',
  color: 'желтый',
  size: 'большой',
  favorite: true
}, {
  num: '30',
  name: 'Старинный шар с узором',
  count: '8',
  year: '1950',
  shape: 'шар',
  color: 'желтый',
  size: 'большой',
  favorite: true
}, {
  num: '31',
  name: 'Красный шар с блёстками',
  count: '8',
  year: '2010',
  shape: 'шар',
  color: 'красный',
  size: 'большой',
  favorite: false
}, {
  num: '32',
  name: 'Синий шар Вселенная',
  count: '11',
  year: '1970',
  shape: 'шар',
  color: 'синий',
  size: 'большой',
  favorite: false
}, {
  num: '33',
  name: 'Синий шар со снежинкой',
  count: '6',
  year: '2010',
  shape: 'шар',
  color: 'синий',
  size: 'средний',
  favorite: false
}, {
  num: '34',
  name: 'Зелёный  шар с узором',
  count: '8',
  year: '2010',
  shape: 'шар',
  color: 'зелёный',
  size: 'большой',
  favorite: false
}, {
  num: '35',
  name: 'Фигурка Лис в шарфе',
  count: '8',
  year: '1950',
  shape: 'фигурка',
  color: 'желтый',
  size: 'средний',
  favorite: true
}, {
  num: '36',
  name: 'Сиреневый шар Метель',
  count: '1',
  year: '2000',
  shape: 'шар',
  color: 'синий',
  size: 'большой',
  favorite: false
}, {
  num: '37',
  name: 'Зелёный  шар Метель',
  count: '6',
  year: '2000',
  shape: 'шар',
  color: 'зелёный',
  size: 'большой',
  favorite: false
}, {
  num: '38',
  name: 'Голубой  шар Метель',
  count: '6',
  year: '2000',
  shape: 'шар',
  color: 'синий',
  size: 'большой',
  favorite: false
}, {
  num: '39',
  name: 'Красная снежинка',
  count: '6',
  year: '1990',
  shape: 'снежинка',
  color: 'красный',
  size: 'большой',
  favorite: false
}, {
  num: '40',
  name: 'Снежинка золотая',
  count: '12',
  year: '2020',
  shape: 'снежинка',
  color: 'желтый',
  size: 'большой',
  favorite: false
}, {
  num: '41',
  name: 'Снежинка арктическая',
  count: '11',
  year: '2020',
  shape: 'снежинка',
  color: 'белый',
  size: 'большой',
  favorite: false
}, {
  num: '42',
  name: 'Зелёный шар',
  count: '10',
  year: '1980',
  shape: 'шар',
  color: 'зелёный',
  size: 'средний',
  favorite: false
}, {
  num: '43',
  name: 'Снежинка двухцветная',
  count: '6',
  year: '1960',
  shape: 'снежинка',
  color: 'красный',
  size: 'большой',
  favorite: false
}, {
  num: '44',
  name: 'Фигурка Ангела',
  count: '11',
  year: '1940',
  shape: 'фигурка',
  color: 'красный',
  size: 'средний',
  favorite: true
}, {
  num: '45',
  name: 'Снежинка новогодняя',
  count: '1',
  year: '1980',
  shape: 'снежинка',
  color: 'белый',
  size: 'большой',
  favorite: false
}, {
  num: '46',
  name: 'Фигурка Мухомор',
  count: '10',
  year: '1950',
  shape: 'фигурка',
  color: 'красный',
  size: 'малый',
  favorite: false
}, {
  num: '47',
  name: 'Фигурка Колодец',
  count: '6',
  year: '1950',
  shape: 'фигурка',
  color: 'красный',
  size: 'малый',
  favorite: false
}, {
  num: '48',
  name: 'Желтый шар с бантом',
  count: '6',
  year: '1960',
  shape: 'шар',
  color: 'желтый',
  size: 'большой',
  favorite: false
}, {
  num: '49',
  name: 'Снежинка с бирюзой',
  count: '4',
  year: '1980',
  shape: 'снежинка',
  color: 'желтый',
  size: 'большой',
  favorite: false
}, {
  num: '50',
  name: 'Колокольчик большой',
  count: '3',
  year: '2020',
  shape: 'колокольчик',
  color: 'красный',
  size: 'большой',
  favorite: false
}, {
  num: '51',
  name: 'Шишка с изморозью',
  count: '12',
  year: '1970',
  shape: 'шишка',
  color: 'красный',
  size: 'малый',
  favorite: false
}, {
  num: '52',
  name: 'Красный шар с надписью',
  count: '12',
  year: '1990',
  shape: 'шар',
  color: 'красный',
  size: 'большой',
  favorite: true
}, {
  num: '53',
  name: 'Снежинка серебристая',
  count: '6',
  year: '2020',
  shape: 'снежинка',
  color: 'белый',
  size: 'большой',
  favorite: false
}, {
  num: '54',
  name: 'Зелёный шар с рисунком',
  count: '6',
  year: '2010',
  shape: 'шар',
  color: 'зелёный',
  size: 'большой',
  favorite: false
}, {
  num: '55',
  name: 'Пряничный домик',
  count: '1',
  year: '1940',
  shape: 'фигурка',
  color: 'желтый',
  size: 'большой',
  favorite: false
}, {
  num: '56',
  name: 'Пряничный теремок',
  count: '1',
  year: '1940',
  shape: 'фигурка',
  color: 'желтый',
  size: 'малый',
  favorite: false
}, {
  num: '57',
  name: 'Пряничная избушка',
  count: '1',
  year: '1940',
  shape: 'фигурка',
  color: 'желтый',
  size: 'средний',
  favorite: false
}, {
  num: '58',
  name: 'Фигурка белого медведя',
  count: '2',
  year: '1980',
  shape: 'фигурка',
  color: 'белый',
  size: 'средний',
  favorite: false
}, {
  num: '59',
  name: 'Желтый шар с надписью',
  count: '10',
  year: '1990',
  shape: 'шар',
  color: 'желтый',
  size: 'средний',
  favorite: false
}, {
  num: '60',
  name: 'Фигурка Голубь',
  count: '12',
  year: '1940',
  shape: 'фигурка',
  color: 'белый',
  size: 'средний',
  favorite: true
}];
/* harmony default export */ const data_0 = (data);
;// CONCATENATED MODULE: ./components/controllers/ToysPageController.ts







var ToysPageController = /*#__PURE__*/function () {
  function ToysPageController() {
    _classCallCheck(this, ToysPageController);

    _defineProperty(this, "cardsCollection", void 0);

    _defineProperty(this, "filteredCardsCollection", void 0);

    _defineProperty(this, "favouriteCollection", void 0);

    _defineProperty(this, "mainBlock", void 0);

    this.mainBlock = document.querySelector('.main');
    this.cardsCollection = [];
    this.filteredCardsCollection = [];
    this.favouriteCollection = [];
    this.getCardsCollection();
    this.getFavouriteCards();
  }

  _createClass(ToysPageController, [{
    key: "getCardsCollection",
    value: function getCardsCollection() {
      this.cardsCollection = data_0.map(function (el) {
        return {
          num: Number(el.num),
          name: el.name,
          count: Number(el.count),
          year: Number(el.year),
          shape: el.shape,
          color: el.color,
          size: el.size,
          favorite: el.favorite ? 'Да' : 'Нет'
        };
      });
      this.filteredCardsCollection = this.cardsCollection;
      return this.cardsCollection;
    }
  }, {
    key: "getFavouriteCards",
    value: function getFavouriteCards() {
      var cards = localStorage.getItem('favouriteCards');

      if (cards) {
        this.favouriteCollection = JSON.parse(cards);
      }
    }
  }, {
    key: "getAllCardsView",
    value: function getAllCardsView() {
      return this.filteredCardsCollection.map(function (el) {
        return new CardView().createCardsContainer(el);
      });
    }
  }, {
    key: "renderAllCards",
    value: function renderAllCards() {
      var cardsContainer = document.querySelector('.cards-container');

      if (cardsContainer) {
        while (cardsContainer.firstChild) {
          cardsContainer.removeChild(cardsContainer.firstChild);
        }

        cardsContainer.append.apply(cardsContainer, _toConsumableArray(this.getAllCardsView()));
      }
    }
  }, {
    key: "renderToysPage",
    value: function renderToysPage() {
      if (this.mainBlock) {
        while (this.mainBlock.firstChild) {
          this.mainBlock.removeChild(this.mainBlock.firstChild);
        }

        this.mainBlock.appendChild(new LoadToysPage().getToysPageView());
      }
    }
  }, {
    key: "filterCardsByValue",
    value: function filterCardsByValue(type) {
      var _this = this;

      this.filteredCardsCollection = [];

      if (localStorage.getItem("".concat(type)) != null) {
        if (localStorage.getItem("".concat(type)) == '') {
          this.filteredCardsCollection = this.cardsCollection;
        } else {
          var _localStorage$getItem;

          var elements = (_localStorage$getItem = localStorage.getItem("".concat(type))) === null || _localStorage$getItem === void 0 ? void 0 : _localStorage$getItem.split(',').filter(function (el) {
            return el != '';
          });

          if (type == 'shape') {
            elements === null || elements === void 0 ? void 0 : elements.forEach(function (el) {
              _this.filteredCardsCollection = _this.filteredCardsCollection.concat(_this.cardsCollection.filter(function (elem) {
                return elem.shape == el;
              }));
            });
          }

          if (type == 'color') {
            elements === null || elements === void 0 ? void 0 : elements.forEach(function (el) {
              _this.filteredCardsCollection = _this.filteredCardsCollection.concat(_this.cardsCollection.filter(function (elem) {
                return elem.color == el;
              }));
            });
          }

          if (type == 'size') {
            elements === null || elements === void 0 ? void 0 : elements.forEach(function (el) {
              _this.filteredCardsCollection = _this.filteredCardsCollection.concat(_this.cardsCollection.filter(function (elem) {
                return elem.size == el;
              }));
            });
          }
        }

        this.renderAllCards();
      }
    }
  }, {
    key: "filterCardsByFavourite",
    value: function filterCardsByFavourite() {
      this.filteredCardsCollection = [];

      if (localStorage.getItem('favourite') != null) {
        if (localStorage.getItem('favourite') == 'true') {
          this.filteredCardsCollection = this.cardsCollection.filter(function (elem) {
            return elem.favorite == 'Да';
          });
        } else {
          this.filteredCardsCollection = this.cardsCollection;
        }

        this.renderAllCards();
      }
    }
  }, {
    key: "filterCardsByRange",
    value: function filterCardsByRange(type) {
      this.filteredCardsCollection = [];

      if (localStorage.getItem("".concat(type, "SliderValues")) != null) {
        var values = localStorage.getItem("".concat(type, "SliderValues"));

        if (values) {
          var valuesArr = values.split(',');

          if (type == 'count') {
            this.filteredCardsCollection = this.cardsCollection.filter(function (elem) {
              return elem.count >= Number(valuesArr[0]) && elem.count <= Number(valuesArr[1]);
            });
          }

          if (type == 'year') {
            this.filteredCardsCollection = this.cardsCollection.filter(function (elem) {
              return elem.year >= Number(valuesArr[0]) && elem.year <= Number(valuesArr[1]);
            });
          }
        }
      }

      this.renderAllCards();
    }
  }, {
    key: "sortCards",
    value: function sortCards() {
      if (localStorage.getItem('sort') != null) {
        var sort = localStorage.getItem('sort');

        switch (sort) {
          case 'sort-name-max':
            this.filteredCardsCollection = this.sortNameMax();
            break;

          case 'sort-name-min':
            this.filteredCardsCollection = this.sortNameMin();
            break;

          case 'sort-count-max':
            this.filteredCardsCollection = this.sortCountMax();
            break;

          case 'sort-count-min':
            this.filteredCardsCollection = this.sortCountMin();
            break;
        }

        this.renderAllCards();
      }
    }
  }, {
    key: "sortNameMax",
    value: function sortNameMax() {
      return this.filteredCardsCollection.sort(function (a, b) {
        return a.name > b.name ? 1 : -1;
      });
    }
  }, {
    key: "sortNameMin",
    value: function sortNameMin() {
      return this.filteredCardsCollection.sort(function (a, b) {
        return a.name < b.name ? 1 : -1;
      });
    }
  }, {
    key: "sortCountMax",
    value: function sortCountMax() {
      return this.filteredCardsCollection.sort(function (a, b) {
        return a.year > b.year ? 1 : -1;
      });
    }
  }, {
    key: "sortCountMin",
    value: function sortCountMin() {
      return this.filteredCardsCollection.sort(function (a, b) {
        return a.year < b.year ? 1 : -1;
      });
    }
  }, {
    key: "addToFavouriteCollection",
    value: function addToFavouriteCollection(cardEl, select) {
      var card = this.cardsCollection.filter(function (el) {
        var _cardEl$firstElementC;

        return el.name == ((_cardEl$firstElementC = cardEl.firstElementChild) === null || _cardEl$firstElementC === void 0 ? void 0 : _cardEl$firstElementC.textContent);
      })[0];
      this.favouriteCollection.push(card);

      if (select) {
        select.innerHTML = "".concat(this.favouriteCollection.length);
      }

      localStorage.setItem('favouriteCount', "".concat(this.favouriteCollection.length));
      localStorage.setItem('favouriteCards', "".concat(JSON.stringify(this.favouriteCollection)));
    }
  }, {
    key: "deleteFromFavouriteCollection",
    value: function deleteFromFavouriteCollection(cardEl, select) {
      var _this2 = this;

      var card = this.cardsCollection.filter(function (el) {
        var _cardEl$firstElementC2;

        return el.name == ((_cardEl$firstElementC2 = cardEl.firstElementChild) === null || _cardEl$firstElementC2 === void 0 ? void 0 : _cardEl$firstElementC2.textContent);
      })[0];
      this.favouriteCollection.forEach(function (el, index) {
        if (el.name == card.name) {
          _this2.favouriteCollection.splice(index, 1);
        }
      });

      if (select) {
        select.innerHTML = "".concat(this.favouriteCollection.length);
      }

      localStorage.setItem('favouriteCount', "".concat(this.favouriteCollection.length));
      localStorage.setItem('favouriteCards', "".concat(JSON.stringify(this.favouriteCollection)));
    }
  }]);

  return ToysPageController;
}();
;// CONCATENATED MODULE: ./components/view/footer/FooterView.ts






function FooterView_createSuper(Derived) { var hasNativeReflectConstruct = FooterView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function FooterView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var FooterView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(FooterView, _BaseComponent);

  var _super = FooterView_createSuper(FooterView);

  function FooterView() {
    var _this;

    _classCallCheck(this, FooterView);

    _this = _super.call(this, 'footer', ['footer']);

    _this.createFooter();

    return _this;
  }

  _createClass(FooterView, [{
    key: "createFooter",
    value: function createFooter() {
      this.element.innerHTML = "\n      <div class=\"footer-container\">\n        <div class=\"footer-data\">\n          <p class=\"copyright\">\xA9</p>\n          <p class=\"year\">2021</p>\n          <a class=\"github-username\" href=\"https://github.com/Tatsiana-Bivoina\" target=\"_blank\" rel=\"noopener noreferrer\">github</a>\n        </div>\n        <a class=\"rss-logo\" href=\"https://rs.school/js/\" target=\"_blank\" ></a>\n      </div>\n    ";
    }
  }]);

  return FooterView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/navigation/NavigationView.ts






function NavigationView_createSuper(Derived) { var hasNativeReflectConstruct = NavigationView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function NavigationView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var NavigationView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(NavigationView, _BaseComponent);

  var _super = NavigationView_createSuper(NavigationView);

  function NavigationView() {
    var _this;

    _classCallCheck(this, NavigationView);

    _this = _super.call(this, 'nav', ['navigation']);

    _this.createNav();

    return _this;
  }

  _createClass(NavigationView, [{
    key: "createNav",
    value: function createNav() {
      this.element.className = 'nav-bar';
      this.element.innerHTML = "\n      <a class=\"start-page-link\" href=\"#\"></a>\n      <a class=\"toys-page-link\" href=\"#\">\u0418\u0433\u0440\u0443\u0448\u043A\u0438</a>\n      <a class=\"christmas-tree-page-link\" href=\"#\">\u0401\u043B\u043A\u0430</a>\n    ";
    }
  }]);

  return NavigationView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/header-controls/HeaderControlsView.ts






function HeaderControlsView_createSuper(Derived) { var hasNativeReflectConstruct = HeaderControlsView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function HeaderControlsView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var HeaderControlsView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(HeaderControlsView, _BaseComponent);

  var _super = HeaderControlsView_createSuper(HeaderControlsView);

  function HeaderControlsView() {
    var _this;

    _classCallCheck(this, HeaderControlsView);

    _this = _super.call(this, 'div', ['header-controls']);

    _this.createHeaderControls();

    return _this;
  }

  _createClass(HeaderControlsView, [{
    key: "createHeaderControls",
    value: function createHeaderControls() {
      this.element.innerHTML = "\n      <input type=\"search\" class=\"search\" autocomplete=\"off\">\n      <div class=\"select\">\n        <span>0</span>\n      </div>\n    ";
    }
  }]);

  return HeaderControlsView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/header/HeaderView.ts








function HeaderView_createSuper(Derived) { var hasNativeReflectConstruct = HeaderView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function HeaderView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }





var HeaderView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(HeaderView, _BaseComponent);

  var _super = HeaderView_createSuper(HeaderView);

  function HeaderView() {
    var _this;

    _classCallCheck(this, HeaderView);

    _this = _super.call(this, 'header', ['header']);

    _defineProperty(_assertThisInitialized(_this), "headerContainer", void 0);

    _defineProperty(_assertThisInitialized(_this), "navigation", void 0);

    _defineProperty(_assertThisInitialized(_this), "headerControls", void 0);

    _this.headerContainer = document.createElement('div');
    _this.navigation = new NavigationView();
    _this.headerControls = new HeaderControlsView();

    _this.createHeader();

    return _this;
  }

  _createClass(HeaderView, [{
    key: "createHeader",
    value: function createHeader() {
      this.headerContainer.className = 'header-container';
      this.headerContainer.appendChild(this.navigation.element);
      this.headerContainer.appendChild(this.headerControls.element);
      this.element.appendChild(this.headerContainer);
    }
  }]);

  return HeaderView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/MainView.ts





function MainView_createSuper(Derived) { var hasNativeReflectConstruct = MainView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function MainView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var MainView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(MainView, _BaseComponent);

  var _super = MainView_createSuper(MainView);

  function MainView() {
    _classCallCheck(this, MainView);

    return _super.call(this, 'main', ['main']);
  }

  return MainView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/startPage/StartPageView.ts






function StartPageView_createSuper(Derived) { var hasNativeReflectConstruct = StartPageView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function StartPageView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var StartPageView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(StartPageView, _BaseComponent);

  var _super = StartPageView_createSuper(StartPageView);

  function StartPageView() {
    _classCallCheck(this, StartPageView);

    return _super.call(this, 'div', ['start-page']);
  }

  _createClass(StartPageView, [{
    key: "createStartPage",
    value: function createStartPage() {
      this.element.className = 'page start-page';
      this.element.setAttribute('data-page', 'startPage');
      this.element.innerHTML = "\n      <div class=\"ball ball1\"></div>\n      <div class=\"ball ball2\"></div>\n      <h1 class=\"start-page-title\">\u041D\u043E\u0432\u043E\u0433\u043E\u0434\u043D\u044F\u044F \u0438\u0433\u0440\u0430 \xAB\u041D\u0430\u0440\u044F\u0434\u0438 \u0451\u043B\u043A\u0443\xBB</h1>\n      <button class=\"switch-toys-page\" data-page=\"toysPage\">\u041D\u0430\u0447\u0430\u0442\u044C</button>\n    ";
      return this.element;
    }
  }]);

  return StartPageView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/controllers/LoadStartPage.ts



var LoadStartPage = /*#__PURE__*/function () {
  function LoadStartPage() {
    _classCallCheck(this, LoadStartPage);
  }

  _createClass(LoadStartPage, [{
    key: "getStartPageView",
    value: function getStartPageView() {
      return new StartPageView().createStartPage();
    }
  }]);

  return LoadStartPage;
}();
;// CONCATENATED MODULE: ./components/controllers/StartPageController.ts




var StartPageController = /*#__PURE__*/function () {
  function StartPageController() {
    _classCallCheck(this, StartPageController);

    _defineProperty(this, "mainBlock", void 0);

    this.mainBlock = document.querySelector('.main');
  }

  _createClass(StartPageController, [{
    key: "renderStartPage",
    value: function renderStartPage() {
      if (this.mainBlock) {
        while (this.mainBlock.firstChild) {
          this.mainBlock.removeChild(this.mainBlock.firstChild);
        }

        this.mainBlock.appendChild(new LoadStartPage().getStartPageView());
      }
    }
  }]);

  return StartPageController;
}();
// EXTERNAL MODULE: ../node_modules/nouislider/dist/nouislider.js
var nouislider = __webpack_require__(344);
var nouislider_default = /*#__PURE__*/__webpack_require__.n(nouislider);
;// CONCATENATED MODULE: ./components/controllers/NoUiSliderController.ts






var NoUiSliderController = /*#__PURE__*/function () {
  function NoUiSliderController() {
    _classCallCheck(this, NoUiSliderController);

    _defineProperty(this, "countSliderValues", void 0);

    _defineProperty(this, "yearSliderValues", void 0);

    _defineProperty(this, "toysPageController", void 0);

    this.toysPageController = new ToysPageController();
    this.yearSliderValues = [];
    this.countSliderValues = [];
  }

  _createClass(NoUiSliderController, [{
    key: "createCountSlider",
    value: function createCountSlider() {
      var _localStorage$getItem;

      var countRange = document.getElementById('count-slider');
      var values = (_localStorage$getItem = localStorage.getItem('countSliderValues')) === null || _localStorage$getItem === void 0 ? void 0 : _localStorage$getItem.split(',');
      var outputMin = document.querySelectorAll('.count .slider-output')[0];
      var outputMax = document.querySelectorAll('.count .slider-output')[1];

      if (!values) {
        values = ['1', '12'];
      }

      if (countRange && values) {
        nouislider_default().create(countRange, {
          range: {
            min: 1,
            max: 12
          },
          step: 1,
          start: [Number(values[0]), Number(values[1])],
          margin: 0,
          connect: true,
          behaviour: 'tap-drag',
          tooltips: false,
          format: {
            to: function to(value) {
              return Number(value);
            },
            from: function from(value) {
              return Number(value);
            }
          }
        });

        if (outputMin && outputMax) {
          outputMin.innerHTML = values[0];
          outputMax.innerHTML = values[1];
        }
      }

      this.addListenerToCountSlider(countRange, outputMin, outputMax);
    }
  }, {
    key: "addListenerToCountSlider",
    value: function addListenerToCountSlider(countRange, outputMin, outputMax) {
      var _this = this;

      if (countRange) {
        countRange.noUiSlider.on('slide', function () {
          _this.countSliderValues = countRange.noUiSlider.get().toString().split(',').map(function (el) {
            return Math.round(Number(el)).toString();
          });
          localStorage.setItem('countSliderValues', "".concat(_this.countSliderValues));

          _this.changeCountOutput(outputMin, outputMax);

          _this.toysPageController.filterCardsByRange('count');
        });
      }
    }
  }, {
    key: "changeCountOutput",
    value: function changeCountOutput(outputMin, outputMax) {
      if (outputMin && outputMax) {
        outputMin.innerHTML = this.countSliderValues[0];
        outputMax.innerHTML = this.countSliderValues[1];
      }
    }
  }, {
    key: "createYearSlider",
    value: function createYearSlider() {
      var _localStorage$getItem2;

      var yearRange = document.getElementById('year-slider');
      var values = (_localStorage$getItem2 = localStorage.getItem('yearSliderValues')) === null || _localStorage$getItem2 === void 0 ? void 0 : _localStorage$getItem2.split(',');
      var outputMin = document.querySelectorAll('.year .slider-output')[0];
      var outputMax = document.querySelectorAll('.year .slider-output')[1];

      if (!values) {
        values = ['1940', '2020'];
      }

      if (yearRange && values) {
        nouislider_default().create(yearRange, {
          range: {
            min: 1940,
            max: 2020
          },
          step: 10,
          start: [Number(values[0]), Number(values[1])],
          margin: 1,
          connect: true,
          behaviour: 'tap-drag',
          tooltips: false,
          format: {
            to: function to(value) {
              return Number(value);
            },
            from: function from(value) {
              return Number(value);
            }
          }
        });

        if (outputMin && outputMax) {
          outputMin.innerHTML = values[0];
          outputMax.innerHTML = values[1];
        }
      }

      this.addListenerToYearSlider(yearRange, outputMin, outputMax);
    }
  }, {
    key: "addListenerToYearSlider",
    value: function addListenerToYearSlider(yearRange, outputMin, outputMax) {
      var _this2 = this;

      if (yearRange) {
        yearRange.noUiSlider.on('slide', function () {
          _this2.yearSliderValues = yearRange.noUiSlider.get().toString().split(',').map(function (el) {
            return Math.round(Number(el)).toString();
          });

          _this2.changeYearOutput(outputMin, outputMax);

          localStorage.setItem('yearSliderValues', "".concat(_this2.yearSliderValues));

          _this2.toysPageController.filterCardsByRange('year');
        });
      }
    }
  }, {
    key: "changeYearOutput",
    value: function changeYearOutput(outputMin, outputMax) {
      if (outputMin && outputMax) {
        outputMin.innerHTML = this.yearSliderValues[0];
        outputMax.innerHTML = this.yearSliderValues[1];
      }
    }
  }]);

  return NoUiSliderController;
}();
;// CONCATENATED MODULE: ./components/view/main/christmasTreePage/favoritesCard/FavoritesCardView.ts






function FavoritesCardView_createSuper(Derived) { var hasNativeReflectConstruct = FavoritesCardView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function FavoritesCardView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var FavoriteCardView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(FavoriteCardView, _BaseComponent);

  var _super = FavoritesCardView_createSuper(FavoriteCardView);

  function FavoriteCardView() {
    _classCallCheck(this, FavoriteCardView);

    return _super.call(this, 'div', ['favorites-card']);
  }

  _createClass(FavoriteCardView, [{
    key: "createFavoritesCard",
    value: function createFavoritesCard(model) {
      this.element.setAttribute('data-num', "".concat(model.num));
      var fragment = document.createDocumentFragment();
      var paragraph = document.createElement('p');
      paragraph.className = 'favorites-count';
      paragraph.innerHTML = "".concat(model.count);
      fragment.append(paragraph);

      for (var i = model.count; i > 0; i--) {
        var img = document.createElement('img');
        img.id = "".concat(model.num, "-").concat(i);
        img.className = 'favorites-card-img';
        img.setAttribute('src', "./assets/toys/".concat(model.num, ".png"));
        img.setAttribute('alt', 'toy');
        img.setAttribute('draggable', 'true');
        img.setAttribute('data-imgnum', "".concat(model.num));
        fragment.append(img);
      }

      this.element.appendChild(fragment);
      return this.element;
    }
  }]);

  return FavoriteCardView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/christmasTreePage/bgContainer/BgContainerView.ts








function BgContainerView_createSuper(Derived) { var hasNativeReflectConstruct = BgContainerView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function BgContainerView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var BgContainerView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(BgContainerView, _BaseComponent);

  var _super = BgContainerView_createSuper(BgContainerView);

  function BgContainerView() {
    var _this;

    _classCallCheck(this, BgContainerView);

    _this = _super.call(this, 'div', ['bg-container']);

    _defineProperty(_assertThisInitialized(_this), "bgCollection", void 0);

    _this.bgCollection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return _this;
  }

  _createClass(BgContainerView, [{
    key: "createBgContainerView",
    value: function createBgContainerView() {
      this.element.className = 'bg-container menu-container';
      var fragment = document.createDocumentFragment();
      this.bgCollection.forEach(function (el) {
        var bg = document.createElement('div');
        bg.className = 'bg menu-item';
        bg.setAttribute('data-bg', "".concat(el));
        fragment.appendChild(bg);
      });
      this.element.appendChild(fragment);
      return this.element;
    }
  }]);

  return BgContainerView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/christmasTreePage/favoritesContainer/FavoritesContainerView.ts





function FavoritesContainerView_createSuper(Derived) { var hasNativeReflectConstruct = FavoritesContainerView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function FavoritesContainerView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }


var FavoritesContainerView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(FavoritesContainerView, _BaseComponent);

  var _super = FavoritesContainerView_createSuper(FavoritesContainerView);

  function FavoritesContainerView() {
    _classCallCheck(this, FavoritesContainerView);

    return _super.call(this, 'div', ['favorites-container']);
  }

  return FavoritesContainerView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/christmasTreePage/favoritesDecorateContainer/FavoritesDecorateContainerView.ts






function FavoritesDecorateContainerView_createSuper(Derived) { var hasNativeReflectConstruct = FavoritesDecorateContainerView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function FavoritesDecorateContainerView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var FavoritesDecorateContainerView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(FavoritesDecorateContainerView, _BaseComponent);

  var _super = FavoritesDecorateContainerView_createSuper(FavoritesDecorateContainerView);

  function FavoritesDecorateContainerView() {
    _classCallCheck(this, FavoritesDecorateContainerView);

    return _super.call(this, 'div', ['favorites-decorate-container']);
  }

  _createClass(FavoritesDecorateContainerView, [{
    key: "createFavoritesDecorateContainerView",
    value: function createFavoritesDecorateContainerView() {
      var fragment = document.createDocumentFragment();

      for (var i = 1; i < 6; i++) {
        var div = document.createElement('div');
        div.className = 'tree-decorate';
        var img = document.createElement('img');
        img.className = 'tree-decorate-img';
        img.setAttribute('src', "./assets/tree/".concat(i, ".png"));
        img.setAttribute('alt', 'decorate-tree');
        div.appendChild(img);
        fragment.appendChild(div);
      }

      this.element.appendChild(fragment);
      return this.element;
    }
  }]);

  return FavoritesDecorateContainerView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/christmasTreePage/favoritesDecorate/FavoritesDecorateView.ts








function FavoritesDecorateView_createSuper(Derived) { var hasNativeReflectConstruct = FavoritesDecorateView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function FavoritesDecorateView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var FavoritesDecorateView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(FavoritesDecorateView, _BaseComponent);

  var _super = FavoritesDecorateView_createSuper(FavoritesDecorateView);

  function FavoritesDecorateView() {
    var _this;

    _classCallCheck(this, FavoritesDecorateView);

    _this = _super.call(this, 'div', ['favorites-decorate']);

    _defineProperty(_assertThisInitialized(_this), "favoritesDecorateContainer", void 0);

    _this.favoritesDecorateContainer = new FavoritesDecorateContainerView();
    return _this;
  }

  _createClass(FavoritesDecorateView, [{
    key: "createFavoritesDecorateView",
    value: function createFavoritesDecorateView() {
      var fragment = document.createDocumentFragment();
      fragment.appendChild(this.favoritesDecorateContainer.createFavoritesDecorateContainerView());
      var btn = document.createElement('button');
      btn.className = 'reset-settings';
      btn.innerText = 'Сброс настроек';
      fragment.append(btn);
      this.element.appendChild(fragment);
      return this.element;
    }
  }]);

  return FavoritesDecorateView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/christmasTreePage/favoritesAside/FavoriteAsideView.ts








function FavoriteAsideView_createSuper(Derived) { var hasNativeReflectConstruct = FavoriteAsideView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function FavoriteAsideView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }





var FavoriteAsideView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(FavoriteAsideView, _BaseComponent);

  var _super = FavoriteAsideView_createSuper(FavoriteAsideView);

  function FavoriteAsideView() {
    var _this;

    _classCallCheck(this, FavoriteAsideView);

    _this = _super.call(this, 'div', ['favorites-aside']);

    _defineProperty(_assertThisInitialized(_this), "favoritesContainer", void 0);

    _defineProperty(_assertThisInitialized(_this), "favoritesDecorate", void 0);

    _this.favoritesContainer = new FavoritesContainerView();
    _this.favoritesDecorate = new FavoritesDecorateView();
    return _this;
  }

  _createClass(FavoriteAsideView, [{
    key: "createFavoriteAsideView",
    value: function createFavoriteAsideView() {
      var fragment = document.createDocumentFragment();
      fragment.appendChild(this.favoritesContainer.element);
      fragment.appendChild(this.favoritesDecorate.createFavoritesDecorateView());
      this.element.appendChild(fragment);
      return this.element;
    }
  }]);

  return FavoriteAsideView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/christmasTreePage/garlandContainer/GarlandContainerView.ts






function GarlandContainerView_createSuper(Derived) { var hasNativeReflectConstruct = GarlandContainerView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function GarlandContainerView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var GarlandContainerView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(GarlandContainerView, _BaseComponent);

  var _super = GarlandContainerView_createSuper(GarlandContainerView);

  function GarlandContainerView() {
    _classCallCheck(this, GarlandContainerView);

    return _super.call(this, 'div', ['garland-container']);
  }

  _createClass(GarlandContainerView, [{
    key: "createGarlandContainerView",
    value: function createGarlandContainerView() {
      this.element.className = 'garland-container menu-container';
      this.element.innerHTML = "         \n      <div class=\"garland-btns\">\n        <button class=\"color-btn multicolor-btn\" data-color=\"multicolor\"></button>\n        <button class=\"color-btn red-btn\" data-color=\"red\"></button>\n        <button class=\"color-btn blue-btn\" data-color=\"blue\"></button>\n        <button class=\"color-btn yellow-btn\" data-color=\"yellow\"></button>\n        <button class=\"color-btn green-btn\" data-color=\"green\"></button>\n      </div>\n      <div class=\"onoffswitch\">\n        <input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"myonoffswitch\" checked=\"\">\n        <label class=\"onoffswitch-label\" for=\"myonoffswitch\">\n            <div class=\"onoffswitch-inner\"></div>\n            <div class=\"onoffswitch-switch\"></div>\n        </label>\n      </div>\n    ";
      return this.element;
    }
  }]);

  return GarlandContainerView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/christmasTreePage/snowflakes/SnowflakesView.ts






function SnowflakesView_createSuper(Derived) { var hasNativeReflectConstruct = SnowflakesView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function SnowflakesView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var SnowflakesView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(SnowflakesView, _BaseComponent);

  var _super = SnowflakesView_createSuper(SnowflakesView);

  function SnowflakesView() {
    _classCallCheck(this, SnowflakesView);

    return _super.call(this, 'div', ['snowflakes']);
  }

  _createClass(SnowflakesView, [{
    key: "createSnowflakesView",
    value: function createSnowflakesView() {
      this.element.className = 'snowflakes hide';
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < 126; i++) {
        var el = document.createElement('i');
        fragment.appendChild(el);
      }

      this.element.appendChild(fragment);
      return this.element;
    }
  }]);

  return SnowflakesView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/christmasTreePage/mainTreeContainer/MainTreeContainerView.ts








function MainTreeContainerView_createSuper(Derived) { var hasNativeReflectConstruct = MainTreeContainerView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function MainTreeContainerView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }




var MainTreeContainerView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(MainTreeContainerView, _BaseComponent);

  var _super = MainTreeContainerView_createSuper(MainTreeContainerView);

  function MainTreeContainerView() {
    var _this;

    _classCallCheck(this, MainTreeContainerView);

    _this = _super.call(this, 'div', ['main-tree-container']);

    _defineProperty(_assertThisInitialized(_this), "snowflakes", void 0);

    _this.snowflakes = new SnowflakesView();
    return _this;
  }

  _createClass(MainTreeContainerView, [{
    key: "createMainTreeContainerView",
    value: function createMainTreeContainerView() {
      var fragment = document.createDocumentFragment();
      fragment.appendChild(this.snowflakes.createSnowflakesView());
      var div = document.createElement('div');
      div.className = 'garland-tree-container';
      var map = document.createElement('map');
      map.setAttribute('name', 'tree-map');
      var area = document.createElement('area');
      area.setAttribute('coords', '365,699,189,706,113,683,31,608,2,555,2,539,18,437,73,351,106,224,161,134,243,-1,306,75,353,144,399,221,424,359,452,459,496,550,444,664');
      area.setAttribute('shape', 'poly');
      map.appendChild(area);
      var img = document.createElement('img');
      img.className = 'main-tree';
      img.setAttribute('src', './assets/tree/1.png');
      img.setAttribute('usemap', '#tree-map');
      img.setAttribute('alt', 'tree');
      fragment.append(div, map, img);
      this.element.appendChild(fragment);
      return this.element;
    }
  }]);

  return MainTreeContainerView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/christmasTreePage/snowAudioContainer/snowAudioContainerView.ts






function snowAudioContainerView_createSuper(Derived) { var hasNativeReflectConstruct = snowAudioContainerView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function snowAudioContainerView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var SnowAudioContainerView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(SnowAudioContainerView, _BaseComponent);

  var _super = snowAudioContainerView_createSuper(SnowAudioContainerView);

  function SnowAudioContainerView() {
    _classCallCheck(this, SnowAudioContainerView);

    return _super.call(this, 'div', ['snow-audio-container']);
  }

  _createClass(SnowAudioContainerView, [{
    key: "createSnowAudioContainerView",
    value: function createSnowAudioContainerView() {
      this.element.className = 'snow-audio-container menu-container';
      this.element.innerHTML = "\n      <div class=\"audio-control menu-item\"></div>\n      <div class=\"snow-control menu-item\"></div>          \n    ";
      return this.element;
    }
  }]);

  return SnowAudioContainerView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/christmasTreePage/tree-container/TreeContainerView.ts








function TreeContainerView_createSuper(Derived) { var hasNativeReflectConstruct = TreeContainerView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function TreeContainerView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var TreeContainerView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(TreeContainerView, _BaseComponent);

  var _super = TreeContainerView_createSuper(TreeContainerView);

  function TreeContainerView() {
    var _this;

    _classCallCheck(this, TreeContainerView);

    _this = _super.call(this, 'div', ['tree-container']);

    _defineProperty(_assertThisInitialized(_this), "treeCollection", void 0);

    _this.treeCollection = [1, 2, 3, 4, 5, 6];
    return _this;
  }

  _createClass(TreeContainerView, [{
    key: "createTreeContainerView",
    value: function createTreeContainerView() {
      this.element.className = 'tree-container menu-container';
      var fragment = document.createDocumentFragment();
      this.treeCollection.forEach(function (el) {
        var div = document.createElement('div');
        div.className = 'tree menu-item';
        div.setAttribute('data-tree', "".concat(el));
        fragment.appendChild(div);
      });
      this.element.appendChild(fragment);
      return this.element;
    }
  }]);

  return TreeContainerView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/christmasTreePage/pageContainer/PageContainerView.ts








function PageContainerView_createSuper(Derived) { var hasNativeReflectConstruct = PageContainerView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function PageContainerView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }









var PageContainerView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(PageContainerView, _BaseComponent);

  var _super = PageContainerView_createSuper(PageContainerView);

  function PageContainerView() {
    var _this;

    _classCallCheck(this, PageContainerView);

    _this = _super.call(this, 'div', ['page-container']);

    _defineProperty(_assertThisInitialized(_this), "snowAudioContainer", void 0);

    _defineProperty(_assertThisInitialized(_this), "treeContainer", void 0);

    _defineProperty(_assertThisInitialized(_this), "bgContainer", void 0);

    _defineProperty(_assertThisInitialized(_this), "garlandContainer", void 0);

    _defineProperty(_assertThisInitialized(_this), "mainTreeContainer", void 0);

    _defineProperty(_assertThisInitialized(_this), "favoriteAside", void 0);

    _this.snowAudioContainer = new SnowAudioContainerView();
    _this.treeContainer = new TreeContainerView();
    _this.bgContainer = new BgContainerView();
    _this.garlandContainer = new GarlandContainerView();
    _this.mainTreeContainer = new MainTreeContainerView();
    _this.favoriteAside = new FavoriteAsideView();
    return _this;
  }

  _createClass(PageContainerView, [{
    key: "createPageContainerView",
    value: function createPageContainerView() {
      var fragment = document.createDocumentFragment();
      var div = document.createElement('div');
      div.className = 'favorites-menu';
      div.appendChild(this.snowAudioContainer.createSnowAudioContainerView());
      div.appendChild(this.treeContainer.createTreeContainerView());
      div.appendChild(this.bgContainer.createBgContainerView());
      div.appendChild(this.garlandContainer.createGarlandContainerView());
      fragment.append(div, this.mainTreeContainer.createMainTreeContainerView(), this.favoriteAside.createFavoriteAsideView());
      this.element.appendChild(fragment);
      return this.element;
    }
  }]);

  return PageContainerView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/view/main/christmasTreePage/ChristmasTreePageView.ts








function ChristmasTreePageView_createSuper(Derived) { var hasNativeReflectConstruct = ChristmasTreePageView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function ChristmasTreePageView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }




var ChristmasTreePageView = /*#__PURE__*/function (_BaseComponent) {
  _inherits(ChristmasTreePageView, _BaseComponent);

  var _super = ChristmasTreePageView_createSuper(ChristmasTreePageView);

  function ChristmasTreePageView() {
    var _this;

    _classCallCheck(this, ChristmasTreePageView);

    _this = _super.call(this, 'div', ['christmas-tree-page']);

    _defineProperty(_assertThisInitialized(_this), "pageContainer", void 0);

    _this.pageContainer = new PageContainerView();
    return _this;
  }

  _createClass(ChristmasTreePageView, [{
    key: "createChristmasTreePage",
    value: function createChristmasTreePage() {
      this.element.className = 'page christmas-tree-page';
      this.element.setAttribute('data-page', 'christmas-tree-page');
      var fragment = document.createDocumentFragment();
      var div = document.createElement('div');
      div.className = 'blur';
      div.appendChild(this.pageContainer.createPageContainerView());
      fragment.appendChild(div);
      this.element.appendChild(fragment);
      return this.element;
    }
  }]);

  return ChristmasTreePageView;
}(BaseComponent);
;// CONCATENATED MODULE: ./components/controllers/LoadChristmasTreePage.ts



var LoadChristmasTreePage = /*#__PURE__*/function () {
  function LoadChristmasTreePage() {
    _classCallCheck(this, LoadChristmasTreePage);
  }

  _createClass(LoadChristmasTreePage, [{
    key: "getChristmasTreePageView",
    value: function getChristmasTreePageView() {
      return new ChristmasTreePageView().createChristmasTreePage();
    }
  }]);

  return LoadChristmasTreePage;
}();
;// CONCATENATED MODULE: ./components/controllers/ChristmasTreePageController.ts







var ChristmasTreePageController = /*#__PURE__*/function () {
  function ChristmasTreePageController() {
    _classCallCheck(this, ChristmasTreePageController);

    _defineProperty(this, "mainBlock", void 0);

    _defineProperty(this, "toysPageController", void 0);

    _defineProperty(this, "favouriteCardsCollection", void 0);

    this.mainBlock = document.querySelector('.main');
    this.toysPageController = new ToysPageController();
    this.favouriteCardsCollection = [];
  }

  _createClass(ChristmasTreePageController, [{
    key: "getFavoriteToys",
    value: function getFavoriteToys() {
      var favoriteCards = localStorage.getItem('favouriteCards');

      if (favoriteCards && favoriteCards != '[]') {
        return JSON.parse(favoriteCards);
      } else {
        return this.getCardsCollection();
      }
    }
  }, {
    key: "getCardsCollection",
    value: function getCardsCollection() {
      var cardArr = [];

      for (var i = 0; i < this.toysPageController.cardsCollection.length; i++) {
        if (i < 20) {
          cardArr.push(this.toysPageController.cardsCollection[i]);
        } else {
          break;
        }
      }

      return cardArr;
    }
  }, {
    key: "getAllFavouriteCardsView",
    value: function getAllFavouriteCardsView() {
      this.favouriteCardsCollection = this.getFavoriteToys();
      return this.favouriteCardsCollection.map(function (el) {
        return new FavoriteCardView().createFavoritesCard(el);
      });
    }
  }, {
    key: "renderAllFavoriteCards",
    value: function renderAllFavoriteCards() {
      var favoritecardsContainer = document.querySelector('.favorites-container');

      if (favoritecardsContainer) {
        while (favoritecardsContainer.firstChild) {
          favoritecardsContainer.removeChild(favoritecardsContainer.firstChild);
        }

        favoritecardsContainer.append.apply(favoritecardsContainer, _toConsumableArray(this.getAllFavouriteCardsView()));
      }
    }
  }, {
    key: "renderChristmasTreePage",
    value: function renderChristmasTreePage() {
      if (this.mainBlock) {
        while (this.mainBlock.firstChild) {
          this.mainBlock.removeChild(this.mainBlock.firstChild);
        }

        this.mainBlock.appendChild(new LoadChristmasTreePage().getChristmasTreePageView());
      }
    }
  }, {
    key: "createGarland",
    value: function createGarland(garlandColor) {
      var garlandContainer = document.querySelector('.garland-tree-container');

      if (garlandContainer) {
        var fragment = document.createDocumentFragment();
        fragment.appendChild(this.createGarlandLine1(garlandColor));
        fragment.appendChild(this.createGarlandLine2(garlandColor));
        fragment.appendChild(this.createGarlandLine3(garlandColor));
        fragment.appendChild(this.createGarlandLine4(garlandColor));
        fragment.appendChild(this.createGarlandLine5(garlandColor));
        fragment.appendChild(this.createGarlandLine6(garlandColor));
        fragment.appendChild(this.createGarlandLine7(garlandColor));
        fragment.appendChild(this.createGarlandLine8(garlandColor));
        garlandContainer.appendChild(fragment);
      }
    }
  }, {
    key: "createGarlandLine1",
    value: function createGarlandLine1() {
      var garlandColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'multicolor';
      var ul = document.createElement('ul');
      ul.className = 'lightrope';
      ul.style.width = '120px';
      ul.style.height = '120px';
      var rotate = 65;

      for (var i = 0; i < 5; i++) {
        var li = document.createElement('li');
        li.className = "".concat(garlandColor);
        li.style.transform = "rotate(".concat(rotate, "deg) translate(60px) rotate(-").concat(rotate, "deg)");
        ul.appendChild(li);
        rotate += 12;
      }

      return ul;
    }
  }, {
    key: "createGarlandLine2",
    value: function createGarlandLine2() {
      var garlandColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'multicolor';
      var ul = document.createElement('ul');
      ul.className = 'lightrope';
      ul.style.width = '170px';
      ul.style.height = '170px';
      var rotate = 60;

      for (var i = 0; i < 7; i++) {
        var li = document.createElement('li');
        li.className = "".concat(garlandColor);
        li.style.transform = "rotate(".concat(rotate, "deg) translate(85px) rotate(-").concat(rotate, "deg)");
        ul.appendChild(li);
        rotate += 10;
      }

      return ul;
    }
  }, {
    key: "createGarlandLine3",
    value: function createGarlandLine3() {
      var garlandColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'multicolor';
      var ul = document.createElement('ul');
      ul.className = 'lightrope';
      ul.style.width = '230px';
      ul.style.height = '230px';
      var rotate = 60;

      for (var i = 0; i < 8; i++) {
        var li = document.createElement('li');
        li.className = "".concat(garlandColor);
        li.style.transform = "rotate(".concat(rotate, "deg) translate(115px) rotate(-").concat(rotate, "deg)");
        ul.appendChild(li);
        rotate += 8;
      }

      return ul;
    }
  }, {
    key: "createGarlandLine4",
    value: function createGarlandLine4() {
      var garlandColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'multicolor';
      var ul = document.createElement('ul');
      ul.className = 'lightrope';
      ul.style.width = '300px';
      ul.style.height = '300px';
      var rotate = 60;

      for (var i = 0; i < 11; i++) {
        var li = document.createElement('li');
        li.className = "".concat(garlandColor);
        li.style.transform = "rotate(".concat(rotate, "deg) translate(150px) rotate(-").concat(rotate, "deg)");
        ul.appendChild(li);
        rotate += 6;
      }

      return ul;
    }
  }, {
    key: "createGarlandLine5",
    value: function createGarlandLine5() {
      var garlandColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'multicolor';
      var ul = document.createElement('ul');
      ul.className = 'lightrope';
      ul.style.width = '380px';
      ul.style.height = '380px';
      var rotate = 55;

      for (var i = 0; i < 18; i++) {
        var li = document.createElement('li');
        li.className = "".concat(garlandColor);
        li.style.transform = "rotate(".concat(rotate, "deg) translate(190px) rotate(-").concat(rotate, "deg)");
        ul.appendChild(li);
        rotate += 4;
      }

      return ul;
    }
  }, {
    key: "createGarlandLine6",
    value: function createGarlandLine6() {
      var garlandColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'multicolor';
      var ul = document.createElement('ul');
      ul.className = 'lightrope';
      ul.style.width = '465px';
      ul.style.height = '465px';
      var rotate = 55;

      for (var i = 0; i < 21; i++) {
        var li = document.createElement('li');
        li.className = "".concat(garlandColor);
        li.style.transform = "rotate(".concat(rotate, "deg) translate(232.5px) rotate(-").concat(rotate, "deg)");
        ul.appendChild(li);
        rotate += 3.5;
      }

      return ul;
    }
  }, {
    key: "createGarlandLine7",
    value: function createGarlandLine7() {
      var garlandColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'multicolor';
      var ul = document.createElement('ul');
      ul.className = 'lightrope';
      ul.style.width = '555px';
      ul.style.height = '555px';
      var rotate = 58;

      for (var i = 0; i < 24; i++) {
        var li = document.createElement('li');
        li.className = "".concat(garlandColor);
        li.style.transform = "rotate(".concat(rotate, "deg) translate(277.5px) rotate(-").concat(rotate, "deg)");
        ul.appendChild(li);
        rotate += 3;
      }

      return ul;
    }
  }, {
    key: "createGarlandLine8",
    value: function createGarlandLine8() {
      var garlandColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'multicolor';
      var ul = document.createElement('ul');
      ul.className = 'lightrope';
      ul.style.width = '650px';
      ul.style.height = '650px';
      var rotate = 58;

      for (var i = 0; i < 29; i++) {
        var li = document.createElement('li');
        li.className = "".concat(garlandColor);
        li.style.transform = "rotate(".concat(rotate, "deg) translate(325px) rotate(-").concat(rotate, "deg)");
        ul.appendChild(li);
        rotate += 2.5;
      }

      return ul;
    }
  }, {
    key: "clearLocalStorage",
    value: function clearLocalStorage() {
      if (localStorage.getItem('audio')) {
        localStorage.removeItem('audio');
      }

      if (localStorage.getItem('snowflakes')) {
        localStorage.removeItem('snowflakes');
      }

      if (localStorage.getItem('mainTreeNum')) {
        localStorage.removeItem('mainTreeNum');
      }

      if (localStorage.getItem('mainTreeBgNum')) {
        localStorage.removeItem('mainTreeBgNum');
      }

      if (localStorage.getItem('garlandColor')) {
        localStorage.removeItem('garlandColor');
      }

      if (localStorage.getItem('isGarlandOn')) {
        localStorage.removeItem('isGarlandOn');
      }
    }
  }, {
    key: "resetToOriginalState",
    value: function resetToOriginalState(audio) {
      var audioControl = document.querySelector('.audio-control');
      var snowControl = document.querySelector('.snow-control');
      var snowflakes = document.querySelector('.snowflakes');
      var mainTree = document.querySelector('.main-tree');
      var mainTreeContainer = document.querySelector('.main-tree-container');
      var switchEl = document.querySelector('.onoffswitch-switch');
      var switchInner = document.querySelector('.onoffswitch-inner');
      var garlandContainer = document.querySelector('.garland-tree-container');
      audioControl === null || audioControl === void 0 ? void 0 : audioControl.classList.remove('active');
      audio.pause();
      snowControl === null || snowControl === void 0 ? void 0 : snowControl.classList.remove('active');
      snowflakes === null || snowflakes === void 0 ? void 0 : snowflakes.classList.add('hide');
      mainTree === null || mainTree === void 0 ? void 0 : mainTree.setAttribute('src', './assets/tree/1.png');

      if (mainTreeContainer && switchEl && switchInner) {
        mainTreeContainer.style.backgroundImage = 'url(./assets/bg/1.jpg)';
        switchEl.style.right = '0';
        switchInner.style.marginLeft = '0';
      }

      while (garlandContainer !== null && garlandContainer !== void 0 && garlandContainer.firstChild) {
        garlandContainer.removeChild(garlandContainer.firstChild);
      }
    }
  }]);

  return ChristmasTreePageController;
}();
;// CONCATENATED MODULE: ./components/controllers/ChristmasTreeListeners.ts




var ChristmasTreeListeners = /*#__PURE__*/function () {
  function ChristmasTreeListeners() {
    _classCallCheck(this, ChristmasTreeListeners);

    _defineProperty(this, "christmasTreeController", void 0);

    this.christmasTreeController = new ChristmasTreePageController();
  }

  _createClass(ChristmasTreeListeners, [{
    key: "addListenerToAudioControl",
    value: function addListenerToAudioControl(audio) {
      var audioControl = document.querySelector('.audio-control');
      audioControl === null || audioControl === void 0 ? void 0 : audioControl.addEventListener('click', function () {
        audioControl.classList.toggle('active');

        if (audio.paused) {
          audio.play();
          localStorage.setItem('audio', 'played');
        } else {
          audio.pause();
          localStorage.setItem('audio', 'paused');
        }
      });
    }
  }, {
    key: "addListenerToSnowControl",
    value: function addListenerToSnowControl() {
      var snowControl = document.querySelector('.snow-control');
      var snowflakes = document.querySelector('.snowflakes');
      snowControl === null || snowControl === void 0 ? void 0 : snowControl.addEventListener('click', function () {
        snowControl.classList.toggle('active');

        if (snowflakes !== null && snowflakes !== void 0 && snowflakes.classList.contains('hide')) {
          snowflakes === null || snowflakes === void 0 ? void 0 : snowflakes.classList.remove('hide');
          localStorage.setItem('snowflakes', 'true');
        } else {
          snowflakes === null || snowflakes === void 0 ? void 0 : snowflakes.classList.add('hide');
          localStorage.setItem('snowflakes', 'false');
        }
      });
    }
  }, {
    key: "addListenerToTreeContainer",
    value: function addListenerToTreeContainer() {
      var treeContainer = document.querySelector('.tree-container');
      var mainTree = document.querySelector('.main-tree');

      if (treeContainer && mainTree) {
        treeContainer.addEventListener('click', function (ev) {
          var tree = ev.target;
          mainTree.setAttribute('src', "./assets/tree/".concat(tree.getAttribute('data-tree'), ".png"));
          localStorage.setItem('mainTreeNum', "".concat(tree.getAttribute('data-tree')));
        });
      }
    }
  }, {
    key: "addListenerToBgContainer",
    value: function addListenerToBgContainer() {
      var treeContainer = document.querySelector('.bg-container');
      var mainTreeContainer = document.querySelector('.main-tree-container');

      if (treeContainer && mainTreeContainer) {
        treeContainer.addEventListener('click', function (ev) {
          var bg = ev.target;
          var img = new Image();
          img.src = "./assets/bg/".concat(bg.getAttribute('data-bg'), ".jpg");

          img.onload = function () {
            mainTreeContainer.style.backgroundImage = "url(".concat(img.src, ")");
          };

          localStorage.setItem('mainTreeBgNum', "".concat(bg.getAttribute('data-bg')));
        });
      }
    }
  }, {
    key: "addListenerToOnOffSwitch",
    value: function addListenerToOnOffSwitch() {
      var _this = this;

      var onOffSwitchLabel = document.querySelector('.onoffswitch-label');
      var garlandContainer = document.querySelector('.garland-tree-container');
      var switchEl = document.querySelector('.onoffswitch-switch');
      var switchInner = document.querySelector('.onoffswitch-inner');
      var garlandColor = localStorage.getItem('garlandColor');

      if (onOffSwitchLabel && switchEl && switchInner) {
        onOffSwitchLabel.addEventListener('click', function () {
          if ((garlandContainer === null || garlandContainer === void 0 ? void 0 : garlandContainer.firstChild) == null) {
            _this.christmasTreeController.createGarland(garlandColor);

            localStorage.setItem('isGarlandOn', 'true');
            switchEl.style.right = '55px';
            switchInner.style.marginLeft = '-100%';
          } else {
            while (garlandContainer !== null && garlandContainer !== void 0 && garlandContainer.firstChild) {
              garlandContainer.removeChild(garlandContainer.firstChild);
            }

            localStorage.setItem('isGarlandOn', 'false');
            switchEl.style.right = '0';
            switchInner.style.marginLeft = '0';
          }
        });
      }
    }
  }, {
    key: "addListenerToGarlandsBtns",
    value: function addListenerToGarlandsBtns() {
      var garlandBtnsBlock = document.querySelector('.garland-btns');

      if (garlandBtnsBlock) {
        garlandBtnsBlock.addEventListener('click', function (ev) {
          var garlandColor = ev.target;
          var lightsCollection = document.querySelectorAll('.lightrope li');

          if (garlandColor) {
            lightsCollection.forEach(function (el) {
              el.className = '';
              el.className = "".concat(garlandColor.getAttribute('data-color'));
            });
            localStorage.setItem('garlandColor', "".concat(garlandColor.getAttribute('data-color')));
          }
        });
      }
    }
  }, {
    key: "addListenerToBtnClearLocalStorage",
    value: function addListenerToBtnClearLocalStorage(audio) {
      var _this2 = this;

      var btnReset = document.querySelector('.favorites-decorate button');
      btnReset === null || btnReset === void 0 ? void 0 : btnReset.addEventListener('click', function () {
        _this2.christmasTreeController.clearLocalStorage();

        _this2.christmasTreeController.resetToOriginalState(audio);
      });
    }
  }]);

  return ChristmasTreeListeners;
}();
;// CONCATENATED MODULE: ./components/controllers/ToysPageListeners.ts




var ToysPageListeners = /*#__PURE__*/function () {
  function ToysPageListeners() {
    _classCallCheck(this, ToysPageListeners);

    _defineProperty(this, "toysPageController", void 0);

    this.toysPageController = new ToysPageController();
  }

  _createClass(ToysPageListeners, [{
    key: "addListenerToFiltersByValue",
    value: function addListenerToFiltersByValue(type) {
      var _localStorage$getItem,
          _this = this;

      var elBlock = document.querySelector(".".concat(type));
      var elementsArr = [];
      var values = (_localStorage$getItem = localStorage.getItem("".concat(type))) === null || _localStorage$getItem === void 0 ? void 0 : _localStorage$getItem.split(',');

      if (values) {
        elementsArr = values;
      }

      if (elBlock) {
        elBlock.addEventListener('click', function (ev) {
          var currentEl = ev.target;
          var currentElValue = currentEl.dataset.filter;

          if (currentElValue && currentEl.classList.contains('active')) {
            currentEl.classList.remove('active');
            elementsArr.splice(elementsArr.indexOf(currentElValue), 1);
          } else {
            currentEl.classList.add('active');

            if (currentElValue) {
              elementsArr.push(currentElValue);
            }
          }

          localStorage.setItem("".concat(type), "".concat(elementsArr));

          _this.toysPageController.filterCardsByValue(type);
        });
      }
    }
  }, {
    key: "addListenerToFavoiriteBlock",
    value: function addListenerToFavoiriteBlock() {
      var _this2 = this;

      var favouriteInput = document.querySelector('.favorite-input');
      favouriteInput === null || favouriteInput === void 0 ? void 0 : favouriteInput.addEventListener('click', function () {
        if (favouriteInput.checked) {
          localStorage.setItem('favourite', "".concat(true));
        } else {
          localStorage.setItem('favourite', "".concat(false));
        }

        _this2.toysPageController.filterCardsByFavourite();
      });
    }
  }, {
    key: "addListenerToSortSelect",
    value: function addListenerToSortSelect() {
      var _this3 = this;

      var sortSelect = document.querySelector('.sort-select');
      var sortSelectOptions = document.querySelectorAll('.sort-select option');
      sortSelect === null || sortSelect === void 0 ? void 0 : sortSelect.addEventListener('change', function () {
        localStorage.setItem('sort', "".concat(sortSelect.options[sortSelect.selectedIndex].value));
        sortSelectOptions.forEach(function (el) {
          el.removeAttribute('selected');
        });
        sortSelectOptions[sortSelect.selectedIndex].setAttribute('selected', 'selected');

        _this3.toysPageController.sortCards();
      });
    }
  }, {
    key: "resetFilters",
    value: function resetFilters() {
      var shapeButtons = document.querySelectorAll('.shape button');
      var colorButtons = document.querySelectorAll('.color button');
      var sizeButtons = document.querySelectorAll('.size button');
      var favouriteInput = document.querySelector('.favorite-input');
      var countSlider = document.querySelector('.count-slider');
      var yearSlider = document.querySelector('.year-slider');
      var sliderOutputs = document.querySelectorAll('.slider-output');
      shapeButtons.forEach(function (el) {
        el.classList.remove('active');
      });
      colorButtons.forEach(function (el) {
        el.classList.remove('active');
      });
      sizeButtons.forEach(function (el) {
        el.classList.remove('active');
      });
      if (favouriteInput) favouriteInput.checked = false;

      if (countSlider) {
        countSlider.noUiSlider.set([1, 12]);
        sliderOutputs[0].innerHTML = '1';
        sliderOutputs[1].innerHTML = '12';
      }

      if (yearSlider) {
        yearSlider.noUiSlider.set([1940, 2020]);
        sliderOutputs[2].innerHTML = '1940';
        sliderOutputs[3].innerHTML = '2020';
      }

      this.toysPageController.filteredCardsCollection = this.toysPageController.cardsCollection;
      this.toysPageController.renderAllCards();
    }
  }, {
    key: "addListenerToResetSettingsBtn",
    value: function addListenerToResetSettingsBtn() {
      var _this4 = this;

      var btnReset = document.querySelector('.sort .reset-settings');
      var select = document.querySelector('.select span');
      var sortSelectOptions = document.querySelectorAll('.sort-select option');
      btnReset === null || btnReset === void 0 ? void 0 : btnReset.addEventListener('click', function () {
        if (localStorage.getItem('shape')) {
          localStorage.removeItem('shape');
        }

        if (localStorage.getItem('color')) {
          localStorage.removeItem('color');
        }

        if (localStorage.getItem('size')) {
          localStorage.removeItem('size');
        }

        if (localStorage.getItem('favourite')) {
          localStorage.removeItem('favourite');
        }

        if (localStorage.getItem('countSliderValues')) {
          localStorage.removeItem('countSliderValues');
        }

        if (localStorage.getItem('yearSliderValues')) {
          localStorage.removeItem('yearSliderValues');
        }

        if (localStorage.getItem('sort')) {
          localStorage.removeItem('sort');
        }

        if (localStorage.getItem('favouriteCards')) {
          localStorage.removeItem('favouriteCards');
        }

        if (localStorage.getItem('favouriteCount')) {
          localStorage.removeItem('favouriteCount');
        }

        if (select) {
          select.innerHTML = '0';
        }

        sortSelectOptions.forEach(function (el) {
          el.removeAttribute('selected');
        });
        sortSelectOptions[0].setAttribute('selected', 'selected');

        _this4.resetFilters();
      });
    }
  }, {
    key: "addListenerToResetFilterBtn",
    value: function addListenerToResetFilterBtn() {
      var _this5 = this;

      var btnReset = document.querySelector('.reset-filters');
      btnReset === null || btnReset === void 0 ? void 0 : btnReset.addEventListener('click', function () {
        _this5.resetFilters();
      });
    }
  }, {
    key: "addListenerToCards",
    value: function addListenerToCards() {
      var _this6 = this;

      var cardsContainer = document.querySelector('.cards-container');
      var select = document.querySelector('.select span');
      cardsContainer === null || cardsContainer === void 0 ? void 0 : cardsContainer.addEventListener('click', function (event) {
        var card = event.target;
        var cardEl = card;

        if (cardEl.classList.contains('card')) {
          if (!cardEl.classList.contains('active')) {
            if (_this6.toysPageController.favouriteCollection.length < 20) {
              cardEl.classList.add('active');

              _this6.toysPageController.addToFavouriteCollection(cardEl, select);
            } else {
              alert('Извините, все слоты заполнены');
            }
          } else {
            cardEl.classList.remove('active');

            _this6.toysPageController.deleteFromFavouriteCollection(cardEl, select);
          }
        }
      });
    }
  }]);

  return ToysPageListeners;
}();
;// CONCATENATED MODULE: ./components/controllers/LocalStorageData.ts





var LocalStorageData = /*#__PURE__*/function () {
  function LocalStorageData() {
    _classCallCheck(this, LocalStorageData);

    _defineProperty(this, "toysPageController", void 0);

    _defineProperty(this, "christmasTreeController", void 0);

    this.toysPageController = new ToysPageController();
    this.christmasTreeController = new ChristmasTreePageController();
  }

  _createClass(LocalStorageData, [{
    key: "getFromLocalStorage",
    value: function getFromLocalStorage(type) {
      var _localStorage$getItem;

      var values = (_localStorage$getItem = localStorage.getItem(type)) === null || _localStorage$getItem === void 0 ? void 0 : _localStorage$getItem.split(',');

      if (values && values != ['']) {
        values.forEach(function (el) {
          var element = document.querySelector(".".concat(type, " button[data-filter=\"").concat(el, "\"]"));
          element === null || element === void 0 ? void 0 : element.classList.add('active');
        });
      }
    }
  }, {
    key: "changeFavouriteBlockByLocalStorage",
    value: function changeFavouriteBlockByLocalStorage() {
      var favorite = localStorage.getItem('favourite');
      var favoriteInput = document.querySelector('.favorite-input');

      if (favorite && favorite == 'true' && favoriteInput) {
        favoriteInput.checked = true;
      }
    }
  }, {
    key: "changeSortSelectByLocalStorage",
    value: function changeSortSelectByLocalStorage() {
      var selectedOptionValue = localStorage.getItem('sort');
      var sortSelectOptions = document.querySelectorAll('.sort-select option');
      sortSelectOptions.forEach(function (el) {
        if (el.value == selectedOptionValue) {
          el.setAttribute('selected', 'selected');
        } else {
          el.removeAttribute('selected');
        }
      });
      this.toysPageController.sortCards();
    }
  }, {
    key: "changeFavouriteCardsCountByLocalStorage",
    value: function changeFavouriteCardsCountByLocalStorage() {
      var select = document.querySelector('.select span');
      var favouriteCount = localStorage.getItem('favouriteCount');

      if (select && favouriteCount) {
        select.innerHTML = "".concat(favouriteCount);
      }
    }
  }, {
    key: "changeFavouriteCardsByLocalStorage",
    value: function changeFavouriteCardsByLocalStorage() {
      var cardEl = document.querySelectorAll('.card');
      var cards = localStorage.getItem('favouriteCards');

      if (cards) {
        var favouriteCards = JSON.parse(cards);
        cardEl.forEach(function (el) {
          favouriteCards.forEach(function (elem) {
            var _el$firstElementChild;

            if (((_el$firstElementChild = el.firstElementChild) === null || _el$firstElementChild === void 0 ? void 0 : _el$firstElementChild.textContent) == elem.name) {
              el.classList.add('active');
            }
          });
        });
      }
    } // Christmas Tree Page

  }, {
    key: "changeAudioConditionByLocalStorage",
    value: function changeAudioConditionByLocalStorage(audio) {
      var audioControl = document.querySelector('.audio-control');
      var christmasTreeContainer = document.querySelector('.christmas-tree-page');
      var condition = localStorage.getItem('audio');

      if (audioControl && condition && condition == 'played') {
        audioControl.classList.add('active');
        christmasTreeContainer === null || christmasTreeContainer === void 0 ? void 0 : christmasTreeContainer.addEventListener('click', function () {
          audio.play();
        }, {
          once: true
        });
      }
    }
  }, {
    key: "changeSnowflakesByLocalStorage",
    value: function changeSnowflakesByLocalStorage() {
      var snowControl = document.querySelector('.snow-control');
      var snowflakes = document.querySelector('.snowflakes');
      var isSnowFall = localStorage.getItem('snowflakes');

      if (snowControl && isSnowFall && isSnowFall == 'true') {
        snowControl.classList.add('active');
        snowflakes === null || snowflakes === void 0 ? void 0 : snowflakes.classList.remove('hide');
      }
    }
  }, {
    key: "changeMainTreeByLocalStorage",
    value: function changeMainTreeByLocalStorage() {
      var mainTree = document.querySelector('.main-tree');
      var mainTreeNum = localStorage.getItem('mainTreeNum');

      if (mainTree && mainTreeNum) {
        mainTree.setAttribute('src', "./assets/tree/".concat(mainTreeNum, ".png"));
      }
    }
  }, {
    key: "changeBgMainTreeByLocalStorage",
    value: function changeBgMainTreeByLocalStorage() {
      var mainTreeContainer = document.querySelector('.main-tree-container');
      var mainTreeBgNum = localStorage.getItem('mainTreeBgNum');

      if (mainTreeContainer && mainTreeBgNum) {
        mainTreeContainer.style.backgroundImage = "url(./assets/bg/".concat(mainTreeBgNum, ".jpg)");
      }
    }
  }, {
    key: "changeGarlandByLocalStorage",
    value: function changeGarlandByLocalStorage() {
      var garlandState = localStorage.getItem('isGarlandOn');
      var garlandColor = localStorage.getItem('garlandColor');
      var switchEl = document.querySelector('.onoffswitch-switch');
      var switchInner = document.querySelector('.onoffswitch-inner');

      if (garlandState && garlandState == 'true' && switchEl && switchInner) {
        this.christmasTreeController.createGarland(garlandColor);
        switchEl.style.right = '55px';
        switchInner.style.marginLeft = '-100%';
      }
    }
  }]);

  return LocalStorageData;
}();
;// CONCATENATED MODULE: ./app.ts













var App = /*#__PURE__*/function () {
  function App() {
    _classCallCheck(this, App);

    _defineProperty(this, "header", void 0);

    _defineProperty(this, "main", void 0);

    _defineProperty(this, "footer", void 0);

    _defineProperty(this, "startPageController", void 0);

    _defineProperty(this, "toysPageController", void 0);

    _defineProperty(this, "christmasPageController", void 0);

    _defineProperty(this, "isDestroy", void 0);

    _defineProperty(this, "noUiSlider", void 0);

    _defineProperty(this, "toysPageListeners", void 0);

    _defineProperty(this, "christmasTreeListeners", void 0);

    _defineProperty(this, "localStorageData", void 0);

    this.header = new HeaderView();
    document.body.appendChild(this.header.element);
    this.main = new MainView();
    document.body.appendChild(this.main.element);
    this.footer = new FooterView();
    document.body.appendChild(this.footer.element);
    this.startPageController = new StartPageController();
    this.startPageController.renderStartPage();
    this.toysPageController = new ToysPageController();
    this.christmasPageController = new ChristmasTreePageController();
    this.isDestroy = false;
    this.noUiSlider = new NoUiSliderController();
    this.toysPageListeners = new ToysPageListeners();
    this.christmasTreeListeners = new ChristmasTreeListeners();
    this.localStorageData = new LocalStorageData();
  }

  _createClass(App, [{
    key: "start",
    value: function start() {
      var _this = this;

      var navBar = document.querySelector('.nav-bar');

      if (localStorage.getItem('favouriteCount')) {
        this.localStorageData.changeFavouriteCardsCountByLocalStorage();
      }

      if (navBar) {
        navBar.addEventListener('click', function (e) {
          var navBtn = e.target;

          if (navBtn.classList.contains('start-page-link')) {
            _this.startPageController.renderStartPage();

            if (_this.isDestroy) {
              _this.addListenerBtnBegin();
            }
          }

          if (navBtn.classList.contains('toys-page-link')) {
            _this.isDestroy = true;

            _this.switchToToysPage();
          }

          if (navBtn.classList.contains('christmas-tree-page-link')) {
            _this.switchToChristmasTreePage();
          }
        });
      }

      this.addListenerBtnBegin();
    }
  }, {
    key: "addListenerBtnBegin",
    value: function addListenerBtnBegin() {
      var _this2 = this;

      var btnStart = document.querySelector('.switch-toys-page');

      if (btnStart) {
        btnStart.addEventListener('click', function () {
          _this2.switchToToysPage();
        });
      }
    }
  }, {
    key: "switchToToysPage",
    value: function switchToToysPage() {
      this.toysPageController.renderToysPage();
      this.toysPageController.renderAllCards();

      if (localStorage.getItem('shape')) {
        this.localStorageData.getFromLocalStorage('shape');
      }

      if (localStorage.getItem('color')) {
        this.localStorageData.getFromLocalStorage('color');
      }

      if (localStorage.getItem('size')) {
        this.localStorageData.getFromLocalStorage('size');
      }

      if (localStorage.getItem('favourite')) {
        this.localStorageData.changeFavouriteBlockByLocalStorage();
      }

      if (localStorage.getItem('sort')) {
        this.localStorageData.changeSortSelectByLocalStorage();
      }

      if (localStorage.getItem('favouriteCards')) {
        this.localStorageData.changeFavouriteCardsByLocalStorage();
      }

      this.noUiSlider.createCountSlider();
      this.noUiSlider.createYearSlider();
      this.toysPageListeners.addListenerToFiltersByValue('shape');
      this.toysPageListeners.addListenerToFiltersByValue('color');
      this.toysPageListeners.addListenerToFiltersByValue('size');
      this.toysPageListeners.addListenerToFavoiriteBlock();
      this.toysPageListeners.addListenerToSortSelect();
      this.toysPageListeners.addListenerToResetFilterBtn();
      this.toysPageListeners.addListenerToResetSettingsBtn();
      this.toysPageListeners.addListenerToCards();
    }
  }, {
    key: "switchToChristmasTreePage",
    value: function switchToChristmasTreePage() {
      this.christmasPageController.renderChristmasTreePage();
      this.christmasPageController.renderAllFavoriteCards();
      var audio = new Audio();
      audio.src = './assets/audio/audio.mp3';
      audio.loop = true;

      if (localStorage.getItem('audio')) {
        this.localStorageData.changeAudioConditionByLocalStorage(audio);
      }

      if (localStorage.getItem('snowflakes')) {
        this.localStorageData.changeSnowflakesByLocalStorage();
      }

      if (localStorage.getItem('mainTreeNum')) {
        this.localStorageData.changeMainTreeByLocalStorage();
      }

      if (localStorage.getItem('mainTreeBgNum')) {
        this.localStorageData.changeBgMainTreeByLocalStorage();
      }

      if (localStorage.getItem('isGarlandOn')) {
        this.localStorageData.changeGarlandByLocalStorage();
      }

      this.christmasTreeListeners.addListenerToAudioControl(audio);
      this.christmasTreeListeners.addListenerToSnowControl();
      this.christmasTreeListeners.addListenerToTreeContainer();
      this.christmasTreeListeners.addListenerToBgContainer();
      this.christmasTreeListeners.addListenerToOnOffSwitch();
      this.christmasTreeListeners.addListenerToGarlandsBtns();
      this.christmasTreeListeners.addListenerToBtnClearLocalStorage(audio);
      this.christmasTreeListeners.dragImage();
    }
  }]);

  return App;
}();
;// CONCATENATED MODULE: ./index.ts



window.onload = function () {
  var app = new App();
  app.start();
};
})();

/******/ })()
;