exports.run= function normalize(target, args) {
try{
  return;
  if(!args.DB.get(target.id)[args.parma]){
  let default_O = args.defaults[args.def_type][args.parma]
  args.DB.get(target.id)[args.parma] = default_O
  }
  
}catch(e){
//  console.log(e)
}
  
}