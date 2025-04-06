const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const mysql = require('mysql');
const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/Product');
const app = express();



app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user' ,userRoute);
app.use('/category', categoryRoute);
app.use('/product',productRoute);

module.exports = app;