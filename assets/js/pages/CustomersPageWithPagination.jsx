import React, {useEffect, useState} from "react";
import axios from "axios";
import Pagination from "../components/Pagination";


const CustomersPageWithPagination = (props) => {

    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        axios.get(`https://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
             .then(response => {
                 setCustomers(response.data['hydra:member']);
                 setTotalItems(response.data['hydra:totalItems']);
                 setLoading(false);
             })
             .catch(error => console.log(error.response))
        ;
    }, [currentPage])

    const handleDelete = id => {
        const originalCustomers = [...customers];

        // optimistic approach
        setCustomers(customers.filter(customer => customer.id !== id))

        // pessimistic approach
        axios.delete("https://127.0.0.1:8000/api/customers/" + id)
             .then(response => console.log("OK"))
             .catch(error => {
                    setCustomers(originalCustomers);
                    console.log(error.response);
                 }
             );
    }

    const handlePageChange = page => {
        setCurrentPage(page);
        setLoading(true);
    }
    // const paginatedCustomers = Pagination.getData(customers, currentPage, itemsPerPage);

    return (
        <>
            <h1>Customers page (pagination)</h1>
            <hr/>
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
                { loading && (<tr><td colSpan={7}>Chargement</td></tr>) }
                { ! loading &&
                    customers.map(customer =>
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

            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={totalItems}
                onPageChanged={handlePageChange}
            />

        </>

    );

}


export default CustomersPageWithPagination;