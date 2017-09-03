var socket = io('http://ankat.dy.fi');
socket.on('newTweets', function (data) {
  console.log("New tweets recieved:")
  console.log(data);
});