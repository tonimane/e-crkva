const express = require('express');
let bodyParser = require("body-parser");
require('dotenv').config();
var jwt = require("express-jwt");
var unless = require('express-unless');
const appRouter = require('./router');
let middlewares = require("./middleware/common");

const app = express();


// let publicRoutes = ["/api/vernici/najava","/api/vernici"];
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// app.use(jwt({ secret: "bbbb" }).unless({ path: publicRoutes }));
app.get("/", (req, res) =>{
    res.status(200).sendFile("./public/index.html");
})
app.use('/api', appRouter);
app.use(middlewares.wrongRoute);
app.use(middlewares.errorHandler);



var port = process.env.PORT || 8080;
app.listen(port, ()=>{
    console.log (`API слуша на порта  ${port}`);
});

