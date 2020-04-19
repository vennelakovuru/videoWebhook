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
    const apiKey = 'AIzaSyDhGASYUnmjszNIjzQ2Pr58YNc7xekWxWg';
    const query = req.body.queryResult.queryText;
    const videoUrl = encodeURI(`https://www.googleapis.com/youtube/v3/search?part=snippet&chart=mostPopular&type=video&maxResults=3&order=relevance&relevanceLanguage=en&q=${query}&key=${apiKey}`);
    const linkUrl = encodeURI(`https://www.googleapis.com/customsearch/v1?&key=${apiKey}&cx=017576662512468239146:omuauf_lfve&q=${query}&num=3&hl=en`);
    var videoRes;
    var linkRes;
    axios.all([
        https.get(videoUrl),
        https.get(linkUrl)
    ]).then(axios.spread((videoRes, linkRes) => {
        console.log(videoRes, linkRes);
    }));

    return response.json({
        fulfillmentText: videoRes + ',' + linkRes,
        speech: linksData + ',' + videoData,
        source: 'get-webhook-details'
    });
});

server.listen((process.env.PORT || 8333), () => {
    console.log("Server is up and running...");
});
