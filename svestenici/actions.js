const con = require("../database");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


getAllSvesteniciQuery = () => {
    let query = "select * from svestenici";
    return new Promise((resolve, reject) => {
        con.query(query, (error, results, fields) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
};
getAllSvestenici = async (req, res) => {


    try {
        const svestenici = await getAllSvesteniciQuery();
        res.status(200).send(svestenici);
    } catch (error) {
        res.status(400).send(error.message)
    }
};

createNewSvestenikQuery = (body , password)=>{
    let query = "insert into svestenici (ime,prezime,username,password,cin) values (?,?,?,?,?)"
    return new Promise((resolve,reject)=>{
        con.query(query,[body.ime,body.prezime,body.username,password,body.cin],(error,results,fields)=>{
            if(error){
                reject(error)
            }else{
                resolve(results);
            }
        })
    })
}

createNewSvestenik = async(req,res,next)=>{
    let body = req.body;
    const userRequest = req.body;
    const passHash = bcrypt.hashSync(userRequest.password, 10);
    try {
        await createNewSvestenikQuery(body,passHash);
        res.status(200).send('svestenik kreiran')
    } catch (error) {
        res.status(400).send(error.message);
    }
}

createNewUslugaQuery = (body)=>{
    let query = "insert into uslugi (tipNaUsluga , cena , svestenikID) values (?,?,?)"
    return new Promise ((resolve,reject)=>{
        con.query(query , [body.tipNaUsluga,body.cena , body.svestenikID] , (error,results,fields)=>{
            if(error){
                reject(error)
            }else{
                resolve(results);
            }
        })
    })
}

createNewUsluga = async(req,res)=>{
    let body = req.body;
    try {
        await createNewUslugaQuery (body);
        res.status(200).send("nova usluga e kreirana")
    } catch (error) {
        res.status(400).send(error.message);
    }
}
 createNewProizvodQuery = (body)=>{
     let query = "insert into prodavnica (proizvod,cena) values(?,?)"
     return new Promise((resolve,reject)=>{
         con.query(query , [body.proizvod,body.cena],(error,results,fields)=>{
             if(error){
                 reject(error)
             }else{
                 resolve(results)
             }
         })
     })
 };

 createNewProizvod = async(req,res)=>{
     let body = req.body;
     try {
         await createNewProizvodQuery(body);
         res.status(200).send("kreiran nov proizvod")
     } catch (error) {
         res.status(400).send(error.message);
     }
 }



module.exports = {getAllSvestenici,createNewSvestenik,createNewUsluga,createNewProizvod}