require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var commentsRouter = require("./routes/comments");
var audiosRouter = require("./routes/audios");
var cardsRouter = require("./routes/cards");

var app = express();
const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/comments", commentsRouter);
app.use("/audios", audiosRouter);
app.use("/cards", cardsRouter);

module.exports = app;
