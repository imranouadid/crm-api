import React, {useEffect, useState} from "react";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/InvoicesAPI";
import moment from "moment";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const STATUS_CLASS = {
    PAID: "success",
    CANCELLED: "danger",
    SENT: "primary"
}

const InvoicesPage = () => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Get invoices list
    const fetchInvoices = async () => {
        try {
            const data =  await InvoicesAPI.findAll();
            setInvoices(data);
            setLoading(false);
        } catch (error) {
            toast.error("Errors during fetching invoices !");
        }
    }

    // On loading the page we fetch list of invoices
    useEffect(() => {
        fetchInvoices();
        }, [])

    // Format date
    const formatDate = (str) => {
        return  moment(str).format("YYYY-MM-DD");
    }

    // Delete invoice by ID
    const handleDelete = async id => {
        const originalCustomers = [...invoices];

        // optimistic approach
        setInvoices(invoices.filter(invoice => invoice.id !== id))

        // pessimistic approach
        try{
            await InvoicesAPI.delete(id);
            toast.success("Invoice has been deleted successfully !");
        }catch (error){
            setInvoices(originalCustomers);
            toast.error("Something went wrong !");
        }
    }

    const handleSearch = (event) => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    }

    const handlePageChange = page => setCurrentPage(page);

    const itemsPerPage = 10;
    const filteredInvoices = invoices.filter(invoice =>
        invoice.amount.toString().startsWith(search.toLowerCase()) ||
        invoice.status.toLowerCase().includes(search.toLowerCase()) ||
        invoice.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        invoice.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        (invoice.customer.firstName +" "+ invoice.customer.lastName).toLowerCase().includes(search.toLowerCase())
    );
    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);


    return (
        <>
            <div className={"d-flex justify-content-between align-items-center mb-3"}>
                <h1>Invoices list</h1>
                <Link className={"btn btn-sm btn-primary"} to={"/invoices/new"}>New invoice</Link>
            </div>
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
                        <th scope="col" className={'text-center'}>Sent at</th>
                        <th scope="col" className={'text-center'}>Status</th>
                        <th scope="col" className={'text-center'}>Amount</th>
                        <th/>
                    </tr>
                </thead>
                {
                    !loading &&  <tbody>
                    {
                        paginatedInvoices.map(invoice =>
                            <tr className="table" key={invoice.id}>
                                <th scope="row">{invoice.id}</th>
                                <td>
                                    <Link to={"/customers/" + invoice.customer.id}>
                                        {invoice.customer.firstName} {invoice.customer.lastName}
                                    </Link>
                                </td>
                                <td className={'text-center'}>{formatDate(invoice.sentAt)}</td>
                                <td className={'text-center'}>
                                <span className={"badge rounded-pill bg-"+ STATUS_CLASS[invoice.status]}>
                                    {invoice.status}
                                </span>
                                </td>
                                <td className={'text-center'}>{invoice.amount.toLocaleString()} €</td>
                                <td>
                                    <Link className={'btn btn-sm btn-secondary'}
                                          to={'invoices/'+ invoice.id}
                                    >
                                        Edit
                                    </Link>
                                    <button className={'btn btn-sm btn-danger'}
                                            onClick={() => handleDelete(invoice.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )
                    }

                    </tbody>
                }

            </table>
            { loading && <TableLoader/> }
            {
                filteredInvoices.length > itemsPerPage &&
                <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredInvoices.length}
                    onPageChanged={handlePageChange}
                />
            }


        </>

    );

}


export default InvoicesPage;