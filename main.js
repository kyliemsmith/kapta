/*-----------------------------------------------------------
TODO:


Add a sort button that will sort the cards
array by card tier, element, alphabetically, and by quantity,
re-save it to cookies,
and then reload the cards. Remember to have it
re-sort the cards when loadCards() is called
or it'll get messed up when the sorting
property gets changed



--------------------------------------------------------------*/


//Authentication

cookieExpirationDays = 50;

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

function reloadAllJs(){
    var path = "all.js"
        , scripts = document.getElementsByTagName("script")
        , oldScript
        , newScript = document.createElement("script")
        ;

    for(var i = 0, s; s = scripts[i]; i++) {
        if (s.src.indexOf(path) !== -1) {
            oldScript = s;
            break;
        }
    }

    // adding random get parameter to prevent caching
    newScript.src = path + "?timestamp=" + (new Date()).getTime();
    oldScript.parentNode.replaceChild(newScript, oldScript);
}

const auth = firebase.auth();

 document.querySelector("#show-register").addEventListener("click", () => {
showRegistration();
});

function writeUserData(user) {
    firebase.database().ref('users/' + user.uid).set(user).catch(error => {
        console.log(error.message)
    });
}

async function createNewAccount(email, password) {
    try {
        const userAuth = (await firebase.auth().createUserWithEmailAndPassword(email, password)).user;
        var user = {
            cards : '[[\"3\",\"1\"]]',
            email : userAuth.email,
            experience : 0,
            level : 1,
            crowns: 0,
            uid : userAuth.uid,
            username : userAuth.uid
          }
        writeUserData(user)
        setCookie("cards", '[[\"3\",\"1\"]]', cookieExpirationDays);
        setCookie("level", 1, cookieExpirationDays);
        setCookie("experience", 0, cookieExpirationDays);
        setCookie("crowns", 0, cookieExpirationDays);
        setCookie("team", "", cookieExpirationDays);

    } catch (error) {
        console.log(error.message)
    }
}

const showRegistration = () => {
document.querySelector("#registration-page").classList.remove("hide");
document.querySelector("#login-page").classList.add("hide");
document.querySelector("#homepage").classList.add("hide");
};

document.querySelector("#show-login").addEventListener("click", () => {
showLogin();
});

const showLogin = () => {
document.querySelector("#registration-page").classList.add("hide");
document.querySelector("#login-page").classList.remove("hide");
document.querySelector("#homepage").classList.add("hide");
};

document.querySelector("#signout").addEventListener("click", () => {
signOut();
});

const register = () => {
const email = document.querySelector("#registration-email").value;
const reemail = document.querySelector("#registration-reemail").value;
const password = document.querySelector("#registration-password").value;

if (email.trim() == "") {
    alert("Enter Email");
} else if (password.trim().length < 7) {
    alert("Password must be at least 7 characters");
} else if (email != reemail) {
    alert("Emails do not match");
} else {
    createNewAccount(email, password);
    // catch(function (error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     alert(errorMessage);
    //     // ...
    // });
}
};

document.querySelector("#register").addEventListener("click", () => {
register();
});

//register when you hit the enter key
document
.querySelector("#registration-password")
.addEventListener("keyup", (e) => {
    if (event.keyCode === 13) {
    e.preventDefault();

    register();
    }
});

const login = () => {
const email = document.querySelector("#login-email").value;
const password = document.querySelector("#login-password").value;

if (email.trim() == "") {
    alert("Enter Email");
} else if (password.trim() == "") {
    alert("Enter Password");
} else {
    authenticate(email, password);
}
};

document.querySelector("#login").addEventListener("click", () => {
login();
});

//sign in when you hit enter
document
.querySelector("#login-password")
.addEventListener("keyup", (e) => {
    if (event.keyCode === 13) {
    e.preventDefault();

    login();
    }
});

const authenticate = (email, password) => {
//const auth = firebase.auth();
auth.signInWithEmailAndPassword(email, password);
firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage);
    });
};

const showHomepage = () => {
  document.querySelector("#registration-page").classList.add("hide");
  document.querySelector("#login-page").classList.add("hide");
  document.querySelector("#homepage").classList.remove("hide");
};

const signOut = () => {
firebase
    .auth()
    .signOut()
    .then(function () {
    location.reload();
    })
    .catch(function (error) {
    alert("error signing out, check network connection");
    });
};

auth.onAuthStateChanged((firebaseUser) => {
if (firebaseUser) {
    showHomepage();
}
});

document
.querySelector("#forgot-password")
.addEventListener("click", () => {
    const email = document.querySelector("#login-email").value;
    if (email.trim() == "") {
    alert("Enter Email");
    } else {
    forgotPassword(email);
    }
});

const forgotPassword = (email) => {
auth
    .sendPasswordResetEmail(email)
    .then(function () {
    alert("Email sent");
    })
    .catch(function (error) {
    alert("Invalid email or bad network connection");
    });
};

//Loading

var userUid, userData;
var pageNumber = 1;
var cardsPerPage = 20;
var cards = [];
var maximumCardsLoaded = 20;

firebase.auth().onAuthStateChanged(user => {
    if (user) {
    //console.log("User UID" + user.uid);
    console.log("Loading...");
    document.getElementById("cardsOpen").click();
    if (getCookie("uid") != user.uid) {
        wipeLocalData();
        loadFromDatabase(true);
        setCookie("uid", user.uid, cookieExpirationDays);
    } else {
        if (getCookie("cards") != "" && getCookie("level") != "" && getCookie("experience") != "" && getCookie("crowns") != "") {
            loadCards("local");
            loadLevels("local");
            loadCrowns("local");
            loadTeam();
        } else {
            notify("error", "Couldn't find data in local storage; loading from database.")
            loadCards("database");
            loadLevels("database");
            loadCrowns("database");
            loadTeam();
        }
    
    }
}
});

async function loadFromDatabase(doOverride) {

    if (getCookie("loadedFromDatabaseRecently") == "" || doOverride) {
        userUid = await firebase.auth().currentUser.uid;
        await loadCards("database");
        await loadLevels("database");
        await loadCrowns("database");
        notify("success", "Successfully loaded from the database!");
        setCookie("loadedFromDatabaseRecently", "yes", 1);
    } else {
        notify("error", "You've loaded from the database too recently. Please wait 24 hours!");
    }
}

// (function ($) {

//     $.forData = function (index, data) {

//         var element = $("*").find(`[data-for='${index}']`);
//         var parent = element.parent();
//         var array = JSON.stringify(data);

//         if (!element.length)
//             return;

//         if (!index)
//             throw new Error("Invalid index as parameter");

//         if (!array)
//             throw new Error("Invalid value in data-for");

//         if (array[0] != "[" || array[array.length - 1] != "]")
//             throw new Error("ForEach value is not an array");

