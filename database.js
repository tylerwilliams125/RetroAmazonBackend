import {MongoClient, ObjectId} from "mongodb";
import debug from "debug";
const debugDatabase = debug("app:database.js");

let _db = null;

async function connect() {
  if(!_db){
    const connectionString ="mongodb+srv://tylerkwilliams125:ASW-G-01@cluster0.mpextes.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";
    const dbName = "RetroAmazon";
    const client = await MongoClient.connect(connectionString);
    _db = client.db(dbName);
  }
  return _db;

}

async function ping(){
    const db = await connect();
    await db.command({ping: 1});
    console.log("Pinged your deployment. You successfully connected to MongoDB!")
}


async function getBooks(){
  const db = await connect();
  //MongoSH command to find all books: db.books.find({})
  //find() returns a cursor, which is a pointer to the result set of a query.
  const books = await db.collection("Book").find().toArray();

  return books;
}

async function getBookById(id){
  const db = await connect();
  const books = await db.collection("Book").findOne({_id: new ObjectId(id)});
  return books;
}

async function addBook(book){
  const db = await connect();
  const result = await db.collection("Book").insertOne(book);
  debugDatabase(result.insertedId);
  return result;
}
async function updateBook(id, updatedBook){
  const db = await connect();
  const result = await db.collection("Book").updateOne({_id: new ObjectId(id)},{$set:{...updatedBook}});
  console.table(result);
  return result;
}
async function deleteBook(id){
  const db = await connect();
  const result = await db.collection("Book").deleteOne({_id: new ObjectId(id)});
  console.table(result);
  return result;
}


async function addUser(user){
  const db = await connect();
  const result = await db.collection("User").insertOne(user);
  //debugDatabase(result.insertId)
  return result;
}

async function loginUser(user){
    const db = await connect();
    const resultUser = await db.collection("User").findOne({email: user.email});
   return resultUser;
}

ping();

export{connect, ping, getBooks, getBookById, addBook,updateBook,deleteBook, addUser,loginUser};