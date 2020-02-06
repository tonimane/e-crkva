let express = require("express");
let routes = express.Router();
let actions = require("./actions");

routes.patch("/test" , actions.naplata);

module.exports = routes;