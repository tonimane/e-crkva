const express = require('express')
const { check, validationResult } = require('express-validator');

validateUsername = (req,res,next) =>{
    var username = req.body.username;
    if(username.length < 3 || username.length == 0){
        var error = new Error("Корисничкото име не може да биде помало од 3 карактери")
        error.status = 400;
        next(error)
    }
    next()
    
}


validatePassword = (req, res, next) =>{
    var password = req.body.password
    if(password.length < 3){
        var error = new Error("Невалиден пасворд")
        error.status = 400;
        next(error)
    }
    next()
}

wrongRoute = (req, res, next) => {
    var error = new Error("Route does not exists please try with another route");
    error.status = 404;
    next(error);
}

errorHandler = (err, req, res, next) => {
    errObj = {
        status: err.status,
        error: {
            message: err.message
        }
    }
    res.status(err.status).json(errObj)
}









module.exports = {
    wrongRoute, errorHandler,validatePassword, validateUsername
}