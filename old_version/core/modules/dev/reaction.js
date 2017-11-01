ADD

input "trigger" "resp"


paramDeleteServ: function paramDeleteServ(target, param, val){
        var Smodules = main.DB.get(target.id)
        delete Smodules.modules[param][val]
         main.DB.set(target.id, Smodules)
    },
    paramDeleteIndex: function paramDeleteInd(target, param, param2, val){
        var Smodules = main.DB.get(target.id)
        Smodules.modules[param][param2].splice(val)
         main.DB.set(target.id, Smodules)
    },





        function newReact(trigger,reaction){

let tgServ = Server.dDATA
if (!tgServ.modules.REACTIONS[trigger]){
    tgServ.modules.REACTIONS[trigger]=[]
}
tgServ.modules.REACTIONS[trigger].push(reaction)
        }



        function removeReact(trigger,index){

let tgServ = Server.dDATA
tgServ.modules.REACTIONS[trigger].splice(index)

        }


        function listReact(trigger){

            var list = []
            var page = 0
            var lines = 0
for (k in REACT){


    for (var i=0;i<REACT[k].length;i++){
          console.log("page"+page+"lines"+lines)
        list[page] += "\n"+k+" : "+REACT[k][i]
        line++
        page = Math.floor(lines/5)

    }

}






        }
