const fs = require('fs');
const { youtubeService } = require('../services/youtube.service');

class DataService {
    noNewsIdentifiers = ['jan jaap']

    constructor(){}

    getRandomVideo() {
        const playlist = JSON.parse(fs.readFileSync('./data.json'));
        const randomInt = Math.floor(playlist.videos.length * Math.random());
		const video = playlist.videos[randomInt];
        return video;
    }

    getRandomVideoNoNews() {
        const playlist = JSON.parse(fs.readFileSync('./data.json'));
        const randomInt = Math.floor(playlist.videos.length * Math.random());
		let video = playlist.videos[randomInt];
        let description = video.snippet.description.toLowerCase();
        
        while(new RegExp(substrings.join("|")).test(description)){
            const randomInt = Math.floor(playlist.videos.length * Math.random());
            video = playlist.videos[randomInt];
            description = video.snippet.description.toLowerCase();
        }

        return video;
    }

    getLatest() {
        const playlist = JSON.parse(fs.readFileSync('./data.json'));
		const video = playlist.videos[0];
        return video;
    }

    async checkLatest() {
        const newestData = await youtubeService.fetchPlaylistData('');
        let data = JSON.parse(fs.readFileSync('./data.json'));
        const playlist = data.videos.slice(0, 50);
        let newVideos = [];
        newestData.items.forEach((item, index) => {
            if(!(playlist.find(video => video.id === item.id))) newVideos.push(item);
        });

        data.videos = [...newVideos, ...data.videos];
        fs.writeFileSync('./data.json', JSON.stringify(data, null, 4));

        return newVideos;
    }

    getVideoBySearch(searchtext){
        const data = JSON.parse(fs.readFileSync('./data.json'));
        let results = [];

        data.videos.forEach(video => {
            const [title, description] = [video.snippet.title.toLowerCase(), video.snippet.description.toLowerCase()];

            if(title.includes(searchtext.toLowerCase()) || description.includes(searchtext.toLowerCase())) results.push(video);
        });


        return results;
    }
}


const dataService = new DataService();

module.exports = {
    dataService
};