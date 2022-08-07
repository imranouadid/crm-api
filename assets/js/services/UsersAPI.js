import axios from "axios";
import {USERS_API} from "../config";

function add(user){
    return axios
                .post(USERS_API, user);
}


export default {
    add,
}