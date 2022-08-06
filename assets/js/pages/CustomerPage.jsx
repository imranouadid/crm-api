import React, {useEffect, useState} from "react";
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import {toast} from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

const CustomerPage = ({match, history}) => {

    const {id = "new"} = match.params;
    const [isEditing, setIsEditing] = useState(false);
    const [customer, setCustomer] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: ""
    });
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: ""
    });
    const [loading, setLoading] = useState(false);

    const fetchCustomer = async (id) => {
        try{
            const {firstName, lastName, email, company} = await CustomersAPI.find(id);
            setCustomer({firstName, lastName, email, company})
            setLoading(false);
        }catch (error) {
            // TODO: Adding notification message!
            toast.error("Error during load the customer !");
            history.replace('/customers');
        }
    }

    useEffect(() => {
        if(id !== "new") {
            setLoading(true);
            setIsEditing(true);
            fetchCustomer(id);
        }
    }, [id]);


    const handleChange = event => {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        setCustomer({...customer, [name]: value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            setErrors({});
            if(isEditing){
                await CustomersAPI.update(id, customer);
                // TODO: Adding notification message!
                toast.success("Customer has been updated successfully!");
            }else{
                await CustomersAPI.add(customer);
                // TODO: Adding notification message!
                toast.success("Customer has been added successfully!");
                history.replace('/customers');
            }
        }catch ({response}) {
            const {violations} = response.data;
            if(violations){
                const apiErrors = {};
                violations.map(v => {
                    apiErrors[v.propertyPath] = v.message;
                });
                setErrors(apiErrors);
            }
            // TODO: Adding notification message!
            toast.error("Something went wrong during this operation !");
        }
    }

   return (
       <>
            <h1>{!isEditing ? "Adding new customer" : "Edit customer"}</h1>
            <hr/>
           { loading && <FormContentLoader/> }
           {
               !loading &&
               <form onSubmit={handleSubmit}>
                   <Field
                       name={"firstName"}
                       label={"First name"}
                       placeholder={"Example: Wendel"}
                       value={customer.firstName}
                       onChange={handleChange}
                       error={errors.firstName}
                   />
                   <Field
                       name={"lastName"}
                       label={"Last name"}
                       placeholder={"Example: Santos"}
                       value={customer.lastName}
                       onChange={handleChange}
                       error={errors.lastName}
                   />
                   <Field
                       name={"email"}
                       label={"E-mail"}
                       type={"email"}
                       placeholder={"Example: example@mail.com"}
                       value={customer.email}
                       onChange={handleChange}
                       error={errors.email}
                   />
                   <Field
                       name={"company"}
                       label={"Company"}
                       placeholder={"Name of enterprise"}
                       value={customer.company}
                       onChange={handleChange}
                       error={errors.company}
                   />
                   <div className={'form-group mt-3'}>
                       <button type="submit" className="btn btn-primary">{!isEditing ? "Create" : "Edit"}</button>
                       <Link to={"/customers"} className={"btn btn-link"} >Return to customers list</Link>
                   </div>
               </form>
           }

       </>
   );

}


export default CustomerPage;