import express from 'express';
import { BookRouter } from './routes/api/book.js';
import { UserRouter } from './routes/api/user.js';
import * as dotenv from 'dotenv';
dotenv.config();



//create a debug channel called app:Server
import debug from 'debug';
const debugServer = debug('app:Server.js')


const app = express();
//middleware
//allow form data
app.use(express.urlencoded({extended: true}));
app.use('/api/books', BookRouter);
app.use('/api/users', UserRouter)

//error handling middleware
app.use((req, res) => {
    res.status(404).json({error: `Sorry couldn't find ${req.originalUrl}`});
});

//handle server exceptions to keep ,y server from crashing
app.use((err, req, res, next) => {
    debugServer(err.stack);
    res.status(500).json({})
});


//default route
app.get('/',(req,res) => {
    debugServer('Hello from the upgraded console.log()!');
    res.send('Hello From Amazon.com!');
    
});

const port = process.env.PORT || 3005; 

// Listen on port 3003
app.listen(3003, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});