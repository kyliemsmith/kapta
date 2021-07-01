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
var baseXP = 10;
var XPExponent = 1.5;
var xpToNextLevel;
var level, experience;


async function loadLevels(loadFrom) {
    experience = parseInt(getCookie("experience"));
    level = parseInt(getCookie("level"));

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
    }

    setCookie("experience", experience, 7);
    $('.experience-bar').css('width', (100*(experience/xpToNextLevel)) + "%");
    
}