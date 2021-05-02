require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('view engine', 'pug');
app.use(express.static('public'));

//username:summer_shoes
//password:KKf4U1BrECBqTcSx

// var MongoUrl=process.env.MONGO_DB;



/*Mongo*/
/* const MongoClient = require('mongodb').MongoClient; */
/* const url = 'mongodb://127.0.0.1:27017'; */
/* MongoClient.connect(url, function (err, client) {
  console.log("Connected successfully to  Mongo server");
}); */
/* const ObjectID = require('mongodb').ObjectID; */


//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*Schema*/
const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  color: String
}, { collection: 'summershoes' });
/*Model*/
const productModel = mongoose.model('productModel', productSchema);
// console.log("This  is  a product model ",productModel)



/*MainPage index*/
app.get('/', async (req, res) => {

  // Method 1  for solving  promise 
  //  productModel.find().exec().then((documents)=>{ 
  //   res.render('index', { products: documents });
  // });

  //Method 2 
  const documents = await productModel.find().exec();
  console.log("this is products", documents)
  res.render('index', { products: documents });



});

/*Products indivudual page */
app.get('/products/:id', async (req, res) => {

  const selectedId = req.params.id;
  const document = await productModel.findOne({ "_id": selectedId }).exec();

  res.render('products', { product: document });




});
/*Create a new item*/
app.post('/products', urlencodedParser, async (req, res) => {


  const newProd = {
    name: req.body.product,
    image: req.body.image_shoe,
    color: req.body.shoe_color

  }
  await productModel.create(newProd);
  res.redirect('/')

});

/*Delete Item*/
app.get('/products/delete/:id', async (req, res) => {
  const selectedId = req.params.id;

  await productModel.deleteOne({ "_id": selectedId }).exec()
  res.redirect("/");
  // MongoClient.connect(url, function (err, client) {
  //   const db = client.db('ShoesDB');
  //   const collection = db.collection('summershoes');

  //   collection.deleteOne({ "_id": ObjectID(selectedId) });
  //   res.redirect("/");
  // });




});

/*Update*/
app.post('/products/:id', urlencodedParser, async(req, res) => {



 

    const updatedId = req.params.id
    const filter = { "_id": updatedId };
    const update = { $set: { name: req.body.product } };



    await productModel.updateOne(filter, update).exec()

    res.redirect('/');

  });





  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });