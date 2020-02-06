var express = require('express');
const actions = require("./actions");
var routes = express.Router();
const { validatePassword, validateUsername } = require('../middleware/common')

routes.get('/svestenici', actions.getAllSvestenici);
routes.post("/svestenici", validateUsername, validatePassword, actions.createNewSvestenik);
routes.put('/svestenici/uslugi',  actions.createNewUsluga);
routes.put('/svestenici/proizvod',  actions.createNewProizvod);

module.exports = routes;