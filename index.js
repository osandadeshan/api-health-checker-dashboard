const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");
require('log-timestamp');
const Validator = require('jsonschema').Validator;
const v = new Validator();

app.use(express.static("public"));

// Project components' ids and urls object
const healthEndpointsSchema = {
  id: "healthEndpointsSchema",
  type: "array",
  items: {
    properties: {
      name: {type: "string"},
      description: {type: "string"},
      id: {type: "string"},
      url: {type: "string"}
    },
    required: ["name", "description", "id", "url"]
  }
};

const healthCheckEndpoints = require("./config/config.json");

// Hosted at http://localhost:5000
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/config", function (req, res) {
  if (v.validate(healthEndpointsSchema, healthCheckEndpoints).valid) {
      console.log("validated config data");
      res.json(healthCheckEndpoints.map((endpoint) => ({
          name: endpoint.name,
          description: endpoint.description,
          id: endpoint.id
      })));
  } else {
      res.status(500).end("Failed to validate config data");
  }
});

app.get("/:id", function (req, res) {
  const id = req.params.id;
  console.log("Health check request received for " + id);
  const healthCheckEndpoint = healthCheckEndpoints.find((endPoint) => endPoint.id === id);
  const requestUrl = healthCheckEndpoint.url || null;
  if (!requestUrl) {
    console.error("Health check endpoint is not available");
    res.status(404).end();
  } else {
    console.log("Performing health check to " + requestUrl);
    axios
      .get(requestUrl)
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
