node-red-heroku
================

A wrapper for deploying [Node-RED](http://nodered.org) into the [Heroku](https://www.heroku.com).

### Update

This is the same as the [forked repo](https://github.com/joeartsea/node-red-heroku)

- using basic postgres pg database
- securing the Node-Red dashboard with separate user/password
- deploying version 3.x for Node-Red

### Deploying Node-RED into Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/gorenje/node-red-heroku)

### Password protect the flow editor

By default, the editor is open for anyone to access and modify flows. To password-protect the editor:

Add the following user-defined variables.

* NODE_RED_USERNAME - the username to secure the editor with
* NODE_RED_PASSWORD - the password to secure the editor with
* NODE_RED_DASHBOARD_USERNAME - the username to secure the dashboard
* NODE_RED_DASHBOARD_PASSWORD - the password to secure the dashboard
