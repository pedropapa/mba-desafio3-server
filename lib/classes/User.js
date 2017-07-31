var Service = require('../service');

module.exports = User;

function User(socket) {
  this.username = null;
  var self = this;

  socket.on('join', function(data) {
    for(var x in Service.users) {
      if(Service.users[x].username === data.username) {
        socket.emit('failure', {message: 'Já existe um usuário autenticado com este nome.'});
        return true;
      }
    }

    socket.join('main', function() {
      self.username = data.username;
      socket.emit('joined');
      socket.emit('joined');
      Service.io.to('main').emit('event', {type: 'userJoined', username: data.username});
      console.log('entrou');
    });
  });

  socket.to('main').on('message', function(data) {
    console.log('>>> Nova mensagem: ', data);
    Service.io.to('main').emit('event', {type: 'message', username: self.username, message: data.message});
  })

  socket.to('main').on('disconnect', function() {
    for(var x in Service.users) {
      if(Service.users[x].username === self.username) {
        delete Service.users[x];
      }
    }

    socket.to('main').emit('event', {type: 'userLeft', username: self.username});
  })
}