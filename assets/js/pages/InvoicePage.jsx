import React, {useEffect, useState} from "react";
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import InvoicesAPI from "../services/InvoicesAPI";
import Select from "../components/forms/Select";
import CustomersAPI from "../services/CustomersAPI";
import {toast} from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";


const InvoicePage = ({match, history}) => {

    const {id = "new"} = match.params;
    const [isEditing, setIsEditing] = useState(false);
    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    const fetchCustomers = async () => {
        try{
            const data =  await CustomersAPI.findAll();
            setCustomers(data)
            if(id === "new") {
                setInvoice({...invoice, customer: data[0].id})
            }
            setLoading(false);

        }catch (error) {
            toast.error("Cannot loading customers");
            history.replace('/invoices');
        }
    }

    const fetchInvoice = async (id) => {
        try{
            const {amount, customer, status} = await InvoicesAPI.find(id);
            setInvoice({amount, status, customer: customer.id});
            setLoading(false);
        }catch (error) {
            // TODO: Adding notification message!
            toast.error("Cannot loading invoice");
            history.replace('/invoices');
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if(id !== "new") {
            setIsEditing(true);
            fetchInvoice(id);
        }
    }, [id]);

    const handleChange = event => {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        setInvoice({...invoice, [name]: value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            if(isEditing){
                await InvoicesAPI.update(id, invoice);
                // TODO: Adding notification message!
                toast.success("Invoice has been updated successfully");
            }else{
                await InvoicesAPI.add(invoice);
                // TODO: Adding notification message!
                toast.success("Invoice has been added successfully");
                history.replace('/invoices');
            }
            setErrors({});
        }catch ({response}) {
            const {violations} = response.data;
            if(violations){
                const apiErrors = {};
                violations.map(v => {
                    apiErrors[v.propertyPath] = v.message;
                });
                setErrors(apiErrors);
            }
            toast.error("Your form has some errors !");
        }
    }

   return (
       <>
            <h1>{!isEditing ? "Create new invoice" : "Edit invoice"}</h1>
            <hr/>
           { loading && <FormContentLoader/> }
           {
               ! loading &&
               <form onSubmit={handleSubmit}>
                   <Field
                       name={"amount"}
                       label={"Amount"}
                       placeholder={"Example: 3400"}
                       value={invoice.amount}
                       onChange={handleChange}
                       type={'number'}
                       error={errors.amount}
                   />

                   <Select
                       onChange={handleChange}
                       value={invoice.customer}
                       name={"customer"}
                       error={errors.customer}
                       label={"Customer"}
                   >
                       {
                           customers.map(c => {
                               return (<option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)
                           })
                       }
                   </Select>

                   <Select
                       onChange={handleChange}
                       value={invoice.status}
                       name={"status"}
                       error={errors.status}
                       label={"Status"}
                   >
                       <option value={"SENT"}>SENT</option>
                       <option value={"PAID"}>PAID</option>
                       <option value={"CANCELLED"}>CANCELLED</option>
                   </Select>

                   <div className={'form-group mt-3'}>
                       <button type="submit" className="btn btn-primary">{!isEditing ? "Create" : "Edit"}</button>
                       <Link to={"/invoices"} className={"btn btn-link"} >Return to invoices list</Link>
                   </div>
               </form>
           }

       </>
   );
}

export default InvoicePage;