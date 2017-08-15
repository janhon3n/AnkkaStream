var canvas = document.getElementById('stream-canvas');
var url = 'ws://'+document.location.hostname+':8082/';
var player = new JSMpeg.Player(url, {canvas: canvas, poster: "http://jiipeenetti.fi/images/stories/testit/ankka.jpg", autoplay:true});