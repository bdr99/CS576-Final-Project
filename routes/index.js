const express = require("express");
const passport = require("passport");

const userData = require("../data/users");
const postData = require("../data/posts");

const fs = require("fs");

//Define routes
const constructorMethod = (app) => {
    app.use("/static", express.static("static"));

    app.get("/", async (req, res) => {
        let users = await userData.getAllUsers();

        res.render("home", { user: req.user, users: users });
    });

    app.get("/login", (req, res) => {
        res.render("login", { error: req.query.error, message: req.query.message });
    });

    app.post("/login", (req, res, next) => {
        if (!req.body.username) return res.redirect("/login?error=" + encodeURIComponent("Please specify a username!"));
        if (!req.body.password) return res.redirect("/login?error=" + encodeURIComponent("Please specify a password!"));
        next();
    }, passport.authenticate("local", { successRedirect: "/myblog", failureRedirect: "/login?error=" + encodeURIComponent("Invalid username or password!") }));

    app.get("/create_account", (req, res) => {
        res.render("create_account", { error: req.query.error });
    });

    app.post("/create_account", async (req, res) => {
        try {
            let user = await userData.addUser(req.body.name, req.body.phoneNumber, req.body.email, req.body.password);
            res.redirect("/login?message=" + encodeURIComponent("Your account was successfully created. Now you can log into your account."));
        } catch (err) {
            console.error(err);
            res.redirect("/create_account?error=" + encodeURIComponent("There was an error when creating the account."));
        }
    });

    app.get("/blog/:uid", async (req, res) => {
        if (req.user && req.user._id === req.params.uid){
            return res.redirect("/myblog");
        }
        
        let blogUser = await userData.getUserById(req.params.uid);
        let posts = await postData.getPostsByUserId(req.params.uid);

        res.render("blog", {
            user: req.user,
            blogUser: blogUser,
            posts: posts,
            error: req.query.error,
            message: req.query.message
        });
    });

    app.get("/myblog", async (req, res) => {
        if (!req.user) {
            res.redirect("/login?error=" + encodeURIComponent("You must login before accessing this page"));
            return;
        }

        let posts = await postData.getPostsByUserId(req.user._id);

        res.render("myblog", {
            user: req.user,
            posts: posts,
            error: req.query.error,
            message: req.query.message
        });
    });

    app.post("/myblog", async (req, res) => {
        if (!req.user) {
            res.redirect("/login?error=" + encodeURIComponent("You must login before accessing this page"));
            return;
        }

        try {
            let result = await postData.addPost(req.user._id, req.body.title, req.body.content);
            res.redirect("/myblog");
        } catch (e) {
            res.redirect("/myblog?error=" + encodeURIComponent("Error creating post: " + e));
        }
    });

    app.get("/myprofile", (req, res) => {
        if (!req.user) {
            res.redirect("/login?error=" + encodeURIComponent("You must login before accessing this page"));
            return;
        }

        res.render("myprofile", {
            user: req.user,
            error: req.query.error,
            message: req.query.message
        });
    });

    app.get("/edit_profile", (req, res) => {
        if (!req.user) {
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
        if (!req.user) {
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
            res.redirect("/myprofile?message=" + encodeURIComponent("Profile updated!"));
        } catch (err) {
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