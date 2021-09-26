const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const {
  errorHandler,
  notFound,
  checkTokenAndSetUser,
} = require("./middlewares");
const api = require("./api");

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

app.use(checkTokenAndSetUser);

app.use("/api/v1", api);

app.get("/", (_, res) => {
  res.json({
    message: "Hello world",
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
