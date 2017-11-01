const g= require("./gearbox.js")
const strato = g.ecoDB 



module.exports={
  
register:function register(type,key,value){
  
  let T = strato.get(type)
  let K = T[key]
  
  if (typeof K == "number" && typeof value == "number"){
    K += value 
  } 
  else if (K.constructor == Array && value.constructor == Array){
    K.push(value)
  }
  else {
    return console.log("ERROR Value is not valid".bgRed)
  }
  
  T[key] = K
  strato.set(type,T)
  
},

mapby:function mapby(type,key, index){
  
  let T = strato.get(type)
  let K = T[key]
  
  if (typeof index == "number" || typeof index == "string"){
    if (K.constructor != Array)return console.error("ERROR: Array-Only".bgRed);
    return K.map(itm=>itm[index])
  }else{
  return  K.map(itm=>itm)
  }
      
},
lastX:function lastX(type,key,amount){
  
  let T = strato.get(type)
  let K = T[key]
  return K.map(itm=>itm).slice(-amount)

}
    
  
}


