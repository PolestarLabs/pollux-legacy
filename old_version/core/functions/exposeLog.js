exports.run = function exposeLogs(params, args) {
  
  let ch=args.old
  let chn=args.new
  let log=args.changes
  
  for (i = 0; i < params.length; i++) {
    if (ch[params[i]] != chn[params[i]]) {
      if (typeof ch[params[i]] == "boolean") {
        let alt = {
          e: params[i],
          a: chn[params[i]]
        }
        log(alt)
      } else {
        let alt = [{
          e: params[i],
          a: ch[params[i]]
            }, {
          e: params[i],
          a: chn[params[i]]
          }]
        log(alt)
      }
    }
  }
}