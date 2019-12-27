const gear = require('../core/gearbox.js');
exports.run=  async function run(bot, react,user) {
  return;
  if (user.bot) return;

  let msg= react.message
  let S = msg.guild

  let ddata = await gear.serverDB.findOne({id:msg.guild.id},{"modules.LOCALRANKx":0}).lean().exec();

  if(!ddata.event          ||
     !ddata.event.enabled  ||
     !ddata.event.channel  ||
     !ddata.event.roles.event ||
     !ddata.event.roles.collect ||
     !ddata.event.roles.trader
    ) return;

  let xtr ='🎄'
  let aus = bot.emojis.get('391418503317422080')
  let bor = bot.emojis.get('391423329078345729')

  let role;
  if(react.emoji==xtr){
    role = S.roles.get(ddata.event.roles.event)
  }else if(react.emoji==aus){
    role = S.roles.get(ddata.event.roles.trader)
  }else if(react.emoji==bor){
    role = S.roles.get(ddata.event.roles.collect)
  }

  if(role){
     let M = S.member(user)

    M.roles.add(role)
    let embed=new gear.RichEmbed;
    embed.setColor(role.hexColor)
    embed.setDescription(gear.emoji('yep')+react.emoji+" Added role "+role+" to **"+user.tag+"**")
    msg.channel.send({embed}).then(m=>m.delete({timeout:5000}))

  }else{

  }
    }

