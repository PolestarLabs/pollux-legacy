var players = new Map();
var room = new Map();
var gear = require("../gearbox.js");
var paths = require("../paths.js");
var locale = require('../../utils/multilang_b');
var mm = locale.getT();




class Russia {
    constructor(msg) {

        const LANG = msg.lang;
        this.guildID = msg.guild.id;
        this.room = msg.channel.id;
        this.author = msg.author.id;
        this.drum = [false, false, true, false, false, false];
        room.set(this.room, this);


    }

    shuffle() {
        gear.shuffle(this.drum);
    }

    load(X) {
        gear.shuffle(this.drum);
    }


    finish() {
        return players.clear();
    }

    register(playerID, bet = 0) {

        if (!players.get(playerID)){
        players.set(playerID, this);
        }
    }

    static ongoingUser(userID) {
        return players.has(userID);
    }

    static ongoingChannel(chanID) {
        return room.has(chanID);
    }





}

module.exports = Russia;
