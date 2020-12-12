// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const morgan = require("morgan");
const session = require("express-session");

// Custom routes
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

// Custom Error
const ExpressError = require("./utils/ExpressError");

// Database setup
mongoose.connect("mongodb://localhost:27017/yelpCamp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Defines app
const app = express();

// Ejs template setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

// Views and Public setup
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Installed middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

// Throws 404 if no route found
app.all("*", (req, res, next) => {
  return next(new ExpressError("Page Not Found", 404));
});

// Renders error if found
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

// Starts server
app.listen("3000", () => {
  console.log("Serving on port 3000");
});
