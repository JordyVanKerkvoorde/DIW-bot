require('dotenv').config();
const fs = require('fs');
const axios = require('axios')
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix } = require('./config.json');
const { cpuUsage } = require('process');
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setStatus('online');
    // client.user.setActivity('$help', { type: 'LISTENING', url: '' })
    // .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
    // .catch(console.error);
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            
    if (!command) return;

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

let newestVideoID = '';

function checkNewestVideo(){
                console.log(newestVideoID)
    axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${process.env.DIWUPLOADSID}&key=${process.env.YTTOKEN}&part=snippet&maxResults=50`)
        .then(response => {
            const video = response.data.items[0];
            const newestID = video.snippet.resourceId.videoId;
            if(newestVideoID !== newestID){
                newestVideoID = newestID;
                const URL = `https://www.youtube.com/watch?v=${newestID}`;
                const channel = client.channels.cache.find(channel => channel.name === 'diw');
                channel.send('A NEW DIW VIDEO RELEASED!')
                channel.send(URL);
            }
        });
}

checkNewestVideo();
setInterval(function() {
    checkNewestVideo();
}, 600000);


client.login(process.env.TOKEN);