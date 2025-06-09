const bcrypt = require('bcrypt');
const saltRounds = 10;


async function signUp() {
    //get info from html
    var email = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var pword = document.getElementById("pword").value;
    var cpword = document.getElementById("cpword").value;
    const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 

    //checking for input
    if (!emailFormat.test(email)){
        document.getElementById("response").innerHTML = "Please enter a valid email";
        return 0;
    } else if (username == ""){
        document.getElementById("response").innerHTML = "Please enter a username.";
        return 0;
    } else if (pword == ""){
        document.getElementById("response").innerHTML = "Please enter a password.";
        return 0;
    }

    //checking password confirmation
    else if (pword != cpword){
        document.getElementById("response").innerHTML = "Passwords must match.";
        return 0;
    }

    //check duplicates in db
    const res = await fetch(`http://localhost:8000/dupCheck/${username}/${email}`, {method: "GET"});
    const check = await res.json();
    
    if (check[1]) {
        document.getElementById("response").innerHTML = "That email already has an account.";
        return 0;
    } else if (check[0]) {
        document.getElementById("response").innerHTML = "That username has been taken. Please enter a new username.";
        return 0;
    }


    //should hash password

    //send everything to database
    const upload = await fetch("http://localhost:8000/signUp/" + username + "/" + email + "/" + pword, {method: "POST"});
    const done = await upload.json();

    // //returns userid
    // if (user){
    //     document.getElementById("response").innerHTML = "nice!";
    //     return user;
    // }

    if (done){
        document.getElementById("response").innerHTML = "nice!";
        return true;
    }
    
    document.getElementById("response").innerHTML = "Something went wrong :(";
    return false;
}

