const { prefix } = require('../config.json');
const axios = require('axios');

module.exports = {
	name: 'latest',
	description: 'Get the latest video of DIW.',
	aliases: ['newest'],
	usage: '',
	cooldown: 30,
	execute(message, args) {
        axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${process.env.DIWUPLOADSID}&key=${process.env.YTTOKEN}&part=snippet&maxResults=50`)
            .then(response => {
                const video = response.data.items[0];
                const URL = `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;
                message.channel.send(URL);
            });
	},
};