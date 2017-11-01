const orders = new Map(); //decks
const requests = new Map();//games
var locale = require('../../utils/multilang_b');
var mm = locale.getT();

 


class Cafe {
	constructor(msg) {
        const LANG = msg.lang;
		this.guildID = msg.guild.id;
		this.userID = msg.author.id;
		this.cart = [];
		requests.set(this.userID, this);
        this.MENU = [

          // PRICE  | NAME                                      | EMOJ               |EXP        | EXTRA TRIGG
            [96,         mm('menu.cake', {lngs: LANG}),         ":cake:",            200,        []         ],
            [32,          mm('menu.coffee',{lngs: LANG}),        ":coffee:",          50,         []         ],
            [48,         mm('menu.donut',{lngs: LANG}),         ":doughnut:",        100,        []         ],
            [200,        mm('menu.eggplant',{lngs: LANG}),      ":eggplant:",        100,        []         ],
            [76,        mm('menu.custard',{lngs: LANG}),      ":custard:",        100,        []         ],

        ]
	}




	finish() {
        this.cart = null
		return requests.delete(this.userID);
	}



	static orderActive(userID) {
		return requests.has(userID);
	}






}

module.exports = Cafe;

