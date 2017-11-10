const gear = require("../core/gearbox.js");

exports.run =async function run(bot) {
    let GLB = await gear.globalDB.get();

    if (GLB.redButton) {
      let embed = new gear.RichEmbed
      embed.setTitle("Reset Response")
      embed.setDescription(gear.emoji('yep') + " Back Online!")
      let ts = new Date()
      embed.setTimestamp(ts)
      embed.setColor("#3ed844")
      bot.channels.get(GLB.redButton).send({
        embed
      })
    }

  gear.globalDB.set({$set:{'redbutton':false}});

  await bot.user.setStatus('idle')
  bot.user.setGame(`Booting Up...`);

  let embed = new gear.RichEmbed
  embed.setTitle('Pollux Core Reporter');
  embed.setDescription('Ready! All systems go!');
  embed.setColor('#3ed844');
  await gear.wait(4);

    bot.user.setStatus('online').then(y=>{
      bot.user.setGame("Ready!");
    })



  if (bot.shard) {
    console.log('Shard' + (1 + bot.shard.id) + '/' + bot.shard.count + " [ONLINE]")
  }

}

