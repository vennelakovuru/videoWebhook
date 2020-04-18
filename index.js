'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https')
const cors = require('cors');
const server = express();
server.use(cors());
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());

server.post('/getVideoDetails', (req, res) => {
        const apiKey = 'AIzaSyDhGASYUnmjszNIjzQ2Pr58YNc7xekWxWg';
        const query = req.body.queryResult.queryText;
        console.log(req.body.queryResult);
        console.log(query);
        // const query = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.video ? req.body.queryResult.parameters.video : 'learn software';
        const reqUrl = encodeURI(`https://www.googleapis.com/youtube/v3/search?part=snippet&chart=mostPopular&type=video&maxResults=3&order=relevance&relevanceLanguage=en&q=${query}&key=${apiKey}`);
        https.get(reqUrl, (responseFromAPI) => {
            let completeResponse = '';
            responseFromAPI.on('data', (chunk) => {
                completeResponse += chunk;
            });
            responseFromAPI.on('end', () => {
                const videoDetails = JSON.parse(completeResponse);
                let link = 'https://www.youtube.com/embed/';
                let dataToSend = link + videoDetails.items[0].id.videoId + "," + link + videoDetails.items[1].id.videoId + "," + link + videoDetails.items[2].id.videoId;
                const messsage1 = [{
                    card: {
                        imageUri: videoDetails.items[0].snippet.thumbnails.default.url,
                        buttons: [
                            {
                                text: "Link1",
                                postback: link + videoDetails.items[0].id.videoId
                            }
                        ]
                    }
                },
                    {
                        card: {

                            imageUri: videoDetails.items[1].snippet.thumbnails.default.url,
                            buttons: [
                                {
                                    text: "Link2",
                                    postback: link + videoDetails.items[1].id.videoId
                                }
                            ]
                        }

                    },
                    {
                        card: {
                            imageUri: videoDetails.items[2].snippet.thumbnails.default.url,
                            buttons: [
                                {
                                    text: "Link3",
                                    postback: link + videoDetails.items[2].id.videoId
                                }
                            ]
                        }

                    }
                ];
                return res.send(dataToSend);
                // return res.json({
                //     fulfillmentText: dataToSend,
                //     fulfillmentMessages: messsage1,
                //     speech: dataToSend,
                //     source: 'get-Video-Details'
                // });
            });
        }, (error) => {
            return res.json({
                speech: 'Something went wrong',
                source: 'get-Video-Details'
            });
        });
    }
);


//do your process here
server.post('/web-hook', function (req, response, next) {
    var linksData;
    var videoData;

    (async function () {
        // wait to http request to finish
        linksData= await makeSynchronousRequestLinks(req);

        // below code will be executed after http request is finished
        console.log(linksData);
    })();

    (async function () {
        // wait to http request to finish
        videoData= await makeSynchronousVideoLinks(req);

        // below code will be executed after http request is finished
        console.log(videoData);
    })();


        console.log('----------------------------------------------------links');
        console.log(linksData);
        console.log('----------------------------------------------------videos');
        console.log(videoData);
        console.log('----------------------------------------------------links');
        return response.json({
            fulfillmentText: linksData + ',' + videoData,
            speech: linksData + ',' + videoData,
            source: 'get-webhook-details'
        });
});

function getLinkPromise(req) {
    return new Promise((resolve, reject) => {
        var linksData;
        const apiKey = 'AIzaSyDhGASYUnmjszNIjzQ2Pr58YNc7xekWxWg';
        const query = req.body.queryResult.queryText;
        const linkUrl = encodeURI(`https://www.googleapis.com/customsearch/v1?&key=${apiKey}&cx=017576662512468239146:omuauf_lfve&q=${query}&num=3&hl=en`);
        https.get(linkUrl, (responseFromAPI) => {
            let completeResponse = '';
            responseFromAPI.on('data', (chunk) => {
                completeResponse += chunk;
            });
            responseFromAPI.on('end', () => {
                const linkDetails = JSON.parse(completeResponse);
                console.log('++++++++++++++++++++++linkdetails',linkDetails);
                linksData = linkDetails.items[0].link + "," + linkDetails.items[0].link + "," + linkDetails.items[0].link;
                console.log('++++++++++++++++++++++++linksdata',linksData);
                resolve(linksData);
            });

            responseFromAPI.on('error', (error) => {
                reject(error);
            });
        });
    });
}

async function makeSynchronousRequestLinks(req) {
    try {
        let http_promise = getLinkPromise(req);
        let response_body = await http_promise;

        // holds response from server that is passed when Promise is resolved

        return response_body;
    }
    catch(error) {
        // Promise rejected
        console.log(error);
    }
}

function getVideoPromise(req) {
    return new Promise((resolve, reject) => {
        var linksData;
        const apiKey = 'AIzaSyDhGASYUnmjszNIjzQ2Pr58YNc7xekWxWg';
        const query = req.body.queryResult.queryText;
        const videoUrl = encodeURI(`https://www.googleapis.com/youtube/v3/search?part=snippet&chart=mostPopular&type=video&maxResults=3&order=relevance&relevanceLanguage=en&q=${query}&key=${apiKey}`);
        https.get(videoUrl, (responseFromAPI) => {
            let completeResponse = '';
            responseFromAPI.on('data', (chunk) => {
                completeResponse += chunk;
            });
            responseFromAPI.on('end', () => {
                const videoDetails = JSON.parse(completeResponse);
                console.log('----------------------------videodetails',videoDetails);
                let link = 'https://www.youtube.com/embed/';
                videoData = link + videoDetails.items[0].id.videoId + "," + link + videoDetails.items[1].id.videoId + "," + link + videoDetails.items[2].id.videoId;
                console.log('----------------------------videodata',videoData);
            });
        });
    });
}

async function makeSynchronousVideoLinks(req) {
    try {
        let http_promise = getVideoPromise(req);
        let response_body = await http_promise;

        // holds response from server that is passed when Promise is resolved

        return response_body;
    }
    catch(error) {
        // Promise rejected
        console.log(error);
    }
}


server.listen((process.env.PORT || 8333), () => {
    console.log("Server is up and running...");
});
