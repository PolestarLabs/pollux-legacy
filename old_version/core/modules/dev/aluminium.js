const cmd = 'tele';
const gear = require("../../gearbox.js");

const init = function (message,userDB,DB) {
message.channel.send(`
**Aluminium Donator (1$)**

*Aluminium is remarkable for the metal's low density and its ability to resist corrosion through the phenomenon of passivation. Aluminium and its alloys are vital to the aerospace industry and important in transportation and building industries.*
---
A humble gesture of kindness towards our beloved robotic maid.
By pledging __$1 at Pollux's Patreon, or $5 on PayPal*__ you will receive the **Aluminium Donor Title**, which includes these little perks.

  >  The **Donator** and **Aluminium** Roles in Pollux' Offical Discord Server
  >  Access to some more reserved chatrooms away from the mess from #general
  >  A cute little Donator Medal for your profile
  >  A fancy frame for your profilecard
`)
}
 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'misc'
};
