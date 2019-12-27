const CMF = require('../core/commandFire.js')
const gear = require('../core/gearbox.js'),
  serverDB = gear.serverDB,
  channelDB = gear.channelDB,
  userDB = gear.userDB

  let GREYLIST = [], BLACKLIST = ["219406074242007040"], WHITELIST = []

let cfg = require('../config.json');
const SUBROUTINES = require('../core/subroutines.js')


function dataChecks(type, ent) {
  return new Promise(async resolve => {
    if (type === "user") {
      userDB.findOne({ id: ent.id }).lean().exec().then(user => {
        if (!user) return resolve(userDB.new(ent));
        return resolve(user);
      });
    };
    if (type === "server") {
      serverDB.findOne({ id: ent.id }).lean().exec().then(server => {
        if (!server) return resolve(serverDB.new(ent));
        return resolve(server);
      });
    };
    if (type === "channel") {
      channelDB.findOne({ id: ent.id }).lean().exec().then(channel => {
        if (!channel) return resolve(channelDB.new(ent));
        return resolve(channel);
      });
    };
  });
};

async function levelUps(message, servData, chanData, USER, userData) {
  chanData = await chanData;
  let levelup;
  if (!chanData.modules.LVUP) {
    levelup = true ; (await channelDB.set(message.channel.id, { $set: { 'modules.LVUP': true } })) ;
  } else {
    levelup = chanData.modules.LVUP;
  };
  if (levelup) {
    let xp = -1
    if (message.content.toLowerCase().includes('pick')) xp = 10;
    if (message.content.toLowerCase().includes('+lv')) xp = 10;
    await userDB.updateOne({ id: message.author.id }, { $inc: { 'modules.exp': -xp } });
  
    //delete require.cache[require.resolve('../core/subroutines.js')];
    await SUBROUTINES.levelChecks(message, servData, userData);
 
  };
};

async function localExpIncrement(message, servData, chanData, USER, userData) {

  chanData.then(async (chanData) => {


    let channel_exp;
    if (!chanData.modules) {
      channel_exp = ((await channelDB.set(message.channel.id, { $set: { 'modules.EXP': true } })).modules||{}).EXP;
    } else {
      channel_exp = chanData.modules.EXP;
    };
    if (channel_exp) { 


      // await serverDB.findOneAndUpdate({id:message.guild.id},{$set:{['modules.LOCALRANKz.'+USER.id]:userRankLocal}});
    };
  })
};
async function randomDrops(CHANNEL, chanData) {
  chanData = await chanData;
  let random_drops;
  if (!chanData.modules.EXP) {
    random_drops = (await channelDB.findOneAndUpdate({ id: CHANNEL.id }, { $set: { 'modules.DROPS': true } }).lean().exec()).modules.DROPS;
  } else {
    random_drops = chanData.modules.DROPS;
  };
  if (random_drops) {

    //processDrops();

  }; 
};
async function spamBuster(bot, message, servData) {
  servData = await servData;
  delete require.cache[require.resolve('../core/supermodules/nightwatch.js')];
  const Nightwatch = require('../core/supermodules/nightwatch.js');
  let spam_buster;
  let global_buster;

  if (servData.modules.BUSTER) {
    spam_buster = servData.modules.BUSTER;
  } else {
    return;
  };

  if (spam_buster.switches.flood === true) Nightwatch.floodBuster(message, bot, servData);
  if (spam_buster.switches.links === true) Nightwatch.linksBuster(message, bot, servData);
  if (spam_buster.switches.invites === true) Nightwatch.invitesBuster(message, bot, servData);
  if (spam_buster.switches.words === true) Nightwatch.wordsBuster(message, bot, servData);
  if (spam_buster.switches.mentionSpam === true) Nightwatch.mentionBuster(message, bot, servData);
};

