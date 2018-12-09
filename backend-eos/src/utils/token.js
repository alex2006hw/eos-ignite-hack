"use strict";

// ---------------------------------------------------
// gun imports
// ---------------------------------------------------
import Random from 'random-js';
import siphash24 from 'siphash24';
import SafeBuffer from 'safe-buffer';
import PrettyError from 'pretty-error';
import levelup from 'levelup';
import leveldown from 'leveldown';
import levelHyper from 'level-hyper';
import Gun from 'gun';
import 'gun/nts';
import 'gun/lib/not.js';
import 'gun/lib/path.js';
import 'gun-unset';
import 'gun-level';


var PROD_PEERS = ['https://troposphere.usertoken.com/gun', 'https://alex.us-east.mybluemix.net/gun', 'https://haley.mybluemix.net/gun'];
var DEV_PEER = ['https://dev01.alex2006hw.com:8080/gun'];

var ROOT = "/";
var BROADCAST = "BROADCAST";
var SERVER = "USERTOKEN";
var SERVER_ATTRIBUTES = "USERTOKEN/ATTRIBUTES";
var SERVER_CONTRACTS = "USERTOKEN/CONTRACTS";
var SERVER_CHANNELS = "USERTOKEN/CHANNELS";

global.Gun = Gun;

///--------------------------------------------------------
/// Gun access
///--------------------------------------------------------
Gun.on('opt', ctx => {
  if (ctx.once) {
    return;
  }
  ctx.on('in', function(msg) {
    // console.log('1.backend token message IN : ', msg);
    this.to.next(msg);
  });
  ctx.on('out', function(msg) {
    // console.log('1.backend token message OUT : ', JSON.stringify(msg));
    this.to.next(msg);
  });
});
const levelDB = levelHyper('chaindata')

/**
 * Connects to token-chain
 * @param {function} CB
 */

module.exports = function(web, CB) {
  const options = {
    level: levelDB,
    file: false,
    localStorage: false,
    until: 1,
    memory: 500,
    chunk: 1024 * 100,
    web: web
  };
  const tokenEngine = Gun(options)

  global.gun = tokenEngine;
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

  // // Respond to ping broadcast
  // broadcast.get('PING').on((token) => {
  //   console.log('1.backend received ping : ', token)
  //   if(!token || token === SERVER) return
  //   console.log('2.backend received ping : ', token)
  //   server.path('TOKEN').set(token);
  //   attributesGenesis.path('TOKEN').set(token);
  //   contractsGenesis.path('TOKEN').set(token);
  //   channelsGenesis.path('TOKEN').set(token);

  //   var BROADCAST_REPLY = `USERTOKEN/CHANNELS/${token}`;
  //   console.log('2.backend send pong : ', SERVER, BROADCAST_REPLY)
  //   // tokenEngine.get(BROADCAST_REPLY)
  //   broadcast.get('PONG').put(SERVER);
  // })
  return CB({root: root});
};
