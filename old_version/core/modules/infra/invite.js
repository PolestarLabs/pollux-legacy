
var cmd = 'invite';

var init = function (message,userDB,DB) {
  message.reply("Invite me to your Server using this: http://goo.gl/qkGqqU")

}
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 8,
    init: init,
    cat: 'infra'
};
