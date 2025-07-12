require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const bookingsCollection = client.db("tourHood").collection("bookings");
    const guideApplicationCollection = client.db("tourHood").collection("guideApplication");

    const verifyToken = (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).send({ message: "Unauthorized" });

      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send({ message: "Forbidden" });

        req.decoded = decoded;
        next();
      });
    };

    app.post("/jwt", (req, res) => {
      const user = req.body;
      // console.log(user)
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

    // get all tour package
    app.get("/packages", async (req, res) => {
  try {
    const packages = await packagesCollection.find().toArray();
    res.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: "Failed to fetch packages" });
  }
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

    // get guides by location
app.get('/guides/by-destination', async (req, res) => {
  const { destination } = req.query;

  if (!destination) {
    return res.status(400).json({ message: "Destination query is required" });
  }

  // Split the destination string by comma, trim spaces
  const keywords = destination
  .split(/[\s,]+/) // split by any comma or space(s)
  .map(item => item.trim())
  .filter(item => item); // remove empty strings

  try {
    // Build $or condition with case-insensitive regex for each keyword
    const regexConditions = keywords.map(keyword => ({
      coverageArea: {
        $elemMatch: { $regex: keyword, $options: 'i' }
      }
    }));


    const matchedGuides = await guidesCollection.find({
      $or: regexConditions
    }).toArray();

    res.json(matchedGuides);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch guides" });
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

    // get guide by id
    app.get("/guides/:id", async (req, res) => {
  const id = req.params.id;

  // Validate ObjectId if your _id is Mongo ObjectId type
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid guide ID" });
  }

  try {
    const guide = await guidesCollection.findOne({ _id: new ObjectId(id) });

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    res.json(guide);
  } catch (error) {
    console.error("Error fetching guide by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET approved stories with optional filters
app.get("/stories", async (req, res) => {
  try {
    const { category, location, search } = req.query;

    // Base query: approved stories only
    let query = { status: "approved" };

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = location;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const stories = await touristStoriesCollection.find(query).sort({ date: -1 }).toArray();
    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: "Failed to fetch stories." });
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


app.get('/packages/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = {_id: id}
    const result = await packagesCollection.findOne(query)
    res.json(result)
  }
  catch(error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch tour package" });
  }
})


// tour package bookings
app.post("/bookings", async (req, res) => {
  try {
    const bookingData = req.body;

    // Optional: Basic validation
    if (!bookingData.touristEmail || !bookingData.packageId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Add extra fields like status and createdAt
    bookingData.status = "pending";
    bookingData.createdAt = new Date();

    // Insert into bookings collection
    const result = await bookingsCollection.insertOne(bookingData);

    res.status(201).json({
      message: "Booking placed successfully",
      bookingId: result.insertedId,
    });
  } catch (error) {
    console.error("Error placing booking:", error);
    res.status(500).json({ message: "Failed to place booking" });
  }
});

// dashboard page 

// get user data by email query
app.get("/users/by-email/:email", async (req, res) => {
  const email = req.params.email;
  const user = await usersCollection.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

// update user / guide / admin data
/* app.patch("/profile/update", async (req, res) => {
  const email = req.query.email;
  const updatedData = req.body;

  const touristUpdatedData = {name: updatedData.name, photo: updatedData.photo }

  // Update users collection
  await usersCollection.updateOne({ email }, { $set: touristUpdatedData });

  // If user is a guide, update guides collection as well
  if (updatedData.role === "tour_guide") {
    await guidesCollection.updateOne({ email }, { $set: updatedData });
  }

  res.json({ message: "Profile updated successfully in all collections" });
}); */

app.patch("/profile/update", async (req, res) => {
  try {
    const { email, role, name, photo, ...rest } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Update user profile (only name and photo)
    const userUpdateResult = await usersCollection.updateOne(
      { email },
      { $set: { name, photo } }
    );

    // If guide — update guide-specific fields
    if (role === "tour_guide") {
      const guideUpdateData = {
        name,
        photo,
        ...rest, // coverageArea, expertise, phone etc.
      };

      await guidesCollection.updateOne({ email }, { $set: guideUpdateData });
    }

    res.json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile." });
  }
});



// get guide data by email query
app.get("/guides/by-email/:email", async (req, res) => {
  const email = req.params.email;
  const user = await guidesCollection.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});


// store guide application
app.post("/guide-applications", async (req, res) => {
  const application = req.body;

  try {
    const result = await guideApplicationCollection
      .insertOne({
        ...application,
        status: "pending",
        appliedAt: new Date(),
      });

    res.status(201).json({ message: "Application submitted successfully.", insertedId: result.insertedId });
  } catch (error) {
    console.error("Error submitting guide application:", error);
    res.status(500).json({ message: "Failed to submit application." });
  }
});

// GET bookings by email
app.get("/bookings", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const bookings = await bookingsCollection.find({ touristEmail: email }).toArray();
  res.json(bookings);
});

// delete bookings by cancel button
app.delete("/bookings/:id", async (req, res) => {
  const { id } = req.params;
  const result = await bookingsCollection.deleteOne({ _id: new ObjectId(id) });
  res.json(result);
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
