'use strict';

function error(msg, options) {
    console.log(msg);
    throw msg;
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function checkelem(obj, types, options)
{
    for (var key in types)
    {
        if (types[key] instanceof RegExp)
        {
            if (typeof obj[key] == "string" && types[key].test(obj[key]))
                continue;
            else
                error("ParamChecker: RegExp not match or isn't a string", options);
        }
        else if (types[key] instanceof Function)
        {
            if (!types[key](obj[key]))
                error("ParamChecker: Function check return false", options);
        }
        else if (typeof types[key] === "object")
        {
            if (types[key] instanceof Array)
            {
                if (!checkarray(obj[key], types[key]))
                    error("ParamChecker: Wrong Array", options);
            }
            else if (!checkobject(obj[key], types[key]))
                error("ParamChecker: Wrong Object", options);
        }
        else if (typeof obj[key] != types[key])
            error("ParamChecker: Wrong Type (" + typeof obj[key] + " != " + types[key] + ")", options);
    }
    return true;
}

function checkarray(obj, types, options)
{
    if (!(types instanceof Array) || !(obj instanceof Array))
        error("ParamChecker: isn't Array", options);
    if (obj.length != types.length)
        error("ParamChecker: Array bad length", options);
    return checkelem(obj, types, options);
}

function checkobject(obj, types, options)
{
    if (!(types instanceof Object) || !(obj instanceof Object))
        error("ParamChecker: isn't Object", options);
    if (!arraysEqual(Object.keys(types), Object.keys(obj)))
        error("ParamChecker: Object property not equals", options);
    return checkelem(obj, types, options);
}

function checkargs(types, fn, options)
{
    return function () {
        var args = Array.prototype.slice.call(arguments);
        checkarray(args, types, options);
        return fn.apply(this, args);
    };
}

function errorIsChecker(msg) {
    error('is checker: ' + msg);
}

function isString(str) {
    if (typeof str != 'string')
        errorIsChecker("isn't string");
    return str;
}

function isNumber(a) {
    if (typeof a != 'number')
        errorIsChecker("isn't number");
    return a;
}

function stringLen(str) {
    isString(str);
    return str.length;
}

var equals = function (value) {
    var _privScope = function (value, fn) {
        var equals = function (n) {
            return value === n || (fn ? fn(n) : false);
        };
        equals.or = function (value) {
            return _privScope(value, equals);
        };
        return equals;
    };
    return _privScope(value);
};

var is = {
    string: {
        with: {
            length: {
                equals: function (len) {
                    return function (str) {
                        return len === stringLen(str);
                    };
                },
                supp: function (len) {
                    return function (str) {
                        return len < stringLen(str);
                    };
                },
                suppOrEquals: function (len) {
                    return function (str) {
                        return len <= stringLen(str);
                    };
                },
                inf: function (len) {
                    return function (str) {
                        return len > stringLen(str);
                    };
                },
                infOrEquals: function (len) {
                    return function (str) {
                        return len >= stringLen(str);
                    };
                },
                notEquals: function (len) {
                    return function (str) {
                        return len != stringLen(str);
                    };
                },
                in: {
                    range: function (min, max) {
                        return function (str) {
                            var len = stringLen(str);
                            return len >= min && len <= max;
                        };
                    },
                    list: function (arr) {
                        return function (str) {
                            return (arr.indexOf(stringLen(str)) != -1);
                        };
                    },
                },
            },
        },
        in: {
            list: function (arr) {
                return function (str) {
                    return (arr.indexOf(isString(str)) != -1);
                };
            },
        },
        equals: function (str) {
            return function (s) {
                return str == isString(s);
            };
        },
        orNull: function () {
            return function (a) {
                if (typeof a == 'string' || a == null)
                    return true;
                return false;
            };
        },
    },
    number: {
        in: {
            range: function (min, max) {
                return function (a) {
                    isNumber(a);
                    return a >= min && a <= max;
                };
            },
            list: function (arr) {
                return function (a) {
                    return (arr.indexOf(isNumber(a)) != -1);
                };
            },
        },
        equals: function (val) {
            return function (a) {
                return val === isNumber(a);
            };
        },
        supp: function (val) {
            return function (a) {
                return val < isNumber(a);
            };
        },
        suppOrEquals: function (val) {
            return function (a) {
                return val <= isNumber(a);
            };
        },
        inf: function (val) {
            return function (a) {
                return val > isNumber(a);
            };
        },
        infOrEquals: function (val) {
            return function (a) {
                return val >= isNumber(a);
            };
        },
        notEquals: function (val) {
            return function (a) {
                return val != isNumber(a);
            };
        },
    },
    not: function (fn) {
        return function () {
            return !fn.apply(null, arguments);
        };
    },
    email: function (str) {
        var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(str);
    },
};

module.exports = { 
    check: {
        args: checkargs,
        array: checkarray,
        object: checkobject,
    },
    tools: {
        is: is,
        equals: equals,
    },
};