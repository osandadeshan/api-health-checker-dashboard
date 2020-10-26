var express = require("express");
var app = express();
var path = require("path");
var axios = require("axios");

app.use(express.static("public"));

// Project components' ids and urls object
const healthCheckEndpoints = {
  mockServer: "http://localhost:8000/",
  user: "https://maxsoft-mock-server-demo.web.app/users/1",
  photos: "https://jsonplaceholder.typicode.com/photos",
  career: "https://maxsoft-mock-server-demo.web.app/careers",
  document: "https://maxsoft-mock-server-demo.web.app/photos/29647",
  album: "https://jsonplaceholder.typicode.com/albums",
  barcode: "https://maxsoft-mock-server-demo.com/barcode",
  employee: "http://dummy.restapiexample.com/api/v1/employees",
  todo: "https://jsonplaceholder.typicode.com/todos/1",
  posts: "https://jsonplaceholder.typicode.com/posts",
};

// Hosted at http://localhost:5000
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/:id", function (req, res) {
  const id = req.params.id;
  console.log("Health check request received for " + id);
  if (!healthCheckEndpoints[id]) {
    console.error("Health check endpoint is not available");
    res.status(404).end();
  } else {
    console.log("Performing health check to " + healthCheckEndpoints[id]);
    axios
      .get(healthCheckEndpoints[id])
      .then((response) => {
        console.log(`Health check request for ${id} success`);
        res.status(200).end();
      })
      .catch((e) => {
        console.error(
          `Health check request failed for ${id} with error`,
          e.toJSON()
        );
        res.status(e && e.response ? e.response.status : 500).end();
      });
  }
});

// Application running port is 5000
console.log("API Health Checker running at: http://localhost:5000");
app.listen(process.env.PORT || 5000);
