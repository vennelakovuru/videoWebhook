'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https')
const cors = require('cors');
const server = express();
server.use(cors());
server.use(bodyParser.json());

server.post('/getVideoDetails', (req, res) => {
  const apiKey= 'AIzaSyDhGASYUnmjszNIjzQ2Pr58YNc7xekWxWg';
  const query = req.body.result && req.body.result.parameters && req.body.result.parameters.video ? req.body.result.parameters.video : 'learn software';
  console.log('request', req);
  console.log(query);
  const reqUrl =encodeURI(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&order=date&part=snippet&type=video,id&maxResults=3`);
  https.get(reqUrl, (responseFromAPI) => {
    let completeResponse = '';
    responseFromAPI.on('data', (chunk) => {
      completeResponse += chunk;
    });
    responseFromAPI.on('end', () => {
      const videoDetails = JSON.parse(completeResponse);
      let link='https://www.youtube.com/watch?v='
      return res.json({
        link1: link+videoDetails.items[0].id.videoId,
        link2: link+videoDetails.items[1].id.videoId,
        link3: link+videoDetails.items[2].id.videoId
      });
    });
  }, (error) => {
    return res.json({
      link: 'Something went wrong!'
    });
  });
});


server.listen((process.env.PORT || 8333), () => {
console.log("Server is up and running...");
});
