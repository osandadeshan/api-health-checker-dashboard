const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");
require('log-timestamp');
const Validator = require('jsonschema').Validator;
const v = new Validator();
const NodeCache = require("node-cache");
const session = require('express-session')
const chalk = require('chalk');

app.use(session({
  secret: 'Your_Secret_Key',
  resave: true,
  saveUninitialized: true
}))
app.use(express.static("public"));

const configCache = new NodeCache();
const log = console.log;

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

app.get("/config", function (req, res) {
  let healthCheckEndpoints = null;
  const reqConfigEnv = req.session.env || 'default';
  if (configCache.has(reqConfigEnv) || reqConfigEnv === '_error') {
    healthCheckEndpoints = configCache.get(reqConfigEnv);
    log(chalk.blue(`Reading configurations for Env: ${reqConfigEnv} from cache`));
    if (v.validate(healthEndpointsSchema, healthCheckEndpoints).valid) {
      console.log("JSON schema validation success for './config/config.json'");
      res.json(healthCheckEndpoints.map((endpoint) => ({
        name: endpoint.name,
        description: endpoint.description,
        id: endpoint.id,
        environment: endpoint.environment,
        url: endpoint.url,
        contact: endpoint.contact
      })));
    } else {
      res.status(500).end(`JSON schema validation failed for './config/config.json'.
      Sample config.json file can be found here: 'https://github.com/osandadeshan/api-health-checker-dashboard/blob/master/config/config.json'`);
    }
  } else {
    log(chalk.red(`Reading configurations for Env: ${reqConfigEnv} from cache failed`));
    res.status(500).end('`Reading configurations for Env: ${reqConfigEnv} from cache failed`')
  }
});

app.post("/env/:env", function (req, res) {
  const reqConfigEnv = req.params.env || 'default';
  try {
    const healthCheckEndpoints = require(`./config/${reqConfigEnv}-config.json`)
    if (!configCache.has(reqConfigEnv)) {
      if (configCache.set(reqConfigEnv, healthCheckEndpoints)) {
        log(chalk.green(`Setting configurations for Env: ${reqConfigEnv} in cache success`));
        req.session.env = reqConfigEnv;
        res.status(200).end();
      } else {
        log(chalk.red(`Setting configurations for Env: ${reqConfigEnv} in cache failed`));
        res.status(500).end();
      }
    } else {
      log(chalk.blue(`Cached configurations for Env: ${reqConfigEnv} is available`));
      req.session.env = reqConfigEnv;
      res.status(304).end();
    }
  } catch (e) {
    log(chalk.red(`Reading configurations for Env: ${reqConfigEnv} failed`));
    req.session.env = '_error';
    console.error(e);
    res.status(500).end();
  }
});

app.get("/health/:id", function (req, res) {
  const id = req.params.id;
  const reqConfigEnv = req.session.env || 'default';
  let healthCheckEndpoints = configCache.get(reqConfigEnv) || [];
  console.log("Health check request received for " + id + " and Env: " + reqConfigEnv);
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
          console.error(`Health check request failed for ${id} with error`, e.toJSON());
          res.status(e && e.response ? e.response.status : 500).end();
        });
  }
});

app.get('/stats', function (req, res) {
  res.json({
    env: req.session.env,
    cache: configCache.getStats()
  })
})

app.listen(process.env.PORT || 5000, () => {
  // Application running port is 5000
  log(chalk.blue.bgRed.bold("API Health Checker running at: http://localhost:5000"));
  const defaultHealthCheckEndpoints = require("./config/default-config.json");
  if (configCache.set('default', defaultHealthCheckEndpoints)) {
    console.info(chalk.green('setting default config values in cache success'));
  }
});
