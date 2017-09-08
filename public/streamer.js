var canvas = document.getElementById('stream-canvas');
var url = 'ws://'+document.location.hostname+':8082/';
var player = new JSMpeg.Player(url, {canvas: canvas, autoplay:true, disableGl:true});
setInterval(() => {player.currentTime}, 1000);