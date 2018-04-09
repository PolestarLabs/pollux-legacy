const TwitchBot = require('twitch-bot');
const gear = require('../gearbox.js')
 // const fx = require('../../dash/routes/globalFunctions.js');

const Bot = new TwitchBot({
  username: 'Pollux',
  oauth: 'oauth:oenmb858tf8hvnybjz6cf9h0b98kym',
  channels: ['theflicky']
})


Bot.on('join', () => {

  Bot.on('message', chatter => {
try{
    if(chatter.message === '+ping') {
      Bot.say('PONG')
    }

    if(chatter.message === '+daily') {
      Bot.say('You got 50 Rubines of experimental dailies!')
    }


}catch(e){  console.log(e)}

  })
})


Bot.on('error', err => {
  console.log(err)
})
