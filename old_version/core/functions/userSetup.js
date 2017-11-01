exports.run = async function userSetup(user, args) {

  let THISMAN = await args.DB.findOne({_id:user.id});

  if (!THISMAN || THISMAN == null) {

    console.log('Setting Up Member:' + user.username)

    let USR = JSON.parse(JSON.stringify(args.defaults.udefal))

    USR.name = user.username
    USR.tag = user.tag
    USR.id = user.id
    USR._id = user.id
    
 if((await args.userDB.findOne({_id:user.id}))==null){
    return args.userDB.insert(USR)
 }else{
    return args.userDB.findOneAndUpdate({_id:user.id},USR)
 }
   
    
  }
}