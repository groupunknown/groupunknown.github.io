function isSpecialString(s) {
    return (s === "true" ||
        s === "false" ||
        s === "~" ||
        s === "null" ||
        s === "undefined" ||
        s === "}" ||
        s === "]" ||
        !isNaN(+s) ||
        !isNaN(Date.parse(s)) ||
        s.startsWith("-") ||
        s.startsWith("{") ||
        s.startsWith("[") ||
        /^\s/.test(s) ||
        /[:,&*#?|<>=!%@`]/.test(s) ||
        JSON.stringify(s) != "\"" + s + "\"");
}
function removeTrailingSpaces(input) {
    return input.split("\n").map(function (s) { return s.trimRight(); }).join("\n");
}
function typeOf(x) {
    if (x === null)
        return "null";
    if (x === undefined)
        return "undefined";
    switch (Object.prototype.toString.call(x)) {
        case "[object Array]":
            return "array";
        case "[object Boolean]":
            return "boolean";
        case "[object Date]":
            return "date";
        case "[object Function]":
            return "function";
        case "[object Number]":
            return "number";
        case "[object Object]":
            return "object";
        case "[object RegExp]":
            return "regexp";
        case "[object String]":
            return "string";
        default:
            return "object";
    }
}
var handlers = {
    "undefined": undefinedHandler,
    "null": nullHandler,
    "number": numberHandler,
    "boolean": booleanHandler,
    "string": stringHandler,
    "function": functionHandler,
    "array": arrayHandler,
    "object": objectHandler,
};
function undefinedHandler() {
    return "null";
}
function nullHandler() {
    return "null";
}
function numberHandler(n) {
    return n.toString();
}
function booleanHandler(b) {
    return b.toString();
}
function stringHandler(s) {
    return isSpecialString(s) ? JSON.stringify(s) : s;
}
function functionHandler() {
    return "[object Function]";
}
function arrayHandler(a, indentLevel, numSpaces) {
    if (indentLevel === void 0) { indentLevel = 0; }
    if (numSpaces === void 0) { numSpaces = 2; }
    if (a.length === 0) {
        return "[]";
    }
    return a.reduce(function (output, el) {
        var type = typeOf(el);
        var handler = handlers[type];
        if (handler === undefined) {
            throw new Error("Encountered unknown type: " + type);
        }
        var indent = " ".repeat(indentLevel * numSpaces);
        var gap = " ".repeat(numSpaces - 1);
        return output + "\n" + indent + "-" + gap + handler(el, indentLevel + 1, numSpaces).trimLeft();
    }, "");
}
function objectHandler(o, indentLevel, numSpaces) {
    if (indentLevel === void 0) { indentLevel = 0; }
    if (numSpaces === void 0) { numSpaces = 2; }
    if (Object.keys(o).length === 0) {
        return "{}";
    }
    return Object.keys(o).reduce(function (output, k, i) {
        var val = o[k];
        var type = typeOf(val);
        var handler = handlers[type];
        if (handler === undefined) {
            throw new Error("Encountered unknown type: " + type);
        }
        var indent = " ".repeat(indentLevel * numSpaces);
        var keyString = stringHandler(k);
        return output + "\n" + indent + keyString + ": " + handler(val, indentLevel + 1, numSpaces);
    }, "");
}
function json2yaml(s, numSpaces) {
    if (numSpaces === void 0) { numSpaces = 2; }
    if (numSpaces < 2) {
        throw new Error("Invalid argument: numSpaces has to be > 1");
    }
    var o = s;
    var yaml = handlers[typeOf(o)](o, 0, numSpaces);
    return removeTrailingSpaces(yaml).trimLeft().concat("\n");
}