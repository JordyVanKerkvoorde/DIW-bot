const { dataService } = require('../services/data.service')

module.exports = {
	name: 'random',
	description: 'Get a random DIW video',
	aliases: ['r'],
	usage: '[nonews]',
	cooldown: 5,
	execute(message, args) {
        let video;
        switch(args[0]) {
            case 'nonews':
                video = dataService.getRandomVideoNoNews();
            default:
                video = dataService.getRandomVideo();
        }
        const URL = `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;
		message.channel.send(URL);
	},
};