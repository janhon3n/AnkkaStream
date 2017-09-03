const twitterSearch = "#ankkastream";
const tweetCount = 10;

var Twitter = require('twitter-node-client').Twitter;
var moment = require('moment');
var pug = require('pug');
var express = require('express');
var app = express();
var io = require('socket.io')(app);
app.set('view engine', 'pug');

app.use(express.static('public'));

var config = require('./secret/twitter_config.js');

var tweetCache;
var twitter = new Twitter(config);

var twitterError = function(err, response, body){
    handleError(err);
}
var twitterSuccess = function(data){
    var twitterData = JSON.parse(data);
    var newTweets = [];
    twitterData.statuses.forEach((s) => {
        s.created_at = moment(new Date(s.created_at.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/,
                "$1 $2 $4 $3 UTC"))).format('DD.MM.YYYY HH:mm');
        if(tweetCache.statuses.some((cachedTweet) => {

	})){
		
	}
    });
    //TODO only update if data changed and send changes
    tweetCache = twitterData;
    var clients = io.sockets.clients();
    clients.forEach((c) => {
        c.emit('tweetUpdate', 
    });
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

app.listen(3000, function() {
    console.log('App running on port 3000');
})



/* SOCKET IO STUFF */
io.on('connection', function(socket){

});
