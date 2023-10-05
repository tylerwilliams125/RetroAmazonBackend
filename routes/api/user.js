import express from 'express';
import debug from 'debug';
const debugUser = debug('app:User');
import {addUser, loginUser} from '../../database.js';
import bcrypt from 'bcrypt';

const router = express.Router();



router.get('/list', (req, res) => {
    res.send('Hello from Amazon.com User Route!')
});

router.post('/add', async (req,res) =>{
    const newUser = req.body;

    newUser.password = await bcrypt.hash(newUser.password, 10);
    try{
        const result = await addUser(newUser);
        res.status(200).json({message: `User ${result.insertedId} added`});
    }catch(err){

    }
});

router.post('/login', async (req,res) => {
  const user = req.body;

  const resultUser = await loginUser(user);
  debugUser(resultUser);
  if(resultUser && await bcrypt.compare(user.password, resultUser.password)){
    res.status(200).json(`Welcome ${resultUser.fullName}`);
  }else{
    res.status(401).json(`email or password incorrect`);
  }

});

export {router as UserRouter}