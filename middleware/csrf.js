const cheerio = require("cheerio");
const config = require("../config/config");
const bcrypt = require("bcrypt-nodejs");

let csrfMiddleware = function (req, res, next) {
    let originalSendFunction = res.send;

    //Replace the res.send function with one that adds a CSRF token to all HTML forms
    res.send = function (body) {
        if (typeof body === "string"){
            originalSendFunction.call(res, csrfProtectHTML(body, req.sessionID));
        } else if (Buffer.isBuffer(body) && res.get("Content-Type") === "text/html"){
            originalSendFunction.call(res, csrfProtectHTML(body.toString(), req.sessionID));
        } else {
            originalSendFunction.call(res, body);
        }
    };

    //For POST requests, validate the token
    if (req.method === "POST") {
        if (!req.body["CSRFtoken"]) {
            return res.status(400).send("CSRFtoken not present");
        }

        let result = bcrypt.compareSync(req.sessionID + config.CSRF_SECRET, req.body["CSRFtoken"]);
        if (!result) {
            return res.status(400).send("CSRFtoken not valid");
        }
    }

    next();
};

//Modify html to add a CSRF token to all forms
function csrfProtectHTML(html, sessionID) {
    let $ = cheerio.load(html);

    //Create hidden HTML form field
    let hidden = cheerio.load("<input type='hidden' name='CSRFtoken'>")("input");
    //Set its value to the CSRF token
    hidden.attr("value", bcrypt.hashSync(sessionID + config.CSRF_SECRET));
    //Append it all forms on the page
    $("form").append(hidden);

    //Convert the DOM tree back to HTML and return it as a string
    return $.html();
}

module.exports = csrfMiddleware;