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
    const apiKeyPooja = 'AIzaSyAE1FuSqmtiMvN_sh080MkV8ySFuiStwTU';
    const apiKeyMe = 'AIzaSyDhGASYUnmjszNIjzQ2Pr58YNc7xekWxWg';
    const apiKeyJaggu = 'AIzaSyCQ9x6nIYd2dZDJj5crDkoopVBkDZbu4ws';
    const apiKey='AIzaSyB0zGCeiZ9hoZtPPrdN3x2nrhVqg2N6Q2Y'

    const query = req.body.queryResult.queryText;
    const videoUrl = encodeURI(`https://www.googleapis.com/youtube/v3/search?part=snippet&chart=mostPopular&type=video&maxResults=3&order=relevance&relevanceLanguage=en&q=${query}&key=${apiKey}`);
    const linkUrl = encodeURI(`https://www.googleapis.com/customsearch/v1?&key=${apiKey}&cx=017576662512468239146:omuauf_lfve&q=${query}&num=3&hl=en`);

    axios.all([
        axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&chart=mostPopular&type=video&maxResults=3&order=relevance&relevanceLanguage=en&q=${query}&key=${apiKey}`),
        axios.get(`https://www.googleapis.com/customsearch/v1?&key=${apiKey}&cx=014915153281259747060:rqmfryiuudy&q=${query}&num=3&hl=en`)
        // axios.get(videoUrl),
        // axios.get(linkUrl)
    ])
        .then(axios.spread((videoRes, linkRes) => {
            // do something with both responses
            const linkResponse = JSON.stringify(linkRes.data);
            const linkDetails = JSON.parse(linkResponse);
            const videoResponse = JSON.stringify(videoRes.data);
            const videoDetails = JSON.parse(videoResponse);
            // //linksData = linkDetails.items[0].link + "," + linkDetails.items[1].link + "," + linkDetails.items[2].link;
            // linksData = linkDetails.items[0].link +'^'+ linkDetails.items[0].title + '^'+ linkDetails.items[0].snippet+"^"
            //     +linkDetails.items[1].link+'^'+linkDetails.items[1].title+'^'+ linkDetails.items[1].snippet+"^"
            //     +linkDetails.items[2].link +'^'+ linkDetails.items[2].title+'^'+ linkDetails.items[2].snippet;
            // console.log('linkdata', linksData);

            let link = 'https://www.youtube.com/embed/';
            // // videoData = link + videoDetails.items[0].id.videoId + "^" + link + videoDetails.items[1].id.videoId + "^" + link + videoDetails.items[2].id.videoId;
            // videoData = link + videoDetails.items[0].id.videoId + "^" + link + videoDetails.items[1].id.videoId + "^" + link + videoDetails.items[2].id.videoId + "^"
            //     +videoDetails.items[0].snippet.title+ "^" + videoDetails.items[1].snippet.title + "^" +videoDetails.items[2].snippet.title+ "^"
            //     +videoDetails.items[0].snippet.description  + "^" +videoDetails.items[1].snippet.description+ "^" + videoDetails.items[2].snippet.description;
            //
            // console.log('videodata', videoData);

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
