const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { sequelize } = require("./Models/index.js");

app.use(cors());
app.use(express.json());
app.use('/', require('./controllers/index.js'));

<<<<<<< HEAD
app.listen(process.env.SERVERPORT, () => {
    console.log(`Server is running on port ${process.env.SERVERPORT}`);
}) 
=======
sequelize.sync().then(() => {
    app.listen(process.env.SERVERPORT, () => {
        console.log(`Server is running on port ${process.env.SERVERPORT}`);
    });
    console.log("Toutes les tables ont été synchronisées.");
}).catch(err => {
    console.error("Erreur lors de la synchronisation des tables :", err);
});
>>>>>>> origin/Ryan
