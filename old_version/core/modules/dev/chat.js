var cmd = 'report';


 

var init = function (message,userDB,DB, ector) {
return
        var Ector = require('ector');
          var aector = new Ector({
            botname:"Pollux"
          });

  ector == ector || message.botUser.ector ||aector
  

  let args= message.content.split(/ +/).slice(1).join(" ")
console.log(args)
  if (args.length >80) args=args.split(".")[0];
  if (args.length >80) args=args.split(",")[0];
  if (args.length >80) args=args.split(/ +/)[0];
  if (args.length >80) args=args.split("")[0];
  delete Array.prototype.removeire
  try{
    
  ector.addEntry(args);
  var response = ector.generateResponse();
  }catch(e){ 
  aector.addEntry(args);
  var response = aector.generateResponse();
  }
  message.reply(response.sentence);
  
 
}
 module.exports = {
    pub:true,
    cmd: cmd,
    perms:2,
    init: init,
    cat: 'dev'
};
