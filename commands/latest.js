const { dataService } = require('../services/data.service')

module.exports = {
	name: 'latest',
	description: 'Get the latest video of DIW.',
	aliases: ['newest'],
	usage: '',
	cooldown: 30,
	execute(message, args) {
		const video = dataService.getLatest();
        const URL = `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;
		message.channel.send(URL);
	},
};