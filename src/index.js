require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app");

const port = process.env.PORT || 5000;
const DB_CONNECTION_STRING =
  process.env.NODE_ENV !== "production"
    ? "mongodb://localhost:27017/travel-log"
    : process.env.CONNECTION_STRING;

const main = () => {
  mongoose
    .connect(DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connected to DB");
      app.listen(port, () =>
        console.log(`server is listening at PORT: ${port}`)
      );
    })
    .catch((err) => console.log(err));
};

main();
