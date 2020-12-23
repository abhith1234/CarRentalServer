const mysql=require('mysql2')
const pool=mysql.createPool({
    host:'localhost',
    port:3306,
    user:'root',
    password:'abhith@1234',
    database:'car_rental_system',
    connectionLimit:20,
    waitForConnections:true,
    queueLimit:0
})

module.exports={
    connection:pool
}