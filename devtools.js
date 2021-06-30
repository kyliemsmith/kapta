// async function addCardsToUser(cardsToAdd) {
//     await firebase.database().ref('cards/').orderByChild('id').limitToFirst(cardsToAdd).once('value', snap => {
//         for (var name in snap.val()) {
//             console.log(snap.val());
//             qocta = Math.floor(Math.random() * 20)
//             console.log(name + " - " + qocta);
//             addCard(name.toString(), qocta);
//         }
//          //This logs 'undefined' to the console.
//     })
// }