//         array = eval(array);
//         const length = array.length;

//         for (let idx = 0; idx < length; idx++) {
//             const obj = array[idx];
//             const clone = element.clone();
//             if (Object(obj)) {

//                 Object.keys(obj).forEach(key => {
//                     const childAttr = `[data-each=${key}]`;
//                     const child = clone.find(childAttr);
//                     if (child) {
//                         child.empty();
//                         child.append(obj[key]);
//                     }

//                     if (key == "avatar") {
//                         const av = clone.find(`[data-avatar=${key}]`);
//                         const url = obj[key];
//                         av.css('background-image', `url('${url}')`);
//                     }
//                 })
//             }
//             clone.appendTo(parent);
//         }

//         element.remove();

//     }


// })(jQuery);

//Fix the code under this tomorrow or just remove it entirely!


// firebase.auth().onAuthStateChanged(function(user){
//     var userID = firebase.auth().currentUser.uid;
//     var rootRef = firebase.database().ref('users');
//     var newRoot = rootRef.child(userID).child('cards');
//     //console.log("userID for DF ", userID, "\nrootRef: ", rootRef, "\nnewRoot: ", newRoot);
//      newRoot.once('value', function(snapshot){
//          snapshot.forEach(function(childs){
//              var cards = childs.child('cards').val();
//              //console.log("Cards:", cards); 
 
