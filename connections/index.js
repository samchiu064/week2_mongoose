const dotenv = require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("connect success");
  })
  .catch((err) => console.log(err));
