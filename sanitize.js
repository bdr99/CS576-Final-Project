let htmlEncodeCharacter = function (char) {
    return "&#x" + char.charCodeAt(0).toString(16) + ";";
};

let sanitizeMiddleware = function (req, res, next) {
    let originalRenderFunction = res.render;

    res.render = function (view, locals, callback) {
        let renderLocals = locals;
        if (typeof locals === "object"){
            renderLocals = JSON.parse(JSON.stringify(locals));
            sanitizeObject(renderLocals);
        }

        originalRenderFunction.call(res, view, renderLocals, callback);
    };

    next();
};

let sanitizeObject = function (obj) {
    Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] === "string") {
            obj[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === "object") {
            sanitizeObject(obj[key]);
        }
    });

};

let sanitizeString = function (str) {
    return str.split("").map(htmlEncodeCharacter).join("");
};

module.exports = sanitizeMiddleware;