async function logIn() {
  //get info from html
  var email = document.getElementById("email").value;
  var pword = document.getElementById("pword").value;
  const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 

  //checking for input
  if (!emailFormat.test(email)){
      document.getElementById("response").innerHTML = "Please enter a valid email";
      return false;
  }  else if (pword == ""){
      document.getElementById("response").innerHTML = "Please enter a password.";
      return false;
  }

  const res = await fetch(`http://localhost:5219/logIn/${email}/${pword}`, {method: "GET"});
  const check = await res.json();
  
  console.log(check);
  if (!check[0]) {
    document.getElementById("response").innerHTML = "There is no account associated with that email. Please create an account before signing in.";
    return false;
  } else if (!check[1]) {
    document.getElementById("response").innerHTML = "Password incorrect. Please try again."
    return false;
  }

  document.getElementById("response").innerHTML = "Login is valid."
  return true;
}
