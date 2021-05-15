var userUid, userData;

firebase.auth().onAuthStateChanged(user => {
    if (user) {
    //console.log("User UID" + user.uid);
    firebase.database().ref('users/' + user.uid).once("value", snap => {
        //console.log("UID" + user.uid);
        //console.log("Values", snap.val());
        //console.log("Snap Val: ", snap.val());
        userData = snap.val();
        userUid = user.uid;
        //console.log("User Val: ", userData);
        textReplace(userData);
        console.log("Running LoadCards!");
        loadCards(userData);
    })
    }
})

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
async function loadCards() {
    console.log("Ran loadCards!");

    var cards = [];
    if (userUid === undefined) {
        //console.log("Not yet loaded");
        return;
    }
    console.log("Just started cards is:");
    console.log(cards);
    console.log("Load Cards User UID" + userUid);
    cards = [];
    console.log(firebase.database().ref('users/' + userUid + '/cards').once("child_added"));
    await firebase.database().ref('users/' + userUid + '/cards').once("child_added", snap => {
        console.log("snapVal: ", snap.val());
        //console.log("Card ID", snap.val()["id"]);
        //console.log("Card Quantity", snap.val()["quantity"]);
        //if (snap.val()["quantity"] >= 1) {
            // console.log(snap.val()["id"]);
            // console.log(snap.val()["quantity"]);
            console.log("Just pushed card with id: ");
            console.log(snap.val()["id"]);
            console.log("and quantity:");
            console.log(snap.val()["quantity"])
            cards.push([snap.val()["id"], snap.val().quantity]);
            console.log("Just pushed cards now equals: ");
            console.log(cards);
            
        //}
        
        //user = snap.val();
    })
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
    for (var ii of cards) {
        // console.log("----------------------------------------------------");
        // console.log("Start of Card Formatting Sequence");
        // console.log("Cards Length: ", cards.length);
        // console.log("ii: ", ii);
        // console.log("Cards Array: ");
        // console.log(cards);
        // console.log("Id of Card to get: ", ii[0]);
        await firebase.database().ref('cards/' + ii[0]).once("value", snap => {
        console.log("----------------------------------------------------");
        console.log("Card Image", snap.val()["image"]);
        console.log("Card Name", snap.val()["name"]);
        console.log("Card Description", snap.val()["description"]);
        console.log("Card Quantity", ii[1]);
        console.log("Card Tier", snap.val()["tier"]);
        console.log("Card Type", snap.val()["type"]);
        // // Name, Description, Quantity, Tier, Type
        console.log("----------------------------------------------------");
        // console.log("cards[0][1]" + cards[0][1]);
        // console.log("cards[0][1]" + cards[1][1]);
        console.log("ii = " + ii);
        console.log("ii[1] = " + ii[1]);
        //console.log([snap.val()["name"], snap.val()["description"], ii[1], snap.val()["tier"], snap.val()["type"]);
        cards[iiP] = [snap.val()["image"], snap.val()["name"], snap.val()["description"], ii[1], snap.val()["tier"], snap.val()["type"]];
        iiP++;
        //console.log("Set cards[", ii, "] to ", ii[0]);

        //cards.push([snap.val()["id"], snap.val()["quantity"]]);
        
        //user = snap.val();
        })
}

console.log("Reformatted Cards: ", cards);
var cCard = 0;
var cardsWK = Array(cards.length).fill().map(function (c) {

    var image = cards[cCard][0];
    var name = cards[cCard][1];
    var description = cards[cCard][2];
    var quantity = cards[cCard][3];
    var tier = cards[cCard][4];
    var type = cards[cCard][5];
 
    console.log("Bob:");
    console.log({
        image,
        name,
        description,
        quantity,
        tier,
        type
    });
    cCard++;

    return {
        image,
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

function textReplace(user) {
    //console.log(user.level);
    $('.stats').find('span.level').text("Level: " + user.level);
    $('.stats').find('span.experience').text("Experience: " + user.experience);
}