//          });
//      });
//  });

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function randomFromSeed(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function loadCardData(cardID, quantity, getOnly) {
    var tierWeights = ["1", "10", "20", "40", "80", "160", "320", "640", "1280", "2560"];
    //var maxTier = tierWeights.length;
    var elements = ["fire", "water", "ice", "earth", "wind", "thunder", "light", "darkness"];
    var temperaments = ["passive", "neutral", "aggressive"];
    var tierDescriptions = ["very weak", "slightly weak", "weak", "average", "slightly above average", "above average", "strong", "very strong", "extremely strong", "godlike"];
    var description = "";
    var toPickFrom = [];
    cardID = parseInt(cardID);

    var randomNumber = randomFromSeed(cardID);

    var description = "";

    //Results from checking seed (CardID)

    var name = "";
    var tier = "";
    var element = "";

    //Pick name

    const characters = "abcdefghijklmnopqrstuvwxyz";
    var length = 5;
    const minLength = 5;

    for (var l in randomNumber.toString().replace('0.', '').split('')) {
        l = parseInt(l);
        if (l >= minLength) {
            length = l;
            break
        }
    }
    var randomNumberPlaceholder = randomNumber;
    for (let i = 0; i < length; i++) {
      var randomNum = Math.floor(randomNumberPlaceholder * characters.length);
      name += characters[randomNum];
      randomNumberPlaceholder = randomFromSeed(randomNumberPlaceholder);
      
    }
    name = capitalize(name);

        //Add CardID to name to help with selection later on

        name += " - " + cardID;

    console.log(name);


    //Pick tier

    tierWeights = tierWeights.reverse();

    for (k in tierWeights) {
        for (j = 0; j < tierWeights[k]; j++) {
            toPickFrom.push((parseInt(k)+1).toString());
        }
    }
    console.log("randomNumber: " + randomNumber.toString());
    console.log(toPickFrom);
    tier = toPickFrom[Math.floor(randomNumber * toPickFrom.length)];
    console.log(tier);

    //Pick Element

    element = elements[Math.floor(randomNumber * elements.length)];

    //Pick Temperament

    temperament = temperaments[Math.floor(randomNumber * temperaments.length)];

    //Assemble Description

    description = `A ${tierDescriptions[tier]}, but ${temperament} creature with an affinity for ${element}.`;

    console.log(description);

    //Return Card Data
    if (getOnly == undefined) {
        return [name, description, quantity, tier, element]
    } else if (getOnly == "name") {
        return name.split(" -")[0];
    } else if (getOnly == "description") {
        return description;
    } else if (getOnly == "tier") {
        return tier
    } else if (getOnly == "element") {
        return element;
    } else {
        return [name, description, quantity, tier, element];
    }
    
}

async function loadCards(loadFrom) {
    console.log("Ran loadCards!");


    //Setting Card Template.
    if (cardTemplate == null) {
        cardTemplate = await $(".container").children();
    }

    //Deleting already drawn cards

    await $(".card").remove();

    if (loadFrom == "local" || (loadFrom != "local" && loadFrom != "database")) {
        cards = JSON.parse(getCookie("cards"));

    } else if (loadFrom == "database") {

    userUid = firebase.auth().currentUser.uid;

    cards = [];
    if (userUid === undefined) {
        //console.log("Not yet loaded");
        return;
    }
    console.log("Just started cards is:");
    console.log(cards);
    console.log("Load Cards User UID" + userUid);
    cards = [];
    //console.log(firebase.database().ref('users/' + userUid + '/cards').once("child_added"));
    await firebase.database().ref('users/' + userUid + '/cards').once("value", snap => {
        console.log("snapVal: ", snap.val());
        //console.log("IDs: ", Object.keys(snap.val()));
        //console.log("Quantities: ", );

        //console.log("Card ID", snap.val()["id"]);
        //console.log("Card Quantity", snap.val()["quantity"]);
        //if (snap.val()["quantity"] >= 1) {
            // console.log(snap.val()["id"]);
            // console.log(snap.val()["quantity"]);
            // console.log("Just pushed card with id: ");
            // console.log(snap.val()["id"]);
            // console.log("and quantity:");
            // console.log(snap.val()["quantity"])
            console.log("Entries: ");
            console.log(Object.entries(snap.val()));
            cards = JSON.parse(snap.val());
            setCookie("cards", snap.val(), cookieExpirationDays);
            console.log("Just pushed cards now equals: ");
            console.log(cards);
            
        //}
        
        //user = snap.val();
    })
}
    //console.log("s" + cards);
    //console.log("UCC: " + cards)
    //console.log("UCC Length: " + cards.length)
    //Uncomment for UCC(NS) Data
    // for (var i in cards) {
    //     //console.log("UCCS ID: " + cards[i][0])
    //     //console.log("UCCS #: " + cards[i][1])
    //console.log(cards);
console.log("--------------------------")
    // }
    console.log(cards);
    //return;
    var iiP = 0;
    console.log("^");
    console.log("Cards Before Slice: ");
    console.log(cards);
    console.log("Cards After Slice: ");
    console.log(cards);
    console.log(`Slice Bounds: (${(pageNumber * cardsPerPage) - cardsPerPage}, ${pageNumber * cardsPerPage})`);

    cards = cards.slice((pageNumber * cardsPerPage) - cardsPerPage, pageNumber * cardsPerPage);
    for (var ii of cards) {
        // console.log("----------------------------------------------------");
        // console.log("Start of Card Formatting Sequence");
        // console.log("Cards Length: ", cards.length);
        // console.log("ii: ", ii);
        console.log("Cards Array: ");
        console.log(cards);
        // console.log("Id of Card to get: ", ii[0]);

        var cardData = loadCardData(ii[0], ii[1])
        console.log("ii[0]: ");
        console.log(ii[0]);
        // console.log("----------------------------------------------------");
        // console.log("Card Name", snap.val()["name"]);
        // console.log("Card Description", snap.val()["description"]);
        // console.log("Card Quantity", ii[1]);
        // console.log("Card Tier", snap.val()["tier"]);
        // console.log("Card Type", snap.val()["type"]);
        // // Name, Description, Quantity, Tier, Type
        console.log("----------------------------------------------------");
        // console.log("cards[0][1]" + cards[0][1]);
        // console.log("cards[0][1]" + cards[1][1]);
        console.log("ii = " + ii);
        console.log("ii[1] = " + ii[1]);
        //console.log([snap.val()["name"], snap.val()["description"], ii[1], snap.val()["tier"], snap.val()["type"]);
        cards[iiP] = loadCardData(ii[0], ii[1])
        iiP++;
        //console.log("Set cards[", ii, "] to ", ii[0]);

        //cards.push([snap.val()["id"], snap.val()["quantity"]]);
        
        //user = snap.val();
}

console.log("Reformatted Cards: ", cards);
var cCard = 0;
var cardsWK = Array(cards.length).fill().map(function (c) {

    var name = cards[cCard][0];
    var description = cards[cCard][1];
    var quantity = cards[cCard][2];
    var tier = cards[cCard][3];
    var type = cards[cCard][4];
 
    console.log("Bob:");
    console.log({
        name,
        description,
        quantity,
        tier,
        type
    });
    cCard++;

    return {
        name,
        description,
        quantity,
        tier,
        type
    }
});
console.log("cardsWK: ");
console.log(cardsWK);
console.log("cardsWK Length: ");
console.log(cardsWK.length);
forData('cardsWK', cardsWK);
addCheckboxes();

}
//     for (var i in cards) {
//         //console.log(i);
//     }
// }
//loadCards();
//-------------------------------------------------------------------------------------------------------

// function getUserData(uid) {
//     firebase.database().ref('users/' + uid).once("value", snap => {
//         //console.log(snap.val())
//         user = snap.val();
//     })
// }

var cardTemplate = null;

var types = {
    "fire": "🔥",
    "water": "💧",
    "ice": "🧊",
    "earth": "🌲",
    "wind": "💨",
    "thunder": "⚡",
    "light": "💡",
    "darkness": "⬛"
  };

var tierSymbol = "★";

(function ($) {

    forData = function (index, data) {
        console.log('card template in forData: ');
        console.log(cardTemplate);
        cardTemplate.appendTo(".container");
        console.log("forData func. running!");
        console.log("index: ");
        console.log(index);
        console.log("data: ");
        console.log(data);
        var element = $("*").find(`[data-for='cards']`); //var element = $("*").find(`[data-for='${index}']`);
        var parent = element.parent();
        var array = JSON.stringify(data);
        console.log("Elem. Length: ");
        console.log(element.length);

        if (!element.length)
            return;
        console.log("One1");
        if (!index)
            throw new Error("Invalid index as parameter");
        console.log("One2");
        if (!array)
            throw new Error("Invalid value in data-for");
        console.log("One3");
        if (array[0] != "[" || array[array.length - 1] != "]")
            throw new Error("ForEach value is not an array");
        console.log("One4");
        console.log("Two");
        array = eval(array);
        const length = array.length;
        console.log("Three");
        for (let idx = 0; idx < length; idx++) {
            const obj = array[idx];
            const clone = element.clone();
            console.log("Four");
            if (Object(obj)) {
                console.log("Five");
                Object.keys(obj).forEach(key => {
                    const childAttr = `[data-each=${key}]`;
                    console.log(`[data-each=${key}]`);
                    const child = clone.find(childAttr);
                    if (child) {
                        child.empty();
                        console.log("APPENDING BELOW VALUE TO CHILD:");
                        console.log(obj[key]);
                        if (key == "tier") {
                            console.log(tierSymbol.repeat([parseInt(obj[key])]));
                            child.append(tierSymbol.repeat([parseInt(obj[key])]));
                            console.log("Now displaying tier!");
                        }
                        else if (key == "quantity") {
                            child.append("x" + obj[key]);
                        }
                        else if (obj[key] in types) {
                            console.log(obj[key] + " is in types!");
                            console.log("Appending: " + types[obj[key]]);
                            child.append(types[obj[key]]);
                        } else {
                            console.log("Failed Checks: " + key);
                            child.append(obj[key]);

                        }
                        
                        
                    }

                    if (key == "image") {
                        const av = clone.find(`[data-avatar=${key}]`);
                        const url = obj[key];
                        av.css('background-image', `url('${url}')`);
                        console.log("Found and set BG Image!");
                    }
                })
            }
            clone.appendTo(parent);
        }

        element.remove();
        highlightSelectedCards();

    }
})(jQuery);

async function nextPage() {
    if ($(".card").length >= cardsPerPage && (((JSON.parse(getCookie("cards")).length / cardsPerPage) % 1) > 0)) {
        pageNumber += 1;
        console.log("Next page!");
        if (editingTeam) {
            await checkCardsInTeam();
            await loadCards();
            await showCardsInTeamOnPage();
            await highlightSelectedCards();
        } else {
            loadCards();
        }
    } else {
        notify("error", "Page doesn't exist!");
        console.log("Page doesn't exist!");
    }
};

async function previousPage() {
    if ((pageNumber - 1) > 0) {
        pageNumber -=1;
        console.log("Previous page!");
        if (editingTeam) {
            await checkCardsInTeam();
            await loadCards();
            await showCardsInTeamOnPage();
            await highlightSelectedCards();
        } else {
            loadCards();
        }
    } else {
        notify("error", "Page doesn't exist!");
        console.log("Page doesn't exist!");
    }
};

// function goToPage(pageNum) {
//     //TODO: Make this work when editing teams.
//     pageNumber = pageNum;
//     console.log(`Going to page: ${pageNum}`);
//     loadCards();
// }

//Card Operations

var selectedCardsWithTiers = [];
var uCWRHCF = {};
var hasCardResult = [];
var maximumCardsLoaded = 20;

toggleTools = function() {
    console.log("toggleTools function running!");
    $('.tool').each(function() {
        console.log("In E. F. ET");
        var et = $(this);
        et.toggle();
    })
}

async function deleteSelectedCardsButton() {
    if (editingTeam) {
        notify("error", "You can't delete cards while editing your team!");
        return;
    }

    if (confirm(`Are you sure you'd like to delete the selected card(s)?`)) {
        await deleteSelectedCards();
        await loadCards();
    }
}

async function deleteSelectedCards() {
    var selectedCardsWithTiers = [];
    if (selectedCardsWithTiers.length == 0) {
        selectedCardsWithTiers = getCheckboxes();
    }

    if (selectedCardsWithTiers.length == 0) {
        notify("error", "No cards were selected!");
        return;
    }
    console.log("------");
    console.log("Cycling through cards: ");
    for (var card of selectedCardsWithTiers) {
        console.log(selectedCardsWithTiers);
        console.log(card);
        console.log(card[0].split(" - ")[1]);
        console.log(card[2]);
        await deleteCard(card[0].split(" - ")[1]);
    }
    notify("info", `The selected cards have been deleted!`);
}

async function deleteCard(cardID) {
    console.log("-------------------------");
    console.log("deleteCard Function: ");
    //await firebase.database().ref('users/' + userUid + '/cards' + '/' + cardName);
    var cardsFromCookie = JSON.parse(getCookie("cards"));
    console.log("cards cookie: " + cardsFromCookie);
    console.log(`hasCard(cardID)[0]: ${JSON.stringify(hasCard(cardID))}`);
    hasCardResult = await hasCard(cardID);
    if (hasCardResult[0]) {
        console.log("bobefwweffewwwef");
        console.log(`User has card (${cardID}) deleting...`);
        cardsFromCookie.splice(hasCardResult[1], 1);
        console.log(`Setting cards Cookie to: ${cardsFromCookie}`);
        setCookie("cards", JSON.stringify(cardsFromCookie), cookieExpirationDays);
    } else if (!hasCardResult[0]){
        notify("error", `You don't have card ${cardID} and thus can't delete it!`);
        console.log(`User doesnt have card (${cardID}) to delete!`);
    }


    //setCookie("cards", [[1, 1]], 7);
    // await firebase.database().ref('users/' + userUid + '/cards/' + cardName).once("value", snap => {
    //     console.log("snapVal: ", snap.val());
    //     //console.log("Card ID", snap.val()["id"]);
    //     //console.log("Card Quantity", snap.val()["quantity"]);
    //     //if (snap.val()["quantity"] >= 1) {
    //         // console.log(snap.val()["id"]);
    //         // console.log(snap.val()["quantity"]);
    //         console.log(snap.val()["id"]);
    //         console.log(snap.val()["quantity"])
            
    //     //}
        
    //     //user = snap.val();
    // })
}



// }


async function getTierOfCard(cardID) {

    var toPickFrom = [];

    var randomNumber = randomFromSeed(cardID);

    var tierWeights = ["1", "10", "20", "40", "80", "160", "320", "640", "1280", "2560"];


    tierWeights = tierWeights.reverse();

    for (k in tierWeights) {
        for (j = 0; j < tierWeights[k]; j++) {
            toPickFrom.push((parseInt(k)+1).toString());
        }
    }

    console.log(toPickFrom);
    tier = toPickFrom[Math.floor(randomNumber * toPickFrom.length)];
    return tier;
}


async function addCard(cardID, quantity) {
    parseInt(quantity);

    if (quantity != NaN && quantity % 1 == 0 || quantity % -1 == 0) {
        console.log("Quantity successfully verified!");
    } else {
        return;
    }

    hasCardResult = await hasCard(cardID);

    var cookieData = JSON.parse(getCookie("cards"));

    console.log(`Cookie Data: ${cookieData}`);

    if (hasCardResult[0]) {
        var addCardIndex = null;

        for (n of cookieData) {
            if (n[0] == cardID) {
                addCardIndex = cookieData.indexOf(n);
                break;
            }
        }

        console.log("Card at addCardIndex: ");
        console.log(JSON.stringify(cookieData[addCardIndex]));
        console.log(`ACI[1] to add: `);
        console.log((parseInt(cookieData[addCardIndex][1]) + parseInt(quantity)).toString());
        cookieData[addCardIndex][1] = ([parseInt(cookieData[addCardIndex][1]) + parseInt(quantity)].toString());
        setCookie("cards", JSON.stringify(cookieData), cookieExpirationDays);
        
    } else {
        cookieData.push([cardID.toString(), quantity.toString()]);
        setCookie("cards", JSON.stringify(cookieData), cookieExpirationDays);
    }
}

async function hasCard(cardID, cardQuantity) {
    var cardsFromCookie = JSON.parse(getCookie("cards"));
    console.log("hasCard function: ------------------------");
    console.log("cards User Has: ");
    console.log(cardsFromCookie);
    console.log(`CardID: ${cardID}`);
    if (cardQuantity == undefined || cardQuantity == null || cardQuantity == NaN) {
        for (var m of cardsFromCookie) {
            console.log(`m: ${m}`)
            if (m[0] == cardID) {
                console.log("hasCard = true");
                return [true, cardsFromCookie.indexOf(m)];
            }
        }
        console.log("hasCard = false");
        return [false];
    } else {
        for (var m of cardsFromCookie) {
            if (m[0] == cardID && m[1] < cardQuantity) {
                console.log("hasCard = true");
                return [true, cardsFromCookie.indexOf(m)];
        }
        console.log("hasCard = false");
        return [false];
    }

}
}

function filterCardsForFusionByTier(cards, tier) {
    toReturn = [];
    for (card of cards) {
        if (card[1] == tier) {
            console.log("Pushing Below to toReturn Arr for fil. :");
            console.log(card);
            toReturn.push(card);
        }
    }
    return toReturn;
}

// async function sortCards() {
//     //&*
//     for (var i = 0; i < cards.length; i++) {

//     }
// }

var minXPReward = 1;
var maxXPReward = 10;
async function fuseSelectedCards() {
    if (editingTeam) {
        notify("error", "You can't fuse cards while editing your team!");
        return;
    }
    var selectedCardsWithTiers = [];
    if (selectedCardsWithTiers.length == 0) {
        selectedCardsWithTiers = getCheckboxes();
    }
    console.log(selectedCardsWithTiers);
    var tierToFuse = selectedCardsWithTiers[0][1];
    var cardsPerFuse = 2 + tierToFuse;
    if (selectedCardsWithTiers.length < cardsPerFuse) {
        return;
    }
    console.log("Tier to Fuse: ", tierToFuse);
    selectedCardsWithTiers = filterCardsForFusionByTier(selectedCardsWithTiers, tierToFuse);
    console.log("SCWT After Filter By Tier: ");
    console.log(selectedCardsWithTiers);
    //Remove unnecessary name info
    for (var l in selectedCardsWithTiers) {
        selectedCardsWithTiers[l][0] = selectedCardsWithTiers[l][0].split(" - ")[1]
    }
    console.log("SCWT After Removing Unnecessary Info From Names: ");
    console.log(selectedCardsWithTiers);

    // //Remember you can only fuse unique cards!
    // while ((selectedCardsWithTiers.length / cardsPerFuse) % 1 != 0) {
    //     selectedCardsWithTiers.pop();
    // }
    console.log("------");
    console.log("SCWT After Filter By Tier: ");
    console.log(selectedCardsWithTiers);
    console.log(tierToFuse);
    console.log("Cycling through cards: ");
    var fusesPossible = Math.floor(selectedCardsWithTiers.length / cardsPerFuse);
    console.log("Fuses Possible: ");
    console.log(fusesPossible);
    for (tf = 0; tf < fusesPossible; tf++) {
        console.log("TF: ");
        console.log(tf);
        console.log("CIF B1: ");
        console.log((tf*cardsPerFuse));
        console.log("CIF B2: ");
        console.log(((tf*cardsPerFuse)) + cardsPerFuse);
        console.log("SCWT: ");
        console.log(selectedCardsWithTiers);
        if (fusesPossible < 2) {
            cardsInFuse = selectedCardsWithTiers.slice(0, cardsPerFuse);
        } else {
            console.log("%%%");
            console.log(selectedCardsWithTiers.slice((tf*cardsPerFuse), ((tf*cardsPerFuse)) + cardsPerFuse));
            cardsInFuse = selectedCardsWithTiers.slice((tf*cardsPerFuse), ((tf*cardsPerFuse)) + cardsPerFuse);
            console.log(cardsInFuse);
        }

        for (var card of cardsInFuse) {
            console.log("card:");
            console.log(card);
            if (parseInt(card[2]) < 2) {
                //notify("info", `Deleting card ${card[0]}`);
                await deleteCard(card[0]);
            } else {
                await addCard(card[0], -1);
                //await firebase.database().ref('users/' + userUid + '/cards/' + card[0]).update(toUpdate[card[0]]);
            }
        }
        //await firebase.database().ref('users/' + userUid + '/cards/').update(toUpdate[card[0]]);
        //@@
        getRandomCardResult = await getRandomCard();

        tierOfRandomCard = await getTierOfCard(getRandomCardResult);

        while (tierOfRandomCard != (tierToFuse + 1)) {
            getRandomCardResult = await getRandomCard();
            tierOfRandomCard = await getTierOfCard(getRandomCardResult);
        }

        await addCard(getRandomCardResult, 1);
        loadCards();
        var XPReward = Math.round(Math.random() * maxXPReward);
        if (XPReward == 0) {
            XPReward = 1;
        }

        addXP(XPReward);
        notify("success", `You successfully fused Card ${getRandomCardResult}; +${XPReward} XP.`);
    }
    //await firebase.database().ref('users/' + userUid + '/cards' + '/' + cardName);
    //console.log('users/' + userUid + '/cards/' + cardName);
    //await firebase.database().ref('users/' + userUid + '/cards/' + cardName).remove();
    // await firebase.database().ref('users/' + userUid + '/cards/' + cardName).once("value", snap => {
    //     console.log("snapVal: ", snap.val());
    //     //console.log("Card ID", snap.val()["id"]);
    //     //console.log("Card Quantity", snap.val()["quantity"]);
    //     //if (snap.val()["quantity"] >= 1) {
    //         // console.log(snap.val()["id"]);
    //         // console.log(snap.val()["quantity"]);
    //         console.log(snap.val()["id"]);
    //         console.log(snap.val()["quantity"])
            
    //     //}
        
    //     //user = snap.val();
    // })
}

addCheckboxes = function() {
    $('.fSelector').each(function() {
        var checkbox = $(this);
        checkbox.attr('id', checkbox.parent().find('.name').text()); // Adding ID attribute
        console.log("Adding ID attribute: ");
        console.log(checkbox.parent().find('.name').text());
        //checkbox.after($("<label for='checkbox"+ checkbox.index() +"'>").text(checkbox.val())); // Adding label with for attribute
       });
       //$('.checkbox').parent().find('.name').text();
    };
    
    getCheckboxes = function() {
        selectedCardsWithTiers = [];
        $('input.fSelector:checkbox:checked').each(function() {
            var checkbox = $(this);
            //$('.checkbox:checkbox:checked').parent().attr('id')
            //console.log($(this).parent().attr('id'));
            //console.log(document.querySelector("body > div.container > div > div.right > div.over-card > div.tier").textContent.length);
            //console.log($(this).parent().parent().children().find("div").filter(".tier").text().length); //console.log($(this).parent().parent().children().last().children());
            console.log("Pushed Below to selectedCardsWithTiers: ")
            console.log([$(this).parent().attr('id'), $(this).parent().parent().children().find("div").filter(".tier").text().length]);
            console.log("This:");
            console.log(checkbox);
            selectedCardsWithTiers.push([$(this).parent().attr('id'), $(this).parent().parent().children().find("div").filter(".tier").text().length,  $(this).parent().parent().children().find("div").filter(".quantity").text().split("x")[1]])
            //checkbox.after($("<label for='checkbox"+ checkbox.index() +"'>").text(checkbox.val())); // Adding label with for attribute
           });
           //$('.checkbox').parent().find('.name').text();
           console.log("SCWT: ");
           console.log(selectedCardsWithTiers);
           return selectedCardsWithTiers;

        };
    //$('.fSelector:checkbox:checked').parent().attr('id')

async function getRandomCard() {
    var cardIDCap = 1000;
    return (Math.round(Math.random() * cardIDCap)).toString();
};

async function highlightSelectedCards() {
    $('input.fSelector').each(function() {
        if ($(this).is(":checked")) {
            $(this).parent().siblings(".cardOverlay").css("visibility", "visible");
        } else {
            $(this).parent().siblings(".cardOverlay").css("visibility", "hidden");
        }
    })
}

//Change reloadCards to reload the specific page the user has selected once you finish setting up the specific user pages
// async function reloadCards(reloadType, cardsToReload) {
//     if (reloadType == "selected") {
//         $('input.fSelector:checkbox:checked').each(function() {
//             firebase.database().ref('users/' + userUid + '/cards/' + $(this).parent().parent().find('.name').text()).orderByChild('id').limitToFirst(maximumCardsLoaded).once('value', snap => {
//                 console.log(snap);
//                 if (snap.val() == null || snap.val()['quantity'] <= 0) {
//                     console.log("Removing card div.");
//                     $(this).parent().parent().parent().remove();
//                 } else {
//                     console.log(snap.val()['quantity']);
//                     $(this).parent().parent().children().find("div").filter(".quantity").text(snap.val()['quantity']);
//                 }
//             })
//            });
//     } else {
//         for (card of cardsToReload) {
//             console.log("Reloading Card: " + card);
//             await firebase.database().ref('users/' + userUid + '/cards/' + card).orderByChild('id').limitToFirst(maximumCardsLoaded).once('value', snap => {
//                 console.log(snap);
//                 if (snap.val() == null) {
//                     //Delete 'card' card div
//                 } else {
//                     //Update 'card'card div's quantity to 'snap.val()['quantity']'
//                 }
//                 console.log(snap.val()['quantity']);
//                 snap.val()['quantity']
//             })
//         }
//     }
// }

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
var baseXP = 10;
var XPExponent = 1.5;
var xpToNextLevel;
var level, experience;


async function loadLevels(loadFrom) {

    if (loadFrom == "database") {
        userUid = await firebase.auth().currentUser.uid;
        await firebase.database().ref('users/' + userUid).once("value", snap => {
            console.log(snap.val());
            experience = parseInt(snap.val()["experience"]);
            level = parseInt(snap.val()["level"]);
        });

        setCookie("experience", experience, cookieExpirationDays);
        setCookie("level", level, cookieExpirationDays);

    } else {
        experience = parseInt(getCookie("experience"));
        level = parseInt(getCookie("level"));
    }

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
        setCookie("experience", experience, cookieExpirationDays);
        setCookie("level", level, cookieExpirationDays);
        $(".currentLevel").text(level);
        xpToNextLevel = Math.floor(baseXP * (level ^ XPExponent));
        displayConfetti(5);
    }

    setCookie("experience", experience, cookieExpirationDays);
    $('.experience-bar').css('width', (100*(experience/xpToNextLevel)) + "%");
    
}

