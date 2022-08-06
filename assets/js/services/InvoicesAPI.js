import axios from "axios";

function find(id){
    return axios
                .get("https://127.0.0.1:8000/api/invoices/" + id)
                .then(response => response.data);
}

function update(id, invoice){
    return axios
                .put("https://127.0.0.1:8000/api/invoices/" + id,
            {...invoice, customer: `/api/customers/${invoice.customer}`});
}

function add(invoice){
    return axios
                .post("https://127.0.0.1:8000/api/invoices",
            {...invoice, customer: `/api/customers/${invoice.customer}`});
}

function findAll(){
    return  axios.get("https://127.0.0.1:8000/api/invoices")
                 .then(response => response.data['hydra:member']);
}

function deleteInvoice(id){
    return axios.delete("https://127.0.0.1:8000/api/invoices/" + id);
}

export default {
    find,
    update,
    add,
    findAll,
    delete: deleteInvoice
}