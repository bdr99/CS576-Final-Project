const cheerio = require("cheerio");
const config = require("./config/config");
const bcrypt = require("bcrypt-nodejs");

let csrfMiddleware = function (req, res, next) {
    let originalRenderFunction = res.render;

    //Override the render function with a new function that adds a CSRF token to all forms
    res.render = function (view, locals, callback) {
        originalRenderFunction.call(res, view, locals, function(err, html){
            html = csrfProtectHTML(html, req.sessionID);
            
            if (typeof callback === "function"){
                callback(err, html);
            } else {
                res.send(html);
            }
        });
    };

    //For POST requests, validate the token
    if (req.method === "POST"){
        if (!req.body["CSRFtoken"]){
            return res.status(400).send("CSRFtoken not present");
        }

        let result = bcrypt.compareSync(req.sessionID + config.CSRF_SECRET, req.body["CSRFtoken"]);
        if (!result){
            return res.status(400).send("CSRFtoken not valid");
        }
    }

    next();
};

//Modify html to add a CSRF token to all forms
function csrfProtectHTML(html, sessionID){
    let $ = cheerio.load(html);

    let hidden = cheerio.load("<input type='hidden' name='CSRFtoken'>")("input");
    hidden.attr("value", bcrypt.hashSync(sessionID + config.CSRF_SECRET));
    $("form").append(hidden);

    return $.html();
}

module.exports = csrfMiddleware;