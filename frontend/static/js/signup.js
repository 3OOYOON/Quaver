

function signUp(){ 
    var email = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var pword = document.getElementById("pword").value;
    var cpword = document.getElementById("cpword").value;   

    //checking for input
    if (email == ""){
        document.getElementById("response").innerHTML = "Please enter your email.";
        return false;
    } else if (username == ""){
        document.getElementById("response").innerHTML = "Please enter a username.";
        return false;
    } else if (pword == ""){
        document.getElementById("response").innerHTML = "Please enter a password.";
        return false;
    } else if (cpword == ""){
        document.getElementById("response").innerHTML = "Please confirm your password.";
        return false;
    }

    //checking password confirmation
    else if (pword != cpword){
        document.getElementById("response").innerHTML = "Passwords must match.";
        return false;
    }

    //check if email or username already in database

    //hash password

    //send everything to database
    document.getElementById("response").innerHTML = "nice!";
    return true;
}

