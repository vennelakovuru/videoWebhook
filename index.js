'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const axios = require('axios');
const cors = require('cors');
const localStorage = require('localStorage')


const server = express();
server.use(cors());
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());


server.post('/web-hook', function (req, response, next) {
    const apiKeypooja = 'AIzaSyAE1FuSqmtiMvN_sh080MkV8ySFuiStwTU';
    const apiKey = 'AIzaSyDhGASYUnmjszNIjzQ2Pr58YNc7xekWxWg';
    const apiKeyJaggu = 'AIzaSyCQ9x6nIYd2dZDJj5crDkoopVBkDZbu4ws';
    const query = req.body.queryResult.queryText;
    const action = req.body.queryResult.action;

    if (action == 'video-intent') {
        localStorage.setItem('intent', query);
        const message = {
            text: {
                text: [
                    "Select your preference?"
                ]
            }
        };
        const message1 ={
            quickReplies: {
                quickReplies: [
                    'Courses',
                    'Projects',
                    'Code Challenges'
                ]
            }
        };

        return response.json({
            fulfillmentMessages: [message,message1],
            source: 'get-Video-Details'
        })
    }

    if (action == 'type') {
        localStorage.setItem('type', query);
        const message = {
            text: {
                text: [
                    "Tell us your expert level"
                ]
            }
        };
        const message1 = {
            quickReplies: {
                quickReplies: [
                    'Beginner',
                    'Intermediate',
                    'Expert'
                ]
            }
        };

        return response.json({
            fulfillmentMessages: [message, message1],
            source: 'get-category-details'
        })
    }
    if (action == 'level') {
        localStorage.setItem('level', query);
        const message = {
            text: {
                text: [
                    "What would you prefer?"
                ]
            }
        };
        const message1 ={
            quickReplies: {
                quickReplies: [
                    'Learn through Videos',
                    'Read to learn'
                ]
            }
        };

        return response.json({
            fulfillmentMessages: [message,message1],
            source: 'get-Video-Details'
        })
    }


    if (action == 'category') {
        const intent = localStorage.getItem('intent');
        const level = localStorage.getItem('level');
        const type = localStorage.getItem('type');
        const query1 = level + " " + intent + " "+type;
        if (query == 'Learn through Videos') {
            axios.all([
                axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&chart=mostPopular&type=video&maxResults=3&order=relevance&relevanceLanguage=en&q=${query1}&key=${apiKey}`)
            ])
                .then(axios.spread((videoRes, linkRes) => {
                    const videoResponse = JSON.stringify(videoRes.data);
                    const videoDetails = JSON.parse(videoResponse);
                    let link = 'https://www.youtube.com/watch?v=';
                    const messsage = [{
                        card: {
                            imageUri: videoDetails.items[0].snippet.thumbnails.high.url,
                            buttons: [
                                {
                                    text: videoDetails.items[0].snippet.title,
                                    postback: link + videoDetails.items[0].id.videoId
                                }
                            ]
                        }
                    },
                        {
                            card: {
                                imageUri: videoDetails.items[1].snippet.thumbnails.high.url,
                                buttons: [
                                    {
                                        text: videoDetails.items[1].snippet.title,
                                        postback: link + videoDetails.items[1].id.videoId
                                    }
                                ]
                            }
                        },
                        {
                            card: {
                                imageUri: videoDetails.items[2].snippet.thumbnails.high.url,
                                buttons: [
                                    {
                                        text: videoDetails.items[2].snippet.title,
                                        postback: link + videoDetails.items[2].id.videoId
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
        if (query == 'Read to learn') {
            axios.all([
                axios.get(`https://www.googleapis.com/customsearch/v1?&key=${apiKey}&cx=014915153281259747060:rqmfryiuudy&q=${query1}&num=3&hl=en`)
            ])
                .then(axios.spread((linkRes) => {
                    const linkResponse = JSON.stringify(linkRes.data);
                    const linkDetails = JSON.parse(linkResponse);

                    const linksData = linkDetails.items[0].link;

                    const message = [{
                        linkOutSuggestion: {
                            destinationName: linkDetails.items[0].link,
                            uri: linkDetails.items[0].link
                        }
                    },
                        {
                            linkOutSuggestion: {
                                destinationName: linkDetails.items[1].link,
                                uri: linkDetails.items[1].link
                            }
                        },
                        {
                            linkOutSuggestion: {
                                destinationName: linkDetails.items[2].link,
                                uri: linkDetails.items[2].link
                            }
                        }];

                    return response.json({
                        fulfillmentMessages: message,
                        speech: linksData,
                        source: 'get-Video-Details'
                    })
                        .catch(error => {
                            console.log('heyehey', error);
                        });

                }));
        }
    }
});

server.listen((process.env.PORT || 8333), () => {
    console.log("Server is up and running...");
});
