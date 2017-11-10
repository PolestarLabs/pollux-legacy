const gear = require("../../gearbox.js");
const paths = require("../../paths.json");
const locale = require('../../../utils/multilang_b');
const mm = locale.getT();

const cmd = 'svinfo';

const init = async function (message,userDB,DB) {

  const MSG = message.content;
  const args = MSG.split(/ +/).slice(1).join(' ')

  const bot = message.botUser
  const Server = !args? message.guild: args=='random'? bot.guilds.random() :bot.guilds.get(args) ||bot.guilds.find('name',args) ||message.guild;
  const LANG = message.lang;

  let G = Server;
  if(args==='random'){
    G.dData=await gear.serverDB.findOne({id:G.id});
  };

  const emb =    new gear.Discord.RichEmbed();

  const rubine  = gear.emoji("rubine")
  const On      = gear.emoji("yep")
  const Off     = gear.emoji("nope")
  const up     = gear.emoji("up")
  const cog     = gear.emoji("cog")

  emb.setColor('#e83774')
  emb.setAuthor(Server.name,Server.iconURL,'')
  emb.setFooter("Server created at")
  emb.setTimestamp(Server.createdAt)
  emb.setThumbnail(Server.iconURL)

  const flagz={
     en:    ':flag_ca:',
     de:    ':flag_de:',
    'pt-BR':':flag_br:',
     pt:    ':flag_pt:',
    'zh-t':' :flag_tw:',
     cz:    ':flag_cz:',
     fr:    ':flag_fr:',
     hu:    ':flag_hu:',
     ro:    ':flag_ro:',
     es:    ':flag_es:'
  };
  let flag = getflag()
  let flagLang = getflagLang()

  const TC = Server.channels.filter(c=>c.type=="text")
  const VC = Server.channels.filter(c=>c.type=="voice")
  const OM = Server.members.filter(m=>m.presence.status=="offline").size
  const online = (Server.members.size)-OM

  let modrole;
  if (G.dDATA.modules.MODROLE != undefined) {modrole = G.roles.get(G.dDATA.modules.MODROLE)||"NONE";}else{modrole = "NONE";}

  const autoroles = (G.dDATA.modules.SELFROLES||[]).length
  const lang = G.dDATA.modules.LANGUAGE
  const greet = G.dDATA.modules.GREET
  const bye = G.dDATA.modules.FWELL
  let mods = G.dDATA.modules.DISABLED
  mods = mods.splice(mods.indexOf("cog"),1);

  const c = et(message.channel.nsfw)
  const a = et(G.dDATA.modules.LVUP)
  const b = et(G.dDATA.modules.DROPS)

  emb.addBlankField()
  emb.addField(" :tophat: Owner", Server.owner.user , true)

  emb.addField(" :coffee: Main Channel",Server.defaultChannel||Server.channels.first(), true)
  emb.addField(" :scales: Moderation Role", modrole , true)
  emb.addField(" :busts_in_silhouette: Members",online +"/"+ Server.members.size, true)
  emb.addBlankField()

  emb.addField(" :hash: Channels","```"+ TC.size +"```", true)
  emb.addField(" :microphone2: Voice Channels ","```"+VC.size +"```", true)
  emb.addField(" :package: Self Roles","```"+ autoroles +"```", true)
  emb.addField(" :package: Roles ","```"+ Server.roles.size +"```", true)

  emb.addField("Region",flag, true)
  emb.addField("Language", flagLang , true)

  emb.addField(" :speech_balloon: Greeting Message ",("`"+greet.text||"")+"`" +" @ "+(Server.channels.get(greet.channel)||"")+et(greet.enabled), false)
  emb.addField(" :speech_left: Bye Message ",("`"+bye.text||"" )+"`"+" @ "+(Server.channels.get(bye.channel)||"")+et(bye.enabled), false)

  emb.addField(`${cog} SuperModules`,`${up}${a} LevelUp Messages
${rubine}${b} Rubine Drops
:underage: ${c} NSFW Master-Switch`, true)
  emb.addField(":gear: Disabled Commands","```."+ mods +"```", true)

  //  emb.addField("  :calendar_spiral: Creation Date", Server.createdAt , true)

  message.channel.send({embed:emb})

  function et(inp) {
    if (inp === true) {
      return On
    }
    if (inp === false) {
      return Off
    }
    if (inp === undefined) {
      return "---"
    }
  }

  function getflag() {
    let R = Server.region
    switch (true) {
      case R.includes("eu-"):
        return ":flag_eu: +" + R.substr(3)[0].toUpperCase();
      case R.includes("us-"):
        return ":flag_us: " + R.substr(3)[0].toUpperCase();
      case R.includes("brazil"):
        return ":flag_br:";
      case R.includes("singapore"):
        return ":flag_sg:";
      case R.includes("hongkong"):
        return ":flag_hk:";
      case R.includes("russia"):
        return ":flag_ru:";
      case R.includes("sydney"):
        return ":flag_au:";
      case R.includes("london"):
        return ":flag_gb:";
      case R.includes("frankfurt"):
        return ":flag_de:";
      default:
        return ":map: " + R;
    }
  }

  function getflagLang() {
    let R = G.dDATA.modules.LANGUAGE
    return flagz[R]
  };

};

 module.exports = {
    pub:false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'infra'
};
