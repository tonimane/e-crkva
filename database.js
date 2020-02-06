var mysql =require('mysql');
require('dotenv/config');
var connection = mysql.createConnection({
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
});

connection.connect((error)=>{
    if(error)throw error
    console.log('поврзан со базата на податоци')
});

module.exports = connection;