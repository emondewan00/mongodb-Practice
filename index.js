const express = require("express");
const mongoose = require("mongoose");
const movieRoute = require("./handler/movieHandler");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());

//mongoose connection
mongoose
  .connect(process.env.CON_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("server connected");
  })
  .catch((err) => {
    console.log(err, "error to connect to the server");
  });
app.use("/movies", movieRoute);
//root route
app.get("/", (req, res) => {
  console.log("hallo");
  res.send("hello");
});

//port listening
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
