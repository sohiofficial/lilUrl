const express = require("express");
const app = express();
const {mongoDbConnect}= require("./connection.js");
const {allowLoggedIn, checkLoggedIn} = require("./middlewares/auth.js");
const cookieParser = require("cookie-parser")
const urlRouter = require("./routes/url.js");
const staticRouter = require("./routes/staticRoute.js");
const userRouter = require("./routes/users.js");
const PORT= 8001;
const path = require("path");

mongoDbConnect("mongodb://127.0.0.1:27017/lilUrl");

app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use("/lilUrl",allowLoggedIn,urlRouter);
app.use ("/users",checkLoggedIn, userRouter);
app.use("/", staticRouter);

app.listen(PORT,()=>console.log(`server started sucessfully at port ${PORT}`));