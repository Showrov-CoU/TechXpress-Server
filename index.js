require("dotenv").config();
const express = require("express");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

//? create
const app = express();
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.0vftcn5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Database: Connect with Database
const dbConnect = async () => {
  try {
    client.connect();
    console.log(" Database Connected Successfully✅ ");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();

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
  const query = { _id: new ObjectId(id) };
  const product = await productCollection.findOne(query);
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
  //   console.log(data._id, "jsj");
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
  if (data.length > 1) {
    const result = await productCollection.insertMany(data);
    res.send(result);
  } else {
    const result = await productCollection.insertOne(data);
    res.send(result);
  }
});

app.put("/product/:id", async (req, res) => {
  const id = req.params.id;
  const updateProduct = req.body;
  const query = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const product = {
    $set: {
      image: updateProduct.image,
      productName: updateProduct.productName,
      brandName: updateProduct.brandName,
      type: updateProduct.type,
      price: updateProduct.price,
      rating: updateProduct.rating,
      description: updateProduct.description,
    },
  };
  const result = await productCollection.updateOne(query, product, options);
  res.send(result);
});

app.delete("/mycart/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: id };
  console.log(query);
  const result = await myCartCollection.deleteOne(query);
  res.send(result);
});

app.get("/", async (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
