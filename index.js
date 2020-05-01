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
    const action = req.body.queryResult.action;
    if(action == 'video-intent') {
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

    if(action == 'category'){
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
    
});

server.listen((process.env.PORT || 8333), () => {
    console.log("Server is up and running...");
});
