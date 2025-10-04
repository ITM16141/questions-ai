export function saveToken(token: string){
    console.log(`saveToken(): ${token}`);
    localStorage.setItem("token", token);
}

export function getToken(){
    console.log(`getToken(): ${localStorage.getItem("token")}`);
    return localStorage.getItem("token");
}

export function removeToken(){
    console.log(`removeToken(): ${localStorage.getItem("token")}`);
    localStorage.removeItem("token");
}