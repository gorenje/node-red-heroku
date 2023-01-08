/**
 * Copyright 2014 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var path = require("path");
var when = require("when");
var pgutil = require('./pgutil');

process.env.NODE_RED_HOME = __dirname;

var settings = module.exports = {
    uiPort: process.env.PORT || 1880,
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    debugMaxLength: 10000000,

    // Blacklist the non-bluemix friendly nodes
    nodesExcludes:[ '66-mongodb.js','75-exec.js','35-arduino.js','36-rpi-gpio.js','25-serial.js','28-tail.js','50-file.js','31-tcpin.js','32-udp.js','23-watch.js' ],

    // Enable module reinstalls on start-up; this ensures modules installed
    // post-deploy are restored after a restage
    autoInstallModules: true,

    // Move the admin UI
    httpAdminRoot: '/red',

    // You can protect the user interface with a userid and password by using the following property
    // the password must be an md5 hash  eg.. 5f4dcc3b5aa765d61d8327deb882cf99 ('password')
    //httpAdminAuth: {user:"user",pass:"5f4dcc3b5aa765d61d8327deb882cf99"},

    // Serve up the welcome page
    httpStatic: path.join(__dirname,"public"),

    functionGlobalContext: { },

    storageModule: require("./pgstorage"),

    httpNodeCors: {
        origin: "*",
        methods: "GET,PUT,POST,DELETE"
    },

    logging: {
        console: {
            level: "info",
            /** Whether or not to include metric events in the log output */
            metrics: false,
            /** Whether or not to include audit events in the log output */
            audit: false
        }
    },

    // Disbled Credential Secret
    credentialSecret: false
};


if (process.env.NODE_RED_DASHBOARD_USERNAME && process.env.NODE_RED_DASHBOARD_PASSWORD) {

  var usersHeroku = {};

  const basicAuth = require('express-basic-auth');
  function getUnauthorizedResponse(req) {
    return req.auth
        ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
        : 'No credentials provided'
  };

  // Add rate limiting middleware to inhibit brute forcing
  const { RateLimiterMemory } = require('rate-limiter-flexible');
  const rateLimiter = new RateLimiterMemory({
    points: 5, // 5 requests
    duration: 30, // per 30 seconds
  });
  const rateLimiterMiddleware = (req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).send('Too Many Requests');
        });
  };

  usersHeroku[process.env.NODE_RED_DASHBOARD_USERNAME] = process.env.NODE_RED_DASHBOARD_PASSWORD;

  settings.ui = {
        path: "/ui",
        middleware: [
            rateLimiterMiddleware,
            basicAuth({
              users: usersHeroku,
                challenge: true,
                realm: 'Dashboard UI',
                unauthorizedResponse: getUnauthorizedResponse
            })
        ]
  };
};

if (process.env.NODE_RED_USERNAME && process.env.NODE_RED_PASSWORD) {
    settings.adminAuth = {
        type: "credentials",
        users: function(username) {
            if (process.env.NODE_RED_USERNAME == username) {
                return when.resolve({username:username,permissions:"*"});
            } else {
                return when.resolve(null);
            }
        },
        authenticate: function(username, password) {
            if (process.env.NODE_RED_USERNAME == username &&
                process.env.NODE_RED_PASSWORD == password) {
                return when.resolve({username:username,permissions:"*"});
            } else {
                return when.resolve(null);
            }
        }
    }
}

settings.pgAppname = 'nodered';
pgutil.initPG();
pgutil.createTable();
