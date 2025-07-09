require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Backend integrated successfully")
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mydatabase.sr7puaa.mongodb.net/?retryWrites=true&w=majority&appName=MyDatabase`;

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
    // await client.connect();

    const usersCollection =client.db("tourHood").collection("users")

    app.post('/users', async(req, res) => {
        const userData = req.body;
        const email = userData.email
        const userExist = await usersCollection.findOne({email})

        if(userExist) {
          const updateUser= await usersCollection.updateOne({email}, {$set:{lastSignedIn: userData.lastSignedIn}})
          return res.status(201).send({message: "user already exists", inserted: false})
        }

        const result = await usersCollection.insertOne(userData)
        res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('app is listening on port ',port)
})