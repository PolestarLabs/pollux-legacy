const GB = require("./gearbox.js")
const fs = require("fs")

const def = require("./dbdefaults.js")


exports.run = function run(fun,target,args) {

  /*console.log(`
**********************************
*
*   FUNCTION: ${fun.toString().red}
*
*   Target Name: ${(target.name || target.tag ||"unnamed targ").cyan }
*   Target ID : ${(target.id || "unnamed targ" ).cyan}
*   Args: ${args}
*
**********************************
`)*/
   // console.log(target)

  if(!target){
    console.log("TARGET")
    console.log(target)
    console.log("---")
    return console.error(("Invalid Target "+fun).bgRed)
  }
  if(!args || typeof args != "object"){
    args = {}
  }

  if(!fun){
    return console.error("Invalid Function"+fun)
  }

  try{

  const file = fun+".js"
  const path = __dirname+"/functions/"
  delete require.cache[require.resolve(path+file)];
  let this_function = require(path+file)

 

  args.DB = args.db ||GB.DB
  args.userDB = args.udb ||GB.userDB
  args.defaults = args.defaults ||def
  args.gear = GB


  return this_function.run(target,args);

  }catch(e){
    console.error("Invalid Function 2"+fun)
    console.error(e)
  }

}
