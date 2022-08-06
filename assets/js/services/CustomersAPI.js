import axios from "axios";


function find(id){
    return axios
                .get("https://127.0.0.1:8000/api/customers/" + id)
                .then(response => response.data);
}

function update(id, customer){
    return axios
                .put("https://127.0.0.1:8000/api/customers/" + id, customer);
}

function add(customer){
    return axios.post("https://127.0.0.1:8000/api/customers", customer);
}

function findAll(){
    return  axios
                 .get("https://127.0.0.1:8000/api/customers")
                 .then(response => response.data['hydra:member']);
}

function deleteCustomer(id){
    return axios
                .delete("https://127.0.0.1:8000/api/customers/" + id);
}

export default {
    add,
    find,
    update,
    findAll,
    delete: deleteCustomer
}