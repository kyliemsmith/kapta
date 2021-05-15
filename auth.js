//invokes firebase authentication. 

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
            cards : {
              Jwo : {
                quantity : 1,
                id : "Jwo"
              }
            },
            email : userAuth.email,
            experience : 0,
            level : 1,
            uid : userAuth.uid,
            username : userAuth.uid
          }
        writeUserData(user)

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
const auth = firebase.auth();
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