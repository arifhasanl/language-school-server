const express=require('express');
const app=express();
const cors=require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

//midelawer
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.send('server is running')
})

const uri = `mongodb+srv://${process.env.Db_userName}:${process.env.Db_pass}@cluster0.2qyatsn.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection

    const MenuColection=client.db('musicSchool').collection('useMenu')
    const classColection=client.db('musicSchool').collection('selectedClass')
    const userColection=client.db('musicSchool').collection('users')
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  app.get('/useMenu',async(req,res)=>{
    const result=await MenuColection.find().toArray();
    res.send(result)
  })

//user

app.get('/user',async(req,res)=>{
  const result = await userColection.find().toArray();
  res.send(result)
})

app.post('/user',async(req,res)=>{
  const user = req.body;
  const query ={email: user.email}
  const existingUser = await userColection.findOne(query)
  if(existingUser){
    return res.send ({message: 'user already existing'})
  }
  const result = await userColection.insertOne(user)
  res.send(result)
})



app.post('/selectClass',async(req,res)=>{
  const data=req.body;
  console.log(data);
  const result=await classColection.insertOne(data);
  res.send(result)
})

app.get('/selectClass', async(req,res)=>{
  console.log(req.query.email);
  let query = {}
  if(req.query?.email){
    query = {email: req.query.email}
  }
  const result = await classesCollection.find(query).toArray();
  res.send(result)
})


// delete classes 

app.delete('/selectClass/:id', async(req,res)=>{
  const id= req.params.id;
  const query = { _id: new Object(id)};
  const result = await classesCollection.deleteOne(query);
  res.send(result)
})
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);




app.listen(port,()=>{
    console.log(`summer camp in running on port ${port}`);
})

