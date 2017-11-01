exports.run = async function serverSetup(guild, args) {

let THISGUILD = await args.DB.findOne({_id:guild.id});

  if (!THISGUILD ||!THISGUILD.modules|| THISGUILD == null) {

    console.log(('          --- - - - - = = = = = = Setting Up Guild:'.yellow + guild.name).bgBlue)

    let GG = JSON.parse(JSON.stringify(args.defaults.gdfal))
    
    GG.ID = guild.id;
    if (guild.region === 'brazil') GG.modules.LANGUAGE = "pt-BR";


    let channels = {}
    await guild.channels.forEach(chann => {
      if (chann.type != 'voice') {
        channels[chann.id] = JSON.parse(JSON.stringify(args.defaults.udefal))
        channels[chann.id].name=chann.name
        channels[chann.id].id=chann.id
      };
    })
    
    GG.name = guild.name;
    GG.channels = channels
    
    GG.id = guild.id
    GG._id = guild.id
   // console.log(GG.channels)
 
        args.DB.insert(GG).catch(e=>{
          
        args.DB.update({_id:guild.id},GG)

        })
       
     
   
 

  }

}