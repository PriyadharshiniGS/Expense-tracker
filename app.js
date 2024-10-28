const express = require("express");

const app = express(); // express app, act as a middleware

const bodyParser = require("body-parser"); // import body-parser

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to database");

    // Get the database object
    const db = mongoose.connection.db;

    // Print the database name
    console.log("Database Name:", db.databaseName);

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("Collections in the database:");
    collections.forEach(collection => {
      console.log(collection.name);
    });
  })
  .catch(() => {
    console.log("Not able to connect to database");
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,authentication"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,DELETE,PATCH,OPTIONS"
  );
  next();
});

app.use('/v1/api', expenseRoutes);
app.use('/v1/api/USER', userRoutes);

module.exports = app;