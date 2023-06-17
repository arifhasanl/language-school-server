const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors');
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//midelawer
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.Db_userName}:${process.env.Db_pass}@cluster0.2qyatsn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbConnect = async () => {
  try {
    client.connect();
    console.log("Database Connected Successfully✅");

  } catch (error) {
    console.log(error.name, error.message);
  }
}
dbConnect()

const MenuColection = client.db('musicSchool').collection('useMenu')
const classColection = client.db('musicSchool').collection('selectedClass')
const userColection = client.db('musicSchool').collection('users')
const addClassCollection = client.db('musicSchool').collection('addClass')


app.get('/', (req, res) => {
  res.send('server is running')
})

app.get('/useMenu', async (req, res) => {
  const result = await MenuColection.find().toArray();
  res.send(result)
})


app.post('/jwt', (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
  res.send({ token })

})



app.get('/addClass', async (req, res) => {
  const cursor = addClassCollection.find();
  const result = await cursor.toArray();
  res.send(result)
})



app.post('/addClass', async (req, res) => {
  const newClass = req.body;
  const result = await addClassCollection.insertOne(newClass);
  res.send(result)
})


app.patch('/addClass/Approved/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const updateDoc = {
    $set: {
      role: 'Approved'
    }
  };
  const result = await addClassCollection.updateOne(filter, updateDoc);
  res.send(result)
})

app.patch('/addClass/Deny/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const updateDoc = {
    $set: {
      role: 'Deny'
    }
  };
  const result = await addClassCollection.updateOne(filter, updateDoc);
  res.send(result)
})
app.patch('/addClass/Feedback/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const updateDoc = {
    $set: {
      role: 'Feedback'
    }
  };
  const result = await addClassCollection.updateOne(filter, updateDoc);
  res.send(result)
})




//user

app.get('/user', async (req, res) => {
  const result = await userColection.find().toArray();
  res.send(result)
})

app.post('/user', async (req, res) => {
  const user = req.body;
  const query = { email: user.email }
  const existingUser = await userColection.findOne(query)
  if (existingUser) {
    return res.send({ message: 'user already existing' })
  }
  const result = await userColection.insertOne(user)
  res.send(result)
})



app.post('/selectClass', async (req, res) => {
  const data = req.body;
  console.log(data);
  const result = await classColection.insertOne(data);
  res.send(result)
})

app.get('/selectClass', async (req, res) => {
  console.log(req.query.email);
  let query = {}
  if (req.query?.email) {
    query = { email: req.query.email }
  }
  const result = await classColection.find(query).toArray();
  res.send(result)
})


// delete classes 

app.delete('/selectClass/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = { _id: new Object(id) };
  const result = await classColection.deleteOne(query)
  res.send(result)
})

// made admin 

app.get('/user/admin/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const user = await userColection.findOne(query);
  const result = { admin: user?.role === 'admin' }
  res.send(result)
})


app.patch('/user/admin/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      role: 'admin'
    }
  };
  const result = await userColection.updateOne(filter, updateDoc);
  res.send(result)
})

// made instructor

app.patch('/user/instructor/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      role: 'instructor'
    }
  };
  const result = await userColection.updateOne(filter, updateDoc);
  res.send(result)
})

app.get('/user/instructor/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email: email }
  const user = await userColection.findOne(query)
  const result = { instructor: user?.role === 'instructor' }
  res.send(result)
})




app.listen(port, () => {
  console.log(`summer camp in running on port ${port}`);
})

