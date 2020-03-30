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
  const apiKey= 'AIzaSyDhGASYUnmjszNIjzQ2Pr58YNc7xekWxWg';
  const query = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.video ? req.body.queryResult.parameters.video : 'learn software';
  console.log(query);
  const reqUrl =encodeURI(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&order=date&part=snippet&type=video,id&maxResults=3`);
  https.get(reqUrl, (responseFromAPI) => {
    let completeResponse = '';
    responseFromAPI.on('data', (chunk) => {
      completeResponse += chunk;
    });
    responseFromAPI.on('end', () => {
      const videoDetails = JSON.parse(completeResponse);
      let link='https://www.youtube.com/watch?v=';
      let dataToSend = link+videoDetails.items[0].id.videoId +'\n'+ link+videoDetails.items[1].id.videoId +'\n'+ link+videoDetails.items[2].id.videoId;
      console.log(dataToSend);
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
      return res.json({
        fulfillmentText: dataToSend,
        // payload: speechResponse,
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
