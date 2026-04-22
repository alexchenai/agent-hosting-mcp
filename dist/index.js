#!/usr/bin/env node
import process$1 from 'node:process';
import { randomBytes, createHash } from 'node:crypto';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir, platform, release, hostname as hostname$1 } from 'node:os';
import { join } from 'node:path';

/** A special constant with type `never` */
function $constructor(name, initializer, params) {
    function init(inst, def) {
        var _a;
        Object.defineProperty(inst, "_zod", {
            value: inst._zod ?? {},
            enumerable: false,
        });
        (_a = inst._zod).traits ?? (_a.traits = new Set());
        inst._zod.traits.add(name);
        initializer(inst, def);
        // support prototype modifications
        for (const k in _.prototype) {
            if (!(k in inst))
                Object.defineProperty(inst, k, { value: _.prototype[k].bind(inst) });
        }
        inst._zod.constr = _;
        inst._zod.def = def;
    }
    // doesn't work if Parent has a constructor with arguments
    const Parent = params?.Parent ?? Object;
    class Definition extends Parent {
    }
    Object.defineProperty(Definition, "name", { value: name });
    function _(def) {
        var _a;
        const inst = params?.Parent ? new Definition() : this;
        init(inst, def);
        (_a = inst._zod).deferred ?? (_a.deferred = []);
        for (const fn of inst._zod.deferred) {
            fn();
        }
        return inst;
    }
    Object.defineProperty(_, "init", { value: init });
    Object.defineProperty(_, Symbol.hasInstance, {
        value: (inst) => {
            if (params?.Parent && inst instanceof params.Parent)
                return true;
            return inst?._zod?.traits?.has(name);
        },
    });
    Object.defineProperty(_, "name", { value: name });
    return _;
}
class $ZodAsyncError extends Error {
    constructor() {
        super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
    }
}
const globalConfig = {};
function config(newConfig) {
    return globalConfig;
}

// functions
function getEnumValues(entries) {
    const numericValues = Object.values(entries).filter((v) => typeof v === "number");
    const values = Object.entries(entries)
        .filter(([k, _]) => numericValues.indexOf(+k) === -1)
        .map(([_, v]) => v);
    return values;
}
function jsonStringifyReplacer(_, value) {
    if (typeof value === "bigint")
        return value.toString();
    return value;
}
function cached(getter) {
    return {
        get value() {
            {
                const value = getter();
                Object.defineProperty(this, "value", { value });
                return value;
            }
        },
    };
}
function nullish(input) {
    return input === null || input === undefined;
}
function cleanRegex(source) {
    const start = source.startsWith("^") ? 1 : 0;
    const end = source.endsWith("$") ? source.length - 1 : source.length;
    return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
    return (valInt % stepInt) / 10 ** decCount;
}
function defineLazy(object, key, getter) {
    Object.defineProperty(object, key, {
        get() {
            {
                const value = getter();
                object[key] = value;
                return value;
            }
        },
        set(v) {
            Object.defineProperty(object, key, {
                value: v,
                // configurable: true,
            });
            // object[key] = v;
        },
        configurable: true,
    });
}
function assignProp(target, prop, value) {
    Object.defineProperty(target, prop, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}
function esc(str) {
    return JSON.stringify(str);
}
const captureStackTrace = Error.captureStackTrace
    ? Error.captureStackTrace
    : (..._args) => { };
function isObject(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
}
const allowsEval = cached(() => {
    if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
        return false;
    }
    try {
        const F = Function;
        new F("");
        return true;
    }
    catch (_) {
        return false;
    }
});
function isPlainObject$1(o) {
    if (isObject(o) === false)
        return false;
    // modified constructor
    const ctor = o.constructor;
    if (ctor === undefined)
        return true;
    // modified prototype
    const prot = ctor.prototype;
    if (isObject(prot) === false)
        return false;
    // ctor doesn't have static `isPrototypeOf`
    if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
        return false;
    }
    return true;
}
const propertyKeyTypes = new Set(["string", "number", "symbol"]);
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// zod-specific utils
function clone(inst, def, params) {
    const cl = new inst._zod.constr(def ?? inst._zod.def);
    if (!def || params?.parent)
        cl._zod.parent = inst;
    return cl;
}
function normalizeParams(_params) {
    const params = _params;
    if (!params)
        return {};
    if (typeof params === "string")
        return { error: () => params };
    if (params?.message !== undefined) {
        if (params?.error !== undefined)
            throw new Error("Cannot specify both `message` and `error` params");
        params.error = params.message;
    }
    delete params.message;
    if (typeof params.error === "string")
        return { ...params, error: () => params.error };
    return params;
}
function optionalKeys(shape) {
    return Object.keys(shape).filter((k) => {
        return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
    });
}
const NUMBER_FORMAT_RANGES = {
    safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    int32: [-2147483648, 2147483647],
    uint32: [0, 4294967295],
    float32: [-34028234663852886e22, 3.4028234663852886e38],
    float64: [-Number.MAX_VALUE, Number.MAX_VALUE],
};
function pick(schema, mask) {
    const newShape = {};
    const currDef = schema._zod.def; //.shape;
    for (const key in mask) {
        if (!(key in currDef.shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
            continue;
        // pick key
        newShape[key] = currDef.shape[key];
    }
    return clone(schema, {
        ...schema._zod.def,
        shape: newShape,
        checks: [],
    });
}
function omit(schema, mask) {
    const newShape = { ...schema._zod.def.shape };
    const currDef = schema._zod.def; //.shape;
    for (const key in mask) {
        if (!(key in currDef.shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
            continue;
        delete newShape[key];
    }
    return clone(schema, {
        ...schema._zod.def,
        shape: newShape,
        checks: [],
    });
}
function extend(schema, shape) {
    if (!isPlainObject$1(shape)) {
        throw new Error("Invalid input to extend: expected a plain object");
    }
    const def = {
        ...schema._zod.def,
        get shape() {
            const _shape = { ...schema._zod.def.shape, ...shape };
            assignProp(this, "shape", _shape); // self-caching
            return _shape;
        },
        checks: [], // delete existing checks
    };
    return clone(schema, def);
}
function merge(a, b) {
    return clone(a, {
        ...a._zod.def,
        get shape() {
            const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
            assignProp(this, "shape", _shape); // self-caching
            return _shape;
        },
        catchall: b._zod.def.catchall,
        checks: [], // delete existing checks
    });
}
function partial(Class, schema, mask) {
    const oldShape = schema._zod.def.shape;
    const shape = { ...oldShape };
    if (mask) {
        for (const key in mask) {
            if (!(key in oldShape)) {
                throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!mask[key])
                continue;
            // if (oldShape[key]!._zod.optin === "optional") continue;
            shape[key] = Class
                ? new Class({
                    type: "optional",
                    innerType: oldShape[key],
                })
                : oldShape[key];
        }
    }
    else {
        for (const key in oldShape) {
            // if (oldShape[key]!._zod.optin === "optional") continue;
            shape[key] = Class
                ? new Class({
                    type: "optional",
                    innerType: oldShape[key],
                })
                : oldShape[key];
        }
    }
    return clone(schema, {
        ...schema._zod.def,
        shape,
        checks: [],
    });
}
function required$2(Class, schema, mask) {
    const oldShape = schema._zod.def.shape;
    const shape = { ...oldShape };
    if (mask) {
        for (const key in mask) {
            if (!(key in shape)) {
                throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!mask[key])
                continue;
            // overwrite with non-optional
            shape[key] = new Class({
                type: "nonoptional",
                innerType: oldShape[key],
            });
        }
    }
    else {
        for (const key in oldShape) {
            // overwrite with non-optional
            shape[key] = new Class({
                type: "nonoptional",
                innerType: oldShape[key],
            });
        }
    }
    return clone(schema, {
        ...schema._zod.def,
        shape,
        // optional: [],
        checks: [],
    });
}
function aborted(x, startIndex = 0) {
    for (let i = startIndex; i < x.issues.length; i++) {
        if (x.issues[i]?.continue !== true)
            return true;
    }
    return false;
}
function prefixIssues(path, issues) {
    return issues.map((iss) => {
        var _a;
        (_a = iss).path ?? (_a.path = []);
        iss.path.unshift(path);
        return iss;
    });
}
function unwrapMessage(message) {
    return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
    const full = { ...iss, path: iss.path ?? [] };
    // for backwards compatibility
    if (!iss.message) {
        const message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ??
            unwrapMessage(ctx?.error?.(iss)) ??
            unwrapMessage(config.customError?.(iss)) ??
            unwrapMessage(config.localeError?.(iss)) ??
            "Invalid input";
        full.message = message;
    }
    // delete (full as any).def;
    delete full.inst;
    delete full.continue;
    if (!ctx?.reportInput) {
        delete full.input;
    }
    return full;
}
function getLengthableOrigin(input) {
    if (Array.isArray(input))
        return "array";
    if (typeof input === "string")
        return "string";
    return "unknown";
}
function issue(...args) {
    const [iss, input, inst] = args;
    if (typeof iss === "string") {
        return {
            message: iss,
            code: "custom",
            input,
            inst,
        };
    }
    return { ...iss };
}

const initializer$1 = (inst, def) => {
    inst.name = "$ZodError";
    Object.defineProperty(inst, "_zod", {
        value: inst._zod,
        enumerable: false,
    });
    Object.defineProperty(inst, "issues", {
        value: def,
        enumerable: false,
    });
    Object.defineProperty(inst, "message", {
        get() {
            return JSON.stringify(def, jsonStringifyReplacer, 2);
        },
        enumerable: true,
        // configurable: false,
    });
    Object.defineProperty(inst, "toString", {
        value: () => inst.message,
        enumerable: false,
    });
};
const $ZodError = $constructor("$ZodError", initializer$1);
const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
function flattenError(error, mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of error.issues) {
        if (sub.path.length > 0) {
            fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
            fieldErrors[sub.path[0]].push(mapper(sub));
        }
        else {
            formErrors.push(mapper(sub));
        }
    }
    return { formErrors, fieldErrors };
}
function formatError(error, _mapper) {
    const mapper = _mapper ||
        function (issue) {
            return issue.message;
        };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
        for (const issue of error.issues) {
            if (issue.code === "invalid_union" && issue.errors.length) {
                issue.errors.map((issues) => processError({ issues }));
            }
            else if (issue.code === "invalid_key") {
                processError({ issues: issue.issues });
            }
            else if (issue.code === "invalid_element") {
                processError({ issues: issue.issues });
            }
            else if (issue.path.length === 0) {
                fieldErrors._errors.push(mapper(issue));
            }
            else {
                let curr = fieldErrors;
                let i = 0;
                while (i < issue.path.length) {
                    const el = issue.path[i];
                    const terminal = i === issue.path.length - 1;
                    if (!terminal) {
                        curr[el] = curr[el] || { _errors: [] };
                    }
                    else {
                        curr[el] = curr[el] || { _errors: [] };
                        curr[el]._errors.push(mapper(issue));
                    }
                    curr = curr[el];
                    i++;
                }
            }
        }
    };
    processError(error);
    return fieldErrors;
}

const _parse = (_Err) => (schema, value, _ctx, _params) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
        throw new $ZodAsyncError();
    }
    if (result.issues.length) {
        const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
        captureStackTrace(e, _params?.callee);
        throw e;
    }
    return result.value;
};
const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
        result = await result;
    if (result.issues.length) {
        const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
        captureStackTrace(e, params?.callee);
        throw e;
    }
    return result.value;
};
const _safeParse = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
        throw new $ZodAsyncError();
    }
    return result.issues.length
        ? {
            success: false,
            error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
        }
        : { success: true, data: result.value };
};
const safeParse$2 = /* @__PURE__*/ _safeParse($ZodRealError);
const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
        result = await result;
    return result.issues.length
        ? {
            success: false,
            error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
        }
        : { success: true, data: result.value };
};
const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);

const cuid = /^[cC][^\s-]{8,}$/;
const cuid2 = /^[0-9a-z]+$/;
const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
const xid = /^[0-9a-vA-V]{20}$/;
const ksuid = /^[A-Za-z0-9]{27}$/;
const nanoid = /^[a-zA-Z0-9_-]{21}$/;
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 4122 UUID.
 *
 * @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
const uuid = (version) => {
    if (!version)
        return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$/;
    return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
/** Practical email validation */
const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
    return new RegExp(_emoji$1, "u");
}
const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$/;
const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url = /^[A-Za-z0-9_-]*$/;
// based on https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
// export const hostname: RegExp =
//   /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
const hostname = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/;
// https://blog.stevenlevithan.com/archives/validate-phone-number#r4-3 (regex sans spaces)
const e164 = /^\+(?:[0-9]){6,14}[0-9]$/;
// const dateSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
const date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
function timeSource(args) {
    const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
    const regex = typeof args.precision === "number"
        ? args.precision === -1
            ? `${hhmm}`
            : args.precision === 0
                ? `${hhmm}:[0-5]\\d`
                : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}`
        : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
    return regex;
}
function time$1(args) {
    return new RegExp(`^${timeSource(args)}$`);
}
// Adapted from https://stackoverflow.com/a/3143231
function datetime$1(args) {
    const time = timeSource({ precision: args.precision });
    const opts = ["Z"];
    if (args.local)
        opts.push("");
    if (args.offset)
        opts.push(`([+-]\\d{2}:\\d{2})`);
    const timeRegex = `${time}(?:${opts.join("|")})`;
    return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
const string$1 = (params) => {
    const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
    return new RegExp(`^${regex}$`);
};
const integer = /^\d+$/;
const number$1 = /^-?\d+(?:\.\d+)?/i;
const boolean$1 = /true|false/i;
const _null$2 = /null/i;
// regex for string with no uppercase letters
const lowercase = /^[^A-Z]*$/;
// regex for string with no lowercase letters
const uppercase = /^[^a-z]*$/;

// import { $ZodType } from "./schemas.js";
const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
    var _a;
    inst._zod ?? (inst._zod = {});
    inst._zod.def = def;
    (_a = inst._zod).onattach ?? (_a.onattach = []);
});
const numericOriginMap = {
    number: "number",
    bigint: "bigint",
    object: "date",
};
const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
    $ZodCheck.init(inst, def);
    const origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
        if (def.value < curr) {
            if (def.inclusive)
                bag.maximum = def.value;
            else
                bag.exclusiveMaximum = def.value;
        }
    });
    inst._zod.check = (payload) => {
        if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
            return;
        }
        payload.issues.push({
            origin,
            code: "too_big",
            maximum: def.value,
            input: payload.value,
            inclusive: def.inclusive,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
    $ZodCheck.init(inst, def);
    const origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
        if (def.value > curr) {
            if (def.inclusive)
                bag.minimum = def.value;
            else
                bag.exclusiveMinimum = def.value;
        }
    });
    inst._zod.check = (payload) => {
        if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
            return;
        }
        payload.issues.push({
            origin,
            code: "too_small",
            minimum: def.value,
            input: payload.value,
            inclusive: def.inclusive,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckMultipleOf = 
/*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.onattach.push((inst) => {
        var _a;
        (_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
    });
    inst._zod.check = (payload) => {
        if (typeof payload.value !== typeof def.value)
            throw new Error("Cannot mix number and bigint in multiple_of check.");
        const isMultiple = typeof payload.value === "bigint"
            ? payload.value % def.value === BigInt(0)
            : floatSafeRemainder(payload.value, def.value) === 0;
        if (isMultiple)
            return;
        payload.issues.push({
            origin: typeof payload.value,
            code: "not_multiple_of",
            divisor: def.value,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
    $ZodCheck.init(inst, def); // no format checks
    def.format = def.format || "float64";
    const isInt = def.format?.includes("int");
    const origin = isInt ? "int" : "number";
    const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = def.format;
        bag.minimum = minimum;
        bag.maximum = maximum;
        if (isInt)
            bag.pattern = integer;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        if (isInt) {
            if (!Number.isInteger(input)) {
                // invalid_format issue
                // payload.issues.push({
                //   expected: def.format,
                //   format: def.format,
                //   code: "invalid_format",
                //   input,
                //   inst,
                // });
                // invalid_type issue
                payload.issues.push({
                    expected: origin,
                    format: def.format,
                    code: "invalid_type",
                    input,
                    inst,
                });
                return;
                // not_multiple_of issue
                // payload.issues.push({
                //   code: "not_multiple_of",
                //   origin: "number",
                //   input,
                //   inst,
                //   divisor: 1,
                // });
            }
            if (!Number.isSafeInteger(input)) {
                if (input > 0) {
                    // too_big
                    payload.issues.push({
                        input,
                        code: "too_big",
                        maximum: Number.MAX_SAFE_INTEGER,
                        note: "Integers must be within the safe integer range.",
                        inst,
                        origin,
                        continue: !def.abort,
                    });
                }
                else {
                    // too_small
                    payload.issues.push({
                        input,
                        code: "too_small",
                        minimum: Number.MIN_SAFE_INTEGER,
                        note: "Integers must be within the safe integer range.",
                        inst,
                        origin,
                        continue: !def.abort,
                    });
                }
                return;
            }
        }
        if (input < minimum) {
            payload.issues.push({
                origin: "number",
                input,
                code: "too_small",
                minimum,
                inclusive: true,
                inst,
                continue: !def.abort,
            });
        }
        if (input > maximum) {
            payload.issues.push({
                origin: "number",
                input,
                code: "too_big",
                maximum,
                inst,
            });
        }
    };
});
const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const curr = (inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY);
        if (def.maximum < curr)
            inst._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length <= def.maximum)
            return;
        const origin = getLengthableOrigin(input);
        payload.issues.push({
            origin,
            code: "too_big",
            maximum: def.maximum,
            inclusive: true,
            input,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const curr = (inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY);
        if (def.minimum > curr)
            inst._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length >= def.minimum)
            return;
        const origin = getLengthableOrigin(input);
        payload.issues.push({
            origin,
            code: "too_small",
            minimum: def.minimum,
            inclusive: true,
            input,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.minimum = def.length;
        bag.maximum = def.length;
        bag.length = def.length;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length === def.length)
            return;
        const origin = getLengthableOrigin(input);
        const tooBig = length > def.length;
        payload.issues.push({
            origin,
            ...(tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length }),
            inclusive: true,
            exact: true,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
    var _a, _b;
    $ZodCheck.init(inst, def);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = def.format;
        if (def.pattern) {
            bag.patterns ?? (bag.patterns = new Set());
            bag.patterns.add(def.pattern);
        }
    });
    if (def.pattern)
        (_a = inst._zod).check ?? (_a.check = (payload) => {
            def.pattern.lastIndex = 0;
            if (def.pattern.test(payload.value))
                return;
            payload.issues.push({
                origin: "string",
                code: "invalid_format",
                format: def.format,
                input: payload.value,
                ...(def.pattern ? { pattern: def.pattern.toString() } : {}),
                inst,
                continue: !def.abort,
            });
        });
    else
        (_b = inst._zod).check ?? (_b.check = () => { });
});
const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
    $ZodCheckStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
        def.pattern.lastIndex = 0;
        if (def.pattern.test(payload.value))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "regex",
            input: payload.value,
            pattern: def.pattern.toString(),
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
    def.pattern ?? (def.pattern = lowercase);
    $ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
    def.pattern ?? (def.pattern = uppercase);
    $ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
    $ZodCheck.init(inst, def);
    const escapedRegex = escapeRegex(def.includes);
    const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
    def.pattern = pattern;
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
        if (payload.value.includes(def.includes, def.position))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "includes",
            includes: def.includes,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
    $ZodCheck.init(inst, def);
    const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
        if (payload.value.startsWith(def.prefix))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "starts_with",
            prefix: def.prefix,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
    $ZodCheck.init(inst, def);
    const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
        if (payload.value.endsWith(def.suffix))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "ends_with",
            suffix: def.suffix,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.check = (payload) => {
        payload.value = def.tx(payload.value);
    };
});

class Doc {
    constructor(args = []) {
        this.content = [];
        this.indent = 0;
        if (this)
            this.args = args;
    }
    indented(fn) {
        this.indent += 1;
        fn(this);
        this.indent -= 1;
    }
    write(arg) {
        if (typeof arg === "function") {
            arg(this, { execution: "sync" });
            arg(this, { execution: "async" });
            return;
        }
        const content = arg;
        const lines = content.split("\n").filter((x) => x);
        const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
        const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
        for (const line of dedented) {
            this.content.push(line);
        }
    }
    compile() {
        const F = Function;
        const args = this?.args;
        const content = this?.content ?? [``];
        const lines = [...content.map((x) => `  ${x}`)];
        // console.log(lines.join("\n"));
        return new F(...args, lines.join("\n"));
    }
}

const version = {
    major: 4,
    minor: 0,
    patch: 0,
};

const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
    var _a;
    inst ?? (inst = {});
    inst._zod.def = def; // set _def property
    inst._zod.bag = inst._zod.bag || {}; // initialize _bag object
    inst._zod.version = version;
    const checks = [...(inst._zod.def.checks ?? [])];
    // if inst is itself a checks.$ZodCheck, run it as a check
    if (inst._zod.traits.has("$ZodCheck")) {
        checks.unshift(inst);
    }
    //
    for (const ch of checks) {
        for (const fn of ch._zod.onattach) {
            fn(inst);
        }
    }
    if (checks.length === 0) {
        // deferred initializer
        // inst._zod.parse is not yet defined
        (_a = inst._zod).deferred ?? (_a.deferred = []);
        inst._zod.deferred?.push(() => {
            inst._zod.run = inst._zod.parse;
        });
    }
    else {
        const runChecks = (payload, checks, ctx) => {
            let isAborted = aborted(payload);
            let asyncResult;
            for (const ch of checks) {
                if (ch._zod.def.when) {
                    const shouldRun = ch._zod.def.when(payload);
                    if (!shouldRun)
                        continue;
                }
                else if (isAborted) {
                    continue;
                }
                const currLen = payload.issues.length;
                const _ = ch._zod.check(payload);
                if (_ instanceof Promise && ctx?.async === false) {
                    throw new $ZodAsyncError();
                }
                if (asyncResult || _ instanceof Promise) {
                    asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
                        await _;
                        const nextLen = payload.issues.length;
                        if (nextLen === currLen)
                            return;
                        if (!isAborted)
                            isAborted = aborted(payload, currLen);
                    });
                }
                else {
                    const nextLen = payload.issues.length;
                    if (nextLen === currLen)
                        continue;
                    if (!isAborted)
                        isAborted = aborted(payload, currLen);
                }
            }
            if (asyncResult) {
                return asyncResult.then(() => {
                    return payload;
                });
            }
            return payload;
        };
        inst._zod.run = (payload, ctx) => {
            const result = inst._zod.parse(payload, ctx);
            if (result instanceof Promise) {
                if (ctx.async === false)
                    throw new $ZodAsyncError();
                return result.then((result) => runChecks(result, checks, ctx));
            }
            return runChecks(result, checks, ctx);
        };
    }
    inst["~standard"] = {
        validate: (value) => {
            try {
                const r = safeParse$2(inst, value);
                return r.success ? { value: r.data } : { issues: r.error?.issues };
            }
            catch (_) {
                return safeParseAsync$1(inst, value).then((r) => (r.success ? { value: r.data } : { issues: r.error?.issues }));
            }
        },
        vendor: "zod",
        version: 1,
    };
});
const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = [...(inst?._zod.bag?.patterns ?? [])].pop() ?? string$1(inst._zod.bag);
    inst._zod.parse = (payload, _) => {
        if (def.coerce)
            try {
                payload.value = String(payload.value);
            }
            catch (_) { }
        if (typeof payload.value === "string")
            return payload;
        payload.issues.push({
            expected: "string",
            code: "invalid_type",
            input: payload.value,
            inst,
        });
        return payload;
    };
});
const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
    // check initialization must come first
    $ZodCheckStringFormat.init(inst, def);
    $ZodString.init(inst, def);
});
const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
    def.pattern ?? (def.pattern = guid);
    $ZodStringFormat.init(inst, def);
});
const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
    if (def.version) {
        const versionMap = {
            v1: 1,
            v2: 2,
            v3: 3,
            v4: 4,
            v5: 5,
            v6: 6,
            v7: 7,
            v8: 8,
        };
        const v = versionMap[def.version];
        if (v === undefined)
            throw new Error(`Invalid UUID version: "${def.version}"`);
        def.pattern ?? (def.pattern = uuid(v));
    }
    else
        def.pattern ?? (def.pattern = uuid());
    $ZodStringFormat.init(inst, def);
});
const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
    def.pattern ?? (def.pattern = email);
    $ZodStringFormat.init(inst, def);
});
const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
        try {
            const orig = payload.value;
            const url = new URL(orig);
            const href = url.href;
            if (def.hostname) {
                def.hostname.lastIndex = 0;
                if (!def.hostname.test(url.hostname)) {
                    payload.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid hostname",
                        pattern: hostname.source,
                        input: payload.value,
                        inst,
                        continue: !def.abort,
                    });
                }
            }
            if (def.protocol) {
                def.protocol.lastIndex = 0;
                if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
                    payload.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid protocol",
                        pattern: def.protocol.source,
                        input: payload.value,
                        inst,
                        continue: !def.abort,
                    });
                }
            }
            // payload.value = url.href;
            if (!orig.endsWith("/") && href.endsWith("/")) {
                payload.value = href.slice(0, -1);
            }
            else {
                payload.value = href;
            }
            return;
        }
        catch (_) {
            payload.issues.push({
                code: "invalid_format",
                format: "url",
                input: payload.value,
                inst,
                continue: !def.abort,
            });
        }
    };
});
const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
    def.pattern ?? (def.pattern = emoji());
    $ZodStringFormat.init(inst, def);
});
const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
    def.pattern ?? (def.pattern = nanoid);
    $ZodStringFormat.init(inst, def);
});
const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
    def.pattern ?? (def.pattern = cuid);
    $ZodStringFormat.init(inst, def);
});
const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
    def.pattern ?? (def.pattern = cuid2);
    $ZodStringFormat.init(inst, def);
});
const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
    def.pattern ?? (def.pattern = ulid);
    $ZodStringFormat.init(inst, def);
});
const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
    def.pattern ?? (def.pattern = xid);
    $ZodStringFormat.init(inst, def);
});
const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
    def.pattern ?? (def.pattern = ksuid);
    $ZodStringFormat.init(inst, def);
});
const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
    def.pattern ?? (def.pattern = datetime$1(def));
    $ZodStringFormat.init(inst, def);
});
const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
    def.pattern ?? (def.pattern = date$1);
    $ZodStringFormat.init(inst, def);
});
const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
    def.pattern ?? (def.pattern = time$1(def));
    $ZodStringFormat.init(inst, def);
});
const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
    def.pattern ?? (def.pattern = duration$1);
    $ZodStringFormat.init(inst, def);
});
const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
    def.pattern ?? (def.pattern = ipv4);
    $ZodStringFormat.init(inst, def);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = `ipv4`;
    });
});
const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
    def.pattern ?? (def.pattern = ipv6);
    $ZodStringFormat.init(inst, def);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = `ipv6`;
    });
    inst._zod.check = (payload) => {
        try {
            new URL(`http://[${payload.value}]`);
            // return;
        }
        catch {
            payload.issues.push({
                code: "invalid_format",
                format: "ipv6",
                input: payload.value,
                inst,
                continue: !def.abort,
            });
        }
    };
});
const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv4);
    $ZodStringFormat.init(inst, def);
});
const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv6); // not used for validation
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
        const [address, prefix] = payload.value.split("/");
        try {
            if (!prefix)
                throw new Error();
            const prefixNum = Number(prefix);
            if (`${prefixNum}` !== prefix)
                throw new Error();
            if (prefixNum < 0 || prefixNum > 128)
                throw new Error();
            new URL(`http://[${address}]`);
        }
        catch {
            payload.issues.push({
                code: "invalid_format",
                format: "cidrv6",
                input: payload.value,
                inst,
                continue: !def.abort,
            });
        }
    };
});
//////////////////////////////   ZodBase64   //////////////////////////////
function isValidBase64(data) {
    if (data === "")
        return true;
    if (data.length % 4 !== 0)
        return false;
    try {
        atob(data);
        return true;
    }
    catch {
        return false;
    }
}
const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
    def.pattern ?? (def.pattern = base64);
    $ZodStringFormat.init(inst, def);
    inst._zod.onattach.push((inst) => {
        inst._zod.bag.contentEncoding = "base64";
    });
    inst._zod.check = (payload) => {
        if (isValidBase64(payload.value))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: "base64",
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
//////////////////////////////   ZodBase64   //////////////////////////////
function isValidBase64URL(data) {
    if (!base64url.test(data))
        return false;
    const base64 = data.replace(/[-_]/g, (c) => (c === "-" ? "+" : "/"));
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return isValidBase64(padded);
}
const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
    def.pattern ?? (def.pattern = base64url);
    $ZodStringFormat.init(inst, def);
    inst._zod.onattach.push((inst) => {
        inst._zod.bag.contentEncoding = "base64url";
    });
    inst._zod.check = (payload) => {
        if (isValidBase64URL(payload.value))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: "base64url",
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
    def.pattern ?? (def.pattern = e164);
    $ZodStringFormat.init(inst, def);
});
//////////////////////////////   ZodJWT   //////////////////////////////
function isValidJWT(token, algorithm = null) {
    try {
        const tokensParts = token.split(".");
        if (tokensParts.length !== 3)
            return false;
        const [header] = tokensParts;
        if (!header)
            return false;
        const parsedHeader = JSON.parse(atob(header));
        if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
            return false;
        if (!parsedHeader.alg)
            return false;
        if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
            return false;
        return true;
    }
    catch {
        return false;
    }
}
const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
        if (isValidJWT(payload.value, def.alg))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: "jwt",
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
    inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
            try {
                payload.value = Number(payload.value);
            }
            catch (_) { }
        const input = payload.value;
        if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
            return payload;
        }
        const received = typeof input === "number"
            ? Number.isNaN(input)
                ? "NaN"
                : !Number.isFinite(input)
                    ? "Infinity"
                    : undefined
            : undefined;
        payload.issues.push({
            expected: "number",
            code: "invalid_type",
            input,
            inst,
            ...(received ? { received } : {}),
        });
        return payload;
    };
});
const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
    $ZodCheckNumberFormat.init(inst, def);
    $ZodNumber.init(inst, def); // no format checksp
});
const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = boolean$1;
    inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
            try {
                payload.value = Boolean(payload.value);
            }
            catch (_) { }
        const input = payload.value;
        if (typeof input === "boolean")
            return payload;
        payload.issues.push({
            expected: "boolean",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodNull = /*@__PURE__*/ $constructor("$ZodNull", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = _null$2;
    inst._zod.values = new Set([null]);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (input === null)
            return payload;
        payload.issues.push({
            expected: "null",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload) => payload;
});
const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        payload.issues.push({
            expected: "never",
            code: "invalid_type",
            input: payload.value,
            inst,
        });
        return payload;
    };
});
function handleArrayResult(result, final, index) {
    if (result.issues.length) {
        final.issues.push(...prefixIssues(index, result.issues));
    }
    final.value[index] = result.value;
}
const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!Array.isArray(input)) {
            payload.issues.push({
                expected: "array",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        payload.value = Array(input.length);
        const proms = [];
        for (let i = 0; i < input.length; i++) {
            const item = input[i];
            const result = def.element._zod.run({
                value: item,
                issues: [],
            }, ctx);
            if (result instanceof Promise) {
                proms.push(result.then((result) => handleArrayResult(result, payload, i)));
            }
            else {
                handleArrayResult(result, payload, i);
            }
        }
        if (proms.length) {
            return Promise.all(proms).then(() => payload);
        }
        return payload; //handleArrayResultsAsync(parseResults, final);
    };
});
function handleObjectResult(result, final, key) {
    // if(isOptional)
    if (result.issues.length) {
        final.issues.push(...prefixIssues(key, result.issues));
    }
    final.value[key] = result.value;
}
function handleOptionalObjectResult(result, final, key, input) {
    if (result.issues.length) {
        // validation failed against value schema
        if (input[key] === undefined) {
            // if input was undefined, ignore the error
            if (key in input) {
                final.value[key] = undefined;
            }
            else {
                final.value[key] = result.value;
            }
        }
        else {
            final.issues.push(...prefixIssues(key, result.issues));
        }
    }
    else if (result.value === undefined) {
        // validation returned `undefined`
        if (key in input)
            final.value[key] = undefined;
    }
    else {
        // non-undefined value
        final.value[key] = result.value;
    }
}
const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
    // requires cast because technically $ZodObject doesn't extend
    $ZodType.init(inst, def);
    const _normalized = cached(() => {
        const keys = Object.keys(def.shape);
        for (const k of keys) {
            if (!(def.shape[k] instanceof $ZodType)) {
                throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
            }
        }
        const okeys = optionalKeys(def.shape);
        return {
            shape: def.shape,
            keys,
            keySet: new Set(keys),
            numKeys: keys.length,
            optionalKeys: new Set(okeys),
        };
    });
    defineLazy(inst._zod, "propValues", () => {
        const shape = def.shape;
        const propValues = {};
        for (const key in shape) {
            const field = shape[key]._zod;
            if (field.values) {
                propValues[key] ?? (propValues[key] = new Set());
                for (const v of field.values)
                    propValues[key].add(v);
            }
        }
        return propValues;
    });
    const generateFastpass = (shape) => {
        const doc = new Doc(["shape", "payload", "ctx"]);
        const normalized = _normalized.value;
        const parseStr = (key) => {
            const k = esc(key);
            return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
        };
        doc.write(`const input = payload.value;`);
        const ids = Object.create(null);
        let counter = 0;
        for (const key of normalized.keys) {
            ids[key] = `key_${counter++}`;
        }
        // A: preserve key order {
        doc.write(`const newResult = {}`);
        for (const key of normalized.keys) {
            if (normalized.optionalKeys.has(key)) {
                const id = ids[key];
                doc.write(`const ${id} = ${parseStr(key)};`);
                const k = esc(key);
                doc.write(`
        if (${id}.issues.length) {
          if (input[${k}] === undefined) {
            if (${k} in input) {
              newResult[${k}] = undefined;
            }
          } else {
            payload.issues = payload.issues.concat(
              ${id}.issues.map((iss) => ({
                ...iss,
                path: iss.path ? [${k}, ...iss.path] : [${k}],
              }))
            );
          }
        } else if (${id}.value === undefined) {
          if (${k} in input) newResult[${k}] = undefined;
        } else {
          newResult[${k}] = ${id}.value;
        }
        `);
            }
            else {
                const id = ids[key];
                //  const id = ids[key];
                doc.write(`const ${id} = ${parseStr(key)};`);
                doc.write(`
          if (${id}.issues.length) payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${esc(key)}, ...iss.path] : [${esc(key)}]
          })));`);
                doc.write(`newResult[${esc(key)}] = ${id}.value`);
            }
        }
        doc.write(`payload.value = newResult;`);
        doc.write(`return payload;`);
        const fn = doc.compile();
        return (payload, ctx) => fn(shape, payload, ctx);
    };
    let fastpass;
    const isObject$1 = isObject;
    const jit = !globalConfig.jitless;
    const allowsEval$1 = allowsEval;
    const fastEnabled = jit && allowsEval$1.value; // && !def.catchall;
    const catchall = def.catchall;
    let value;
    inst._zod.parse = (payload, ctx) => {
        value ?? (value = _normalized.value);
        const input = payload.value;
        if (!isObject$1(input)) {
            payload.issues.push({
                expected: "object",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        const proms = [];
        if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
            // always synchronous
            if (!fastpass)
                fastpass = generateFastpass(def.shape);
            payload = fastpass(payload, ctx);
        }
        else {
            payload.value = {};
            const shape = value.shape;
            for (const key of value.keys) {
                const el = shape[key];
                // do not add omitted optional keys
                // if (!(key in input)) {
                //   if (optionalKeys.has(key)) continue;
                //   payload.issues.push({
                //     code: "invalid_type",
                //     path: [key],
                //     expected: "nonoptional",
                //     note: `Missing required key: "${key}"`,
                //     input,
                //     inst,
                //   });
                // }
                const r = el._zod.run({ value: input[key], issues: [] }, ctx);
                const isOptional = el._zod.optin === "optional" && el._zod.optout === "optional";
                if (r instanceof Promise) {
                    proms.push(r.then((r) => isOptional ? handleOptionalObjectResult(r, payload, key, input) : handleObjectResult(r, payload, key)));
                }
                else if (isOptional) {
                    handleOptionalObjectResult(r, payload, key, input);
                }
                else {
                    handleObjectResult(r, payload, key);
                }
            }
        }
        if (!catchall) {
            // return payload;
            return proms.length ? Promise.all(proms).then(() => payload) : payload;
        }
        const unrecognized = [];
        // iterate over input keys
        const keySet = value.keySet;
        const _catchall = catchall._zod;
        const t = _catchall.def.type;
        for (const key of Object.keys(input)) {
            if (keySet.has(key))
                continue;
            if (t === "never") {
                unrecognized.push(key);
                continue;
            }
            const r = _catchall.run({ value: input[key], issues: [] }, ctx);
            if (r instanceof Promise) {
                proms.push(r.then((r) => handleObjectResult(r, payload, key)));
            }
            else {
                handleObjectResult(r, payload, key);
            }
        }
        if (unrecognized.length) {
            payload.issues.push({
                code: "unrecognized_keys",
                keys: unrecognized,
                input,
                inst,
            });
        }
        if (!proms.length)
            return payload;
        return Promise.all(proms).then(() => {
            return payload;
        });
    };
});
function handleUnionResults(results, final, inst, ctx) {
    for (const result of results) {
        if (result.issues.length === 0) {
            final.value = result.value;
            return final;
        }
    }
    final.issues.push({
        code: "invalid_union",
        input: final.value,
        inst,
        errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
    });
    return final;
}
const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : undefined);
    defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : undefined);
    defineLazy(inst._zod, "values", () => {
        if (def.options.every((o) => o._zod.values)) {
            return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
        }
        return undefined;
    });
    defineLazy(inst._zod, "pattern", () => {
        if (def.options.every((o) => o._zod.pattern)) {
            const patterns = def.options.map((o) => o._zod.pattern);
            return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
        }
        return undefined;
    });
    inst._zod.parse = (payload, ctx) => {
        let async = false;
        const results = [];
        for (const option of def.options) {
            const result = option._zod.run({
                value: payload.value,
                issues: [],
            }, ctx);
            if (result instanceof Promise) {
                results.push(result);
                async = true;
            }
            else {
                if (result.issues.length === 0)
                    return result;
                results.push(result);
            }
        }
        if (!async)
            return handleUnionResults(results, payload, inst, ctx);
        return Promise.all(results).then((results) => {
            return handleUnionResults(results, payload, inst, ctx);
        });
    };
});
const $ZodDiscriminatedUnion = 
/*@__PURE__*/
$constructor("$ZodDiscriminatedUnion", (inst, def) => {
    $ZodUnion.init(inst, def);
    const _super = inst._zod.parse;
    defineLazy(inst._zod, "propValues", () => {
        const propValues = {};
        for (const option of def.options) {
            const pv = option._zod.propValues;
            if (!pv || Object.keys(pv).length === 0)
                throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
            for (const [k, v] of Object.entries(pv)) {
                if (!propValues[k])
                    propValues[k] = new Set();
                for (const val of v) {
                    propValues[k].add(val);
                }
            }
        }
        return propValues;
    });
    const disc = cached(() => {
        const opts = def.options;
        const map = new Map();
        for (const o of opts) {
            const values = o._zod.propValues[def.discriminator];
            if (!values || values.size === 0)
                throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(o)}"`);
            for (const v of values) {
                if (map.has(v)) {
                    throw new Error(`Duplicate discriminator value "${String(v)}"`);
                }
                map.set(v, o);
            }
        }
        return map;
    });
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!isObject(input)) {
            payload.issues.push({
                code: "invalid_type",
                expected: "object",
                input,
                inst,
            });
            return payload;
        }
        const opt = disc.value.get(input?.[def.discriminator]);
        if (opt) {
            return opt._zod.run(payload, ctx);
        }
        if (def.unionFallback) {
            return _super(payload, ctx);
        }
        // no matching discriminator
        payload.issues.push({
            code: "invalid_union",
            errors: [],
            note: "No matching discriminator",
            input,
            path: [def.discriminator],
            inst,
        });
        return payload;
    };
});
const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        const left = def.left._zod.run({ value: input, issues: [] }, ctx);
        const right = def.right._zod.run({ value: input, issues: [] }, ctx);
        const async = left instanceof Promise || right instanceof Promise;
        if (async) {
            return Promise.all([left, right]).then(([left, right]) => {
                return handleIntersectionResults(payload, left, right);
            });
        }
        return handleIntersectionResults(payload, left, right);
    };
});
function mergeValues(a, b) {
    // const aType = parse.t(a);
    // const bType = parse.t(b);
    if (a === b) {
        return { valid: true, data: a };
    }
    if (a instanceof Date && b instanceof Date && +a === +b) {
        return { valid: true, data: a };
    }
    if (isPlainObject$1(a) && isPlainObject$1(b)) {
        const bKeys = Object.keys(b);
        const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
        const newObj = { ...a, ...b };
        for (const key of sharedKeys) {
            const sharedValue = mergeValues(a[key], b[key]);
            if (!sharedValue.valid) {
                return {
                    valid: false,
                    mergeErrorPath: [key, ...sharedValue.mergeErrorPath],
                };
            }
            newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return { valid: false, mergeErrorPath: [] };
        }
        const newArray = [];
        for (let index = 0; index < a.length; index++) {
            const itemA = a[index];
            const itemB = b[index];
            const sharedValue = mergeValues(itemA, itemB);
            if (!sharedValue.valid) {
                return {
                    valid: false,
                    mergeErrorPath: [index, ...sharedValue.mergeErrorPath],
                };
            }
            newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
    }
    return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
    if (left.issues.length) {
        result.issues.push(...left.issues);
    }
    if (right.issues.length) {
        result.issues.push(...right.issues);
    }
    if (aborted(result))
        return result;
    const merged = mergeValues(left.value, right.value);
    if (!merged.valid) {
        throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
    }
    result.value = merged.data;
    return result;
}
const $ZodRecord = /*@__PURE__*/ $constructor("$ZodRecord", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!isPlainObject$1(input)) {
            payload.issues.push({
                expected: "record",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        const proms = [];
        if (def.keyType._zod.values) {
            const values = def.keyType._zod.values;
            payload.value = {};
            for (const key of values) {
                if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
                    const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
                    if (result instanceof Promise) {
                        proms.push(result.then((result) => {
                            if (result.issues.length) {
                                payload.issues.push(...prefixIssues(key, result.issues));
                            }
                            payload.value[key] = result.value;
                        }));
                    }
                    else {
                        if (result.issues.length) {
                            payload.issues.push(...prefixIssues(key, result.issues));
                        }
                        payload.value[key] = result.value;
                    }
                }
            }
            let unrecognized;
            for (const key in input) {
                if (!values.has(key)) {
                    unrecognized = unrecognized ?? [];
                    unrecognized.push(key);
                }
            }
            if (unrecognized && unrecognized.length > 0) {
                payload.issues.push({
                    code: "unrecognized_keys",
                    input,
                    inst,
                    keys: unrecognized,
                });
            }
        }
        else {
            payload.value = {};
            for (const key of Reflect.ownKeys(input)) {
                if (key === "__proto__")
                    continue;
                const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
                if (keyResult instanceof Promise) {
                    throw new Error("Async schemas not supported in object keys currently");
                }
                if (keyResult.issues.length) {
                    payload.issues.push({
                        origin: "record",
                        code: "invalid_key",
                        issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
                        input: key,
                        path: [key],
                        inst,
                    });
                    payload.value[keyResult.value] = keyResult.value;
                    continue;
                }
                const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
                if (result instanceof Promise) {
                    proms.push(result.then((result) => {
                        if (result.issues.length) {
                            payload.issues.push(...prefixIssues(key, result.issues));
                        }
                        payload.value[keyResult.value] = result.value;
                    }));
                }
                else {
                    if (result.issues.length) {
                        payload.issues.push(...prefixIssues(key, result.issues));
                    }
                    payload.value[keyResult.value] = result.value;
                }
            }
        }
        if (proms.length) {
            return Promise.all(proms).then(() => payload);
        }
        return payload;
    };
});
const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
    $ZodType.init(inst, def);
    const values = getEnumValues(def.entries);
    inst._zod.values = new Set(values);
    inst._zod.pattern = new RegExp(`^(${values
        .filter((k) => propertyKeyTypes.has(typeof k))
        .map((o) => (typeof o === "string" ? escapeRegex(o) : o.toString()))
        .join("|")})$`);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (inst._zod.values.has(input)) {
            return payload;
        }
        payload.issues.push({
            code: "invalid_value",
            values,
            input,
            inst,
        });
        return payload;
    };
});
const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.values = new Set(def.values);
    inst._zod.pattern = new RegExp(`^(${def.values
        .map((o) => (typeof o === "string" ? escapeRegex(o) : o ? o.toString() : String(o)))
        .join("|")})$`);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (inst._zod.values.has(input)) {
            return payload;
        }
        payload.issues.push({
            code: "invalid_value",
            values: def.values,
            input,
            inst,
        });
        return payload;
    };
});
const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        const _out = def.transform(payload.value, payload);
        if (_ctx.async) {
            const output = _out instanceof Promise ? _out : Promise.resolve(_out);
            return output.then((output) => {
                payload.value = output;
                return payload;
            });
        }
        if (_out instanceof Promise) {
            throw new $ZodAsyncError();
        }
        payload.value = _out;
        return payload;
    };
});
const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    inst._zod.optout = "optional";
    defineLazy(inst._zod, "values", () => {
        return def.innerType._zod.values ? new Set([...def.innerType._zod.values, undefined]) : undefined;
    });
    defineLazy(inst._zod, "pattern", () => {
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
        if (def.innerType._zod.optin === "optional") {
            return def.innerType._zod.run(payload, ctx);
        }
        if (payload.value === undefined) {
            return payload;
        }
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy(inst._zod, "pattern", () => {
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : undefined;
    });
    defineLazy(inst._zod, "values", () => {
        return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
        if (payload.value === null)
            return payload;
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
    $ZodType.init(inst, def);
    // inst._zod.qin = "true";
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
        if (payload.value === undefined) {
            payload.value = def.defaultValue;
            /**
             * $ZodDefault always returns the default value immediately.
             * It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
            return payload;
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => handleDefaultResult(result, def));
        }
        return handleDefaultResult(result, def);
    };
});
function handleDefaultResult(payload, def) {
    if (payload.value === undefined) {
        payload.value = def.defaultValue;
    }
    return payload;
}
const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
        if (payload.value === undefined) {
            payload.value = def.defaultValue;
        }
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => {
        const v = def.innerType._zod.values;
        return v ? new Set([...v].filter((x) => x !== undefined)) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => handleNonOptionalResult(result, inst));
        }
        return handleNonOptionalResult(result, inst);
    };
});
function handleNonOptionalResult(payload, inst) {
    if (!payload.issues.length && payload.value === undefined) {
        payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: payload.value,
            inst,
        });
    }
    return payload;
}
const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => {
                payload.value = result.value;
                if (result.issues.length) {
                    payload.value = def.catchValue({
                        ...payload,
                        error: {
                            issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
                        },
                        input: payload.value,
                    });
                    payload.issues = [];
                }
                return payload;
            });
        }
        payload.value = result.value;
        if (result.issues.length) {
            payload.value = def.catchValue({
                ...payload,
                error: {
                    issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
                },
                input: payload.value,
            });
            payload.issues = [];
        }
        return payload;
    };
});
const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => def.in._zod.values);
    defineLazy(inst._zod, "optin", () => def.in._zod.optin);
    defineLazy(inst._zod, "optout", () => def.out._zod.optout);
    inst._zod.parse = (payload, ctx) => {
        const left = def.in._zod.run(payload, ctx);
        if (left instanceof Promise) {
            return left.then((left) => handlePipeResult(left, def, ctx));
        }
        return handlePipeResult(left, def, ctx);
    };
});
function handlePipeResult(left, def, ctx) {
    if (aborted(left)) {
        return left;
    }
    return def.out._zod.run({ value: left.value, issues: left.issues }, ctx);
}
const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    inst._zod.parse = (payload, ctx) => {
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then(handleReadonlyResult);
        }
        return handleReadonlyResult(result);
    };
});
function handleReadonlyResult(payload) {
    payload.value = Object.freeze(payload.value);
    return payload;
}
const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
    $ZodCheck.init(inst, def);
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _) => {
        return payload;
    };
    inst._zod.check = (payload) => {
        const input = payload.value;
        const r = def.fn(input);
        if (r instanceof Promise) {
            return r.then((r) => handleRefineResult(r, payload, input, inst));
        }
        handleRefineResult(r, payload, input, inst);
        return;
    };
});
function handleRefineResult(result, payload, input, inst) {
    if (!result) {
        const _iss = {
            code: "custom",
            input,
            inst, // incorporates params.error into issue reporting
            path: [...(inst._zod.def.path ?? [])], // incorporates params.error into issue reporting
            continue: !inst._zod.def.abort,
            // params: inst._zod.def.params,
        };
        if (inst._zod.def.params)
            _iss.params = inst._zod.def.params;
        payload.issues.push(issue(_iss));
    }
}

class $ZodRegistry {
    constructor() {
        this._map = new Map();
        this._idmap = new Map();
    }
    add(schema, ..._meta) {
        const meta = _meta[0];
        this._map.set(schema, meta);
        if (meta && typeof meta === "object" && "id" in meta) {
            if (this._idmap.has(meta.id)) {
                throw new Error(`ID ${meta.id} already exists in the registry`);
            }
            this._idmap.set(meta.id, schema);
        }
        return this;
    }
    clear() {
        this._map = new Map();
        this._idmap = new Map();
        return this;
    }
    remove(schema) {
        const meta = this._map.get(schema);
        if (meta && typeof meta === "object" && "id" in meta) {
            this._idmap.delete(meta.id);
        }
        this._map.delete(schema);
        return this;
    }
    get(schema) {
        // return this._map.get(schema) as any;
        // inherit metadata
        const p = schema._zod.parent;
        if (p) {
            const pm = { ...(this.get(p) ?? {}) };
            delete pm.id; // do not inherit id
            return { ...pm, ...this._map.get(schema) };
        }
        return this._map.get(schema);
    }
    has(schema) {
        return this._map.has(schema);
    }
}
// registries
function registry() {
    return new $ZodRegistry();
}
const globalRegistry = /*@__PURE__*/ registry();

function _string(Class, params) {
    return new Class({
        type: "string",
        ...normalizeParams(params),
    });
}
function _email(Class, params) {
    return new Class({
        type: "string",
        format: "email",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _guid(Class, params) {
    return new Class({
        type: "string",
        format: "guid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _uuid(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _uuidv4(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v4",
        ...normalizeParams(params),
    });
}
function _uuidv6(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v6",
        ...normalizeParams(params),
    });
}
function _uuidv7(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v7",
        ...normalizeParams(params),
    });
}
function _url(Class, params) {
    return new Class({
        type: "string",
        format: "url",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _emoji(Class, params) {
    return new Class({
        type: "string",
        format: "emoji",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _nanoid(Class, params) {
    return new Class({
        type: "string",
        format: "nanoid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _cuid(Class, params) {
    return new Class({
        type: "string",
        format: "cuid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _cuid2(Class, params) {
    return new Class({
        type: "string",
        format: "cuid2",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _ulid(Class, params) {
    return new Class({
        type: "string",
        format: "ulid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _xid(Class, params) {
    return new Class({
        type: "string",
        format: "xid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _ksuid(Class, params) {
    return new Class({
        type: "string",
        format: "ksuid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _ipv4(Class, params) {
    return new Class({
        type: "string",
        format: "ipv4",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _ipv6(Class, params) {
    return new Class({
        type: "string",
        format: "ipv6",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _cidrv4(Class, params) {
    return new Class({
        type: "string",
        format: "cidrv4",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _cidrv6(Class, params) {
    return new Class({
        type: "string",
        format: "cidrv6",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _base64(Class, params) {
    return new Class({
        type: "string",
        format: "base64",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _base64url(Class, params) {
    return new Class({
        type: "string",
        format: "base64url",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _e164(Class, params) {
    return new Class({
        type: "string",
        format: "e164",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _jwt(Class, params) {
    return new Class({
        type: "string",
        format: "jwt",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _isoDateTime(Class, params) {
    return new Class({
        type: "string",
        format: "datetime",
        check: "string_format",
        offset: false,
        local: false,
        precision: null,
        ...normalizeParams(params),
    });
}
function _isoDate(Class, params) {
    return new Class({
        type: "string",
        format: "date",
        check: "string_format",
        ...normalizeParams(params),
    });
}
function _isoTime(Class, params) {
    return new Class({
        type: "string",
        format: "time",
        check: "string_format",
        precision: null,
        ...normalizeParams(params),
    });
}
function _isoDuration(Class, params) {
    return new Class({
        type: "string",
        format: "duration",
        check: "string_format",
        ...normalizeParams(params),
    });
}
function _number(Class, params) {
    return new Class({
        type: "number",
        checks: [],
        ...normalizeParams(params),
    });
}
function _int(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "safeint",
        ...normalizeParams(params),
    });
}
function _boolean(Class, params) {
    return new Class({
        type: "boolean",
        ...normalizeParams(params),
    });
}
function _null$1(Class, params) {
    return new Class({
        type: "null",
        ...normalizeParams(params),
    });
}
function _unknown(Class) {
    return new Class({
        type: "unknown",
    });
}
function _never(Class, params) {
    return new Class({
        type: "never",
        ...normalizeParams(params),
    });
}
function _lt(value, params) {
    return new $ZodCheckLessThan({
        check: "less_than",
        ...normalizeParams(params),
        value,
        inclusive: false,
    });
}
function _lte(value, params) {
    return new $ZodCheckLessThan({
        check: "less_than",
        ...normalizeParams(params),
        value,
        inclusive: true,
    });
}
function _gt(value, params) {
    return new $ZodCheckGreaterThan({
        check: "greater_than",
        ...normalizeParams(params),
        value,
        inclusive: false,
    });
}
function _gte(value, params) {
    return new $ZodCheckGreaterThan({
        check: "greater_than",
        ...normalizeParams(params),
        value,
        inclusive: true,
    });
}
function _multipleOf(value, params) {
    return new $ZodCheckMultipleOf({
        check: "multiple_of",
        ...normalizeParams(params),
        value,
    });
}
function _maxLength(maximum, params) {
    const ch = new $ZodCheckMaxLength({
        check: "max_length",
        ...normalizeParams(params),
        maximum,
    });
    return ch;
}
function _minLength(minimum, params) {
    return new $ZodCheckMinLength({
        check: "min_length",
        ...normalizeParams(params),
        minimum,
    });
}
function _length(length, params) {
    return new $ZodCheckLengthEquals({
        check: "length_equals",
        ...normalizeParams(params),
        length,
    });
}
function _regex(pattern, params) {
    return new $ZodCheckRegex({
        check: "string_format",
        format: "regex",
        ...normalizeParams(params),
        pattern,
    });
}
function _lowercase(params) {
    return new $ZodCheckLowerCase({
        check: "string_format",
        format: "lowercase",
        ...normalizeParams(params),
    });
}
function _uppercase(params) {
    return new $ZodCheckUpperCase({
        check: "string_format",
        format: "uppercase",
        ...normalizeParams(params),
    });
}
function _includes(includes, params) {
    return new $ZodCheckIncludes({
        check: "string_format",
        format: "includes",
        ...normalizeParams(params),
        includes,
    });
}
function _startsWith(prefix, params) {
    return new $ZodCheckStartsWith({
        check: "string_format",
        format: "starts_with",
        ...normalizeParams(params),
        prefix,
    });
}
function _endsWith(suffix, params) {
    return new $ZodCheckEndsWith({
        check: "string_format",
        format: "ends_with",
        ...normalizeParams(params),
        suffix,
    });
}
function _overwrite(tx) {
    return new $ZodCheckOverwrite({
        check: "overwrite",
        tx,
    });
}
// normalize
function _normalize(form) {
    return _overwrite((input) => input.normalize(form));
}
// trim
function _trim() {
    return _overwrite((input) => input.trim());
}
// toLowerCase
function _toLowerCase() {
    return _overwrite((input) => input.toLowerCase());
}
// toUpperCase
function _toUpperCase() {
    return _overwrite((input) => input.toUpperCase());
}
function _array(Class, element, params) {
    return new Class({
        type: "array",
        element,
        // get element() {
        //   return element;
        // },
        ...normalizeParams(params),
    });
}
function _custom(Class, fn, _params) {
    const norm = normalizeParams(_params);
    norm.abort ?? (norm.abort = true); // default to abort:false
    const schema = new Class({
        type: "custom",
        check: "custom",
        fn: fn,
        ...norm,
    });
    return schema;
}
// export function _refine<T>(
//   Class: util.SchemaClass<schemas.$ZodCustom>,
//   fn: (arg: NoInfer<T>) => util.MaybeAsync<unknown>,
//   _params: string | $ZodCustomParams = {}
// ): checks.$ZodCheck<T> {
//   return _custom(Class, fn, _params);
// }
// same as _custom but defaults to abort:false
function _refine(Class, fn, _params) {
    const schema = new Class({
        type: "custom",
        check: "custom",
        fn: fn,
        ...normalizeParams(_params),
    });
    return schema;
}

// zod-compat.ts
// ----------------------------------------------------
// Unified types + helpers to accept Zod v3 and v4 (Mini)
// ----------------------------------------------------
// --- Runtime detection ---
function isZ4Schema(s) {
    // Present on Zod 4 (Classic & Mini) schemas; absent on Zod 3
    const schema = s;
    return !!schema._zod;
}
// --- Unified parsing ---
function safeParse$1(schema, data) {
    if (isZ4Schema(schema)) {
        // Mini exposes top-level safeParse
        const result = safeParse$2(schema, data);
        return result;
    }
    const v3Schema = schema;
    const result = v3Schema.safeParse(data);
    return result;
}
// --- Shape extraction ---
function getObjectShape(schema) {
    if (!schema)
        return undefined;
    // Zod v3 exposes `.shape`; Zod v4 keeps the shape on `_zod.def.shape`
    let rawShape;
    if (isZ4Schema(schema)) {
        const v4Schema = schema;
        rawShape = v4Schema._zod?.def?.shape;
    }
    else {
        const v3Schema = schema;
        rawShape = v3Schema.shape;
    }
    if (!rawShape)
        return undefined;
    if (typeof rawShape === 'function') {
        try {
            return rawShape();
        }
        catch {
            return undefined;
        }
    }
    return rawShape;
}
/**
 * Gets the literal value from a schema, if it's a literal schema.
 * Works with both Zod v3 and v4.
 * Returns undefined if the schema is not a literal or the value cannot be determined.
 */
function getLiteralValue(schema) {
    if (isZ4Schema(schema)) {
        const v4Schema = schema;
        const def = v4Schema._zod?.def;
        if (def) {
            // Try various ways to get the literal value
            if (def.value !== undefined)
                return def.value;
            if (Array.isArray(def.values) && def.values.length > 0) {
                return def.values[0];
            }
        }
    }
    const v3Schema = schema;
    const def = v3Schema._def;
    if (def) {
        if (def.value !== undefined)
            return def.value;
        if (Array.isArray(def.values) && def.values.length > 0) {
            return def.values[0];
        }
    }
    // Fallback: check for direct value property (some Zod versions)
    const directValue = schema.value;
    if (directValue !== undefined)
        return directValue;
    return undefined;
}

const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
    $ZodISODateTime.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function datetime(params) {
    return _isoDateTime(ZodISODateTime, params);
}
const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
    $ZodISODate.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function date(params) {
    return _isoDate(ZodISODate, params);
}
const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
    $ZodISOTime.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function time(params) {
    return _isoTime(ZodISOTime, params);
}
const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
    $ZodISODuration.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function duration(params) {
    return _isoDuration(ZodISODuration, params);
}

const initializer = (inst, issues) => {
    $ZodError.init(inst, issues);
    inst.name = "ZodError";
    Object.defineProperties(inst, {
        format: {
            value: (mapper) => formatError(inst, mapper),
            // enumerable: false,
        },
        flatten: {
            value: (mapper) => flattenError(inst, mapper),
            // enumerable: false,
        },
        addIssue: {
            value: (issue) => inst.issues.push(issue),
            // enumerable: false,
        },
        addIssues: {
            value: (issues) => inst.issues.push(...issues),
            // enumerable: false,
        },
        isEmpty: {
            get() {
                return inst.issues.length === 0;
            },
            // enumerable: false,
        },
    });
    // Object.defineProperty(inst, "isEmpty", {
    //   get() {
    //     return inst.issues.length === 0;
    //   },
    // });
};
const ZodRealError = $constructor("ZodError", initializer, {
    Parent: Error,
});
// /** @deprecated Use `z.core.$ZodErrorMapCtx` instead. */
// export type ErrorMapCtx = core.$ZodErrorMapCtx;

const parse = /* @__PURE__ */ _parse(ZodRealError);
const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);

const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
    $ZodType.init(inst, def);
    inst.def = def;
    Object.defineProperty(inst, "_def", { value: def });
    // base methods
    inst.check = (...checks) => {
        return inst.clone({
            ...def,
            checks: [
                ...(def.checks ?? []),
                ...checks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch),
            ],
        }
        // { parent: true }
        );
    };
    inst.clone = (def, params) => clone(inst, def, params);
    inst.brand = () => inst;
    inst.register = ((reg, meta) => {
        reg.add(inst, meta);
        return inst;
    });
    // parsing
    inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
    inst.safeParse = (data, params) => safeParse(inst, data, params);
    inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
    inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
    inst.spa = inst.safeParseAsync;
    // refinements
    inst.refine = (check, params) => inst.check(refine(check, params));
    inst.superRefine = (refinement) => inst.check(superRefine(refinement));
    inst.overwrite = (fn) => inst.check(_overwrite(fn));
    // wrappers
    inst.optional = () => optional(inst);
    inst.nullable = () => nullable(inst);
    inst.nullish = () => optional(nullable(inst));
    inst.nonoptional = (params) => nonoptional(inst, params);
    inst.array = () => array(inst);
    inst.or = (arg) => union([inst, arg]);
    inst.and = (arg) => intersection(inst, arg);
    inst.transform = (tx) => pipe(inst, transform(tx));
    inst.default = (def) => _default(inst, def);
    inst.prefault = (def) => prefault(inst, def);
    // inst.coalesce = (def, params) => coalesce(inst, def, params);
    inst.catch = (params) => _catch(inst, params);
    inst.pipe = (target) => pipe(inst, target);
    inst.readonly = () => readonly(inst);
    // meta
    inst.describe = (description) => {
        const cl = inst.clone();
        globalRegistry.add(cl, { description });
        return cl;
    };
    Object.defineProperty(inst, "description", {
        get() {
            return globalRegistry.get(inst)?.description;
        },
        configurable: true,
    });
    inst.meta = (...args) => {
        if (args.length === 0) {
            return globalRegistry.get(inst);
        }
        const cl = inst.clone();
        globalRegistry.add(cl, args[0]);
        return cl;
    };
    // helpers
    inst.isOptional = () => inst.safeParse(undefined).success;
    inst.isNullable = () => inst.safeParse(null).success;
    return inst;
});
/** @internal */
const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
    $ZodString.init(inst, def);
    ZodType.init(inst, def);
    const bag = inst._zod.bag;
    inst.format = bag.format ?? null;
    inst.minLength = bag.minimum ?? null;
    inst.maxLength = bag.maximum ?? null;
    // validations
    inst.regex = (...args) => inst.check(_regex(...args));
    inst.includes = (...args) => inst.check(_includes(...args));
    inst.startsWith = (...args) => inst.check(_startsWith(...args));
    inst.endsWith = (...args) => inst.check(_endsWith(...args));
    inst.min = (...args) => inst.check(_minLength(...args));
    inst.max = (...args) => inst.check(_maxLength(...args));
    inst.length = (...args) => inst.check(_length(...args));
    inst.nonempty = (...args) => inst.check(_minLength(1, ...args));
    inst.lowercase = (params) => inst.check(_lowercase(params));
    inst.uppercase = (params) => inst.check(_uppercase(params));
    // transforms
    inst.trim = () => inst.check(_trim());
    inst.normalize = (...args) => inst.check(_normalize(...args));
    inst.toLowerCase = () => inst.check(_toLowerCase());
    inst.toUpperCase = () => inst.check(_toUpperCase());
});
const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
    $ZodString.init(inst, def);
    _ZodString.init(inst, def);
    inst.email = (params) => inst.check(_email(ZodEmail, params));
    inst.url = (params) => inst.check(_url(ZodURL, params));
    inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
    inst.emoji = (params) => inst.check(_emoji(ZodEmoji, params));
    inst.guid = (params) => inst.check(_guid(ZodGUID, params));
    inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
    inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
    inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
    inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
    inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
    inst.guid = (params) => inst.check(_guid(ZodGUID, params));
    inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
    inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
    inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
    inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
    inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
    inst.xid = (params) => inst.check(_xid(ZodXID, params));
    inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
    inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
    inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
    inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
    inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
    inst.e164 = (params) => inst.check(_e164(ZodE164, params));
    // iso
    inst.datetime = (params) => inst.check(datetime(params));
    inst.date = (params) => inst.check(date(params));
    inst.time = (params) => inst.check(time(params));
    inst.duration = (params) => inst.check(duration(params));
});
function string(params) {
    return _string(ZodString, params);
}
const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    _ZodString.init(inst, def);
});
const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodEmail.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodGUID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodUUID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodURL.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodEmoji.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodNanoID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodCUID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodCUID2.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodULID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodXID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodKSUID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodIPv4.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodIPv6.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
    $ZodCIDRv4.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
    $ZodCIDRv6.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodBase64.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodBase64URL.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodE164.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodJWT.init(inst, def);
    ZodStringFormat.init(inst, def);
});
const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
    $ZodNumber.init(inst, def);
    ZodType.init(inst, def);
    inst.gt = (value, params) => inst.check(_gt(value, params));
    inst.gte = (value, params) => inst.check(_gte(value, params));
    inst.min = (value, params) => inst.check(_gte(value, params));
    inst.lt = (value, params) => inst.check(_lt(value, params));
    inst.lte = (value, params) => inst.check(_lte(value, params));
    inst.max = (value, params) => inst.check(_lte(value, params));
    inst.int = (params) => inst.check(int(params));
    inst.safe = (params) => inst.check(int(params));
    inst.positive = (params) => inst.check(_gt(0, params));
    inst.nonnegative = (params) => inst.check(_gte(0, params));
    inst.negative = (params) => inst.check(_lt(0, params));
    inst.nonpositive = (params) => inst.check(_lte(0, params));
    inst.multipleOf = (value, params) => inst.check(_multipleOf(value, params));
    inst.step = (value, params) => inst.check(_multipleOf(value, params));
    // inst.finite = (params) => inst.check(core.finite(params));
    inst.finite = () => inst;
    const bag = inst._zod.bag;
    inst.minValue =
        Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
    inst.maxValue =
        Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
    inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
    inst.isFinite = true;
    inst.format = bag.format ?? null;
});
function number(params) {
    return _number(ZodNumber, params);
}
const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
    $ZodNumberFormat.init(inst, def);
    ZodNumber.init(inst, def);
});
function int(params) {
    return _int(ZodNumberFormat, params);
}
const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
    $ZodBoolean.init(inst, def);
    ZodType.init(inst, def);
});
function boolean(params) {
    return _boolean(ZodBoolean, params);
}
const ZodNull = /*@__PURE__*/ $constructor("ZodNull", (inst, def) => {
    $ZodNull.init(inst, def);
    ZodType.init(inst, def);
});
function _null(params) {
    return _null$1(ZodNull, params);
}
const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
    $ZodUnknown.init(inst, def);
    ZodType.init(inst, def);
});
function unknown() {
    return _unknown(ZodUnknown);
}
const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
    $ZodNever.init(inst, def);
    ZodType.init(inst, def);
});
function never(params) {
    return _never(ZodNever, params);
}
const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
    $ZodArray.init(inst, def);
    ZodType.init(inst, def);
    inst.element = def.element;
    inst.min = (minLength, params) => inst.check(_minLength(minLength, params));
    inst.nonempty = (params) => inst.check(_minLength(1, params));
    inst.max = (maxLength, params) => inst.check(_maxLength(maxLength, params));
    inst.length = (len, params) => inst.check(_length(len, params));
    inst.unwrap = () => inst.element;
});
function array(element, params) {
    return _array(ZodArray, element, params);
}
const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
    $ZodObject.init(inst, def);
    ZodType.init(inst, def);
    defineLazy(inst, "shape", () => def.shape);
    inst.keyof = () => _enum$1(Object.keys(inst._zod.def.shape));
    inst.catchall = (catchall) => inst.clone({ ...inst._zod.def, catchall: catchall });
    inst.passthrough = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
    // inst.nonstrict = () => inst.clone({ ...inst._zod.def, catchall: api.unknown() });
    inst.loose = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
    inst.strict = () => inst.clone({ ...inst._zod.def, catchall: never() });
    inst.strip = () => inst.clone({ ...inst._zod.def, catchall: undefined });
    inst.extend = (incoming) => {
        return extend(inst, incoming);
    };
    inst.merge = (other) => merge(inst, other);
    inst.pick = (mask) => pick(inst, mask);
    inst.omit = (mask) => omit(inst, mask);
    inst.partial = (...args) => partial(ZodOptional, inst, args[0]);
    inst.required = (...args) => required$2(ZodNonOptional, inst, args[0]);
});
function object(shape, params) {
    const def = {
        type: "object",
        get shape() {
            assignProp(this, "shape", { ...shape });
            return this.shape;
        },
        ...normalizeParams(params),
    };
    return new ZodObject(def);
}
// looseObject
function looseObject(shape, params) {
    return new ZodObject({
        type: "object",
        get shape() {
            assignProp(this, "shape", { ...shape });
            return this.shape;
        },
        catchall: unknown(),
        ...normalizeParams(params),
    });
}
const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
    $ZodUnion.init(inst, def);
    ZodType.init(inst, def);
    inst.options = def.options;
});
function union(options, params) {
    return new ZodUnion({
        type: "union",
        options: options,
        ...normalizeParams(params),
    });
}
const ZodDiscriminatedUnion = /*@__PURE__*/ $constructor("ZodDiscriminatedUnion", (inst, def) => {
    ZodUnion.init(inst, def);
    $ZodDiscriminatedUnion.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
    // const [options, params] = args;
    return new ZodDiscriminatedUnion({
        type: "union",
        options,
        discriminator,
        ...normalizeParams(params),
    });
}
const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
    $ZodIntersection.init(inst, def);
    ZodType.init(inst, def);
});
function intersection(left, right) {
    return new ZodIntersection({
        type: "intersection",
        left: left,
        right: right,
    });
}
const ZodRecord = /*@__PURE__*/ $constructor("ZodRecord", (inst, def) => {
    $ZodRecord.init(inst, def);
    ZodType.init(inst, def);
    inst.keyType = def.keyType;
    inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
    return new ZodRecord({
        type: "record",
        keyType,
        valueType: valueType,
        ...normalizeParams(params),
    });
}
const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
    $ZodEnum.init(inst, def);
    ZodType.init(inst, def);
    inst.enum = def.entries;
    inst.options = Object.values(def.entries);
    const keys = new Set(Object.keys(def.entries));
    inst.extract = (values, params) => {
        const newEntries = {};
        for (const value of values) {
            if (keys.has(value)) {
                newEntries[value] = def.entries[value];
            }
            else
                throw new Error(`Key ${value} not found in enum`);
        }
        return new ZodEnum({
            ...def,
            checks: [],
            ...normalizeParams(params),
            entries: newEntries,
        });
    };
    inst.exclude = (values, params) => {
        const newEntries = { ...def.entries };
        for (const value of values) {
            if (keys.has(value)) {
                delete newEntries[value];
            }
            else
                throw new Error(`Key ${value} not found in enum`);
        }
        return new ZodEnum({
            ...def,
            checks: [],
            ...normalizeParams(params),
            entries: newEntries,
        });
    };
});
function _enum$1(values, params) {
    const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
    return new ZodEnum({
        type: "enum",
        entries,
        ...normalizeParams(params),
    });
}
const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
    $ZodLiteral.init(inst, def);
    ZodType.init(inst, def);
    inst.values = new Set(def.values);
    Object.defineProperty(inst, "value", {
        get() {
            if (def.values.length > 1) {
                throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
            }
            return def.values[0];
        },
    });
});
function literal(value, params) {
    return new ZodLiteral({
        type: "literal",
        values: Array.isArray(value) ? value : [value],
        ...normalizeParams(params),
    });
}
const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
    $ZodTransform.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        payload.addIssue = (issue$1) => {
            if (typeof issue$1 === "string") {
                payload.issues.push(issue(issue$1, payload.value, def));
            }
            else {
                // for Zod 3 backwards compatibility
                const _issue = issue$1;
                if (_issue.fatal)
                    _issue.continue = false;
                _issue.code ?? (_issue.code = "custom");
                _issue.input ?? (_issue.input = payload.value);
                _issue.inst ?? (_issue.inst = inst);
                _issue.continue ?? (_issue.continue = true);
                payload.issues.push(issue(_issue));
            }
        };
        const output = def.transform(payload.value, payload);
        if (output instanceof Promise) {
            return output.then((output) => {
                payload.value = output;
                return payload;
            });
        }
        payload.value = output;
        return payload;
    };
});
function transform(fn) {
    return new ZodTransform({
        type: "transform",
        transform: fn,
    });
}
const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
    $ZodOptional.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
    return new ZodOptional({
        type: "optional",
        innerType: innerType,
    });
}
const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
    $ZodNullable.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
    return new ZodNullable({
        type: "nullable",
        innerType: innerType,
    });
}
const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
    $ZodDefault.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
    inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
    return new ZodDefault({
        type: "default",
        innerType: innerType,
        get defaultValue() {
            return typeof defaultValue === "function" ? defaultValue() : defaultValue;
        },
    });
}
const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
    $ZodPrefault.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
    return new ZodPrefault({
        type: "prefault",
        innerType: innerType,
        get defaultValue() {
            return typeof defaultValue === "function" ? defaultValue() : defaultValue;
        },
    });
}
const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
    $ZodNonOptional.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
    return new ZodNonOptional({
        type: "nonoptional",
        innerType: innerType,
        ...normalizeParams(params),
    });
}
const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
    $ZodCatch.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
    inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
    return new ZodCatch({
        type: "catch",
        innerType: innerType,
        catchValue: (typeof catchValue === "function" ? catchValue : () => catchValue),
    });
}
const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
    $ZodPipe.init(inst, def);
    ZodType.init(inst, def);
    inst.in = def.in;
    inst.out = def.out;
});
function pipe(in_, out) {
    return new ZodPipe({
        type: "pipe",
        in: in_,
        out: out,
        // ...util.normalizeParams(params),
    });
}
const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
    $ZodReadonly.init(inst, def);
    ZodType.init(inst, def);
});
function readonly(innerType) {
    return new ZodReadonly({
        type: "readonly",
        innerType: innerType,
    });
}
const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
    $ZodCustom.init(inst, def);
    ZodType.init(inst, def);
});
// custom checks
function check(fn) {
    const ch = new $ZodCheck({
        check: "custom",
        // ...util.normalizeParams(params),
    });
    ch._zod.check = fn;
    return ch;
}
function custom(fn, _params) {
    return _custom(ZodCustom, fn ?? (() => true), _params);
}
function refine(fn, _params = {}) {
    return _refine(ZodCustom, fn, _params);
}
// superRefine
function superRefine(fn) {
    const ch = check((payload) => {
        payload.addIssue = (issue$1) => {
            if (typeof issue$1 === "string") {
                payload.issues.push(issue(issue$1, payload.value, ch._zod.def));
            }
            else {
                // for Zod 3 backwards compatibility
                const _issue = issue$1;
                if (_issue.fatal)
                    _issue.continue = false;
                _issue.code ?? (_issue.code = "custom");
                _issue.input ?? (_issue.input = payload.value);
                _issue.inst ?? (_issue.inst = ch);
                _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
                payload.issues.push(issue(_issue));
            }
        };
        return fn(payload.value, payload);
    });
    return ch;
}
// preprocess
// /** @deprecated Use `z.pipe()` and `z.transform()` instead. */
function preprocess(fn, schema) {
    return pipe(transform(fn), schema);
}

const LATEST_PROTOCOL_VERSION = '2025-11-25';
const SUPPORTED_PROTOCOL_VERSIONS = [LATEST_PROTOCOL_VERSION, '2025-06-18', '2025-03-26', '2024-11-05', '2024-10-07'];
const RELATED_TASK_META_KEY = 'io.modelcontextprotocol/related-task';
/* JSON-RPC types */
const JSONRPC_VERSION = '2.0';
/**
 * Assert 'object' type schema.
 *
 * @internal
 */
const AssertObjectSchema = custom((v) => v !== null && (typeof v === 'object' || typeof v === 'function'));
/**
 * A progress token, used to associate progress notifications with the original request.
 */
const ProgressTokenSchema = union([string(), number().int()]);
/**
 * An opaque token used to represent a cursor for pagination.
 */
const CursorSchema = string();
/**
 * Task creation parameters, used to ask that the server create a task to represent a request.
 */
looseObject({
    /**
     * Requested duration in milliseconds to retain task from creation.
     */
    ttl: number().optional(),
    /**
     * Time in milliseconds to wait between task status requests.
     */
    pollInterval: number().optional()
});
const TaskMetadataSchema = object({
    ttl: number().optional()
});
/**
 * Metadata for associating messages with a task.
 * Include this in the `_meta` field under the key `io.modelcontextprotocol/related-task`.
 */
const RelatedTaskMetadataSchema = object({
    taskId: string()
});
const RequestMetaSchema = looseObject({
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: ProgressTokenSchema.optional(),
    /**
     * If specified, this request is related to the provided task.
     */
    [RELATED_TASK_META_KEY]: RelatedTaskMetadataSchema.optional()
});
/**
 * Common params for any request.
 */
const BaseRequestParamsSchema = object({
    /**
     * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
     */
    _meta: RequestMetaSchema.optional()
});
/**
 * Common params for any task-augmented request.
 */
const TaskAugmentedRequestParamsSchema = BaseRequestParamsSchema.extend({
    /**
     * If specified, the caller is requesting task-augmented execution for this request.
     * The request will return a CreateTaskResult immediately, and the actual result can be
     * retrieved later via tasks/result.
     *
     * Task augmentation is subject to capability negotiation - receivers MUST declare support
     * for task augmentation of specific request types in their capabilities.
     */
    task: TaskMetadataSchema.optional()
});
/**
 * Checks if a value is a valid TaskAugmentedRequestParams.
 * @param value - The value to check.
 *
 * @returns True if the value is a valid TaskAugmentedRequestParams, false otherwise.
 */
const isTaskAugmentedRequestParams = (value) => TaskAugmentedRequestParamsSchema.safeParse(value).success;
const RequestSchema = object({
    method: string(),
    params: BaseRequestParamsSchema.loose().optional()
});
const NotificationsParamsSchema = object({
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: RequestMetaSchema.optional()
});
const NotificationSchema = object({
    method: string(),
    params: NotificationsParamsSchema.loose().optional()
});
const ResultSchema = looseObject({
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: RequestMetaSchema.optional()
});
/**
 * A uniquely identifying ID for a request in JSON-RPC.
 */
const RequestIdSchema = union([string(), number().int()]);
/**
 * A request that expects a response.
 */
const JSONRPCRequestSchema = object({
    jsonrpc: literal(JSONRPC_VERSION),
    id: RequestIdSchema,
    ...RequestSchema.shape
})
    .strict();
const isJSONRPCRequest = (value) => JSONRPCRequestSchema.safeParse(value).success;
/**
 * A notification which does not expect a response.
 */
const JSONRPCNotificationSchema = object({
    jsonrpc: literal(JSONRPC_VERSION),
    ...NotificationSchema.shape
})
    .strict();
const isJSONRPCNotification = (value) => JSONRPCNotificationSchema.safeParse(value).success;
/**
 * A successful (non-error) response to a request.
 */
const JSONRPCResultResponseSchema = object({
    jsonrpc: literal(JSONRPC_VERSION),
    id: RequestIdSchema,
    result: ResultSchema
})
    .strict();
/**
 * Checks if a value is a valid JSONRPCResultResponse.
 * @param value - The value to check.
 *
 * @returns True if the value is a valid JSONRPCResultResponse, false otherwise.
 */
const isJSONRPCResultResponse = (value) => JSONRPCResultResponseSchema.safeParse(value).success;
/**
 * Error codes defined by the JSON-RPC specification.
 */
var ErrorCode;
(function (ErrorCode) {
    // SDK error codes
    ErrorCode[ErrorCode["ConnectionClosed"] = -32e3] = "ConnectionClosed";
    ErrorCode[ErrorCode["RequestTimeout"] = -32001] = "RequestTimeout";
    // Standard JSON-RPC error codes
    ErrorCode[ErrorCode["ParseError"] = -32700] = "ParseError";
    ErrorCode[ErrorCode["InvalidRequest"] = -32600] = "InvalidRequest";
    ErrorCode[ErrorCode["MethodNotFound"] = -32601] = "MethodNotFound";
    ErrorCode[ErrorCode["InvalidParams"] = -32602] = "InvalidParams";
    ErrorCode[ErrorCode["InternalError"] = -32603] = "InternalError";
    // MCP-specific error codes
    ErrorCode[ErrorCode["UrlElicitationRequired"] = -32042] = "UrlElicitationRequired";
})(ErrorCode || (ErrorCode = {}));
/**
 * A response to a request that indicates an error occurred.
 */
const JSONRPCErrorResponseSchema = object({
    jsonrpc: literal(JSONRPC_VERSION),
    id: RequestIdSchema.optional(),
    error: object({
        /**
         * The error type that occurred.
         */
        code: number().int(),
        /**
         * A short description of the error. The message SHOULD be limited to a concise single sentence.
         */
        message: string(),
        /**
         * Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
         */
        data: unknown().optional()
    })
})
    .strict();
/**
 * Checks if a value is a valid JSONRPCErrorResponse.
 * @param value - The value to check.
 *
 * @returns True if the value is a valid JSONRPCErrorResponse, false otherwise.
 */
const isJSONRPCErrorResponse = (value) => JSONRPCErrorResponseSchema.safeParse(value).success;
const JSONRPCMessageSchema = union([
    JSONRPCRequestSchema,
    JSONRPCNotificationSchema,
    JSONRPCResultResponseSchema,
    JSONRPCErrorResponseSchema
]);
union([JSONRPCResultResponseSchema, JSONRPCErrorResponseSchema]);
/* Empty result */
/**
 * A response that indicates success but carries no data.
 */
const EmptyResultSchema = ResultSchema.strict();
const CancelledNotificationParamsSchema = NotificationsParamsSchema.extend({
    /**
     * The ID of the request to cancel.
     *
     * This MUST correspond to the ID of a request previously issued in the same direction.
     */
    requestId: RequestIdSchema.optional(),
    /**
     * An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
     */
    reason: string().optional()
});
/* Cancellation */
/**
 * This notification can be sent by either side to indicate that it is cancelling a previously-issued request.
 *
 * The request SHOULD still be in-flight, but due to communication latency, it is always possible that this notification MAY arrive after the request has already finished.
 *
 * This notification indicates that the result will be unused, so any associated processing SHOULD cease.
 *
 * A client MUST NOT attempt to cancel its `initialize` request.
 */
const CancelledNotificationSchema = NotificationSchema.extend({
    method: literal('notifications/cancelled'),
    params: CancelledNotificationParamsSchema
});
/* Base Metadata */
/**
 * Icon schema for use in tools, prompts, resources, and implementations.
 */
const IconSchema = object({
    /**
     * URL or data URI for the icon.
     */
    src: string(),
    /**
     * Optional MIME type for the icon.
     */
    mimeType: string().optional(),
    /**
     * Optional array of strings that specify sizes at which the icon can be used.
     * Each string should be in WxH format (e.g., `"48x48"`, `"96x96"`) or `"any"` for scalable formats like SVG.
     *
     * If not provided, the client should assume that the icon can be used at any size.
     */
    sizes: array(string()).optional(),
    /**
     * Optional specifier for the theme this icon is designed for. `light` indicates
     * the icon is designed to be used with a light background, and `dark` indicates
     * the icon is designed to be used with a dark background.
     *
     * If not provided, the client should assume the icon can be used with any theme.
     */
    theme: _enum$1(['light', 'dark']).optional()
});
/**
 * Base schema to add `icons` property.
 *
 */
const IconsSchema = object({
    /**
     * Optional set of sized icons that the client can display in a user interface.
     *
     * Clients that support rendering icons MUST support at least the following MIME types:
     * - `image/png` - PNG images (safe, universal compatibility)
     * - `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)
     *
     * Clients that support rendering icons SHOULD also support:
     * - `image/svg+xml` - SVG images (scalable but requires security precautions)
     * - `image/webp` - WebP images (modern, efficient format)
     */
    icons: array(IconSchema).optional()
});
/**
 * Base metadata interface for common properties across resources, tools, prompts, and implementations.
 */
const BaseMetadataSchema = object({
    /** Intended for programmatic or logical use, but used as a display name in past specs or fallback */
    name: string(),
    /**
     * Intended for UI and end-user contexts — optimized to be human-readable and easily understood,
     * even by those unfamiliar with domain-specific terminology.
     *
     * If not provided, the name should be used for display (except for Tool,
     * where `annotations.title` should be given precedence over using `name`,
     * if present).
     */
    title: string().optional()
});
/* Initialization */
/**
 * Describes the name and version of an MCP implementation.
 */
const ImplementationSchema = BaseMetadataSchema.extend({
    ...BaseMetadataSchema.shape,
    ...IconsSchema.shape,
    version: string(),
    /**
     * An optional URL of the website for this implementation.
     */
    websiteUrl: string().optional(),
    /**
     * An optional human-readable description of what this implementation does.
     *
     * This can be used by clients or servers to provide context about their purpose
     * and capabilities. For example, a server might describe the types of resources
     * or tools it provides, while a client might describe its intended use case.
     */
    description: string().optional()
});
const FormElicitationCapabilitySchema = intersection(object({
    applyDefaults: boolean().optional()
}), record(string(), unknown()));
const ElicitationCapabilitySchema = preprocess(value => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (Object.keys(value).length === 0) {
            return { form: {} };
        }
    }
    return value;
}, intersection(object({
    form: FormElicitationCapabilitySchema.optional(),
    url: AssertObjectSchema.optional()
}), record(string(), unknown()).optional()));
/**
 * Task capabilities for clients, indicating which request types support task creation.
 */
const ClientTasksCapabilitySchema = looseObject({
    /**
     * Present if the client supports listing tasks.
     */
    list: AssertObjectSchema.optional(),
    /**
     * Present if the client supports cancelling tasks.
     */
    cancel: AssertObjectSchema.optional(),
    /**
     * Capabilities for task creation on specific request types.
     */
    requests: looseObject({
        /**
         * Task support for sampling requests.
         */
        sampling: looseObject({
            createMessage: AssertObjectSchema.optional()
        })
            .optional(),
        /**
         * Task support for elicitation requests.
         */
        elicitation: looseObject({
            create: AssertObjectSchema.optional()
        })
            .optional()
    })
        .optional()
});
/**
 * Task capabilities for servers, indicating which request types support task creation.
 */
const ServerTasksCapabilitySchema = looseObject({
    /**
     * Present if the server supports listing tasks.
     */
    list: AssertObjectSchema.optional(),
    /**
     * Present if the server supports cancelling tasks.
     */
    cancel: AssertObjectSchema.optional(),
    /**
     * Capabilities for task creation on specific request types.
     */
    requests: looseObject({
        /**
         * Task support for tool requests.
         */
        tools: looseObject({
            call: AssertObjectSchema.optional()
        })
            .optional()
    })
        .optional()
});
/**
 * Capabilities a client may support. Known capabilities are defined here, in this schema, but this is not a closed set: any client can define its own, additional capabilities.
 */
const ClientCapabilitiesSchema = object({
    /**
     * Experimental, non-standard capabilities that the client supports.
     */
    experimental: record(string(), AssertObjectSchema).optional(),
    /**
     * Present if the client supports sampling from an LLM.
     */
    sampling: object({
        /**
         * Present if the client supports context inclusion via includeContext parameter.
         * If not declared, servers SHOULD only use `includeContext: "none"` (or omit it).
         */
        context: AssertObjectSchema.optional(),
        /**
         * Present if the client supports tool use via tools and toolChoice parameters.
         */
        tools: AssertObjectSchema.optional()
    })
        .optional(),
    /**
     * Present if the client supports eliciting user input.
     */
    elicitation: ElicitationCapabilitySchema.optional(),
    /**
     * Present if the client supports listing roots.
     */
    roots: object({
        /**
         * Whether the client supports issuing notifications for changes to the roots list.
         */
        listChanged: boolean().optional()
    })
        .optional(),
    /**
     * Present if the client supports task creation.
     */
    tasks: ClientTasksCapabilitySchema.optional(),
    /**
     * Extensions that the client supports. Keys are extension identifiers (vendor-prefix/extension-name).
     */
    extensions: record(string(), AssertObjectSchema).optional()
});
const InitializeRequestParamsSchema = BaseRequestParamsSchema.extend({
    /**
     * The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
     */
    protocolVersion: string(),
    capabilities: ClientCapabilitiesSchema,
    clientInfo: ImplementationSchema
});
/**
 * This request is sent from the client to the server when it first connects, asking it to begin initialization.
 */
const InitializeRequestSchema = RequestSchema.extend({
    method: literal('initialize'),
    params: InitializeRequestParamsSchema
});
/**
 * Capabilities that a server may support. Known capabilities are defined here, in this schema, but this is not a closed set: any server can define its own, additional capabilities.
 */
const ServerCapabilitiesSchema = object({
    /**
     * Experimental, non-standard capabilities that the server supports.
     */
    experimental: record(string(), AssertObjectSchema).optional(),
    /**
     * Present if the server supports sending log messages to the client.
     */
    logging: AssertObjectSchema.optional(),
    /**
     * Present if the server supports sending completions to the client.
     */
    completions: AssertObjectSchema.optional(),
    /**
     * Present if the server offers any prompt templates.
     */
    prompts: object({
        /**
         * Whether this server supports issuing notifications for changes to the prompt list.
         */
        listChanged: boolean().optional()
    })
        .optional(),
    /**
     * Present if the server offers any resources to read.
     */
    resources: object({
        /**
         * Whether this server supports clients subscribing to resource updates.
         */
        subscribe: boolean().optional(),
        /**
         * Whether this server supports issuing notifications for changes to the resource list.
         */
        listChanged: boolean().optional()
    })
        .optional(),
    /**
     * Present if the server offers any tools to call.
     */
    tools: object({
        /**
         * Whether this server supports issuing notifications for changes to the tool list.
         */
        listChanged: boolean().optional()
    })
        .optional(),
    /**
     * Present if the server supports task creation.
     */
    tasks: ServerTasksCapabilitySchema.optional(),
    /**
     * Extensions that the server supports. Keys are extension identifiers (vendor-prefix/extension-name).
     */
    extensions: record(string(), AssertObjectSchema).optional()
});
/**
 * After receiving an initialize request from the client, the server sends this response.
 */
const InitializeResultSchema = ResultSchema.extend({
    /**
     * The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
     */
    protocolVersion: string(),
    capabilities: ServerCapabilitiesSchema,
    serverInfo: ImplementationSchema,
    /**
     * Instructions describing how to use the server and its features.
     *
     * This can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a "hint" to the model. For example, this information MAY be added to the system prompt.
     */
    instructions: string().optional()
});
/**
 * This notification is sent from the client to the server after initialization has finished.
 */
const InitializedNotificationSchema = NotificationSchema.extend({
    method: literal('notifications/initialized'),
    params: NotificationsParamsSchema.optional()
});
/* Ping */
/**
 * A ping, issued by either the server or the client, to check that the other party is still alive. The receiver must promptly respond, or else may be disconnected.
 */
const PingRequestSchema = RequestSchema.extend({
    method: literal('ping'),
    params: BaseRequestParamsSchema.optional()
});
/* Progress notifications */
const ProgressSchema = object({
    /**
     * The progress thus far. This should increase every time progress is made, even if the total is unknown.
     */
    progress: number(),
    /**
     * Total number of items to process (or total progress required), if known.
     */
    total: optional(number()),
    /**
     * An optional message describing the current progress.
     */
    message: optional(string())
});
const ProgressNotificationParamsSchema = object({
    ...NotificationsParamsSchema.shape,
    ...ProgressSchema.shape,
    /**
     * The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
     */
    progressToken: ProgressTokenSchema
});
/**
 * An out-of-band notification used to inform the receiver of a progress update for a long-running request.
 *
 * @category notifications/progress
 */
const ProgressNotificationSchema = NotificationSchema.extend({
    method: literal('notifications/progress'),
    params: ProgressNotificationParamsSchema
});
const PaginatedRequestParamsSchema = BaseRequestParamsSchema.extend({
    /**
     * An opaque token representing the current pagination position.
     * If provided, the server should return results starting after this cursor.
     */
    cursor: CursorSchema.optional()
});
/* Pagination */
const PaginatedRequestSchema = RequestSchema.extend({
    params: PaginatedRequestParamsSchema.optional()
});
const PaginatedResultSchema = ResultSchema.extend({
    /**
     * An opaque token representing the pagination position after the last returned result.
     * If present, there may be more results available.
     */
    nextCursor: CursorSchema.optional()
});
/**
 * The status of a task.
 * */
const TaskStatusSchema = _enum$1(['working', 'input_required', 'completed', 'failed', 'cancelled']);
/* Tasks */
/**
 * A pollable state object associated with a request.
 */
const TaskSchema = object({
    taskId: string(),
    status: TaskStatusSchema,
    /**
     * Time in milliseconds to keep task results available after completion.
     * If null, the task has unlimited lifetime until manually cleaned up.
     */
    ttl: union([number(), _null()]),
    /**
     * ISO 8601 timestamp when the task was created.
     */
    createdAt: string(),
    /**
     * ISO 8601 timestamp when the task was last updated.
     */
    lastUpdatedAt: string(),
    pollInterval: optional(number()),
    /**
     * Optional diagnostic message for failed tasks or other status information.
     */
    statusMessage: optional(string())
});
/**
 * Result returned when a task is created, containing the task data wrapped in a task field.
 */
const CreateTaskResultSchema = ResultSchema.extend({
    task: TaskSchema
});
/**
 * Parameters for task status notification.
 */
const TaskStatusNotificationParamsSchema = NotificationsParamsSchema.merge(TaskSchema);
/**
 * A notification sent when a task's status changes.
 */
const TaskStatusNotificationSchema = NotificationSchema.extend({
    method: literal('notifications/tasks/status'),
    params: TaskStatusNotificationParamsSchema
});
/**
 * A request to get the state of a specific task.
 */
const GetTaskRequestSchema = RequestSchema.extend({
    method: literal('tasks/get'),
    params: BaseRequestParamsSchema.extend({
        taskId: string()
    })
});
/**
 * The response to a tasks/get request.
 */
const GetTaskResultSchema = ResultSchema.merge(TaskSchema);
/**
 * A request to get the result of a specific task.
 */
const GetTaskPayloadRequestSchema = RequestSchema.extend({
    method: literal('tasks/result'),
    params: BaseRequestParamsSchema.extend({
        taskId: string()
    })
});
/**
 * The response to a tasks/result request.
 * The structure matches the result type of the original request.
 * For example, a tools/call task would return the CallToolResult structure.
 *
 */
ResultSchema.loose();
/**
 * A request to list tasks.
 */
const ListTasksRequestSchema = PaginatedRequestSchema.extend({
    method: literal('tasks/list')
});
/**
 * The response to a tasks/list request.
 */
const ListTasksResultSchema = PaginatedResultSchema.extend({
    tasks: array(TaskSchema)
});
/**
 * A request to cancel a specific task.
 */
const CancelTaskRequestSchema = RequestSchema.extend({
    method: literal('tasks/cancel'),
    params: BaseRequestParamsSchema.extend({
        taskId: string()
    })
});
/**
 * The response to a tasks/cancel request.
 */
const CancelTaskResultSchema = ResultSchema.merge(TaskSchema);
/* Resources */
/**
 * The contents of a specific resource or sub-resource.
 */
const ResourceContentsSchema = object({
    /**
     * The URI of this resource.
     */
    uri: string(),
    /**
     * The MIME type of this resource, if known.
     */
    mimeType: optional(string()),
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: record(string(), unknown()).optional()
});
const TextResourceContentsSchema = ResourceContentsSchema.extend({
    /**
     * The text of the item. This must only be set if the item can actually be represented as text (not binary data).
     */
    text: string()
});
/**
 * A Zod schema for validating Base64 strings that is more performant and
 * robust for very large inputs than the default regex-based check. It avoids
 * stack overflows by using the native `atob` function for validation.
 */
const Base64Schema = string().refine(val => {
    try {
        // atob throws a DOMException if the string contains characters
        // that are not part of the Base64 character set.
        atob(val);
        return true;
    }
    catch {
        return false;
    }
}, { message: 'Invalid Base64 string' });
const BlobResourceContentsSchema = ResourceContentsSchema.extend({
    /**
     * A base64-encoded string representing the binary data of the item.
     */
    blob: Base64Schema
});
/**
 * The sender or recipient of messages and data in a conversation.
 */
const RoleSchema = _enum$1(['user', 'assistant']);
/**
 * Optional annotations providing clients additional context about a resource.
 */
const AnnotationsSchema = object({
    /**
     * Intended audience(s) for the resource.
     */
    audience: array(RoleSchema).optional(),
    /**
     * Importance hint for the resource, from 0 (least) to 1 (most).
     */
    priority: number().min(0).max(1).optional(),
    /**
     * ISO 8601 timestamp for the most recent modification.
     */
    lastModified: datetime({ offset: true }).optional()
});
/**
 * A known resource that the server is capable of reading.
 */
const ResourceSchema = object({
    ...BaseMetadataSchema.shape,
    ...IconsSchema.shape,
    /**
     * The URI of this resource.
     */
    uri: string(),
    /**
     * A description of what this resource represents.
     *
     * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
     */
    description: optional(string()),
    /**
     * The MIME type of this resource, if known.
     */
    mimeType: optional(string()),
    /**
     * The size of the raw resource content, in bytes (i.e., before base64 encoding or any tokenization), if known.
     *
     * This can be used by Hosts to display file sizes and estimate context window usage.
     */
    size: optional(number()),
    /**
     * Optional annotations for the client.
     */
    annotations: AnnotationsSchema.optional(),
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: optional(looseObject({}))
});
/**
 * A template description for resources available on the server.
 */
const ResourceTemplateSchema = object({
    ...BaseMetadataSchema.shape,
    ...IconsSchema.shape,
    /**
     * A URI template (according to RFC 6570) that can be used to construct resource URIs.
     */
    uriTemplate: string(),
    /**
     * A description of what this template is for.
     *
     * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
     */
    description: optional(string()),
    /**
     * The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
     */
    mimeType: optional(string()),
    /**
     * Optional annotations for the client.
     */
    annotations: AnnotationsSchema.optional(),
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: optional(looseObject({}))
});
/**
 * Sent from the client to request a list of resources the server has.
 */
const ListResourcesRequestSchema = PaginatedRequestSchema.extend({
    method: literal('resources/list')
});
/**
 * The server's response to a resources/list request from the client.
 */
const ListResourcesResultSchema = PaginatedResultSchema.extend({
    resources: array(ResourceSchema)
});
/**
 * Sent from the client to request a list of resource templates the server has.
 */
const ListResourceTemplatesRequestSchema = PaginatedRequestSchema.extend({
    method: literal('resources/templates/list')
});
/**
 * The server's response to a resources/templates/list request from the client.
 */
const ListResourceTemplatesResultSchema = PaginatedResultSchema.extend({
    resourceTemplates: array(ResourceTemplateSchema)
});
const ResourceRequestParamsSchema = BaseRequestParamsSchema.extend({
    /**
     * The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.
     *
     * @format uri
     */
    uri: string()
});
/**
 * Parameters for a `resources/read` request.
 */
const ReadResourceRequestParamsSchema = ResourceRequestParamsSchema;
/**
 * Sent from the client to the server, to read a specific resource URI.
 */
const ReadResourceRequestSchema = RequestSchema.extend({
    method: literal('resources/read'),
    params: ReadResourceRequestParamsSchema
});
/**
 * The server's response to a resources/read request from the client.
 */
const ReadResourceResultSchema = ResultSchema.extend({
    contents: array(union([TextResourceContentsSchema, BlobResourceContentsSchema]))
});
/**
 * An optional notification from the server to the client, informing it that the list of resources it can read from has changed. This may be issued by servers without any previous subscription from the client.
 */
const ResourceListChangedNotificationSchema = NotificationSchema.extend({
    method: literal('notifications/resources/list_changed'),
    params: NotificationsParamsSchema.optional()
});
const SubscribeRequestParamsSchema = ResourceRequestParamsSchema;
/**
 * Sent from the client to request resources/updated notifications from the server whenever a particular resource changes.
 */
const SubscribeRequestSchema = RequestSchema.extend({
    method: literal('resources/subscribe'),
    params: SubscribeRequestParamsSchema
});
const UnsubscribeRequestParamsSchema = ResourceRequestParamsSchema;
/**
 * Sent from the client to request cancellation of resources/updated notifications from the server. This should follow a previous resources/subscribe request.
 */
const UnsubscribeRequestSchema = RequestSchema.extend({
    method: literal('resources/unsubscribe'),
    params: UnsubscribeRequestParamsSchema
});
/**
 * Parameters for a `notifications/resources/updated` notification.
 */
const ResourceUpdatedNotificationParamsSchema = NotificationsParamsSchema.extend({
    /**
     * The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.
     */
    uri: string()
});
/**
 * A notification from the server to the client, informing it that a resource has changed and may need to be read again. This should only be sent if the client previously sent a resources/subscribe request.
 */
const ResourceUpdatedNotificationSchema = NotificationSchema.extend({
    method: literal('notifications/resources/updated'),
    params: ResourceUpdatedNotificationParamsSchema
});
/* Prompts */
/**
 * Describes an argument that a prompt can accept.
 */
const PromptArgumentSchema = object({
    /**
     * The name of the argument.
     */
    name: string(),
    /**
     * A human-readable description of the argument.
     */
    description: optional(string()),
    /**
     * Whether this argument must be provided.
     */
    required: optional(boolean())
});
/**
 * A prompt or prompt template that the server offers.
 */
const PromptSchema = object({
    ...BaseMetadataSchema.shape,
    ...IconsSchema.shape,
    /**
     * An optional description of what this prompt provides
     */
    description: optional(string()),
    /**
     * A list of arguments to use for templating the prompt.
     */
    arguments: optional(array(PromptArgumentSchema)),
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: optional(looseObject({}))
});
/**
 * Sent from the client to request a list of prompts and prompt templates the server has.
 */
const ListPromptsRequestSchema = PaginatedRequestSchema.extend({
    method: literal('prompts/list')
});
/**
 * The server's response to a prompts/list request from the client.
 */
const ListPromptsResultSchema = PaginatedResultSchema.extend({
    prompts: array(PromptSchema)
});
/**
 * Parameters for a `prompts/get` request.
 */
const GetPromptRequestParamsSchema = BaseRequestParamsSchema.extend({
    /**
     * The name of the prompt or prompt template.
     */
    name: string(),
    /**
     * Arguments to use for templating the prompt.
     */
    arguments: record(string(), string()).optional()
});
/**
 * Used by the client to get a prompt provided by the server.
 */
const GetPromptRequestSchema = RequestSchema.extend({
    method: literal('prompts/get'),
    params: GetPromptRequestParamsSchema
});
/**
 * Text provided to or from an LLM.
 */
const TextContentSchema = object({
    type: literal('text'),
    /**
     * The text content of the message.
     */
    text: string(),
    /**
     * Optional annotations for the client.
     */
    annotations: AnnotationsSchema.optional(),
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: record(string(), unknown()).optional()
});
/**
 * An image provided to or from an LLM.
 */
const ImageContentSchema = object({
    type: literal('image'),
    /**
     * The base64-encoded image data.
     */
    data: Base64Schema,
    /**
     * The MIME type of the image. Different providers may support different image types.
     */
    mimeType: string(),
    /**
     * Optional annotations for the client.
     */
    annotations: AnnotationsSchema.optional(),
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: record(string(), unknown()).optional()
});
/**
 * An Audio provided to or from an LLM.
 */
const AudioContentSchema = object({
    type: literal('audio'),
    /**
     * The base64-encoded audio data.
     */
    data: Base64Schema,
    /**
     * The MIME type of the audio. Different providers may support different audio types.
     */
    mimeType: string(),
    /**
     * Optional annotations for the client.
     */
    annotations: AnnotationsSchema.optional(),
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: record(string(), unknown()).optional()
});
/**
 * A tool call request from an assistant (LLM).
 * Represents the assistant's request to use a tool.
 */
const ToolUseContentSchema = object({
    type: literal('tool_use'),
    /**
     * The name of the tool to invoke.
     * Must match a tool name from the request's tools array.
     */
    name: string(),
    /**
     * Unique identifier for this tool call.
     * Used to correlate with ToolResultContent in subsequent messages.
     */
    id: string(),
    /**
     * Arguments to pass to the tool.
     * Must conform to the tool's inputSchema.
     */
    input: record(string(), unknown()),
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: record(string(), unknown()).optional()
});
/**
 * The contents of a resource, embedded into a prompt or tool call result.
 */
const EmbeddedResourceSchema = object({
    type: literal('resource'),
    resource: union([TextResourceContentsSchema, BlobResourceContentsSchema]),
    /**
     * Optional annotations for the client.
     */
    annotations: AnnotationsSchema.optional(),
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: record(string(), unknown()).optional()
});
/**
 * A resource that the server is capable of reading, included in a prompt or tool call result.
 *
 * Note: resource links returned by tools are not guaranteed to appear in the results of `resources/list` requests.
 */
const ResourceLinkSchema = ResourceSchema.extend({
    type: literal('resource_link')
});
/**
 * A content block that can be used in prompts and tool results.
 */
const ContentBlockSchema = union([
    TextContentSchema,
    ImageContentSchema,
    AudioContentSchema,
    ResourceLinkSchema,
    EmbeddedResourceSchema
]);
/**
 * Describes a message returned as part of a prompt.
 */
const PromptMessageSchema = object({
    role: RoleSchema,
    content: ContentBlockSchema
});
/**
 * The server's response to a prompts/get request from the client.
 */
const GetPromptResultSchema = ResultSchema.extend({
    /**
     * An optional description for the prompt.
     */
    description: string().optional(),
    messages: array(PromptMessageSchema)
});
/**
 * An optional notification from the server to the client, informing it that the list of prompts it offers has changed. This may be issued by servers without any previous subscription from the client.
 */
const PromptListChangedNotificationSchema = NotificationSchema.extend({
    method: literal('notifications/prompts/list_changed'),
    params: NotificationsParamsSchema.optional()
});
/* Tools */
/**
 * Additional properties describing a Tool to clients.
 *
 * NOTE: all properties in ToolAnnotations are **hints**.
 * They are not guaranteed to provide a faithful description of
 * tool behavior (including descriptive properties like `title`).
 *
 * Clients should never make tool use decisions based on ToolAnnotations
 * received from untrusted servers.
 */
const ToolAnnotationsSchema = object({
    /**
     * A human-readable title for the tool.
     */
    title: string().optional(),
    /**
     * If true, the tool does not modify its environment.
     *
     * Default: false
     */
    readOnlyHint: boolean().optional(),
    /**
     * If true, the tool may perform destructive updates to its environment.
     * If false, the tool performs only additive updates.
     *
     * (This property is meaningful only when `readOnlyHint == false`)
     *
     * Default: true
     */
    destructiveHint: boolean().optional(),
    /**
     * If true, calling the tool repeatedly with the same arguments
     * will have no additional effect on the its environment.
     *
     * (This property is meaningful only when `readOnlyHint == false`)
     *
     * Default: false
     */
    idempotentHint: boolean().optional(),
    /**
     * If true, this tool may interact with an "open world" of external
     * entities. If false, the tool's domain of interaction is closed.
     * For example, the world of a web search tool is open, whereas that
     * of a memory tool is not.
     *
     * Default: true
     */
    openWorldHint: boolean().optional()
});
/**
 * Execution-related properties for a tool.
 */
const ToolExecutionSchema = object({
    /**
     * Indicates the tool's preference for task-augmented execution.
     * - "required": Clients MUST invoke the tool as a task
     * - "optional": Clients MAY invoke the tool as a task or normal request
     * - "forbidden": Clients MUST NOT attempt to invoke the tool as a task
     *
     * If not present, defaults to "forbidden".
     */
    taskSupport: _enum$1(['required', 'optional', 'forbidden']).optional()
});
/**
 * Definition for a tool the client can call.
 */
const ToolSchema = object({
    ...BaseMetadataSchema.shape,
    ...IconsSchema.shape,
    /**
     * A human-readable description of the tool.
     */
    description: string().optional(),
    /**
     * A JSON Schema 2020-12 object defining the expected parameters for the tool.
     * Must have type: 'object' at the root level per MCP spec.
     */
    inputSchema: object({
        type: literal('object'),
        properties: record(string(), AssertObjectSchema).optional(),
        required: array(string()).optional()
    })
        .catchall(unknown()),
    /**
     * An optional JSON Schema 2020-12 object defining the structure of the tool's output
     * returned in the structuredContent field of a CallToolResult.
     * Must have type: 'object' at the root level per MCP spec.
     */
    outputSchema: object({
        type: literal('object'),
        properties: record(string(), AssertObjectSchema).optional(),
        required: array(string()).optional()
    })
        .catchall(unknown())
        .optional(),
    /**
     * Optional additional tool information.
     */
    annotations: ToolAnnotationsSchema.optional(),
    /**
     * Execution-related properties for this tool.
     */
    execution: ToolExecutionSchema.optional(),
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: record(string(), unknown()).optional()
});
/**
 * Sent from the client to request a list of tools the server has.
 */
const ListToolsRequestSchema = PaginatedRequestSchema.extend({
    method: literal('tools/list')
});
/**
 * The server's response to a tools/list request from the client.
 */
const ListToolsResultSchema = PaginatedResultSchema.extend({
    tools: array(ToolSchema)
});
/**
 * The server's response to a tool call.
 */
const CallToolResultSchema = ResultSchema.extend({
    /**
     * A list of content objects that represent the result of the tool call.
     *
     * If the Tool does not define an outputSchema, this field MUST be present in the result.
     * For backwards compatibility, this field is always present, but it may be empty.
     */
    content: array(ContentBlockSchema).default([]),
    /**
     * An object containing structured tool output.
     *
     * If the Tool defines an outputSchema, this field MUST be present in the result, and contain a JSON object that matches the schema.
     */
    structuredContent: record(string(), unknown()).optional(),
    /**
     * Whether the tool call ended in an error.
     *
     * If not set, this is assumed to be false (the call was successful).
     *
     * Any errors that originate from the tool SHOULD be reported inside the result
     * object, with `isError` set to true, _not_ as an MCP protocol-level error
     * response. Otherwise, the LLM would not be able to see that an error occurred
     * and self-correct.
     *
     * However, any errors in _finding_ the tool, an error indicating that the
     * server does not support tool calls, or any other exceptional conditions,
     * should be reported as an MCP error response.
     */
    isError: boolean().optional()
});
/**
 * CallToolResultSchema extended with backwards compatibility to protocol version 2024-10-07.
 */
CallToolResultSchema.or(ResultSchema.extend({
    toolResult: unknown()
}));
/**
 * Parameters for a `tools/call` request.
 */
const CallToolRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
    /**
     * The name of the tool to call.
     */
    name: string(),
    /**
     * Arguments to pass to the tool.
     */
    arguments: record(string(), unknown()).optional()
});
/**
 * Used by the client to invoke a tool provided by the server.
 */
const CallToolRequestSchema = RequestSchema.extend({
    method: literal('tools/call'),
    params: CallToolRequestParamsSchema
});
/**
 * An optional notification from the server to the client, informing it that the list of tools it offers has changed. This may be issued by servers without any previous subscription from the client.
 */
const ToolListChangedNotificationSchema = NotificationSchema.extend({
    method: literal('notifications/tools/list_changed'),
    params: NotificationsParamsSchema.optional()
});
/**
 * Base schema for list changed subscription options (without callback).
 * Used internally for Zod validation of autoRefresh and debounceMs.
 */
object({
    /**
     * If true, the list will be refreshed automatically when a list changed notification is received.
     * The callback will be called with the updated list.
     *
     * If false, the callback will be called with null items, allowing manual refresh.
     *
     * @default true
     */
    autoRefresh: boolean().default(true),
    /**
     * Debounce time in milliseconds for list changed notification processing.
     *
     * Multiple notifications received within this timeframe will only trigger one refresh.
     * Set to 0 to disable debouncing.
     *
     * @default 300
     */
    debounceMs: number().int().nonnegative().default(300)
});
/* Logging */
/**
 * The severity of a log message.
 */
const LoggingLevelSchema = _enum$1(['debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency']);
/**
 * Parameters for a `logging/setLevel` request.
 */
const SetLevelRequestParamsSchema = BaseRequestParamsSchema.extend({
    /**
     * The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/logging/message.
     */
    level: LoggingLevelSchema
});
/**
 * A request from the client to the server, to enable or adjust logging.
 */
const SetLevelRequestSchema = RequestSchema.extend({
    method: literal('logging/setLevel'),
    params: SetLevelRequestParamsSchema
});
/**
 * Parameters for a `notifications/message` notification.
 */
const LoggingMessageNotificationParamsSchema = NotificationsParamsSchema.extend({
    /**
     * The severity of this log message.
     */
    level: LoggingLevelSchema,
    /**
     * An optional name of the logger issuing this message.
     */
    logger: string().optional(),
    /**
     * The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
     */
    data: unknown()
});
/**
 * Notification of a log message passed from server to client. If no logging/setLevel request has been sent from the client, the server MAY decide which messages to send automatically.
 */
const LoggingMessageNotificationSchema = NotificationSchema.extend({
    method: literal('notifications/message'),
    params: LoggingMessageNotificationParamsSchema
});
/* Sampling */
/**
 * Hints to use for model selection.
 */
const ModelHintSchema = object({
    /**
     * A hint for a model name.
     */
    name: string().optional()
});
/**
 * The server's preferences for model selection, requested of the client during sampling.
 */
const ModelPreferencesSchema = object({
    /**
     * Optional hints to use for model selection.
     */
    hints: array(ModelHintSchema).optional(),
    /**
     * How much to prioritize cost when selecting a model.
     */
    costPriority: number().min(0).max(1).optional(),
    /**
     * How much to prioritize sampling speed (latency) when selecting a model.
     */
    speedPriority: number().min(0).max(1).optional(),
    /**
     * How much to prioritize intelligence and capabilities when selecting a model.
     */
    intelligencePriority: number().min(0).max(1).optional()
});
/**
 * Controls tool usage behavior in sampling requests.
 */
const ToolChoiceSchema = object({
    /**
     * Controls when tools are used:
     * - "auto": Model decides whether to use tools (default)
     * - "required": Model MUST use at least one tool before completing
     * - "none": Model MUST NOT use any tools
     */
    mode: _enum$1(['auto', 'required', 'none']).optional()
});
/**
 * The result of a tool execution, provided by the user (server).
 * Represents the outcome of invoking a tool requested via ToolUseContent.
 */
const ToolResultContentSchema = object({
    type: literal('tool_result'),
    toolUseId: string().describe('The unique identifier for the corresponding tool call.'),
    content: array(ContentBlockSchema).default([]),
    structuredContent: object({}).loose().optional(),
    isError: boolean().optional(),
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: record(string(), unknown()).optional()
});
/**
 * Basic content types for sampling responses (without tool use).
 * Used for backwards-compatible CreateMessageResult when tools are not used.
 */
const SamplingContentSchema = discriminatedUnion('type', [TextContentSchema, ImageContentSchema, AudioContentSchema]);
/**
 * Content block types allowed in sampling messages.
 * This includes text, image, audio, tool use requests, and tool results.
 */
const SamplingMessageContentBlockSchema = discriminatedUnion('type', [
    TextContentSchema,
    ImageContentSchema,
    AudioContentSchema,
    ToolUseContentSchema,
    ToolResultContentSchema
]);
/**
 * Describes a message issued to or received from an LLM API.
 */
const SamplingMessageSchema = object({
    role: RoleSchema,
    content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)]),
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: record(string(), unknown()).optional()
});
/**
 * Parameters for a `sampling/createMessage` request.
 */
const CreateMessageRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
    messages: array(SamplingMessageSchema),
    /**
     * The server's preferences for which model to select. The client MAY modify or omit this request.
     */
    modelPreferences: ModelPreferencesSchema.optional(),
    /**
     * An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
     */
    systemPrompt: string().optional(),
    /**
     * A request to include context from one or more MCP servers (including the caller), to be attached to the prompt.
     * The client MAY ignore this request.
     *
     * Default is "none". Values "thisServer" and "allServers" are soft-deprecated. Servers SHOULD only use these values if the client
     * declares ClientCapabilities.sampling.context. These values may be removed in future spec releases.
     */
    includeContext: _enum$1(['none', 'thisServer', 'allServers']).optional(),
    temperature: number().optional(),
    /**
     * The requested maximum number of tokens to sample (to prevent runaway completions).
     *
     * The client MAY choose to sample fewer tokens than the requested maximum.
     */
    maxTokens: number().int(),
    stopSequences: array(string()).optional(),
    /**
     * Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
     */
    metadata: AssertObjectSchema.optional(),
    /**
     * Tools that the model may use during generation.
     * The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
     */
    tools: array(ToolSchema).optional(),
    /**
     * Controls how the model uses tools.
     * The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
     * Default is `{ mode: "auto" }`.
     */
    toolChoice: ToolChoiceSchema.optional()
});
/**
 * A request from the server to sample an LLM via the client. The client has full discretion over which model to select. The client should also inform the user before beginning sampling, to allow them to inspect the request (human in the loop) and decide whether to approve it.
 */
const CreateMessageRequestSchema = RequestSchema.extend({
    method: literal('sampling/createMessage'),
    params: CreateMessageRequestParamsSchema
});
/**
 * The client's response to a sampling/create_message request from the server.
 * This is the backwards-compatible version that returns single content (no arrays).
 * Used when the request does not include tools.
 */
const CreateMessageResultSchema = ResultSchema.extend({
    /**
     * The name of the model that generated the message.
     */
    model: string(),
    /**
     * The reason why sampling stopped, if known.
     *
     * Standard values:
     * - "endTurn": Natural end of the assistant's turn
     * - "stopSequence": A stop sequence was encountered
     * - "maxTokens": Maximum token limit was reached
     *
     * This field is an open string to allow for provider-specific stop reasons.
     */
    stopReason: optional(_enum$1(['endTurn', 'stopSequence', 'maxTokens']).or(string())),
    role: RoleSchema,
    /**
     * Response content. Single content block (text, image, or audio).
     */
    content: SamplingContentSchema
});
/**
 * The client's response to a sampling/create_message request when tools were provided.
 * This version supports array content for tool use flows.
 */
const CreateMessageResultWithToolsSchema = ResultSchema.extend({
    /**
     * The name of the model that generated the message.
     */
    model: string(),
    /**
     * The reason why sampling stopped, if known.
     *
     * Standard values:
     * - "endTurn": Natural end of the assistant's turn
     * - "stopSequence": A stop sequence was encountered
     * - "maxTokens": Maximum token limit was reached
     * - "toolUse": The model wants to use one or more tools
     *
     * This field is an open string to allow for provider-specific stop reasons.
     */
    stopReason: optional(_enum$1(['endTurn', 'stopSequence', 'maxTokens', 'toolUse']).or(string())),
    role: RoleSchema,
    /**
     * Response content. May be a single block or array. May include ToolUseContent if stopReason is "toolUse".
     */
    content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)])
});
/* Elicitation */
/**
 * Primitive schema definition for boolean fields.
 */
const BooleanSchemaSchema = object({
    type: literal('boolean'),
    title: string().optional(),
    description: string().optional(),
    default: boolean().optional()
});
/**
 * Primitive schema definition for string fields.
 */
const StringSchemaSchema = object({
    type: literal('string'),
    title: string().optional(),
    description: string().optional(),
    minLength: number().optional(),
    maxLength: number().optional(),
    format: _enum$1(['email', 'uri', 'date', 'date-time']).optional(),
    default: string().optional()
});
/**
 * Primitive schema definition for number fields.
 */
const NumberSchemaSchema = object({
    type: _enum$1(['number', 'integer']),
    title: string().optional(),
    description: string().optional(),
    minimum: number().optional(),
    maximum: number().optional(),
    default: number().optional()
});
/**
 * Schema for single-selection enumeration without display titles for options.
 */
const UntitledSingleSelectEnumSchemaSchema = object({
    type: literal('string'),
    title: string().optional(),
    description: string().optional(),
    enum: array(string()),
    default: string().optional()
});
/**
 * Schema for single-selection enumeration with display titles for each option.
 */
const TitledSingleSelectEnumSchemaSchema = object({
    type: literal('string'),
    title: string().optional(),
    description: string().optional(),
    oneOf: array(object({
        const: string(),
        title: string()
    })),
    default: string().optional()
});
/**
 * Use TitledSingleSelectEnumSchema instead.
 * This interface will be removed in a future version.
 */
const LegacyTitledEnumSchemaSchema = object({
    type: literal('string'),
    title: string().optional(),
    description: string().optional(),
    enum: array(string()),
    enumNames: array(string()).optional(),
    default: string().optional()
});
// Combined single selection enumeration
const SingleSelectEnumSchemaSchema = union([UntitledSingleSelectEnumSchemaSchema, TitledSingleSelectEnumSchemaSchema]);
/**
 * Schema for multiple-selection enumeration without display titles for options.
 */
const UntitledMultiSelectEnumSchemaSchema = object({
    type: literal('array'),
    title: string().optional(),
    description: string().optional(),
    minItems: number().optional(),
    maxItems: number().optional(),
    items: object({
        type: literal('string'),
        enum: array(string())
    }),
    default: array(string()).optional()
});
/**
 * Schema for multiple-selection enumeration with display titles for each option.
 */
const TitledMultiSelectEnumSchemaSchema = object({
    type: literal('array'),
    title: string().optional(),
    description: string().optional(),
    minItems: number().optional(),
    maxItems: number().optional(),
    items: object({
        anyOf: array(object({
            const: string(),
            title: string()
        }))
    }),
    default: array(string()).optional()
});
/**
 * Combined schema for multiple-selection enumeration
 */
const MultiSelectEnumSchemaSchema = union([UntitledMultiSelectEnumSchemaSchema, TitledMultiSelectEnumSchemaSchema]);
/**
 * Primitive schema definition for enum fields.
 */
const EnumSchemaSchema = union([LegacyTitledEnumSchemaSchema, SingleSelectEnumSchemaSchema, MultiSelectEnumSchemaSchema]);
/**
 * Union of all primitive schema definitions.
 */
const PrimitiveSchemaDefinitionSchema = union([EnumSchemaSchema, BooleanSchemaSchema, StringSchemaSchema, NumberSchemaSchema]);
/**
 * Parameters for an `elicitation/create` request for form-based elicitation.
 */
const ElicitRequestFormParamsSchema = TaskAugmentedRequestParamsSchema.extend({
    /**
     * The elicitation mode.
     *
     * Optional for backward compatibility. Clients MUST treat missing mode as "form".
     */
    mode: literal('form').optional(),
    /**
     * The message to present to the user describing what information is being requested.
     */
    message: string(),
    /**
     * A restricted subset of JSON Schema.
     * Only top-level properties are allowed, without nesting.
     */
    requestedSchema: object({
        type: literal('object'),
        properties: record(string(), PrimitiveSchemaDefinitionSchema),
        required: array(string()).optional()
    })
});
/**
 * Parameters for an `elicitation/create` request for URL-based elicitation.
 */
const ElicitRequestURLParamsSchema = TaskAugmentedRequestParamsSchema.extend({
    /**
     * The elicitation mode.
     */
    mode: literal('url'),
    /**
     * The message to present to the user explaining why the interaction is needed.
     */
    message: string(),
    /**
     * The ID of the elicitation, which must be unique within the context of the server.
     * The client MUST treat this ID as an opaque value.
     */
    elicitationId: string(),
    /**
     * The URL that the user should navigate to.
     */
    url: string().url()
});
/**
 * The parameters for a request to elicit additional information from the user via the client.
 */
const ElicitRequestParamsSchema = union([ElicitRequestFormParamsSchema, ElicitRequestURLParamsSchema]);
/**
 * A request from the server to elicit user input via the client.
 * The client should present the message and form fields to the user (form mode)
 * or navigate to a URL (URL mode).
 */
const ElicitRequestSchema = RequestSchema.extend({
    method: literal('elicitation/create'),
    params: ElicitRequestParamsSchema
});
/**
 * Parameters for a `notifications/elicitation/complete` notification.
 *
 * @category notifications/elicitation/complete
 */
const ElicitationCompleteNotificationParamsSchema = NotificationsParamsSchema.extend({
    /**
     * The ID of the elicitation that completed.
     */
    elicitationId: string()
});
/**
 * A notification from the server to the client, informing it of a completion of an out-of-band elicitation request.
 *
 * @category notifications/elicitation/complete
 */
const ElicitationCompleteNotificationSchema = NotificationSchema.extend({
    method: literal('notifications/elicitation/complete'),
    params: ElicitationCompleteNotificationParamsSchema
});
/**
 * The client's response to an elicitation/create request from the server.
 */
const ElicitResultSchema = ResultSchema.extend({
    /**
     * The user action in response to the elicitation.
     * - "accept": User submitted the form/confirmed the action
     * - "decline": User explicitly decline the action
     * - "cancel": User dismissed without making an explicit choice
     */
    action: _enum$1(['accept', 'decline', 'cancel']),
    /**
     * The submitted form data, only present when action is "accept".
     * Contains values matching the requested schema.
     * Per MCP spec, content is "typically omitted" for decline/cancel actions.
     * We normalize null to undefined for leniency while maintaining type compatibility.
     */
    content: preprocess(val => (val === null ? undefined : val), record(string(), union([string(), number(), boolean(), array(string())])).optional())
});
/* Autocomplete */
/**
 * A reference to a resource or resource template definition.
 */
const ResourceTemplateReferenceSchema = object({
    type: literal('ref/resource'),
    /**
     * The URI or URI template of the resource.
     */
    uri: string()
});
/**
 * Identifies a prompt.
 */
const PromptReferenceSchema = object({
    type: literal('ref/prompt'),
    /**
     * The name of the prompt or prompt template
     */
    name: string()
});
/**
 * Parameters for a `completion/complete` request.
 */
const CompleteRequestParamsSchema = BaseRequestParamsSchema.extend({
    ref: union([PromptReferenceSchema, ResourceTemplateReferenceSchema]),
    /**
     * The argument's information
     */
    argument: object({
        /**
         * The name of the argument
         */
        name: string(),
        /**
         * The value of the argument to use for completion matching.
         */
        value: string()
    }),
    context: object({
        /**
         * Previously-resolved variables in a URI template or prompt.
         */
        arguments: record(string(), string()).optional()
    })
        .optional()
});
/**
 * A request from the client to the server, to ask for completion options.
 */
const CompleteRequestSchema = RequestSchema.extend({
    method: literal('completion/complete'),
    params: CompleteRequestParamsSchema
});
/**
 * The server's response to a completion/complete request
 */
const CompleteResultSchema = ResultSchema.extend({
    completion: looseObject({
        /**
         * An array of completion values. Must not exceed 100 items.
         */
        values: array(string()).max(100),
        /**
         * The total number of completion options available. This can exceed the number of values actually sent in the response.
         */
        total: optional(number().int()),
        /**
         * Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
         */
        hasMore: optional(boolean())
    })
});
/* Roots */
/**
 * Represents a root directory or file that the server can operate on.
 */
const RootSchema = object({
    /**
     * The URI identifying the root. This *must* start with file:// for now.
     */
    uri: string().startsWith('file://'),
    /**
     * An optional name for the root.
     */
    name: string().optional(),
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on _meta usage.
     */
    _meta: record(string(), unknown()).optional()
});
/**
 * Sent from the server to request a list of root URIs from the client.
 */
const ListRootsRequestSchema = RequestSchema.extend({
    method: literal('roots/list'),
    params: BaseRequestParamsSchema.optional()
});
/**
 * The client's response to a roots/list request from the server.
 */
const ListRootsResultSchema = ResultSchema.extend({
    roots: array(RootSchema)
});
/**
 * A notification from the client to the server, informing it that the list of roots has changed.
 */
const RootsListChangedNotificationSchema = NotificationSchema.extend({
    method: literal('notifications/roots/list_changed'),
    params: NotificationsParamsSchema.optional()
});
/* Client messages */
union([
    PingRequestSchema,
    InitializeRequestSchema,
    CompleteRequestSchema,
    SetLevelRequestSchema,
    GetPromptRequestSchema,
    ListPromptsRequestSchema,
    ListResourcesRequestSchema,
    ListResourceTemplatesRequestSchema,
    ReadResourceRequestSchema,
    SubscribeRequestSchema,
    UnsubscribeRequestSchema,
    CallToolRequestSchema,
    ListToolsRequestSchema,
    GetTaskRequestSchema,
    GetTaskPayloadRequestSchema,
    ListTasksRequestSchema,
    CancelTaskRequestSchema
]);
union([
    CancelledNotificationSchema,
    ProgressNotificationSchema,
    InitializedNotificationSchema,
    RootsListChangedNotificationSchema,
    TaskStatusNotificationSchema
]);
union([
    EmptyResultSchema,
    CreateMessageResultSchema,
    CreateMessageResultWithToolsSchema,
    ElicitResultSchema,
    ListRootsResultSchema,
    GetTaskResultSchema,
    ListTasksResultSchema,
    CreateTaskResultSchema
]);
/* Server messages */
union([
    PingRequestSchema,
    CreateMessageRequestSchema,
    ElicitRequestSchema,
    ListRootsRequestSchema,
    GetTaskRequestSchema,
    GetTaskPayloadRequestSchema,
    ListTasksRequestSchema,
    CancelTaskRequestSchema
]);
union([
    CancelledNotificationSchema,
    ProgressNotificationSchema,
    LoggingMessageNotificationSchema,
    ResourceUpdatedNotificationSchema,
    ResourceListChangedNotificationSchema,
    ToolListChangedNotificationSchema,
    PromptListChangedNotificationSchema,
    TaskStatusNotificationSchema,
    ElicitationCompleteNotificationSchema
]);
union([
    EmptyResultSchema,
    InitializeResultSchema,
    CompleteResultSchema,
    GetPromptResultSchema,
    ListPromptsResultSchema,
    ListResourcesResultSchema,
    ListResourceTemplatesResultSchema,
    ReadResourceResultSchema,
    CallToolResultSchema,
    ListToolsResultSchema,
    GetTaskResultSchema,
    ListTasksResultSchema,
    CreateTaskResultSchema
]);
class McpError extends Error {
    constructor(code, message, data) {
        super(`MCP error ${code}: ${message}`);
        this.code = code;
        this.data = data;
        this.name = 'McpError';
    }
    /**
     * Factory method to create the appropriate error type based on the error code and data
     */
    static fromError(code, message, data) {
        // Check for specific error types
        if (code === ErrorCode.UrlElicitationRequired && data) {
            const errorData = data;
            if (errorData.elicitations) {
                return new UrlElicitationRequiredError(errorData.elicitations, message);
            }
        }
        // Default to generic McpError
        return new McpError(code, message, data);
    }
}
/**
 * Specialized error type when a tool requires a URL mode elicitation.
 * This makes it nicer for the client to handle since there is specific data to work with instead of just a code to check against.
 */
class UrlElicitationRequiredError extends McpError {
    constructor(elicitations, message = `URL elicitation${elicitations.length > 1 ? 's' : ''} required`) {
        super(ErrorCode.UrlElicitationRequired, message, {
            elicitations: elicitations
        });
    }
    get elicitations() {
        return this.data?.elicitations ?? [];
    }
}

/**
 * Experimental task interfaces for MCP SDK.
 * WARNING: These APIs are experimental and may change without notice.
 */
/**
 * Checks if a task status represents a terminal state.
 * Terminal states are those where the task has finished and will not change.
 *
 * @param status - The task status to check
 * @returns True if the status is terminal (completed, failed, or cancelled)
 * @experimental
 */
function isTerminal(status) {
    return status === 'completed' || status === 'failed' || status === 'cancelled';
}

new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");

// zod-json-schema-compat.ts
// ----------------------------------------------------
// JSON Schema conversion for both Zod v3 and Zod v4 (Mini)
// v3 uses your vendored converter; v4 uses Mini's toJSONSchema
// ----------------------------------------------------
function getMethodLiteral(schema) {
    const shape = getObjectShape(schema);
    const methodSchema = shape?.method;
    if (!methodSchema) {
        throw new Error('Schema is missing a method literal');
    }
    const value = getLiteralValue(methodSchema);
    if (typeof value !== 'string') {
        throw new Error('Schema method literal must be a string');
    }
    return value;
}
function parseWithCompat(schema, data) {
    const result = safeParse$1(schema, data);
    if (!result.success) {
        throw result.error;
    }
    return result.data;
}

/**
 * The default request timeout, in miliseconds.
 */
const DEFAULT_REQUEST_TIMEOUT_MSEC = 60000;
/**
 * Implements MCP protocol framing on top of a pluggable transport, including
 * features like request/response linking, notifications, and progress.
 */
class Protocol {
    constructor(_options) {
        this._options = _options;
        this._requestMessageId = 0;
        this._requestHandlers = new Map();
        this._requestHandlerAbortControllers = new Map();
        this._notificationHandlers = new Map();
        this._responseHandlers = new Map();
        this._progressHandlers = new Map();
        this._timeoutInfo = new Map();
        this._pendingDebouncedNotifications = new Set();
        // Maps task IDs to progress tokens to keep handlers alive after CreateTaskResult
        this._taskProgressTokens = new Map();
        this._requestResolvers = new Map();
        this.setNotificationHandler(CancelledNotificationSchema, notification => {
            this._oncancel(notification);
        });
        this.setNotificationHandler(ProgressNotificationSchema, notification => {
            this._onprogress(notification);
        });
        this.setRequestHandler(PingRequestSchema, 
        // Automatic pong by default.
        _request => ({}));
        // Install task handlers if TaskStore is provided
        this._taskStore = _options?.taskStore;
        this._taskMessageQueue = _options?.taskMessageQueue;
        if (this._taskStore) {
            this.setRequestHandler(GetTaskRequestSchema, async (request, extra) => {
                const task = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
                if (!task) {
                    throw new McpError(ErrorCode.InvalidParams, 'Failed to retrieve task: Task not found');
                }
                // Per spec: tasks/get responses SHALL NOT include related-task metadata
                // as the taskId parameter is the source of truth
                // @ts-expect-error SendResultT cannot contain GetTaskResult, but we include it in our derived types everywhere else
                return {
                    ...task
                };
            });
            this.setRequestHandler(GetTaskPayloadRequestSchema, async (request, extra) => {
                const handleTaskResult = async () => {
                    const taskId = request.params.taskId;
                    // Deliver queued messages
                    if (this._taskMessageQueue) {
                        let queuedMessage;
                        while ((queuedMessage = await this._taskMessageQueue.dequeue(taskId, extra.sessionId))) {
                            // Handle response and error messages by routing them to the appropriate resolver
                            if (queuedMessage.type === 'response' || queuedMessage.type === 'error') {
                                const message = queuedMessage.message;
                                const requestId = message.id;
                                // Lookup resolver in _requestResolvers map
                                const resolver = this._requestResolvers.get(requestId);
                                if (resolver) {
                                    // Remove resolver from map after invocation
                                    this._requestResolvers.delete(requestId);
                                    // Invoke resolver with response or error
                                    if (queuedMessage.type === 'response') {
                                        resolver(message);
                                    }
                                    else {
                                        // Convert JSONRPCError to McpError
                                        const errorMessage = message;
                                        const error = new McpError(errorMessage.error.code, errorMessage.error.message, errorMessage.error.data);
                                        resolver(error);
                                    }
                                }
                                else {
                                    // Handle missing resolver gracefully with error logging
                                    const messageType = queuedMessage.type === 'response' ? 'Response' : 'Error';
                                    this._onerror(new Error(`${messageType} handler missing for request ${requestId}`));
                                }
                                // Continue to next message
                                continue;
                            }
                            // Send the message on the response stream by passing the relatedRequestId
                            // This tells the transport to write the message to the tasks/result response stream
                            await this._transport?.send(queuedMessage.message, { relatedRequestId: extra.requestId });
                        }
                    }
                    // Now check task status
                    const task = await this._taskStore.getTask(taskId, extra.sessionId);
                    if (!task) {
                        throw new McpError(ErrorCode.InvalidParams, `Task not found: ${taskId}`);
                    }
                    // Block if task is not terminal (we've already delivered all queued messages above)
                    if (!isTerminal(task.status)) {
                        // Wait for status change or new messages
                        await this._waitForTaskUpdate(taskId, extra.signal);
                        // After waking up, recursively call to deliver any new messages or result
                        return await handleTaskResult();
                    }
                    // If task is terminal, return the result
                    if (isTerminal(task.status)) {
                        const result = await this._taskStore.getTaskResult(taskId, extra.sessionId);
                        this._clearTaskQueue(taskId);
                        return {
                            ...result,
                            _meta: {
                                ...result._meta,
                                [RELATED_TASK_META_KEY]: {
                                    taskId: taskId
                                }
                            }
                        };
                    }
                    return await handleTaskResult();
                };
                return await handleTaskResult();
            });
            this.setRequestHandler(ListTasksRequestSchema, async (request, extra) => {
                try {
                    const { tasks, nextCursor } = await this._taskStore.listTasks(request.params?.cursor, extra.sessionId);
                    // @ts-expect-error SendResultT cannot contain ListTasksResult, but we include it in our derived types everywhere else
                    return {
                        tasks,
                        nextCursor,
                        _meta: {}
                    };
                }
                catch (error) {
                    throw new McpError(ErrorCode.InvalidParams, `Failed to list tasks: ${error instanceof Error ? error.message : String(error)}`);
                }
            });
            this.setRequestHandler(CancelTaskRequestSchema, async (request, extra) => {
                try {
                    // Get the current task to check if it's in a terminal state, in case the implementation is not atomic
                    const task = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
                    if (!task) {
                        throw new McpError(ErrorCode.InvalidParams, `Task not found: ${request.params.taskId}`);
                    }
                    // Reject cancellation of terminal tasks
                    if (isTerminal(task.status)) {
                        throw new McpError(ErrorCode.InvalidParams, `Cannot cancel task in terminal status: ${task.status}`);
                    }
                    await this._taskStore.updateTaskStatus(request.params.taskId, 'cancelled', 'Client cancelled task execution.', extra.sessionId);
                    this._clearTaskQueue(request.params.taskId);
                    const cancelledTask = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
                    if (!cancelledTask) {
                        // Task was deleted during cancellation (e.g., cleanup happened)
                        throw new McpError(ErrorCode.InvalidParams, `Task not found after cancellation: ${request.params.taskId}`);
                    }
                    return {
                        _meta: {},
                        ...cancelledTask
                    };
                }
                catch (error) {
                    // Re-throw McpError as-is
                    if (error instanceof McpError) {
                        throw error;
                    }
                    throw new McpError(ErrorCode.InvalidRequest, `Failed to cancel task: ${error instanceof Error ? error.message : String(error)}`);
                }
            });
        }
    }
    async _oncancel(notification) {
        if (!notification.params.requestId) {
            return;
        }
        // Handle request cancellation
        const controller = this._requestHandlerAbortControllers.get(notification.params.requestId);
        controller?.abort(notification.params.reason);
    }
    _setupTimeout(messageId, timeout, maxTotalTimeout, onTimeout, resetTimeoutOnProgress = false) {
        this._timeoutInfo.set(messageId, {
            timeoutId: setTimeout(onTimeout, timeout),
            startTime: Date.now(),
            timeout,
            maxTotalTimeout,
            resetTimeoutOnProgress,
            onTimeout
        });
    }
    _resetTimeout(messageId) {
        const info = this._timeoutInfo.get(messageId);
        if (!info)
            return false;
        const totalElapsed = Date.now() - info.startTime;
        if (info.maxTotalTimeout && totalElapsed >= info.maxTotalTimeout) {
            this._timeoutInfo.delete(messageId);
            throw McpError.fromError(ErrorCode.RequestTimeout, 'Maximum total timeout exceeded', {
                maxTotalTimeout: info.maxTotalTimeout,
                totalElapsed
            });
        }
        clearTimeout(info.timeoutId);
        info.timeoutId = setTimeout(info.onTimeout, info.timeout);
        return true;
    }
    _cleanupTimeout(messageId) {
        const info = this._timeoutInfo.get(messageId);
        if (info) {
            clearTimeout(info.timeoutId);
            this._timeoutInfo.delete(messageId);
        }
    }
    /**
     * Attaches to the given transport, starts it, and starts listening for messages.
     *
     * The Protocol object assumes ownership of the Transport, replacing any callbacks that have already been set, and expects that it is the only user of the Transport instance going forward.
     */
    async connect(transport) {
        if (this._transport) {
            throw new Error('Already connected to a transport. Call close() before connecting to a new transport, or use a separate Protocol instance per connection.');
        }
        this._transport = transport;
        const _onclose = this.transport?.onclose;
        this._transport.onclose = () => {
            _onclose?.();
            this._onclose();
        };
        const _onerror = this.transport?.onerror;
        this._transport.onerror = (error) => {
            _onerror?.(error);
            this._onerror(error);
        };
        const _onmessage = this._transport?.onmessage;
        this._transport.onmessage = (message, extra) => {
            _onmessage?.(message, extra);
            if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) {
                this._onresponse(message);
            }
            else if (isJSONRPCRequest(message)) {
                this._onrequest(message, extra);
            }
            else if (isJSONRPCNotification(message)) {
                this._onnotification(message);
            }
            else {
                this._onerror(new Error(`Unknown message type: ${JSON.stringify(message)}`));
            }
        };
        await this._transport.start();
    }
    _onclose() {
        const responseHandlers = this._responseHandlers;
        this._responseHandlers = new Map();
        this._progressHandlers.clear();
        this._taskProgressTokens.clear();
        this._pendingDebouncedNotifications.clear();
        for (const info of this._timeoutInfo.values()) {
            clearTimeout(info.timeoutId);
        }
        this._timeoutInfo.clear();
        // Abort all in-flight request handlers so they stop sending messages
        for (const controller of this._requestHandlerAbortControllers.values()) {
            controller.abort();
        }
        this._requestHandlerAbortControllers.clear();
        const error = McpError.fromError(ErrorCode.ConnectionClosed, 'Connection closed');
        this._transport = undefined;
        this.onclose?.();
        for (const handler of responseHandlers.values()) {
            handler(error);
        }
    }
    _onerror(error) {
        this.onerror?.(error);
    }
    _onnotification(notification) {
        const handler = this._notificationHandlers.get(notification.method) ?? this.fallbackNotificationHandler;
        // Ignore notifications not being subscribed to.
        if (handler === undefined) {
            return;
        }
        // Starting with Promise.resolve() puts any synchronous errors into the monad as well.
        Promise.resolve()
            .then(() => handler(notification))
            .catch(error => this._onerror(new Error(`Uncaught error in notification handler: ${error}`)));
    }
    _onrequest(request, extra) {
        const handler = this._requestHandlers.get(request.method) ?? this.fallbackRequestHandler;
        // Capture the current transport at request time to ensure responses go to the correct client
        const capturedTransport = this._transport;
        // Extract taskId from request metadata if present (needed early for method not found case)
        const relatedTaskId = request.params?._meta?.[RELATED_TASK_META_KEY]?.taskId;
        if (handler === undefined) {
            const errorResponse = {
                jsonrpc: '2.0',
                id: request.id,
                error: {
                    code: ErrorCode.MethodNotFound,
                    message: 'Method not found'
                }
            };
            // Queue or send the error response based on whether this is a task-related request
            if (relatedTaskId && this._taskMessageQueue) {
                this._enqueueTaskMessage(relatedTaskId, {
                    type: 'error',
                    message: errorResponse,
                    timestamp: Date.now()
                }, capturedTransport?.sessionId).catch(error => this._onerror(new Error(`Failed to enqueue error response: ${error}`)));
            }
            else {
                capturedTransport
                    ?.send(errorResponse)
                    .catch(error => this._onerror(new Error(`Failed to send an error response: ${error}`)));
            }
            return;
        }
        const abortController = new AbortController();
        this._requestHandlerAbortControllers.set(request.id, abortController);
        const taskCreationParams = isTaskAugmentedRequestParams(request.params) ? request.params.task : undefined;
        const taskStore = this._taskStore ? this.requestTaskStore(request, capturedTransport?.sessionId) : undefined;
        const fullExtra = {
            signal: abortController.signal,
            sessionId: capturedTransport?.sessionId,
            _meta: request.params?._meta,
            sendNotification: async (notification) => {
                if (abortController.signal.aborted)
                    return;
                // Include related-task metadata if this request is part of a task
                const notificationOptions = { relatedRequestId: request.id };
                if (relatedTaskId) {
                    notificationOptions.relatedTask = { taskId: relatedTaskId };
                }
                await this.notification(notification, notificationOptions);
            },
            sendRequest: async (r, resultSchema, options) => {
                if (abortController.signal.aborted) {
                    throw new McpError(ErrorCode.ConnectionClosed, 'Request was cancelled');
                }
                // Include related-task metadata if this request is part of a task
                const requestOptions = { ...options, relatedRequestId: request.id };
                if (relatedTaskId && !requestOptions.relatedTask) {
                    requestOptions.relatedTask = { taskId: relatedTaskId };
                }
                // Set task status to input_required when sending a request within a task context
                // Use the taskId from options (explicit) or fall back to relatedTaskId (inherited)
                const effectiveTaskId = requestOptions.relatedTask?.taskId ?? relatedTaskId;
                if (effectiveTaskId && taskStore) {
                    await taskStore.updateTaskStatus(effectiveTaskId, 'input_required');
                }
                return await this.request(r, resultSchema, requestOptions);
            },
            authInfo: extra?.authInfo,
            requestId: request.id,
            requestInfo: extra?.requestInfo,
            taskId: relatedTaskId,
            taskStore: taskStore,
            taskRequestedTtl: taskCreationParams?.ttl,
            closeSSEStream: extra?.closeSSEStream,
            closeStandaloneSSEStream: extra?.closeStandaloneSSEStream
        };
        // Starting with Promise.resolve() puts any synchronous errors into the monad as well.
        Promise.resolve()
            .then(() => {
            // If this request asked for task creation, check capability first
            if (taskCreationParams) {
                // Check if the request method supports task creation
                this.assertTaskHandlerCapability(request.method);
            }
        })
            .then(() => handler(request, fullExtra))
            .then(async (result) => {
            if (abortController.signal.aborted) {
                // Request was cancelled
                return;
            }
            const response = {
                result,
                jsonrpc: '2.0',
                id: request.id
            };
            // Queue or send the response based on whether this is a task-related request
            if (relatedTaskId && this._taskMessageQueue) {
                await this._enqueueTaskMessage(relatedTaskId, {
                    type: 'response',
                    message: response,
                    timestamp: Date.now()
                }, capturedTransport?.sessionId);
            }
            else {
                await capturedTransport?.send(response);
            }
        }, async (error) => {
            if (abortController.signal.aborted) {
                // Request was cancelled
                return;
            }
            const errorResponse = {
                jsonrpc: '2.0',
                id: request.id,
                error: {
                    code: Number.isSafeInteger(error['code']) ? error['code'] : ErrorCode.InternalError,
                    message: error.message ?? 'Internal error',
                    ...(error['data'] !== undefined && { data: error['data'] })
                }
            };
            // Queue or send the error response based on whether this is a task-related request
            if (relatedTaskId && this._taskMessageQueue) {
                await this._enqueueTaskMessage(relatedTaskId, {
                    type: 'error',
                    message: errorResponse,
                    timestamp: Date.now()
                }, capturedTransport?.sessionId);
            }
            else {
                await capturedTransport?.send(errorResponse);
            }
        })
            .catch(error => this._onerror(new Error(`Failed to send response: ${error}`)))
            .finally(() => {
            // Only delete if the stored controller is still ours; after close()+connect(),
            // a new connection may have reused the same request ID with a different controller.
            if (this._requestHandlerAbortControllers.get(request.id) === abortController) {
                this._requestHandlerAbortControllers.delete(request.id);
            }
        });
    }
    _onprogress(notification) {
        const { progressToken, ...params } = notification.params;
        const messageId = Number(progressToken);
        const handler = this._progressHandlers.get(messageId);
        if (!handler) {
            this._onerror(new Error(`Received a progress notification for an unknown token: ${JSON.stringify(notification)}`));
            return;
        }
        const responseHandler = this._responseHandlers.get(messageId);
        const timeoutInfo = this._timeoutInfo.get(messageId);
        if (timeoutInfo && responseHandler && timeoutInfo.resetTimeoutOnProgress) {
            try {
                this._resetTimeout(messageId);
            }
            catch (error) {
                // Clean up if maxTotalTimeout was exceeded
                this._responseHandlers.delete(messageId);
                this._progressHandlers.delete(messageId);
                this._cleanupTimeout(messageId);
                responseHandler(error);
                return;
            }
        }
        handler(params);
    }
    _onresponse(response) {
        const messageId = Number(response.id);
        // Check if this is a response to a queued request
        const resolver = this._requestResolvers.get(messageId);
        if (resolver) {
            this._requestResolvers.delete(messageId);
            if (isJSONRPCResultResponse(response)) {
                resolver(response);
            }
            else {
                const error = new McpError(response.error.code, response.error.message, response.error.data);
                resolver(error);
            }
            return;
        }
        const handler = this._responseHandlers.get(messageId);
        if (handler === undefined) {
            this._onerror(new Error(`Received a response for an unknown message ID: ${JSON.stringify(response)}`));
            return;
        }
        this._responseHandlers.delete(messageId);
        this._cleanupTimeout(messageId);
        // Keep progress handler alive for CreateTaskResult responses
        let isTaskResponse = false;
        if (isJSONRPCResultResponse(response) && response.result && typeof response.result === 'object') {
            const result = response.result;
            if (result.task && typeof result.task === 'object') {
                const task = result.task;
                if (typeof task.taskId === 'string') {
                    isTaskResponse = true;
                    this._taskProgressTokens.set(task.taskId, messageId);
                }
            }
        }
        if (!isTaskResponse) {
            this._progressHandlers.delete(messageId);
        }
        if (isJSONRPCResultResponse(response)) {
            handler(response);
        }
        else {
            const error = McpError.fromError(response.error.code, response.error.message, response.error.data);
            handler(error);
        }
    }
    get transport() {
        return this._transport;
    }
    /**
     * Closes the connection.
     */
    async close() {
        await this._transport?.close();
    }
    /**
     * Sends a request and returns an AsyncGenerator that yields response messages.
     * The generator is guaranteed to end with either a 'result' or 'error' message.
     *
     * @example
     * ```typescript
     * const stream = protocol.requestStream(request, resultSchema, options);
     * for await (const message of stream) {
     *   switch (message.type) {
     *     case 'taskCreated':
     *       console.log('Task created:', message.task.taskId);
     *       break;
     *     case 'taskStatus':
     *       console.log('Task status:', message.task.status);
     *       break;
     *     case 'result':
     *       console.log('Final result:', message.result);
     *       break;
     *     case 'error':
     *       console.error('Error:', message.error);
     *       break;
     *   }
     * }
     * ```
     *
     * @experimental Use `client.experimental.tasks.requestStream()` to access this method.
     */
    async *requestStream(request, resultSchema, options) {
        const { task } = options ?? {};
        // For non-task requests, just yield the result
        if (!task) {
            try {
                const result = await this.request(request, resultSchema, options);
                yield { type: 'result', result };
            }
            catch (error) {
                yield {
                    type: 'error',
                    error: error instanceof McpError ? error : new McpError(ErrorCode.InternalError, String(error))
                };
            }
            return;
        }
        // For task-augmented requests, we need to poll for status
        // First, make the request to create the task
        let taskId;
        try {
            // Send the request and get the CreateTaskResult
            const createResult = await this.request(request, CreateTaskResultSchema, options);
            // Extract taskId from the result
            if (createResult.task) {
                taskId = createResult.task.taskId;
                yield { type: 'taskCreated', task: createResult.task };
            }
            else {
                throw new McpError(ErrorCode.InternalError, 'Task creation did not return a task');
            }
            // Poll for task completion
            while (true) {
                // Get current task status
                const task = await this.getTask({ taskId }, options);
                yield { type: 'taskStatus', task };
                // Check if task is terminal
                if (isTerminal(task.status)) {
                    if (task.status === 'completed') {
                        // Get the final result
                        const result = await this.getTaskResult({ taskId }, resultSchema, options);
                        yield { type: 'result', result };
                    }
                    else if (task.status === 'failed') {
                        yield {
                            type: 'error',
                            error: new McpError(ErrorCode.InternalError, `Task ${taskId} failed`)
                        };
                    }
                    else if (task.status === 'cancelled') {
                        yield {
                            type: 'error',
                            error: new McpError(ErrorCode.InternalError, `Task ${taskId} was cancelled`)
                        };
                    }
                    return;
                }
                // When input_required, call tasks/result to deliver queued messages
                // (elicitation, sampling) via SSE and block until terminal
                if (task.status === 'input_required') {
                    const result = await this.getTaskResult({ taskId }, resultSchema, options);
                    yield { type: 'result', result };
                    return;
                }
                // Wait before polling again
                const pollInterval = task.pollInterval ?? this._options?.defaultTaskPollInterval ?? 1000;
                await new Promise(resolve => setTimeout(resolve, pollInterval));
                // Check if cancelled
                options?.signal?.throwIfAborted();
            }
        }
        catch (error) {
            yield {
                type: 'error',
                error: error instanceof McpError ? error : new McpError(ErrorCode.InternalError, String(error))
            };
        }
    }
    /**
     * Sends a request and waits for a response.
     *
     * Do not use this method to emit notifications! Use notification() instead.
     */
    request(request, resultSchema, options) {
        const { relatedRequestId, resumptionToken, onresumptiontoken, task, relatedTask } = options ?? {};
        // Send the request
        return new Promise((resolve, reject) => {
            const earlyReject = (error) => {
                reject(error);
            };
            if (!this._transport) {
                earlyReject(new Error('Not connected'));
                return;
            }
            if (this._options?.enforceStrictCapabilities === true) {
                try {
                    this.assertCapabilityForMethod(request.method);
                    // If task creation is requested, also check task capabilities
                    if (task) {
                        this.assertTaskCapability(request.method);
                    }
                }
                catch (e) {
                    earlyReject(e);
                    return;
                }
            }
            options?.signal?.throwIfAborted();
            const messageId = this._requestMessageId++;
            const jsonrpcRequest = {
                ...request,
                jsonrpc: '2.0',
                id: messageId
            };
            if (options?.onprogress) {
                this._progressHandlers.set(messageId, options.onprogress);
                jsonrpcRequest.params = {
                    ...request.params,
                    _meta: {
                        ...(request.params?._meta || {}),
                        progressToken: messageId
                    }
                };
            }
            // Augment with task creation parameters if provided
            if (task) {
                jsonrpcRequest.params = {
                    ...jsonrpcRequest.params,
                    task: task
                };
            }
            // Augment with related task metadata if relatedTask is provided
            if (relatedTask) {
                jsonrpcRequest.params = {
                    ...jsonrpcRequest.params,
                    _meta: {
                        ...(jsonrpcRequest.params?._meta || {}),
                        [RELATED_TASK_META_KEY]: relatedTask
                    }
                };
            }
            const cancel = (reason) => {
                this._responseHandlers.delete(messageId);
                this._progressHandlers.delete(messageId);
                this._cleanupTimeout(messageId);
                this._transport
                    ?.send({
                    jsonrpc: '2.0',
                    method: 'notifications/cancelled',
                    params: {
                        requestId: messageId,
                        reason: String(reason)
                    }
                }, { relatedRequestId, resumptionToken, onresumptiontoken })
                    .catch(error => this._onerror(new Error(`Failed to send cancellation: ${error}`)));
                // Wrap the reason in an McpError if it isn't already
                const error = reason instanceof McpError ? reason : new McpError(ErrorCode.RequestTimeout, String(reason));
                reject(error);
            };
            this._responseHandlers.set(messageId, response => {
                if (options?.signal?.aborted) {
                    return;
                }
                if (response instanceof Error) {
                    return reject(response);
                }
                try {
                    const parseResult = safeParse$1(resultSchema, response.result);
                    if (!parseResult.success) {
                        // Type guard: if success is false, error is guaranteed to exist
                        reject(parseResult.error);
                    }
                    else {
                        resolve(parseResult.data);
                    }
                }
                catch (error) {
                    reject(error);
                }
            });
            options?.signal?.addEventListener('abort', () => {
                cancel(options?.signal?.reason);
            });
            const timeout = options?.timeout ?? DEFAULT_REQUEST_TIMEOUT_MSEC;
            const timeoutHandler = () => cancel(McpError.fromError(ErrorCode.RequestTimeout, 'Request timed out', { timeout }));
            this._setupTimeout(messageId, timeout, options?.maxTotalTimeout, timeoutHandler, options?.resetTimeoutOnProgress ?? false);
            // Queue request if related to a task
            const relatedTaskId = relatedTask?.taskId;
            if (relatedTaskId) {
                // Store the response resolver for this request so responses can be routed back
                const responseResolver = (response) => {
                    const handler = this._responseHandlers.get(messageId);
                    if (handler) {
                        handler(response);
                    }
                    else {
                        // Log error when resolver is missing, but don't fail
                        this._onerror(new Error(`Response handler missing for side-channeled request ${messageId}`));
                    }
                };
                this._requestResolvers.set(messageId, responseResolver);
                this._enqueueTaskMessage(relatedTaskId, {
                    type: 'request',
                    message: jsonrpcRequest,
                    timestamp: Date.now()
                }).catch(error => {
                    this._cleanupTimeout(messageId);
                    reject(error);
                });
                // Don't send through transport - queued messages are delivered via tasks/result only
                // This prevents duplicate delivery for bidirectional transports
            }
            else {
                // No related task - send through transport normally
                this._transport.send(jsonrpcRequest, { relatedRequestId, resumptionToken, onresumptiontoken }).catch(error => {
                    this._cleanupTimeout(messageId);
                    reject(error);
                });
            }
        });
    }
    /**
     * Gets the current status of a task.
     *
     * @experimental Use `client.experimental.tasks.getTask()` to access this method.
     */
    async getTask(params, options) {
        // @ts-expect-error SendRequestT cannot directly contain GetTaskRequest, but we ensure all type instantiations contain it anyways
        return this.request({ method: 'tasks/get', params }, GetTaskResultSchema, options);
    }
    /**
     * Retrieves the result of a completed task.
     *
     * @experimental Use `client.experimental.tasks.getTaskResult()` to access this method.
     */
    async getTaskResult(params, resultSchema, options) {
        // @ts-expect-error SendRequestT cannot directly contain GetTaskPayloadRequest, but we ensure all type instantiations contain it anyways
        return this.request({ method: 'tasks/result', params }, resultSchema, options);
    }
    /**
     * Lists tasks, optionally starting from a pagination cursor.
     *
     * @experimental Use `client.experimental.tasks.listTasks()` to access this method.
     */
    async listTasks(params, options) {
        // @ts-expect-error SendRequestT cannot directly contain ListTasksRequest, but we ensure all type instantiations contain it anyways
        return this.request({ method: 'tasks/list', params }, ListTasksResultSchema, options);
    }
    /**
     * Cancels a specific task.
     *
     * @experimental Use `client.experimental.tasks.cancelTask()` to access this method.
     */
    async cancelTask(params, options) {
        // @ts-expect-error SendRequestT cannot directly contain CancelTaskRequest, but we ensure all type instantiations contain it anyways
        return this.request({ method: 'tasks/cancel', params }, CancelTaskResultSchema, options);
    }
    /**
     * Emits a notification, which is a one-way message that does not expect a response.
     */
    async notification(notification, options) {
        if (!this._transport) {
            throw new Error('Not connected');
        }
        this.assertNotificationCapability(notification.method);
        // Queue notification if related to a task
        const relatedTaskId = options?.relatedTask?.taskId;
        if (relatedTaskId) {
            // Build the JSONRPC notification with metadata
            const jsonrpcNotification = {
                ...notification,
                jsonrpc: '2.0',
                params: {
                    ...notification.params,
                    _meta: {
                        ...(notification.params?._meta || {}),
                        [RELATED_TASK_META_KEY]: options.relatedTask
                    }
                }
            };
            await this._enqueueTaskMessage(relatedTaskId, {
                type: 'notification',
                message: jsonrpcNotification,
                timestamp: Date.now()
            });
            // Don't send through transport - queued messages are delivered via tasks/result only
            // This prevents duplicate delivery for bidirectional transports
            return;
        }
        const debouncedMethods = this._options?.debouncedNotificationMethods ?? [];
        // A notification can only be debounced if it's in the list AND it's "simple"
        // (i.e., has no parameters and no related request ID or related task that could be lost).
        const canDebounce = debouncedMethods.includes(notification.method) && !notification.params && !options?.relatedRequestId && !options?.relatedTask;
        if (canDebounce) {
            // If a notification of this type is already scheduled, do nothing.
            if (this._pendingDebouncedNotifications.has(notification.method)) {
                return;
            }
            // Mark this notification type as pending.
            this._pendingDebouncedNotifications.add(notification.method);
            // Schedule the actual send to happen in the next microtask.
            // This allows all synchronous calls in the current event loop tick to be coalesced.
            Promise.resolve().then(() => {
                // Un-mark the notification so the next one can be scheduled.
                this._pendingDebouncedNotifications.delete(notification.method);
                // SAFETY CHECK: If the connection was closed while this was pending, abort.
                if (!this._transport) {
                    return;
                }
                let jsonrpcNotification = {
                    ...notification,
                    jsonrpc: '2.0'
                };
                // Augment with related task metadata if relatedTask is provided
                if (options?.relatedTask) {
                    jsonrpcNotification = {
                        ...jsonrpcNotification,
                        params: {
                            ...jsonrpcNotification.params,
                            _meta: {
                                ...(jsonrpcNotification.params?._meta || {}),
                                [RELATED_TASK_META_KEY]: options.relatedTask
                            }
                        }
                    };
                }
                // Send the notification, but don't await it here to avoid blocking.
                // Handle potential errors with a .catch().
                this._transport?.send(jsonrpcNotification, options).catch(error => this._onerror(error));
            });
            // Return immediately.
            return;
        }
        let jsonrpcNotification = {
            ...notification,
            jsonrpc: '2.0'
        };
        // Augment with related task metadata if relatedTask is provided
        if (options?.relatedTask) {
            jsonrpcNotification = {
                ...jsonrpcNotification,
                params: {
                    ...jsonrpcNotification.params,
                    _meta: {
                        ...(jsonrpcNotification.params?._meta || {}),
                        [RELATED_TASK_META_KEY]: options.relatedTask
                    }
                }
            };
        }
        await this._transport.send(jsonrpcNotification, options);
    }
    /**
     * Registers a handler to invoke when this protocol object receives a request with the given method.
     *
     * Note that this will replace any previous request handler for the same method.
     */
    setRequestHandler(requestSchema, handler) {
        const method = getMethodLiteral(requestSchema);
        this.assertRequestHandlerCapability(method);
        this._requestHandlers.set(method, (request, extra) => {
            const parsed = parseWithCompat(requestSchema, request);
            return Promise.resolve(handler(parsed, extra));
        });
    }
    /**
     * Removes the request handler for the given method.
     */
    removeRequestHandler(method) {
        this._requestHandlers.delete(method);
    }
    /**
     * Asserts that a request handler has not already been set for the given method, in preparation for a new one being automatically installed.
     */
    assertCanSetRequestHandler(method) {
        if (this._requestHandlers.has(method)) {
            throw new Error(`A request handler for ${method} already exists, which would be overridden`);
        }
    }
    /**
     * Registers a handler to invoke when this protocol object receives a notification with the given method.
     *
     * Note that this will replace any previous notification handler for the same method.
     */
    setNotificationHandler(notificationSchema, handler) {
        const method = getMethodLiteral(notificationSchema);
        this._notificationHandlers.set(method, notification => {
            const parsed = parseWithCompat(notificationSchema, notification);
            return Promise.resolve(handler(parsed));
        });
    }
    /**
     * Removes the notification handler for the given method.
     */
    removeNotificationHandler(method) {
        this._notificationHandlers.delete(method);
    }
    /**
     * Cleans up the progress handler associated with a task.
     * This should be called when a task reaches a terminal status.
     */
    _cleanupTaskProgressHandler(taskId) {
        const progressToken = this._taskProgressTokens.get(taskId);
        if (progressToken !== undefined) {
            this._progressHandlers.delete(progressToken);
            this._taskProgressTokens.delete(taskId);
        }
    }
    /**
     * Enqueues a task-related message for side-channel delivery via tasks/result.
     * @param taskId The task ID to associate the message with
     * @param message The message to enqueue
     * @param sessionId Optional session ID for binding the operation to a specific session
     * @throws Error if taskStore is not configured or if enqueue fails (e.g., queue overflow)
     *
     * Note: If enqueue fails, it's the TaskMessageQueue implementation's responsibility to handle
     * the error appropriately (e.g., by failing the task, logging, etc.). The Protocol layer
     * simply propagates the error.
     */
    async _enqueueTaskMessage(taskId, message, sessionId) {
        // Task message queues are only used when taskStore is configured
        if (!this._taskStore || !this._taskMessageQueue) {
            throw new Error('Cannot enqueue task message: taskStore and taskMessageQueue are not configured');
        }
        const maxQueueSize = this._options?.maxTaskQueueSize;
        await this._taskMessageQueue.enqueue(taskId, message, sessionId, maxQueueSize);
    }
    /**
     * Clears the message queue for a task and rejects any pending request resolvers.
     * @param taskId The task ID whose queue should be cleared
     * @param sessionId Optional session ID for binding the operation to a specific session
     */
    async _clearTaskQueue(taskId, sessionId) {
        if (this._taskMessageQueue) {
            // Reject any pending request resolvers
            const messages = await this._taskMessageQueue.dequeueAll(taskId, sessionId);
            for (const message of messages) {
                if (message.type === 'request' && isJSONRPCRequest(message.message)) {
                    // Extract request ID from the message
                    const requestId = message.message.id;
                    const resolver = this._requestResolvers.get(requestId);
                    if (resolver) {
                        resolver(new McpError(ErrorCode.InternalError, 'Task cancelled or completed'));
                        this._requestResolvers.delete(requestId);
                    }
                    else {
                        // Log error when resolver is missing during cleanup for better observability
                        this._onerror(new Error(`Resolver missing for request ${requestId} during task ${taskId} cleanup`));
                    }
                }
            }
        }
    }
    /**
     * Waits for a task update (new messages or status change) with abort signal support.
     * Uses polling to check for updates at the task's configured poll interval.
     * @param taskId The task ID to wait for
     * @param signal Abort signal to cancel the wait
     * @returns Promise that resolves when an update occurs or rejects if aborted
     */
    async _waitForTaskUpdate(taskId, signal) {
        // Get the task's poll interval, falling back to default
        let interval = this._options?.defaultTaskPollInterval ?? 1000;
        try {
            const task = await this._taskStore?.getTask(taskId);
            if (task?.pollInterval) {
                interval = task.pollInterval;
            }
        }
        catch {
            // Use default interval if task lookup fails
        }
        return new Promise((resolve, reject) => {
            if (signal.aborted) {
                reject(new McpError(ErrorCode.InvalidRequest, 'Request cancelled'));
                return;
            }
            // Wait for the poll interval, then resolve so caller can check for updates
            const timeoutId = setTimeout(resolve, interval);
            // Clean up timeout and reject if aborted
            signal.addEventListener('abort', () => {
                clearTimeout(timeoutId);
                reject(new McpError(ErrorCode.InvalidRequest, 'Request cancelled'));
            }, { once: true });
        });
    }
    requestTaskStore(request, sessionId) {
        const taskStore = this._taskStore;
        if (!taskStore) {
            throw new Error('No task store configured');
        }
        return {
            createTask: async (taskParams) => {
                if (!request) {
                    throw new Error('No request provided');
                }
                return await taskStore.createTask(taskParams, request.id, {
                    method: request.method,
                    params: request.params
                }, sessionId);
            },
            getTask: async (taskId) => {
                const task = await taskStore.getTask(taskId, sessionId);
                if (!task) {
                    throw new McpError(ErrorCode.InvalidParams, 'Failed to retrieve task: Task not found');
                }
                return task;
            },
            storeTaskResult: async (taskId, status, result) => {
                await taskStore.storeTaskResult(taskId, status, result, sessionId);
                // Get updated task state and send notification
                const task = await taskStore.getTask(taskId, sessionId);
                if (task) {
                    const notification = TaskStatusNotificationSchema.parse({
                        method: 'notifications/tasks/status',
                        params: task
                    });
                    await this.notification(notification);
                    if (isTerminal(task.status)) {
                        this._cleanupTaskProgressHandler(taskId);
                        // Don't clear queue here - it will be cleared after delivery via tasks/result
                    }
                }
            },
            getTaskResult: taskId => {
                return taskStore.getTaskResult(taskId, sessionId);
            },
            updateTaskStatus: async (taskId, status, statusMessage) => {
                // Check if task exists
                const task = await taskStore.getTask(taskId, sessionId);
                if (!task) {
                    throw new McpError(ErrorCode.InvalidParams, `Task "${taskId}" not found - it may have been cleaned up`);
                }
                // Don't allow transitions from terminal states
                if (isTerminal(task.status)) {
                    throw new McpError(ErrorCode.InvalidParams, `Cannot update task "${taskId}" from terminal status "${task.status}" to "${status}". Terminal states (completed, failed, cancelled) cannot transition to other states.`);
                }
                await taskStore.updateTaskStatus(taskId, status, statusMessage, sessionId);
                // Get updated task state and send notification
                const updatedTask = await taskStore.getTask(taskId, sessionId);
                if (updatedTask) {
                    const notification = TaskStatusNotificationSchema.parse({
                        method: 'notifications/tasks/status',
                        params: updatedTask
                    });
                    await this.notification(notification);
                    if (isTerminal(updatedTask.status)) {
                        this._cleanupTaskProgressHandler(taskId);
                        // Don't clear queue here - it will be cleared after delivery via tasks/result
                    }
                }
            },
            listTasks: cursor => {
                return taskStore.listTasks(cursor, sessionId);
            }
        };
    }
}
function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function mergeCapabilities(base, additional) {
    const result = { ...base };
    for (const key in additional) {
        const k = key;
        const addValue = additional[k];
        if (addValue === undefined)
            continue;
        const baseValue = result[k];
        if (isPlainObject(baseValue) && isPlainObject(addValue)) {
            result[k] = { ...baseValue, ...addValue };
        }
        else {
            result[k] = addValue;
        }
    }
    return result;
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var ajv = {exports: {}};

var core$1 = {};

var validate = {};

var boolSchema = {};

var errors = {};

var codegen = {};

var code$1 = {};

var hasRequiredCode$1;

function requireCode$1 () {
	if (hasRequiredCode$1) return code$1;
	hasRequiredCode$1 = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.regexpCode = exports$1.getEsmExportName = exports$1.getProperty = exports$1.safeStringify = exports$1.stringify = exports$1.strConcat = exports$1.addCodeArg = exports$1.str = exports$1._ = exports$1.nil = exports$1._Code = exports$1.Name = exports$1.IDENTIFIER = exports$1._CodeOrName = void 0;
		// eslint-disable-next-line @typescript-eslint/no-extraneous-class
		class _CodeOrName {
		}
		exports$1._CodeOrName = _CodeOrName;
		exports$1.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
		class Name extends _CodeOrName {
		    constructor(s) {
		        super();
		        if (!exports$1.IDENTIFIER.test(s))
		            throw new Error("CodeGen: name must be a valid identifier");
		        this.str = s;
		    }
		    toString() {
		        return this.str;
		    }
		    emptyStr() {
		        return false;
		    }
		    get names() {
		        return { [this.str]: 1 };
		    }
		}
		exports$1.Name = Name;
		class _Code extends _CodeOrName {
		    constructor(code) {
		        super();
		        this._items = typeof code === "string" ? [code] : code;
		    }
		    toString() {
		        return this.str;
		    }
		    emptyStr() {
		        if (this._items.length > 1)
		            return false;
		        const item = this._items[0];
		        return item === "" || item === '""';
		    }
		    get str() {
		        var _a;
		        return ((_a = this._str) !== null && _a !== void 0 ? _a : (this._str = this._items.reduce((s, c) => `${s}${c}`, "")));
		    }
		    get names() {
		        var _a;
		        return ((_a = this._names) !== null && _a !== void 0 ? _a : (this._names = this._items.reduce((names, c) => {
		            if (c instanceof Name)
		                names[c.str] = (names[c.str] || 0) + 1;
		            return names;
		        }, {})));
		    }
		}
		exports$1._Code = _Code;
		exports$1.nil = new _Code("");
		function _(strs, ...args) {
		    const code = [strs[0]];
		    let i = 0;
		    while (i < args.length) {
		        addCodeArg(code, args[i]);
		        code.push(strs[++i]);
		    }
		    return new _Code(code);
		}
		exports$1._ = _;
		const plus = new _Code("+");
		function str(strs, ...args) {
		    const expr = [safeStringify(strs[0])];
		    let i = 0;
		    while (i < args.length) {
		        expr.push(plus);
		        addCodeArg(expr, args[i]);
		        expr.push(plus, safeStringify(strs[++i]));
		    }
		    optimize(expr);
		    return new _Code(expr);
		}
		exports$1.str = str;
		function addCodeArg(code, arg) {
		    if (arg instanceof _Code)
		        code.push(...arg._items);
		    else if (arg instanceof Name)
		        code.push(arg);
		    else
		        code.push(interpolate(arg));
		}
		exports$1.addCodeArg = addCodeArg;
		function optimize(expr) {
		    let i = 1;
		    while (i < expr.length - 1) {
		        if (expr[i] === plus) {
		            const res = mergeExprItems(expr[i - 1], expr[i + 1]);
		            if (res !== undefined) {
		                expr.splice(i - 1, 3, res);
		                continue;
		            }
		            expr[i++] = "+";
		        }
		        i++;
		    }
		}
		function mergeExprItems(a, b) {
		    if (b === '""')
		        return a;
		    if (a === '""')
		        return b;
		    if (typeof a == "string") {
		        if (b instanceof Name || a[a.length - 1] !== '"')
		            return;
		        if (typeof b != "string")
		            return `${a.slice(0, -1)}${b}"`;
		        if (b[0] === '"')
		            return a.slice(0, -1) + b.slice(1);
		        return;
		    }
		    if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
		        return `"${a}${b.slice(1)}`;
		    return;
		}
		function strConcat(c1, c2) {
		    return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str `${c1}${c2}`;
		}
		exports$1.strConcat = strConcat;
		// TODO do not allow arrays here
		function interpolate(x) {
		    return typeof x == "number" || typeof x == "boolean" || x === null
		        ? x
		        : safeStringify(Array.isArray(x) ? x.join(",") : x);
		}
		function stringify(x) {
		    return new _Code(safeStringify(x));
		}
		exports$1.stringify = stringify;
		function safeStringify(x) {
		    return JSON.stringify(x)
		        .replace(/\u2028/g, "\\u2028")
		        .replace(/\u2029/g, "\\u2029");
		}
		exports$1.safeStringify = safeStringify;
		function getProperty(key) {
		    return typeof key == "string" && exports$1.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _ `[${key}]`;
		}
		exports$1.getProperty = getProperty;
		//Does best effort to format the name properly
		function getEsmExportName(key) {
		    if (typeof key == "string" && exports$1.IDENTIFIER.test(key)) {
		        return new _Code(`${key}`);
		    }
		    throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
		}
		exports$1.getEsmExportName = getEsmExportName;
		function regexpCode(rx) {
		    return new _Code(rx.toString());
		}
		exports$1.regexpCode = regexpCode;
		
	} (code$1));
	return code$1;
}

var scope = {};

var hasRequiredScope;

function requireScope () {
	if (hasRequiredScope) return scope;
	hasRequiredScope = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.ValueScope = exports$1.ValueScopeName = exports$1.Scope = exports$1.varKinds = exports$1.UsedValueState = void 0;
		const code_1 = /*@__PURE__*/ requireCode$1();
		class ValueError extends Error {
		    constructor(name) {
		        super(`CodeGen: "code" for ${name} not defined`);
		        this.value = name.value;
		    }
		}
		var UsedValueState;
		(function (UsedValueState) {
		    UsedValueState[UsedValueState["Started"] = 0] = "Started";
		    UsedValueState[UsedValueState["Completed"] = 1] = "Completed";
		})(UsedValueState || (exports$1.UsedValueState = UsedValueState = {}));
		exports$1.varKinds = {
		    const: new code_1.Name("const"),
		    let: new code_1.Name("let"),
		    var: new code_1.Name("var"),
		};
		class Scope {
		    constructor({ prefixes, parent } = {}) {
		        this._names = {};
		        this._prefixes = prefixes;
		        this._parent = parent;
		    }
		    toName(nameOrPrefix) {
		        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
		    }
		    name(prefix) {
		        return new code_1.Name(this._newName(prefix));
		    }
		    _newName(prefix) {
		        const ng = this._names[prefix] || this._nameGroup(prefix);
		        return `${prefix}${ng.index++}`;
		    }
		    _nameGroup(prefix) {
		        var _a, _b;
		        if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || (this._prefixes && !this._prefixes.has(prefix))) {
		            throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
		        }
		        return (this._names[prefix] = { prefix, index: 0 });
		    }
		}
		exports$1.Scope = Scope;
		class ValueScopeName extends code_1.Name {
		    constructor(prefix, nameStr) {
		        super(nameStr);
		        this.prefix = prefix;
		    }
		    setValue(value, { property, itemIndex }) {
		        this.value = value;
		        this.scopePath = (0, code_1._) `.${new code_1.Name(property)}[${itemIndex}]`;
		    }
		}
		exports$1.ValueScopeName = ValueScopeName;
		const line = (0, code_1._) `\n`;
		class ValueScope extends Scope {
		    constructor(opts) {
		        super(opts);
		        this._values = {};
		        this._scope = opts.scope;
		        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
		    }
		    get() {
		        return this._scope;
		    }
		    name(prefix) {
		        return new ValueScopeName(prefix, this._newName(prefix));
		    }
		    value(nameOrPrefix, value) {
		        var _a;
		        if (value.ref === undefined)
		            throw new Error("CodeGen: ref must be passed in value");
		        const name = this.toName(nameOrPrefix);
		        const { prefix } = name;
		        const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
		        let vs = this._values[prefix];
		        if (vs) {
		            const _name = vs.get(valueKey);
		            if (_name)
		                return _name;
		        }
		        else {
		            vs = this._values[prefix] = new Map();
		        }
		        vs.set(valueKey, name);
		        const s = this._scope[prefix] || (this._scope[prefix] = []);
		        const itemIndex = s.length;
		        s[itemIndex] = value.ref;
		        name.setValue(value, { property: prefix, itemIndex });
		        return name;
		    }
		    getValue(prefix, keyOrRef) {
		        const vs = this._values[prefix];
		        if (!vs)
		            return;
		        return vs.get(keyOrRef);
		    }
		    scopeRefs(scopeName, values = this._values) {
		        return this._reduceValues(values, (name) => {
		            if (name.scopePath === undefined)
		                throw new Error(`CodeGen: name "${name}" has no value`);
		            return (0, code_1._) `${scopeName}${name.scopePath}`;
		        });
		    }
		    scopeCode(values = this._values, usedValues, getCode) {
		        return this._reduceValues(values, (name) => {
		            if (name.value === undefined)
		                throw new Error(`CodeGen: name "${name}" has no value`);
		            return name.value.code;
		        }, usedValues, getCode);
		    }
		    _reduceValues(values, valueCode, usedValues = {}, getCode) {
		        let code = code_1.nil;
		        for (const prefix in values) {
		            const vs = values[prefix];
		            if (!vs)
		                continue;
		            const nameSet = (usedValues[prefix] = usedValues[prefix] || new Map());
		            vs.forEach((name) => {
		                if (nameSet.has(name))
		                    return;
		                nameSet.set(name, UsedValueState.Started);
		                let c = valueCode(name);
		                if (c) {
		                    const def = this.opts.es5 ? exports$1.varKinds.var : exports$1.varKinds.const;
		                    code = (0, code_1._) `${code}${def} ${name} = ${c};${this.opts._n}`;
		                }
		                else if ((c = getCode === null || getCode === void 0 ? void 0 : getCode(name))) {
		                    code = (0, code_1._) `${code}${c}${this.opts._n}`;
		                }
		                else {
		                    throw new ValueError(name);
		                }
		                nameSet.set(name, UsedValueState.Completed);
		            });
		        }
		        return code;
		    }
		}
		exports$1.ValueScope = ValueScope;
		
	} (scope));
	return scope;
}

var hasRequiredCodegen;

function requireCodegen () {
	if (hasRequiredCodegen) return codegen;
	hasRequiredCodegen = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.or = exports$1.and = exports$1.not = exports$1.CodeGen = exports$1.operators = exports$1.varKinds = exports$1.ValueScopeName = exports$1.ValueScope = exports$1.Scope = exports$1.Name = exports$1.regexpCode = exports$1.stringify = exports$1.getProperty = exports$1.nil = exports$1.strConcat = exports$1.str = exports$1._ = void 0;
		const code_1 = /*@__PURE__*/ requireCode$1();
		const scope_1 = /*@__PURE__*/ requireScope();
		var code_2 = /*@__PURE__*/ requireCode$1();
		Object.defineProperty(exports$1, "_", { enumerable: true, get: function () { return code_2._; } });
		Object.defineProperty(exports$1, "str", { enumerable: true, get: function () { return code_2.str; } });
		Object.defineProperty(exports$1, "strConcat", { enumerable: true, get: function () { return code_2.strConcat; } });
		Object.defineProperty(exports$1, "nil", { enumerable: true, get: function () { return code_2.nil; } });
		Object.defineProperty(exports$1, "getProperty", { enumerable: true, get: function () { return code_2.getProperty; } });
		Object.defineProperty(exports$1, "stringify", { enumerable: true, get: function () { return code_2.stringify; } });
		Object.defineProperty(exports$1, "regexpCode", { enumerable: true, get: function () { return code_2.regexpCode; } });
		Object.defineProperty(exports$1, "Name", { enumerable: true, get: function () { return code_2.Name; } });
		var scope_2 = /*@__PURE__*/ requireScope();
		Object.defineProperty(exports$1, "Scope", { enumerable: true, get: function () { return scope_2.Scope; } });
		Object.defineProperty(exports$1, "ValueScope", { enumerable: true, get: function () { return scope_2.ValueScope; } });
		Object.defineProperty(exports$1, "ValueScopeName", { enumerable: true, get: function () { return scope_2.ValueScopeName; } });
		Object.defineProperty(exports$1, "varKinds", { enumerable: true, get: function () { return scope_2.varKinds; } });
		exports$1.operators = {
		    GT: new code_1._Code(">"),
		    GTE: new code_1._Code(">="),
		    LT: new code_1._Code("<"),
		    LTE: new code_1._Code("<="),
		    EQ: new code_1._Code("==="),
		    NEQ: new code_1._Code("!=="),
		    NOT: new code_1._Code("!"),
		    OR: new code_1._Code("||"),
		    AND: new code_1._Code("&&"),
		    ADD: new code_1._Code("+"),
		};
		class Node {
		    optimizeNodes() {
		        return this;
		    }
		    optimizeNames(_names, _constants) {
		        return this;
		    }
		}
		class Def extends Node {
		    constructor(varKind, name, rhs) {
		        super();
		        this.varKind = varKind;
		        this.name = name;
		        this.rhs = rhs;
		    }
		    render({ es5, _n }) {
		        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
		        const rhs = this.rhs === undefined ? "" : ` = ${this.rhs}`;
		        return `${varKind} ${this.name}${rhs};` + _n;
		    }
		    optimizeNames(names, constants) {
		        if (!names[this.name.str])
		            return;
		        if (this.rhs)
		            this.rhs = optimizeExpr(this.rhs, names, constants);
		        return this;
		    }
		    get names() {
		        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
		    }
		}
		class Assign extends Node {
		    constructor(lhs, rhs, sideEffects) {
		        super();
		        this.lhs = lhs;
		        this.rhs = rhs;
		        this.sideEffects = sideEffects;
		    }
		    render({ _n }) {
		        return `${this.lhs} = ${this.rhs};` + _n;
		    }
		    optimizeNames(names, constants) {
		        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
		            return;
		        this.rhs = optimizeExpr(this.rhs, names, constants);
		        return this;
		    }
		    get names() {
		        const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
		        return addExprNames(names, this.rhs);
		    }
		}
		class AssignOp extends Assign {
		    constructor(lhs, op, rhs, sideEffects) {
		        super(lhs, rhs, sideEffects);
		        this.op = op;
		    }
		    render({ _n }) {
		        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
		    }
		}
		class Label extends Node {
		    constructor(label) {
		        super();
		        this.label = label;
		        this.names = {};
		    }
		    render({ _n }) {
		        return `${this.label}:` + _n;
		    }
		}
		class Break extends Node {
		    constructor(label) {
		        super();
		        this.label = label;
		        this.names = {};
		    }
		    render({ _n }) {
		        const label = this.label ? ` ${this.label}` : "";
		        return `break${label};` + _n;
		    }
		}
		class Throw extends Node {
		    constructor(error) {
		        super();
		        this.error = error;
		    }
		    render({ _n }) {
		        return `throw ${this.error};` + _n;
		    }
		    get names() {
		        return this.error.names;
		    }
		}
		class AnyCode extends Node {
		    constructor(code) {
		        super();
		        this.code = code;
		    }
		    render({ _n }) {
		        return `${this.code};` + _n;
		    }
		    optimizeNodes() {
		        return `${this.code}` ? this : undefined;
		    }
		    optimizeNames(names, constants) {
		        this.code = optimizeExpr(this.code, names, constants);
		        return this;
		    }
		    get names() {
		        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
		    }
		}
		class ParentNode extends Node {
		    constructor(nodes = []) {
		        super();
		        this.nodes = nodes;
		    }
		    render(opts) {
		        return this.nodes.reduce((code, n) => code + n.render(opts), "");
		    }
		    optimizeNodes() {
		        const { nodes } = this;
		        let i = nodes.length;
		        while (i--) {
		            const n = nodes[i].optimizeNodes();
		            if (Array.isArray(n))
		                nodes.splice(i, 1, ...n);
		            else if (n)
		                nodes[i] = n;
		            else
		                nodes.splice(i, 1);
		        }
		        return nodes.length > 0 ? this : undefined;
		    }
		    optimizeNames(names, constants) {
		        const { nodes } = this;
		        let i = nodes.length;
		        while (i--) {
		            // iterating backwards improves 1-pass optimization
		            const n = nodes[i];
		            if (n.optimizeNames(names, constants))
		                continue;
		            subtractNames(names, n.names);
		            nodes.splice(i, 1);
		        }
		        return nodes.length > 0 ? this : undefined;
		    }
		    get names() {
		        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
		    }
		}
		class BlockNode extends ParentNode {
		    render(opts) {
		        return "{" + opts._n + super.render(opts) + "}" + opts._n;
		    }
		}
		class Root extends ParentNode {
		}
		class Else extends BlockNode {
		}
		Else.kind = "else";
		class If extends BlockNode {
		    constructor(condition, nodes) {
		        super(nodes);
		        this.condition = condition;
		    }
		    render(opts) {
		        let code = `if(${this.condition})` + super.render(opts);
		        if (this.else)
		            code += "else " + this.else.render(opts);
		        return code;
		    }
		    optimizeNodes() {
		        super.optimizeNodes();
		        const cond = this.condition;
		        if (cond === true)
		            return this.nodes; // else is ignored here
		        let e = this.else;
		        if (e) {
		            const ns = e.optimizeNodes();
		            e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
		        }
		        if (e) {
		            if (cond === false)
		                return e instanceof If ? e : e.nodes;
		            if (this.nodes.length)
		                return this;
		            return new If(not(cond), e instanceof If ? [e] : e.nodes);
		        }
		        if (cond === false || !this.nodes.length)
		            return undefined;
		        return this;
		    }
		    optimizeNames(names, constants) {
		        var _a;
		        this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
		        if (!(super.optimizeNames(names, constants) || this.else))
		            return;
		        this.condition = optimizeExpr(this.condition, names, constants);
		        return this;
		    }
		    get names() {
		        const names = super.names;
		        addExprNames(names, this.condition);
		        if (this.else)
		            addNames(names, this.else.names);
		        return names;
		    }
		}
		If.kind = "if";
		class For extends BlockNode {
		}
		For.kind = "for";
		class ForLoop extends For {
		    constructor(iteration) {
		        super();
		        this.iteration = iteration;
		    }
		    render(opts) {
		        return `for(${this.iteration})` + super.render(opts);
		    }
		    optimizeNames(names, constants) {
		        if (!super.optimizeNames(names, constants))
		            return;
		        this.iteration = optimizeExpr(this.iteration, names, constants);
		        return this;
		    }
		    get names() {
		        return addNames(super.names, this.iteration.names);
		    }
		}
		class ForRange extends For {
		    constructor(varKind, name, from, to) {
		        super();
		        this.varKind = varKind;
		        this.name = name;
		        this.from = from;
		        this.to = to;
		    }
		    render(opts) {
		        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
		        const { name, from, to } = this;
		        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
		    }
		    get names() {
		        const names = addExprNames(super.names, this.from);
		        return addExprNames(names, this.to);
		    }
		}
		class ForIter extends For {
		    constructor(loop, varKind, name, iterable) {
		        super();
		        this.loop = loop;
		        this.varKind = varKind;
		        this.name = name;
		        this.iterable = iterable;
		    }
		    render(opts) {
		        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
		    }
		    optimizeNames(names, constants) {
		        if (!super.optimizeNames(names, constants))
		            return;
		        this.iterable = optimizeExpr(this.iterable, names, constants);
		        return this;
		    }
		    get names() {
		        return addNames(super.names, this.iterable.names);
		    }
		}
		class Func extends BlockNode {
		    constructor(name, args, async) {
		        super();
		        this.name = name;
		        this.args = args;
		        this.async = async;
		    }
		    render(opts) {
		        const _async = this.async ? "async " : "";
		        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
		    }
		}
		Func.kind = "func";
		class Return extends ParentNode {
		    render(opts) {
		        return "return " + super.render(opts);
		    }
		}
		Return.kind = "return";
		class Try extends BlockNode {
		    render(opts) {
		        let code = "try" + super.render(opts);
		        if (this.catch)
		            code += this.catch.render(opts);
		        if (this.finally)
		            code += this.finally.render(opts);
		        return code;
		    }
		    optimizeNodes() {
		        var _a, _b;
		        super.optimizeNodes();
		        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNodes();
		        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
		        return this;
		    }
		    optimizeNames(names, constants) {
		        var _a, _b;
		        super.optimizeNames(names, constants);
		        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
		        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
		        return this;
		    }
		    get names() {
		        const names = super.names;
		        if (this.catch)
		            addNames(names, this.catch.names);
		        if (this.finally)
		            addNames(names, this.finally.names);
		        return names;
		    }
		}
		class Catch extends BlockNode {
		    constructor(error) {
		        super();
		        this.error = error;
		    }
		    render(opts) {
		        return `catch(${this.error})` + super.render(opts);
		    }
		}
		Catch.kind = "catch";
		class Finally extends BlockNode {
		    render(opts) {
		        return "finally" + super.render(opts);
		    }
		}
		Finally.kind = "finally";
		class CodeGen {
		    constructor(extScope, opts = {}) {
		        this._values = {};
		        this._blockStarts = [];
		        this._constants = {};
		        this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
		        this._extScope = extScope;
		        this._scope = new scope_1.Scope({ parent: extScope });
		        this._nodes = [new Root()];
		    }
		    toString() {
		        return this._root.render(this.opts);
		    }
		    // returns unique name in the internal scope
		    name(prefix) {
		        return this._scope.name(prefix);
		    }
		    // reserves unique name in the external scope
		    scopeName(prefix) {
		        return this._extScope.name(prefix);
		    }
		    // reserves unique name in the external scope and assigns value to it
		    scopeValue(prefixOrName, value) {
		        const name = this._extScope.value(prefixOrName, value);
		        const vs = this._values[name.prefix] || (this._values[name.prefix] = new Set());
		        vs.add(name);
		        return name;
		    }
		    getScopeValue(prefix, keyOrRef) {
		        return this._extScope.getValue(prefix, keyOrRef);
		    }
		    // return code that assigns values in the external scope to the names that are used internally
		    // (same names that were returned by gen.scopeName or gen.scopeValue)
		    scopeRefs(scopeName) {
		        return this._extScope.scopeRefs(scopeName, this._values);
		    }
		    scopeCode() {
		        return this._extScope.scopeCode(this._values);
		    }
		    _def(varKind, nameOrPrefix, rhs, constant) {
		        const name = this._scope.toName(nameOrPrefix);
		        if (rhs !== undefined && constant)
		            this._constants[name.str] = rhs;
		        this._leafNode(new Def(varKind, name, rhs));
		        return name;
		    }
		    // `const` declaration (`var` in es5 mode)
		    const(nameOrPrefix, rhs, _constant) {
		        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
		    }
		    // `let` declaration with optional assignment (`var` in es5 mode)
		    let(nameOrPrefix, rhs, _constant) {
		        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
		    }
		    // `var` declaration with optional assignment
		    var(nameOrPrefix, rhs, _constant) {
		        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
		    }
		    // assignment code
		    assign(lhs, rhs, sideEffects) {
		        return this._leafNode(new Assign(lhs, rhs, sideEffects));
		    }
		    // `+=` code
		    add(lhs, rhs) {
		        return this._leafNode(new AssignOp(lhs, exports$1.operators.ADD, rhs));
		    }
		    // appends passed SafeExpr to code or executes Block
		    code(c) {
		        if (typeof c == "function")
		            c();
		        else if (c !== code_1.nil)
		            this._leafNode(new AnyCode(c));
		        return this;
		    }
		    // returns code for object literal for the passed argument list of key-value pairs
		    object(...keyValues) {
		        const code = ["{"];
		        for (const [key, value] of keyValues) {
		            if (code.length > 1)
		                code.push(",");
		            code.push(key);
		            if (key !== value || this.opts.es5) {
		                code.push(":");
		                (0, code_1.addCodeArg)(code, value);
		            }
		        }
		        code.push("}");
		        return new code_1._Code(code);
		    }
		    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
		    if(condition, thenBody, elseBody) {
		        this._blockNode(new If(condition));
		        if (thenBody && elseBody) {
		            this.code(thenBody).else().code(elseBody).endIf();
		        }
		        else if (thenBody) {
		            this.code(thenBody).endIf();
		        }
		        else if (elseBody) {
		            throw new Error('CodeGen: "else" body without "then" body');
		        }
		        return this;
		    }
		    // `else if` clause - invalid without `if` or after `else` clauses
		    elseIf(condition) {
		        return this._elseNode(new If(condition));
		    }
		    // `else` clause - only valid after `if` or `else if` clauses
		    else() {
		        return this._elseNode(new Else());
		    }
		    // end `if` statement (needed if gen.if was used only with condition)
		    endIf() {
		        return this._endBlockNode(If, Else);
		    }
		    _for(node, forBody) {
		        this._blockNode(node);
		        if (forBody)
		            this.code(forBody).endFor();
		        return this;
		    }
		    // a generic `for` clause (or statement if `forBody` is passed)
		    for(iteration, forBody) {
		        return this._for(new ForLoop(iteration), forBody);
		    }
		    // `for` statement for a range of values
		    forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
		        const name = this._scope.toName(nameOrPrefix);
		        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
		    }
		    // `for-of` statement (in es5 mode replace with a normal for loop)
		    forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
		        const name = this._scope.toName(nameOrPrefix);
		        if (this.opts.es5) {
		            const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
		            return this.forRange("_i", 0, (0, code_1._) `${arr}.length`, (i) => {
		                this.var(name, (0, code_1._) `${arr}[${i}]`);
		                forBody(name);
		            });
		        }
		        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
		    }
		    // `for-in` statement.
		    // With option `ownProperties` replaced with a `for-of` loop for object keys
		    forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
		        if (this.opts.ownProperties) {
		            return this.forOf(nameOrPrefix, (0, code_1._) `Object.keys(${obj})`, forBody);
		        }
		        const name = this._scope.toName(nameOrPrefix);
		        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
		    }
		    // end `for` loop
		    endFor() {
		        return this._endBlockNode(For);
		    }
		    // `label` statement
		    label(label) {
		        return this._leafNode(new Label(label));
		    }
		    // `break` statement
		    break(label) {
		        return this._leafNode(new Break(label));
		    }
		    // `return` statement
		    return(value) {
		        const node = new Return();
		        this._blockNode(node);
		        this.code(value);
		        if (node.nodes.length !== 1)
		            throw new Error('CodeGen: "return" should have one node');
		        return this._endBlockNode(Return);
		    }
		    // `try` statement
		    try(tryBody, catchCode, finallyCode) {
		        if (!catchCode && !finallyCode)
		            throw new Error('CodeGen: "try" without "catch" and "finally"');
		        const node = new Try();
		        this._blockNode(node);
		        this.code(tryBody);
		        if (catchCode) {
		            const error = this.name("e");
		            this._currNode = node.catch = new Catch(error);
		            catchCode(error);
		        }
		        if (finallyCode) {
		            this._currNode = node.finally = new Finally();
		            this.code(finallyCode);
		        }
		        return this._endBlockNode(Catch, Finally);
		    }
		    // `throw` statement
		    throw(error) {
		        return this._leafNode(new Throw(error));
		    }
		    // start self-balancing block
		    block(body, nodeCount) {
		        this._blockStarts.push(this._nodes.length);
		        if (body)
		            this.code(body).endBlock(nodeCount);
		        return this;
		    }
		    // end the current self-balancing block
		    endBlock(nodeCount) {
		        const len = this._blockStarts.pop();
		        if (len === undefined)
		            throw new Error("CodeGen: not in self-balancing block");
		        const toClose = this._nodes.length - len;
		        if (toClose < 0 || (nodeCount !== undefined && toClose !== nodeCount)) {
		            throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
		        }
		        this._nodes.length = len;
		        return this;
		    }
		    // `function` heading (or definition if funcBody is passed)
		    func(name, args = code_1.nil, async, funcBody) {
		        this._blockNode(new Func(name, args, async));
		        if (funcBody)
		            this.code(funcBody).endFunc();
		        return this;
		    }
		    // end function definition
		    endFunc() {
		        return this._endBlockNode(Func);
		    }
		    optimize(n = 1) {
		        while (n-- > 0) {
		            this._root.optimizeNodes();
		            this._root.optimizeNames(this._root.names, this._constants);
		        }
		    }
		    _leafNode(node) {
		        this._currNode.nodes.push(node);
		        return this;
		    }
		    _blockNode(node) {
		        this._currNode.nodes.push(node);
		        this._nodes.push(node);
		    }
		    _endBlockNode(N1, N2) {
		        const n = this._currNode;
		        if (n instanceof N1 || (N2 && n instanceof N2)) {
		            this._nodes.pop();
		            return this;
		        }
		        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
		    }
		    _elseNode(node) {
		        const n = this._currNode;
		        if (!(n instanceof If)) {
		            throw new Error('CodeGen: "else" without "if"');
		        }
		        this._currNode = n.else = node;
		        return this;
		    }
		    get _root() {
		        return this._nodes[0];
		    }
		    get _currNode() {
		        const ns = this._nodes;
		        return ns[ns.length - 1];
		    }
		    set _currNode(node) {
		        const ns = this._nodes;
		        ns[ns.length - 1] = node;
		    }
		}
		exports$1.CodeGen = CodeGen;
		function addNames(names, from) {
		    for (const n in from)
		        names[n] = (names[n] || 0) + (from[n] || 0);
		    return names;
		}
		function addExprNames(names, from) {
		    return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
		}
		function optimizeExpr(expr, names, constants) {
		    if (expr instanceof code_1.Name)
		        return replaceName(expr);
		    if (!canOptimize(expr))
		        return expr;
		    return new code_1._Code(expr._items.reduce((items, c) => {
		        if (c instanceof code_1.Name)
		            c = replaceName(c);
		        if (c instanceof code_1._Code)
		            items.push(...c._items);
		        else
		            items.push(c);
		        return items;
		    }, []));
		    function replaceName(n) {
		        const c = constants[n.str];
		        if (c === undefined || names[n.str] !== 1)
		            return n;
		        delete names[n.str];
		        return c;
		    }
		    function canOptimize(e) {
		        return (e instanceof code_1._Code &&
		            e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== undefined));
		    }
		}
		function subtractNames(names, from) {
		    for (const n in from)
		        names[n] = (names[n] || 0) - (from[n] || 0);
		}
		function not(x) {
		    return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._) `!${par(x)}`;
		}
		exports$1.not = not;
		const andCode = mappend(exports$1.operators.AND);
		// boolean AND (&&) expression with the passed arguments
		function and(...args) {
		    return args.reduce(andCode);
		}
		exports$1.and = and;
		const orCode = mappend(exports$1.operators.OR);
		// boolean OR (||) expression with the passed arguments
		function or(...args) {
		    return args.reduce(orCode);
		}
		exports$1.or = or;
		function mappend(op) {
		    return (x, y) => (x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._) `${par(x)} ${op} ${par(y)}`);
		}
		function par(x) {
		    return x instanceof code_1.Name ? x : (0, code_1._) `(${x})`;
		}
		
	} (codegen));
	return codegen;
}

var util = {};

var hasRequiredUtil;

function requireUtil () {
	if (hasRequiredUtil) return util;
	hasRequiredUtil = 1;
	Object.defineProperty(util, "__esModule", { value: true });
	util.checkStrictMode = util.getErrorPath = util.Type = util.useFunc = util.setEvaluated = util.evaluatedPropsToName = util.mergeEvaluated = util.eachItem = util.unescapeJsonPointer = util.escapeJsonPointer = util.escapeFragment = util.unescapeFragment = util.schemaRefOrVal = util.schemaHasRulesButRef = util.schemaHasRules = util.checkUnknownRules = util.alwaysValidSchema = util.toHash = void 0;
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const code_1 = /*@__PURE__*/ requireCode$1();
	// TODO refactor to use Set
	function toHash(arr) {
	    const hash = {};
	    for (const item of arr)
	        hash[item] = true;
	    return hash;
	}
	util.toHash = toHash;
	function alwaysValidSchema(it, schema) {
	    if (typeof schema == "boolean")
	        return schema;
	    if (Object.keys(schema).length === 0)
	        return true;
	    checkUnknownRules(it, schema);
	    return !schemaHasRules(schema, it.self.RULES.all);
	}
	util.alwaysValidSchema = alwaysValidSchema;
	function checkUnknownRules(it, schema = it.schema) {
	    const { opts, self } = it;
	    if (!opts.strictSchema)
	        return;
	    if (typeof schema === "boolean")
	        return;
	    const rules = self.RULES.keywords;
	    for (const key in schema) {
	        if (!rules[key])
	            checkStrictMode(it, `unknown keyword: "${key}"`);
	    }
	}
	util.checkUnknownRules = checkUnknownRules;
	function schemaHasRules(schema, rules) {
	    if (typeof schema == "boolean")
	        return !schema;
	    for (const key in schema)
	        if (rules[key])
	            return true;
	    return false;
	}
	util.schemaHasRules = schemaHasRules;
	function schemaHasRulesButRef(schema, RULES) {
	    if (typeof schema == "boolean")
	        return !schema;
	    for (const key in schema)
	        if (key !== "$ref" && RULES.all[key])
	            return true;
	    return false;
	}
	util.schemaHasRulesButRef = schemaHasRulesButRef;
	function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
	    if (!$data) {
	        if (typeof schema == "number" || typeof schema == "boolean")
	            return schema;
	        if (typeof schema == "string")
	            return (0, codegen_1._) `${schema}`;
	    }
	    return (0, codegen_1._) `${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
	}
	util.schemaRefOrVal = schemaRefOrVal;
	function unescapeFragment(str) {
	    return unescapeJsonPointer(decodeURIComponent(str));
	}
	util.unescapeFragment = unescapeFragment;
	function escapeFragment(str) {
	    return encodeURIComponent(escapeJsonPointer(str));
	}
	util.escapeFragment = escapeFragment;
	function escapeJsonPointer(str) {
	    if (typeof str == "number")
	        return `${str}`;
	    return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
	util.escapeJsonPointer = escapeJsonPointer;
	function unescapeJsonPointer(str) {
	    return str.replace(/~1/g, "/").replace(/~0/g, "~");
	}
	util.unescapeJsonPointer = unescapeJsonPointer;
	function eachItem(xs, f) {
	    if (Array.isArray(xs)) {
	        for (const x of xs)
	            f(x);
	    }
	    else {
	        f(xs);
	    }
	}
	util.eachItem = eachItem;
	function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName, }) {
	    return (gen, from, to, toName) => {
	        const res = to === undefined
	            ? from
	            : to instanceof codegen_1.Name
	                ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to)
	                : from instanceof codegen_1.Name
	                    ? (mergeToName(gen, to, from), from)
	                    : mergeValues(from, to);
	        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
	    };
	}
	util.mergeEvaluated = {
	    props: makeMergeEvaluated({
	        mergeNames: (gen, from, to) => gen.if((0, codegen_1._) `${to} !== true && ${from} !== undefined`, () => {
	            gen.if((0, codegen_1._) `${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._) `${to} || {}`).code((0, codegen_1._) `Object.assign(${to}, ${from})`));
	        }),
	        mergeToName: (gen, from, to) => gen.if((0, codegen_1._) `${to} !== true`, () => {
	            if (from === true) {
	                gen.assign(to, true);
	            }
	            else {
	                gen.assign(to, (0, codegen_1._) `${to} || {}`);
	                setEvaluated(gen, to, from);
	            }
	        }),
	        mergeValues: (from, to) => (from === true ? true : { ...from, ...to }),
	        resultToName: evaluatedPropsToName,
	    }),
	    items: makeMergeEvaluated({
	        mergeNames: (gen, from, to) => gen.if((0, codegen_1._) `${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._) `${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
	        mergeToName: (gen, from, to) => gen.if((0, codegen_1._) `${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._) `${to} > ${from} ? ${to} : ${from}`)),
	        mergeValues: (from, to) => (from === true ? true : Math.max(from, to)),
	        resultToName: (gen, items) => gen.var("items", items),
	    }),
	};
	function evaluatedPropsToName(gen, ps) {
	    if (ps === true)
	        return gen.var("props", true);
	    const props = gen.var("props", (0, codegen_1._) `{}`);
	    if (ps !== undefined)
	        setEvaluated(gen, props, ps);
	    return props;
	}
	util.evaluatedPropsToName = evaluatedPropsToName;
	function setEvaluated(gen, props, ps) {
	    Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._) `${props}${(0, codegen_1.getProperty)(p)}`, true));
	}
	util.setEvaluated = setEvaluated;
	const snippets = {};
	function useFunc(gen, f) {
	    return gen.scopeValue("func", {
	        ref: f,
	        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code)),
	    });
	}
	util.useFunc = useFunc;
	var Type;
	(function (Type) {
	    Type[Type["Num"] = 0] = "Num";
	    Type[Type["Str"] = 1] = "Str";
	})(Type || (util.Type = Type = {}));
	function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
	    // let path
	    if (dataProp instanceof codegen_1.Name) {
	        const isNumber = dataPropType === Type.Num;
	        return jsPropertySyntax
	            ? isNumber
	                ? (0, codegen_1._) `"[" + ${dataProp} + "]"`
	                : (0, codegen_1._) `"['" + ${dataProp} + "']"`
	            : isNumber
	                ? (0, codegen_1._) `"/" + ${dataProp}`
	                : (0, codegen_1._) `"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`; // TODO maybe use global escapePointer
	    }
	    return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
	}
	util.getErrorPath = getErrorPath;
	function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
	    if (!mode)
	        return;
	    msg = `strict mode: ${msg}`;
	    if (mode === true)
	        throw new Error(msg);
	    it.self.logger.warn(msg);
	}
	util.checkStrictMode = checkStrictMode;
	
	return util;
}

var names = {};

var hasRequiredNames;

function requireNames () {
	if (hasRequiredNames) return names;
	hasRequiredNames = 1;
	Object.defineProperty(names, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const names$1 = {
	    // validation function arguments
	    data: new codegen_1.Name("data"), // data passed to validation function
	    // args passed from referencing schema
	    valCxt: new codegen_1.Name("valCxt"), // validation/data context - should not be used directly, it is destructured to the names below
	    instancePath: new codegen_1.Name("instancePath"),
	    parentData: new codegen_1.Name("parentData"),
	    parentDataProperty: new codegen_1.Name("parentDataProperty"),
	    rootData: new codegen_1.Name("rootData"), // root data - same as the data passed to the first/top validation function
	    dynamicAnchors: new codegen_1.Name("dynamicAnchors"), // used to support recursiveRef and dynamicRef
	    // function scoped variables
	    vErrors: new codegen_1.Name("vErrors"), // null or array of validation errors
	    errors: new codegen_1.Name("errors"), // counter of validation errors
	    this: new codegen_1.Name("this"),
	    // "globals"
	    self: new codegen_1.Name("self"),
	    scope: new codegen_1.Name("scope"),
	    // JTD serialize/parse name for JSON string and position
	    json: new codegen_1.Name("json"),
	    jsonPos: new codegen_1.Name("jsonPos"),
	    jsonLen: new codegen_1.Name("jsonLen"),
	    jsonPart: new codegen_1.Name("jsonPart"),
	};
	names.default = names$1;
	
	return names;
}

var hasRequiredErrors;

function requireErrors () {
	if (hasRequiredErrors) return errors;
	hasRequiredErrors = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.extendErrors = exports$1.resetErrorsCount = exports$1.reportExtraError = exports$1.reportError = exports$1.keyword$DataError = exports$1.keywordError = void 0;
		const codegen_1 = /*@__PURE__*/ requireCodegen();
		const util_1 = /*@__PURE__*/ requireUtil();
		const names_1 = /*@__PURE__*/ requireNames();
		exports$1.keywordError = {
		    message: ({ keyword }) => (0, codegen_1.str) `must pass "${keyword}" keyword validation`,
		};
		exports$1.keyword$DataError = {
		    message: ({ keyword, schemaType }) => schemaType
		        ? (0, codegen_1.str) `"${keyword}" keyword must be ${schemaType} ($data)`
		        : (0, codegen_1.str) `"${keyword}" keyword is invalid ($data)`,
		};
		function reportError(cxt, error = exports$1.keywordError, errorPaths, overrideAllErrors) {
		    const { it } = cxt;
		    const { gen, compositeRule, allErrors } = it;
		    const errObj = errorObjectCode(cxt, error, errorPaths);
		    if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : (compositeRule || allErrors)) {
		        addError(gen, errObj);
		    }
		    else {
		        returnErrors(it, (0, codegen_1._) `[${errObj}]`);
		    }
		}
		exports$1.reportError = reportError;
		function reportExtraError(cxt, error = exports$1.keywordError, errorPaths) {
		    const { it } = cxt;
		    const { gen, compositeRule, allErrors } = it;
		    const errObj = errorObjectCode(cxt, error, errorPaths);
		    addError(gen, errObj);
		    if (!(compositeRule || allErrors)) {
		        returnErrors(it, names_1.default.vErrors);
		    }
		}
		exports$1.reportExtraError = reportExtraError;
		function resetErrorsCount(gen, errsCount) {
		    gen.assign(names_1.default.errors, errsCount);
		    gen.if((0, codegen_1._) `${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._) `${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
		}
		exports$1.resetErrorsCount = resetErrorsCount;
		function extendErrors({ gen, keyword, schemaValue, data, errsCount, it, }) {
		    /* istanbul ignore if */
		    if (errsCount === undefined)
		        throw new Error("ajv implementation error");
		    const err = gen.name("err");
		    gen.forRange("i", errsCount, names_1.default.errors, (i) => {
		        gen.const(err, (0, codegen_1._) `${names_1.default.vErrors}[${i}]`);
		        gen.if((0, codegen_1._) `${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._) `${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
		        gen.assign((0, codegen_1._) `${err}.schemaPath`, (0, codegen_1.str) `${it.errSchemaPath}/${keyword}`);
		        if (it.opts.verbose) {
		            gen.assign((0, codegen_1._) `${err}.schema`, schemaValue);
		            gen.assign((0, codegen_1._) `${err}.data`, data);
		        }
		    });
		}
		exports$1.extendErrors = extendErrors;
		function addError(gen, errObj) {
		    const err = gen.const("err", errObj);
		    gen.if((0, codegen_1._) `${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._) `[${err}]`), (0, codegen_1._) `${names_1.default.vErrors}.push(${err})`);
		    gen.code((0, codegen_1._) `${names_1.default.errors}++`);
		}
		function returnErrors(it, errs) {
		    const { gen, validateName, schemaEnv } = it;
		    if (schemaEnv.$async) {
		        gen.throw((0, codegen_1._) `new ${it.ValidationError}(${errs})`);
		    }
		    else {
		        gen.assign((0, codegen_1._) `${validateName}.errors`, errs);
		        gen.return(false);
		    }
		}
		const E = {
		    keyword: new codegen_1.Name("keyword"),
		    schemaPath: new codegen_1.Name("schemaPath"), // also used in JTD errors
		    params: new codegen_1.Name("params"),
		    propertyName: new codegen_1.Name("propertyName"),
		    message: new codegen_1.Name("message"),
		    schema: new codegen_1.Name("schema"),
		    parentSchema: new codegen_1.Name("parentSchema"),
		};
		function errorObjectCode(cxt, error, errorPaths) {
		    const { createErrors } = cxt.it;
		    if (createErrors === false)
		        return (0, codegen_1._) `{}`;
		    return errorObject(cxt, error, errorPaths);
		}
		function errorObject(cxt, error, errorPaths = {}) {
		    const { gen, it } = cxt;
		    const keyValues = [
		        errorInstancePath(it, errorPaths),
		        errorSchemaPath(cxt, errorPaths),
		    ];
		    extraErrorProps(cxt, error, keyValues);
		    return gen.object(...keyValues);
		}
		function errorInstancePath({ errorPath }, { instancePath }) {
		    const instPath = instancePath
		        ? (0, codegen_1.str) `${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}`
		        : errorPath;
		    return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
		}
		function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
		    let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str) `${errSchemaPath}/${keyword}`;
		    if (schemaPath) {
		        schPath = (0, codegen_1.str) `${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
		    }
		    return [E.schemaPath, schPath];
		}
		function extraErrorProps(cxt, { params, message }, keyValues) {
		    const { keyword, data, schemaValue, it } = cxt;
		    const { opts, propertyName, topSchemaRef, schemaPath } = it;
		    keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._) `{}`]);
		    if (opts.messages) {
		        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
		    }
		    if (opts.verbose) {
		        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._) `${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
		    }
		    if (propertyName)
		        keyValues.push([E.propertyName, propertyName]);
		}
		
	} (errors));
	return errors;
}

var hasRequiredBoolSchema;

function requireBoolSchema () {
	if (hasRequiredBoolSchema) return boolSchema;
	hasRequiredBoolSchema = 1;
	Object.defineProperty(boolSchema, "__esModule", { value: true });
	boolSchema.boolOrEmptySchema = boolSchema.topBoolOrEmptySchema = void 0;
	const errors_1 = /*@__PURE__*/ requireErrors();
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const names_1 = /*@__PURE__*/ requireNames();
	const boolError = {
	    message: "boolean schema is false",
	};
	function topBoolOrEmptySchema(it) {
	    const { gen, schema, validateName } = it;
	    if (schema === false) {
	        falseSchemaError(it, false);
	    }
	    else if (typeof schema == "object" && schema.$async === true) {
	        gen.return(names_1.default.data);
	    }
	    else {
	        gen.assign((0, codegen_1._) `${validateName}.errors`, null);
	        gen.return(true);
	    }
	}
	boolSchema.topBoolOrEmptySchema = topBoolOrEmptySchema;
	function boolOrEmptySchema(it, valid) {
	    const { gen, schema } = it;
	    if (schema === false) {
	        gen.var(valid, false); // TODO var
	        falseSchemaError(it);
	    }
	    else {
	        gen.var(valid, true); // TODO var
	    }
	}
	boolSchema.boolOrEmptySchema = boolOrEmptySchema;
	function falseSchemaError(it, overrideAllErrors) {
	    const { gen, data } = it;
	    // TODO maybe some other interface should be used for non-keyword validation errors...
	    const cxt = {
	        gen,
	        keyword: "false schema",
	        data,
	        schema: false,
	        schemaCode: false,
	        schemaValue: false,
	        params: {},
	        it,
	    };
	    (0, errors_1.reportError)(cxt, boolError, undefined, overrideAllErrors);
	}
	
	return boolSchema;
}

var dataType = {};

var rules = {};

var hasRequiredRules;

function requireRules () {
	if (hasRequiredRules) return rules;
	hasRequiredRules = 1;
	Object.defineProperty(rules, "__esModule", { value: true });
	rules.getRules = rules.isJSONType = void 0;
	const _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
	const jsonTypes = new Set(_jsonTypes);
	function isJSONType(x) {
	    return typeof x == "string" && jsonTypes.has(x);
	}
	rules.isJSONType = isJSONType;
	function getRules() {
	    const groups = {
	        number: { type: "number", rules: [] },
	        string: { type: "string", rules: [] },
	        array: { type: "array", rules: [] },
	        object: { type: "object", rules: [] },
	    };
	    return {
	        types: { ...groups, integer: true, boolean: true, null: true },
	        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
	        post: { rules: [] },
	        all: {},
	        keywords: {},
	    };
	}
	rules.getRules = getRules;
	
	return rules;
}

var applicability = {};

var hasRequiredApplicability;

function requireApplicability () {
	if (hasRequiredApplicability) return applicability;
	hasRequiredApplicability = 1;
	Object.defineProperty(applicability, "__esModule", { value: true });
	applicability.shouldUseRule = applicability.shouldUseGroup = applicability.schemaHasRulesForType = void 0;
	function schemaHasRulesForType({ schema, self }, type) {
	    const group = self.RULES.types[type];
	    return group && group !== true && shouldUseGroup(schema, group);
	}
	applicability.schemaHasRulesForType = schemaHasRulesForType;
	function shouldUseGroup(schema, group) {
	    return group.rules.some((rule) => shouldUseRule(schema, rule));
	}
	applicability.shouldUseGroup = shouldUseGroup;
	function shouldUseRule(schema, rule) {
	    var _a;
	    return (schema[rule.keyword] !== undefined ||
	        ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== undefined)));
	}
	applicability.shouldUseRule = shouldUseRule;
	
	return applicability;
}

var hasRequiredDataType;

function requireDataType () {
	if (hasRequiredDataType) return dataType;
	hasRequiredDataType = 1;
	Object.defineProperty(dataType, "__esModule", { value: true });
	dataType.reportTypeError = dataType.checkDataTypes = dataType.checkDataType = dataType.coerceAndCheckDataType = dataType.getJSONTypes = dataType.getSchemaTypes = dataType.DataType = void 0;
	const rules_1 = /*@__PURE__*/ requireRules();
	const applicability_1 = /*@__PURE__*/ requireApplicability();
	const errors_1 = /*@__PURE__*/ requireErrors();
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	var DataType;
	(function (DataType) {
	    DataType[DataType["Correct"] = 0] = "Correct";
	    DataType[DataType["Wrong"] = 1] = "Wrong";
	})(DataType || (dataType.DataType = DataType = {}));
	function getSchemaTypes(schema) {
	    const types = getJSONTypes(schema.type);
	    const hasNull = types.includes("null");
	    if (hasNull) {
	        if (schema.nullable === false)
	            throw new Error("type: null contradicts nullable: false");
	    }
	    else {
	        if (!types.length && schema.nullable !== undefined) {
	            throw new Error('"nullable" cannot be used without "type"');
	        }
	        if (schema.nullable === true)
	            types.push("null");
	    }
	    return types;
	}
	dataType.getSchemaTypes = getSchemaTypes;
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	function getJSONTypes(ts) {
	    const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
	    if (types.every(rules_1.isJSONType))
	        return types;
	    throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
	}
	dataType.getJSONTypes = getJSONTypes;
	function coerceAndCheckDataType(it, types) {
	    const { gen, data, opts } = it;
	    const coerceTo = coerceToTypes(types, opts.coerceTypes);
	    const checkTypes = types.length > 0 &&
	        !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
	    if (checkTypes) {
	        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
	        gen.if(wrongType, () => {
	            if (coerceTo.length)
	                coerceData(it, types, coerceTo);
	            else
	                reportTypeError(it);
	        });
	    }
	    return checkTypes;
	}
	dataType.coerceAndCheckDataType = coerceAndCheckDataType;
	const COERCIBLE = new Set(["string", "number", "integer", "boolean", "null"]);
	function coerceToTypes(types, coerceTypes) {
	    return coerceTypes
	        ? types.filter((t) => COERCIBLE.has(t) || (coerceTypes === "array" && t === "array"))
	        : [];
	}
	function coerceData(it, types, coerceTo) {
	    const { gen, data, opts } = it;
	    const dataType = gen.let("dataType", (0, codegen_1._) `typeof ${data}`);
	    const coerced = gen.let("coerced", (0, codegen_1._) `undefined`);
	    if (opts.coerceTypes === "array") {
	        gen.if((0, codegen_1._) `${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen
	            .assign(data, (0, codegen_1._) `${data}[0]`)
	            .assign(dataType, (0, codegen_1._) `typeof ${data}`)
	            .if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
	    }
	    gen.if((0, codegen_1._) `${coerced} !== undefined`);
	    for (const t of coerceTo) {
	        if (COERCIBLE.has(t) || (t === "array" && opts.coerceTypes === "array")) {
	            coerceSpecificType(t);
	        }
	    }
	    gen.else();
	    reportTypeError(it);
	    gen.endIf();
	    gen.if((0, codegen_1._) `${coerced} !== undefined`, () => {
	        gen.assign(data, coerced);
	        assignParentData(it, coerced);
	    });
	    function coerceSpecificType(t) {
	        switch (t) {
	            case "string":
	                gen
	                    .elseIf((0, codegen_1._) `${dataType} == "number" || ${dataType} == "boolean"`)
	                    .assign(coerced, (0, codegen_1._) `"" + ${data}`)
	                    .elseIf((0, codegen_1._) `${data} === null`)
	                    .assign(coerced, (0, codegen_1._) `""`);
	                return;
	            case "number":
	                gen
	                    .elseIf((0, codegen_1._) `${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`)
	                    .assign(coerced, (0, codegen_1._) `+${data}`);
	                return;
	            case "integer":
	                gen
	                    .elseIf((0, codegen_1._) `${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`)
	                    .assign(coerced, (0, codegen_1._) `+${data}`);
	                return;
	            case "boolean":
	                gen
	                    .elseIf((0, codegen_1._) `${data} === "false" || ${data} === 0 || ${data} === null`)
	                    .assign(coerced, false)
	                    .elseIf((0, codegen_1._) `${data} === "true" || ${data} === 1`)
	                    .assign(coerced, true);
	                return;
	            case "null":
	                gen.elseIf((0, codegen_1._) `${data} === "" || ${data} === 0 || ${data} === false`);
	                gen.assign(coerced, null);
	                return;
	            case "array":
	                gen
	                    .elseIf((0, codegen_1._) `${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`)
	                    .assign(coerced, (0, codegen_1._) `[${data}]`);
	        }
	    }
	}
	function assignParentData({ gen, parentData, parentDataProperty }, expr) {
	    // TODO use gen.property
	    gen.if((0, codegen_1._) `${parentData} !== undefined`, () => gen.assign((0, codegen_1._) `${parentData}[${parentDataProperty}]`, expr));
	}
	function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
	    const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
	    let cond;
	    switch (dataType) {
	        case "null":
	            return (0, codegen_1._) `${data} ${EQ} null`;
	        case "array":
	            cond = (0, codegen_1._) `Array.isArray(${data})`;
	            break;
	        case "object":
	            cond = (0, codegen_1._) `${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
	            break;
	        case "integer":
	            cond = numCond((0, codegen_1._) `!(${data} % 1) && !isNaN(${data})`);
	            break;
	        case "number":
	            cond = numCond();
	            break;
	        default:
	            return (0, codegen_1._) `typeof ${data} ${EQ} ${dataType}`;
	    }
	    return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
	    function numCond(_cond = codegen_1.nil) {
	        return (0, codegen_1.and)((0, codegen_1._) `typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._) `isFinite(${data})` : codegen_1.nil);
	    }
	}
	dataType.checkDataType = checkDataType;
	function checkDataTypes(dataTypes, data, strictNums, correct) {
	    if (dataTypes.length === 1) {
	        return checkDataType(dataTypes[0], data, strictNums, correct);
	    }
	    let cond;
	    const types = (0, util_1.toHash)(dataTypes);
	    if (types.array && types.object) {
	        const notObj = (0, codegen_1._) `typeof ${data} != "object"`;
	        cond = types.null ? notObj : (0, codegen_1._) `!${data} || ${notObj}`;
	        delete types.null;
	        delete types.array;
	        delete types.object;
	    }
	    else {
	        cond = codegen_1.nil;
	    }
	    if (types.number)
	        delete types.integer;
	    for (const t in types)
	        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
	    return cond;
	}
	dataType.checkDataTypes = checkDataTypes;
	const typeError = {
	    message: ({ schema }) => `must be ${schema}`,
	    params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._) `{type: ${schema}}` : (0, codegen_1._) `{type: ${schemaValue}}`,
	};
	function reportTypeError(it) {
	    const cxt = getTypeErrorContext(it);
	    (0, errors_1.reportError)(cxt, typeError);
	}
	dataType.reportTypeError = reportTypeError;
	function getTypeErrorContext(it) {
	    const { gen, data, schema } = it;
	    const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
	    return {
	        gen,
	        keyword: "type",
	        data,
	        schema: schema.type,
	        schemaCode,
	        schemaValue: schemaCode,
	        parentSchema: schema,
	        params: {},
	        it,
	    };
	}
	
	return dataType;
}

var defaults = {};

var hasRequiredDefaults;

function requireDefaults () {
	if (hasRequiredDefaults) return defaults;
	hasRequiredDefaults = 1;
	Object.defineProperty(defaults, "__esModule", { value: true });
	defaults.assignDefaults = void 0;
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	function assignDefaults(it, ty) {
	    const { properties, items } = it.schema;
	    if (ty === "object" && properties) {
	        for (const key in properties) {
	            assignDefault(it, key, properties[key].default);
	        }
	    }
	    else if (ty === "array" && Array.isArray(items)) {
	        items.forEach((sch, i) => assignDefault(it, i, sch.default));
	    }
	}
	defaults.assignDefaults = assignDefaults;
	function assignDefault(it, prop, defaultValue) {
	    const { gen, compositeRule, data, opts } = it;
	    if (defaultValue === undefined)
	        return;
	    const childData = (0, codegen_1._) `${data}${(0, codegen_1.getProperty)(prop)}`;
	    if (compositeRule) {
	        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
	        return;
	    }
	    let condition = (0, codegen_1._) `${childData} === undefined`;
	    if (opts.useDefaults === "empty") {
	        condition = (0, codegen_1._) `${condition} || ${childData} === null || ${childData} === ""`;
	    }
	    // `${childData} === undefined` +
	    // (opts.useDefaults === "empty" ? ` || ${childData} === null || ${childData} === ""` : "")
	    gen.if(condition, (0, codegen_1._) `${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
	}
	
	return defaults;
}

var keyword = {};

var code = {};

var hasRequiredCode;

function requireCode () {
	if (hasRequiredCode) return code;
	hasRequiredCode = 1;
	Object.defineProperty(code, "__esModule", { value: true });
	code.validateUnion = code.validateArray = code.usePattern = code.callValidateCode = code.schemaProperties = code.allSchemaProperties = code.noPropertyInData = code.propertyInData = code.isOwnProperty = code.hasPropFunc = code.reportMissingProp = code.checkMissingProp = code.checkReportMissingProp = void 0;
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	const names_1 = /*@__PURE__*/ requireNames();
	const util_2 = /*@__PURE__*/ requireUtil();
	function checkReportMissingProp(cxt, prop) {
	    const { gen, data, it } = cxt;
	    gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
	        cxt.setParams({ missingProperty: (0, codegen_1._) `${prop}` }, true);
	        cxt.error();
	    });
	}
	code.checkReportMissingProp = checkReportMissingProp;
	function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
	    return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._) `${missing} = ${prop}`)));
	}
	code.checkMissingProp = checkMissingProp;
	function reportMissingProp(cxt, missing) {
	    cxt.setParams({ missingProperty: missing }, true);
	    cxt.error();
	}
	code.reportMissingProp = reportMissingProp;
	function hasPropFunc(gen) {
	    return gen.scopeValue("func", {
	        // eslint-disable-next-line @typescript-eslint/unbound-method
	        ref: Object.prototype.hasOwnProperty,
	        code: (0, codegen_1._) `Object.prototype.hasOwnProperty`,
	    });
	}
	code.hasPropFunc = hasPropFunc;
	function isOwnProperty(gen, data, property) {
	    return (0, codegen_1._) `${hasPropFunc(gen)}.call(${data}, ${property})`;
	}
	code.isOwnProperty = isOwnProperty;
	function propertyInData(gen, data, property, ownProperties) {
	    const cond = (0, codegen_1._) `${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
	    return ownProperties ? (0, codegen_1._) `${cond} && ${isOwnProperty(gen, data, property)}` : cond;
	}
	code.propertyInData = propertyInData;
	function noPropertyInData(gen, data, property, ownProperties) {
	    const cond = (0, codegen_1._) `${data}${(0, codegen_1.getProperty)(property)} === undefined`;
	    return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
	}
	code.noPropertyInData = noPropertyInData;
	function allSchemaProperties(schemaMap) {
	    return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
	}
	code.allSchemaProperties = allSchemaProperties;
	function schemaProperties(it, schemaMap) {
	    return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
	}
	code.schemaProperties = schemaProperties;
	function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
	    const dataAndSchema = passSchema ? (0, codegen_1._) `${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
	    const valCxt = [
	        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
	        [names_1.default.parentData, it.parentData],
	        [names_1.default.parentDataProperty, it.parentDataProperty],
	        [names_1.default.rootData, names_1.default.rootData],
	    ];
	    if (it.opts.dynamicRef)
	        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
	    const args = (0, codegen_1._) `${dataAndSchema}, ${gen.object(...valCxt)}`;
	    return context !== codegen_1.nil ? (0, codegen_1._) `${func}.call(${context}, ${args})` : (0, codegen_1._) `${func}(${args})`;
	}
	code.callValidateCode = callValidateCode;
	const newRegExp = (0, codegen_1._) `new RegExp`;
	function usePattern({ gen, it: { opts } }, pattern) {
	    const u = opts.unicodeRegExp ? "u" : "";
	    const { regExp } = opts.code;
	    const rx = regExp(pattern, u);
	    return gen.scopeValue("pattern", {
	        key: rx.toString(),
	        ref: rx,
	        code: (0, codegen_1._) `${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`,
	    });
	}
	code.usePattern = usePattern;
	function validateArray(cxt) {
	    const { gen, data, keyword, it } = cxt;
	    const valid = gen.name("valid");
	    if (it.allErrors) {
	        const validArr = gen.let("valid", true);
	        validateItems(() => gen.assign(validArr, false));
	        return validArr;
	    }
	    gen.var(valid, true);
	    validateItems(() => gen.break());
	    return valid;
	    function validateItems(notValid) {
	        const len = gen.const("len", (0, codegen_1._) `${data}.length`);
	        gen.forRange("i", 0, len, (i) => {
	            cxt.subschema({
	                keyword,
	                dataProp: i,
	                dataPropType: util_1.Type.Num,
	            }, valid);
	            gen.if((0, codegen_1.not)(valid), notValid);
	        });
	    }
	}
	code.validateArray = validateArray;
	function validateUnion(cxt) {
	    const { gen, schema, keyword, it } = cxt;
	    /* istanbul ignore if */
	    if (!Array.isArray(schema))
	        throw new Error("ajv implementation error");
	    const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
	    if (alwaysValid && !it.opts.unevaluated)
	        return;
	    const valid = gen.let("valid", false);
	    const schValid = gen.name("_valid");
	    gen.block(() => schema.forEach((_sch, i) => {
	        const schCxt = cxt.subschema({
	            keyword,
	            schemaProp: i,
	            compositeRule: true,
	        }, schValid);
	        gen.assign(valid, (0, codegen_1._) `${valid} || ${schValid}`);
	        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
	        // can short-circuit if `unevaluatedProperties/Items` not supported (opts.unevaluated !== true)
	        // or if all properties and items were evaluated (it.props === true && it.items === true)
	        if (!merged)
	            gen.if((0, codegen_1.not)(valid));
	    }));
	    cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
	}
	code.validateUnion = validateUnion;
	
	return code;
}

var hasRequiredKeyword;

function requireKeyword () {
	if (hasRequiredKeyword) return keyword;
	hasRequiredKeyword = 1;
	Object.defineProperty(keyword, "__esModule", { value: true });
	keyword.validateKeywordUsage = keyword.validSchemaType = keyword.funcKeywordCode = keyword.macroKeywordCode = void 0;
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const names_1 = /*@__PURE__*/ requireNames();
	const code_1 = /*@__PURE__*/ requireCode();
	const errors_1 = /*@__PURE__*/ requireErrors();
	function macroKeywordCode(cxt, def) {
	    const { gen, keyword, schema, parentSchema, it } = cxt;
	    const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
	    const schemaRef = useKeyword(gen, keyword, macroSchema);
	    if (it.opts.validateSchema !== false)
	        it.self.validateSchema(macroSchema, true);
	    const valid = gen.name("valid");
	    cxt.subschema({
	        schema: macroSchema,
	        schemaPath: codegen_1.nil,
	        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
	        topSchemaRef: schemaRef,
	        compositeRule: true,
	    }, valid);
	    cxt.pass(valid, () => cxt.error(true));
	}
	keyword.macroKeywordCode = macroKeywordCode;
	function funcKeywordCode(cxt, def) {
	    var _a;
	    const { gen, keyword, schema, parentSchema, $data, it } = cxt;
	    checkAsyncKeyword(it, def);
	    const validate = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
	    const validateRef = useKeyword(gen, keyword, validate);
	    const valid = gen.let("valid");
	    cxt.block$data(valid, validateKeyword);
	    cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
	    function validateKeyword() {
	        if (def.errors === false) {
	            assignValid();
	            if (def.modifying)
	                modifyData(cxt);
	            reportErrs(() => cxt.error());
	        }
	        else {
	            const ruleErrs = def.async ? validateAsync() : validateSync();
	            if (def.modifying)
	                modifyData(cxt);
	            reportErrs(() => addErrs(cxt, ruleErrs));
	        }
	    }
	    function validateAsync() {
	        const ruleErrs = gen.let("ruleErrs", null);
	        gen.try(() => assignValid((0, codegen_1._) `await `), (e) => gen.assign(valid, false).if((0, codegen_1._) `${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._) `${e}.errors`), () => gen.throw(e)));
	        return ruleErrs;
	    }
	    function validateSync() {
	        const validateErrs = (0, codegen_1._) `${validateRef}.errors`;
	        gen.assign(validateErrs, null);
	        assignValid(codegen_1.nil);
	        return validateErrs;
	    }
	    function assignValid(_await = def.async ? (0, codegen_1._) `await ` : codegen_1.nil) {
	        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
	        const passSchema = !(("compile" in def && !$data) || def.schema === false);
	        gen.assign(valid, (0, codegen_1._) `${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
	    }
	    function reportErrs(errors) {
	        var _a;
	        gen.if((0, codegen_1.not)((_a = def.valid) !== null && _a !== void 0 ? _a : valid), errors);
	    }
	}
	keyword.funcKeywordCode = funcKeywordCode;
	function modifyData(cxt) {
	    const { gen, data, it } = cxt;
	    gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._) `${it.parentData}[${it.parentDataProperty}]`));
	}
	function addErrs(cxt, errs) {
	    const { gen } = cxt;
	    gen.if((0, codegen_1._) `Array.isArray(${errs})`, () => {
	        gen
	            .assign(names_1.default.vErrors, (0, codegen_1._) `${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`)
	            .assign(names_1.default.errors, (0, codegen_1._) `${names_1.default.vErrors}.length`);
	        (0, errors_1.extendErrors)(cxt);
	    }, () => cxt.error());
	}
	function checkAsyncKeyword({ schemaEnv }, def) {
	    if (def.async && !schemaEnv.$async)
	        throw new Error("async keyword in sync schema");
	}
	function useKeyword(gen, keyword, result) {
	    if (result === undefined)
	        throw new Error(`keyword "${keyword}" failed to compile`);
	    return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
	}
	function validSchemaType(schema, schemaType, allowUndefined = false) {
	    // TODO add tests
	    return (!schemaType.length ||
	        schemaType.some((st) => st === "array"
	            ? Array.isArray(schema)
	            : st === "object"
	                ? schema && typeof schema == "object" && !Array.isArray(schema)
	                : typeof schema == st || (allowUndefined && typeof schema == "undefined")));
	}
	keyword.validSchemaType = validSchemaType;
	function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
	    /* istanbul ignore if */
	    if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
	        throw new Error("ajv implementation error");
	    }
	    const deps = def.dependencies;
	    if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
	        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
	    }
	    if (def.validateSchema) {
	        const valid = def.validateSchema(schema[keyword]);
	        if (!valid) {
	            const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` +
	                self.errorsText(def.validateSchema.errors);
	            if (opts.validateSchema === "log")
	                self.logger.error(msg);
	            else
	                throw new Error(msg);
	        }
	    }
	}
	keyword.validateKeywordUsage = validateKeywordUsage;
	
	return keyword;
}

var subschema = {};

var hasRequiredSubschema;

function requireSubschema () {
	if (hasRequiredSubschema) return subschema;
	hasRequiredSubschema = 1;
	Object.defineProperty(subschema, "__esModule", { value: true });
	subschema.extendSubschemaMode = subschema.extendSubschemaData = subschema.getSubschema = void 0;
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
	    if (keyword !== undefined && schema !== undefined) {
	        throw new Error('both "keyword" and "schema" passed, only one allowed');
	    }
	    if (keyword !== undefined) {
	        const sch = it.schema[keyword];
	        return schemaProp === undefined
	            ? {
	                schema: sch,
	                schemaPath: (0, codegen_1._) `${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
	                errSchemaPath: `${it.errSchemaPath}/${keyword}`,
	            }
	            : {
	                schema: sch[schemaProp],
	                schemaPath: (0, codegen_1._) `${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
	                errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`,
	            };
	    }
	    if (schema !== undefined) {
	        if (schemaPath === undefined || errSchemaPath === undefined || topSchemaRef === undefined) {
	            throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
	        }
	        return {
	            schema,
	            schemaPath,
	            topSchemaRef,
	            errSchemaPath,
	        };
	    }
	    throw new Error('either "keyword" or "schema" must be passed');
	}
	subschema.getSubschema = getSubschema;
	function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
	    if (data !== undefined && dataProp !== undefined) {
	        throw new Error('both "data" and "dataProp" passed, only one allowed');
	    }
	    const { gen } = it;
	    if (dataProp !== undefined) {
	        const { errorPath, dataPathArr, opts } = it;
	        const nextData = gen.let("data", (0, codegen_1._) `${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
	        dataContextProps(nextData);
	        subschema.errorPath = (0, codegen_1.str) `${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
	        subschema.parentDataProperty = (0, codegen_1._) `${dataProp}`;
	        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
	    }
	    if (data !== undefined) {
	        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true); // replaceable if used once?
	        dataContextProps(nextData);
	        if (propertyName !== undefined)
	            subschema.propertyName = propertyName;
	        // TODO something is possibly wrong here with not changing parentDataProperty and not appending dataPathArr
	    }
	    if (dataTypes)
	        subschema.dataTypes = dataTypes;
	    function dataContextProps(_nextData) {
	        subschema.data = _nextData;
	        subschema.dataLevel = it.dataLevel + 1;
	        subschema.dataTypes = [];
	        it.definedProperties = new Set();
	        subschema.parentData = it.data;
	        subschema.dataNames = [...it.dataNames, _nextData];
	    }
	}
	subschema.extendSubschemaData = extendSubschemaData;
	function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
	    if (compositeRule !== undefined)
	        subschema.compositeRule = compositeRule;
	    if (createErrors !== undefined)
	        subschema.createErrors = createErrors;
	    if (allErrors !== undefined)
	        subschema.allErrors = allErrors;
	    subschema.jtdDiscriminator = jtdDiscriminator; // not inherited
	    subschema.jtdMetadata = jtdMetadata; // not inherited
	}
	subschema.extendSubschemaMode = extendSubschemaMode;
	
	return subschema;
}

var resolve = {};

var fastDeepEqual;
var hasRequiredFastDeepEqual;

function requireFastDeepEqual () {
	if (hasRequiredFastDeepEqual) return fastDeepEqual;
	hasRequiredFastDeepEqual = 1;

	// do not edit .js files directly - edit src/index.jst



	fastDeepEqual = function equal(a, b) {
	  if (a === b) return true;

	  if (a && b && typeof a == 'object' && typeof b == 'object') {
	    if (a.constructor !== b.constructor) return false;

	    var length, i, keys;
	    if (Array.isArray(a)) {
	      length = a.length;
	      if (length != b.length) return false;
	      for (i = length; i-- !== 0;)
	        if (!equal(a[i], b[i])) return false;
	      return true;
	    }



	    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
	    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
	    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

	    keys = Object.keys(a);
	    length = keys.length;
	    if (length !== Object.keys(b).length) return false;

	    for (i = length; i-- !== 0;)
	      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

	    for (i = length; i-- !== 0;) {
	      var key = keys[i];

	      if (!equal(a[key], b[key])) return false;
	    }

	    return true;
	  }

	  // true if both NaN, false otherwise
	  return a!==a && b!==b;
	};
	return fastDeepEqual;
}

var jsonSchemaTraverse = {exports: {}};

var hasRequiredJsonSchemaTraverse;

function requireJsonSchemaTraverse () {
	if (hasRequiredJsonSchemaTraverse) return jsonSchemaTraverse.exports;
	hasRequiredJsonSchemaTraverse = 1;

	var traverse = jsonSchemaTraverse.exports = function (schema, opts, cb) {
	  // Legacy support for v0.3.1 and earlier.
	  if (typeof opts == 'function') {
	    cb = opts;
	    opts = {};
	  }

	  cb = opts.cb || cb;
	  var pre = (typeof cb == 'function') ? cb : cb.pre || function() {};
	  var post = cb.post || function() {};

	  _traverse(opts, pre, post, schema, '', schema);
	};


	traverse.keywords = {
	  additionalItems: true,
	  items: true,
	  contains: true,
	  additionalProperties: true,
	  propertyNames: true,
	  not: true,
	  if: true,
	  then: true,
	  else: true
	};

	traverse.arrayKeywords = {
	  items: true,
	  allOf: true,
	  anyOf: true,
	  oneOf: true
	};

	traverse.propsKeywords = {
	  $defs: true,
	  definitions: true,
	  properties: true,
	  patternProperties: true,
	  dependencies: true
	};

	traverse.skipKeywords = {
	  default: true,
	  enum: true,
	  const: true,
	  required: true,
	  maximum: true,
	  minimum: true,
	  exclusiveMaximum: true,
	  exclusiveMinimum: true,
	  multipleOf: true,
	  maxLength: true,
	  minLength: true,
	  pattern: true,
	  format: true,
	  maxItems: true,
	  minItems: true,
	  uniqueItems: true,
	  maxProperties: true,
	  minProperties: true
	};


	function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
	  if (schema && typeof schema == 'object' && !Array.isArray(schema)) {
	    pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
	    for (var key in schema) {
	      var sch = schema[key];
	      if (Array.isArray(sch)) {
	        if (key in traverse.arrayKeywords) {
	          for (var i=0; i<sch.length; i++)
	            _traverse(opts, pre, post, sch[i], jsonPtr + '/' + key + '/' + i, rootSchema, jsonPtr, key, schema, i);
	        }
	      } else if (key in traverse.propsKeywords) {
	        if (sch && typeof sch == 'object') {
	          for (var prop in sch)
	            _traverse(opts, pre, post, sch[prop], jsonPtr + '/' + key + '/' + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
	        }
	      } else if (key in traverse.keywords || (opts.allKeys && !(key in traverse.skipKeywords))) {
	        _traverse(opts, pre, post, sch, jsonPtr + '/' + key, rootSchema, jsonPtr, key, schema);
	      }
	    }
	    post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
	  }
	}


	function escapeJsonPtr(str) {
	  return str.replace(/~/g, '~0').replace(/\//g, '~1');
	}
	return jsonSchemaTraverse.exports;
}

var hasRequiredResolve;

function requireResolve () {
	if (hasRequiredResolve) return resolve;
	hasRequiredResolve = 1;
	Object.defineProperty(resolve, "__esModule", { value: true });
	resolve.getSchemaRefs = resolve.resolveUrl = resolve.normalizeId = resolve._getFullPath = resolve.getFullPath = resolve.inlineRef = void 0;
	const util_1 = /*@__PURE__*/ requireUtil();
	const equal = requireFastDeepEqual();
	const traverse = requireJsonSchemaTraverse();
	// TODO refactor to use keyword definitions
	const SIMPLE_INLINED = new Set([
	    "type",
	    "format",
	    "pattern",
	    "maxLength",
	    "minLength",
	    "maxProperties",
	    "minProperties",
	    "maxItems",
	    "minItems",
	    "maximum",
	    "minimum",
	    "uniqueItems",
	    "multipleOf",
	    "required",
	    "enum",
	    "const",
	]);
	function inlineRef(schema, limit = true) {
	    if (typeof schema == "boolean")
	        return true;
	    if (limit === true)
	        return !hasRef(schema);
	    if (!limit)
	        return false;
	    return countKeys(schema) <= limit;
	}
	resolve.inlineRef = inlineRef;
	const REF_KEYWORDS = new Set([
	    "$ref",
	    "$recursiveRef",
	    "$recursiveAnchor",
	    "$dynamicRef",
	    "$dynamicAnchor",
	]);
	function hasRef(schema) {
	    for (const key in schema) {
	        if (REF_KEYWORDS.has(key))
	            return true;
	        const sch = schema[key];
	        if (Array.isArray(sch) && sch.some(hasRef))
	            return true;
	        if (typeof sch == "object" && hasRef(sch))
	            return true;
	    }
	    return false;
	}
	function countKeys(schema) {
	    let count = 0;
	    for (const key in schema) {
	        if (key === "$ref")
	            return Infinity;
	        count++;
	        if (SIMPLE_INLINED.has(key))
	            continue;
	        if (typeof schema[key] == "object") {
	            (0, util_1.eachItem)(schema[key], (sch) => (count += countKeys(sch)));
	        }
	        if (count === Infinity)
	            return Infinity;
	    }
	    return count;
	}
	function getFullPath(resolver, id = "", normalize) {
	    if (normalize !== false)
	        id = normalizeId(id);
	    const p = resolver.parse(id);
	    return _getFullPath(resolver, p);
	}
	resolve.getFullPath = getFullPath;
	function _getFullPath(resolver, p) {
	    const serialized = resolver.serialize(p);
	    return serialized.split("#")[0] + "#";
	}
	resolve._getFullPath = _getFullPath;
	const TRAILING_SLASH_HASH = /#\/?$/;
	function normalizeId(id) {
	    return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
	}
	resolve.normalizeId = normalizeId;
	function resolveUrl(resolver, baseId, id) {
	    id = normalizeId(id);
	    return resolver.resolve(baseId, id);
	}
	resolve.resolveUrl = resolveUrl;
	const ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
	function getSchemaRefs(schema, baseId) {
	    if (typeof schema == "boolean")
	        return {};
	    const { schemaId, uriResolver } = this.opts;
	    const schId = normalizeId(schema[schemaId] || baseId);
	    const baseIds = { "": schId };
	    const pathPrefix = getFullPath(uriResolver, schId, false);
	    const localRefs = {};
	    const schemaRefs = new Set();
	    traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
	        if (parentJsonPtr === undefined)
	            return;
	        const fullPath = pathPrefix + jsonPtr;
	        let innerBaseId = baseIds[parentJsonPtr];
	        if (typeof sch[schemaId] == "string")
	            innerBaseId = addRef.call(this, sch[schemaId]);
	        addAnchor.call(this, sch.$anchor);
	        addAnchor.call(this, sch.$dynamicAnchor);
	        baseIds[jsonPtr] = innerBaseId;
	        function addRef(ref) {
	            // eslint-disable-next-line @typescript-eslint/unbound-method
	            const _resolve = this.opts.uriResolver.resolve;
	            ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
	            if (schemaRefs.has(ref))
	                throw ambiguos(ref);
	            schemaRefs.add(ref);
	            let schOrRef = this.refs[ref];
	            if (typeof schOrRef == "string")
	                schOrRef = this.refs[schOrRef];
	            if (typeof schOrRef == "object") {
	                checkAmbiguosRef(sch, schOrRef.schema, ref);
	            }
	            else if (ref !== normalizeId(fullPath)) {
	                if (ref[0] === "#") {
	                    checkAmbiguosRef(sch, localRefs[ref], ref);
	                    localRefs[ref] = sch;
	                }
	                else {
	                    this.refs[ref] = fullPath;
	                }
	            }
	            return ref;
	        }
	        function addAnchor(anchor) {
	            if (typeof anchor == "string") {
	                if (!ANCHOR.test(anchor))
	                    throw new Error(`invalid anchor "${anchor}"`);
	                addRef.call(this, `#${anchor}`);
	            }
	        }
	    });
	    return localRefs;
	    function checkAmbiguosRef(sch1, sch2, ref) {
	        if (sch2 !== undefined && !equal(sch1, sch2))
	            throw ambiguos(ref);
	    }
	    function ambiguos(ref) {
	        return new Error(`reference "${ref}" resolves to more than one schema`);
	    }
	}
	resolve.getSchemaRefs = getSchemaRefs;
	
	return resolve;
}

var hasRequiredValidate;

function requireValidate () {
	if (hasRequiredValidate) return validate;
	hasRequiredValidate = 1;
	Object.defineProperty(validate, "__esModule", { value: true });
	validate.getData = validate.KeywordCxt = validate.validateFunctionCode = void 0;
	const boolSchema_1 = /*@__PURE__*/ requireBoolSchema();
	const dataType_1 = /*@__PURE__*/ requireDataType();
	const applicability_1 = /*@__PURE__*/ requireApplicability();
	const dataType_2 = /*@__PURE__*/ requireDataType();
	const defaults_1 = /*@__PURE__*/ requireDefaults();
	const keyword_1 = /*@__PURE__*/ requireKeyword();
	const subschema_1 = /*@__PURE__*/ requireSubschema();
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const names_1 = /*@__PURE__*/ requireNames();
	const resolve_1 = /*@__PURE__*/ requireResolve();
	const util_1 = /*@__PURE__*/ requireUtil();
	const errors_1 = /*@__PURE__*/ requireErrors();
	// schema compilation - generates validation function, subschemaCode (below) is used for subschemas
	function validateFunctionCode(it) {
	    if (isSchemaObj(it)) {
	        checkKeywords(it);
	        if (schemaCxtHasRules(it)) {
	            topSchemaObjCode(it);
	            return;
	        }
	    }
	    validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
	}
	validate.validateFunctionCode = validateFunctionCode;
	function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
	    if (opts.code.es5) {
	        gen.func(validateName, (0, codegen_1._) `${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
	            gen.code((0, codegen_1._) `"use strict"; ${funcSourceUrl(schema, opts)}`);
	            destructureValCxtES5(gen, opts);
	            gen.code(body);
	        });
	    }
	    else {
	        gen.func(validateName, (0, codegen_1._) `${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
	    }
	}
	function destructureValCxt(opts) {
	    return (0, codegen_1._) `{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._) `, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
	}
	function destructureValCxtES5(gen, opts) {
	    gen.if(names_1.default.valCxt, () => {
	        gen.var(names_1.default.instancePath, (0, codegen_1._) `${names_1.default.valCxt}.${names_1.default.instancePath}`);
	        gen.var(names_1.default.parentData, (0, codegen_1._) `${names_1.default.valCxt}.${names_1.default.parentData}`);
	        gen.var(names_1.default.parentDataProperty, (0, codegen_1._) `${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
	        gen.var(names_1.default.rootData, (0, codegen_1._) `${names_1.default.valCxt}.${names_1.default.rootData}`);
	        if (opts.dynamicRef)
	            gen.var(names_1.default.dynamicAnchors, (0, codegen_1._) `${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
	    }, () => {
	        gen.var(names_1.default.instancePath, (0, codegen_1._) `""`);
	        gen.var(names_1.default.parentData, (0, codegen_1._) `undefined`);
	        gen.var(names_1.default.parentDataProperty, (0, codegen_1._) `undefined`);
	        gen.var(names_1.default.rootData, names_1.default.data);
	        if (opts.dynamicRef)
	            gen.var(names_1.default.dynamicAnchors, (0, codegen_1._) `{}`);
	    });
	}
	function topSchemaObjCode(it) {
	    const { schema, opts, gen } = it;
	    validateFunction(it, () => {
	        if (opts.$comment && schema.$comment)
	            commentKeyword(it);
	        checkNoDefault(it);
	        gen.let(names_1.default.vErrors, null);
	        gen.let(names_1.default.errors, 0);
	        if (opts.unevaluated)
	            resetEvaluated(it);
	        typeAndKeywords(it);
	        returnResults(it);
	    });
	    return;
	}
	function resetEvaluated(it) {
	    // TODO maybe some hook to execute it in the end to check whether props/items are Name, as in assignEvaluated
	    const { gen, validateName } = it;
	    it.evaluated = gen.const("evaluated", (0, codegen_1._) `${validateName}.evaluated`);
	    gen.if((0, codegen_1._) `${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._) `${it.evaluated}.props`, (0, codegen_1._) `undefined`));
	    gen.if((0, codegen_1._) `${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._) `${it.evaluated}.items`, (0, codegen_1._) `undefined`));
	}
	function funcSourceUrl(schema, opts) {
	    const schId = typeof schema == "object" && schema[opts.schemaId];
	    return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._) `/*# sourceURL=${schId} */` : codegen_1.nil;
	}
	// schema compilation - this function is used recursively to generate code for sub-schemas
	function subschemaCode(it, valid) {
	    if (isSchemaObj(it)) {
	        checkKeywords(it);
	        if (schemaCxtHasRules(it)) {
	            subSchemaObjCode(it, valid);
	            return;
	        }
	    }
	    (0, boolSchema_1.boolOrEmptySchema)(it, valid);
	}
	function schemaCxtHasRules({ schema, self }) {
	    if (typeof schema == "boolean")
	        return !schema;
	    for (const key in schema)
	        if (self.RULES.all[key])
	            return true;
	    return false;
	}
	function isSchemaObj(it) {
	    return typeof it.schema != "boolean";
	}
	function subSchemaObjCode(it, valid) {
	    const { schema, gen, opts } = it;
	    if (opts.$comment && schema.$comment)
	        commentKeyword(it);
	    updateContext(it);
	    checkAsyncSchema(it);
	    const errsCount = gen.const("_errs", names_1.default.errors);
	    typeAndKeywords(it, errsCount);
	    // TODO var
	    gen.var(valid, (0, codegen_1._) `${errsCount} === ${names_1.default.errors}`);
	}
	function checkKeywords(it) {
	    (0, util_1.checkUnknownRules)(it);
	    checkRefsAndKeywords(it);
	}
	function typeAndKeywords(it, errsCount) {
	    if (it.opts.jtd)
	        return schemaKeywords(it, [], false, errsCount);
	    const types = (0, dataType_1.getSchemaTypes)(it.schema);
	    const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
	    schemaKeywords(it, types, !checkedTypes, errsCount);
	}
	function checkRefsAndKeywords(it) {
	    const { schema, errSchemaPath, opts, self } = it;
	    if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
	        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
	    }
	}
	function checkNoDefault(it) {
	    const { schema, opts } = it;
	    if (schema.default !== undefined && opts.useDefaults && opts.strictSchema) {
	        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
	    }
	}
	function updateContext(it) {
	    const schId = it.schema[it.opts.schemaId];
	    if (schId)
	        it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
	}
	function checkAsyncSchema(it) {
	    if (it.schema.$async && !it.schemaEnv.$async)
	        throw new Error("async schema in sync schema");
	}
	function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
	    const msg = schema.$comment;
	    if (opts.$comment === true) {
	        gen.code((0, codegen_1._) `${names_1.default.self}.logger.log(${msg})`);
	    }
	    else if (typeof opts.$comment == "function") {
	        const schemaPath = (0, codegen_1.str) `${errSchemaPath}/$comment`;
	        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
	        gen.code((0, codegen_1._) `${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
	    }
	}
	function returnResults(it) {
	    const { gen, schemaEnv, validateName, ValidationError, opts } = it;
	    if (schemaEnv.$async) {
	        // TODO assign unevaluated
	        gen.if((0, codegen_1._) `${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._) `new ${ValidationError}(${names_1.default.vErrors})`));
	    }
	    else {
	        gen.assign((0, codegen_1._) `${validateName}.errors`, names_1.default.vErrors);
	        if (opts.unevaluated)
	            assignEvaluated(it);
	        gen.return((0, codegen_1._) `${names_1.default.errors} === 0`);
	    }
	}
	function assignEvaluated({ gen, evaluated, props, items }) {
	    if (props instanceof codegen_1.Name)
	        gen.assign((0, codegen_1._) `${evaluated}.props`, props);
	    if (items instanceof codegen_1.Name)
	        gen.assign((0, codegen_1._) `${evaluated}.items`, items);
	}
	function schemaKeywords(it, types, typeErrors, errsCount) {
	    const { gen, schema, data, allErrors, opts, self } = it;
	    const { RULES } = self;
	    if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
	        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition)); // TODO typecast
	        return;
	    }
	    if (!opts.jtd)
	        checkStrictTypes(it, types);
	    gen.block(() => {
	        for (const group of RULES.rules)
	            groupKeywords(group);
	        groupKeywords(RULES.post);
	    });
	    function groupKeywords(group) {
	        if (!(0, applicability_1.shouldUseGroup)(schema, group))
	            return;
	        if (group.type) {
	            gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
	            iterateKeywords(it, group);
	            if (types.length === 1 && types[0] === group.type && typeErrors) {
	                gen.else();
	                (0, dataType_2.reportTypeError)(it);
	            }
	            gen.endIf();
	        }
	        else {
	            iterateKeywords(it, group);
	        }
	        // TODO make it "ok" call?
	        if (!allErrors)
	            gen.if((0, codegen_1._) `${names_1.default.errors} === ${errsCount || 0}`);
	    }
	}
	function iterateKeywords(it, group) {
	    const { gen, schema, opts: { useDefaults }, } = it;
	    if (useDefaults)
	        (0, defaults_1.assignDefaults)(it, group.type);
	    gen.block(() => {
	        for (const rule of group.rules) {
	            if ((0, applicability_1.shouldUseRule)(schema, rule)) {
	                keywordCode(it, rule.keyword, rule.definition, group.type);
	            }
	        }
	    });
	}
	function checkStrictTypes(it, types) {
	    if (it.schemaEnv.meta || !it.opts.strictTypes)
	        return;
	    checkContextTypes(it, types);
	    if (!it.opts.allowUnionTypes)
	        checkMultipleTypes(it, types);
	    checkKeywordTypes(it, it.dataTypes);
	}
	function checkContextTypes(it, types) {
	    if (!types.length)
	        return;
	    if (!it.dataTypes.length) {
	        it.dataTypes = types;
	        return;
	    }
	    types.forEach((t) => {
	        if (!includesType(it.dataTypes, t)) {
	            strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
	        }
	    });
	    narrowSchemaTypes(it, types);
	}
	function checkMultipleTypes(it, ts) {
	    if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
	        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
	    }
	}
	function checkKeywordTypes(it, ts) {
	    const rules = it.self.RULES.all;
	    for (const keyword in rules) {
	        const rule = rules[keyword];
	        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
	            const { type } = rule.definition;
	            if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
	                strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
	            }
	        }
	    }
	}
	function hasApplicableType(schTs, kwdT) {
	    return schTs.includes(kwdT) || (kwdT === "number" && schTs.includes("integer"));
	}
	function includesType(ts, t) {
	    return ts.includes(t) || (t === "integer" && ts.includes("number"));
	}
	function narrowSchemaTypes(it, withTypes) {
	    const ts = [];
	    for (const t of it.dataTypes) {
	        if (includesType(withTypes, t))
	            ts.push(t);
	        else if (withTypes.includes("integer") && t === "number")
	            ts.push("integer");
	    }
	    it.dataTypes = ts;
	}
	function strictTypesError(it, msg) {
	    const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
	    msg += ` at "${schemaPath}" (strictTypes)`;
	    (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
	}
	class KeywordCxt {
	    constructor(it, def, keyword) {
	        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
	        this.gen = it.gen;
	        this.allErrors = it.allErrors;
	        this.keyword = keyword;
	        this.data = it.data;
	        this.schema = it.schema[keyword];
	        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
	        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
	        this.schemaType = def.schemaType;
	        this.parentSchema = it.schema;
	        this.params = {};
	        this.it = it;
	        this.def = def;
	        if (this.$data) {
	            this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
	        }
	        else {
	            this.schemaCode = this.schemaValue;
	            if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
	                throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
	            }
	        }
	        if ("code" in def ? def.trackErrors : def.errors !== false) {
	            this.errsCount = it.gen.const("_errs", names_1.default.errors);
	        }
	    }
	    result(condition, successAction, failAction) {
	        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
	    }
	    failResult(condition, successAction, failAction) {
	        this.gen.if(condition);
	        if (failAction)
	            failAction();
	        else
	            this.error();
	        if (successAction) {
	            this.gen.else();
	            successAction();
	            if (this.allErrors)
	                this.gen.endIf();
	        }
	        else {
	            if (this.allErrors)
	                this.gen.endIf();
	            else
	                this.gen.else();
	        }
	    }
	    pass(condition, failAction) {
	        this.failResult((0, codegen_1.not)(condition), undefined, failAction);
	    }
	    fail(condition) {
	        if (condition === undefined) {
	            this.error();
	            if (!this.allErrors)
	                this.gen.if(false); // this branch will be removed by gen.optimize
	            return;
	        }
	        this.gen.if(condition);
	        this.error();
	        if (this.allErrors)
	            this.gen.endIf();
	        else
	            this.gen.else();
	    }
	    fail$data(condition) {
	        if (!this.$data)
	            return this.fail(condition);
	        const { schemaCode } = this;
	        this.fail((0, codegen_1._) `${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
	    }
	    error(append, errorParams, errorPaths) {
	        if (errorParams) {
	            this.setParams(errorParams);
	            this._error(append, errorPaths);
	            this.setParams({});
	            return;
	        }
	        this._error(append, errorPaths);
	    }
	    _error(append, errorPaths) {
	        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
	    }
	    $dataError() {
	        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
	    }
	    reset() {
	        if (this.errsCount === undefined)
	            throw new Error('add "trackErrors" to keyword definition');
	        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
	    }
	    ok(cond) {
	        if (!this.allErrors)
	            this.gen.if(cond);
	    }
	    setParams(obj, assign) {
	        if (assign)
	            Object.assign(this.params, obj);
	        else
	            this.params = obj;
	    }
	    block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
	        this.gen.block(() => {
	            this.check$data(valid, $dataValid);
	            codeBlock();
	        });
	    }
	    check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
	        if (!this.$data)
	            return;
	        const { gen, schemaCode, schemaType, def } = this;
	        gen.if((0, codegen_1.or)((0, codegen_1._) `${schemaCode} === undefined`, $dataValid));
	        if (valid !== codegen_1.nil)
	            gen.assign(valid, true);
	        if (schemaType.length || def.validateSchema) {
	            gen.elseIf(this.invalid$data());
	            this.$dataError();
	            if (valid !== codegen_1.nil)
	                gen.assign(valid, false);
	        }
	        gen.else();
	    }
	    invalid$data() {
	        const { gen, schemaCode, schemaType, def, it } = this;
	        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
	        function wrong$DataType() {
	            if (schemaType.length) {
	                /* istanbul ignore if */
	                if (!(schemaCode instanceof codegen_1.Name))
	                    throw new Error("ajv implementation error");
	                const st = Array.isArray(schemaType) ? schemaType : [schemaType];
	                return (0, codegen_1._) `${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
	            }
	            return codegen_1.nil;
	        }
	        function invalid$DataSchema() {
	            if (def.validateSchema) {
	                const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema }); // TODO value.code for standalone
	                return (0, codegen_1._) `!${validateSchemaRef}(${schemaCode})`;
	            }
	            return codegen_1.nil;
	        }
	    }
	    subschema(appl, valid) {
	        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
	        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
	        (0, subschema_1.extendSubschemaMode)(subschema, appl);
	        const nextContext = { ...this.it, ...subschema, items: undefined, props: undefined };
	        subschemaCode(nextContext, valid);
	        return nextContext;
	    }
	    mergeEvaluated(schemaCxt, toName) {
	        const { it, gen } = this;
	        if (!it.opts.unevaluated)
	            return;
	        if (it.props !== true && schemaCxt.props !== undefined) {
	            it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
	        }
	        if (it.items !== true && schemaCxt.items !== undefined) {
	            it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
	        }
	    }
	    mergeValidEvaluated(schemaCxt, valid) {
	        const { it, gen } = this;
	        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
	            gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
	            return true;
	        }
	    }
	}
	validate.KeywordCxt = KeywordCxt;
	function keywordCode(it, keyword, def, ruleType) {
	    const cxt = new KeywordCxt(it, def, keyword);
	    if ("code" in def) {
	        def.code(cxt, ruleType);
	    }
	    else if (cxt.$data && def.validate) {
	        (0, keyword_1.funcKeywordCode)(cxt, def);
	    }
	    else if ("macro" in def) {
	        (0, keyword_1.macroKeywordCode)(cxt, def);
	    }
	    else if (def.compile || def.validate) {
	        (0, keyword_1.funcKeywordCode)(cxt, def);
	    }
	}
	const JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
	const RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
	function getData($data, { dataLevel, dataNames, dataPathArr }) {
	    let jsonPointer;
	    let data;
	    if ($data === "")
	        return names_1.default.rootData;
	    if ($data[0] === "/") {
	        if (!JSON_POINTER.test($data))
	            throw new Error(`Invalid JSON-pointer: ${$data}`);
	        jsonPointer = $data;
	        data = names_1.default.rootData;
	    }
	    else {
	        const matches = RELATIVE_JSON_POINTER.exec($data);
	        if (!matches)
	            throw new Error(`Invalid JSON-pointer: ${$data}`);
	        const up = +matches[1];
	        jsonPointer = matches[2];
	        if (jsonPointer === "#") {
	            if (up >= dataLevel)
	                throw new Error(errorMsg("property/index", up));
	            return dataPathArr[dataLevel - up];
	        }
	        if (up > dataLevel)
	            throw new Error(errorMsg("data", up));
	        data = dataNames[dataLevel - up];
	        if (!jsonPointer)
	            return data;
	    }
	    let expr = data;
	    const segments = jsonPointer.split("/");
	    for (const segment of segments) {
	        if (segment) {
	            data = (0, codegen_1._) `${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
	            expr = (0, codegen_1._) `${expr} && ${data}`;
	        }
	    }
	    return expr;
	    function errorMsg(pointerType, up) {
	        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
	    }
	}
	validate.getData = getData;
	
	return validate;
}

var validation_error = {};

var hasRequiredValidation_error;

function requireValidation_error () {
	if (hasRequiredValidation_error) return validation_error;
	hasRequiredValidation_error = 1;
	Object.defineProperty(validation_error, "__esModule", { value: true });
	class ValidationError extends Error {
	    constructor(errors) {
	        super("validation failed");
	        this.errors = errors;
	        this.ajv = this.validation = true;
	    }
	}
	validation_error.default = ValidationError;
	
	return validation_error;
}

var ref_error = {};

var hasRequiredRef_error;

function requireRef_error () {
	if (hasRequiredRef_error) return ref_error;
	hasRequiredRef_error = 1;
	Object.defineProperty(ref_error, "__esModule", { value: true });
	const resolve_1 = /*@__PURE__*/ requireResolve();
	class MissingRefError extends Error {
	    constructor(resolver, baseId, ref, msg) {
	        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
	        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
	        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
	    }
	}
	ref_error.default = MissingRefError;
	
	return ref_error;
}

var compile = {};

var hasRequiredCompile;

function requireCompile () {
	if (hasRequiredCompile) return compile;
	hasRequiredCompile = 1;
	Object.defineProperty(compile, "__esModule", { value: true });
	compile.resolveSchema = compile.getCompilingSchema = compile.resolveRef = compile.compileSchema = compile.SchemaEnv = void 0;
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const validation_error_1 = /*@__PURE__*/ requireValidation_error();
	const names_1 = /*@__PURE__*/ requireNames();
	const resolve_1 = /*@__PURE__*/ requireResolve();
	const util_1 = /*@__PURE__*/ requireUtil();
	const validate_1 = /*@__PURE__*/ requireValidate();
	class SchemaEnv {
	    constructor(env) {
	        var _a;
	        this.refs = {};
	        this.dynamicAnchors = {};
	        let schema;
	        if (typeof env.schema == "object")
	            schema = env.schema;
	        this.schema = env.schema;
	        this.schemaId = env.schemaId;
	        this.root = env.root || this;
	        this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
	        this.schemaPath = env.schemaPath;
	        this.localRefs = env.localRefs;
	        this.meta = env.meta;
	        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
	        this.refs = {};
	    }
	}
	compile.SchemaEnv = SchemaEnv;
	// let codeSize = 0
	// let nodeCount = 0
	// Compiles schema in SchemaEnv
	function compileSchema(sch) {
	    // TODO refactor - remove compilations
	    const _sch = getCompilingSchema.call(this, sch);
	    if (_sch)
	        return _sch;
	    const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId); // TODO if getFullPath removed 1 tests fails
	    const { es5, lines } = this.opts.code;
	    const { ownProperties } = this.opts;
	    const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
	    let _ValidationError;
	    if (sch.$async) {
	        _ValidationError = gen.scopeValue("Error", {
	            ref: validation_error_1.default,
	            code: (0, codegen_1._) `require("ajv/dist/runtime/validation_error").default`,
	        });
	    }
	    const validateName = gen.scopeName("validate");
	    sch.validateName = validateName;
	    const schemaCxt = {
	        gen,
	        allErrors: this.opts.allErrors,
	        data: names_1.default.data,
	        parentData: names_1.default.parentData,
	        parentDataProperty: names_1.default.parentDataProperty,
	        dataNames: [names_1.default.data],
	        dataPathArr: [codegen_1.nil], // TODO can its length be used as dataLevel if nil is removed?
	        dataLevel: 0,
	        dataTypes: [],
	        definedProperties: new Set(),
	        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true
	            ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) }
	            : { ref: sch.schema }),
	        validateName,
	        ValidationError: _ValidationError,
	        schema: sch.schema,
	        schemaEnv: sch,
	        rootId,
	        baseId: sch.baseId || rootId,
	        schemaPath: codegen_1.nil,
	        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
	        errorPath: (0, codegen_1._) `""`,
	        opts: this.opts,
	        self: this,
	    };
	    let sourceCode;
	    try {
	        this._compilations.add(sch);
	        (0, validate_1.validateFunctionCode)(schemaCxt);
	        gen.optimize(this.opts.code.optimize);
	        // gen.optimize(1)
	        const validateCode = gen.toString();
	        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
	        // console.log((codeSize += sourceCode.length), (nodeCount += gen.nodeCount))
	        if (this.opts.code.process)
	            sourceCode = this.opts.code.process(sourceCode, sch);
	        // console.log("\n\n\n *** \n", sourceCode)
	        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
	        const validate = makeValidate(this, this.scope.get());
	        this.scope.value(validateName, { ref: validate });
	        validate.errors = null;
	        validate.schema = sch.schema;
	        validate.schemaEnv = sch;
	        if (sch.$async)
	            validate.$async = true;
	        if (this.opts.code.source === true) {
	            validate.source = { validateName, validateCode, scopeValues: gen._values };
	        }
	        if (this.opts.unevaluated) {
	            const { props, items } = schemaCxt;
	            validate.evaluated = {
	                props: props instanceof codegen_1.Name ? undefined : props,
	                items: items instanceof codegen_1.Name ? undefined : items,
	                dynamicProps: props instanceof codegen_1.Name,
	                dynamicItems: items instanceof codegen_1.Name,
	            };
	            if (validate.source)
	                validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
	        }
	        sch.validate = validate;
	        return sch;
	    }
	    catch (e) {
	        delete sch.validate;
	        delete sch.validateName;
	        if (sourceCode)
	            this.logger.error("Error compiling schema, function code:", sourceCode);
	        // console.log("\n\n\n *** \n", sourceCode, this.opts)
	        throw e;
	    }
	    finally {
	        this._compilations.delete(sch);
	    }
	}
	compile.compileSchema = compileSchema;
	function resolveRef(root, baseId, ref) {
	    var _a;
	    ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
	    const schOrFunc = root.refs[ref];
	    if (schOrFunc)
	        return schOrFunc;
	    let _sch = resolve.call(this, root, ref);
	    if (_sch === undefined) {
	        const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref]; // TODO maybe localRefs should hold SchemaEnv
	        const { schemaId } = this.opts;
	        if (schema)
	            _sch = new SchemaEnv({ schema, schemaId, root, baseId });
	    }
	    if (_sch === undefined)
	        return;
	    return (root.refs[ref] = inlineOrCompile.call(this, _sch));
	}
	compile.resolveRef = resolveRef;
	function inlineOrCompile(sch) {
	    if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
	        return sch.schema;
	    return sch.validate ? sch : compileSchema.call(this, sch);
	}
	// Index of schema compilation in the currently compiled list
	function getCompilingSchema(schEnv) {
	    for (const sch of this._compilations) {
	        if (sameSchemaEnv(sch, schEnv))
	            return sch;
	    }
	}
	compile.getCompilingSchema = getCompilingSchema;
	function sameSchemaEnv(s1, s2) {
	    return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
	}
	// resolve and compile the references ($ref)
	// TODO returns AnySchemaObject (if the schema can be inlined) or validation function
	function resolve(root, // information about the root schema for the current schema
	ref // reference to resolve
	) {
	    let sch;
	    while (typeof (sch = this.refs[ref]) == "string")
	        ref = sch;
	    return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
	}
	// Resolve schema, its root and baseId
	function resolveSchema(root, // root object with properties schema, refs TODO below SchemaEnv is assigned to it
	ref // reference to resolve
	) {
	    const p = this.opts.uriResolver.parse(ref);
	    const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
	    let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, undefined);
	    // TODO `Object.keys(root.schema).length > 0` should not be needed - but removing breaks 2 tests
	    if (Object.keys(root.schema).length > 0 && refPath === baseId) {
	        return getJsonPointer.call(this, p, root);
	    }
	    const id = (0, resolve_1.normalizeId)(refPath);
	    const schOrRef = this.refs[id] || this.schemas[id];
	    if (typeof schOrRef == "string") {
	        const sch = resolveSchema.call(this, root, schOrRef);
	        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
	            return;
	        return getJsonPointer.call(this, p, sch);
	    }
	    if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
	        return;
	    if (!schOrRef.validate)
	        compileSchema.call(this, schOrRef);
	    if (id === (0, resolve_1.normalizeId)(ref)) {
	        const { schema } = schOrRef;
	        const { schemaId } = this.opts;
	        const schId = schema[schemaId];
	        if (schId)
	            baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
	        return new SchemaEnv({ schema, schemaId, root, baseId });
	    }
	    return getJsonPointer.call(this, p, schOrRef);
	}
	compile.resolveSchema = resolveSchema;
	const PREVENT_SCOPE_CHANGE = new Set([
	    "properties",
	    "patternProperties",
	    "enum",
	    "dependencies",
	    "definitions",
	]);
	function getJsonPointer(parsedRef, { baseId, schema, root }) {
	    var _a;
	    if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/")
	        return;
	    for (const part of parsedRef.fragment.slice(1).split("/")) {
	        if (typeof schema === "boolean")
	            return;
	        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
	        if (partSchema === undefined)
	            return;
	        schema = partSchema;
	        // TODO PREVENT_SCOPE_CHANGE could be defined in keyword def?
	        const schId = typeof schema === "object" && schema[this.opts.schemaId];
	        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
	            baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
	        }
	    }
	    let env;
	    if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
	        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
	        env = resolveSchema.call(this, root, $ref);
	    }
	    // even though resolution failed we need to return SchemaEnv to throw exception
	    // so that compileAsync loads missing schema.
	    const { schemaId } = this.opts;
	    env = env || new SchemaEnv({ schema, schemaId, root, baseId });
	    if (env.schema !== env.root.schema)
	        return env;
	    return undefined;
	}
	
	return compile;
}

var $id$1 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#";
var description = "Meta-schema for $data reference (JSON AnySchema extension proposal)";
var type$1 = "object";
var required$1 = [
	"$data"
];
var properties$2 = {
	$data: {
		type: "string",
		anyOf: [
			{
				format: "relative-json-pointer"
			},
			{
				format: "json-pointer"
			}
		]
	}
};
var additionalProperties$1 = false;
var require$$9 = {
	$id: $id$1,
	description: description,
	type: type$1,
	required: required$1,
	properties: properties$2,
	additionalProperties: additionalProperties$1
};

var uri = {};

var fastUri = {exports: {}};

var utils;
var hasRequiredUtils;

function requireUtils () {
	if (hasRequiredUtils) return utils;
	hasRequiredUtils = 1;

	/** @type {(value: string) => boolean} */
	const isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);

	/** @type {(value: string) => boolean} */
	const isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);

	/**
	 * @param {Array<string>} input
	 * @returns {string}
	 */
	function stringArrayToHexStripped (input) {
	  let acc = '';
	  let code = 0;
	  let i = 0;

	  for (i = 0; i < input.length; i++) {
	    code = input[i].charCodeAt(0);
	    if (code === 48) {
	      continue
	    }
	    if (!((code >= 48 && code <= 57) || (code >= 65 && code <= 70) || (code >= 97 && code <= 102))) {
	      return ''
	    }
	    acc += input[i];
	    break
	  }

	  for (i += 1; i < input.length; i++) {
	    code = input[i].charCodeAt(0);
	    if (!((code >= 48 && code <= 57) || (code >= 65 && code <= 70) || (code >= 97 && code <= 102))) {
	      return ''
	    }
	    acc += input[i];
	  }
	  return acc
	}

	/**
	 * @typedef {Object} GetIPV6Result
	 * @property {boolean} error - Indicates if there was an error parsing the IPv6 address.
	 * @property {string} address - The parsed IPv6 address.
	 * @property {string} [zone] - The zone identifier, if present.
	 */

	/**
	 * @param {string} value
	 * @returns {boolean}
	 */
	const nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);

	/**
	 * @param {Array<string>} buffer
	 * @returns {boolean}
	 */
	function consumeIsZone (buffer) {
	  buffer.length = 0;
	  return true
	}

	/**
	 * @param {Array<string>} buffer
	 * @param {Array<string>} address
	 * @param {GetIPV6Result} output
	 * @returns {boolean}
	 */
	function consumeHextets (buffer, address, output) {
	  if (buffer.length) {
	    const hex = stringArrayToHexStripped(buffer);
	    if (hex !== '') {
	      address.push(hex);
	    } else {
	      output.error = true;
	      return false
	    }
	    buffer.length = 0;
	  }
	  return true
	}

	/**
	 * @param {string} input
	 * @returns {GetIPV6Result}
	 */
	function getIPV6 (input) {
	  let tokenCount = 0;
	  const output = { error: false, address: '', zone: '' };
	  /** @type {Array<string>} */
	  const address = [];
	  /** @type {Array<string>} */
	  const buffer = [];
	  let endipv6Encountered = false;
	  let endIpv6 = false;

	  let consume = consumeHextets;

	  for (let i = 0; i < input.length; i++) {
	    const cursor = input[i];
	    if (cursor === '[' || cursor === ']') { continue }
	    if (cursor === ':') {
	      if (endipv6Encountered === true) {
	        endIpv6 = true;
	      }
	      if (!consume(buffer, address, output)) { break }
	      if (++tokenCount > 7) {
	        // not valid
	        output.error = true;
	        break
	      }
	      if (i > 0 && input[i - 1] === ':') {
	        endipv6Encountered = true;
	      }
	      address.push(':');
	      continue
	    } else if (cursor === '%') {
	      if (!consume(buffer, address, output)) { break }
	      // switch to zone detection
	      consume = consumeIsZone;
	    } else {
	      buffer.push(cursor);
	      continue
	    }
	  }
	  if (buffer.length) {
	    if (consume === consumeIsZone) {
	      output.zone = buffer.join('');
	    } else if (endIpv6) {
	      address.push(buffer.join(''));
	    } else {
	      address.push(stringArrayToHexStripped(buffer));
	    }
	  }
	  output.address = address.join('');
	  return output
	}

	/**
	 * @typedef {Object} NormalizeIPv6Result
	 * @property {string} host - The normalized host.
	 * @property {string} [escapedHost] - The escaped host.
	 * @property {boolean} isIPV6 - Indicates if the host is an IPv6 address.
	 */

	/**
	 * @param {string} host
	 * @returns {NormalizeIPv6Result}
	 */
	function normalizeIPv6 (host) {
	  if (findToken(host, ':') < 2) { return { host, isIPV6: false } }
	  const ipv6 = getIPV6(host);

	  if (!ipv6.error) {
	    let newHost = ipv6.address;
	    let escapedHost = ipv6.address;
	    if (ipv6.zone) {
	      newHost += '%' + ipv6.zone;
	      escapedHost += '%25' + ipv6.zone;
	    }
	    return { host: newHost, isIPV6: true, escapedHost }
	  } else {
	    return { host, isIPV6: false }
	  }
	}

	/**
	 * @param {string} str
	 * @param {string} token
	 * @returns {number}
	 */
	function findToken (str, token) {
	  let ind = 0;
	  for (let i = 0; i < str.length; i++) {
	    if (str[i] === token) ind++;
	  }
	  return ind
	}

	/**
	 * @param {string} path
	 * @returns {string}
	 *
	 * @see https://datatracker.ietf.org/doc/html/rfc3986#section-5.2.4
	 */
	function removeDotSegments (path) {
	  let input = path;
	  const output = [];
	  let nextSlash = -1;
	  let len = 0;

	  // eslint-disable-next-line no-cond-assign
	  while (len = input.length) {
	    if (len === 1) {
	      if (input === '.') {
	        break
	      } else if (input === '/') {
	        output.push('/');
	        break
	      } else {
	        output.push(input);
	        break
	      }
	    } else if (len === 2) {
	      if (input[0] === '.') {
	        if (input[1] === '.') {
	          break
	        } else if (input[1] === '/') {
	          input = input.slice(2);
	          continue
	        }
	      } else if (input[0] === '/') {
	        if (input[1] === '.' || input[1] === '/') {
	          output.push('/');
	          break
	        }
	      }
	    } else if (len === 3) {
	      if (input === '/..') {
	        if (output.length !== 0) {
	          output.pop();
	        }
	        output.push('/');
	        break
	      }
	    }
	    if (input[0] === '.') {
	      if (input[1] === '.') {
	        if (input[2] === '/') {
	          input = input.slice(3);
	          continue
	        }
	      } else if (input[1] === '/') {
	        input = input.slice(2);
	        continue
	      }
	    } else if (input[0] === '/') {
	      if (input[1] === '.') {
	        if (input[2] === '/') {
	          input = input.slice(2);
	          continue
	        } else if (input[2] === '.') {
	          if (input[3] === '/') {
	            input = input.slice(3);
	            if (output.length !== 0) {
	              output.pop();
	            }
	            continue
	          }
	        }
	      }
	    }

	    // Rule 2E: Move normal path segment to output
	    if ((nextSlash = input.indexOf('/', 1)) === -1) {
	      output.push(input);
	      break
	    } else {
	      output.push(input.slice(0, nextSlash));
	      input = input.slice(nextSlash);
	    }
	  }

	  return output.join('')
	}

	/**
	 * @param {import('../types/index').URIComponent} component
	 * @param {boolean} esc
	 * @returns {import('../types/index').URIComponent}
	 */
	function normalizeComponentEncoding (component, esc) {
	  const func = esc !== true ? escape : unescape;
	  if (component.scheme !== undefined) {
	    component.scheme = func(component.scheme);
	  }
	  if (component.userinfo !== undefined) {
	    component.userinfo = func(component.userinfo);
	  }
	  if (component.host !== undefined) {
	    component.host = func(component.host);
	  }
	  if (component.path !== undefined) {
	    component.path = func(component.path);
	  }
	  if (component.query !== undefined) {
	    component.query = func(component.query);
	  }
	  if (component.fragment !== undefined) {
	    component.fragment = func(component.fragment);
	  }
	  return component
	}

	/**
	 * @param {import('../types/index').URIComponent} component
	 * @returns {string|undefined}
	 */
	function recomposeAuthority (component) {
	  const uriTokens = [];

	  if (component.userinfo !== undefined) {
	    uriTokens.push(component.userinfo);
	    uriTokens.push('@');
	  }

	  if (component.host !== undefined) {
	    let host = unescape(component.host);
	    if (!isIPv4(host)) {
	      const ipV6res = normalizeIPv6(host);
	      if (ipV6res.isIPV6 === true) {
	        host = `[${ipV6res.escapedHost}]`;
	      } else {
	        host = component.host;
	      }
	    }
	    uriTokens.push(host);
	  }

	  if (typeof component.port === 'number' || typeof component.port === 'string') {
	    uriTokens.push(':');
	    uriTokens.push(String(component.port));
	  }

	  return uriTokens.length ? uriTokens.join('') : undefined
	}
	utils = {
	  nonSimpleDomain,
	  recomposeAuthority,
	  normalizeComponentEncoding,
	  removeDotSegments,
	  isIPv4,
	  isUUID,
	  normalizeIPv6,
	  stringArrayToHexStripped
	};
	return utils;
}

var schemes;
var hasRequiredSchemes;

function requireSchemes () {
	if (hasRequiredSchemes) return schemes;
	hasRequiredSchemes = 1;

	const { isUUID } = requireUtils();
	const URN_REG = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;

	const supportedSchemeNames = /** @type {const} */ (['http', 'https', 'ws',
	  'wss', 'urn', 'urn:uuid']);

	/** @typedef {supportedSchemeNames[number]} SchemeName */

	/**
	 * @param {string} name
	 * @returns {name is SchemeName}
	 */
	function isValidSchemeName (name) {
	  return supportedSchemeNames.indexOf(/** @type {*} */ (name)) !== -1
	}

	/**
	 * @callback SchemeFn
	 * @param {import('../types/index').URIComponent} component
	 * @param {import('../types/index').Options} options
	 * @returns {import('../types/index').URIComponent}
	 */

	/**
	 * @typedef {Object} SchemeHandler
	 * @property {SchemeName} scheme - The scheme name.
	 * @property {boolean} [domainHost] - Indicates if the scheme supports domain hosts.
	 * @property {SchemeFn} parse - Function to parse the URI component for this scheme.
	 * @property {SchemeFn} serialize - Function to serialize the URI component for this scheme.
	 * @property {boolean} [skipNormalize] - Indicates if normalization should be skipped for this scheme.
	 * @property {boolean} [absolutePath] - Indicates if the scheme uses absolute paths.
	 * @property {boolean} [unicodeSupport] - Indicates if the scheme supports Unicode.
	 */

	/**
	 * @param {import('../types/index').URIComponent} wsComponent
	 * @returns {boolean}
	 */
	function wsIsSecure (wsComponent) {
	  if (wsComponent.secure === true) {
	    return true
	  } else if (wsComponent.secure === false) {
	    return false
	  } else if (wsComponent.scheme) {
	    return (
	      wsComponent.scheme.length === 3 &&
	      (wsComponent.scheme[0] === 'w' || wsComponent.scheme[0] === 'W') &&
	      (wsComponent.scheme[1] === 's' || wsComponent.scheme[1] === 'S') &&
	      (wsComponent.scheme[2] === 's' || wsComponent.scheme[2] === 'S')
	    )
	  } else {
	    return false
	  }
	}

	/** @type {SchemeFn} */
	function httpParse (component) {
	  if (!component.host) {
	    component.error = component.error || 'HTTP URIs must have a host.';
	  }

	  return component
	}

	/** @type {SchemeFn} */
	function httpSerialize (component) {
	  const secure = String(component.scheme).toLowerCase() === 'https';

	  // normalize the default port
	  if (component.port === (secure ? 443 : 80) || component.port === '') {
	    component.port = undefined;
	  }

	  // normalize the empty path
	  if (!component.path) {
	    component.path = '/';
	  }

	  // NOTE: We do not parse query strings for HTTP URIs
	  // as WWW Form Url Encoded query strings are part of the HTML4+ spec,
	  // and not the HTTP spec.

	  return component
	}

	/** @type {SchemeFn} */
	function wsParse (wsComponent) {
	// indicate if the secure flag is set
	  wsComponent.secure = wsIsSecure(wsComponent);

	  // construct resouce name
	  wsComponent.resourceName = (wsComponent.path || '/') + (wsComponent.query ? '?' + wsComponent.query : '');
	  wsComponent.path = undefined;
	  wsComponent.query = undefined;

	  return wsComponent
	}

	/** @type {SchemeFn} */
	function wsSerialize (wsComponent) {
	// normalize the default port
	  if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === '') {
	    wsComponent.port = undefined;
	  }

	  // ensure scheme matches secure flag
	  if (typeof wsComponent.secure === 'boolean') {
	    wsComponent.scheme = (wsComponent.secure ? 'wss' : 'ws');
	    wsComponent.secure = undefined;
	  }

	  // reconstruct path from resource name
	  if (wsComponent.resourceName) {
	    const [path, query] = wsComponent.resourceName.split('?');
	    wsComponent.path = (path && path !== '/' ? path : undefined);
	    wsComponent.query = query;
	    wsComponent.resourceName = undefined;
	  }

	  // forbid fragment component
	  wsComponent.fragment = undefined;

	  return wsComponent
	}

	/** @type {SchemeFn} */
	function urnParse (urnComponent, options) {
	  if (!urnComponent.path) {
	    urnComponent.error = 'URN can not be parsed';
	    return urnComponent
	  }
	  const matches = urnComponent.path.match(URN_REG);
	  if (matches) {
	    const scheme = options.scheme || urnComponent.scheme || 'urn';
	    urnComponent.nid = matches[1].toLowerCase();
	    urnComponent.nss = matches[2];
	    const urnScheme = `${scheme}:${options.nid || urnComponent.nid}`;
	    const schemeHandler = getSchemeHandler(urnScheme);
	    urnComponent.path = undefined;

	    if (schemeHandler) {
	      urnComponent = schemeHandler.parse(urnComponent, options);
	    }
	  } else {
	    urnComponent.error = urnComponent.error || 'URN can not be parsed.';
	  }

	  return urnComponent
	}

	/** @type {SchemeFn} */
	function urnSerialize (urnComponent, options) {
	  if (urnComponent.nid === undefined) {
	    throw new Error('URN without nid cannot be serialized')
	  }
	  const scheme = options.scheme || urnComponent.scheme || 'urn';
	  const nid = urnComponent.nid.toLowerCase();
	  const urnScheme = `${scheme}:${options.nid || nid}`;
	  const schemeHandler = getSchemeHandler(urnScheme);

	  if (schemeHandler) {
	    urnComponent = schemeHandler.serialize(urnComponent, options);
	  }

	  const uriComponent = urnComponent;
	  const nss = urnComponent.nss;
	  uriComponent.path = `${nid || options.nid}:${nss}`;

	  options.skipEscape = true;
	  return uriComponent
	}

	/** @type {SchemeFn} */
	function urnuuidParse (urnComponent, options) {
	  const uuidComponent = urnComponent;
	  uuidComponent.uuid = uuidComponent.nss;
	  uuidComponent.nss = undefined;

	  if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) {
	    uuidComponent.error = uuidComponent.error || 'UUID is not valid.';
	  }

	  return uuidComponent
	}

	/** @type {SchemeFn} */
	function urnuuidSerialize (uuidComponent) {
	  const urnComponent = uuidComponent;
	  // normalize UUID
	  urnComponent.nss = (uuidComponent.uuid || '').toLowerCase();
	  return urnComponent
	}

	const http = /** @type {SchemeHandler} */ ({
	  scheme: 'http',
	  domainHost: true,
	  parse: httpParse,
	  serialize: httpSerialize
	});

	const https = /** @type {SchemeHandler} */ ({
	  scheme: 'https',
	  domainHost: http.domainHost,
	  parse: httpParse,
	  serialize: httpSerialize
	});

	const ws = /** @type {SchemeHandler} */ ({
	  scheme: 'ws',
	  domainHost: true,
	  parse: wsParse,
	  serialize: wsSerialize
	});

	const wss = /** @type {SchemeHandler} */ ({
	  scheme: 'wss',
	  domainHost: ws.domainHost,
	  parse: ws.parse,
	  serialize: ws.serialize
	});

	const urn = /** @type {SchemeHandler} */ ({
	  scheme: 'urn',
	  parse: urnParse,
	  serialize: urnSerialize,
	  skipNormalize: true
	});

	const urnuuid = /** @type {SchemeHandler} */ ({
	  scheme: 'urn:uuid',
	  parse: urnuuidParse,
	  serialize: urnuuidSerialize,
	  skipNormalize: true
	});

	const SCHEMES = /** @type {Record<SchemeName, SchemeHandler>} */ ({
	  http,
	  https,
	  ws,
	  wss,
	  urn,
	  'urn:uuid': urnuuid
	});

	Object.setPrototypeOf(SCHEMES, null);

	/**
	 * @param {string|undefined} scheme
	 * @returns {SchemeHandler|undefined}
	 */
	function getSchemeHandler (scheme) {
	  return (
	    scheme && (
	      SCHEMES[/** @type {SchemeName} */ (scheme)] ||
	      SCHEMES[/** @type {SchemeName} */(scheme.toLowerCase())])
	  ) ||
	    undefined
	}

	schemes = {
	  wsIsSecure,
	  SCHEMES,
	  isValidSchemeName,
	  getSchemeHandler,
	};
	return schemes;
}

var hasRequiredFastUri;

function requireFastUri () {
	if (hasRequiredFastUri) return fastUri.exports;
	hasRequiredFastUri = 1;

	const { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizeComponentEncoding, isIPv4, nonSimpleDomain } = requireUtils();
	const { SCHEMES, getSchemeHandler } = requireSchemes();

	/**
	 * @template {import('./types/index').URIComponent|string} T
	 * @param {T} uri
	 * @param {import('./types/index').Options} [options]
	 * @returns {T}
	 */
	function normalize (uri, options) {
	  if (typeof uri === 'string') {
	    uri = /** @type {T} */ (serialize(parse(uri, options), options));
	  } else if (typeof uri === 'object') {
	    uri = /** @type {T} */ (parse(serialize(uri, options), options));
	  }
	  return uri
	}

	/**
	 * @param {string} baseURI
	 * @param {string} relativeURI
	 * @param {import('./types/index').Options} [options]
	 * @returns {string}
	 */
	function resolve (baseURI, relativeURI, options) {
	  const schemelessOptions = options ? Object.assign({ scheme: 'null' }, options) : { scheme: 'null' };
	  const resolved = resolveComponent(parse(baseURI, schemelessOptions), parse(relativeURI, schemelessOptions), schemelessOptions, true);
	  schemelessOptions.skipEscape = true;
	  return serialize(resolved, schemelessOptions)
	}

	/**
	 * @param {import ('./types/index').URIComponent} base
	 * @param {import ('./types/index').URIComponent} relative
	 * @param {import('./types/index').Options} [options]
	 * @param {boolean} [skipNormalization=false]
	 * @returns {import ('./types/index').URIComponent}
	 */
	function resolveComponent (base, relative, options, skipNormalization) {
	  /** @type {import('./types/index').URIComponent} */
	  const target = {};
	  if (!skipNormalization) {
	    base = parse(serialize(base, options), options); // normalize base component
	    relative = parse(serialize(relative, options), options); // normalize relative component
	  }
	  options = options || {};

	  if (!options.tolerant && relative.scheme) {
	    target.scheme = relative.scheme;
	    // target.authority = relative.authority;
	    target.userinfo = relative.userinfo;
	    target.host = relative.host;
	    target.port = relative.port;
	    target.path = removeDotSegments(relative.path || '');
	    target.query = relative.query;
	  } else {
	    if (relative.userinfo !== undefined || relative.host !== undefined || relative.port !== undefined) {
	      // target.authority = relative.authority;
	      target.userinfo = relative.userinfo;
	      target.host = relative.host;
	      target.port = relative.port;
	      target.path = removeDotSegments(relative.path || '');
	      target.query = relative.query;
	    } else {
	      if (!relative.path) {
	        target.path = base.path;
	        if (relative.query !== undefined) {
	          target.query = relative.query;
	        } else {
	          target.query = base.query;
	        }
	      } else {
	        if (relative.path[0] === '/') {
	          target.path = removeDotSegments(relative.path);
	        } else {
	          if ((base.userinfo !== undefined || base.host !== undefined || base.port !== undefined) && !base.path) {
	            target.path = '/' + relative.path;
	          } else if (!base.path) {
	            target.path = relative.path;
	          } else {
	            target.path = base.path.slice(0, base.path.lastIndexOf('/') + 1) + relative.path;
	          }
	          target.path = removeDotSegments(target.path);
	        }
	        target.query = relative.query;
	      }
	      // target.authority = base.authority;
	      target.userinfo = base.userinfo;
	      target.host = base.host;
	      target.port = base.port;
	    }
	    target.scheme = base.scheme;
	  }

	  target.fragment = relative.fragment;

	  return target
	}

	/**
	 * @param {import ('./types/index').URIComponent|string} uriA
	 * @param {import ('./types/index').URIComponent|string} uriB
	 * @param {import ('./types/index').Options} options
	 * @returns {boolean}
	 */
	function equal (uriA, uriB, options) {
	  if (typeof uriA === 'string') {
	    uriA = unescape(uriA);
	    uriA = serialize(normalizeComponentEncoding(parse(uriA, options), true), { ...options, skipEscape: true });
	  } else if (typeof uriA === 'object') {
	    uriA = serialize(normalizeComponentEncoding(uriA, true), { ...options, skipEscape: true });
	  }

	  if (typeof uriB === 'string') {
	    uriB = unescape(uriB);
	    uriB = serialize(normalizeComponentEncoding(parse(uriB, options), true), { ...options, skipEscape: true });
	  } else if (typeof uriB === 'object') {
	    uriB = serialize(normalizeComponentEncoding(uriB, true), { ...options, skipEscape: true });
	  }

	  return uriA.toLowerCase() === uriB.toLowerCase()
	}

	/**
	 * @param {Readonly<import('./types/index').URIComponent>} cmpts
	 * @param {import('./types/index').Options} [opts]
	 * @returns {string}
	 */
	function serialize (cmpts, opts) {
	  const component = {
	    host: cmpts.host,
	    scheme: cmpts.scheme,
	    userinfo: cmpts.userinfo,
	    port: cmpts.port,
	    path: cmpts.path,
	    query: cmpts.query,
	    nid: cmpts.nid,
	    nss: cmpts.nss,
	    uuid: cmpts.uuid,
	    fragment: cmpts.fragment,
	    reference: cmpts.reference,
	    resourceName: cmpts.resourceName,
	    secure: cmpts.secure,
	    error: ''
	  };
	  const options = Object.assign({}, opts);
	  const uriTokens = [];

	  // find scheme handler
	  const schemeHandler = getSchemeHandler(options.scheme || component.scheme);

	  // perform scheme specific serialization
	  if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);

	  if (component.path !== undefined) {
	    if (!options.skipEscape) {
	      component.path = escape(component.path);

	      if (component.scheme !== undefined) {
	        component.path = component.path.split('%3A').join(':');
	      }
	    } else {
	      component.path = unescape(component.path);
	    }
	  }

	  if (options.reference !== 'suffix' && component.scheme) {
	    uriTokens.push(component.scheme, ':');
	  }

	  const authority = recomposeAuthority(component);
	  if (authority !== undefined) {
	    if (options.reference !== 'suffix') {
	      uriTokens.push('//');
	    }

	    uriTokens.push(authority);

	    if (component.path && component.path[0] !== '/') {
	      uriTokens.push('/');
	    }
	  }
	  if (component.path !== undefined) {
	    let s = component.path;

	    if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
	      s = removeDotSegments(s);
	    }

	    if (
	      authority === undefined &&
	      s[0] === '/' &&
	      s[1] === '/'
	    ) {
	      // don't allow the path to start with "//"
	      s = '/%2F' + s.slice(2);
	    }

	    uriTokens.push(s);
	  }

	  if (component.query !== undefined) {
	    uriTokens.push('?', component.query);
	  }

	  if (component.fragment !== undefined) {
	    uriTokens.push('#', component.fragment);
	  }
	  return uriTokens.join('')
	}

	const URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;

	/**
	 * @param {string} uri
	 * @param {import('./types/index').Options} [opts]
	 * @returns
	 */
	function parse (uri, opts) {
	  const options = Object.assign({}, opts);
	  /** @type {import('./types/index').URIComponent} */
	  const parsed = {
	    scheme: undefined,
	    userinfo: undefined,
	    host: '',
	    port: undefined,
	    path: '',
	    query: undefined,
	    fragment: undefined
	  };

	  let isIP = false;
	  if (options.reference === 'suffix') {
	    if (options.scheme) {
	      uri = options.scheme + ':' + uri;
	    } else {
	      uri = '//' + uri;
	    }
	  }

	  const matches = uri.match(URI_PARSE);

	  if (matches) {
	    // store each component
	    parsed.scheme = matches[1];
	    parsed.userinfo = matches[3];
	    parsed.host = matches[4];
	    parsed.port = parseInt(matches[5], 10);
	    parsed.path = matches[6] || '';
	    parsed.query = matches[7];
	    parsed.fragment = matches[8];

	    // fix port number
	    if (isNaN(parsed.port)) {
	      parsed.port = matches[5];
	    }
	    if (parsed.host) {
	      const ipv4result = isIPv4(parsed.host);
	      if (ipv4result === false) {
	        const ipv6result = normalizeIPv6(parsed.host);
	        parsed.host = ipv6result.host.toLowerCase();
	        isIP = ipv6result.isIPV6;
	      } else {
	        isIP = true;
	      }
	    }
	    if (parsed.scheme === undefined && parsed.userinfo === undefined && parsed.host === undefined && parsed.port === undefined && parsed.query === undefined && !parsed.path) {
	      parsed.reference = 'same-document';
	    } else if (parsed.scheme === undefined) {
	      parsed.reference = 'relative';
	    } else if (parsed.fragment === undefined) {
	      parsed.reference = 'absolute';
	    } else {
	      parsed.reference = 'uri';
	    }

	    // check for reference errors
	    if (options.reference && options.reference !== 'suffix' && options.reference !== parsed.reference) {
	      parsed.error = parsed.error || 'URI is not a ' + options.reference + ' reference.';
	    }

	    // find scheme handler
	    const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);

	    // check if scheme can't handle IRIs
	    if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
	      // if host component is a domain name
	      if (parsed.host && (options.domainHost || (schemeHandler && schemeHandler.domainHost)) && isIP === false && nonSimpleDomain(parsed.host)) {
	        // convert Unicode IDN -> ASCII IDN
	        try {
	          parsed.host = URL.domainToASCII(parsed.host.toLowerCase());
	        } catch (e) {
	          parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
	        }
	      }
	      // convert IRI -> URI
	    }

	    if (!schemeHandler || (schemeHandler && !schemeHandler.skipNormalize)) {
	      if (uri.indexOf('%') !== -1) {
	        if (parsed.scheme !== undefined) {
	          parsed.scheme = unescape(parsed.scheme);
	        }
	        if (parsed.host !== undefined) {
	          parsed.host = unescape(parsed.host);
	        }
	      }
	      if (parsed.path) {
	        parsed.path = escape(unescape(parsed.path));
	      }
	      if (parsed.fragment) {
	        parsed.fragment = encodeURI(decodeURIComponent(parsed.fragment));
	      }
	    }

	    // perform scheme specific parsing
	    if (schemeHandler && schemeHandler.parse) {
	      schemeHandler.parse(parsed, options);
	    }
	  } else {
	    parsed.error = parsed.error || 'URI can not be parsed.';
	  }
	  return parsed
	}

	const fastUri$1 = {
	  SCHEMES,
	  normalize,
	  resolve,
	  resolveComponent,
	  equal,
	  serialize,
	  parse
	};

	fastUri.exports = fastUri$1;
	fastUri.exports.default = fastUri$1;
	fastUri.exports.fastUri = fastUri$1;
	return fastUri.exports;
}

var hasRequiredUri;

function requireUri () {
	if (hasRequiredUri) return uri;
	hasRequiredUri = 1;
	Object.defineProperty(uri, "__esModule", { value: true });
	const uri$1 = requireFastUri();
	uri$1.code = 'require("ajv/dist/runtime/uri").default';
	uri.default = uri$1;
	
	return uri;
}

var hasRequiredCore$1;

function requireCore$1 () {
	if (hasRequiredCore$1) return core$1;
	hasRequiredCore$1 = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.CodeGen = exports$1.Name = exports$1.nil = exports$1.stringify = exports$1.str = exports$1._ = exports$1.KeywordCxt = void 0;
		var validate_1 = /*@__PURE__*/ requireValidate();
		Object.defineProperty(exports$1, "KeywordCxt", { enumerable: true, get: function () { return validate_1.KeywordCxt; } });
		var codegen_1 = /*@__PURE__*/ requireCodegen();
		Object.defineProperty(exports$1, "_", { enumerable: true, get: function () { return codegen_1._; } });
		Object.defineProperty(exports$1, "str", { enumerable: true, get: function () { return codegen_1.str; } });
		Object.defineProperty(exports$1, "stringify", { enumerable: true, get: function () { return codegen_1.stringify; } });
		Object.defineProperty(exports$1, "nil", { enumerable: true, get: function () { return codegen_1.nil; } });
		Object.defineProperty(exports$1, "Name", { enumerable: true, get: function () { return codegen_1.Name; } });
		Object.defineProperty(exports$1, "CodeGen", { enumerable: true, get: function () { return codegen_1.CodeGen; } });
		const validation_error_1 = /*@__PURE__*/ requireValidation_error();
		const ref_error_1 = /*@__PURE__*/ requireRef_error();
		const rules_1 = /*@__PURE__*/ requireRules();
		const compile_1 = /*@__PURE__*/ requireCompile();
		const codegen_2 = /*@__PURE__*/ requireCodegen();
		const resolve_1 = /*@__PURE__*/ requireResolve();
		const dataType_1 = /*@__PURE__*/ requireDataType();
		const util_1 = /*@__PURE__*/ requireUtil();
		const $dataRefSchema = require$$9;
		const uri_1 = /*@__PURE__*/ requireUri();
		const defaultRegExp = (str, flags) => new RegExp(str, flags);
		defaultRegExp.code = "new RegExp";
		const META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
		const EXT_SCOPE_NAMES = new Set([
		    "validate",
		    "serialize",
		    "parse",
		    "wrapper",
		    "root",
		    "schema",
		    "keyword",
		    "pattern",
		    "formats",
		    "validate$data",
		    "func",
		    "obj",
		    "Error",
		]);
		const removedOptions = {
		    errorDataPath: "",
		    format: "`validateFormats: false` can be used instead.",
		    nullable: '"nullable" keyword is supported by default.',
		    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
		    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
		    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
		    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
		    sourceCode: "Use option `code: {source: true}`",
		    strictDefaults: "It is default now, see option `strict`.",
		    strictKeywords: "It is default now, see option `strict`.",
		    uniqueItems: '"uniqueItems" keyword is always validated.',
		    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
		    cache: "Map is used as cache, schema object as key.",
		    serialize: "Map is used as cache, schema object as key.",
		    ajvErrors: "It is default now.",
		};
		const deprecatedOptions = {
		    ignoreKeywordsWithRef: "",
		    jsPropertySyntax: "",
		    unicode: '"minLength"/"maxLength" account for unicode characters by default.',
		};
		const MAX_EXPRESSION = 200;
		// eslint-disable-next-line complexity
		function requiredOptions(o) {
		    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
		    const s = o.strict;
		    const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
		    const optimize = _optz === true || _optz === undefined ? 1 : _optz || 0;
		    const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
		    const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
		    return {
		        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
		        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
		        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
		        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
		        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
		        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
		        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
		        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
		        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
		        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
		        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
		        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
		        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
		        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
		        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
		        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
		        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
		        uriResolver: uriResolver,
		    };
		}
		class Ajv {
		    constructor(opts = {}) {
		        this.schemas = {};
		        this.refs = {};
		        this.formats = {};
		        this._compilations = new Set();
		        this._loading = {};
		        this._cache = new Map();
		        opts = this.opts = { ...opts, ...requiredOptions(opts) };
		        const { es5, lines } = this.opts.code;
		        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
		        this.logger = getLogger(opts.logger);
		        const formatOpt = opts.validateFormats;
		        opts.validateFormats = false;
		        this.RULES = (0, rules_1.getRules)();
		        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
		        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
		        this._metaOpts = getMetaSchemaOptions.call(this);
		        if (opts.formats)
		            addInitialFormats.call(this);
		        this._addVocabularies();
		        this._addDefaultMetaSchema();
		        if (opts.keywords)
		            addInitialKeywords.call(this, opts.keywords);
		        if (typeof opts.meta == "object")
		            this.addMetaSchema(opts.meta);
		        addInitialSchemas.call(this);
		        opts.validateFormats = formatOpt;
		    }
		    _addVocabularies() {
		        this.addKeyword("$async");
		    }
		    _addDefaultMetaSchema() {
		        const { $data, meta, schemaId } = this.opts;
		        let _dataRefSchema = $dataRefSchema;
		        if (schemaId === "id") {
		            _dataRefSchema = { ...$dataRefSchema };
		            _dataRefSchema.id = _dataRefSchema.$id;
		            delete _dataRefSchema.$id;
		        }
		        if (meta && $data)
		            this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
		    }
		    defaultMeta() {
		        const { meta, schemaId } = this.opts;
		        return (this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : undefined);
		    }
		    validate(schemaKeyRef, // key, ref or schema object
		    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
		    data // to be validated
		    ) {
		        let v;
		        if (typeof schemaKeyRef == "string") {
		            v = this.getSchema(schemaKeyRef);
		            if (!v)
		                throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
		        }
		        else {
		            v = this.compile(schemaKeyRef);
		        }
		        const valid = v(data);
		        if (!("$async" in v))
		            this.errors = v.errors;
		        return valid;
		    }
		    compile(schema, _meta) {
		        const sch = this._addSchema(schema, _meta);
		        return (sch.validate || this._compileSchemaEnv(sch));
		    }
		    compileAsync(schema, meta) {
		        if (typeof this.opts.loadSchema != "function") {
		            throw new Error("options.loadSchema should be a function");
		        }
		        const { loadSchema } = this.opts;
		        return runCompileAsync.call(this, schema, meta);
		        async function runCompileAsync(_schema, _meta) {
		            await loadMetaSchema.call(this, _schema.$schema);
		            const sch = this._addSchema(_schema, _meta);
		            return sch.validate || _compileAsync.call(this, sch);
		        }
		        async function loadMetaSchema($ref) {
		            if ($ref && !this.getSchema($ref)) {
		                await runCompileAsync.call(this, { $ref }, true);
		            }
		        }
		        async function _compileAsync(sch) {
		            try {
		                return this._compileSchemaEnv(sch);
		            }
		            catch (e) {
		                if (!(e instanceof ref_error_1.default))
		                    throw e;
		                checkLoaded.call(this, e);
		                await loadMissingSchema.call(this, e.missingSchema);
		                return _compileAsync.call(this, sch);
		            }
		        }
		        function checkLoaded({ missingSchema: ref, missingRef }) {
		            if (this.refs[ref]) {
		                throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
		            }
		        }
		        async function loadMissingSchema(ref) {
		            const _schema = await _loadSchema.call(this, ref);
		            if (!this.refs[ref])
		                await loadMetaSchema.call(this, _schema.$schema);
		            if (!this.refs[ref])
		                this.addSchema(_schema, ref, meta);
		        }
		        async function _loadSchema(ref) {
		            const p = this._loading[ref];
		            if (p)
		                return p;
		            try {
		                return await (this._loading[ref] = loadSchema(ref));
		            }
		            finally {
		                delete this._loading[ref];
		            }
		        }
		    }
		    // Adds schema to the instance
		    addSchema(schema, // If array is passed, `key` will be ignored
		    key, // Optional schema key. Can be passed to `validate` method instead of schema object or id/ref. One schema per instance can have empty `id` and `key`.
		    _meta, // true if schema is a meta-schema. Used internally, addMetaSchema should be used instead.
		    _validateSchema = this.opts.validateSchema // false to skip schema validation. Used internally, option validateSchema should be used instead.
		    ) {
		        if (Array.isArray(schema)) {
		            for (const sch of schema)
		                this.addSchema(sch, undefined, _meta, _validateSchema);
		            return this;
		        }
		        let id;
		        if (typeof schema === "object") {
		            const { schemaId } = this.opts;
		            id = schema[schemaId];
		            if (id !== undefined && typeof id != "string") {
		                throw new Error(`schema ${schemaId} must be string`);
		            }
		        }
		        key = (0, resolve_1.normalizeId)(key || id);
		        this._checkUnique(key);
		        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
		        return this;
		    }
		    // Add schema that will be used to validate other schemas
		    // options in META_IGNORE_OPTIONS are alway set to false
		    addMetaSchema(schema, key, // schema key
		    _validateSchema = this.opts.validateSchema // false to skip schema validation, can be used to override validateSchema option for meta-schema
		    ) {
		        this.addSchema(schema, key, true, _validateSchema);
		        return this;
		    }
		    //  Validate schema against its meta-schema
		    validateSchema(schema, throwOrLogError) {
		        if (typeof schema == "boolean")
		            return true;
		        let $schema;
		        $schema = schema.$schema;
		        if ($schema !== undefined && typeof $schema != "string") {
		            throw new Error("$schema must be a string");
		        }
		        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
		        if (!$schema) {
		            this.logger.warn("meta-schema not available");
		            this.errors = null;
		            return true;
		        }
		        const valid = this.validate($schema, schema);
		        if (!valid && throwOrLogError) {
		            const message = "schema is invalid: " + this.errorsText();
		            if (this.opts.validateSchema === "log")
		                this.logger.error(message);
		            else
		                throw new Error(message);
		        }
		        return valid;
		    }
		    // Get compiled schema by `key` or `ref`.
		    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
		    getSchema(keyRef) {
		        let sch;
		        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
		            keyRef = sch;
		        if (sch === undefined) {
		            const { schemaId } = this.opts;
		            const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
		            sch = compile_1.resolveSchema.call(this, root, keyRef);
		            if (!sch)
		                return;
		            this.refs[keyRef] = sch;
		        }
		        return (sch.validate || this._compileSchemaEnv(sch));
		    }
		    // Remove cached schema(s).
		    // If no parameter is passed all schemas but meta-schemas are removed.
		    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
		    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
		    removeSchema(schemaKeyRef) {
		        if (schemaKeyRef instanceof RegExp) {
		            this._removeAllSchemas(this.schemas, schemaKeyRef);
		            this._removeAllSchemas(this.refs, schemaKeyRef);
		            return this;
		        }
		        switch (typeof schemaKeyRef) {
		            case "undefined":
		                this._removeAllSchemas(this.schemas);
		                this._removeAllSchemas(this.refs);
		                this._cache.clear();
		                return this;
		            case "string": {
		                const sch = getSchEnv.call(this, schemaKeyRef);
		                if (typeof sch == "object")
		                    this._cache.delete(sch.schema);
		                delete this.schemas[schemaKeyRef];
		                delete this.refs[schemaKeyRef];
		                return this;
		            }
		            case "object": {
		                const cacheKey = schemaKeyRef;
		                this._cache.delete(cacheKey);
		                let id = schemaKeyRef[this.opts.schemaId];
		                if (id) {
		                    id = (0, resolve_1.normalizeId)(id);
		                    delete this.schemas[id];
		                    delete this.refs[id];
		                }
		                return this;
		            }
		            default:
		                throw new Error("ajv.removeSchema: invalid parameter");
		        }
		    }
		    // add "vocabulary" - a collection of keywords
		    addVocabulary(definitions) {
		        for (const def of definitions)
		            this.addKeyword(def);
		        return this;
		    }
		    addKeyword(kwdOrDef, def // deprecated
		    ) {
		        let keyword;
		        if (typeof kwdOrDef == "string") {
		            keyword = kwdOrDef;
		            if (typeof def == "object") {
		                this.logger.warn("these parameters are deprecated, see docs for addKeyword");
		                def.keyword = keyword;
		            }
		        }
		        else if (typeof kwdOrDef == "object" && def === undefined) {
		            def = kwdOrDef;
		            keyword = def.keyword;
		            if (Array.isArray(keyword) && !keyword.length) {
		                throw new Error("addKeywords: keyword must be string or non-empty array");
		            }
		        }
		        else {
		            throw new Error("invalid addKeywords parameters");
		        }
		        checkKeyword.call(this, keyword, def);
		        if (!def) {
		            (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
		            return this;
		        }
		        keywordMetaschema.call(this, def);
		        const definition = {
		            ...def,
		            type: (0, dataType_1.getJSONTypes)(def.type),
		            schemaType: (0, dataType_1.getJSONTypes)(def.schemaType),
		        };
		        (0, util_1.eachItem)(keyword, definition.type.length === 0
		            ? (k) => addRule.call(this, k, definition)
		            : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
		        return this;
		    }
		    getKeyword(keyword) {
		        const rule = this.RULES.all[keyword];
		        return typeof rule == "object" ? rule.definition : !!rule;
		    }
		    // Remove keyword
		    removeKeyword(keyword) {
		        // TODO return type should be Ajv
		        const { RULES } = this;
		        delete RULES.keywords[keyword];
		        delete RULES.all[keyword];
		        for (const group of RULES.rules) {
		            const i = group.rules.findIndex((rule) => rule.keyword === keyword);
		            if (i >= 0)
		                group.rules.splice(i, 1);
		        }
		        return this;
		    }
		    // Add format
		    addFormat(name, format) {
		        if (typeof format == "string")
		            format = new RegExp(format);
		        this.formats[name] = format;
		        return this;
		    }
		    errorsText(errors = this.errors, // optional array of validation errors
		    { separator = ", ", dataVar = "data" } = {} // optional options with properties `separator` and `dataVar`
		    ) {
		        if (!errors || errors.length === 0)
		            return "No errors";
		        return errors
		            .map((e) => `${dataVar}${e.instancePath} ${e.message}`)
		            .reduce((text, msg) => text + separator + msg);
		    }
		    $dataMetaSchema(metaSchema, keywordsJsonPointers) {
		        const rules = this.RULES.all;
		        metaSchema = JSON.parse(JSON.stringify(metaSchema));
		        for (const jsonPointer of keywordsJsonPointers) {
		            const segments = jsonPointer.split("/").slice(1); // first segment is an empty string
		            let keywords = metaSchema;
		            for (const seg of segments)
		                keywords = keywords[seg];
		            for (const key in rules) {
		                const rule = rules[key];
		                if (typeof rule != "object")
		                    continue;
		                const { $data } = rule.definition;
		                const schema = keywords[key];
		                if ($data && schema)
		                    keywords[key] = schemaOrData(schema);
		            }
		        }
		        return metaSchema;
		    }
		    _removeAllSchemas(schemas, regex) {
		        for (const keyRef in schemas) {
		            const sch = schemas[keyRef];
		            if (!regex || regex.test(keyRef)) {
		                if (typeof sch == "string") {
		                    delete schemas[keyRef];
		                }
		                else if (sch && !sch.meta) {
		                    this._cache.delete(sch.schema);
		                    delete schemas[keyRef];
		                }
		            }
		        }
		    }
		    _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
		        let id;
		        const { schemaId } = this.opts;
		        if (typeof schema == "object") {
		            id = schema[schemaId];
		        }
		        else {
		            if (this.opts.jtd)
		                throw new Error("schema must be object");
		            else if (typeof schema != "boolean")
		                throw new Error("schema must be object or boolean");
		        }
		        let sch = this._cache.get(schema);
		        if (sch !== undefined)
		            return sch;
		        baseId = (0, resolve_1.normalizeId)(id || baseId);
		        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
		        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
		        this._cache.set(sch.schema, sch);
		        if (addSchema && !baseId.startsWith("#")) {
		            // TODO atm it is allowed to overwrite schemas without id (instead of not adding them)
		            if (baseId)
		                this._checkUnique(baseId);
		            this.refs[baseId] = sch;
		        }
		        if (validateSchema)
		            this.validateSchema(schema, true);
		        return sch;
		    }
		    _checkUnique(id) {
		        if (this.schemas[id] || this.refs[id]) {
		            throw new Error(`schema with key or id "${id}" already exists`);
		        }
		    }
		    _compileSchemaEnv(sch) {
		        if (sch.meta)
		            this._compileMetaSchema(sch);
		        else
		            compile_1.compileSchema.call(this, sch);
		        /* istanbul ignore if */
		        if (!sch.validate)
		            throw new Error("ajv implementation error");
		        return sch.validate;
		    }
		    _compileMetaSchema(sch) {
		        const currentOpts = this.opts;
		        this.opts = this._metaOpts;
		        try {
		            compile_1.compileSchema.call(this, sch);
		        }
		        finally {
		            this.opts = currentOpts;
		        }
		    }
		}
		Ajv.ValidationError = validation_error_1.default;
		Ajv.MissingRefError = ref_error_1.default;
		exports$1.default = Ajv;
		function checkOptions(checkOpts, options, msg, log = "error") {
		    for (const key in checkOpts) {
		        const opt = key;
		        if (opt in options)
		            this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
		    }
		}
		function getSchEnv(keyRef) {
		    keyRef = (0, resolve_1.normalizeId)(keyRef); // TODO tests fail without this line
		    return this.schemas[keyRef] || this.refs[keyRef];
		}
		function addInitialSchemas() {
		    const optsSchemas = this.opts.schemas;
		    if (!optsSchemas)
		        return;
		    if (Array.isArray(optsSchemas))
		        this.addSchema(optsSchemas);
		    else
		        for (const key in optsSchemas)
		            this.addSchema(optsSchemas[key], key);
		}
		function addInitialFormats() {
		    for (const name in this.opts.formats) {
		        const format = this.opts.formats[name];
		        if (format)
		            this.addFormat(name, format);
		    }
		}
		function addInitialKeywords(defs) {
		    if (Array.isArray(defs)) {
		        this.addVocabulary(defs);
		        return;
		    }
		    this.logger.warn("keywords option as map is deprecated, pass array");
		    for (const keyword in defs) {
		        const def = defs[keyword];
		        if (!def.keyword)
		            def.keyword = keyword;
		        this.addKeyword(def);
		    }
		}
		function getMetaSchemaOptions() {
		    const metaOpts = { ...this.opts };
		    for (const opt of META_IGNORE_OPTIONS)
		        delete metaOpts[opt];
		    return metaOpts;
		}
		const noLogs = { log() { }, warn() { }, error() { } };
		function getLogger(logger) {
		    if (logger === false)
		        return noLogs;
		    if (logger === undefined)
		        return console;
		    if (logger.log && logger.warn && logger.error)
		        return logger;
		    throw new Error("logger must implement log, warn and error methods");
		}
		const KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
		function checkKeyword(keyword, def) {
		    const { RULES } = this;
		    (0, util_1.eachItem)(keyword, (kwd) => {
		        if (RULES.keywords[kwd])
		            throw new Error(`Keyword ${kwd} is already defined`);
		        if (!KEYWORD_NAME.test(kwd))
		            throw new Error(`Keyword ${kwd} has invalid name`);
		    });
		    if (!def)
		        return;
		    if (def.$data && !("code" in def || "validate" in def)) {
		        throw new Error('$data keyword must have "code" or "validate" function');
		    }
		}
		function addRule(keyword, definition, dataType) {
		    var _a;
		    const post = definition === null || definition === void 0 ? void 0 : definition.post;
		    if (dataType && post)
		        throw new Error('keyword with "post" flag cannot have "type"');
		    const { RULES } = this;
		    let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
		    if (!ruleGroup) {
		        ruleGroup = { type: dataType, rules: [] };
		        RULES.rules.push(ruleGroup);
		    }
		    RULES.keywords[keyword] = true;
		    if (!definition)
		        return;
		    const rule = {
		        keyword,
		        definition: {
		            ...definition,
		            type: (0, dataType_1.getJSONTypes)(definition.type),
		            schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType),
		        },
		    };
		    if (definition.before)
		        addBeforeRule.call(this, ruleGroup, rule, definition.before);
		    else
		        ruleGroup.rules.push(rule);
		    RULES.all[keyword] = rule;
		    (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
		}
		function addBeforeRule(ruleGroup, rule, before) {
		    const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
		    if (i >= 0) {
		        ruleGroup.rules.splice(i, 0, rule);
		    }
		    else {
		        ruleGroup.rules.push(rule);
		        this.logger.warn(`rule ${before} is not defined`);
		    }
		}
		function keywordMetaschema(def) {
		    let { metaSchema } = def;
		    if (metaSchema === undefined)
		        return;
		    if (def.$data && this.opts.$data)
		        metaSchema = schemaOrData(metaSchema);
		    def.validateSchema = this.compile(metaSchema, true);
		}
		const $dataRef = {
		    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
		};
		function schemaOrData(schema) {
		    return { anyOf: [schema, $dataRef] };
		}
		
	} (core$1));
	return core$1;
}

var draft7 = {};

var core = {};

var id = {};

var hasRequiredId;

function requireId () {
	if (hasRequiredId) return id;
	hasRequiredId = 1;
	Object.defineProperty(id, "__esModule", { value: true });
	const def = {
	    keyword: "id",
	    code() {
	        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
	    },
	};
	id.default = def;
	
	return id;
}

var ref = {};

var hasRequiredRef;

function requireRef () {
	if (hasRequiredRef) return ref;
	hasRequiredRef = 1;
	Object.defineProperty(ref, "__esModule", { value: true });
	ref.callRef = ref.getValidate = void 0;
	const ref_error_1 = /*@__PURE__*/ requireRef_error();
	const code_1 = /*@__PURE__*/ requireCode();
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const names_1 = /*@__PURE__*/ requireNames();
	const compile_1 = /*@__PURE__*/ requireCompile();
	const util_1 = /*@__PURE__*/ requireUtil();
	const def = {
	    keyword: "$ref",
	    schemaType: "string",
	    code(cxt) {
	        const { gen, schema: $ref, it } = cxt;
	        const { baseId, schemaEnv: env, validateName, opts, self } = it;
	        const { root } = env;
	        if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
	            return callRootRef();
	        const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
	        if (schOrEnv === undefined)
	            throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
	        if (schOrEnv instanceof compile_1.SchemaEnv)
	            return callValidate(schOrEnv);
	        return inlineRefSchema(schOrEnv);
	        function callRootRef() {
	            if (env === root)
	                return callRef(cxt, validateName, env, env.$async);
	            const rootName = gen.scopeValue("root", { ref: root });
	            return callRef(cxt, (0, codegen_1._) `${rootName}.validate`, root, root.$async);
	        }
	        function callValidate(sch) {
	            const v = getValidate(cxt, sch);
	            callRef(cxt, v, sch, sch.$async);
	        }
	        function inlineRefSchema(sch) {
	            const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
	            const valid = gen.name("valid");
	            const schCxt = cxt.subschema({
	                schema: sch,
	                dataTypes: [],
	                schemaPath: codegen_1.nil,
	                topSchemaRef: schName,
	                errSchemaPath: $ref,
	            }, valid);
	            cxt.mergeEvaluated(schCxt);
	            cxt.ok(valid);
	        }
	    },
	};
	function getValidate(cxt, sch) {
	    const { gen } = cxt;
	    return sch.validate
	        ? gen.scopeValue("validate", { ref: sch.validate })
	        : (0, codegen_1._) `${gen.scopeValue("wrapper", { ref: sch })}.validate`;
	}
	ref.getValidate = getValidate;
	function callRef(cxt, v, sch, $async) {
	    const { gen, it } = cxt;
	    const { allErrors, schemaEnv: env, opts } = it;
	    const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
	    if ($async)
	        callAsyncRef();
	    else
	        callSyncRef();
	    function callAsyncRef() {
	        if (!env.$async)
	            throw new Error("async schema referenced by sync schema");
	        const valid = gen.let("valid");
	        gen.try(() => {
	            gen.code((0, codegen_1._) `await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
	            addEvaluatedFrom(v); // TODO will not work with async, it has to be returned with the result
	            if (!allErrors)
	                gen.assign(valid, true);
	        }, (e) => {
	            gen.if((0, codegen_1._) `!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
	            addErrorsFrom(e);
	            if (!allErrors)
	                gen.assign(valid, false);
	        });
	        cxt.ok(valid);
	    }
	    function callSyncRef() {
	        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
	    }
	    function addErrorsFrom(source) {
	        const errs = (0, codegen_1._) `${source}.errors`;
	        gen.assign(names_1.default.vErrors, (0, codegen_1._) `${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`); // TODO tagged
	        gen.assign(names_1.default.errors, (0, codegen_1._) `${names_1.default.vErrors}.length`);
	    }
	    function addEvaluatedFrom(source) {
	        var _a;
	        if (!it.opts.unevaluated)
	            return;
	        const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
	        // TODO refactor
	        if (it.props !== true) {
	            if (schEvaluated && !schEvaluated.dynamicProps) {
	                if (schEvaluated.props !== undefined) {
	                    it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
	                }
	            }
	            else {
	                const props = gen.var("props", (0, codegen_1._) `${source}.evaluated.props`);
	                it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
	            }
	        }
	        if (it.items !== true) {
	            if (schEvaluated && !schEvaluated.dynamicItems) {
	                if (schEvaluated.items !== undefined) {
	                    it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
	                }
	            }
	            else {
	                const items = gen.var("items", (0, codegen_1._) `${source}.evaluated.items`);
	                it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
	            }
	        }
	    }
	}
	ref.callRef = callRef;
	ref.default = def;
	
	return ref;
}

var hasRequiredCore;

function requireCore () {
	if (hasRequiredCore) return core;
	hasRequiredCore = 1;
	Object.defineProperty(core, "__esModule", { value: true });
	const id_1 = /*@__PURE__*/ requireId();
	const ref_1 = /*@__PURE__*/ requireRef();
	const core$1 = [
	    "$schema",
	    "$id",
	    "$defs",
	    "$vocabulary",
	    { keyword: "$comment" },
	    "definitions",
	    id_1.default,
	    ref_1.default,
	];
	core.default = core$1;
	
	return core;
}

var validation = {};

var limitNumber = {};

var hasRequiredLimitNumber;

function requireLimitNumber () {
	if (hasRequiredLimitNumber) return limitNumber;
	hasRequiredLimitNumber = 1;
	Object.defineProperty(limitNumber, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const ops = codegen_1.operators;
	const KWDs = {
	    maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
	    minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
	    exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
	    exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE },
	};
	const error = {
	    message: ({ keyword, schemaCode }) => (0, codegen_1.str) `must be ${KWDs[keyword].okStr} ${schemaCode}`,
	    params: ({ keyword, schemaCode }) => (0, codegen_1._) `{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`,
	};
	const def = {
	    keyword: Object.keys(KWDs),
	    type: "number",
	    schemaType: "number",
	    $data: true,
	    error,
	    code(cxt) {
	        const { keyword, data, schemaCode } = cxt;
	        cxt.fail$data((0, codegen_1._) `${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
	    },
	};
	limitNumber.default = def;
	
	return limitNumber;
}

var multipleOf = {};

var hasRequiredMultipleOf;

function requireMultipleOf () {
	if (hasRequiredMultipleOf) return multipleOf;
	hasRequiredMultipleOf = 1;
	Object.defineProperty(multipleOf, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const error = {
	    message: ({ schemaCode }) => (0, codegen_1.str) `must be multiple of ${schemaCode}`,
	    params: ({ schemaCode }) => (0, codegen_1._) `{multipleOf: ${schemaCode}}`,
	};
	const def = {
	    keyword: "multipleOf",
	    type: "number",
	    schemaType: "number",
	    $data: true,
	    error,
	    code(cxt) {
	        const { gen, data, schemaCode, it } = cxt;
	        // const bdt = bad$DataType(schemaCode, <string>def.schemaType, $data)
	        const prec = it.opts.multipleOfPrecision;
	        const res = gen.let("res");
	        const invalid = prec
	            ? (0, codegen_1._) `Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}`
	            : (0, codegen_1._) `${res} !== parseInt(${res})`;
	        cxt.fail$data((0, codegen_1._) `(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
	    },
	};
	multipleOf.default = def;
	
	return multipleOf;
}

var limitLength = {};

var ucs2length = {};

var hasRequiredUcs2length;

function requireUcs2length () {
	if (hasRequiredUcs2length) return ucs2length;
	hasRequiredUcs2length = 1;
	Object.defineProperty(ucs2length, "__esModule", { value: true });
	// https://mathiasbynens.be/notes/javascript-encoding
	// https://github.com/bestiejs/punycode.js - punycode.ucs2.decode
	function ucs2length$1(str) {
	    const len = str.length;
	    let length = 0;
	    let pos = 0;
	    let value;
	    while (pos < len) {
	        length++;
	        value = str.charCodeAt(pos++);
	        if (value >= 0xd800 && value <= 0xdbff && pos < len) {
	            // high surrogate, and there is a next character
	            value = str.charCodeAt(pos);
	            if ((value & 0xfc00) === 0xdc00)
	                pos++; // low surrogate
	        }
	    }
	    return length;
	}
	ucs2length.default = ucs2length$1;
	ucs2length$1.code = 'require("ajv/dist/runtime/ucs2length").default';
	
	return ucs2length;
}

var hasRequiredLimitLength;

function requireLimitLength () {
	if (hasRequiredLimitLength) return limitLength;
	hasRequiredLimitLength = 1;
	Object.defineProperty(limitLength, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	const ucs2length_1 = /*@__PURE__*/ requireUcs2length();
	const error = {
	    message({ keyword, schemaCode }) {
	        const comp = keyword === "maxLength" ? "more" : "fewer";
	        return (0, codegen_1.str) `must NOT have ${comp} than ${schemaCode} characters`;
	    },
	    params: ({ schemaCode }) => (0, codegen_1._) `{limit: ${schemaCode}}`,
	};
	const def = {
	    keyword: ["maxLength", "minLength"],
	    type: "string",
	    schemaType: "number",
	    $data: true,
	    error,
	    code(cxt) {
	        const { keyword, data, schemaCode, it } = cxt;
	        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
	        const len = it.opts.unicode === false ? (0, codegen_1._) `${data}.length` : (0, codegen_1._) `${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
	        cxt.fail$data((0, codegen_1._) `${len} ${op} ${schemaCode}`);
	    },
	};
	limitLength.default = def;
	
	return limitLength;
}

var pattern = {};

var hasRequiredPattern;

function requirePattern () {
	if (hasRequiredPattern) return pattern;
	hasRequiredPattern = 1;
	Object.defineProperty(pattern, "__esModule", { value: true });
	const code_1 = /*@__PURE__*/ requireCode();
	const util_1 = /*@__PURE__*/ requireUtil();
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const error = {
	    message: ({ schemaCode }) => (0, codegen_1.str) `must match pattern "${schemaCode}"`,
	    params: ({ schemaCode }) => (0, codegen_1._) `{pattern: ${schemaCode}}`,
	};
	const def = {
	    keyword: "pattern",
	    type: "string",
	    schemaType: "string",
	    $data: true,
	    error,
	    code(cxt) {
	        const { gen, data, $data, schema, schemaCode, it } = cxt;
	        const u = it.opts.unicodeRegExp ? "u" : "";
	        if ($data) {
	            const { regExp } = it.opts.code;
	            const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._) `new RegExp` : (0, util_1.useFunc)(gen, regExp);
	            const valid = gen.let("valid");
	            gen.try(() => gen.assign(valid, (0, codegen_1._) `${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
	            cxt.fail$data((0, codegen_1._) `!${valid}`);
	        }
	        else {
	            const regExp = (0, code_1.usePattern)(cxt, schema);
	            cxt.fail$data((0, codegen_1._) `!${regExp}.test(${data})`);
	        }
	    },
	};
	pattern.default = def;
	
	return pattern;
}

var limitProperties = {};

var hasRequiredLimitProperties;

function requireLimitProperties () {
	if (hasRequiredLimitProperties) return limitProperties;
	hasRequiredLimitProperties = 1;
	Object.defineProperty(limitProperties, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const error = {
	    message({ keyword, schemaCode }) {
	        const comp = keyword === "maxProperties" ? "more" : "fewer";
	        return (0, codegen_1.str) `must NOT have ${comp} than ${schemaCode} properties`;
	    },
	    params: ({ schemaCode }) => (0, codegen_1._) `{limit: ${schemaCode}}`,
	};
	const def = {
	    keyword: ["maxProperties", "minProperties"],
	    type: "object",
	    schemaType: "number",
	    $data: true,
	    error,
	    code(cxt) {
	        const { keyword, data, schemaCode } = cxt;
	        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
	        cxt.fail$data((0, codegen_1._) `Object.keys(${data}).length ${op} ${schemaCode}`);
	    },
	};
	limitProperties.default = def;
	
	return limitProperties;
}

var required = {};

var hasRequiredRequired;

function requireRequired () {
	if (hasRequiredRequired) return required;
	hasRequiredRequired = 1;
	Object.defineProperty(required, "__esModule", { value: true });
	const code_1 = /*@__PURE__*/ requireCode();
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	const error = {
	    message: ({ params: { missingProperty } }) => (0, codegen_1.str) `must have required property '${missingProperty}'`,
	    params: ({ params: { missingProperty } }) => (0, codegen_1._) `{missingProperty: ${missingProperty}}`,
	};
	const def = {
	    keyword: "required",
	    type: "object",
	    schemaType: "array",
	    $data: true,
	    error,
	    code(cxt) {
	        const { gen, schema, schemaCode, data, $data, it } = cxt;
	        const { opts } = it;
	        if (!$data && schema.length === 0)
	            return;
	        const useLoop = schema.length >= opts.loopRequired;
	        if (it.allErrors)
	            allErrorsMode();
	        else
	            exitOnErrorMode();
	        if (opts.strictRequired) {
	            const props = cxt.parentSchema.properties;
	            const { definedProperties } = cxt.it;
	            for (const requiredKey of schema) {
	                if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === undefined && !definedProperties.has(requiredKey)) {
	                    const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
	                    const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
	                    (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
	                }
	            }
	        }
	        function allErrorsMode() {
	            if (useLoop || $data) {
	                cxt.block$data(codegen_1.nil, loopAllRequired);
	            }
	            else {
	                for (const prop of schema) {
	                    (0, code_1.checkReportMissingProp)(cxt, prop);
	                }
	            }
	        }
	        function exitOnErrorMode() {
	            const missing = gen.let("missing");
	            if (useLoop || $data) {
	                const valid = gen.let("valid", true);
	                cxt.block$data(valid, () => loopUntilMissing(missing, valid));
	                cxt.ok(valid);
	            }
	            else {
	                gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
	                (0, code_1.reportMissingProp)(cxt, missing);
	                gen.else();
	            }
	        }
	        function loopAllRequired() {
	            gen.forOf("prop", schemaCode, (prop) => {
	                cxt.setParams({ missingProperty: prop });
	                gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
	            });
	        }
	        function loopUntilMissing(missing, valid) {
	            cxt.setParams({ missingProperty: missing });
	            gen.forOf(missing, schemaCode, () => {
	                gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
	                gen.if((0, codegen_1.not)(valid), () => {
	                    cxt.error();
	                    gen.break();
	                });
	            }, codegen_1.nil);
	        }
	    },
	};
	required.default = def;
	
	return required;
}

var limitItems = {};

var hasRequiredLimitItems;

function requireLimitItems () {
	if (hasRequiredLimitItems) return limitItems;
	hasRequiredLimitItems = 1;
	Object.defineProperty(limitItems, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const error = {
	    message({ keyword, schemaCode }) {
	        const comp = keyword === "maxItems" ? "more" : "fewer";
	        return (0, codegen_1.str) `must NOT have ${comp} than ${schemaCode} items`;
	    },
	    params: ({ schemaCode }) => (0, codegen_1._) `{limit: ${schemaCode}}`,
	};
	const def = {
	    keyword: ["maxItems", "minItems"],
	    type: "array",
	    schemaType: "number",
	    $data: true,
	    error,
	    code(cxt) {
	        const { keyword, data, schemaCode } = cxt;
	        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
	        cxt.fail$data((0, codegen_1._) `${data}.length ${op} ${schemaCode}`);
	    },
	};
	limitItems.default = def;
	
	return limitItems;
}

var uniqueItems = {};

var equal = {};

var hasRequiredEqual;

function requireEqual () {
	if (hasRequiredEqual) return equal;
	hasRequiredEqual = 1;
	Object.defineProperty(equal, "__esModule", { value: true });
	// https://github.com/ajv-validator/ajv/issues/889
	const equal$1 = requireFastDeepEqual();
	equal$1.code = 'require("ajv/dist/runtime/equal").default';
	equal.default = equal$1;
	
	return equal;
}

var hasRequiredUniqueItems;

function requireUniqueItems () {
	if (hasRequiredUniqueItems) return uniqueItems;
	hasRequiredUniqueItems = 1;
	Object.defineProperty(uniqueItems, "__esModule", { value: true });
	const dataType_1 = /*@__PURE__*/ requireDataType();
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	const equal_1 = /*@__PURE__*/ requireEqual();
	const error = {
	    message: ({ params: { i, j } }) => (0, codegen_1.str) `must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
	    params: ({ params: { i, j } }) => (0, codegen_1._) `{i: ${i}, j: ${j}}`,
	};
	const def = {
	    keyword: "uniqueItems",
	    type: "array",
	    schemaType: "boolean",
	    $data: true,
	    error,
	    code(cxt) {
	        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
	        if (!$data && !schema)
	            return;
	        const valid = gen.let("valid");
	        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
	        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._) `${schemaCode} === false`);
	        cxt.ok(valid);
	        function validateUniqueItems() {
	            const i = gen.let("i", (0, codegen_1._) `${data}.length`);
	            const j = gen.let("j");
	            cxt.setParams({ i, j });
	            gen.assign(valid, true);
	            gen.if((0, codegen_1._) `${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
	        }
	        function canOptimize() {
	            return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
	        }
	        function loopN(i, j) {
	            const item = gen.name("item");
	            const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
	            const indices = gen.const("indices", (0, codegen_1._) `{}`);
	            gen.for((0, codegen_1._) `;${i}--;`, () => {
	                gen.let(item, (0, codegen_1._) `${data}[${i}]`);
	                gen.if(wrongType, (0, codegen_1._) `continue`);
	                if (itemTypes.length > 1)
	                    gen.if((0, codegen_1._) `typeof ${item} == "string"`, (0, codegen_1._) `${item} += "_"`);
	                gen
	                    .if((0, codegen_1._) `typeof ${indices}[${item}] == "number"`, () => {
	                    gen.assign(j, (0, codegen_1._) `${indices}[${item}]`);
	                    cxt.error();
	                    gen.assign(valid, false).break();
	                })
	                    .code((0, codegen_1._) `${indices}[${item}] = ${i}`);
	            });
	        }
	        function loopN2(i, j) {
	            const eql = (0, util_1.useFunc)(gen, equal_1.default);
	            const outer = gen.name("outer");
	            gen.label(outer).for((0, codegen_1._) `;${i}--;`, () => gen.for((0, codegen_1._) `${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._) `${eql}(${data}[${i}], ${data}[${j}])`, () => {
	                cxt.error();
	                gen.assign(valid, false).break(outer);
	            })));
	        }
	    },
	};
	uniqueItems.default = def;
	
	return uniqueItems;
}

var _const = {};

var hasRequired_const;

function require_const () {
	if (hasRequired_const) return _const;
	hasRequired_const = 1;
	Object.defineProperty(_const, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	const equal_1 = /*@__PURE__*/ requireEqual();
	const error = {
	    message: "must be equal to constant",
	    params: ({ schemaCode }) => (0, codegen_1._) `{allowedValue: ${schemaCode}}`,
	};
	const def = {
	    keyword: "const",
	    $data: true,
	    error,
	    code(cxt) {
	        const { gen, data, $data, schemaCode, schema } = cxt;
	        if ($data || (schema && typeof schema == "object")) {
	            cxt.fail$data((0, codegen_1._) `!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
	        }
	        else {
	            cxt.fail((0, codegen_1._) `${schema} !== ${data}`);
	        }
	    },
	};
	_const.default = def;
	
	return _const;
}

var _enum = {};

var hasRequired_enum;

function require_enum () {
	if (hasRequired_enum) return _enum;
	hasRequired_enum = 1;
	Object.defineProperty(_enum, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	const equal_1 = /*@__PURE__*/ requireEqual();
	const error = {
	    message: "must be equal to one of the allowed values",
	    params: ({ schemaCode }) => (0, codegen_1._) `{allowedValues: ${schemaCode}}`,
	};
	const def = {
	    keyword: "enum",
	    schemaType: "array",
	    $data: true,
	    error,
	    code(cxt) {
	        const { gen, data, $data, schema, schemaCode, it } = cxt;
	        if (!$data && schema.length === 0)
	            throw new Error("enum must have non-empty array");
	        const useLoop = schema.length >= it.opts.loopEnum;
	        let eql;
	        const getEql = () => (eql !== null && eql !== void 0 ? eql : (eql = (0, util_1.useFunc)(gen, equal_1.default)));
	        let valid;
	        if (useLoop || $data) {
	            valid = gen.let("valid");
	            cxt.block$data(valid, loopEnum);
	        }
	        else {
	            /* istanbul ignore if */
	            if (!Array.isArray(schema))
	                throw new Error("ajv implementation error");
	            const vSchema = gen.const("vSchema", schemaCode);
	            valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
	        }
	        cxt.pass(valid);
	        function loopEnum() {
	            gen.assign(valid, false);
	            gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._) `${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
	        }
	        function equalCode(vSchema, i) {
	            const sch = schema[i];
	            return typeof sch === "object" && sch !== null
	                ? (0, codegen_1._) `${getEql()}(${data}, ${vSchema}[${i}])`
	                : (0, codegen_1._) `${data} === ${sch}`;
	        }
	    },
	};
	_enum.default = def;
	
	return _enum;
}

var hasRequiredValidation;

function requireValidation () {
	if (hasRequiredValidation) return validation;
	hasRequiredValidation = 1;
	Object.defineProperty(validation, "__esModule", { value: true });
	const limitNumber_1 = /*@__PURE__*/ requireLimitNumber();
	const multipleOf_1 = /*@__PURE__*/ requireMultipleOf();
	const limitLength_1 = /*@__PURE__*/ requireLimitLength();
	const pattern_1 = /*@__PURE__*/ requirePattern();
	const limitProperties_1 = /*@__PURE__*/ requireLimitProperties();
	const required_1 = /*@__PURE__*/ requireRequired();
	const limitItems_1 = /*@__PURE__*/ requireLimitItems();
	const uniqueItems_1 = /*@__PURE__*/ requireUniqueItems();
	const const_1 = /*@__PURE__*/ require_const();
	const enum_1 = /*@__PURE__*/ require_enum();
	const validation$1 = [
	    // number
	    limitNumber_1.default,
	    multipleOf_1.default,
	    // string
	    limitLength_1.default,
	    pattern_1.default,
	    // object
	    limitProperties_1.default,
	    required_1.default,
	    // array
	    limitItems_1.default,
	    uniqueItems_1.default,
	    // any
	    { keyword: "type", schemaType: ["string", "array"] },
	    { keyword: "nullable", schemaType: "boolean" },
	    const_1.default,
	    enum_1.default,
	];
	validation.default = validation$1;
	
	return validation;
}

var applicator = {};

var additionalItems = {};

var hasRequiredAdditionalItems;

function requireAdditionalItems () {
	if (hasRequiredAdditionalItems) return additionalItems;
	hasRequiredAdditionalItems = 1;
	Object.defineProperty(additionalItems, "__esModule", { value: true });
	additionalItems.validateAdditionalItems = void 0;
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	const error = {
	    message: ({ params: { len } }) => (0, codegen_1.str) `must NOT have more than ${len} items`,
	    params: ({ params: { len } }) => (0, codegen_1._) `{limit: ${len}}`,
	};
	const def = {
	    keyword: "additionalItems",
	    type: "array",
	    schemaType: ["boolean", "object"],
	    before: "uniqueItems",
	    error,
	    code(cxt) {
	        const { parentSchema, it } = cxt;
	        const { items } = parentSchema;
	        if (!Array.isArray(items)) {
	            (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
	            return;
	        }
	        validateAdditionalItems(cxt, items);
	    },
	};
	function validateAdditionalItems(cxt, items) {
	    const { gen, schema, data, keyword, it } = cxt;
	    it.items = true;
	    const len = gen.const("len", (0, codegen_1._) `${data}.length`);
	    if (schema === false) {
	        cxt.setParams({ len: items.length });
	        cxt.pass((0, codegen_1._) `${len} <= ${items.length}`);
	    }
	    else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
	        const valid = gen.var("valid", (0, codegen_1._) `${len} <= ${items.length}`); // TODO var
	        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
	        cxt.ok(valid);
	    }
	    function validateItems(valid) {
	        gen.forRange("i", items.length, len, (i) => {
	            cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
	            if (!it.allErrors)
	                gen.if((0, codegen_1.not)(valid), () => gen.break());
	        });
	    }
	}
	additionalItems.validateAdditionalItems = validateAdditionalItems;
	additionalItems.default = def;
	
	return additionalItems;
}

var prefixItems = {};

var items = {};

var hasRequiredItems;

function requireItems () {
	if (hasRequiredItems) return items;
	hasRequiredItems = 1;
	Object.defineProperty(items, "__esModule", { value: true });
	items.validateTuple = void 0;
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	const code_1 = /*@__PURE__*/ requireCode();
	const def = {
	    keyword: "items",
	    type: "array",
	    schemaType: ["object", "array", "boolean"],
	    before: "uniqueItems",
	    code(cxt) {
	        const { schema, it } = cxt;
	        if (Array.isArray(schema))
	            return validateTuple(cxt, "additionalItems", schema);
	        it.items = true;
	        if ((0, util_1.alwaysValidSchema)(it, schema))
	            return;
	        cxt.ok((0, code_1.validateArray)(cxt));
	    },
	};
	function validateTuple(cxt, extraItems, schArr = cxt.schema) {
	    const { gen, parentSchema, data, keyword, it } = cxt;
	    checkStrictTuple(parentSchema);
	    if (it.opts.unevaluated && schArr.length && it.items !== true) {
	        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
	    }
	    const valid = gen.name("valid");
	    const len = gen.const("len", (0, codegen_1._) `${data}.length`);
	    schArr.forEach((sch, i) => {
	        if ((0, util_1.alwaysValidSchema)(it, sch))
	            return;
	        gen.if((0, codegen_1._) `${len} > ${i}`, () => cxt.subschema({
	            keyword,
	            schemaProp: i,
	            dataProp: i,
	        }, valid));
	        cxt.ok(valid);
	    });
	    function checkStrictTuple(sch) {
	        const { opts, errSchemaPath } = it;
	        const l = schArr.length;
	        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
	        if (opts.strictTuples && !fullTuple) {
	            const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
	            (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
	        }
	    }
	}
	items.validateTuple = validateTuple;
	items.default = def;
	
	return items;
}

var hasRequiredPrefixItems;

function requirePrefixItems () {
	if (hasRequiredPrefixItems) return prefixItems;
	hasRequiredPrefixItems = 1;
	Object.defineProperty(prefixItems, "__esModule", { value: true });
	const items_1 = /*@__PURE__*/ requireItems();
	const def = {
	    keyword: "prefixItems",
	    type: "array",
	    schemaType: ["array"],
	    before: "uniqueItems",
	    code: (cxt) => (0, items_1.validateTuple)(cxt, "items"),
	};
	prefixItems.default = def;
	
	return prefixItems;
}

var items2020 = {};

var hasRequiredItems2020;

function requireItems2020 () {
	if (hasRequiredItems2020) return items2020;
	hasRequiredItems2020 = 1;
	Object.defineProperty(items2020, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	const code_1 = /*@__PURE__*/ requireCode();
	const additionalItems_1 = /*@__PURE__*/ requireAdditionalItems();
	const error = {
	    message: ({ params: { len } }) => (0, codegen_1.str) `must NOT have more than ${len} items`,
	    params: ({ params: { len } }) => (0, codegen_1._) `{limit: ${len}}`,
	};
	const def = {
	    keyword: "items",
	    type: "array",
	    schemaType: ["object", "boolean"],
	    before: "uniqueItems",
	    error,
	    code(cxt) {
	        const { schema, parentSchema, it } = cxt;
	        const { prefixItems } = parentSchema;
	        it.items = true;
	        if ((0, util_1.alwaysValidSchema)(it, schema))
	            return;
	        if (prefixItems)
	            (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
	        else
	            cxt.ok((0, code_1.validateArray)(cxt));
	    },
	};
	items2020.default = def;
	
	return items2020;
}

var contains = {};

var hasRequiredContains;

function requireContains () {
	if (hasRequiredContains) return contains;
	hasRequiredContains = 1;
	Object.defineProperty(contains, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	const error = {
	    message: ({ params: { min, max } }) => max === undefined
	        ? (0, codegen_1.str) `must contain at least ${min} valid item(s)`
	        : (0, codegen_1.str) `must contain at least ${min} and no more than ${max} valid item(s)`,
	    params: ({ params: { min, max } }) => max === undefined ? (0, codegen_1._) `{minContains: ${min}}` : (0, codegen_1._) `{minContains: ${min}, maxContains: ${max}}`,
	};
	const def = {
	    keyword: "contains",
	    type: "array",
	    schemaType: ["object", "boolean"],
	    before: "uniqueItems",
	    trackErrors: true,
	    error,
	    code(cxt) {
	        const { gen, schema, parentSchema, data, it } = cxt;
	        let min;
	        let max;
	        const { minContains, maxContains } = parentSchema;
	        if (it.opts.next) {
	            min = minContains === undefined ? 1 : minContains;
	            max = maxContains;
	        }
	        else {
	            min = 1;
	        }
	        const len = gen.const("len", (0, codegen_1._) `${data}.length`);
	        cxt.setParams({ min, max });
	        if (max === undefined && min === 0) {
	            (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
	            return;
	        }
	        if (max !== undefined && min > max) {
	            (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
	            cxt.fail();
	            return;
	        }
	        if ((0, util_1.alwaysValidSchema)(it, schema)) {
	            let cond = (0, codegen_1._) `${len} >= ${min}`;
	            if (max !== undefined)
	                cond = (0, codegen_1._) `${cond} && ${len} <= ${max}`;
	            cxt.pass(cond);
	            return;
	        }
	        it.items = true;
	        const valid = gen.name("valid");
	        if (max === undefined && min === 1) {
	            validateItems(valid, () => gen.if(valid, () => gen.break()));
	        }
	        else if (min === 0) {
	            gen.let(valid, true);
	            if (max !== undefined)
	                gen.if((0, codegen_1._) `${data}.length > 0`, validateItemsWithCount);
	        }
	        else {
	            gen.let(valid, false);
	            validateItemsWithCount();
	        }
	        cxt.result(valid, () => cxt.reset());
	        function validateItemsWithCount() {
	            const schValid = gen.name("_valid");
	            const count = gen.let("count", 0);
	            validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
	        }
	        function validateItems(_valid, block) {
	            gen.forRange("i", 0, len, (i) => {
	                cxt.subschema({
	                    keyword: "contains",
	                    dataProp: i,
	                    dataPropType: util_1.Type.Num,
	                    compositeRule: true,
	                }, _valid);
	                block();
	            });
	        }
	        function checkLimits(count) {
	            gen.code((0, codegen_1._) `${count}++`);
	            if (max === undefined) {
	                gen.if((0, codegen_1._) `${count} >= ${min}`, () => gen.assign(valid, true).break());
	            }
	            else {
	                gen.if((0, codegen_1._) `${count} > ${max}`, () => gen.assign(valid, false).break());
	                if (min === 1)
	                    gen.assign(valid, true);
	                else
	                    gen.if((0, codegen_1._) `${count} >= ${min}`, () => gen.assign(valid, true));
	            }
	        }
	    },
	};
	contains.default = def;
	
	return contains;
}

var dependencies = {};

var hasRequiredDependencies;

function requireDependencies () {
	if (hasRequiredDependencies) return dependencies;
	hasRequiredDependencies = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.validateSchemaDeps = exports$1.validatePropertyDeps = exports$1.error = void 0;
		const codegen_1 = /*@__PURE__*/ requireCodegen();
		const util_1 = /*@__PURE__*/ requireUtil();
		const code_1 = /*@__PURE__*/ requireCode();
		exports$1.error = {
		    message: ({ params: { property, depsCount, deps } }) => {
		        const property_ies = depsCount === 1 ? "property" : "properties";
		        return (0, codegen_1.str) `must have ${property_ies} ${deps} when property ${property} is present`;
		    },
		    params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._) `{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`, // TODO change to reference
		};
		const def = {
		    keyword: "dependencies",
		    type: "object",
		    schemaType: "object",
		    error: exports$1.error,
		    code(cxt) {
		        const [propDeps, schDeps] = splitDependencies(cxt);
		        validatePropertyDeps(cxt, propDeps);
		        validateSchemaDeps(cxt, schDeps);
		    },
		};
		function splitDependencies({ schema }) {
		    const propertyDeps = {};
		    const schemaDeps = {};
		    for (const key in schema) {
		        if (key === "__proto__")
		            continue;
		        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
		        deps[key] = schema[key];
		    }
		    return [propertyDeps, schemaDeps];
		}
		function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
		    const { gen, data, it } = cxt;
		    if (Object.keys(propertyDeps).length === 0)
		        return;
		    const missing = gen.let("missing");
		    for (const prop in propertyDeps) {
		        const deps = propertyDeps[prop];
		        if (deps.length === 0)
		            continue;
		        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
		        cxt.setParams({
		            property: prop,
		            depsCount: deps.length,
		            deps: deps.join(", "),
		        });
		        if (it.allErrors) {
		            gen.if(hasProperty, () => {
		                for (const depProp of deps) {
		                    (0, code_1.checkReportMissingProp)(cxt, depProp);
		                }
		            });
		        }
		        else {
		            gen.if((0, codegen_1._) `${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
		            (0, code_1.reportMissingProp)(cxt, missing);
		            gen.else();
		        }
		    }
		}
		exports$1.validatePropertyDeps = validatePropertyDeps;
		function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
		    const { gen, data, keyword, it } = cxt;
		    const valid = gen.name("valid");
		    for (const prop in schemaDeps) {
		        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
		            continue;
		        gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties), () => {
		            const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
		            cxt.mergeValidEvaluated(schCxt, valid);
		        }, () => gen.var(valid, true) // TODO var
		        );
		        cxt.ok(valid);
		    }
		}
		exports$1.validateSchemaDeps = validateSchemaDeps;
		exports$1.default = def;
		
	} (dependencies));
	return dependencies;
}

var propertyNames = {};

var hasRequiredPropertyNames;

function requirePropertyNames () {
	if (hasRequiredPropertyNames) return propertyNames;
	hasRequiredPropertyNames = 1;
	Object.defineProperty(propertyNames, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	const error = {
	    message: "property name must be valid",
	    params: ({ params }) => (0, codegen_1._) `{propertyName: ${params.propertyName}}`,
	};
	const def = {
	    keyword: "propertyNames",
	    type: "object",
	    schemaType: ["object", "boolean"],
	    error,
	    code(cxt) {
	        const { gen, schema, data, it } = cxt;
	        if ((0, util_1.alwaysValidSchema)(it, schema))
	            return;
	        const valid = gen.name("valid");
	        gen.forIn("key", data, (key) => {
	            cxt.setParams({ propertyName: key });
	            cxt.subschema({
	                keyword: "propertyNames",
	                data: key,
	                dataTypes: ["string"],
	                propertyName: key,
	                compositeRule: true,
	            }, valid);
	            gen.if((0, codegen_1.not)(valid), () => {
	                cxt.error(true);
	                if (!it.allErrors)
	                    gen.break();
	            });
	        });
	        cxt.ok(valid);
	    },
	};
	propertyNames.default = def;
	
	return propertyNames;
}

var additionalProperties = {};

var hasRequiredAdditionalProperties;

function requireAdditionalProperties () {
	if (hasRequiredAdditionalProperties) return additionalProperties;
	hasRequiredAdditionalProperties = 1;
	Object.defineProperty(additionalProperties, "__esModule", { value: true });
	const code_1 = /*@__PURE__*/ requireCode();
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const names_1 = /*@__PURE__*/ requireNames();
	const util_1 = /*@__PURE__*/ requireUtil();
	const error = {
	    message: "must NOT have additional properties",
	    params: ({ params }) => (0, codegen_1._) `{additionalProperty: ${params.additionalProperty}}`,
	};
	const def = {
	    keyword: "additionalProperties",
	    type: ["object"],
	    schemaType: ["boolean", "object"],
	    allowUndefined: true,
	    trackErrors: true,
	    error,
	    code(cxt) {
	        const { gen, schema, parentSchema, data, errsCount, it } = cxt;
	        /* istanbul ignore if */
	        if (!errsCount)
	            throw new Error("ajv implementation error");
	        const { allErrors, opts } = it;
	        it.props = true;
	        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
	            return;
	        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
	        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
	        checkAdditionalProperties();
	        cxt.ok((0, codegen_1._) `${errsCount} === ${names_1.default.errors}`);
	        function checkAdditionalProperties() {
	            gen.forIn("key", data, (key) => {
	                if (!props.length && !patProps.length)
	                    additionalPropertyCode(key);
	                else
	                    gen.if(isAdditional(key), () => additionalPropertyCode(key));
	            });
	        }
	        function isAdditional(key) {
	            let definedProp;
	            if (props.length > 8) {
	                // TODO maybe an option instead of hard-coded 8?
	                const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
	                definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
	            }
	            else if (props.length) {
	                definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._) `${key} === ${p}`));
	            }
	            else {
	                definedProp = codegen_1.nil;
	            }
	            if (patProps.length) {
	                definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._) `${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
	            }
	            return (0, codegen_1.not)(definedProp);
	        }
	        function deleteAdditional(key) {
	            gen.code((0, codegen_1._) `delete ${data}[${key}]`);
	        }
	        function additionalPropertyCode(key) {
	            if (opts.removeAdditional === "all" || (opts.removeAdditional && schema === false)) {
	                deleteAdditional(key);
	                return;
	            }
	            if (schema === false) {
	                cxt.setParams({ additionalProperty: key });
	                cxt.error();
	                if (!allErrors)
	                    gen.break();
	                return;
	            }
	            if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
	                const valid = gen.name("valid");
	                if (opts.removeAdditional === "failing") {
	                    applyAdditionalSchema(key, valid, false);
	                    gen.if((0, codegen_1.not)(valid), () => {
	                        cxt.reset();
	                        deleteAdditional(key);
	                    });
	                }
	                else {
	                    applyAdditionalSchema(key, valid);
	                    if (!allErrors)
	                        gen.if((0, codegen_1.not)(valid), () => gen.break());
	                }
	            }
	        }
	        function applyAdditionalSchema(key, valid, errors) {
	            const subschema = {
	                keyword: "additionalProperties",
	                dataProp: key,
	                dataPropType: util_1.Type.Str,
	            };
	            if (errors === false) {
	                Object.assign(subschema, {
	                    compositeRule: true,
	                    createErrors: false,
	                    allErrors: false,
	                });
	            }
	            cxt.subschema(subschema, valid);
	        }
	    },
	};
	additionalProperties.default = def;
	
	return additionalProperties;
}

var properties$1 = {};

var hasRequiredProperties;

function requireProperties () {
	if (hasRequiredProperties) return properties$1;
	hasRequiredProperties = 1;
	Object.defineProperty(properties$1, "__esModule", { value: true });
	const validate_1 = /*@__PURE__*/ requireValidate();
	const code_1 = /*@__PURE__*/ requireCode();
	const util_1 = /*@__PURE__*/ requireUtil();
	const additionalProperties_1 = /*@__PURE__*/ requireAdditionalProperties();
	const def = {
	    keyword: "properties",
	    type: "object",
	    schemaType: "object",
	    code(cxt) {
	        const { gen, schema, parentSchema, data, it } = cxt;
	        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === undefined) {
	            additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
	        }
	        const allProps = (0, code_1.allSchemaProperties)(schema);
	        for (const prop of allProps) {
	            it.definedProperties.add(prop);
	        }
	        if (it.opts.unevaluated && allProps.length && it.props !== true) {
	            it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
	        }
	        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
	        if (properties.length === 0)
	            return;
	        const valid = gen.name("valid");
	        for (const prop of properties) {
	            if (hasDefault(prop)) {
	                applyPropertySchema(prop);
	            }
	            else {
	                gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
	                applyPropertySchema(prop);
	                if (!it.allErrors)
	                    gen.else().var(valid, true);
	                gen.endIf();
	            }
	            cxt.it.definedProperties.add(prop);
	            cxt.ok(valid);
	        }
	        function hasDefault(prop) {
	            return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== undefined;
	        }
	        function applyPropertySchema(prop) {
	            cxt.subschema({
	                keyword: "properties",
	                schemaProp: prop,
	                dataProp: prop,
	            }, valid);
	        }
	    },
	};
	properties$1.default = def;
	
	return properties$1;
}

var patternProperties = {};

var hasRequiredPatternProperties;

function requirePatternProperties () {
	if (hasRequiredPatternProperties) return patternProperties;
	hasRequiredPatternProperties = 1;
	Object.defineProperty(patternProperties, "__esModule", { value: true });
	const code_1 = /*@__PURE__*/ requireCode();
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	const util_2 = /*@__PURE__*/ requireUtil();
	const def = {
	    keyword: "patternProperties",
	    type: "object",
	    schemaType: "object",
	    code(cxt) {
	        const { gen, schema, data, parentSchema, it } = cxt;
	        const { opts } = it;
	        const patterns = (0, code_1.allSchemaProperties)(schema);
	        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
	        if (patterns.length === 0 ||
	            (alwaysValidPatterns.length === patterns.length &&
	                (!it.opts.unevaluated || it.props === true))) {
	            return;
	        }
	        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
	        const valid = gen.name("valid");
	        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
	            it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
	        }
	        const { props } = it;
	        validatePatternProperties();
	        function validatePatternProperties() {
	            for (const pat of patterns) {
	                if (checkProperties)
	                    checkMatchingProperties(pat);
	                if (it.allErrors) {
	                    validateProperties(pat);
	                }
	                else {
	                    gen.var(valid, true); // TODO var
	                    validateProperties(pat);
	                    gen.if(valid);
	                }
	            }
	        }
	        function checkMatchingProperties(pat) {
	            for (const prop in checkProperties) {
	                if (new RegExp(pat).test(prop)) {
	                    (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
	                }
	            }
	        }
	        function validateProperties(pat) {
	            gen.forIn("key", data, (key) => {
	                gen.if((0, codegen_1._) `${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
	                    const alwaysValid = alwaysValidPatterns.includes(pat);
	                    if (!alwaysValid) {
	                        cxt.subschema({
	                            keyword: "patternProperties",
	                            schemaProp: pat,
	                            dataProp: key,
	                            dataPropType: util_2.Type.Str,
	                        }, valid);
	                    }
	                    if (it.opts.unevaluated && props !== true) {
	                        gen.assign((0, codegen_1._) `${props}[${key}]`, true);
	                    }
	                    else if (!alwaysValid && !it.allErrors) {
	                        // can short-circuit if `unevaluatedProperties` is not supported (opts.next === false)
	                        // or if all properties were evaluated (props === true)
	                        gen.if((0, codegen_1.not)(valid), () => gen.break());
	                    }
	                });
	            });
	        }
	    },
	};
	patternProperties.default = def;
	
	return patternProperties;
}

var not = {};

var hasRequiredNot;

function requireNot () {
	if (hasRequiredNot) return not;
	hasRequiredNot = 1;
	Object.defineProperty(not, "__esModule", { value: true });
	const util_1 = /*@__PURE__*/ requireUtil();
	const def = {
	    keyword: "not",
	    schemaType: ["object", "boolean"],
	    trackErrors: true,
	    code(cxt) {
	        const { gen, schema, it } = cxt;
	        if ((0, util_1.alwaysValidSchema)(it, schema)) {
	            cxt.fail();
	            return;
	        }
	        const valid = gen.name("valid");
	        cxt.subschema({
	            keyword: "not",
	            compositeRule: true,
	            createErrors: false,
	            allErrors: false,
	        }, valid);
	        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
	    },
	    error: { message: "must NOT be valid" },
	};
	not.default = def;
	
	return not;
}

var anyOf = {};

var hasRequiredAnyOf;

function requireAnyOf () {
	if (hasRequiredAnyOf) return anyOf;
	hasRequiredAnyOf = 1;
	Object.defineProperty(anyOf, "__esModule", { value: true });
	const code_1 = /*@__PURE__*/ requireCode();
	const def = {
	    keyword: "anyOf",
	    schemaType: "array",
	    trackErrors: true,
	    code: code_1.validateUnion,
	    error: { message: "must match a schema in anyOf" },
	};
	anyOf.default = def;
	
	return anyOf;
}

var oneOf = {};

var hasRequiredOneOf;

function requireOneOf () {
	if (hasRequiredOneOf) return oneOf;
	hasRequiredOneOf = 1;
	Object.defineProperty(oneOf, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	const error = {
	    message: "must match exactly one schema in oneOf",
	    params: ({ params }) => (0, codegen_1._) `{passingSchemas: ${params.passing}}`,
	};
	const def = {
	    keyword: "oneOf",
	    schemaType: "array",
	    trackErrors: true,
	    error,
	    code(cxt) {
	        const { gen, schema, parentSchema, it } = cxt;
	        /* istanbul ignore if */
	        if (!Array.isArray(schema))
	            throw new Error("ajv implementation error");
	        if (it.opts.discriminator && parentSchema.discriminator)
	            return;
	        const schArr = schema;
	        const valid = gen.let("valid", false);
	        const passing = gen.let("passing", null);
	        const schValid = gen.name("_valid");
	        cxt.setParams({ passing });
	        // TODO possibly fail straight away (with warning or exception) if there are two empty always valid schemas
	        gen.block(validateOneOf);
	        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
	        function validateOneOf() {
	            schArr.forEach((sch, i) => {
	                let schCxt;
	                if ((0, util_1.alwaysValidSchema)(it, sch)) {
	                    gen.var(schValid, true);
	                }
	                else {
	                    schCxt = cxt.subschema({
	                        keyword: "oneOf",
	                        schemaProp: i,
	                        compositeRule: true,
	                    }, schValid);
	                }
	                if (i > 0) {
	                    gen
	                        .if((0, codegen_1._) `${schValid} && ${valid}`)
	                        .assign(valid, false)
	                        .assign(passing, (0, codegen_1._) `[${passing}, ${i}]`)
	                        .else();
	                }
	                gen.if(schValid, () => {
	                    gen.assign(valid, true);
	                    gen.assign(passing, i);
	                    if (schCxt)
	                        cxt.mergeEvaluated(schCxt, codegen_1.Name);
	                });
	            });
	        }
	    },
	};
	oneOf.default = def;
	
	return oneOf;
}

var allOf = {};

var hasRequiredAllOf;

function requireAllOf () {
	if (hasRequiredAllOf) return allOf;
	hasRequiredAllOf = 1;
	Object.defineProperty(allOf, "__esModule", { value: true });
	const util_1 = /*@__PURE__*/ requireUtil();
	const def = {
	    keyword: "allOf",
	    schemaType: "array",
	    code(cxt) {
	        const { gen, schema, it } = cxt;
	        /* istanbul ignore if */
	        if (!Array.isArray(schema))
	            throw new Error("ajv implementation error");
	        const valid = gen.name("valid");
	        schema.forEach((sch, i) => {
	            if ((0, util_1.alwaysValidSchema)(it, sch))
	                return;
	            const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
	            cxt.ok(valid);
	            cxt.mergeEvaluated(schCxt);
	        });
	    },
	};
	allOf.default = def;
	
	return allOf;
}

var _if = {};

var hasRequired_if;

function require_if () {
	if (hasRequired_if) return _if;
	hasRequired_if = 1;
	Object.defineProperty(_if, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const util_1 = /*@__PURE__*/ requireUtil();
	const error = {
	    message: ({ params }) => (0, codegen_1.str) `must match "${params.ifClause}" schema`,
	    params: ({ params }) => (0, codegen_1._) `{failingKeyword: ${params.ifClause}}`,
	};
	const def = {
	    keyword: "if",
	    schemaType: ["object", "boolean"],
	    trackErrors: true,
	    error,
	    code(cxt) {
	        const { gen, parentSchema, it } = cxt;
	        if (parentSchema.then === undefined && parentSchema.else === undefined) {
	            (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
	        }
	        const hasThen = hasSchema(it, "then");
	        const hasElse = hasSchema(it, "else");
	        if (!hasThen && !hasElse)
	            return;
	        const valid = gen.let("valid", true);
	        const schValid = gen.name("_valid");
	        validateIf();
	        cxt.reset();
	        if (hasThen && hasElse) {
	            const ifClause = gen.let("ifClause");
	            cxt.setParams({ ifClause });
	            gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
	        }
	        else if (hasThen) {
	            gen.if(schValid, validateClause("then"));
	        }
	        else {
	            gen.if((0, codegen_1.not)(schValid), validateClause("else"));
	        }
	        cxt.pass(valid, () => cxt.error(true));
	        function validateIf() {
	            const schCxt = cxt.subschema({
	                keyword: "if",
	                compositeRule: true,
	                createErrors: false,
	                allErrors: false,
	            }, schValid);
	            cxt.mergeEvaluated(schCxt);
	        }
	        function validateClause(keyword, ifClause) {
	            return () => {
	                const schCxt = cxt.subschema({ keyword }, schValid);
	                gen.assign(valid, schValid);
	                cxt.mergeValidEvaluated(schCxt, valid);
	                if (ifClause)
	                    gen.assign(ifClause, (0, codegen_1._) `${keyword}`);
	                else
	                    cxt.setParams({ ifClause: keyword });
	            };
	        }
	    },
	};
	function hasSchema(it, keyword) {
	    const schema = it.schema[keyword];
	    return schema !== undefined && !(0, util_1.alwaysValidSchema)(it, schema);
	}
	_if.default = def;
	
	return _if;
}

var thenElse = {};

var hasRequiredThenElse;

function requireThenElse () {
	if (hasRequiredThenElse) return thenElse;
	hasRequiredThenElse = 1;
	Object.defineProperty(thenElse, "__esModule", { value: true });
	const util_1 = /*@__PURE__*/ requireUtil();
	const def = {
	    keyword: ["then", "else"],
	    schemaType: ["object", "boolean"],
	    code({ keyword, parentSchema, it }) {
	        if (parentSchema.if === undefined)
	            (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
	    },
	};
	thenElse.default = def;
	
	return thenElse;
}

var hasRequiredApplicator;

function requireApplicator () {
	if (hasRequiredApplicator) return applicator;
	hasRequiredApplicator = 1;
	Object.defineProperty(applicator, "__esModule", { value: true });
	const additionalItems_1 = /*@__PURE__*/ requireAdditionalItems();
	const prefixItems_1 = /*@__PURE__*/ requirePrefixItems();
	const items_1 = /*@__PURE__*/ requireItems();
	const items2020_1 = /*@__PURE__*/ requireItems2020();
	const contains_1 = /*@__PURE__*/ requireContains();
	const dependencies_1 = /*@__PURE__*/ requireDependencies();
	const propertyNames_1 = /*@__PURE__*/ requirePropertyNames();
	const additionalProperties_1 = /*@__PURE__*/ requireAdditionalProperties();
	const properties_1 = /*@__PURE__*/ requireProperties();
	const patternProperties_1 = /*@__PURE__*/ requirePatternProperties();
	const not_1 = /*@__PURE__*/ requireNot();
	const anyOf_1 = /*@__PURE__*/ requireAnyOf();
	const oneOf_1 = /*@__PURE__*/ requireOneOf();
	const allOf_1 = /*@__PURE__*/ requireAllOf();
	const if_1 = /*@__PURE__*/ require_if();
	const thenElse_1 = /*@__PURE__*/ requireThenElse();
	function getApplicator(draft2020 = false) {
	    const applicator = [
	        // any
	        not_1.default,
	        anyOf_1.default,
	        oneOf_1.default,
	        allOf_1.default,
	        if_1.default,
	        thenElse_1.default,
	        // object
	        propertyNames_1.default,
	        additionalProperties_1.default,
	        dependencies_1.default,
	        properties_1.default,
	        patternProperties_1.default,
	    ];
	    // array
	    if (draft2020)
	        applicator.push(prefixItems_1.default, items2020_1.default);
	    else
	        applicator.push(additionalItems_1.default, items_1.default);
	    applicator.push(contains_1.default);
	    return applicator;
	}
	applicator.default = getApplicator;
	
	return applicator;
}

var format$1 = {};

var format = {};

var hasRequiredFormat$1;

function requireFormat$1 () {
	if (hasRequiredFormat$1) return format;
	hasRequiredFormat$1 = 1;
	Object.defineProperty(format, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const error = {
	    message: ({ schemaCode }) => (0, codegen_1.str) `must match format "${schemaCode}"`,
	    params: ({ schemaCode }) => (0, codegen_1._) `{format: ${schemaCode}}`,
	};
	const def = {
	    keyword: "format",
	    type: ["number", "string"],
	    schemaType: "string",
	    $data: true,
	    error,
	    code(cxt, ruleType) {
	        const { gen, data, $data, schema, schemaCode, it } = cxt;
	        const { opts, errSchemaPath, schemaEnv, self } = it;
	        if (!opts.validateFormats)
	            return;
	        if ($data)
	            validate$DataFormat();
	        else
	            validateFormat();
	        function validate$DataFormat() {
	            const fmts = gen.scopeValue("formats", {
	                ref: self.formats,
	                code: opts.code.formats,
	            });
	            const fDef = gen.const("fDef", (0, codegen_1._) `${fmts}[${schemaCode}]`);
	            const fType = gen.let("fType");
	            const format = gen.let("format");
	            // TODO simplify
	            gen.if((0, codegen_1._) `typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._) `${fDef}.type || "string"`).assign(format, (0, codegen_1._) `${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._) `"string"`).assign(format, fDef));
	            cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
	            function unknownFmt() {
	                if (opts.strictSchema === false)
	                    return codegen_1.nil;
	                return (0, codegen_1._) `${schemaCode} && !${format}`;
	            }
	            function invalidFmt() {
	                const callFormat = schemaEnv.$async
	                    ? (0, codegen_1._) `(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))`
	                    : (0, codegen_1._) `${format}(${data})`;
	                const validData = (0, codegen_1._) `(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
	                return (0, codegen_1._) `${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
	            }
	        }
	        function validateFormat() {
	            const formatDef = self.formats[schema];
	            if (!formatDef) {
	                unknownFormat();
	                return;
	            }
	            if (formatDef === true)
	                return;
	            const [fmtType, format, fmtRef] = getFormat(formatDef);
	            if (fmtType === ruleType)
	                cxt.pass(validCondition());
	            function unknownFormat() {
	                if (opts.strictSchema === false) {
	                    self.logger.warn(unknownMsg());
	                    return;
	                }
	                throw new Error(unknownMsg());
	                function unknownMsg() {
	                    return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
	                }
	            }
	            function getFormat(fmtDef) {
	                const code = fmtDef instanceof RegExp
	                    ? (0, codegen_1.regexpCode)(fmtDef)
	                    : opts.code.formats
	                        ? (0, codegen_1._) `${opts.code.formats}${(0, codegen_1.getProperty)(schema)}`
	                        : undefined;
	                const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
	                if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
	                    return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._) `${fmt}.validate`];
	                }
	                return ["string", fmtDef, fmt];
	            }
	            function validCondition() {
	                if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
	                    if (!schemaEnv.$async)
	                        throw new Error("async format in sync schema");
	                    return (0, codegen_1._) `await ${fmtRef}(${data})`;
	                }
	                return typeof format == "function" ? (0, codegen_1._) `${fmtRef}(${data})` : (0, codegen_1._) `${fmtRef}.test(${data})`;
	            }
	        }
	    },
	};
	format.default = def;
	
	return format;
}

var hasRequiredFormat;

function requireFormat () {
	if (hasRequiredFormat) return format$1;
	hasRequiredFormat = 1;
	Object.defineProperty(format$1, "__esModule", { value: true });
	const format_1 = /*@__PURE__*/ requireFormat$1();
	const format = [format_1.default];
	format$1.default = format;
	
	return format$1;
}

var metadata = {};

var hasRequiredMetadata;

function requireMetadata () {
	if (hasRequiredMetadata) return metadata;
	hasRequiredMetadata = 1;
	Object.defineProperty(metadata, "__esModule", { value: true });
	metadata.contentVocabulary = metadata.metadataVocabulary = void 0;
	metadata.metadataVocabulary = [
	    "title",
	    "description",
	    "default",
	    "deprecated",
	    "readOnly",
	    "writeOnly",
	    "examples",
	];
	metadata.contentVocabulary = [
	    "contentMediaType",
	    "contentEncoding",
	    "contentSchema",
	];
	
	return metadata;
}

var hasRequiredDraft7;

function requireDraft7 () {
	if (hasRequiredDraft7) return draft7;
	hasRequiredDraft7 = 1;
	Object.defineProperty(draft7, "__esModule", { value: true });
	const core_1 = /*@__PURE__*/ requireCore();
	const validation_1 = /*@__PURE__*/ requireValidation();
	const applicator_1 = /*@__PURE__*/ requireApplicator();
	const format_1 = /*@__PURE__*/ requireFormat();
	const metadata_1 = /*@__PURE__*/ requireMetadata();
	const draft7Vocabularies = [
	    core_1.default,
	    validation_1.default,
	    (0, applicator_1.default)(),
	    format_1.default,
	    metadata_1.metadataVocabulary,
	    metadata_1.contentVocabulary,
	];
	draft7.default = draft7Vocabularies;
	
	return draft7;
}

var discriminator = {};

var types = {};

var hasRequiredTypes;

function requireTypes () {
	if (hasRequiredTypes) return types;
	hasRequiredTypes = 1;
	Object.defineProperty(types, "__esModule", { value: true });
	types.DiscrError = void 0;
	var DiscrError;
	(function (DiscrError) {
	    DiscrError["Tag"] = "tag";
	    DiscrError["Mapping"] = "mapping";
	})(DiscrError || (types.DiscrError = DiscrError = {}));
	
	return types;
}

var hasRequiredDiscriminator;

function requireDiscriminator () {
	if (hasRequiredDiscriminator) return discriminator;
	hasRequiredDiscriminator = 1;
	Object.defineProperty(discriminator, "__esModule", { value: true });
	const codegen_1 = /*@__PURE__*/ requireCodegen();
	const types_1 = /*@__PURE__*/ requireTypes();
	const compile_1 = /*@__PURE__*/ requireCompile();
	const ref_error_1 = /*@__PURE__*/ requireRef_error();
	const util_1 = /*@__PURE__*/ requireUtil();
	const error = {
	    message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag
	        ? `tag "${tagName}" must be string`
	        : `value of tag "${tagName}" must be in oneOf`,
	    params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._) `{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`,
	};
	const def = {
	    keyword: "discriminator",
	    type: "object",
	    schemaType: "object",
	    error,
	    code(cxt) {
	        const { gen, data, schema, parentSchema, it } = cxt;
	        const { oneOf } = parentSchema;
	        if (!it.opts.discriminator) {
	            throw new Error("discriminator: requires discriminator option");
	        }
	        const tagName = schema.propertyName;
	        if (typeof tagName != "string")
	            throw new Error("discriminator: requires propertyName");
	        if (schema.mapping)
	            throw new Error("discriminator: mapping is not supported");
	        if (!oneOf)
	            throw new Error("discriminator: requires oneOf keyword");
	        const valid = gen.let("valid", false);
	        const tag = gen.const("tag", (0, codegen_1._) `${data}${(0, codegen_1.getProperty)(tagName)}`);
	        gen.if((0, codegen_1._) `typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
	        cxt.ok(valid);
	        function validateMapping() {
	            const mapping = getMapping();
	            gen.if(false);
	            for (const tagValue in mapping) {
	                gen.elseIf((0, codegen_1._) `${tag} === ${tagValue}`);
	                gen.assign(valid, applyTagSchema(mapping[tagValue]));
	            }
	            gen.else();
	            cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
	            gen.endIf();
	        }
	        function applyTagSchema(schemaProp) {
	            const _valid = gen.name("valid");
	            const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
	            cxt.mergeEvaluated(schCxt, codegen_1.Name);
	            return _valid;
	        }
	        function getMapping() {
	            var _a;
	            const oneOfMapping = {};
	            const topRequired = hasRequired(parentSchema);
	            let tagRequired = true;
	            for (let i = 0; i < oneOf.length; i++) {
	                let sch = oneOf[i];
	                if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
	                    const ref = sch.$ref;
	                    sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
	                    if (sch instanceof compile_1.SchemaEnv)
	                        sch = sch.schema;
	                    if (sch === undefined)
	                        throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
	                }
	                const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
	                if (typeof propSch != "object") {
	                    throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
	                }
	                tagRequired = tagRequired && (topRequired || hasRequired(sch));
	                addMappings(propSch, i);
	            }
	            if (!tagRequired)
	                throw new Error(`discriminator: "${tagName}" must be required`);
	            return oneOfMapping;
	            function hasRequired({ required }) {
	                return Array.isArray(required) && required.includes(tagName);
	            }
	            function addMappings(sch, i) {
	                if (sch.const) {
	                    addMapping(sch.const, i);
	                }
	                else if (sch.enum) {
	                    for (const tagValue of sch.enum) {
	                        addMapping(tagValue, i);
	                    }
	                }
	                else {
	                    throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
	                }
	            }
	            function addMapping(tagValue, i) {
	                if (typeof tagValue != "string" || tagValue in oneOfMapping) {
	                    throw new Error(`discriminator: "${tagName}" values must be unique strings`);
	                }
	                oneOfMapping[tagValue] = i;
	            }
	        }
	    },
	};
	discriminator.default = def;
	
	return discriminator;
}

var $schema = "http://json-schema.org/draft-07/schema#";
var $id = "http://json-schema.org/draft-07/schema#";
var title = "Core schema meta-schema";
var definitions = {
	schemaArray: {
		type: "array",
		minItems: 1,
		items: {
			$ref: "#"
		}
	},
	nonNegativeInteger: {
		type: "integer",
		minimum: 0
	},
	nonNegativeIntegerDefault0: {
		allOf: [
			{
				$ref: "#/definitions/nonNegativeInteger"
			},
			{
				"default": 0
			}
		]
	},
	simpleTypes: {
		"enum": [
			"array",
			"boolean",
			"integer",
			"null",
			"number",
			"object",
			"string"
		]
	},
	stringArray: {
		type: "array",
		items: {
			type: "string"
		},
		uniqueItems: true,
		"default": [
		]
	}
};
var type = [
	"object",
	"boolean"
];
var properties = {
	$id: {
		type: "string",
		format: "uri-reference"
	},
	$schema: {
		type: "string",
		format: "uri"
	},
	$ref: {
		type: "string",
		format: "uri-reference"
	},
	$comment: {
		type: "string"
	},
	title: {
		type: "string"
	},
	description: {
		type: "string"
	},
	"default": true,
	readOnly: {
		type: "boolean",
		"default": false
	},
	examples: {
		type: "array",
		items: true
	},
	multipleOf: {
		type: "number",
		exclusiveMinimum: 0
	},
	maximum: {
		type: "number"
	},
	exclusiveMaximum: {
		type: "number"
	},
	minimum: {
		type: "number"
	},
	exclusiveMinimum: {
		type: "number"
	},
	maxLength: {
		$ref: "#/definitions/nonNegativeInteger"
	},
	minLength: {
		$ref: "#/definitions/nonNegativeIntegerDefault0"
	},
	pattern: {
		type: "string",
		format: "regex"
	},
	additionalItems: {
		$ref: "#"
	},
	items: {
		anyOf: [
			{
				$ref: "#"
			},
			{
				$ref: "#/definitions/schemaArray"
			}
		],
		"default": true
	},
	maxItems: {
		$ref: "#/definitions/nonNegativeInteger"
	},
	minItems: {
		$ref: "#/definitions/nonNegativeIntegerDefault0"
	},
	uniqueItems: {
		type: "boolean",
		"default": false
	},
	contains: {
		$ref: "#"
	},
	maxProperties: {
		$ref: "#/definitions/nonNegativeInteger"
	},
	minProperties: {
		$ref: "#/definitions/nonNegativeIntegerDefault0"
	},
	required: {
		$ref: "#/definitions/stringArray"
	},
	additionalProperties: {
		$ref: "#"
	},
	definitions: {
		type: "object",
		additionalProperties: {
			$ref: "#"
		},
		"default": {
		}
	},
	properties: {
		type: "object",
		additionalProperties: {
			$ref: "#"
		},
		"default": {
		}
	},
	patternProperties: {
		type: "object",
		additionalProperties: {
			$ref: "#"
		},
		propertyNames: {
			format: "regex"
		},
		"default": {
		}
	},
	dependencies: {
		type: "object",
		additionalProperties: {
			anyOf: [
				{
					$ref: "#"
				},
				{
					$ref: "#/definitions/stringArray"
				}
			]
		}
	},
	propertyNames: {
		$ref: "#"
	},
	"const": true,
	"enum": {
		type: "array",
		items: true,
		minItems: 1,
		uniqueItems: true
	},
	type: {
		anyOf: [
			{
				$ref: "#/definitions/simpleTypes"
			},
			{
				type: "array",
				items: {
					$ref: "#/definitions/simpleTypes"
				},
				minItems: 1,
				uniqueItems: true
			}
		]
	},
	format: {
		type: "string"
	},
	contentMediaType: {
		type: "string"
	},
	contentEncoding: {
		type: "string"
	},
	"if": {
		$ref: "#"
	},
	then: {
		$ref: "#"
	},
	"else": {
		$ref: "#"
	},
	allOf: {
		$ref: "#/definitions/schemaArray"
	},
	anyOf: {
		$ref: "#/definitions/schemaArray"
	},
	oneOf: {
		$ref: "#/definitions/schemaArray"
	},
	not: {
		$ref: "#"
	}
};
var require$$3 = {
	$schema: $schema,
	$id: $id,
	title: title,
	definitions: definitions,
	type: type,
	properties: properties,
	"default": true
};

var hasRequiredAjv;

function requireAjv () {
	if (hasRequiredAjv) return ajv.exports;
	hasRequiredAjv = 1;
	(function (module, exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.MissingRefError = exports$1.ValidationError = exports$1.CodeGen = exports$1.Name = exports$1.nil = exports$1.stringify = exports$1.str = exports$1._ = exports$1.KeywordCxt = exports$1.Ajv = void 0;
		const core_1 = /*@__PURE__*/ requireCore$1();
		const draft7_1 = /*@__PURE__*/ requireDraft7();
		const discriminator_1 = /*@__PURE__*/ requireDiscriminator();
		const draft7MetaSchema = require$$3;
		const META_SUPPORT_DATA = ["/properties"];
		const META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
		class Ajv extends core_1.default {
		    _addVocabularies() {
		        super._addVocabularies();
		        draft7_1.default.forEach((v) => this.addVocabulary(v));
		        if (this.opts.discriminator)
		            this.addKeyword(discriminator_1.default);
		    }
		    _addDefaultMetaSchema() {
		        super._addDefaultMetaSchema();
		        if (!this.opts.meta)
		            return;
		        const metaSchema = this.opts.$data
		            ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA)
		            : draft7MetaSchema;
		        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
		        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
		    }
		    defaultMeta() {
		        return (this.opts.defaultMeta =
		            super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : undefined));
		    }
		}
		exports$1.Ajv = Ajv;
		module.exports = exports$1 = Ajv;
		module.exports.Ajv = Ajv;
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.default = Ajv;
		var validate_1 = /*@__PURE__*/ requireValidate();
		Object.defineProperty(exports$1, "KeywordCxt", { enumerable: true, get: function () { return validate_1.KeywordCxt; } });
		var codegen_1 = /*@__PURE__*/ requireCodegen();
		Object.defineProperty(exports$1, "_", { enumerable: true, get: function () { return codegen_1._; } });
		Object.defineProperty(exports$1, "str", { enumerable: true, get: function () { return codegen_1.str; } });
		Object.defineProperty(exports$1, "stringify", { enumerable: true, get: function () { return codegen_1.stringify; } });
		Object.defineProperty(exports$1, "nil", { enumerable: true, get: function () { return codegen_1.nil; } });
		Object.defineProperty(exports$1, "Name", { enumerable: true, get: function () { return codegen_1.Name; } });
		Object.defineProperty(exports$1, "CodeGen", { enumerable: true, get: function () { return codegen_1.CodeGen; } });
		var validation_error_1 = /*@__PURE__*/ requireValidation_error();
		Object.defineProperty(exports$1, "ValidationError", { enumerable: true, get: function () { return validation_error_1.default; } });
		var ref_error_1 = /*@__PURE__*/ requireRef_error();
		Object.defineProperty(exports$1, "MissingRefError", { enumerable: true, get: function () { return ref_error_1.default; } });
		
	} (ajv, ajv.exports));
	return ajv.exports;
}

var ajvExports = /*@__PURE__*/ requireAjv();
var Ajv = /*@__PURE__*/getDefaultExportFromCjs(ajvExports);

var dist = {exports: {}};

var formats = {};

var hasRequiredFormats;

function requireFormats () {
	if (hasRequiredFormats) return formats;
	hasRequiredFormats = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.formatNames = exports$1.fastFormats = exports$1.fullFormats = void 0;
		function fmtDef(validate, compare) {
		    return { validate, compare };
		}
		exports$1.fullFormats = {
		    // date: http://tools.ietf.org/html/rfc3339#section-5.6
		    date: fmtDef(date, compareDate),
		    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
		    time: fmtDef(getTime(true), compareTime),
		    "date-time": fmtDef(getDateTime(true), compareDateTime),
		    "iso-time": fmtDef(getTime(), compareIsoTime),
		    "iso-date-time": fmtDef(getDateTime(), compareIsoDateTime),
		    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
		    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
		    uri,
		    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
		    // uri-template: https://tools.ietf.org/html/rfc6570
		    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
		    // For the source: https://gist.github.com/dperini/729294
		    // For test cases: https://mathiasbynens.be/demo/url-regex
		    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
		    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
		    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
		    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
		    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
		    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
		    regex,
		    // uuid: http://tools.ietf.org/html/rfc4122
		    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
		    // JSON-pointer: https://tools.ietf.org/html/rfc6901
		    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
		    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
		    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
		    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
		    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
		    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
		    // byte: https://github.com/miguelmota/is-base64
		    byte,
		    // signed 32 bit integer
		    int32: { type: "number", validate: validateInt32 },
		    // signed 64 bit integer
		    int64: { type: "number", validate: validateInt64 },
		    // C-type float
		    float: { type: "number", validate: validateNumber },
		    // C-type double
		    double: { type: "number", validate: validateNumber },
		    // hint to the UI to hide input strings
		    password: true,
		    // unchecked string payload
		    binary: true,
		};
		exports$1.fastFormats = {
		    ...exports$1.fullFormats,
		    date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
		    time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
		    "date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
		    "iso-time": fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
		    "iso-date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoDateTime),
		    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
		    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
		    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
		    // email (sources from jsen validator):
		    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
		    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
		    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
		};
		exports$1.formatNames = Object.keys(exports$1.fullFormats);
		function isLeapYear(year) {
		    // https://tools.ietf.org/html/rfc3339#appendix-C
		    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
		}
		const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
		const DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		function date(str) {
		    // full-date from http://tools.ietf.org/html/rfc3339#section-5.6
		    const matches = DATE.exec(str);
		    if (!matches)
		        return false;
		    const year = +matches[1];
		    const month = +matches[2];
		    const day = +matches[3];
		    return (month >= 1 &&
		        month <= 12 &&
		        day >= 1 &&
		        day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]));
		}
		function compareDate(d1, d2) {
		    if (!(d1 && d2))
		        return undefined;
		    if (d1 > d2)
		        return 1;
		    if (d1 < d2)
		        return -1;
		    return 0;
		}
		const TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
		function getTime(strictTimeZone) {
		    return function time(str) {
		        const matches = TIME.exec(str);
		        if (!matches)
		            return false;
		        const hr = +matches[1];
		        const min = +matches[2];
		        const sec = +matches[3];
		        const tz = matches[4];
		        const tzSign = matches[5] === "-" ? -1 : 1;
		        const tzH = +(matches[6] || 0);
		        const tzM = +(matches[7] || 0);
		        if (tzH > 23 || tzM > 59 || (strictTimeZone && !tz))
		            return false;
		        if (hr <= 23 && min <= 59 && sec < 60)
		            return true;
		        // leap second
		        const utcMin = min - tzM * tzSign;
		        const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
		        return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
		    };
		}
		function compareTime(s1, s2) {
		    if (!(s1 && s2))
		        return undefined;
		    const t1 = new Date("2020-01-01T" + s1).valueOf();
		    const t2 = new Date("2020-01-01T" + s2).valueOf();
		    if (!(t1 && t2))
		        return undefined;
		    return t1 - t2;
		}
		function compareIsoTime(t1, t2) {
		    if (!(t1 && t2))
		        return undefined;
		    const a1 = TIME.exec(t1);
		    const a2 = TIME.exec(t2);
		    if (!(a1 && a2))
		        return undefined;
		    t1 = a1[1] + a1[2] + a1[3];
		    t2 = a2[1] + a2[2] + a2[3];
		    if (t1 > t2)
		        return 1;
		    if (t1 < t2)
		        return -1;
		    return 0;
		}
		const DATE_TIME_SEPARATOR = /t|\s/i;
		function getDateTime(strictTimeZone) {
		    const time = getTime(strictTimeZone);
		    return function date_time(str) {
		        // http://tools.ietf.org/html/rfc3339#section-5.6
		        const dateTime = str.split(DATE_TIME_SEPARATOR);
		        return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1]);
		    };
		}
		function compareDateTime(dt1, dt2) {
		    if (!(dt1 && dt2))
		        return undefined;
		    const d1 = new Date(dt1).valueOf();
		    const d2 = new Date(dt2).valueOf();
		    if (!(d1 && d2))
		        return undefined;
		    return d1 - d2;
		}
		function compareIsoDateTime(dt1, dt2) {
		    if (!(dt1 && dt2))
		        return undefined;
		    const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
		    const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
		    const res = compareDate(d1, d2);
		    if (res === undefined)
		        return undefined;
		    return res || compareTime(t1, t2);
		}
		const NOT_URI_FRAGMENT = /\/|:/;
		const URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
		function uri(str) {
		    // http://jmrware.com/articles/2009/uri_regexp/URI_regex.html + optional protocol + required "."
		    return NOT_URI_FRAGMENT.test(str) && URI.test(str);
		}
		const BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
		function byte(str) {
		    BYTE.lastIndex = 0;
		    return BYTE.test(str);
		}
		const MIN_INT32 = -2147483648;
		const MAX_INT32 = 2 ** 31 - 1;
		function validateInt32(value) {
		    return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
		}
		function validateInt64(value) {
		    // JSON and javascript max Int is 2**53, so any int that passes isInteger is valid for Int64
		    return Number.isInteger(value);
		}
		function validateNumber() {
		    return true;
		}
		const Z_ANCHOR = /[^\\]\\Z/;
		function regex(str) {
		    if (Z_ANCHOR.test(str))
		        return false;
		    try {
		        new RegExp(str);
		        return true;
		    }
		    catch (e) {
		        return false;
		    }
		}
		
	} (formats));
	return formats;
}

var limit = {};

var hasRequiredLimit;

function requireLimit () {
	if (hasRequiredLimit) return limit;
	hasRequiredLimit = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.formatLimitDefinition = void 0;
		const ajv_1 = /*@__PURE__*/ requireAjv();
		const codegen_1 = /*@__PURE__*/ requireCodegen();
		const ops = codegen_1.operators;
		const KWDs = {
		    formatMaximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
		    formatMinimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
		    formatExclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
		    formatExclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE },
		};
		const error = {
		    message: ({ keyword, schemaCode }) => (0, codegen_1.str) `should be ${KWDs[keyword].okStr} ${schemaCode}`,
		    params: ({ keyword, schemaCode }) => (0, codegen_1._) `{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`,
		};
		exports$1.formatLimitDefinition = {
		    keyword: Object.keys(KWDs),
		    type: "string",
		    schemaType: "string",
		    $data: true,
		    error,
		    code(cxt) {
		        const { gen, data, schemaCode, keyword, it } = cxt;
		        const { opts, self } = it;
		        if (!opts.validateFormats)
		            return;
		        const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
		        if (fCxt.$data)
		            validate$DataFormat();
		        else
		            validateFormat();
		        function validate$DataFormat() {
		            const fmts = gen.scopeValue("formats", {
		                ref: self.formats,
		                code: opts.code.formats,
		            });
		            const fmt = gen.const("fmt", (0, codegen_1._) `${fmts}[${fCxt.schemaCode}]`);
		            cxt.fail$data((0, codegen_1.or)((0, codegen_1._) `typeof ${fmt} != "object"`, (0, codegen_1._) `${fmt} instanceof RegExp`, (0, codegen_1._) `typeof ${fmt}.compare != "function"`, compareCode(fmt)));
		        }
		        function validateFormat() {
		            const format = fCxt.schema;
		            const fmtDef = self.formats[format];
		            if (!fmtDef || fmtDef === true)
		                return;
		            if (typeof fmtDef != "object" ||
		                fmtDef instanceof RegExp ||
		                typeof fmtDef.compare != "function") {
		                throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
		            }
		            const fmt = gen.scopeValue("formats", {
		                key: format,
		                ref: fmtDef,
		                code: opts.code.formats ? (0, codegen_1._) `${opts.code.formats}${(0, codegen_1.getProperty)(format)}` : undefined,
		            });
		            cxt.fail$data(compareCode(fmt));
		        }
		        function compareCode(fmt) {
		            return (0, codegen_1._) `${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
		        }
		    },
		    dependencies: ["format"],
		};
		const formatLimitPlugin = (ajv) => {
		    ajv.addKeyword(exports$1.formatLimitDefinition);
		    return ajv;
		};
		exports$1.default = formatLimitPlugin;
		
	} (limit));
	return limit;
}

var hasRequiredDist;

function requireDist () {
	if (hasRequiredDist) return dist.exports;
	hasRequiredDist = 1;
	(function (module, exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		const formats_1 = requireFormats();
		const limit_1 = requireLimit();
		const codegen_1 = /*@__PURE__*/ requireCodegen();
		const fullName = new codegen_1.Name("fullFormats");
		const fastName = new codegen_1.Name("fastFormats");
		const formatsPlugin = (ajv, opts = { keywords: true }) => {
		    if (Array.isArray(opts)) {
		        addFormats(ajv, opts, formats_1.fullFormats, fullName);
		        return ajv;
		    }
		    const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
		    const list = opts.formats || formats_1.formatNames;
		    addFormats(ajv, list, formats, exportName);
		    if (opts.keywords)
		        (0, limit_1.default)(ajv);
		    return ajv;
		};
		formatsPlugin.get = (name, mode = "full") => {
		    const formats = mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats;
		    const f = formats[name];
		    if (!f)
		        throw new Error(`Unknown format "${name}"`);
		    return f;
		};
		function addFormats(ajv, list, fs, exportName) {
		    var _a;
		    var _b;
		    (_a = (_b = ajv.opts.code).formats) !== null && _a !== void 0 ? _a : (_b.formats = (0, codegen_1._) `require("ajv-formats/dist/formats").${exportName}`);
		    for (const f of list)
		        ajv.addFormat(f, fs[f]);
		}
		module.exports = exports$1 = formatsPlugin;
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.default = formatsPlugin;
		
	} (dist, dist.exports));
	return dist.exports;
}

var distExports = requireDist();
var _addFormats = /*@__PURE__*/getDefaultExportFromCjs(distExports);

/**
 * AJV-based JSON Schema validator provider
 */
function createDefaultAjvInstance() {
    const ajv = new Ajv({
        strict: false,
        validateFormats: true,
        validateSchema: false,
        allErrors: true
    });
    const addFormats = _addFormats;
    addFormats(ajv);
    return ajv;
}
/**
 * @example
 * ```typescript
 * // Use with default AJV instance (recommended)
 * import { AjvJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/ajv';
 * const validator = new AjvJsonSchemaValidator();
 *
 * // Use with custom AJV instance
 * import { Ajv } from 'ajv';
 * const ajv = new Ajv({ strict: true, allErrors: true });
 * const validator = new AjvJsonSchemaValidator(ajv);
 * ```
 */
class AjvJsonSchemaValidator {
    /**
     * Create an AJV validator
     *
     * @param ajv - Optional pre-configured AJV instance. If not provided, a default instance will be created.
     *
     * @example
     * ```typescript
     * // Use default configuration (recommended for most cases)
     * import { AjvJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/ajv';
     * const validator = new AjvJsonSchemaValidator();
     *
     * // Or provide custom AJV instance for advanced configuration
     * import { Ajv } from 'ajv';
     * import addFormats from 'ajv-formats';
     *
     * const ajv = new Ajv({ validateFormats: true });
     * addFormats(ajv);
     * const validator = new AjvJsonSchemaValidator(ajv);
     * ```
     */
    constructor(ajv) {
        this._ajv = ajv ?? createDefaultAjvInstance();
    }
    /**
     * Create a validator for the given JSON Schema
     *
     * The validator is compiled once and can be reused multiple times.
     * If the schema has an $id, it will be cached by AJV automatically.
     *
     * @param schema - Standard JSON Schema object
     * @returns A validator function that validates input data
     */
    getValidator(schema) {
        // Check if schema has $id and is already compiled/cached
        const ajvValidator = '$id' in schema && typeof schema.$id === 'string'
            ? (this._ajv.getSchema(schema.$id) ?? this._ajv.compile(schema))
            : this._ajv.compile(schema);
        return (input) => {
            const valid = ajvValidator(input);
            if (valid) {
                return {
                    valid: true,
                    data: input,
                    errorMessage: undefined
                };
            }
            else {
                return {
                    valid: false,
                    data: undefined,
                    errorMessage: this._ajv.errorsText(ajvValidator.errors)
                };
            }
        };
    }
}

/**
 * Experimental server task features for MCP SDK.
 * WARNING: These APIs are experimental and may change without notice.
 *
 * @experimental
 */
/**
 * Experimental task features for low-level MCP servers.
 *
 * Access via `server.experimental.tasks`:
 * ```typescript
 * const stream = server.experimental.tasks.requestStream(request, schema, options);
 * ```
 *
 * For high-level server usage with task-based tools, use `McpServer.experimental.tasks` instead.
 *
 * @experimental
 */
class ExperimentalServerTasks {
    constructor(_server) {
        this._server = _server;
    }
    /**
     * Sends a request and returns an AsyncGenerator that yields response messages.
     * The generator is guaranteed to end with either a 'result' or 'error' message.
     *
     * This method provides streaming access to request processing, allowing you to
     * observe intermediate task status updates for task-augmented requests.
     *
     * @param request - The request to send
     * @param resultSchema - Zod schema for validating the result
     * @param options - Optional request options (timeout, signal, task creation params, etc.)
     * @returns AsyncGenerator that yields ResponseMessage objects
     *
     * @experimental
     */
    requestStream(request, resultSchema, options) {
        return this._server.requestStream(request, resultSchema, options);
    }
    /**
     * Sends a sampling request and returns an AsyncGenerator that yields response messages.
     * The generator is guaranteed to end with either a 'result' or 'error' message.
     *
     * For task-augmented requests, yields 'taskCreated' and 'taskStatus' messages
     * before the final result.
     *
     * @example
     * ```typescript
     * const stream = server.experimental.tasks.createMessageStream({
     *     messages: [{ role: 'user', content: { type: 'text', text: 'Hello' } }],
     *     maxTokens: 100
     * }, {
     *     onprogress: (progress) => {
     *         // Handle streaming tokens via progress notifications
     *         console.log('Progress:', progress.message);
     *     }
     * });
     *
     * for await (const message of stream) {
     *     switch (message.type) {
     *         case 'taskCreated':
     *             console.log('Task created:', message.task.taskId);
     *             break;
     *         case 'taskStatus':
     *             console.log('Task status:', message.task.status);
     *             break;
     *         case 'result':
     *             console.log('Final result:', message.result);
     *             break;
     *         case 'error':
     *             console.error('Error:', message.error);
     *             break;
     *     }
     * }
     * ```
     *
     * @param params - The sampling request parameters
     * @param options - Optional request options (timeout, signal, task creation params, onprogress, etc.)
     * @returns AsyncGenerator that yields ResponseMessage objects
     *
     * @experimental
     */
    createMessageStream(params, options) {
        // Access client capabilities via the server
        const clientCapabilities = this._server.getClientCapabilities();
        // Capability check - only required when tools/toolChoice are provided
        if ((params.tools || params.toolChoice) && !clientCapabilities?.sampling?.tools) {
            throw new Error('Client does not support sampling tools capability.');
        }
        // Message structure validation - always validate tool_use/tool_result pairs.
        // These may appear even without tools/toolChoice in the current request when
        // a previous sampling request returned tool_use and this is a follow-up with results.
        if (params.messages.length > 0) {
            const lastMessage = params.messages[params.messages.length - 1];
            const lastContent = Array.isArray(lastMessage.content) ? lastMessage.content : [lastMessage.content];
            const hasToolResults = lastContent.some(c => c.type === 'tool_result');
            const previousMessage = params.messages.length > 1 ? params.messages[params.messages.length - 2] : undefined;
            const previousContent = previousMessage
                ? Array.isArray(previousMessage.content)
                    ? previousMessage.content
                    : [previousMessage.content]
                : [];
            const hasPreviousToolUse = previousContent.some(c => c.type === 'tool_use');
            if (hasToolResults) {
                if (lastContent.some(c => c.type !== 'tool_result')) {
                    throw new Error('The last message must contain only tool_result content if any is present');
                }
                if (!hasPreviousToolUse) {
                    throw new Error('tool_result blocks are not matching any tool_use from the previous message');
                }
            }
            if (hasPreviousToolUse) {
                // Extract tool_use IDs from previous message and tool_result IDs from current message
                const toolUseIds = new Set(previousContent.filter(c => c.type === 'tool_use').map(c => c.id));
                const toolResultIds = new Set(lastContent.filter(c => c.type === 'tool_result').map(c => c.toolUseId));
                if (toolUseIds.size !== toolResultIds.size || ![...toolUseIds].every(id => toolResultIds.has(id))) {
                    throw new Error('ids of tool_result blocks and tool_use blocks from previous message do not match');
                }
            }
        }
        return this.requestStream({
            method: 'sampling/createMessage',
            params
        }, CreateMessageResultSchema, options);
    }
    /**
     * Sends an elicitation request and returns an AsyncGenerator that yields response messages.
     * The generator is guaranteed to end with either a 'result' or 'error' message.
     *
     * For task-augmented requests (especially URL-based elicitation), yields 'taskCreated'
     * and 'taskStatus' messages before the final result.
     *
     * @example
     * ```typescript
     * const stream = server.experimental.tasks.elicitInputStream({
     *     mode: 'url',
     *     message: 'Please authenticate',
     *     elicitationId: 'auth-123',
     *     url: 'https://example.com/auth'
     * }, {
     *     task: { ttl: 300000 } // Task-augmented for long-running auth flow
     * });
     *
     * for await (const message of stream) {
     *     switch (message.type) {
     *         case 'taskCreated':
     *             console.log('Task created:', message.task.taskId);
     *             break;
     *         case 'taskStatus':
     *             console.log('Task status:', message.task.status);
     *             break;
     *         case 'result':
     *             console.log('User action:', message.result.action);
     *             break;
     *         case 'error':
     *             console.error('Error:', message.error);
     *             break;
     *     }
     * }
     * ```
     *
     * @param params - The elicitation request parameters
     * @param options - Optional request options (timeout, signal, task creation params, etc.)
     * @returns AsyncGenerator that yields ResponseMessage objects
     *
     * @experimental
     */
    elicitInputStream(params, options) {
        // Access client capabilities via the server
        const clientCapabilities = this._server.getClientCapabilities();
        const mode = params.mode ?? 'form';
        // Capability check based on mode
        switch (mode) {
            case 'url': {
                if (!clientCapabilities?.elicitation?.url) {
                    throw new Error('Client does not support url elicitation.');
                }
                break;
            }
            case 'form': {
                if (!clientCapabilities?.elicitation?.form) {
                    throw new Error('Client does not support form elicitation.');
                }
                break;
            }
        }
        // Normalize params to ensure mode is set for form mode (defaults to 'form' per spec)
        const normalizedParams = mode === 'form' && params.mode === undefined ? { ...params, mode: 'form' } : params;
        // Cast to ServerRequest needed because TypeScript can't narrow the union type
        // based on the discriminated 'method' field when constructing the object literal
        return this.requestStream({
            method: 'elicitation/create',
            params: normalizedParams
        }, ElicitResultSchema, options);
    }
    /**
     * Gets the current status of a task.
     *
     * @param taskId - The task identifier
     * @param options - Optional request options
     * @returns The task status
     *
     * @experimental
     */
    async getTask(taskId, options) {
        return this._server.getTask({ taskId }, options);
    }
    /**
     * Retrieves the result of a completed task.
     *
     * @param taskId - The task identifier
     * @param resultSchema - Zod schema for validating the result
     * @param options - Optional request options
     * @returns The task result
     *
     * @experimental
     */
    async getTaskResult(taskId, resultSchema, options) {
        return this._server.getTaskResult({ taskId }, resultSchema, options);
    }
    /**
     * Lists tasks with optional pagination.
     *
     * @param cursor - Optional pagination cursor
     * @param options - Optional request options
     * @returns List of tasks with optional next cursor
     *
     * @experimental
     */
    async listTasks(cursor, options) {
        return this._server.listTasks(cursor ? { cursor } : undefined, options);
    }
    /**
     * Cancels a running task.
     *
     * @param taskId - The task identifier
     * @param options - Optional request options
     *
     * @experimental
     */
    async cancelTask(taskId, options) {
        return this._server.cancelTask({ taskId }, options);
    }
}

/**
 * Experimental task capability assertion helpers.
 * WARNING: These APIs are experimental and may change without notice.
 *
 * @experimental
 */
/**
 * Asserts that task creation is supported for tools/call.
 * Used by Client.assertTaskCapability and Server.assertTaskHandlerCapability.
 *
 * @param requests - The task requests capability object
 * @param method - The method being checked
 * @param entityName - 'Server' or 'Client' for error messages
 * @throws Error if the capability is not supported
 *
 * @experimental
 */
function assertToolsCallTaskCapability(requests, method, entityName) {
    if (!requests) {
        throw new Error(`${entityName} does not support task creation (required for ${method})`);
    }
    switch (method) {
        case 'tools/call':
            if (!requests.tools?.call) {
                throw new Error(`${entityName} does not support task creation for tools/call (required for ${method})`);
            }
            break;
    }
}
/**
 * Asserts that task creation is supported for sampling/createMessage or elicitation/create.
 * Used by Server.assertTaskCapability and Client.assertTaskHandlerCapability.
 *
 * @param requests - The task requests capability object
 * @param method - The method being checked
 * @param entityName - 'Server' or 'Client' for error messages
 * @throws Error if the capability is not supported
 *
 * @experimental
 */
function assertClientRequestTaskCapability(requests, method, entityName) {
    if (!requests) {
        throw new Error(`${entityName} does not support task creation (required for ${method})`);
    }
    switch (method) {
        case 'sampling/createMessage':
            if (!requests.sampling?.createMessage) {
                throw new Error(`${entityName} does not support task creation for sampling/createMessage (required for ${method})`);
            }
            break;
        case 'elicitation/create':
            if (!requests.elicitation?.create) {
                throw new Error(`${entityName} does not support task creation for elicitation/create (required for ${method})`);
            }
            break;
    }
}

/**
 * An MCP server on top of a pluggable transport.
 *
 * This server will automatically respond to the initialization flow as initiated from the client.
 *
 * To use with custom types, extend the base Request/Notification/Result types and pass them as type parameters:
 *
 * ```typescript
 * // Custom schemas
 * const CustomRequestSchema = RequestSchema.extend({...})
 * const CustomNotificationSchema = NotificationSchema.extend({...})
 * const CustomResultSchema = ResultSchema.extend({...})
 *
 * // Type aliases
 * type CustomRequest = z.infer<typeof CustomRequestSchema>
 * type CustomNotification = z.infer<typeof CustomNotificationSchema>
 * type CustomResult = z.infer<typeof CustomResultSchema>
 *
 * // Create typed server
 * const server = new Server<CustomRequest, CustomNotification, CustomResult>({
 *   name: "CustomServer",
 *   version: "1.0.0"
 * })
 * ```
 * @deprecated Use `McpServer` instead for the high-level API. Only use `Server` for advanced use cases.
 */
class Server extends Protocol {
    /**
     * Initializes this server with the given name and version information.
     */
    constructor(_serverInfo, options) {
        super(options);
        this._serverInfo = _serverInfo;
        // Map log levels by session id
        this._loggingLevels = new Map();
        // Map LogLevelSchema to severity index
        this.LOG_LEVEL_SEVERITY = new Map(LoggingLevelSchema.options.map((level, index) => [level, index]));
        // Is a message with the given level ignored in the log level set for the given session id?
        this.isMessageIgnored = (level, sessionId) => {
            const currentLevel = this._loggingLevels.get(sessionId);
            return currentLevel ? this.LOG_LEVEL_SEVERITY.get(level) < this.LOG_LEVEL_SEVERITY.get(currentLevel) : false;
        };
        this._capabilities = options?.capabilities ?? {};
        this._instructions = options?.instructions;
        this._jsonSchemaValidator = options?.jsonSchemaValidator ?? new AjvJsonSchemaValidator();
        this.setRequestHandler(InitializeRequestSchema, request => this._oninitialize(request));
        this.setNotificationHandler(InitializedNotificationSchema, () => this.oninitialized?.());
        if (this._capabilities.logging) {
            this.setRequestHandler(SetLevelRequestSchema, async (request, extra) => {
                const transportSessionId = extra.sessionId || extra.requestInfo?.headers['mcp-session-id'] || undefined;
                const { level } = request.params;
                const parseResult = LoggingLevelSchema.safeParse(level);
                if (parseResult.success) {
                    this._loggingLevels.set(transportSessionId, parseResult.data);
                }
                return {};
            });
        }
    }
    /**
     * Access experimental features.
     *
     * WARNING: These APIs are experimental and may change without notice.
     *
     * @experimental
     */
    get experimental() {
        if (!this._experimental) {
            this._experimental = {
                tasks: new ExperimentalServerTasks(this)
            };
        }
        return this._experimental;
    }
    /**
     * Registers new capabilities. This can only be called before connecting to a transport.
     *
     * The new capabilities will be merged with any existing capabilities previously given (e.g., at initialization).
     */
    registerCapabilities(capabilities) {
        if (this.transport) {
            throw new Error('Cannot register capabilities after connecting to transport');
        }
        this._capabilities = mergeCapabilities(this._capabilities, capabilities);
    }
    /**
     * Override request handler registration to enforce server-side validation for tools/call.
     */
    setRequestHandler(requestSchema, handler) {
        const shape = getObjectShape(requestSchema);
        const methodSchema = shape?.method;
        if (!methodSchema) {
            throw new Error('Schema is missing a method literal');
        }
        // Extract literal value using type-safe property access
        let methodValue;
        if (isZ4Schema(methodSchema)) {
            const v4Schema = methodSchema;
            const v4Def = v4Schema._zod?.def;
            methodValue = v4Def?.value ?? v4Schema.value;
        }
        else {
            const v3Schema = methodSchema;
            const legacyDef = v3Schema._def;
            methodValue = legacyDef?.value ?? v3Schema.value;
        }
        if (typeof methodValue !== 'string') {
            throw new Error('Schema method literal must be a string');
        }
        const method = methodValue;
        if (method === 'tools/call') {
            const wrappedHandler = async (request, extra) => {
                const validatedRequest = safeParse$1(CallToolRequestSchema, request);
                if (!validatedRequest.success) {
                    const errorMessage = validatedRequest.error instanceof Error ? validatedRequest.error.message : String(validatedRequest.error);
                    throw new McpError(ErrorCode.InvalidParams, `Invalid tools/call request: ${errorMessage}`);
                }
                const { params } = validatedRequest.data;
                const result = await Promise.resolve(handler(request, extra));
                // When task creation is requested, validate and return CreateTaskResult
                if (params.task) {
                    const taskValidationResult = safeParse$1(CreateTaskResultSchema, result);
                    if (!taskValidationResult.success) {
                        const errorMessage = taskValidationResult.error instanceof Error
                            ? taskValidationResult.error.message
                            : String(taskValidationResult.error);
                        throw new McpError(ErrorCode.InvalidParams, `Invalid task creation result: ${errorMessage}`);
                    }
                    return taskValidationResult.data;
                }
                // For non-task requests, validate against CallToolResultSchema
                const validationResult = safeParse$1(CallToolResultSchema, result);
                if (!validationResult.success) {
                    const errorMessage = validationResult.error instanceof Error ? validationResult.error.message : String(validationResult.error);
                    throw new McpError(ErrorCode.InvalidParams, `Invalid tools/call result: ${errorMessage}`);
                }
                return validationResult.data;
            };
            // Install the wrapped handler
            return super.setRequestHandler(requestSchema, wrappedHandler);
        }
        // Other handlers use default behavior
        return super.setRequestHandler(requestSchema, handler);
    }
    assertCapabilityForMethod(method) {
        switch (method) {
            case 'sampling/createMessage':
                if (!this._clientCapabilities?.sampling) {
                    throw new Error(`Client does not support sampling (required for ${method})`);
                }
                break;
            case 'elicitation/create':
                if (!this._clientCapabilities?.elicitation) {
                    throw new Error(`Client does not support elicitation (required for ${method})`);
                }
                break;
            case 'roots/list':
                if (!this._clientCapabilities?.roots) {
                    throw new Error(`Client does not support listing roots (required for ${method})`);
                }
                break;
        }
    }
    assertNotificationCapability(method) {
        switch (method) {
            case 'notifications/message':
                if (!this._capabilities.logging) {
                    throw new Error(`Server does not support logging (required for ${method})`);
                }
                break;
            case 'notifications/resources/updated':
            case 'notifications/resources/list_changed':
                if (!this._capabilities.resources) {
                    throw new Error(`Server does not support notifying about resources (required for ${method})`);
                }
                break;
            case 'notifications/tools/list_changed':
                if (!this._capabilities.tools) {
                    throw new Error(`Server does not support notifying of tool list changes (required for ${method})`);
                }
                break;
            case 'notifications/prompts/list_changed':
                if (!this._capabilities.prompts) {
                    throw new Error(`Server does not support notifying of prompt list changes (required for ${method})`);
                }
                break;
            case 'notifications/elicitation/complete':
                if (!this._clientCapabilities?.elicitation?.url) {
                    throw new Error(`Client does not support URL elicitation (required for ${method})`);
                }
                break;
        }
    }
    assertRequestHandlerCapability(method) {
        // Task handlers are registered in Protocol constructor before _capabilities is initialized
        // Skip capability check for task methods during initialization
        if (!this._capabilities) {
            return;
        }
        switch (method) {
            case 'completion/complete':
                if (!this._capabilities.completions) {
                    throw new Error(`Server does not support completions (required for ${method})`);
                }
                break;
            case 'logging/setLevel':
                if (!this._capabilities.logging) {
                    throw new Error(`Server does not support logging (required for ${method})`);
                }
                break;
            case 'prompts/get':
            case 'prompts/list':
                if (!this._capabilities.prompts) {
                    throw new Error(`Server does not support prompts (required for ${method})`);
                }
                break;
            case 'resources/list':
            case 'resources/templates/list':
            case 'resources/read':
                if (!this._capabilities.resources) {
                    throw new Error(`Server does not support resources (required for ${method})`);
                }
                break;
            case 'tools/call':
            case 'tools/list':
                if (!this._capabilities.tools) {
                    throw new Error(`Server does not support tools (required for ${method})`);
                }
                break;
            case 'tasks/get':
            case 'tasks/list':
            case 'tasks/result':
            case 'tasks/cancel':
                if (!this._capabilities.tasks) {
                    throw new Error(`Server does not support tasks capability (required for ${method})`);
                }
                break;
        }
    }
    assertTaskCapability(method) {
        assertClientRequestTaskCapability(this._clientCapabilities?.tasks?.requests, method, 'Client');
    }
    assertTaskHandlerCapability(method) {
        // Task handlers are registered in Protocol constructor before _capabilities is initialized
        // Skip capability check for task methods during initialization
        if (!this._capabilities) {
            return;
        }
        assertToolsCallTaskCapability(this._capabilities.tasks?.requests, method, 'Server');
    }
    async _oninitialize(request) {
        const requestedVersion = request.params.protocolVersion;
        this._clientCapabilities = request.params.capabilities;
        this._clientVersion = request.params.clientInfo;
        const protocolVersion = SUPPORTED_PROTOCOL_VERSIONS.includes(requestedVersion) ? requestedVersion : LATEST_PROTOCOL_VERSION;
        return {
            protocolVersion,
            capabilities: this.getCapabilities(),
            serverInfo: this._serverInfo,
            ...(this._instructions && { instructions: this._instructions })
        };
    }
    /**
     * After initialization has completed, this will be populated with the client's reported capabilities.
     */
    getClientCapabilities() {
        return this._clientCapabilities;
    }
    /**
     * After initialization has completed, this will be populated with information about the client's name and version.
     */
    getClientVersion() {
        return this._clientVersion;
    }
    getCapabilities() {
        return this._capabilities;
    }
    async ping() {
        return this.request({ method: 'ping' }, EmptyResultSchema);
    }
    // Implementation
    async createMessage(params, options) {
        // Capability check - only required when tools/toolChoice are provided
        if (params.tools || params.toolChoice) {
            if (!this._clientCapabilities?.sampling?.tools) {
                throw new Error('Client does not support sampling tools capability.');
            }
        }
        // Message structure validation - always validate tool_use/tool_result pairs.
        // These may appear even without tools/toolChoice in the current request when
        // a previous sampling request returned tool_use and this is a follow-up with results.
        if (params.messages.length > 0) {
            const lastMessage = params.messages[params.messages.length - 1];
            const lastContent = Array.isArray(lastMessage.content) ? lastMessage.content : [lastMessage.content];
            const hasToolResults = lastContent.some(c => c.type === 'tool_result');
            const previousMessage = params.messages.length > 1 ? params.messages[params.messages.length - 2] : undefined;
            const previousContent = previousMessage
                ? Array.isArray(previousMessage.content)
                    ? previousMessage.content
                    : [previousMessage.content]
                : [];
            const hasPreviousToolUse = previousContent.some(c => c.type === 'tool_use');
            if (hasToolResults) {
                if (lastContent.some(c => c.type !== 'tool_result')) {
                    throw new Error('The last message must contain only tool_result content if any is present');
                }
                if (!hasPreviousToolUse) {
                    throw new Error('tool_result blocks are not matching any tool_use from the previous message');
                }
            }
            if (hasPreviousToolUse) {
                const toolUseIds = new Set(previousContent.filter(c => c.type === 'tool_use').map(c => c.id));
                const toolResultIds = new Set(lastContent.filter(c => c.type === 'tool_result').map(c => c.toolUseId));
                if (toolUseIds.size !== toolResultIds.size || ![...toolUseIds].every(id => toolResultIds.has(id))) {
                    throw new Error('ids of tool_result blocks and tool_use blocks from previous message do not match');
                }
            }
        }
        // Use different schemas based on whether tools are provided
        if (params.tools) {
            return this.request({ method: 'sampling/createMessage', params }, CreateMessageResultWithToolsSchema, options);
        }
        return this.request({ method: 'sampling/createMessage', params }, CreateMessageResultSchema, options);
    }
    /**
     * Creates an elicitation request for the given parameters.
     * For backwards compatibility, `mode` may be omitted for form requests and will default to `'form'`.
     * @param params The parameters for the elicitation request.
     * @param options Optional request options.
     * @returns The result of the elicitation request.
     */
    async elicitInput(params, options) {
        const mode = (params.mode ?? 'form');
        switch (mode) {
            case 'url': {
                if (!this._clientCapabilities?.elicitation?.url) {
                    throw new Error('Client does not support url elicitation.');
                }
                const urlParams = params;
                return this.request({ method: 'elicitation/create', params: urlParams }, ElicitResultSchema, options);
            }
            case 'form': {
                if (!this._clientCapabilities?.elicitation?.form) {
                    throw new Error('Client does not support form elicitation.');
                }
                const formParams = params.mode === 'form' ? params : { ...params, mode: 'form' };
                const result = await this.request({ method: 'elicitation/create', params: formParams }, ElicitResultSchema, options);
                if (result.action === 'accept' && result.content && formParams.requestedSchema) {
                    try {
                        const validator = this._jsonSchemaValidator.getValidator(formParams.requestedSchema);
                        const validationResult = validator(result.content);
                        if (!validationResult.valid) {
                            throw new McpError(ErrorCode.InvalidParams, `Elicitation response content does not match requested schema: ${validationResult.errorMessage}`);
                        }
                    }
                    catch (error) {
                        if (error instanceof McpError) {
                            throw error;
                        }
                        throw new McpError(ErrorCode.InternalError, `Error validating elicitation response: ${error instanceof Error ? error.message : String(error)}`);
                    }
                }
                return result;
            }
        }
    }
    /**
     * Creates a reusable callback that, when invoked, will send a `notifications/elicitation/complete`
     * notification for the specified elicitation ID.
     *
     * @param elicitationId The ID of the elicitation to mark as complete.
     * @param options Optional notification options. Useful when the completion notification should be related to a prior request.
     * @returns A function that emits the completion notification when awaited.
     */
    createElicitationCompletionNotifier(elicitationId, options) {
        if (!this._clientCapabilities?.elicitation?.url) {
            throw new Error('Client does not support URL elicitation (required for notifications/elicitation/complete)');
        }
        return () => this.notification({
            method: 'notifications/elicitation/complete',
            params: {
                elicitationId
            }
        }, options);
    }
    async listRoots(params, options) {
        return this.request({ method: 'roots/list', params }, ListRootsResultSchema, options);
    }
    /**
     * Sends a logging message to the client, if connected.
     * Note: You only need to send the parameters object, not the entire JSON RPC message
     * @see LoggingMessageNotification
     * @param params
     * @param sessionId optional for stateless and backward compatibility
     */
    async sendLoggingMessage(params, sessionId) {
        if (this._capabilities.logging) {
            if (!this.isMessageIgnored(params.level, sessionId)) {
                return this.notification({ method: 'notifications/message', params });
            }
        }
    }
    async sendResourceUpdated(params) {
        return this.notification({
            method: 'notifications/resources/updated',
            params
        });
    }
    async sendResourceListChanged() {
        return this.notification({
            method: 'notifications/resources/list_changed'
        });
    }
    async sendToolListChanged() {
        return this.notification({ method: 'notifications/tools/list_changed' });
    }
    async sendPromptListChanged() {
        return this.notification({ method: 'notifications/prompts/list_changed' });
    }
}

/**
 * Buffers a continuous stdio stream into discrete JSON-RPC messages.
 */
class ReadBuffer {
    append(chunk) {
        this._buffer = this._buffer ? Buffer.concat([this._buffer, chunk]) : chunk;
    }
    readMessage() {
        if (!this._buffer) {
            return null;
        }
        const index = this._buffer.indexOf('\n');
        if (index === -1) {
            return null;
        }
        const line = this._buffer.toString('utf8', 0, index).replace(/\r$/, '');
        this._buffer = this._buffer.subarray(index + 1);
        return deserializeMessage(line);
    }
    clear() {
        this._buffer = undefined;
    }
}
function deserializeMessage(line) {
    return JSONRPCMessageSchema.parse(JSON.parse(line));
}
function serializeMessage(message) {
    return JSON.stringify(message) + '\n';
}

/**
 * Server transport for stdio: this communicates with an MCP client by reading from the current process' stdin and writing to stdout.
 *
 * This transport is only available in Node.js environments.
 */
class StdioServerTransport {
    constructor(_stdin = process$1.stdin, _stdout = process$1.stdout) {
        this._stdin = _stdin;
        this._stdout = _stdout;
        this._readBuffer = new ReadBuffer();
        this._started = false;
        // Arrow functions to bind `this` properly, while maintaining function identity.
        this._ondata = (chunk) => {
            this._readBuffer.append(chunk);
            this.processReadBuffer();
        };
        this._onerror = (error) => {
            this.onerror?.(error);
        };
    }
    /**
     * Starts listening for messages on stdin.
     */
    async start() {
        if (this._started) {
            throw new Error('StdioServerTransport already started! If using Server class, note that connect() calls start() automatically.');
        }
        this._started = true;
        this._stdin.on('data', this._ondata);
        this._stdin.on('error', this._onerror);
    }
    processReadBuffer() {
        while (true) {
            try {
                const message = this._readBuffer.readMessage();
                if (message === null) {
                    break;
                }
                this.onmessage?.(message);
            }
            catch (error) {
                this.onerror?.(error);
            }
        }
    }
    async close() {
        // Remove our event listeners first
        this._stdin.off('data', this._ondata);
        this._stdin.off('error', this._onerror);
        // Check if we were the only data listener
        const remainingDataListeners = this._stdin.listenerCount('data');
        if (remainingDataListeners === 0) {
            // Only pause stdin if we were the only listener
            // This prevents interfering with other parts of the application that might be using stdin
            this._stdin.pause();
        }
        // Clear the buffer and notify closure
        this._readBuffer.clear();
        this.onclose?.();
    }
    send(message) {
        return new Promise(resolve => {
            const json = serializeMessage(message);
            if (this._stdout.write(json)) {
                resolve();
            }
            else {
                this._stdout.once('drain', resolve);
            }
        });
    }
}

/**
 * agent-hosting-mcp
 *
 * MCP server that exposes agent-hosting.chitacloud.dev as tools for any MCP client
 * (Claude Desktop, Cursor, Cline, Continue, Windsurf, etc.).
 *
 * Author: Alex Chen (autonomous AI agent)
 * License: MIT
 *
 * Anonymous remote telemetry is ON by default to help the author detect bugs
 * and understand usage. Opt out with AGENT_HOSTING_MCP_TELEMETRY=off.
 * No personally identifiable data is collected. See README for exact fields.
 */
// ----- constants ------------------------------------------------------------
const VERSION = "0.1.0";
const AGENT_HOSTING_BASE = process.env.AGENT_HOSTING_BASE_URL ?? "https://agent-hosting.chitacloud.dev";
const PAYMENT_GATEWAY_BASE = process.env.PAYMENT_GATEWAY_BASE_URL ?? "https://payment-gateway.chitacloud.dev";
const TELEMETRY_ENDPOINT = process.env.AGENT_HOSTING_MCP_TELEMETRY_URL ??
    "https://alexchen.chitacloud.dev/api/telemetry";
const TELEMETRY_ON = (process.env.AGENT_HOSTING_MCP_TELEMETRY ?? "on").toLowerCase() !== "off";
const SERVICE_TOKEN = process.env.AGENT_HOSTING_SERVICE_TOKEN ?? "";
// ----- anonymous install id -------------------------------------------------
/**
 * Install id is a stable but anonymous identifier, generated once per install
 * of this npm package. It is a random 16-byte hex stored at
 * ~/.config/agent-hosting-mcp/install-id. It does NOT contain hostname or
 * email. If the file cannot be written, we fall back to a sha256 of a few
 * machine attributes (not reversible to PII).
 */
function getInstallId() {
    try {
        const cfgDir = join(homedir(), ".config", "agent-hosting-mcp");
        const cfgFile = join(cfgDir, "install-id");
        if (existsSync(cfgFile)) {
            const v = readFileSync(cfgFile, "utf8").trim();
            if (/^[a-f0-9]{32}$/.test(v))
                return v;
        }
        mkdirSync(cfgDir, { recursive: true });
        const id = randomBytes(16).toString("hex");
        writeFileSync(cfgFile, id, { mode: 0o600 });
        return id;
    }
    catch {
        // Fallback: hash platform attributes (not PII, not reversible).
        const h = createHash("sha256");
        h.update(platform() + release() + hostname$1());
        return h.digest("hex").slice(0, 32);
    }
}
const INSTALL_ID = getInstallId();
async function emitTelemetry(ev) {
    if (!TELEMETRY_ON)
        return;
    const payload = {
        service: "agent-hosting-mcp",
        version: VERSION,
        install_id: INSTALL_ID,
        timestamp: new Date().toISOString(),
        node_version: process.version,
        platform: `${platform()} ${release()}`,
        ...ev,
    };
    try {
        await fetch(TELEMETRY_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(2000),
        });
    }
    catch {
        // Silent: telemetry must never break functionality.
    }
}
async function callApi(path, opts = {}) {
    const base = opts.base ?? AGENT_HOSTING_BASE;
    const url = base + path;
    const headers = {
        "User-Agent": `agent-hosting-mcp/${VERSION}`,
        ...(opts.headers ?? {}),
    };
    if (opts.body !== undefined)
        headers["Content-Type"] = "application/json";
    const res = await fetch(url, {
        method: opts.method ?? (opts.body ? "POST" : "GET"),
        headers,
        body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
        signal: AbortSignal.timeout(30000),
    });
    const text = await res.text();
    let parsed = text;
    try {
        parsed = JSON.parse(text);
    }
    catch { }
    if (!res.ok) {
        const err = new Error(`agent-hosting API ${opts.method ?? "GET"} ${path} failed: HTTP ${res.status}`);
        err.status = res.status;
        err.response = parsed;
        throw err;
    }
    return parsed;
}
// ----- tool schemas ---------------------------------------------------------
const tools = [
    {
        name: "get_stats",
        description: "Get public stats of agent-hosting.chitacloud.dev (active deployments, total deployments, trials started, version). No auth required.",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
        },
    },
    {
        name: "trial_deploy",
        description: "Deploy a Dockerfile as a free trial (128MB, 7 days, 1 per agent_name). No payment required. Returns deploy_id, live URL, and expiry timestamp.",
        inputSchema: {
            type: "object",
            required: ["name", "agent_name", "dockerfile", "port"],
            properties: {
                name: {
                    type: "string",
                    description: "Name for this deployment (lowercase, hyphens ok).",
                },
                agent_name: {
                    type: "string",
                    description: "Your agent's unique identifier. One trial per agent_name.",
                },
                dockerfile: {
                    type: "string",
                    description: "Dockerfile content as a string (multi-line with \\n).",
                },
                files: {
                    type: "object",
                    description: "Map of filename to file content (e.g. {\"index.js\": \"console.log('hi')\"}).",
                    additionalProperties: { type: "string" },
                },
                port: { type: "integer", description: "Port the container listens on." },
                operator_email: {
                    type: "string",
                    description: "Optional email for trial expiry warnings.",
                },
            },
        },
    },
    {
        name: "check_trial",
        description: "Check status of a trial deployment. Returns plan, status, hours_left, expires_at, upgrade_url.",
        inputSchema: {
            type: "object",
            required: ["deploy_id"],
            properties: {
                deploy_id: { type: "string", description: "The DEP-XXXXXX id." },
            },
        },
    },
    {
        name: "deploy",
        description: "Deploy a Dockerfile on a paid plan. Requires a service token from payment verification (AGENT_HOSTING_SERVICE_TOKEN env var, or token_override argument).",
        inputSchema: {
            type: "object",
            required: ["name", "dockerfile", "port", "plan"],
            properties: {
                name: { type: "string" },
                dockerfile: { type: "string" },
                files: {
                    type: "object",
                    additionalProperties: { type: "string" },
                },
                port: { type: "integer" },
                env_vars: {
                    type: "object",
                    additionalProperties: { type: "string" },
                },
                memory_mb: { type: "integer" },
                plan: {
                    type: "string",
                    enum: ["micro", "standard", "pro", "hourly"],
                },
                token_override: {
                    type: "string",
                    description: "Override AGENT_HOSTING_SERVICE_TOKEN env var for this call only.",
                },
            },
        },
    },
    {
        name: "spawn_agent",
        description: "Clone an existing deployment (spawn a new independent instance from a parent deploy_id). Great for parallel work or fleet scaling. Returns a new deploy_id and URL.",
        inputSchema: {
            type: "object",
            required: ["parent_deploy_id", "name"],
            properties: {
                parent_deploy_id: {
                    type: "string",
                    description: "DEP-XXXXXX of the parent deployment to clone.",
                },
                name: { type: "string", description: "Name for the new clone." },
                env_vars: {
                    type: "object",
                    additionalProperties: { type: "string" },
                    description: "Override specific env vars on the clone. Unspecified vars inherit from parent.",
                },
                skill_md: {
                    type: "string",
                    description: "Optional updated SKILL.md for the clone.",
                },
                token_override: { type: "string" },
            },
        },
    },
    {
        name: "create_payment",
        description: "Create a payment receipt for a plan. Returns a receipt_id and a per-chain payment address (USDC on BSC/Base/Polygon/Arbitrum/Ethereum or SOL).",
        inputSchema: {
            type: "object",
            required: ["plan", "payer_agent"],
            properties: {
                plan: {
                    type: "string",
                    enum: ["micro", "standard", "pro", "hourly"],
                },
                payer_agent: {
                    type: "string",
                    description: "Your agent identifier (for receipt attribution).",
                },
                amount_usd: {
                    type: "number",
                    description: "Override default price for plan (hourly: 0.005, micro: 2.00, standard: 5.00, pro: 15.00).",
                },
            },
        },
    },
    {
        name: "verify_payment",
        description: "Verify a USDC/SOL payment tx hash against a receipt_id. Returns a service_token you pass to deploy() on X-Service-Token header.",
        inputSchema: {
            type: "object",
            required: ["receipt_id", "chain", "tx_hash"],
            properties: {
                receipt_id: { type: "string", description: "RCP-XXXXXX from create_payment." },
                chain: {
                    type: "string",
                    enum: ["bsc", "base", "polygon", "arbitrum", "ethereum", "solana"],
                },
                tx_hash: { type: "string", description: "0x... (EVM) or base58 (Solana)." },
            },
        },
    },
];
// ----- tool dispatcher ------------------------------------------------------
async function dispatchTool(name, args) {
    const resolveToken = () => {
        const override = typeof args.token_override === "string" ? args.token_override : "";
        const token = override || SERVICE_TOKEN;
        if (!token) {
            throw new Error("No service token available. Set AGENT_HOSTING_SERVICE_TOKEN env var or pass token_override. Get one by running verify_payment with a paid receipt.");
        }
        return token;
    };
    switch (name) {
        case "get_stats": {
            const r = await callApi("/api/stats");
            return JSON.stringify(r, null, 2);
        }
        case "trial_deploy": {
            const r = await callApi("/api/trial", { method: "POST", body: args });
            return JSON.stringify(r, null, 2);
        }
        case "check_trial": {
            const id = String(args.deploy_id);
            const r = await callApi(`/api/trial/${encodeURIComponent(id)}`);
            return JSON.stringify(r, null, 2);
        }
        case "deploy": {
            const token = resolveToken();
            const { token_override: _, ...body } = args;
            const r = await callApi("/api/deploy", {
                method: "POST",
                headers: { "X-Service-Token": token },
                body,
            });
            return JSON.stringify(r, null, 2);
        }
        case "spawn_agent": {
            const token = resolveToken();
            const { token_override: _, ...body } = args;
            const r = await callApi("/api/spawn", {
                method: "POST",
                headers: { "X-Service-Token": token },
                body,
            });
            return JSON.stringify(r, null, 2);
        }
        case "create_payment": {
            const body = { service: "agent-hosting", ...args };
            const r = await callApi("/api/payment/create", {
                method: "POST",
                body,
                base: PAYMENT_GATEWAY_BASE,
            });
            return JSON.stringify(r, null, 2);
        }
        case "verify_payment": {
            const r = await callApi("/api/payment/verify", {
                method: "POST",
                body: args,
                base: PAYMENT_GATEWAY_BASE,
            });
            return JSON.stringify(r, null, 2);
        }
        default:
            throw new Error(`unknown tool: ${name}`);
    }
}
// ----- MCP server wiring ----------------------------------------------------
async function main() {
    const server = new Server({ name: "agent-hosting-mcp", version: VERSION }, { capabilities: { tools: {} } });
    let mcpClient = "unknown";
    // Best-effort: record the MCP client name if the transport surfaces it later.
    // Current MCP SDK exposes client info after initialize; we update on first tool call.
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        void emitTelemetry({ event_type: "list_tools", success: true });
        return { tools };
    });
    server.setRequestHandler(CallToolRequestSchema, async (req) => {
        const toolName = req.params.name;
        const args = (req.params.arguments ?? {});
        const start = Date.now();
        // Attempt to record client info after first call.
        try {
            const clientInfo = server._clientInfo;
            if (clientInfo?.name)
                mcpClient = `${clientInfo.name}/${clientInfo.version ?? "?"}`;
        }
        catch { }
        try {
            const text = await dispatchTool(toolName, args);
            void emitTelemetry({
                event_type: "tool_call",
                tool: toolName,
                success: true,
                duration_ms: Date.now() - start,
                mcp_client: mcpClient,
            });
            return { content: [{ type: "text", text }] };
        }
        catch (err) {
            const e = err;
            void emitTelemetry({
                event_type: "tool_call",
                tool: toolName,
                success: false,
                duration_ms: Date.now() - start,
                error_class: e?.status ? `http_${e.status}` : (e?.name ?? "Error"),
                mcp_client: mcpClient,
            });
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `Error calling ${toolName}: ${e?.message ?? String(err)}`,
                    },
                ],
            };
        }
    });
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // stderr only — stdout is MCP channel, must not be polluted.
    process.stderr.write(`agent-hosting-mcp v${VERSION} ready. Telemetry: ${TELEMETRY_ON ? "on" : "off"}. Install id: ${INSTALL_ID.slice(0, 8)}...\n`);
    void emitTelemetry({ event_type: "server_start", success: true });
}
main().catch((err) => {
    process.stderr.write(`[fatal] ${err?.stack ?? err}\n`);
    process.exit(1);
});
