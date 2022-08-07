import '../styles/app.css';
import React, {useState} from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import {HashRouter, Route, Switch, withRouter} from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/AuthAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoot";
import CustomerPage from "./pages/CustomerPage";
import InvoicePage from "./pages/InvoicePage";
import RegisterPage from "./pages/RegisterPage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

AuthAPI.setup();

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());
    const NavbarWithRouter = withRouter(Navbar);

    return (
        <AuthContext.Provider value={ {isAuthenticated, setIsAuthenticated} }>
            <HashRouter>
                <NavbarWithRouter/>
                <main className={'container pt-5'}>
                    <Switch>
                        <Route component={LoginPage}  path={'/login'} />
                        <Route component={RegisterPage}  path={'/register'} />
                        <PrivateRoute component={CustomerPage} path={'/customers/:id'}/>
                        <PrivateRoute component={CustomersPage} path={'/customers'}/>
                        <PrivateRoute component={InvoicePage} path={'/invoices/:id'}/>
                        <PrivateRoute component={InvoicesPage} path={'/invoices'} />
                        <Route component={HomePage} path={'/'} />
                    </Switch>
                </main>
            </HashRouter>
            <ToastContainer position="bottom-right" />
        </AuthContext.Provider>
    );
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement)

