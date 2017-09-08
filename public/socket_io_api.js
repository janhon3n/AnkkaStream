var socket = io('http://localhost:3001');
socket.on('newTweets', function (data) {
  data.reverse();
  data.forEach(function(t) {
    $("#twitter").prepend('<div class="tweet">' + 
    '<div class="user">'+ 
    '<img src="'+t.user.profile_image_url+'">' +
    '<label class="username">' + t.user.name + '</label>' +
    '<label class="nametag">@'+t.user.screen_name+'</label>' +
    '</div><div class="text">' + t.text + '</div>' +
    '<div class="created-at">' + t.created_at + '</div></div>');
  });
  console.log(data);
});