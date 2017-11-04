const g= require("../../gearbox.js")

var init = async function (message, userDB, DB) {


  if(
    message.author.id!="88120564400553984"&&
    message.author.id!="163200584189476865"&&
    message.author.id!="203139018760781824"
    )return;


  let embed = new g.Discord.RichEmbed
  embed.setAuthor(message.author.tag,message.author.avatarURL)
  embed.setThumbnail("https://images-na.ssl-images-amazon.com/images/I/71m2NvJyIVL.png")
  embed.setDescription("▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆\n:warning:    **THE BIG RED BUTTON WAS PRESSED!**\n▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆")
  ts= new Date()
  embed.setTimestamp(ts)
  embed.setColor("#ff0000")

  g.tweet("Red Button has been pressed! I will be down for a while!")

  g.DB.findOneAndUpdate({id:"271394014358405121"},{redButton:message.channel.id});
  message.botUser.users.get("88120564400553984").send({embed})
  message.guild.channels.get("332025773521371137").send({embed})
  await message.channel.send({embed});

  setTimeout(()=>
  process.exit(1)
            ,1000)
}


module.exports = {
    pub: true,
    cmd: "BIG RED FUCKIN BUTTON",
    perms: 3,
    init: init,
    cat: 'emergency'
};
