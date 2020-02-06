let con = require("../database");
let { Vernik } = require("../models");



ikonaQuery = (cena, id) => {
    let query = "UPDATE vernikbillinginfo SET sostojbaNaSmetka = sostojbaNaSmetka - ? WHERE vernikID = ?";
    return new Promise((resolve, reject) => {
        con.query(query, [cena, id], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        })
    })
}

vernikPoImeQuery = (ime) => {
    let query = "SELECT * FROM vernici  JOIN vernikbillinginfo ON vernici.id = vernikbillinginfo.vernikID WHERE username = ?";
    return new Promise((resolve, reject) => {
        con.query(query, [ime], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            };
        });
    });
};

updateKasaQuery = (cena) => {
    const query = "update kasa set sostojba = (sostojba + ?) where id = 2"
    return new Promise((resolve, reject) => {
        con.query(query, [cena], (error, results, fields) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}


naplata = async (req, res) => {


    try {
        let vernik = await vernikPoImeQuery(req.body.ime);
        if (vernik[0] !== undefined) {
            let vernik1 = new Vernik(vernik[0].vernikID, vernik[0].ime, vernik[0].sostojbaNaSmetka);
            //console.log(vernik1.smetka);
            if (vernik1.smetka >= req.body.cena) {
                await ikonaQuery(req.body.cena, vernik1.id);
                await updateKasaQuery(req.body.cena);
                res.status(200).send("Успешна наплата");
            }else{
                res.status(300).send("Немате пари");
            }
        } else {
            res.status(404).send("Погрешно Корисничко Име");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}



module.exports = { naplata }