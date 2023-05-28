const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

//mongodb server
mongoose.connect("mongodb://mongodb:27017/todolist", {
  useNewUrlParser: true,
});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//schema
const taskSchema = new mongoose.Schema({
  name: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

//api
app.get("/tasks", (_, res) => {
  Task.find()
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving tasks");
    });
});

app.get("/tasks/:id", (req, res) => {
  Task.findById(req.params.id)
    .then((tasks) => {
      if(!tasks){
        res.status(404).send("Task not found");
      }else{
        res.json(tasks);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving tasks");
    });
});

app.post("/tasks", (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then(() => {
      res.status(200).json({ task: "Task added successfully" });
    })
    .catch(() => {
      res.status(400).send("Adding new task failed");
    });
});

app.put("/tasks/:id", (req, res) => {
  Task.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.status(200).json({ task: "Task updated successfully" });
    })
    .catch(() => {
      res.status(400).send("Updating task failed");
    });
});

app.delete("/tasks/:id", (req, res) => {
  Task.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(200).json({ task: "Task deleted successfully" });
    })
    .catch(() => {
      res.status(400).send("Deleting task failed");
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
