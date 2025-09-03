require("dotenv").config(); //need this to work with env variables

const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const blogRoute = require("./routes/blog");
const Blog = require("./Models/blog");

//const PORT = 8000; We cant give fix port no. as on cloud it may not be available

const PORT=process.env.PORT
const app = express();

//we will give the values of these env variables in .env so that it can run on our local machine and at deployment runtime cloud will automatically assign the available values to these env variables

mongoose
.connect(process.env.MONGO_URL)
  //.connect("mongodb://localhost:27017/blogify") similarly here we cant give fix url
  .then((e) => console.log("mongo db connected"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("Token"));
app.use(express.static(path.resolve("./Public")));

app.set("view engine", "ejs");
app.set("views", path.resolve("./Views"));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", { user: req.user, blogs: allBlogs });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log("Port started on", PORT);
});
