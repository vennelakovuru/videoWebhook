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
        const message2 = [{
                "quickReplies":
                    {
                        "title": string,
                        "quickReplies": [
                            string
                        ]
                    },

            }];

            return response.json({
                fulfillmentMessages: messsage2,
                source: 'get-Video-Details'
            })

});

server.listen((process.env.PORT || 8333), () => {
    console.log("Server is up and running...");
});
