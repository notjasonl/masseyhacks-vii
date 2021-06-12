const express = require("express");

const PORT = process.env.PORT || 4001;

const app = express();

app.post("/api/mapClick", (req, res) => {
  let { lat, long } = req.body
  res.send(200)
})

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});