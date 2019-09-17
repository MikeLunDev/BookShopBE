const express = require("express");
const bodyParser = require("body-parser");
const bookRouter = require("./services/books");
const commentRouter = require("./services/comments");
const cors = require("cors");
const listRoutes = require("express-list-endpoints");
const server = express();

server.set("port", process.env.PORT || 3450);

server.use(bodyParser.json());
/* 
var whitelist = ["https://strivebooks.herokuapp.com", "http://localhost:3450/"];
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}; */
server.use("/books/comments", cors(), commentRouter);
server.use("/books", cors(), bookRouter);

console.log(listRoutes(server));

server.listen(server.get("port"), () => {
  console.log("SERVER IS RUNNING ON " + server.get("port"));
});
