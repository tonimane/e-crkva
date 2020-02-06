var express = require('express');
var verniciRouter = require('./vernici/routes');
var ikoniRouti = require("./ikoni/routes");
var svesteniciRouti = require("./svestenici/routes")
const appRouter = express.Router();
appRouter.use(verniciRouter);
appRouter.use(ikoniRouti);
appRouter.use(svesteniciRouti);
module.exports = appRouter;