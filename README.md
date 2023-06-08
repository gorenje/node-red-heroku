node-red-heroku
================

A wrapper for deploying [Node-RED](http://nodered.org) into the [Heroku](https://www.heroku.com).

### Update

This is the same as the [forked repo](https://github.com/joeartsea/node-red-heroku) except for:

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

### Custom Dashboard Domains

To setup a domain for the dashboard and one for the flow editor set the `NODE_RED_CUSTOM_DASHBOARD_DOMAIN` env variable. This becomes the domain under which the dashboard is *solely* reachable.

A second domain should be configured to access the flow editor. This can be done under the settings tab at Heroku.

For example:

`NODE_RED_CUSTOM_DASHBOARD_DOMAIN=blog.example.com`

A second domain is configured to be `editor.example.com`. By default the flow editor is attached to the `/red` path. Both domains are configured at your DNS service provider and will have CNAMEs set.

Access to the flow editor will *solely* be via the second domain.

That is:

- https://blog.example.com --> dashboard
- https://blog.example.com/red --> 404 Not Found
- https://editor.example.com --> 404 Not Found
- https://editor.example.com/red --> flow editor

This configuration was taken from the [Node-RED Forum](https://discourse.nodered.org/t/custom-domains-for-dashboard-endpoint/78988) and is in no way an officially support way for doing this. Errors might happen, use at own risk.

I have not tried this out with a top level domain, i.e. `NODE_RED_CUSTOM_DASHBOARD_DOMAIN=example.com` but it *should* work :).
