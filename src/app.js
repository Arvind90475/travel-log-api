const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

const api = require("./api");
const {
  errorHandler,
  notFound,
  checkTokenAndSetUser,
} = require("./middlewares");

app.use(morgan("tiny"));
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json());
app.use(cookieParser());

// check each request and setuser if token exists
app.use(checkTokenAndSetUser);

//entry point to routes
app.use("/api/v1", api);

app.get("/", (_, res) => {
  res.status(200).json({
    message: "Hello world",
  });
});

//not found and error handling middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
