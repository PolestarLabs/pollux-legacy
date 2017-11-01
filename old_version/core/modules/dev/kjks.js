const cmd = 'tele';
const gear = require("../../gearbox.js");
const multilevel = require('multilevel');
const net = require('net');



const init = async function (message,userDB,DB) {

const db = multilevel.client();
const con = net.connect(3008);
con.pipe(db.createRpcStream()).pipe(con);

db.put('xx', "{name:'a'}");


let xx


 let x = await db.get('xx')
db.get('xx').then()
console.log(db)
  


  message.reply(x)
  
}
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'misc'
};


