const express = require("express");
const app = express();
const http = require("http");
const shortid = require('shortid');
const server = http.createServer(app);
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const middleware = require("./middleware.js");
const io = new Server(server);
const socket = require("./socket.js");

(() => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static("public"));

    io.on("connection",  socket => {
        server.listen(2000, () => {
            console.log("listening on *:2000");
        });
    });

})();