//Saving to Database and Wiping Local Data

async function saveToDatabase() {

    if (getCookie("savedToDatabaseRecently") == "") {
        userUid = await firebase.auth().currentUser.uid;
        await firebase.database().ref('users/' + userUid + '/cards').set(getCookie("cards"));
        await firebase.database().ref('users/' + userUid + '/experience').set(getCookie("experience"));
        await firebase.database().ref('users/' + userUid + '/level').set(getCookie("level"));
        await firebase.database().ref('users/' + userUid + '/crowns').set(getCookie("crowns"));
        notify("success", "Successfully saved to database!");
        setCookie("savedToDatabaseRecently", "yes", 1);
    } else {
        notify("error", "You've saved to the database too recently. Please wait 24 hours!");
    }
}

async function wipeLocalData() {
    setCookie("cards", "", cookieExpirationDays);
    setCookie("experience", "", cookieExpirationDays);
    setCookie("level", "", cookieExpirationDays);
    setCookie("crowns", "", cookieExpirationDays);
    setCookie("team", "", cookieExpirationDays);
}

async function wipeDatabaseData() {
    await firebase.database().ref('users/' + userUid + '/cards').set('[[\"3\",\"1\"]]');
    await firebase.database().ref('users/' + userUid + '/experience').set(0);
    await firebase.database().ref('users/' + userUid + '/level').set(1);
    await firebase.database().ref('users/' + userUid + '/crowns').set(0);
}

