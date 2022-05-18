const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();

app.use(cors());
app.use(express.json());

//connect MONGODB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fkfem.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const todosCollection = client.db("todos-list").collection("todos");
    //GET
    app.get("/todos", async (req, res) => {
      const query = {};
      const cursor = todosCollection.find(query);
      const todosList = await cursor.toArray();
      res.send(todosList);
    });
    //POST
    app.post("/todos", async (req, res) => {
      const todos = req.body;
      const result = await todosCollection.insertOne(todos);
      res.send(result);
    });
    // DELETE

    app.delete("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await todosCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    //
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Running Todos");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
