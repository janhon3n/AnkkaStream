var canvas = document.getElementById('stream-canvas');
var url = 'ws://'+document.location.hostname+':8082/';
var player = new JSMpeg.Player(url, {canvas: canvas, autoplay:true, disableGl:true});
setInterval(() => {player.currentTime}, 1000);

$("div#open-in-new-window-button").click(() => {
    var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
    window.open("/stream", "_blank", strWindowFeatures)
})


var canvasToFit = $("canvas#stream-canvas.fit")

function fitCanvas(){
    var width = $(window).width()
    var height = $(window).height()
    console.log(width + "x" + height);
    if(width / 480 > height / 640){
        canvasToFit.css({height:height+"px", width:(height / 640 * 480) + "px", marginTop:"0px"})
    } else {
        canvasToFit.css({width:width+"px", height:(width / 480 * 640) + "px", marginTop: ((height-(width / 480 * 640)) / 2) + "px"})
    }
}
if(canvasToFit.length){
    $(window).resize(function() {
        fitCanvas();
    })
}

fitCanvas();