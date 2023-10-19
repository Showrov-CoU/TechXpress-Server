const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.0vftcn5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("brandDB");
    const brandCollection = database.collection("brands");
    const productCollection = database.collection("products");
    const myCartCollection = database.collection("myCart");

    app.get("/brand", async (req, res) => {
      const cursor = await brandCollection.find();
      const brands = await cursor.toArray();
      res.send(brands);
    });

    // for view products of specific brand
    app.get("/product/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      const query = { brandName: brandName };
      const cursor = await productCollection.find(query);
      const products = await cursor.toArray();
      //   console.log(brandName);
      res.send(products);
    });

    app.get("/product", async (req, res) => {
      const cursor = await productCollection.find();
      const products = await cursor.toArray();
      res.send(products);
    });

    // for view details product
    app.get("/productdetails/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const product = await productCollection.findOne(query);

      //   console.log(brandName);
      res.send(product);
    });

    app.get("/mycart", async (req, res) => {
      const cursor = await myCartCollection.find();
      const brands = await cursor.toArray();
      res.send(brands);
    });

    //store product to mycart
    app.post("/mycart", async (req, res) => {
      const data = req.body;
      const result = await myCartCollection.insertOne(data);
      res.send(result);
    });

    // for view all brands
    app.post("/brand", async (req, res) => {
      const data = req.body;
      const result = await brandCollection.insertMany(data);
      //res.send("ok");
      res.send(result);
    });

    app.post("/product", async (req, res) => {
      const data = req.body;
      const result = await productCollection.insertMany(data);
      //res.send("ok");
      res.send(result);
    });

    app.post("/brand", async (req, res) => {});
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
