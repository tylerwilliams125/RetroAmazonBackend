import express from 'express';
import debug from 'debug';
const debugBook = debug('app:book.js');
import {connect, getBooks, getBookById,updateBook, addBook, deleteBook} from '../../database.js';
import { validId } from '../../middleware/validId.js';
import Joi from 'joi';
import { validBody } from '../../middleware/validBody.js';

const router = express.Router();

const newBookSchema = Joi.object({
  isbn:Joi.string().trim().min(14),
  title:Joi.string().trim().min(1).required(),
  author:Joi.string().trim().min(1).max(50).required(),
  genre:Joi.string().valid('Adventure', 'Action', 'Mystery', 'Drama','Horror'),
  publication_year:Joi.number().integer().min(1900).max(2023).required(),
  price:Joi.number().min(0).required(),
  description:Joi.string().trim().min(1).required(),
});

const updateBookSchema = Joi.object({
  isbn:Joi.string().trim().min(14),
  title:Joi.string().trim().min(1),
  author:Joi.string().trim().min(1).max(50),
  genre:Joi.string().valid('Adventure', 'Action', 'Mystery', 'Drama','Horror'),
  publication_year:Joi.number().integer().min(1900).max(2023),
  price:Joi.number().min(0),
  description:Joi.string().trim().min(1),

})

//get all books
router.get('/list', async (req, res) => {
  debugBook('Getting all books')
  try{
    const db = await connect();
    const books = await getBooks();
    res.status(200).json(books)
  }catch(err){
    res.status(500).json({error: err.stack});
  }
});

//get a book by the ID
router.get('/:id', validId('id'), async (req, res) => {
  const id = req.id;
  try{
    const book = await getBookById(id);
  
    res.status(200).json(book);
   
  }catch(err){
    res.status(500).json({error: err.stack});
  }

});

//update a book by the ID
//update can use a put or a post
router.put('/update/:id', validId('id'), validBody(updateBookSchema), async (req, res) => {
  const id = req.id;
  const updatedBook = req.body;
  if(updatedBook.price){
    updatedBook.price = parseFloat(updatedBook.price);
  }


  try{
    const updateResult = await updateBook(id,updatedBook);
      if(updateResult.modifiedCount == 1){
      res.status(200).json({message: `Book ${id} updated`})
      }else{
        res.status(400).json({message: `Book ${id} not updated`})
      }
    }catch(err){
      res.status(500).json({error: err.stack});
    }
});

//add a new book to the array\
router.post('/add', validBody(newBookSchema), async (req, res) =>{
  const newBook = req.body;

  try{
    const dbResult = await addBook(newBook);
    if(dbResult.acknowledged == true){
      res.status(200).json({message: `Book ${newBook.title} added with an id of ${dbResult.insertedId}`});
    }else{
      res.status(400).json({message: `Book ${newBook.title} not added`})
    }
  }catch(err){
    res.status(500).json({error: err.stack});
  }
});

//delete a book by the id
router.delete('/delete/:id', async (req,res) => {
  //gets the id from the url
  const id = req.params.id;

  try{
    const dbResult = await deleteBook(id);
    if(dbResult.deletedCount == 1){
      res.status(200).json({message: `Book ${id} deleted`})
      }else{
        res.status(400).json({message: `Book ${id} not deleted`})
      }
  }catch(err){
    res.status(500).json({error: err.stack});
  }
});


export {router as BookRouter};