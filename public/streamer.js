var canvas = document.getElementById('stream-canvas');

var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
ctx.fillText("Hello World",10,50);


var url = 'ws://'+document.location.hostname+':8082/';
var player = new JSMpeg.Player(url, {canvas: canvas, autoplay:auto, disableGl:true});
setInterval(() => {player.currentTime}, 1000);

