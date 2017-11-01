var holder;
function replaceWilds(input,args){
   input = input.replace('{{user}}', args.user)
   input = input.replace('{{mention}}', args.mention)

   return input
}
 module.exports = {

        def: function def(x) {

            holder = x;

        }

        ,
        call: function call(module, output, lang, args) {
var l = require("./lang/"+lang+".json")
            var out = replaceWilds(l[module][output],args)
                return out

            }


        }
