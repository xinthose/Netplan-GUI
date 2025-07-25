"use strict";
const express = require("express");
const compression = require('compression');

// config
const port = process.env.PORT || 3000;
const app_folder = "./";
const options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['html', 'js', 'scss', 'css'],
  index: false,
  maxAge: '1y',
  redirect: true,
}

// create app
const app = express();
app.use(compression());
app.use(express.static(app_folder, options));

// serve angular paths
app.all(/(.*)/, function (req, res) {
  res.status(200).sendFile(`/`, { root: app_folder });
});

// start listening
app.listen(port, function () {
  console.log("Node Express server for " + app.name + " listening on http://localhost:" + port);
});
