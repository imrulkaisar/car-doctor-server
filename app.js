// import modules
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3033;

// Apply middlewares for the Express application
app.use(cors());
app.use(express.json());

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.itr0uhy.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // connect the client to the MongoDB server
    // await client.connect();

    // Access require database and collection
    const database = client.db("carDoctor");
    const servicesData = database.collection("services");
    const bookingData = database.collection("bookingData");

    /**
     * ======================
     * Services API
     * ======================
     */

    app.get("/services", async (req, res) => {
      const findResult = servicesData.find();
      const result = await findResult.toArray();
      res.json(result);
    });

    /**
     * =======================
     * Booking APIs
     * =======================
     */

    app.get("/bookings", async (req, res) => {
      const result = await bookingData.find().toArray();
      res.json(result);
    });

    app.post("/bookings", async (req, res) => {
      const bookingInfo = req.body;
      // console.log(bookingInfo);
      const result = await bookingData.insertOne(bookingInfo);
      res.send(result);
    });

    app.delete("/bookings/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await bookingData.deleteOne(query);
        res.json(result);
      } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send("An error occurred");
      }
    });

    app.patch("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;

      console.log(id, updateData);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: updateData.newStatus,
        },
      };
      const result = await bookingData.updateOne(filter, updateDoc);
      res.send(result);
    });

    // end try block
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
  }
}

run().catch(console.dir);

// Default route to check server status
app.get("/", (req, res) => {
  res.json("Server is running...");
});

// start the server and listen the on the defined port
app.listen(port, () => {
  console.log("Server is running on port:", port);
});
