const mysql = require("mysql2");

const db = mysql.createConnection(

    {
        host: 'localhost',
        user: 'root',
        password: 'abc123',
        database: "employees",
    },
    console.log("Database connected.")

);

module.exports = db;