const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
var bodyParser = require("body-parser");
const methodOverride = require('method-override');
const path = require('path');

const homeRouter = require('./routes/home');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');

const app = express();

dotenv.config();

// CONNECT DB
const db = require('./config/db');
db.connect();

app.use(bodyParser.json({limit:"50mb"}));
app.use(methodOverride('_method'));
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cookieParser());
// app.use(express.json());
app.use(morgan('common'));
app.use('/src/uploads', express.static(path.join(__dirname, 'uploads')));

// ROUTES
app.use('/v1/user', userRouter);
app.use('/v1/home', homeRouter);
app.use('/v1/admin', adminRouter);
app.use('/v1/cart', cartRouter);
app.use('/v1/order', orderRouter);
app.use('/v1', productRouter);

app.listen(process.env.PORT || 3000 , () => {
    console.log("Server is running..");
});