const express = require("express");
const passport = require("passport");

const userData = require("../data/users");

const fs = require("fs");

//Define routes
const constructorMethod = (app) => {
    app.use("/static", express.static("static"));

    app.get("/", (req, res) => {
        res.render("home", {user: req.user});
    });

    app.get("/login", (req, res) => {
        res.render("login", {error: req.query.error, message: req.query.message});
    });

    app.post("/login", (req, res, next) => {
        if (!req.body.username) return res.redirect("/login?error=" + encodeURIComponent("Please specify a username!"));
        if (!req.body.password) return res.redirect("/login?error=" + encodeURIComponent("Please specify a password!"));
        next();
    }, passport.authenticate("local", { successRedirect: "/myblog", failureRedirect: "/login?error=" + encodeURIComponent("Invalid username or password!") }));

    app.get("/create_account", (req, res) => {
        res.render("create_account", {error: req.query.error});
    });

    app.post("/create_account", async (req, res) => {
        try {
            let user = await userData.addUser(req.body.name, req.body.phoneNumber, req.body.email, req.body.password);
            res.redirect("/login?message=" + encodeURIComponent("Your account was successfully created. Now you can log into your account."));
        } catch (err){
            console.error(err);
            res.redirect("/create_account?error=" + encodeURIComponent("There was an error when creating the account."));
        }
    });

    app.get("/myblog", (req, res) => {
        if (!req.user){
            res.redirect("/login?error=" + encodeURIComponent("You must login before accessing this page"));
            return;
        }

        res.render("myblog", {
            user: req.user,
            error: req.query.error,
            message: req.query.message
        });
    });

    app.get("/edit_profile", (req, res) => {
        if (!req.user){
            res.redirect("/login?error=" + encodeURIComponent("You must login before accessing this page"));
            return;
        }
        res.render("edit_profile", {
            error: req.query.error,
            message: req.query.message,
            user: req.user
        });
    });

    app.post("/edit_profile", async (req, res) => {
        if (!req.user){
            res.redirect("/login?error=" + encodeURIComponent("You must login before accessing this page"));
            return;
        }
        
        //update attributes in req.user
        if (req.body.name) req.user.profile.name = req.body.name;
        if (req.body.email) req.user.profile.email = req.body.email;
        if (req.body.phoneNumber) req.user.profile.phoneNumber = req.body.phoneNumber;

        //save changes to database
        try {
            let user = await userData.updateUser(req.user._id, req.user);
            res.redirect("/myblog?message=" + encodeURIComponent("Profile updated!"));
        } catch (err){
            console.error(err);
            res.redirect("/edit_profile?error=" + encodeURIComponent("Unable to update profile."));
        }
    });

    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });

    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethod;