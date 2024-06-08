const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const router = require("./routes");

const app = express();
app.use(cors());
app.use(router);

const Port = process.env.PORT || 8000;

app.listen(Port, () => {
  console.log("Express");
});
