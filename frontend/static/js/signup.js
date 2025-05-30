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
        return false;
    } else if (username == ""){
        document.getElementById("response").innerHTML = "Please enter a username.";
        return false;
    } else if (pword == ""){
        document.getElementById("response").innerHTML = "Please enter a password.";
        return false;
    }

    //checking password confirmation
    else if (pword != cpword){
        document.getElementById("response").innerHTML = "Passwords must match.";
        return false;
    }

    //check duplicates in db
    const res = await fetch("http://localhost:8000/dupCheck/" + username + "/" + email, {method: "GET"});
    const check = await res.json();
    
    //console.log(check);
    if (check[1]) {
        document.getElementById("response").innerHTML = "That email already has an account.";
        return false;
    } else if (check[0]) {
        document.getElementById("response").innerHTML = "That username has been taken. Please enter a new username.";
        return false;
    }


    //should hash password


    //send everything to database
    const upload = await fetch("http://localhost:8000/signUp/" + username + "/" + email + "/" + pword, {method: "POST"});
    const done = await upload.json();

    if (done){
        document.getElementById("response").innerHTML = "nice!";
        return true;
    }
    return false
}

