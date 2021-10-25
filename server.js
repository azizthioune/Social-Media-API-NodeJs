const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes')
require('dotenv').config({path: './config/.env'});
require('./config/db')
const {checkUser, requireAuth } = require('./middleware/auth.middleware');
const cors = require('cors');
const app = express();

app.use(cors());

// const corsOptions = {
//     origin: process.env.CLIENT_URL,
//     credentials: true, 
//     'allowedHeaders': ['sessionId', 'Content-Type'],
//     'exposedHeaders': ['sessionId'],
//     'method': 'GET,HEAD,PUT,POST,DELETE',
//     'preflightContinue': false 
// }
//app.use(cors(corsOptions))
//app.use(cors({origin: process.env.CLIENT_URL}))


app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/client/public'));
//jwt 
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});

// routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

// server
app.listen(process.env.PORT, ()=> {
    console.log(`Listening on port ${process.env.PORT}`);
} )