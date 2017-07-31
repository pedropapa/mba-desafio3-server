'use strict';


var io = require('socket.io')(3000);
var User = require('./lib/classes/User');
var Service = require('./lib/service');

Service.io = io
  .of('mbchat')

  .on('connection', function (socket) {
    console.log('Nova conexão');

    Service.users.push(new User(socket));
  });