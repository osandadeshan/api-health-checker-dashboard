const express = require("express");
const path = require("path");
const axios = require("axios");
require("log-timestamp")(function () {
  return "[" + new Date().toLocaleString() + "] %s";
});
const Validator = require('jsonschema').Validator;
const NodeCache = require("node-cache");
const chalk = require('chalk');
const glob = require("glob");
const fs = require('fs');

const app = express();
const configCache = new NodeCache();
const v = new Validator();
const log = console.log;

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
      environment: {type: "string"},
      url: {type: "string"},
      contact: {type: "string"}
    },
    required: ["name", "description", "id", "environment", "url", "contact"]
  }
};

app.get("/", function (req, res) {
  req.session.env = 'default';
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/config/:env", function (req, res) {
  let healthCheckEndpoints = null;
  const reqConfigEnv = req.params.env || 'default';
  if (configCache.has(reqConfigEnv)) {
    healthCheckEndpoints = configCache.get(reqConfigEnv);
    log(chalk.blue(`Reading configurations for Env: ${reqConfigEnv} from cache`));
    res.json(healthCheckEndpoints.map((endpoint) => ({
      name: endpoint.name,
      description: endpoint.description,
      id: endpoint.id,
      environment: endpoint.environment,
      url: endpoint.url,
      contact: endpoint.contact
    })));
  } else {
    log(chalk.red(`Reading configurations for Env: ${reqConfigEnv} from cache failed`));
    res.status(500).end(`Reading configurations for Env: ${reqConfigEnv} from cache failed`)
  }
});

app.get("/health/:env/:id", function (req, res) {
  const id = req.params.id;
  const reqConfigEnv = req.params.env;
  let healthCheckEndpoints = configCache.get(reqConfigEnv) || [];
  console.log("Health check request received for " + id + " and Env: " + reqConfigEnv);
  const healthCheckEndpoint = healthCheckEndpoints.find((endPoint) => endPoint.id === id);
  const requestUrl = healthCheckEndpoint && healthCheckEndpoint.url ? healthCheckEndpoint.url : null;
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
          console.error(`Health check request failed for ${id} with error`, e.toJSON());
          res.status(e && e.response ? e.response.status : 500).end();
        });
  }
});

app.get('/stats', function (req, res) {
  res.json({
    cache: configCache.getStats()
  })
});

// return loaded config environments. use this endpoint to populate config menu in FE if required so we don't have to duplicate env values
app.get('/environments', function (req, res) {
  res.json(configCache.get('_availableEnvs'));
});

const loadConfigs = () => {
  glob("config/*.json", null, function (er, files) {
    const availableEnvs = files.map((fileName) => fileName.replace('config/', '')).map((fileName) => fileName.replace('-config.json', ''));
    log(chalk.blue("Available config files: " + availableEnvs));
    configCache.set('_availableEnvs', availableEnvs);
    availableEnvs.forEach((env) => {
      const configObject = JSON.parse(fs.readFileSync(`config/${env}-config.json`));
      if (v.validate(healthEndpointsSchema, configObject).valid && configCache.set(env, configObject)) {
        log(chalk.green('Validated configurations for Env: ' + env + ' and stored in cache'));
      } else {
        log(chalk.red('Validated configurations or Setting cache failed for Env: ' + env));
      }
    });
    log(chalk.blue.bgRed.bold("Initialized all configurations. Application is ready !!"));
  });
};

// updates the cache
app.post('/update', function (req, res) {
  log(chalk.blue("Update Cache Request"));
  loadConfigs();
  res.status(204).end();
});


app.listen(process.env.PORT || 5000, () => {
  // Application running port is 5000
  log(chalk.blue.bgRed.bold("API Health Checker running at: http://localhost:5000"));

  // initializing config files in cache
  loadConfigs();
});
