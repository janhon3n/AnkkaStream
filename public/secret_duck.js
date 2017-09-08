var secretDuck = $("#secret-duck");
var secretDuckReady = true;
var secretDuckState = 0;
var stepsToMove = [];

function moveSecretDuckIteration(cb){
    var step = stepsToMove[0];
    stepsToMove.shift();
    secretDuck.animate(
        {
            "bottom": step.pos + "px"
        }, step.time, () => {
            if(stepsToMove.length === 0){
                cb();
            } else {
                moveSecretDuckIteration(cb);
            }
    });
}

function moveSecretDuck(steps, cb){
    stepsToMove = steps;
    if(stepsToMove.length > 0){
        moveSecretDuckIteration(cb);
    } else {
        secretDuckReady = true;
    }
}

function showSpeechBubble(text, size, duration, cb) {
    $("#secret-duck .speech-bubble-text").html(text).css({"font-size":size+"px"})
    $("#secret-duck svg#speech-bubble").show();
    setTimeout(() => {
        $("#secret-duck svg#speech-bubble").hide();
        cb();
    }, duration);
}


secretDuck.find("img").click(() => {
    if(secretDuckReady){
        secretDuckReady = false;
        secretDuckState++;
        switch(secretDuckState){
            case 0:
            case 1:
                moveSecretDuck([{pos:-110, time:200},{pos:-120, time:200}], () => {
                    secretDuckReady = true;
                })
                break;
            case 2:
                moveSecretDuck([{pos:-70, time:400}], () => {
                    secretDuckReady = true;
                })
                break;
            case 3:
                moveSecretDuck([{pos:-20, time:50}], () => {
                    showSpeechBubble("KVAAK!", 35, 1000, () => {
                        moveSecretDuck([{pos:-40, time:200}], () => {
                            secretDuckReady = true;                                                    
                        })
                    });
                })
                break;
            case 4:
                showSpeechBubble("Hei ystävä", 25, 1000, () => {
                    secretDuckReady = true;
                })
                break;
            case 5:
                showSpeechBubble("Minkä takia hanhilla on pitkä kaula?", 20, 4000, () => {
                    secretDuckReady = true;
                })
                break;
            
            case 6:
                    showSpeechBubble("Jos vesi sattuisi nousemaan, ne eivät huku.", 20, 4000, () => {
                        secretDuckReady = true;
                    })
                break;
        }
    }
});

