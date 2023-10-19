const express = require('express');
const cors = require('cors');
require('dotenv').config()


const app= express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z9xqo9p.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const brandCollection = client.db('fashionStore').collection('brand');

    // Send a ping to confirm a successful connection

    // Brand Query
    app.get('/brands', async(req,res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

  app.post('/brands', async (req, res) => {
      const newBrand = req.body;
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand);
      res.send(result);
  })
  // Product Query
  app.get('/products', async(req,res) => {
    const cursor = productCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})
app.get('/product/:id', async(req,res)=> {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await productCollection.findOne(query);
    res.send(result);

})

app.post('/products', async (req, res) => {
    const newBrand = req.body;
    console.log(newBrand);
    const result = await productCollection.insertOne(newBrand);
    res.send(result);
})
app.put('/product/:id', async(req,res) => {
  const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = {upsert:true};
    const updatedProduct = req.body;
    const product = {
        $set:{
          name: updatedProduct.name,
          brand: updatedProduct.brand,
          price: updatedProduct.price,
          type:updatedProduct.type,
          description:updatedProduct.description,
          rating:updatedProduct.rating,
          photo: updatedProduct.photo
        }
    }
    const result = await productCollection.updateOne(filter,product,options)
    res.send(result);

})

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) => {
    res.send("Fashion and apprearl making server is running")
})
app.listen(port, () => {
    console.log(`Fashion Server is running on port: ${port}`)

})