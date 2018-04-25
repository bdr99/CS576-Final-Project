# CS576-Final-Project

## Description
This example blog website will be used to demonstrate XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery) attacks.

## Prerequisites
In order to run this application, you must first install [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/).

## Usage
To run the application, open two terminals. In one terminal, run `mongod` to start the database server. In the other terminal, change to the project directory. Run `npm install` to install the dependencies. Then, run `npm start` to start the application. If the application starts successfully, you will see the message `Server is running on port 3000`. Access `http://localhost:3000/` in your browser to view the site.

## XSS Protection
The XSS protection is achieved by an Express middleware function which is contained in the file [`middleware/sanitize.js`](middleware/sanitize.js). This middleware function replaces Express's built-in `res.render` function with a custom one that calls the built-in one after sanitizing the input data. This sanitization is performed by replacing characters with their HTML-encoded equivalents; for example, replacing `&` with `&amp;`.

## CSRF protection
The CSRF protection also takes the form of an Express middleware function, located in [`middleware/csrf.js`](middleware.csrf.js). This middleware has two parts. The first part replaces the built-in `res.send` function with one that modifies any HTML pages before they are delivered in the HTTP response. It adds a hidden element to all HTML forms containing a CSRF token which is unique to the user's session. The second part, which runs on all `POST` requests, validates the token and rejects the request if it is incorrect or missing.

## Authors
Brandon Rothweiler, Scott Enriquez, Javier Serrano