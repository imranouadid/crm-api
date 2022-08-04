import React, {useEffect, useState} from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/CustomersAPI";

const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    // Get customers list
    const fetchCustomers = async () => {
        try {
            const data =  await CustomersAPI.findAll();
            setCustomers(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    // On loading the page we fetch list of customers
    useEffect(() => {
        fetchCustomers();
        }, [])

    // Delete customer by ID
    const handleDelete = async id => {
        const originalCustomers = [...customers];

        // optimistic approach
        setCustomers(customers.filter(customer => customer.id !== id))

        // pessimistic approach
        try{
            await CustomersAPI.delete(id);
        }catch (error){
            setCustomers(originalCustomers);
        }
    }

    const handleSearch = (event) => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    }

    const handlePageChange = page => setCurrentPage(page);

    const itemsPerPage = 10;
    const filtredCustomers = customers.filter(c =>
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(search.toLowerCase()) )
    );
    const paginatedCustomers = Pagination.getData(filtredCustomers, currentPage, itemsPerPage);


    return (
        <>
            <h1>Customers page</h1>
            <hr/>
            <div className={'form-group'}>
                <input
                    className={'form-control'}
                    type="text"
                    placeholder={'Search...'}
                    onChange={handleSearch}
                    value={search}
                />

            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Client</th>
                        <th scope="col">E-mail</th>
                        <th scope="col">Company</th>
                        <th scope="col" className={'text-center'}>Invoices</th>
                        <th scope="col" className={'text-center'}>Total amount</th>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                {
                    paginatedCustomers.map(customer =>
                        <tr className="table" key={customer.id}>
                            <th scope="row">{customer.id}</th>
                            <td>{customer.firstName} {customer.lastName}</td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className={'text-center'}>
                                <span className="badge rounded-pill bg-primary">{customer.invoices.length}</span>
                            </td>
                            <td className={'text-center'}>{customer.totalAmount.toLocaleString()} €</td>
                            <td>
                                <button className={'btn btn-sm btn-danger'}
                                        disabled={customer.invoices.length > 0}
                                        onClick={() => handleDelete(customer.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )
                }

                </tbody>
            </table>
            {
                filtredCustomers.length > itemsPerPage &&
                <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filtredCustomers.length}
                    onPageChanged={handlePageChange}
                />
            }


        </>

    );

}


export default CustomersPage;