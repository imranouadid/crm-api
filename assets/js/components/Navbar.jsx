import React, {useContext} from "react";
import AuthAPI from "../services/AuthAPI";
import {NavLink} from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import {toast} from "react-toastify";

const Navbar = ({history}) => {

    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

    const handleLogout = () => {
      AuthAPI.logout();
      setIsAuthenticated(false);
      toast.info("You are disconnected");
      history.push('/login');
    }

  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
              <NavLink className="navbar-brand" to="/">CRM-APP</NavLink>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01"
                      aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"/>
              </button>
              <div className="collapse navbar-collapse" id="navbarColor01">
                  <ul className="navbar-nav me-auto">
                      <li className="nav-item">
                          <NavLink className="nav-link" to="/customers">Customers</NavLink>
                      </li>
                      <li className="nav-item">
                          <NavLink className="nav-link" to="/invoices">Invoices</NavLink>
                      </li>
                  </ul>
                  <ul className="navbar-nav ml-auto">
                      {
                          ! isAuthenticated &&
                          <>
                              <li className="nav-item">
                                  <NavLink className="nav-link" to="/register">Subscribe</NavLink>
                              </li>

                              <li className="nav-item">
                                  <NavLink className="nav-link btn" to="/login">Connect</NavLink>
                              </li>
                          </> ||
                          <li className="nav-item">
                              <button className="nav-link btn" onClick={handleLogout}>Disconnect</button>
                          </li>
                      }

                  </ul>
              </div>
          </div>
      </nav>
  );
}

export default Navbar;