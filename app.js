console.log("toimii");

var Twitter = require('twitter-node-client').Twitter;
var pug = require('pug');
var express = require('express');
var app = express();
app.set('view engine', 'pug');

app.use(express.static('public'));

var config = require('./secret/twitter_config.js');

var tweetCache;
var twitter = new Twitter(config);

var twitterError = function(err, response, body){
    handleError(err);
}
var twitterSuccess = function(data){
    tweetCache = JSON.parse(data);
    console.log('Tweets fetched from Twitter');
}

function fetchTweets() {
    twitter.getSearch({
            'q':'#maga',
            'count': 10,
            'result_type': 'recent',
            'include_entities': false
        }, twitterError, twitterSuccess);
}

//initial tweet fetch
fetchTweets();
var tweetUpdating = setInterval(fetchTweets, 1200000);

app.get('/', function(req,res,next){
    res.render('index', tweetCache);
});



/* ERROR HANDLING */
function handleError(err){
    console.log(err);
}

app.listen(3000, function() {
    console.log('App running on port 3000');
})