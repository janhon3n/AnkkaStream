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

var htmlTweet = require('html-tweet')(
    {
        hashtag: '<span class=\'hashtag\'><%= hashtag %></span>',
        mention: '<a class=\'mention\' href=\'https://twitter.com/<%= mention %>\'><%= mention %></a>',
        url: '<a class=\'url\' href=\'<%= url %>\'><%= url %></a>'
}
)

var clientCount = 0;

server.listen(3000);
app.set('view engine', 'pug');
app.use(express.static('public'));

var config = require('./secret/twitter_config.js');
var tweetCache = [] 
var twitter = new Twitter(config);

var twitterError = function(err, response, body){
    handleError(err);
}
var twitterSuccess = function(data){
    var twitterData = JSON.parse(data);
    var newTweets = []

    twitterData.statuses.forEach((s) => {

        //add tweet to newTweets array if not in existing cache
        if(!tweetCache.some((cachedTweet) => {
            return cachedTweet.id == s.id;
        })){
            s.created_at = moment(new Date(s.created_at.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/, "$1 $2 $4 $3 UTC"))).format('DD.MM.YYYY HH:mm');
            s.text = htmlTweet(s.text);
            newTweets.push(s);
        }
    });

    //if new tweets add them to cache and send to clients
    if(newTweets.length > 0){
        tweetCache = newTweets.concat(tweetCache);
        io.sockets.emit('newTweets', newTweets);
    }

    console.log(newTweets);
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
var tweetUpdating = setInterval(fetchTweets, 600000);

app.get('/', function(req,res,next){
    res.render('index', {statuses:tweetCache});
});
app.get('/stream', function(req,res,next){
    res.render('stream')
})


/* ERROR HANDLING */
function handleError(err){
    console.log(err);
}

/* SOCKET IO STUFF */
io.on('connection', function(socket){
    console.log('New user connected');
    clientCount++;

    socket.on('disconnect', () => {
        clientCount--;
        console.log('User disconnected');
    });
});
