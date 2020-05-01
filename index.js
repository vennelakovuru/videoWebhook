'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const axios = require('axios');
const cors = require('cors');

const server = express();
server.use(cors());
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());


server.post('/web-hook', function (req, response, next) {
    var linksData;
    var videoData;
    const apiKeypooja = 'AIzaSyAE1FuSqmtiMvN_sh080MkV8ySFuiStwTU';
    const apiKeyMe = 'AIzaSyDhGASYUnmjszNIjzQ2Pr58YNc7xekWxWg';
    const apiKey = 'AIzaSyCQ9x6nIYd2dZDJj5crDkoopVBkDZbu4ws';
    const query = req.body.queryResult.queryText;
    const videoUrl = encodeURI(`https://www.googleapis.com/youtube/v3/search?part=snippet&chart=mostPopular&type=video&maxResults=3&order=relevance&relevanceLanguage=en&q=${query}&key=${apiKey}`);
    const linkUrl = encodeURI(`https://www.googleapis.com/customsearch/v1?&key=${apiKey}&cx=017576662512468239146:omuauf_lfve&q=${query}&num=3&hl=en`);

    axios.all([
        axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&chart=mostPopular&type=video&maxResults=3&order=relevance&relevanceLanguage=en&q=${query}&key=${apiKey}`)
 ])
        .then(axios.spread((videoRes, linkRes) => {
            // do something with both responses
            const videoResponse = JSON.stringify(videoRes.data);
            const videoDetails = JSON.parse(videoResponse);
            let link = 'https://www.youtube.com/embed/';
            const messsage = [{
                card: {
                    imageUri: videoDetails.items[0].snippet.thumbnails.default.url,
                    buttons: [
                        {
                            text: "Link1",
                            postback: link + videoDetails.items[0].id.videoId
                        }
                    ]
                }
            }];

            return response.json({
                fulfillmentText: link + videoDetails.items[0].id.videoId,
                fulfillmentMessages: messsage,
                speech: link + videoDetails.items[0].id.videoId,
                source: 'get-Video-Details'
            })
                .catch(error => {
                    console.log('heyehey', error);
                });

        }));
});

server.listen((process.env.PORT || 8333), () => {
    console.log("Server is up and running...");
});
