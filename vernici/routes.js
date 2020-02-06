var express = require('express');
const actions = require("./actions");
var routes = express.Router();
const { validatePassword, validateUsername } = require('../middleware/common')

routes.get('/vernici', actions.getAllVernici);
routes.post('/vernici', validateUsername, validatePassword, actions.createNewVernik);
routes.post("/vernici/najava", actions.vernikNajava);
routes.patch("/vernicinaplata/:prodavnicaid", actions.naplata);
module.exports = routes;