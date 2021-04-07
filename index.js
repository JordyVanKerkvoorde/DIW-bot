require('dotenv').config();
const fs = require('fs');
const axios = require('axios')
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, ghostPrefix } = require('./config.json');
const { cpuUsage } = require('process');
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const { dataSeeder } = require('./data.seeder');
const { dataService } = require('./services/data.service');

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

client.login(process.env.TOKEN);

let newestVideoID = '';

async function checkNewestVideo(){
    try{
        const newVideos = await dataService.checkLatest();
        client.guilds.cache.forEach(guild => {
            newVideos.forEach(video => {
                const channel = guild.channels.cache.find(channel => channel.name === 'diw');
                const role = guild.roles.cache.find(role => role.name === "diw");
                try{
                    channel.send(`<@&${role.id}>De Ideale Wereld werd net iets idealer:`);
                    const URL = `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;
                    channel.send(URL);
                } catch(err) {
                    console.log('Message couldnt be sent for guild: ' + guild.name)
                }
            })
        })


    } catch(err){
        console.log(err)
    }
}

async function getData(){
    await dataSeeder.initializeData();
}

getData();

checkNewestVideo();
setInterval(function() {
    checkNewestVideo();
}, 600000);
// 600000 = 10min

