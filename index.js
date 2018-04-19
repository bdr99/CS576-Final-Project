const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");
let configRoutes = require("./routes");

const config = require("./config/config");

const userData = require("./data/users");

passport.use(new LocalStrategy(function (username, password, callback) {
    userData.getUserByEmail(username).then((user) => {
        bcrypt.compare(password, user.hashedPassword, (err, res) => {
            if (res === true) {
                callback(null, user);
            } else {
                callback(null, false);
            }
        });
    }).catch((err) => {
        callback(err, false);
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.profile.email);
});

passport.deserializeUser(function (username, done) {
    userData.getUserByEmail(username).then((user) => {
        done(null, user);
    }).catch((err) => {
        done(err);
    });
});

let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: config.SESSION_SECRET, resave: true, saveUninitialized: true, cookie: { httpOnly: false } }));

const handlebarsInstance = exphbs.create({
    defaultLayout: "main"
});

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

app.use(passport.initialize());
app.use(passport.session());

configRoutes(app);

app.listen(config.SERVER_PORT, () => {
    console.log("Server is running on port " + config.SERVER_PORT);
});