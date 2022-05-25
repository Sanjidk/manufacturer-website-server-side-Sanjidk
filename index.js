const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.port || 5000;

// DB_USER=manufacture_admin
// DB_PASS=S1XkzzEaCcyI3YxV
// 32302767969bb8c6b90a19d3f7f7a514a63d89bcd52bfe76ce9d1ba5678dcde58823530ec8c26a42bbaf316c63b408e52496f6b3810d224971e6ae6e316bda6c

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lhkhpsa.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
      await client.connect();
      const toolsCollection = client.db('manufacture_tool').collection('tools');
      const orderCollection = client.db('manufacture_tool').collection('orders');
      const userCollection = client.db('manufacture_tool').collection('users');




      app.put('/user/:email', async (req, res) => {
        const email = req.params.email;
        const user = req.body;
        const filter = { email: email };
        const options = { upsert: true };
        const updateDoc = {
          $set: user,
        };
        const result = await userCollection.updateOne(filter, updateDoc, options);
        const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        res.send({ result, token });
      });




      app.get('/tool', async (req, res)=>{
          const query = {};
          const cursor = toolsCollection.find(query);
          const tools = await cursor.toArray();
          res.send(tools);

      })

      app.get("/tool/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const item = await toolsCollection.findOne(query);
        res.send(item);
      });


     
    }

    finally {
  
    }
  }
  
  run().catch(console.dir);
  
  
  app.get('/', (req, res) => {
    res.send('Hello From Manufacture Tools')
  })
  
  app.listen(port, () => {
    console.log(`Manufacture App listening on port ${port}`)
  })
