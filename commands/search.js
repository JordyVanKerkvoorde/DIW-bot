const { dataService } = require('../services/data.service');

module.exports = {
	name: 'search',
	description: 'Search for a DIW video, searchtext must be at least 4 characters long.',
	aliases: ['s'],
	usage: '[searchtext] [pagination]',
	cooldown: 5,
	async execute(message, args) {
        const [searchtext, pagination] = [args[0], args[1] ? parseInt(args[1]) : 1];

        if(searchtext.length < 4) return message.channel.send('The searchtext must be at least 4 characters long.')
        if(!Number.isInteger(pagination) || pagination < 0) return message.channel.send('The pagination should be a positive number.');
        if(pagination === 0) return message.channel.send('There could be a result but I guess you don\'t want to find out...');
        if(pagination === 69) message.channel.send('Noice...');
        
        const results = dataService.getVideoBySearch(searchtext);
        if(results.length === 0) return message.channel.send('No results found :cry:');

        const URL = `https://www.youtube.com/watch?v=${results[pagination - 1].snippet.resourceId.videoId}`;

        message.channel.send(`${results.length} results found for: ${searchtext}`);
        message.channel.send(`Result ${pagination}: ${URL}`);
	}
};