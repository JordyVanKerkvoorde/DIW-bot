const fs = require('fs');
const { youtubeService } = require('./services/youtube.service');

class DataSeeder {
    playlist = {};
    constructor(){
        let dataObject = {
            videos: []
        }
        fs.writeFileSync('./data.json', JSON.stringify(dataObject, null, 4));
        this.playlist = JSON.parse(fs.readFileSync('./data.json'))
        //console.log(this.playlist)
    }

    async initializeData() {
        let pageToken = '';
        let data = await youtubeService.fetchPlaylistData(pageToken);
        let looping = true
        while(looping){
            this.playlist.videos = [...this.playlist.videos, ...data.items];
            looping = data.nextPageToken ? true : false;
            if(data.nextPageToken) data = await youtubeService.fetchPlaylistData(data.nextPageToken);
        }
        console.log(this.playlist.videos.length);
        fs.writeFileSync('./data.json', JSON.stringify(this.playlist, null, 4));

    }
    
}

const dataSeeder = new DataSeeder();

module.exports = {
    dataSeeder
};