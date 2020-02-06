const con = require("../database");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


getAllVerniciQuery = () => {
    let query = "select * from vernici";
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
getAllVernici = async (req, res) => {


    try {
        const vernici = await getAllVerniciQuery();
        res.status(200).send(vernici);
    } catch (error) {
        res.status(400).send(error.message)
    }
};


createNewVernikQuery = (body, password) => {


    const query = "INSERT INTO vernici (ime,prezime,username,password) values (?,?,?,?)"
    return new Promise((resolve, reject) => {
        con.query(query, [body.ime, body.prezime, body.username, password], (error, results, fields) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}

createNewVernik = async (req, res, next) => {

    try {
        let data = await getAllVerniciQuery();
        let exists = data.some(element => element.username === req.body.username);
        if (!exists) {
            const userRequest = req.body;
            const passHash = bcrypt.hashSync(userRequest.password, 10);
            await createNewVernikQuery(req.body, passHash)
            res.status(200).send("Vernik kreiran")
        } else {
            var error = new Error("Username alredy exists");
            error.status = 401;
            next(error);
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

vernikNajavaQuery = (body) => {
    let query = "SELECT username, password FROM vernici WHERE username = ?";
    return new Promise((resolve, reject) => {
        con.query(query, [body.username], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            };
        });
    });
};

vernikNajava = async (req, res, next) => {
    const pass = req.body.password;
    try {
        let vernik = await vernikNajavaQuery(req.body);
        const matchPass = bcrypt.compareSync(pass, vernik[0].password);

        if (matchPass) {
            const token = jwt.sign({ vernik }, "bbbb", { expiresIn: "2h" });
           // res.header("authToken", token).send("LOGGED IN");
            res.status(200).send(token)
        } else {
            var error = new Error("Wrong username / password");
            error.status = 406;
            next(error);
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}

startTransactionQuery = () => {
    let query = "START TRANSACTION";
    return new Promise((resolve, reject) => {
        con.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            };
        });
    });
};
rollbackQuery = () => {
    let query = "ROLLBACK";
    return new Promise((resolve, reject) => {
        con.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            };
        });
    });
};

commitkQuery = () => {
    let query = "COMMIT";
    return new Promise((resolve, reject) => {
        con.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            };
        });
    });
};

createPrometQuery = (body, cena, proizvod) => {
    const query = "INSERT INTO promet (vernikBillingInfoID,iznosPromet,opisPromet) values (?,?,?)"
    return new Promise((resolve, reject) => {
        con.query(query, [body.vernikBillingInfoID, cena, proizvod], (error, results, fields) => {        //1
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}

getProizvodAndCenaQuery = (id) => {
    let query = "SELECT proizvod, cena from prodavnica where id = ?";
    return new Promise((resolve, reject) => {
        con.query(query, [id], (error, results, fields) => {
            if (error) {
                reject(error)
            } else {
                resolve(results);
            };
        });
    });
};

updateVernikBillingInfoQuery = (body) => {
    const query = "update vernikbillinginfo set sostojbaNaSmetka = (sostojbaNaSmetka - (select iznosPromet from promet where id = (SELECT MAX(id) FROM promet))) where id = ?"
    return new Promise((resolve, reject) => {
        con.query(query, [body.vernikBillingInfoID], (error, results, fields) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}


kasaQuery = (cena) => {
    // const query = "update kasa set sostojba = (sostojba + (select iznosPromet from promet where id = (SELECT MAX(id) FROM promet))) where id = 1"
    const query = "update kasa set sostojba = kasa.sostojba + ? where id = 1";
    return new Promise((resolve, reject) => {
        con.query(query, [cena], (error, results, fields) => {
            if (error) {
                console.log(error);
                reject(error)
            } else {
                console.log(results.affectedRows);
                if (results.affectedRows == 0) {
                    reject("ERROR");
                }
                resolve()
            }
        })
    })
}

korisnikPoIdQuery = (id) => {
    const query = "SELECT * FROM vernikbillinginfo WHERE vernikID = ?";
    return new Promise((resolve, reject) => {
        con.query(query, [id], (error, results, fields) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            };
        });
    });
};

naplata = async (req, res, next) => {
    try {
        //PROIZVOD I CENA
        let podatoci = await getProizvodAndCenaQuery(req.params.prodavnicaid);
        let cena = parseFloat(podatoci[0].cena);
        let proizvod = podatoci[0].proizvod;
        let korisnik = await korisnikPoIdQuery(req.body.vernikBillingInfoID);
        console.log(korisnik[0].sostojbaNaSmetka);
        if (korisnik[0].sostojbaNaSmetka > cena) {
            await startTransactionQuery();
            await createPrometQuery(req.body, cena, proizvod);
            await updateVernikBillingInfoQuery(req.body);
            await kasaQuery(cena);
            await commitkQuery();
            res.send("успешна наплата")
        } else {
            res.status(400).send("Немате доволно средства ");
        }

    } catch (error) {
        rollbackQuery();
        res.send(error.message);
    }
}

module.exports = { getAllVernici, createNewVernik, vernikNajava, naplata };