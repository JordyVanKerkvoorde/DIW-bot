const { dataService } = require('../services/data.service')
const { youtubeService } = require('../services/youtube.service')

module.exports = {
	name: 'test',
	description: 'TESTcommand',
	aliases: [''],
	usage: '',
	cooldown: 1,
	async execute(message, args) {
        let newVids = await dataService.checkLatest();
        console.log(newVids)
        message.channel.send('These videos are not in the datalist: ');
        newVids.forEach(video => {
            const URL = `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;
		    message.channel.send(URL);
        });
	}
};