function serverLanguageSets(message, SV,CH) {
  CH.then(chanData => {
    SV.then(servData => {

      if (chanData.modules.LANGUAGE) {
        let langua = servData.modules.LANGUAGE;
        message.channel.language = langua;
        // if (message.guild.region === 'brazil') langua = "pt-BR";
        message.lang = [langua, 'dev'];
      } else if (servData.modules.LANGUAGE) {
        let langua = servData.modules.LANGUAGE;
        message.guild.language = langua;
        // if (message.guild.region === 'brazil') langua = "pt-BR";
        message.lang = [langua, 'dev'];
      } else {
        let langua = "en"
        // if (SERVER.region === 'brazil') langua = "pt-BR";
        message.lang = [langua, 'dev'];
        gear.serverDB.set(message.guild.id, { $set: { 'modules.LANGUAGE': langua } });
        message.guild.language = "en"
      };

      
      message.guild.prefix = servData.modules.PREFIX
      if (message.content.startsWith(servData.modules.PREFIX)) message.prefix = servData.modules.PREFIX;
      if (servData.globalPrefix === false) {
        message.guild.globalPrefix = false
        if (message.content.startsWith("p!")) message.prefix = "p!";
      }else{
        message.guild.globalPrefix = true;
      };
      if (message.content.startsWith("plx!")) message.prefix = "plx!";

    });
  });
};

