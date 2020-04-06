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
            let link = 'https://www.youtube.com/watch?v=';
            let dataToSend = link + videoDetails.items[0].id.videoId + ",  " + link + videoDetails.items[1].id.videoId + ",  " + link + videoDetails.items[2].id.videoId;
            // var speechResponse = {
            //   google: {
            //     expectUserResponse: true,
            //     richResponse: {
            //       items: [
            //         {
            //           simpleResponse: {
            //             textToSpeech: dataToSend
            //           }
            //         }
            //       ]
            //     }
            //   }
            // };

            const messsage1 =[ {
                card: {
                    title: "card title",
                    subtitle: "card text",
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
                        title: "card title",
                        subtitle: "card text",
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

                }];


            return res.json({
                fulfillmentText: dataToSend,
                fulfillmentMessages: messsage1,
                speech: dataToSend,
                source: 'get-Video-Details'
            });
        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong',
            source: 'get-Video-Details'
        });
    });
});


server.listen((process.env.PORT || 8333), () => {
    console.log("Server is up and running...");
});
