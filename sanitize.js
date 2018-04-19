let htmlEncodeCharacter = function (char) {
    return "&#x" + char.charCodeAt(0).toString(16) + ";";
};

let sanitizeMiddleware = function (req, res, next) {
    let app = res.app;

    let originalRenderFunction = app.render;

    app.render = function (view, data, callback) {
        if (typeof data === "object") sanitizeObject(data);

        originalRenderFunction.call(app, view, data, callback);
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