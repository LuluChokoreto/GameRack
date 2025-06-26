const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use('/', require('./controllers/index.js'));

app.listen(process.env.SERVERPORT, () => {
    console.log(`Server is running on port ${process.env.SERVERPORT}`);
}) 
