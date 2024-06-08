const { connect } = require("./database/dbconfig");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const router = require("./routes");

//DB connection
connect();

//Express and Middleware
const app = express();
app.use(cors());
app.use(router);

const Port = process.env.PORT || 8000;

app.listen(Port);
