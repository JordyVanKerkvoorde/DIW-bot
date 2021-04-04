require('dotenv').config();
const axios = require('axios');

class YouTubeService {
    constructor(){}
    
    async fetchPlaylistData(pageToken){
        let url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${process.env.DIWUPLOADSID}&key=${process.env.YTTOKEN}&part=snippet&maxResults=50&pageToken=${pageToken}`;
        const response = await axios.get(url);
        return response.data;
    }
}


const youtubeService = new YouTubeService();

module.exports = {
    youtubeService
};