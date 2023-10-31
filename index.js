const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5349;

// middleware
const app = express();
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
    await client.connect();

    const database = client.db("carDoctor");
    const servicesData = database.collection("services");
    const bookingData = database.collection("bookingData");

    /**
     * ======================
     * Services API
     * ======================
     */

    app.get("/services", async (req, res) => {
      const findResult = await servicesData.find().toArray();
      res.send(findResult);
    });

    /**
     * =======================
     * Booking APIs
     * =======================
     */

    // app.get("/bookings", async (req, res) => {
    //   const result = await bookingData.find().toArray();
    //   res.send(result);
    // });

    app.post("/bookings", async (req, res) => {
      const bookingData = req.body;
      console.log(bookingData);
    });

    // console.log("Connected to the database");
  } catch (e) {
    console.log(e);
  }
}

// Default GET API
app.get("/", (req, res) => {
  res.send("Car Doctor server is running!");
});

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});

run().catch(console.dir);
