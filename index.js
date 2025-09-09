const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const checkForAuthenticationCookies = require("./middleware/authentication");

const userRoutes = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog");

const app = express();
const PORT = 8000;

mongoose.connect("mongodb://localhost:27017/blogify").then(e => {
    console.log("mongodb connected")})

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookies("token"));
app.use(express.static(path.resolve("./public")));
app.get("/", async(req, res) => {
    const allblogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render("home", {
        user: req.user,
        blogs: allblogs,
    });
});


app.use("/user", userRoutes);
app.use("/blog", blogRoute);


app.listen(PORT, () => console.log("server created at PORT 8000"));

