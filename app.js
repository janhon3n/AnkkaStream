const twitterSearch = "#ankkastream";
const tweetCount = 10;

var Twitter = require('twitter-node-client').Twitter;
var moment = require('moment');
var pug = require('pug');
var express = require('express');
var http = require('http')
var socketIo = require('socket.io')
var app = express();
var server = http.Server(app)
var io = socketIo(server);

server.listen(3000);

app.set('view engine', 'pug');

app.use(express.static('public'));

var config = require('./secret/twitter_config.js');

var tweetCache = {
    statuses: []   
}
var twitter = new Twitter(config);

var twitterError = function(err, response, body){
    handleError(err);
}
var twitterSuccess = function(data){
    var twitterData = JSON.parse(data);
    var newTweets = [];
    twitterData.statuses.forEach((s) => {
        s.created_at = moment(new Date(s.created_at.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/, "$1 $2 $4 $3 UTC"))).format('DD.MM.YYYY HH:mm');

        //add tweet to newTweets array if not in existing cache
        if(!tweetCache.statuses.some((cachedTweet) => {
            return cachedTweet.id == s.id;
        })){
            newTweets.statuses.push(s);
        }
    });

    //if new tweets add them to cache and send to clients
    if(newTweets.length > 0){
        tweetCache = tweetCache.statuses.concat(newTweets);
        io.sockets.clients().forEach((c) => {
            c.emit('newTweets', newTweets);
        });
    }

    console.log('Tweets fetched from Twitter');
}

function fetchTweets() {
    twitter.getSearch({
            'q':twitterSearch,
            'count': tweetCount,
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

/* SOCKET IO STUFF */
io.on('connection', function(socket){
});
