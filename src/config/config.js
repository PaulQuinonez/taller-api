const mongoose = require('mongoose');
require('dotenv').config({path: '.env'})

// CONFIGURACION DE DB
const connectionDB = async() => {
    try {
        await mongoose.connect(process.env.DB_MONGO);
        console.log("*                   Base de datos conectada!                   *");
        console.log("****************************************************************");
    } catch (error) {
        console.log("\n" + error);
        process.exit(1); // !La aplicacion se detiene
    }
}

module.exports = connectionDB;