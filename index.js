require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./database/db');
const userRouter = require('./routes/user-routes.js');

connectDB();
app.use(express.json());


app.use('/api/user',userRouter);


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}!`));