async function wipeAllData(skipConfirmation) {
    if (!skipConfirmation) {
        if (confirm("Are you sure you'd like to wipe all of your data?")) {
            if (confirm("Are you absolutely sure you'd like to wipe all of your data?")) {
                if (confirm("This is your last warning, are you sure you'd like to wipe all of your data?")) {
                    setCookie("cards", `[[\"3\",\"1\"]]`, cookieExpirationDays);
                    setCookie("experience", "0", cookieExpirationDays);
                    setCookie("level", "1", cookieExpirationDays);
                    setCookie("crowns", "0", cookieExpirationDays);
                    setCookie("team", "", cookieExpirationDays);
                    await wipeDatabaseData();
                    signOut();
                }
            }
        }
    }
}

//Crowns

var crowns;

var crownSymbol = "👑 ";

async function loadCrowns(loadFrom) {
    if (loadFrom == "database") {
        userUid = await firebase.auth().currentUser.uid;
        await firebase.database().ref('users/' + userUid).once("value", snap => {
            console.log(snap.val());
            crowns = parseInt(snap.val()["crowns"]);
            setCookie("crowns", crowns, cookieExpirationDays);
        });
    } else {
        crowns = parseInt(getCookie("crowns"));
    }

    $(".crowns").text(crownSymbol + crowns.toString());
}

