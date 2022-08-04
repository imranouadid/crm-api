import axios from "axios";
import jwtDecode from "jwt-decode";

function authenticate(credentials){
   return  axios
        .post("https://127.0.0.1:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            // Save the returned token to local storage
            window.localStorage.setItem("authToken", token);
            // set authorization token on headers for next requests
            setAxiosToken(token);
        });
}

function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers['Authorization'] ;
}

function setAxiosToken(token){
    // set authorization token on headers for next requests
    axios.defaults.headers['Authorization'] = "Bearer " + token;
}

function isAuthenticated(){

    // Retrieve the token from local storage of browser.
    const token =  window.localStorage.getItem("authToken");
    // Check the token if exists.
    if(token){
        const jwtData = jwtDecode(token);
        // Check if the token is still valid.
        if(jwtData.exp * 1000 >= new Date().getTime()){
            return true;
        }
    }

    return false;
}

function setup(){
    // Retrieve the token from local storage of browser.
    const token =  window.localStorage.getItem("authToken");
    // Check the token if exists.
    if(token){
        const jwtData = jwtDecode(token);
        // Check if the token is still valid.
        if(jwtData.exp * 1000 >= new Date().getTime()){
            setAxiosToken(token);
        }
    }
}


export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
}