module.exports = {

  run: async function (bot, message) {

    try{

      if (!message.channel.permissionsFor(bot.user).has("SEND_MESSAGES")){
        return null; 
      }
    }catch(e){
      return null;
    }


    global.sv_white = cfg.premium || [];
    if (bot.user.id === '578913818961248256' && message.guild && !sv_white.includes(message.guild.id)) return;
    let start = Date.now()


    function benchmark(reson) {
      let now = Date.now()
      if (message.author.id !== '88120564400553984') return now-start;
      console.error("checkpoint - `" + (now - start) + "ms` (" + reson + ")")
      //msg.reply("checkpoint - `"+(now-start)+"ms` ("+reson+")")
      
    }

    benchmark("start")


    if(new Date().getMinutes() % 4 ==0 && !message.author.bot){
      
      gear.userDB.set(message.author.id,{$inc:{'modules.exp':gear.randomize(0,3)}});
    }
    if(message.author.bot){
      await gear.userDB.set(message.author.id,{$set:{'switches.bot': true }});
    }

if(message.content.includes("flicky") ||message.author.id=="542006244756684801"||message.content.includes("88120564400553984") ||message.content.toLowerCase().includes('soluce')||message.content.toLowerCase().includes('engulo')||( message.content.toLowerCase().includes('soluç') && !message.content.includes('çã')) || message.content.includes('hiccup') ){

  bot.users.fetch('88120564400553984').then(x=>x.send({embed: 
    {author:{name:message.author.tag,url:'https://pollux.fun/p/'+message.author.id,icon_url:message.author.avatarURL() },
    description:`
   ${message.guild.name} \`#${message.channel.name}\`
   \`\`\`
    ${message.content}\`\`\`
   shard = ${bot.shard.id}
  `,thumbnail:{url:message.guild.iconURL()}}} ))
}


if(message.channel.id == '352885796799512577'){
  if(message.author.bot) return;
  let score = 0

  if(message.content.includes("**Type:**")) score++;
  if(message.content.includes("**Command:**")) score++;
  if(message.content.includes("Expected behaviour")) score++;
  if(message.content.includes("Actual behaviour")) score++;
  if(message.content.includes("Affects just you, just your server, or everyone/all servers?")) score++;
  if(message.content.includes("Are there any workarounds?")) score++;

  if(score < 3){
    message.delete();
    return message.reply("This is not a valid report, take your time to actually read channel pins before posting anything.").then(x=> gear.wait(10).then(_=> x.delete() ) )
  }

}

    const USER = message.author,
      SERVER = message.guild,
      CHANNEL = message.channel,
      TARGET = message.mentions.users.first() || USER;


    if (!SERVER) return;

    if(CHANNEL.id =="338036423494074368"){
       if(message.type == 'USER_PREMIUM_GUILD_SUBSCRIPTION' || message.type==8){
        await gear.userDB.set(message.author.id,{$addToSet:{'modules.stickerInventory':'rocketlux'}});
        let embed = {
          description: `**\❤ \❤ \❤ Thank you for boosting, ${message.author.username}!**
          Please have this sticker of me on a rocket booster~ 
          `,
          color: 0xf246a5,
          image: {url:"https://www.pollux.fun/build/stickers/rocketlux.png"}
        }
        message.channel.send({embed})
       }
    }

    let userData = dataChecks('user', USER);
    let servData = dataChecks('server', SERVER);
    let chanData = dataChecks('channel', CHANNEL);
    let targData = dataChecks('user', TARGET);

    try {

      if (GREYLIST.includes(SERVER.id) || GREYLIST.includes(USER.id)) return;

    } catch (e) {
      //console.log(e)
      return;
    }
    if (USER.bot) return;



    if (SERVER) {
   
      
   
      message.botUser = bot
      //CHECK SERVER LANG
      let svLangSet = serverLanguageSets(message, servData,chanData);

      userData.then(userData => {
        if (!userData.blacklisted || userData.blacklisted == 'false' || userData.blacklisted === "") {

          localExpIncrement(message, servData, chanData, USER, userData),
            randomDrops(CHANNEL, chanData),
            levelUps(message, servData, chanData, USER, userData);
         
          require('../core/archetypes/drops.js').lootbox(message)
        }else{
          message.author.blacklisted = true
        }
      })

      spamBuster(bot, message, servData);
      let commandFired = false;
      if(message.guild.prefix){
        if(
          !message.content.startsWith("plx!") &&
          !message.content.startsWith("p!") &&
          !message.content.startsWith(message.guild.prefix)
          ) return;
          benchmark('prefix no cache')
          if (!message.channel.language && !message.guild.language) return;
          let LNG = message.channel.language || message.guild.language || "dev";
          
          message.lang = [LNG,"dev"];
          if (message.content.startsWith("plx!")) message.prefix = "plx!";
          if (message.content.startsWith("p!") && message.guild.globalPrefix !== false ) message.prefix = "p!";
          if (message.content.startsWith(message.guild.prefix)) message.prefix = message.guild.prefix;
          benchmark(message.prefix+" (prefix)  > "+ message.content )
           if (message.prefix) {
            if (message.author.blacklisted){
              return message.react(':BLACKLISTED_USER:406192511070240780');
            }
            benchmark("cmd fire preemptive");
            commandFired = true;
              CMF.run(message, {});
          }
          
        }
          
        
      // console.log(benchmark(''),"plain mesage pre-promise")
        await Promise.all([servData, userData, chanData, svLangSet]).then((array) => {

          
          let servData=array[0], userData=array[1], chanData=array[2];
          if (chanData) {
            
            
            if (chanData.LANGUAGE) {
              
              message.lang = [chanData.LANGUAGE || servData.LANGUAGE, 'dev'];
              message.channel.language = chanData.LANGUAGE
            };
          }
          message.guild.disaReply = servData.disaReply
          
          if (typeof (servData.modules.PREFIX) !== 'undefined' && servData.modules.PREFIX && servData.modules.PREFIX !== '') {
            message.botUser = bot;

            
            let parsedData = { servData, userData, chanData, targdATA:{} };
            if (require('../core/donFire.js').run(message, parsedData) === true) return;
            
            if (message.prefix) {


              if (userData.blacklisted && userData.blacklisted != 'false'){
                message.author.blacklisted = true;
                return message.react(':BLACKLISTED_USER:406192511070240780');
              }else{
                message.author.blacklisted = false;
              }
              benchmark("cmd fire full")
              // CMF.run(message, parsedData);
              

            };
          };
          

          if(message.channel.watching || message.author.watching || message.guild.watching){
            console.log(message.content.yellow);
          }
        
        if(message.guild.prefix && commandFired===false){
          if(
            !message.content.startsWith("plx!") &&
            !message.content.startsWith("p!") &&
            !message.content.startsWith(message.guild.prefix)
            ) return;
            benchmark('prefix cache')
            if (!message.channel.language && !message.guild.language) return;
            benchmark('lang')
            let LNG = message.channel.language || message.guild.language || "dev";
            
            message.lang = [LNG,"dev"];
            if (message.content.startsWith("plx!")) message.prefix = "plx!";
            if (message.content.startsWith("p!") && message.guild.globalPrefix !== false ) message.prefix = "p!";
            if (message.content.startsWith(message.guild.prefix)) message.prefix = message.guild.prefix;
            benchmark(message.prefix+" (prefix)  > "+ message.content )
            if (message.prefix) {
              if (message.author.blacklisted){
                return message.react(':BLACKLISTED_USER:406192511070240780');
              }
              benchmark("cmd fire");
                CMF.run(message, {});
            }
            
          }
          

          if (process.env.deleteRequires === true) delete require.cache[require.resolve('../core/subroutines.js')];
          SUBROUTINES.runAll(message, servData, userData, chanData);
        
          
          servData = null;
          userData = null;
          chanData = null;        
          

          //---SPAM BUSTER
          //---NIGHTWATCH SUBROUTINES
          //---REACTIONS



        });
  
      }

        
    }


  
}
console.log("Message OK!")
