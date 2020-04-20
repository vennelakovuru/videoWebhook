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
    // axios.all([
    //     axios.get(linkUrl),
    //     axios.get(videoUrl)
    // ]).then(axios.spread((linkRes, videoRes) => {
    //     console.log(linkRes.items[0].link);
    //     let linkResponse = '';
    //     linkRes.on('data', (chunk) => {
    //         linkResponse += chunk;
    //     });
    //     linkRes.on('end', () => {
    //         const linkDetails = JSON.parse(linkResponse);
    //         linksData = linkDetails.items[0].link + "," + linkDetails.items[0].link + "," + linkDetails.items[0].link;
    //         console.log('--------------------------linkdetails');
    //         console.log(linkDetails);
    //     });
    //     console.log('-----------------------------linkdata');
    //     console.log(linksData);
    //     let videoResponse = '';
    //     videoRes.on('data', (chunk) => {
    //         videoResponse += chunk;
    //     });
    //     videoRes.on('end', () => {
    //         const videoDetails = JSON.parse(videoResponse);
    //         let link = 'https://www.youtube.com/embed/';
    //         videoData = link + videoDetails.items[0].id.videoId + "," + link + videoDetails.items[1].id.videoId + "," + link + videoDetails.items[2].id.videoId;
    //     });
    //     console.log('---------------------------------------');
    //     console.log(linksData, videoData);
    //     console.log('---------------------------------------');
    //
    //     return response.json({
    //         fulfillmentText: linksData + ',' + videoData,
    //         speech: linksData + ',' + videoData,
    //         source: 'get-webhook-details'
    //     });
    // }));

    // axios.get(linkUrl)
    //     .then(function (linkRes) {
    //         console.log('+++++++++++++++++++++++++++=',linkRes);
    //     })
    //     .get(videoUrl)
    //     .then(function (videoRes) {
    //         console.log('----------------------'+videoRes);
    //     })
    //     .catch(function (e) {
    //
    //     })

    axios.all([
        axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&chart=mostPopular&type=video&maxResults=3&order=relevance&relevanceLanguage=en&q=${query}&key=${apiKey}`),
        axios.get(`https://www.googleapis.com/customsearch/v1?&key=${apiKey}&cx=017576662512468239146:omuauf_lfve&q=${query}&num=3&hl=en`)
    ])
        .then(axios.spread((videoRes, linkRes) => {
            // do something with both responses
            const linkResponse = JSON.stringify(linkRes.data)
            const linkDetails = JSON.parse(linkResponse);
            linksData = linkDetails.items[0].link + "," + linkDetails.items[0].link + "," + linkDetails.items[0].link;
            console.log(linksData);
            const videoResponse = JSON.stringify(videoRes.data)
            const videoDetails = JSON.parse(videoResponse);
            let link = 'https://www.youtube.com/embed/';
            videoData = link + videoDetails.items[0].id.videoId + "," + link + videoDetails.items[1].id.videoId + "," + link + videoDetails.items[2].id.videoId;
            console.log(videoData);
            return response.json({
                fulfillmentText: linksData + ',' + videoData,
                speech: linksData + ',' + videoData,
                source: 'get-webhook-details'
            });
        }));
});

server.listen((process.env.PORT || 8333), () => {
    console.log("Server is up and running...");
});
