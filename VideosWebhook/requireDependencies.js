const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const API_KEY = require('./apiKey');

const server = express();
server.use(bodyParser.urlencoded({
  extended: true
}));

server.use(bodyParser.json());
server.post('/getVideoDetails', (req, res) => {
  const reqUrl = 'https://www.googleapis.com/youtube/v3/search?key=' + ${API_KEY} +  '&q=dogs &order=date&part=snippet &type=video,id&maxResults=3';

  http.get(reqUrl, (responseFromAPI) => {
    let completeResponse = '';
    responseFromAPI.on('data', (chunk) => {
      completeResponse += chunk;
    });
    responseFromAPI.on('end', () => {
      const movie = JSON.parse(completeResponse);
      return res.json({
        speech: 'hey',
        displayText: 'hello',
        source: 'getVideoDetails'
      });
    });
  }, (error) => {
    return res.json({
      speech: 'Something went wrong!',
      displayText: 'Something went wrong!',
      source: 'get-movie-details'
    });
  });
});
