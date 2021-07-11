//Main

var crowns;

var crownSymbol = "👑 ";

loadLevels();
loadCrowns();

//Cookies

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname.replace('"', '').replace("'", "") + "=" + cvalue + ";" + expires + ";path=/";
  }

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//Crowns

async function loadCrowns(loadFrom) {
    crowns = parseInt(getCookie("crowns"));

    $(".crowns").text(crownSymbol + crowns.toString());
}

function addCrowns(crownsToAdd) {
    crowns += crownsToAdd;
    setCookie("crowns", crowns, 7);
    $(".crowns").text(crownSymbol + crowns.toString());
}

function removeCrowns(crownsToRemove) {
    if ((crowns - crownsToRemove) < 1) {
        console.log(`Error: Tried to remove ${crownsToRemove} crowns but user only has ${crowns}!`);
        return;
    }

    crowns -= crownsToRemove;
    setCookie("crowns", crowns, 7);
    $(".crowns").text(crownSymbol + crowns.toString());
}

//Notifications

var notificationTimeout = 5000;

function notify(type,message){
  (()=>{
    let n = document.createElement("div");
    let id = Math.random().toString(36).substr(2,10);
    n.setAttribute("id",id);
    n.classList.add("notification",type);
    n.innerText = message;
    document.getElementById("notification-area").appendChild(n);
    setTimeout(()=>{
      var notifications = document.getElementById("notification-area").getElementsByClassName("notification");
      for(let i=0;i<notifications.length;i++){
        if(notifications[i].getAttribute("id") == id){
          notifications[i].remove();
          break;
        }
      }
    }, notificationTimeout);
  })();
}

//Experience and Levels

//Experience and Levels
var baseXP;
var XPExponent;
var xpToNextLevel;
var level, experience;


async function loadLevels(loadFrom) {
    baseXP = 10;
    XPExponent = 1.5;
    experience = parseInt(getCookie("experience"));
    level = parseInt(getCookie("level"));
    console.log(`level: ${level}`);
    console.log(`baseXP: ${baseXP}`);
    console.log(`XPExponent: ${XPExponent}`);
    xpToNextLevel = Math.floor(baseXP * (level ^ XPExponent));
    $(".currentLevel").text(level);
    $('.experience-bar').css('width', (100*(experience/xpToNextLevel)) + "%");
}

// function reloadLevels() {

// }

function addXP(xpToAdd) {
    xpToNextLevel = Math.floor(baseXP * (level ^ XPExponent));
    experience += xpToAdd;
    if (experience >= xpToNextLevel) {
        level += 1;
        experience = 0;
        setCookie("experience", experience, 7);
        setCookie("level", level, 7);
        $(".currentLevel").text(level);
        xpToNextLevel = Math.floor(baseXP * (level ^ XPExponent));
        displayConfetti(5);
    }

    setCookie("experience", experience, 7);
    $('.experience-bar').css('width', (100*(experience/xpToNextLevel)) + "%");
    
}

//Confetti

var maxParticleCount = 150;
var particleSpeed = 2;
var startConfetti;
var stopConfetti;
var toggleConfetti;
var removeConfetti;
(function() {
    startConfetti = startConfettiInner;
    stopConfetti = stopConfettiInner;
    toggleConfetti = toggleConfettiInner;
    removeConfetti = removeConfettiInner;
    var colors = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"]
    var streamingConfetti = false;
    var animationTimer = null;
    var particles = [];
    var waveAngle = 0;
    function resetParticle(particle, width, height) {
        particle.color = colors[(Math.random() * colors.length) | 0];
        particle.x = Math.random() * width;
        particle.y = Math.random() * height - height;
        particle.diameter = Math.random() * 10 + 5;
        particle.tilt = Math.random() * 10 - 10;
        particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
        particle.tiltAngle = 0;
        return particle;
    }
    function startConfettiInner() {
        console.log("Started Confetti!");
        var width = window.innerWidth;
        var height = window.innerHeight;
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                return window.setTimeout(callback, 16.6666667);
            }
            ;
        }
        )();
        var canvas = document.getElementById("confetti-canvas");
        if (canvas === null) {
            canvas = document.createElement("canvas");
            canvas.setAttribute("id", "confetti-canvas");
            canvas.setAttribute("style", "display:block;z-index:999999;pointer-events:none");
            document.body.appendChild(canvas);
            canvas.width = width;
            canvas.height = height;
            window.addEventListener("resize", function() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }, true);
        }
        var context = canvas.getContext("2d");
        while (particles.length < maxParticleCount)
            particles.push(resetParticle({}, width, height));
        streamingConfetti = true;
        if (animationTimer === null) {
            (function runAnimation() {
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);
                if (particles.length === 0)
                    animationTimer = null;
                else {
                    updateParticles();
                    drawParticles(context);
                    animationTimer = requestAnimFrame(runAnimation);
                }
            }
            )();
        }
    }
    function stopConfettiInner() {
        console.log("Stopped Confetti!");
        streamingConfetti = false;
    }
    function removeConfettiInner() {
        stopConfetti();
        particles = [];
    }
    function toggleConfettiInner() {
        if (streamingConfetti)
            stopConfettiInner();
        else
            startConfettiInner();
    }
    function drawParticles(context) {
        var particle;
        var x;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            context.beginPath();
            context.lineWidth = particle.diameter;
            context.strokeStyle = particle.color;
            x = particle.x + particle.tilt;
            context.moveTo(x + particle.diameter / 2, particle.y);
            context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
            context.stroke();
        }
    }
    function updateParticles() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var particle;
        waveAngle += 0.01;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            if (!streamingConfetti && particle.y < -15)
                particle.y = height + 100;
            else {
                particle.tiltAngle += particle.tiltAngleIncrement;
                particle.x += Math.sin(waveAngle);
                particle.y += (Math.cos(waveAngle) + particle.diameter + particleSpeed) * 0.5;
                particle.tilt = Math.sin(particle.tiltAngle) * 15;
            }
            if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
                if (streamingConfetti && particles.length <= maxParticleCount)
                    resetParticle(particle, width, height);
                else {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }
    }
}
)();

function displayConfetti(seconds) {
    startConfetti();
    setTimeout(stopConfetti, (seconds * 1000));
}