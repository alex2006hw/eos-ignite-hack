"use strict";

// ---------------------------------------------------
// gun vars
// ---------------------------------------------------
var Random = require('random-js');
var siphash24 = require('siphash24');
var SafeBuffer = require('safe-buffer');
var PrettyError = require('pretty-error');
var express = require('express');
var levelup = require('levelup');
var leveldown = require('leveldown');
var levelHyper = require('level-hyper');
var Gun = require('gun');
require('gun/nts');
require('gun/lib/not.js');
require('gun/lib/path.js');
require('gun-unset');
require('gun-level');

var port = process.env.port || '8080';
var app = express();
app.use(Gun.serve);
app.use(express.static(__dirname + '/public'));
var webServer = app.listen(port);
console.log('backend-oss server listen :', port);

// var gun = Gun({Gunfile: 'chaindata', web: server });
// global.Gun = Gun;

var levelDB = levelHyper('chaindata')
var options = {
  level: levelDB,
  file: false,
  localStorage: false,
  until: 1,
  memory: 500,
  chunk: 1024 * 100,
  web: webServer
};
var tokenEngine = Gun(options)
global.gun = tokenEngine;

var PROD_PEERS = ['https://troposphere.usertoken.com/gun', 'https://alex.us-east.mybluemix.net/gun', 'https://haley.mybluemix.net/gun'];
var DEV_PEER = ['http://dev01.alex2006hw.com:8080/gun'];

var ROOT = "/";
var BROADCAST = "BROADCAST";
var SERVER = "USERTOKEN";
var SERVER_ATTRIBUTES = "USERTOKEN/ATTRIBUTES";
var SERVER_CONTRACTS = "USERTOKEN/CONTRACTS";
var SERVER_CHANNELS = "USERTOKEN/CHANNELS";


///--------------------------------------------------------
/// Gun access
///--------------------------------------------------------
Gun.on('opt', ctx => {
  if (ctx.once) {
    return;
  }
  ctx.on('in', function(msg) {
    console.log('1.backend token message IN : ', msg);
    this.to.next(msg);
  });
  ctx.on('out', function(msg) {
    console.log('1.backend token message OUT : ', JSON.stringify(msg));
    this.to.next(msg);
  });
});

  tokenEngine.on('out', { get: { '#': { '*': '' } } });
  var broadcast = tokenEngine.get(BROADCAST);

  // root genesis
  var root = tokenEngine.get(ROOT);
  var server = tokenEngine.get(SERVER);
  var attributesGenesis = tokenEngine.get(SERVER_ATTRIBUTES);
  var contractsGenesis = tokenEngine.get(SERVER_CONTRACTS);
  var channelsGenesis = tokenEngine.get(SERVER_CHANNELS);

  attributesGenesis.path(ROOT).set(root);
  attributesGenesis.path('ROOT').set(root);

  contractsGenesis.path(ROOT).set(root);
  contractsGenesis.path('ROOT').set(root);

  channelsGenesis.path(ROOT).set(root);
  channelsGenesis.path('ROOT').set(root);

  // starts new roots
  root.path('SERVER').set(server);
  root.path('ATTRIBUTES').set(attributesGenesis);
  root.path('CONTRACTS').set(contractsGenesis);
  root.path('ATTRIBUTES').set(attributesGenesis);
  root.path('CHANNELS').set(channelsGenesis);
  root.path('SERVER').put(SERVER);

  // link to root
  // server.path(ROOT).set(root);
  // server.path('ROOT').set(root);
  // server.path('ATTRIBUTES').set(attributesGenesis);
  // server.path('CONTRACTS').set(contractsGenesis);
  // server.path('ATTRIBUTES').set(attributesGenesis);
  // server.path('CHANNELS').set(channelsGenesis);

  server.get('ROOT').put(ROOT);
  server.get('id').put(SERVER);

  broadcast.get('PING').on((id) => {
    console.log('1.backend received ping : ', id)
    var BROADCAST_REPLY = `USERTOKEN/CHANNELS/${id}`;
    var listen = tokenEngine.get(BROADCAST_REPLY)
    console.log('2.backend send pong : ', SERVER)
    listen.get('PONG').put(SERVER);
  });

  // Respond to ping broadcast
  broadcast.get('PING').on((token) => {
     console.log('1.backend received ping : ', token)
    if(!token || token === SERVER) return
    console.log('2.backend received ping : ', token)
    server.path('TOKEN').set(token);
    attributesGenesis.path('TOKEN').set(token);
    contractsGenesis.path('TOKEN').set(token);
    channelsGenesis.path('TOKEN').set(token);

    var BROADCAST_REPLY = `USERTOKEN/CHANNELS/${token}`;
    console.log('2.backend send pong : ', SERVER, BROADCAST_REPLY)
    tokenEngine.get(BROADCAST_REPLY)
    broadcast.get('PONG').put(SERVER);
  })
