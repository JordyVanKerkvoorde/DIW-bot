require('dotenv').config();
const { prefixes, flags } = require('./config.json');

const runflag = process.argv.slice(2).shift();
let prefix, token, init;

switch(true) {
    case flags.dev.includes(runflag):
        [prefix, token, init] = [prefixes.ghost, process.env.GHOSTTOKEN, true];
        break;

    case flags.test.includes(runflag): 
        [prefix, token, init] = [prefixes.ghost, process.env.GHOSTTOKEN, false];
        break;

    case flags.prod.includes(runflag):
        [prefix, token, init] = [prefixes.prod, process.env.TOKEN, true];
        break;

    default: 
        [prefix, token, init] = [prefixes.ghost, process.env.TOKEN, true];
        break;
}

const Bot = new (require('./bot'))(prefix, token, init);

Bot.start();