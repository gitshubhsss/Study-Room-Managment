const express = require("express");
const { request } = require("http");
const app = express();

const path = require("path");
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname,"/public/Images/")))
const methodOverride = require('method-override');
app.use(methodOverride('_method'))
const engine = require("ejs-mate");
app.engine("ejs", engine);
const flash=require('connect-flash');
//Models
const Admin = require("./models/admin.model"); 
app.listen(8080, () => {
  console.log("app is listening on the port 8080");
});
const sessionOpt = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
};

const session = require("express-session");
app.use(session(sessionOpt));//For each new request the session will start

const passport = require("passport");
const localStratergy = require("passport-local"); 

app.use(passport.initialize()); //passport will be initialize for every request
app.use(passport.session()); //Identifying the user using session

passport.use(new localStratergy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser()); //Serialize the (user) into the session
passport.deserializeUser(Admin.deserializeUser()); //Desirialize the (user) from the session
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});


//Routes
const indexRoute = require("./routes/index.route");
const adminRoute = require("./routes/admin.route");
const paymentRoute=require("./routes/payment.route")


app.use("/", indexRoute);
app.use("/", adminRoute);
app.use("/",paymentRoute);

app.all("*", (req, res, next) => {
  next(Error("something wents wrong"));
});

app.use((err, req, res, next) => {
  let { message } = err;
  res.send(message);
});
