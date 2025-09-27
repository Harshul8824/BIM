const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

app.use(morgan("dev"));
app.use(express.json());
dotenv.config({ path: "./config.env" });

const app = express();

module.exports = app;
