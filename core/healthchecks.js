const {userDB,serverDB,channelDB} = require('./gearbox.js')

exports.run(bot){
  

  var io = require('socket.io')(4728);
  io.on('connection', function (socket) {
    io.emit("test","test")
    
  })
    io.emit("test","test");
  
}