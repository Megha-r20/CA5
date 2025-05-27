const express = require('express');
const dotenv = require('./.env');
const cors = require('cors');
const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');



app.use(express.app());

app.use('./user.js',User.js);























app.listen(PORT , ()=>{
    console.log("server is running in the PORT ${PORT}");
});