function addCrowns(crownsToAdd) {
    crowns += crownsToAdd;
    setCookie("crowns", crowns, cookieExpirationDays);
    $(".crowns").text(crownSymbol + crowns.toString());
}

async function removeCrowns(crownsToRemove) {
    allowDebt = true;

    if ((crowns - crownsToRemove) < 1) {
        if (allowDebt == true) {
            crowns -= crownsToRemove;
            setCookie("crowns", crowns, cookieExpirationDays);
            $(".crowns").text(crownSymbol + crowns.toString());

        } else {
            console.log(`Error: Tried to remove ${crownsToRemove} crowns but user only has ${crowns}!`);
            return;
        }
    }

    crowns -= crownsToRemove;
    setCookie("crowns", crowns, cookieExpirationDays);
    $(".crowns").text(crownSymbol + crowns.toString());
}

async function buyRandomCard(numberOfCardsToBuy) {
    randomCardCost = 100;
    confirmPurchase = true;
if (numberOfCardsToBuy <= 1)  {
    if (crowns >= randomCardCost) {
        if (!confirm || confirm(`Are you sure you'd like to buy a random card for ${randomCardCost} Crowns?`)) {
            getRandomCardResult = await getRandomCard();
            await removeCrowns(randomCardCost);
    
            await addCard(getRandomCardResult, 1);
        
            notify("success", `You bought card ${getRandomCardResult}`);
    
            await loadCards();
        }
    } else {
        notify("error", `You need ${randomCardCost - crowns} more crowns!`);
        return false;
    }
} else if (crowns >= randomCardCost*numberOfCardsToBuy && confirm(`Are you sure you'd like to buy ${numberOfCardsToBuy} random card(s) for ${randomCardCost*numberOfCardsToBuy} Crowns?`)) {
    for(var cardsBought = 0; cardsBought < numberOfCardsToBuy; cardsBought++) {
        getRandomCardResult = await getRandomCard();
        await removeCrowns(randomCardCost);
    
        await addCard(getRandomCardResult, 1);

        notify("success", `You bought card ${getRandomCardResult}`);
    }
    await loadCards();
}
}

document.getElementById("defaultOpen").click();

