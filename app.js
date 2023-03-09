var express = require("express");
require("dotenv").config();
var path = require("path");
var logger = require("morgan");
// cookieParser and session are used to manage your cookies and session variables
var cookieParser = require("cookie-parser");
const session = require("express-session");
// This is used to connect o mongodb
const MongoStore = require("connect-mongo");

// this is a third party tool to do authentication
const passport = require("passport");

var indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const projectsRouter = require("./routes/projects");
const userDataRouter = require("./routes/userData");
const searchProjectsRouter = require("./routes/searchProjects");
var app = express();

app.use(logger("dev"));
app.use(express.json()); // body-parser this allows you to use req.body
app.use(express.urlencoded({ extended: false }));  // this allows you to use req.body
app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    // this next property is saving the session data in our DB
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://MongoApe212:MongoApe212@codeimmersivescluster.oimxt3p.mongodb.net/?retryWrites=true&w=majority",
      dbName: "OpTask",
      collection: "sessions",
    }),
    cookie: {
      maxAge: 7 * 1000 * 60 * 60 * 25, // cookies/sessions will last a week before requiring a re-login
    },
  })
);

require("./auth/passportConfig");

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});
//edited code to include environmental variable per instructions
app.use(cors(
  {
    origin:process.env.CORS_ORIGIN
  }
));

app.use("/api", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/userData", userDataRouter);
app.use("/api/searchProjects", searchProjectsRouter);

module.exports = app;
