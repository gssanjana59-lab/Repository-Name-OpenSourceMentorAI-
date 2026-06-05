const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Working 🚀");
});

app.get("/github/:username", async (req, res) => {
  const username = req.params.username;

  const response = await axios.get(
    `https://api.github.com/users/${username}`
  );

  res.json(response.data);
});

app.get("/repos/:username", async (req, res) => {
  const username = req.params.username;

  const response = await axios.get(
    `https://api.github.com/users/${username}/repos`
  );

  res.json(response.data);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});