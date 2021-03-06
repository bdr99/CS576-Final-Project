# CS576-Final-Project

## Description
This example blog website will be used to demonstrate XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery) attacks.

## Prerequisites
In order to run this application, you must first install [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/).

## Usage
To run the application, open two terminals. In one terminal, run `mongod` to start the database server. In the other terminal, change to the project directory. Run `npm install` to install the dependencies. Then, run `npm start` to start the application. If the application starts successfully, you will see the message `Server is running on port 3000`. Access `http://localhost:3000/` in your browser to view the site.
This project also includes a simple web server which can be used to demonstrate a CSRF attack. To start this server, run the command `npm run csrf` which will start the web server on port 5000.

## XSS Protection
The XSS protection is achieved by an Express middleware function which is contained in the file [`middleware/sanitize.js`](middleware/sanitize.js). This middleware function replaces Express's built-in `res.render` function with a custom one that calls the built-in one after sanitizing the input data. This sanitization is performed by replacing characters with their HTML-encoded equivalents; for example, replacing `&` with `&amp;`.

## CSRF protection
The CSRF protection also takes the form of an Express middleware function, located in [`middleware/csrf.js`](middleware.csrf.js). This middleware has two parts. The first part replaces the built-in `res.send` function with one that modifies any HTML pages before they are delivered in the HTTP response. It adds a hidden element to all HTML forms containing a CSRF token which is unique to the user's session. The second part, which runs on all `POST` requests, validates the token and rejects the request if it is incorrect or missing.

## Enabling Protections
The protections are imported into the application via `require` statements on lines 9 and 10 in [`index.js`](index.js), and are attached to the Express application on lines 58 and 59. Simply uncommenting these lines is all that is required to protect this web application against XSS and CSRF attacks.

## Authors
Brandon Rothweiler, Scott Enriquez, Javier Serrano