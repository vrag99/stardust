const express = require('express');
const axios = require('axios');
const calculate = require('./calculate');
dotenv.config();


const app = express();
const url = ""

app.get('/calculate', async (req, res) => {

 });

app.get('/calculate/dc', async (req, res) => {


});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
})