function openTab(evt, tabName) {
    //Clear game(s)
    hideGame();

    //Set gameList selected to 'None'
    $(".gameList").val("None");

    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
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

//Audio

numOfSongs = 7;
musicFileExtension = ".mp3";
musicPathBase = "music/";


console.log(`Music Params: ${numOfSongs}, ${musicPathBase}, ${musicFileExtension}`);

var music = new Audio(musicPathBase + (Math.ceil(Math.random() * (numOfSongs - 1))).toString() + musicFileExtension);

populateDropdownMenu();

music.addEventListener('ended', musicEnded);

function musicEnded() {
    console.log(`Music Params: ${numOfSongs}, ${musicPathBase}, ${musicFileExtension}`);
    music = new Audio(musicPathBase + (Math.ceil(Math.random() * (numOfSongs - 1))).toString() + musicFileExtension);

    console.log("Set music, now playing!");
    music.play();
}


function setMusic(musicID) {
    music.pause();
    if (parseInt(musicID) > numOfSongs) {
        console.log("musicID is greater than numOfSongs, setting to random song.");
        musicEnded();
    } else {
        music = new Audio(musicPathBase + musicID.toString() + musicFileExtension);
        music.play();
    }
    
}

function musicButton() {
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}

function musicLoopButton() {
    if (music.loop == false) {
      music.loop = true;
    } else {
      music.loop = false;
    }
  }

function populateDropdownMenu() {
    for (var musicID = 0; musicID < numOfSongs; musicID++) {
        $(".musicList").append($('<option></option>').val(musicID.toString()).html(musicID));
    }
}

function musicDropdownMenuChanged(musicThatChanged) {
    if (musicThatChanged != "None") {
        setMusic(musicThatChanged);
    } else {
        music.pause();
        // console.log("None was selected therefore not doing anything.");
    }
}

function getChangedItemFromDropdownMenu(sel) {
    return sel.options[sel.selectedIndex].value;
}

function showGame(gameName) {
    if (gameName != "None") {
        hideGame();
        $(".game").append($(`<script src="games/${gameName}.js" class="gameScript"></script>`));
        reloadP5JS();
    } else {
        hideGame();
        // console.log("None was selected therefore not doing anything.");
    }
}

function reloadP5JS() {
    p5.disableFriendlyErrors = true;
    new p5();
}

function hideGame() {
    new p5();
    remove();
    $(".gameScript").remove();
    $(".p5Canvas").remove();
}

function resizeGame(resizeValue) {
    resizeValue = resizeValue/100;
    console.log(`Resize Value: ${resizeValue}`);
    $(".p5Canvas").css("transform", `scale(${resizeValue})`);

}

//Navigation Bar

function updateMenu() {
    if (document.getElementById('responsive-menu').checked == true) {
      document.getElementById('menu').style.borderBottomRightRadius = '0';
      document.getElementById('menu').style.borderBottomLeftRadius = '0';
    }else{
      document.getElementById('menu').style.borderRadius = '10px';
    }
  }
  
//Battle

var baseHealth = 20;
var healthPerTier = 10;

var baseDamage = 5;
var damagePerTier = 10;
var maxRandomDamage = 10;

var playerHealth, enemyHealth, playerTier, enemyTier, playerHealthMax, enemyHealthMax = NaN;

var playerElement, enemyElement = "";

var maxTeamMembers = 3;

var team = [];

var teamPointer = [];

var currentTurn = "player";

var attackIntervalID = 0;

var alreadyBattling = false;

var elementDamageMultiplier = 1.25;

// Element:Anti-Element
var elementsDamage = {
"fire":"water",
"ice":"fire",
"thunder":"earth",
"light":"darkness",
"wind":"ice",
"water":"thunder",
"earth":"wind",
"darkness":"light",
}

async function startBattleButton() {
    teamFiltered = team.filter(isRested);
    teamPointer = team.filter(isRested);

    if (teamFiltered.length > 0) {
        startBattle(teamFiltered[0][0]);
    } else {
        notify("error", "You have no rested cards in your team!");
    }
}

async function startBattle(playerCard) {
    if (alreadyBattling) {
        notify("error", "You are already in a battle!");
        return;
    }

    alreadyBattling = true;
    playerCard = parseInt(playerCard);
    enemyCard = await getRandomCard();

    team[team.indexOf(teamPointer[0])][1] = false;
    await saveTeam();

    while ((parseInt(loadCardData(enemyCard, -1, "tier")) - parseInt(loadCardData(playerCard, -1, "tier")) > -3) < -2) {
        enemyCard = await getRandomCard();
    }

    playerTier = loadCardData(playerCard, -1, "tier");
    enemyTier = loadCardData(enemyCard, -1, "tier");

    playerElement = loadCardData(playerCard, -1, "element");
    enemyElement = loadCardData(enemyCard, -1, "element");

    playerHealthMax = await calculateHealth(playerTier);
    enemyHealthMax = await calculateHealth(enemyTier);

    playerHealth = playerHealthMax;
    enemyHealth = enemyHealthMax;

    await updateHealth();
    await updateElements();
    await updateTiers();
    await toggleBattleElements();
    attackIntervalID = setInterval(attack, 1500);

    // setTimeout(attack(), 1500);

}

function isRested(toCheck) {
    if (toCheck[1] == true) {
        return true;
    } else {
        return false;
    }
}

function isNotRested(toCheck) {
    if (toCheck[1] == false) {
        return true;
    } else {
        return false;
    }
}

async function changePlayerCard(toChangeTo) {
    playerCard = parseInt(toChangeTo);
    playerTier = loadCardData(playerCard, -1, "tier");
    playerElement = loadCardData(playerCard, -1, "element");
    playerHealthMax = await calculateHealth(playerTier);
    playerHealth = playerHealthMax;
    $('.healthBar#player').val(100*(playerHealth / playerHealthMax));
    $(".playerElement").text(types[playerElement]);
    $(".playerTier").text(tierSymbol.repeat(playerTier));
}

async function attack() {
    if (currentTurn == "player") {
        if (elementsDamage[enemyElement] == playerElement) {
            enemyHealth = enemyHealth - (elementDamageMultiplier * (baseDamage + (playerTier * damagePerTier)) - Math.round(Math.random() * maxRandomDamage));
        } else {
            enemyHealth = enemyHealth - (baseDamage + (playerTier * damagePerTier)) - Math.round(Math.random() * maxRandomDamage);
        }
        currentTurn = "enemy";
    } else {
        if (elementsDamage[playerElement] == enemyElement) {
            playerHealth = playerHealth - (elementDamageMultiplier * (baseDamage + (enemyTier * damagePerTier)) - Math.round(Math.random() * maxRandomDamage));
        } else {
            playerHealth = playerHealth - (baseDamage + (enemyTier * damagePerTier)) - Math.round(Math.random() * maxRandomDamage);
        }
        currentTurn = "player";
    }

    await updateHealth();

    if (playerHealth <= 0) {
        //player lost
        console.log("Player lost!");
        team[team.indexOf(teamPointer[0])][1] = false;
        teamPointer[0][1] = false;
        await saveTeam();
        populateHealMenu();
        teamPointer = team.filter(isRested);
        if (teamPointer.length > 0) {
            await changePlayerCard(teamPointer[0][0]);
        } else {
            await toggleBattleElements();
            console.log("Player has no rested cards in their team!");
            clearInterval(attackIntervalID);
            alreadyBattling = false;
        }
        
        // if(teamPointer.length > 0) {
        //     await startBattle(teamPointer[0]);
        // }
    }

    if (enemyHealth <= 0) {
        //player won
        await toggleBattleElements();
        alreadyBattling = false;
        clearInterval(attackIntervalID);
        console.log("Player won!");
        team[team.indexOf(teamPointer[0])][1] = false;
        teamPointer[0][1] = false;
        await saveTeam();
        teamPointer = team.filter(isRested);
        eTParsed = parseInt(enemyTier)
        pTParsed = parseInt(playerTier)
        //Change out enemy tier nad player tier below for eTparsed
        // then make sure rewards for winning the battle work as expected
        // and check to make sure your card edit system works when switching
        // pages! :)
        if (enemyTier > playerTier) {
            addCrowns(2 * (eTParsed - pTParsed) + 3);
            addXP(2 * (eTParsed - pTParsed) + 3);
            notify("success", `You earned ${2 * (eTParsed - pTParsed) + 3} crowns and ${2 * (eTParsed - pTParsed) + 3} XP!`);
        } else {
            addCrowns(2 * (pTParsed - eTParsed) + 3);
            addXP(2 * (pTParsed - eTParsed) + 3);
            notify("success", `You earned ${2 * (pTParsed - eTParsed) + 3} crowns and ${2 * (pTParsed - eTParsed) + 3} XP!`);
        }

        populateHealMenu();
    }

}

async function toggleBattleElements() {
    if ($(".battleStats").css("visibility") == "visible") {
        $(".battleStats").css("visibility", "hidden");
    } else {
        $(".battleStats").css("visibility", "visible");
    }
}

async function calculateHealth(tier) {
    tier = parseInt(tier);

    return baseHealth + (tier * healthPerTier);
}

async function updateHealth() {
    console.log(`Parameters: ${playerHealth, playerHealthMax}`);
    console.log(`Setting player healthbar to: ${100*(playerHealth / playerHealthMax)}`);
    console.log(`Setting enemy healthbar to: ${100*(enemyHealth / enemyHealthMax)}`);

    $('.healthBar#player').val(100*(playerHealth / playerHealthMax));
    $('.healthBar#enemy').val(100*(enemyHealth / enemyHealthMax));
}

async function updateElements() {
    $(".playerElement").text(types[playerElement]);
    $(".enemyElement").text(types[enemyElement]);
}

async function updateTiers() {
    $(".playerTier").text(tierSymbol.repeat(playerTier));
    $(".enemyTier").text(tierSymbol.repeat(enemyTier));
}

async function loadTeam() {
    if (getCookie("team") != "") {
        team = JSON.parse(getCookie("team"));
    } else {
        await populateHealMenu();
    }
}

async function saveTeam() {
    setCookie("team", JSON.stringify(team), cookieExpirationDays);
}

var editingTeam = false;

async function editTeamButton() {
    if (editingTeam) {
        $(".editTeam").css("color", "inherit");
        await doneEditingTeam();
        await highlightSelectedCards();
    } else if (!editingTeam) {
        $(".editTeam").css("color", "green");
        await editTeam();
        await highlightSelectedCards();
    }
}

async function editTeam() {
    editingTeam = true;
    await unselectAllCards();
    await showCardsInTeamOnPage();
    await checkCardsInTeam();

}

async function doneEditingTeam() {
    editingTeam = false;
    await checkCardsInTeam();
    await unselectAllCards();
    await saveTeam();
}



async function showCardsInTeamOnPage() {
    for (var i of team) {
        $(".name").each(function() {
            checkingCardID = $(this).text().split(" - ")[1];
                if (checkingCardID == i[0]) {
                    $(this).siblings(".fSelector").children("input.fSelector").prop("checked", true);
                }
        })
    }
}

async function checkCardsInTeam() {
    var checkingCardID = "";
    var cardsInTeamOnThisPage = [];

    for (var i of team) {
        $(".name").each(function() {
            checkingCardID = $(this).text().split(" - ")[1];
                if (checkingCardID == i[0]) {
                    cardsInTeamOnThisPage.push(checkingCardID);
                }
        })
    }
    console.log(`Cards in team on this page: ${cardsInTeamOnThisPage}`);
    for (var j of $('input.fSelector')) {
        checkingCardID = $(j).parent().siblings(".name").text().split(" - ")[1];
        if ($(j).prop("checked")) {
            console.log(checkingCardID);
            console.log(typeof checkingCardID);
            console.log(typeof cardsInTeamOnThisPage[0]);
            console.log(cardsInTeamOnThisPage.includes(checkingCardID));
            if (!cardsInTeamOnThisPage.includes(checkingCardID)) {
                if ((team.length + 1) <= maxTeamMembers) {
                    console.log(`Adding Card ${checkingCardID} to team!`);
                    team.push([checkingCardID, false]);
                } else {
                    notify("error", `You can only have up to ${maxTeamMembers} cards in your team!`);
                }

            }
        } else if ($(j).prop("checked") == false) {
            if (cardsInTeamOnThisPage.includes(checkingCardID)) {
                for (var l = 0; l < team.length; l++) {
                    if (team[l][0] == checkingCardID) {
                        console.log(`Removing Card ${checkingCardID}`);
                        team.splice(l, 1);
                    }
                }
            }
        }
    }
}

async function unselectAllCards() {
    $("input.fSelector").prop("checked", false);
}

async function selectAllCards() {
    $("input.fSelector").prop("checked", true);
}

var restCardPrice = 5;

async function populateHealMenu() {
    $('.restCardsList').find('option:not(:first)').remove();
    for (var i of team.filter(isNotRested)) {
        $(".restCardsList").append($('<option></option>').val(i[0]).html(loadCardData(i[0], -1, "name")));     
    }
}

async function restCard(cardID, refresh) {
    console.log(typeof cardID, " | ", cardID);
    if (crowns - restCardPrice > 0) {
        for (var i = 0; i < team.length; i++) {
            console.log(team[i][0]);
            if (team[i][0] == cardID) {
                if (team[i][1] == false) {
                    removeCrowns(restCardPrice);
                    team[i][1] = true;
                    notify("success", `Rested Card ${cardID} (${loadCardData(cardID, -1, "name")})`)
                    if (refresh) {
                        await populateHealMenu();
                        await saveTeam();
                    }
                } else {
                    notify("error", `Card ${cardID} is already rested!`);
                }
            }
        }
    } else {
        notify("error", "You don't have enough crowns to rest this card!");
    }

};

async function restAllCards() {
    for (var i of team.filter(isNotRested)) {
        restCard(i[0])
    }
    await populateHealMenu();
    await saveTeam();
};