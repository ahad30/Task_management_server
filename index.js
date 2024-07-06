const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qxclpw1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const taskCollection = client.db('taskManagementDB').collection('tasks');


    app.get('/tasks', async (req , res) => {
      try {
        const cursor = taskCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      }
      catch (error) {
        res.status(500).send({ message: "some thing went wrong" })
      }
    })


    app.get('/tasks/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await taskCollection.findOne(query);
        res.send(result);
      }
      catch (error) {
        res.status(500).send({ message: "some thing went wrong" })
      }
    })




    app.post('/tasks', async (req, res) => {
      try {
        const newTask = req.body;
        console.log(newTask);
        const result = await taskCollection.insertOne(newTask);
        res.send(result);
      }
      catch (error) {
        res.status(500).send({ message: "some thing went wrong" })
      }
    })


    app.put('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedItem = req.body;   
      const item = {
          $set: {
           ...updatedItem
          }
      }
       console.log(item)
      const result = await taskCollection.updateOne(filter, item, options);
      res.send(result);
  })

  
  app.patch('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        status: 'Complete'
      }
    }
    const result = await taskCollection.updateOne(filter, updatedDoc);
    res.send(result);
  })



  app.delete('/tasks/:id', async (req, res) => {
   try{
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    console.log(query)
    const result = await taskCollection.deleteOne(query);
    res.send(result);
   }
   catch (error) {
    res.status(500).send({ message: "Failed to Delete task" })
  }
  })




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

 
app.get('/', (req, res) => {
  res.send('Task Management server')
})

app.listen(port, () => {
  console.log(`Task Management Server is running on port: ${port}`)
})