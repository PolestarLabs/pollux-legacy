const GB = require("../gearbox.js")
const fs = require("fs")

const def = require("../dbdefaults.js")

  
exports.run = function setup(fun,target,args) {
  
  console.log("start FX")
  return new Promise(async resolve=>{
    
  console.log("promise")
  if(!target){
    return console.error("Invalid Target")
  }
  if(!args || typeof args != "object"){
    return console.error("Invalid Args OBJ")
  }
  
  if(!fun){
    return console.error("Invalid Function")
  }
  
  try{
    
  const file = fun
  const path = __dirname+"/"
  delete require.cache[require.resolve(path+file)];
  let this_function = require(path+file)
  
  
  
  }catch(e){
    return console.error("Invalid Function 2")
  }
  
  
  args.DB = args.db ||GB.DB  
  args.userDB = args.udb ||GB.userDB  
  args.defaults = args.defaults ||def
  
  
  this_function.run(target,args).then(x=>resolve(true))
  
  })
  
}