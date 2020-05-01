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
    const apiKeypooja = 'AIzaSyAE1FuSqmtiMvN_sh080MkV8ySFuiStwTU';
    const apiKeyMe = 'AIzaSyDhGASYUnmjszNIjzQ2Pr58YNc7xekWxWg';
    const apiKey = 'AIzaSyCQ9x6nIYd2dZDJj5crDkoopVBkDZbu4ws';
    const query = req.body.queryResult.queryText;
    const action = req.body.queryResult.action;
    if (action == 'video-intent') {
        const intent = query;
        const message = [{
            quickReplies: {
                title: 'What would you prefer?',
                quickReplies: [
                    'Watch Videos',
                    'Read Tutorials'
                ]
            }

        }];

        return response.json({
            fulfillmentMessages: message,
            source: 'get-Video-Details'
        })
    }

    if (action == 'category') {
        const category = query;
        const message = [{
            quickReplies: {
                title: 'Tell us your expert level',
                quickReplies: [
                    'Beginner',
                    'Intermediate',
                    'Expert'
                ]
            }

        }];

        return response.json({
            fulfillmentMessages: message,
            source: 'get-category-details'
        })
    }

    if (action == 'level') {
        axios.all([
            axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&chart=mostPopular&type=video&maxResults=3&order=relevance&relevanceLanguage=en&q=${query}&key=${apiKey}`)
        ])
            .then(axios.spread((videoRes, linkRes) => {
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
    }
});

server.listen((process.env.PORT || 8333), () => {
    console.log("Server is up and running...");
});
