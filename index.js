const express = require("express");
const app = express();
const {mongoDbConnect}= require("./connection.js");
const urlRouter = require("./routes/url.js");
const PORT= 8001;

mongoDbConnect("mongodb://127.0.0.1:27017/lilUrl");

app.use(express.json());
app.use("/lilUrl",urlRouter);

app.listen(PORT,()=>console.log(`server started sucessfully at port ${PORT}`));