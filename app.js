require("dotenv").config();

const express = require("express");
const app = express();
const {mongoDbConnect}= require("./connection.js");
const {restrictTo, checkLoggedIn} = require("./middlewares/auth.js");
const cookieParser = require("cookie-parser")
const urlRouter = require("./routes/url.js");
const staticRouter = require("./routes/staticRoute.js");
const userRouter = require("./routes/users.js");
const PORT = process.env.PORT || 8001;
const path = require("path");

mongoDbConnect(process.env.MONGODB_URI);

app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));
app.use(express.static(path.resolve("./public")));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkLoggedIn);
app.use("/lilUrl",restrictTo("ADMIN", "NORMAL",""),urlRouter);
app.use ("/users", userRouter);
app.use("/", staticRouter);

app.listen(PORT,()=>console.log(`server started sucessfully at port ${PORT}`));