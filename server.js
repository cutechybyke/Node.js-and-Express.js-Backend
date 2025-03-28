// // console.log('Heyy World')

// // const os = require('os');
// // const path = require('path')
// // const { add, subtract, multiply, divide } = require('./math')

// // console.log(add(2, 3))
// // console.log(subtract(2, 3))
// // console.log(multiply(2, 3))
// // console.log(divide(2, 3))

// // console.log(os.type())
// // console.log(os.version())
// // console.log(os.homedir())

// // console.log(__dirname)
// // console.log(__filename)

// // console.log(path.dirname(__filename))
// // console.log(path.basename(__filename))
// // console.log(path.extname(__filename))
// require('dotenv').config();
// const express = require('express');
// const app = express();
// const path = require('path');
// const cors = require('cors');
// // const { logger } = require('./middleware/logEvents');
// const mongoose = require('mongoose');
// const connectDB = require('./config/dbConn');
// const PORT = process.env.PORT || 3500;


// connectDB();


// app.use(cors());

// app.get('^/$|/index(.html)?', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'index.html'));
//   // ('./views/index.html', { root: __dirname });
// });

// app.get('/new-page.(html)?', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
// });

// app.get('/old-page.(html)?', (req, res) => {
//   res.redirect(301, '/new-page.html');
// });



// app.get('/*', (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// })

// mongoose.connection.once('open', () => {
//   console.log('Connected to MongoDB');
//   app.listen(PORT, () => console.log(`server running on port ${PORT}`));
// })



// // myEmitter.on('log', (msg) => logEvents(msg));

// // setTimeout(() => {
// //   // emit event
// //   myEmitter.emit('log', 'Log event emitted!');
// // }


require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
