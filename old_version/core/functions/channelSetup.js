exports.run = async function channelSetup(e, args) {

  if (e.type == 'dm') return;

  let guild = e.guild
  let vixe = e.name 
  
  args.DB.findOne({_id:e.guild.id}).then(async SUCHG=>{
    
  if (!SUCHG || SUCHG == null) {
    return require("./guildSetup.js").run(e.guild, args)
  } else {
    
    console.log('Setting Up Channel:'.green + e.name + " from " + guild.name)
    const chanele = JSON.parse(JSON.stringify(args.defaults.cdfal(vixe, e.id)))

    
    if(!SUCHG.channels) SUCHG.channels={};
    SUCHG.channels[e.id] = chanele
    
    await args.DB.findOneAndUpdate({_id:e.guild.id},SUCHG);

    
  }
    })

  }
