require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend integrated successfully");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mydatabase.sr7puaa.mongodb.net/?retryWrites=true&w=majority&appName=MyDatabase`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const usersCollection = client.db("tourHood").collection("users");
    const packagesCollection = client.db("tourHood").collection("packages");
    const guidesCollection = client.db("tourHood").collection("guides");
    const touristStoriesCollection = client.db("tourHood").collection("touristStories");

    const verifyToken = (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).send({ message: "Unauthorized" });

      const token = authHeader.split(" ")[1];
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send({ message: "Forbidden" });

        req.decoded = decoded;
        next();
      });
    };

    app.post("/jwt", (req, res) => {
      const user = req.body;

      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.send({ token });
    });

    app.post("/users", async (req, res) => {
      const userData = req.body;
      const email = userData.email;
      const userExist = await usersCollection.findOne({ email });

      if (userExist) {
        const updateUser = await usersCollection.updateOne(
          { email },
          { $set: { lastSignedIn: userData.lastSignedIn } }
        );
        return res
          .status(201)
          .send({ message: "user already exists", inserted: false });
      }

      const result = await usersCollection.insertOne(userData);
      res.send(result);
    });

    // get tour packages randomly
    app.get("/packages/random", async (req, res) => {
      try {
        const randomPackages = await packagesCollection
          .aggregate([{ $sample: { size: 3 } }])
          .toArray();
        res.json(randomPackages);
        // console.log(randomPackages)
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch packages" });
      }
    });

    // get guides randomly
    app.get("/guides/random", async (req, res) => {
      try {
      const randomGuides = await guidesCollection.aggregate([
        { $sample: { size: 6 } },
      ]).toArray();
      res.json(randomGuides);
      }
      catch(err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch guides" });
      }
    });


    // get random tourist story
    app.get('/stories/random', async (req, res) => {
      try {
        const randomStories = await touristStoriesCollection.aggregate([{ $sample: { size: 4 } }]).toArray();
        res.json(randomStories);
      }
      catch(err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch stories" });
      } 
});







    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("app is listening on port ", port);
});
