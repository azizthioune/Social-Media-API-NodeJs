const mongoose = require('mongoose');

mongoose
    .connect('mongodb+srv://' + process.env.DB_USER_PASS + '@cluster0.egcol.mongodb.net/socialmedia')
    .then(()=> console.log("connected to mongoDB"))
    .catch((err)=> console.log("failed to connect to mongoDB", err));