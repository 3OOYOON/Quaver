document.cookie = "user=0; path=/";

export async function getUser(){
    let name = "user=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++){
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0){
            return c.substring(name.length, c.length)
        }
    }
    return "";
}

export async function setUser(id){
    document.cookie = "user=" + id + "; path=/";
    
    const res = await getUser();
    console.log(res);
    return res;
}